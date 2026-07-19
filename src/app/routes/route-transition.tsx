import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useBlocker,
  useNavigate,
  type BlockerFunction,
} from "react-router-dom";
import {
  RouteTransitionContext,
  type TransitionNavigate,
} from "@/app/routes/route-transition-context";

const FADE_DURATION_MS = 520;
const COVERED_DURATION_MS = 1000;

type TransitionPhase = "idle" | "covering" | "covered" | "revealing";

type RouteTransitionProviderProps = {
  children: ReactNode;
  onInitialRevealComplete?: () => void;
};

function wait(duration: number) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

export function RouteTransitionProvider({
  children,
  onInitialRevealComplete,
}: RouteTransitionProviderProps) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<TransitionPhase>("revealing");
  const isTransitioning = useRef(false);
  const initialRevealTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    initialRevealTimeoutRef.current = window.setTimeout(() => {
      setPhase("idle");
      initialRevealTimeoutRef.current = null;
      onInitialRevealComplete?.();
    }, FADE_DURATION_MS);

    return () => {
      if (initialRevealTimeoutRef.current !== null) {
        window.clearTimeout(initialRevealTimeoutRef.current);
      }
    };
  }, [onInitialRevealComplete]);

  const runTransition = useCallback((action: () => void) => {
    if (isTransitioning.current) {
      return;
    }

    if (initialRevealTimeoutRef.current !== null) {
      window.clearTimeout(initialRevealTimeoutRef.current);
      initialRevealTimeoutRef.current = null;
    }

    isTransitioning.current = true;

    void (async () => {
      setPhase("covering");
      await wait(FADE_DURATION_MS);

      setPhase("covered");
      action();

      await wait(COVERED_DURATION_MS);

      setPhase("revealing");
      await wait(FADE_DURATION_MS);

      setPhase("idle");
      isTransitioning.current = false;
    })();
  }, []);

  const shouldBlockNavigation = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) =>
      !isTransitioning.current &&
      (currentLocation.pathname !== nextLocation.pathname ||
        currentLocation.search !== nextLocation.search ||
        currentLocation.hash !== nextLocation.hash),
    [],
  );
  const blocker = useBlocker(shouldBlockNavigation);

  useEffect(() => {
    if (blocker.state !== "blocked") {
      return;
    }

    const proceed = blocker.proceed;
    const timeoutId = window.setTimeout(() => {
      runTransition(proceed);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [blocker, runTransition]);

  const transitionNavigate = useCallback<TransitionNavigate>(
    (to, options) => {
      runTransition(() => {
        if (typeof to === "number") {
          navigate(to);
        } else {
          navigate(to, options);
        }
      });
    },
    [navigate, runTransition],
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
