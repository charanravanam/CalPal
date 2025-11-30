export enum GoalType {
  LOSE = 'LOSE',
  MAINTAIN = 'MAINTAIN',
  GAIN = 'GAIN',
}

export enum ActivityLevel {
  SEDENTARY = 'SEDENTARY',
  LIGHT = 'LIGHT',
  MODERATE = 'MODERATE',
  ACTIVE = 'ACTIVE',
  VERY_ACTIVE = 'VERY_ACTIVE',
}

export interface UserProfile {
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: GoalType;
  dailyCalorieTarget: number;
  isConfigured: boolean;
}

export enum HealthVerdict {
  NEEDED_FOR_BODY = 'NEEDED_FOR_BODY',
  NOT_NEEDED = 'NOT_NEEDED',
  DANGEROUS = 'DANGEROUS',
  USELESS = 'USELESS',
  HIGH_CALORIE = 'HIGH_CALORIE',
  VERY_UNHEALTHY = 'VERY_UNHEALTHY',
  HIGH_CHEMICALS = 'HIGH_CHEMICALS',
}

export enum MealType {
  BREAKFAST = 'Breakfast',
  LUNCH = 'Lunch',
  DINNER = 'Dinner',
  SNACK = 'Snack',
}

export interface NutritionAnalysis {
  foodName: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  burnTimeMinutes: number; // For brisk walk
  score: number; // 1-100
  verdict: HealthVerdict;
  secondaryVerdicts?: HealthVerdict[]; // Up to 2
  goalAlignment: string;
  portionGuidance: string;
  frequencyGuidance: string;
  allergens?: string[];
  riskFlags?: string[];
}

export interface Meal {
  id: string;
  timestamp: number;
  mealType: MealType;
  imageUri?: string; // Data URL
  textDescription?: string;
  analysis: NutritionAnalysis;
}

export type ViewState = 'ONBOARDING' | 'DASHBOARD' | 'ADD_MEAL' | 'MEAL_DETAIL';