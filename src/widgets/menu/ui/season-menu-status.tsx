import type { ReactNode } from "react";

type SeasonMenuStatusProps = {
  title: string;
  description?: string;
};

export function SeasonMenuStatus({
  title,
  description,
}: SeasonMenuStatusProps) {
  return (
    <section className="flex h-full items-center justify-center p-6 text-center">
      <CardShell>
        <p className="text-sm font-semibold tracking-[0.3em] text-stone-500">
          SEASON CUISINE
        </p>
        <h2 className="mt-4 text-3xl font-bold text-stone-900">{title}</h2>
        {description && (
          <p className="mt-4 text-base leading-7">{description}</p>
        )}
      </CardShell>
    </section>
  );
}

function CardShell({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[2rem] border border-stone-300 bg-[#f5ead7] px-6 py-10 text-stone-700 shadow-xl">
      {children}
    </div>
  );
}
