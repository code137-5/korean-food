import { createBrowserRouter } from "react-router-dom";
import App from "@/app/App";
import NotFoundPage from "@/pages/not-found/NotFoundPage";
import { HomePage } from "@/pages/home/page";
import { SeasonsPage } from "@/pages/seasons/page";
import { SpringPage } from "@/pages/seasons/spring/page";
import { AutumnPage } from "@/pages/seasons/autumn/page";
import { SummerPage } from "@/pages/seasons/summer/page";
import { WinterPage } from "@/pages/seasons/winter/page";
import { SeasonCuisinePage } from "@/pages/cuisines/seasons/page";
import type { ThreeSceneType } from "@/3d/scene/types";
import { BibimCraftPage } from "@/pages/cuisines/bibim/craft/page";
import { BibimCuisinePage } from "@/pages/cuisines/bibim/page";
import { UITestBedPage } from "@/pages/ui-test-bed/page";

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
        {
          index: true,
          element: <HomePage />,
          errorElement: <NotFoundPage />,
          handle: { scene: "home" satisfies ThreeSceneType },
        },
        {
          path: "cuisines/seasons/:season",
          element: <SeasonCuisinePage />,
          errorElement: <NotFoundPage />,
          handle: { scene: "cuisine" satisfies ThreeSceneType },
        },
        {
          path: "cuisines/bibim",
          element: <BibimCuisinePage />,
          errorElement: <NotFoundPage />,
          handle: { scene: "bibim" satisfies ThreeSceneType },
        },
        {
          path: "cuisines/bibim/craft",
          element: <BibimCraftPage />,
          errorElement: <NotFoundPage />,
          handle: { scene: "bibim.craft" satisfies ThreeSceneType },
        },
        {
          path: "seasons",
          element: <SeasonsPage />,
          errorElement: <NotFoundPage />,
          handle: { scene: "home" satisfies ThreeSceneType },
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
        {
          path: "ui-test-bed",
          element: <UITestBedPage />,
          errorElement: <NotFoundPage />,
          handle: { scene: "home" satisfies ThreeSceneType },
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
