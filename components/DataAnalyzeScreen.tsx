
import React from 'react';
import { CITIES } from '../constants';

interface DataAnalyzeScreenProps {
  onStart: () => void;
}

const DataAnalyzeScreen: React.FC<DataAnalyzeScreenProps> = ({ onStart }) => {
  return (
    <div className="animate-in fade-in duration-700 space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-blue-200">📊</div>
          <div>
            <h2 className="text-3xl font-black text-slate-900">DATA ANALYZE</h2>
            <p className="text-slate-500 font-medium italic">מנוע הערכת שווי מבוסס מדרג קטגוריות</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { label: "מיקום גיאוגרפי", weight: "55%", icon: "📍", desc: "מדרג 1-10 לפי ביקוש ופוטנציאל" },
            { label: "מפרט טכני", weight: "30%", icon: "🏗️", desc: "גודל, קומה, מעלית וחנייה" },
            { label: "איכות חיים", weight: "15%", icon: "🌳", desc: "רעש, נוף ונגישות תחבורתית" }
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-slate-900 font-bold">{item.label}</div>
              <div className="text-blue-600 font-black text-xl">{item.weight}</div>
              <div className="text-slate-400 text-xs mt-1">{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            מדרג ערים וקטגוריות מובנה במערכת:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {CITIES.map((city) => (
              <div key={city.city_code} className="p-3 rounded-xl border border-slate-100 bg-white text-center hover:border-blue-200 transition-colors">
                <div className="text-[10px] font-bold text-blue-500 uppercase">{city.category}</div>
                <div className="font-bold text-slate-800 text-sm">{city.city_name}</div>
                <div className="text-[9px] text-slate-400 italic">{city.note}</div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={onStart}
          className="w-full mt-10 bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-4 group"
        >
          <span>התחל הזנת נתונים</span>
          <span className="group-hover:translate-x-[-4px] transition-transform">←</span>
        </button>
      </div>

      <div className="text-center text-slate-400 text-xs">
        המערכת משתמשת באלגוריתם היררכי לחיזוי שווי נכסים בישראל
      </div>
    </div>
  );
};

export default DataAnalyzeScreen;
