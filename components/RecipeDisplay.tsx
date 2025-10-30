import React, { useState, useEffect, useRef } from 'react';
import { Recipe, scaleIngredients } from '../services/geminiService';
import { ShareIcon } from './icons/ShareIcon';

interface RecipeDisplayProps {
    recipe: Recipe;
}

const DifficultyBadge: React.FC<{ difficulty: 'Easy' | 'Medium' | 'Hard' }> = ({ difficulty }) => {
    const colors = {
        Easy: 'bg-green-100 text-green-800',
        Medium: 'bg-blue-100 text-blue-800',
        Hard: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${colors[difficulty]}`}>
            {difficulty}
        </span>
    );
};

const NutritionInfo: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200/80">
        <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="font-bold text-lg text-blue-800">{value}</p>
    </div>
);

const CookingTimer: React.FC<{
    timeRemaining: number;
    isTimerRunning: boolean;
    onStartPause: () => void;
    onReset: () => void;
    isFinished: boolean;
}> = ({ timeRemaining, isTimerRunning, onStartPause, onReset, isFinished }) => {
    const formatTime = (seconds: number): string => {
        if (seconds < 0) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="my-6 p-4 bg-blue-50/70 rounded-lg border border-blue-200 text-center">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Cooking Timer</h3>
            <div className={`text-5xl font-bold font-mono tracking-wider ${isFinished ? 'text-green-600 animate-pulse' : 'text-gray-800'}`}>
                {isFinished ? "Time's Up!" : formatTime(timeRemaining)}
            </div>
            <div className="flex justify-center gap-3 mt-4">
                <button 
                    onClick={onStartPause}
                    disabled={isFinished}
                    className="px-5 py-2 text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isTimerRunning ? 'Pause' : 'Start'}
                </button>
                <button 
                    onClick={onReset}
                    className="px-5 py-2 text-base font-medium rounded-md shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
    const [servings, setServings] = useState(recipe.servings);
    const [scaledIngredients, setScaledIngredients] = useState(recipe.ingredients);
    const [isScaling, setIsScaling] = useState(false);
    const [scaleError, setScaleError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    // Timer State
    const [initialDuration, setInitialDuration] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const timerRef = useRef<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const parseTimeToSeconds = (timeString: string): number => {
        const match = timeString.match(/\d+/);
        if (match) {
            return parseInt(match[0], 10) * 60;
        }
        return 0;
    };

    // Effect to initialize the timer with totalTime and set up audio
    useEffect(() => {
        const durationInSeconds = parseTimeToSeconds(recipe.totalTime);
        setInitialDuration(durationInSeconds);
        setTimeRemaining(durationInSeconds);
        setIsTimerRunning(false);
        if (timerRef.current) clearInterval(timerRef.current);
        
        // Using a data URI for a simple beep sound to avoid extra file requests
        const beepSound = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU0AAAAA//8/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f3-";
        audioRef.current = new Audio(beepSound);

        return () => {
             if (timerRef.current) clearInterval(timerRef.current);
        }
    }, [recipe]);

     // Effect to run the countdown
    useEffect(() => {
        if (isTimerRunning && timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
        } else if (timeRemaining <= 0 && isTimerRunning) {
            setIsTimerRunning(false);
            setTimeRemaining(0);
            audioRef.current?.play();
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isTimerRunning, timeRemaining]);
    
    // Reset component state when a new recipe is passed in
    useEffect(() => {
        setServings(recipe.servings);
        setScaledIngredients(recipe.ingredients);
        setIsScaling(false);
        setScaleError(null);
        setIsCopied(false);
    }, [recipe]);

    const handleScaleRecipe = async () => {
        if (servings === recipe.servings || servings < 1) {
            setScaledIngredients(recipe.ingredients); // Reset to original if invalid or unchanged
            return;
        };

        setIsScaling(true);
        setScaleError(null);
        try {
            const newIngredients = await scaleIngredients(recipe.ingredients, recipe.servings, servings);
            setScaledIngredients(newIngredients);
        } catch (e: any) {
            setScaleError(e.message || "An unknown error occurred while scaling.");
        } finally {
            setIsScaling(false);
        }
    };
    
    // Timer Handlers
    const handleStartPause = () => {
        if (timeRemaining > 0) {
            setIsTimerRunning(prev => !prev);
        }
    };
    
    const handleReset = () => {
        setIsTimerRunning(false);
        setTimeRemaining(initialDuration);
    };

    const handleStartStepTimer = (minutes: number) => {
        const durationInSeconds = minutes * 60;
        setInitialDuration(durationInSeconds);
        setTimeRemaining(durationInSeconds);
        setIsTimerRunning(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleShare = async () => {
        const shareText = `Check out this recipe: ${recipe.recipeName}\n\n${recipe.description}\n\nIngredients:\n${scaledIngredients.join('\n')}\n\nInstructions:\n${recipe.instructions.map((step, i) => `${i + 1}. ${step.text}`).join('\n')}\n\nGenerated by AI Cooking Assistant.`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: recipe.recipeName,
                    text: shareText,
                });
            } catch (error) {
                console.log('Web Share API canceled or failed:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareText);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
            } catch (error) {
                console.error('Failed to copy recipe to clipboard: ', error);
                alert('Failed to copy recipe.');
            }
        }
    };

    const isFinished = timeRemaining <= 0 && !isTimerRunning && initialDuration > 0;

    return (
        <article className="space-y-6 p-6 bg-white rounded-lg border border-gray-200">
            {/* Header */}
            <header className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                    <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-gray-100 pb-2 flex-grow">
                        {recipe.recipeName}
                    </h2>
                     <button
                        onClick={handleShare}
                        className="flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200 bg-white text-gray-700 border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        aria-label="Share recipe"
                    >
                        <ShareIcon className="h-5 w-5" />
                        {isCopied ? 'Copied!' : 'Share'}
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <DifficultyBadge difficulty={recipe.difficulty} />
                    <span className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {recipe.totalTime}
                    </span>
                     <span className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Serves {recipe.servings}
                    </span>
                </div>
                <p className="text-gray-600 pt-2">{recipe.description}</p>
            </header>
            
            {initialDuration > 0 && (
                 <CookingTimer 
                    timeRemaining={timeRemaining}
                    isTimerRunning={isTimerRunning}
                    onStartPause={handleStartPause}
                    onReset={handleReset}
                    isFinished={isFinished}
                />
            )}

             {/* Nutrition */}
            {recipe.nutrition && (
                 <div className="pt-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Estimated Nutrition <span className="text-sm font-normal text-gray-500">(per serving)</span></h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <NutritionInfo label="Calories" value={recipe.nutrition.calories} />
                        <NutritionInfo label="Protein" value={recipe.nutrition.protein} />
                        <NutritionInfo label="Carbs" value={recipe.nutrition.carbs} />
                        <NutritionInfo label="Fat" value={recipe.nutrition.fat} />
                    </div>
                </div>
            )}
            
            {/* Main Content */}
            <div className="grid md:grid-cols-3 gap-8 pt-4 border-t border-gray-200">
                {/* Ingredients */}
                <div className="md:col-span-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Ingredients</h3>
                    
                    {/* Scaling UI */}
                    <div className="p-3 bg-gray-100/70 rounded-lg mb-4 space-y-2 border border-gray-200">
                        <label htmlFor="servings" className="block text-sm font-medium text-gray-700">
                            Adjust Servings
                        </label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="number" 
                                id="servings"
                                min="1"
                                value={servings}
                                onChange={(e) => setServings(Number(e.target.value))}
                                className="w-20 p-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                disabled={isScaling}
                                aria-label="Number of servings"
                            />
                            <button 
                                onClick={handleScaleRecipe}
                                disabled={isScaling || servings === recipe.servings || servings < 1}
                                className="px-3 py-1.5 text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {isScaling ? 'Scaling...' : 'Update'}
                            </button>
                        </div>
                         {scaleError && (
                            <div className="text-sm text-red-700 mt-2 p-2 bg-red-100 border border-red-200 rounded-md">
                                {scaleError}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        {isScaling && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-10">
                                <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        )}
                        <ul className={`space-y-2 pl-5 list-disc transition-opacity ${isScaling ? 'opacity-50' : 'opacity-100'}`}>
                            {scaledIngredients.map((item, i) => (
                                <li key={i} className="text-gray-600 leading-relaxed">{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Instructions */}
                <div className="md:col-span-2">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Instructions</h3>
                     <ol className="space-y-4">
                        {recipe.instructions.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="flex-shrink-0 h-6 w-6 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold text-sm">
                                    {i + 1}
                                </span>
                                <div className="flex-grow space-y-2">
                                    <p className="text-gray-700 leading-relaxed">{item.text}</p>
                                    {item.duration && (
                                        <button 
                                            onClick={() => handleStartStepTimer(item.duration!)}
                                            className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full border bg-white text-blue-700 border-blue-200 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            aria-label={`Start timer for ${item.duration} minutes`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Start {item.duration} min timer</span>
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* Substitutions */}
            {recipe.substitutions && recipe.substitutions.length > 0 && (
                 <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Substitutions & Tips</h3>
                    <ul className="space-y-2 pl-5 list-disc">
                        {recipe.substitutions.map((sub, i) => (
                            <li key={i} className="text-gray-600 leading-relaxed">
                               <strong className="font-semibold text-gray-700">{sub.missingIngredient}:</strong> {sub.suggestion}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </article>
    );
};

export default RecipeDisplay;