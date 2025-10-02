import { Injectable } from "@nestjs/common";
import { LocalDto } from "../../Domain/Dto/local.dto";
import { LocalEntity } from "../../Domain/Models/local.entity";
import { LocalRepository } from "../../Infrastructure/Repository/LocalRepository";
import { CoreServiceBase } from "./CoreServiceBase";

@Injectable()
export class LocalService extends CoreServiceBase<LocalEntity, LocalDto> {
  constructor(private readonly LocalRepository: LocalRepository,
  ) {
    super(LocalRepository);
  }
}