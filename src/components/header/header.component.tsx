import { CardOverflow, Card, CardContent, Typography } from "@mui/joy";
import { Outlet } from "react-router";

const Header = function () {
  return (
    <section className="flex flex-col">
      <Card
        className="w-full h-24"
        variant="soft"
        sx={{
          bgcolor: "#fff",
          maxWidth: "100%",
          boxShadow: "lg",
          paddingBottom: 0,
          paddingTop: 0,
        }}
      >
        <CardContent
          className=" h-full justify-start"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <img src="assets/header-logo.png" className="h-full w-24" />
          <Typography
            level="h2"
            sx={{
              color: "#1565c0",
              fontStyle: "italic",
              fontFamily: "ABC Ginto Nord Unlicensed Trial",
              fontWeight: "500",
              marginTop: "10px",
              marginLeft: "8px",
            }}
          >
            Nucleus
          </Typography>
        </CardContent>
      </Card>
    </section>
  );
};

export default Header;
