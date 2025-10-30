
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
if (!apiKey) {
    // This will be handled by the execution environment.
    // In a local dev environment, this would throw an error.
    console.warn("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const generateRecipe = async (ingredients: string): Promise<string> => {
    if (!ingredients.trim()) {
        throw new Error("Please provide some ingredients.");
    }

    const model = "gemini-2.5-flash";
    const prompt = `
        You are an expert chef with a talent for creating delicious and easy-to-follow recipes.
        A user has the following ingredients and wants a recipe.

        Ingredients provided: "${ingredients}"

        Your task is to:
        1.  Create a creative and appealing name for the recipe.
        2.  List out the ingredients needed for the recipe, including the ones provided and any common pantry staples that might be required (like salt, pepper, oil).
        3.  Provide clear, step-by-step instructions for preparing the dish.
        4.  Format the entire response in simple Markdown. Use a main '##' heading for the recipe name, and '###' subheadings for 'Ingredients' and 'Instructions'. Use bullet points for lists of ingredients and numbered lists for instructions.

        Example Format:
        ## Cheesy Garlic Bread
        ### Ingredients
        - 1 loaf of French bread
        - 1/2 cup butter, softened
        - 2 cloves garlic, minced
        - 1 cup shredded mozzarella cheese
        - Salt and pepper to taste

        ### Instructions
        1. Preheat your oven to 375°F (190°C).
        2. Slice the bread in half lengthwise.
        3. In a small bowl, mix together the butter and garlic.
        4. Spread the garlic butter evenly on both halves of the bread.
        5. Sprinkle with mozzarella cheese, salt, and pepper.
        6. Bake for 10-12 minutes, or until the cheese is bubbly and golden brown.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating recipe:", error);
        throw new Error("Failed to generate recipe. The AI chef might be busy. Please try again later.");
    }
};
