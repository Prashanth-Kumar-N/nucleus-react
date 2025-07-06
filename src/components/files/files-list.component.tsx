import { Typography, Box, Grid, CircularProgress } from "@mui/joy";
import type { FileType } from "./files.component";

import { DescriptionOutlined } from "@mui/icons-material";
import { NotificationProps } from "./files.component";
import { FileGridComponent } from "./file.component";
import { FilesTableComponent } from "./files-table.component";

interface FilesListProps {
  setNotification: (notification: NotificationProps) => void;
  files: FileType[];
  pending?: boolean;
  filesRenderType: "list" | "grid";
  actionsCb: {
    fileDeletedCb?: (fileName: string) => void;
    fileRenamedCb?: (oldName: string, newName: string) => void;
  };
}

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

export const FilesGrid = ({
  setNotification,
  files = [],
  pending = false,
  filesRenderType,
  actionsCb,
}: FilesListProps) => {
  return (
    <Grid container spacing={2} sx={{ margin: "10px 20px" }}>
      {files.map((file) => (
        <FileGridComponent
          key={file.Name}
          file={file}
          setNotification={setNotification}
          actionsCb={actionsCb}
        />
      ))}
    </Grid>
  );
};

export const FilesTable = ({
  setNotification,
  files = [],
  pending = false,
  filesRenderType,
  actionsCb,
}: FilesListProps) => {};

export const FileList = (props: FilesListProps) => {
  if (props.files?.length === 0) {
    return <NoFilesFound />;
  }

  if (props.pending) {
    return <FilesLoading />;
  }

  return (
    <>
      {props.filesRenderType === "list" ? (
        <FilesTableComponent {...props} />
      ) : (
        <FilesGrid {...props} />
      )}
    </>
  );
};
