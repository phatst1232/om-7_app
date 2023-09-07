import axios, { AxiosError } from "axios";
import {
  GET_ALL_USER_ROUTE,
  UPDATE_USER_STATUS_ROUTE,
} from "@/shared/common/api-route";
import { UserData } from "../dto/dashboard-dtos";

const commonHeaders = {
  "Content-Type": "application/json",
};

function getAuthorizationHeader(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    ...commonHeaders,
  };
}

export async function getAllUser(token: string) {
  try {
    const headers = getAuthorizationHeader(token);
    const response = await axios.get(GET_ALL_USER_ROUTE, { headers });
    return response.data;
  } catch (error) {
    console.log("Catched error: " + error);
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
  }
}

export async function getSearchUser(
  token: string,
  searchData: string
): Promise<UserData[]> {
  try {
    const headers = getAuthorizationHeader(token);
    const response = await axios.post(
      GET_ALL_USER_ROUTE,
      { searchData },
      { headers }
    );
    console.log("Res:  ", response.data.data);
    const users: UserData[] = response.data;
    return users;
  } catch (error) {
    console.log("Catched error: " + error);
    if (error instanceof AxiosError) {
      return [];
    }
    throw error;
  }
}

export async function updateUserStatus(
  user: UserData,
  token: string
): Promise<UserData> {
  try {
    const headers = getAuthorizationHeader(token);
    const id = user.id;
    const response = await axios.put(
      `${UPDATE_USER_STATUS_ROUTE}/${id}`,
      { status: user.status },
      { headers }
    );
    console.log("Res:  ", response.data.data);
    const res: UserData = response.data;
    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error("User not found");
      }
      if (error.response?.status === 201) {
        return error.response.data;
      }
    }
    throw error;
  }
}
