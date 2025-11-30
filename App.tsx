import React, { useState, useEffect } from 'react';
import { UserProfile, Meal, ViewState } from './types';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { AddMeal } from './components/AddMeal';
import { MealDetail } from './components/MealDetail';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('ONBOARDING');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  // Load data from local storage on mount with error handling
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('nutria_user');
      const savedMeals = localStorage.getItem('nutria_meals');

      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setView('DASHBOARD');
      }
      if (savedMeals) {
        setMeals(JSON.parse(savedMeals));
      }
    } catch (error) {
      console.error("Failed to load local data:", error);
      // Optional: Clear corrupted data to allow app to start fresh
      // localStorage.removeItem('nutria_user');
      // localStorage.removeItem('nutria_meals');
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('nutria_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    // Always save meals state to local storage, even if empty (to handle deletions)
    localStorage.setItem('nutria_meals', JSON.stringify(meals));
  }, [meals]);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUser(profile);
    setView('DASHBOARD');
  };

  const handleMealAdded = (newMeal: Meal) => {
    setMeals(prev => [...prev, newMeal]);
    setSelectedMeal(newMeal);
    setView('MEAL_DETAIL');
  };

  const handleViewMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setView('MEAL_DETAIL');
  };

  const handleBackToDashboard = () => {
    setSelectedMeal(null);
    setView('DASHBOARD');
  };

  const handleDeleteMeal = (id: string) => {
    if (window.confirm("Delete this meal log?")) {
      setMeals(prev => prev.filter(meal => meal.id !== id));
      if (selectedMeal?.id === id) {
        setSelectedMeal(null);
        setView('DASHBOARD');
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out? This will clear your device's data for this app.")) {
      localStorage.removeItem('nutria_user');
      localStorage.removeItem('nutria_meals');
      setUser(null);
      setMeals([]);
      setView('ONBOARDING');
    }
  };

  // Render Logic
  if (!user || view === 'ONBOARDING') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="bg-zinc-50 min-h-screen text-zinc-900 font-sans selection:bg-zinc-200">
      {view === 'DASHBOARD' && (
        <Dashboard 
          user={user} 
          meals={meals} 
          onAddMeal={() => setView('ADD_MEAL')} 
          onViewMeal={handleViewMeal}
          onDeleteMeal={handleDeleteMeal}
          onLogout={handleLogout}
        />
      )}

      {view === 'ADD_MEAL' && (
        <AddMeal 
          user={user} 
          onMealAdded={handleMealAdded} 
          onCancel={() => setView('DASHBOARD')} 
        />
      )}

      {view === 'MEAL_DETAIL' && selectedMeal && (
        <MealDetail 
          meal={selectedMeal} 
          onBack={handleBackToDashboard} 
        />
      )}
    </div>
  );
};

export default App;