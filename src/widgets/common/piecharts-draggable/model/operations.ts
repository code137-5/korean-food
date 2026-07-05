import { START_ANGLE } from "./constants";
import {
  angleToValue,
  getAngleDistance,
  normalizeAngle,
  valueToAngle,
} from "./geometry";
import type { PieDatum } from "./types";

export function moveItem<TItem>(
  items: TItem[],
  fromIndex: number,
  toIndex: number,
) {
  if (fromIndex === toIndex) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

export function getBoundaryAngles(data: PieDatum[], total: number) {
  let accumulatedAngle = START_ANGLE;

  return data.map((item) => {
    accumulatedAngle += valueToAngle(item.value, total);
    return normalizeAngle(accumulatedAngle);
  });
}

export function getSliceIndexAtAngle(
  data: PieDatum[],
  total: number,
  angle: number,
) {
  const pointerDistance = getAngleDistance(START_ANGLE, angle);
  let accumulatedAngle = 0;

  for (let index = 0; index < data.length; index += 1) {
    accumulatedAngle += valueToAngle(data[index].value, total);

    if (pointerDistance <= accumulatedAngle) {
      return index;
    }
  }

  return data.length - 1;
}

export function resizeBoundary(
  data: PieDatum[],
  boundaryIndex: number,
  pointerAngle: number,
  getMinValue: (datum: PieDatum) => number,
) {
  if (data.length < 2) {
    return data;
  }

  const currentTotal = data.reduce((sum, item) => sum + item.value, 0);

  if (currentTotal <= 0) {
    return data;
  }

  const leftIndex = boundaryIndex;
  const rightIndex = (boundaryIndex + 1) % data.length;
  const leftValue = data[leftIndex].value;
  const rightValue = data[rightIndex].value;
  const leftMinValue = getMinValue(data[leftIndex]);
  const rightMinValue = getMinValue(data[rightIndex]);
  const pairTotal = leftValue + rightValue;

  if (pairTotal < leftMinValue + rightMinValue) {
    return data;
  }

  let leftStartAngle = START_ANGLE;

  for (let i = 0; i < leftIndex; i += 1) {
    leftStartAngle += valueToAngle(data[i].value, currentTotal);
  }

  const pairAngle = valueToAngle(pairTotal, currentTotal);
  const pointerDistance = getAngleDistance(
    normalizeAngle(leftStartAngle),
    pointerAngle,
  );
  const leftMinAngle = valueToAngle(leftMinValue, currentTotal);
  const rightMinAngle = valueToAngle(rightMinValue, currentTotal);

  if (pointerDistance > pairAngle + Math.max(20, leftMinAngle, rightMinAngle)) {
    return data;
  }

  const clampedLeftAngle = Math.min(
    Math.max(pointerDistance, leftMinAngle),
    pairAngle - rightMinAngle,
  );
  const nextLeftValue = angleToValue(clampedLeftAngle, currentTotal);
  const nextRightValue = pairTotal - nextLeftValue;
  const nextData = data.map((item) => ({ ...item }));

  nextData[leftIndex].value = nextLeftValue;
  nextData[rightIndex].value = nextRightValue;

  return nextData;
}
