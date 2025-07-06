import { Typography, Box, Grid, CircularProgress } from "@mui/joy";
import type { FileType } from "./files.component";

import { DescriptionOutlined } from "@mui/icons-material";
import { NotificationProps } from "./files.component";
import { FileComponent } from "./file.component";

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

export const FileList = ({
  setNotification,
  files = [],
  pending = false,
  actionsCb,
}: {
  setNotification: (notification: NotificationProps) => void;
  files?: FileType[];
  pending?: boolean;
  actionsCb: {
    fileDeletedCb?: (fileName: string) => void;
    fileRenamedCb?: (oldName: string, newName: string) => void;
  };
}) => {
  if (files.length === 0) {
    return <NoFilesFound />;
  }

  if (pending) {
    return <FilesLoading />;
  }

  return (
    <Grid container spacing={2} sx={{ margin: "10px 20px" }}>
      {files.map((file) => (
        <FileComponent
          key={file.Name}
          file={file}
          setNotification={setNotification}
          actionsCb={actionsCb}
        />
      ))}
    </Grid>
  );
};
