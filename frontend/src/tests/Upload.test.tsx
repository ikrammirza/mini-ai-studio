import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Upload } from '../components/Upload'; 

const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

describe('Upload Component', () => {
  const mockOnFile = vi.fn();
  const fileLabel = 'Upload Base Image';

  const createMockFile = (name: string, size: number, type: string) => {
    return new File(['hello'], name, { type });
  };

  it('handles successful file upload and calls onFile', () => {
    render(<Upload onFile={mockOnFile} label={fileLabel} />);
    const file = createMockFile('test.png', 100 * 1024, 'image/png'); 

    vi.spyOn(URL, 'createObjectURL').mockReturnValue('mock-url');

    const fileInput = screen.getByLabelText(fileLabel).closest('label')?.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockOnFile).toHaveBeenCalledWith(file);
    expect(screen.getByText('test.png')).toBeInTheDocument();
  });

  it('rejects file larger than 10MB', () => {
    render(<Upload onFile={mockOnFile} label={fileLabel} />);
    const largeSize = 10 * 1024 * 1024 + 1; 
    const file = createMockFile('large.jpg', largeSize, 'image/jpeg'); 

    const fileInput = screen.getByLabelText(fileLabel).closest('label')?.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockAlert).toHaveBeenCalledWith('Max file size is 10MB.');
    expect(mockOnFile).not.toHaveBeenCalled();
  });
});