import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import NotFoundPage from "../../pages/not-found/NotFoundPage";
import { HomePage } from "../../pages/home/page";
import { SeasonsPage } from "../../pages/seasons/page";
import { SpringPage } from "../../pages/seasons/spring/page";
import { AutumnPage } from "../../pages/seasons/autumn/page";
import { SummerPage } from "../../pages/seasons/summer/page";
import { WinterPage } from "../../pages/seasons/winter/page";

const basename =
  import.meta.env.BASE_URL === "/"
    ? undefined
    : import.meta.env.BASE_URL.replace(/\/$/, "");

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { index: true, element: <HomePage />, errorElement: <NotFoundPage /> },
        {
          path: "seasons",
          element: <SeasonsPage />,
          errorElement: <NotFoundPage />,
          children: [
            {
              path: "spring",
              element: <SpringPage />,
              errorElement: <NotFoundPage />,
            },
            {
              path: "summer",
              element: <SummerPage />,
              errorElement: <NotFoundPage />,
            },
            {
              path: "autumn",
              element: <AutumnPage />,
              errorElement: <NotFoundPage />,
            },
            {
              path: "winter",
              element: <WinterPage />,
              errorElement: <NotFoundPage />,
            },
          ],
        },
        /* {
          path: "animations",
          element: <AnimationsTab />,
          errorElement: <NotFoundPage />,
        }, */
      ],
    },
  ],
  { basename },
);
