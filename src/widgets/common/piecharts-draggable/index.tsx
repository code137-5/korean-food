import { initialData } from "./model/sample-data";
import { EditablePieChart } from "./view/editable-pie-chart";

export { EditablePieChart };
export type { EditablePieChartProps, PieDatum } from "./model/types";

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
