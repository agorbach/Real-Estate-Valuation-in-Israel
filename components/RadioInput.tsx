
import React from 'react';

interface RadioOption {
  label: string;
  value: number;
}

interface RadioInputProps {
  label: string;
  value: number;
  options: RadioOption[];
  onChange: (val: number) => void;
}

const RadioInput: React.FC<RadioInputProps> = ({ label, value, options, onChange }) => {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`py-3 px-2 text-sm rounded-xl border transition-all text-center ${
              value === opt.value 
                ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-md shadow-blue-100' 
                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RadioInput;
