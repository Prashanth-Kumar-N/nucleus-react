import { getAPIURL } from "../../utils/api-utils";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Card,
  CardOverflow,
  AspectRatio,
  Typography,
  CardContent,
  CardCover,
  Box,
  Link,
  Tooltip,
  Grid,
} from "@mui/joy";

interface File {
  Size: number;
  Name: string;
  URL: string;
}

export const FileList = () => {
  const [files, setFiles] = useState<File[]>([]);
  console.log(process.env);
  const fetchFiles = async () => {
    return axios.get<File[]>(`${getAPIURL()}/get-all-files`);
  };

  useEffect(() => {
    fetchFiles()
      .then((res) => {
        if (res.data) {
          // the first object is just the folder name
          res.data.shift();
          setFiles(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
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
    return (
      <Box className="flex justify-center items-center h-full">
        <Typography level="body-lg">No files found</Typography>
      </Box>
    );
  }

  /* return (
    <Box component="ul" className="flex">
      {files.map((file) => {
        return (
          <Card
            component="li"
            className="w-1/3 md:w-1/4 m-3 min-h-20 md:min-h-36"
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
              className=" flex-col items-start justify-end pt-5 -m-2"
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
        );
      })}
    </Box>
  ); */

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
                className=" flex-col items-start justify-end pt-5 -m-2"
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
