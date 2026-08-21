import React, { useState } from 'react';

interface FinancialSubsidyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAmountHidden?: boolean;
}

type CaliberType = '签发' | '发佣';

export const FinancialSubsidyModal: React.FC<FinancialSubsidyModalProps> = ({
  isOpen,
  onClose,
  isAmountHidden,
}) => {
  if (!isOpen) return null;

  const [dataCaliber, setDataCaliber] = useState<CaliberType>('签发');
  const [selectedMonth, setSelectedMonth] = useState({ month: 4, year: 2025 });
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [2024, 2025, 2026];

  return (
    <div className="fixed inset-0 z-[1000] bg-[#F5F6F8] flex flex-col animate-slide-up font-sans select-none overflow-hidden">
      {/* Background Decorative Large Circles (Unified full-screen top-right background, no seam between header and body) */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-slate-200/40 pointer-events-none -z-0"></div>
      <div className="absolute top-10 right-4 w-52 h-52 rounded-full bg-slate-100/60 pointer-events-none -z-0"></div>

      {/* Top Fixed Header with transparent/neutral background (No border-bottom line) */}
      <div className="relative px-4 pt-10 pb-2 shrink-0 z-20">
        {/* Navigation Bar */}
        <div className="relative flex items-center justify-between z-10">
          <button
            onClick={onClose}
            id="subsidy-back-btn"
            className="w-9 h-9 flex items-center justify-center text-slate-800 active:scale-95 transition"
          >
            <i className="fa-solid fa-chevron-left text-lg"></i>
          </button>

          {/* Centered Title */}
          <h1 className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-900 tracking-tight pointer-events-none">
            财补追踪
          </h1>

          {/* 签发 / 发佣 Tab Switch Buttons */}
          <div className="flex bg-white/90 backdrop-blur-xs rounded-[6px] p-0.5 select-none shadow-xs border border-slate-200/80">
            {(['签发', '发佣'] as CaliberType[]).map((caliber) => (
              <button
                key={caliber}
                id={`subsidy-caliber-${caliber}`}
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
      <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-24 relative z-10">
        {/* Top Personnel Info & Sticky Date Selector Area */}
        <div className="relative pt-1 space-y-2.5">
          {/* Agent Name & left-aligned tags directly underneath */}
          <div className="relative z-10 space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">金暖</h2>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-[#D8F5E5] text-[#00A758] px-2.5 py-0.5 rounded-full text-xs font-bold">
                区域总监
              </span>
              <span className="bg-[#EAEBED] text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-medium">
                SH68699
              </span>
              <span className="bg-[#D8F5E5] text-[#00A758] px-2.5 py-0.5 rounded-full text-xs font-bold">
                有效
              </span>
            </div>
          </div>

          {/* Date Selector Placed directly under tags: Sticky at top when scrolling past tags */}
          <div className="sticky top-0 z-30 py-1.5 -mx-4 px-4 transition-all">
            <div className="relative inline-block">
              <button
                onClick={() => setShowMonthPicker(!showMonthPicker)}
                id="subsidy-date-picker-btn"
                className="flex items-center gap-1.5 text-slate-900 active:opacity-75"
              >
                <span className="font-bold text-lg">{selectedMonth.month} 月</span>
                <span className="font-normal text-xs text-slate-600">{selectedMonth.year}年</span>
                <i className="fa-solid fa-chevron-down text-xs text-slate-500 ml-0.5"></i>
              </button>

              {showMonthPicker && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-50 min-w-[280px]">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-400 mb-2">月份</p>
                      <div className="grid grid-cols-3 gap-1">
                        {months.map((m) => (
                          <button
                            key={m}
                            onClick={() => {
                              setSelectedMonth({ ...selectedMonth, month: m });
                              setShowMonthPicker(false);
                            }}
                            className={`py-1.5 text-xs font-semibold rounded transition-all ${
                              selectedMonth.month === m
                                ? 'bg-[#00A758] text-white'
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {m}月
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="w-24">
                      <p className="text-xs font-bold text-slate-400 mb-2">年份</p>
                      <div className="space-y-1">
                        {years.map((y) => (
                          <button
                            key={y}
                            onClick={() => {
                              setSelectedMonth({ ...selectedMonth, year: y });
                              setShowMonthPicker(false);
                            }}
                            className={`w-full py-1.5 text-xs font-semibold rounded transition-all ${
                              selectedMonth.year === y
                                ? 'bg-[#00A758] text-white'
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {y}年
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Basic 4-Column Info (Directly on canvas) */}
          <div className="grid grid-cols-4 pt-1 text-center relative z-10">
            <div>
              <p className="text-xs text-slate-400 font-normal mb-1">职级</p>
              <p className="text-sm font-bold text-slate-900">FC</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-normal mb-1">版本</p>
              <p className="text-sm font-bold text-slate-900">25宏才</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-normal mb-1">状态</p>
              <p className="text-sm font-bold text-slate-900">有效</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-normal mb-1">财补考核月</p>
              <p className="text-sm font-bold text-slate-900">3</p>
            </div>
          </div>
        </div>

        {/* Card 1: Plus档的入围条件 */}
        <div className="bg-white shadow-sm border border-slate-100/80">
          <div className="px-4 pt-3.5 pb-2.5">
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
              Plus档的入围条件
            </h2>
          </div>
          {/* Full-width Divider with text-slate-400 equivalent border color */}
          <div className="w-full h-px bg-slate-200"></div>

          <div className="p-4 pt-3.5">
            <div className="bg-[#F5F6F8] p-3.5 space-y-2.5">
              <div className="grid grid-cols-12 text-xs text-slate-400 font-normal">
                <div className="col-span-6 text-left">名称</div>
                <div className="col-span-2 text-center">实际</div>
                <div className="col-span-2 text-center">目标</div>
                <div className="col-span-2 text-center">达标</div>
              </div>

              <div className="grid grid-cols-12 text-xs items-center">
                <div className="col-span-6 text-left font-normal text-slate-400">
                  累计直招星钻人力
                </div>
                <div className="col-span-2 text-center font-bold text-slate-800 font-mono">
                  0
                </div>
                <div className="col-span-2 text-center font-bold text-[#00A758] font-mono">
                  1
                </div>
                <div className="col-span-2 text-center">
                  {/* empty */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: 月度财务补助金 */}
        <div className="bg-white shadow-sm border border-slate-100/80">
          <div className="px-4 pt-3.5 pb-2.5">
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
              月度财务补助金
            </h2>
          </div>
          {/* Full-width Divider */}
          <div className="w-full h-px bg-slate-200"></div>

          <div className="p-4 pt-3.5 space-y-3.5">
            <p className="text-xs text-slate-400 font-normal flex items-center gap-1">
              <i className="fa-regular fa-circle-question text-[11px]"></i>
              <span>补助金为应发值，不包含预留等情况</span>
            </p>

            {/* Large Center Metric */}
            <div className="text-center py-1">
              <div className="flex items-center justify-center gap-1 text-slate-500 text-xs font-normal">
                <span>月度财务补助金</span>
                <i className="fa-regular fa-circle-question text-[10px] text-slate-400"></i>
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono mt-1">
                0
              </div>
            </div>

            {/* Progress & Milestone Section */}
            <div className="space-y-1.5 pt-1">
              {/* Top row with FYC & Milestones aligned horizontally */}
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-[#00A758]">
                    FYC(签发)： 37,209
                  </p>
                  <p className="text-xs font-bold text-[#00A758] mt-1 leading-none">
                    FYC(发佣)： 29.2
                  </p>
                  <p className="text-xs font-bold text-[#00A758] mt-1.5 leading-none">
                    当前进度
                  </p>
                </div>

                {/* Right milestones with 2,000 / 20,000 aligned with 29.2 and 下一档 / 最高 aligned with 当前进度 */}
                <div className="flex items-end gap-6 text-right">
                  <div>
                    <p className="text-xs font-bold text-slate-800 font-mono leading-none">
                      2,000
                    </p>
                    <p className="text-xs text-slate-400 mt-1.5 leading-none">
                      下一档
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 font-mono leading-none">
                      20,000
                    </p>
                    <p className="text-xs text-slate-400 mt-1.5 leading-none">
                      最高
                    </p>
                  </div>
                </div>
              </div>

              {/* Little Triangle Markers above progress bar */}
              <div className="relative h-2 w-full">
                <div className="absolute right-[20%] top-0 text-[8px] text-[#A8E4C3] leading-none">
                  ▼
                </div>
                <div className="absolute right-[2%] top-0 text-[8px] text-[#A8E4C3] leading-none">
                  ▼
                </div>
              </div>

              {/* Progress Bar Track: Full track with light green inner section up to 1,971 and remaining white track with 19,971 */}
              <div className="relative w-full h-5 bg-[#F0FAF4] rounded-full overflow-hidden flex items-center p-0.5 border border-emerald-100/60">
                {/* Left Light-green filled portion (spans to 1,971) */}
                <div className="h-full bg-[#CEF0DD] rounded-full flex items-center justify-between pl-0.5 pr-2.5 transition-all" style={{ width: '80%' }}>
                  {/* 1% dark green pill */}
                  <div className="h-4 bg-[#00A758] text-white text-[10px] font-bold px-2 rounded-full flex items-center justify-center shadow-xs shrink-0">
                    1%
                  </div>
                  {/* 1,971 number inside right end of light green section */}
                  <span className="text-[11px] font-mono font-bold text-[#00A758]">
                    1,971
                  </span>
                </div>

                {/* Remaining track portion on the right containing 19,971 */}
                <div className="flex-1 flex justify-end pr-2.5">
                  <span className="text-[11px] font-mono font-bold text-[#00A758]">
                    19,971
                  </span>
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-[#F5F6F8] p-3.5 space-y-2.5">
              <div className="grid grid-cols-12 text-xs text-slate-400 font-normal">
                <div className="col-span-6 text-left">名称</div>
                <div className="col-span-2 text-center">实际</div>
                <div className="col-span-2 text-center">目标</div>
                <div className="col-span-2 text-center">达标</div>
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-12 text-xs items-center">
                <div className="col-span-6 text-left font-normal text-slate-400">
                  个人寿险保单当月件数
                </div>
                <div className="col-span-2 text-center font-bold text-slate-800 font-mono">
                  2
                </div>
                <div className="col-span-2 text-center font-bold text-[#00A758] font-mono">
                  2
                </div>
                <div className="col-span-2 text-center">
                  <span className="inline-block bg-[#D8F5E5] text-[#00A758] px-2 py-0.5 rounded text-[10px] font-bold">
                    达标
                  </span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-12 text-xs items-center">
                <div className="col-span-6 text-left font-normal text-slate-400 flex items-center gap-1">
                  <span>个人寿险保单续保率</span>
                  <i className="fa-regular fa-circle-question text-[10px] text-slate-400"></i>
                </div>
                <div className="col-span-2 text-center font-bold text-slate-800 font-mono">
                  -
                </div>
                <div className="col-span-2 text-center font-bold text-[#00A758] font-mono">
                  -
                </div>
                <div className="col-span-2 text-center">
                  <span className="inline-block bg-[#D8F5E5] text-[#00A758] px-2 py-0.5 rounded text-[10px] font-bold">
                    达标
                  </span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-12 text-xs items-center">
                <div className="col-span-6 text-left font-normal text-slate-400 flex items-center gap-1">
                  <span>每月晨会出席率</span>
                  <i className="fa-regular fa-circle-question text-[10px] text-slate-400"></i>
                </div>
                <div className="col-span-2 text-center font-bold text-slate-800 font-mono">
                  84.62%
                </div>
                <div className="col-span-2 text-center font-bold text-[#00A758] font-mono">
                  80%
                </div>
                <div className="col-span-2 text-center">
                  <span className="inline-block bg-[#D8F5E5] text-[#00A758] px-2 py-0.5 rounded text-[10px] font-bold">
                    达标
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: 财务补助金之季度通算 */}
        <div className="bg-white shadow-sm border border-slate-100/80">
          <div className="px-4 pt-3.5 pb-2.5">
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
              财务补助金之季度通算
            </h2>
          </div>
          {/* Full-width Divider */}
          <div className="w-full h-px bg-slate-200"></div>

          <div className="p-4 pt-3.5 space-y-3.5">
            {/* Large Center Metric */}
            <div className="text-center py-1">
              <div className="flex items-center justify-center gap-1 text-slate-500 text-xs font-normal">
                <span>季度财务补助金</span>
                <i className="fa-regular fa-circle-question text-[10px] text-slate-400"></i>
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono mt-1">
                0
              </div>
            </div>

            {/* Progress & Milestone Section */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-[#00A758] leading-none">
                    FYC 58.4
                  </p>
                  <p className="text-xs font-bold text-[#00A758] mt-1.5 leading-none">
                    当前进度
                  </p>
                </div>

                <div className="flex items-end gap-6 text-right">
                  <div>
                    <p className="text-xs font-bold text-slate-800 font-mono leading-none">
                      6,600
                    </p>
                    <p className="text-xs text-slate-400 mt-1.5 leading-none">
                      下一档
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 font-mono leading-none">
                      66,000
                    </p>
                    <p className="text-xs text-slate-400 mt-1.5 leading-none">
                      最高
                    </p>
                  </div>
                </div>
              </div>

              {/* Little Triangle Markers above progress bar */}
              <div className="relative h-2 w-full">
                <div className="absolute right-[20%] top-0 text-[8px] text-[#A8E4C3] leading-none">
                  ▼
                </div>
                <div className="absolute right-[2%] top-0 text-[8px] text-[#A8E4C3] leading-none">
                  ▼
                </div>
              </div>

              {/* Progress Bar Track: Full track with light green inner section up to 6,542 and remaining white track with 65,942 */}
              <div className="relative w-full h-5 bg-[#F0FAF4] rounded-full overflow-hidden flex items-center p-0.5 border border-emerald-100/60">
                {/* Left Light-green filled portion (spans to 6,542) */}
                <div className="h-full bg-[#CEF0DD] rounded-full flex items-center justify-between pl-0.5 pr-2.5 transition-all" style={{ width: '80%' }}>
                  {/* 1% dark green pill */}
                  <div className="h-4 bg-[#00A758] text-white text-[10px] font-bold px-2 rounded-full flex items-center justify-center shadow-xs shrink-0">
                    1%
                  </div>
                  {/* 6,542 number inside right end of light green section */}
                  <span className="text-[11px] font-mono font-bold text-[#00A758]">
                    6,542
                  </span>
                </div>

                {/* Remaining track portion on the right containing 65,942 */}
                <div className="flex-1 flex justify-end pr-2.5">
                  <span className="text-[11px] font-mono font-bold text-[#00A758]">
                    65,942
                  </span>
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-[#F5F6F8] p-3.5 space-y-2.5">
              <div className="grid grid-cols-12 text-xs text-slate-400 font-normal">
                <div className="col-span-6 text-left">名称</div>
                <div className="col-span-2 text-center">实际</div>
                <div className="col-span-2 text-center">目标</div>
                <div className="col-span-2 text-center">达标</div>
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-12 text-xs items-center">
                <div className="col-span-6 text-left font-normal text-slate-400">
                  个人寿险保单累计件数
                </div>
                <div className="col-span-2 text-center font-bold text-slate-800 font-mono">
                  1
                </div>
                <div className="col-span-2 text-center font-bold text-[#00A758] font-mono">
                  6
                </div>
                <div className="col-span-2 text-center">
                  {/* empty */}
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-12 text-xs items-center">
                <div className="col-span-6 text-left font-normal text-slate-400 flex items-center gap-1">
                  <span>通算达标月数</span>
                  <i className="fa-regular fa-circle-question text-[10px] text-slate-400"></i>
                </div>
                <div className="col-span-2 text-center font-bold text-slate-800 font-mono">
                  3
                </div>
                <div className="col-span-2 text-center font-bold text-slate-400 font-mono">
                  -
                </div>
                <div className="col-span-2 text-center">
                  {/* empty */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: 半年度评定 */}
        <div className="bg-white shadow-sm border border-slate-100/80">
          <div className="px-4 pt-3.5 pb-2.5">
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
              半年度评定
            </h2>
          </div>
          {/* Full-width Divider */}
          <div className="w-full h-px bg-slate-200"></div>

          <div className="p-4 pt-3.5 space-y-4">
            {/* Sub-block 1: 维持宏才 */}
            <div className="space-y-2">
              <h3 className="text-[13px] font-bold text-slate-800 tracking-tight">
                维持宏才
              </h3>

              <div className="bg-[#F5F6F8] p-3.5 space-y-2.5">
                <div className="grid grid-cols-12 text-xs text-slate-400 font-normal">
                  <div className="col-span-6 text-left">名称</div>
                  <div className="col-span-2 text-center">实际</div>
                  <div className="col-span-2 text-center">目标</div>
                  <div className="col-span-2 text-center">达标</div>
                </div>

                <div className="grid grid-cols-12 text-xs items-center">
                  <div className="col-span-6 text-left font-normal text-slate-400">
                    个人累计FYC
                  </div>
                  <div className="col-span-2 text-center font-bold text-slate-800 font-mono">
                    58.4
                  </div>
                  <div className="col-span-2 text-center font-bold text-[#00A758] font-mono">
                    12,000
                  </div>
                  <div className="col-span-2 text-center">
                    {/* empty */}
                  </div>
                </div>

                <div className="grid grid-cols-12 text-xs items-center">
                  <div className="col-span-6 text-left font-normal text-slate-400">
                    个人累计净寿险保单件数
                  </div>
                  <div className="col-span-2 text-center font-bold text-slate-800 font-mono">
                    1
                  </div>
                  <div className="col-span-2 text-center font-bold text-[#00A758] font-mono">
                    0
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="inline-block bg-[#D8F5E5] text-[#00A758] px-2 py-0.5 rounded text-[10px] font-bold">
                      达标
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-block 2: 晋升宏才Pro */}
            <div className="space-y-2 pt-1">
              <h3 className="text-[13px] font-bold text-slate-800 tracking-tight">
                晋升宏才Pro
              </h3>

              <div className="bg-[#F5F6F8] p-3.5 space-y-2.5">
                <div className="grid grid-cols-12 text-xs text-slate-400 font-normal">
                  <div className="col-span-6 text-left">名称</div>
                  <div className="col-span-2 text-center">实际</div>
                  <div className="col-span-2 text-center">目标</div>
                  <div className="col-span-2 text-center">达标</div>
                </div>

                <div className="grid grid-cols-12 text-xs items-center">
                  <div className="col-span-6 text-left font-normal text-slate-400">
                    个人累计FYC
                  </div>
                  <div className="col-span-2 text-center font-bold text-slate-800 font-mono">
                    58.4
                  </div>
                  <div className="col-span-2 text-center font-bold text-[#00A758] font-mono">
                    18,000
                  </div>
                  <div className="col-span-2 text-center">
                    {/* empty */}
                  </div>
                </div>

                <div className="grid grid-cols-12 text-xs items-center">
                  <div className="col-span-6 text-left font-normal text-slate-400">
                    个人累计净寿险保单件数
                  </div>
                  <div className="col-span-2 text-center font-bold text-slate-800 font-mono">
                    1
                  </div>
                  <div className="col-span-2 text-center font-bold text-[#00A758] font-mono">
                    12
                  </div>
                  <div className="col-span-2 text-center">
                    {/* empty */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: 当月加扣款合计 */}
        <div className="bg-white shadow-sm border border-slate-100/80">
          <div className="px-4 pt-3.5 pb-2.5">
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
              当月加扣款合计
            </h2>
          </div>
          {/* Full-width Divider */}
          <div className="w-full h-px bg-slate-200"></div>

          <div className="p-4 pt-3.5">
            <div className="text-center py-2">
              <p className="text-xs text-slate-400 font-normal mb-1">总金额</p>
              <p className="text-2xl font-black text-slate-900 font-mono">0</p>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="px-2 py-4 space-y-2">
          <div className="flex items-center gap-3 justify-center mb-3">
            <div className="w-12 h-px bg-slate-300"></div>
            <span className="text-xs text-slate-400 font-normal">免责声明</span>
            <div className="w-12 h-px bg-slate-300"></div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            1.以上数据更新至2025-10-28，均为当前跟踪数据，仅供参考；
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            2.最终宏才计划各项收入均以营销员每月的佣金奖金结算单为准；
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            3.所有奖金项的发放规则请遵照制度《中国区域MT2026宏才计划（全国版）》；
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            4.公司有最终解释权。
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialSubsidyModal;
