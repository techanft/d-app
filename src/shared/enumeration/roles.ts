// Real Estate Management Roles

export enum Roles {
  ADMIN = 'ADMIN',
  HEAD = 'HEAD',
  USER = 'USER',
  INTERNAL_STAFF = 'INTERNAL_STAFF',
  EXTERNAL_STAFF = 'EXTERNAL_STAFF',
  USER_BE = 'USER_BE',
}

export const rolesArray: Roles[] = [Roles.ADMIN];

export const backOfficeRoles: Roles[] = [
  Roles.ADMIN,
  Roles.HEAD,
  Roles.INTERNAL_STAFF,
  Roles.EXTERNAL_STAFF,
  Roles.USER_BE,
];

export const mapRoles: { [key in Roles]: string } = {
  [Roles.ADMIN]: 'QUẢN TRỊ VIÊN',
  [Roles.HEAD]: 'TRƯỞNG BỘ PHẬN',
  [Roles.USER]: 'NGƯỜI DÙNG',
  [Roles.INTERNAL_STAFF]: 'NHÂN SỰ NỘI BỘ',
  [Roles.EXTERNAL_STAFF]: 'NHÂN SỰ LIÊN KẾT',
  [Roles.USER_BE]: 'NGƯỜI DÙNG HỆ THỐNG',
};
