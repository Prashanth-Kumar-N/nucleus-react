import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router";
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
            <Route path="/" element={<Files />}></Route>
          </Routes>
        </section>
      </div>
    </Provider>
  );
}

export default App;
