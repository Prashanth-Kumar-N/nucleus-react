import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoginState {
  isAuthenticated: boolean;
}

const initialState: LoginState = {
  isAuthenticated: false,
} satisfies LoginState;

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    pinEntered: (state: LoginState, action: PayloadAction<number | string>) => {
      if (action.payload === process.env.REACT_APP_PIN) {
        state.isAuthenticated = true;
      }
    },
    resetAuthentication: (state) => {
      state.isAuthenticated = false;
    },
  },
  selectors: {
    selectAuthentication: (state: LoginState) => state.isAuthenticated,
  },
});

export const { selectAuthentication } = loginSlice.selectors;
export const { pinEntered, resetAuthentication } = loginSlice.actions;
export default loginSlice.reducer;
