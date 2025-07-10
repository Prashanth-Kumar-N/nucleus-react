import type { AlertMessageProps } from "../presentational-components/alert";

export interface UploadProgress {
  state: "idle" | "uploading" | "completed" | "error";
  value: number;
}

export interface NotificationProps {
  type: "progress" | "alert";
  data: UploadProgress | AlertMessageProps;
}

export interface FileType {
  Size: number;
  Name: string;
  URL: string;
  LastModified?: string;
  formattedSize?: string;
}

export interface FilesListProps {
  setNotification: (notification: NotificationProps) => void;
  files: FileType[];
  totalSize?: string;
  pending?: boolean;
  filesRenderType: "list" | "grid";
  actionsCb: {
    fileDeletedCb?: (fileName: string) => void;
    fileRenamedCb?: (oldName: string, newName: string) => void;
  };
}

export interface FilesGridComponentProps {
  files: FileType[];
  setNotification: (notification: NotificationProps) => void;
  totalSize: string;
  actions: {
    setDeleteData: (data: ActionData) => void;
    setRenameData: (data: ActionData) => void;
  };
}

export interface FilesTableComponentProps {
  files: FileType[];
  setNotification: (notification: NotificationProps) => void;
  totalSize: string;
  actions: {
    setDeleteData: (data: ActionData) => void;
    setRenameData: (data: ActionData) => void;
  };
}

export interface ActionData {
  showModal: boolean;
  fileName: string;
}