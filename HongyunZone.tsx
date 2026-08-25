import React, { useState } from 'react';
import { motion } from 'motion/react';

interface HongyunZoneProps {
  isOpen: boolean;
  onClose: () => void;
}

const HongyunZone: React.FC<HongyunZoneProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] bg-[#F8FAFC] overflow-y-auto"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 sticky top-0 z-10">
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <i className="fa-solid fa-chevron-left text-lg"></i>
        </button>
        <h1 className="text-base font-bold text-slate-800">宏运特区/独立区</h1>
        <div className="w-10"></div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-4">指标达成</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border-r border-slate-100 pr-4">
              <h3 className="text-sm font-bold text-[#00A758] mb-3">宏运特区</h3>
              <div className="flex justify-between">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#00A758] flex items-center justify-center mb-1">
                    <i className="fa-solid fa-check text-white text-xs"></i>
                  </div>
                  <span className="text-xs text-slate-500">APE</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#F2F6FC] flex items-center justify-center mb-1">
                    <i className="fa-solid fa-check text-[#8E90A2] text-xs"></i>
                  </div>
                  <span className="text-xs text-slate-500">FYC</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#00A758] flex items-center justify-center mb-1">
                    <i className="fa-solid fa-check text-white text-xs"></i>
                  </div>
                  <span className="text-xs text-slate-500">优占比</span>
                </div>
              </div>
            </div>
            <div className="pl-4">
              <h3 className="text-sm font-bold text-slate-800 mb-3">独立区</h3>
              <div className="flex justify-between">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#F2F6FC] flex items-center justify-center mb-1">
                    <i className="fa-solid fa-check text-[#8E90A2] text-xs"></i>
                  </div>
                  <span className="text-xs text-slate-500">APE</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#F2F6FC] flex items-center justify-center mb-1">
                    <i className="fa-solid fa-check text-[#8E90A2] text-xs"></i>
                  </div>
                  <span className="text-xs text-slate-500">续保率</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800">宏运特区</h2>
            <span className="text-xs text-slate-400">数据截至 2024-08-05</span>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">所辖APE(元)</span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold text-[#00A758]">2,002,002,000</span>
                <span className="text-xs text-slate-400">≥5,000万元</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-[#00A758] font-medium">当前进度</span>
                <div className="flex-1 h-2 bg-green-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00C46E] to-[#00A758] rounded-full relative"
                    style={{ width: '100%' }}
                  >
                    <div className="absolute right-0 top-0 h-full px-1.5 bg-white flex items-center justify-center">
                      <span className="text-[10px] font-bold text-[#00A758]">100%</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-400">目标</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">所辖FYC(元)</span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold text-[#00A758]">2,002,000</span>
                <span className="text-xs text-slate-400">≥3,000万元</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-[#00A758] font-medium">当前进度</span>
                <div className="flex-1 h-2 bg-green-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#00A758] rounded-full relative"
                    style={{ width: '6.7%' }}
                  >
                    <div className="absolute right-0 top-0 h-full px-1.5 bg-white flex items-center justify-center">
                      <span className="text-[10px] font-bold text-[#00A758]">6.7%</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-400">目标</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-600">绩优占比</span>
              </div>
              
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#00A758] font-medium">已达成</span>
                  <span className="text-xs text-[#00A758]">≥7%</span>
                </div>
                <div className="flex-1 h-2 bg-green-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00C46E] to-[#00A758] rounded-full relative"
                    style={{ width: '8%' }}
                  >
                    <div className="absolute right-0 top-0 h-full px-1.5 bg-white flex items-center justify-center">
                      <span className="text-[10px] font-bold text-[#00A758]">8%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#00A758] font-medium">序时达成</span>
                  <span className="text-xs text-[#00A758]">≥5%</span>
                </div>
                <div className="flex-1 h-2 bg-green-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00C46E] to-[#00A758] rounded-full relative"
                    style={{ width: '3%' }}
                  >
                    <div className="absolute right-0 top-0 h-full px-1.5 bg-white flex items-center justify-center">
                      <span className="text-[10px] font-bold text-[#00A758]">3%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800">独立区</h2>
            <span className="text-xs text-slate-400">数据截至</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">所辖组APE目标(元)</span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold text-[#00A758]">0</span>
                <span className="text-xs text-slate-400">1.6万元</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-[#00A758] font-medium">当前进度</span>
                <div className="flex-1 h-2 bg-green-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#00A758] rounded-full relative"
                    style={{ width: '0%' }}
                  >
                    <div className="absolute right-0 top-0 h-full px-1.5 bg-white flex items-center justify-center">
                      <span className="text-[10px] font-bold text-[#00A758]">0%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HongyunZone;