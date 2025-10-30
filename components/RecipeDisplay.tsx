
import React, { ReactNode } from 'react';

interface RecipeDisplayProps {
    recipeMarkdown: string;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipeMarkdown }) => {

    const parseMarkdown = (markdown: string): ReactNode[] => {
        const lines = markdown.split('\n');
        const elements: ReactNode[] = [];
        let listItems: string[] = [];
        let listType: 'ul' | 'ol' | null = null;

        const closeList = () => {
            if (listItems.length > 0 && listType) {
                const listKey = `list-${elements.length}`;
                if (listType === 'ul') {
                    elements.push(
                        <ul key={listKey} className="space-y-2 pl-5 list-disc">
                            {listItems.map((item, i) => <li key={i} className="text-slate-600 leading-relaxed">{item}</li>)}
                        </ul>
                    );
                } else {
                     elements.push(
                        <ol key={listKey} className="space-y-2 pl-5 list-decimal">
                             {listItems.map((item, i) => <li key={i} className="text-slate-600 leading-relaxed marker:font-semibold">{item}</li>)}
                        </ol>
                    );
                }
                listItems = [];
                listType = null;
            }
        };

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();

            if (trimmedLine.startsWith('## ')) {
                closeList();
                elements.push(<h2 key={index} className="text-3xl font-bold mt-4 mb-4 text-amber-800 border-b-2 border-amber-200 pb-2">{trimmedLine.substring(3)}</h2>);
            } else if (trimmedLine.startsWith('### ')) {
                closeList();
                elements.push(<h3 key={index} className="text-xl font-bold mt-6 mb-2 text-slate-700">{trimmedLine.substring(4)}</h3>);
            } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
                 if (listType !== 'ul') {
                    closeList();
                    listType = 'ul';
                }
                listItems.push(trimmedLine.substring(2));
            } else if (/^\d+\.\s/.test(trimmedLine)) {
                if (listType !== 'ol') {
                    closeList();
                    listType = 'ol';
                }
                listItems.push(trimmedLine.replace(/^\d+\.\s/, ''));
            } else if (trimmedLine.length > 0) {
                closeList();
                elements.push(<p key={index} className="text-slate-600 leading-relaxed mb-2">{trimmedLine}</p>);
            }
        });
        
        closeList(); // Ensure any trailing list is closed

        return elements;
    };


    return (
        <article className="prose max-w-none p-6 bg-amber-50/50 rounded-lg border border-amber-200">
            {parseMarkdown(recipeMarkdown)}
        </article>
    );
};

export default RecipeDisplay;
