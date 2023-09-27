import axios, { AxiosError } from 'axios';
import {
  CREATE_USER_ROUTE,
  DELETE_USER_ROUTE,
  GET_ALL_ROLE_ROUTE,
  GET_ALL_USER_ROUTE,
  UPDATE_USER_ROUTE,
} from '@/shared/common/api-route';
import { CreateUserDto, Role, User } from '../dto/dashboard-dtos';
import useSWRMutation from 'swr/mutation';
import { getAuthorizationHeader } from './header';
import useSWR from 'swr';

const searchUserListFetcher = (
  url: string,
  searchData: string,
  token: string
) => {
  const headers = getAuthorizationHeader(token);
  return axios.post(url, { searchData }, { headers }).then((res) => res.data);
};

export function useSearchUserList(searchData: string, token: string) {
  const { data, error, isMutating, trigger } = useSWRMutation(
    GET_ALL_USER_ROUTE,
    (url) => searchUserListFetcher(url, searchData, token)
  );
  return {
    users: data,
    isMutating: isMutating,
    searchUserError: error,
    triggerSearchUser: trigger,
  };
}

export const createUserFetcher = (
  url: string,
  user: CreateUserDto,
  token: string
) => {
  const headers = getAuthorizationHeader(token);
  return axios.post(url, user, {
    headers,
  });
};

export function useCreateUser(user: CreateUserDto, token: string) {
  const { data, error, isMutating, trigger } = useSWRMutation(
    CREATE_USER_ROUTE,
    (url) => createUserFetcher(url, user, token)
  );
  return {
    createResult: data,
    creatingUser: isMutating,
    createError: error,
    doCreateUser: trigger,
  };
}

export async function callCreateUser(
  user: CreateUserDto,
  token: string
): Promise<User> {
  try {
    const headers = getAuthorizationHeader(token);
    const response = await axios.post(`${CREATE_USER_ROUTE}`, user, {
      headers,
    });
    console.log('Create user Res:  ', response.data);
    const res: User = response.data;
    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        alert('Create user fail');
      }
      if (error.response?.status === 201) {
        return error.response.data;
      }
    }
    throw error;
  }
}

export async function callDeleteUser(
  id: string,
  token: string
): Promise<boolean> {
  try {
    const headers = getAuthorizationHeader(token);
    const response = await axios.delete(`${DELETE_USER_ROUTE}/${id}`, {
      headers,
    });
    console.log('response', response);
    return response.status === 200;
  } catch (error) {
    console.log('Catched ERROR: ' + error);
    return false;
  }
}

export async function getAllRoles(token: string): Promise<Role[]> {
  try {
    const headers = getAuthorizationHeader(token);
    const response = await axios.get(`${GET_ALL_ROLE_ROUTE}`, {
      headers,
    });
    console.log('response', response);
    return response.data;
  } catch (error) {
    console.log('getAllRoles - Catched ERROR: ' + error);
    return [];
  }
}

export async function callUpdateUser(user: User, token: string): Promise<User> {
  try {
    const headers = getAuthorizationHeader(token);
    const id = user.id;
    const response = await axios.put(
      `${UPDATE_USER_ROUTE}/${id}`,
      {
        fullName: user.fullName,
        email: user.email,
        image: user.image,
        gender: user.gender,
        status: user.status,
      },
      { headers }
    );
    console.log('Update user Res:  ', response.data);
    const res: User = response.data;
    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        alert('User not found');
      }
      if (error.response?.status === 201) {
        return error.response.data;
      }
    }
    throw error;
  }
}
