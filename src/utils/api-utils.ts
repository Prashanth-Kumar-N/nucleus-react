const apiPaths = {
  deleteFile: "/files/delete-file",
  getAllFiles: "/files/get-all-files",
  maxFileSize: "/files/max-file-size",
  uploadFile: "/files/upload-file",
  renameFile: "/files/rename-file",
};

export const getAPIURL = () => {
  return process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_URL
    : process.env.REACT_APP_LOCAL_URL;
};

export const getAPIURLWithPath = (path: keyof typeof apiPaths) => {
  const baseURL = getAPIURL();
  return baseURL ? `${baseURL}${apiPaths[path]}` : path;
};
