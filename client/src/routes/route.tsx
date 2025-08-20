import App from "@/App";
import { createBrowserRouter, RouterProvider } from "react-router";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;