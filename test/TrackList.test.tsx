import { /*fireEvent,*/ render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AudioTrack } from '../src/AudioTrack';
import TrackList from '../src/TrackList';
const dispatchCallback = vi.fn();
const playCallback = vi.fn();
function createMockTrack(name: string): MockTrack {
  return {
    name: name,
    createDate: Date.now(),
    id: name + "_" + Date.now(),
    delay: 100,
    playing: true,
    TrackType: "File"
  } as MockTrack;
}
type MockTrack = Partial<AudioTrack>;
const trackNames = ["a", "c", "bbb"];
const mockTracks = trackNames.map(createMockTrack);
describe('Track List', () => {
  beforeEach(() => {
    render(<TrackList
      dispatch={dispatchCallback}
      playTrack={playCallback}
      tracks={mockTracks as AudioTrack[]} />);
  });
  afterEach(() => { vi.clearAllMocks(); });
  it('loads some tracks', () => {
    trackNames.forEach((e) => { expect(screen.getByText(e)).toBeDefined(); });
  });
  it('calls dispatch for each track', async () => {
    const user = userEvent.setup();
    for (let o of screen.getAllByText("Pause")) {
      await user.click(o);
    }
    expect(dispatchCallback).toBeCalledTimes(trackNames.length);
  });
  it('tracks play their audios', async () => {
    vi.useFakeTimers();
    render(<TrackList
      dispatch={dispatchCallback}
      playTrack={playCallback}
      tracks={mockTracks as AudioTrack[]} />);
    vi.advanceTimersByTime(100);
    expect(playCallback).toBeCalledTimes(trackNames.length);
    vi.useRealTimers();
  });
});
