import React, { useState } from 'react';

interface RetentionManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats?: any;
}

type CaliberType = '签发' | '发佣';
type PeriodType = '单考核期' | '双考核期';
type CityType = 'A' | 'B' | 'C';
type RankType = 'DD' | 'DM' | 'SUM' | 'UM' | 'FC';

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

interface RetentionSection {
  title: string;
  standards: StandardBlock[];
}

export const RetentionManagementModal: React.FC<RetentionManagementModalProps> = ({
  isOpen,
  onClose,
  stats,
}) => {
  if (!isOpen) return null;

  const [dataCaliber, setDataCaliber] = useState<CaliberType>('签发');
  const [periodType, setPeriodType] = useState<PeriodType>('单考核期');
  const selectedBatch = '2026Q1';
  const city: CityType = 'A';
  const currentRank: RankType = 'DD';
  const retentionRank: RankType = 'DD';

  // Calculate standards based on PeriodType, Caliber, and Rank
  const getRecruitmentData = (): RetentionSection => {
    const isSingle = periodType === '单考核期';
    const isIssued = dataCaliber === '签发';

    if (currentRank === 'DD') {
      return {
        title: '招募',
        standards: [
          {
            title: '标准一',
            rows: [
              {
                name: '直招新人',
                standard: isSingle ? 1 : 2,
                actual: isIssued ? (stats?.directRecruits || '-') : '-',
                gap: isSingle ? 1 : 2,
              },
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
                name: '直招新人',
                standard: isSingle ? 1 : 2,
                actual: isIssued ? (stats?.directRecruits || '-') : '-',
                gap: isSingle ? 1 : 2,
              },
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
    }

    if (currentRank === 'DM' || currentRank === 'SUM') {
      return {
        title: '招募',
        standards: [
          {
            title: '标准一',
            rows: [
              { name: '直招新人', standard: isSingle ? 1 : 2, actual: '-', gap: isSingle ? 1 : 2 },
              { name: '星钻人力/人次', standard: isSingle ? 1 : 2, actual: '-', gap: isSingle ? 1 : 2 },
            ],
          },
          {
            title: '标准二',
            rows: [
              { name: '直招新人', standard: isSingle ? 1 : 2, actual: '-', gap: isSingle ? 1 : 2 },
              { name: '寿险出单人力', standard: isSingle ? 2 : 3, actual: '-', gap: isSingle ? 2 : 3 },
            ],
          },
        ],
      };
    }

    // FC / UM
    return {
      title: '招募',
      standards: [
        {
          title: '标准一',
          rows: [
            { name: '直招新人', standard: isSingle ? 1 : 2, actual: '-', gap: isSingle ? 1 : 2 },
            { name: '出单人力', standard: isSingle ? 1 : 2, actual: '-', gap: isSingle ? 1 : 2 },
          ],
        },
      ],
    };
  };

  const recruitmentSection = getRecruitmentData();

  return (
    <div className="fixed inset-0 z-[1000] bg-[#F5F6F8] flex flex-col animate-slide-up font-sans select-none overflow-hidden">
      {/* Top Header Bar with Light Green Gradient Background */}
      <div className="relative bg-gradient-to-b from-[#D2F5E1] via-[#E4F8ED] to-[#F5F6F8] px-4 pt-10 pb-2 border-b border-slate-200/40">
        {/* Top Action Row: Back button, Centered Title, Caliber switch */}
        <div className="relative flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            id="retention-back-btn"
            className="w-9 h-9 flex items-center justify-center text-slate-800 active:scale-95 transition z-10"
          >
            <i className="fa-solid fa-chevron-left text-lg"></i>
          </button>

          {/* Centered Title */}
          <h1 className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-900 tracking-tight pointer-events-none">
            留任
          </h1>

          {/* 签发 / 发佣 Tab Switch Buttons */}
          <div className="flex bg-white/70 backdrop-blur-xs rounded-[6px] p-0.5 select-none shadow-xs border border-green-100/60 z-10">
            {(['签发', '发佣'] as CaliberType[]).map((caliber) => (
              <button
                key={caliber}
                id={`retention-caliber-${caliber}`}
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
                id={`period-tab-${period}`}
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
        {/* 考核批次 Row - Requirement 3: 2026Q1靠近"考核批次"字段，不要放在页面右边，默认值，不需要支持下拉选择 */}
        <div className="flex items-center gap-2.5 px-1">
          <span className="text-sm text-slate-500 font-medium">考核批次</span>
          <span className="bg-[#00A758] text-white px-3 py-0.5 rounded-full text-xs font-semibold shadow-xs">
            {selectedBatch}
          </span>
        </div>

        {/* Basic Info 3-Column Strip - Requirement 4: 三列基础信息栏三列字段下方白色背景删掉 */}
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

            {/* Column 3: 留任职级 */}
            <div className="flex flex-col items-center px-2">
              <span className="text-xs text-slate-400 font-normal mb-1">留任职级</span>
              <span className="text-sm font-bold text-slate-900">{retentionRank}</span>
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="px-1 -mt-1">
          <p className="text-xs text-slate-400 font-normal">
            当前数据截至时间： 2026/06/11
          </p>
        </div>

        {/* Section: 招募 Card - No rounded corners */}
        <div className="bg-white p-4 shadow-sm border border-slate-100/80 space-y-4">
          {/* Header with Title & Divider */}
          <div>
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight pb-3">
              {recruitmentSection.title}
            </h2>
            {/* 招募与标准一中间的分隔线 */}
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

                  {/* Table Rows: No inner row divider lines */}
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

export default RetentionManagementModal;
