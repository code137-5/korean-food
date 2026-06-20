import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSeasonCuisinesQuery, useSeasonStore } from "@/entities/season";
import { SeasonMenuStatus } from "@/widgets/menu/ui/season-menu-status";

export function SeasonMenu() {
  const { t } = useTranslation("season");
  const navigate = useNavigate();
  const season = useSeasonStore((s) => s.selectedSeason);
  const { data, isError, isLoading } = useSeasonCuisinesQuery();
  const content = season && data ? data[season] : null;

  if (isLoading) {
    return <SeasonMenuStatus title={t("menu.loading")} />;
  }

  if (isError) {
    return (
      <SeasonMenuStatus
        title={t("menu.errorTitle")}
        description={t("menu.errorDescription")}
      />
    );
  }

  if (!content) {
    return (
      <SeasonMenuStatus
        title={t("menu.emptyTitle")}
        description={t("menu.emptyDescription")}
      />
    );
  }

  return (
    <section className="h-full overflow-y-auto p-6 text-stone-900">
      <article className="min-h-full rounded-[2rem] border border-stone-300 bg-[#f5ead7] px-7 py-9 shadow-2xl">
        <header>
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-900 text-lg font-semibold text-white">
              {t(`${content.code}.label`)}
            </span>
            <h2 className="text-4xl font-bold tracking-tight">
              {t(`${content.code}.title`)}
            </h2>
          </div>

          <div className="mt-7 h-px bg-stone-400" />

          <p className="mt-6 text-lg leading-8 text-stone-700">
            {t(`${content.code}.subtitle`)}
          </p>
        </header>

        <div className="mt-8 space-y-6">
          {content.items.map((item, index) => (
            <section key={item.code}>
              <div className="flex gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-stone-500 text-lg font-semibold text-stone-700">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {t(`${content.code}.items.${item.code}.title`)}
                  </h3>
                  <p className="mt-2 text-base leading-7 text-stone-700">
                    {t(`${content.code}.items.${item.code}.description`)}
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
            {t("menu.footer")}
          </p>
          <Button
            type="button"
            size="lg"
            className="mt-6 w-full bg-red-900 text-white hover:bg-red-950"
            onClick={() => navigate(`/cuisines/seasons/${content.code}`)}
          >
            {t("menu.viewCuisine")}
            <ArrowRight aria-hidden="true" />
          </Button>
        </footer>
      </article>
    </section>
  );
}
