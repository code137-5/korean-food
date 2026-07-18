import { useContext } from "react";
import { RouteTransitionContext } from "@/app/routes/route-transition-context";

export function useRouteTransitionNavigate() {
  const navigate = useContext(RouteTransitionContext);

  if (!navigate) {
    throw new Error(
      "useRouteTransitionNavigate must be used inside RouteTransitionProvider",
    );
  }

  return navigate;
}
