// import React, { useState, ChangeEvent, FormEvent } from 'react';
// import { RefreshCcw, Image, MessageSquare } from 'lucide-react';
// import { useNavigate } from 'react-router-dom'; // <-- import this

// // --- Configuration ---
// const PRIMARY_COLOR_CLASS = 'bg-indigo-600 hover:bg-indigo-700';

// // --- TypeScript Interfaces ---
// interface Generation {
//   id: string;
//   prompt: string;
//   style: string;
//   imageUrl: string;
//   createdAt: string;
// }

// type LucideIconComponent = React.ComponentType<{
//   size?: number | string;
//   color?: string;
//   strokeWidth?: number | string;
//   className?: string;
// }>;

// const App: React.FC = () => {
//   const navigate = useNavigate(); // <-- hook for navigation
//   const [view, setView] = useState<'generate' | 'history'>('generate');
//   const [prompt, setPrompt] = useState<string>('');
//   const [style, setStyle] = useState<string>('photorealistic');
//   const [generatedImage, setGeneratedImage] = useState<string | null>(null);
//   const [generations, setGenerations] = useState<Generation[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [message, setMessage] = useState<string>('');

//   const styles: string[] = [
//     'photorealistic', 'fantasy art', 'digital painting', 'cyberpunk',
//     'abstract', 'low-poly 3D', 'watercolor', 'anime'
//   ];

//   const clearMessages = (): void => setMessage('');

//   // --- Generate Image ---
//   const handleGenerate = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!prompt.trim()) {
//       setMessage('Please enter a prompt.');
//       return;
//     }
//     clearMessages();
//     setIsLoading(true);
//     setGeneratedImage(null);

//     try {
//       const response = await fetch('/api/generate-image', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt, style }),
//       });
//       if (!response.ok) {
//         const text = await response.text();
//         console.error("Server responded with:", text);
//         throw new Error(`HTTP ${response.status}`);
//       }
//       const result = await response.json();
//       if (result.imageUrl) {
//         setGeneratedImage(result.imageUrl);
//         const newGen: Generation = {
//           id: crypto.randomUUID(),
//           prompt: `${prompt}, style: ${style}`,
//           style,
//           imageUrl: result.imageUrl,
//           createdAt: new Date().toISOString(),
//         };
//         setGenerations(prev => [newGen, ...prev]);
//         setMessage('✅ Image generated successfully!');
//       } else throw new Error(result.error || 'Image generation failed.');
//     } catch (error: any) {
//       console.error('Error generating image:', error);
//       setMessage(`❌ Generation failed: ${error.message || 'Check console for details.'}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // --- Components ---
//   const GenerationForm: React.FC = () => (
//     <div className="p-6 bg-white rounded-xl shadow-2xl space-y-6 max-w-xl w-full">
//       <h2 className="text-3xl font-extrabold text-gray-900 border-b pb-3 mb-6">Create Image (Text-to-Image)</h2>
//       <form onSubmit={handleGenerate} className="space-y-4">
//         <div>
//           <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
//           <textarea
//             id="prompt"
//             rows={3}
//             value={prompt}
//             onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
//             placeholder="A golden retriever puppy wearing sunglasses on a beach at sunset"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-1">Style</label>
//           <select
//             id="style"
//             value={style}
//             onChange={(e: ChangeEvent<HTMLSelectElement>) => setStyle(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
//           >
//             {styles.map(s => (
//               <option key={s} value={s}>{s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>
//             ))}
//           </select>
//         </div>

//         <button
//           type="submit"
//           className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white ${PRIMARY_COLOR_CLASS} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:bg-indigo-300`}
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <>
//               <RefreshCcw className="animate-spin mr-2 h-5 w-5" />
//               Generating...
//             </>
//           ) : 'Generate Image'}
//         </button>
//       </form>

//       {message && (
//         <div className={`p-3 mt-4 rounded-lg text-sm font-medium ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//           {message}
//         </div>
//       )}
//     </div>
//   );

