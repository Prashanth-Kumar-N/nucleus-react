import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router";
import Files from "./components/files/files.component";
import Header from "./components/header/header.component";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Files />}></Route>
      </Routes>
    </div>
  );
}

export default App;
