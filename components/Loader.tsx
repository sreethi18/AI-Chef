
import React from 'react';
import { ChefIcon } from './icons/ChefIcon';

const Loader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <ChefIcon className="h-16 w-16 text-amber-500 animate-bounce" />
            <p className="text-lg font-medium text-slate-600">
                The AI chef is thinking...
            </p>
            <p className="text-sm text-slate-500">
                Whipping up something delicious for you!
            </p>
        </div>
    );
};

export default Loader;
