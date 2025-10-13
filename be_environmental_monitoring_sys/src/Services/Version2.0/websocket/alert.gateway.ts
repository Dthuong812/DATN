import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

import { AlertService } from "../Application/Services/AlertService";
import { Server } from "socket.io";

@WebSocketGateway({ cors: true })
export class AlertGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly alertService: AlertService) {}

  async handleDeviceData(deviceData: any, objectName: string) {
    const alerts = await this.alertService.generateAlert(deviceData, objectName);
    if (alerts.length) {
      this.server.emit("alert:new", alerts);
    }
  }
}
