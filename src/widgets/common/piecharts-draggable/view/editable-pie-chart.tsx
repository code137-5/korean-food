import { useCallback } from "react";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  type PieSectorShapeProps,
} from "recharts";
import { useEditablePieChart } from "../controller/use-editable-pie-chart";
import {
  CHART_CENTER,
  FULL_ANGLE,
  INNER_RADIUS,
  OUTER_RADIUS,
  START_ANGLE,
} from "../model/constants";
import type { EditablePieChartProps } from "../model/types";
import { BoundaryHandles } from "./boundary-handles";
import { PieSliceShape } from "./pie-slice-shape";

function getResponsiveRadius(radius: number): string {
  return `${(radius / CHART_CENTER) * 100}%`;
}

export function EditablePieChart(props: EditablePieChartProps) {
  const chart = useEditablePieChart(props);
  const renderPieShape = useCallback(
    (shapeProps: PieSectorShapeProps) => (
      <PieSliceShape
        {...shapeProps}
        boundaryDragState={chart.dragState}
        pieDragState={chart.pieDragState}
        onStartPieDrag={chart.startPieDragging}
      />
    ),
    [chart.dragState, chart.pieDragState, chart.startPieDragging],
  );

  return (
    <div
      className="relative h-full w-full select-none"
      onPointerMove={chart.handlePiePointerMove}
      onPointerUp={chart.stopPieDragging}
      onPointerCancel={chart.stopPieDragging}
    >
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chart.data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={getResponsiveRadius(INNER_RADIUS)}
            outerRadius={getResponsiveRadius(OUTER_RADIUS)}
            startAngle={START_ANGLE}
            endAngle={START_ANGLE + FULL_ANGLE}
            isAnimationActive={false}
            shape={renderPieShape}
          />
          <Tooltip formatter={(value) => Number(value).toFixed(2)} />
        </PieChart>
      </ResponsiveContainer>

      <BoundaryHandles
        boundaryAngles={chart.boundaryAngles}
        data={chart.data}
        dragState={chart.dragState}
        svgRef={chart.svgRef}
        onPointerMove={chart.handleBoundaryPointerMove}
        onPointerUp={chart.stopBoundaryDragging}
        onStartDrag={chart.startBoundaryDragging}
      />
    </div>
  );
}
