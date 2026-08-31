import React, { useState, useEffect } from 'react';
import { Trophy, ChevronRight, Search, ArrowLeft, Calendar } from 'lucide-react';
import type { SchemeId } from './CompetitionModal_v3_保单维度版';

interface CompetitionLandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPhase1: () => void;
  onOpenScheme?: (id: SchemeId, ended?: boolean) => void;
}

interface CompetitionItem {
  id: string;
  title: string;
  status: 'active' | 'history';
  period: string;
  description: string;
  badges: string[];
  daysLeft: number;
  daysTotal: number;
  available: boolean;   // 详情页是否已上线
}

// ─── 竞赛过渡页：竞赛方案中心（按最初版完整恢复） ───
// 一阶段详情已上线（V3）；其余竞赛点击提示"建设中"
const CompetitionLandingModal: React.FC<CompetitionLandingModalProps> = ({ isOpen, onClose, onOpenPhase1, onOpenScheme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'history'>('all');
  const [toast, setToast] = useState<string | null>(null);

  // 弹窗打开时锁定背景滚动（防止滚穿"串页"），关闭时恢复
  useEffect(() => {
    if (!isOpen) return;
    const frame = document.querySelector('.phone-frame') as HTMLElement | null;
    const stage = document.querySelector('.phone-stage') as HTMLElement | null;
    const prevFrame = frame ? frame.style.overflow : '';
    const prevStage = stage ? stage.style.overflow : '';
    if (frame) frame.style.overflow = 'hidden';
    if (stage) stage.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      if (frame) frame.style.overflow = prevFrame;
      if (stage) stage.style.overflow = prevStage;
      document.body.style.overflow = '';
    };
  }, [isOpen]);

// 标签色调统一：全部采用宏图相伴同款红调（淡红底 + 深红字 + 浅红边）
const BADGE_COLORS: Record<string, string> = {
  '首爆日奖励': 'bg-[#FDF3F3] text-[#BE060C] border-[#F9DBDC]',
  '宏图相伴尊享版奖励': 'bg-[#FDF3F3] text-[#BE060C] border-[#F9DBDC]',
  '大单奖励': 'bg-[#FDF3F3] text-[#BE060C] border-[#F9DBDC]',
  '累计件数奖励': 'bg-[#FDF3F3] text-[#BE060C] border-[#F9DBDC]',
  '累计APE奖励': 'bg-[#FDF3F3] text-[#BE060C] border-[#F9DBDC]',
  '重疾康养件数奖励': 'bg-[#FDF3F3] text-[#BE060C] border-[#F9DBDC]',
  '个养特别奖励': 'bg-[#FDF3F3] text-[#BE060C] border-[#F9DBDC]',
  '福佑护理特别奖励': 'bg-[#FDF3F3] text-[#BE060C] border-[#F9DBDC]',
};

  const competitions: CompetitionItem[] = [
    {
      id: 'yingling_2026_p1',
      title: '2026年个险渠道赢领未来一阶段产品奖励方案',
      status: 'active',
      period: '2025-12-01 ~ 2026-02-05',
      description: '为激励2026赢领未来一阶段目标达成，助力价值产品推动，特颁布首爆日纪念银币与宏图相伴尊享版特别奖等好礼！',
      badges: ['首爆日奖励', '宏图相伴尊享版奖励', '大单奖励', '累计件数奖励', '累计APE奖励'],
      daysLeft: 1,
      daysTotal: 35,
      available: true,
    },
    {
      id: 'yingling_2026_p2',
      title: '2026年个险渠道赢领未来二阶段产品奖励方案',
      status: 'active',
      period: '2026-01-01 ~ 2026-03-09',
      description: '为激励2026赢领未来二阶段目标达成，助力价值产品推动，提升销售业绩，特颁布累计APE奖励方案及重疾康养件数奖励方案！',
      badges: ['累计APE奖励', '重疾康养件数奖励'],
      daysLeft: 31,
      daysTotal: 68,
      available: true,
    },
    {
      id: 'yingling_2026_shuangshuiyou',
      title: '2026年个险渠道赢领未来双税优产品奖励方案',
      status: 'active',
      period: '2025-12-15 ~ 2026-03-31',
      description: '为激励2026赢领未来目标达成，助力双税优（个养/福佑护理）产品推动，提升销售业绩，特颁布双税优件数阶梯奖励方案！',
      badges: ['个养特别奖励', '福佑护理特别奖励'],
      daysLeft: 53,
      daysTotal: 107,
      available: true,
    },
    {
      // 历史竞赛示例：文案与一阶段完全一致（模拟展示用），仅状态为已结束
      id: 'yingling_2026_p1_history',
      title: '2026年个险渠道赢领未来一阶段产品奖励方案',
      status: 'history',
      period: '2025-12-01 ~ 2026-02-05',
      description: '为激励2026赢领未来一阶段目标达成，助力价值产品推动，特颁布首爆日纪念银币与宏图相伴尊享版特别奖等好礼！',
      badges: ['首爆日奖励', '宏图相伴尊享版奖励', '大单奖励', '累计件数奖励', '累计APE奖励'],
      daysLeft: 0,
      daysTotal: 35,
      available: true,
    },
  ];

  const filteredCompetitions = competitions.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'active') return matchesSearch && comp.status === 'active';
    if (activeTab === 'history') return matchesSearch && comp.status === 'history';
    return matchesSearch;
  });

  const activeCount = competitions.filter(c => c.status === 'active').length;

  const handleCardClick = (comp: CompetitionItem) => {
    if (comp.id === 'yingling_2026_p1') {
      onOpenScheme ? onOpenScheme('p1') : onOpenPhase1();
      return;
    }
    if (comp.id === 'yingling_2026_p2' && onOpenScheme) {
      onOpenScheme('p2');
      return;
    }
    if (comp.id === 'yingling_2026_shuangshuiyou' && onOpenScheme) {
      onOpenScheme('ssy');
      return;
    }
    // 历史竞赛示例：点击进入一阶段"已结束"视图（给开发区演示完整链路）
    if (comp.id === 'yingling_2026_p1_history') {
      onOpenScheme ? onOpenScheme('p1', true) : onOpenPhase1();
      return;
    }
    if (comp.available) {
      onOpenPhase1();
      return;
    }
    setToast('该竞赛方案追踪详情建设中，敬请期待');
    setTimeout(() => setToast(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-50 flex flex-col font-sans animate-slide-up">
      {/* 1. Header (Common back buttons) */}
      <div className="bg-white border-b border-slate-100 flex items-center justify-between px-4 py-4 pt-8 shrink-0">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 active:scale-95 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-base font-black text-slate-800 tracking-tight">
          竞赛方案中心
        </h3>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain pb-10 relative">
        {/* Toast 提示（建设中） */}
        {toast && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-slate-800/90 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
            {toast}
          </div>
        )}

        {/* VIEW A: COMPETITION LIST VIEW */}
        <div className="p-4 space-y-4">
          {/* Intro Header */}
          <div className="bg-gradient-to-br from-[#00A758] to-[#008c49] rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full w-fit mb-3">
              <Trophy className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              <span className="text-[10px] font-bold tracking-wide">进行中竞赛: {activeCount}项</span>
            </div>
            <h2 className="text-xl font-black tracking-wide leading-tight mb-2">激发潜能，荣耀登顶</h2>
            <p className="text-[11px] text-emerald-50/90 leading-relaxed font-medium">
              跟踪并核对您的赢领未来系列竞赛数据，掌握进度，确保通关。
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex gap-2">
            <div className="flex-1 bg-white border border-slate-100 rounded-2xl px-4 flex items-center gap-2 shadow-xs">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索竞赛方案..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 text-xs font-medium text-slate-700 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex border-b border-slate-100 bg-white rounded-2xl p-1 shadow-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 text-center py-2 text-xs font-black rounded-xl transition ${activeTab === 'all' ? 'bg-[#00A758] text-white shadow-xs' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              全部
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 text-center py-2 text-xs font-black rounded-xl transition ${activeTab === 'active' ? 'bg-[#00A758] text-white shadow-xs' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              进行中
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 text-center py-2 text-xs font-black rounded-xl transition ${activeTab === 'history' ? 'bg-[#00A758] text-white shadow-xs' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              历史竞赛
            </button>
          </div>

          {/* Competitions Grid */}
          <div className="space-y-4">
            {filteredCompetitions.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Trophy className="w-6 h-6" />
                </div>
                <p className="text-slate-400 text-xs font-medium">暂无匹配的竞赛方案</p>
              </div>
            ) : (
              filteredCompetitions.map((comp) => {
                const isActive = comp.status === 'active';
                const isHistory = comp.status === 'history';
                const timeProgress = isActive ? Math.round(((comp.daysTotal - comp.daysLeft) / comp.daysTotal) * 100) : 100;

                return (
                  <div
                    key={comp.id}
                    onClick={() => handleCardClick(comp)}
                    className="bg-white rounded-3xl border border-slate-100 p-5 shadow-xs flex flex-col gap-4 relative overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer"
                  >
                    {/* 历史竞赛：金色荣誉徽章绝对定位在右上角，不撑高标题行，保持标题与时间正常间距 */}
                    {isHistory && (
                      <span className="absolute top-4 right-4 z-10 flex flex-col items-center gap-0.5">
                        <span className="w-11 h-11 rounded-full bg-gradient-to-br from-[#E9C27C] via-[#CB9A59] to-[#A97C32] flex items-center justify-center shadow-md">
                          <Trophy className="w-5 h-5 text-white drop-shadow" />
                        </span>
                        <span className="text-[8px] font-bold text-slate-400">已结束</span>
                      </span>
                    )}

                    {/* Title & Status（同一行对齐） */}
                    <div className={`flex items-center justify-between gap-3 ${isHistory ? 'pr-14' : ''}`}>
                      <h4 className={`text-sm font-black leading-snug transition-colors ${isHistory ? 'text-slate-600' : 'text-slate-800 group-hover:text-[#D80D18]'}`}>
                        {comp.title}
                      </h4>
                      {isActive && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E4565E] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D80D18]"></span>
                          </span>
                          <span className="text-[10px] font-bold text-[#BE060C]">进行中</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] flex items-center gap-1 text-slate-800">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>时间: {comp.period}</span>
                    </p>

                    {/* Description（便签样式） */}
                    <p className="text-[10px] text-slate-700 leading-relaxed bg-[#FFF7E9] border-l-4 border-[#CB9A59] rounded-r-lg px-2.5 py-2">
                      {comp.description}
                    </p>

                    {/* Timeline status */}
                    {isActive && (
                      <div className="flex justify-between text-[9px] text-slate-800 bg-slate-50 p-2 rounded-xl border border-slate-100/50">
                        <span>已经过天数: {comp.daysTotal - comp.daysLeft}天 ({timeProgress}%)</span>
                        <span className="text-[#D80D18]">剩余: {comp.daysLeft}天</span>
                      </div>
                    )}

                    {/* Badges and Call to action */}
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex gap-1 flex-wrap">
                        {comp.badges.map((b, idx) => (
                          <span key={idx} className={`${BADGE_COLORS[b] ?? 'bg-slate-100 border-slate-200/50 text-slate-600'} border text-[8.5px] font-black px-1.5 py-0.5 rounded`}>
                            {b}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-[#D80D18] flex items-center gap-0.5 hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                        <span>{isHistory ? '查看竞赛结果' : '进入数据追踪'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionLandingModal;
