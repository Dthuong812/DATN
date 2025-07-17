import { formatString } from '../Util';
import { ErrorCode } from './EnumCode';
export class ErrorManage {
  public static errorMessage: Record<ErrorCode, string> = {
    //Xử lý thành công
    [ErrorCode.CHANGE_PASS_SUCCESS]: 'Đổi mật khẩu thành công',
    [ErrorCode.DELETE_SUCCESS]: 'Xóa thành công',
    [ErrorCode.EDIT_SUCCESS]: 'Sửa thành công',
    [ErrorCode.SUCCESS]: 'Xử lý thành công',
    [ErrorCode.SAVE_SUCCESS]: 'Lưu thành công',
    [ErrorCode.RESET_PASS_SUCCESS]: 'Reset mật khẩu thành công',
    [ErrorCode.VERIFY]: 'Xác minh thành công',

    //Xử lý thất bại, lỗi
    [ErrorCode.AGAIN_PASS_ERROR]: 'Mật khẩu nhập lại không trùng khớp',
    [ErrorCode.CHANGE_PASS_FAIL]: 'Đổi mật khẩu thất bại',
    [ErrorCode.DELETE_FAIL]: 'Xóa thất bại',
    [ErrorCode.EDIT_FAIL]: 'Sửa thất bại',
    [ErrorCode.EXCEPTION]: '',
    [ErrorCode.INVALID_INPUT]: 'Dữ liệu đầu vào không hợp lệ',
    [ErrorCode.NOT_DATA]: 'Không có dữ liệu',
    [ErrorCode.NOT_CHANGE_PASS]: 'Mật khẩu mới trùng với mật khẩu cũ',
    [ErrorCode.NOT_DTO]: 'Không có dữ liệu truyền vào',
    [ErrorCode.PASSWORD_SYSTEM]: 'Mật khẩu được hệ thống cấp, vui lòng đổi mật khẩu mới',
    [ErrorCode.PASSWORD_EXP]: 'Mật khẩu đã quá hạn, vui lòng đổi mật khẩu mới.',
    [ErrorCode.READ_ERROR]: 'Lỗi không đọc được dữ liệu',
    [ErrorCode.SAVE_FAIL]: 'Lưu thất bại',
    [ErrorCode.SERVICE_UNAVAILABLE]: 'Service không khả dụng',
    [ErrorCode.UNKNOWN_ERROR]: 'Lỗi không xác định',
    [ErrorCode.USER_NOT_FOUND]: 'Không tìm thấy người dùng',
    [ErrorCode.USER_ALREADY_EXISTS]: 'Người dùng không tồn tại',
    [ErrorCode.UNAUTHORIZED]: 'Không có quyền truy cập',
    [ErrorCode.WRONG_PASSWORD]: 'Mật khẩu không đúng',
    [ErrorCode.WRONG_USERNAME]: 'Tên đăng nhập không đúng',
    [ErrorCode.RESET_PASS_FAIL]: 'Reset mật khẩu thất bại',
    [ErrorCode.NOT_FOUND_ID]: 'Không tìm thấy Id',
    [ErrorCode.INVALID_CAPTCHA]: 'Token CAPTCHA không hợp lệ',
    [ErrorCode.NOT_TOKEN]: 'Không có token',
    [ErrorCode.VERIFY_FAIL]: 'Xác minh không thành công',
    [ErrorCode.SERVER_UNAVAILABLE]: 'Lỗi không xác định trong server',
    [ErrorCode.VALID_IN_DTO]: '',
    [ErrorCode.SERVER_ERROR]: 'Lỗi Server',
    [ErrorCode.UPLOAD_ERROR]: 'Lỗi Upload',
    [ErrorCode.LOCK_USER]: 'Tài khoản đã bị khóa',
  };
  static getErrorMessage(code: ErrorCode, ...params: any[]) {
    const template = this.errorMessage[code] || 'An unknown error occurred.';
    return formatString(template, ...params);
  }
}
