import { Link } from "lucide-react";
import { ResultActionButton } from "./result-action-button";

export function CopyLinkButton() {
  return <ResultActionButton icon={Link} label="링크 복사" />;
}
