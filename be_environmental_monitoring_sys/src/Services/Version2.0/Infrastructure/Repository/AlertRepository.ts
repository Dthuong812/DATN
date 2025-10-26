import { Injectable } from "@nestjs/common";
import { CoreRepositoryBase } from "./CoreRepositoryBase";
import { AlertEntity } from "../../Domain/Models/alert.entity";
import { AlertDto } from "../../Domain/Dto/alert.dto";
import { AlertDao } from "../Dao/AlertDao";

@Injectable()
export class AlertRepository extends CoreRepositoryBase<AlertEntity, AlertDto> {
  constructor(private readonly AlertDao: AlertDao) {
    super([AlertDao]);
  }
  async countUnread(): Promise<number> {
    const unreadAlerts = await this.getAll({ where: { IsRead: false } });
    return unreadAlerts.length;
  }

  async markAsRead(Id: number): Promise<void> {
    await this.update({ Id }, { IsRead: true, CreatedAt: new Date() });
  }

  async clearRead(): Promise<void> {
    await this.delete({ IsRead: true });
  }
}
