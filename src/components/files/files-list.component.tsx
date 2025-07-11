import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Input,
  Button,
  Stack,
  ModalClose,
} from "@mui/joy";
import { DescriptionOutlined } from "@mui/icons-material";
import { FilesGridComponent } from "./files-grid.component";
import { FilesTableComponent } from "./files-table.component";
import type {
  FilesListProps,
  FileType,
  ActionData,
  ErrorTypeString,
} from "./files.types";
import {
  selectFiles,
  selectRenderType,
  fetchFilesAction,
  selectFetchingFilesState,
  selectFetchingError,
  selectDeleteFileStatus,
  selectRenameFileStatus,
  deleteFileAction,
  renameFileAction,
} from "../../redux/files/slice";
import {
  useAppSelector as useSelector,
  useAppDispatch as useDispatch,
} from "../../redux/store";

// getting the string for file size in Bytes, KB and MB
// if the size is not a number, return "Unknown Size"
const getFileSize = (size: number): string => {
  if (isNaN(size)) {
    return "Unknown Size";
  }

  if (size < 1024) {
    return `${size} B`;
  }

  const sizeinKB = size / 1024;
  if (sizeinKB < 1024) {
    return `${sizeinKB.toFixed(2)} KB`;
  }

  const sizeinMB = sizeinKB / 1024;
  if (sizeinMB < 1024) {
    return `${sizeinMB.toFixed(2)} MB`;
  }

  return "Unknown Size";
};

const addFileSize = (files: FileType[]) => {
  let totalSize: number = 0;

  // removing the first element because it refers to a folder
  // This is a root folder in the bucket for files, no need to show it
  files.shift();

  files = files.map((file) => {
    const fileObj = { ...file };
    totalSize += fileObj.Size;
    fileObj.formattedSize = getFileSize(fileObj.Size);
    return fileObj;
  });

  return { files, totalSize: getFileSize(totalSize) };
};

export const NoFilesFound = () => {
  return (
    <Box className="flex flex-col gap-5 justify-center items-center h-full bg-gray-100 rounded-2xl font-medium">
      <DescriptionOutlined sx={{ fontSize: "42px", color: "#757575" }} />
      <Typography level="body-lg" sx={{ color: "#757575" }}>
        Files you upload will appear here.
      </Typography>
    </Box>
  );
};

export const FilesLoading = () => {
  return (
    <Box className="flex flex-col gap-5 justify-center items-center h-full bg-gray-100 rounded-2xl font-medium">
      <CircularProgress size="lg" color="primary" variant="plain" />
      <Typography level="body-lg" sx={{ color: "#757575" }}>
        Fetching files...
      </Typography>
    </Box>
  );
};

const getErrorMessage = (type: ErrorTypeString, fileName?: string) => {
  switch (type) {
    case "deleteFile":
      return `Failed to delete file ${fileName}. Please try again.`;
    case "renameFile":
      return `Failed to rename file ${fileName}. Please try again.`;
    case "fetchFiles":
    default:
      return "Error fetching files. Please try again.";
  }
};

