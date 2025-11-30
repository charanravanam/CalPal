import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { Camera, Image as ImageIcon, Type, X } from 'lucide-react';
import { MealType, UserProfile, Meal } from '../types';
import { analyzeMeal } from '../services/geminiService';

interface AddMealProps {
  user: UserProfile;
  onMealAdded: (meal: Meal) => void;
  onCancel: () => void;
}

export const AddMeal: React.FC<AddMealProps> = ({ user, onMealAdded, onCancel }) => {
  const [mode, setMode] = useState<'PHOTO' | 'TEXT'>('PHOTO');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mealType, setMealType] = useState<MealType>(MealType.LUNCH); // Default based on time usually, but simple for now

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imageUri && !textInput.trim()) return;

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeMeal(imageUri, textInput, user);
      
      const newMeal: Meal = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        mealType: mealType,
        imageUri: imageUri || undefined,
        textDescription: textInput || undefined,
        analysis
      };

      onMealAdded(newMeal);

    } catch (error) {
      console.error(error);
      alert("Failed to analyze meal. Please try again.");
      setIsAnalyzing(false);
    }
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 11) return MealType.BREAKFAST;
    if (hours < 16) return MealType.LUNCH;
    if (hours < 21) return MealType.DINNER;
    return MealType.SNACK;
  };

  // Set initial meal type once
  React.useEffect(() => {
    setMealType(getGreeting());
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col">
      <div className="px-4 py-4 flex items-center justify-between border-b border-zinc-100">
        <button onClick={onCancel} className="text-zinc-500 hover:text-zinc-900 font-medium">Cancel</button>
        <span className="font-semibold">Log Meal</span>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-6">
        
        {/* Meal Type Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {Object.values(MealType).map((t) => (
            <button
              key={t}
              onClick={() => setMealType(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                mealType === t 
                  ? 'bg-zinc-900 text-white shadow-sm' 
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex-1 flex flex-col gap-4">
          
          {mode === 'PHOTO' ? (
            <div className="relative flex-1 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-zinc-300">
               {imageUri ? (
                 <>
                   <img src={imageUri} alt="Preview" className="w-full h-full object-cover" />
                   <button 
                     onClick={() => setImageUri(null)}
                     className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md text-zinc-900"
                   >
                     <X size={20} />
                   </button>
                 </>
               ) : (
                 <div className="text-center p-6 space-y-4">
                   <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-400">
                     <Camera size={32} />
                   </div>
                   <div>
                      <p className="font-medium text-zinc-900">Take a photo</p>
                      <p className="text-sm text-zinc-500">or upload from gallery</p>
                   </div>
                   <input 
                     type="file" 
                     accept="image/*"
                     capture="environment" // Suggest rear camera on mobile
                     className="absolute inset-0 opacity-0 cursor-pointer"
                     onChange={handleFileChange}
                     ref={fileInputRef}
                   />
                   <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                     Select Image
                   </Button>
                 </div>
               )}
            </div>
          ) : (
            <textarea
              className="flex-1 w-full bg-zinc-50 rounded-2xl border border-zinc-200 p-4 focus:ring-2 focus:ring-zinc-900 outline-none resize-none placeholder:text-zinc-400"
              placeholder="Describe your meal (e.g., 2 slices of pepperoni pizza and a coke)..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
          )}

          {/* Mode Switcher */}
          <div className="flex gap-2">
            <button 
              onClick={() => setMode('PHOTO')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-medium text-sm ${
                mode === 'PHOTO' ? 'bg-zinc-100 border-zinc-200 text-zinc-900' : 'border-transparent text-zinc-500'
              }`}
            >
              <ImageIcon size={18} /> Photo
            </button>
            <button 
              onClick={() => setMode('TEXT')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-medium text-sm ${
                mode === 'TEXT' ? 'bg-zinc-100 border-zinc-200 text-zinc-900' : 'border-transparent text-zinc-500'
              }`}
            >
              <Type size={18} /> Text
            </button>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              className="w-full bg-transparent border-b border-zinc-200 py-2 outline-none text-zinc-900 placeholder:text-zinc-400"
              placeholder="Add optional notes (e.g., 'Ate half', 'Extra sauce')..."
              value={mode === 'PHOTO' ? textInput : ''}
              onChange={(e) => mode === 'PHOTO' && setTextInput(e.target.value)}
              style={{ display: mode === 'PHOTO' ? 'block' : 'none' }}
            />
          </div>

        </div>

        <Button 
          onClick={handleSubmit} 
          isLoading={isAnalyzing}
          disabled={isAnalyzing || (mode === 'PHOTO' && !imageUri) || (mode === 'TEXT' && !textInput)}
          className="w-full shadow-lg shadow-zinc-900/10"
        >
          {isAnalyzing ? 'Analyzing Meal...' : 'Analyze Meal'}
        </Button>
      </div>
    </div>
  );
};