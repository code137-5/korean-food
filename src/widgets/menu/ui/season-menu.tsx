import { useSeasonCuisinesQuery, useSeasonStore } from "../../../entities/season";
import { SeasonMenuStatus } from "./season-menu-status";

export function SeasonMenu() {
  const season = useSeasonStore((s) => s.selectedSeason);
  const { data, isError, isLoading } = useSeasonCuisinesQuery();
  const content = season && data ? data[season] : null;

  if (isLoading) {
    return <SeasonMenuStatus title="데이터를 불러오는 중입니다" />;
  }

  if (isError) {
    return (
      <SeasonMenuStatus
        title="데이터를 불러오지 못했습니다"
        description="잠시 후 다시 시도하거나 데이터 파일을 확인하세요."
      />
    );
  }

  if (!content) {
    return (
      <SeasonMenuStatus
        title="계절을 선택하세요"
        description="3D 화면의 계절 오브젝트를 클릭하면 해당 계절의 음식 설명이 표시됩니다."
      />
    );
  }

  return (
    <section className="h-full overflow-y-auto p-6 text-stone-900">
      <article className="min-h-full rounded-[2rem] border border-stone-300 bg-[#f5ead7] px-7 py-9 shadow-2xl">
        <header>
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-900 text-lg font-semibold text-white">
              {content.label}
            </span>
            <h2 className="text-4xl font-bold tracking-tight">
              {content.title}
            </h2>
          </div>

          <div className="mt-7 h-px bg-stone-400" />

          <p className="mt-6 text-lg leading-8 text-stone-700">
            {content.subtitle}
          </p>
        </header>

        <div className="mt-8 space-y-6">
          {content.items.map((item, index) => (
            <section key={item.title}>
              <div className="flex gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-stone-500 text-lg font-semibold text-stone-700">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-base leading-7 text-stone-700">
                    {item.description}
                  </p>
                </div>
              </div>

              {index < content.items.length - 1 && (
                <div className="mt-6 h-px bg-stone-300" />
              )}
            </section>
          ))}
        </div>

        <footer className="mt-9 text-center">
          <div className="mx-auto h-px w-2/3 bg-stone-400" />
          <p className="mt-4 text-sm font-semibold tracking-[0.3em] text-stone-500">
            KOREAN SEASONAL CUISINE
          </p>
        </footer>
      </article>
    </section>
  );
}
