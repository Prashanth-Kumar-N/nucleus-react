import { useMemo, useState, useCallback } from "react";
import {
  Typography,
  Box,
  Grid,
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
import axios from "axios";
import { DescriptionOutlined } from "@mui/icons-material";
import { FilesGridComponent } from "./files-grid.component";
import { FilesTableComponent } from "./files-table.component";
import { getAPIURLWithPath } from "../../utils/api-utils";
import type { FilesListProps, FileType, ActionData } from "./files.types";

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

  files = files.map((file) => {
    totalSize += file.Size;
    file.formattedSize = getFileSize(file.Size);
    return file;
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

export const FileList = (props: FilesListProps) => {
  const [renameFileData, setRenameData] = useState<ActionData>({
    showModal: false,
    fileName: "",
  });
  const [deleteFileData, setDeleteData] = useState<ActionData>({
    showModal: false,
    fileName: "",
  });
  const [renameValue, setRenameValue] = useState<string>("");

  // Function to delete the file
  const deleteFile = useCallback(async (fileName: string) => {
    // Implement the delete file logic here
    // Call an API to delete the file from the server
    const apiUrl = `${getAPIURLWithPath("deleteFile")}/${fileName}`;
    try {
      const response = await axios.delete(apiUrl);
      if (response.status === 200) {
        props.setNotification({
          type: "alert",
          data: {
            alertType: "success",
            description: `File ${fileName} deleted successfully.`,
          },
        });
        props.actionsCb.fileDeletedCb?.(fileName); // Call the callback to update the file list
      } else {
        // If the response status is not 200, throw an error
        throw new Error(`Failed to delete file ${fileName}`);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      props.setNotification({
        type: "alert",
        data: {
          alertType: "danger",
          title: `Failed to delete file ${fileName}. Please try again.`,
          description: `Error: ${error}`,
        },
      });
    }
  }, []);

  const renameFile = useCallback(
    async (fileName: string, renameValue: string) => {
      const payload = { oldName: fileName, newName: renameValue };

      try {
        const apiURL = `${getAPIURLWithPath("renameFile")}`;
        const response = await axios.post(apiURL, payload);
        if (response.status === 200) {
          props.setNotification({
            type: "alert",
            data: {
              alertType: "success",
              description: `File rename successful.`,
            },
          });
          props.actionsCb.fileRenamedCb &&
            props.actionsCb.fileRenamedCb(fileName, renameValue);
          setRenameData({ ...renameFileData, showModal: false });
        } else {
          // If the response status is not 200, throw an error
          throw new Error(`Failed to rename file ${fileName}`);
        }
      } catch (error) {
        console.error("Error renaming file:", error);
        props.setNotification({
          type: "alert",
          data: {
            alertType: "danger",
            title: `Failed to rename file ${fileName}. Please try again.`,
            description: `Error: ${error}`,
          },
        });
        setRenameData({ ...renameFileData, showModal: false });
      }
    },
    []
  );

  //const deleteFile = (file)
  const actions = {
    setDeleteData,
    setRenameData: (data: ActionData) => {
      setRenameValue(data.fileName);
      setRenameData(data);
    },
  };

  if (props.files?.length === 0) {
    return <NoFilesFound />;
  }

  if (props.pending) {
    return <FilesLoading />;
  }

  const { files, totalSize } = addFileSize(props.files);

  return (
    <>
      {props.filesRenderType === "list" ? (
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
        onClose={() => setRenameData({ fileName: "", showModal: false })}
      >
        <ModalDialog>
          <ModalClose />
          <DialogTitle>Rename File</DialogTitle>
          <DialogContent>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                renameFile(renameFileData.fileName, renameValue);
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
                      setRenameData({ fileName: "", showModal: false })
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
        onClose={() => setDeleteData({ fileName: "", showModal: false })}
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
                  onClick={() => deleteFile(deleteFileData.fileName)}
                >
                  Delete
                </Button>
                <Button
                  variant="outlined"
                  onClick={() =>
                    setDeleteData({ fileName: "", showModal: false })
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
