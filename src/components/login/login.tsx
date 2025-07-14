import { useState } from "react";
import {
  useAppSelector as useSelector,
  useAppDispatch as useDispatch,
} from "../../redux/store.ts";
import { pinEntered, selectAuthentication } from "../../redux/login/slice";
import { PinInput } from "../presentational-components/pin-input.tsx";
//import { PinInput } from "react-input-pin-code";
import { Typography } from "@mui/joy";
import { useNavigate } from "react-router";

const Login = () => {
  const [pinValues, setPinvalues] = useState<(string | number)[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectAuthentication);

  if (isAuthenticated) {
    navigate("/files");
  }

  const inputChanged = (value: string | number, index: number) => {
    pinValues[index] = value;
    setPinvalues([...pinValues]);
  };

  const validatePin = (
    value: string | number,
    index: number,
    values: Array<string | number>
  ) => {
    const enteredPin = values.join("");
    dispatch(pinEntered(enteredPin));
  };

  return (
    <section className="flex h-full md:max-h-full ">
      <section className="flex-1 hidden md:flex">
        <img src="assets/login-image.png" />
      </section>
      <section className="flex flex-1 flex-col justify-center items-center relative">
        <img
          src="assets/login-image.png"
          className="absolute top-0 left-0 h-full w-full flex md:hidden blur-2xl"
        />
        <Typography level="h2" textColor={"#374151"} className="z-10">
          Unlock Nucleus
        </Typography>
        <section className="pin mt-6 z-10">
          {/*  <PinInput
            autoFocus
            autoComplete="off"
            autoTab
            mask
            placeholder=""
            size="lg"
            onChange={(value, index) => {
              if (Array.isArray(value)) {
                value = value[index];
              }
              onIpChange(value, index);
            }}
            onComplete={(values) => {
              validatePin(values);
            }}
            values={pinValues}
          /> */}
          <PinInput
            length={4}
            values={pinValues}
            autoFocus={true}
            onChange={inputChanged}
            onComplete={validatePin}
            mask
          />
        </section>
      </section>
    </section>
  );
};

export default Login;
