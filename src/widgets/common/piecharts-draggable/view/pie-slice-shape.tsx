import { type PointerEvent as ReactPointerEvent } from "react";
import { Sector, type PieSectorShapeProps } from "recharts";
import type { DragState, PieDragState } from "../model/types";

type PieSliceShapeProps = PieSectorShapeProps & {
  boundaryDragState: DragState;
  pieDragState: PieDragState;
  onStartPieDrag: (sourceIndex: number, pointerId: number) => void;
};

export function PieSliceShape({
  boundaryDragState,
  pieDragState,
  onStartPieDrag,
  ...props
}: PieSliceShapeProps) {
  const index = props.index;
  const isDraggedSlice =
    typeof index === "number" && pieDragState?.sourceIndex === index;
  const isDropTarget =
    typeof index === "number" &&
    pieDragState?.sourceIndex !== index &&
    pieDragState?.targetIndex === index;

  return (
    <Sector
      {...props}
      cursor={boundaryDragState ? "default" : "grab"}
      fillOpacity={isDraggedSlice ? 0.72 : 1}
      stroke={isDropTarget ? "#0f172a" : "#ffffff"}
      strokeWidth={isDropTarget ? 5 : 2}
      onPointerDown={(event: ReactPointerEvent<SVGPathElement>) => {
        if (boundaryDragState || typeof index !== "number") {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        onStartPieDrag(index, event.pointerId);
      }}
    />
  );
}
