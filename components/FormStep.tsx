
import React from 'react';
import { ApartmentData, RENOVATION_MAP, City } from '../types';
import { CITIES } from '../constants';
import SliderInput from './SliderInput';
import RadioInput from './RadioInput';

interface FormStepProps {
  step: number;
  formData: ApartmentData;
  currentCity: City;
  updateField: <K extends keyof ApartmentData,>(field: K, value: ApartmentData[K]) => void;
  handleCityChange: (cityCode: number) => void;
}

const FormStep: React.FC<FormStepProps> = ({ 
  step, 
  formData, 
  currentCity, 
  updateField, 
  handleCityChange 
}) => {
  // פונקציות עזר לקבלת משמעות
  const getNeighborhoodMeaning = (score: number) => {
    if (score <= 3) return { label: "שכונה חלשה", color: "text-red-500" };
    if (score <= 6) return { label: "בינונית", color: "text-orange-500" };
    if (score <= 8) return { label: "מבוקשת", color: "text-green-600" };
    return { label: "שכונת יוקרה", color: "text-blue-600" };
  };

  const getSizeMeaning = (sqm: number) => {
    if (sqm <= 65) return { label: "קטנה/יחיד", color: "text-slate-500" };
    if (sqm <= 100) return { label: "סטנדרטית", color: "text-blue-500" };
    if (sqm <= 140) return { label: "מרווחת", color: "text-green-600" };
    return { label: "גדולה מאוד", color: "text-purple-600" };
  };

  const getTransportMeaning = (m: number) => {
    if (m <= 300) return { label: "נגיש מאוד", color: "text-green-600" };
    if (m <= 700) return { label: "נגיש", color: "text-blue-500" };
    if (m <= 1200) return { label: "בינוני", color: "text-orange-500" };
    return { label: "מרוחק", color: "text-red-500" };
  };

  const getAgeMeaning = (years: number) => {
    if (years <= 5) return { label: "חדש", color: "text-green-600" };
    if (years <= 15) return { label: "חדיש", color: "text-blue-500" };
    if (years <= 35) return { label: "ותיק", color: "text-orange-500" };
    return { label: "ישן", color: "text-red-500" };
  };

  switch (step) {
    case 1:
      const nMean = getNeighborhoodMeaning(formData.neighborhood_score);
      return (
        <div className="space-y-8">
          <div>
            <div className="inline-block bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black mb-3 uppercase tracking-wider">STEP 01: LOCATION</div>
            <h2 className="text-2xl font-black mb-1">בחירת עיר ומיקום</h2>
            <p className="text-slate-500 italic text-sm">המיקום הוא הפרמטר המשפיע ביותר על השווי</p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700 underline decoration-blue-500 decoration-2">בחר יישוב מהמדרג:</label>
            <select 
              value={formData.city_code}
              onChange={(e) => handleCityChange(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
            >
              {CITIES.map(city => (
                <option key={city.city_code} value={city.city_code}>
                  {city.city_name} — {city.category}
                </option>
              ))}
            </select>
            
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black text-blue-400 uppercase">קטגוריה מקצועית</div>
                <div className="text-blue-800 font-bold">{currentCity.category}</div>
              </div>
              <div className="text-left border-r border-blue-200 pr-4">
                <div className="text-[10px] font-black text-blue-400 uppercase">הערה</div>
                <div className="text-blue-800 font-bold italic">"{currentCity.note}"</div>
              </div>
            </div>
          </div>

          <SliderInput 
            label="דירוג השכונה בתוך העיר"
            value={formData.neighborhood_score}
            min={1}
            max={10}
            statusLabel={nMean.label}
            statusColor={nMean.color}
            onChange={(val) => updateField('neighborhood_score', val)}
          />
        </div>
      );

    case 2:
      const sMean = getSizeMeaning(formData.size_sqm);
      return (
        <div className="space-y-8">
          <div>
            <div className="inline-block bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black mb-3 uppercase tracking-wider">STEP 02: SPECS</div>
            <h2 className="text-2xl font-black mb-1">מפרט טכני וגודל</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SliderInput 
              label={'שטח הדירה (מ"ר)'}
              value={formData.size_sqm}
              min={40}
              max={250}
              statusLabel={sMean.label}
              statusColor={sMean.color}
              onChange={(val) => updateField('size_sqm', val)}
            />
            <SliderInput 
              label="מספר חדרים"
              value={formData.num_rooms}
              min={1.0}
              max={7.0}
              step={0.5}
              statusLabel={formData.num_rooms > 4 ? "גדולה" : "סטנדרט"}
              onChange={(val) => updateField('num_rooms', val)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SliderInput 
              label="קומה"
              value={formData.floor}
              min={0}
              max={40}
              statusLabel={formData.floor === 0 ? "קרקע" : `קומה ${formData.floor}`}
              onChange={(val) => updateField('floor', val)}
            />
            <SliderInput 
              label={'שטח מרפסת (מ"ר)'}
              value={formData.balcony_sqm}
              min={0}
              max={60}
              statusLabel={formData.balcony_sqm > 15 ? "גדולה" : "בסיסית"}
              onChange={(val) => updateField('balcony_sqm', val)}
            />
          </div>

          <RadioInput 
            label="חנייה רשומה"
            value={formData.parking_spots}
            options={[
              { label: 'ללא', value: 0 },
              { label: 'חנייה 1', value: 1 },
              { label: '2 חניות', value: 2 }
            ]}
            onChange={(val) => updateField('parking_spots', val)}
          />
        </div>
      );

    case 3:
      const ageMean = getAgeMeaning(formData.building_age_years);
      return (
        <div className="space-y-8">
          <div>
            <div className="inline-block bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black mb-3 uppercase tracking-wider">STEP 03: CONDITION</div>
            <h2 className="text-2xl font-black mb-1">מצב הנכס ותחזוקה</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-slate-700">מעלית בבניין</label>
              <div className="flex gap-2">
                <button onClick={() => updateField('has_elevator', true)} className={`flex-1 py-3 rounded-xl border-2 transition-all ${formData.has_elevator ? 'bg-slate-900 border-slate-900 text-white font-bold' : 'bg-white text-slate-400 border-slate-100'}`}>יש</button>
                <button onClick={() => updateField('has_elevator', false)} className={`flex-1 py-3 rounded-xl border-2 transition-all ${!formData.has_elevator ? 'bg-slate-900 border-slate-900 text-white font-bold' : 'bg-white text-slate-400 border-slate-100'}`}>אין</button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-slate-700">מחסן פרטי</label>
              <div className="flex gap-2">
                <button onClick={() => updateField('storage', true)} className={`flex-1 py-3 rounded-xl border-2 transition-all ${formData.storage ? 'bg-slate-900 border-slate-900 text-white font-bold' : 'bg-white text-slate-400 border-slate-100'}`}>יש</button>
                <button onClick={() => updateField('storage', false)} className={`flex-1 py-3 rounded-xl border-2 transition-all ${!formData.storage ? 'bg-slate-900 border-slate-900 text-white font-bold' : 'bg-white text-slate-400 border-slate-100'}`}>אין</button>
              </div>
            </div>
          </div>

          <SliderInput 
            label="גיל המבנה (שנים)"
            value={formData.building_age_years}
            min={0}
            max={70}
            statusLabel={ageMean.label}
            statusColor={ageMean.color}
            onChange={(val) => updateField('building_age_years', val)}
          />

          <RadioInput 
            label="רמת שיפוץ פנימי"
            value={formData.renovation_level}
            options={Object.entries(RENOVATION_MAP).map(([val, label]) => ({ label, value: Number(val) }))}
            onChange={(val) => updateField('renovation_level', val)}
          />
        </div>
      );

    case 4:
      const transportMean = getTransportMeaning(formData.distance_to_public_transport_m);
      return (
        <div className="space-y-8">
          <div>
            <div className="inline-block bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black mb-3 uppercase tracking-wider">STEP 04: ENVIRONMENT</div>
            <h2 className="text-2xl font-black mb-1">סביבה וערכים חיצוניים</h2>
          </div>

          <SliderInput 
            label="מרחק מתחבורה ציבורית (מ')"
            value={formData.distance_to_public_transport_m}
            min={0}
            max={1500}
            step={50}
            statusLabel={transportMean.label}
            statusColor={transportMean.color}
            onChange={(val) => updateField('distance_to_public_transport_m', val)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SliderInput 
              label="רמת שקט/רעש"
              value={formData.noise_level_score}
              min={1}
              max={10}
              statusLabel={formData.noise_level_score <= 3 ? "שקט מאוד" : formData.noise_level_score >= 8 ? "רועש" : "סביר"}
              onChange={(val) => updateField('noise_level_score', val)}
            />
            <SliderInput 
              label="איכות נוף"
              value={formData.view_quality_score}
              min={0}
              max={5}
              statusLabel={formData.view_quality_score >= 4 ? "נוף פתוח/ים" : "נוף אורבני"}
              onChange={(val) => updateField('view_quality_score', val)}
            />
          </div>

          <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-[10px] font-medium">
            השלמת את כל הפרמטרים הנדרשים לביצוע הערכת שווי
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default FormStep;
