import { Controller, Get, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { BaoCaoService } from "../Application/Services/BaoCaoService";
import { Public, RequirePermission } from "src/common/decorators";
import { EnumQuyen } from "src/common/EnumQuyen";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

@ApiBearerAuth("JWT")
@Controller("baocao")
export class BaoCaoController {
  constructor(private readonly baoCaoService: BaoCaoService) {}

  @Get("summary")
  @RequirePermission({ Func: "FUNC_BAOCAO", Permission: EnumQuyen.READ })
  @ApiOperation({ summary: "xem bao cao" })
  async getAllByObject(
    @Query("startTime") startTime: Date,
    @Query("endTime") endTime: Date,
    @Query("objectCode") objectCode?: string
  ) {
    return await this.baoCaoService.getAllByObject(
      startTime,
      endTime,
      objectCode
    );
  }
  @Get("export")
  @RequirePermission({ Func: "FUNC_BAOCAO", Permission: EnumQuyen.READ })
  @ApiOperation({ summary: "xem bao cao" })
  async exportBaoCaoPDF(
    @Query("from") from: string,
    @Query("to") to: string,
    @Query("objectCode") objectCode: string,
    @Res() res: Response
  ) {
    const params = {
      startTime: new Date(from),
      endTime: new Date(to),
      objectCode,
    };

    const buffer = await this.baoCaoService.exportBaoCaoPDF(params);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=baocao.pdf",
    });

    res.send(buffer);
  }
  @Get("view")
  @RequirePermission({ Func: "FUNC_BAOCAO", Permission: EnumQuyen.READ })
  @Public()
  @ApiOperation({ summary: "xem bao cao" })
  async viewVuotNguong(
    @Query("startTime") startTime: Date,
    @Query("endTime") endTime: Date
  ) {
    return await this.baoCaoService.getVuotNguong(startTime, endTime);
  }

  @Get("vuot-nguong")
  @RequirePermission({ Func: "FUNC_BAOCAO", Permission: EnumQuyen.READ })
  @ApiOperation({ summary: "xem bao cao" })
  async exportVuotNguong(
    @Query("from") from: string,
    @Query("to") to: string,
    @Res() res: Response
  ) {
    const start = new Date(from);
    const end = new Date(to);

    const buffer = await this.baoCaoService.exportVuotNguongPDF(start, end);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=baocao_vuotnguong.pdf",
    });
    res.send(buffer);
  }
}
