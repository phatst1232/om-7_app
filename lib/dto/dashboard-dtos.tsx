export type User = {
  id: string;
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string;
  image?: string;
  gender?: boolean;
  dateOfBirth?: string;
  roles?: string[];
  createdAt: string;
  status: string;
};

export type Role = {
  id: string;
  name?: string;
  description?: string;
  permissions?: Permission[];
  status: string;
};

export type Permission = {
  id: string;
  name: string;
  description?: string;
  status: string;
};

export type CreatePermissionDto = {
  name: string;
  description?: string;
};

export type CreateRoleDto = {
  name: string;
  description?: string;
  permissions?: Permission[];
};
