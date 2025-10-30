
import React from 'react';

interface IconProps {
    className?: string;
}

export const ChefIcon: React.FC<IconProps> = ({ className }) => {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 3.93A8.5 8.5 0 1 0 12 12a8.47 8.47 0 0 0 4-1.07zm-1.12 1.63a6.5 6.5 0 1 1-2.26 5.89A6.52 6.52 0 0 1 14.88 5.56z" opacity=".4"/>
            <path d="M12 4a4.49 4.49 0 0 0-4.5 4.5v.5h9v-.5A4.49 4.49 0 0 0 12 4zm6 6.5a2.5 2.5 0 0 0-2.5-2.5h-1a2 2 0 0 0-2 2v1a2 2 0 0 0-2-2h-1A2.5 2.5 0 0 0 7 10.5v1.2a2.49 2.49 0 0 0 2.22 2.48A3 3 0 0 0 12 15a3 3 0 0 0 2.78-1.82A2.49 2.49 0 0 0 17 11.7V10.5z"/>
            <path d="M6 14h12v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/>
        </svg>
    );
};
