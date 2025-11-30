import React, { useState } from 'react';
import { UserProfile, GoalType, ActivityLevel } from '../types';
import { Button } from './Button';
import { ACTIVITY_MULTIPLIERS, GOAL_MODIFIERS, DEFAULT_DAILY_TARGET } from '../constants';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    age: 30,
    gender: 'FEMALE',
    heightCm: 170,
    weightKg: 70,
    activityLevel: ActivityLevel.MODERATE,
    goal: GoalType.MAINTAIN,
  });

  const calculateCalories = () => {
    // Harris-Benedict BMR Formula
    const { weightKg = 70, heightCm = 170, age = 30, gender, activityLevel, goal } = formData;
    
    let bmr = 0;
    if (gender === 'MALE') {
      bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
    }

    const activityMult = ACTIVITY_MULTIPLIERS[activityLevel as ActivityLevel] || 1.2;
    const tdee = bmr * activityMult;
    const goalMod = GOAL_MODIFIERS[goal as GoalType] || 0;

    return Math.round(tdee + goalMod);
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      const target = calculateCalories();
      onComplete({
        ...formData as UserProfile,
        dailyCalorieTarget: target,
        isConfigured: true,
      });
    }
  };

  const updateField = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-md mx-auto p-6 min-h-screen flex flex-col justify-center">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">NUTRIA</h1>
        <p className="text-zinc-500">Personal nutrition intelligence.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-zinc-100">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-zinc-900">About You</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-colors outline-none"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Your Name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Age</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none"
                    value={formData.age}
                    onChange={(e) => updateField('age', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Gender</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none bg-white"
                    value={formData.gender}
                    onChange={(e) => updateField('gender', e.target.value)}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
            </div>
            <Button className="w-full" onClick={handleNext}>Next</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-zinc-900">Metrics</h2>
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Height (cm)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none"
                    value={formData.heightCm}
                    onChange={(e) => updateField('heightCm', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Weight (kg)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none"
                    value={formData.weightKg}
                    onChange={(e) => updateField('weightKg', Number(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Activity Level</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none bg-white"
                  value={formData.activityLevel}
                  onChange={(e) => updateField('activityLevel', e.target.value)}
                >
                  <option value={ActivityLevel.SEDENTARY}>Sedentary (Office job)</option>
                  <option value={ActivityLevel.LIGHT}>Light Exercise (1-2 days/wk)</option>
                  <option value={ActivityLevel.MODERATE}>Moderate (3-5 days/wk)</option>
                  <option value={ActivityLevel.ACTIVE}>Active (6-7 days/wk)</option>
                  <option value={ActivityLevel.VERY_ACTIVE}>Very Active (Phys job)</option>
                </select>
              </div>
            </div>
            <Button className="w-full" onClick={handleNext}>Next</Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-zinc-900">Goal</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {[GoalType.LOSE, GoalType.MAINTAIN, GoalType.GAIN].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => updateField('goal', goal)}
                    className={`px-4 py-3 text-left rounded-xl border transition-all ${
                      formData.goal === goal 
                        ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900' 
                        : 'border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="font-medium text-zinc-900">
                      {goal === GoalType.LOSE && 'Lose Weight'}
                      {goal === GoalType.MAINTAIN && 'Maintain Weight'}
                      {goal === GoalType.GAIN && 'Build Muscle / Gain'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={handleNext}>Create Profile</Button>
          </div>
        )}
      </div>
    </div>
  );
};