import React from 'react';
import { UserProfile, Meal } from '../types';
import { Button } from './Button';
import { Plus, ChevronRight, TrendingUp, LogOut, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { VERDICT_COLORS } from '../constants';

interface DashboardProps {
  user: UserProfile;
  meals: Meal[];
  onAddMeal: () => void;
  onViewMeal: (meal: Meal) => void;
  onDeleteMeal: (id: string) => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  meals, 
  onAddMeal, 
  onViewMeal,
  onDeleteMeal,
  onLogout 
}) => {
  // Calculate Daily Stats
  const today = new Date().setHours(0,0,0,0);
  const todaysMeals = meals.filter(m => new Date(m.timestamp).setHours(0,0,0,0) === today);
  
  const totalCalories = todaysMeals.reduce((acc, m) => acc + m.analysis.calories, 0);
  const remaining = Math.max(0, user.dailyCalorieTarget - totalCalories);
  const percentage = Math.min(100, Math.round((totalCalories / user.dailyCalorieTarget) * 100));

  // Data for chart (Last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0,0,0,0);
    return d;
  });

  const chartData = last7Days.map(date => {
    const dayCalories = meals
      .filter(m => new Date(m.timestamp).setHours(0,0,0,0) === date.getTime())
      .reduce((acc, m) => acc + m.analysis.calories, 0);
    
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      calories: dayCalories,
      isOver: dayCalories > user.dailyCalorieTarget
    };
  });

  return (
    <div className="max-w-md mx-auto min-h-screen pb-20 relative">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex justify-between items-end">
        <div>
           <p className="text-zinc-500 text-sm font-medium mb-1">Today's Overview</p>
           <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
             Hello, {user.name.split(' ')[0]}
           </h1>
        </div>
        <button 
          onClick={onLogout}
          className="h-10 w-10 bg-zinc-100 rounded-full flex items-center justify-center border border-zinc-200 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 transition-colors"
          title="Log Out"
        >
          <LogOut size={16} />
        </button>
      </div>

      <div className="px-6 space-y-8">
        
        {/* Primary Metric Card */}
        <div className="bg-zinc-900 text-white rounded-3xl p-6 shadow-xl shadow-zinc-900/20 relative overflow-hidden">
           <div className="relative z-10">
             <div className="flex justify-between items-start mb-6">
                <div>
                   <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">Consumed</p>
                   <p className="text-4xl font-bold tracking-tighter">{totalCalories}</p>
                </div>
                <div className="text-right">
                   <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">Target</p>
                   <p className="text-xl font-semibold tracking-tight">{user.dailyCalorieTarget}</p>
                </div>
             </div>
             
             {/* Progress Bar */}
             <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
               <div 
                 className={`h-full transition-all duration-1000 ease-out ${percentage > 100 ? 'bg-rose-500' : 'bg-emerald-400'}`} 
                 style={{ width: `${percentage}%` }}
               />
             </div>
             <p className="text-xs text-zinc-400">
               {percentage >= 100 
                 ? `You are ${totalCalories - user.dailyCalorieTarget} kcal over target.` 
                 : `${remaining} kcal remaining for today.`}
             </p>
           </div>
        </div>

        {/* Weekly Trend */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <TrendingUp size={16} className="text-zinc-400"/>
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">Weekly Trend</h3>
          </div>
          <div className="bg-white border border-zinc-100 p-4 rounded-2xl h-40 shadow-sm">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="day" 
                    tick={{fontSize: 10, fill: '#A1A1AA'}} 
                    axisLine={false} 
                    tickLine={false} 
                    interval={0}
                  />
                  <Tooltip 
                    cursor={{fill: '#F4F4F5', radius: 4}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="calories" radius={[4, 4, 4, 4]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isOver ? '#FB7185' : '#E4E4E7'} />
                    ))}
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Meals */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide px-1">Recent Logs</h3>
          <div className="space-y-3">
            {todaysMeals.length === 0 ? (
              <div className="text-center py-10 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                <p className="text-zinc-400 text-sm">No meals logged today yet.</p>
              </div>
            ) : (
              [...todaysMeals].reverse().map((meal) => (
                <div 
                  key={meal.id} 
                  onClick={() => onViewMeal(meal)}
                  className="bg-white p-3 pl-3 pr-4 rounded-2xl border border-zinc-100 shadow-sm flex items-center gap-4 transition-transform active:scale-[0.98] group relative"
                >
                  <div className="h-16 w-16 bg-zinc-100 rounded-xl overflow-hidden flex-shrink-0">
                    {meal.imageUri ? (
                      <img src={meal.imageUri} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-zinc-400 text-xs font-bold bg-zinc-200">
                        {meal.analysis.foodName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-zinc-900 truncate">{meal.analysis.foodName}</h4>
                    <p className="text-xs text-zinc-500">{new Date(meal.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {meal.analysis.calories} kcal</p>
                  </div>
                  
                  {/* Score & Actions */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                       <span className={`text-sm font-bold ${
                         meal.analysis.score >= 80 ? 'text-emerald-500' :
                         meal.analysis.score >= 50 ? 'text-amber-500' :
                         'text-rose-500'
                       }`}>
                         {meal.analysis.score || '?'}
                       </span>
                       <span className="text-[10px] text-zinc-300 font-medium">SCORE</span>
                    </div>

                    <div className="flex items-center">
                       <button 
                         onClick={(e) => { e.stopPropagation(); onDeleteMeal(meal.id); }}
                         className="p-2 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors z-10"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-20">
         <button 
           onClick={onAddMeal}
           className="bg-zinc-900 text-white p-4 rounded-full shadow-lg shadow-zinc-900/30 hover:scale-105 active:scale-95 transition-all"
         >
           <Plus size={24} />
         </button>
      </div>
    </div>
  );
};