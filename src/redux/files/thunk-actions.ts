import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { FileType } from "../../components/files/files.types";
import { getAPIURLWithPath } from "../../utils/api-utils";

//API's
export const fetchFilesAPI = async () => {
  return axios.get<FileType[]>(`${getAPIURLWithPath("getAllFiles")}`);
};

export const deleteFileAPI = async (fileName: string) => {
  return axios.delete(`${getAPIURLWithPath("deleteFile")}/${fileName}`);
};

export const renameFileAPI = async (postData: {
  oldName: string;
  newName: string;
}) => {
  return axios.post(`${getAPIURLWithPath("renameFile")}`, postData);
};

// Thunk actions
export const fetchFiles = createAsyncThunk(
  "files/fetchFiles",
  async (arg: unknown, thunkAPI) => {
    const response = await fetchFilesAPI();
    return response.data;
  }
);

export const deleteFile = createAsyncThunk(
  "files/deleteFile",
  async (arg: string, thunkAPI) => {
    return await deleteFileAPI(arg);
  }
);

export const renameFile = createAsyncThunk(
  "files/renameFile",
  async (arg: { oldName: string; newName: string }, thunkAPI) => {
    const res = await renameFileAPI(arg);
    return res;
  }
);
