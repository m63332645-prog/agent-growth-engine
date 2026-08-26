import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, ChevronLeft, ChevronDown } from 'lucide-react';

interface SupervisorIncomeCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

type SupervisorRank =
  | 'UM' | 'SUM' | 'ADM' | 'SADM'
  | 'DM' | 'SDM' | 'DD' | 'SDD' | 'EDD';

// 下拉框显示选项：SADM/DM/SDM/DD/SDD/EDD 奖金率相同，合并为一项
// label 为下拉框内完整文字，display 为选中后截断显示文字
const RANK_DISPLAY: { value: SupervisorRank; label: string; display: string }[] = [
  { value: 'UM', label: 'UM', display: 'UM' },
  { value: 'SUM', label: 'SUM', display: 'SUM' },
  { value: 'ADM', label: 'ADM', display: 'ADM' },
  { value: 'SADM', label: 'SADM/DM/SDM/DD/SDD/EDD', display: 'SADM...' },
];

interface StudioTier {
  minFyc: number;
  label: string;
  rates: Record<SupervisorRank, number>;
}

// 直辖工作室每月管理奖奖金率（按工作室当月FYC档位）
// 根据系统配置截图（直辖工作室每月管理奖奖金率）
const STUDIO_TIERS: StudioTier[] = [
  { minFyc: 216000, label: '≥216,000', rates: { UM: 0.32, SUM: 0.34, ADM: 0.36, SADM: 0.40, DM: 0.40, SDM: 0.40, DD: 0.40, SDD: 0.40, EDD: 0.40 } },
  { minFyc: 108000, label: '≥108,000', rates: { UM: 0.26, SUM: 0.28, ADM: 0.30, SADM: 0.32, DM: 0.32, SDM: 0.32, DD: 0.32, SDD: 0.32, EDD: 0.32 } },
  { minFyc: 72000, label: '≥72,000', rates: { UM: 0.24, SUM: 0.26, ADM: 0.28, SADM: 0.30, DM: 0.30, SDM: 0.30, DD: 0.30, SDD: 0.30, EDD: 0.30 } },
  { minFyc: 36000, label: '≥36,000', rates: { UM: 0.22, SUM: 0.24, ADM: 0.26, SADM: 0.28, DM: 0.28, SDM: 0.28, DD: 0.28, SDD: 0.28, EDD: 0.28 } },
  { minFyc: 18000, label: '≥18,000', rates: { UM: 0.20, SUM: 0.22, ADM: 0.24, SADM: 0.26, DM: 0.26, SDM: 0.26, DD: 0.26, SDD: 0.26, EDD: 0.26 } },
  { minFyc: 9000, label: '≥9,000', rates: { UM: 0.15, SUM: 0.15, ADM: 0.15, SADM: 0.15, DM: 0.15, SDM: 0.15, DD: 0.15, SDD: 0.15, EDD: 0.15 } },
  { minFyc: 4500, label: '≥4,500', rates: { UM: 0.12, SUM: 0.12, ADM: 0.12, SADM: 0.12, DM: 0.12, SDM: 0.12, DD: 0.12, SDD: 0.12, EDD: 0.12 } },
];

// 主管职级对应奖金率（主管个人FYC计发用），按档位（与工作室管理奖奖金率表一致）
const PERSONAL_RANK_TIERS: StudioTier[] = [
  { minFyc: 216000, label: '≥216,000', rates: { UM: 0.32, SUM: 0.34, ADM: 0.36, SADM: 0.40, DM: 0.40, SDM: 0.40, DD: 0.40, SDD: 0.40, EDD: 0.40 } },
  { minFyc: 108000, label: '≥108,000', rates: { UM: 0.26, SUM: 0.28, ADM: 0.30, SADM: 0.32, DM: 0.32, SDM: 0.32, DD: 0.32, SDD: 0.32, EDD: 0.32 } },
  { minFyc: 72000, label: '≥72,000', rates: { UM: 0.24, SUM: 0.26, ADM: 0.28, SADM: 0.30, DM: 0.30, SDM: 0.30, DD: 0.30, SDD: 0.30, EDD: 0.30 } },
  { minFyc: 36000, label: '≥36,000', rates: { UM: 0.22, SUM: 0.24, ADM: 0.26, SADM: 0.28, DM: 0.28, SDM: 0.28, DD: 0.28, SDD: 0.28, EDD: 0.28 } },
  { minFyc: 18000, label: '≥18,000', rates: { UM: 0.20, SUM: 0.22, ADM: 0.24, SADM: 0.26, DM: 0.26, SDM: 0.26, DD: 0.26, SDD: 0.26, EDD: 0.26 } },
  { minFyc: 9000, label: '≥9,000', rates: { UM: 0.15, SUM: 0.15, ADM: 0.15, SADM: 0.15, DM: 0.15, SDM: 0.15, DD: 0.15, SDD: 0.15, EDD: 0.15 } },
  { minFyc: 4500, label: '≥4,500', rates: { UM: 0.12, SUM: 0.12, ADM: 0.12, SADM: 0.12, DM: 0.12, SDM: 0.12, DD: 0.12, SDD: 0.12, EDD: 0.12 } },
];

