import React from 'react';
import { Meal, NutritionAnalysis, HealthVerdict } from '../types';
import { VERDICT_LABELS, VERDICT_COLORS } from '../constants';
import { Button } from './Button';
import { ArrowLeft, Clock, Flame, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

interface MealDetailProps {
  meal: Meal;
  onBack: () => void;
}

export const MealDetail: React.FC<MealDetailProps> = ({ meal, onBack }) => {
  const { analysis } = meal;

  // Formatting timestamp
  const date = new Date(meal.timestamp).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const time = new Date(meal.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  // Score color
  const scoreColor = (analysis.score || 0) >= 80 ? 'text-emerald-600' : (analysis.score || 0) >= 50 ? 'text-amber-600' : 'text-rose-600';
  const scoreBg = (analysis.score || 0) >= 80 ? 'bg-emerald-50' : (analysis.score || 0) >= 50 ? 'bg-amber-50' : 'bg-rose-50';

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative pb-10">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-4 py-4 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-zinc-100 rounded-full text-zinc-600">
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-semibold text-zinc-900">Nutrition Brief</h2>
      </div>

      <div className="px-5 py-6 space-y-8">
        
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
             <div>
               <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
                 {date} • {time} • {meal.mealType}
               </p>
               <h1 className="text-3xl font-bold text-zinc-900 tracking-tight leading-none">
                 {analysis.foodName}
               </h1>
             </div>
             
             {/* Score Circle */}
             <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-full border-4 border-white shadow-lg ${scoreBg}`}>
                <span className={`text-xl font-bold tracking-tighter ${scoreColor}`}>
                  {analysis.score || '?'}
                </span>
             </div>
          </div>
          
          {meal.imageUri && (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100 shadow-sm border border-zinc-100">
              <img src={meal.imageUri} alt={analysis.foodName} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Verdict Pills */}
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${VERDICT_COLORS[analysis.verdict] || VERDICT_COLORS.NOT_NEEDED}`}>
            {VERDICT_LABELS[analysis.verdict] || analysis.verdict.replace(/_/g, ' ')}
          </span>
          {analysis.secondaryVerdicts?.map((v) => (
             <span key={v} className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${VERDICT_COLORS[v] || VERDICT_COLORS.NOT_NEEDED}`}>
             {VERDICT_LABELS[v] || v.replace(/_/g, ' ')}
           </span>
          ))}
        </div>

        {/* Core Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
            <div className="flex items-center gap-2 mb-2 text-zinc-500">
              <Flame size={16} />
              <span className="text-xs font-medium uppercase tracking-wide">Energy</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-zinc-900 tracking-tighter">{analysis.calories}</span>
              <span className="text-sm text-zinc-500 font-medium">kcal</span>
            </div>
          </div>

          <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
            <div className="flex items-center gap-2 mb-2 text-zinc-500">
               <Clock size={16} />
               <span className="text-xs font-medium uppercase tracking-wide">Burn Cost</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-zinc-900 tracking-tighter">{analysis.burnTimeMinutes}</span>
              <span className="text-sm text-zinc-500 font-medium">min</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">Brisk walk</p>
          </div>
        </div>

        {/* Macros */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm flex justify-between text-center divide-x divide-zinc-100">
          <div className="flex-1 px-2">
             <p className="text-xs text-zinc-400 font-medium uppercase mb-1">Protein</p>
             <p className="font-semibold text-zinc-900">{analysis.macros.protein}g</p>
          </div>
          <div className="flex-1 px-2">
             <p className="text-xs text-zinc-400 font-medium uppercase mb-1">Carbs</p>
             <p className="font-semibold text-zinc-900">{analysis.macros.carbs}g</p>
          </div>
          <div className="flex-1 px-2">
             <p className="text-xs text-zinc-400 font-medium uppercase mb-1">Fat</p>
             <p className="font-semibold text-zinc-900">{analysis.macros.fat}g</p>
          </div>
        </div>

        {/* Goal Alignment & Intelligence */}
        <div className="space-y-6">
          <div className="bg-zinc-50 p-5 rounded-2xl border-l-4 border-zinc-900">
            <h3 className="font-semibold text-zinc-900 mb-2">Goal Alignment</h3>
            <p className="text-zinc-600 leading-relaxed text-sm">
              {analysis.goalAlignment}
            </p>
          </div>

          <div className="space-y-4">
             <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">Guidance</h3>
             
             <div className="flex gap-4 items-start">
               <div className="mt-1 min-w-[20px]"><CheckCircle size={20} className="text-emerald-500" /></div>
               <div>
                  <p className="text-sm font-semibold text-zinc-900 mb-1">Portion</p>
                  <p className="text-sm text-zinc-600">{analysis.portionGuidance}</p>
               </div>
             </div>

             <div className="flex gap-4 items-start">
               <div className="mt-1 min-w-[20px]"><Clock size={20} className="text-blue-500" /></div>
               <div>
                  <p className="text-sm font-semibold text-zinc-900 mb-1">Frequency</p>
                  <p className="text-sm text-zinc-600">{analysis.frequencyGuidance}</p>
               </div>
             </div>
          </div>
          
          {(analysis.riskFlags && analysis.riskFlags.length > 0) || (analysis.allergens && analysis.allergens.length > 0) ? (
            <div className="space-y-3 pt-4 border-t border-zinc-100">
               <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide flex items-center gap-2">
                 <AlertTriangle size={16} className="text-amber-500"/> Warnings
               </h3>
               {analysis.allergens && analysis.allergens.length > 0 && (
                 <div className="text-sm text-zinc-600">
                   <span className="font-medium text-zinc-900">Allergens:</span> {analysis.allergens.join(', ')}
                 </div>
               )}
               {analysis.riskFlags && analysis.riskFlags.length > 0 && (
                 <div className="flex flex-wrap gap-2">
                   {analysis.riskFlags.map(risk => (
                     <span key={risk} className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-md border border-amber-100">
                       {risk}
                     </span>
                   ))}
                 </div>
               )}
            </div>
          ) : null}

        </div>

      </div>
    </div>
  );
};