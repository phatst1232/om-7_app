export type User = {
  id: string;
  fullName: string;
  username: string;
  password?: string;
  email: string;
  phone?: string;
  image?: string;
  gender: boolean;
  dateOfBirth?: string;
  roles?: Role[];
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

export type RegisterUserDto = {
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  image?: string;
  gender: boolean;
  dateOfBirth?: string;
  roles?: Role[];
};

export type CreateUserDto = {
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  image?: string;
  gender: boolean;
  dateOfBirth?: string;
  roles?: Role[];
};

export type CreateRoleDto = {
  name: string;
  description?: string;
  permissions?: Permission[];
};

export type CreatePermissionDto = {
  name: string;
  description?: string;
};
