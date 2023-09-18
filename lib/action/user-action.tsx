import axios, { AxiosError } from 'axios';
import {
  DELETE_USER_ROUTE,
  GET_ALL_USER_ROUTE,
  UPDATE_USER_ROUTE,
} from '@/shared/common/api-route';
import { User } from '../dto/dashboard-dtos';
import useSWRMutation from 'swr/mutation';
import { getAuthorizationHeader } from './header';
import useSWR from 'swr';

// const token = localStorage.getItem('token');
// console.log('token   ' + token);

// const commonHeaders = {
//   'Content-Type': 'application/json',
// };

// function getAuthorizationHeader() {
//   return {
//     Authorization: `Bearer ${token}`,
//     ...commonHeaders,
//   };
// }

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

// searchUser without SWR && useDeleteUser but no need
// export async function getSearchUser(searchData: string): Promise<User[]> {
//   try {
//     const headers = getAuthorizationHeader();
//     const response = await axios.post(
//       GET_ALL_USER_ROUTE,
//       { searchData },
//       { headers }
//     );
//     console.log('Get search users Res:  ', response.data.data);
//     const users: User[] = response.data;
//     return users;
//   } catch (error) {
//     console.log('Catched error: ' + error);
//     if (error instanceof AxiosError) {
//       return [];
//     }
//     throw error;
//   }
// }

// const deleteUserFetcher = (url: string) =>
//   axios.delete(url, { headers }).then(() => true);

// export function useDeleteUser(id: string) {
//   const { data, error, isLoading } = useSWR(
//     `${DELETE_USER_ROUTE}/${id}`,
//     (url) => deleteUserFetcher(url)
//   );

//   return {
//     userIsDeleted: data === true, // Check if data is true for successful deletion
//     isDeletingUser: isLoading, // Use isValidating to indicate the deletion process
//     deleteUserError: error,
//   };
// }

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
