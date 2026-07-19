import { useCallback, useMemo } from "react";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  type PieSectorShapeProps,
} from "recharts";
import { resolvePublicAssetUrl } from "@/shared/lib/url";
import { useEditablePieChart } from "../controller/use-editable-pie-chart";
import {
  CHART_CENTER,
  FULL_ANGLE,
  INNER_RADIUS,
  OUTER_RADIUS,
  START_ANGLE,
  VIEWBOX_SIZE,
} from "../model/constants";
import { polarToCartesian, valueToAngle } from "../model/geometry";
import type { EditablePieChartProps } from "../model/types";
import { BoundaryHandles } from "./boundary-handles";
import { PieSliceShape } from "./pie-slice-shape";

const THUMBNAIL_IMAGE_SIZE = 84;

function getResponsiveRadius(radius: number): string {
  return `${(radius / CHART_CENTER) * 100}%`;
}

function getThumbnailImageItems(data: EditablePieChartProps["initialData"]) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (INNER_RADIUS + OUTER_RADIUS) / 2;
  let accumulatedAngle = START_ANGLE;

  if (total <= 0) {
    return [];
  }

  return data.flatMap((item) => {
    if (!item.thumbnailImageUrl) {
      accumulatedAngle += valueToAngle(item.value, total);
      return [];
    }

    const angle = valueToAngle(item.value, total);
    const point = polarToCartesian(
      CHART_CENTER,
      CHART_CENTER,
      radius,
      accumulatedAngle + angle / 2,
    );
    accumulatedAngle += angle;

    return [
      {
        id: item.id,
        name: item.name,
        src: resolvePublicAssetUrl(item.thumbnailImageUrl),
        x: (point.x / VIEWBOX_SIZE) * 100,
        y: (point.y / VIEWBOX_SIZE) * 100,
      },
    ];
  });
}

export function EditablePieChart(props: EditablePieChartProps) {
  const chart = useEditablePieChart(props);
  const thumbnailImageItems = useMemo(
    () => getThumbnailImageItems(chart.data),
    [chart.data],
  );
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
      <div className="pointer-events-none absolute inset-0">
        {thumbnailImageItems.map((item) => (
          <div
            key={item.id}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
          >
            <img
              alt=""
              aria-label={item.name}
              className="object-contain"
              draggable={false}
              src={item.src}
              style={{
                height: THUMBNAIL_IMAGE_SIZE,
                width: THUMBNAIL_IMAGE_SIZE,
              }}
            />
            <span className="max-w-24 truncate rounded bg-black/55 px-1.5 py-0.5 text-xs font-semibold leading-4 text-white shadow">
              {item.name}
            </span>
          </div>
        ))}
      </div>

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
