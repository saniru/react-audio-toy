import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FileInput from '../src/FileInput';
import URLInput from '../src/URLInput';

describe('URLInput', () => {
  const urlCallback = vi.fn();
  beforeEach(() => { (render(<URLInput callback={urlCallback} />)); });
  it('Initial State', () => {
    expect(screen.getByLabelText(/url/i)).toBeDefined();
    expect(screen.getByText(/add url track/i)).toBeDefined();
  });
  it('Add URL', async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/url/i), "https://www.google.com");
    await user.click(screen.getByText(/add url track/i));
    expect(urlCallback).toBeCalledTimes(1);
  });
});

describe('FileInput', () => {
  const fileCallback = vi.fn();
  beforeEach(() => { (render(<FileInput callback={fileCallback} />)); });
  it('Initial State', () => {
    expect(screen.getByLabelText(/input audio file/i)).toBeDefined();
    expect(screen.getByText(/add file tracks/i)).toBeDefined();
  });
  it('Add URL', async () => {
    const user = userEvent.setup();
    const file = new File(["(⌐□_□)"], "filename.wav", { type: "audio/wav" });
    await user.upload(screen.getByLabelText(/input audio file/i), file);
    await user.click(screen.getByText(/add file tracks/i));
    expect(fileCallback).toBeCalledTimes(1);
  });
});
