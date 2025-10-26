import { Injectable, Logger } from "@nestjs/common";
import { CoreServiceBase } from "./CoreServiceBase";
import { AlertEntity } from "../../Domain/Models/alert.entity";
import { AlertDto } from "../../Domain/Dto/alert.dto";
import { AlertRepository } from "../../Infrastructure/Repository/AlertRepository";
import { SensorConfigRepository } from "../../Infrastructure/Repository/SensorConfigRepository";
import { Mapper } from "../../Domain/Mapper/Mapper";

@Injectable()
export class AlertService extends CoreServiceBase<AlertEntity, AlertDto> {
  private readonly logger = new Logger(AlertService.name);

  constructor(
    private readonly alertRepository: AlertRepository,
    private readonly sensorConfigRepository: SensorConfigRepository
  ) {
    super(alertRepository);
  }

  async generateAlert(data: any, objectName: string): Promise<AlertEntity[]> {
    try {
      const configs = await this.sensorConfigRepository.getAll();
      const alertsToCreate: any[] = [];
  
      const dataJson =
        typeof data.DataJson === "string"
          ? JSON.parse(data.DataJson)
          : data.DataJson;
  
      for (const cfg of configs) {
        const value = dataJson?.[cfg.Field];
        if (value === undefined) {
          this.logger.warn(
            `Không tìm thấy giá trị cho trường '${cfg.Field}' trong dữ liệu thiết bị ${data.Object_Code}`
          );
          continue;
        }
  
        const max = Math.max(...cfg.Thresholds);
        const min = Math.min(...cfg.Thresholds);
  
        if (value > max) {
          // Tạo object alert mức nguy hiểm
          alertsToCreate.push({
            Object_Code: data.Object_Code,
            Object_Name: objectName,
            Type: cfg.Label,
            Level: "Nguy hiểm",
            Message: `${cfg.Label} tại trạm ${objectName} đã vượt ngưỡng cảnh báo (${value.toFixed(1)} ${cfg.Unit})`,
            Value: value,
            Unit: cfg.Unit,
            IsRead: false,
          });
        }
        else if (value > min * 30) {
          // Tạo object alert mức cảnh báo
          alertsToCreate.push({
            Object_Code: data.Object_Code,
            Object_Name: objectName,
            Type: cfg.Label,
            Level: "Cảnh báo",
            Message: `${cfg.Label} tại trạm ${objectName} đang ở mức cao (${value.toFixed(1)} ${cfg.Unit})`,
            Value: value,
            Unit: cfg.Unit,
            IsRead: false,
          });
        }
      }
  
      if (alertsToCreate.length > 0) {
        // Lưu tất cả alerts vào database
        const savedAlerts = [];
        for (const alertData of alertsToCreate) {
          const savedAlert = await this.alertRepository.create(alertData);
          savedAlerts.push(savedAlert);
        }
  
        this.logger.log(`Đã tạo ${savedAlerts.length} cảnh báo cho trạm ${objectName}`);
        return savedAlerts;
      }
  
      return [];
    } catch (error) {
      this.logger.error("Lỗi khi tạo cảnh báo", error.stack);
      throw error;
    }
  }

  async getUnreadCount(): Promise<{ count: number }> {
    const count = await this.alertRepository.countUnread();
    return { count };
  }

 
  async getUnreadList(): Promise<AlertEntity[]> {
    return await this.alertRepository.getAll({
      where: { IsRead: false },
      order: { CreatedAt: "DESC" },
    });
  }


  async markAsRead(id: number): Promise<void> {
    await this.alertRepository.markAsRead(id);
  }
  async markAllAsRead(): Promise<void> {
    try {

      const unreadAlerts = await this.alertRepository.getAll({
        where: { IsRead: false }
      });
      console.log('Cảnh báo chưa đọc:', unreadAlerts);
      if (!unreadAlerts || unreadAlerts.length === 0) {
        this.logger.log('Không có cảnh báo nào chưa đọc');
        return;
      }
  
      let updatedCount = 0;
      for (const alert of unreadAlerts) {
        if (alert && alert?.Id) {
          try {
            await this.alertRepository.markAsRead(alert.Id);
            updatedCount++;
          } catch (updateError) {
            this.logger.error(`Lỗi khi đánh dấu đã đọc alert ID ${alert.Id}:`, updateError);
          }
        }
      }
  
      this.logger.log(`Đã đánh dấu ${updatedCount} cảnh báo là đã đọc`);
    } catch (error) {
      this.logger.error('Lỗi khi đánh dấu tất cả cảnh báo đã đọc:', error);
      throw error;
    }
  }
  

  async deleteAlert(Id: number): Promise<void> {
    await this.alertRepository.delete({ Id });
  }


  async clearReadAlerts(): Promise<void> {
    await this.alertRepository.clearRead();
  }
}
