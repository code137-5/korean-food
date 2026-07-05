import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  type PieSectorShapeProps,
} from "recharts";

type PieDatum = {
  id: string;
  name: string;
  value: number;
  fill: string;
};

type DragState = {
  boundaryIndex: number;
  pointerId: number;
} | null;

type PieDragState = {
  sourceIndex: number;
  targetIndex: number;
  pointerId: number;
} | null;

type EditablePieChartProps = {
  initialData: PieDatum[];
  minValue?: number;
  onChange?: (data: PieDatum[]) => void;
};

const FULL_ANGLE = 360;
const START_ANGLE = 90;

function normalizeAngle(angle: number): number {
  return ((angle % FULL_ANGLE) + FULL_ANGLE) % FULL_ANGLE;
}

/**
 * 화면 좌표를 Recharts 스타일의 각도로 변환합니다.
 *
 * - 0도: 오른쪽
 * - 90도: 위쪽
 * - 반시계 방향 증가
 */
function getPointerAngle(
  clientX: number,
  clientY: number,
  cx: number,
  cy: number,
): number {
  const dx = clientX - cx;
  const dy = clientY - cy;

  return normalizeAngle(-Math.atan2(dy, dx) * (180 / Math.PI));
}

function valueToAngle(value: number, total: number): number {
  return total <= 0 ? 0 : (value / total) * FULL_ANGLE;
}

function angleToValue(angle: number, total: number): number {
  return (angle / FULL_ANGLE) * total;
}

