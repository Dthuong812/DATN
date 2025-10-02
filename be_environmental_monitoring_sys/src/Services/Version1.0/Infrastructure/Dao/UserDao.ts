import { UserDto } from "../../Domain/Dtos/users.dto";
import { UserEntity } from "../../Domain/Models/users.entity";
import { CoreDaoBase } from "./CoreDaoBase";

type RawPermissionRow = {
  UserId: number;
  UserName: string;
  PassWord: string;
  Organization_Id: number;
  Department_Id: number;
  FunctionCode: string | null;
  PermissionCode: string | null;
  ChangePasswordAt: Date | null;
  Active: number;
  Allowed: number | null;
  RoleCode: string | null;
};

export class UserDao extends CoreDaoBase<UserEntity, UserDto> {
  constructor() {
    super(UserEntity);
  }

  async getPayloadByName(username: string) {
    const rows: RawPermissionRow[] = await this._repository.query(
      `
      SELECT
          u.Id AS UserId,
          u.UserName,
          u.PassWord,
          u.Organization_Id,
          u.Department_Id,
          f.Code AS FunctionCode,
          p.Code AS PermissionCode,
          rfp.Allowed AS Allowed,
          u.ChangePasswordAt,
          u.Active,
          r.Code AS RoleCode
      FROM users u
      LEFT JOIN userroleassignments ura ON u.Id = ura.UserId
      LEFT JOIN roles r ON ura.RoleId = r.Id
      LEFT JOIN rolefunctionpermission rfp ON r.Id = rfp.RoleId
      LEFT JOIN functions f ON rfp.FunctionId = f.Id
      LEFT JOIN permissions p ON rfp.PermissionId = p.Id
      WHERE u.UserName = ?
      `,
      [username],
    );

    if (!rows.length) {
      return null;
    }

    // Chỉ lấy quyền được phép
    const allowedItems = rows.filter((row) => row.Allowed === 1);

    // Nhóm theo FunctionCode
    const groupedPermissions = allowedItems.reduce<
      Record<string, { FunctionCode: string; PermissionsCode: string[] }>
    >((acc, row) => {
      if (!row.FunctionCode || !row.PermissionCode) return acc;
      if (!acc[row.FunctionCode]) {
        acc[row.FunctionCode] = {
          FunctionCode: row.FunctionCode,
          PermissionsCode: [],
        };
      }
      acc[row.FunctionCode].PermissionsCode.push(row.PermissionCode);
      return acc;
    }, {});

    // Gom RoleCode 
    const roleCodes = Array.from(
      new Set(rows.map((r) => r.RoleCode).filter((r) => r != null)),
    );

    return {
      UserId: rows[0].UserId,
      UserName: rows[0].UserName,
      PassWord: rows[0].PassWord,
      Organization_Id: rows[0].Organization_Id,
      Department_Id: rows[0].Department_Id,
      ChangePasswordAt: rows[0].ChangePasswordAt,
      Active: rows[0].Active,
      RoleCodes: roleCodes,
      Permissions: Object.values(groupedPermissions),
    };
  }
}
