
import { City, ApartmentData } from './types';

export const CITIES: City[] = [
  { city_code: 1, city_name: "דימונה", category: "פריפריה רחוקה", note: "ביקוש נמוך", level: 1 },
  { city_code: 2, city_name: "קריית שמונה", category: "פריפריה", note: "שוק קטן", level: 2 },
  { city_code: 3, city_name: "עפולה", category: "עיר אזורית", note: "מרכז עמק", level: 3 },
  { city_code: 4, city_name: "באר שבע", category: "עיר מבוקשת", note: "מטרופולין דרום", level: 4 },
  { city_code: 5, city_name: "חיפה", category: "עיר מרכז", note: "מטרופולין צפון", level: 5 },
  { city_code: 6, city_name: "ראשון לציון", category: "מטרופולין", note: "מרכז חזק", level: 6 },
  { city_code: 7, city_name: "רעננה", category: "אזור ביקוש גבוה", note: "שרון", level: 7 },
  { city_code: 8, city_name: "הרצליה", category: "אזור יוקרה", note: "חוף ועסקים", level: 8 },
  { city_code: 9, city_name: "תל אביב (צפון/דרום)", category: "תל אביב – טבעת", note: "לא פריים", level: 9 },
  { city_code: 10, city_name: "תל אביב (מרכז)", category: "תל אביב – פריים", note: "פריים לוקיישן", level: 10 },
];

export const INITIAL_STATE: ApartmentData = {
  city_code: 6, // ראשון לציון כברירת מחדל
  neighborhood_score: 7,
  size_sqm: 100,
  num_rooms: 4,
  floor: 3,
  has_elevator: true,
  parking_spots: 1,
  balcony_sqm: 12,
  storage: false,
  building_age_years: 15,
  renovation_level: 1,
  building_condition_score: 8,
  apartment_condition_score: 8,
  distance_to_public_transport_m: 200,
  noise_level_score: 3,
  air_quality_score: 8,
  view_quality_score: 3
};
