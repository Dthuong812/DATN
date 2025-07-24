import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private botToken = 'BOT_TOKEN';
  private chatId = 'CHAT_ID'; 

  async sendMessage(message: string): Promise<boolean> {
    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      await axios.post(url, {
        chat_id: this.chatId,
        text: "Mật khẩu mới của bạn là: " + message,
      });
      return true;
    } catch (error) {
      console.error('Error sending Telegram message:', error.message);
      return false;
    }
  }
}
