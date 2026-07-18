const ABSOLUTE_URL_PATTERN = /^(?:[a-z][a-z\d+\-.]*:)?\/\//i;

export function resolvePublicAssetUrl(url: string): string {
  if (
    ABSOLUTE_URL_PATTERN.test(url) ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  return `${import.meta.env.BASE_URL}${url.replace(/^\/+/, "")}`;
}
