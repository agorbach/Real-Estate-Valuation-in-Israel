
export interface City {
  city_code: number;
  city_name: string;
  category: string;
  note: string;
  level: number; // 1-10 base on your table
}

export interface ApartmentData {
  city_code: number;
  neighborhood_score: number;
  size_sqm: number;
  num_rooms: number;
  floor: number;
  has_elevator: boolean;
  parking_spots: number;
  balcony_sqm: number;
  storage: boolean;
  building_age_years: number;
  renovation_level: number;
  building_condition_score: number;
  apartment_condition_score: number;
  distance_to_public_transport_m: number;
  noise_level_score: number;
  air_quality_score: number;
  view_quality_score: number;
}

export enum RenovationLabel {
  NOT_RENOVATED = 0,
  COSMETIC = 1,
  FULL = 2,
  NEW = 3
}

export const RENOVATION_MAP: Record<number, string> = {
  [RenovationLabel.NOT_RENOVATED]: "לא שופץ",
  [RenovationLabel.COSMETIC]: "שיפוץ קוסמטי",
  [RenovationLabel.FULL]: "שיפוץ מלא",
  [RenovationLabel.NEW]: "חדש / מקבלן"
};
