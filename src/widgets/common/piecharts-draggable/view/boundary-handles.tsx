import { type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import {
  BOUNDARY_HANDLE_RADIUS,
  BOUNDARY_LINE_RADIUS,
  CHART_CENTER,
  INNER_RADIUS,
  VIEWBOX_SIZE,
} from "../model/constants";
import { polarToCartesian } from "../model/geometry";
import type { DragState, PieDatum } from "../model/types";

type BoundaryHandlesProps = {
  boundaryAngles: number[];
  data: PieDatum[];
  dragState: DragState;
  svgRef: RefObject<SVGSVGElement | null>;
  onPointerMove: (event: ReactPointerEvent<SVGSVGElement>) => void;
  onPointerUp: (event: ReactPointerEvent<SVGSVGElement>) => void;
  onStartDrag: (boundaryIndex: number, pointerId: number) => void;
};

export function BoundaryHandles({
  boundaryAngles,
  data,
  dragState,
  svgRef,
  onPointerMove,
  onPointerUp,
  onStartDrag,
}: BoundaryHandlesProps) {
  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      preserveAspectRatio="xMidYMid meet"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: 480,
        touchAction: "none",
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      {boundaryAngles.slice(0, -1).map((angle, boundaryIndex) => {
        const lineStart = polarToCartesian(
          CHART_CENTER,
          CHART_CENTER,
          INNER_RADIUS,
          angle,
        );
        const lineEnd = polarToCartesian(
          CHART_CENTER,
          CHART_CENTER,
          BOUNDARY_LINE_RADIUS,
          angle,
        );
        const handlePoint = polarToCartesian(
          CHART_CENTER,
          CHART_CENTER,
          BOUNDARY_HANDLE_RADIUS,
          angle,
        );
        const isDragging = dragState?.boundaryIndex === boundaryIndex;

        return (
          <g
            key={`boundary-${data[boundaryIndex].id}`}
            style={{
              pointerEvents: "auto",
              cursor: isDragging ? "grabbing" : "grab",
            }}
            onPointerDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              svgRef.current?.setPointerCapture(event.pointerId);
              onStartDrag(boundaryIndex, event.pointerId);
            }}
          >
            <line
              x1={lineStart.x}
              y1={lineStart.y}
              x2={lineEnd.x}
              y2={lineEnd.y}
              stroke="rgba(15, 23, 42, 0.5)"
              strokeWidth={2}
              pointerEvents="none"
            />
            <circle
              cx={handlePoint.x}
              cy={handlePoint.y}
              r={isDragging ? 9 : 7}
              fill="#ffffff"
              stroke="#0f172a"
              strokeWidth={3}
            />
            <circle
              cx={handlePoint.x}
              cy={handlePoint.y}
              r={18}
              fill="transparent"
            />
          </g>
        );
      })}
    </svg>
  );
}
