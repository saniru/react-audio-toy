import { describe, expect, it, vi } from 'vitest';
import { AudioTrack, FileTrack, YouTubeTrack } from '../src/AudioTrack';

const mockConnect = vi.fn(() => { return { connect: mockConnect }; });
const mockAudioContext = vi.fn(() => {
  return {
    createMediaElementSource: mockCMES,
    createGain: mockGainNode,
    currentTime: 0
  };
});
const mockGainNode = vi.fn().mockReturnValue({
  connect: mockConnect,
  gain: { setValueAtTime: vi.fn() }
});
const mockCMES = vi.fn(() => { return { connect: mockConnect }; });

describe('FileTrack', () => {
  it('FileTrack', () => {
    window.AudioContext = mockAudioContext as any;
    const track = new FileTrack(new Audio(), "");
    expect(track).toBeInstanceOf(AudioTrack);
  });
  it('AudioTrack', () => {
    const player = {
      getVideoData: vi.fn().mockReturnValue({ title: "" }),
      getDuration: vi.fn(),
      setVolume: vi.fn()
    };
    const track = new YouTubeTrack(player);
    expect(track).toBeInstanceOf(AudioTrack);
  });
});
