
import React from 'react';
import { ChefIcon } from './icons/ChefIcon';

const Header: React.FC = () => {
    return (
        <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
            <div className="container mx-auto px-4 py-4 flex items-center justify-center space-x-3">
                <ChefIcon className="h-8 w-8 text-amber-600" />
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                    AI Cooking Assistant
                </h1>
            </div>
        </header>
    );
};

export default Header;
