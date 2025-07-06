import { Table } from "@mui/joy";
import { FileType, NotificationProps } from "./files.component";

interface FileComponentProps {
  files: FileType[];
  setNotification: (notification: NotificationProps) => void;
  actionsCb: {
    fileDeletedCb?: (fileName: string) => void;
    fileRenamedCb?: (oldName: string, newName: string) => void;
  };
}

export const FilesTableComponent = ({
  files,
  setNotification,
  actionsCb,
}: FileComponentProps) => {
  return (
    <Table>
      <thead>
        <th>Name</th>
        <th>Size</th>
        <th>Last Modifed</th>
      </thead>
      <tbody>
        {files.map((file) => (
          <tr>
            <td>{file.Name}</td>
            <td>{file.Size}</td>
            <td>{file.LastModified}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
