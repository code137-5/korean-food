import type { PieDatum } from "../model/types";

type ValueListProps = {
  data: PieDatum[];
  total: number;
};

export function ValueList({ data, total }: ValueListProps) {
  return (
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
  );
}
