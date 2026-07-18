import { Link } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ResultActionButton } from "./result-action-button";

const COPY_COMPLETE_MESSAGE = "복사완료 !";
const LABEL_SCALE_TRANSITION_MS = 180;
const COPY_COMPLETE_VISIBLE_MS = 800;

async function copyCurrentUrlToClipboard() {
  const url = window.location.href;

  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      return;
    }
  } catch {
    // Fall back for browsers that expose the API but block it by permission.
  }

  const textarea = document.createElement("textarea");
  textarea.value = url;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
}

export function CopyLinkButton() {
  const { t } = useTranslation("bibim-craft-result");
  const [isCopied, setIsCopied] = useState(false);
  const [isLabelVisible, setIsLabelVisible] = useState(true);
  const timeoutRefs = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  const clearCopyAnimationTimeouts = () => {
    timeoutRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutRefs.current = [];
  };

  const scheduleCopyAnimation = () => {
    clearCopyAnimationTimeouts();
    setIsLabelVisible(false);

    const showCopiedTimeout = window.setTimeout(() => {
      setIsCopied(true);
      setIsLabelVisible(true);
    }, LABEL_SCALE_TRANSITION_MS);

    const hideCopiedTimeout = window.setTimeout(() => {
      setIsLabelVisible(false);
    }, LABEL_SCALE_TRANSITION_MS + COPY_COMPLETE_VISIBLE_MS);

    const restoreDefaultTimeout = window.setTimeout(() => {
      setIsCopied(false);
      setIsLabelVisible(true);
    }, LABEL_SCALE_TRANSITION_MS * 2 + COPY_COMPLETE_VISIBLE_MS);

    timeoutRefs.current = [
      showCopiedTimeout,
      hideCopiedTimeout,
      restoreDefaultTimeout,
    ];
  };

  const handleCopyLink = async () => {
    await copyCurrentUrlToClipboard();
    scheduleCopyAnimation();
  };

  return (
    <ResultActionButton
      icon={Link}
      label={isCopied ? COPY_COMPLETE_MESSAGE : t("actions.copyLink")}
      labelClassName={`origin-center transform-gpu transition-transform duration-200 ease-out ${
        isLabelVisible ? "scale-100" : "scale-0"
      }`}
      onClick={() =>
        void handleCopyLink().catch((error: unknown) => {
          console.error("Failed to copy URL to clipboard.", error);
        })
      }
    />
  );
}
