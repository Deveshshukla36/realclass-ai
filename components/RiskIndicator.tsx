
import React from 'react';

interface RiskIndicatorProps {
  risk: number;
}

const RiskIndicator: React.FC<RiskIndicatorProps> = ({ risk }) => {
  const percentage = Math.round(risk * 100);
  const strokeDashoffset = 251.2 - (251.2 * percentage) / 100;
  
  let color = "stroke-emerald-500";
  let textColor = "text-emerald-700";
  let status = "Low Risk";

  if (percentage > 30) {
    color = "stroke-amber-500";
    textColor = "text-amber-700";
    status = "Moderate Risk";
  }
  if (percentage > 60) {
    color = "stroke-rose-500";
    textColor = "text-rose-700";
    status = "High Risk";
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-slate-200 h-full">
      <h3 className="text-sm font-semibold text-slate-800 mb-6">Exam Failure Probability</h3>
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="40"
            className="stroke-slate-100 fill-none"
            strokeWidth="12"
          />
          <circle
            cx="64"
            cy="64"
            r="40"
            className={`${color} fill-none transition-all duration-1000 ease-out`}
            strokeWidth="12"
            strokeDasharray="251.2"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${textColor}`}>{percentage}%</span>
        </div>
      </div>
      <div className={`mt-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${textColor} bg-opacity-10`} style={{ backgroundColor: color.replace('stroke', 'bg') }}>
        {status}
      </div>
      <p className="text-[10px] text-slate-400 mt-4 text-center max-w-[150px]">
        Bayesian model predicts failure risk based on recent mastery stagnation.
      </p>
    </div>
  );
};

export default RiskIndicator;