export const FileList = (props: FilesListProps) => {
  const [renameFileData, setRenameData] = useState<ActionData>({
    showModal: false,
    fileName: "",
    lastActionCalled: false,
  });
  const [deleteFileData, setDeleteData] = useState<ActionData>({
    showModal: false,
    fileName: "",
    lastActionCalled: false,
  });
  const [renameValue, setRenameValue] = useState<string>("");
  const filesRenderType = useSelector(selectRenderType);
  const filesData = useSelector(selectFiles);
  const fetchingFilesStatus = useSelector(selectFetchingFilesState);
  const deletFileStatus = useSelector(selectDeleteFileStatus);
  const renameFileStatus = useSelector(selectRenameFileStatus);
  const fetchingError = useSelector(selectFetchingError);
  const dispatch = useDispatch();

  // fetch files on load
  useEffect(() => {
    dispatch(fetchFilesAction(""));
  }, []);

  const actions = {
    setDeleteData,
    setRenameData: (data: ActionData) => {
      setRenameValue(data.fileName);
      setRenameData({ ...renameFileData, ...data });
    },
  };

  if (filesData?.length <= 1) {
    return <NoFilesFound />;
  }

  // show loading state
  if (
    [fetchingFilesStatus, deletFileStatus, renameFileStatus].includes("pending")
  ) {
    return <FilesLoading />;
  }

  //show success message
  let successMessage = "";
  let showSuccessNotification = false;
  if (renameFileData.lastActionCalled && renameFileStatus === "success") {
    showSuccessNotification = true;
    successMessage = `File renamed to ${renameValue}`;
  }
  if (deleteFileData.lastActionCalled && deletFileStatus === "success") {
    showSuccessNotification = true;
    successMessage = "File deleteed.";
  }

  if (showSuccessNotification) {
    props.setNotification({
      type: "alert",
      data: {
        alertType: "success",
        description: successMessage,
      },
    });

    if (renameFileData.lastActionCalled)
      setRenameData({ ...renameFileData, lastActionCalled: false });
    if (deleteFileData.lastActionCalled)
      setDeleteData({ ...deleteFileData, lastActionCalled: false });
  }

  // show error state
  if (fetchingFilesStatus === "error") {
    console.error("API Error:", fetchingError);
    props.setNotification({
      type: "alert",
      data: {
        alertType: "danger",
        description:
          fetchingError?.error?.message ||
          getErrorMessage(fetchingError.type, fetchingError.fileName || "") ||
          "API Error",
      },
    });
  }

  const { files, totalSize } = addFileSize([...filesData]);

  return (
    <>
      {filesRenderType === "list" ? (
        <FilesTableComponent
          {...props}
          files={files}
          totalSize={totalSize}
          actions={actions}
        />
      ) : (
        <FilesGridComponent
          {...props}
          files={files}
          totalSize={totalSize}
          actions={actions}
        />
      )}

      <Modal
        open={renameFileData.showModal}
        onClose={() =>
          setRenameData({
            fileName: "",
            showModal: false,
            lastActionCalled: false,
          })
        }
      >
        <ModalDialog>
          <ModalClose />
          <DialogTitle>Rename File</DialogTitle>
          <DialogContent>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                dispatch(
                  renameFileAction({
                    oldName: renameFileData.fileName,
                    newName: renameValue,
                  })
                );
                setRenameData({
                  fileName: "",
                  showModal: false,
                  lastActionCalled: true,
                });
              }}
            >
              <Stack spacing={2}>
                <Input
                  value={renameValue}
                  error={!renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  placeholder="Enter new file name"
                  size="md"
                  className="w-[80vw] md:w-[33vw]"
                  required
                  autoFocus
                />
                <section className="flex flex-row gap-3">
                  <Button type="submit" variant="solid">
                    Rename
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      setRenameData({
                        fileName: "",
                        showModal: false,
                        lastActionCalled: false,
                      })
                    }
                  >
                    Cancel
                  </Button>
                </section>
              </Stack>
            </form>
          </DialogContent>
        </ModalDialog>
      </Modal>

      <Modal
        open={deleteFileData.showModal}
        onClose={() =>
          setDeleteData({
            fileName: "",
            showModal: false,
            lastActionCalled: false,
          })
        }
      >
        <ModalDialog>
          <ModalClose />
          <DialogTitle>Delete File</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <Typography level="body-md">
                Do you want to delete
                <Typography level="body-lg">
                  {deleteFileData.fileName}
                </Typography>
                ?
              </Typography>
              <section className="flex flex-row gap-3">
                <Button
                  variant="solid"
                  onClick={() => {
                    dispatch(deleteFileAction(deleteFileData.fileName));
                    setDeleteData({
                      fileName: "",
                      showModal: false,
                      lastActionCalled: true,
                    });
                  }}
                >
                  Delete
                </Button>
                <Button
                  variant="outlined"
                  onClick={() =>
                    setDeleteData({
                      fileName: "",
                      showModal: false,
                      lastActionCalled: false,
                    })
                  }
                >
                  Cancel
                </Button>
              </section>
            </Stack>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
  );
};
