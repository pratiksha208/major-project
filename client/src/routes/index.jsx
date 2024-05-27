import { createBrowserRouter } from "react-router-dom";
import Auth from "../auth";
import Explorer from "../explorer";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "/",
        element: <Auth />,
        index: true,
      },
      {
        path: "auth",
        element: <Auth />,
        index: true,
      },
      {
        path: "explorer",
        element: <Explorer />,
      },
    ],
  },
]);

export default router;
