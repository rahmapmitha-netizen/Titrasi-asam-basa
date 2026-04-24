/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Solution } from '../types';
import { getPPColor, getUniversalIndicatorColor } from '../constants';
import { cn } from '../lib/utils';

interface TitrationRigProps {
  acid: Solution | null;
  base: Solution | null;
  indicator: 'pp' | 'methyl-red' | 'universal';
  volumeTitrant: number;
  currentPh: number;
  isTitrating: boolean;
}

export const TitrationRig: React.FC<TitrationRigProps> = ({ 
  acid, base, indicator, volumeTitrant, currentPh, isTitrating 
}) => {
  
  const getFlaskLiquidColor = () => {
    if (!acid) return 'rgba(255, 255, 255, 0.1)';
    if (indicator === 'pp') return getPPColor(currentPh);
    if (indicator === 'universal') return getUniversalIndicatorColor(currentPh);
    if (indicator === 'methyl-red') {
      if (currentPh < 4.4) return 'rgba(239, 68, 68, 0.6)'; // Red
      if (currentPh > 6.2) return 'rgba(234, 179, 8, 0.6)'; // Yellow
      return 'rgba(249, 115, 22, 0.6)'; // Orange
    }
    return acid.color;
  };

  const flaskColor = getFlaskLiquidColor();

  return (
    <div className="relative flex flex-col items-center select-none py-12">
      {/* Stand Pole (Tiang Statif) */}
      <div className="absolute left-1/2 -translate-x-32 top-0 bottom-0 w-3 bg-slate-400 border-r border-slate-500 shadow-inner" />
      
      {/* Clamp (Klem Biret) */}
      <div className="absolute left-1/2 -translate-x-32 top-20 w-32 h-2 bg-slate-500 rounded-full shadow-sm z-10" />

      {/* Burette (Biret) - Solid Design */}
      <div className="relative w-14 h-80 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] flex flex-col justify-end overflow-hidden z-20">
        {/* Scale Markings - High Contrast */}
        <div className="absolute inset-0 flex flex-col pointer-events-none">
          {Array.from({ length: 51 }).map((_, i) => (
            <div key={i} className="border-b-2 border-black/20 h-[10px] w-full flex items-end justify-end px-1">
              {i % 5 === 0 && <span className="text-[9px] font-black font-mono text-black mr-1">{i / 2}</span>}
              <div className={cn("h-0.5 bg-black", i % 5 === 0 ? "w-5" : "w-2")} />
            </div>
          ))}
        </div>
        
        {/* Titrant Liquid - Solid Blue Fill */}
        <motion.div
           animate={{ height: `${Math.max(0, 100 - (volumeTitrant / 50) * 100)}%` }}
           className="w-full bg-blue-500 relative border-t-[3px] border-black"
        >
           <div className="absolute top-1 left-0 right-0 h-1 bg-white/40" />
        </motion.div>
      </div>

      {/* Stopcock (Keran) - Solid Black */}
      <div className="relative z-30 flex flex-col items-center">
        <div className="w-3 h-8 bg-black" />
        <motion.div 
          animate={{ rotate: isTitrating ? 0 : 90 }}
          className="w-14 h-7 border-[3px] border-black bg-slate-800 shadow-xl flex items-center justify-center cursor-pointer"
        >
          <div className="w-10 h-2 bg-white rounded-full" />
        </motion.div>
        <div className="w-3 h-8 bg-black rounded-b-lg shadow-lg" />
      </div>

      {/* Drops Animation - Larger Drops */}
      <div className="h-24 w-8 flex justify-center relative">
        <AnimatePresence>
          {isTitrating && (
            <motion.div
              initial={{ y: -5, opacity: 0, scale: 0.8 }}
              animate={{ y: 90, opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 0.2, ease: "easeIn" }}
              className="w-3 h-5 bg-blue-600 rounded-full absolute top-0 z-10 border border-black"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Erlenmeyer Flask - Bold Outlines & Solid Fill */}
      <div className="relative w-64 h-64 -mt-12">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl overflow-visible">
          {/* Flask Body - Opaque White */}
          <path 
            d="M40 0 L60 0 L60 20 L94 90 L6 90 L40 20 Z" 
            fill="#ffffff" 
            stroke="#000000" 
            strokeWidth="3" 
          />
          
          {/* Liquid in Flask - Contrast Fill */}
          <motion.path 
            animate={{ fill: flaskColor }}
            d="M24 55 L76 55 L88 88 L12 88 Z" 
            className="transition-colors duration-300"
            style={{ stroke: '#000000', strokeWidth: '0.5' }}
          />

          {/* Measurements - High Contrast */}
          <g className="stroke-black stroke-[1.5]">
            <line x1="42" y1="35" x2="55" y2="35" />
            <line x1="32" y1="55" x2="48" y2="55" />
            <line x1="22" y1="75" x2="42" y2="75" />
          </g>
        </svg>
        
        {/* Flask Labels */}
        <div className="absolute top-[60px] left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <div className="text-[10px] font-bold text-slate-700 bg-white/20 px-1 rounded">25 mL</div>
          {acid && <div className="text-[9px] font-mono text-slate-500 font-bold bg-white/10 px-1 rounded mt-1">{acid.formula}</div>}
        </div>
      </div>
      
      {/* Base of the Stand (Tatakan Statif) */}
      <div className="w-64 h-4 bg-slate-300 border-2 border-slate-400 rounded-md shadow-lg -mt-1 z-0" />
      
      {/* Floor reflection effect */}
      <div className="absolute -bottom-4 w-72 h-4 bg-black/5 blur-xl rounded-full -z-20" />
    </div>
  );
};

