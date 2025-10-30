
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import IngredientInput from './components/IngredientInput';
import RecipeDisplay from './components/RecipeDisplay';
import Loader from './components/Loader';
import { generateRecipe } from './services/geminiService';

const App: React.FC = () => {
    const [ingredients, setIngredients] = useState<string>('');
    const [recipe, setRecipe] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateRecipe = useCallback(async () => {
        if (!ingredients.trim()) {
            setError('Please enter some ingredients.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setRecipe(null);

        try {
            const result = await generateRecipe(ingredients);
            setRecipe(result);
        } catch (e: any) {
            setError(e.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [ingredients]);

    return (
        <div className="min-h-screen bg-amber-50 font-sans text-slate-800">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10 space-y-8">
                    <IngredientInput
                        ingredients={ingredients}
                        setIngredients={setIngredients}
                        onGenerate={handleGenerateRecipe}
                        isLoading={isLoading}
                    />
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                            <strong className="font-bold">Oops! </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {isLoading && <Loader />}
                    
                    {recipe && !isLoading && (
                        <RecipeDisplay recipeMarkdown={recipe} />
                    )}

                     {!recipe && !isLoading && !error && (
                        <div className="text-center py-10 px-6 bg-amber-100/50 rounded-lg border-2 border-dashed border-amber-300">
                            <h3 className="text-xl font-semibold text-amber-800">Ready to Cook?</h3>
                            <p className="mt-2 text-amber-700">
                                Your delicious, AI-generated recipe will appear here once you enter your ingredients above.
                            </p>
                        </div>
                    )}
                </div>
            </main>
            <footer className="text-center py-4 text-slate-500 text-sm">
                <p>Powered by Gemini AI</p>
            </footer>
        </div>
    );
};

export default App;
