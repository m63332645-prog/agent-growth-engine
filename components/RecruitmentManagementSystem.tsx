import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  TrendingUp, Award, Medal, CheckCircle2, ChevronRight, ChevronUp, ChevronDown,
  Info, Target, Gem, Calendar, Trophy, Star, Users, User, AlertCircle,
  ShieldCheck, LayoutDashboard, ArrowRight, Sparkles, History, Clock, Diamond, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import TeamMembersDashboard from './TeamMembersDashboard';

// ==== 以下组件由参考项目 中宏招募管理系统/App.tsx 移植（招募管理弹窗及其依赖） ====

const RangeMonthPicker = ({ 
  startMonth, 
  endMonth, 
  onStartChange, 
  onEndChange,
  onChange 
}: {
  startMonth: string;
  endMonth: string;
  onStartChange?: (val: string) => void;
  onEndChange?: (val: string) => void;
  onChange: (start: string, end: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayYear, setDisplayYear] = useState<number>(() => {
    if (startMonth) return parseInt(startMonth.split('-')[0]);
    return new Date().getFullYear();
  });
  const [selectingStart, setSelectingStart] = useState(true);
  const [hoverMonth, setHoverMonth] = useState<string | null>(null);
  const [tempStart, setTempStart] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});

  const updatePopupPosition = useCallback(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const popupWidth = 320;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let left = rect.left;
      left = Math.max(8, Math.min(left, viewportWidth - popupWidth - 8));
      
      let top = rect.bottom + 4;
      const popupHeight = popupRef.current?.offsetHeight || 280;
      
      if (top + popupHeight > viewportHeight - 8) {
        top = rect.top - popupHeight - 4;
        top = Math.max(8, top);
      }
      
      setPopupStyle({
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 99999,
        width: `${popupWidth}px`,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        if (popupRef.current && popupRef.current.contains(target)) {
          return;
        }
        setIsOpen(false);
        resetSelection();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    updatePopupPosition();
  }, [isOpen, updatePopupPosition]);

  useEffect(() => {
    const handleResize = () => updatePopupPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updatePopupPosition]);

  const resetSelection = () => {
    setSelectingStart(true);
    setTempStart(null);
    setHoverMonth(null);
  };

  const openPicker = (startOrEnd: 'start' | 'end') => {
    if (isOpen) {
      // 日历已打开时，切换选择模式而不是关闭
      if (startOrEnd === 'start') {
        setSelectingStart(true);
        setTempStart(null);
        setHoverMonth(null);
        if (startMonth) {
          setDisplayYear(parseInt(startMonth.split('-')[0]));
        }
      } else {
        setSelectingStart(false);
        setTempStart(startMonth);
        setHoverMonth(null);
        if (endMonth) {
          setDisplayYear(parseInt(endMonth.split('-')[0]));
        }
      }
    } else {
      setIsOpen(true);
      resetSelection();
      if (startOrEnd === 'start' && startMonth) {
        setDisplayYear(parseInt(startMonth.split('-')[0]));
      } else if (startOrEnd === 'end' && endMonth) {
        setDisplayYear(parseInt(endMonth.split('-')[0]));
        setSelectingStart(false);
        setTempStart(startMonth);
      } else if (startMonth) {
        setDisplayYear(parseInt(startMonth.split('-')[0]));
      }
    }
  };

  const handleYearChange = (delta: number) => {
    setDisplayYear(prev => prev + delta);
  };

  const formatMonth = (year: number, month: number) => `${year}-${String(month).padStart(2, '0')}`;
  const parseMonth = (str: string) => {
    if (!str) return { year: 0, month: 0 };
    const [y, m] = str.split('-').map(Number);
    return { year: y, month: m };
  };

  const isMonthInRange = (year: number, month: number) => {
    if (!startMonth || !endMonth) return false;
    const start = parseMonth(startMonth);
    const end = parseMonth(endMonth);
    const cur = year * 12 + month;
    const s = start.year * 12 + start.month;
    const e = end.year * 12 + end.month;
    return cur >= s && cur <= e;
  };

  const isMonthTempInRange = (year: number, month: number) => {
    if (!tempStart || !hoverMonth) return false;
    const start = parseMonth(tempStart);
    const end = parseMonth(hoverMonth);
    const cur = year * 12 + month;
    const s = start.year * 12 + start.month;
    const e = end.year * 12 + end.month;
    const min = Math.min(s, e);
    const max = Math.max(s, e);
    return cur >= min && cur <= max && cur !== min && cur !== max;
  };

  const handleMonthClick = (year: number, month: number) => {
    const selected = formatMonth(year, month);
    
    if (selectingStart) {
      setTempStart(selected);
      setSelectingStart(false);
    } else {
      if (tempStart) {
        // 确保起始月份不晚于结束月份
        let s = tempStart;
        let e = selected;
        if (s > e) {
          [s, e] = [e, s];
        }
        onChange(s, e);
        if (onStartChange) onStartChange(s);
        if (onEndChange) onEndChange(e);
        setIsOpen(false);
        resetSelection();
      }
    }
  };

  const handleMonthHover = (year: number, month: number) => {
    if (!selectingStart && tempStart) {
      setHoverMonth(formatMonth(year, month));
    }
  };

  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const startLabel = startMonth ? `${parseMonth(startMonth).year}年${String(parseMonth(startMonth).month).padStart(2, '0')}月` : '开始月份';
  const endLabel = endMonth ? `${parseMonth(endMonth).year}年${String(parseMonth(endMonth).month).padStart(2, '0')}月` : '结束月份';

  // 计算预览范围
  const getPreviewRange = () => {
    if (!tempStart || !hoverMonth) return null;
    const s = parseMonth(tempStart);
    const e = parseMonth(hoverMonth);
    const min = s.year * 12 + s.month <= e.year * 12 + e.month ? tempStart : hoverMonth;
    const max = s.year * 12 + s.month <= e.year * 12 + e.month ? hoverMonth : tempStart;
    return { min, max };
  };

  const previewRange = getPreviewRange();
  const isInPreviewRange = (year: number, month: number) => {
    if (!previewRange) return false;
    const min = parseMonth(previewRange.min);
    const max = parseMonth(previewRange.max);
    const cur = year * 12 + month;
    const minVal = min.year * 12 + min.month;
    const maxVal = max.year * 12 + max.month;
    return cur >= minVal && cur <= maxVal;
  };

  const isPreviewStart = (year: number, month: number) => {
    if (!previewRange) return false;
    const min = parseMonth(previewRange.min);
    return year === min.year && month === min.month;
  };

  const isPreviewEnd = (year: number, month: number) => {
    if (!previewRange) return false;
    const max = parseMonth(previewRange.max);
    return year === max.year && month === max.month;
  };

  const isTempStart = (year: number, month: number) => {
    if (!tempStart) return false;
    const s = parseMonth(tempStart);
    return year === s.year && month === s.month;
  };

  return (
    <div ref={containerRef} className="relative flex items-center gap-1">
      {/* 开始月份按钮 */}
      <button
        onClick={() => openPicker('start')}
        className={`w-[110px] bg-white border rounded-lg py-1.5 px-3 text-xs font-bold text-slate-700 outline-none transition-colors flex items-center justify-between shadow-sm ${
          isOpen && selectingStart ? 'border-[#00A758] ring-1 ring-[#00A758]/30' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <span className="text-[11px] truncate">{startLabel}</span>
        <i className="fa-regular fa-calendar-days text-[#00A758] text-xs ml-1 shrink-0"></i>
      </button>
      
      <span className="text-[10px] text-slate-400 font-bold shrink-0">至</span>
      
      {/* 结束月份按钮 */}
      <button
        onClick={() => openPicker('end')}
        className={`w-[110px] bg-white border rounded-lg py-1.5 px-3 text-xs font-bold text-slate-700 outline-none transition-colors flex items-center justify-between shadow-sm ${
          isOpen && !selectingStart ? 'border-[#00A758] ring-1 ring-[#00A758]/30' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <span className="text-[11px] truncate">{endLabel}</span>
        <i className="fa-regular fa-calendar-days text-[#00A758] text-xs ml-1 shrink-0"></i>
      </button>
      
      {isOpen && createPortal(
        <div 
          ref={popupRef} 
          style={popupStyle} 
          className="bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
        >
          {/* 年份导航 */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-100">
            <button
              onClick={() => handleYearChange(-1)}
              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-200 transition-colors"
            >
              <i className="fa-solid fa-chevron-left text-slate-500 text-xs"></i>
            </button>
            <span className="text-sm font-black text-slate-800">{displayYear}年</span>
            <button
              onClick={() => handleYearChange(1)}
              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-200 transition-colors"
            >
              <i className="fa-solid fa-chevron-right text-slate-500 text-xs"></i>
            </button>
          </div>
          
          {/* 月份网格 */}
          <div className="grid grid-cols-4 gap-2 p-3">
            {months.map((m, idx) => {
              const monthNum = idx + 1;
              const currentMonthStr = formatMonth(displayYear, monthNum);
              
              // 计算状态
              const isSelectedStart = startMonth === currentMonthStr;
              const isSelectedEnd = endMonth === currentMonthStr;
              const isInSelectedRange = isMonthInRange(displayYear, monthNum);
              
              const isPreviewStartMonth = isPreviewStart(displayYear, monthNum);
              const isPreviewEndMonth = isPreviewEnd(displayYear, monthNum);
              const isInPreviewRangeMonth = isInPreviewRange(displayYear, monthNum);
              
              const isTempStartMonth = isTempStart(displayYear, monthNum);
              
              let bgClass = 'border-slate-200 bg-white hover:border-slate-300';
              let textClass = 'text-slate-700';
              
              // 已选中的范围
              if (isSelectedStart || isSelectedEnd) {
                bgClass = 'border-[#00A758] bg-[#00A758]';
                textClass = 'text-white';
              } else if (isInSelectedRange) {
                bgClass = 'border-[#00A758]/30 bg-[#00A758]/10';
                textClass = 'text-[#00A758]';
              }
              
              // 预览范围（连选过程中）
              if (isPreviewStartMonth || isPreviewEndMonth) {
                bgClass = 'border-blue-500 bg-blue-500';
                textClass = 'text-white';
              } else if (isInPreviewRangeMonth && !isSelectedStart && !isSelectedEnd) {
                bgClass = 'border-blue-300 bg-blue-100';
                textClass = 'text-blue-700';
              }
              
              // 临时开始月份
              if (isTempStartMonth) {
                bgClass = 'border-blue-500 bg-blue-500';
                textClass = 'text-white';
              }
              
              return (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMonthClick(displayYear, monthNum);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseEnter={() => handleMonthHover(displayYear, monthNum)}
                  className={`flex flex-col items-center justify-center py-2 rounded-lg border-2 transition-all cursor-pointer ${bgClass}`}
                >
                  <span className={`text-xs font-bold ${textClass}`}>{m}</span>
                </button>
              );
            })}
          </div>
          
        </div>
      , document.body)}
    </div>
  );
};


interface MetricBadgeProps {
  label: string;
  value: number;
}

const MemberMetricBadges: React.FC<{
  keyId: string;
  isActivityDashboard: boolean;
  metrics: MetricBadgeProps[];
}> = ({ keyId, isActivityDashboard, metrics }) => {
  return (
    <motion.div
      key={`${isActivityDashboard ? 'act' : 'fun'}-${keyId}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-wrap gap-1 mt-1.5"
    >
      {metrics.map((m) => {
        const val = m.value;
        if (!isActivityDashboard) {
          // Neutral plain styling for Efficiency Dashboard (效能看板)
          return (
            <span
              key={m.label}
              className="inline-flex items-center gap-0.5 text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-100/50"
            >
              {m.label} <b className="font-extrabold font-mono text-slate-800">{val}</b>
            </span>
          );
        }

        // Color mapped styling for Activity Dashboard (活动量看板)
        let bgStyle = 'bg-slate-50/50 text-slate-400 border border-slate-100/30';
        let valStyle = 'text-slate-400';

        if (val > 0) {
          switch (m.label) {
            case '建档':
              bgStyle = 'bg-blue-50 text-blue-600 border border-blue-100/50';
              valStyle = 'text-blue-800';
              break;
            case 'POP':
              bgStyle = 'bg-amber-50 text-amber-600 border border-amber-100/50';
              valStyle = 'text-amber-800';
              break;
            case '初面':
              bgStyle = 'bg-purple-50 text-purple-600 border border-purple-100/50';
              valStyle = 'text-purple-800';
              break;
            case '深面':
              bgStyle = 'bg-pink-50 text-pink-600 border border-pink-100/50';
              valStyle = 'text-pink-800';
              break;
            case '决面':
              bgStyle = 'bg-rose-50 text-rose-600 border border-rose-100/50';
              valStyle = 'text-rose-800';
              break;
            case 'COP':
              bgStyle = 'bg-indigo-50 text-indigo-600 border border-indigo-100/50';
              valStyle = 'text-indigo-800';
              break;
            case 'ITC':
              bgStyle = 'bg-yellow-50 text-yellow-600 border border-yellow-101/50';
              valStyle = 'text-yellow-800';
              break;
            case '入司':
              bgStyle = 'bg-emerald-50 text-[#00A758] border border-emerald-100/50';
              valStyle = 'text-[#00A758]';
              break;
            default:
              bgStyle = 'bg-slate-50 text-slate-600 border border-slate-100/50';
              valStyle = 'text-slate-800';
          }
        } else {
          // Zero values styling
          switch (m.label) {
            case '建档':
              bgStyle = 'bg-blue-50/50 text-blue-400 border border-blue-100/30';
              valStyle = 'text-blue-400';
              break;
            case 'POP':
              bgStyle = 'bg-amber-50/50 text-amber-400 border border-amber-100/30';
              valStyle = 'text-amber-400';
              break;
            case '初面':
              bgStyle = 'bg-purple-50/50 text-purple-400 border border-purple-100/30';
              valStyle = 'text-purple-400';
              break;
            case '深面':
              bgStyle = 'bg-pink-50/50 text-pink-400 border border-pink-100/30';
              valStyle = 'text-pink-400';
              break;
            case '决面':
              bgStyle = 'bg-rose-50/50 text-rose-400 border border-rose-100/30';
              valStyle = 'text-rose-400';
              break;
            case 'COP':
              bgStyle = 'bg-indigo-50/50 text-indigo-400 border border-indigo-100/30';
              valStyle = 'text-indigo-400';
              break;
            case 'ITC':
              bgStyle = 'bg-yellow-50/50 text-yellow-400 border border-yellow-101/30';
              valStyle = 'text-yellow-400';
              break;
            case '入司':
              bgStyle = 'bg-emerald-50/50 text-emerald-400 border border-emerald-100/30';
              valStyle = 'text-emerald-400';
              break;
          }
        }

        return (
          <span
            key={m.label}
            className={`inline-flex items-center gap-0.5 text-[9.5px] font-bold px-1.5 py-0.5 rounded ${bgStyle}`}
          >
            {m.label} <b className={`font-extrabold font-mono ${valStyle}`}>{val}</b>
          </span>
        );
      })}
    </motion.div>
  );
};


const HelpModal: React.FC<{ isOpen: boolean | 'conversion' | 'entry' | 'activity'; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  const isConversion = isOpen === 'conversion';
  const isEntry = isOpen === 'entry';
  const isActivity = isOpen === 'activity';
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[10000] bg-black/30 flex items-center justify-center p-4"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div className="flex justify-between items-center p-4 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-800">说明</h3>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
          <div className="p-4 space-y-3">
            {isConversion ? (
              <>
                <div className="text-xs text-slate-600">
                  <span className="font-bold">1. 完成量：</span>上一环节里完成当前节点的人数
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-bold">2. 转化率：</span>当前环节/上一环节*100%
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-bold">3. 平均耗时：</span>完成当前环节的人的耗时之和/完成当前环节的人
                </div>
                <div className="border-t border-slate-100 pt-3 mt-3">
                  <span className="text-[10px] text-slate-400 font-bold">以建档→POP为例，完成量：90/100；转化率90/100*100%=90%</span>
                </div>
              </>
            ) : isEntry ? (
              <>
                <div className="text-xs text-slate-600">
                  <span className="font-bold">1. 完成量：</span>分子：所选时间范围内建档的人数中入司的人数；分母：所选时间范围内建档的人数中完成该环节的人数
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-bold">2. 转化率：</span>入司人数/当前环节*100%
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-bold">3. 平均耗时：</span>完成当前环节的耗时之和/完成人数
                </div>
                <div className="border-t border-slate-100 pt-3 mt-3">
                  <span className="text-[10px] text-slate-400 font-bold">以建档→入司为例，完成量：15/100；转化率15/100*100%=15%</span>
                </div>
              </>
            ) : isActivity ? (
              <>
                <div className="text-xs text-slate-600">
                  <span className="font-bold">1.招募目标：</span>个人设定
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-bold">2.目标：</span>根据手动设定的招募目标和分公司上一年的转化率，倒算出来的各环节目标
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-bold">3.实际：</span>所选时间范围内的活动量
                </div>
                <div className="border-t border-slate-100 pt-3 mt-3">
                  <span className="text-[10px] text-slate-400 font-bold">备注：各环节之间没有对应关系</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-xs text-slate-600">
                  <span className="font-bold">1. 招募目标：</span>个人设定
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-bold">2. 目标：</span>根据手动设定的招募目标和公司上一年的转化率，倒算出来的各环节目标
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-bold">3. 实际：</span>所选时间范围内的活动量
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-bold">4. 达成率：</span>实际/目标*100%
                </div>
                <div className="border-t border-slate-100 pt-3 mt-3">
                  <span className="text-[10px] text-slate-400 font-bold">备注：各环节之间没有对应关系</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


const FullScreenModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  bgClass?: string;
  hideHeader?: boolean;
}> = ({ isOpen, onClose, title, children, headerRight, bgClass = "bg-white", hideHeader = false }) => {
  if (!isOpen) return null;
  return (
    <div className={`fixed inset-0 z-[1000] ${bgClass} flex flex-col animate-slide-up`}>
      {!hideHeader && (
        <div className="bg-white border-b border-slate-100 flex items-center justify-between px-4 py-4 pt-8">
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 active:scale-95 transition">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <h3 className="text-base font-black text-slate-800 tracking-tight">{title}</h3>
          <div className="w-10 flex justify-end items-center">
            {headerRight}
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};


export const RecruitmentManagementModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'individual' | 'team';
  onOpenActivityBoard?: () => void;
}> = ({ isOpen, onClose, initialTab, onOpenActivityBoard }) => {
  const [activeTab, setActiveTab] = useState<'individual' | 'team'>('individual');

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);
  
  // Helper: Get current month as YYYY-MM
  const getCurrentMonthStr = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  // Helper: Get month offset by N months from a reference date
  const getMonthOffset = (offset: number, refDate?: Date) => {
    const base = refDate || new Date();
    const d = new Date(base.getFullYear(), base.getMonth() + offset, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  // Helper: Get the start month for a given shortcut（基于自然季度/半年/年首日）
  const getShortcutStartMonth = (shortcut: string) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 1-12
    switch (shortcut) {
      case 'this_month':
        return `${year}-${String(month).padStart(2, '0')}`;
      case 'this_quarter': {
        // 自然季度首月：Q1=1, Q2=4, Q3=7, Q4=10
        const quarterStart = Math.floor((month - 1) / 3) * 3 + 1;
        return `${year}-${String(quarterStart).padStart(2, '0')}`;
      }
      case 'half_year': {
        // 本半年首月：上半年=1，下半年=7
        const halfStart = month >= 7 ? 7 : 1;
        return `${year}-${String(halfStart).padStart(2, '0')}`;
      }
      case 'one_year':
        // 本年首月：1月
        return `${year}-01`;
      default:
        return `${year}-${String(month).padStart(2, '0')}`;
    }
  };

  const currentMonthStr = getCurrentMonthStr();

  // Team View Filters
  const [activeScope, setActiveScope] = useState<'直辖组' | '营业区' | '所辖'>('直辖组');
  const [timeShortcut, setTimeShortcut] = useState<'this_month' | 'this_quarter' | 'half_year' | 'one_year' | 'custom'>('this_month');
  // 个人视图独立的时间周期快捷选择状态（与团队管理不联动）
  const [personalTimeShortcut, setPersonalTimeShortcut] = useState<'this_month' | 'this_quarter' | 'half_year' | 'one_year' | 'custom'>('this_month');
  // 团队管理的日期状态
  const [startMonth, setStartMonth] = useState<string>(getMonthOffset(0));
  const [endMonth, setEndMonth] = useState<string>(getMonthOffset(0));
  // 个人视图的独立日期状态
  const [personalStartMonth, setPersonalStartMonth] = useState<string>(getMonthOffset(0));
  const [personalEndMonth, setPersonalEndMonth] = useState<string>(getMonthOffset(0));
  const [isFiltersExpanded, setIsFiltersExpanded] = useState<boolean>(true);
  const [activeMetricDashboard, setActiveMetricDashboard] = useState<'效能看板' | '活动量看板' | '招募进行时'>('活动量看板');
  const [expandedManagers, setExpandedManagers] = useState<Record<string, boolean>>({});
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean | 'conversion' | 'entry' | 'activity'>(false);
  // 看板级别的展开/收起状态（查看更多页面）
  const [isActivityBoardExpanded, setIsActivityBoardExpanded] = useState(true);
  const [isEfficiencyBoardExpanded, setIsEfficiencyBoardExpanded] = useState(true);
  const [isRecruitmentBoardExpanded, setIsRecruitmentBoardExpanded] = useState(true);
  const [isTeamEntryExpanded, setIsTeamEntryExpanded] = useState(true);
  // 个人视图入司转化率展开/收起状态
  const [isPersonalEntryExpanded, setIsPersonalEntryExpanded] = useState(true);
  const [isRecruitmentStatusExpanded, setIsRecruitmentStatusExpanded] = useState(true);
  const [isPopAssessmentExpanded, setIsPopAssessmentExpanded] = useState(true);
  const [isCopInviteExpanded, setIsCopInviteExpanded] = useState(true);
  // 连选触发器：选择开始月份后自动打开结束月份选择器
  const [endPickerTrigger, setEndPickerTrigger] = useState(0);
  // 团队人员看板搜索关键词
  const [teamSearchKeyword, setTeamSearchKeyword] = useState('');
  // 团队人员看板搜索匹配函数
  const teamMatchesSearch = (name: string) => {
    if (!teamSearchKeyword.trim()) return true;
    return name.toLowerCase().includes(teamSearchKeyword.trim().toLowerCase());
  };

  // Individual target settings
  const [individualTarget, setIndividualTarget] = useState(85);
  const [individualActual, setIndividualActual] = useState(11);
  const [isIndividualTargetSet, setIsIndividualTargetSet] = useState(false);

  // Team target settings
  const [teamMonthlyTargets, setTeamMonthlyTargets] = useState<Record<'直辖组' | '营业区' | '所辖', Record<string, number>>>({
    '直辖组': { '2026-06': 15 },
    '营业区': { '2026-06': 50 },
    '所辖': { '2026-06': 150 },
  });
  // 个人视图独立的月度目标存储（与团队管理不联动）
  const [individualMonthlyTargets, setIndividualMonthlyTargets] = useState<Record<'直辖组' | '营业区' | '所辖', Record<string, number>>>({
    '直辖组': {},
    '营业区': {},
    '所辖': {},
  });
  // 临时隐藏的月目标（点删除仅本次隐藏，不写回存储；刷新后重置恢复显示）
  const [hiddenDeletedMonths, setHiddenDeletedMonths] = useState<Record<'直辖组' | '营业区' | '所辖', Record<string, boolean>>>({
    '直辖组': {},
    '营业区': {},
    '所辖': {},
  });
  const [selectedCalendarMonth, setSelectedCalendarMonth] = useState<string>('2026-06');
  const [calendarYear, setCalendarYear] = useState<number>(2026);
  const [efficiencyCompareTarget, setEfficiencyCompareTarget] = useState<'分公司' | '全公司'>('分公司');

  const personalCompareData = {
    '分公司': {
      step1: 85.0,
      step2: 74.0,
      step3: 24.0,
      step4: 89.0,
      step5: 65.0,
      step6: 91.0,
      overall: 11.0
    },
    '全公司': {
      step1: 75.0,
      step2: 70.2,
      step3: 60.5,
      step4: 55.0,
      step5: 52.0,
      step6: 38.2,
      overall: 7.2
    }
  };
  const [isSettingTarget, setIsSettingTarget] = useState<boolean>(false);
  // 团队管理设定目标面板的展开状态（与个人视图独立，切换 tab 不联动）
  const [isTeamSettingTarget, setIsTeamSettingTarget] = useState<boolean>(false);
  const [editingScope, setEditingScope] = useState<'直辖组' | '营业区' | '所辖'>('直辖组');
  const [editingTargetNum, setEditingTargetNum] = useState<string>('');
  const [editingTargetStart, setEditingTargetStart] = useState<string>('2026-01');
  const [editingTargetEnd, setEditingTargetEnd] = useState<string>('2026-12');
  const [showActivityDetail, setShowActivityDetail] = useState<boolean>(false);

  const FULL_YEAR_2026_MONTHS = [
    { value: '2026-01', label: '2026年01月' },
    { value: '2026-02', label: '2026年02月' },
    { value: '2026-03', label: '2026年03月' },
    { value: '2026-04', label: '2026年04月' },
    { value: '2026-05', label: '2026年05月' },
    { value: '2026-06', label: '2026年06月' },
    { value: '2026-07', label: '2026年07月' },
    { value: '2026-08', label: '2026年08月' },
    { value: '2026-09', label: '2026年09月' },
    { value: '2026-10', label: '2026年10月' },
    { value: '2026-11', label: '2026年11月' },
    { value: '2026-12', label: '2026年12月' },
  ];

  const MONTH_OPTIONS = (() => {
    const options: { value: string; label: string }[] = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    for (let year = currentYear; year >= currentYear - 1; year--) {
      const startMonth = year === currentYear ? currentMonth : 12;
      for (let month = startMonth; month >= 1; month--) {
        options.push({
          value: `${year}-${String(month).padStart(2, '0')}`,
          label: `${year}年${String(month).padStart(2, '0')}月`
        });
      }
    }
    return options;
  })();

  const getMonthDifference = (start: string, end: string) => {
    const [startY, startM] = start.split('-').map(Number);
    const [endY, endM] = end.split('-').map(Number);
    return (endY - startY) * 12 + (endM - startM) + 1;
  };

  const getMonthDiffAndValues = () => {
    const diff = getMonthDifference(startMonth, endMonth);
    if (diff <= 0) {
      const actualDiff = getMonthDifference(endMonth, startMonth);
      return {
        start: endMonth,
        end: startMonth,
        count: actualDiff,
        isReversed: true
      };
    }
    return {
      start: startMonth,
      end: endMonth,
      count: diff,
      isReversed: false
    };
  };

  const { start: actualStart, end: actualEnd, count: monthCount } = getMonthDiffAndValues();

  const updateStartMonth = (val: string) => {
    setStartMonth(val);
    const newStart = val;
    const curMonth = getMonthOffset(0);
    // 使用基于自然季度/半年/年首日的新定义进行快捷周期识别
    const qStart = getShortcutStartMonth('this_quarter');
    const hStart = getShortcutStartMonth('half_year');
    const yStart = getShortcutStartMonth('one_year');
    if (newStart === curMonth && endMonth === curMonth) {
      setTimeShortcut('this_month');
    } else if (newStart === qStart && endMonth === curMonth) {
      setTimeShortcut('this_quarter');
    } else if (newStart === hStart && endMonth === curMonth) {
      setTimeShortcut('half_year');
    } else if (newStart === yStart && endMonth === curMonth) {
      setTimeShortcut('one_year');
    } else {
      setTimeShortcut('custom');
    }
  };

  // 连选：选择开始月份后触发结束月份选择器自动打开
  const triggerEndPicker = () => {
    setEndPickerTrigger(prev => prev + 1);
  };

  const updateEndMonth = (val: string) => {
    setEndMonth(val);
    const newEnd = val;
    const curMonth = getMonthOffset(0);
    // 使用基于自然季度/半年/年首日的新定义进行快捷周期识别
    const qStart = getShortcutStartMonth('this_quarter');
    const hStart = getShortcutStartMonth('half_year');
    const yStart = getShortcutStartMonth('one_year');
    if (startMonth === curMonth && newEnd === curMonth) {
      setTimeShortcut('this_month');
    } else if (startMonth === qStart && newEnd === curMonth) {
      setTimeShortcut('this_quarter');
    } else if (startMonth === hStart && newEnd === curMonth) {
      setTimeShortcut('half_year');
    } else if (startMonth === yStart && newEnd === curMonth) {
      setTimeShortcut('one_year');
    } else {
      setTimeShortcut('custom');
    }
  };

  // 个人视图独立的日期更新函数
  const updatePersonalStartMonth = (val: string) => {
    setPersonalStartMonth(val);
  };
  const updatePersonalEndMonth = (val: string) => {
    setPersonalEndMonth(val);
  };

  // 个人视图：根据快捷周期设置日期范围
  const handlePersonalShortcutClick = (shortcutId: string) => {
    setPersonalTimeShortcut(shortcutId as any);
    if (shortcutId !== 'custom') {
      const curMonth = getMonthOffset(0);
      const newStart = getShortcutStartMonth(shortcutId);
      setPersonalStartMonth(newStart);
      setPersonalEndMonth(curMonth);
    } else {
      // 点击自定义时，默认带出系统当前月份（起止均为当前月）；已是自定义则保持用户已选
      const prevShortcut = personalTimeShortcut;
      if (prevShortcut === 'custom') {
        // 已经是自定义，保持不变
      } else {
        const curMonth = getMonthOffset(0);
        setPersonalStartMonth(curMonth);
        setPersonalEndMonth(curMonth);
      }
    }
  };

  const handleShortcutClick = (shortcutId: 'this_month' | 'this_quarter' | 'half_year' | 'one_year') => {
    setTimeShortcut(shortcutId);
    // 所有快捷周期的 endMonth 均为当前月（系统当日所在月）
    const curMonth = getMonthOffset(0);
    // startMonth 使用基于自然季度/半年/年首日的新定义
    const newStart = getShortcutStartMonth(shortcutId);
    setStartMonth(newStart);
    setEndMonth(curMonth);
  };

  const filterCardRef = React.useRef<HTMLDivElement>(null);
  const filterInnerCardRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isFiltersExpanded && filterCardRef.current && !filterCardRef.current.contains(event.target as Node)) {
        setIsFiltersExpanded(false);
      }
    }
    if (isFiltersExpanded && isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFiltersExpanded, isOpen]);

  const toggleManager = (managerName: string) => {
    setExpandedManagers(prev => ({
      ...prev,
      [managerName]: !prev[managerName]
    }));
  };

  // Helper to get array of YYYY-MM strings in a range
  const getMonthsInRange = (start: string, end: string) => {
    const list: string[] = [];
    const [startY, startM] = start.split('-').map(Number);
    const [endY, endM] = end.split('-').map(Number);
    
    let currY = startY;
    let currM = startM;
    
    while (currY < endY || (currY === endY && currM <= endM)) {
      list.push(`${currY}-${currM.toString().padStart(2, '0')}`);
      currM++;
      if (currM > 12) {
        currM = 1;
        currY++;
      }
    }
    return list;
  };

  const currentFilteredMonths = getMonthsInRange(actualStart, actualEnd);

  // Check which months in range have target
  const setMonthsInRange = currentFilteredMonths.filter(m => teamMonthlyTargets[activeScope]?.[m] !== undefined);
  const isTargetSet = setMonthsInRange.length > 0;

  // Typical target fallback for one month
  const getDefaultMonthlyTarget = (scope: '直辖组' | '营业区' | '所辖') => {
    const scopeMult = scope === '直辖组' ? 1 : scope === '营业区' ? 3.5 : 10.2;
    return Math.round(15 * scopeMult);
  };

  // Total targets in the current filtered range:
  const targetNum = currentFilteredMonths.reduce((sum, m) => {
    const val = teamMonthlyTargets[activeScope]?.[m];
    return sum + (val !== undefined ? val : getDefaultMonthlyTarget(activeScope));
  }, 0);

  // Explicit targets only (no fallback) for display
  const explicitTargetNum = currentFilteredMonths.reduce((sum, m) => {
    const val = teamMonthlyTargets[activeScope]?.[m];
    return sum + (val !== undefined ? val : 0);
  }, 0);

  // Multipliers for dynamic feedback
  const scopeMult = activeScope === '直辖组' ? 1 : activeScope === '营业区' ? 3.5 : 10.2;
  const timeMult = monthCount * 1.0;
  const actualNum = Math.round(11 * scopeMult * timeMult);
  const targetPeriodActualNum = actualNum;

  // Individual view (查看更多) time multiplier based on selected date range
  const individualMonthCount = getMonthsInRange(startMonth, endMonth).length;
  const individualTimeMult = individualMonthCount * 1.0;

  // 活动量看板漏斗目标比例（以入司=1为基准，北京分公司口径）：
  // 建档 1:9.3、POP 1:7.9、深面 1:1.9、决面 1:1.7、ITC 1:1.1；COP 无比例，保持原型固定值
  const funnelRatio = { 建档: 9.3, POP: 7.9, 深面: 1.9, 决面: 1.7, ITC: 1.1 } as const;

  // 序时进度: 当前时间 / 总周期（按天计算，个人视图筛选周期 personalStartMonth 第一天 至 personalEndMonth 最后一天）
  // 例：周期 2026-08（8月共31天），当前系统日 8.7 号 → 已过 7 天 → 7/31 ≈ 23%
  const individualTimeProgress = (() => {
    const [sy, sm] = personalStartMonth.split('-').map(Number);
    const [ey, em] = personalEndMonth.split('-').map(Number);
    // 周期起点：起始月第一天 00:00；周期终点：结束月最后一天
    const periodStart = new Date(sy, sm - 1, 1);
    const periodEndDay = new Date(ey, em, 0).getDate(); // 结束月的天数
    const periodEnd = new Date(ey, em - 1, periodEndDay);
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    // 总天数（含首尾两端）
    const totalDays = Math.round((periodEnd.getTime() - periodStart.getTime()) / MS_PER_DAY) + 1;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // 已过天数（把“今天”计入）：8/1 到 8/7 => 7 天
    const elapsedDays = Math.round((today.getTime() - periodStart.getTime()) / MS_PER_DAY) + 1;
    if (totalDays <= 0) return 0;
    return Math.max(0, Math.min(1, elapsedDays / totalDays));
  })();

  // Comparison rate based on target period actuals
  const rateNum = targetNum > 0 ? Math.round((targetPeriodActualNum / targetNum) * 100) : 0;
  const remainingNum = Math.max(0, targetNum - targetPeriodActualNum);

  // 序时进度: 当前时间 / 总周期（按天计算，团队管理筛选周期 actualStart 第一天 至 actualEnd 最后一天）
  // 例：周期 2026-08（8月共31天），当前系统日 8.7 号 → 已过 7 天 → 7/31 ≈ 23%
  const teamTimeProgress = (() => {
    const [sy, sm] = actualStart.split('-').map(Number);
    const [ey, em] = actualEnd.split('-').map(Number);
    const periodStart = new Date(sy, sm - 1, 1);
    const periodEndDay = new Date(ey, em, 0).getDate();
    const periodEnd = new Date(ey, em - 1, periodEndDay);
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const totalDays = Math.round((periodEnd.getTime() - periodStart.getTime()) / MS_PER_DAY) + 1;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const elapsedDays = Math.round((today.getTime() - periodStart.getTime()) / MS_PER_DAY) + 1;
    if (totalDays <= 0) return 0;
    return Math.max(0, Math.min(1, elapsedDays / totalDays));
  })();

  // Synthetic targetConfig for rendering backward compatibility
  const targetConfig = isTargetSet ? {
    targetVal: targetNum,
    cycleName: setMonthsInRange.length === 12 ? '全年' : `${setMonthsInRange.length}个月`,
    months: currentFilteredMonths.length,
    startMonth: actualStart,
    endMonth: actualEnd,
  } : null;

  if (!isOpen) return null;

  // Dynamic status evaluation
  // 达成进度 >= 序时进度(当前时间/总周期) → 进度正常；否则 → 进度落后
  const getStatusLabel = (rate: number, isSet: boolean) => {
    if (!isSet) {
      return { text: '目标未设定', bg: 'bg-slate-100 text-slate-500 border-slate-200/60' };
    }
    const timeProgressPct = teamTimeProgress * 100;
    if (rate >= timeProgressPct) {
      return { text: '进度正常', bg: 'bg-blue-50 text-blue-600 border-blue-100' };
    }
    return { text: '进度落后', bg: 'bg-orange-50 text-orange-500 border-orange-100' };
  };

  const statusEval = getStatusLabel(rateNum, isTargetSet);

  return (
    <FullScreenModal isOpen={isOpen} onClose={onClose} title="" bgClass="bg-[#f7f9fc]" hideHeader={true}>
      <div className="flex-1 flex flex-col font-sans h-full min-h-screen">
        {/* Header Section */}
        <div className="bg-[#00A758] pt-4 pb-4 px-6 relative rounded-t-3xl shrink-0 shadow-sm">
          {/* Header row with back icon */}
          <div className="relative flex justify-center items-center mb-4 mt-2">
            <button 
              onClick={() => {
                if (showActivityDetail) {
                  // 从查看更多页面进入（含经团队管理tab切换），返回个人视图首页
                  setShowActivityDetail(false);
                  setActiveTab('individual');
                } else {
                  // 个人视图首页或团队管理首页，返回宏掌门首页
                  onClose();
                }
              }} 
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-95 transition absolute left-0"
              id="recruitment-back-btn"
            >
              <i className="fa-solid fa-chevron-left text-sm"></i>
            </button>
            <h4 className="text-white text-base font-black tracking-wide">
              中宏招募管理系统
            </h4>
          </div>

          {/* Centered Pill Slider - 查看更多页面也显示 tab 切换 */}
          <div className="flex justify-center">
            <div className="flex bg-[#008b47] p-0.5 rounded-full w-52 relative shadow-inner" id="recruitment-type-switcher">
              <button 
                onClick={() => {
                  // 切回个人视图时，查看更多页面不做缓存：时间周期重置为默认"本月"
                  if (showActivityDetail) {
                    setPersonalTimeShortcut('this_month');
                    setPersonalStartMonth(getMonthOffset(0));
                    setPersonalEndMonth(getMonthOffset(0));
                  }
                  setActiveTab('individual');
                }} 
                className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  activeTab === 'individual' 
                    ? 'bg-white text-[#00A758] shadow-sm' 
                    : 'text-white/80 hover:text-white'
                }`}
                id="recruitment-tab-individual"
              >
                个人视图
              </button>
              <button 
                onClick={() => {
                  // 点击团队管理 tab 时切换，保留查看更多状态用于返回导航
                  setActiveTab('team');
                }} 
                className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  activeTab === 'team' 
                    ? 'bg-white text-[#00A758] shadow-sm' 
                    : 'text-white/80 hover:text-white'
                }`}
                id="recruitment-tab-team"
              >
                团队管理
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Container with cards */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          
          {activeTab === 'individual' ? (
            <>
              {/* === 二级页面：活动量详情 === */}
              {showActivityDetail && (
                <div className="space-y-4">
                  {/* 汇总维度筛选 */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                      {[
                        { id: 'this_month', name: '本月' },
                        { id: 'this_quarter', name: '本季度' },
                        { id: 'half_year', name: '半年' },
                        { id: 'one_year', name: '年' },
                        { id: 'custom', name: '自定义' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handlePersonalShortcutClick(item.id)}
                          className={`px-4 py-1.5 text-xs rounded-xl font-bold transition-all shrink-0 ${
                            personalTimeShortcut === item.id
                              ? 'bg-[#00A758] text-white shadow-sm'
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                    {personalTimeShortcut === 'custom' && (
                      <div className="pt-2 border-t border-slate-100">
                        <RangeMonthPicker
                          startMonth={personalStartMonth}
                          endMonth={personalEndMonth}
                          onChange={(s, e) => {
                            updatePersonalStartMonth(s);
                            updatePersonalEndMonth(e);
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* 招募活动量（月）看板 - 团队样式 */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                      <h3 className="text-sm font-black text-slate-800 tracking-wide flex items-center gap-2">
                        <span className="w-1 bg-[#00A758] h-3.5 rounded-full inline-block"></span>
                        活动量看板
                        <button 
                          onClick={() => setIsHelpModalOpen('activity')}
                          className="text-slate-400 hover:text-slate-600 transition-colors ml-1"
                        >
                          <i className="fa-solid fa-circle-info text-[11px]"></i>
                        </button>
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[9.5px] font-black px-2 py-0.5 rounded shadow-xs border bg-green-50 text-[#00A758] border-green-100">
                          COP：{Math.round(38 * individualTimeMult)}人
                        </span>
                        <button
                          onClick={() => setIsActivityBoardExpanded(!isActivityBoardExpanded)}
                          className="text-[10px] font-bold text-[#00A758] flex items-center gap-0.5"
                        >
                          {isActivityBoardExpanded ? '收起' : '展开'}
                          <i className={`fa-solid fa-chevron-${isActivityBoardExpanded ? 'up' : 'down'} text-[8px]`}></i>
                        </button>
                      </div>
                    </div>

                    {isActivityBoardExpanded && (
                    <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4 flex flex-col gap-3 font-bold text-[11px] font-sans">
                      {/* 第一行：建档、POP、深面 */}
                      <div className="flex items-center justify-between text-center">
                        <div className="flex-1 flex flex-col items-center justify-center gap-0.5 px-0.5 min-w-[50px]">
                          <span className="text-slate-500 font-bold text-[11px]">建档</span>
                          {isIndividualTargetSet && <span className="text-blue-500 font-bold text-[11px] bg-blue-50 px-1.5 py-0.5 rounded-full">
                            {Math.round(individualTarget * funnelRatio.建档)}人
                          </span>}
                          <span className="text-slate-800 font-black text-sm">{Math.round(120 * individualTimeMult)}人</span>
                          {isIndividualTargetSet && ((Math.round(individualTarget * funnelRatio.建档) - Math.round(120 * individualTimeMult)) > 0
                            ? <span className="text-rose-500 font-bold text-[9px]">
                              缺{Math.round(individualTarget * funnelRatio.建档) - Math.round(120 * individualTimeMult)}人
                            </span>
                            : <span className="font-bold text-[9px] invisible" aria-hidden="true">缺0人</span>)}
                        </div>
                        <span className="text-slate-300 font-light shrink-0">➔</span>
                        <div className="flex-1 flex flex-col items-center justify-center gap-0.5 px-0.5 min-w-[50px]">
                          <span className="text-slate-500 font-bold text-[11px]">POP</span>
                          {isIndividualTargetSet && <span className="text-blue-500 font-bold text-[11px] bg-blue-50 px-1.5 py-0.5 rounded-full">
                            {Math.round(individualTarget * funnelRatio.POP)}人
                          </span>}
                          <span className="text-slate-800 font-black text-sm">{Math.round(100 * individualTimeMult)}人</span>
                          {isIndividualTargetSet && ((Math.round(individualTarget * funnelRatio.POP) - Math.round(100 * individualTimeMult)) > 0
                            ? <span className="text-rose-500 font-bold text-[9px]">
                              缺{Math.round(individualTarget * funnelRatio.POP) - Math.round(100 * individualTimeMult)}人
                            </span>
                            : <span className="font-bold text-[9px] invisible" aria-hidden="true">缺0人</span>)}
                        </div>
                        <span className="text-slate-300 font-light shrink-0">➔</span>
                        <div className="flex-1 flex flex-col items-center justify-center gap-0.5 px-0.5 min-w-[50px]">
                          <span className="text-slate-500 font-bold text-[11px]">深面</span>
                          {isIndividualTargetSet && <span className="text-blue-500 font-bold text-[11px] bg-blue-50 px-1.5 py-0.5 rounded-full">
                            {Math.round(individualTarget * funnelRatio.深面)}人
                          </span>}
                          <span className="text-slate-800 font-black text-sm">{Math.round(58 * individualTimeMult)}人</span>
                          {isIndividualTargetSet && ((Math.round(individualTarget * funnelRatio.深面) - Math.round(58 * individualTimeMult)) > 0
                            ? <span className="text-rose-500 font-bold text-[9px]">
                              缺{Math.round(individualTarget * funnelRatio.深面) - Math.round(58 * individualTimeMult)}人
                            </span>
                            : <span className="font-bold text-[9px] invisible" aria-hidden="true">缺0人</span>)}
                        </div>
                      </div>

                      {/* 连接线 */}
                      <div className="flex items-center justify-between px-6 py-1">
                        <div className="flex-1 h-[1px] bg-slate-100"></div>
                        <span className="text-slate-300 font-light text-xs px-2 shrink-0">➔</span>
                        <div className="flex-1 h-[1px] bg-slate-100"></div>
                      </div>

                      {/* 第二行：决面、ITC、入司 */}
                      <div className="flex items-center justify-between text-center">
                        <div className="flex-1 flex flex-col items-center justify-center gap-0.5 px-0.5 min-w-[50px]">
                          <span className="text-slate-500 font-bold text-[11px]">决面</span>
                          {isIndividualTargetSet && <span className="text-blue-500 font-bold text-[11px] bg-blue-50 px-1.5 py-0.5 rounded-full">
                            {Math.round(individualTarget * funnelRatio.决面)}人
                          </span>}
                          <span className="text-slate-800 font-black text-sm">{Math.round(48 * individualTimeMult)}人</span>
                          {isIndividualTargetSet && ((Math.round(individualTarget * funnelRatio.决面) - Math.round(48 * individualTimeMult)) > 0
                            ? <span className="text-rose-500 font-bold text-[9px]">
                              缺{Math.round(individualTarget * funnelRatio.决面) - Math.round(48 * individualTimeMult)}人
                            </span>
                            : <span className="font-bold text-[9px] invisible" aria-hidden="true">缺0人</span>)}
                        </div>
                        <span className="text-slate-300 font-light shrink-0">➔</span>
                        <div className="flex-1 flex flex-col items-center justify-center gap-0.5 px-0.5 min-w-[50px]">
                          <span className="text-slate-500 font-bold text-[11px]">ITC</span>
                          {isIndividualTargetSet && <span className="text-blue-500 font-bold text-[11px] bg-blue-50 px-1.5 py-0.5 rounded-full">
                            {Math.round(individualTarget * funnelRatio.ITC)}人
                          </span>}
                          <span className="text-slate-800 font-black text-sm">{Math.round(24 * individualTimeMult)}人</span>
                          {isIndividualTargetSet && ((Math.round(individualTarget * funnelRatio.ITC) - Math.round(24 * individualTimeMult)) > 0
                            ? <span className="text-rose-500 font-bold text-[9px]">
                              缺{Math.round(individualTarget * funnelRatio.ITC) - Math.round(24 * individualTimeMult)}人
                            </span>
                            : <span className="font-bold text-[9px] invisible" aria-hidden="true">缺0人</span>)}
                        </div>
                        <span className="text-slate-300 font-light shrink-0">➔</span>
                        <div className="flex-1 flex flex-col items-center justify-center gap-0.5 px-0.5 min-w-[50px]">
                          <span className="text-slate-500 font-bold text-[11px]">入司</span>
                          {isIndividualTargetSet && <span className="text-blue-500 font-bold text-[11px] bg-blue-50 px-1.5 py-0.5 rounded-full">
                            {individualTarget}人
                          </span>}
                          <span className="text-slate-800 font-black text-sm">{Math.round(11 * individualTimeMult)}人</span>
                          {isIndividualTargetSet && ((individualTarget - Math.round(11 * individualTimeMult)) > 0
                            ? <span className="text-rose-500 font-bold text-[9px]">
                              缺{individualTarget - Math.round(11 * individualTimeMult)}人
                            </span>
                            : <span className="font-bold text-[9px] invisible" aria-hidden="true">缺0人</span>)}
                        </div>
                      </div>
                    </div>
                    )}
                  </div>

                  {/* 效能看板 - 合并为一张卡片 */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-1 bg-[#00A758] h-4 rounded-full inline-block"></span>
                          <h3 className="text-sm font-black text-slate-800">效能看板</h3>
                        </div>
                        <button
                          onClick={() => setIsEfficiencyBoardExpanded(!isEfficiencyBoardExpanded)}
                          className="text-[10px] font-bold text-[#00A758] flex items-center gap-0.5"
                        >
                          {isEfficiencyBoardExpanded ? '收起' : '展开'}
                          <i className={`fa-solid fa-chevron-${isEfficiencyBoardExpanded ? 'up' : 'down'} text-[8px]`}></i>
                        </button>
                      </div>
                    </div>
                    
                    {isEfficiencyBoardExpanded && (
                    <>
                    {/* 各环节转化率 */}
                    <div className="px-4 pb-4 border-b border-slate-50">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00A758]"></span>
                          <h4 className="text-xs font-black text-slate-600">各环节转化率</h4>
                          <button 
                            onClick={() => setIsHelpModalOpen('conversion')}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <i className="fa-solid fa-circle-exclamation text-[10px]"></i>
                          </button>
                        </div>
                      </div>
                      <div className="divide-y divide-slate-50">
                        {[
                          { from: '建档', to: 'POP', rate: 90, avgDays: 3, fromVal: Math.round(100 * individualTimeMult), toVal: Math.round(90 * individualTimeMult), stepKey: 'step1' as const },
                          { from: 'POP', to: '深面', rate: 56, avgDays: 11, fromVal: Math.round(90 * individualTimeMult), toVal: Math.round(50 * individualTimeMult), stepKey: 'step3' as const },
                          { from: '深面', to: '决面', rate: 80, avgDays: 6, fromVal: Math.round(50 * individualTimeMult), toVal: Math.round(40 * individualTimeMult), stepKey: 'step4' as const },
                          { from: '决面', to: 'ITC', rate: 75, avgDays: 5, fromVal: Math.round(40 * individualTimeMult), toVal: Math.round(30 * individualTimeMult), stepKey: 'step5' as const },
                          { from: 'ITC', to: '入司', rate: 50, avgDays: 5, fromVal: Math.round(30 * individualTimeMult), toVal: Math.round(15 * individualTimeMult), stepKey: 'step6' as const },
                        ].map((item, idx) => {
                          const currentComp = personalCompareData['分公司'];
                          const compareRate = currentComp[item.stepKey];
                          const isGreen = item.rate >= compareRate;
                          const badgeClass = isGreen ? 'bg-emerald-50 text-[#00A758]' : 'bg-rose-50 text-[#EC6453]';
                          const barColor = isGreen ? 'bg-[#00A758]' : 'bg-[#EC6453]';
                          const textColor = isGreen ? 'text-[#00A758]' : 'text-[#EC6453]';
                          return (
                            <div key={idx} className="py-2">
                              <div className="flex items-center justify-between text-xs font-bold font-sans">
                                <div className="flex items-center gap-2 w-1/3 shrink-0">
                                  <span className={`w-4 h-4 ${badgeClass} rounded-full flex items-center justify-center text-[9px] font-mono`}>{idx + 1}</span>
                                  <span className="text-slate-600">{item.from} ➔ {item.to}</span>
                                </div>
                                <div className="flex-1 bg-slate-100 h-2 rounded-full relative">
                                  <div 
                                    className={`h-full rounded-full transition-all ${barColor}`}
                                    style={{ width: `${item.rate}%` }}
                                  ></div>
                                  <div 
                                    className="absolute w-1 h-3.5 bg-slate-700/85 rounded-full border border-white shadow-3xs -top-[3px] -translate-x-1/2 transition-all" 
                                    style={{ left: `${compareRate}%` }}
                                  ></div>
                                </div>
                                <div className="flex items-center gap-1 justify-end w-24 text-right shrink-0">
                                  <span className={`font-extrabold text-xs ${textColor}`}>{item.rate}%</span>
                                  <span className="text-[9px] text-slate-300">/</span>
                                  <span className="text-[10px] font-bold text-slate-500">{Math.round(compareRate)}%</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center pl-6 text-[9.5px] text-slate-400 font-semibold">
                                <span>流转人数：{item.fromVal}人 ➔ {item.toVal}人</span>
                                <span className="w-16 text-right">平均耗时:{item.avgDays}天</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 入司转化率 */}
                    <div className="px-4 pb-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00A758]"></span>
                          <h4 className="text-xs font-black text-slate-600">入司转化率</h4>
                          <button
                            onClick={() => setIsHelpModalOpen('entry')}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <i className="fa-solid fa-circle-exclamation text-[10px]"></i>
                          </button>
                        </div>
                        <button
                          onClick={() => setIsPersonalEntryExpanded(!isPersonalEntryExpanded)}
                          className="text-[10px] font-bold text-[#00A758] flex items-center gap-0.5"
                        >
                          {isPersonalEntryExpanded ? '收起' : '展开'}
                          <i className={`fa-solid fa-chevron-${isPersonalEntryExpanded ? 'up' : 'down'} text-[8px]`}></i>
                        </button>
                      </div>
                      <div className="divide-y divide-slate-50">
                        {(() => {
                          const currentComp = personalCompareData['分公司'];
                          const entryItems = [
                            { from: '建档', to: '入司', rate: 15, avgDays: 11, fromVal: Math.round(100 * individualTimeMult), toVal: Math.round(15 * individualTimeMult), compareRate: currentComp.overall },
                            { from: 'POP', to: '入司', rate: 17, avgDays: 7, fromVal: Math.round(90 * individualTimeMult), toVal: Math.round(15 * individualTimeMult), compareRate: 13 },
                            { from: '深面', to: '入司', rate: 30, avgDays: 12, fromVal: Math.round(50 * individualTimeMult), toVal: Math.round(15 * individualTimeMult), compareRate: 53 },
                            { from: '决面', to: '入司', rate: 38, avgDays: 10, fromVal: Math.round(40 * individualTimeMult), toVal: Math.round(15 * individualTimeMult), compareRate: 59 },
                            { from: 'ITC', to: '入司', rate: 50, avgDays: 5, fromVal: Math.round(30 * individualTimeMult), toVal: Math.round(15 * individualTimeMult), compareRate: currentComp.step6 },
                          ];
                          return entryItems.filter((_, idx) => isPersonalEntryExpanded || idx === 0).map((item, idx) => {
                            const isGreen = item.rate >= item.compareRate;
                            const badgeClass = isGreen ? 'bg-emerald-50 text-[#00A758]' : 'bg-rose-50 text-[#EC6453]';
                            const barColor = isGreen ? 'bg-[#00A758]' : 'bg-[#EC6453]';
                            const textColor = isGreen ? 'text-[#00A758]' : 'text-[#EC6453]';
                            return (
                              <div key={idx} className="py-2">
                                <div className="flex items-center justify-between text-xs font-bold font-sans">
                                  <div className="flex items-center gap-2 w-1/3 shrink-0">
                                    <span className={`w-4 h-4 ${badgeClass} rounded-full flex items-center justify-center text-[9px] font-mono`}>{idx + 1}</span>
                                    <span className="text-slate-600">{item.from} ➔ {item.to}</span>
                                  </div>
                                  <div className="flex-1 bg-slate-100 h-2 rounded-full relative">
                                    <div 
                                      className={`h-full rounded-full transition-all ${barColor}`}
                                      style={{ width: `${item.rate}%` }}
                                    ></div>
                                    <div 
                                      className="absolute w-1 h-3.5 bg-slate-700/85 rounded-full border border-white shadow-3xs -top-[3px] -translate-x-1/2 transition-all" 
                                      style={{ left: `${item.compareRate}%` }}
                                    ></div>
                                  </div>
                                  <div className="flex items-center gap-1 justify-end w-24 text-right shrink-0">
                                    <span className={`font-extrabold text-xs ${textColor}`}>{item.rate}%</span>
                                    <span className="text-[9px] text-slate-300">/</span>
                                    <span className="text-[10px] font-bold text-slate-500">{Math.round(item.compareRate)}%</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center pl-6 text-[9.5px] text-slate-400 font-semibold">
                                  <span>流转人数：{item.fromVal}人 ➔ {item.toVal}人</span>
                                  <span className="w-16 text-right">平均耗时:{item.avgDays}天</span>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                    </>
                    )}
                  </div>

                  {/* 招募进行时 - 合并为一张卡片 */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    {/* 标题部分 */}
                    <div className="p-4 border-b border-slate-100">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-1 bg-[#00A758] h-4 rounded-full inline-block"></span>
                          <h3 className="text-sm font-black text-slate-800">招募进行时</h3>
                        </div>
                        <button
                          onClick={() => setIsRecruitmentBoardExpanded(!isRecruitmentBoardExpanded)}
                          className="text-[10px] font-bold text-[#00A758] flex items-center gap-0.5"
                        >
                          {isRecruitmentBoardExpanded ? '收起' : '展开'}
                          <i className={`fa-solid fa-chevron-${isRecruitmentBoardExpanded ? 'up' : 'down'} text-[8px]`}></i>
                        </button>
                      </div>
                    </div>

                    {isRecruitmentBoardExpanded && (
                    <>
                    {/* 招募中状态分布 */}
                    <div className="p-4 border-b border-slate-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00A758]"></span>
                          <h4 className="text-xs font-black text-slate-600">招募中{Math.round(77 * individualTimeMult)}（状态分布）</h4>
                        </div>
                        <button
                          onClick={() => setIsRecruitmentStatusExpanded(!isRecruitmentStatusExpanded)}
                          className="text-[10px] font-bold text-[#00A758] flex items-center gap-0.5"
                        >
                          {isRecruitmentStatusExpanded ? '收起' : '展开'}
                          <i className={`fa-solid fa-chevron-${isRecruitmentStatusExpanded ? 'up' : 'down'} text-[8px]`}></i>
                        </button>
                      </div>
                      {isRecruitmentStatusExpanded && (
                      <div className="divide-y divide-slate-50">
                          <div className="grid grid-cols-[1.5fr_1fr_1fr] bg-slate-50 py-1.5 rounded-lg">
                            <span className="text-[10px] font-bold text-slate-500 pl-3 pr-1">状态</span>
                            <span className="text-[10px] font-bold text-slate-500 text-center">占比</span>
                            <span className="text-[10px] font-bold text-slate-500 text-right pl-1 pr-3">停留时长</span>
                          </div>
                          {[
                            { status: `待深度面谈(${Math.round(16 * individualTimeMult)})`, percentage: '20.78%', avgDays: '1275天', color: 'text-slate-600', bgColor: 'bg-teal-500' },
                            { status: `待决定性面谈(${Math.round(15 * individualTimeMult)})`, percentage: '19.48%', avgDays: '372天', color: 'text-slate-600', bgColor: 'bg-indigo-500' },
                            { status: `待岗前培训(${Math.round(14 * individualTimeMult)})`, percentage: '18.18%', avgDays: '810天', color: 'text-slate-600', bgColor: 'bg-cyan-500' },
                            { status: `待入司(${Math.round(10 * individualTimeMult)})`, percentage: '12.99%', avgDays: '427天', color: 'text-slate-600', bgColor: 'bg-purple-500' },
                          ].map((item, idx) => (
                            <div key={idx} className="grid grid-cols-[1.5fr_1fr_1fr] py-1.5 items-start">
                              <div className="flex items-center gap-2 pl-3 pr-1 min-w-0">
                                <span className={`w-2 h-2 rounded-full ${item.bgColor} flex-shrink-0 mt-0.5`}></span>
                                <span className={`text-[10px] font-bold ${item.color} break-words`}>{item.status}</span>
                              </div>
                              <span className="text-[10px] font-bold text-slate-600 text-center">
                                <span className="block">
                                  {item.percentage}
                                </span>
                              </span>
                              <span className="text-[10px] font-bold text-slate-600 text-right pl-1 pr-3">
                                <span className="block">
                                  {item.avgDays}
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* POP精英潜质测评 */}
                    <div className="p-4 border-b border-slate-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00A758]"></span>
                          <h4 className="text-xs font-black text-slate-600">POP精英潜质测评</h4>
                        </div>
                        <button
                          onClick={() => setIsPopAssessmentExpanded(!isPopAssessmentExpanded)}
                          className="text-[10px] font-bold text-[#00A758] flex items-center gap-0.5"
                        >
                          {isPopAssessmentExpanded ? '收起' : '展开'}
                          <i className={`fa-solid fa-chevron-${isPopAssessmentExpanded ? 'up' : 'down'} text-[8px]`}></i>
                        </button>
                      </div>
                      {isPopAssessmentExpanded && (
                      <>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-green-50 rounded-xl py-2 px-2 text-center">
                          <span className="text-lg font-black text-[#00A758]">{Math.round(35 * individualTimeMult)}</span>
                          <span className="text-[9px] text-[#00A758] font-bold block mt-0.5">已完成</span>
                        </div>
                        <div className="bg-yellow-50 rounded-xl py-2 px-2 text-center">
                          <span className="text-lg font-black text-yellow-600">{Math.round(29 * individualTimeMult)}</span>
                          <span className="text-[9px] text-yellow-600 font-bold block mt-0.5">已邀请</span>
                        </div>
                        <div className="bg-rose-50 rounded-xl py-2 px-2 text-center">
                          <span className="text-lg font-black text-rose-500">{Math.round(13 * individualTimeMult)}</span>
                          <span className="text-[9px] text-rose-500 font-bold block mt-0.5">未邀请</span>
                        </div>
                      </div>
                      <div className="mt-3">
                          <div className="bg-slate-50 rounded-xl overflow-hidden">
                            <div className="grid grid-cols-[1.5fr_1fr_1fr] bg-slate-100 py-1.5">
                              <span className="text-[10px] font-bold text-slate-500 pl-3 pr-1">状态</span>
                              <span className="text-[10px] font-bold text-slate-500 text-center">占比</span>
                              <span className="text-[10px] font-bold text-slate-500 text-right pl-1 pr-3">停留时长</span>
                            </div>
                            <div className="divide-y divide-slate-200">
                              {[
                                { status: `已完成(${Math.round(35 * individualTimeMult)})`, percentage: '45.45%', avgDays: '350天', color: 'text-[#00A758]', dotColor: 'bg-[#00A758]' },
                                { status: `已邀请未完成(${Math.round(29 * individualTimeMult)})`, percentage: '37.66%', avgDays: '334天', color: 'text-yellow-600', dotColor: 'bg-yellow-500' },
                                { status: `未邀请(${Math.round(13 * individualTimeMult)})`, percentage: '16.88%', avgDays: '1947天', color: 'text-rose-500', dotColor: 'bg-rose-500' },
                              ].map((item, idx) => (
                                <div key={idx} className="grid grid-cols-[1.5fr_1fr_1fr] py-1.5 items-start">
                                  <div className="flex items-center gap-2 pl-3 pr-1 min-w-0">
                                    <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor} flex-shrink-0 mt-0.5`}></span>
                                    <span className={`text-[10px] font-bold ${item.color} break-words`}>{item.status}</span>
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-600 text-center">
                                    <span className="block">
                                      {item.percentage}
                                    </span>
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-600 text-right pl-1 pr-3">
                                    <span className="block">
                                      {item.avgDays}
                                    </span>
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                      )}
                    </div>

                    {/* COP邀请情况 */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00A758]"></span>
                          <h4 className="text-xs font-black text-slate-600">COP邀请情况</h4>
                        </div>
                        <button
                          onClick={() => setIsCopInviteExpanded(!isCopInviteExpanded)}
                          className="text-[10px] font-bold text-[#00A758] flex items-center gap-0.5"
                        >
                          {isCopInviteExpanded ? '收起' : '展开'}
                          <i className={`fa-solid fa-chevron-${isCopInviteExpanded ? 'up' : 'down'} text-[8px]`}></i>
                        </button>
                      </div>
                      {isCopInviteExpanded && (
                      <>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-green-50 rounded-xl py-2 px-2 text-center">
                          <span className="text-lg font-black text-[#00A758]">0</span>
                          <span className="text-[9px] text-[#00A758] font-bold block mt-0.5">已签到</span>
                        </div>
                        <div className="bg-yellow-50 rounded-xl py-2 px-2 text-center">
                          <span className="text-lg font-black text-yellow-600">{Math.round(2 * individualTimeMult)}</span>
                          <span className="text-[9px] text-yellow-600 font-bold block mt-0.5">已邀请</span>
                        </div>
                        <div className="bg-rose-50 rounded-xl py-2 px-2 text-center">
                          <span className="text-lg font-black text-rose-500">{Math.round(75 * individualTimeMult)}</span>
                          <span className="text-[9px] text-rose-500 font-bold block mt-0.5">未邀请</span>
                        </div>
                      </div>
                      <div className="mt-3">
                          <div className="bg-slate-50 rounded-xl overflow-hidden">
                            <div className="grid grid-cols-[1.5fr_1fr_1fr] bg-slate-100 py-1.5">
                              <span className="text-[10px] font-bold text-slate-500 pl-3 pr-1">状态</span>
                              <span className="text-[10px] font-bold text-slate-500 text-center">占比</span>
                              <span className="text-[10px] font-bold text-slate-500 text-right pl-1 pr-3">停留时长</span>
                            </div>
                            <div className="divide-y divide-slate-200">
                              {[
                                { status: '已完成(0)', percentage: '0%', avgDays: '0天', color: 'text-[#00A758]', dotColor: 'bg-[#00A758]' },
                                { status: `已邀请未完成(${Math.round(2 * individualTimeMult)})`, percentage: '2.60%', avgDays: '765天', color: 'text-yellow-600', dotColor: 'bg-yellow-500' },
                                { status: `未邀请(${Math.round(75 * individualTimeMult)})`, percentage: '97.40%', avgDays: '730天', color: 'text-rose-500', dotColor: 'bg-rose-500' },
                              ].map((item, idx) => (
                                <div key={idx} className="grid grid-cols-[1.5fr_1fr_1fr] py-1.5 items-start">
                                  <div className="flex items-center gap-2 pl-3 pr-1 min-w-0">
                                    <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor} flex-shrink-0 mt-0.5`}></span>
                                    <span className={`text-[10px] font-bold ${item.color} break-words`}>{item.status}</span>
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-600 text-center">
                                    <span className="block">
                                      {item.percentage}
                                    </span>
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-600 text-right pl-1 pr-3">
                                    <span className="block">
                                      {item.avgDays}
                                    </span>
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                      )}
                    </div>
                    </>
                    )}
                  </div>
                </div>
              )}

              {/* === 主页内容 === */}
              {!showActivityDetail && (
                <>
                  {/* === CARD 1: 个人目标看板 === */}
                <div id="ind-target-board" className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-slate-800 tracking-wide flex items-center gap-2">
                    <span className="w-1 bg-[#00A758] h-3.5 rounded-full inline-block"></span>
                    招募目标
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setIsSettingTarget(!isSettingTarget);
                        if (!isSettingTarget) {
                          setEditingScope('直辖组');
                          setEditingTargetNum('');
                          // 展开时日历默认选中当前月份
                          setSelectedCalendarMonth(currentMonthStr);
                        }
                      }}
                      className="text-[9.5px] font-black text-[#00A758] bg-green-50/60 hover:bg-green-100/60 px-2 py-0.5 rounded border border-green-100 shadow-3xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <i className={`fa-solid ${isSettingTarget ? 'fa-angles-up' : 'fa-calendar-days'} font-bold`}></i>
                      {isSettingTarget ? '收起配置' : '设定目标'}
                    </button>
                    {/* 进度提示标签 */}
                    {(() => {
                      if (!isIndividualTargetSet) {
                        return <span className="text-[9.5px] font-black px-2 py-0.5 rounded shadow-xs border bg-slate-100 text-slate-500 border-slate-200/60">目标未设定</span>;
                      }
                      const rate = (individualActual / individualTarget) * 100;
                      const timeProgressPct = individualTimeProgress * 100;
                      if (rate >= timeProgressPct) {
                        return <span className="text-[9.5px] font-black px-2 py-0.5 rounded shadow-xs border bg-[#EAFDF3] text-[#00A758] border-green-100">进度正常</span>;
                      }
                      return <span className="text-[9.5px] font-black px-2 py-0.5 rounded shadow-xs border bg-orange-50 text-orange-500 border-orange-100">进度落后</span>;
                    })()}
                  </div>
                </div>
                
                <div className="flex items-center gap-5">
                  {/* Left circular progress chart */}
                  <div className="w-20 h-20 relative flex items-center justify-center shrink-0" id="circle-chart-ind">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        className={isIndividualTargetSet ? "stroke-[#e6f6ee]" : "stroke-slate-50"}
                        strokeWidth="6"
                        fill="transparent"
                      />
                      {isIndividualTargetSet && (
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          className="stroke-[#00A758]"
                          strokeWidth="6"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 32}
                          strokeDashoffset={2 * Math.PI * 32 * (1 - individualActual / individualTarget)}
                          strokeLinecap="round"
                        />
                      )}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-base font-black text-slate-800 leading-tight">
                        {isIndividualTargetSet ? `${Math.round((individualActual / individualTarget) * 100)}%` : '未设定'}
                      </span>
                      <span className="text-[8px] text-slate-400 font-bold mt-0.5">
                        {isIndividualTargetSet ? '达成进度' : '无法查看进度'}
                      </span>
                    </div>
                  </div>

                  {/* Right data columns */}
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-2 gap-2 bg-[#FCFDFD] p-3 border border-slate-100/60 rounded-xl text-center">
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-slate-800">{isIndividualTargetSet ? individualTarget : '—'}</span>
                        <span className="text-[9px] text-slate-400 font-bold">招募目标</span>
                      </div>
                      <div className="flex flex-col border-l border-slate-100">
                        <span className="text-lg font-black text-[#00A758]">{individualActual}</span>
                        <span className="text-[9px] text-slate-400 font-bold">实际招募</span>
                      </div>
                    </div>
                    {/* 缺口提示：达成超出目标时不显示缺口 */}
                    <div className="text-left">
                      {isIndividualTargetSet ? (
                        individualActual < individualTarget && (
                          <span className="text-[10px] text-slate-500 font-bold">缺口：还需 <b className="text-slate-700">{individualTarget - individualActual}</b> 人</span>
                        )
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold">请设定当前维度目标以解锁进度与缺口</span>
                      )}
                    </div>
                  </div>
                </div>

                {isSettingTarget && (
                  <div className="border-t border-slate-100 pt-4 mt-2 bg-slate-50/60 -mx-5 px-5 pb-3 rounded-b-2xl space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wide flex items-center gap-1">
                            <i className="fa-regular fa-calendar-days text-[#00A758]"></i>
                            {calendarYear}年度
                          </span>
                          <div className="flex items-center gap-1 bg-white border border-slate-200/80 px-1 py-0.5 rounded-lg shadow-3xs">
                            <button
                              type="button"
                              onClick={() => {
                                const prevYear = calendarYear - 1;
                                setCalendarYear(prevYear);
                                const currentM = selectedCalendarMonth.split('-')[1] || '06';
                                const newM = `${prevYear}-${currentM}`;
                                setSelectedCalendarMonth(newM);
                                const targetValSelected = individualMonthlyTargets[editingScope]?.[newM];
                                if (targetValSelected !== undefined) {
                                  setEditingTargetNum(targetValSelected.toString());
                                } else {
                                  setEditingTargetNum('');
                                }
                              }}
                              className="w-4 h-4 rounded hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all cursor-pointer active:scale-90"
                              title="上一年"
                            >
                              <i className="fa-solid fa-chevron-left text-[8px]"></i>
                            </button>
                            <span className="text-[9px] font-black text-[#00A758] px-1 min-w-[28px] text-center">
                              {calendarYear}年
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const nextYear = calendarYear + 1;
                                setCalendarYear(nextYear);
                                const currentM = selectedCalendarMonth.split('-')[1] || '06';
                                const newM = `${nextYear}-${currentM}`;
                                setSelectedCalendarMonth(newM);
                                const targetValSelected = individualMonthlyTargets[editingScope]?.[newM];
                                if (targetValSelected !== undefined) {
                                  setEditingTargetNum(targetValSelected.toString());
                                } else {
                                  setEditingTargetNum('');
                                }
                              }}
                              className="w-4 h-4 rounded hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all cursor-pointer active:scale-90"
                              title="下一年"
                            >
                              <i className="fa-solid fa-chevron-right text-[8px]"></i>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { value: `${calendarYear}-01`, label: '1月' },
                          { value: `${calendarYear}-02`, label: '2月' },
                          { value: `${calendarYear}-03`, label: '3月' },
                          { value: `${calendarYear}-04`, label: '4月' },
                          { value: `${calendarYear}-05`, label: '5月' },
                          { value: `${calendarYear}-06`, label: '6月' },
                          { value: `${calendarYear}-07`, label: '7月' },
                          { value: `${calendarYear}-08`, label: '8月' },
                          { value: `${calendarYear}-09`, label: '9月' },
                          { value: `${calendarYear}-10`, label: '10月' },
                          { value: `${calendarYear}-11`, label: '11月' },
                          { value: `${calendarYear}-12`, label: '12月' },
                        ].map((mObj) => {
                          const m = mObj.value;
                          const targetValSelected = individualMonthlyTargets[editingScope]?.[m];
                          const isSel = selectedCalendarMonth === m;
                          // 被临时删除隐藏的月份视为“未设定”（不写回存储，刷新恢复）
                          const isHidden = hiddenDeletedMonths[editingScope]?.[m] === true;
                          const hasTar = targetValSelected !== undefined && !isHidden;

                          return (
                            <div
                              key={m}
                              onClick={() => {
                                setSelectedCalendarMonth(m);
                                if (hasTar) {
                                  setEditingTargetNum(targetValSelected.toString());
                                } else {
                                  setEditingTargetNum('');
                                }
                              }}
                              className={`relative p-2 rounded-xl border text-center transition-all select-none cursor-pointer flex flex-col items-center justify-center min-h-[50px] ${
                                isSel
                                  ? 'border-[#00A758] bg-green-50/20 ring-2 ring-[#00A758]/25 shadow-2xs'
                                  : hasTar
                                    ? 'border-[#EAFDF3] bg-[#EAFDF3]/80 hover:bg-[#EAFDF3]'
                                    : 'border-slate-100 hover:bg-slate-50 text-slate-400 bg-white'
                              }`}
                            >
                              <span className={`text-[10px] font-black ${isSel ? 'text-[#00A758]' : 'text-slate-700'}`}>
                                {mObj.label}
                              </span>
                              {hasTar ? (
                                <span className="text-[9px] font-black text-[#00A758] mt-0.5 whitespace-nowrap bg-white/80 px-1 py-0.5 rounded border border-green-100">
                                  {targetValSelected} 人
                                </span>
                              ) : (
                                <span className="text-[8px] mt-0.5 opacity-60 text-slate-400">
                                  未设定
                                </span>
                              )}

                              {hasTar && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // 仅本次隐藏，不写回 individualMonthlyTargets；刷新后恢复显示
                                    setHiddenDeletedMonths(prev => ({
                                      ...prev,
                                      [editingScope]: {
                                        ...prev[editingScope],
                                        [m]: true
                                      }
                                    }));
                                    if (selectedCalendarMonth === m) {
                                      setEditingTargetNum('');
                                    }
                                  }}
                                  className="absolute -top-1 -right-1 bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-colors p-0.5 rounded-full shadow-2xs w-4 h-4 flex items-center justify-center cursor-pointer"
                                  title="删除该月目标"
                                >
                                  <i className="fa-solid fa-trash-can text-[8px]"></i>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-white p-3 border border-slate-200/80 rounded-xl space-y-2.5">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-wide">
                        <span>
                          设定 <b className="text-[#00A758] font-extrabold">{parseInt(selectedCalendarMonth.split('-')[1])}月</b> 目标人数 (人)
                        </span>
                        {individualMonthlyTargets[editingScope]?.[selectedCalendarMonth] !== undefined && (
                          <span className="text-[9px] text-[#00A758] font-bold">
                            当前设定: {individualMonthlyTargets[editingScope][selectedCalendarMonth]} 人
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            min="1"
                            placeholder="目标人数"
                            value={editingTargetNum}
                            disabled={selectedCalendarMonth < currentMonthStr}
                            onChange={(e) => setEditingTargetNum(e.target.value)}
                            className={`w-full border rounded-xl py-1.5 px-3 text-xs font-black outline-none focus:ring-1 focus:ring-[#00A758]/30 focus:border-[#00A758] ${
                              selectedCalendarMonth < currentMonthStr
                                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10.5px] font-bold pointer-events-none">
                            人
                          </span>
                        </div>
                        <button
                          type="button"
                          disabled={selectedCalendarMonth < currentMonthStr}
                          onClick={() => {
                            if (selectedCalendarMonth < currentMonthStr) return;
                            const num = parseInt(editingTargetNum, 10);
                            if (isNaN(num) || num <= 0) {
                              alert('请输入有效的正整数目标人数');
                              return;
                            }
                            // 写入该月目标（并清除该月的临时删除隐藏标记）
                            const newScopeTargets = {
                              ...individualMonthlyTargets[editingScope],
                              [selectedCalendarMonth]: num
                            };
                            setIndividualMonthlyTargets(prev => ({
                              ...prev,
                              [editingScope]: newScopeTargets
                            }));
                            if (hiddenDeletedMonths[editingScope]?.[selectedCalendarMonth]) {
                              setHiddenDeletedMonths(prev => {
                                const scope = { ...prev[editingScope] };
                                delete scope[selectedCalendarMonth];
                                return { ...prev, [editingScope]: scope };
                              });
                            }
                            // 点击更改/保存后立即将目标带入招募目标模块（个人视图日期范围内直辖组目标总和；
                            // 确保刚设定的月份一定被纳入统计，即使它落在当前查看范围之外）
                            const rangeStart = selectedCalendarMonth < personalStartMonth ? selectedCalendarMonth : personalStartMonth;
                            const rangeEnd = selectedCalendarMonth > personalEndMonth ? selectedCalendarMonth : personalEndMonth;
                            const indMonths = getMonthsInRange(rangeStart, rangeEnd);
                            const indScopeTargets = editingScope === '直辖组'
                              ? newScopeTargets
                              : (individualMonthlyTargets['直辖组'] || {});
                            let indTotalTarget = 0;
                            let indHasAnyTarget = false;
                            indMonths.forEach(mm => {
                              const val = indScopeTargets[mm];
                              if (val !== undefined && !hiddenDeletedMonths['直辖组']?.[mm]) {
                                indTotalTarget += val;
                                indHasAnyTarget = true;
                              }
                            });
                            if (indHasAnyTarget) {
                              setIndividualTarget(indTotalTarget);
                              setIsIndividualTargetSet(true);
                            }
                          }}
                          className={`px-4 py-1.5 text-xs font-black rounded-xl transition-all shadow-xs shrink-0 inline-flex items-center gap-1 ${
                            selectedCalendarMonth < currentMonthStr
                              ? 'text-slate-400 bg-slate-200 cursor-not-allowed'
                              : 'text-white bg-[#00A758] hover:bg-[#008b47] active:scale-95 cursor-pointer'
                          }`}
                        >
                          <i className="fa-regular fa-square-check"></i>
                          更改/保存
                        </button>
                      </div>
                      {selectedCalendarMonth < currentMonthStr && (
                        <p className="text-[9px] font-bold text-slate-400 flex items-center gap-1 pt-0.5">
                          <i className="fa-solid fa-circle-info text-[8px]"></i>
                          不支持对过去月份修改/设立目标
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-1 border-t border-slate-100/50">
                      <button
                        type="button"
                        onClick={() => {
                          // 计算个人视图日期范围内已设定的目标总人数（使用个人视图独立的目标存储与日期范围）
                          const indMonths = getMonthsInRange(personalStartMonth, personalEndMonth);
                          const indScopeTargets = individualMonthlyTargets['直辖组'] || {};
                          let indTotalTarget = 0;
                          let indHasAnyTarget = false;
                          indMonths.forEach(m => {
                            const val = indScopeTargets[m];
                            if (val !== undefined) {
                              indTotalTarget += val;
                              indHasAnyTarget = true;
                            }
                          });
                          if (indHasAnyTarget) {
                            setIndividualTarget(indTotalTarget);
                            setIsIndividualTargetSet(true);
                          }
                          setIsSettingTarget(false);
                        }}
                        className="w-full py-1.5 text-center text-xs font-black text-white bg-[#00A758] hover:bg-[#008b47] rounded-xl active:scale-95 transition-all shadow-xs cursor-pointer flex justify-center items-center gap-1"
                      >
                        <i className="fa-solid fa-check"></i>
                        确定并退出设定
                      </button>
                    </div>
                  </div>
                )}
              </div>


              {/* === CARD 2: 数据看板内容 === */}
                  {/* 招募活动量卡片 */}
                  <div className="bg-gradient-to-br from-[#00B863] to-[#00A758] rounded-2xl p-4 shadow-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-white tracking-wide">招募活动量（月）</h3>
                        <span className="text-[10px] font-bold text-white bg-white/25 px-2 py-0.5 rounded-full">
                          COP: 38
                        </span>
                      </div>
                      <button 
                        onClick={() => {
                          // 查看更多页面不做缓存：每次进入时间周期重置为默认"本月"
                          setPersonalTimeShortcut('this_month');
                          setPersonalStartMonth(getMonthOffset(0));
                          setPersonalEndMonth(getMonthOffset(0));
                          setShowActivityDetail(true);
                        }}
                        className="text-[11px] font-bold text-white/90 hover:text-white flex items-center gap-0.5 cursor-pointer"
                      >
                        查看更多 <i className="fa-solid fa-chevron-right text-[9px]"></i>
                      </button>
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                      {[
                        { label: '建档', value: '120' },
                        { label: 'POP', value: '100' },
                        { label: '深面', value: '58' },
                        { label: '决面', value: '48' },
                        { label: 'ITC', value: '24' },
                        { label: '入司', value: '11' },
                      ].map((item, idx) => (
                        <div key={idx} className="bg-white/25 backdrop-blur-sm rounded-xl py-2 px-1.5 flex flex-col items-center justify-center shadow-sm">
                          <span className="text-white font-black text-base">{item.value}</span>
                          <span className="text-white/90 font-bold text-[10px] mt-0.5">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 功能ICON按钮卡片 */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { icon: 'fa-solid fa-user-plus', label: '人才库', color: 'text-[#00A758]', special: false },
                        { icon: 'fa-solid fa-magnifying-glass', label: '招募工具', color: 'text-[#00A758]', special: false },
                        { icon: 'cop', label: 'COP', color: 'text-[#00A758]', special: 'cop' },
                        { icon: 'pop', label: 'POP', color: 'text-[#00A758]', special: 'pop' },
                        { icon: 'interview', label: '面试', color: 'text-[#00A758]', special: 'interview' },
                        { icon: 'fa-solid fa-folder', label: '资料上传', color: 'text-[#00A758]', special: false },
                        { icon: 'fa-solid fa-chalkboard-user', label: '岗前培训', color: 'text-[#00A758]', special: false },
                        { icon: 'fa-solid fa-id-card', label: '入司', color: 'text-[#00A758]', special: false },
                        { icon: 'fa-solid fa-robot', label: 'AI面试', color: 'text-slate-400', special: false, badge: '敬请期待', badgeColor: 'bg-rose-500' },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors relative"
                          onClick={() => alert(`点击了${item.label}`)}
                        >
                          <div className="relative w-11 h-11 flex items-center justify-center">
                            {item.special === 'cop' ? (
                              <i className="fa-solid fa-file-pen text-[#00A758] text-lg"></i>
                            ) : item.special === 'pop' ? (
                              <div className="relative">
                                <div className="flex flex-row gap-[-2px] absolute top-0">
                                  <i className="fa-solid fa-user text-[#00A758] text-xs"></i>
                                  <i className="fa-solid fa-user text-[#00A758] text-xs"></i>
                                </div>
                                <div className="border-2 border-white rounded-full p-0.5">
                                  <i className="fa-solid fa-user text-[#00A758] text-base"></i>
                                </div>
                              </div>
                            ) : item.special === 'interview' ? (
                              <div className="w-7 h-7 flex items-center justify-center bg-[#00A758] rounded-lg">
                                <i className="fa-solid fa-check text-white text-xs"></i>
                              </div>
                            ) : (
                              <i className={`${item.icon} ${item.color} text-xl`}></i>
                            )}
                            {item.badge && (
                              <span className={`absolute -top-1 left-1/2 -translate-x-1/2 ${item.badgeColor || 'bg-rose-500'} text-white text-[7px] font-black px-1.5 py-0.5 rounded-full whitespace-nowrap`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-slate-700">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>


              {/* === 主页内容结束 === */}
                </>
              )}

            </>
          ) : (
            <>
              {/* === TEAM VIEW: 团队管理 (Four Dashboards) === */}
              
              {/* --- FILTERS AREA (Sticky & Collapsible for maximize page estate) --- */}
              <div ref={filterCardRef} className="sticky top-0 z-20 bg-[#f7f9fc]/90 backdrop-blur-md pb-2 -mx-1 px-1">
                <div ref={filterInnerCardRef} className="bg-white rounded-2xl border border-slate-150 shadow-sm transition-all duration-300">
                  {/* Collapsible header panel */}
                  <div 
                    onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                       <div className="w-1.5 h-3.5 bg-[#00A758] rounded-full shrink-0"></div>
                       <span className="text-[11px] font-black text-slate-700 uppercase tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                        {isFiltersExpanded ? '筛选' : `已筛选 • ${activeScope} • ${activeMetricDashboard} • ${timeShortcut === 'this_month' ? '本月' : timeShortcut === 'this_quarter' ? '本季度' : timeShortcut === 'half_year' ? '半年' : timeShortcut === 'one_year' ? '一年' : `${actualStart}至${actualEnd}`}`}
                       </span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFiltersExpanded(!isFiltersExpanded);
                      }}
                      className="flex items-center gap-1 text-[10px] font-black text-[#00A758] bg-[#00A758]/5 hover:bg-[#00A758]/10 px-2.5 py-1 rounded-full transition-all shrink-0 whitespace-nowrap"
                    >
                      <i className={`fa-solid ${isFiltersExpanded ? 'fa-compress' : 'fa-sliders'} text-[9px]`}></i>
                      <span>{isFiltersExpanded ? '折叠' : '展开筛选'}</span>
                    </button>
                  </div>

                  {isFiltersExpanded && (
                    <div className="px-4 pb-4 pt-1 space-y-3.5 border-t border-slate-50 animate-fade-in">
                      {/* Filter 1: 组织架构筛选 */}
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-wide shrink-0">组织架构:</span>
                        <div className="flex bg-[#f1f3f5] rounded-xl p-0.5 w-[220px]" id="team-scope-switcher">
                          {(['直辖组', '营业区', '所辖'] as const).map((scope) => (
                            <button
                              key={scope}
                              onClick={() => setActiveScope(scope)}
                              className={`flex-1 py-1 text-center text-[10px] font-black transition-all duration-200 rounded-lg ${
                                activeScope === scope
                                  ? 'bg-white text-[#00A758] shadow-sm font-extrabold'
                                  : 'text-slate-500 hover:text-slate-850'
                              }`}
                            >
                              {scope}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Filter 2: 看板类型 */}
                      <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-50">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-wide shrink-0">数据看板:</span>
                        <div className="flex bg-[#f1f3f5] rounded-xl p-0.5 w-[220px]" id="team-metric-switcher">
                          {([ '活动量看板', '效能看板'] as const).map((dashboard) => (
                            <button
                              key={dashboard}
                              onClick={() => setActiveMetricDashboard(dashboard)}
                              className={`flex-1 py-1.5 text-center text-[10px] font-black transition-all duration-200 rounded-lg ${
                                activeMetricDashboard === dashboard
                                  ? 'bg-white text-[#00A758] shadow-sm font-extrabold'
                                  : 'text-slate-500 hover:text-slate-850'
                              }`}
                            >
                              {dashboard}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Filter 3: 时间范围(月码)及快捷筛选 */}
                      <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-50">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wide shrink-0">选定月度:</span>
                          <RangeMonthPicker
                            startMonth={startMonth}
                            endMonth={endMonth}
                            onChange={(s, e) => {
                              updateStartMonth(s);
                              updateEndMonth(e);
                            }}
                          />
                        </div>

                        {/* Quick Filters */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 font-bold shrink-0">快捷周期:</span>
                          <div className="flex gap-1.5 flex-1 overflow-x-auto no-scrollbar py-0.5">
                            {[
                              { id: 'this_month', name: '本月' },
                              { id: 'this_quarter', name: '本季度' },
                              { id: 'half_year', name: '半年' },
                              { id: 'one_year', name: '一年' }
                            ].map((item) => (
                              <button
                                key={item.id}
                                onClick={() => handleShortcutClick(item.id as any)}
                                className={`px-2.5 py-1 text-[10px] rounded-lg font-bold transition-all shrink-0 ${
                                  timeShortcut === item.id
                                    ? 'bg-[#00A758] text-white shadow-xs font-black'
                                    : 'bg-slate-50 text-slate-500 border border-slate-100/60 hover:bg-slate-100/80'
                                }`}
                              >
                                {item.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* --- FOUR DASHBOARDS (四大看板) --- */}

              {/* 1. 目标看板 */}
              {activeMetricDashboard === '活动量看板' && (
                <div id="team-target-dashboard" className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                  <h3 className="text-sm font-black text-slate-800 tracking-wide flex items-center gap-2">
                    <span className="w-1 bg-[#00A758] h-3.5 rounded-full inline-block"></span>
                    目标看板
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsTeamSettingTarget(!isTeamSettingTarget);
                        if (!isTeamSettingTarget) {
                          setEditingScope(activeScope);
                          setEditingTargetNum('');
                          // 展开时日历默认选中当前月份
                          setSelectedCalendarMonth(currentMonthStr);
                        }
                      }}
                      className="text-[9.5px] font-black text-[#00A758] bg-green-50/60 hover:bg-green-100/60 px-2 py-0.5 rounded border border-green-100 shadow-3xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <i className={`fa-solid ${isTeamSettingTarget ? 'fa-angles-up' : 'fa-calendar-days'} font-bold`}></i>
                      {isTeamSettingTarget ? '收起配置' : '设定目标'}
                    </button>
                    <span className={`text-[9.5px] font-black px-2 py-0.5 rounded shadow-xs border ${statusEval.bg}`}>
                      {statusEval.text}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  {/* Circular visual of overall progress */}
                  <div className="w-24 h-24 relative flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="38"
                        className="stroke-slate-50"
                        strokeWidth="7"
                        fill="transparent"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="38"
                        className={isTargetSet ? 'stroke-[#00A758]' : 'stroke-slate-300'}
                        strokeWidth="7"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 38}
                        strokeDashoffset={isTargetSet ? 2 * Math.PI * 38 * (1 - rateNum / 100) : 2 * Math.PI * 38}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-slate-800 leading-tight">
                        {isTargetSet ? `${rateNum}%` : '未设定'}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                        {isTargetSet ? '达成进度' : '无法查看进度'}
                      </span>
                    </div>
                  </div>

                  {/* Standard goals data */}
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-center bg-[#FCFDFD] p-2.5 border border-slate-100 rounded-xl">
                      <div className="flex flex-col justify-center">
                        <span className="text-lg font-black text-slate-800">
                          {isTargetSet ? targetNum : '—'}
                        </span>
                        <span className="text-[8.5px] text-slate-400 font-bold mt-0.5">
                          目标 (人) 
                        </span>
                      </div>
                      <div className="flex flex-col border-l border-slate-100 justify-center">
                        <span className="text-lg font-black text-[#00A758]">
                          {isTargetSet ? targetPeriodActualNum : actualNum}
                        </span>
                        <span className="text-[8.5px] text-slate-400 font-bold mt-0.5">
                          达成 (人)
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 px-1 font-bold font-sans">
                      {isTargetSet ? (
                        targetPeriodActualNum < targetNum && (
                          <span>缺口：还需 <b>{remainingNum}</b> 人</span>
                        )
                      ) : (
                        <span className="text-slate-400">请设定当前维度目标以解锁进度与缺口</span>
                      )}
                    </div>
                  </div>
                </div>



                {/* Inline Target Settings Form */}
                {isTeamSettingTarget && (
                  <div className="border-t border-slate-100 pt-4 mt-2 bg-slate-50/60 -mx-5 px-5 pb-3 rounded-b-2xl space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wide">目标维度</span>
                        <span className="text-[9.5px] font-black text-slate-400">选择要设定月份目标的层级</span>
                      </div>
                      <div className="flex bg-slate-150 rounded-xl p-0.5 w-full">
                        {(['直辖组', '营业区', '所辖'] as const).map((sc) => {
                          return (
                            <button
                              key={sc}
                              type="button"
                              onClick={() => {
                                setEditingScope(sc);
                                setEditingTargetNum('');
                              }}
                              className={`flex-1 py-1.5 text-center text-[10px] font-black tracking-wide transition-all rounded-lg select-none cursor-pointer ${
                                editingScope === sc
                                  ? 'bg-white text-[#00A758] shadow-xs'
                                  : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              {sc}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 12-Month Target Calendar Grid */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wide flex items-center gap-1">
                            <i className="fa-regular fa-calendar-days text-[#00A758]"></i>
                            {calendarYear}年度
                          </span>
                          <div className="flex items-center gap-1 bg-white border border-slate-200/80 px-1 py-0.5 rounded-lg shadow-3xs">
                            <button
                              type="button"
                              onClick={() => {
                                const prevYear = calendarYear - 1;
                                setCalendarYear(prevYear);
                                const currentM = selectedCalendarMonth.split('-')[1] || '06';
                                const newM = `${prevYear}-${currentM}`;
                                setSelectedCalendarMonth(newM);
                                const targetValSelected = teamMonthlyTargets[editingScope]?.[newM];
                                if (targetValSelected !== undefined) {
                                  setEditingTargetNum(targetValSelected.toString());
                                } else {
                                  setEditingTargetNum('');
                                }
                              }}
                              className="w-4 h-4 rounded hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all cursor-pointer active:scale-90"
                              title="上一年"
                            >
                              <i className="fa-solid fa-chevron-left text-[8px]"></i>
                            </button>
                            <span className="text-[9px] font-black text-[#00A758] px-1 min-w-[28px] text-center">
                              {calendarYear}年
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const nextYear = calendarYear + 1;
                                setCalendarYear(nextYear);
                                const currentM = selectedCalendarMonth.split('-')[1] || '06';
                                const newM = `${nextYear}-${currentM}`;
                                setSelectedCalendarMonth(newM);
                                const targetValSelected = teamMonthlyTargets[editingScope]?.[newM];
                                if (targetValSelected !== undefined) {
                                  setEditingTargetNum(targetValSelected.toString());
                                } else {
                                  setEditingTargetNum('');
                                }
                              }}
                              className="w-4 h-4 rounded hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all cursor-pointer active:scale-90"
                              title="下一年"
                            >
                              <i className="fa-solid fa-chevron-right text-[8px]"></i>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { value: `${calendarYear}-01`, label: '1月' },
                          { value: `${calendarYear}-02`, label: '2月' },
                          { value: `${calendarYear}-03`, label: '3月' },
                          { value: `${calendarYear}-04`, label: '4月' },
                          { value: `${calendarYear}-05`, label: '5月' },
                          { value: `${calendarYear}-06`, label: '6月' },
                          { value: `${calendarYear}-07`, label: '7月' },
                          { value: `${calendarYear}-08`, label: '8月' },
                          { value: `${calendarYear}-09`, label: '9月' },
                          { value: `${calendarYear}-10`, label: '10月' },
                          { value: `${calendarYear}-11`, label: '11月' },
                          { value: `${calendarYear}-12`, label: '12月' },
                        ].map((mObj) => {
                          const m = mObj.value;
                          const targetValSelected = teamMonthlyTargets[editingScope]?.[m];
                          const isSel = selectedCalendarMonth === m;
                          const hasTar = targetValSelected !== undefined;

                          return (
                            <div
                              key={m}
                              onClick={() => {
                                setSelectedCalendarMonth(m);
                                if (hasTar) {
                                  setEditingTargetNum(targetValSelected.toString());
                                } else {
                                  setEditingTargetNum('');
                                }
                              }}
                              className={`relative p-2 rounded-xl border text-center transition-all select-none cursor-pointer flex flex-col items-center justify-center min-h-[50px] ${
                                isSel
                                  ? 'border-[#00A758] bg-green-50/20 ring-2 ring-[#00A758]/25 shadow-2xs'
                                  : hasTar
                                    ? 'border-[#EAFDF3] bg-[#EAFDF3]/80 hover:bg-[#EAFDF3]'
                                    : 'border-slate-100 hover:bg-slate-50 text-slate-400 bg-white'
                              }`}
                            >
                              <span className={`text-[10px] font-black ${isSel ? 'text-[#00A758]' : 'text-slate-700'}`}>
                                {mObj.label}
                              </span>
                              {hasTar ? (
                                <span className="text-[9px] font-black text-[#00A758] mt-0.5 whitespace-nowrap bg-white/80 px-1 py-0.5 rounded border border-green-100">
                                  {targetValSelected} 人
                                </span>
                              ) : (
                                <span className="text-[8px] mt-0.5 opacity-60 text-slate-400">
                                  未设定
                                </span>
                              )}

                              {hasTar && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setTeamMonthlyTargets(prev => {
                                      const scopeTar = { ...prev[editingScope] };
                                      delete scopeTar[m];
                                      return {
                                        ...prev,
                                        [editingScope]: scopeTar
                                      };
                                    });
                                    if (selectedCalendarMonth === m) {
                                      setEditingTargetNum('');
                                    }
                                  }}
                                  className="absolute -top-1 -right-1 bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-colors p-0.5 rounded-full shadow-2xs w-4 h-4 flex items-center justify-center cursor-pointer"
                                  title="删除该月目标"
                                >
                                  <i className="fa-solid fa-trash-can text-[8px]"></i>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Inputs for selected month */}
                    <div className="bg-white p-3 border border-slate-200/80 rounded-xl space-y-2.5">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-wide">
                        <span>
                          设定 <b className="text-slate-800">{editingScope}</b> • <b className="text-[#00A758] font-extrabold">{parseInt(selectedCalendarMonth.split('-')[1])}月</b> 目标人数 (人)
                        </span>
                        {teamMonthlyTargets[editingScope]?.[selectedCalendarMonth] !== undefined && (
                          <span className="text-[9px] text-[#00A758] font-bold">
                            当前设定: {teamMonthlyTargets[editingScope][selectedCalendarMonth]} 人
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            min="1"
                            placeholder="目标人数"
                            value={editingTargetNum}
                            disabled={selectedCalendarMonth < currentMonthStr}
                            onChange={(e) => setEditingTargetNum(e.target.value)}
                            className={`w-full border rounded-xl py-1.5 px-3 text-xs font-black outline-none focus:ring-1 focus:ring-[#00A758]/30 focus:border-[#00A758] ${
                              selectedCalendarMonth < currentMonthStr
                                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10.5px] font-bold pointer-events-none">
                            人
                          </span>
                        </div>
                        <button
                          type="button"
                          disabled={selectedCalendarMonth < currentMonthStr}
                          onClick={() => {
                            if (selectedCalendarMonth < currentMonthStr) return;
                            const num = parseInt(editingTargetNum, 10);
                            if (isNaN(num) || num <= 0) {
                              alert('请输入有效的正整数目标人数');
                              return;
                            }
                            setTeamMonthlyTargets(prev => ({
                              ...prev,
                              [editingScope]: {
                                ...prev[editingScope],
                                [selectedCalendarMonth]: num
                              }
                            }));
                          }}
                          className={`px-4 py-1.5 text-xs font-black rounded-xl transition-all shadow-xs shrink-0 inline-flex items-center gap-1 ${
                            selectedCalendarMonth < currentMonthStr
                              ? 'text-slate-400 bg-slate-200 cursor-not-allowed'
                              : 'text-white bg-[#00A758] hover:bg-[#008b47] active:scale-95 cursor-pointer'
                          }`}
                        >
                          <i className="fa-regular fa-square-check"></i>
                          更改/保存
                        </button>
                      </div>
                      {selectedCalendarMonth < currentMonthStr && (
                        <p className="text-[9px] font-bold text-slate-400 flex items-center gap-1 pt-0.5">
                          <i className="fa-solid fa-circle-info text-[8px]"></i>
                          不支持对过去月份设立目标
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-1 border-t border-slate-100/50">
                      <button
                        type="button"
                        onClick={() => setIsTeamSettingTarget(false)}
                        className="w-full py-1.5 text-center text-xs font-black text-white bg-[#00A758] hover:bg-[#008b47] rounded-xl active:scale-95 transition-all shadow-xs cursor-pointer flex justify-center items-center gap-1"
                      >
                        <i className="fa-solid fa-check"></i>
                        确定并退出设定
                      </button>
                    </div>
                  </div>
                )}
              </div>
              )}

              {/* 2. 活动量看板 */}
              {activeMetricDashboard === '活动量看板' && (
                <div id="team-activity-dashboard" className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                    <h3 className="text-sm font-black text-slate-800 tracking-wide flex items-center gap-2">
                      <span className="w-1 bg-[#00A758] h-3.5 rounded-full inline-block"></span>
                      活动量看板
                    </h3>
                    <span className="text-[9.5px] font-black px-2 py-0.5 rounded shadow-xs border bg-green-50 text-[#00A758] border-green-100">
                      COP：{Math.round(38 * scopeMult * timeMult)}人
                    </span>
                  </div>

                  <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4 flex flex-col gap-3 font-bold text-[11px] font-sans">
                    {/* 第一行：建档、POP、深面 */}
                    <div className="flex items-center justify-between text-center">
                      <div className="flex-1 flex flex-col items-center justify-center gap-0.5 px-0.5 min-w-[50px]">
                        <span className="text-slate-500 font-bold text-[11px]">建档</span>
                        {isTargetSet && <span className="text-blue-500 font-bold text-[11px] bg-blue-50 px-1.5 py-0.5 rounded-full">
                          {Math.round(explicitTargetNum * funnelRatio.建档)}人
                        </span>}
                        <span className="text-slate-800 font-black text-sm">{Math.round(120 * scopeMult * timeMult)}人</span>
                        {isTargetSet && ((Math.round(explicitTargetNum * funnelRatio.建档) - Math.round(120 * scopeMult * timeMult)) > 0
                          ? <span className="text-rose-500 font-bold text-[9px]">
                            缺{Math.round(explicitTargetNum * funnelRatio.建档) - Math.round(120 * scopeMult * timeMult)}人
                          </span>
                          : <span className="font-bold text-[9px] invisible" aria-hidden="true">缺0人</span>)}
                      </div>
                      <span className="text-slate-300 font-light shrink-0">➔</span>
                      <div className="flex-1 flex flex-col items-center justify-center gap-0.5 px-0.5 min-w-[50px]">
                        <span className="text-slate-500 font-bold text-[11px]">POP</span>
                        {isTargetSet && <span className="text-blue-500 font-bold text-[11px] bg-blue-50 px-1.5 py-0.5 rounded-full">
                          {Math.round(explicitTargetNum * funnelRatio.POP)}人
                        </span>}
                        <span className="text-slate-800 font-black text-sm">{Math.round(100 * scopeMult * timeMult)}人</span>
                        {isTargetSet && ((Math.round(explicitTargetNum * funnelRatio.POP) - Math.round(100 * scopeMult * timeMult)) > 0
                          ? <span className="text-rose-500 font-bold text-[9px]">
                            缺{Math.round(explicitTargetNum * funnelRatio.POP) - Math.round(100 * scopeMult * timeMult)}人
                          </span>
                          : <span className="font-bold text-[9px] invisible" aria-hidden="true">缺0人</span>)}
                      </div>
                      <span className="text-slate-300 font-light shrink-0">➔</span>
                      <div className="flex-1 flex flex-col items-center justify-center gap-0.5 px-0.5 min-w-[50px]">
                        <span className="text-slate-500 font-bold text-[11px]">深面</span>
                        {isTargetSet && <span className="text-blue-500 font-bold text-[11px] bg-blue-50 px-1.5 py-0.5 rounded-full">
                          {Math.round(explicitTargetNum * funnelRatio.深面)}人
                        </span>}
                        <span className="text-slate-800 font-black text-sm">{Math.round(58 * scopeMult * timeMult)}人</span>
                        {isTargetSet && ((Math.round(explicitTargetNum * funnelRatio.深面) - Math.round(58 * scopeMult * timeMult)) > 0
                          ? <span className="text-rose-500 font-bold text-[9px]">
                            缺{Math.round(explicitTargetNum * funnelRatio.深面) - Math.round(58 * scopeMult * timeMult)}人
                          </span>
                          : <span className="font-bold text-[9px] invisible" aria-hidden="true">缺0人</span>)}
                      </div>
                    </div>

                    {/* 简单的自然流转 */}
                    <div className="flex items-center justify-between px-6 py-1">
                      <div className="flex-1 h-[1px] bg-slate-100"></div>
                      <span className="text-slate-300 font-light text-xs px-2 shrink-0">➔</span>
                      <div className="flex-1 h-[1px] bg-slate-100"></div>
                    </div>

                    {/* 第二行：决面、ITC、入司 */}
                    <div className="flex items-center justify-between text-center">
                      <div className="flex-1 flex flex-col items-center justify-center gap-0.5 px-0.5 min-w-[50px]">
                        <span className="text-slate-500 font-bold text-[11px]">决面</span>
                        {isTargetSet && <span className="text-blue-500 font-bold text-[11px] bg-blue-50 px-1.5 py-0.5 rounded-full">
                          {Math.round(explicitTargetNum * funnelRatio.决面)}人
                        </span>}
                        <span className="text-slate-800 font-black text-sm">{Math.round(48 * scopeMult * timeMult)}人</span>
                        {isTargetSet && ((Math.round(explicitTargetNum * funnelRatio.决面) - Math.round(48 * scopeMult * timeMult)) > 0
                          ? <span className="text-rose-500 font-bold text-[9px]">
                            缺{Math.round(explicitTargetNum * funnelRatio.决面) - Math.round(48 * scopeMult * timeMult)}人
                          </span>
                          : <span className="font-bold text-[9px] invisible" aria-hidden="true">缺0人</span>)}
                      </div>
                      <span className="text-slate-300 font-light shrink-0">➔</span>
                      <div className="flex-1 flex flex-col items-center justify-center gap-0.5 px-0.5 min-w-[50px]">
                        <span className="text-slate-500 font-bold text-[11px]">ITC</span>
                        {isTargetSet && <span className="text-blue-500 font-bold text-[11px] bg-blue-50 px-1.5 py-0.5 rounded-full">
                          {Math.round(explicitTargetNum * funnelRatio.ITC)}人
                        </span>}
                        <span className="text-slate-800 font-black text-sm">{Math.round(24 * scopeMult * timeMult)}人</span>
                        {isTargetSet && ((Math.round(explicitTargetNum * funnelRatio.ITC) - Math.round(24 * scopeMult * timeMult)) > 0
                          ? <span className="text-rose-500 font-bold text-[9px]">
                            缺{Math.round(explicitTargetNum * funnelRatio.ITC) - Math.round(24 * scopeMult * timeMult)}人
                          </span>
                          : <span className="font-bold text-[9px] invisible" aria-hidden="true">缺0人</span>)}
                      </div>
                      <span className="text-slate-300 font-light shrink-0">➔</span>
                      <div className="flex-1 flex flex-col items-center justify-center gap-0.5 px-0.5 min-w-[50px]">
                        <span className="text-slate-500 font-bold text-[11px]">入司</span>
                        {isTargetSet && <span className="text-blue-500 font-bold text-[11px] bg-blue-50 px-1.5 py-0.5 rounded-full">
                          {explicitTargetNum}人
                        </span>}
                        <span className="text-slate-800 font-black text-sm">{Math.round(11 * scopeMult * timeMult)}人</span>
                        {isTargetSet && ((explicitTargetNum - Math.round(11 * scopeMult * timeMult)) > 0
                          ? <span className="text-rose-500 font-bold text-[9px]">
                            缺{explicitTargetNum - Math.round(11 * scopeMult * timeMult)}人
                          </span>
                          : <span className="font-bold text-[9px] invisible" aria-hidden="true">缺0人</span>)}
                      </div>
                    </div>
                  </div>

                  {/* 提示话术（仅在设立目标时显示） */}
                  {isTargetSet && (
                  <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EC6453] shrink-0"></span>
                      <span>活动量缺口=目标所需-实际</span>
                    </div>
                  </div>
                  )}
                </div>
              )}

              {/* 3. 效能看板 */}
              {activeMetricDashboard === '效能看板' && (() => {
                const val_jiandang = Math.round(120 * scopeMult * timeMult);
                const val_pop = Math.round(100 * scopeMult * timeMult);
                const val_shenmian = Math.round(58 * scopeMult * timeMult);
                const val_juemian = Math.round(48 * scopeMult * timeMult);
                const val_cop = Math.round(38 * scopeMult * timeMult);
                const val_itc = Math.round(24 * scopeMult * timeMult);
                const val_rusi = Math.round(11 * scopeMult * timeMult);

                const step1_pct = val_jiandang > 0 ? ((val_pop / val_jiandang) * 100).toFixed(1) : '0.0';
                const step2_pct = val_pop > 0 ? ((val_shenmian / val_pop) * 100).toFixed(1) : '0.0';
                const step4_pct = val_shenmian > 0 ? ((val_juemian / val_shenmian) * 100).toFixed(1) : '0.0';
                const step5_pct = val_juemian > 0 ? ((val_itc / val_juemian) * 100).toFixed(1) : '0.0';
                const step6_pct = val_itc > 0 ? ((val_rusi / val_itc) * 100).toFixed(1) : '0.0';

                // Comparison target rates
                const compareData = {
                  '分公司': {
                    step1: 85.0,
                    step2: 74.0,
                    step3: 24.0,
                    step4: 89.0,
                    step5: 65.0,
                    step6: 91.0,
                    overall: 11.0
                  },
                  '全公司': {
                    step1: 75.0,
                    step2: 70.2,
                    step3: 60.5,
                    step4: 55.0,
                    step5: 52.0,
                    step6: 38.2,
                    overall: 7.2
                  }
                };

                const currentComp = compareData[efficiencyCompareTarget];

                const step1Green = parseFloat(step1_pct) >= currentComp.step1;
                const step2Green = parseFloat(step2_pct) >= currentComp.step3;
                const step4Green = parseFloat(step4_pct) >= currentComp.step4;
                const step5Green = parseFloat(step5_pct) >= currentComp.step5;
                const step6Green = parseFloat(step6_pct) >= currentComp.step6;
                // 建档 ➔ 入司整体转化率（展示为固定的 9%），用于漏斗评估标签判定
                const overall_pct = '9.0';
                // 漏斗评估：建档➔入司转化率是否超过对照（分公司）效能
                const funnelExcellent = parseFloat(overall_pct) >= currentComp.overall;

                return (
                  <div id="team-efficiency-dashboard" className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                      <h3 className="text-sm font-black text-slate-800 tracking-wide flex items-center gap-2">
                        <span className="w-1 bg-[#00A758] h-3.5 rounded-full inline-block"></span>
                        效能看板
                      </h3>
                      <span className={`text-[9.5px] font-black px-2 py-0.5 rounded border ${funnelExcellent ? 'text-[#00A758] bg-green-50 border-green-100' : 'text-[#EC6453] bg-rose-50 border-rose-100'}`}>
                        漏斗评估: {funnelExcellent ? '优质' : '待提升'}
                      </span>
                    </div>

                    {/* Legend / Compare Selector Info */}
                    <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 bg-slate-50/50 p-2 rounded-xl border border-slate-100/50">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#00A758]"></span>
                          <span className="text-slate-500">团队效能</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-1 h-3 bg-slate-700/80 rounded-full"></span>
                          <span className="text-slate-500">{efficiencyCompareTarget}效能 ({efficiencyCompareTarget === '分公司' ? '对照' : '标杆'})</span>
                        </div>
                      </div>
                      <span className="text-[#00A758] font-black">数值对比: 团队 / {efficiencyCompareTarget}</span>
                    </div>

                    {/* Conversion steps visually formatted */}
                    <div className="space-y-4 pt-1">
                      {/* Step 1 */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold font-sans">
                          <div className="flex items-center gap-2 w-1/3">
                            <span className={`w-4 h-4 ${step1Green ? 'bg-emerald-50 text-[#00A758]' : 'bg-rose-50 text-[#EC6453]'} rounded-full flex items-center justify-center text-[9px] font-mono`}>1</span>
                            <span className="text-slate-600">建档 ➔ POP</span>
                          </div>
                          <div className="flex-1 bg-slate-100 h-2 rounded-full relative mx-3">
                            <div className={`${step1Green ? 'bg-[#00A758]' : 'bg-[#EC6453]'} h-full rounded-full animate-pulse-slow max-w-full`} style={{ width: `${step1_pct}%` }}></div>
                            <div 
                              className="absolute w-1 h-3.5 bg-slate-700/85 rounded-full border border-white shadow-3xs -top-[3px] -translate-x-1/2 transition-all cursor-help" 
                              style={{ left: `${currentComp.step1}%` }}
                              title={`${efficiencyCompareTarget}: ${currentComp.step1}%`}
                            ></div>
                          </div>
                          <div className="flex items-center gap-1 justify-end w-24 text-right shrink-0">
                            <span className="font-extrabold text-slate-800 text-xs">{Math.round(parseFloat(step1_pct))}%</span>
                            <span className="text-[9px] text-slate-300">/</span>
                            <span className="text-[10px] font-bold text-slate-500" title={`${efficiencyCompareTarget}效能`}>{Math.round(currentComp.step1)}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pl-6 text-[9.5px] text-slate-400 font-semibold">
                          <span>流转人数：{val_jiandang}人 ➔ {val_pop}人</span>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold font-sans">
                          <div className="flex items-center gap-2 w-1/3">
                            <span className={`w-4 h-4 ${step2Green ? 'bg-emerald-50 text-[#00A758]' : 'bg-rose-50 text-[#EC6453]'} rounded-full flex items-center justify-center text-[9px] font-mono`}>2</span>
                            <span className="text-slate-600">POP ➔ 深面</span>
                          </div>
                          <div className="flex-1 bg-slate-100 h-2 rounded-full relative mx-3">
                            <div className={`${step2Green ? 'bg-[#00A758]' : 'bg-[#EC6453]'} h-full rounded-full animate-pulse-slow max-w-full`} style={{ width: `${step2_pct}%` }}></div>
                            <div 
                              className="absolute w-1 h-3.5 bg-slate-700/85 rounded-full border border-white shadow-3xs -top-[3px] -translate-x-1/2 transition-all cursor-help" 
                              style={{ left: `${currentComp.step3}%` }}
                              title={`${efficiencyCompareTarget}: ${currentComp.step3}%`}
                            ></div>
                          </div>
                          <div className="flex items-center gap-1 justify-end w-24 text-right shrink-0">
                            <span className="font-extrabold text-slate-800 text-xs">{Math.round(parseFloat(step2_pct))}%</span>
                            <span className="text-[9px] text-slate-300">/</span>
                            <span className="text-[10px] font-bold text-slate-500" title={`${efficiencyCompareTarget}效能`}>{Math.round(currentComp.step3)}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pl-6 text-[9.5px] text-slate-400 font-semibold">
                          <span>流转人数：{val_pop}人 ➔ {val_shenmian}人</span>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold font-sans">
                          <div className="flex items-center gap-2 w-1/3">
                            <span className={`w-4 h-4 ${step4Green ? 'bg-emerald-50 text-[#00A758]' : 'bg-rose-50 text-[#EC6453]'} rounded-full flex items-center justify-center text-[9px] font-mono`}>3</span>
                            <span className="text-slate-600">深面 ➔ 决面</span>
                          </div>
                          <div className="flex-1 bg-slate-100 h-2 rounded-full relative mx-3">
                            <div className={`${step4Green ? 'bg-[#00A758]' : 'bg-[#EC6453]'} h-full rounded-full animate-pulse-slow max-w-full`} style={{ width: `${step4_pct}%` }}></div>
                            <div 
                              className="absolute w-1 h-3.5 bg-slate-700/85 rounded-full border border-white shadow-3xs -top-[3px] -translate-x-1/2 transition-all cursor-help" 
                              style={{ left: `${currentComp.step4}%` }}
                              title={`${efficiencyCompareTarget}: ${currentComp.step4}%`}
                            ></div>
                          </div>
                          <div className="flex items-center gap-1 justify-end w-24 text-right shrink-0">
                            <span className="font-extrabold text-slate-800 text-xs">{Math.round(parseFloat(step4_pct))}%</span>
                            <span className="text-[9px] text-slate-300">/</span>
                            <span className="text-[10px] font-bold text-slate-500" title={`${efficiencyCompareTarget}效能`}>{Math.round(currentComp.step4)}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pl-6 text-[9.5px] text-slate-400 font-semibold">
                          <span>流转人数：{val_shenmian}人 ➔ {val_juemian}人</span>
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold font-sans">
                          <div className="flex items-center gap-2 w-1/3">
                            <span className={`w-4 h-4 ${step5Green ? 'bg-emerald-50 text-[#00A758]' : 'bg-rose-50 text-[#EC6453]'} rounded-full flex items-center justify-center text-[9px] font-mono`}>4</span>
                            <span className="text-slate-600">决面 ➔ ITC</span>
                          </div>
                          <div className="flex-1 bg-slate-100 h-2 rounded-full relative mx-3">
                            <div className={`${step5Green ? 'bg-[#00A758]' : 'bg-[#EC6453]'} h-full rounded-full animate-pulse-slow max-w-full`} style={{ width: `${step5_pct}%` }}></div>
                            <div 
                              className="absolute w-1 h-3.5 bg-slate-700/85 rounded-full border border-white shadow-3xs -top-[3px] -translate-x-1/2 transition-all cursor-help" 
                              style={{ left: `${currentComp.step5}%` }}
                              title={`${efficiencyCompareTarget}: ${currentComp.step5}%`}
                            ></div>
                          </div>
                          <div className="flex items-center gap-1 justify-end w-24 text-right shrink-0">
                            <span className="font-extrabold text-slate-800 text-xs">{Math.round(parseFloat(step5_pct))}%</span>
                            <span className="text-[9px] text-slate-300">/</span>
                            <span className="text-[10px] font-bold text-slate-500" title={`${efficiencyCompareTarget}效能`}>{Math.round(currentComp.step5)}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pl-6 text-[9.5px] text-slate-400 font-semibold">
                          <span>流转人数：{val_juemian}人 ➔ {val_itc}人</span>
                        </div>
                      </div>

                      {/* Step 5 */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold font-sans">
                          <div className="flex items-center gap-2 w-1/3">
                            <span className={`w-4 h-4 ${step6Green ? 'bg-emerald-50 text-[#00A758]' : 'bg-rose-50 text-[#EC6453]'} rounded-full flex items-center justify-center text-[9px] font-mono`}>5</span>
                            <span className="text-slate-600">ITC ➔ 入司</span>
                          </div>
                          <div className="flex-1 bg-slate-100 h-2 rounded-full relative mx-3">
                            <div className={`${step6Green ? 'bg-[#00A758]' : 'bg-[#EC6453]'} h-full rounded-full animate-pulse-slow max-w-full`} style={{ width: `${step6_pct}%` }}></div>
                            <div 
                              className="absolute w-1 h-3.5 bg-slate-700/85 rounded-full border border-white shadow-3xs -top-[3px] -translate-x-1/2 transition-all cursor-help" 
                              style={{ left: `${currentComp.step6}%` }}
                              title={`${efficiencyCompareTarget}: ${currentComp.step6}%`}
                            ></div>
                          </div>
                          <div className="flex items-center gap-1 justify-end w-24 text-right shrink-0">
                            <span className="font-extrabold text-slate-800 text-xs">{Math.round(parseFloat(step6_pct))}%</span>
                            <span className="text-[9px] text-slate-300">/</span>
                            <span className="text-[10px] font-bold text-slate-500" title={`${efficiencyCompareTarget}效能`}>{Math.round(currentComp.step6)}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pl-6 text-[9.5px] text-slate-400 font-semibold">
                          <span>流转人数：{val_itc}人 ➔ {val_rusi}人</span>
                        </div>
                      </div>

                      {/* 入司转化率 */}
                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-slate-700 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#00A758]"></span>
                            入司转化率
                          </h4>
                          <button 
                            onClick={() => setIsTeamEntryExpanded(!isTeamEntryExpanded)}
                            className="text-xs font-bold text-[#00A758]"
                          >
                            {isTeamEntryExpanded ? '收起' : '展开'}
                          </button>
                        </div>
                        
                        {[
                          { from: '建档', to: '入司', fromVal: val_jiandang, toVal: val_rusi, compareRate: currentComp.overall, overrideRate: overall_pct },
                          { from: 'POP', to: '入司', fromVal: val_pop, toVal: val_rusi, compareRate: 13 },
                          { from: '深面', to: '入司', fromVal: val_shenmian, toVal: val_rusi, compareRate: 53 },
                          { from: '决面', to: '入司', fromVal: val_juemian, toVal: val_rusi, compareRate: 59 },
                          { from: 'ITC', to: '入司', fromVal: val_itc, toVal: val_rusi, compareRate: currentComp.step6 },
                        ].filter((_, idx) => isTeamEntryExpanded || idx === 0).map((item, idx) => {
                          const rate = (item as { overrideRate?: string }).overrideRate ?? (item.fromVal > 0 ? ((item.toVal / item.fromVal) * 100).toFixed(1) : '0.0');
                          const isGreen = parseFloat(rate) >= item.compareRate;
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex items-center justify-between text-xs font-bold font-sans">
                                <div className="flex items-center gap-2 w-1/3">
                                  <span className={`w-4 h-4 ${isGreen ? 'bg-emerald-50 text-[#00A758]' : 'bg-rose-50 text-[#EC6453]'} rounded-full flex items-center justify-center text-[9px] font-mono`}>{idx + 1}</span>
                                  <span className="text-slate-600">{item.from} ➔ {item.to}</span>
                                </div>
                                <div className="flex-1 bg-slate-100 h-2 rounded-full relative mx-3">
                                  <div className={`${isGreen ? 'bg-[#00A758]' : 'bg-[#EC6453]'} h-full rounded-full max-w-full`} style={{ width: `${rate}%` }}></div>
                                  <div 
                                    className="absolute w-1 h-3.5 bg-slate-700/85 rounded-full border border-white shadow-3xs -top-[3px] -translate-x-1/2 transition-all" 
                                    style={{ left: `${item.compareRate}%` }}
                                  ></div>
                                </div>
                                <div className="flex items-center gap-1 justify-end w-24 text-right shrink-0">
                                  <span className={`font-extrabold text-xs ${isGreen ? 'text-[#00A758]' : 'text-[#EC6453]'}`}>{Math.round(parseFloat(rate))}%</span>
                                  <span className="text-[9px] text-slate-300">/</span>
                                  <span className="text-[10px] font-bold text-slate-500">{Math.round(item.compareRate)}%</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center pl-6 text-[9.5px] text-slate-400 font-semibold">
                                <span>流转人数：{item.fromVal}人 ➔ {item.toVal}人</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 4. 团队人员看板 (仅在效能看板tab页显示) */}
              {activeMetricDashboard === '效能看板' && (
              <div id="team-members-dashboard" className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                  <h3 className="text-sm font-black text-slate-800 tracking-wide flex items-center gap-2">
                    <span className="w-1 bg-[#00A758] h-3.5 rounded-full inline-block"></span>
                    团队人员看板
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold">
                    共贡献入司 <b>{actualNum}</b> 人
                  </span>
                </div>
                {/* 搜索框 */}
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 text-xs"></i>
                  <input
                    type="text"
                    placeholder="输入姓名搜索"
                    value={teamSearchKeyword}
                    onChange={(e) => setTeamSearchKeyword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A758]/30 focus:border-[#00A758] transition-all"
                  />
                </div>

                <div className="divide-y divide-slate-100">
                  {activeScope === '直辖组' ? (
                    <>
                      {/* Direct recruitment contributors list */}
                      {/* 杨毅 */}
                      {teamMatchesSearch('杨毅') && (
                      <div className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span>杨毅</span>
                            <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">FC</span>
                          </p>
                          <MemberMetricBadges
                            keyId="direct-yangyi"
                            isActivityDashboard={activeMetricDashboard === '活动量看板'}
                            metrics={activeMetricDashboard === '活动量看板' ? [
                              { label: '建档', value: Math.round(12 * timeMult) },
                              { label: 'POP', value: Math.round(8 * timeMult) },
                              { label: 'COP', value: Math.round(4 * timeMult) },
                              { label: 'ITC', value: Math.round(4 * timeMult) }
                            ] : [
                              { label: '建档', value: Math.round(12 * timeMult) },
                              { label: 'POP', value: Math.round(8 * timeMult) },
                              { label: '深面', value: Math.round(4 * timeMult) },
                              { label: '决面', value: Math.round(4 * timeMult) },
                              { label: 'ITC', value: Math.round(4 * timeMult) },
                              { label: '入司', value: Math.round(4 * timeMult) }
                            ]}
                          />
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="font-extrabold text-[#00A758] text-sm font-mono">{Math.round(4 * timeMult)}人入司</p>
                        </div>
                      </div>
                      )}

                      {/* 李晓明 */}
                      {teamMatchesSearch('李晓明') && (
                      <div className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span>李晓明</span>
                            <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">FC</span>
                          </p>
                          <MemberMetricBadges
                            keyId="direct-lixiaoming"
                            isActivityDashboard={activeMetricDashboard === '活动量看板'}
                            metrics={activeMetricDashboard === '活动量看板' ? [
                              { label: '建档', value: Math.round(10 * timeMult) },
                              { label: 'POP', value: Math.round(7 * timeMult) },
                              { label: 'COP', value: Math.round(3 * timeMult) },
                              { label: 'ITC', value: Math.round(3 * timeMult) }
                            ] : [
                              { label: '建档', value: Math.round(10 * timeMult) },
                              { label: 'POP', value: Math.round(7 * timeMult) },
                              { label: '深面', value: Math.round(3 * timeMult) },
                              { label: '决面', value: Math.round(3 * timeMult) },
                              { label: 'ITC', value: Math.round(3 * timeMult) },
                              { label: '入司', value: Math.round(3 * timeMult) }
                            ]}
                          />
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="font-extrabold text-[#00A758] text-sm font-mono">{Math.round(3 * timeMult)}人入司</p>
                        </div>
                      </div>
                      )}

                      {/* 徐丽华 */}
                      {teamMatchesSearch('徐丽华') && (
                      <div className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span>徐丽华</span>
                            <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">FC</span>
                          </p>
                          <MemberMetricBadges
                            keyId="direct-xulihua"
                            isActivityDashboard={activeMetricDashboard === '活动量看板'}
                            metrics={activeMetricDashboard === '活动量看板' ? [
                              { label: '建档', value: Math.round(8 * timeMult) },
                              { label: 'POP', value: Math.round(5 * timeMult) },
                              { label: 'COP', value: Math.round(2 * timeMult) },
                              { label: 'ITC', value: Math.round(2 * timeMult) }
                            ] : [
                              { label: '建档', value: Math.round(8 * timeMult) },
                              { label: 'POP', value: Math.round(5 * timeMult) },
                              { label: '深面', value: Math.round(2 * timeMult) },
                              { label: '决面', value: Math.round(2 * timeMult) },
                              { label: 'ITC', value: Math.round(2 * timeMult) },
                              { label: '入司', value: Math.round(2 * timeMult) }
                            ]}
                          />
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="font-extrabold text-[#00A758] text-sm font-mono">{Math.round(2 * timeMult)}人入司</p>
                        </div>
                      </div>
                      )}

                      {/* 王小林 */}
                      {teamMatchesSearch('王小林') && (
                      <div className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span>王小林</span>
                            <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">FC</span>
                          </p>
                          <MemberMetricBadges
                            keyId="direct-wangxiaolin"
                            isActivityDashboard={activeMetricDashboard === '活动量看板'}
                            metrics={activeMetricDashboard === '活动量看板' ? [
                              { label: '建档', value: Math.round(5 * timeMult) },
                              { label: 'POP', value: Math.round(3 * timeMult) },
                              { label: 'COP', value: Math.round(1 * timeMult) },
                              { label: 'ITC', value: Math.round(1 * timeMult) }
                            ] : [
                              { label: '建档', value: Math.round(5 * timeMult) },
                              { label: 'POP', value: Math.round(3 * timeMult) },
                              { label: '深面', value: Math.round(1 * timeMult) },
                              { label: '决面', value: Math.round(1 * timeMult) },
                              { label: 'ITC', value: Math.round(1 * timeMult) },
                              { label: '入司', value: Math.round(1 * timeMult) }
                            ]}
                          />
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="font-extrabold text-[#00A758] text-sm font-mono">{Math.round(1 * timeMult)}人入司</p>
                        </div>
                      </div>
                      )}

                      {/* 张艳 */}
                      {teamMatchesSearch('张艳') && (
                      <div className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span>张艳</span>
                            <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">FC</span>
                          </p>
                          <MemberMetricBadges
                            keyId="direct-zhangyan"
                            isActivityDashboard={activeMetricDashboard === '活动量看板'}
                            metrics={activeMetricDashboard === '活动量看板' ? [
                              { label: '建档', value: Math.round(3 * timeMult) },
                              { label: 'POP', value: Math.round(1 * timeMult) },
                              { label: 'COP', value: 0 },
                              { label: 'ITC', value: 0 }
                            ] : [
                              { label: '建档', value: Math.round(3 * timeMult) },
                              { label: 'POP', value: Math.round(1 * timeMult) },
                              { label: '深面', value: 0 },
                              { label: '决面', value: 0 },
                              { label: 'ITC', value: 0 },
                              { label: '入司', value: 0 }
                            ]}
                          />
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="font-extrabold text-slate-400 text-sm font-mono">0人入司</p>
                        </div>
                      </div>
                      )}
                    </>
                  ) : activeScope === '营业区' ? (
                    <>
                      {/* Division branch contributors list */}
                      {/* 杨毅 */}
                      {teamMatchesSearch('杨毅') && (
                      <div className="border border-slate-100/80 rounded-xl p-2.5 my-1.5 hover:bg-slate-50/50 transition-all duration-200 bg-white">
                        <div 
                          onClick={() => toggleManager('杨毅')}
                          className="flex items-center justify-between cursor-pointer select-none"
                        >
                          <div>
                            <p className="font-bold text-slate-800 flex items-center gap-1.5">
                              <span>杨毅</span>
                              <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">UM</span>
                              <span className="text-[9.50px] font-medium text-[#00A758] bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 ml-1">
                                {expandedManagers['杨毅'] ? (
                                  <>收起属员 <ChevronUp className="w-2.5 h-2.5" /></>
                                ) : (
                                  <>展开属员 <ChevronDown className="w-2.5 h-2.5" /></>
                                )}
                              </span>
                            </p>
                            <MemberMetricBadges
                              keyId="dist-yangyi"
                              isActivityDashboard={activeMetricDashboard === '活动量看板'}
                              metrics={activeMetricDashboard === '活动量看板' ? [
                                { label: '建档', value: Math.round(40 * timeMult) },
                                { label: 'POP', value: Math.round(30 * timeMult) },
                                { label: 'COP', value: Math.round(18 * timeMult) },
                                { label: 'ITC', value: Math.round(15 * timeMult) }
                              ] : [
                                { label: '建档', value: Math.round(40 * timeMult) },
                                { label: 'POP', value: Math.round(30 * timeMult) },
                                { label: '深面', value: Math.round(18 * timeMult) },
                                { label: '决面', value: Math.round(15 * timeMult) },
                                { label: 'ITC', value: Math.round(15 * timeMult) },
                                { label: '入司', value: Math.round(15 * timeMult) }
                              ]}
                            />
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            <p className="font-extrabold text-[#00A758] text-sm font-mono">{Math.round(15 * timeMult)}人入司</p>
                          </div>
                        </div>

                        {/* Subordinates of 杨毅 */}
                        {expandedManagers['杨毅'] && (
                          <div className="mt-3 pl-3 border-l-2 border-emerald-500 bg-slate-50/50 rounded-r-lg p-2.5 space-y-2.5 text-xs animate-fadeIn">
                            <div className="text-[9px] font-bold text-slate-400 tracking-wider mb-1 flex items-center gap-1 select-none">
                              <span className="w-1 h-1 bg-emerald-500 rounded-full inline-block"></span>
                              <span>直辖组管辖个人</span>
                            </div>
                            
                            {(!teamSearchKeyword.trim() || teamMatchesSearch('杨毅')) && (
                            <div className="flex items-center justify-between py-1 border-b border-dashed border-emerald-200/50 bg-emerald-50/30 rounded px-1">
                              <div>
                                <p className="font-bold text-[#00A758] flex items-center gap-1.5">
                                  <span>杨毅</span>
                                  <span className="text-[8.5px] font-normal text-[#00A758] bg-white border border-[#00A758]/20 px-1.5 py-0.5 rounded">UM</span>
                                </p>
                                <MemberMetricBadges
                                  keyId="dist-yangyi-self"
                                  isActivityDashboard={activeMetricDashboard === '活动量看板'}
                                  metrics={activeMetricDashboard === '活动量看板' ? [
                                    { label: '建档', value: Math.round(40 * timeMult) },
                                    { label: 'POP', value: Math.round(30 * timeMult) },
                                    { label: 'COP', value: Math.round(18 * timeMult) },
                                    { label: 'ITC', value: Math.round(15 * timeMult) }
                                  ] : [
                                    { label: '建档', value: Math.round(40 * timeMult) },
                                    { label: 'POP', value: Math.round(30 * timeMult) },
                                    { label: '深面', value: Math.round(18 * timeMult) },
                                    { label: '决面', value: Math.round(15 * timeMult) },
                                    { label: 'ITC', value: Math.round(15 * timeMult) },
                                    { label: '入司', value: Math.round(15 * timeMult) }
                                  ]}
                                />
                              </div>
                              <div className="text-right shrink-0 ml-2">
                                <p className="font-extrabold text-[#00A758] text-xs font-mono">{Math.round(15 * timeMult)}人入司</p>
                              </div>
                            </div>
                            )}

                            {(!teamSearchKeyword.trim() || teamMatchesSearch('杨毅')) && (
                            <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                              <div>
                                <p className="font-bold text-slate-700 flex items-center gap-1.5">
                                  <span>李晓明</span>
                                  <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                                </p>
                                <MemberMetricBadges
                                  keyId="dist-yangyi-lixiaoming"
                                  isActivityDashboard={activeMetricDashboard === '活动量看板'}
                                  metrics={[
                                    { label: '建档', value: Math.round(10 * timeMult) },
                                    { label: 'POP', value: Math.round(7 * timeMult) },
                                    { label: '深面', value: Math.round(3 * timeMult) },
                                    { label: '决面', value: Math.round(3 * timeMult) },
                                    { label: 'COP', value: Math.round(3 * timeMult) },
                                    { label: 'ITC', value: Math.round(3 * timeMult) },
                                    { label: '入司', value: Math.round(3 * timeMult) }
                                  ]}
                                />
                              </div>
                              <div className="text-right shrink-0 ml-2">
                                <p className="font-extrabold text-[#00A758] text-xs font-mono">{Math.round(3 * timeMult)}人入司</p>
                              </div>
                            </div>
                            )}

                            {(!teamSearchKeyword.trim() || teamMatchesSearch('杨毅')) && (
                            <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                              <div>
                                <p className="font-bold text-slate-700 flex items-center gap-1.5">
                                  <span>徐丽华</span>
                                  <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                                </p>
                                <MemberMetricBadges
                                  keyId="dist-yangyi-xulihua"
                                  isActivityDashboard={activeMetricDashboard === '活动量看板'}
                                  metrics={[
                                    { label: '建档', value: Math.round(8 * timeMult) },
                                    { label: 'POP', value: Math.round(5 * timeMult) },
                                    { label: '深面', value: Math.round(2 * timeMult) },
                                    { label: '决面', value: Math.round(2 * timeMult) },
                                    { label: 'COP', value: Math.round(2 * timeMult) },
                                    { label: 'ITC', value: Math.round(2 * timeMult) },
                                    { label: '入司', value: Math.round(2 * timeMult) }
                                  ]}
                                />
                              </div>
                              <div className="text-right shrink-0 ml-2">
                                <p className="font-extrabold text-[#00A758] text-xs font-mono">{Math.round(2 * timeMult)}人入司</p>
                              </div>
                            </div>
                            )}

                            {(!teamSearchKeyword.trim() || teamMatchesSearch('杨毅')) && (
                            <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                              <div>
                                <p className="font-bold text-slate-700 flex items-center gap-1.5">
                                  <span>王小林</span>
                                  <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                                </p>
                                <MemberMetricBadges
                                  keyId="dist-yangyi-wangxiaolin"
                                  isActivityDashboard={activeMetricDashboard === '活动量看板'}
                                  metrics={[
                                    { label: '建档', value: Math.round(5 * timeMult) },
                                    { label: 'POP', value: Math.round(3 * timeMult) },
                                    { label: '深面', value: Math.round(1 * timeMult) },
                                    { label: '决面', value: Math.round(1 * timeMult) },
                                    { label: 'COP', value: Math.round(1 * timeMult) },
                                    { label: 'ITC', value: Math.round(1 * timeMult) },
                                    { label: '入司', value: Math.round(1 * timeMult) }
                                  ]}
                                />
                              </div>
                              <div className="text-right shrink-0 ml-2">
                                <p className="font-extrabold text-[#00A758] text-xs font-mono">{Math.round(1 * timeMult)}人入司</p>
                              </div>
                            </div>
                            )}

                            {(!teamSearchKeyword.trim() || teamMatchesSearch('杨毅')) && (
                            <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                              <div>
                                <p className="font-bold text-slate-700 flex items-center gap-1.5">
                                  <span>张艳</span>
                                  <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                                </p>
                                <MemberMetricBadges
                                  keyId="dist-yangyi-zhangyan"
                                  isActivityDashboard={activeMetricDashboard === '活动量看板'}
                                  metrics={[
                                    { label: '建档', value: Math.round(3 * timeMult) },
                                    { label: 'POP', value: Math.round(1 * timeMult) },
                                    { label: '深面', value: 0 },
                                    { label: '决面', value: 0 },
                                    { label: 'COP', value: 0 },
                                    { label: 'ITC', value: 0 },
                                    { label: '入司', value: 0 }
                                  ]}
                                />
                              </div>
                              <div className="text-right shrink-0 ml-2">
                                <p className="font-extrabold text-slate-400 text-xs font-mono">0人入司</p>
                              </div>
                            </div>
                            )}
                          </div>
                        )}
                      </div>
                      )}

                      {/* 田雨 */}
                      {teamMatchesSearch('田雨') && (
                      <div className="border border-slate-100/80 rounded-xl p-2.5 my-1.5 hover:bg-slate-50/50 transition-all duration-200 bg-white">
                        <div 
                          onClick={() => toggleManager('田雨')}
                          className="flex items-center justify-between cursor-pointer select-none"
                        >
                          <div>
                            <p className="font-bold text-slate-800 flex items-center gap-1.5">
                              <span>田雨</span>
                              <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">SUM</span>
                              <span className="text-[9.50px] font-medium text-[#00A758] bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 ml-1">
                                {expandedManagers['田雨'] ? (
                                  <>收起属员 <ChevronUp className="w-2.5 h-2.5" /></>
                                ) : (
                                  <>展开属员 <ChevronDown className="w-2.5 h-2.5" /></>
                                )}
                              </span>
                            </p>
                            <MemberMetricBadges
                              keyId="dist-tianyu"
                              isActivityDashboard={activeMetricDashboard === '活动量看板'}
                              metrics={activeMetricDashboard === '活动量看板' ? [
                                { label: '建档', value: Math.round(35 * timeMult) },
                                { label: 'POP', value: Math.round(25 * timeMult) },
                                { label: 'COP', value: Math.round(14 * timeMult) },
                                { label: 'ITC', value: Math.round(12 * timeMult) }
                              ] : [
                                { label: '建档', value: Math.round(35 * timeMult) },
                                { label: 'POP', value: Math.round(25 * timeMult) },
                                { label: '深面', value: Math.round(14 * timeMult) },
                                { label: '决面', value: Math.round(12 * timeMult) },
                                { label: 'ITC', value: Math.round(12 * timeMult) },
                                { label: '入司', value: Math.round(12 * timeMult) }
                              ]}
                            />
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            <p className="font-extrabold text-[#00A758] text-sm font-mono">{Math.round(12 * timeMult)}人入司</p>
                          </div>
                        </div>

                        {/* Subordinates of 田雨 */}
                        {expandedManagers['田雨'] && (
                          <div className="mt-3 pl-3 border-l-2 border-emerald-500 bg-slate-50/50 rounded-r-lg p-2.5 space-y-2.5 text-xs animate-fadeIn">
                            <div className="text-[9px] font-bold text-slate-400 tracking-wider mb-1 flex items-center gap-1 select-none">
                              <span className="w-1 h-1 bg-emerald-500 rounded-full inline-block"></span>
                              <span>直辖组管辖个人</span>
                            </div>

                            {(!teamSearchKeyword.trim() || teamMatchesSearch('田雨')) && (
                            <div className="flex items-center justify-between py-1 border-b border-dashed border-emerald-200/50 bg-emerald-50/30 rounded px-1">
                              <div>
                                <p className="font-bold text-[#00A758] flex items-center gap-1.5">
                                  <span>田雨</span>
                                  <span className="text-[8.5px] font-normal text-[#00A758] bg-white border border-[#00A758]/20 px-1.5 py-0.5 rounded">SUM</span>
                                </p>
                                <MemberMetricBadges
                                  keyId="dist-tianyu-self"
                                  isActivityDashboard={activeMetricDashboard === '活动量看板'}
                                  metrics={activeMetricDashboard === '活动量看板' ? [
                                    { label: '建档', value: Math.round(35 * timeMult) },
                                    { label: 'POP', value: Math.round(25 * timeMult) },
                                    { label: 'COP', value: Math.round(14 * timeMult) },
                                    { label: 'ITC', value: Math.round(12 * timeMult) }
                                  ] : [
                                    { label: '建档', value: Math.round(35 * timeMult) },
                                    { label: 'POP', value: Math.round(25 * timeMult) },
                                    { label: '深面', value: Math.round(14 * timeMult) },
                                    { label: '决面', value: Math.round(12 * timeMult) },
                                    { label: 'ITC', value: Math.round(12 * timeMult) },
                                    { label: '入司', value: Math.round(12 * timeMult) }
                                  ]}
                                />
                              </div>
                              <div className="text-right shrink-0 ml-2">
                                <p className="font-extrabold text-[#00A758] text-xs font-mono">{Math.round(12 * timeMult)}人入司</p>
                              </div>
                            </div>
                            )}

                            {(!teamSearchKeyword.trim() || teamMatchesSearch('田雨')) && (
                            <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                              <div>
                                <p className="font-bold text-slate-700 flex items-center gap-1.5">
                                  <span>陈志强</span>
                                  <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                                </p>
                                <MemberMetricBadges
                                  keyId="dist-tianyu-chenzhiqiang"
                                  isActivityDashboard={activeMetricDashboard === '活动量看板'}
                                  metrics={[
                                    { label: '建档', value: Math.round(11 * timeMult) },
                                    { label: 'POP', value: Math.round(8 * timeMult) },
                                    { label: '深面', value: Math.round(4 * timeMult) },
                                    { label: '决面', value: Math.round(4 * timeMult) },
                                    { label: 'COP', value: Math.round(3 * timeMult) },
                                    { label: 'ITC', value: Math.round(3 * timeMult) },
                                    { label: '入司', value: Math.round(3 * timeMult) }
                                  ]}
                                />
                              </div>
                              <div className="text-right shrink-0 ml-2">
                                <p className="font-extrabold text-[#00A758] text-xs font-mono">{Math.round(3 * timeMult)}人入司</p>
                              </div>
                            </div>
                            )}

                            {(!teamSearchKeyword.trim() || teamMatchesSearch('田雨')) && (
                            <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                              <div>
                                <p className="font-bold text-slate-700 flex items-center gap-1.5">
                                  <span>刘洋</span>
                                  <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                                </p>
                                <MemberMetricBadges
                                  keyId="dist-tianyu-liuyang"
                                  isActivityDashboard={activeMetricDashboard === '活动量看板'}
                                  metrics={[
                                    { label: '建档', value: Math.round(7 * timeMult) },
                                    { label: 'POP', value: Math.round(5 * timeMult) },
                                    { label: '深面', value: Math.round(2 * timeMult) },
                                    { label: '决面', value: Math.round(2 * timeMult) },
                                    { label: 'COP', value: Math.round(2 * timeMult) },
                                    { label: 'ITC', value: Math.round(2 * timeMult) },
                                    { label: '入司', value: Math.round(2 * timeMult) }
                                  ]}
                                />
                              </div>
                              <div className="text-right shrink-0 ml-2">
                                <p className="font-extrabold text-[#00A758] text-xs font-mono">{Math.round(2 * timeMult)}人入司</p>
                              </div>
                            </div>
                            )}

                            {(!teamSearchKeyword.trim() || teamMatchesSearch('田雨')) && (
                            <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                              <div>
                                <p className="font-bold text-slate-700 flex items-center gap-1.5">
                                  <span>赵慧</span>
                                  <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                                </p>
                                <MemberMetricBadges
                                  keyId="dist-tianyu-zhaohui"
                                  isActivityDashboard={activeMetricDashboard === '活动量看板'}
                                  metrics={[
                                    { label: '建档', value: Math.round(4 * timeMult) },
                                    { label: 'POP', value: Math.round(3 * timeMult) },
                                    { label: '深面', value: 0 },
                                    { label: '决面', value: 0 },
                                    { label: 'COP', value: Math.round(1 * timeMult) },
                                    { label: 'ITC', value: Math.round(1 * timeMult) },
                                    { label: '入司', value: Math.round(1 * timeMult) }
                                  ]}
                                />
                              </div>
                              <div className="text-right shrink-0 ml-2">
                                <p className="font-extrabold text-[#00A758] text-xs font-mono">{Math.round(1 * timeMult)}人入司</p>
                              </div>
                            </div>
                            )}
                          </div>
                        )}
                      </div>
                      )}

                      {/* 钱鹏 */}
                      {teamMatchesSearch('钱鹏') && (
                      <div className="border border-slate-100/80 rounded-xl p-2.5 my-1.5 hover:bg-slate-50/50 transition-all duration-200 bg-white">
                        <div 
                          onClick={() => toggleManager('钱鹏')}
                          className="flex items-center justify-between cursor-pointer select-none"
                        >
                          <div>
                            <p className="font-bold text-slate-800 flex items-center gap-1.5">
                              <span>钱鹏</span>
                              <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">UM</span>
                              <span className="text-[9.50px] font-medium text-[#00A758] bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 ml-1">
                                {expandedManagers['钱鹏'] ? (
                                  <>收起属员 <ChevronUp className="w-2.5 h-2.5" /></>
                                ) : (
                                  <>展开属员 <ChevronDown className="w-2.5 h-2.5" /></>
                                )}
                              </span>
                            </p>
                            <MemberMetricBadges
                              keyId="dist-qianpeng"
                              isActivityDashboard={activeMetricDashboard === '活动量看板'}
                              metrics={activeMetricDashboard === '活动量看板' ? [
                                { label: '建档', value: Math.round(30 * timeMult) },
                                { label: 'POP', value: Math.round(18 * timeMult) },
                                { label: 'COP', value: Math.round(10 * timeMult) },
                                { label: 'ITC', value: Math.round(10 * timeMult) }
                              ] : [
                                { label: '建档', value: Math.round(30 * timeMult) },
                                { label: 'POP', value: Math.round(18 * timeMult) },
                                { label: '深面', value: Math.round(10 * timeMult) },
                                { label: '决面', value: Math.round(10 * timeMult) },
                                { label: 'ITC', value: Math.round(10 * timeMult) },
                                { label: '入司', value: Math.round(10 * timeMult) }
                              ]}
                            />
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            <p className="font-extrabold text-[#00A758] text-sm font-mono">{Math.round(10 * timeMult)}人入司</p>
                          </div>
                        </div>

                        {/* Subordinates of 钱鹏 */}
                        {expandedManagers['钱鹏'] && (
                          <div className="mt-3 pl-3 border-l-2 border-emerald-500 bg-slate-50/50 rounded-r-lg p-2.5 space-y-2.5 text-xs animate-fadeIn">
                            <div className="text-[9px] font-bold text-slate-400 tracking-wider mb-1 flex items-center gap-1 select-none">
                              <span className="w-1 h-1 bg-emerald-500 rounded-full inline-block"></span>
                              <span>直辖组管辖个人</span>
                            </div>

                            {(!teamSearchKeyword.trim() || teamMatchesSearch('钱鹏')) && (
                            <div className="flex items-center justify-between py-1 border-b border-dashed border-emerald-200/50 bg-emerald-50/30 rounded px-1">
                              <div>
                                <p className="font-bold text-[#00A758] flex items-center gap-1.5">
                                  <span>钱鹏</span>
                                  <span className="text-[8.5px] font-normal text-[#00A758] bg-white border border-[#00A758]/20 px-1.5 py-0.5 rounded">UM</span>
                                </p>
                                <MemberMetricBadges
                                  keyId="dist-qianpeng-self"
                                  isActivityDashboard={activeMetricDashboard === '活动量看板'}
                                  metrics={activeMetricDashboard === '活动量看板' ? [
                                    { label: '建档', value: Math.round(30 * timeMult) },
                                    { label: 'POP', value: Math.round(18 * timeMult) },
                                    { label: 'COP', value: Math.round(10 * timeMult) },
                                    { label: 'ITC', value: Math.round(10 * timeMult) }
                                  ] : [
                                    { label: '建档', value: Math.round(30 * timeMult) },
                                    { label: 'POP', value: Math.round(18 * timeMult) },
                                    { label: '深面', value: Math.round(10 * timeMult) },
                                    { label: '决面', value: Math.round(10 * timeMult) },
                                    { label: 'ITC', value: Math.round(10 * timeMult) },
                                    { label: '入司', value: Math.round(10 * timeMult) }
                                  ]}
                                />
                              </div>
                              <div className="text-right shrink-0 ml-2">
                                <p className="font-extrabold text-[#00A758] text-xs font-mono">{Math.round(10 * timeMult)}人入司</p>
                              </div>
                            </div>
                            )}

                            {(!teamSearchKeyword.trim() || teamMatchesSearch('钱鹏')) && (
                            <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                              <div>
                                <p className="font-bold text-slate-700 flex items-center gap-1.5">
                                  <span>黄建国</span>
                                  <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                                </p>
                                <MemberMetricBadges
                                  keyId="dist-qianpeng-huangjianguo"
                                  isActivityDashboard={activeMetricDashboard === '活动量看板'}
                                  metrics={[
                                    { label: '建档', value: Math.round(9 * timeMult) },
                                    { label: 'POP', value: Math.round(6 * timeMult) },
                                    { label: '深面', value: Math.round(3 * timeMult) },
                                    { label: '决面', value: Math.round(3 * timeMult) },
                                    { label: 'COP', value: Math.round(2 * timeMult) },
                                    { label: 'ITC', value: Math.round(2 * timeMult) },
                                    { label: '入司', value: Math.round(2 * timeMult) }
                                  ]}
                                />
                              </div>
                              <div className="text-right shrink-0 ml-2">
                                <p className="font-extrabold text-[#00A758] text-xs font-mono">{Math.round(2 * timeMult)}人入司</p>
                              </div>
                            </div>
                            )}

                            {(!teamSearchKeyword.trim() || teamMatchesSearch('钱鹏')) && (
                            <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                              <div>
                                <p className="font-bold text-slate-700 flex items-center gap-1.5">
                                  <span>曾建明</span>
                                  <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                                </p>
                                <MemberMetricBadges
                                  keyId="dist-qianpeng-zengjianming"
                                  isActivityDashboard={activeMetricDashboard === '活动量看板'}
                                  metrics={[
                                    { label: '建档', value: Math.round(6 * timeMult) },
                                    { label: 'POP', value: Math.round(4 * timeMult) },
                                    { label: '深面', value: Math.round(2 * timeMult) },
                                    { label: '决面', value: Math.round(2 * timeMult) },
                                    { label: 'COP', value: Math.round(1 * timeMult) },
                                    { label: 'ITC', value: Math.round(1 * timeMult) },
                                    { label: '入司', value: Math.round(1 * timeMult) }
                                  ]}
                                />
                              </div>
                              <div className="text-right shrink-0 ml-2">
                                <p className="font-extrabold text-[#00A758] text-xs font-mono">{Math.round(1 * timeMult)}人入司</p>
                              </div>
                            </div>
                            )}

                            {(!teamSearchKeyword.trim() || teamMatchesSearch('钱鹏')) && (
                            <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                              <div>
                                <p className="font-bold text-slate-700 flex items-center gap-1.5">
                                  <span>邓小凤</span>
                                  <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                                </p>
                                <MemberMetricBadges
                                  keyId="dist-qianpeng-dengxiaofeng"
                                  isActivityDashboard={activeMetricDashboard === '活动量看板'}
                                  metrics={[
                                    { label: '建档', value: Math.round(3 * timeMult) },
                                    { label: 'POP', value: Math.round(2 * timeMult) },
                                    { label: '深面', value: 0 },
                                    { label: '决面', value: 0 },
                                    { label: 'COP', value: 0 },
                                    { label: 'ITC', value: 0 },
                                    { label: '入司', value: 0 }
                                  ]}
                                />
                              </div>
                              <div className="text-right shrink-0 ml-2">
                                <p className="font-extrabold text-slate-400 text-xs font-mono">0人入司</p>
                              </div>
                            </div>
                            )}
                          </div>
                        )}
                      </div>
                      )}

                      {/* 郑卫红 */}
                      {teamMatchesSearch('郑卫红') && (
                      <div className="border border-slate-100/80 rounded-xl p-2.5 my-1.5 hover:bg-slate-50/50 transition-all duration-200 bg-white">
                        <div 
                          onClick={() => toggleManager('郑卫红')}
                          className="flex items-center justify-between cursor-pointer select-none"
                        >
                          <div>
                            <p className="font-bold text-slate-800 flex items-center gap-1.5">
                              <span>郑卫红</span>
                              <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">UM</span>
                              <span className="text-[9.50px] font-medium text-[#00A758] bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 ml-1">
                                {expandedManagers['郑卫红'] ? (
                                  <>收起属员 <ChevronUp className="w-2.5 h-2.5" /></>
                                ) : (
                                  <>展开属员 <ChevronDown className="w-2.5 h-2.5" /></>
                                )}
                              </span>
                            </p>
                            <MemberMetricBadges
                              keyId="dist-zhengweihong"
                              isActivityDashboard={activeMetricDashboard === '活动量看板'}
                              metrics={activeMetricDashboard === '活动量看板' ? [
                                { label: '建档', value: Math.round(25 * timeMult) },
                                { label: 'POP', value: Math.round(15 * timeMult) },
                                { label: 'COP', value: Math.round(7 * timeMult) },
                                { label: 'ITC', value: Math.round(8 * timeMult) }
                              ] : [
                                { label: '建档', value: Math.round(25 * timeMult) },
                                { label: 'POP', value: Math.round(15 * timeMult) },
                                { label: '深面', value: Math.round(7 * timeMult) },
                                { label: '决面', value: Math.round(7 * timeMult) },
                                { label: 'ITC', value: Math.round(8 * timeMult) },
                                { label: '入司', value: Math.round(8 * timeMult) }
                              ]}
                            />
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            <p className="font-extrabold text-[#00A758] text-sm font-mono">{Math.round(8 * timeMult)}人入司</p>
                          </div>
                        </div>

                        {/* Subordinates of 郑卫红 */}
                        {expandedManagers['郑卫红'] && (
                          <div className="mt-3 pl-3 border-l-2 border-emerald-500 bg-slate-50/50 rounded-r-lg p-2.5 space-y-2.5 text-xs animate-fadeIn">
                            <div className="text-[9px] font-bold text-slate-400 tracking-wider mb-1 flex items-center gap-1 select-none">
                              <span className="w-1 h-1 bg-emerald-500 rounded-full inline-block"></span>
                              <span>直辖组管辖个人</span>
                            </div>

                            {(!teamSearchKeyword.trim() || teamMatchesSearch('郑卫红')) && (
                            <div className="flex items-center justify-between py-1 border-b border-dashed border-emerald-200/50 bg-emerald-50/30 rounded px-1">
                              <div>
                                <p className="font-bold text-[#00A758] flex items-center gap-1.5">
                                  <span>郑卫红</span>
                                  <span className="text-[8.5px] font-normal text-[#00A758] bg-white border border-[#00A758]/20 px-1.5 py-0.5 rounded">UM</span>
                                </p>
                                <MemberMetricBadges
                                  keyId="dist-zhengweihong-self"
                                  isActivityDashboard={activeMetricDashboard === '活动量看板'}
                                  metrics={activeMetricDashboard === '活动量看板' ? [
                                    { label: '建档', value: Math.round(25 * timeMult) },
                                    { label: 'POP', value: Math.round(15 * timeMult) },
                                    { label: 'COP', value: Math.round(7 * timeMult) },
                                    { label: 'ITC', value: Math.round(8 * timeMult) }
                                  ] : [
                                    { label: '建档', value: Math.round(25 * timeMult) },
                                    { label: 'POP', value: Math.round(15 * timeMult) },
                                    { label: '深面', value: Math.round(7 * timeMult) },
                                    { label: '决面', value: Math.round(7 * timeMult) },
                                    { label: 'ITC', value: Math.round(8 * timeMult) },
                                    { label: '入司', value: Math.round(8 * timeMult) }
                                  ]}
                                />
                              </div>
                              <div className="text-right shrink-0 ml-2">
                                <p className="font-extrabold text-[#00A758] text-xs font-mono">{Math.round(8 * timeMult)}人入司</p>
                              </div>
                            </div>
                            )}

                            {(!teamSearchKeyword.trim() || teamMatchesSearch('郑卫红')) && (
                            <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                              <div>
                                <p className="font-bold text-slate-700 flex items-center gap-1.5">
                                  <span>郭建华</span>
                                  <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                                </p>
                                <MemberMetricBadges
                                  keyId="dist-zhengweihong-guojianhua"
                                  isActivityDashboard={activeMetricDashboard === '活动量看板'}
                                  metrics={[
                                    { label: '建档', value: Math.round(8 * timeMult) },
                                    { label: 'POP', value: Math.round(5 * timeMult) },
                                    { label: '深面', value: Math.round(2 * timeMult) },
                                    { label: '决面', value: Math.round(2 * timeMult) },
                                    { label: 'COP', value: Math.round(1 * timeMult) },
                                    { label: 'ITC', value: Math.round(1 * timeMult) },
                                    { label: '入司', value: Math.round(1 * timeMult) }
                                  ]}
                                />
                              </div>
                              <div className="text-right shrink-0 ml-2">
                                <p className="font-extrabold text-[#00A758] text-xs font-mono">{Math.round(1 * timeMult)}人入司</p>
                              </div>
                            </div>
                            )}

                            {(!teamSearchKeyword.trim() || teamMatchesSearch('郑卫红')) && (
                            <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                              <div>
                                <p className="font-bold text-slate-700 flex items-center gap-1.5">
                                  <span>彭玉琴</span>
                                  <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                                </p>
                                <MemberMetricBadges
                                  keyId="dist-zhengweihong-pengyuqin"
                                  isActivityDashboard={activeMetricDashboard === '活动量看板'}
                                  metrics={[
                                    { label: '建档', value: Math.round(5 * timeMult) },
                                    { label: 'POP', value: Math.round(3 * timeMult) },
                                    { label: '深面', value: 0 },
                                    { label: '决面', value: 0 },
                                    { label: 'COP', value: Math.round(1 * timeMult) },
                                    { label: 'ITC', value: Math.round(1 * timeMult) },
                                    { label: '入司', value: Math.round(1 * timeMult) }
                                  ]}
                                />
                              </div>
                              <div className="text-right shrink-0 ml-2">
                                <p className="font-extrabold text-[#00A758] text-xs font-mono">{Math.round(1 * timeMult)}人入司</p>
                              </div>
                            </div>
                            )}

                            {(!teamSearchKeyword.trim() || teamMatchesSearch('郑卫红')) && (
                            <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                              <div>
                                <p className="font-bold text-slate-700 flex items-center gap-1.5">
                                  <span>欧阳龙</span>
                                  <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                                </p>
                                <MemberMetricBadges
                                  keyId="dist-zhengweihong-ouyanglong"
                                  isActivityDashboard={activeMetricDashboard === '活动量看板'}
                                  metrics={[
                                    { label: '建档', value: Math.round(3 * timeMult) },
                                    { label: 'POP', value: Math.round(1 * timeMult) },
                                    { label: '深面', value: 0 },
                                    { label: '决面', value: 0 },
                                    { label: 'COP', value: 0 },
                                    { label: 'ITC', value: 0 },
                                    { label: '入司', value: 0 }
                                  ]}
                                />
                              </div>
                              <div className="text-right shrink-0 ml-2">
                                <p className="font-extrabold text-slate-400 text-xs font-mono">0人入司</p>
                              </div>
                            </div>
                            )}
                          </div>
                        )}
                      </div>
                      )}

                      {/* --- 直辖组属员 (直辖组人员加入营业区看板) --- */}
                      <div className="py-2 flex items-center gap-1.5 px-0.5 bg-slate-50/50 my-1 rounded">
                        <span className="w-1 bg-[#00A758] h-2.5 rounded-full inline-block"></span>
                        <span className="text-[9px] font-bold text-slate-400">直辖组管辖个人</span>
                      </div>

                      {teamMatchesSearch('杨毅') && (
                      <div className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span>杨毅</span>
                            <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">FC</span>
                          </p>
                          <MemberMetricBadges
                            keyId="dist-sub-yangyi"
                            isActivityDashboard={activeMetricDashboard === '活动量看板'}
                            metrics={[
                              { label: '建档', value: Math.round(12 * timeMult) },
                              { label: 'POP', value: Math.round(8 * timeMult) },
                              { label: '深面', value: Math.round(5 * timeMult) },
                              { label: '决面', value: Math.round(4 * timeMult) },
                              { label: 'COP', value: Math.round(4 * timeMult) },
                              { label: 'ITC', value: Math.round(4 * timeMult) },
                              { label: '入司', value: Math.round(4 * timeMult) }
                            ]}
                          />
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="font-extrabold text-[#00A758] text-sm font-mono">{Math.round(4 * timeMult)}人入司</p>
                        </div>
                      </div>
                      )}

                      {teamMatchesSearch('李晓明') && (
                      <div className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span>李晓明</span>
                            <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">FC</span>
                          </p>
                          <MemberMetricBadges
                            keyId="dist-sub-lixiaoming"
                            isActivityDashboard={activeMetricDashboard === '活动量看板'}
                            metrics={[
                              { label: '建档', value: Math.round(10 * timeMult) },
                              { label: 'POP', value: Math.round(7 * timeMult) },
                              { label: '深面', value: Math.round(4 * timeMult) },
                              { label: '决面', value: Math.round(3 * timeMult) },
                              { label: 'COP', value: Math.round(3 * timeMult) },
                              { label: 'ITC', value: Math.round(3 * timeMult) },
                              { label: '入司', value: Math.round(3 * timeMult) }
                            ]}
                          />
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="font-extrabold text-[#00A758] text-sm font-mono">{Math.round(3 * timeMult)}人入司</p>
                        </div>
                      </div>
                      )}

                      {teamMatchesSearch('徐丽华') && (
                      <div className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span>徐丽华</span>
                            <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">FC</span>
                          </p>
                          <MemberMetricBadges
                            keyId="dist-sub-xulihua"
                            isActivityDashboard={activeMetricDashboard === '活动量看板'}
                            metrics={[
                              { label: '建档', value: Math.round(8 * timeMult) },
                              { label: 'POP', value: Math.round(5 * timeMult) },
                              { label: '深面', value: Math.round(2 * timeMult) },
                              { label: '决面', value: Math.round(2 * timeMult) },
                              { label: 'COP', value: Math.round(2 * timeMult) },
                              { label: 'ITC', value: Math.round(2 * timeMult) },
                              { label: '入司', value: Math.round(2 * timeMult) }
                            ]}
                          />
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="font-extrabold text-[#00A758] text-sm font-mono">{Math.round(2 * timeMult)}人入司</p>
                        </div>
                      </div>
                      )}

                      {teamMatchesSearch('王小林') && (
                      <div className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span>王小林</span>
                            <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">FC</span>
                          </p>
                          <MemberMetricBadges
                            keyId="dist-sub-wangxiaolin"
                            isActivityDashboard={activeMetricDashboard === '活动量看板'}
                            metrics={[
                              { label: '建档', value: Math.round(5 * timeMult) },
                              { label: 'POP', value: Math.round(3 * timeMult) },
                              { label: '深面', value: Math.round(1 * timeMult) },
                              { label: '决面', value: Math.round(1 * timeMult) },
                              { label: 'COP', value: Math.round(1 * timeMult) },
                              { label: 'ITC', value: Math.round(1 * timeMult) },
                              { label: '入司', value: Math.round(1 * timeMult) }
                            ]}
                          />
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="font-extrabold text-[#00A758] text-sm font-mono">{Math.round(1 * timeMult)}人入司</p>
                        </div>
                      </div>
                      )}

                      {teamMatchesSearch('张艳') && (
                      <div className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span>张艳</span>
                            <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">FC</span>
                          </p>
                          <MemberMetricBadges
                            keyId="dist-sub-zhangyan"
                            isActivityDashboard={activeMetricDashboard === '活动量看板'}
                            metrics={[
                              { label: '建档', value: Math.round(3 * timeMult) },
                              { label: 'POP', value: Math.round(1 * timeMult) },
                              { label: '深面', value: 0 },
                              { label: '决面', value: 0 },
                              { label: 'COP', value: 0 },
                              { label: 'ITC', value: 0 },
                              { label: '入司', value: 0 }
                            ]}
                          />
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="font-extrabold text-slate-400 text-sm font-mono">0人入司</p>
                        </div>
                      </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Overall regional contributors list */}
                      {teamMatchesSearch('杨毅') && (
                      <div className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span>杨毅</span>
                            <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">UM</span>
                          </p>
                          <MemberMetricBadges
                            keyId="dist-contrib-yangyi"
                            isActivityDashboard={activeMetricDashboard === '活动量看板'}
                            metrics={activeMetricDashboard === '活动量看板' ? [
                              { label: '建档', value: Math.round(120 * timeMult) },
                              { label: 'POP', value: Math.round(90 * timeMult) },
                              { label: 'COP', value: Math.round(55 * timeMult) },
                              { label: 'ITC', value: Math.round(48 * timeMult) }
                            ] : [
                              { label: '建档', value: Math.round(120 * timeMult) },
                              { label: 'POP', value: Math.round(90 * timeMult) },
                              { label: '深面', value: Math.round(55 * timeMult) },
                              { label: '决面', value: Math.round(48 * timeMult) },
                              { label: 'ITC', value: Math.round(48 * timeMult) },
                              { label: '入司', value: Math.round(48 * timeMult) }
                            ]}
                          />
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="font-extrabold text-[#00A758] text-sm font-mono">{Math.round(48 * timeMult)}人入司</p>
                        </div>
                      </div>
                      )}

                      {teamMatchesSearch('田雨') && (
                      <div className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span>田雨</span>
                            <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">SUM</span>
                          </p>
                          <MemberMetricBadges
                            keyId="dist-contrib-tianyu"
                            isActivityDashboard={activeMetricDashboard === '活动量看板'}
                            metrics={activeMetricDashboard === '活动量看板' ? [
                              { label: '建档', value: Math.round(100 * timeMult) },
                              { label: 'POP', value: Math.round(75 * timeMult) },
                              { label: 'COP', value: Math.round(45 * timeMult) },
                              { label: 'ITC', value: Math.round(38 * timeMult) }
                            ] : [
                              { label: '建档', value: Math.round(100 * timeMult) },
                              { label: 'POP', value: Math.round(75 * timeMult) },
                              { label: '深面', value: Math.round(45 * timeMult) },
                              { label: '决面', value: Math.round(38 * timeMult) },
                              { label: 'ITC', value: Math.round(38 * timeMult) },
                              { label: '入司', value: Math.round(38 * timeMult) }
                            ]}
                          />
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="font-extrabold text-[#00A758] text-sm font-mono">{Math.round(38 * timeMult)}人入司</p>
                        </div>
                      </div>
                      )}

                      {teamMatchesSearch('钱鹏') && (
                      <div className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span>钱鹏</span>
                            <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">UM</span>
                          </p>
                          <MemberMetricBadges
                            keyId="dist-contrib-qianpeng"
                            isActivityDashboard={activeMetricDashboard === '活动量看板'}
                            metrics={activeMetricDashboard === '活动量看板' ? [
                              { label: '建档', value: Math.round(90 * timeMult) },
                              { label: 'POP', value: Math.round(60 * timeMult) },
                              { label: 'COP', value: Math.round(36 * timeMult) },
                              { label: 'ITC', value: Math.round(32 * timeMult) }
                            ] : [
                              { label: '建档', value: Math.round(90 * timeMult) },
                              { label: 'POP', value: Math.round(60 * timeMult) },
                              { label: '深面', value: Math.round(36 * timeMult) },
                              { label: '决面', value: Math.round(32 * timeMult) },
                              { label: 'ITC', value: Math.round(32 * timeMult) },
                              { label: '入司', value: Math.round(32 * timeMult) }
                            ]}
                          />
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="font-extrabold text-[#00A758] text-sm font-mono">{Math.round(32 * timeMult)}人入司</p>
                        </div>
                      </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              )}


              {/* 6. 团队人员看板（仅活动量看板tab下显示） */}
              {activeMetricDashboard === '活动量看板' && (
                <TeamMembersDashboard
                  activeMetricDashboard={activeMetricDashboard}
                  activeScope={activeScope}
                  timeMult={timeMult}
                  actualNum={actualNum}
                  expandedManagers={expandedManagers}
                  toggleManager={toggleManager}
                  forceEfficiencyStyle={true}
                  titleSuffix=""
                />
              )}
            </>
          )}
          </div>

          {/* Fixed Bottom Actions for Individual View (主页才显示) */}
          {activeTab === 'individual' && !showActivityDetail && (
            <div className="px-4 pb-4 pt-2 bg-[#f7f9fc] border-t border-slate-100/50">
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => alert('已生成您的个人专属招募建档二维码和海报链接，可一键复制分享。')}
                  className="bg-[#00A758] hover:bg-[#008b47] text-white p-4 rounded-xl flex items-center justify-center gap-2 font-black text-xs shadow-xs active:scale-95 transition"
                  id="action-invitation-file"
                >
                  <i className="fa-solid fa-user-plus text-sm"></i>
                  建档邀请
                </button>
                <button 
                  onClick={() => alert('已成功发送最新版POP职业推介图册至个人短信及工作助手！')}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 p-4 rounded-xl flex items-center justify-center gap-2 font-black text-xs shadow-xs active:scale-95 transition"
                  id="action-onekey-pop"
                >
                  <i className="fa-solid fa-envelope text-[#00A758] text-sm"></i>
                  一键推送POP
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help Modal */}
        <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
      </div>
    </FullScreenModal>
  );
};


