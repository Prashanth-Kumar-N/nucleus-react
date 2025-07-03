import { CloudUploadOutlined } from "@mui/icons-material";
import {
  Input,
  Button,
  Alert,
  IconButton,
  Typography,
  Divider,
} from "@mui/joy";
import { FileList } from "./files-list.component.tsx";
import axios from "axios";
import { useEffect, useState, type ChangeEvent } from "react";
import { getAPIURL } from "../../utils/api-utils.ts";
import { CloseRounded, Info } from "@mui/icons-material";

const apiUrl = getAPIURL();

const Files = () => {
  const [showAlert, setShowAlert] = useState(true);
  const fileSelected = async (e: ChangeEvent) => {
    console.log((e.target as HTMLInputElement).files);
    const files = (e.target as HTMLInputElement)?.files;
    const formData = new FormData();

    if (files) {
      Array.from(files).forEach((file) => formData.append("file", file));

      try {
        const response = await axios.post(`${apiUrl}/upload-file`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("File uploaded successfully:", response.data);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  useEffect(() => {
    axios.get(`${apiUrl}/max-file-size`).then((res) => {
      console.log(res);
    });
  }, []);

  return (
    <section className="flex flex-col">
      <section className="flex justify-center">
        {showAlert && (
          <Alert
            variant="soft"
            color="warning"
            className="mt-10 "
            sx={{
              fontFamily: "ABC Ginto Nord Unlicensed Trial",
              fontSize: "12px",
              fontWeight: "400",
            }}
            startDecorator={<Info />}
            endDecorator={
              <IconButton
                variant="soft"
                color="warning"
                onClick={() => setShowAlert(false)}
              >
                <CloseRounded />
              </IconButton>
            }
          >
            The file Url's are only valid for an hour after refresh. If download
            doesn't work. Please refresh and try again.
          </Alert>
        )}
      </section>
      <section className="flex justify-end mx-4 mt-10 mb-4 md:mb-1">
        <Button
          component="label"
          role={undefined}
          tabIndex={-1}
          variant="outlined"
          color="neutral"
          className="w-32 h-12 md:w-48 md:h-16"
          startDecorator={<CloudUploadOutlined fontSize="medium" />}
        >
          <Typography
            level="body-sm"
            sx={{
              fontFamily: "ABC Ginto Nord Unlicensed Trial",
              fontSize: "16px",
              fontWeight: "400",
            }}
          >
            Upload
          </Typography>
          <input
            type="file"
            hidden
            multiple
            onChange={(e) => fileSelected(e)}
          />
        </Button>
      </section>
      <Divider
        sx={{
          "--Divider-childPosition": `50%`,
          fontSize: "16px",
          fontFamily: "ABC Ginto Nord Unlicensed Trial",
        }}
        className="text-xs "
      >
        Files
      </Divider>
      <section className="files-list-ctr">
        <FileList />
      </section>
    </section>
  );
};
export default Files;
