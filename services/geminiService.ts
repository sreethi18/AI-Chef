import { GoogleGenAI, Type } from "@google/genai";

// Fix: Initialize GoogleGenAI with API_KEY from environment variables directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface Nutrition {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
}

export interface InstructionStep {
    text: string;
    duration?: number; // Duration in minutes
}

export interface Recipe {
    recipeName: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    totalTime: string;
    servings: number;
    ingredients: string[];
    instructions: InstructionStep[];
    substitutions?: {
        missingIngredient: string;
        suggestion: string;
    }[];
    nutrition?: Nutrition;
}

const schema: any = {
    type: Type.OBJECT,
    properties: {
        recipeName: { type: Type.STRING, description: "Creative and appealing name for the recipe." },
        description: { type: Type.STRING, description: "A short, 1-2 sentence enticing description of the dish." },
        difficulty: { type: Type.STRING, description: "Estimated difficulty level from one of the following options: Easy, Medium, or Hard." },
        totalTime: { type: Type.STRING, description: "Approximate total time for preparation and cooking (e.g., 'Approx. 45 minutes')." },
        servings: { type: Type.NUMBER, description: "The number of people this recipe is intended to serve." },
        ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of all ingredients required for the recipe, including quantities."
        },
        instructions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING, description: "The text of the instruction step." },
                    duration: { type: Type.NUMBER, description: "If this step involves a specific cooking time (e.g., 'simmer for 10 minutes'), provide the duration here in whole minutes. Omit if no specific time is mentioned." }
                },
                required: ['text']
            },
            description: "Clear, step-by-step instructions. For any step that includes a specific duration, extract it into the duration field."
        },
        substitutions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    missingIngredient: { type: Type.STRING, description: "An ingredient that might be missing." },
                    suggestion: { type: Type.STRING, description: "A common substitution for the missing ingredient." }
                },
                required: ['missingIngredient', 'suggestion']
            },
            description: "An optional list of suggestions for common ingredient substitutions if a user might be missing something from the generated ingredients list."
        },
        nutrition: {
            type: Type.OBJECT,
            properties: {
                calories: { type: Type.STRING, description: "Estimated total calories per serving (e.g., '450 kcal')." },
                protein: { type: Type.STRING, description: "Estimated grams of protein per serving (e.g., '30g')." },
                carbs: { type: Type.STRING, description: "Estimated grams of carbohydrates per serving (e.g., '40g')." },
                fat: { type: Type.STRING, description: "Estimated grams of fat per serving (e.g., '15g')." }
            },
            description: "An optional, estimated nutritional breakdown per serving."
        }
    },
    required: ['recipeName', 'description', 'difficulty', 'totalTime', 'servings', 'ingredients', 'instructions']
};


export const generateRecipe = async (ingredients: string, dietaryRestrictions: string[]): Promise<Recipe> => {
    if (!ingredients.trim()) {
        throw new Error("Please provide some ingredients.");
    }

    const model = "gemini-2.5-flash";

    const dietaryPrompt = dietaryRestrictions.length > 0
        ? `The user has the following dietary restrictions: ${dietaryRestrictions.join(', ')}. The recipe MUST strictly adhere to all of these restrictions.`
        : "The user has not specified any dietary restrictions.";

    const prompt = `
        You are an expert chef with a talent for creating delicious and easy-to-follow recipes based on the ingredients a user has on hand.

        A user has provided the following ingredients: "${ingredients}"

        ${dietaryPrompt}

        Your task is to:
        1.  Invent a creative and appealing recipe using the provided ingredients.
        2.  Assume the user has common pantry staples (like salt, pepper, oil, water) and include them in the ingredient list if needed.
        3.  If you include pantry staples not explicitly listed by the user, provide potential substitutions in the 'substitutions' field in case they don't have them.
        4.  Provide all the necessary details for the recipe: name, a brief description, difficulty, total time, number of servings, a full ingredient list, and step-by-step instructions.
        5.  For the instructions, analyze each step. If a step contains a specific timed action (e.g., "bake for 30 minutes", "let it rest for 5 min"), you MUST populate the 'duration' field for that step with the number of minutes as an integer. Otherwise, omit the 'duration' field.
        6.  Provide an estimated nutritional breakdown per serving (calories, protein, carbs, fat). If you cannot determine this accurately, you can omit the 'nutrition' field.
        7.  Return the entire response as a single, valid JSON object that conforms to the provided schema. Do not include any markdown formatting or extra text outside of the JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });
        
        let recipeJson;
        try {
            // Fix: Trim whitespace from the response before parsing JSON.
            recipeJson = JSON.parse(response.text.trim());
        } catch (parseError) {
            console.error("JSON parsing error:", parseError);
            throw new Error("The AI returned a response in an unexpected format. Please try generating the recipe again.");
        }

        // Basic validation to ensure we have a usable recipe object
        if (typeof recipeJson !== 'object' || recipeJson === null || !recipeJson.recipeName || !Array.isArray(recipeJson.instructions)) {
            console.error("Invalid recipe structure:", recipeJson);
            throw new Error("The AI returned an incomplete recipe. Please try again.");
        }

        return recipeJson as Recipe;

    } catch (error) {
        console.error("Error generating recipe:", error);
        // If it's one of our custom validation/parsing errors, re-throw it. Otherwise, provide a generic network error.
        if (error instanceof Error && (error.message.includes("unexpected format") || error.message.includes("incomplete recipe"))) {
            throw error;
        }
        throw new Error("Failed to communicate with the AI chef. Please check your internet connection and try again.");
    }
};

export const scaleIngredients = async (
    originalIngredients: string[], 
    originalServings: number, 
    targetServings: number
): Promise<string[]> => {
    const prompt = `
        You are a recipe scaling assistant. A recipe that originally serves ${originalServings} people has the following ingredients:
        ${JSON.stringify(originalIngredients)}

        Please scale these ingredients to serve ${targetServings} people. Adjust the quantities intelligently. For example, '1 egg' might become '2 eggs' when doubling, but 'a pinch of salt' might remain the same or become '1/4 tsp salt'.

        Return ONLY a single, valid JSON array of strings containing the new, scaled ingredient list. Do not include any other text, explanation, or markdown formatting.
    `;

    const scaleSchema = {
        type: Type.ARRAY,
        items: { type: Type.STRING }
    };
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: scaleSchema,
            }
        });
        
        let scaledIngredientsJson;
        try {
            // Fix: Trim whitespace from the response before parsing JSON.
            scaledIngredientsJson = JSON.parse(response.text.trim());
        } catch(parseError) {
            console.error("JSON parsing error during scaling:", parseError);
            throw new Error("The AI returned an invalid format for scaled ingredients.");
        }
        
        if (!Array.isArray(scaledIngredientsJson)) {
            console.error("Scaled ingredients response is not an array:", scaledIngredientsJson);
            throw new Error("The AI returned an invalid format for scaled ingredients.");
        }

        return scaledIngredientsJson as string[];

    } catch (error) {
        console.error("Error scaling ingredients:", error);
        if (error instanceof Error && error.message.includes("invalid format")) {
            throw error;
        }
        throw new Error("Failed to scale ingredients. There might be a connection issue.");
    }
};