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

interface PerformanceItem {
  name: string;
  standard: string | number;
  actualIssued: string | number;
  gapIssued: string | number;
  actualWithPending: string | number;
  gapWithPending: string | number;
}

interface SimpleItem {
  name: string;
  actual: string | number;
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

  const isSingle = periodType === '单考核期';
  const isIssued = dataCaliber === '签发';

  // 招募数据
  const getRecruitmentData = (): RetentionSection => {
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

  // 人力数据
  const getManpowerData = (): RetentionSection => {
    return {
      title: '人力',
      standards: [
        {
          title: '标准一',
          rows: [
            {
              name: '辖下累计星钻人力/人次',
              standard: isSingle ? 48 : 96,
              actual: isIssued ? (stats?.teamStarDiamond || '-') : '-',
              gap: isSingle ? 48 : 96,
            },
          ],
        },
        {
          title: '标准二',
          rows: [
            {
              name: '辖下累计寿险出单人力/人次',
              standard: isSingle ? 60 : 120,
              actual: isIssued ? (stats?.teamActiveManpower || '-') : '-',
              gap: isSingle ? 60 : 120,
            },
          ],
        },
      ],
    };
  };

  // 考核期业绩数据
  const getPerformanceData = (): PerformanceItem[] => {
    return [
      {
        name: '个人累计FYC',
        standard: 10000,
        actualIssued: isIssued ? (stats?.personalFYC || '-') : '-',
        gapIssued: isSingle ? 10000 : 20000,
        actualWithPending: isIssued ? (stats?.personalFYCPending || '-') : '-',
        gapWithPending: isSingle ? 10000 : 20000,
      },
      {
        name: '直辖工作室累计FYC',
        standard: '-',
        actualIssued: isIssued ? (stats?.studioFYC || '-') : '-',
        gapIssued: '-',
        actualWithPending: isIssued ? (stats?.studioFYCPending || '-') : '-',
        gapWithPending: '-',
      },
    ];
  };

  // 续保率数据
  const getRetentionRateData = (): SimpleItem[] => {
    return [
      {
        name: '所辖团队续保率(滚动6个月)',
        actual: stats?.retentionRate6m || '-',
      },
      {
        name: '所辖团队续保率(滚动12个月)',
        actual: stats?.retentionRate12m || '-',
      },
    ];
  };

  // 其他数据
  const getOtherData = (): SimpleItem[] => {
    return [
      { name: '晨会出席率', actual: stats?.meetingAttendance || '-' },
      { name: '课程结业情况', actual: stats?.courseCompletion || '未完成' },
      { name: '合规问题', actual: stats?.complianceIssue || '无' },
    ];
  };

  const recruitmentSection = getRecruitmentData();
  const manpowerSection = getManpowerData();
  const performanceData = getPerformanceData();
  const retentionRateData = getRetentionRateData();
  const otherData = getOtherData();

  return (
    <div className="fixed inset-0 z-[1000] bg-[#F5F6F8] flex flex-col animate-slide-up font-sans select-none overflow-hidden">
      {/* Top Header Bar with Light Green Gradient Background */}
      <div className="relative bg-gradient-to-b from-[#D2F5E1] via-[#E4F8ED] to-[#F5F6F8] px-4 pt-10 pb-2 border-b border-slate-200/40">
        {/* Top Action Row: Back button, Centered Title, Caliber switch */}
        <div className="relative flex items-center justify-between">
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
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {caliber}
              </button>
            ))}
          </div>
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

      {/* Period Selector Tabs - Fixed, not scrolling with content */}
      <div className="flex items-center gap-6 px-4 py-2 bg-[#F5F6F8] shrink-0 z-20 border-b border-slate-100/60">
        {(['单考核期', '双考核期'] as PeriodType[]).map((period) => {
          const isActive = periodType === period;
          return (
            <button
              key={period}
              id={`retention-period-${period}`}
              onClick={() => setPeriodType(period)}
              className="flex flex-col items-center group relative pb-1 cursor-pointer select-none"
            >
              <span
                className={`text-sm font-medium tracking-tight transition-colors ${
                  isActive
                    ? 'text-slate-900'
                    : 'text-slate-500/80 hover:text-slate-700'
                }`}
              >
                {period}
              </span>
              <div
                className={`w-6 h-[2px] rounded-full mt-1 transition-colors ${
                  isActive ? 'bg-[#00A758]' : 'bg-transparent'
                }`}
              ></div>
            </button>
          );
        })}
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-24">
        {/* 考核批次 Row */}
        <div className="flex items-center gap-2.5 px-1">
          <span className="text-sm text-slate-500 font-medium">考核批次</span>
          <span className="bg-[#00A758] text-white px-3 py-0.5 rounded-full text-xs font-semibold shadow-xs">
            {selectedBatch}
          </span>
        </div>

        {/* Basic Info 3-Column Strip */}
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

        {/* Section 3: 考核期业绩 Card */}
        <div className="bg-white p-4 shadow-sm border border-slate-100/80 space-y-4">
          {/* Header with Title & Divider */}
          <div>
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight pb-3">
              考核期业绩
            </h2>
            <div className="h-[1px] bg-slate-100 w-full"></div>
          </div>

          <div className="space-y-4 pt-1">
            {performanceData.map((item, idx) => (
              <div key={idx} className="space-y-2.5">
                <div className="bg-[#F5F6F8] p-3.5 space-y-3">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 text-xs text-slate-400 font-normal">
                    <div className="col-span-4 text-left">名称</div>
                    <div className="col-span-2 text-center">标准</div>
                    <div className="col-span-3 text-center">实际</div>
                    <div className="col-span-3 text-center">缺口</div>
                  </div>

                  {/* Row 1: Main values */}
                  <div className="grid grid-cols-12 text-xs items-center gap-1">
                    <div className="col-span-4 text-left font-normal text-slate-400 leading-snug break-words pr-1">
                      {item.name}
                    </div>
                    <div className="col-span-2 text-center font-bold text-slate-800 font-mono">
                      {item.standard}
                    </div>
                    <div className="col-span-3 text-center font-bold text-[#00A758] font-mono">
                      <div className="text-xs text-slate-400 font-normal mb-0.5">
                        (已发佣)
                      </div>
                      {item.actualIssued}
                    </div>
                    <div className="col-span-3 text-center font-bold text-slate-800 font-mono">
                      <div className="text-xs text-slate-400 font-normal mb-0.5">
                        (已发佣)
                      </div>
                      {item.gapIssued}
                    </div>
                  </div>

                  {/* Row 2: Pending values */}
                  <div className="grid grid-cols-12 text-xs items-center gap-1">
                    <div className="col-span-4"></div>
                    <div className="col-span-2"></div>
                    <div className="col-span-3 text-center font-bold text-[#00A758] font-mono">
                      <div className="text-xs text-slate-500 font-bold mb-0.5">
                        实际
                      </div>
                      <div className="text-xs text-slate-400 font-normal mb-0.5">
                        (含已签发未发佣)
                      </div>
                      {item.actualWithPending}
                    </div>
                    <div className="col-span-3 text-center font-bold text-slate-800 font-mono">
                      <div className="text-xs text-slate-500 font-bold mb-0.5">
                        缺口
                      </div>
                      <div className="text-xs text-slate-400 font-normal mb-0.5">
                        (已签发含未发佣)
                      </div>
                      {item.gapWithPending}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: 续保率 Card */}
        <div className="bg-white p-4 shadow-sm border border-slate-100/80 space-y-4">
          {/* Header with Title & Divider */}
          <div>
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight pb-3">
              续保率
            </h2>
            <div className="h-[1px] bg-slate-100 w-full"></div>
          </div>

          <div className="space-y-3 pt-1">
            <div className="bg-[#F5F6F8] p-3.5 space-y-3">
              {/* Table Header */}
              <div className="grid grid-cols-12 text-xs text-slate-400 font-normal">
                <div className="col-span-8 text-left">名称</div>
                <div className="col-span-4 text-right font-bold text-[#00A758]">实际</div>
              </div>

              {/* Table Rows */}
              {retentionRateData.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 text-xs items-center gap-1"
                >
                  <div className="col-span-8 text-left font-normal text-slate-400 leading-snug break-words pr-1">
                    {item.name}
                  </div>
                  <div className="col-span-4 text-right font-bold text-[#00A758] font-mono">
                    {item.actual}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: 其他 Card */}
        <div className="bg-white p-4 shadow-sm border border-slate-100/80 space-y-4">
          {/* Header with Title & Divider */}
          <div>
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight pb-3">
              其他
            </h2>
            <div className="h-[1px] bg-slate-100 w-full"></div>
          </div>

          <div className="space-y-3 pt-1">
            <div className="bg-[#F5F6F8] p-3.5 space-y-3">
              {/* Table Header */}
              <div className="grid grid-cols-12 text-xs text-slate-400 font-normal">
                <div className="col-span-8 text-left">名称</div>
                <div className="col-span-4 text-right font-bold text-[#00A758]">实际</div>
              </div>

              {/* Table Rows */}
              {otherData.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 text-xs items-center gap-1"
                >
                  <div className="col-span-8 text-left font-normal text-slate-400 leading-snug break-words pr-1">
                    {item.name}
                  </div>
                  <div className="col-span-4 text-right font-bold text-[#00A758] font-mono">
                    {item.actual}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Remark Text */}
        <div className="px-1 py-3">
          <p className="text-xs text-slate-400 font-normal leading-relaxed">
            1、以上数据为截至昨日数据，仅供参考，最终以晋升留任考核结果数据为准。
          </p>
        </div>
      </div>
    </div>
  );
};

export default RetentionManagementModal;