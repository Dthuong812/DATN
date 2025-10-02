import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

interface DeviceData {
  Devices_Code: string;
  Object_Code: string;
  Project_Code: string;
  [key: string]: any;
}

@WebSocketGateway({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})
@Injectable()
export class DeviceDataGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;


  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }


  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }


  @SubscribeMessage("subscribeDeviceData")
  handleSubscribe(
    @MessageBody() filters: Partial<DeviceData>,
    @ConnectedSocket() client: Socket,
  ) {
    client.data.filters = filters;
  }

  @OnEvent("device.data.saved")
  handleDeviceDataSaved(payload: DeviceData) {
    this.server.sockets.sockets.forEach((client) => {
      const filters = client.data.filters || {};
      const match =
        (!filters.Devices_Code || filters.Devices_Code === payload.Devices_Code) &&
        (!filters.Object_Code || filters.Object_Code === payload.Object_Code) &&
        (!filters.Project_Code || filters.Project_Code === payload.Project_Code);

      if (match) {
        client.emit("deviceDataUpdate", payload);
      }
    });
  }
}
