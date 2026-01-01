
import React, { useState, useMemo } from 'react';
import { ApartmentData, RENOVATION_MAP } from '../types';
import { CITIES } from '../constants';
import SliderInput from './SliderInput';
import { GoogleGenAI, Type } from "@google/genai";

interface ResultDisplayProps {
  data: ApartmentData;
  onReset: () => void;
  onEdit: () => void;
}

interface MarketAnalysis {
  minPrice: number;
  maxPrice: number;
  status: string;
  links: { uri: string; title: string }[];
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ data, onReset, onEdit }) => {
  const [copied, setCopied] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(null);
  
  const cityInfo = useMemo(() => CITIES.find(c => c.city_code === data.city_code) || CITIES[0], [data.city_code]);

  const valuation = useMemo(() => {
    const basePrices = {
      1: 9500, 2: 12500, 3: 15500, 4: 19000, 5: 24000, 
      6: 32000, 7: 42000, 8: 55000, 9: 68000, 10: 88000
    };

    let pricePerSqm = basePrices[cityInfo.level as keyof typeof basePrices];
    pricePerSqm *= (1 + (data.neighborhood_score - 5) * 0.04);
    let estimatedPrice = pricePerSqm * data.size_sqm;
    estimatedPrice *= (1 + (data.num_rooms - 4) * 0.05);
    if (data.floor >= 4 && !data.has_elevator) estimatedPrice *= 0.85;
    else estimatedPrice *= (1 + (data.floor * 0.005));
    const renovationMultipliers = [0.9, 1.0, 1.15, 1.25];
    estimatedPrice *= renovationMultipliers[data.renovation_level];
    if (data.parking_spots > 0) estimatedPrice += (data.parking_spots * (cityInfo.level >= 8 ? 250000 : 120000));
    if (data.storage) estimatedPrice += (cityInfo.level >= 7 ? 60000 : 35000);
    estimatedPrice += (data.balcony_sqm * (pricePerSqm * 0.4));
    estimatedPrice *= (1 - (data.building_age_years * 0.004));
    estimatedPrice *= (1 - (data.noise_level_score - 5) * 0.01);
    estimatedPrice *= (1 + (data.view_quality_score / 25));
    return Math.round(estimatedPrice);
  }, [data, cityInfo]);

  const [equity, setEquity] = useState(Math.round(valuation * 0.25));
  const [loanYears, setLoanYears] = useState(25);

  const mortgage = useMemo(() => {
    const principal = Math.max(0, valuation - equity);
    const ltv = (principal / valuation) * 100;
    const annualRate = 0.052;
    const monthlyRate = annualRate / 12;
    const numberOfPayments = loanYears * 12;
    let monthlyPayment = 0;
    if (principal > 0) {
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }
    const totalRepayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalRepayment - principal;
    return { principal, ltv, monthlyPayment, totalRepayment, totalInterest, isLtvWarning: ltv > 75 };
  }, [valuation, equity, loanYears]);

  const verifyWithLiveMarket = async () => {
    setIsSearching(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `בצע חיפוש נדל"ן חי עבור דירת ${data.num_rooms} חדרים בשטח של כ-${data.size_sqm} מ"ר ב${cityInfo.city_name}. 
      מצא מחירי ביקוש נוכחיים מאתרים כמו יד 2 (Yad2) ומדלן. 
      החזר תוצאה במבנה JSON בלבד עם השדות: minPrice (מספר), maxPrice (מספר), status (טקסט קצר בעברית המסכם אם הערכת המערכת של ${valuation} היא בתוך הטווח).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              minPrice: { type: Type.NUMBER },
              maxPrice: { type: Type.NUMBER },
              status: { type: Type.STRING }
            },
            required: ["minPrice", "maxPrice", "status"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      setMarketAnalysis({
        minPrice: result.minPrice,
        maxPrice: result.maxPrice,
        status: result.status,
        links: chunks.filter(c => c.web).map(c => ({ uri: c.web.uri, title: c.web.title }))
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(val);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // לוגיקה לחישוב מיקום הגרף
  const renderPriceComparison = () => {
    if (!marketAnalysis) return null;
    
    const min = marketAnalysis.minPrice;
    const max = marketAnalysis.maxPrice;
    const val = valuation;
    
    // חישוב אחוזים למיקום הויזואלי
    const range = max - min;
    const getPos = (p: number) => {
      const pos = ((p - min) / range) * 100;
      return Math.min(Math.max(pos, -10), 110); // מגבלה כדי שלא יצא מהמסך
    };

    const valPos = getPos(val);
    const isInside = val >= min && val <= max;

    return (
      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-700 shadow-inner animate-in fade-in slide-in-from-top-4">
        <div className="flex justify-between items-center mb-10">
          <h4 className="font-black text-white flex items-center gap-2">
            <span className="text-orange-500">⚡</span> השוואה לנתוני אמת (Yad2 / מדלן)
          </h4>
          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${isInside ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
            {isInside ? 'In Market Range' : 'Out of Range'}
          </span>
        </div>

        <div className="relative pt-8 pb-12 px-4">
          {/* ציר המחירים */}
          <div className="h-2 w-full bg-slate-800 rounded-full relative">
            {/* טווח השוק */}
            <div className="absolute h-full bg-orange-500/30 border-x border-orange-500/50" style={{ left: '0%', right: '0%', borderRadius: 'inherit' }}></div>
            
            {/* נקודת המינימום */}
            <div className="absolute -bottom-8 left-0 text-center">
              <div className="text-[10px] text-slate-500 font-bold uppercase">מינימום שוק</div>
              <div className="text-white font-bold text-xs">{formatCurrency(min)}</div>
            </div>

            {/* נקודת המקסימום */}
            <div className="absolute -bottom-8 right-0 text-left">
              <div className="text-[10px] text-slate-500 font-bold uppercase">מקסימום שוק</div>
              <div className="text-white font-bold text-xs">{formatCurrency(max)}</div>
            </div>

            {/* הערכת המערכת */}
            <div 
              className="absolute -top-10 transition-all duration-1000 ease-out flex flex-col items-center" 
              style={{ left: `${valPos}%`, transform: 'translateX(-50%)' }}
            >
              <div className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg whitespace-nowrap mb-1">הערכת המערכת</div>
              <div className="w-1 h-12 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)]"></div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-slate-300 text-sm font-medium leading-relaxed italic">
            "{marketAnalysis.status}"
          </p>
        </div>

        {marketAnalysis.links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {marketAnalysis.links.slice(0, 3).map((link, i) => (
              <a 
                key={i} 
                href={link.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[9px] bg-slate-800 text-slate-400 border border-slate-700 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-700 hover:text-white transition-all"
              >
                {link.title || 'מקור נתונים'}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-10 text-center relative">
          <div className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">Market Valuation Estimate</div>
          <div className="text-white text-6xl font-black mb-4 tracking-tighter">
            {formatCurrency(valuation)}
          </div>
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 text-white/80 text-sm font-bold backdrop-blur-sm border border-white/10">
            <span>📍</span>
            <span>{cityInfo.city_name} — {cityInfo.category}</span>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-slate-400 text-[10px] font-black uppercase mb-1">מחיר למ"ר</div>
              <div className="text-slate-900 font-bold text-xl">{formatCurrency(Math.round(valuation / data.size_sqm))}</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-slate-400 text-[10px] font-black uppercase mb-1">דירוג מיקום</div>
              <div className="text-slate-900 font-bold text-xl">{cityInfo.level}/10</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-slate-400 text-[10px] font-black uppercase mb-1">פרופיל עסקה</div>
              <div className="text-blue-600 font-bold text-lg">{cityInfo.note}</div>
            </div>
          </div>

          {/* Verification Section */}
          <div className="mb-10">
             {!marketAnalysis ? (
               <button 
                 onClick={verifyWithLiveMarket}
                 disabled={isSearching}
                 className="w-full py-5 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border border-orange-200 rounded-3xl font-black flex items-center justify-center gap-4 hover:shadow-lg transition-all disabled:opacity-50 group"
               >
                 {isSearching ? (
                   <>
                     <div className="w-5 h-5 border-3 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                     <span className="animate-pulse">סורק נתוני אמת בלוחות...</span>
                   </>
                 ) : (
                   <>
                     <span className="text-2xl group-hover:scale-125 transition-transform">🔍</span>
                     <span>אמת מול נתוני אמת (Yad2 / מדלן)</span>
                   </>
                 )}
               </button>
             ) : (
               renderPriceComparison()
             )}
          </div>

          {/* סימולטור משכנתא */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl">🏠</div>
              <h3 className="text-xl font-black text-slate-900">אפשרויות מימון ומשכנתא</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <SliderInput 
                  label="הון עצמי זמין (₪)"
                  value={equity}
                  min={Math.round(valuation * 0.1)}
                  max={valuation}
                  step={50000}
                  statusLabel={`${Math.round((equity/valuation)*100)}% מהנכס`}
                  onChange={setEquity}
                />
                <SliderInput 
                  label="תקופת הלוואה (שנים)"
                  value={loanYears}
                  min={4}
                  max={30}
                  statusLabel={loanYears > 20 ? "פריסה ארוכה" : "פריסה קצרה"}
                  onChange={setLoanYears}
                />
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-500 font-bold text-sm">החזר חודשי משוער</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${mortgage.isLtvWarning ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} font-black`}>
                      LTV: {Math.round(mortgage.ltv)}%
                    </span>
                  </div>
                  <div className="text-4xl font-black text-blue-600 mb-2">{formatCurrency(mortgage.monthlyPayment)}</div>
                  {mortgage.isLtvWarning && (
                    <div className="text-[10px] text-red-500 font-bold mb-4">⚠️ שים לב: אחוז המימון גבוה מהנחיות בנק ישראל לדירה ראשונה (75%).</div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">סך משכנתא</div>
                    <div className="font-bold text-slate-700 text-sm">{formatCurrency(mortgage.principal)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">סך ריבית</div>
                    <div className="font-bold text-amber-600 text-sm">{formatCurrency(mortgage.totalInterest)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onReset}
                className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl"
              >
                הערכה חדשה
              </button>
              <button
                onClick={onEdit}
                className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl"
              >
                שינוי פרמטרים
              </button>
            </div>
            <button
              onClick={copyToClipboard}
              className="w-full py-5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all border border-slate-200"
            >
              {copied ? 'הועתק!' : 'העתק נתונים טכניים'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="text-center text-slate-400 text-[10px] font-medium uppercase tracking-widest">
        * Valuation & Financing Simulator v2.7 *
      </div>
    </div>
  );
};

export default ResultDisplay;
