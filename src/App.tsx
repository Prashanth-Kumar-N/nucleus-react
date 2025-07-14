import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import Login from "./components/login/login";
import Files from "./components/files/files.component";
import Header from "./components/header/header.component";
import store from "./redux/store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <div className="App h-[100vh]">
        <Header />
        <section className="h-[calc(100vh-100px)] overflow-y-auto">
          <Routes>
            <Route index path="/login" element={<Login />}></Route>
            <Route path="/files" element={<Files />}></Route>
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </section>
      </div>
    </Provider>
  );
}

export default App;
