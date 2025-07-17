import { Catch,ExceptionFilter, ArgumentsHost,BadRequestException, HttpException, HttpStatus } from "@nestjs/common";
import { ResultResponse } from "./ResultResponse";
import { ErrorCode } from "./ErrorCode/EnumCode";
import { Request, Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter{
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus();
    const message = exception.getResponse();

    // Kiểm tra kiểu dữ liệu của message và xử lý
    let messageText = '';
    if (typeof message === 'string') {
     
      messageText = message; 
    } else if (Array.isArray(message)) {
      
      messageText = message[0];  // Nếu là mảng thì nối các phần tử lại
    } else if (typeof message === 'object') {
      const value=JSON.parse(JSON.stringify(message)).message;
      if(Array.isArray(value))
          messageText = value[0];
      else
          messageText=value;
    }
    const result = new ResultResponse(
      ErrorCode.VALID_IN_DTO,
      messageText,  // Trả về message đã được xử lý
      null,  // Dữ liệu có thể để null hoặc có thể là các thông tin khác liên quan
    );

    response.status(status).json(result);
  }
}

function isNumber(value: string): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value as any);
}
function isString(value: string): boolean {
  return /^[a-zA-Z]+$/.test(value); // kiểm tra chuỗi có phải là chữ cái
}
function isValidDate(value: string): boolean {
  const date = new Date(value);
  return !isNaN(date.getTime()); // Kiểm tra xem date có hợp lệ không
}
export function checkInputType(input: string): number {
  if (isValidDate(input)) {
    return 0;
  } else if (isNumber(input)) {
    return 1;
  } else isString(input);
  return 2;
}
export const exp_value = (exp: string): number => {
  const exp_time = exp.match(/^(\d+)m$/);
  if (exp_time) {
    return parseInt(exp_time[1], 10);
  }
  throw new Error('Invalid time string format. Expected format: "XXm"');
};
export function formatString(template: string, ...args: any[]): string {
  return template.replace(/{(\d+)}/g, (match, index) => {
    return typeof args[index] !== 'undefined' ? args[index] : match;
  });
}
export type SelectOption<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? (keyof U)[]
    : T[P] extends object
      ? (keyof T[P])[] | true
      : T[P] extends string | number | boolean
        ? true
        : never;
};
export type OrderDirection = 'ASC' | 'DESC';
export type OrderByField = {
  field: string;
  direction: OrderDirection;
};

export type OrderBy<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? (keyof U)[]
    : T[P] extends object
      ? OrderByField[]
      : OrderByField[];
};

export function convertDateStringToNumber(dateString: string): number {
  const numericString = dateString.replace(/[^0-9]/g, '');

  // Convert the string to a number
  return parseInt(numericString, 10);
}
export function getWeekStartAndEnd(date: Date): { startOfWeek: Date, endOfWeek: Date } {
  const currentDay = date.getDay(); // Chủ nhật = 0, Thứ Hai = 1, ..., Thứ Bảy = 6

  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
}
export function SubDay(date1: Date, date2: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diff / msPerDay);
}
export function SubDayReturnInt(dateStr1: string, dateStr2: string): number {
  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);

  const msPerDay = 1000 * 60 * 60 * 24;

  const diffInMs = date1.getTime() - date2.getTime();

  return Math.abs(Math.floor(diffInMs / msPerDay));
}
export function timeStringToSeconds(time: string): number {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

export function SubTime(start: string, end: string): number {
  const diffInSeconds = timeStringToSeconds(start) - timeStringToSeconds(end);
  return diffInSeconds / 3600;
}
//Tính thời gian hiện tại nằm trong khoảng 
export function isNowInTimeRange(startTime: string, endTime: string): boolean {
  const now = new Date();

  // Lấy ngày hiện tại và gán giờ bắt đầu, kết thúc
  const start = new Date(now);
  const [startH, startM, startS] = startTime.split(":").map(Number);
  start.setHours(startH, startM, startS, 0);

  const end = new Date(now);
  const [endH, endM, endS] = endTime.split(":").map(Number);
  end.setHours(endH, endM, endS, 0);

  return now >= start && now <= end;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

function rad2deg(rad: number): number {
  return rad * (180 / Math.PI);
}

export function TinhKhoangCach(ViDo1: number, KinhDo1: number, ViDo2: number, KinhDo2: number): number {
  const theta = KinhDo1 - KinhDo2;

  let miles = Math.sin(deg2rad(ViDo1)) * Math.sin(deg2rad(ViDo2)) +
              Math.cos(deg2rad(ViDo1)) * Math.cos(deg2rad(ViDo2)) * Math.cos(deg2rad(theta));

  miles = Math.acos(miles);
  miles = rad2deg(miles);
  miles = miles * 60 * 1.1515;

  const kilometers = miles * 1.609344;
  const meters = kilometers * 1000;

  return meters;
}
export function generatePassword(length: number = 16, options: {
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSpecialChars?: boolean;
} = {}): string {
  // Mặc định các tùy chọn
  const defaults = {
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecialChars: true,
    ...options,
  };

  // Các tập hợp ký tự
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  // Tạo tập hợp ký tự dựa trên tùy chọn
  let chars = '';
  if (defaults.includeUppercase) chars += uppercase;
  if (defaults.includeLowercase) chars += lowercase;
  if (defaults.includeNumbers) chars += numbers;
  if (defaults.includeSpecialChars) chars += specialChars;

  if (chars.length === 0) {
    throw new Error('At least one character set must be selected.');
  }

  // Sinh mật khẩu ngẫu nhiên
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
}
//Xử lý result phân quyền
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception.getResponse();

    // Lấy message từ exception
    let message = 'Lỗi không xác định';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse) {
      if ((exceptionResponse as any).statusCode === 403) {
        message = 'Bạn không có quyền truy cập chức năng này'; // ✅ Ghi đè thông báo 403 tại đây
      } else if ((exceptionResponse as any).message) {
        message = (exceptionResponse as any).message;
      }
    }

    const result = new ResultResponse(status*-1, message, null);
    response.status(status).json(result);
  }
}