//   const ImagePreview: React.FC = () => (
//     <div className="p-6 bg-white rounded-xl shadow-2xl max-w-xl w-full">
//       <h2 className="text-3xl font-extrabold text-gray-900 border-b pb-3 mb-6">Result</h2>
//       {isLoading ? (
//         <div className="flex flex-col items-center justify-center h-80 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-gray-500">
//           <RefreshCcw className="animate-spin w-12 h-12 mb-3 text-indigo-500" />
//           <p>Processing image...</p>
//         </div>
//       ) : generatedImage ? (
//         <div className="flex justify-center items-center">
//           <img
//             src={generatedImage}
//             alt="Generated AI Image"
//             className="w-full h-auto object-cover rounded-lg shadow-lg aspect-square"
//           />
//         </div>
//       ) : (
//         <div className="flex flex-col items-center justify-center h-80 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-gray-500">
//           <Image className="w-12 h-12 mb-3" />
//           <p>Your generated image will appear here.</p>
//         </div>
//       )}
//     </div>
//   );

//   const HistoryView: React.FC = () => (
//     <div className="p-6 bg-white rounded-xl shadow-2xl space-y-6 max-w-4xl w-full mx-auto">
//       <h2 className="text-3xl font-extrabold text-gray-900 border-b pb-3">Local Generation History</h2>
//       {generations.length === 0 ? (
//         <p className="text-gray-500">No generation history found. Start creating!</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {generations.map((gen) => (
//             <div key={gen.id} className="bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden transition transform hover:shadow-xl hover:-translate-y-0.5">
//               <img
//                 src={gen.imageUrl}
//                 alt={gen.prompt}
//                 className="w-full h-48 object-cover"
//                 onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/512x512/cccccc/333333?text=Load+Error"; }}
//               />
//               <div className="p-4">
//                 <p className="text-sm font-semibold text-indigo-600 truncate">{gen.style}</p>
//                 <p className="text-xs text-gray-500 mt-1 line-clamp-2">{gen.prompt}</p>
//                 <p className="text-xs text-gray-400 mt-2">{new Date(gen.createdAt).toLocaleDateString()}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   const renderView = () => view === 'history' ? <HistoryView /> : (
//     <div className="flex flex-col lg:flex-row gap-8 justify-center w-full max-w-6xl p-4">
//       <GenerationForm />
//       <ImagePreview />
//     </div>
//   );

//   const NavButton: React.FC<{ targetView: 'generate' | 'history'; icon: LucideIconComponent; label: string }> = ({ targetView, icon: Icon, label }) => (
//     <button
//       onClick={() => { setView(targetView); clearMessages(); }}
//       className={`flex items-center space-x-2 py-2 px-4 rounded-full text-sm font-medium transition duration-150 ${view === targetView ? 'bg-indigo-700 text-white shadow-lg' : 'text-indigo-100 hover:bg-indigo-600'}`}
//     >
//       <Icon className="w-5 h-5" />
//       <span className="hidden sm:inline">{label}</span>
//     </button>
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center font-sans">

//       {/* Header */}
//       <header className="w-full bg-indigo-800 shadow-xl sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">

//           <div className="text-2xl font-extrabold text-white tracking-wider">AI Studio</div>

//           <div className="flex items-center gap-4">
//             {/* Login / Signup buttons */}
//             <button
//               onClick={() => navigate('/login')}
//               className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//             >
//               Login
//             </button>
//             <button
//               onClick={() => navigate('/signup')}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//             >
//               Signup
//             </button>

//             {/* Generate / History Nav */}
//             <nav className="flex space-x-2 sm:space-x-4 ml-4">
//               <NavButton targetView="generate" icon={Image} label="Generate" />
//               <NavButton targetView="history" icon={MessageSquare} label="History" />
//             </nav>
//           </div>

//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-grow flex justify-center items-start pt-12 pb-12 w-full">
//         {renderView()}
//       </main>

//       {/* Footer */}
//       <footer className="w-full bg-gray-800 text-center text-gray-400 py-4 text-sm mt-auto shadow-inner">
//         Powered by React & Gemini Image APIs
//       </footer>
//     </div>
//   );
// };

// export default App;
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Studio from './pages/Studio';

const App: React.FC = () => {
  const token = localStorage.getItem('mini_ai_studio_jwt');

  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to={token ? "/studio" : "/login"} />} />

      {/* Authentication */}
      <Route path="/login" element={token ? <Navigate to="/studio" /> : <Login />} />
      <Route path="/signup" element={token ? <Navigate to="/studio" /> : <Signup />} />

      {/* Protected Studio */}
      <Route path="/studio" element={token ? <Studio /> : <Navigate to="/login" />} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
