import { ChefHat, CircleDot, HandPlatter, Soup, Sparkles } from "lucide-react";
import {
  DetailInfoTable,
  DetailPanel,
  DetailPanelBody,
  DetailPanelHeader,
  type DetailInfoRow,
} from "@/shared/ui/detail-panel";

const detailRows: DetailInfoRow[] = [
  {
    icon: <Soup aria-hidden="true" />,
    label: "주요 재료",
    value: "소갈비 · 무 · 당근 · 표고버섯 · 밤 · 대추",
  },
  {
    icon: <Sparkles aria-hidden="true" />,
    label: "맛의 특징",
    value: "깊은 감칠맛 · 은은한 단맛 · 부드러운 식감",
  },
  {
    icon: <HandPlatter aria-hidden="true" />,
    label: "추천 상황",
    value: "잔치 · 기념일 · 손님맞이",
  },
  {
    icon: <ChefHat aria-hidden="true" />,
    label: "어울리는 곁들임",
    value: "흰쌀밥 · 나물 반찬 · 맑은 국",
  },
];

const paragraphs = [
  "갈비찜은 소갈비를 간장 베이스의 양념에 오래 조려, 부드러운 식감과 깊은 감칠맛을 완성한 한국의 대표 궁중·잔치 음식이다.",
  "달콤한 무와 당근, 버섯, 밤, 대추가 어우러져 풍성한 향과 균형 잡힌 맛을 선사하며, 특별한 날 상차림의 품격을 더한다.",
  "천천히 익혀낸 갈비의 결은 입안에서 부드럽게 풀리고, 은은한 단맛과 짭조름한 양념이 조화롭게 이어진다.",
];

export function FoodDetail() {
  return (
    <DetailPanel>
      <DetailPanelHeader
        eyebrow="Seasonal Cuisine"
        title="갈비찜"
        subtitle="정성으로 천천히 빚어낸 서울식 간장상의 깊은 맛"
        marker={<CircleDot aria-hidden="true" />}
      />
      <DetailPanelBody paragraphs={paragraphs} />
      <DetailInfoTable rows={detailRows} />
    </DetailPanel>
  );
}
