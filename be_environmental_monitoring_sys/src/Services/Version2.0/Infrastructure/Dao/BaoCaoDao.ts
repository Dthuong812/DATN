import { ParamBaoCaoTongHopTrungBinh } from "../../Domain/Dto/baocao.dto";
import { CoreDaoBase } from "./CoreDaoBase";

export class BaoCaoDao extends CoreDaoBase<any,any> {
    constructor() {
      super(null);
    }
    async getAllByObject(startTime: Date, endTime: Date, objectCode?: string,) {
        let sql = `
          SELECT 
            Times,
            Object_Code,
            Devices_Code,
            JSON_EXTRACT(DataJson, '$.temperature') AS temperature,
            JSON_EXTRACT(DataJson, '$.humidity') AS humidity,
            JSON_EXTRACT(DataJson, '$.pressure') AS pressure,
            JSON_EXTRACT(DataJson, '$.iaq') AS iaq,
            JSON_EXTRACT(DataJson, '$.sound_level') AS sound_level,
            JSON_EXTRACT(DataJson, '$.co2') AS co2,
            JSON_EXTRACT(DataJson, '$.voc') AS voc
          FROM devicedata
          WHERE Times BETWEEN ? AND ?
        `;
      
        const params: any[] = [startTime, endTime];
      
        if (objectCode) {
          sql += ` AND Object_Code = ?`;
          params.push(objectCode);
        }
        sql += ` ORDER BY Times DESC`;
      
        return await this._repository.query(sql, params);
      }
      
    }