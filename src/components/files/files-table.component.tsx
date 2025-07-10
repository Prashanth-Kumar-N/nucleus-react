import { useState } from "react";
import {
  Button,
  Sheet,
  Table,
  Tooltip,
  Link,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Input,
  Stack,
  ModalClose,
} from "@mui/joy";
import { DriveFileRenameOutline, DeleteOutline } from "@mui/icons-material";
import type { FilesTableComponentProps, FileType } from "./files.types";

export const FilesTableComponent = ({
  files,
  setNotification,
  totalSize,
  actions,
}: FilesTableComponentProps) => {
  //files = [...files, ...files, ...files, ...files, ...files, ...files];
  const [showRenameModal, setShowRenameModal] = useState<boolean>(false);
  const [renameValue, setRenameValue] = useState<string>("");

  // table columns array
  const columns = [
    { title: "Name", key: "Name" },
    { title: "Size", key: "Size" },
    { title: "LastModified", key: "LastModified" },
  ];

  return (
    <>
      <Sheet sx={{ overflow: "auto", height: "50vh" }}>
        <Table
          size="md"
          hoverRow
          stickyHeader
          stickyFooter
          sx={{
            "& tr > td:last-child": {
              display: "flex",
              justifyContent: "flex-end",
              paddingTop: 0,
              paddingBottom: 0,
              alignItems: "center",
            },
          }}
        >
          <thead>
            {columns.map(({ title }) => (
              <th style={{ backgroundColor: "#f0f4f8" }}>{title}</th>
            ))}
            <th style={{ backgroundColor: "#f0f4f8" }}></th>
          </thead>
          <tbody style={{ cursor: "pointer" }}>
            {files.map((file) => (
              <tr>
                {columns.map(({ key }) => {
                  if (key === "Name")
                    return (
                      <td>
                        <Link className="truncate w-full" href={file.URL}>
                          {file.Name}
                        </Link>
                      </td>
                    );
                  if (key) return <td>{file[key as keyof FileType]}</td>;
                })}
                <td>
                  <Tooltip title="Rename">
                    <Button
                      color="neutral"
                      size="sm"
                      variant="plain"
                      sx={{ margin: 0, height: 4 }}
                      onClick={() =>
                        actions.setRenameData({
                          showModal: true,
                          fileName: file.Name,
                        })
                      }
                    >
                      <DriveFileRenameOutline />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Button
                      color="danger"
                      size="sm"
                      variant="solid"
                      sx={{ marginLeft: 2, height: 4 }}
                      onClick={() =>
                        actions.setDeleteData({
                          showModal: true,
                          fileName: file.Name,
                        })
                      }
                    >
                      <DeleteOutline />
                    </Button>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={columns.length} className="truncate text-center">
                Total Size: {totalSize}
              </td>
            </tr>
          </tfoot>
        </Table>
      </Sheet>
    </>
  );
};
