import { Injectable } from "@nestjs/common";
import { Buffer } from "buffer";
import { BaoCaoRepository } from "../../Infrastructure/Repository/BaoCaoRepository";
import PDFDocument from "pdfkit-table";
import path from "path";
import { DeviceDataRepository } from "../../Infrastructure/Repository/DeviceDataRepository";
import { SensorConfigRepository } from "../../Infrastructure/Repository/SensorConfigRepository";
import { Between } from "typeorm";

@Injectable()
export class BaoCaoService {
  constructor(private readonly baoCaoRepository: BaoCaoRepository,
    private readonly deviceDataRepository: DeviceDataRepository,
    private readonly sensorConfigRepository: SensorConfigRepository
  ) {}

  async exportBaoCaoPDF(params: {
    startTime: Date;
    endTime: Date;
    objectCode?: string;
  }): Promise<Buffer> {
    const data = await this.baoCaoRepository.getAllByObject(
      params.startTime,
      params.endTime,
      params.objectCode
    );

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margins: { top: 40, bottom: 40, left: 40, right: 40 },
    });

    const buffers: Buffer[] = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => {});

    const fontPath = path.resolve(process.cwd(), "assets/font/roboto-regular.ttf");
    doc.registerFont("Roboto", fontPath);
    doc.font("Roboto");

    // --- Header ---
    doc.fontSize(16).text("BÁO CÁO DỮ LIỆU MÔI TRƯỜNG", { align: "center" });
    doc.moveDown();
    doc
      .fontSize(10)
      .text(
        `Từ: ${params.startTime.toLocaleString()} - Đến: ${params.endTime.toLocaleString()}`,
        { align: "justify" }
      );
    if (params.objectCode)
      doc.text(`Mã đối tượng: ${params.objectCode}`, { align: "justify" });
    doc.moveDown(1);

    if (!data || data.length === 0) {
      doc.text("Không có dữ liệu trong khoảng thời gian này.");
      doc.end();
      return new Promise((resolve) =>
        doc.on("end", () => resolve(Buffer.concat(buffers)))
      );
    }

    const pageWidth = doc.page.width;
    const tableWidth = 760;
    const startX = (pageWidth - tableWidth) / 2;

    const table = {
      headers: [
        { label: "Thời gian", property: "Times", width: 100 },
        { label: "Đối tượng", property: "Object_Code", width: 80 },
        { label: "Thiết bị", property: "Devices_Code", width: 80 },
        { label: "Nhiệt độ (°C)", property: "temperature", width: 80 },
        { label: "Độ ẩm (%)", property: "humidity", width: 80 },
        { label: "Áp suất (hPa)", property: "pressure", width: 80 },
        { label: "IAQ", property: "iaq", width: 60 },
        { label: "Độ ồn (dB)", property: "noise", width: 80 },
        { label: "CO₂", property: "co2", width: 70 },
        { label: "VOC", property: "voc", width: 70 },
      ],
      datas: data.map((row) => ({
        Times: new Date(row.Times).toLocaleString("vi-VN"),
        Object_Code: row.Object_Code,
        Device_Code: row.Devices_Code,
        temperature: row.temperature?.toFixed(2) ?? "-",
        humidity: row.humidity?.toFixed(2) ?? "-",
        pressure: row.pressure?.toFixed(2) ?? "-",
        iaq: row.iaq?.toFixed(2) ?? "-",
        noise: row.sound_level?.toFixed(2) ?? "-",
        co2: row.co2?.toFixed(2) ?? "-",
        voc: row.voc?.toFixed(2) ?? "-",
      })),
    };

    await doc.table(table, {
      x: startX,
      prepareHeader: () => doc.font("Roboto").fontSize(9),
      prepareRow: (row, i) => doc.font("Roboto").fontSize(8),
    });

    doc.end();
    return new Promise((resolve) =>
      doc.on("end", () => resolve(Buffer.concat(buffers)))
    );
  }
  async getAllByObject(startTime: Date, endTime: Date, objectCode?: string) {
    return await this.baoCaoRepository.getAllByObject(
      startTime,
      endTime,
      objectCode
    );
  }


  async getVuotNguong(startTime: Date, endTime: Date) {
    const configs = await this.sensorConfigRepository.getAll();
    const data = await this.deviceDataRepository.getAll({
      where: {
        Times: Between(startTime, endTime),
      },
      order: { Times: "DESC" },
    });

    const results = [];

    for (const item of data) {
      const json =
      typeof item.DataJson === "string"
        ? JSON.parse(item.DataJson)
        : item.DataJson;
      const row: any = {
        Times: item.Times,
        Object_Code: item.Object_Code,
        Device_Code: item.Devices_Code,
      };

      for (const cfg of configs) {
        const value = json[cfg.Field];
        if (value !== undefined) {
          const maxThreshold = Math.max(...cfg.Thresholds);
          const minThreshold = Math.min(...cfg.Thresholds);
          if (value > maxThreshold) {
            row[cfg.Code] = `Nguy hiểm (${value.toFixed(2)})`;
          } else if (value > minThreshold) {
            row[cfg.Code] = `Vượt ngưỡng tốt (${value.toFixed(2)})`;
          } else {
            row[cfg.Code] = `Tốt (${value.toFixed(2)})`;
          }
        } else {
          row[cfg.Code] = "-";
        }
      }

      results.push(row);
    }

    return { results, configs };
  }
  async exportVuotNguongPDF(startTime: Date, endTime: Date): Promise<Buffer> {
    const { results, configs } = await this.getVuotNguong(startTime, endTime);
    const doc = new PDFDocument({ margin: 30, size: "A4", layout: "landscape" });
    const buffers: Buffer[] = [];
  
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => {});
  

    const fontPath = path.resolve(process.cwd(), "assets/font/roboto-regular.ttf");
    doc.registerFont("Roboto", fontPath);
    doc.font("Roboto");
  
    // Header
    doc.fontSize(16).text("BÁO CÁO VƯỢT NGƯỠNG CHỈ SỐ MÔI TRƯỜNG", { align: "center" });
    doc.moveDown();
    doc
      .fontSize(10)
      .text(`Từ: ${startTime.toLocaleString()} - Đến: ${endTime.toLocaleString()}`);
    doc.moveDown();
  
    if (!results.length) {
      doc.text("Không có dữ liệu trong khoảng thời gian này.");
      doc.end();
      return new Promise((resolve) => doc.on("end", () => resolve(Buffer.concat(buffers))));
    }
  
    const headers = [
      { label: "Thời gian", property: "Times", width: 120 },
      { label: "Đối tượng", property: "Object_Code", width: 80 },
      { label: "Thiết bị", property: "Device_Code", width: 100 },
      ...configs.map((cfg) => ({
        label: `${cfg.Label} (${cfg.Unit})`,
        property: cfg.Code,
        width: 70,
      })),
    ];

    const tableData = results.map((row) => {
      const obj: any = {
        Times: new Date(row.Times).toLocaleString("vi-VN"),
        Object_Code: row.Object_Code,
        Device_Code: row.Device_Code,
      };
      configs.forEach((cfg) => {
        obj[cfg.Code] = row[cfg.Code];
      });
      return obj;
    });
  
    const Table = require("pdfkit-table");
    const docTable = doc as typeof doc & { table: Function };
  
    await docTable.table(
      {
        headers,
        datas: tableData,
      },
      {
        prepareHeader: () => doc.font("Roboto").fontSize(8),
        prepareRow: (row, i) => {
          doc.font("Roboto").fontSize(8);
          configs.forEach((cfg) => {
            const value = row[cfg.Code];
            if (typeof value === "string") {
              if (value.includes("Nguy hiểm")) {
                doc.fillColor("red"); 
              } else if (value.includes("Tốt")) {
                doc.fillColor("green"); 
              } else if (value.includes("Vượt ngưỡng tốt")) {
                doc.fillColor("yellow"); 
              } else {
                doc.fillColor("black"); 
              }
            }
          });
          return doc;
        },
      }
    );
  

  
    // --- Bảng màu ---
    doc.fontSize(14).text("Bảng màu và ý nghĩa chỉ số", { align: "center" });
    doc.moveDown();
  
    const colorTable = {
      headers: [
        { label: "Loại", property: "type", width: 150 },
        { label: "Mô tả", property: "description", width: 400 },
        { label: "Màu sắc", property: "color", width: 100 },
      ],
      datas: [
        {
          type: "Nguy hiểm",
          description: "Vượt ngưỡng cao nhất, có thể gây hại nghiêm trọng.",
          color: "Đỏ",
        },
        {
          type: "Tốt",
          description: "Trong ngưỡng an toàn, tốt cho sức khỏe con người.",
          color: "Xanh lá",
        },
        {
          type: "Trung bình",
          description: "Trong ngưỡng trung bình, không gây nguy hiểm.",
          color: "Vàng",
        },
      ],
    };
  
    await docTable.table(
      colorTable,
      {
        prepareHeader: () => doc.font("Roboto").fontSize(10),
        prepareRow: (row, i) => doc.font("Roboto").fontSize(9),
      }
    );
  
    doc.moveDown();
  
    // --- Bảng chỉ số cấu hình ---
    doc.fontSize(14).text("Cấu hình chỉ số cảm biến", { align: "center" });
    doc.moveDown();
  
    const configTable = {
      headers: [
        { label: "Mã chỉ số", property: "Code", width: 100 },
        { label: "Tên chỉ số", property: "Label", width: 200 },
        { label: "Đơn vị", property: "Unit", width: 100 },
        { label: "Ngưỡng tốt", property: "GoodThreshold", width: 150 },
        { label: "Ngưỡng nguy hiểm", property: "DangerThreshold", width: 150 },
      ],
      datas: configs.map((cfg) => ({
        Code: cfg.Code,
        Label: cfg.Label,
        Unit: cfg.Unit,
        GoodThreshold: Math.min(...cfg.Thresholds).toString(),
        DangerThreshold: Math.max(...cfg.Thresholds).toString(),
      })),
    };
  
    await docTable.table(
      configTable,
      {
        prepareHeader: () => doc.font("Roboto").fontSize(10),
        prepareRow: (row, i) => doc.font("Roboto").fontSize(9),
      }
    );
  
    doc.end();
    return new Promise((resolve) => doc.on("end", () => resolve(Buffer.concat(buffers))));
  }
}
