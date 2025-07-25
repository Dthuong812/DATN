import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

    async sendMailCreateUser(to: string, body: string) {
    try {
      await this.mailerService.sendMail({
        to: to,
        from: 'dathuong812.qt@gmail.com', // sender address
        subject: 'Thông tin mật khẩu', // Subject line
        text: '', // plaintext body
        html: `<p>Mật khẩu của bạn là: ${body}</p>`,
      });
      return {
        success: true,
      };
    } catch (error) {
        console.log(error)
      return {
        success: false,
      };
    }
  }
}
