import { BackRouteButton } from "@/widgets/common/back-route-button";
import { useTranslation } from "react-i18next";
import { CopyLinkButton } from "./ui/copy-link-button";
import { DownloadGlbButton } from "./ui/download-glb-button";
import { RemakeButton } from "./ui/remake-button";
import { SnsShareButton } from "./ui/sns-share-button";

export function BibimCraftResultPage() {
  const { t } = useTranslation("bibim-craft-result");

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-5 top-5 pointer-events-auto">
        <BackRouteButton
          url="/cuisines/bibim/craft"
          label={t("navigation.back")}
        />
      </div>
      <section className="absolute right-5 bottom-5 ui-textured-rounded-wood pointer-events-auto w-[min(480px,calc(100vw-40px))] px-8 pt-7 pb-5 text-[#f5c982]">
        <h2 className="mb-5 text-center text-2xl font-semibold">{t("title")}</h2>
        <div className="grid grid-cols-2 gap-4">
          <SnsShareButton />
          <CopyLinkButton />
          <DownloadGlbButton />
          <RemakeButton />
        </div>
      </section>
    </div>
  );
}
