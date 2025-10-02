import { ErrorCode } from "src/common/ErrorCode/EnumCode";
import { ErrorManage } from "src/common/ErrorCode/ErrorManager";
import { ResultResponse } from "src/common/ResultResponse";

class CaptchaService {
  private verificationURL = 'https://www.google.com/recaptcha/api/siteverify';
  private secretKey = process.env.CAPCHAKEY || '';

  async verifyCaptcha(recaptchaToken: string): Promise<ResultResponse> {
    if (!recaptchaToken?.trim()) {
      return new ResultResponse(
        ErrorCode.NOT_TOKEN,
        ErrorManage.getErrorMessage(ErrorCode.NOT_TOKEN),
        null
      );
    }

    try {
      const params = new URLSearchParams({
        secret: this.secretKey,
        response: recaptchaToken,
      });

      const response = await fetch(this.verificationURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      const data = await response.json();

      if (data.success) {
        return new ResultResponse(
          ErrorCode.VERIFY,
          ErrorManage.getErrorMessage(ErrorCode.VERIFY),
          null
        );
      }

      return new ResultResponse(
        ErrorCode.VERIFY_FAIL,
        ErrorManage.getErrorMessage(ErrorCode.VERIFY_FAIL),
        null
      );

    } catch (error: any) {
      return new ResultResponse(
        ErrorCode.EXCEPTION,
        error?.message || 'Unexpected error',
        null
      );
    }
  }
}

export default CaptchaService;
