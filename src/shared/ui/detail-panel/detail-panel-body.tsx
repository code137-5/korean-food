import { cn } from "@/lib/utils";

type DetailPanelBodyProps = {
  paragraphs: string[];
  className?: string;
};

export function DetailPanelBody({
  paragraphs,
  className,
}: DetailPanelBodyProps) {
  return (
    <section className={cn("mt-2 space-y-4 text-xl text-[#ddcfb7]", className)}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </section>
  );
}
