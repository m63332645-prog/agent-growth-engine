import React, { useState } from 'react';
import { motion } from 'motion/react';

interface TeamPerformanceProps {
  isOpen: boolean;
  onClose: () => void;
}

const rankingData = [
  { rank: 10, name: 'NJ70022', position: 'DD', fyc: 432544.22 },
  { rank: 11, name: 'SH49399', position: 'SDM', fyc: 431077.35 },
  { rank: 12, name: 'SH15542', position: 'DD', fyc: 387935.27 },
  { rank: 13, name: 'SH68699', position: 'DD', fyc: 378990.8 },
  { rank: 14, name: 'CD50714', position: 'DM', fyc: 336107.64 },
];

const directFYCData = [
  { label: '本月', value: 72225.71, color: 'bg-amber-500' },
  { label: '本年', value: 381141.4, color: 'bg-[#00A758]' },
  { label: '历年最高', value: 1297593.88, color: 'bg-[#00A758]' },
];

const managedFYCData = [
  { label: '本月', value: 378990.8, color: 'bg-amber-500' },
  { label: '本年', value: 2446869.29, color: 'bg-[#00A758]' },
  { label: '历年最高', value: 8545204.51, color: 'bg-[#00A758]' },
];

const TeamPerformance: React.FC<TeamPerformanceProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'group' | 'history'>('overview');

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
        <h1 className="text-base font-bold text-slate-800">团队业绩</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex border-b border-slate-100 bg-white">
        {[
          { key: 'overview' as const, label: '业绩总览', active: true },
          { key: 'group' as const, label: '分组业绩', active: false },
          { key: 'history' as const, label: '历史业绩', active: false },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => tab.active && setActiveTab(tab.key)}
            className={`flex-1 py-3 text-sm font-medium relative transition-colors ${
              tab.active 
                ? 'text-[#00A758]' 
                : 'text-slate-400 cursor-not-allowed'
            }`}
          >
            {tab.label}
            {tab.active && (
              <motion.div
                layoutId="tabIndicator"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#00A758]"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="px-4 py-4 space-y-4">
          <div className="bg-white rounded-xl p-4">
            <p className="text-center text-amber-600 text-sm font-medium mb-4">
              恭喜您所辖净FYC全国排名第13名
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="text-left py-2 font-medium">全国排名</th>
                    <th className="text-left py-2 font-medium">营销员</th>
                    <th className="text-left py-2 font-medium">职级</th>
                    <th className="text-right py-2 font-medium">所辖组净FYC</th>
                  </tr>
                </thead>
                <tbody>
                  {rankingData.map((item, idx) => (
                    <tr 
                      key={idx} 
                      className={`border-b border-slate-50 ${item.rank === 13 ? 'bg-green-50/50' : ''}`}
                    >
                      <td className="py-3 font-medium text-slate-700">
                        {item.rank === 13 ? (
                          <span className="text-[#00A758]">{item.rank}</span>
                        ) : (
                          item.rank
                        )}
                      </td>
                      <td className="py-3 font-medium text-slate-800">{item.name}</td>
                      <td className="py-3 text-slate-600">{item.position}</td>
                      <td className="py-3 text-right font-medium text-slate-700">
                        {item.fyc.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-0.5 h-4 bg-[#00A758]"></div>
              <h3 className="text-sm font-bold text-slate-800">直辖组净FYC</h3>
            </div>
            
            <div className="space-y-4">
              {directFYCData.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-bold text-slate-800">{item.value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: idx === 2 ? '100%' : idx === 1 ? '70%' : '20%' }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 mb-20">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-0.5 h-4 bg-[#00A758]"></div>
              <h3 className="text-sm font-bold text-slate-800">所辖组净FYC</h3>
            </div>
            
            <div className="space-y-4">
              {managedFYCData.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-bold text-slate-800">{item.value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: idx === 2 ? '100%' : idx === 1 ? '85%' : '35%' }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TeamPerformance;