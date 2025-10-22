import React, { useState } from 'react';

interface PromptFormProps {
  onSubmit: (prompt: string, style: string) => void;
}

export const PromptForm: React.FC<PromptFormProps> = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prompt, style);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-2">
      <input
        type="text"
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Enter style (e.g., Cyberpunk)"
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
      >
        Generate
      </button>
    </form>
  );
};
