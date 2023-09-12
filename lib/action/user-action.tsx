import axios, { AxiosError } from 'axios';
import {
  DELETE_USER_ROUTE,
  GET_ALL_USER_ROUTE,
  UPDATE_USER_ROUTE,
  UPDATE_USER_STATUS_ROUTE,
} from '@/shared/common/api-route';
import { User } from '../dto/dashboard-dtos';

const commonHeaders = {
  'Content-Type': 'application/json',
};

function getAuthorizationHeader(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    ...commonHeaders,
  };
}

// export async function getAllUser(token: string) {
//   try {
//     const headers = getAuthorizationHeader(token);
//     const response = await axios.get(GET_ALL_USER_ROUTE, { headers });
//     return response.data;
//   } catch (error) {
//     console.log('Catched error: ' + error);
//     if (error instanceof AxiosError) {
//       return error.response?.data;
//     }
//   }
// }

export async function getSearchUser(
  token: string,
  searchData: string
): Promise<User[]> {
  try {
    const headers = getAuthorizationHeader(token);
    const response = await axios.post(
      GET_ALL_USER_ROUTE,
      { searchData },
      { headers }
    );
    console.log('Get search users Res:  ', response.data.data);
    const users: User[] = response.data;
    return users;
  } catch (error) {
    console.log('Catched error: ' + error);
    if (error instanceof AxiosError) {
      return [];
    }
    throw error;
  }
}

export async function callDeleteUser(
  user: User,
  token: string
): Promise<boolean> {
  try {
    const headers = getAuthorizationHeader(token);
    const id = user.id;
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
