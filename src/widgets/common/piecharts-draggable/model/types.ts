export type PieDatum = {
  id: string;
  name: string;
  value: number;
  fill: string;
};

export type DragState = {
  boundaryIndex: number;
  pointerId: number;
} | null;

export type PieDragState = {
  sourceIndex: number;
  targetIndex: number;
  pointerId: number;
} | null;

export type EditablePieChartProps = {
  initialData: PieDatum[];
  getMinValue?: (datum: PieDatum) => number;
  minValue?: number;
  onChange?: (data: PieDatum[]) => void;
};

export type Point = {
  x: number;
  y: number;
};
