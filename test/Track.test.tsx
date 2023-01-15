import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Track from '../src/Track';

const dispatchCallback = vi.fn();
const playCallback = vi.fn();
const trackName = "Test Track.ext";

describe('Track', () => {
  beforeEach(() => {
    render(<Track
      id="1234"
      dispatch={dispatchCallback}
      playTrack={playCallback}
      playing={true}
      delay={4000}
      name={trackName}
      TrackType="File" />);
  });
  afterEach(() => { vi.clearAllMocks(); });
  it('Initial State', () => {
    expect(screen.getByText(/remove/i)).toBeDefined();
    expect(screen.getByText(/file/i)).toBeDefined();
    expect(screen.getByText(trackName)).toBeDefined();
    expect(screen.getByText(/randomly playing/i)).toBeDefined();
  });
  it('Mode Switch', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText(/Switch Mode/i));
    expect(screen.getByText(/playing at will/i)).toBeDefined();
  });
  it('play switch', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText(/pause/i));
    expect(screen.getByText(/play/i)).toBeDefined();
  });
  it('calls the dispatch', async () => {
    const user = userEvent.setup();
    fireEvent.change(screen.getByLabelText(/volume/i) as Element, { target: { value: 65 } });
    fireEvent.change(screen.getByLabelText(/delay/i) as Element, { target: { value: 65 } });
    await user.click(screen.getByText(/pause/i));
    await user.click(screen.getByText(/switch mode/i));
    await user.click(screen.getByText(/remove/i));
    expect(screen.getByText(/playing at will/i)).toBeDefined();
    expect(dispatchCallback).toBeCalledTimes(4);
  });
  it('calls the play function manually on the other mode', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText(/switch mode/i));
    expect(screen.getByText("Play")).toBeDefined();
    await user.click(screen.getByText("Play"));
    expect(playCallback).toBeCalled();
  });
});

describe('Track Timing', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(global, 'setTimeout');
    render(<Track
      id="1234"
      dispatch={dispatchCallback}
      playTrack={playCallback}
      playing={true}
      delay={500}
      name={trackName}
      TrackType="File" />);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });
  it('properly sets and resets the timer', async () => {
    expect(setTimeout).toHaveBeenCalled();
    vi.runOnlyPendingTimers();
    expect(setTimeout).toHaveBeenCalledTimes(2);
  });
  it('calls the play function after a while', async () => {
    expect(setTimeout).toHaveBeenCalled();
    expect(playCallback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1000);
    expect(playCallback).toHaveBeenCalled();
  });
});
