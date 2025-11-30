import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, NutritionAnalysis } from "../types";

const getNutritionSchema = (): Schema => {
  return {
    type: Type.OBJECT,
    properties: {
      foodName: { type: Type.STRING, description: "A concise, normalized name of the food." },
      calories: { type: Type.NUMBER, description: "Estimated total calories." },
      macros: {
        type: Type.OBJECT,
        properties: {
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fat: { type: Type.NUMBER },
        },
        required: ["protein", "carbs", "fat"]
      },
      burnTimeMinutes: { type: Type.NUMBER, description: "Minutes of brisk walking required to burn these calories." },
      score: { type: Type.NUMBER, description: "A health score from 1-100 where 100 is perfectly healthy and 0 is very unhealthy." },
      verdict: {
        type: Type.STRING,
        enum: [
          'NEEDED_FOR_BODY',
          'NOT_NEEDED',
          'DANGEROUS',
          'USELESS',
          'HIGH_CALORIE',
          'VERY_UNHEALTHY',
          'HIGH_CHEMICALS'
        ],
        description: "Primary health verdict."
      },
      secondaryVerdicts: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
          enum: [
            'NEEDED_FOR_BODY',
            'NOT_NEEDED',
            'DANGEROUS',
            'USELESS',
            'HIGH_CALORIE',
            'VERY_UNHEALTHY',
            'HIGH_CHEMICALS'
          ]
        },
        description: "Up to 2 secondary verdicts if relevant."
      },
      goalAlignment: { type: Type.STRING, description: "A one sentence alignment with the user's specific goal." },
      portionGuidance: { type: Type.STRING, description: "Guidance on the portion size tailored to the user." },
      frequencyGuidance: { type: Type.STRING, description: "How often this should be eaten." },
      allergens: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of common allergens if detected." },
      riskFlags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Short strings for risks like High Sugar, Trans Fat, etc." }
    },
    required: ["foodName", "calories", "macros", "burnTimeMinutes", "score", "verdict", "goalAlignment", "portionGuidance", "frequencyGuidance"]
  };
};

export const analyzeMeal = async (
  imageBase64: string | null,
  textDescription: string,
  user: UserProfile
): Promise<NutritionAnalysis> => {
  
  // Create a fresh instance for every call to ensure latest API key if changed (though standard in env)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Analyze this meal for a user with the following profile:
    Goal: ${user.goal}
    Gender: ${user.gender}
    Weight: ${user.weightKg}kg
    Height: ${user.heightCm}cm
    Daily Calorie Target: ${user.dailyCalorieTarget}

    Provide a structured nutrition brief.
    If an image is provided, analyze the visual portion size and ingredients.
    If text is provided, estimate based on standard serving sizes for that description.
    
    The 'verdict' should be a professional, high-end assessment. 
    'goalAlignment' must specificially reference whether this helps them ${user.goal}.
    'burnTimeMinutes' is based on a brisk walk (approx 4mph).
    'score' is a 1-100 rating of how healthy this meal is for THIS user's specific goals (100 = perfect, 0 = terrible).
    
    Return STRICT JSON matching the schema.
  `;

  const parts: any[] = [{ text: prompt }];

  if (textDescription) {
    parts.push({ text: `Food Description: ${textDescription}` });
  }

  if (imageBase64) {
    // Remove data URL prefix if present for the API call
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg', // Assuming converted or standard upload
        data: cleanBase64
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: parts
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: getNutritionSchema()
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as NutritionAnalysis;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback or re-throw
    throw error;
  }
};