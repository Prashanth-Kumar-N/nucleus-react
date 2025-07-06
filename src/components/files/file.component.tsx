import {
  Card,
  CardContent,
  CardOverflow,
  AspectRatio,
  Typography,
  Link,
  Tooltip,
  Grid,
  IconButton,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Input,
  Button,
  Stack,
  ModalClose,
} from "@mui/joy";
import { DeleteOutline, DriveFileRenameOutline } from "@mui/icons-material";
import axios from "axios";
import { FileType } from "./files.component";
import { getAPIURLWithPath } from "../../utils/api-utils";
import { NotificationProps } from "./files.component";
import { useState } from "react";

// getting image to show in card according to file type
const getFileImage = (fileName: string) => {
  const fileExtension = fileName.split(".").pop()?.toLowerCase();
  switch (fileExtension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return "assets/image-file.jpg"; // Placeholder for image files
    case "pdf":
      return "assets/pdf-file.png"; // Placeholder for PDF files
    case "txt":
      return "assets/text-file.jpg"; // Placeholder for text files
    default:
      return "assets/unknown-file.jpg"; // Placeholder for unknown file types
  }
};

// getting the string for file size in Bytes, KB and MB
// if the size is not a number, return "Unknown Size"
const getFileSize = (size: number) => {
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
};

interface FileComponentProps {
  file: FileType;
  setNotification: (notification: NotificationProps) => void;
  actionsCb: {
    fileDeletedCb?: (fileName: string) => void;
    fileRenamedCb?: (oldName: string, newName: string) => void;
  };
}

