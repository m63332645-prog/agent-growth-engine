import React, { useState } from 'react';
import { motion } from 'motion/react';

interface MyIncomeProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyIncome: React.FC<MyIncomeProps> = ({ isOpen, onClose }) => {
  const [selectedMonth, setSelectedMonth] = useState('2026/06');

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] bg-white overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <i className="fa-solid fa-chevron-left text-lg"></i>
        </button>
        <h1 className="text-base font-bold text-slate-800">我的收入</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <span className="text-sm font-medium text-slate-600">年月</span>
        <button className="flex items-center gap-1 text-sm font-medium text-slate-600">
          <span>{selectedMonth}</span>
          <i className="fa-solid fa-chevron-right text-xs"></i>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="fa-solid fa-file-pdf text-slate-400 text-2xl"></i>
          </div>
          <p className="text-sm text-slate-400">暂无收入数据</p>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <button className="w-full py-3 bg-[#00A758] text-white font-bold rounded-lg active:bg-[#008A4A] transition-colors">
          生成PDF
        </button>
      </div>
    </motion.div>
  );
};

export default MyIncome;