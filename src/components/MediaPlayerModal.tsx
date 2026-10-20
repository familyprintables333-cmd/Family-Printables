import React, { useRef, useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Sparkles, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface MediaPlayerModalProps {
  product: Product | null;
  onClose: () => void;
}

export const MediaPlayerModal: React.FC<MediaPlayerModalProps> = ({
  product,
  onClose
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const isVideo = product?.mediaType === 'video' || (product?.audioVideoUrl && product.audioVideoUrl.includes('.mp4'));
  const mediaUrl = product?.audioVideoUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  useEffect(() => {
    setIsPlaying(true);
    setCurrentTime(0);
  }, [product]);

  if (!product) return null;

  const togglePlay = () => {
    if (isVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (isVideo && videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    } else if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-purple-200/90 space-y-5 my-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 shadow-xs">
              <Volume2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 block">
                In-App {isVideo ? 'Video Player' : 'Bedtime Audio Player'}
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 truncate max-w-xs sm:max-w-sm">
                {product.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition"
            title="Close Player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Media Container */}
        <div className="bg-gradient-to-b from-slate-950 to-slate-900 rounded-2xl p-5 text-white shadow-inner">
          {isVideo ? (
            <video
              ref={videoRef}
              controls
              autoPlay
              playsInline
              src={mediaUrl}
              onTimeUpdate={() => {
                if (videoRef.current) {
                  setCurrentTime(videoRef.current.currentTime);
                  setDuration(videoRef.current.duration || 0);
                }
              }}
              className="w-full rounded-xl max-h-64 bg-black object-contain shadow-md"
            />
          ) : (
            <div className="space-y-4">
              {/* Audio Visualizer Waves */}
              <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700/60 text-center space-y-3">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className={`absolute inset-0 rounded-full bg-purple-500/20 ${isPlaying ? 'animate-ping' : ''}`} />
                  <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30">
                    <Volume2 className="w-6 h-6" />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-black text-white line-clamp-1">
                    {product.title}
                  </h4>
                  <p className="text-xs text-purple-300 font-medium mt-0.5">
                    {product.audioDuration ? `${product.audioDuration} · Calming Narration` : 'High-Definition Audio Story'}
                  </p>
                </div>

                {/* Animated EQ Bars when Playing */}
                <div className="flex items-center justify-center gap-1 h-6">
                  {[40, 75, 55, 90, 65, 80, 45, 95, 70, 50, 85, 60].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full bg-purple-400 transition-all duration-300 ${
                        isPlaying ? 'animate-pulse' : 'opacity-40'
                      }`}
                      style={{ height: isPlaying ? `${h}%` : '20%' }}
                    />
                  ))}
                </div>
              </div>

              <audio
                ref={audioRef}
                autoPlay
                src={mediaUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={() => {
                  if (audioRef.current) {
                    setCurrentTime(audioRef.current.currentTime);
                    setDuration(audioRef.current.duration || 0);
                  }
                }}
                onLoadedMetadata={() => {
                  if (audioRef.current) {
                    setDuration(audioRef.current.duration || 0);
                  }
                }}
              />

              {/* Progress Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="relative w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={togglePlay}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 active:scale-95 transition"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-white" />
                      <span>Pause Track</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Play Track</span>
                    </>
                  )}
                </button>

                <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Free Stream</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Benefits Footnote */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span className="flex items-center gap-1 text-[11px] text-purple-700 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            100% In-App Instant Player · No Account or Gumroad Required
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
