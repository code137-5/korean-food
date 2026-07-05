import { CHART_CENTER, FULL_ANGLE, VIEWBOX_SIZE } from "./constants";
import type { Point } from "./types";

export function normalizeAngle(angle: number): number {
  return ((angle % FULL_ANGLE) + FULL_ANGLE) % FULL_ANGLE;
}

export function getPointerAngle(
  clientX: number,
  clientY: number,
  cx: number,
  cy: number,
): number {
  const dx = clientX - cx;
  const dy = clientY - cy;

  return normalizeAngle(-Math.atan2(dy, dx) * (180 / Math.PI));
}

export function valueToAngle(value: number, total: number): number {
  return total <= 0 ? 0 : (value / total) * FULL_ANGLE;
}

export function angleToValue(angle: number, total: number): number {
  return (angle / FULL_ANGLE) * total;
}

export function getAngleDistance(
  startAngle: number,
  targetAngle: number,
): number {
  return normalizeAngle(targetAngle - startAngle);
}

export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
): Point {
  const radians = (-angle * Math.PI) / 180;

  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

export function getSvgPointerPoint(
  event: Pick<PointerEvent, "clientX" | "clientY">,
  svg: SVGSVGElement,
): Point {
  const rect = svg.getBoundingClientRect();

  return {
    x: ((event.clientX - rect.left) / rect.width) * VIEWBOX_SIZE,
    y: ((event.clientY - rect.top) / rect.height) * VIEWBOX_SIZE,
  };
}

export function getPointerAngleFromSvgPoint(point: Point): number {
  return getPointerAngle(point.x, point.y, CHART_CENTER, CHART_CENTER);
}
