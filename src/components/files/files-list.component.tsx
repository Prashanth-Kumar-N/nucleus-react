import { getAPIURL } from "../../utils/api-utils";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Card,
  CardOverflow,
  AspectRatio,
  Typography,
  CardContent,
  Box,
  Link,
  Tooltip,
  Grid,
  CircularProgress,
} from "@mui/joy";

import { DescriptionOutlined } from "@mui/icons-material";
import { NotificationProps } from "./files.component";

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

interface File {
  Size: number;
  Name: string;
  URL: string;
}

export const FileList = ({
  setNotification,
}: {
  setNotification: (notification: NotificationProps) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [actionPending, setPending] = useState<boolean>(true);

  const fetchFiles = async () => {
    setPending(true);
    // Fetching all files from the API
    try {
      const filesData = await axios.get<File[]>(`${getAPIURL()}/get-all-files`);
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

  useEffect(() => {
    fetchFiles();
  }, []);

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

  if (files.length === 0) {
    return <NoFilesFound />;
  }

  if (actionPending) {
    return <FilesLoading />;
  }

  return (
    <Grid container spacing={2} sx={{ margin: "10px 20px" }}>
      {files.map((file) => {
        return (
          <Grid xs={6} sm={4} md={2} lg={2} xl={2}>
            <Card component="li" className=" m-3 min-h-15">
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
                    overlay
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
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};
