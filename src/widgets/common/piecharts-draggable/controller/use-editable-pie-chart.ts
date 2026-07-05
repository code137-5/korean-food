import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  getPointerAngleFromSvgPoint,
  getSvgPointerPoint,
} from "../model/geometry";
import {
  getBoundaryAngles,
  getSliceIndexAtAngle,
  moveItem,
  resizeBoundary,
} from "../model/operations";
import type {
  DragState,
  EditablePieChartProps,
  PieDragState,
  PieDatum,
} from "../model/types";

export function useEditablePieChart({
  getMinValue,
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
  const boundaryAngles = useMemo(
    () => getBoundaryAngles(data, total),
    [data, total],
  );
  const getDatumMinValue = useCallback(
    (datum: PieDatum) => getMinValue?.(datum) ?? minValue,
    [getMinValue, minValue],
  );

  const updateBoundary = useCallback(
    (boundaryIndex: number, pointerAngle: number) => {
      setData((currentData) => {
        const nextData = resizeBoundary(
          currentData,
          boundaryIndex,
          pointerAngle,
          getDatumMinValue,
        );

        if (nextData !== currentData) {
          onChange?.(nextData);
        }

        return nextData;
      });
    },
    [getDatumMinValue, onChange],
  );

  const handleBoundaryPointerMove = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      if (!dragState || event.pointerId !== dragState.pointerId) {
        return;
      }

      const svg = svgRef.current;

      if (!svg) {
        return;
      }

      const pointerAngle = getPointerAngleFromSvgPoint(
        getSvgPointerPoint(event.nativeEvent, svg),
      );

      updateBoundary(dragState.boundaryIndex, pointerAngle);
    },
    [dragState, updateBoundary],
  );

  const stopBoundaryDragging = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      if (dragState && event.pointerId === dragState.pointerId) {
        svgRef.current?.releasePointerCapture(event.pointerId);
        setDragState(null);
      }
    },
    [dragState],
  );

  const startBoundaryDragging = useCallback(
    (boundaryIndex: number, pointerId: number) => {
      setDragState({
        boundaryIndex,
        pointerId,
      });
    },
    [],
  );

  const startPieDragging = useCallback(
    (sourceIndex: number, pointerId: number) => {
      if (dragState) {
        return;
      }

      setPieDragState({
        sourceIndex,
        targetIndex: sourceIndex,
        pointerId,
      });
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

      const pointerAngle = getPointerAngleFromSvgPoint(
        getSvgPointerPoint(event.nativeEvent, svg),
      );
      const targetIndex = getSliceIndexAtAngle(data, total, pointerAngle);

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
    [data, pieDragState, total],
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

  return {
    boundaryAngles,
    data,
    dragState,
    handleBoundaryPointerMove,
    handlePiePointerMove,
    pieDragState,
    startBoundaryDragging,
    startPieDragging,
    stopBoundaryDragging,
    stopPieDragging,
    svgRef,
    total,
  };
}
