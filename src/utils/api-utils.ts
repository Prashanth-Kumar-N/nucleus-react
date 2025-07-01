export const getAPIURL = () => {
  return process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_URL
    : process.env.REACT_APP_LOCAL_URL;
};
