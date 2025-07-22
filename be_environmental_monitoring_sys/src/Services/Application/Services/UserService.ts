import { User } from './../../../../../fe_environmental_monitoring_sys/src/types/types';
import { Injectable } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { UserEntity } from "src/Services/Domain/Models/users.entity";
import { PayLoadCreateUserDto, PayLoadUpdateUserDto, UserDto } from "src/Services/Domain/Dtos/users.dto";
import { UserRepsitory } from "src/Services/Infrastructure/Repository/UserRepository";
import { ResultResponse } from "src/common/ResultResponse";
import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { Or } from "typeorm";
import e from 'express';
import * as argon2 from 'argon2';
import { Mapper } from "src/Services/Domain/Mapper/Mapper";

@Injectable()

export class UserService extends CoreServiceBase<UserEntity, UserDto> {
    constructor(
        private readonly userRepository: UserRepsitory
    ) {
        super(userRepository);
    }
    async getAllUsers(): Promise<ResultResponse> {
        const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
        try {
            const users = await this.userRepository.getAll();
            res.Data = users;
            res.Status = ErrorCode.SUCCESS;
            res.Message = "Xử lý thành công";
        } catch (error) {
            res.Status = ErrorCode.EXCEPTION;
            res.Message = error.message;
        }
        return res;
    }
    async createUser(payload: PayLoadCreateUserDto): Promise<ResultResponse> {
        const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
        try {
            const users = await this.userRepository.getAll();
    
            // Kiểm tra điều kiện
            const usernameExists = users.find(user => user.UserName === payload.UserName);
            if (usernameExists) {
                res.Status = ErrorCode.SAVE_FAIL;
                res.Message = "Tên người dùng đã tồn tại";
                return res;
            }
    
            const emailExists = users.find(user => user.Email === payload.Email);
            if (emailExists) {
                res.Status = ErrorCode.SAVE_FAIL;
                res.Message = "Email đã tồn tại";
                return res;
            }
    
            const phoneExists = users.find(user => user.Phone === payload.Phone);
            if (phoneExists) {
                res.Status = ErrorCode.SAVE_FAIL;
                res.Message = "Số điện thoại đã tồn tại";
                return res;
            }
            if (payload.PassWord) {
                payload.PassWord = await argon2.hash(payload.PassWord);
            }
    
            // Tạo người dùng mới
            const newUser = await this.userRepository.create(
                Mapper.mapDtoToEntity(payload, UserEntity)
            );
            res.Data = newUser;
            res.Status = ErrorCode.SUCCESS;
            res.Message = "Tạo thành công";
        } catch (error) {
            res.Status = ErrorCode.EXCEPTION;
            res.Message = error.message;
        }
        return res;
    }
    async updateUser(Id: number, payload: PayLoadUpdateUserDto): Promise<ResultResponse> {
        const res = new ResultResponse(ErrorCode.EXCEPTION, "", null);
        try {
            const user = await this.userRepository.getById(Id);
            if (!user) {
                res.Status = ErrorCode.NOT_FOUND_ID;
                res.Message = "Không tìm thấy người dùng";
                return res;
            }
    
            const users = await this.userRepository.getAll();
    
            const usernameExists = users.find(
                u => u.UserName === payload.UserName && u.Id !== Id
            );
            if (usernameExists) {
                res.Status = ErrorCode.SAVE_FAIL;
                res.Message = "Tên người dùng đã tồn tại";
                return res;
            }
    
            const emailExists = users.find(
                u => u.Email === payload.Email && u.Id !== Id
            );
            if (emailExists) {
                res.Status = ErrorCode.SAVE_FAIL;
                res.Message = "Email đã tồn tại";
                return res;
            }
    
            const phoneExists = users.find(
                u => u.Phone === payload.Phone && u.Id !== Id
            );
            if (phoneExists) {
                res.Status = ErrorCode.SAVE_FAIL;
                res.Message = "Số điện thoại đã tồn tại";
                return res;
            }
            
            if (payload.PassWord) {
                payload.PassWord = await argon2.hash(payload.PassWord);
            }

            await this.userRepository.update(
                { Id },
                Mapper.mapDtoToEntity(payload, UserEntity)
            );
    
            res.Status = ErrorCode.SUCCESS;
            res.Message = "Cập nhật thành công";
        } catch (error) {
            res.Status = ErrorCode.EXCEPTION;
            res.Message = error.message;
        }
        return res;
    }
}