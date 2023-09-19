import axios, { AxiosError } from 'axios';
import {
  DELETE_PERMISSION_ROUTE,
  GET_ALL_PERMISSION_ROUTE,
  UPDATE_PERMISSION_ROUTE,
} from '@/shared/common/api-route';
import { Permission } from '../dto/dashboard-dtos';
import useSWRMutation from 'swr/mutation';
import { getAuthorizationHeader } from './header';

const searchPermissionListFetcher = (
  url: string,
  searchData: string,
  token: string
) => {
  const headers = getAuthorizationHeader(token);
  return axios.post(url, { searchData }, { headers }).then((res) => res.data);
};

export function useSearchPermissionList(searchData: string, token: string) {
  const { data, error, isMutating, trigger } = useSWRMutation(
    GET_ALL_PERMISSION_ROUTE,
    (url) => searchPermissionListFetcher(url, searchData, token)
  );
  return {
    permissions: data,
    isMutating: isMutating,
    searchPermissionError: error,
    triggerSearchPermission: trigger,
  };
}

export async function callDeletePermission(
  id: string,
  token: string
): Promise<boolean> {
  try {
    const headers = getAuthorizationHeader(token);
    const response = await axios.delete(`${DELETE_PERMISSION_ROUTE}/${id}`, {
      headers,
    });
    console.log('response', response);
    return response.status === 200;
  } catch (error) {
    console.log('Catched ERROR: ' + error);
    return false;
  }
}

export async function callUpdatePermission(
  permission: Permission,
  token: string
): Promise<Permission> {
  try {
    const headers = getAuthorizationHeader(token);
    const id = permission.id;
    const response = await axios.put(
      `${UPDATE_PERMISSION_ROUTE}/${id}`,
      {
        name: permission.name,
        description: permission.description,
        status: permission.status,
      },
      { headers }
    );
    console.log('Update permission Res:  ', response.data);
    const res: Permission = response.data;
    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        alert('Permission not found');
      }
      if (error.response?.status === 201) {
        return error.response.data;
      }
    }
    throw error;
  }
}
