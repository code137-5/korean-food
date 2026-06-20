import type { ReactNode } from "react";
import {
  ChefHat,
  CircleDot,
  HandPlatter,
  Soup,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  useCuisineDetailQuery,
  type CuisineDetailIcon,
  type CuisineDetailMarkerIcon,
} from "@/entities/cuisine-detail";
import {
  DetailInfoTable,
  DetailPanel,
  DetailPanelBody,
  DetailPanelHeader,
  type DetailInfoRow,
} from "@/shared/ui/detail-panel";

const infoIcons: Record<CuisineDetailIcon, ReactNode> = {
  ingredients: <Soup aria-hidden="true" />,
  taste: <Sparkles aria-hidden="true" />,
  occasion: <HandPlatter aria-hidden="true" />,
  pairing: <ChefHat aria-hidden="true" />,
};

const markerIcons: Record<CuisineDetailMarkerIcon, ReactNode> = {
  circle: <CircleDot aria-hidden="true" />,
};

type FoodDetailProps = {
  cuisineCode: string | null;
};

export function FoodDetail({ cuisineCode }: FoodDetailProps) {
  const { t } = useTranslation("cuisine-detail");
  const { data: detail, isError, isLoading } = useCuisineDetailQuery(cuisineCode);

  if (isLoading) {
    return (
      <DetailPanel>
        <p className="m-auto text-xl text-[#ddcfb7]">{t("status.loading")}</p>
      </DetailPanel>
    );
  }

  if (isError) {
    return (
      <DetailPanel>
        <p className="m-auto text-xl text-[#ddcfb7]">{t("status.error")}</p>
      </DetailPanel>
    );
  }

  if (!cuisineCode || !detail) {
    return (
      <DetailPanel>
        <p className="m-auto text-xl text-[#ddcfb7]">{t("status.empty")}</p>
      </DetailPanel>
    );
  }

  const paragraphResult = t(`items.${cuisineCode}.paragraphs`, {
    returnObjects: true,
  });
  const paragraphs = Array.isArray(paragraphResult)
    ? (paragraphResult as string[])
    : [];
  const detailRows: DetailInfoRow[] = detail.infoRows.map((row) => ({
    icon: infoIcons[row.icon],
    label: t(`labels.${row.labelKey}`),
    value: t(`items.${cuisineCode}.info.${row.valueKey}`),
  }));

  return (
    <DetailPanel>
      <DetailPanelHeader
        eyebrow={t(`badges.${detail.badgeKey}`)}
        title={t(`items.${cuisineCode}.title`)}
        subtitle={t(`items.${cuisineCode}.subtitle`)}
        marker={markerIcons[detail.markerIcon]}
      />
      <DetailPanelBody paragraphs={paragraphs} />
      <DetailInfoTable rows={detailRows} />
    </DetailPanel>
  );
}
