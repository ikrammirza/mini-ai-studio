import React, { useState, useEffect } from 'react';
import { Image, MessageSquare, LogOut } from 'lucide-react';
import { Upload } from '../components/Upload';
import { useGenerate } from '../hooks/useGenerate';
import { getGenerations, logout } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Generation {
  id: number;
  prompt: string;
  style: string;
  imageUrl: string;
  createdAt: string;
  status: string;
}

type View = 'generate' | 'history';

const Studio: React.FC = () => {
  const navigate = useNavigate();
  const { generate, abort, loading, error, attempts } = useGenerate();

  const [view, setView] = useState<View>('generate');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('photorealistic');
  const [file, setFile] = useState<File | null>(null);
  const [restoredImageUrl, setRestoredImageUrl] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );
  const [history, setHistory] = useState<Generation[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const styles = [
    'photorealistic', 'fantasy art', 'digital painting',
    'cyberpunk', 'abstract', 'low-poly 3D', 'watercolor', 'anime'
  ];

  // Protect Studio route
  useEffect(() => {
    const token = localStorage.getItem('mini_ai_studio_jwt');
    if (!token) navigate('/login');
  }, [navigate]);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // Logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fetch history
  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await getGenerations(10);
      setHistory(res.data);
    } catch (e) {
      console.error(e);
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
    setView('generate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerate = async () => {
    if (!file) { alert("Upload a base image"); return; }
    if (!prompt || !style) { alert("Prompt & style required"); return; }

    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('style', style);
    formData.append('imageUpload', file);

    try {
      await generate(formData);
      await fetchHistory();
    } catch (e) { console.error(e); }
  };

  const NavButton: React.FC<{ targetView: View; icon: React.ElementType; label: string }> = ({ targetView, icon: Icon, label }) => (
    <button
      onClick={() => setView(targetView)}
      className={`flex items-center space-x-2 py-2 px-4 rounded-full text-sm font-medium transition duration-150 ${
        view === targetView ? 'bg-indigo-700 text-white shadow-lg' : 'text-indigo-100 hover:bg-indigo-600'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className="w-full bg-indigo-800 shadow-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-extrabold text-white tracking-wider">AI Studio</div>

          <div className="flex items-center gap-4">
            <nav className="flex space-x-2 sm:space-x-4">
              <NavButton targetView="generate" icon={Image} label="Generate" />
              <NavButton targetView="history" icon={MessageSquare} label="History" />
            </nav>

            <button onClick={toggleTheme} className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700">{theme==='dark'?'☀️':'🌙'}</button>
            <button onClick={handleLogout} className="ml-2 p-2 rounded-full bg-red-600 text-white hover:bg-red-700 flex items-center gap-1">
              <LogOut className="w-4 h-4"/> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex flex-col items-center justify-start pt-12 pb-12 w-full">
        {view === 'generate' ? (
          <div className="flex flex-col lg:flex-row gap-8 justify-center w-full max-w-6xl p-4">
            {/* Form */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl space-y-6 w-full max-w-xl">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white border-b pb-3 mb-6">Create Image</h2>

              {restoredImageUrl && (
                <div className="mb-4 p-4 border rounded-xl bg-yellow-50 dark:bg-yellow-900/50 shadow-md">
                  <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Restored from history</p>
                  <img src={restoredImageUrl} alt="Restored" className="max-h-32 rounded-lg shadow-lg" />
                  <button onClick={() => setRestoredImageUrl(null)} className="text-xs text-red-500 dark:text-red-300 mt-1 hover:underline">Clear</button>
                </div>
              )}

              <input
                type="text"
                placeholder="Prompt"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-3"
              />
              <select
                value={style}
                onChange={e => setStyle(e.target.value)}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-3"
              >
                {styles.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <Upload onFile={setFile} label="Upload Base Image" />

              <button
                onClick={handleGenerate}
                disabled={loading || !file || !prompt || !style}
                className={`w-full mt-4 py-3 rounded-lg font-bold ${loading?'bg-gray-500 text-gray-300':'bg-green-600 hover:bg-green-700 text-white shadow-lg'}`}
              >
                {loading ? `Generating... (${attempts}/3)` : 'Generate Image'}
              </button>
              {error && <p className="text-red-500 dark:text-red-400 mt-2">{error}</p>}
            </div>

            {/* Preview */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xl flex justify-center items-center h-96">
              {file ? <img src={URL.createObjectURL(file)} alt="Preview" className="object-cover max-h-full rounded-lg shadow-lg" /> :
                <p className="text-gray-500 dark:text-gray-400">Your generated image will appear here</p>}
            </div>
          </div>
        ) : (
          // History view
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl space-y-6 max-w-4xl w-full mx-auto">
            <h2 className="text-3xl font-extrabold border-b pb-3">Local Generation History</h2>
            {historyLoading ? <p className="text-gray-500 dark:text-gray-400">Loading...</p> :
              history.length === 0 ? <p className="text-gray-500">No history found</p> :
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {history.map(gen => (
                    <button key={gen.id} onClick={() => handleRestore(gen)}
                      className="flex flex-col items-center cursor-pointer border rounded-xl p-2 bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow-xl">
                      <img src={gen.imageUrl} alt={gen.prompt} className="w-full h-48 object-cover rounded-lg mb-1" />
                      <span className="text-sm font-medium truncate">{gen.style}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(gen.createdAt).toLocaleString()}</span>
                    </button>
                  ))}
                </div>
            }
          </div>
        )}
      </main>

      <footer className="w-full bg-gray-800 text-center text-gray-400 py-4 text-sm mt-auto shadow-inner">
        Powered by React & Gemini Image APIs
      </footer>
    </div>
  );
};

export default Studio;
