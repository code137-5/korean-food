import { createContext } from "react";
import type { NavigateOptions, To } from "react-router-dom";

export type TransitionNavigate = (
  to: To | number,
  options?: NavigateOptions,
) => void;

export const RouteTransitionContext =
  createContext<TransitionNavigate | null>(null);
