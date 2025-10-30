
import React from 'react';

interface IngredientInputProps {
    ingredients: string;
    setIngredients: (value: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
}

const IngredientInput: React.FC<IngredientInputProps> = ({
    ingredients,
    setIngredients,
    onGenerate,
    isLoading,
}) => {
    return (
        <div className="space-y-4">
            <label htmlFor="ingredients" className="block text-lg font-semibold text-slate-700">
                What ingredients do you have?
            </label>
            <textarea
                id="ingredients"
                rows={4}
                className="w-full p-4 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150 ease-in-out text-base"
                placeholder="e.g., chicken breasts, rice, broccoli, soy sauce"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                disabled={isLoading}
            />
            <button
                onClick={onGenerate}
                disabled={isLoading || !ingredients.trim()}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating your recipe...
                    </>
                ) : (
                    'Generate Recipe'
                )}
            </button>
        </div>
    );
};

export default IngredientInput;
