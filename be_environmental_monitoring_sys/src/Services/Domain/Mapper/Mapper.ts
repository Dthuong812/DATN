export class Mapper {
  static mapEntityToDto<Entity, Dto>(
    entity: Entity,
    dtoClass: { new (): Dto }
  ): Dto {
    const dto = new dtoClass();
    Object.keys(entity).forEach((key) => {
      if (entity.hasOwnProperty(key)) {
        dto[key] = entity[key];
      }
    });
    return dto;
  }

  static mapDtoToEntity<Entity, Dto>(
    dto: Dto,
    entityClass: { new (): Entity }
  ): Entity {
    const entity = new entityClass();
    Object.keys(dto).forEach((key) => {
      if (dto.hasOwnProperty(key)) {
        entity[key] = dto[key];
      }
    });
    return entity;
  }

  static map<T, U>(source: T, destination: { new (): U }): U {
    const mappedObject = new destination();
    Object.keys(source).forEach((key) => {
      if (source.hasOwnProperty(key)) {
        mappedObject[key] = source[key];
      }
    });
    return mappedObject;
  }

  static mapArray<T, U>(sourceArray: T[], destination: { new (): U }): U[] {
    return sourceArray.map((item) => this.map(item, destination));
  }
}
