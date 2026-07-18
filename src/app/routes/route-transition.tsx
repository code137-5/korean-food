import {
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  RouteTransitionContext,
  type TransitionNavigate,
} from "@/app/routes/route-transition-context";

const FADE_DURATION_MS = 520;
const COVERED_DURATION_MS = 1000;

type TransitionPhase = "idle" | "covering" | "covered" | "revealing";

function wait(duration: number) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

export function RouteTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const isTransitioning = useRef(false);

  const transitionNavigate = useCallback<TransitionNavigate>(
    (to, options) => {
      if (isTransitioning.current) {
        return;
      }

      isTransitioning.current = true;

      void (async () => {
        setPhase("covering");
        await wait(FADE_DURATION_MS);

        setPhase("covered");

        if (typeof to === "number") {
          navigate(to);
        } else {
          navigate(to, options);
        }

        await wait(COVERED_DURATION_MS);

        setPhase("revealing");
        await wait(FADE_DURATION_MS);

        setPhase("idle");
        isTransitioning.current = false;
      })();
    },
    [navigate],
  );

  return (
    <RouteTransitionContext.Provider value={transitionNavigate}>
      {children}
      {phase !== "idle" && (
        <div
          className={`route-transition-overlay route-transition-overlay--${phase}`}
          aria-hidden="true"
        />
      )}
    </RouteTransitionContext.Provider>
  );
}
