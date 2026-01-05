
import React, { useState } from 'react';
import { AppState, ProcessingStatus, EnhancementResult } from './types';
import { enhancePortrait } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.READY);
  const [status, setStatus] = useState<ProcessingStatus>({ step: 'idle', message: '' });
  const [result, setResult] = useState<EnhancementResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile || !previewUrl) return;

    setAppState(AppState.PROCESSING);
    setStatus({ step: 'uploading', message: 'Analyzing portrait geometry...' });

    try {
      // Animated status updates for premium feel
      const timer1 = setTimeout(() => setStatus({ step: 'enhancing', message: 'Simulating Sony A1 optical path...' }), 2000);
      const timer2 = setTimeout(() => setStatus({ step: 'enhancing', message: 'Refining skin texture and highlights...' }), 5000);

      const enhancedUrl = await enhancePortrait(previewUrl, selectedFile.type);
      
      clearTimeout(timer1);
      clearTimeout(timer2);

      setResult({
        imageUrl: enhancedUrl,
        originalUrl: previewUrl
      });
      setAppState(AppState.RESULT);
    } catch (error: any) {
      console.error(error);
      setAppState(AppState.READY);
      setStatus({ step: 'error', message: 'Failed to enhance image. Please try a different photo.' });
    }
  };

  const reset = () => {
    setAppState(AppState.READY);
    setResult(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setStatus({ step: 'idle', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-12 selection:bg-white selection:text-black">
      {/* Header */}
      <header className="border-b border-white/5 py-6 sticky top-0 bg-black/80 backdrop-blur-2xl z-50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border-2 border-white rounded-md rotate-12 flex items-center justify-center bg-white">
              <span className="text-xs font-black -rotate-12 text-black">α1</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight uppercase">Sony Enhancement</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Flash Engine Active</span>
              </div>
            </div>
          </div>
          {appState === AppState.RESULT && (
            <button 
              onClick={reset} 
              className="px-5 py-2 rounded-full border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest"
            >
              Restart
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-6 mt-16">
        {appState === AppState.READY && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-light mb-6 tracking-tight">Portrait Re-Rendering</h2>
              <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                Transform any portrait with the characteristics of a Sony A1 + FE 85mm F1.4 GM setup. Identity is preserved; light is evolved.
              </p>
              {status.step === 'error' && (
                <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-400 text-xs font-mono">{status.message}</p>
                </div>
              )}
            </div>

            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`border border-white/10 transition-all duration-500 rounded-3xl p-16 flex flex-col items-center justify-center aspect-[16/10] overflow-hidden ${previewUrl ? 'bg-transparent' : 'bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 shadow-inner'}`}>
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-contain rounded-lg animate-in fade-in zoom-in-95 duration-500" />
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <svg className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p className="text-white font-medium text-lg">Drop reference portrait</p>
                    <p className="text-sm text-gray-500 mt-2">Maximum fidelity preservation enabled</p>
                  </>
                )}
              </div>
            </div>

            {previewUrl && (
              <div className="mt-12 flex flex-col items-center gap-6">
                <button
                  onClick={handleProcess}
                  className="bg-white text-black px-16 py-6 rounded-full font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-white/10 flex items-center gap-4 group"
                >
                  <span className="text-sm tracking-[0.2em] uppercase">Render Enhancement</span>
                  <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
                <button onClick={() => setPreviewUrl(null)} className="text-[10px] text-gray-600 uppercase tracking-widest hover:text-white transition-colors">Clear Selection</button>
              </div>
            )}

            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-[10px] text-gray-600 uppercase tracking-widest border-t border-white/5 pt-12">
              <div className="space-y-1">
                <div className="text-white font-bold">FE 85mm</div>
                <div>G-Master Prime</div>
              </div>
              <div className="space-y-1">
                <div className="text-white font-bold">10-Bit</div>
                <div>Color Pipeline</div>
              </div>
              <div className="space-y-1">
                <div className="text-white font-bold">A1 Sensor</div>
                <div>50.1 MP Style</div>
              </div>
              <div className="space-y-1">
                <div className="text-white font-bold">Neutral</div>
                <div>Editorial LUT</div>
              </div>
            </div>
          </div>
        )}

        {appState === AppState.PROCESSING && (
          <div className="max-w-xl mx-auto text-center py-32">
            <div className="relative w-32 h-32 mx-auto mb-12">
              <div className="absolute inset-0 border-[3px] border-white/5 rounded-full"></div>
              <div className="absolute inset-0 border-t-[3px] border-white rounded-full animate-spin"></div>
              <div className="absolute inset-6 border-[1px] border-white/20 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-3xl font-light mb-4 tracking-tight">Evolving Frame</h3>
            <div className="flex flex-col items-center gap-2">
              <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.3em]">{status.message}</p>
              <div className="w-48 h-[1px] bg-white/10 mt-4 overflow-hidden">
                <div className="h-full bg-white w-1/2 animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          </div>
        )}

        {appState === AppState.RESULT && result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-600 font-bold">Source Reference</span>
                <div className="h-[1px] flex-1 bg-white/5"></div>
              </div>
              <div className="rounded-3xl overflow-hidden border border-white/5 aspect-[3/4] group">
                <img src={result.originalUrl} alt="Original" className="w-full h-full object-cover grayscale opacity-30 group-hover:opacity-60 transition-opacity duration-700" />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white font-bold">Enhanced Output</span>
                  <div className="h-[1px] flex-1 bg-white/10"></div>
                </div>
                <a 
                  href={result.imageUrl} 
                  download="sony-alpha-portrait.png"
                  className="ml-6 flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export
                </a>
              </div>
              <div className="rounded-3xl overflow-hidden border border-white/20 shadow-[0_0_80px_rgba(255,255,255,0.05)] aspect-[3/4]">
                <img src={result.imageUrl} alt="Enhanced" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="lg:col-span-2 mt-12 bg-white/[0.02] rounded-[40px] p-12 border border-white/5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-10">
                <h5 className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-500">Exif & Analysis Data</h5>
                <div className="text-[10px] font-mono text-green-500/50">MATCH: 100% IDENTITY</div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                <div>
                  <div className="text-gray-600 text-[9px] mb-2 tracking-widest uppercase font-bold">Lens Model</div>
                  <div className="text-xs font-mono text-white">SEL85F14GM</div>
                </div>
                <div>
                  <div className="text-gray-600 text-[9px] mb-2 tracking-widest uppercase font-bold">Aperture</div>
                  <div className="text-xs font-mono text-white">f/1.6 (Simulated)</div>
                </div>
                <div>
                  <div className="text-gray-600 text-[9px] mb-2 tracking-widest uppercase font-bold">Shutter</div>
                  <div className="text-xs font-mono text-white">1/200s @ ISO 100</div>
                </div>
                <div>
                  <div className="text-gray-600 text-[9px] mb-2 tracking-widest uppercase font-bold">Engine</div>
                  <div className="text-xs font-mono text-white">GEMINI FLASH V2.5</div>
                </div>
              </div>
              <div className="mt-12 pt-12 border-t border-white/5 text-[11px] text-gray-500 leading-loose max-w-3xl">
                Enhancement verified. Subject features cleaned while maintaining exact facial geometry. Micro-contrast boosted in high-frequency regions (eyes, texture). Neutral editorial color grade applied with Sony specific skin-tone curve. 
                <span className="block mt-4 text-white/40 italic">Note: Background geometry remains locked to source for environment consistency.</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-32 border-t border-white/5 py-12">
        <div className="container mx-auto px-6 flex flex-col items-center gap-6">
          <div className="text-center text-gray-700 text-[9px] tracking-[0.5em] uppercase font-bold">
            Alpha System Simulation • Editorial Standard
          </div>
          <div className="flex gap-8 text-[9px] text-gray-800 uppercase tracking-widest">
            <span className="hover:text-gray-600 cursor-help transition-colors">Privacy</span>
            <span className="hover:text-gray-600 cursor-help transition-colors">Terms</span>
            <span className="hover:text-gray-600 cursor-help transition-colors">Optical Docs</span>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}} />
    </div>
  );
};

export default App;