const DEFAULT_VALUES = {
  newAgentCount: 2,
  newAgentFyc: 3000,
  supervisorRank: 'UM' as SupervisorRank,
  personalFyc: 3000,
};

const STUDIO_FYC_FLOOR_FACTOR = 1; // 直辖工作室当月FYC ≥ 主管个人FYC + 新人月度平均FYC * STUDIO_FYC_FLOOR_FACTOR

export const SupervisorIncomeCalculator: React.FC<SupervisorIncomeCalculatorProps> = ({ isOpen, onClose }) => {
  const [newAgentCount, setNewAgentCount] = useState<number>(DEFAULT_VALUES.newAgentCount);
  const [newAgentFyc, setNewAgentFyc] = useState<number>(DEFAULT_VALUES.newAgentFyc);
  const [supervisorRank, setSupervisorRank] = useState<SupervisorRank>(DEFAULT_VALUES.supervisorRank);
  const [rankSelectOpen, setRankSelectOpen] = useState(false);
  const rankSelectRef = useRef<HTMLDivElement>(null);
  const [personalFyc, setPersonalFyc] = useState<number | null>(DEFAULT_VALUES.personalFyc);
  const [studioFyc, setStudioFyc] = useState<number | null>(
    DEFAULT_VALUES.personalFyc + DEFAULT_VALUES.newAgentFyc * STUDIO_FYC_FLOOR_FACTOR,
  );

  // 用于计算的数值（null 时使用兜底值）
  const personalFycSafe = personalFyc ?? 0;
  const newAgentFycSafe = newAgentFyc;
  const studioFycSafe = studioFyc ?? 0;

  // 直辖工作室每月管理奖奖金率 (由工作室FYC档位 + 主管职级共同决定)
  const activeStudioTier = useMemo(() => {
    for (const tier of STUDIO_TIERS) {
      if (studioFycSafe >= tier.minFyc) {
        return tier;
      }
    }
    return STUDIO_TIERS[STUDIO_TIERS.length - 1];
  }, [studioFycSafe]);

  const studioManagementRate = useMemo(() => {
    return activeStudioTier.rates[supervisorRank] || 0;
  }, [activeStudioTier, supervisorRank]);

  // 主管职级对应奖金率 (主管个人FYC计发部分使用的奖金率)
  const activePersonalTier = useMemo(() => {
    for (const tier of PERSONAL_RANK_TIERS) {
      if (studioFycSafe >= tier.minFyc) {
        return tier;
      }
    }
    return PERSONAL_RANK_TIERS[PERSONAL_RANK_TIERS.length - 1];
  }, [studioFycSafe]);

  const personalRankRate = useMemo(() => {
    return activePersonalTier.rates[supervisorRank] || 0;
  }, [activePersonalTier, supervisorRank]);

  // 主管本人FYC奖金率系数 (系统动态获取)
  const personalCoeff = useMemo(() => {
    if (personalFycSafe >= 20000) return 1.0;
    if (personalFycSafe >= 15000) return 0.8;
    return 0.7;
  }, [personalFycSafe]);

  // 辅导奖奖金率
  const coachingBonusRate = useMemo(() => {
    return newAgentFycSafe >= 3000 ? 0.28 : 0.20;
  }, [newAgentFycSafe]);

  // 直辖工作室辅导奖测算
  const coachingBonusIncrease = useMemo(() => {
    return Math.round(newAgentCount * newAgentFycSafe * coachingBonusRate);
  }, [newAgentCount, newAgentFycSafe, coachingBonusRate]);

  // 主管个人当月FYC + 新人月度平均FYC (工作室FYC下限参考)
  const studioFycFloor = useMemo(() => {
    return personalFycSafe + newAgentFycSafe * STUDIO_FYC_FLOOR_FACTOR;
  }, [personalFycSafe, newAgentFycSafe]);

  // 直辖工作室每月管理奖测算奖金
  // = 主管个人当月FYC * 主管职级对应奖金率 * 主管本人FYC奖金率系数
  //   + 直辖工作室当月FYC * 直辖工作室每月管理奖奖金率
  const studioCalculatedBonus = useMemo(() => {
    return Math.round(
      personalFycSafe * personalRankRate * personalCoeff +
      studioFycSafe * studioManagementRate
    );
  }, [personalFycSafe, personalRankRate, personalCoeff, studioFycSafe, studioManagementRate]);

  // 较2026年奖金变化 (直属工作室每月管理奖的变化部分，仅主管个人计发部分)
  // 2026年基准系数1.0，2027年新规则系数0.7，差额 -0.3 × 主管FYC × 奖金率
  const prizeChange2026 = useMemo(() => {
    return Math.round(-0.3 * personalFycSafe * personalRankRate);
  }, [personalFycSafe, personalRankRate]);

  // 直辖工作室奖金变化合计 = 直辖工作室辅导奖测算 + 直辖工作室每月管理奖金变化
  const totalIncomeChange = useMemo(() => {
    return coachingBonusIncrease + prizeChange2026;
  }, [coachingBonusIncrease, prizeChange2026]);

  // Reset to initial defaults
  const handleReset = () => {
    setNewAgentCount(DEFAULT_VALUES.newAgentCount);
    setNewAgentFyc(DEFAULT_VALUES.newAgentFyc);
    setSupervisorRank(DEFAULT_VALUES.supervisorRank);
    setPersonalFyc(DEFAULT_VALUES.personalFyc);
    setStudioFyc(DEFAULT_VALUES.personalFyc + DEFAULT_VALUES.newAgentFyc * STUDIO_FYC_FLOOR_FACTOR);
  };

  // 工具函数：格式化输入为两位小数的非负数，支持清空（返回 null）
  const parseDecimalInput = (
    raw: string,
    minValue: number,
    maxDecimals: number = 2
  ): number | null => {
    if (raw === '' || raw === '-' || raw === '.') return null;
    const num = Number(raw);
    if (Number.isNaN(num)) return null;
    const clamped = Math.max(minValue, num);
    const factor = Math.pow(10, maxDecimals);
    return Math.round(clamped * factor) / factor;
  };

  const handlePersonalFycChange = (raw: string) => {
    setPersonalFyc(parseDecimalInput(raw, 0, 2));
  };

  const handleStudioFycChange = (raw: string) => {
    setStudioFyc(parseDecimalInput(raw, 0, 2));
  };

  const handleNewAgentFycChange = (raw: string) => {
    // 新人月度平均FYC：默认3000，修改数据需≥3000，支持小数，最多两位小数
    if (raw === '' || raw === '-' || raw === '.') {
      setNewAgentFyc(DEFAULT_VALUES.newAgentFyc);
      return;
    }
    const num = Number(raw);
    if (Number.isNaN(num)) {
      setNewAgentFyc(DEFAULT_VALUES.newAgentFyc);
      return;
    }
    const clamped = Math.max(3000, num);
    const factor = Math.pow(10, 2);
    setNewAgentFyc(Math.round(clamped * factor) / factor);
  };

  const handleNewAgentCountChange = (raw: string) => {
    if (raw === '' || raw === '-') {
      setNewAgentCount(0);
      return;
    }
    const int = Math.floor(Number(raw));
    setNewAgentCount(Math.max(0, Number.isNaN(int) ? 0 : int));
  };

  // 直辖工作室当月FYC 是否低于下限
  const studioFycBelowFloor = studioFycSafe < studioFycFloor;

  // 当主管个人FYC或新人月度平均FYC变化导致下限变化时，
  // 若当前直辖工作室FYC低于新的下限，则自动提升至下限
  useEffect(() => {
    if (studioFycSafe < studioFycFloor) {
      setStudioFyc(studioFycFloor);
    }
  }, [studioFycFloor]);

  useEffect(() => {
    if (!rankSelectOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (rankSelectRef.current && !rankSelectRef.current.contains(e.target as Node)) {
        setRankSelectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [rankSelectOpen]);

  const selectedRankDisplay = RANK_DISPLAY.find(r => r.value === supervisorRank)?.display ?? supervisorRank;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] bg-[#F4F7F8] overflow-y-auto flex flex-col items-center select-none"
    >
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#F4F7F8] pb-12">
        {/* Sticky Header and Summary Card Container */}
        <div className="sticky top-0 z-30 bg-[#F4F7F8]">
          {/* Top Header */}
          <header className="px-4 py-3 flex items-center justify-between bg-white/95 backdrop-blur-md">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 active:scale-95 transition cursor-pointer"
              aria-label="返回"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              直辖工作室奖金测算
            </h1>

            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-full border border-slate-200/80 bg-white text-xs font-semibold text-slate-600 flex items-center gap-1 hover:bg-slate-50 active:scale-95 transition shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>重置</span>
            </button>
          </header>

          {/* Summary Card (固定在顶部，不随下方滚动) */}
          <div className="px-4 pt-3 pb-2">
            <div className="bg-white rounded-2xl p-4 border border-emerald-300 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-bold text-slate-900">直辖工作室奖金变化</span>
                  <span className={`text-xl font-extrabold tracking-tight ${totalIncomeChange >= 0 ? 'text-[#00A758]' : 'text-rose-500'}`}>
                    {totalIncomeChange >= 0 ? `+¥${totalIncomeChange.toLocaleString()}` : `-¥${Math.abs(totalIncomeChange).toLocaleString()}`}
                  </span>
                  <span className="text-xs font-medium text-slate-400">/月</span>
                </div>
              </div>

              {/* 2 Split Sub-boxes */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Left: 直辖工作室辅导奖测算 */}
                <div className="bg-emerald-50/45 border border-emerald-200/70 rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">直辖工作室辅导奖测算</span>
                  </div>
                  <div className="text-sm font-bold text-[#00A758] mt-2">
                    +¥{coachingBonusIncrease.toLocaleString()}
                  </div>
                </div>

                {/* Right: 直辖工作室每月管理奖金变化 (背景修改为 #FFF7F7) */}
                <div className="bg-[#FFF7F7] border border-rose-200/70 rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">直辖工作室每月管理奖金变化</span>
                  </div>
                  <div className="text-sm font-bold text-rose-500 mt-2 font-mono">
                    {prizeChange2026 === 0 ? '-¥0' : (prizeChange2026 > 0 ? `+¥${prizeChange2026.toLocaleString()}` : `-¥${Math.abs(prizeChange2026).toLocaleString()}`)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <main className="p-4 pt-1 space-y-3.5 flex-1">
          {/* Section 1: 直辖工作室辅导奖 */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00A758]"></div>
              <span className="text-sm font-bold text-slate-900 tracking-tight">直辖工作室辅导奖</span>
            </div>

            {/* Row 1: 新人人数（12个考核月内） */}
            <div className="flex items-center justify-between bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/80">
              <span className="text-xs font-medium text-slate-700">新人人数（12个考核月内）</span>
              
              <div className="flex items-center gap-1.5">
                <div className="flex items-center bg-white border border-emerald-400/90 rounded-lg px-3 py-1 min-w-[70px] justify-center">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={newAgentCount === 0 ? '' : newAgentCount}
                    onChange={(e) => handleNewAgentCountChange(e.target.value)}
                    placeholder="0"
                    className="w-8 text-xs font-bold text-[#066349] text-center focus:outline-none font-mono"
                  />
                </div>
                <span className="text-xs font-medium text-slate-400">人</span>
              </div>
            </div>

            {/* Row 2: 新人月度平均FYC（12个考核月内） */}
            <div className="flex items-center justify-between bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/80">
              <div>
                <div className="text-xs font-medium text-slate-700">新人月度平均FYC（12个考核月内）</div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                  奖金率{Math.round(coachingBonusRate * 100)}%（{newAgentFycSafe >= 3000 ? '非星钻新人奖金率: 20%' : '星钻新人奖金率: 28%'}）
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400 font-medium">¥</span>
                <div className="flex items-center bg-white border border-emerald-400/90 rounded-lg px-2.5 py-1 min-w-[85px] justify-center">
                  <input
                    type="number"
                    step="0.01"
                    min="3000"
                    value={newAgentFyc}
                    onChange={(e) => handleNewAgentFycChange(e.target.value)}
                    placeholder="3000"
                    className="w-20 text-xs font-bold text-[#066349] text-center focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: 测算奖金 (背景颜色与直辖工作室辅导奖测算卡片背景颜色保持一致) */}
            <div className="bg-emerald-50/45 border border-emerald-200/70 rounded-xl px-3.5 py-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">测算奖金</span>
              <span className="text-sm font-bold text-[#00A758] font-mono">
                +¥{coachingBonusIncrease.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Section 2: 直辖工作室每月管理奖 */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
            {/* Header: 职级下拉框在标题右边，靠近标题 */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#2B7FFF] flex-shrink-0"></div>
                <span className="text-sm font-bold text-slate-900 tracking-tight whitespace-nowrap">直辖工作室每月管理奖</span>
              </div>

              {/* Custom Rank Select Dropdown - 紧贴标题右侧 */}
              <div ref={rankSelectRef} className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setRankSelectOpen(!rankSelectOpen)}
                  className="inline-flex items-center gap-0.5 border border-blue-200/70 bg-[#EDF5FF] px-1.5 py-0.5 rounded-md text-[10px] font-bold cursor-pointer"
                >
                  <span className="text-[#8EC2FF] whitespace-nowrap">职级:</span>
                  <span className="text-[#2B7FFF] font-extrabold truncate max-w-[72px]">{selectedRankDisplay}</span>
                  <ChevronDown className={`w-2.5 h-2.5 text-[#2B7FFF] transition-transform ${rankSelectOpen ? 'rotate-180' : ''}`} />
                </button>
                {rankSelectOpen && (
                  <div className="absolute top-full right-0 mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[160px]">
                    {RANK_DISPLAY.map((rank) => (
                      <button
                        key={rank.value}
                        type="button"
                        onClick={() => {
                          setSupervisorRank(rank.value);
                          setRankSelectOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-[10px] font-bold hover:bg-blue-50/60 transition-colors ${
                          rank.value === supervisorRank
                            ? 'text-[#2B7FFF] bg-blue-50/40'
                            : 'text-slate-700'
                        }`}
                      >
                        {rank.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Row 1: 主管个人当月FYC */}
            <div className="flex items-center justify-between bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/80">
              <div>
                <div className="text-xs font-medium text-slate-700">主管个人当月FYC</div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                  系数 {personalCoeff}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400 font-medium">¥</span>
                <div className="flex items-center bg-white border border-emerald-400/90 rounded-lg px-2.5 py-1 min-w-[85px] justify-center">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={personalFyc ?? ''}
                    onChange={(e) => handlePersonalFycChange(e.target.value)}
                    placeholder="0"
                    className="w-20 text-xs font-bold text-[#066349] text-center focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: 直辖工作室当月FYC */}
            <div className={`flex items-center justify-between bg-slate-50/50 p-2.5 rounded-xl border ${studioFycBelowFloor ? 'border-amber-300' : 'border-slate-100/80'}`}>
              <div>
                <div className="text-xs font-medium text-slate-700">直辖工作室当月FYC</div>
                <div className={`text-[10px] font-medium mt-0.5 ${studioFycBelowFloor ? 'text-amber-600' : 'text-slate-400'}`}>
                  奖金率 {(studioManagementRate * 100).toFixed(1)}%
                  {studioFycBelowFloor && `（低于下限 ${studioFycFloor.toFixed(2)}）`}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400 font-medium">¥</span>
                <div className="flex items-center bg-white border border-emerald-400/90 rounded-lg px-2.5 py-1 min-w-[85px] justify-center">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={studioFyc ?? ''}
                    onChange={(e) => handleStudioFycChange(e.target.value)}
                    placeholder="0"
                    className="w-20 text-xs font-bold text-[#066349] text-center focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: 测算奖金 */}
            <div className="bg-slate-50/50 border border-slate-100/80 rounded-xl px-3.5 py-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">测算奖金</span>
              <span className="text-sm font-bold text-[#00A758] font-mono">
                +¥{studioCalculatedBonus.toLocaleString()}
              </span>
            </div>

            {/* Row 4: 较2026年奖金变化 */}
            <div className="bg-[#FFF7F7] border border-rose-200/70 rounded-xl px-3.5 py-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">较2026年奖金变化</span>
              <span className="text-sm font-bold text-rose-500 font-mono">
                {prizeChange2026 === 0 ? '-¥0' : (prizeChange2026 > 0 ? `+¥${prizeChange2026.toLocaleString()}` : `-¥${Math.abs(prizeChange2026).toLocaleString()}`)}
              </span>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-[11px] text-slate-400 py-2">
            *本工具仅用于奖金模拟测算与参考，不作为实际奖金发放依据。
          </p>
        </main>
      </div>
    </motion.div>
  );
};

export default SupervisorIncomeCalculator;


