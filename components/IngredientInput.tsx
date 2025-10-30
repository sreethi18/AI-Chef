import React, { useState, useEffect, useRef } from 'react';
import { MicrophoneIcon } from './icons/MicrophoneIcon';

interface IngredientInputProps {
    ingredients: string;
    setIngredients: (value: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
    dietaryRestrictions: string[];
    onDietaryChange: (option: string) => void;
}

const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Low-Carb'];

// Extend the Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const IngredientInput: React.FC<IngredientInputProps> = ({
    ingredients,
    setIngredients,
    onGenerate,
    isLoading,
    dietaryRestrictions,
    onDietaryChange
}) => {
    const [isListening, setIsListening] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState('');
    const recognitionRef = useRef<any>(null);
    const isSpeechSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

    useEffect(() => {
        if (!isSpeechSupported) {
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true; // Enable interim results for real-time feedback
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
        };
        recognition.onend = () => {
            setIsListening(false);
            setInterimTranscript(''); // Clean up on stop
        };
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
            setInterimTranscript(''); // Clean up on error
        };
        
        recognition.onresult = (event: any) => {
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript;
                } else {
                    interim += event.results[i][0].transcript;
                }
            }
            
            // Append the final transcript to the ingredients list
            if (final.trim()) {
                setIngredients(prev => {
                    const trimmedPrev = prev.trim();
                    if (!trimmedPrev) return final.trim();
                    // Add a comma separator for a clean list
                    return `${trimmedPrev}, ${final.trim()}`;
                });
            }
            // Update the interim transcript for visual feedback
            setInterimTranscript(interim);
        };

        recognitionRef.current = recognition;

        return () => {
            recognitionRef.current?.stop();
        };
    }, [isSpeechSupported, setIngredients]);

    const handleToggleListening = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };


    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="ingredients" className="block text-lg font-semibold text-gray-700">
                    What ingredients do you have?
                </label>
                <div className="relative mt-2">
                    <textarea
                        id="ingredients"
                        rows={4}
                        className="w-full p-4 pr-12 border border-gray-300 bg-gray-50 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-base"
                        placeholder="e.g., chicken breasts, rice, broccoli, soy sauce"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        disabled={isLoading}
                        aria-label="Ingredients Input"
                    />
                    {isSpeechSupported && (
                         <button
                            onClick={handleToggleListening}
                            disabled={isLoading}
                            aria-label={isListening ? 'Stop listening' : 'Start dictating ingredients'}
                            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50
                                ${
                                    isListening 
                                    ? 'bg-red-500 text-white animate-pulse' 
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                         >
                            <MicrophoneIcon className="h-5 w-5" />
                         </button>
                    )}
                </div>
                {isListening && (
                    <div className="mt-2 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-800 h-10 flex items-center overflow-hidden">
                        <span className="mr-2 flex items-center flex-shrink-0">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <span className="ml-2 font-medium">Listening...</span>
                        </span>
                        <span className="italic text-gray-500 truncate">{interimTranscript}</span>
                    </div>
                )}
            </div>

            <div>
                 <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    Dietary Options <span className="text-sm font-normal text-gray-500">(Optional)</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                    {DIETARY_OPTIONS.map(option => {
                        const isSelected = dietaryRestrictions.includes(option);
                        return (
                            <button 
                                key={option} 
                                onClick={() => onDietaryChange(option)}
                                role="checkbox"
                                aria-checked={isSelected}
                                className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors duration-200 ${
                                    isSelected 
                                    ? 'bg-blue-600 text-white border-blue-600' 
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                                }`}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>

            <button
                onClick={onGenerate}
                disabled={isLoading || !ingredients.trim()}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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