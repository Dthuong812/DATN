import { Injectable } from "@nestjs/common";
import { BaoCaoDao } from "../Dao/BaoCaoDao";

@Injectable()
export class BaoCaoRepository {
    constructor(
        private readonly baoCaoDao: BaoCaoDao
    ) {
    }
    async getAllByObject(startTime: Date, endTime: Date, objectCode?: string,) {
        return await this.baoCaoDao.getAllByObject(startTime, endTime, objectCode);
      }
}