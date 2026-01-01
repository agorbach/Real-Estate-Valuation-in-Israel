
import React, { useState, useCallback } from 'react';
import { ApartmentData, City } from './types';
import { CITIES, INITIAL_STATE } from './constants';
import FormStep from './components/FormStep';
import ResultDisplay from './components/ResultDisplay';
import DataAnalyzeScreen from './components/DataAnalyzeScreen';

const App: React.FC = () => {
  const [formData, setFormData] = useState<ApartmentData>(INITIAL_STATE);
  const [isFinished, setIsFinished] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(true);

  const updateField = useCallback(<K extends keyof ApartmentData,>(field: K, value: ApartmentData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleCityChange = (cityCode: number) => {
    const city = CITIES.find(c => c.city_code === cityCode);
    if (city) {
      setFormData(prev => ({
        ...prev,
        city_code: city.city_code
      }));
    }
  };

  const handleFinish = () => {
    setIsFinished(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = () => {
    setIsFinished(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentCity = CITIES.find(c => c.city_code === formData.city_code) || CITIES[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-sm">RE</div>
            Real Estate Valuation
          </h1>
          <div className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">
            Validation Engine v2.0
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        {showAnalysis ? (
          <DataAnalyzeScreen onStart={() => setShowAnalysis(false)} />
        ) : isFinished ? (
          <ResultDisplay 
            data={formData} 
            onReset={() => {
              setFormData(INITIAL_STATE);
              setIsFinished(false);
              setShowAnalysis(true);
            }} 
            onEdit={handleEdit}
          />
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <FormStep 
                step={1}
                formData={formData}
                currentCity={currentCity}
                updateField={updateField}
                handleCityChange={handleCityChange}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <FormStep 
                step={2}
                formData={formData}
                currentCity={currentCity}
                updateField={updateField}
                handleCityChange={handleCityChange}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <FormStep 
                step={3}
                formData={formData}
                currentCity={currentCity}
                updateField={updateField}
                handleCityChange={handleCityChange}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <FormStep 
                step={4}
                formData={formData}
                currentCity={currentCity}
                updateField={updateField}
                handleCityChange={handleCityChange}
              />
            </div>

            <div className="pt-4">
              <button
                onClick={handleFinish}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-6 rounded-2xl transition-all shadow-xl shadow-blue-100 text-lg flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <span>בצע הערכת שווי סופית</span>
                <span className="text-xl">📊</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-4 mt-12 text-center text-slate-400 text-sm">
        <p className="opacity-50">הנתונים משמשים לצרכים סטטיסטיים בלבד.</p>
      </footer>
    </div>
  );
};

export default App;
