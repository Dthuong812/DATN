import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from "@nestjs/common";
import { AlertService } from "../Application/Services/AlertService";
import { EnumQuyen } from "src/common/EnumQuyen";
import { RequirePermission } from "src/common/decorators";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
@ApiBearerAuth("JWT")
@Controller("alerts")
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  @RequirePermission({ Func: "FUNC_ALERT", Permission: EnumQuyen.READ })
  @ApiOperation({ summary: "Lấy tất cả thông báo" })
  async getAll() {
    return await this.alertService.getAll();
  }
  @Get("unread")
  @RequirePermission({ Func: "FUNC_ALERT", Permission: EnumQuyen.READ })
  @ApiOperation({ summary: "Lấy tất cả thông báo chưa đọc" })
  async getUnreadCount() {
    return await this.alertService.getUnreadCount();
  }

  @Get("unread/list")
  @RequirePermission({ Func: "FUNC_ALERT", Permission: EnumQuyen.READ })
    @ApiOperation({ summary: "Lấy danh sách thông báo chưa đọc" })
  async getUnreadList() {
    return await this.alertService.getUnreadList();
  }

  @Patch(":Id/read")
  @RequirePermission({ Func: "FUNC_ALERT", Permission: EnumQuyen.UPDATE })
  @ApiOperation({ summary: "Đánh dấu đã đọc thông báo" })
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAsRead(@Param("Id") Id: number) {
    await this.alertService.markAsRead(Id);
  }

  @Patch("readall")
  @RequirePermission({ Func: "FUNC_ALERT", Permission: EnumQuyen.UPDATE })
  @ApiOperation({ summary: "Đánh dấu tất cả đã đọc" })
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAllAsRead() {
    await this.alertService.markAllAsRead();
  }

  @Delete(":Id")
  @RequirePermission({ Func: "FUNC_ALERT", Permission: EnumQuyen.DELETE })
  @ApiOperation({ summary: "Xóa thông báo" })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlert(@Param("Id") Id: number) {
    await this.alertService.deleteAlert(Id);
  }

  @Delete("clear")
  @RequirePermission({ Func: "FUNC_ALERT", Permission: EnumQuyen.DELETE })
  @ApiOperation({ summary: "Xóa tất cả thông báo đã đọc" })
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearReadAlerts() {
    await this.alertService.clearReadAlerts();
  }
}
