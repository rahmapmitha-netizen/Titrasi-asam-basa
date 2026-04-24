/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { FlaskConical, Droplets, Info, Play, Pause, RotateCcw } from 'lucide-react';
import { Solution, LabState } from '../types';
import { ACIDS, BASES } from '../constants';
import { TitrationRig } from './TitrationRig';
import { cn } from '../lib/utils';

export const LabBench: React.FC = () => {
  const [state, setState] = React.useState<LabState>({
    selectedAcid: ACIDS[0],
    selectedBase: BASES[0],
    activeIndicator: 'pp',
    volumeTitrant: 0,
    isTitrating: false,
    dropRate: 0.2 // mL per trigger
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePh = (vol: number) => {
    if (!state.selectedAcid || !state.selectedBase) return 7;
    
    const vAcid = 25; // mL
    const mAcid = state.selectedAcid.concentration;
    const mBase = state.selectedBase.concentration;
    
    const molAcid = vAcid * mAcid;
    const molBase = vol * mBase;
    
    if (molAcid > molBase) {
      // Acidic
      const remainingMolH = molAcid - molBase;
      const concentrationH = remainingMolH / (vAcid + vol);
      return -Math.log10(concentrationH);
    } else if (molBase > molAcid) {
      // Basic
      const remainingMolOH = molBase - molAcid;
      const concentrationOH = remainingMolOH / (vAcid + vol);
      const pOh = -Math.log10(concentrationOH);
      return 14 - pOh;
    } else {
      // Neutral (Equivalence Point)
      return 7.0;
    }
  };

  const currentPh = calculatePh(state.volumeTitrant);

  useEffect(() => {
    if (state.isTitrating) {
      timerRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          volumeTitrant: Math.min(50, prev.volumeTitrant + prev.dropRate / 5)
        }));
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.isTitrating]);

  const resetLab = () => {
    setState(prev => ({
      ...prev,
      volumeTitrant: 0,
      isTitrating: false
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel: Chemicals & Reagents */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col h-screen shrink-0">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-1">Virtual Chemistry Lab</h1>
          <p className="text-xl font-light text-slate-500">Titrasi Asam Basa</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section>
            <h2 className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-4 flex items-center gap-2">
              <FlaskConical size={12} /> Larutan Asam (Titrat)
            </h2>
            <div className="space-y-2">
              {ACIDS.map(sol => (
                <button
                  key={sol.id}
                  disabled={state.isTitrating}
                  onClick={() => { resetLab(); setState(prev => ({ ...prev, selectedAcid: sol })); }}
                  className={cn(
                    "w-full flex flex-col p-3 border transition-all text-left disabled:opacity-50",
                    state.selectedAcid?.id === sol.id
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:border-slate-400 text-slate-600"
                  )}
                >
                  <div className="flex items-center">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full mr-3",
                      state.selectedAcid?.id === sol.id ? "bg-blue-600" : "bg-slate-300"
                    )} />
                    <span className="text-sm font-medium">{sol.name}</span>
                  </div>
                  <span className="text-[9px] font-mono mt-1 ml-4.5 opacity-60 italic">{sol.formula} {sol.concentration} M</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-4 flex items-center gap-2">
              <Droplets size={12} /> Basa (Titran - Di Buret)
            </h2>
            <div className="space-y-2">
              {BASES.map(sol => (
                <button
                  key={sol.id}
                  disabled={state.isTitrating}
                  onClick={() => { resetLab(); setState(prev => ({ ...prev, selectedBase: sol })); }}
                  className={cn(
                    "w-full flex items-center p-3 border transition-all text-left disabled:opacity-50",
                    state.selectedBase?.id === sol.id
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:border-slate-400 text-slate-600"
                  )}
                >
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full mr-3",
                    state.selectedBase?.id === sol.id ? "bg-blue-600" : "bg-slate-300"
                  )} />
                  <span className="text-sm font-medium">{sol.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-4">Indikator</h2>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'pp', name: 'Phenolphthalein', desc: 'Tidak berwarna < 8.2 < Pink' },
                { id: 'methyl-red', name: 'Metil Merah', desc: 'Merah < 4.4 < Kuning' },
                { id: 'universal', name: 'Indicator Universal', desc: 'Spektrum warna lengkap' }
              ].map(ind => (
                <button
                  key={ind.id}
                  onClick={() => setState(prev => ({ ...prev, activeIndicator: ind.id as any }))}
                  className={cn(
                    "p-3 border text-left transition-all",
                    state.activeIndicator === ind.id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white"
                  )}
                >
                  <div className="text-[10px] font-bold uppercase">{ind.name}</div>
                  <div className="text-[8px] opacity-60">{ind.desc}</div>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-slate-100 flex gap-2">
          <button 
            onClick={() => setState(prev => ({ ...prev, isTitrating: !prev.isTitrating }))}
            className={cn(
              "flex-1 py-3 text-sm font-medium uppercase tracking-widest transition-all flex items-center justify-center gap-2",
              state.isTitrating ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-emerald-500 text-white hover:bg-emerald-600"
            )}
          >
            {state.isTitrating ? <Pause size={16} /> : <Play size={16} />}
            {state.isTitrating ? "Stop" : "Mulai"}
          </button>
          <button 
            onClick={resetLab}
            className="p-3 border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </aside>

      {/* Main Lab View */}
      <main className="flex-1 relative flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex gap-8 items-center">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">STATUS:</span>
              <span className={cn(
                "text-[10px] font-bold tracking-wider",
                state.isTitrating ? "text-blue-500 animate-pulse" : "text-emerald-500"
              )}>
                {state.isTitrating ? "SEDANG TITRASI..." : "SIAP UNTUK TITRASI"}
              </span>
            </div>
            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">LAJU:</span>
              <input 
                type="range" min="0.05" max="1" step="0.05" 
                value={state.dropRate} 
                onChange={(e) => setState(prev => ({ ...prev, dropRate: parseFloat(e.target.value) }))}
                className="w-24 h-1 bg-slate-100 accent-slate-900 appearance-none rounded-full"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-1.5 border border-slate-200 text-[10px] font-mono flex items-center gap-2">
              <span className="text-slate-400">VOL TITRAN:</span>
              <span className="text-slate-900 font-bold tabular-nums">{state.volumeTitrant.toFixed(2)} mL</span>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto bg-slate-200 relative scrollbar-hide">
          {/* Central Lab Table Surface */}
          <div className="absolute bottom-0 left-4 right-4 h-32 bg-slate-300 border-t-4 border-slate-400 rounded-t-3xl -z-10" />
          
          {/* Titration Visualization */}
          <div className="transform scale-75 md:scale-90 lg:scale-100 origin-center transition-transform">
            <TitrationRig 
              acid={state.selectedAcid} 
              base={state.selectedBase} 
              indicator={state.activeIndicator}
              volumeTitrant={state.volumeTitrant}
              currentPh={currentPh}
              isTitrating={state.isTitrating}
            />
          </div>
          
          {/* Control Overlay */}
          <div className="sticky bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-40">
             <div className="bg-white px-6 py-4 border border-slate-900 shadow-2xl flex flex-col items-center min-w-[160px]">
               <div className="text-[8px] uppercase font-bold text-slate-500 tracking-[0.2em] mb-1">pH Virtual</div>
               <div className="text-4xl font-light tabular-nums text-slate-900 tracking-tight">{currentPh.toFixed(2)}</div>
               <div className={cn(
                 "text-[9px] font-black uppercase mt-1 px-2 py-0.5 rounded",
                 currentPh < 6.5 ? "bg-red-50 text-red-600" : currentPh > 7.5 ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
               )}>
                 {currentPh < 6.5 ? 'Asam' : currentPh > 7.5 ? 'Basa' : 'Titik Ekivalen'}
               </div>
             </div>
          </div>
        </div>
      </main>

      {/* Right Panel: Data Monitoring */}
      <aside className="w-full md:w-80 bg-white border-l border-slate-200 flex flex-col h-screen shrink-0">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-6 flex items-center gap-2">
            <Info size={12} /> Data Pengamatan
          </h2>
          
          <div className="space-y-4">
            <div className="bg-white p-5 border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Volume Ekivalen Teoritis</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-light text-slate-800 tabular-nums">25.00</span>
                <span className="text-[10px] text-slate-400 font-bold">mL</span>
              </div>
            </div>

            <div className="bg-white p-5 border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selisih Volume</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-light text-red-500 tabular-nums">
                  {Math.abs(state.volumeTitrant - 25).toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">mL</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col overflow-hidden">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Log Titrasi</h3>
          <div className="flex-1 overflow-y-auto border border-slate-100 font-mono text-[9px] leading-relaxed scrollbar-hide">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
                  <tr>
                    <th className="p-2 font-bold text-slate-400">Vol (mL)</th>
                    <th className="p-2 font-bold text-slate-400">pH</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {Array.from({ length: Math.floor(state.volumeTitrant) }).map((_, i) => (
                    <tr key={i}>
                      <td className="p-2 tabular-nums">{i}.00</td>
                      <td className="p-2 tabular-nums">{calculatePh(i).toFixed(2)}</td>
                    </tr>
                  ))}
                  {state.volumeTitrant > 0 && (
                     <tr className="bg-blue-50/50">
                        <td className="p-2 font-bold tabular-nums">{state.volumeTitrant.toFixed(2)}</td>
                        <td className="p-2 font-bold tabular-nums">{currentPh.toFixed(2)}</td>
                     </tr>
                  )}
                </tbody>
             </table>
          </div>
        </div>
        
        <div className="p-6 border-t border-slate-50">
          <p className="text-[10px] text-slate-400 italic text-center">
            Perhatikan perubahan warna larutan di Erlenmeyer saat volume mendekati 25.00 mL.
          </p>
        </div>
      </aside>
    </div>
  );
};
