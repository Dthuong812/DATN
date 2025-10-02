// is-unique.validator.ts
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
  import { DataContext } from 'src/common/Infrastructure/Data/DataContext';
  
  @ValidatorConstraint({ name: 'IsUnique', async: true })
  export class IsUniqueValidator implements ValidatorConstraintInterface {
    async validate(value: any, args: ValidationArguments): Promise<boolean> {
      const [EntityClass, property = 'Id'] = args.constraints;
  
      if (!value) return true; // nếu value rỗng thì bỏ qua validate unique
  
      try {
        // Khởi tạo datasource (DataContext bạn tự xây dựng)
        const dataSource = await DataContext.getInstance(process.env.DATABASE_URL, [EntityClass]);
  
        const repo = dataSource.getRepository(EntityClass);
        const existing = await repo.findOne({ where: { [property]: value } });
        return !existing || args.object['Id'] === existing.Id;
      } catch (err) {
        console.error('Error in IsUniqueValidator:', err);
        // Nếu lỗi, mặc định trả về false hoặc true tùy logic bạn muốn
        return false;
      }
    }
  
    defaultMessage(args: ValidationArguments) {
      const [_, property = 'Id'] = args.constraints;
      return `${property} đã tồn tại trong hệ thống.`;
    }
  }
  