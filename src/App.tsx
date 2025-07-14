import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Routes, Navigate, redirect } from "react-router";
import { createBrowserRouter, RouterProvider, Route } from "react-router";
import Login from "./components/login/login";
import Files from "./components/files/files.component";
import Header from "./components/header/header.component";
import store from "./redux/store";
import { Provider } from "react-redux";

function App() {
  const router = createBrowserRouter([
    /* {
      path: "/files",
      async lazy() {
        const { default: Files } = await import(
          "./components/files/files.component"
        );
        return { Component: Files };
      },
    }, */
    {
      path: "/files",
      Component: Files,
    },
    {
      path: "/login",
      Component: Login,
    },
    {
      path: "/",
      loader: async () => redirect("/login"),
    },
  ]);
  return (
    <Provider store={store}>
      <div className="App h-[100vh]">
        <Header />
        <section className="h-[calc(100vh-100px)] overflow-y-auto">
          {/* <Routes>
            <Route index path="/login" element={<Login />}></Route>
            <Route path="/files" element={<Files />}></Route>
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes> */}
          <RouterProvider router={router} />
        </section>
      </div>
    </Provider>
  );
}

export default App;
