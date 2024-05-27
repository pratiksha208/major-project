import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { GlobalStateProvider } from "./global.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalStateProvider>
      <ChakraProvider>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
      </ChakraProvider>
    </GlobalStateProvider>
  </React.StrictMode>
);
