export type BibimIngredientCode =
  | "rice"
  | "namul"
  | "protein"
  | "sauce"
  | "egg";

export type BibimIngredientChartItem = {
  code: BibimIngredientCode;
  name: string;
  value: number;
  color: string;
};
