export type CuisineDetailIcon =
  | "ingredients"
  | "taste"
  | "occasion"
  | "pairing";

export type CuisineDetailMarkerIcon = "circle";

export type CuisineDetailInfoRow = {
  icon: CuisineDetailIcon;
  labelKey: string;
  valueKey: string;
};

export type CuisineDetail = {
  code: string;
  badgeKey: string;
  markerIcon: CuisineDetailMarkerIcon;
  infoRows: CuisineDetailInfoRow[];
};

export type CuisineDetailMap = Record<string, CuisineDetail>;
