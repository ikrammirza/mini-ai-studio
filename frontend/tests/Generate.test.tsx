import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import { PromptForm } from '../src/components/PromptForm';

test('PromptForm submits values', () => {
  const mockSubmit = vi.fn();
  render(<PromptForm onSubmit={mockSubmit} />);

  fireEvent.change(screen.getByPlaceholderText(/prompt/i), { target: { value: 'A cat on Mars' } });
  fireEvent.change(screen.getByPlaceholderText(/style/i), { target: { value: 'Cyberpunk' } });
  fireEvent.click(screen.getByText('Generate'));

  expect(mockSubmit).toHaveBeenCalledWith('A cat on Mars', 'Cyberpunk');
});
