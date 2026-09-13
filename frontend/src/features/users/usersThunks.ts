import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import axiosApi from "../../axiosApi";
import type {
  User,
  UserMutation,
  GlobalError,
  ValidationError,
} from "../../types";

export const register = createAsyncThunk<
  User,
  UserMutation,
  { rejectValue: ValidationError }
>("users/register", async (registerMutation, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post<User>(
      "/auth/register",
      registerMutation,
    );
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

export const login = createAsyncThunk<
  User,
  UserMutation,
  { rejectValue: GlobalError }
>("users/login", async (loginMutation, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post<User>("/auth/login", loginMutation);
    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 400) {
      return rejectWithValue(e.response.data as GlobalError);
    }
    throw e;
  }
});
