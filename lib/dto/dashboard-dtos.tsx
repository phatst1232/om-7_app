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
  permissions?: string[];
  status: string;
};

export type Permission = {
  id: string;
  name?: string;
  description?: string;
  status: string;
};
