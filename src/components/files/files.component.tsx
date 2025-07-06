import { CloudUploadOutlined } from "@mui/icons-material";
import {
  Input,
  Button,
  Alert,
  IconButton,
  Typography,
  Divider,
  LinearProgress,
  Snackbar,
  Tooltip,
} from "@mui/joy";
import {
  CloseRounded,
  Info,
  ListOutlined,
  CalendarViewMonthOutlined,
} from "@mui/icons-material";
import {
  FileList,
  FilesLoading,
  NoFilesFound,
} from "./files-list.component.tsx";
import axios from "axios";
import { useEffect, useState, type ChangeEvent } from "react";
import { getAPIURLWithPath } from "../../utils/api-utils.ts";
import AlertMessage, {
  AlertMessageProps,
} from "../presentational-components/alert.tsx";

interface UploadProgress {
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
}

const NotificationContent = (props: NotificationProps | null) => {
  if (!props) return null;

  const { type, data } = props;
  // If no data is provided, return null
  if (!data) return null;

  // Check if the type is progress or alert and render accordingly
  if (type === "progress") {
    const progress = data as UploadProgress;
    if (progress.state === "uploading" && progress.value > 0) {
      return (
        <div className="flex flex-col items-center gap-2 w-1/2 ml-32 md:ml-40">
          <Typography
            level="body-xs"
            textColor="primary"
            sx={{ fontWeight: "xl", mixBlendMode: "difference" }}
          >
            Uploading... {`${Math.round(Number(progress.value!))}%`}
          </Typography>
          <LinearProgress
            determinate
            variant="solid"
            color="primary"
            size="lg"
            value={Number(progress.value!)}
            className="w-full"
          ></LinearProgress>
        </div>
      );
    }
  }

  if (type === "alert") {
    return (
      <>
        <div className="w-2/5 ml-36 md:ml-44 min-w-sm">
          <AlertMessage {...(data as AlertMessageProps)} />
        </div>
      </>
    );
  }
  return null;
};

const notificationContentData = {
  type: "alert",
  data: {
    alertType: "success",
    title: "Success",
    description: "File uploaded successfully!",
  },
};

const Files = () => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [actionPending, setPending] = useState<boolean>(true);
  const [showAlert, setShowAlert] = useState(true);
  const [notificationProps, setNotification] =
    useState<NotificationProps | null>(
      notificationContentData as NotificationProps
    );
  const [filesRenderType, setRenderType] = useState<"list" | "grid">("grid");

  const fetchFiles = async () => {
    setPending(true);
    // Fetching all files from the API
    try {
      const filesData = await axios.get<FileType[]>(
        `${getAPIURLWithPath("getAllFiles")}`
      );
      if (filesData.status !== 200) {
        throw new Error("Failed to fetch files");
      }

      if (filesData.data) {
        filesData.data.shift();
        setFiles(filesData.data);
      } else {
        setFiles([]);
      }
      setPending(false);
    } catch (error) {
      console.error("Error fetching files:", error);
      setPending(false);
      setNotification({
        type: "alert",
        data: {
          alertType: "danger",
          description: "Failed to fetch files",
        },
      });
      throw error;
    }
  };

  const fileDeletedCb = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.Name !== fileName));
  };

  const fileRenamedCb = (oldName: string, newName: string) => {
    setFiles((prevFiles) => {
      return prevFiles.map((file) => {
        if (file.Name !== oldName) return file;
        file.Name = newName;
        return { ...file };
      });
    });
  };

  useEffect(() => {
    axios.get(`${getAPIURLWithPath("maxFileSize")}`).then((res) => {
      sessionStorage.setItem("maxFileSize", res.data.maxFileSize);
    });
    fetchFiles();
  }, []);

  const fileSelected = async (e: ChangeEvent) => {
    const files = (e.target as HTMLInputElement)?.files;
    const formData = new FormData();

    if (files) {
      console.log("Files selected:", files);
      Array.from(files).forEach((file) => formData.append("file", file));

      try {
        setNotification({
          type: "progress",
          data: { state: "uploading", value: 0 },
        });
        const response = await axios.post(
          `${getAPIURLWithPath("uploadFile")}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: ({ loaded, total }) => {
              setNotification({
                type: "progress",
                data: {
                  state: "uploading",
                  value: Math.round((loaded * 100) / (total || 1)),
                },
              });
            },
          }
        );

        // throw error if the response is not 200
        if (response.status !== 200) {
          throw new Error(`Upload failed with status ${response.status}`);
        } else {
          setNotification({
            type: "alert",
            data: {
              alertType: "success",
              description: "File uploaded successfully!",
            },
          });
          fetchFiles();
        }
      } catch (error) {
        setNotification({
          type: "alert",
          data: {
            alertType: "danger",
            title: "Upload Failed",
            description: `File upload failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        });
        console.error("Error uploading file:", error);
      }
    }
  };

  const changeRenderType = () => {
    setRenderType((prevValue) => (prevValue === "list" ? "grid" : "list"));
  };

  return (
    <section className="flex flex-col h-full">
      <section className="flex justify-center">
        {showAlert && (
          <Alert
            variant="soft"
            color="warning"
            className="mt-10 "
            sx={{
              fontFamily: "ABC Ginto Nord Unlicensed Trial",
              fontSize: "12px",
              fontWeight: "400",
            }}
            startDecorator={<Info />}
            endDecorator={
              <IconButton
                variant="soft"
                color="warning"
                onClick={() => setShowAlert(false)}
              >
                <CloseRounded />
              </IconButton>
            }
          >
            The file Url's are only valid for an hour after refresh. If download
            doesn't work. Please refresh and try again.
          </Alert>
        )}
      </section>
      <section className="flex justify-end mx-4 mt-10 mb-4 md:mb-1 items-center">
        <section className="flex-[2] flex justify-center">
          <NotificationContent {...(notificationProps as NotificationProps)} />
        </section>
        <section className="">
          <IconButton
            color="neutral"
            sx={{ marginRight: 2 }}
            onClick={changeRenderType}
          >
            {filesRenderType === "grid" ? (
              <Tooltip title="Show List view">
                <ListOutlined />
              </Tooltip>
            ) : (
              <Tooltip title="Show Grid view">
                <CalendarViewMonthOutlined />
              </Tooltip>
            )}
          </IconButton>
          <Button
            component="label"
            role={undefined}
            tabIndex={-1}
            variant="outlined"
            color="neutral"
            className="w-32 h-12 md:w-40"
            startDecorator={<CloudUploadOutlined fontSize="medium" />}
          >
            <Typography
              level="body-sm"
              sx={{
                fontFamily: "ABC Ginto Nord Unlicensed Trial",
                fontSize: "16px",
                fontWeight: "400",
              }}
            >
              Upload
            </Typography>
            <input
              type="file"
              hidden
              multiple
              onChange={(e) => fileSelected(e)}
            />
          </Button>
        </section>
      </section>
      <Divider
        sx={{
          "--Divider-childPosition": `50%`,
          fontSize: "16px",
          fontFamily: "ABC Ginto Nord Unlicensed Trial",
        }}
        className="text-xs "
      >
        Files
      </Divider>
      <section className={`m-4 overflow-y-auto flex-grow`}>
        <FileList
          files={files}
          pending={actionPending}
          setNotification={setNotification}
          filesRenderType={filesRenderType}
          actionsCb={{ fileDeletedCb, fileRenamedCb }}
        />
      </section>
    </section>
  );
};
export default Files;