function moveItem<TItem>(items: TItem[], fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

/**
 * 기준 시작각에서 targetAngle까지 반시계 방향 거리.
 */
function getAngleDistance(startAngle: number, targetAngle: number): number {
  return normalizeAngle(targetAngle - startAngle);
}

/**
 * SVG 좌표에서 지정 각도의 점을 구합니다.
 */
function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
) {
  const radians = (-angle * Math.PI) / 180;

  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

export function EditablePieChart({
  initialData,
  minValue = 1,
  onChange,
}: EditablePieChartProps) {
  const [data, setData] = useState<PieDatum[]>(initialData);
  const [dragState, setDragState] = useState<DragState>(null);
  const [pieDragState, setPieDragState] = useState<PieDragState>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data],
  );

  /**
   * 각 조각의 끝 경계 각도를 계산합니다.
   *
   * boundaryAngles[i]는 data[i]의 끝이자
   * data[i + 1]의 시작 경계입니다.
   */
  const boundaryAngles = useMemo(() => {
    let accumulatedAngle = START_ANGLE;

    return data.map((item) => {
      accumulatedAngle += valueToAngle(item.value, total);
      return normalizeAngle(accumulatedAngle);
    });
  }, [data, total]);

  const getSliceIndexAtAngle = useCallback(
    (angle: number) => {
      const pointerDistance = getAngleDistance(START_ANGLE, angle);
      let accumulatedAngle = 0;

      for (let index = 0; index < data.length; index += 1) {
        accumulatedAngle += valueToAngle(data[index].value, total);

        if (pointerDistance <= accumulatedAngle) {
          return index;
        }
      }

      return data.length - 1;
    },
    [data, total],
  );

  const updateBoundary = useCallback(
    (boundaryIndex: number, pointerAngle: number) => {
      setData((currentData) => {
        if (currentData.length < 2) {
          return currentData;
        }

        const currentTotal = currentData.reduce(
          (sum, item) => sum + item.value,
          0,
        );

        if (currentTotal <= 0) {
          return currentData;
        }

        const leftIndex = boundaryIndex;
        const rightIndex = (boundaryIndex + 1) % currentData.length;

        /**
         * 마지막 조각과 첫 조각 사이 경계도 존재하므로
         * 원형 인덱스를 사용합니다.
         */
        const leftValue = currentData[leftIndex].value;
        const rightValue = currentData[rightIndex].value;
        const pairTotal = leftValue + rightValue;

        if (pairTotal < minValue * 2) {
          return currentData;
        }

        /**
         * 왼쪽 조각이 시작되는 각도를 구합니다.
         *
         * boundaryIndex === 0이면 data[0] 앞쪽은 START_ANGLE입니다.
         * 그 외에는 이전 조각들의 합으로 계산합니다.
         */
        let leftStartAngle = START_ANGLE;

        for (let i = 0; i < leftIndex; i += 1) {
          leftStartAngle += valueToAngle(currentData[i].value, currentTotal);
        }

        /**
         * 일반 경계:
         *   왼쪽 조각 시작점부터 포인터까지의 각도
         *
         * 마지막 경계:
         *   마지막 조각과 첫 조각 사이의 경계이므로
         *   pair가 차트 시작점을 가로질러 배치됩니다.
         *
         * 여기서는 모든 경계를 동일하게 처리할 수 있도록
         * 원형 각도 거리를 사용합니다.
         */
        const pairAngle = valueToAngle(pairTotal, currentTotal);

        const pointerDistance = getAngleDistance(
          normalizeAngle(leftStartAngle),
          pointerAngle,
        );

        const minAngle = valueToAngle(minValue, currentTotal);

        const clampedLeftAngle = Math.min(
          Math.max(pointerDistance, minAngle),
          pairAngle - minAngle,
        );

        /**
         * 포인터가 pair 범위 밖으로 크게 이동한 경우
         * 반대편 각도로 튀는 것을 방지합니다.
         */
        if (pointerDistance > pairAngle + Math.max(20, minAngle)) {
          return currentData;
        }

        const nextLeftValue = angleToValue(clampedLeftAngle, currentTotal);

        const nextRightValue = pairTotal - nextLeftValue;

        const nextData = currentData.map((item) => ({
          ...item,
        }));

        nextData[leftIndex].value = nextLeftValue;
        nextData[rightIndex].value = nextRightValue;

        onChange?.(nextData);

        return nextData;
      });
    },
    [minValue, onChange],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      if (!dragState || event.pointerId !== dragState.pointerId) {
        return;
      }

      const svg = svgRef.current;

      if (!svg) {
        return;
      }

      const rect = svg.getBoundingClientRect();

      /**
       * viewBox가 0 0 400 400일 때,
       * 브라우저 좌표를 SVG 내부 좌표로 변환합니다.
       */
      const svgX = ((event.clientX - rect.left) / rect.width) * 400;
      const svgY = ((event.clientY - rect.top) / rect.height) * 400;

      const pointerAngle = getPointerAngle(svgX, svgY, 200, 200);

      updateBoundary(dragState.boundaryIndex, pointerAngle);
    },
    [dragState, updateBoundary],
  );

  const stopDragging = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      if (dragState && event.pointerId === dragState.pointerId) {
        svgRef.current?.releasePointerCapture(event.pointerId);

        setDragState(null);
      }
    },
    [dragState],
  );

  const handlePiePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!pieDragState || event.pointerId !== pieDragState.pointerId) {
        return;
      }

      const svg = svgRef.current;

      if (!svg) {
        return;
      }

      const rect = svg.getBoundingClientRect();
      const svgX = ((event.clientX - rect.left) / rect.width) * 400;
      const svgY = ((event.clientY - rect.top) / rect.height) * 400;
      const pointerAngle = getPointerAngle(svgX, svgY, 200, 200);
      const targetIndex = getSliceIndexAtAngle(pointerAngle);

      setPieDragState((currentState) => {
        if (!currentState || currentState.targetIndex === targetIndex) {
          return currentState;
        }

        return {
          ...currentState,
          targetIndex,
        };
      });
    },
    [getSliceIndexAtAngle, pieDragState],
  );

  const stopPieDragging = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!pieDragState || event.pointerId !== pieDragState.pointerId) {
        return;
      }

      setData((currentData) => {
        const nextData = moveItem(
          currentData,
          pieDragState.sourceIndex,
          pieDragState.targetIndex,
        );

        if (nextData !== currentData) {
          onChange?.(nextData);
        }

        return nextData;
      });
      setPieDragState(null);
    },
    [onChange, pieDragState],
  );

  const renderPieShape = useCallback(
    (props: PieSectorShapeProps) => {
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
          cursor={dragState ? "default" : "grab"}
          fillOpacity={isDraggedSlice ? 0.72 : 1}
          stroke={isDropTarget ? "#0f172a" : "#ffffff"}
          strokeWidth={isDropTarget ? 5 : 2}
          onPointerDown={(event: ReactPointerEvent<SVGPathElement>) => {
            if (dragState || typeof index !== "number") {
              return;
            }

            event.preventDefault();
            event.stopPropagation();
            event.currentTarget.setPointerCapture(event.pointerId);

            setPieDragState({
              sourceIndex: index,
              targetIndex: index,
              pointerId: event.pointerId,
            });
          }}
        />
      );
    },
    [dragState, pieDragState],
  );

  return (
    <div
      onPointerMove={handlePiePointerMove}
      onPointerUp={stopPieDragging}
      onPointerCancel={stopPieDragging}
      style={{
        width: "100%",
        height: 480,
        userSelect: "none",
      }}
    >
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={145}
            startAngle={START_ANGLE}
            endAngle={START_ANGLE + FULL_ANGLE}
            isAnimationActive={false}
            shape={renderPieShape}
          />

          <Tooltip formatter={(value) => Number(value).toFixed(2)} />

          {/*
            Recharts가 생성하는 SVG 내부에 직접 넣습니다.

            ResponsiveContainer의 실제 svg를 정확히 참조하기 위해
            투명한 overlay svg를 별도로 두는 방식도 가능하지만,
            아래 예시는 ForeignObject 없이 동일 좌표계의 SVG를
            겹쳐 놓는 구조로 작성할 수 있도록 wrapper를 분리하는
            것이 더 안전합니다.
          */}
        </PieChart>
      </ResponsiveContainer>

      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid meet"
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
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
          const lineStart = polarToCartesian(200, 200, 80, angle);

          const lineEnd = polarToCartesian(200, 200, 159, angle);

          const handlePoint = polarToCartesian(200, 200, 165, angle);

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

                setDragState({
                  boundaryIndex,
                  pointerId: event.pointerId,
                });
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

              {/*
                  시각적 핸들
                */}
              <circle
                cx={handlePoint.x}
                cy={handlePoint.y}
                r={isDragging ? 9 : 7}
                fill="#ffffff"
                stroke="#0f172a"
                strokeWidth={3}
              />

              {/*
                  작은 핸들의 실제 터치 영역을 확장합니다.
                */}
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

      <div
        style={{
          display: "grid",
          gap: 8,
          marginTop: 12,
        }}
      >
        {data.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{item.name}</span>
            <strong>
              {item.value.toFixed(2)}
              {" / "}
              {((item.value / total) * 100).toFixed(1)}%
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

const initialData = [
  {
    id: "design",
    name: "Design",
    value: 30,
    fill: "#6366f1",
  },
  {
    id: "frontend",
    name: "Frontend",
    value: 25,
    fill: "#22c55e",
  },
  {
    id: "backend",
    name: "Backend",
    value: 20,
    fill: "#f59e0b",
  },
  {
    id: "qa",
    name: "QA",
    value: 25,
    fill: "#ef4444",
  },
];

export default function DraggablePiecharts() {
  return (
    <div
      style={{
        position: "relative",
        width: 480,
      }}
    >
      <EditablePieChart
        initialData={initialData}
        minValue={3}
        onChange={(nextData) => {
          console.log(nextData);
        }}
      />
    </div>
  );
}
