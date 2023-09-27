import axios, { AxiosError } from 'axios';
import {
  CREATE_ROLE_ROUTE,
  DELETE_ROLE_ROUTE,
  GET_ALL_PERMISSION_ROUTE,
  GET_ALL_ROLE_ROUTE,
  UPDATE_ROLE_ROUTE,
} from '@/shared/common/api-route';
import { CreateRoleDto, Permission, Role } from '../dto/dashboard-dtos';
import useSWRMutation from 'swr/mutation';
import { getAuthorizationHeader } from './header';

const searchRoleListFetcher = (
  url: string,
  searchData: string,
  token: string
) => {
  const headers = getAuthorizationHeader(token);
  return axios.post(url, { searchData }, { headers }).then((res) => res.data);
};

export function useSearchRoleList(searchData: string, token: string) {
  const { data, error, isMutating, trigger } = useSWRMutation(
    GET_ALL_ROLE_ROUTE,
    (url) => searchRoleListFetcher(url, searchData, token)
  );
  return {
    roles: data,
    isMutating: isMutating,
    searchRoleError: error,
    triggerSearchRole: trigger,
  };
}

export const createRoleFetcher = (
  url: string,
  role: CreateRoleDto,
  token: string
) => {
  const headers = getAuthorizationHeader(token);
  return axios.post(url, role, {
    headers,
  });
};

export function useCreateRole(role: CreateRoleDto, token: string) {
  const { data, error, isMutating, trigger } = useSWRMutation(
    CREATE_ROLE_ROUTE,
    (url) => createRoleFetcher(url, role, token)
  );
  return {
    createResult: data,
    creatingRole: isMutating,
    createError: error,
    doCreateRole: trigger,
  };
}

export async function callCreateRole(
  role: CreateRoleDto,
  token: string
): Promise<Role> {
  try {
    const headers = getAuthorizationHeader(token);
    const response = await axios.post(`${CREATE_ROLE_ROUTE}`, role, {
      headers,
    });
    console.log('Create role Res:  ', response.data);
    const res: Role = response.data;
    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        alert('Create role fail');
      }
      if (error.response?.status === 201) {
        return error.response.data;
      }
    }
    throw error;
  }
}

export async function callDeleteRole(
  id: string,
  token: string
): Promise<boolean> {
  try {
    const headers = getAuthorizationHeader(token);
    const response = await axios.delete(`${DELETE_ROLE_ROUTE}/${id}`, {
      headers,
    });
    console.log('response', response);
    return response.status === 200;
  } catch (error) {
    console.log('Catched ERROR: ' + error);
    return false;
  }
}

export async function callUpdateRole(role: Role, token: string): Promise<Role> {
  try {
    const headers = getAuthorizationHeader(token);
    const id = role.id;
    const response = await axios.put(
      `${UPDATE_ROLE_ROUTE}/${id}`,
      {
        name: role.name,
        description: role.description,
        roles: role.permissions,
        status: role.status,
      },
      { headers }
    );
    console.log('Update role Res:  ', response.data);
    const res: Role = response.data;
    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        alert('Role not found');
      }
      if (error.response?.status === 201) {
        return error.response.data;
      }
    }
    throw error;
  }
}

export async function getAllPermissions(token: string): Promise<Permission[]> {
  try {
    const headers = getAuthorizationHeader(token);
    const response = await axios.get(`${GET_ALL_PERMISSION_ROUTE}`, {
      headers,
    });
    console.log('response', response);
    return response.data;
  } catch (error) {
    console.log('getAllPermissions - Catched ERROR: ' + error);
    return [];
  }
}
