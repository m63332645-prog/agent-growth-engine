import React, { useState } from 'react';

interface PromotionManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
  stats?: any;
}

type CaliberType = '签发' | '发佣';
type PeriodType = '单考核期' | '双考核期';
type BatchType = '2026Q1' | '2025Q4';

interface TableRowItem {
  name: string;
  standard: string | number;
  actual: string | number;
  gap: string | number;
}

interface StandardBlock {
  title: string;
  rows: TableRowItem[];
}

interface PromotionSection {
  title: string;
  standards: StandardBlock[];
}

export const PromotionManagementModal: React.FC<PromotionManagementModalProps> = ({
  isOpen,
  onClose,
  data,
  stats,
}) => {
  if (!isOpen) return null;

  const [dataCaliber, setDataCaliber] = useState<CaliberType>('签发');
  const [periodType, setPeriodType] = useState<PeriodType>('单考核期');
  const [selectedBatch, setSelectedBatch] = useState<BatchType>('2026Q1');

  const city = 'A';
  const currentRank = 'DD';
  const targetRank = 'SDD';

  const isSingle = periodType === '单考核期';
  const isIssued = dataCaliber === '签发';

  // 1. 招募数据
  const getRecruitmentData = (): PromotionSection => {
    return {
      title: '招募',
      standards: [
        {
          title: '标准一',
          rows: [
            {
              name: '星钻人力/人次',
              standard: isSingle ? 1 : 2,
              actual: isIssued ? (stats?.starDiamondManpower || '-') : '-',
              gap: isSingle ? 1 : 2,
            },
          ],
        },
        {
          title: '标准二',
          rows: [
            {
              name: '寿险出单人力',
              standard: isSingle ? 2 : 4,
              actual: isIssued ? (stats?.activeManpower || '-') : '-',
              gap: isSingle ? 2 : 4,
            },
          ],
        },
      ],
    };
  };

  // 2. 人力数据
  const getManpowerData = (): PromotionSection => {
    return {
      title: '人力',
      standards: [
        {
          title: '标准一',
          rows: [
            {
              name: '营业区累计星钻人力/人次',
              standard: isSingle ? 48 : 96,
              actual: isIssued ? (stats?.teamStarDiamond || '-') : '-',
              gap: isSingle ? 48 : 96,
            },
          ],
        },
      ],
    };
  };

  const recruitmentSection = getRecruitmentData();
  const manpowerSection = getManpowerData();

  return (
    <div className="fixed inset-0 z-[1000] bg-[#F5F6F8] flex flex-col animate-slide-up font-sans select-none overflow-hidden">
      {/* Top Header Bar with Light Green Gradient Background */}
      <div className="relative bg-gradient-to-b from-[#D2F5E1] via-[#E4F8ED] to-[#F5F6F8] px-4 pt-10 pb-2 border-b border-slate-200/40">
        {/* Top Action Row: Back button, Centered Title, Caliber switch */}
        <div className="relative flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            id="promotion-back-btn"
            className="w-9 h-9 flex items-center justify-center text-slate-800 active:scale-95 transition z-10"
          >
            <i className="fa-solid fa-chevron-left text-lg"></i>
          </button>

          {/* Centered Title */}
          <h1 className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-900 tracking-tight pointer-events-none">
            晋升
          </h1>

          {/* 签发 / 发佣 Tab Switch Buttons */}
          <div className="flex bg-white/70 backdrop-blur-xs rounded-[6px] p-0.5 select-none shadow-xs border border-green-100/60 z-10">
            {(['签发', '发佣'] as CaliberType[]).map((caliber) => (
              <button
                key={caliber}
                id={`promotion-caliber-${caliber}`}
                onClick={() => setDataCaliber(caliber)}
                className={`text-xs font-semibold px-3 py-1 rounded-[5px] transition-all duration-150 ${
                  dataCaliber === caliber
                    ? 'bg-[#00A758] text-white shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {caliber}
              </button>
            ))}
          </div>
        </div>

        {/* Period Selector Tabs: 单考核期 / 双考核期 inside the top header banner */}
        <div className="flex items-center gap-6 px-1">
          {(['单考核期', '双考核期'] as PeriodType[]).map((period) => {
            const isActive = periodType === period;
            return (
              <button
                key={period}
                id={`promotion-period-${period}`}
                onClick={() => setPeriodType(period)}
                className="flex flex-col items-center group relative pb-1 cursor-pointer select-none"
              >
                <span
                  className={`text-base font-bold tracking-tight transition-colors ${
                    isActive
                      ? 'text-slate-900'
                      : 'text-slate-500/80 hover:text-slate-700'
                  }`}
                >
                  {period}
                </span>
                <div
                  className={`w-8 h-[3px] rounded-full mt-1.5 transition-colors ${
                    isActive ? 'bg-[#00A758]' : 'bg-transparent'
                  }`}
                ></div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Red Notice Banner: Page is for reference only */}
      <div className="px-4 pt-2 pb-1 shrink-0 z-20">
        <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 text-rose-600">
          <i className="fa-solid fa-circle-exclamation text-sm mt-0.5 shrink-0"></i>
          <p className="text-xs font-bold leading-relaxed">
            当前页面仅供作跳转参考，页面实际样式与字段以现有2.0页面为准
          </p>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-24">
        {/* 考核批次 Row with 2026Q1 / 2025Q4 Pills */}
        <div className="flex items-center gap-2.5 px-1">
          <span className="text-sm text-slate-500 font-medium">考核批次</span>
          
          <div className="flex items-center gap-2">
            {(['2026Q1', '2025Q4'] as BatchType[]).map((batch) => {
              const isSelected = selectedBatch === batch;
              return (
                <button
                  key={batch}
                  id={`promotion-batch-${batch}`}
                  onClick={() => setSelectedBatch(batch)}
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#00A758] text-white shadow-xs'
                      : 'bg-white text-[#00A758] border border-[#00A758]/80 hover:bg-green-50/50'
                  }`}
                >
                  {batch}
                </button>
              );
            })}
          </div>
        </div>

        {/* Basic Info 3-Column Strip: 城市: A | 当前职级: DD | 晋升职级: SDD */}
        <div className="px-1 py-1">
          <div className="grid grid-cols-3 divide-x divide-slate-200">
            {/* Column 1: 城市 */}
            <div className="flex flex-col items-center px-2">
              <span className="text-xs text-slate-400 font-normal mb-1">城市</span>
              <span className="text-sm font-bold text-slate-900">{city}</span>
            </div>

            {/* Column 2: 当前职级 */}
            <div className="flex flex-col items-center px-2">
              <span className="text-xs text-slate-400 font-normal mb-1">当前职级</span>
              <span className="text-sm font-bold text-slate-900">
                {currentRank}
              </span>
            </div>

            {/* Column 3: 晋升职级 */}
            <div className="flex flex-col items-center px-2">
              <span className="text-xs text-slate-400 font-normal mb-1">晋升职级</span>
              <span className="text-sm font-bold text-slate-900">{targetRank}</span>
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="px-1 -mt-1">
          <p className="text-xs text-slate-400 font-normal">
            当前数据截至时间： 2026/03/27
          </p>
        </div>

        {/* Section 1: 招募 Card */}
        <div className="bg-white p-4 shadow-sm border border-slate-100/80 space-y-4">
          {/* Header with Title & Divider */}
          <div>
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight pb-3">
              {recruitmentSection.title}
            </h2>
            <div className="h-[1px] bg-slate-100 w-full"></div>
          </div>

          <div className="space-y-4 pt-1">
            {recruitmentSection.standards.map((std, idx) => (
              <div key={idx} className="space-y-2.5">
                <h3 className="text-[13px] font-bold text-slate-800 tracking-tight">
                  {std.title}
                </h3>

                <div className="bg-[#F5F6F8] p-3.5 space-y-3">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 text-xs text-slate-400 font-normal">
                    <div className="col-span-6 text-left">名称</div>
                    <div className="col-span-2 text-center">标准</div>
                    <div className="col-span-2 text-center">实际</div>
                    <div className="col-span-2 text-right">缺口</div>
                  </div>

                  {/* Table Rows */}
                  {std.rows.map((row, rIdx) => (
                    <div
                      key={rIdx}
                      className="grid grid-cols-12 text-xs items-center gap-1"
                    >
                      <div className="col-span-6 text-left font-normal text-slate-400 leading-snug break-words pr-1">
                        {row.name}
                      </div>
                      <div className="col-span-2 text-center font-bold text-slate-800 font-mono">
                        {row.standard}
                      </div>
                      <div className="col-span-2 text-center font-bold text-[#00A758] font-mono">
                        {row.actual}
                      </div>
                      <div className="col-span-2 text-right font-bold text-slate-800 font-mono">
                        {row.gap}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: 人力 Card */}
        <div className="bg-white p-4 shadow-sm border border-slate-100/80 space-y-4">
          {/* Header with Title & Divider */}
          <div>
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight pb-3">
              {manpowerSection.title}
            </h2>
            <div className="h-[1px] bg-slate-100 w-full"></div>
          </div>

          <div className="space-y-4 pt-1">
            {manpowerSection.standards.map((std, idx) => (
              <div key={idx} className="space-y-2.5">
                <h3 className="text-[13px] font-bold text-slate-800 tracking-tight">
                  {std.title}
                </h3>

                <div className="bg-[#F5F6F8] p-3.5 space-y-3">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 text-xs text-slate-400 font-normal">
                    <div className="col-span-6 text-left">名称</div>
                    <div className="col-span-2 text-center">标准</div>
                    <div className="col-span-2 text-center">实际</div>
                    <div className="col-span-2 text-right">缺口</div>
                  </div>

                  {/* Table Rows */}
                  {std.rows.map((row, rIdx) => (
                    <div
                      key={rIdx}
                      className="grid grid-cols-12 text-xs items-center gap-1"
                    >
                      <div className="col-span-6 text-left font-normal text-slate-400 leading-snug break-words pr-1">
                        {row.name}
                      </div>
                      <div className="col-span-2 text-center font-bold text-slate-800 font-mono">
                        {row.standard}
                      </div>
                      <div className="col-span-2 text-center font-bold text-[#00A758] font-mono">
                        {row.actual}
                      </div>
                      <div className="col-span-2 text-right font-bold text-slate-800 font-mono">
                        {row.gap}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionManagementModal;
