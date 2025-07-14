import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  FileType,
  ErrorTypeString,
  APIStatus,
} from "../../components/files/files.types";
import {
  fetchFiles,
  deleteFile as deleteFileThunkAction,
  renameFile as renameFileThunkAction,
} from "./thunk-actions";

interface FilesState {
  filesRenderType: "list" | "grid";
  files: FileType[];
  fetchingFileState: APIStatus;
  deleteFileStatus: APIStatus;
  renameFileStatus: APIStatus;
  fetchingError: {
    type: ErrorTypeString;
    error: TypeError | null;
    fileName?: string | "";
  };
}

const initialState: FilesState = {
  filesRenderType: "grid",
  files: [],
  fetchingFileState: "idle",
  fetchingError: { type: "", error: null },
  deleteFileStatus: "idle",
  renameFileStatus: "idle",
} satisfies FilesState;

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    changeRenderType: (
      state: FilesState,
      action: PayloadAction<"list" | "grid">
    ) => {
      state.filesRenderType = action.payload;
    },
    deleteFile: (state: FilesState, action: PayloadAction<string>) => {
      state.files.filter(({ Name }) => Name !== action.payload);
    },
    renameFile: (
      state: FilesState,
      action: PayloadAction<{ oldName: string; newName: string }>
    ) => {
      const file = state.files.find(
        ({ Name }) => Name === action.payload.oldName
      );
      if (file) file.Name = action.payload.newName;
    },
  },
  selectors: {
    selectRenderType: (state) => state.filesRenderType,
    selectFiles: (state) => state.files,
    selectFetchingFilesState: (state) => state.fetchingFileState,
    selectFetchingError: (state) => state.fetchingError,
    selectDeleteFileStatus: (state) => state.deleteFileStatus,
    selectRenameFileStatus: (state) => state.renameFileStatus,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.files = action.payload;
        state.fetchingFileState = "success";
      })
      .addCase(fetchFiles.pending, (state, action) => {
        state.fetchingFileState = "pending";
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.fetchingFileState = "error";
        state.fetchingError = {
          type: "fetchFiles",
          error: action.error as TypeError,
        };
      })
      .addCase(deleteFileThunkAction.fulfilled, (state, action) => {
        state.deleteFileStatus = "success";
        state.files = state.files.filter(
          ({ Name }) => Name !== action.meta.arg
        );
      })
      .addCase(deleteFileThunkAction.pending, (state, action) => {
        state.deleteFileStatus = "pending";
      })
      .addCase(deleteFileThunkAction.rejected, (state, action) => {
        state.deleteFileStatus = "error";
        state.fetchingError = {
          type: "deleteFile",
          error: action.error as TypeError,
          fileName: action.meta.arg,
        };
      })
      .addCase(renameFileThunkAction.fulfilled, (state, action) => {
        state.renameFileStatus = "success";
        const fileIdx = state.files.findIndex(
          ({ Name }) => Name === action.meta.arg.oldName
        );
        if (fileIdx > -1) state.files[fileIdx].Name = action.meta.arg.newName;
      })
      .addCase(renameFileThunkAction.pending, (state, action) => {
        state.renameFileStatus = "pending";
      })
      .addCase(renameFileThunkAction.rejected, (state, action) => {
        state.renameFileStatus = "error";
        state.fetchingError = {
          error: action.error as TypeError,
          type: "renameFile",
          fileName: action.meta.arg.oldName,
        };
      });
  },
});

export const { changeRenderType } = filesSlice.actions;
export const {
  selectRenderType,
  selectFiles,
  selectFetchingFilesState,
  selectFetchingError,
  selectDeleteFileStatus,
  selectRenameFileStatus,
} = filesSlice.selectors;
export const fetchFilesAction = fetchFiles;
export const deleteFileAction = deleteFileThunkAction;
export const renameFileAction = renameFileThunkAction;

export default filesSlice.reducer;
