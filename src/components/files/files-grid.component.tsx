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
} from "@mui/joy";
import { DeleteOutline, DriveFileRenameOutline } from "@mui/icons-material";
import { useState } from "react";
import type { FilesGridComponentProps, FileType } from "./files.types";

// getting image to show in card according to file type
const getFileImage = (fileName: string, file: FileType) => {
  const fileExtension = fileName.split(".").pop()?.toLowerCase();
  switch (fileExtension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return file.URL; //"assets/image-file.jpg"; // Placeholder for image files
    case "pdf":
      return "assets/pdf-file.png"; // Placeholder for PDF files
    case "txt":
      return "assets/text-file.jpg"; // Placeholder for text files
    default:
      return "assets/unknown-file.jpg"; // Placeholder for unknown file types
  }
};

export const FilesGridComponent = ({
  setNotification,
  files = [],
  totalSize,
  actions,
}: FilesGridComponentProps) => {
  const [showFileOptions, setShowFileOptions] = useState<boolean>(false);

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{ margin: "10px 20px", overflowY: "auto" }}
      >
        {files.map((file) => (
          <Grid xs={6} sm={4} md={3} lg={2} xl={2} key={file.Name}>
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
                    src={getFileImage(file.Name, file)}
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
                  {file.formattedSize}
                </Typography>
              </CardContent>
              {showFileOptions && (
                <section
                  className="absolute top-0 left-0 w-full bg-opacity-70 hidden lg:flex justify-around "
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                >
                  <IconButton
                    onClick={() =>
                      actions.setRenameData({
                        showModal: true,
                        fileName: file.Name,
                      })
                    }
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
                    onClick={() =>
                      actions.setDeleteData({
                        showModal: true,
                        fileName: file.Name,
                      })
                    }
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
                  onClick={() =>
                    actions.setRenameData({
                      showModal: true,
                      fileName: file.Name,
                    })
                  }
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
                  onClick={() =>
                    actions.setDeleteData({
                      showModal: true,
                      fileName: file.Name,
                    })
                  }
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
        ))}
      </Grid>
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
