import React, { useState, useEffect } from 'react';
import { useGenerate } from '../hooks/useGenerate';
import { Upload } from '../components/Upload'; 
import { getGenerations } from '../services/api'; 

// Define a type for the data returned from the backend
interface Generation {
    id: number;
    prompt: string;
    style: string;
    imageUrl: string;
    createdAt: string;
    status: string;
}

const Studio: React.FC = () => {
    const { generate, abort, loading, error, attempts } = useGenerate();
    
    // 1. Workspace State
    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [restoredImageUrl, setRestoredImageUrl] = useState<string | null>(null);

    // 2. Theme State (Handles saving and initial loading of theme preference)
    const [theme, setTheme] = useState<'light' | 'dark'>(() => 
        (localStorage.getItem('theme') as 'light' | 'dark') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    );
    
    // 3. History State
    const [history, setHistory] = useState<Generation[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    // Effect to apply theme class and save preference
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
            const res = await getGenerations(5);
            setHistory(res.data);
        } catch (e) {
            console.error("Failed to fetch history:", e);
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []); 
    
    const handleRestore = (gen: Generation) => {
        setPrompt(gen.prompt);
        setStyle(gen.style);
        setRestoredImageUrl(gen.imageUrl);
        setFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleGenerate = async () => {
        if (!file) {
            alert("Please upload a base image file.");
            return;
        }
        if (!prompt || !style) {
            alert("Please provide a prompt and style.");
            return;
        }

        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('style', style);
        formData.append('imageUpload', file); 

        try {
            await generate(formData);
            await fetchHistory(); 
        } catch (e) {
            console.error("Generation flow failed or was aborted.");
        }
    };


    return (
        // Apply the theme classes to the main container
        <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            
            <div className="p-4 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold transition-colors duration-300">AI Studio</h1>
                    {/* Dark Mode Toggle Button */}
                    <button 
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-300 hover:scale-105"
                        aria-label="Toggle dark mode"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                </div>
            
                {restoredImageUrl && (
                    <div className="mb-4 p-4 border rounded-xl bg-yellow-50 dark:bg-yellow-900/50 dark:border-yellow-700 shadow-md">
                        <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                            Workspace Restored from History.
                        </p>
                        <img src={restoredImageUrl} alt="Restored Base" className="max-h-32 w-auto rounded-lg shadow-lg" />
                        <button 
                            onClick={() => setRestoredImageUrl(null)}
                            className="text-xs text-red-500 dark:text-red-300 mt-1 hover:underline"
                        >
                            Clear Restored Image
                        </button>
                    </div>
                )}
                
                {/* 1. Inputs and Upload */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <input 
                        type="text" 
                        placeholder="Prompt" 
                        value={prompt} 
                        onChange={e => setPrompt(e.target.value)} 
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                    />
                    <input 
                        type="text" 
                        placeholder="Style (e.g., 'cyberpunk', 'watercolor')" 
                        value={style} 
                        onChange={e => setStyle(e.target.value)} 
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                    />
                    <Upload onFile={setFile} label="Upload Base Image" /> 
                </div>

                {/* 2. Controls and Status */}
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !file || !prompt || !style} 
                        className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 transform ${loading ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'}`}
                    >
                        {loading ? `Generating... (${attempts}/3)` : 'Generate Image'}
                    </button>
                    
                    {loading && (
                        <button
                            onClick={abort}
                            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300 transform shadow-lg hover:shadow-xl"
                        >
                            Abort
                        </button>
                    )}
                </div>

                {error && <p className="text-red-500 dark:text-red-400 mb-4 font-semibold p-2 bg-red-100 dark:bg-red-900 rounded-lg">Error: {error}</p>}
                
                {/* 3. History Panel */}
                <h2 className="text-xl font-semibold mt-8 mb-4 border-b pb-2 dark:border-gray-700">Generation History (Last 5)</h2>
                {historyLoading && <p className="text-gray-500 dark:text-gray-400">Loading history...</p>}
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {history.length === 0 && !historyLoading && <p className="col-span-5 text-gray-500">No successful generations found.</p>}
                    
                    {history.map((gen) => (
                        <button 
                            key={gen.id} 
                            onClick={() => handleRestore(gen)}
                            className="flex flex-col items-center group cursor-pointer border rounded-xl p-2 transition-all duration-200 shadow-md bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500 dark:focus:ring-blue-400"
                            role="button" 
                            aria-label={`Restore: ${gen.prompt} (${gen.style})`}
                        >
                            <img 
                                src={gen.imageUrl} 
                                alt={gen.prompt} 
                                className="w-full h-24 object-cover rounded-lg mb-1 transition-transform group-hover:scale-[1.02]"
                            />
                            <span className="text-sm font-medium truncate w-full text-center group-hover:text-blue-600 dark:group-hover:text-blue-400" title={gen.prompt}>
                                {gen.style}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(gen.createdAt).toLocaleTimeString()}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Studio;