export const FileComponent = ({
  file,
  setNotification,
  actionsCb,
}: FileComponentProps) => {
  const [showFileOptions, setShowFileOptions] = useState<boolean>(false);
  const [showRenameModal, setShowRenameModal] = useState<boolean>(false);
  const [renameValue, setRenameValue] = useState<string>(file.Name);

  // Function to delete the file
  const deleteFile = async () => {
    // Implement the delete file logic here
    // Call an API to delete the file from the server
    const apiUrl = `${getAPIURLWithPath("deleteFile")}/${file.Name}`;
    try {
      const response = await axios.delete(apiUrl);
      if (response.status === 200) {
        setNotification({
          type: "alert",
          data: {
            alertType: "success",
            description: `File ${file.Name} deleted successfully.`,
          },
        });
        actionsCb.fileDeletedCb?.(file.Name); // Call the callback to update the file list
      } else {
        // If the response status is not 200, throw an error
        throw new Error(`Failed to delete file ${file.Name}`);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setNotification({
        type: "alert",
        data: {
          alertType: "danger",
          title: `Failed to delete file ${file.Name}. Please try again.`,
          description: `Error: ${error}`,
        },
      });
    }
  };

  const renameFile = async () => {
    const payload = { oldName: file.Name, newName: renameValue };

    try {
      const apiURL = `${getAPIURLWithPath("renameFile")}`;
      const response = await axios.post(apiURL, payload);
      if (response.status === 200) {
        setNotification({
          type: "alert",
          data: {
            alertType: "success",
            description: `File rename successful.`,
          },
        });
        actionsCb.fileRenamedCb &&
          actionsCb.fileRenamedCb(file.Name, renameValue);
        setShowRenameModal(false);
      } else {
        // If the response status is not 200, throw an error
        throw new Error(`Failed to rename file ${file.Name}`);
      }
    } catch (error) {
      console.error("Error renaming file:", error);
      setNotification({
        type: "alert",
        data: {
          alertType: "danger",
          title: `Failed to rename file ${file.Name}. Please try again.`,
          description: `Error: ${error}`,
        },
      });
      setShowRenameModal(false);
    }
  };

  return (
    <>
      <Grid xs={6} sm={4} md={3} lg={2} xl={2}>
        <Card
          component="li"
          className=" m-3 min-h-15 cursor-pointer"
          onMouseOver={(e) => {
            setShowFileOptions(true);
          }}
          onMouseLeave={(e) => {
            setShowFileOptions(false);
          }}
        >
          <CardOverflow>
            <AspectRatio>
              <img
                src={getFileImage(file.Name)}
                srcSet={getFileImage(file.Name)}
                loading="lazy"
                alt=""
              />
            </AspectRatio>
          </CardOverflow>
          <CardContent
            className=" flex-col items-start justify-end pt-5 -m-2 text-left"
            sx={{ rowGap: 0 }}
          >
            <Tooltip title={file.Name}>
              <Link
                className="truncate w-full font-medium"
                href={file.URL}
                color="neutral"
              >
                <Typography
                  level="title-md"
                  className="truncate w-full"
                  fontSize={""}
                  //textColor="#fff"
                >
                  {file.Name}
                </Typography>
              </Link>
            </Tooltip>
            <Typography level="body-sm" color="neutral">
              {getFileSize(file.Size)}
            </Typography>
          </CardContent>
          {showFileOptions && (
            <section
              className="absolute top-0 left-0 w-full bg-opacity-70 hidden lg:flex justify-around "
              style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            >
              <IconButton
                onClick={() => setShowRenameModal(true)}
                sx={{
                  color: "#e0e0e0",
                  ":hover": {
                    color: "#42a5f5",
                    backgroundColor: "transparent",
                  },
                }}
                variant="plain" // Use variant="plain" for a transparent background
              >
                <DriveFileRenameOutline />
              </IconButton>
              <IconButton
                onClick={deleteFile}
                sx={{
                  color: "#e0e0e0",
                  backgroundColor: "transparent",
                  ":hover": {
                    color: "#e57373",
                    backgroundColor: "transparent",
                  },
                }}
                variant="plain"
              >
                <DeleteOutline />
              </IconButton>
            </section>
          )}
          <section className="w-full flex lg:hidden justify-around">
            <IconButton
              onClick={() => setShowRenameModal(true)}
              sx={{
                maxHeight: "32px",
                minHeight: "32px",
                margin: "0 -16px -16px",
                width: "calc(100% + 32px)",
                borderRadius: "0px",
                color: "#42a5f5",
                ":hover": { backgroundColor: "#e3f2fd", color: "#42a5f5" },
              }}
              variant="plain" // Use variant="plain" for a transparent background
            >
              <DriveFileRenameOutline />
            </IconButton>
            <IconButton
              onClick={deleteFile}
              color="danger"
              variant="plain"
              sx={{
                maxHeight: "32px",
                minHeight: "32px",
                margin: "0 -16px -16px",
                width: "calc(100% + 32px)",
                borderRadius: "0px",
              }}
            >
              <DeleteOutline />
            </IconButton>
          </section>
        </Card>
      </Grid>

      <Modal open={showRenameModal} onClose={() => setShowRenameModal(false)}>
        <ModalDialog>
          <ModalClose />
          <DialogTitle>Rename File</DialogTitle>
          <DialogContent>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                renameFile();
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
                    onClick={() => setShowRenameModal(false)}
                  >
                    Cancel
                  </Button>
                </section>
              </Stack>
            </form>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
  );
};

/*   
  return (
    <Grid xs={6} sm={4} md={2} lg={2} xl={2}>
      <Card
        component="li"
        className=" m-3 min-h-15"
        onMouseOver={(e) => {
          setShowFileOptions(true);
        }}
        onMouseLeave={(e) => {
          setShowFileOptions(false);
        }}
      >
        <CardContent>
          <section>
            <section>
              <img
                src={getFileImage(file.Name)}
                srcSet={getFileImage(file.Name)}
                loading="lazy"
                alt=""
              />
            </section>
            <section className=" flex-col items-start justify-end pt-5 -m-2 text-left gap-0">
              <Tooltip title={file.Name}>
                <Link
                  className="truncate w-full font-medium"
                  href={file.URL}
                  color="neutral"
                >
                  <Typography
                    level="title-md"
                    className="truncate w-full"
                    fontSize={""}
                    //textColor="#fff"
                  >
                    {file.Name}
                  </Typography>
                </Link>
              </Tooltip>
              <Typography level="body-sm" color="neutral">
                {getFileSize(file.Size)}
              </Typography>
            </section>
            {showFileOptions && (
              <section
                className="absolute top-0 left-0 w-full bg-opacity-70 flex justify-around"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                <IconButton onClick={deleteFile} sx={{ color: "#e0e0e0" }}>
                  <DeleteOutline />
                </IconButton>
              </section>
            )}
          </section>
        </CardContent>
      </Card>
    </Grid>
  );*/
