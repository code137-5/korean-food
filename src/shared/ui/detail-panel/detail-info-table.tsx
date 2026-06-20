import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

export type DetailInfoRow = {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
};

type DetailInfoTableProps = {
  rows: DetailInfoRow[];
};

export function DetailInfoTable({ rows }: DetailInfoTableProps) {
  return (
    <section className="mt-auto pt-2">
      <div className="border-y border-[#5b442b]/80">
        {rows.map((row, index) => (
          <div key={row.label}>
            <div className="grid grid-cols-[4rem_9rem_1fr] items-center py-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#9f793e] text-[#d7ae67] [&_svg]:h-5 [&_svg]:w-5">
                {row.icon}
              </div>
              <strong className="text-lg font-semibold text-[#d7ae67]">
                {row.label}
              </strong>
              <p className="text-lg text-[#e5d5ba]">{row.value}</p>
            </div>
            {index < rows.length - 1 ? (
              <Separator className="bg-[#5b442b]/70" />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
