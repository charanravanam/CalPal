import { ActivityLevel, GoalType } from "./types";

export const DEFAULT_DAILY_TARGET = 2000;

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  [ActivityLevel.SEDENTARY]: 1.2,
  [ActivityLevel.LIGHT]: 1.375,
  [ActivityLevel.MODERATE]: 1.55,
  [ActivityLevel.ACTIVE]: 1.725,
  [ActivityLevel.VERY_ACTIVE]: 1.9,
};

export const GOAL_MODIFIERS: Record<GoalType, number> = {
  [GoalType.LOSE]: -500,
  [GoalType.MAINTAIN]: 0,
  [GoalType.GAIN]: 500,
};

export const VERDICT_LABELS: Record<string, string> = {
  NEEDED_FOR_BODY: 'Needed for Body',
  NOT_NEEDED: 'Not Needed',
  DANGEROUS: 'Dangerous for Body',
  USELESS: 'Useless for Body',
  HIGH_CALORIE: 'High Calorie Count',
  VERY_UNHEALTHY: 'Very Unhealthy',
  HIGH_CHEMICALS: 'High Chemicals',
};

export const VERDICT_COLORS: Record<string, string> = {
  NEEDED_FOR_BODY: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  NOT_NEEDED: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  DANGEROUS: 'bg-rose-100 text-rose-800 border-rose-200',
  USELESS: 'bg-amber-100 text-amber-800 border-amber-200',
  HIGH_CALORIE: 'bg-orange-100 text-orange-800 border-orange-200',
  VERY_UNHEALTHY: 'bg-rose-100 text-rose-800 border-rose-200',
  HIGH_CHEMICALS: 'bg-purple-100 text-purple-800 border-purple-200',
};