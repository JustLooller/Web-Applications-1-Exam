import { createBrowserRouter } from "react-router-dom";
import BackOffice from "../pages/BackOffice";
import FrontOffice from "../pages/FrontOffice";
import LoginPage from "../pages/LoginPage";
import SinglePage from "../pages/SinglePage";
import API from "../api/API.js";
import WrongRoutePage from "../pages/WrongRoutePage";
import CreationPage from "../pages/CreationPage";
import EditPage from "../pages/EditPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <FrontOffice />,
    loader: API.getPublishedPages,
    errorElement: <WrongRoutePage />,
  },
  {
    path: "/backoffice",
    element: <BackOffice />,
    loader: API.getPages,
    errorElement: <UnauthorizedPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/pages/:id",
    element: <SinglePage />,
    loader: API.getPagebyID,
  },
  {
    path: "/pages/create",
    element: <CreationPage />,
  },
  {
    path: "/pages/edit/:id",
    element: <EditPage />,
    loader: API.getPagebyID,
  },
]);

export default router;
