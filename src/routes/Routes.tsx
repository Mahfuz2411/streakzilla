import { lazy } from "react";
import { createBrowserRouter } from "react-router";

const App = lazy(() => import("@/App"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

export default router;