
import React from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  description?: string;
  statusLabel?: string;
  statusColor?: string;
}

const SliderInput: React.FC<SliderInputProps> = ({ 
  label, value, min, max, step = 1, onChange, description, statusLabel, statusColor = "text-blue-600"
}) => {
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : min;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-bold text-slate-700">{label}</label>
        <span className="text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
          {safeValue % 1 === 0 ? safeValue : safeValue.toFixed(1)}
        </span>
      </div>
      
      <input 
        type="range"
        min={min}
        max={max}
        step={step}
        value={safeValue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      
      <div className="flex justify-between items-center mt-1">
        <div className="flex gap-1 text-[10px] text-slate-300 font-medium">
          <span>{min}</span>
          <span className="opacity-50">|</span>
          <span>{max}</span>
        </div>
        {statusLabel && (
          <span className={`text-xs font-bold ${statusColor} bg-opacity-10 px-2 py-0.5 rounded-md transition-all duration-300`}>
            {statusLabel}
          </span>
        )}
      </div>
      {description && <p className="text-[10px] text-slate-400 mt-1">{description}</p>}
    </div>
  );
};

export default SliderInput;
