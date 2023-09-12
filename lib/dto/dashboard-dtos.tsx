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
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string;
  gender?: boolean;
  dateOfBirth?: string;
  roles?: string[];
  createdAt: string;
  status: string;
};
