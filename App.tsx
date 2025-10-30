import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import IngredientInput from './components/IngredientInput';
import RecipeDisplay from './components/RecipeDisplay';
import Loader from './components/Loader';
import { generateRecipe, Recipe } from './services/geminiService';

const App: React.FC = () => {
    const [ingredients, setIngredients] = useState<string>('');
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);

    const handleDietaryChange = (option: string) => {
        setDietaryRestrictions(prev =>
            prev.includes(option)
                ? prev.filter(item => item !== option)
                : [...prev, option]
        );
    };

    const handleGenerateRecipe = useCallback(async () => {
        if (!ingredients.trim()) {
            setError('Please enter some ingredients.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setRecipe(null);

        try {
            const result = await generateRecipe(ingredients, dietaryRestrictions);
            setRecipe(result);
        } catch (e: any) {
            setError(e.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [ingredients, dietaryRestrictions]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10 space-y-8">
                    <IngredientInput
                        ingredients={ingredients}
                        setIngredients={setIngredients}
                        onGenerate={handleGenerateRecipe}
                        isLoading={isLoading}
                        dietaryRestrictions={dietaryRestrictions}
                        onDietaryChange={handleDietaryChange}
                    />
                    
                    {error && (
                         <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-md" role="alert">
                            <div className="flex">
                                <div className="py-1">
                                    <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM9 9a1 1 0 0 1 2 0v4a1 1 0 1 1-2 0V9zm2-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold">An Error Occurred</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {isLoading && <Loader />}
                    
                    {recipe && !isLoading && (
                        <RecipeDisplay recipe={recipe} />
                    )}

                     {!recipe && !isLoading && !error && (
                        <div className="text-center py-10 px-6 bg-blue-50/50 rounded-lg border-2 border-dashed border-blue-200">
                            <h3 className="text-xl font-semibold text-blue-800">Ready to Cook?</h3>
                            <p className="mt-2 text-blue-700">
                                Your delicious, AI-generated recipe will appear here once you enter your ingredients above.
                            </p>
                        </div>
                    )}
                </div>
            </main>
            <footer className="text-center py-6 text-gray-500 text-sm">
                <p>Powered by Gemini AI</p>
            </footer>
        </div>
    );
};

export default App;