/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Diamond, 
  Gem,
  Calendar, 
  Check, 
  X, 
  BarChart2, 
  Users, 
  User,
  Image,
  FileText,
  Share2,
  ChevronRight,
  History,
  Medal,
  Star,
  AlertCircle,
  Award,
  ArrowUpRight,
  Shield,
  Heart,
  Wallet,
  ScrollText,
  Search,
  Coins,
  Trophy,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Activity,
  Gift,
  Zap,
  Building2,
  RefreshCw,
  BookOpenText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const StarDiamondHonorPage: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('个人');
  const [activeNav, setActiveNav] = useState('首页');
  const [activeTeamSubTab, setActiveTeamSubTab] = useState('星钻工作室');
  const [activeStandard, setActiveStandard] = useState('标准一');
  const [activeMonth, setActiveMonth] = useState('202603');
  const [selectedQuarter, setSelectedQuarter] = useState(1);
  const monthStatus: Record<string, boolean> = {
    '202604': true,
    '202605': true,
    '202606': true,
    '202603': true
  };
  const [activeChallengeNode, setActiveChallengeNode] = useState(0);
  const [activeChallengeSubTier, setActiveChallengeSubTier] = useState(0); // 0: 11 months, 1: 12 months
  
  // Period Selection States
  const [personalPeriod, setPersonalPeriod] = useState('2026-04');
  const [teamStarPeriod, setTeamStarPeriod] = useState('2026-04');
  const [teamStellarPeriod, setTeamStellarPeriod] = useState('2026Q2');
  const [starSearchQuery, setStarSearchQuery] = useState('');
  const [stellarSearchQuery, setStellarSearchQuery] = useState('');
  const [showPersonalPeriodSelect, setShowPersonalPeriodSelect] = useState(false);
  const [showTeamStarPeriodSelect, setShowTeamStarPeriodSelect] = useState(false);
  const [showTeamStellarPeriodSelect, setShowTeamStellarPeriodSelect] = useState(false);
  const [selectedMilestoneMonth, setSelectedMilestoneMonth] = useState(5); // May selected by default
  const [showCurrentPositionTooltip, setShowCurrentPositionTooltip] = useState(false);
  const [showContinuousTooltip, setShowContinuousTooltip] = useState(false);
  const [isChallengeCollapsed, setIsChallengeCollapsed] = useState(false);
  const [isAchievedMembersCollapsed, setIsAchievedMembersCollapsed] = useState(true);
  const [isStellarAchievedMembersCollapsed, setIsStellarAchievedMembersCollapsed] = useState(true);
  const [showFYCTooltip, setShowFYCTooltip] = useState(false);
  const [showPoster, setShowPoster] = useState(true);
  const [simulationStep, setSimulationStep] = useState<'idle' | 'dimming' | 'resetting' | 'finished'>('idle');
  const [dimmedCount, setDimmedCount] = useState(0);
  const [displayStreakCount, setDisplayStreakCount] = useState(5);

  // Custom Gem Component with Shatter Animation and Glow
  const EmeraldGem = ({ active, isShattering }: { active: boolean; isShattering?: boolean }) => (
    <motion.div
      animate={isShattering ? {
        scale: [1, 1.3, 0.9],
        rotate: [0, 15, -15, 0],
        filter: ["brightness(1) blur(0px)", "brightness(2) blur(1px)", "brightness(0.5) blur(2px)"],
        opacity: [1, 0.8, 0.4]
      } : {}}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      <svg 
        viewBox="0 0 24 24" 
        className={`w-7 h-7 transition-all duration-700 ${active ? 'text-brand-green' : 'text-slate-300'}`} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
        style={{
          filter: active 
            ? 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))' 
            : 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))'
        }}
      >
        <path d="M6 3h12l4 6-10 12L2 9l4-6z" fill={active ? "currentColor" : "rgba(203, 213, 225, 0.1)"} fillOpacity={active ? 0.3 : 0.2} />
        <path d="M11 3l-4 6 5 12 5-12-4-6M2 9h20M7 9h10" strokeOpacity={active ? 1 : 0.4} />
      </svg>
      {isShattering && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-full h-px bg-white/50 rotate-45 absolute" />
          <div className="w-full h-px bg-white/50 -rotate-45 absolute" />
        </motion.div>
      )}
    </motion.div>
  );

  // Simulation logic
  React.useEffect(() => {
    if (simulationStep === 'dimming') {
      const interval = setInterval(() => {
        setDimmedCount(prev => {
          if (prev >= 3) {
            clearInterval(interval);
            setTimeout(() => setSimulationStep('resetting'), 500);
            return 3;
          }
          return prev + 1;
        });
      }, 400); // Faster transition for diamonds
      return () => clearInterval(interval);
    } else if (simulationStep === 'resetting') {
      setDisplayStreakCount(0);
      setTimeout(() => setSimulationStep('finished'), 400);
    } else if (simulationStep === 'idle') {
      setDimmedCount(0);
      setDisplayStreakCount(5);
    }
  }, [simulationStep]);
  const [showHonorListModal, setShowHonorListModal] = useState(false);
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [showIndicatorModal, setShowIndicatorModal] = useState(false);
  const [indicatorTab, setIndicatorTab] = useState('业务');

  // Mock Team Data
  const teamMembers = teamStarPeriod === '2026-05'
    ? [
        { id: 'M001', name: '张三', fyc: 3850, policies: 3, isStar: true },
        { id: 'M002', name: '王五', fyc: 3100, policies: 2, isStar: true },
        { id: 'M003', name: '赵六', fyc: 3200, policies: 2, isStar: true },
        { id: 'M004', name: '孙七', fyc: 1500, policies: 1, isStar: false },
        { id: 'M005', name: '周八', fyc: 4200, policies: 2, isStar: true },
        { id: 'M006', name: '吴九', fyc: 500, policies: 0, isStar: false },
      ]
    : [
        { id: 'M001', name: '张三', fyc: 3850, policies: 3, isStar: true },
        { id: 'M002', name: '王五', fyc: 3100, policies: 2, isStar: true },
        { id: 'M003', name: '赵六', fyc: 2800, policies: 2, isStar: false },
        { id: 'M004', name: '孙七', fyc: 1500, policies: 1, isStar: false },
        { id: 'M005', name: '周八', fyc: 4000, policies: 1, isStar: false },
        { id: 'M006', name: '吴九', fyc: 500, policies: 0, isStar: false },
      ];

  const starAchieved = teamMembers.filter(m => m.isStar);
  const starNotAchieved = teamMembers
    .filter(m => !m.isStar)
    .filter(m => m.name.toLowerCase().includes(starSearchQuery.toLowerCase()))
    .map(m => {
      const fycTarget = activeStandard === '标准一' ? 3000 : 4500;
      const policyTarget = activeStandard === '标准一' ? 2 : 0;
      return {
        ...m,
        fycGap: Math.max(0, fycTarget - m.fyc),
        policyGap: Math.max(0, policyTarget - m.policies)
      };
    })
    .sort((a, b) => a.fycGap - b.fycGap);

  // Mark fastest to achieve (lowest FYC gap among those needing policies or vice versa)
  const fastestToStar = starNotAchieved[0];

  // Stellar Studio Logic
  const stellarMembers = teamStellarPeriod === '2026Q2'
    ? [
        { id: 'M001', name: '张三', fyc: 4800, policies: 3, isStellar: true },
        { id: 'M002', name: '王五', fyc: 5200, policies: 4, isStellar: true },
        { id: 'M003', name: '赵六', fyc: 3000, policies: 1, isStellar: false },
      ]
    : [
        { id: 'M001', name: '张三', fyc: 2800, policies: 1, isStellar: false },
        { id: 'M002', name: '王五', fyc: 2500, policies: 2, isStellar: false },
        { id: 'M003', name: '赵六', fyc: 2900, policies: 1, isStellar: false },
        { id: 'M004', name: '孙七', fyc: 4500, policies: 4, isStellar: true },
      ];

  const stellarAchieved = stellarMembers.filter(m => m.isStellar);

  const filteredStellarMembers = stellarMembers
    .filter(m => !m.isStellar)
    .filter(m => m.name.toLowerCase().includes(stellarSearchQuery.toLowerCase()));

  const fastestToStellar = filteredStellarMembers
    .map(m => {
      const fycTarget = activeStandard === '标准一' ? 3000 : 4500;
      return {
        id: m.id,
        fycGap: Math.max(0, fycTarget - ((m as any).fyc || 0))
      };
    })
    .sort((a, b) => a.fycGap - b.fycGap)[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col overflow-hidden bg-slate-50 font-sans text-slate-900 animate-slide-up">
      {/* Header */}
      <header className="shrink-0 z-10 flex items-center justify-between bg-white px-4 py-3 pt-8 border-b border-slate-100">
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-lg font-bold">
          {activeNav === '洞察' ? '荣誉洞察' : '星钻'}
        </h1>
        <button 
          onClick={() => setShowIndicatorModal(true)}
          className="flex items-center justify-center bg-white h-10 w-10 rounded-2xl border border-slate-200/60 shadow-sm ring-1 ring-slate-100 active:scale-95 transition-transform"
          title="指标定义"
        >
          <BookOpenText className="w-5 h-5 text-brand-green" />
        </button>
      </header>

      {/* Tabs */}
      {activeNav !== '洞察' && (
        <div className="shrink-0 flex bg-white border-b border-slate-100">
          {['个人', '团队'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium transition-all relative ${
                activeTab === tab ? 'text-brand-green' : 'text-slate-500'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green mx-auto w-12"
                />
              )}
            </button>
          ))}
        </div>
      )}

      <main className="flex-1 overflow-y-auto">
      {activeNav === '洞察' ? (
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 px-1 mb-2">星钻荣誉洞察</h2>
          {/* Card 1: 首月星钻人力 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <div className="w-1 h-4 bg-brand-green rounded-full"></div>
                首月星钻人力
              </h3>
              <div className="flex bg-slate-100 rounded-lg p-1">
                {['标准一', '标准二'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveStandard(s)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                      activeStandard === s ? 'bg-white text-brand-green shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 mb-6">
              {activeStandard === '标准一' ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">当月签发可计佣FYC</span>
                      <span className="text-slate-800 font-bold">2000 / 3000 元</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(2000 / 3000) * 100}%` }}
                        className="h-full bg-brand-green rounded-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">当月签发可计佣件数</span>
                      <span className="text-slate-800 font-bold">3 / 2 件</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="h-full bg-brand-green rounded-full"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[11px] py-1">
                    <span className="text-slate-500 font-medium">参加飞鹰培训</span>
                    <span className="text-slate-800 font-bold">是</span>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">当月签发可计佣FYC</span>
                    <span className="text-slate-800 font-bold">2000 / 4500 元</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(2000 / 4500) * 100}%` }}
                      className="h-full bg-brand-green rounded-full"
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] py-1">
                    <span className="text-slate-500 font-medium">参加飞鹰培训</span>
                    <span className="text-red-500 font-bold">否</span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-brand-green-light/50 rounded-xl p-3 border border-brand-green-muted">
              <p className="text-[11px] text-slate-600 leading-normal">
                <span className="font-black text-brand-green">【机会】</span>
                达成以上指标，您首个考核月即可达标，获得公司30周年纪念版司徽。
              </p>
            </div>
          </div>

          {/* Card 2: 连续达成星钻月数 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-8">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <div className="w-1 h-4 bg-brand-green rounded-full"></div>
              连续达成星钻月数
            </h3>

            {/* Scenario 1: 4/5 */}
            <div className="space-y-4">
              <div className="space-y-5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">最高万元奖学金</span>
                  <span className="text-slate-800 font-bold">目标：达成 5 个月</span>
                </div>
                <div className="relative h-2">
                  <div className="absolute -top-3.5 left-[80%] -translate-x-1/2 text-[9px] font-bold text-brand-green whitespace-nowrap">4个月</div>
                  <div className="h-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(4 / 5) * 100}%` }}
                      className="h-full bg-brand-green rounded-full"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-brand-green-light/50 rounded-xl p-3 border border-brand-green-muted/30">
                <p className="text-[11px] text-slate-600 leading-normal">
                  <span className="font-black text-brand-green">【机会】</span>
                  还需达成1个月即可完成首6个考核月内5次达标星钻人力目标，可获得风险管理师技能证书及600元奖励
                </p>
              </div>
            </div>

            {/* Scenario 4: 7/8 */}
            <div className="space-y-4">
              <div className="space-y-5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">最高万元奖学金</span>
                  <span className="text-slate-800 font-bold">目标：达成 8 个月</span>
                </div>
                <div className="relative h-2">
                  <div className="absolute -top-3.5 left-[87.5%] -translate-x-1/2 text-[9px] font-bold text-brand-green whitespace-nowrap">7个月</div>
                  <div className="h-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(7 / 8) * 100}%` }}
                      className="h-full bg-brand-green rounded-full"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-brand-green-light/50 rounded-xl p-3 border border-brand-green-muted/30">
                <p className="text-[11px] text-slate-600 leading-normal">
                  <span className="font-black text-brand-green">【机会】</span>
                  还需达成1个月即可完成首9个考核月内8次达标星钻人力目标，可获得健康管理师技能证书及800元奖励
                </p>
              </div>
            </div>

            {/* Scenario 5: 10/11 */}
            <div className="space-y-4">
              <div className="space-y-5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">最高万元奖学金</span>
                  <span className="text-slate-800 font-bold">目标：达成 11 个月</span>
                </div>
                <div className="relative h-2">
                  <div className="absolute -top-3.5 left-[90.9%] -translate-x-1/2 text-[9px] font-bold text-brand-green whitespace-nowrap">10个月</div>
                  <div className="h-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(10 / 11) * 100}%` }}
                      className="h-full bg-brand-green rounded-full"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-brand-green-light/50 rounded-xl p-3 border border-brand-green-muted/30">
                <p className="text-[11px] text-slate-600 leading-normal">
                  <span className="font-black text-brand-green">【机会】</span>
                  还需达成1个月即可完成首12个考核月内11次达标星钻人力目标，可获得养老规划师技能证书及1800元奖励
                </p>
              </div>
            </div>

            {/* Scenario 6: 10/12 */}
            <div className="space-y-4">
              <div className="space-y-5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">最高万元奖学金</span>
                  <span className="text-slate-800 font-bold">目标：达成12个月&直招≥1人</span>
                </div>
                <div className="relative h-2">
                  <div className="absolute -top-3.5 left-[83.3%] -translate-x-1/2 text-[9px] font-bold text-brand-green whitespace-nowrap">10个月</div>
                  <div className="h-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(10 / 12) * 100}%` }}
                      className="h-full bg-brand-green rounded-full"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-[11px] py-1">
                  <span className="text-slate-500 font-medium">累计直招星钻人力≥1</span>
                  <span className="text-red-500 font-bold">否</span>
                </div>
              </div>
              <div className="bg-brand-green-light/50 rounded-xl p-3 border border-brand-green-muted/30">
                <p className="text-[11px] text-slate-600 leading-normal">
                  <span className="font-black text-brand-green">【机会】</span>
                  还需连续达成2个月即可完成首12个考核月内12次达标星钻人力目标，还需累计直招1名星钻人力，可获得养老规划师技能证书及1800元奖励
                </p>
              </div>
            </div>

            {/* Scenario 2: 1/3 */}
            <div className="space-y-4">
              <div className="space-y-5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">慈善机构认证</span>
                  <span className="text-slate-800 font-bold">目标：连续达成 3 个月</span>
                </div>
                <div className="relative h-2">
                  <div className="absolute -top-3.5 left-[33.3%] -translate-x-1/2 text-[9px] font-bold text-brand-green whitespace-nowrap">1个月</div>
                  <div className="h-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(1 / 3) * 100}%` }}
                      className="h-full bg-brand-green rounded-full"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-brand-green-light/50 rounded-xl p-3 border border-brand-green-muted/30">
                <p className="text-[11px] text-slate-600 leading-normal">
                  <span className="font-black text-brand-green">【机会】</span>
                  还需连续达成2个月的星钻人力即可获得春雨新生慈善机构证书
                </p>
              </div>
            </div>

            {/* Scenario 3: 10/12 */}
            <div className="space-y-4">
              <div className="space-y-5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">宏运世家会员身份</span>
                  <span className="text-slate-800 font-bold">目标：连续达成 12 个月</span>
                </div>
                <div className="relative h-2">
                  <div className="absolute -top-3.5 left-[83.3%] -translate-x-1/2 text-[9px] font-bold text-brand-green whitespace-nowrap">10个月</div>
                  <div className="h-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(10 / 12) * 100}%` }}
                      className="h-full bg-brand-green rounded-full"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-brand-green-light/50 rounded-xl p-3 border border-brand-green-muted/30">
                <p className="text-[11px] text-slate-600 leading-normal">
                  <span className="font-black text-brand-green">【机会】</span>
                  还需连续达成2个月的星钻人力即可获得宏运世家会员身份
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === '个人' ? (
        <>
          {/* Monthly Stats Section - Card 1: 星钻人力 */}
          <section className="px-4 mt-4 mb-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative">
              {/* Month Switcher */}
              <div className="mb-3">
                <div className="bg-slate-100 rounded-lg flex p-0.5 w-full">
                  {['2026-05', '2026-04'].map(p => (
                    <button
                      key={p}
                      onClick={() => setPersonalPeriod(p)}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                        personalPeriod === p
                          ? 'bg-white text-brand-green shadow-sm'
                          : 'bg-transparent text-slate-400 hover:text-slate-500'
                      }`}
                    >
                      <Calendar className={`w-3 h-3 ${personalPeriod === p ? 'text-brand-green' : 'text-slate-300'}`} />
                      {p.replace('-', '年')}月
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 1: Achievement Title & Standard Toggle */}
              <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-800">星钻人力达成情况</h4>
                  {personalPeriod === '2026-05' && (
                    <span className="px-2 py-0.5 bg-brand-green-light text-brand-green text-[10px] font-bold rounded border border-brand-green-muted">
                      暂达成
                    </span>
                  )}
                </div>
                <div className="flex bg-slate-50 rounded-lg p-0.5 border border-slate-200/30">
                  {['标准一', '标准二'].map(s => (
                    <button 
                      key={s}
                      onClick={() => setActiveStandard(s)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                        activeStandard === s 
                          ? 'bg-brand-green text-white shadow-sm' 
                          : 'text-slate-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats Section (Replaces the Speech Bubble) */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 flex flex-col items-center text-center shadow-sm relative overflow-visible">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">签发可计佣FYC已达成（缺口）</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      {personalPeriod === '2026-05' ? (
                        activeStandard === '标准一' ? (
                          <>3100（<span className="text-brand-green font-black">-</span>）</>
                        ) : (
                          <>3100（<span className="text-brand-green font-black">-</span>）</>
                        )
                      ) : (
                        activeStandard === '标准一' ? (
                          <>2900（<span className="text-red-500 font-black">100</span>）</>
                        ) : (
                          <>2900（<span className="text-red-500 font-black">100</span>）</>
                        )
                      )}
                    </span>
                  </div>
                  <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 flex flex-col items-center text-center shadow-sm">
                    <span className="text-[11px] text-slate-400 mb-1 whitespace-nowrap">签发可计佣件数已达成（缺口）</span>
                    <span className={`text-sm font-bold transition-colors ${
                      personalPeriod === '2026-05' ? 'text-brand-green' : 'text-slate-400'
                    }`}>
                      {personalPeriod === '2026-05'
                        ? (activeStandard === '标准一' ? '3（-）' : '-（-）')
                        : (activeStandard === '标准一' ? '-（2）' : '-（-）')
                      }
                    </span>
                  </div>
                </div>
                <p className={`text-[10px] font-bold px-1 transition-colors whitespace-nowrap ${
                  personalPeriod === '2026-05' ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  标准：{activeStandard === '标准一' ? '当月个人首年佣金FYC≥3000元，且净寿险保单件数≥2件' : '当月个人首年佣金FYC≥4500元'}
                </p>
              </div>
            </div>
          </section>


            {/* 荣誉进行时 Section */}
            <section className="px-4 mb-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center gap-1.5 mb-6">
                  <h3 className="text-base font-black text-slate-800 tracking-tight">荣誉进行时</h3>
                  <button 
                    onClick={() => setShowHonorListModal(true)}
                    className="flex items-center gap-0.5 text-[9px] font-bold text-brand-green bg-brand-green-light/40 px-2 py-0.5 rounded border border-brand-green-muted/20"
                  >
                    满级恒星人力荣誉连星榜
                    <ChevronRight className="w-2.5 h-2.5" />
                  </button>
                </div>

                {/* 一是：连续达成星钻挑战 */}
                <div className="bg-slate-50/50 rounded-[24px] p-5 border border-slate-100 mb-6 relative group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green-light/30 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-brand-green-light/50 transition-colors pointer-events-none" />
                  <div className="mb-6 relative z-10 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold flex items-center gap-2 mb-1 whitespace-nowrap">
                        <History className="w-4 h-4 text-brand-green shrink-0" />
                        连续达成星钻挑战（2026年度）
                      </h4>
                      <p className="text-[10px] text-slate-400 font-normal ml-6 flex items-start gap-2">
                        <span>当前月份：2025-05</span>
                        <span>（本年度连钻中断豁免资格：无）</span>
                      </p>
                    </div>
                    <button
                      className="flex items-center gap-1 text-[9px] font-bold text-brand-green bg-white px-3 py-1 rounded-lg border border-brand-green/20 shadow-sm active:scale-95 transition-all whitespace-nowrap shrink-0"
                    >
                      <span>生成本月之星海报</span>
                    </button>
                  </div>
                  
                  <div className="mt-4 px-1 space-y-6">
                    {/* 12 Months Grid */}
                    <div className="grid grid-cols-3 gap-y-4 gap-x-3 mb-4">
                      {Array.from({ length: 12 }).map((_, i) => {
                        const month = i + 1;
                        const isAchieved = month <= 4; // Jan, Feb, Mar, Apr 2026
                        const hasAward = [3, 4, 5, 11].includes(month);
                        const isSelected = selectedMilestoneMonth === month;
                        const isCurrent = month === 4;
                        
                        const getMilestoneContent = (m: number) => {
                          // 星钻等级颜色映射：1月=星钻(绿), 2月=银星钻(蓝), 3月=金星钻(珊瑚), 4月=白金星钻(深蓝)
                          const diamondColors: Record<number, string> = {
                            1: 'text-diamond-green',
                            2: 'text-diamond-silver',
                            3: 'text-diamond-gold',
                            4: 'text-diamond-platinum',
                          };
                          const gemColor = diamondColors[m] || 'text-brand-green';
                          switch(m) {
                            case 1: return [{ icon: <Gem className={`w-2.5 h-2.5 ${gemColor}`} />, text: '连续2月' }];
                            case 2: return [{ icon: <Gem className={`w-2.5 h-2.5 ${gemColor}`} />, text: '连续3月' }];
                            case 3: return [
                              { icon: <Gem className={`w-2.5 h-2.5 ${gemColor}`} />, text: '连续4月' },
                              { icon: <Coins className="w-2.5 h-2.5 text-brand-green" />, text: '1500起' },
                              { icon: <ScrollText className="w-2.5 h-2.5" />, text: '慈善机构证书' }
                            ];
                            case 4: return [{ icon: <Gem className={`w-2.5 h-2.5 ${gemColor}`} />, text: '连续5月' }];
                            case 5: return [{ icon: <Coins className="w-2.5 h-2.5 text-brand-green" />, text: '1650起' }];
                            case 11: return [{ icon: <Coins className="w-2.5 h-2.5 text-brand-green" />, text: '1800起' }];
                            default: return [];
                          }
                        };

                        const items = getMilestoneContent(month);

                        return (
                          <div 
                            key={month} 
                            className="flex flex-col items-center gap-2 group cursor-pointer"
                            onClick={() => {
                              if (hasAward || month === 4) {
                                setSelectedMilestoneMonth(month);
                              }
                            }}
                          >
                            <div className={`relative w-full h-20 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-sm overflow-hidden p-1.5
                              ${isAchieved 
                                ? 'bg-white border-brand-green border text-brand-green' 
                                : isCurrent 
                                  ? 'bg-white border-brand-green border text-slate-400'
                                  : 'bg-white border-slate-100 text-slate-400 border shadow-inner'}
                              ${isSelected ? 'ring-2 ring-brand-green ring-offset-2 scale-105 shadow-md z-10' : ''}
                            `}>
                              {/* Achievement Label (Top-left 45deg) */}
                              {isAchieved && (
                                <div className="absolute top-0 left-0 w-10 h-10 overflow-hidden pointer-events-none z-20">
                                  <div className={`absolute top-0 left-0 w-[60px] h-[16px] text-[6px] font-black flex items-center justify-center text-white -rotate-45 -translate-x-[20px] translate-y-[4px] shadow-sm transform-gpu ${month === 2 ? 'bg-red-500' : 'bg-brand-green'}`}>
                                    {month === 2 ? '豁 免' : '已达成'}
                                  </div>
                                </div>
                              )}
                              {!isAchieved && (
                                <div className="absolute top-0 left-0 w-10 h-10 overflow-hidden pointer-events-none z-20">
                                  <div className="absolute top-0 left-0 w-[60px] h-[16px] text-[6px] font-black flex items-center justify-center bg-slate-200 text-slate-400 -rotate-45 -translate-x-[20px] translate-y-[4px] shadow-sm transform-gpu">
                                    未达成
                                  </div>
                                </div>
                              )}

                              {/* Milestone Items */}
                              <div className="flex flex-col items-center gap-0.5 pt-2">
                                {items.length > 0 ? (
                                  items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-1">
                                      <div className={`${isAchieved ? '' : 'text-slate-400'}`}>
                                        {item.icon}
                                      </div>
                                      <span className="text-[8px] font-bold whitespace-nowrap">{item.text}</span>
                                    </div>
                                  ))
                                ) : (
                                  <div className="h-full flex items-center justify-center opacity-20">
                                    <Star className="w-3 h-3" />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className={`text-[11px] font-black tracking-tight transition-colors ${isAchieved ? 'text-slate-800' : 'text-slate-400'}`}>
                                {month}月
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Achievement Details (Interactive) */}
                    <div className="space-y-4 pt-2 border-t border-slate-100/50">
                      <h5 className="text-[12px] font-black text-slate-400 uppercase tracking-widest pl-1">
                        {selectedMilestoneMonth <= 4 ? '本月拟获得荣誉' : '本月可挑战荣誉'}
                      </h5>
                      
                      <AnimatePresence mode="wait">
                        {selectedMilestoneMonth === 3 && (
                          <motion.div 
                            key="m3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white rounded-2xl p-5 border border-slate-100 shadow-sm overflow-hidden min-h-[120px] flex flex-col justify-center"
                          >
                            <div className="space-y-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                                  <Gift className="w-4 h-4 text-brand-green" />
                                </div>
                                <span className="text-[11px] font-black text-slate-600 tracking-tight">星钻恒星奖奖金¥1500起步</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                                  <ScrollText className="w-4 h-4 text-brand-green" />
                                </div>
                                <span className="text-[11px] font-black text-slate-600 tracking-tight">获得春雨新生慈善机构证书</span>
                              </div>
                            </div>


                          </motion.div>
                        )}

                        {selectedMilestoneMonth === 5 && (
                          <motion.div 
                            key="m5"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white/60 rounded-2xl p-5 border border-slate-100 shadow-sm overflow-hidden min-h-[100px] flex flex-col justify-center"
                          >
                            <div className="space-y-4">
                              <div className="flex items-center gap-3 opacity-60">
                                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                                  <Gift className="w-4 h-4 text-slate-300" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-400 tracking-tight">星钻恒星奖奖金¥1650起步</span>
                              </div>
                            </div>


                          </motion.div>
                        )}

                        {selectedMilestoneMonth === 11 && (
                          <motion.div 
                            key="m11"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white/60 rounded-2xl p-5 border border-slate-100 shadow-sm overflow-hidden min-h-[100px] flex flex-col justify-center"
                          >
                            <div className="space-y-4">
                              <div className="flex items-center gap-3 opacity-60">
                                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                                  <Gift className="w-4 h-4 text-slate-300" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-400 tracking-tight">星钻恒星奖奖金¥1800起步</span>
                              </div>
                            </div>


                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                </div>

                {/* 二是：截止目前本年度已获得荣誉 */}
                <div className="bg-slate-50/30 rounded-[24px] p-5 shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-amber-50/30 rounded-full -ml-16 -mt-16 blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between gap-3 mb-6 relative z-10">
                    <h4 className="text-sm font-bold flex items-center gap-2 text-slate-800 whitespace-nowrap overflow-hidden">
                      <Award className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="truncate">本年度已获得</span>
                    </h4>

                  </div>

                  {/* Honors Stats Summary - Side-by-side cards */}
                  <div className="flex gap-3 mb-8 relative z-10 overflow-visible">
                    {/* Card 1: Personal Honors */}
                    <div className="flex-1 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col min-h-[140px]">
                      <p className="text-[11px] font-bold text-slate-800 mb-4 px-1 flex items-center gap-1.5 whitespace-nowrap">
                        <User className="w-3.5 h-3.5 text-brand-green" />
                        个人
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[11px] text-slate-500 font-bold tracking-tight whitespace-nowrap">星钻人力</span>
                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            <Diamond className="w-3 h-3 text-brand-green" />
                            <span className="text-[11px] font-black text-brand-green font-mono">x3</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[11px] text-slate-500 font-bold tracking-tight whitespace-nowrap">恒星人力</span>
                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            <Gem className="w-3 h-3 text-purple-400 fill-purple-400" />
                            <span className="text-[11px] font-black text-purple-600 font-mono">x1</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[11px] text-slate-500 font-bold tracking-tight whitespace-nowrap">慈善机构证书</span>
                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            <Heart className="w-3 h-3 text-brand-green" />
                            <span className="text-[11px] font-black text-brand-green font-mono">x1</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Team Support Honors */}
                    <div className="flex-1 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col min-h-[140px] mr-0.5">
                      <p className="text-[11px] font-bold text-slate-800 mb-4 px-1 flex items-center gap-1.5 whitespace-nowrap">
                        <Users className="w-3.5 h-3.5 text-amber-500" />
                        所在团队
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[11px] text-slate-500 font-bold tracking-tight whitespace-nowrap">星钻工作室</span>
                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            <Diamond className="w-3 h-3 text-brand-green" />
                            <span className="text-[11px] font-black text-brand-green font-mono">x1</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[11px] text-slate-500 font-bold tracking-tight whitespace-nowrap">恒星工作室</span>
                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            <Gem className="w-3 h-3 text-purple-500 fill-purple-500" />
                            <span className="text-[11px] font-black text-purple-600 font-mono">x1</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                <div className="relative pl-3">
                  <h5 className="text-sm font-bold text-slate-400 mb-6 flex items-center gap-2">
                    <History className="w-3.5 h-3.5" />
                    年度时光轴
                  </h5>
                  <div className="relative">
                    {[
                      { date: '2026.03.31', title: '所属团队当季恒星工作室达标', desc: '机构拟获得总部支持客户经营费用', id: '3.2.2', hasHelp: true, month: '2026-03' },
                      { date: '2026.03.31', title: '恒星人力达标', desc: '第1次获得春雨新生慈善机构证书', id: '3.2.1', month: '2026-03' },
                      { date: '2026.03.15', title: '当月星钻人力达标', id: '3.1.1', month: '2026-03' },
                      { date: '2026.02.10', title: '当月星钻人力达标', id: '3.1.1', month: '2026-02' },
                      { date: '2026.01.16', title: '所属团队当月星钻工作室达标', desc: '团队拟获得机构颁发荣誉认证', id: '3.1.2', hasHelp: true, month: '2026-01' },
                      { date: '2026.01.16', title: '当月星钻人力达标', id: '3.1.1', month: '2026-01' },
                    ].sort((a, b) => {
                      if (a.month !== b.month) {
                        return b.month.localeCompare(a.month);
                      }
                      const priority: Record<string, number> = {
                        '恒星人力达标': 1,
                        '当月星钻人力达标': 2,
                        '所属团队当季恒星工作室达标': 3,
                        '所属团队当月星钻工作室达标': 4,
                      };
                      return (priority[a.title] || 99) - (priority[b.title] || 99);
                    }).map((item, idx, arr) => {
                      const isNewMonth = idx === 0 || item.month !== arr[idx - 1].month;
                      const monthColors: Record<string, string> = {
                        '2026-01': 'border-brand-green-muted bg-brand-green-light',
                        '2026-02': 'border-brand-green-muted bg-brand-green-light',
                        '2026-03': 'border-amber-400 bg-amber-50'
                      };

                      const getTitleColor = (title: string) => {
                        if (title.includes('星钻')) return 'border-brand-green-muted bg-brand-green-light';
                        if (title.includes('恒星')) return 'border-purple-300 bg-purple-50';
                        if (title.includes('连星')) return 'border-orange-300 bg-orange-50';
                        return monthColors[item.month] || 'border-slate-400 bg-white';
                      };

                      return (
                        <div key={idx} className="relative">
                          {isNewMonth && (
                            <div className="flex items-center gap-4 mb-4 mt-6 first:mt-0">
                              <div className="h-px flex-1 border-t border-dashed border-slate-200" />
                              <span className="text-sm font-black text-slate-300 tracking-tighter italic uppercase">{item.month}</span>
                            </div>
                          )}
                          <div className={`relative pl-7 group/honor ${item.desc ? 'pb-10' : 'pb-16'} last:pb-0`}>
                            {/* Vertical Line Segment - specific to each node to allow breaks */}
                            {idx < arr.length - 1 && (
                              <div className={`absolute left-[0.5px] top-4 bottom-0 w-[2px] ${
                                item.month === arr[idx + 1].month ? 'bg-slate-200' : 'hidden'
                              }`} />
                            )}

                            {/* Individual Node circle for every item */}
                            <div className={`absolute -left-[3.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 transition-all group-hover/honor:scale-125 shadow-sm z-10 ${getTitleColor(item.title)}`} />
                            
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="text-[11px] font-bold text-slate-700 leading-tight group-hover/honor:text-slate-900 transition-colors uppercase tracking-tight">{item.title}</h5>
                              </div>
                              {item.desc && (
                                <p className="text-[9px] text-slate-500 mt-2 leading-relaxed border-l-2 border-slate-50 pl-3 italic">{item.desc}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Card: 新人达标挑战赛 (Moved to end) */}
          <section className="px-4 mb-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <span>三师万元奖学金</span>
                </h4>
                <button 
                  onClick={() => setIsChallengeCollapsed(!isChallengeCollapsed)}
                  className="p-1 hover:bg-slate-50 rounded-full transition-colors text-slate-400 active:scale-95"
                >
                  {isChallengeCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                </button>
              </div>
              
              <div className="mb-6 flex flex-col items-center">
                <div className="flex items-center gap-1.5 self-start mb-2 translate-x-2">
                  <Trophy className="w-4 h-4 text-slate-400" />
                  <span className="text-[10px] text-slate-400">您的挑战起止周期：202512 - 202611</span>
                </div>
                    
                <AnimatePresence initial={false}>
                  {!isChallengeCollapsed && (
                    <motion.div 
                      key="challenge-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full relative z-10"
                    >
                      <div className="relative w-full px-2 mt-4 mb-4">
                        {/* Progress Line */}
                        <div className="absolute top-[11px] left-0 right-0 h-0.5 bg-slate-100">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '37.5%' }}
                              className="h-full bg-brand-green relative"
                            >
                              {/* Current Position Marker Wrapper */}
                              <div 
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 cursor-pointer z-30 group"
                                onClick={() => setShowCurrentPositionTooltip(!showCurrentPositionTooltip)}
                              >
                                <div className="w-1.5 h-1.5 bg-brand-green rounded-full border-2 border-white shadow-md transition-transform group-hover:scale-110" />
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-brand-green text-white text-[6px] px-1 py-0.5 rounded-full font-bold whitespace-nowrap shadow-sm">
                                  当前位置
                                </div>

                              <AnimatePresence>
                                {showCurrentPositionTooltip && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: -12, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 bg-slate-800 text-white text-[11px] px-3.5 py-2.5 rounded-xl shadow-2xl z-[100] whitespace-nowrap font-bold border border-slate-700 pointer-events-none"
                                  >
                                    第5个考核月
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-800" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.div>
                        </div>
                        
                        {/* Nodes */}
                        <div className="relative flex justify-between">
                          {[
                            { val: '1', label: '挑战首月' },
                            { val: '3', label: '' },
                            { val: '6', label: '' },
                            { val: '9', label: '' },
                            { val: '12', label: '终极挑战' },
                          ].map((node, i) => {
                            const isActive = activeChallengeNode === i;
                            
                            return (
                              <div 
                                key={i} 
                                className="flex flex-col items-center relative cursor-pointer group"
                                onClick={() => setActiveChallengeNode(i)}
                              >
                                <motion.div 
                                  whileTap={{ scale: 0.9 }}
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-black z-10 transition-all ${
                                    isActive
                                      ? 'bg-brand-green border-brand-green text-white shadow-lg shadow-green-100 ring-4 ring-brand-green-light/40' 
                                      : i <= 1 // node 1 and 3 are achieved in history
                                        ? 'bg-brand-green-light border-brand-green-muted text-brand-green'
                                        : 'bg-white border-slate-200 text-slate-400'
                                  }`}
                                >
                                  {node.val}
                                </motion.div>
                                <div className="mt-2.5">
                                  <span className={`text-[9px] font-bold whitespace-nowrap block ${isActive ? 'text-brand-green font-black' : 'text-slate-400'}`}>
                                    {node.label}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-xl p-3.5 border border-slate-100 min-h-[120px] relative shadow-sm">
                        {[
                          { icon: Shield, award: '首个入司考核月达标', items: [{ text: '公司30周年纪念版司徽' }], color: 'text-amber-600' },
                          { icon: Heart, award: '首3个考核月均达标', items: [{ text: '春雨新生慈善机构证书' }], color: 'text-rose-600' },
                          { 
                            icon: ScrollText, 
                            award: '首6个考核月内5次达标', 
                            items: [
                              { text: '风险管理师技能证书' },
                              { text: '600元奖学金', isMoney: true }
                            ], 
                            color: 'text-purple-600' 
                          },
                          { 
                            icon: ScrollText, 
                            award: '首9个考核月内8次达标', 
                            items: [
                              { text: '健康管理师技能证书' },
                              { text: '800元奖学金', isMoney: true }
                            ], 
                            color: 'text-blue-600' 
                          },
                          { 
                            isTiered: true, 
                            award: '12个月挑战', 
                            subTiers: [
                              { 
                                label: '11', 
                                title: '12个月内11次达标',
                                items: [
                                  { text: '养老规划师技能证书', icon: ScrollText },
                                  { text: '1800元奖学金', icon: Wallet, isMoney: true }
                                ],
                                color: 'text-emerald-600',
                                bg: 'bg-emerald-50'
                              },
                              { 
                                label: '12', 
                                title: '12个月均达标',
                                items: [
                                  { text: '宏运世家会员身份', icon: Award },
                                  { text: '3000元奖学金', icon: Wallet, isMoney: true }
                                ],
                                color: 'text-amber-600',
                                bg: 'bg-amber-50'
                              }
                            ]
                          },
                        ].map((item, i) => i === activeChallengeNode && (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="w-full flex flex-col h-full"
                          >
                            {item.isTiered ? (
                              <div className="space-y-4">
                                {/* Sub-selection Cards UI */}
                                <div className="grid grid-cols-2 gap-2.5">
                                  {item.subTiers?.map((sub, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => setActiveChallengeSubTier(idx)}
                                      className={`relative p-2.5 rounded-xl border-2 transition-all duration-300 text-left ${
                                        activeChallengeSubTier === idx 
                                          ? 'bg-brand-green border-brand-green text-white shadow-md' 
                                          : 'bg-white border-slate-50 text-slate-400 hover:border-slate-200'
                                      }`}
                                    >
                                      <div className="absolute -top-1.5 -left-1.5 pointer-events-none z-10">
                                        <div className="px-2 py-1 text-[8px] font-bold bg-slate-400 text-white rounded-sm shadow-sm">
                                          未达标
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-center justify-center gap-0.5 h-full">
                                        <span className="text-[12px] font-black tracking-tight">{sub.title}</span>
                                        {idx === 1 && (
                                          <span className="text-[12px] font-black tracking-tight">
                                            直招≥1人
                                          </span>
                                        )}
                                      </div>
                                    </button>
                                  ))}
                                </div>

                                {/* Award Details for selected sub-tier */}
                                {item.subTiers && (
                                  <motion.div 
                                    key={activeChallengeSubTier}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-2 py-1"
                                  >
                                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                                      {item.subTiers[activeChallengeSubTier].items.map((subItem, sidx) => (
                                        <div key={sidx} className="flex items-center gap-2.5">
                                          <div className={`w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm shrink-0`}>
                                            {subItem.isMoney ? (
                                              <Wallet className={`w-3 h-3 ${item.subTiers![activeChallengeSubTier].color}`} />
                                            ) : (
                                              <subItem.icon className={`w-3 h-3 text-emerald-600`} />
                                            )}
                                          </div>
                                          <span className="text-[10px] font-black text-slate-500 tracking-tight">{subItem.text}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-3 py-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-[12px] font-black text-slate-500 tracking-tight">{item.award}</h4>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${activeChallengeNode <= 1 ? 'bg-brand-green-light text-brand-green' : 'bg-slate-100 text-slate-400'}`}>
                                    {activeChallengeNode <= 1 ? '已达标' : '未达标'}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-2">
                                  {item.items?.map((subItem, sidx) => (
                                    <div key={sidx} className="flex items-center gap-2.5">
                                      <div className={`w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm shrink-0`}>
                                        {subItem.isMoney ? (
                                          <Wallet className={`w-3 h-3 ${item.color}`} />
                                        ) : (
                                          <item.icon className={`w-3 h-3 ${item.color}`} />
                                        )}
                                      </div>
                                      <span className="text-[11px] font-black text-slate-500 tracking-tight">{subItem.text}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                        
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
              </div>
            </section>
          </>
        ) : (
        <div className="flex flex-col">
          {/* Team Sub-tabs */}
          <div className="flex px-4 py-2 gap-2 bg-white border-b border-slate-100">
            {['星钻工作室', '恒星工作室'].map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveTeamSubTab(sub)}
                className={`flex-1 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                  activeTeamSubTab === sub 
                    ? 'bg-brand-green text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          <div className="p-4">
            {activeTeamSubTab === '星钻工作室' ? (
              <div className="space-y-4">
                {/* Month Switcher */}
                <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100">
                  <div className="bg-slate-100 rounded-lg flex p-0.5 w-full">
                    {['2026-05', '2026-04'].map(p => (
                      <button
                        key={p}
                        onClick={() => setTeamStarPeriod(p)}
                        className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                          teamStarPeriod === p
                            ? 'bg-white text-brand-green shadow-sm'
                            : 'bg-transparent text-slate-400 hover:text-slate-500'
                        }`}
                      >
                        <Calendar className={`w-3 h-3 ${teamStarPeriod === p ? 'text-brand-green' : 'text-slate-300'}`} />
                        {p.replace('-', '年')}月
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary Card */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <h3 className="font-bold text-slate-800 leading-tight">荣誉达标追踪</h3>
                      </div>
                    </div>
                    {teamStarPeriod === '2026-05' && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded border bg-brand-green-light text-brand-green border-brand-green-muted">
                        标准工作室暂达标
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-slate-50 rounded-xl p-2 border border-slate-100/50 shadow-sm">
                      <p className="text-[9px] text-slate-500 mb-1">月度系统人力</p>
                      <p className="text-base font-bold text-slate-800">6 <span className="text-[9px] font-normal text-slate-400">人</span></p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2 border border-slate-100/50 shadow-sm">
                      <p className="text-[9px] text-slate-500 mb-1">暂达成星钻人力</p>
                      <p className="text-base font-bold text-slate-800">{starAchieved.length} <span className="text-[9px] font-normal text-slate-400">人</span></p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2">
                      <p className="text-[9px] text-slate-500 mb-1">标准档位缺口</p>
                      <p className="text-base font-bold text-slate-800">
                        {Math.max(0, 4 - starAchieved.length) === 0 ? '-' : Math.max(0, 4 - starAchieved.length)}
                        <span className="text-[9px] font-normal text-slate-400">人</span>
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2">
                      <p className="text-[9px] text-slate-500 mb-1">优秀档位缺口</p>
                      <p className="text-base font-bold text-orange-500">
                        {Math.max(0, 6 - starAchieved.length) === 0 ? '-' : Math.max(0, 6 - starAchieved.length)}
                        <span className="text-[9px] font-normal text-slate-400">人</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Member List & Gap Analysis Container */}
                <div className="space-y-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-700 px-1">工作室系统人力明细</h4>
                  
                    {/* Achieved List moved above Gap Analysis (Request) */}
                    <div className="space-y-2">
                      <button 
                        onClick={() => setIsAchievedMembersCollapsed(!isAchievedMembersCollapsed)}
                        className="w-full text-[10px] font-bold text-brand-green px-1 flex items-center justify-between group active:scale-[0.98] transition-transform"
                      >
                        <span className="flex items-center gap-1">
                          <motion.div
                            animate={{ rotate: isAchievedMembersCollapsed ? 0 : 90 }}
                          >
                            <ChevronRight className="w-3 h-3" />
                          </motion.div>
                          暂达成星钻人力 ({starAchieved.length})
                        </span>
                      </button>
                      
                      <AnimatePresence>
                        {!isAchievedMembersCollapsed && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-1 mb-2 flex items-center gap-1">
                              <Gift className="w-3 h-3 text-slate-400" />
                              <p className="text-[10px] font-bold text-slate-400">有机会获得荣誉表彰</p>
                            </div>
                            <div className="space-y-2">
                              {starAchieved.map(m => (
                                <div key={m.id} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 relative overflow-hidden">
                                  {/* Standard Tag (Request 2) */}
                                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-brand-green-light text-brand-green text-[8px] font-bold rounded-bl-lg border-l border-b border-brand-green-muted">
                                    标准一
                                  </div>
                                  
                                  <div className="flex items-center justify-between mt-1">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                        {m.name[0]}
                                      </div>
                                      <div>
                                        <p className="text-xs font-bold text-slate-800">{m.name}</p>
                                        <p className="text-[9px] text-slate-400">编号: {m.id}</p>
                                      </div>
                                    </div>
                                    
                                    {/* Achievement Info (Request 1) */}
                                    <div className="text-right self-end">
                                      <p className="text-[10px] font-bold text-slate-600">
                                        已达成: {m.fyc}元 / {m.policies}件
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Not Achieved List */}
                    <div className="space-y-2">
                      <div className="flex flex-col gap-2 px-1">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> 未达成星钻人力 ({starNotAchieved.length})
                          </p>
                          <div className="flex bg-slate-50 rounded-lg p-0.5 border border-slate-200/30">
                            {['标准一', '标准二'].map(s => (
                              <button 
                                key={s}
                                onClick={() => setActiveStandard(s)}
                                className={`px-2 py-1 text-[9px] font-bold rounded-md transition-all ${activeStandard === s ? 'bg-brand-green text-white shadow-sm' : 'text-slate-400'}`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Search Input for Star Studio */}
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="输入姓名搜索" 
                            value={starSearchQuery}
                            onChange={(e) => setStarSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-lg py-1.5 pl-6 pr-3 text-[10px] focus:outline-none focus:ring-1 focus:ring-brand-green/20"
                          />
                        </div>
                      </div>
                      
                      <div className="px-1 mb-2">
                        <p className="text-[9px] font-bold text-slate-400">
                          标准：{activeStandard === '标准一' ? '当月个人首年佣金FYC≥3000元，且净寿险保单件数≥2件' : '当月个人首年佣金FYC≥4500元'}
                        </p>
                      </div>

                      {starNotAchieved.map(m => (
                        <div key={m.id} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 transition-all">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                {m.name[0]}
                              </div>
                              <div>
                                <div className="flex items-center gap-1">
                                  <p className="text-xs font-bold text-slate-800">{m.name}</p>
                                  {m.id === fastestToStar?.id && (
                                    <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[8px] font-bold rounded">缺口最小</span>
                                  )}
                                </div>
                                <p className="text-[9px] text-slate-400">编号: {m.id}</p>
                              </div>
                            </div>
                            
                            {/* Achievement Info moved to top right (Request 2) */}
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-slate-600">
                                已达成: {m.fyc}元{activeStandard === '标准一' ? ` / ${m.policies}件` : ''}
                              </p>
                            </div>
                          </div>
                          
                          {activeStandard === '标准一' ? (
                            <div className="pt-2 border-t border-slate-50 mt-4"> {/* Increased spacing (Request 4) */}
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-1 h-1 rounded-full bg-orange-400"></div>
                                  <span className="text-[9px] text-slate-500">FYC缺口: <span className="font-bold text-orange-600">{m.fycGap}</span></span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <div className="w-1 h-1 rounded-full bg-orange-400"></div>
                                  <span className="text-[9px] text-slate-500">件数缺口: <span className="font-bold text-orange-600">{m.policyGap}</span></span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="pt-2 border-t border-slate-50 mt-4"> {/* Increased spacing (Request 4) */}
                              <div className="flex justify-end items-center mb-1">
                                <span className="text-[9px] text-slate-500">FYC缺口: <span className="font-bold text-orange-600">{m.fycGap}元</span></span>
                              </div>
                              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(100, (m.fyc / 4500) * 100)}%` }}
                                  className="h-full bg-brand-green rounded-full"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTeamSubTab === '恒星工作室' ? (
              <div className="space-y-4">
                {/* Quarter Switcher */}
                <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100">
                  <div className="bg-slate-100 rounded-lg flex p-0.5 w-full">
                    {['2026Q2', '2026Q1'].map(p => (
                      <button
                        key={p}
                        onClick={() => setTeamStellarPeriod(p)}
                        className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                          teamStellarPeriod === p
                            ? 'bg-white text-brand-green shadow-sm'
                            : 'bg-transparent text-slate-400 hover:text-slate-500'
                        }`}
                      >
                        <Calendar className={`w-3 h-3 ${teamStellarPeriod === p ? 'text-brand-green' : 'text-slate-300'}`} />
                        {p.replace('Q', '年Q')}季度
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stellar Summary */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <h3 className="font-bold text-slate-800 leading-tight">荣誉达标追踪</h3>
                      </div>
                    </div>
                    {stellarAchieved.length >= 2 ? (
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-bold rounded border border-purple-100">
                        标准工作室阶段暂达标
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-bold rounded border border-orange-100">
                        标准工作室阶段未达标
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-slate-50 rounded-xl p-2">
                      <p className="text-[9px] text-slate-500 mb-1">月均系统人力</p>
                      <p className="text-base font-bold text-slate-800">{stellarMembers.length} <span className="text-[9px] font-normal text-slate-400">人</span></p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2">
                      <p className="text-[9px] text-slate-500 mb-1">阶段暂达成恒星人力</p>
                      <p className="text-base font-bold text-slate-800">{stellarAchieved.length} <span className="text-[9px] font-normal text-slate-400">人</span></p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2">
                      <p className="text-[9px] text-slate-500 mb-1">标准档位缺口</p>
                      <p className="text-base font-bold text-slate-800">{Math.max(0, 2 - stellarAchieved.length) === 0 ? '-' : Math.max(0, 2 - stellarAchieved.length)} <span className="text-[9px] font-normal text-slate-400">人</span></p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2">
                      <p className="text-[9px] text-slate-500 mb-1">优秀档位缺口</p>
                      <p className="text-base font-bold text-red-500">{Math.max(0, 3 - stellarAchieved.length) === 0 ? '-' : Math.max(0, 3 - stellarAchieved.length)} <span className="text-[9px] font-normal text-slate-400">人</span></p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100/50">
                    <p className="text-[9px] text-slate-500 mb-0.5">机构拟获得总部支持客户经营费用</p>
                    <p className="text-base font-bold text-slate-800 mb-1">¥ {teamStellarPeriod === '2026Q2' ? '1,000' : '0'}</p>
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-500">
                      <AlertCircle className="w-3 h-3 text-brand-green shrink-0" />
                      <span>
                        {teamStellarPeriod === '2026Q2'
                          ? `达标优秀工作室拟可获得 ¥2,400，距离该档位仅差${Math.max(0, 3 - stellarAchieved.length)}人`
                          : '本季度尚未获得客户经营费用支持，达标优秀工作室将可获得 ¥2,400'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stellar Detail List */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-700 px-1">工作室系统人力明细</h4>
                  
                  {/* Stellar Achieved */}
                  <div className="space-y-2">
                    <button 
                      onClick={() => setIsStellarAchievedMembersCollapsed(!isStellarAchievedMembersCollapsed)}
                      className="w-full text-[10px] font-bold text-brand-green px-1 flex items-center justify-between group active:scale-[0.98] transition-transform"
                    >
                      <span className="flex items-center gap-1">
                        <motion.div
                          animate={{ rotate: isStellarAchievedMembersCollapsed ? 0 : 90 }}
                        >
                          <ChevronRight className="w-3 h-3" />
                        </motion.div>
                        阶段暂达成恒星人力 ({stellarAchieved.length})
                      </span>
                    </button>
                    
                    <AnimatePresence>
                      {!isStellarAchievedMembersCollapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-1 mb-2 flex items-center gap-1">
                            <Gift className="w-3 h-3 text-slate-400" />
                            <p className="text-[10px] font-bold text-slate-400">有机会获得荣誉表彰</p>
                          </div>
                          <div className="space-y-2">
                            {stellarAchieved.map(m => (
                            <div key={m.id} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden">
                              {/* Standard Tag */}
                              <div className="absolute top-0 right-0 px-2 py-0.5 bg-brand-green-light text-brand-green text-[8px] font-bold rounded-bl-lg border-l border-b border-brand-green-muted">
                                标准一
                              </div>

                              <div className="flex items-center gap-3 mt-1">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-800">
                                  {m.name[0]}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-800">{m.name}</p>
                                  <p className="text-[9px] text-slate-400">编号: {m.id}</p>
                                </div>
                              </div>
                              
                              <div className="text-right self-end">
                                <p className="text-[10px] font-bold text-slate-600">
                                  已达成: {m.fyc}元 / {m.policies}件
                                </p>
                              </div>
                            </div>
                          ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Stellar Not Achieved */}
                  <div className="space-y-2">
                    <div className="flex flex-col gap-2 px-1">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> 阶段未达成恒星人力 ({filteredStellarMembers.length})
                        </p>
                        <div className="flex bg-slate-50 rounded-lg p-0.5 border border-slate-200/30">
                          {['标准一', '标准二'].map(s => (
                            <button 
                              key={s}
                              onClick={() => setActiveStandard(s)}
                              className={`px-2 py-1 text-[9px] font-bold rounded-md transition-all ${activeStandard === s ? 'bg-brand-green text-white shadow-sm' : 'text-slate-400'}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Search Input for Stellar Studio */}
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="输入姓名搜索" 
                          value={stellarSearchQuery}
                          onChange={(e) => setStellarSearchQuery(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-lg py-1.5 pl-6 pr-3 text-[10px] focus:outline-none focus:ring-1 focus:ring-purple-200/50"
                        />
                      </div>
                    </div>

                    <div className="px-1 mb-2">
                      <p className="text-[9px] font-bold text-slate-400">
                        标准：{activeStandard === '标准一' ? '当月个人首年佣金FYC≥3000元，且净寿险保单件数≥2件' : '当月个人首年佣金FYC≥4500元'}
                      </p>
                    </div>
                    {filteredStellarMembers.map(m => {
                      const fycTarget = activeStandard === '标准一' ? 3000 : 4500;
                      const policyTarget = activeStandard === '标准一' ? 2 : 0;
                      // Ensure m has fyc and policies or defaults
                      const mFyc = (m as any).fyc || 0;
                      const mPolicies = (m as any).policies || 0;
                      const fycGap = Math.max(0, fycTarget - mFyc);
                      const policyGap = Math.max(0, policyTarget - mPolicies);
                      
                      return (
                        <div key={m.id} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 transition-all">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                {m.name[0]}
                              </div>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1">
                                  <p className="text-xs font-bold text-slate-800">{m.name}</p>
                                  {m.id === fastestToStellar?.id && (
                                    <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[8px] font-bold rounded">缺口最小</span>
                                  )}
                                </div>
                                <p className="text-[9px] text-slate-400">编号: {m.id}</p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-slate-600">
                                已达成: {mFyc}元{activeStandard === '标准一' ? ` / ${mPolicies}件` : ''}
                              </p>
                            </div>
                          </div>

                          {activeStandard === '标准一' ? (
                            <div className="pt-2 border-t border-slate-50 mt-4">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-1 h-1 rounded-full bg-orange-400"></div>
                                  <span className="text-[9px] text-slate-500">FYC缺口: <span className="font-bold text-orange-600">{fycGap}</span></span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <div className="w-1 h-1 rounded-full bg-orange-400"></div>
                                  <span className="text-[9px] text-slate-500">件数缺口: <span className="font-bold text-orange-600">{policyGap}</span></span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="pt-2 border-t border-slate-50 mt-4">
                              <div className="flex justify-end items-center mb-1">
                                <span className="text-[9px] text-slate-500">FYC缺口: <span className="font-bold text-orange-600">{fycGap}元</span></span>
                              </div>
                              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(100, (mFyc / 4500) * 100)}%` }}
                                  className="h-full bg-brand-green rounded-full"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-8 text-slate-400 text-xs italic">
                请选择工作室页签
              </div>
            )}
          </div>
        </div>
      )
    }

      {/* Honor List Modal */}
      <AnimatePresence>
        {showHonorListModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHonorListModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative w-full h-full sm:h-auto sm:max-w-md bg-[#f0f9f6] sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header Section with Gradient Background */}
              <div className="relative pt-12 pb-6 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#c1e8d9] via-[#f0f9f6] to-[#f0f9f6] opacity-80" />
                
                {/* Back / Close button in header */}
                <button 
                  onClick={() => setShowHonorListModal(false)}
                  className="absolute top-4 left-4 p-2 text-slate-700 hover:bg-black/5 rounded-full transition-colors z-20"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-full flex justify-center mb-2">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-wider">连星榜单</h2>
                  </div>
                </div>
              </div>

              {/* Grid Section with Background Diamond */}
              <div className="flex-1 overflow-y-auto px-4 pb-4 bg-[#f0f9f6] relative">
                {/* Large Background Diamond - Increased visibility and detail */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.2] pointer-events-none z-0">
                  <svg viewBox="0 0 24 24" className="w-[90%] h-auto text-[#cfe9df]" fill="none" stroke="currentColor" strokeWidth="0.5">
                    <path d="M6 3h12l4 6-10 12L2 9l4-6z" fill="currentColor" fillOpacity="0.4" />
                    <path d="M11 3l-4 6 5 12 5-12-4-6M2 9h20M7 9h10" />
                  </svg>
                </div>

                <div className="grid grid-cols-3 gap-2 relative z-10">
                  {[
                    { name: '丁芬', location: '长宁' }, { name: '邹平英', location: '长宁' }, { name: '窦家宁', location: '长宁' },
                    { name: '王晶晶', location: '长宁' }, { name: '郑文姣', location: '长宁' }, { name: '陈晓丽', location: '杭州' },
                    { name: '许洁', location: '长宁' }, { name: '杨霞红', location: '杭州' }, { name: '张舒', location: '成都' },
                    { name: '王琛', location: '长宁' }, { name: '胡红英', location: '静安' }, { name: '徐芬', location: '人广' },
                    { name: '陈炜', location: '人广' }, { name: '龚文婷', location: '长宁' }, { name: '陈曦', location: '静安' },
                    { name: '杜文娟', location: '人广' }, { name: '吕耀庭', location: '静安' }, { name: '缪爱群', location: '人广' },
                    { name: '秦珊', location: '长宁' }, { name: '黄霏', location: '成都' }, { name: '马嘉忆', location: '成都' },
                  ].map((person, idx) => (
                    <div key={idx} className="bg-white/70 backdrop-blur-[2px] rounded-lg p-2.5 flex items-center gap-2 border border-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] active:scale-[0.97] transition-all">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200/50">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}&backgroundColor=f8fafc`} 
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <h4 className="text-[12px] font-bold text-slate-800 leading-tight truncate">{person.name}</h4>
                        <p className="text-[9px] text-slate-400 font-medium truncate">{person.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Padding for scroll */}
              <div className="h-6 bg-[#f0f9f6]" />

              {/* Float Close Button instead of big block at bottom to match "close button at bottom" request but keep it elegant */}
              <div className="p-4 bg-[#f0f9f6] border-t border-slate-200/50 flex justify-center sticky bottom-0 z-20">
                <button 
                  onClick={() => setShowHonorListModal(false)}
                  className="px-12 py-3 bg-brand-green text-white font-bold rounded-2xl shadow-lg shadow-green-200 active:scale-95 transition-all text-sm"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Honor Poster Preview Modal */}
      <AnimatePresence>
        {showPosterModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPosterModal(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-xs bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="relative aspect-[9/16] bg-gradient-to-b from-[#e6f7f0] to-white overflow-hidden p-6 flex flex-col">
                {/* Logo and Content */}
                <div className="flex justify-start mb-10">
                  <div className="h-6 w-24 bg-brand-green/20 rounded flex items-center justify-center">
                    <span className="text-[8px] font-black text-brand-green/60 tracking-widest">MANULIFE LOGO</span>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <Trophy className="w-6 h-6 text-brand-green" />
                    <h2 className="text-xl font-black text-slate-900 leading-tight">个人年度荣誉汇总</h2>
                    <Trophy className="w-6 h-6 text-brand-green" />
                  </div>
                  <div className="w-12 h-1 bg-brand-green mx-auto rounded-full mb-4" />
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-slate-800">张三</p>
                    <p className="text-[10px] text-slate-500 font-medium">人广  创兴一部</p>
                  </div>
                </div>

                <div className="space-y-4 mt-2 overflow-y-auto max-h-[50vh] pr-2">
                  {/* Personal Section */}
                  <div>
                    <div className="relative mb-3 flex justify-center items-center">
                       {/* Scroll Background for 'Personal' Section */}
                       <div className="absolute inset-x-12 h-6 bg-brand-green/10 rounded-sm" />
                       <div className="absolute left-10 w-1.5 h-7 bg-brand-green/20 rounded-full" />
                       <div className="absolute right-10 w-1.5 h-7 bg-brand-green/20 rounded-full" />
                       <p className="relative z-10 text-sm font-black text-brand-green text-center">个人</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white/60 backdrop-blur-md rounded-xl p-3 border border-brand-green/10 shadow-sm flex flex-col items-center text-center">
                        <Diamond className="w-4 h-4 text-brand-green mb-2" />
                        <p className="text-xs text-slate-500 font-bold mb-1">星钻人力</p>
                        <p className="text-xl font-black text-brand-green font-mono">3 <span className="text-[9px]">次</span></p>
                      </div>
                      <div className="bg-white/60 backdrop-blur-md rounded-xl p-3 border border-brand-green/10 shadow-sm flex flex-col items-center text-center">
                        <Gem className="w-4 h-4 text-brand-green mb-2" />
                        <p className="text-xs text-slate-500 font-bold mb-1">恒星人力</p>
                        <p className="text-xl font-black text-brand-green font-mono">1 <span className="text-[9px]">次</span></p>
                      </div>
                      <div className="bg-white/60 backdrop-blur-md rounded-xl p-3 border border-brand-green/10 shadow-sm flex flex-col items-center text-center">
                        <Heart className="w-4 h-4 text-brand-green mb-2" />
                        <p className="text-xs text-slate-500 font-bold mb-1">慈善证书</p>
                        <p className="text-xl font-black text-brand-green font-mono">1 <span className="text-[9px]">张</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Team Section */}
                  <div>
                    <div className="relative mb-3 flex justify-center items-center">
                       {/* Scroll Background for 'Team' Section */}
                       <div className="absolute inset-x-10 h-6 bg-amber-600/10 rounded-sm" />
                       <div className="absolute left-8 w-1.5 h-7 bg-amber-600/20 rounded-full" />
                       <div className="absolute right-8 w-1.5 h-7 bg-amber-600/20 rounded-full" />
                       <p className="relative z-10 text-sm font-black text-amber-600 text-center">所在团队</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-amber-200/50 shadow-sm flex flex-col items-center text-center">
                        <Diamond className="w-5 h-5 text-amber-600 mb-2" />
                        <p className="text-xs text-slate-500 font-bold mb-1">星钻工作室</p>
                        <p className="text-2xl font-black text-amber-600 font-mono">1 <span className="text-[10px]">次</span></p>
                      </div>
                      <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-amber-200/50 shadow-sm flex flex-col items-center text-center">
                        <Gem className="w-5 h-5 text-amber-600 mb-2" />
                        <p className="text-xs text-slate-500 font-bold mb-1">恒星工作室</p>
                        <p className="text-2xl font-black text-amber-600 font-mono">1 <span className="text-[10px]">次</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-10 text-center">
                </div>
              </div>

              {/* Action Buttons Below Poster */}
              <div className="p-6 bg-slate-50 flex gap-4">
                <button 
                  onClick={() => setShowPosterModal(false)}
                  className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl active:scale-95 transition-all text-sm"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    alert('已模拟分享到微信');
                    setShowPosterModal(false);
                  }}
                  className="flex-[2] py-3 bg-brand-green text-white font-bold rounded-xl shadow-lg shadow-green-100 flex items-center justify-center gap-2 active:scale-95 transition-all text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  分享到微信
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </main>

      {/* Starting Poster Overlay */}
      <AnimatePresence>
        {showPoster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-[380px] overflow-hidden shadow-2xl flex flex-col items-center border border-white/20"
            >
              {/* Header Visual Section */}
              <div className="w-full bg-slate-50/80 pt-10 pb-12 px-6 flex flex-col items-center gap-8 relative overflow-hidden">
                {/* Background decorative circles */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-brand-green/5 rounded-full -translate-x-12 -translate-y-12" />
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-brand-green/5 rounded-full translate-x-8 translate-y-8" />
                
                <div className="flex flex-col items-center gap-6 w-full relative z-10">
                   {/* Streak Title */}
                   <div className="flex flex-col items-center gap-1">
                     <div className="flex items-center gap-2">
                       <span className="text-lg font-black text-slate-900">截止目前已达成：</span>
                       <div className="h-[40px] overflow-hidden flex items-center">
                         <AnimatePresence mode="wait">
                           <motion.span 
                             key={displayStreakCount}
                             initial={{ y: -40, opacity: 0 }}
                             animate={{ y: 0, opacity: 1 }}
                             exit={{ y: 40, opacity: 0 }}
                             transition={{ type: "spring", stiffness: 300, damping: 30 }}
                             className={`text-4xl font-black font-mono transition-colors duration-500 ${displayStreakCount === 0 ? 'text-slate-400' : 'text-brand-green'}`}
                           >
                             {displayStreakCount}
                           </motion.span>
                         </AnimatePresence>
                       </div>
                       <span className="text-lg font-black text-slate-900">连星</span>
                     </div>
                     <span className="text-[10px] text-slate-400 font-medium">本年度是否享有连星中断豁免资格：无</span>
                   </div>

                   {/* Diamond Pyramid Section */}
                   <div className="flex flex-col items-center w-full relative px-6 py-4 group">
                     {/* Background Decorative Gem with Pulsing Glow and Split Effect */}
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <motion.div 
                         initial={false}
                         animate={{ 
                           opacity: simulationStep === 'finished' ? 0.05 : [0.08, 0.22, 0.08],
                           filter: simulationStep === 'finished' 
                             ? "none" 
                             : [
                               "drop-shadow(0 0 10px rgba(34, 197, 94, 0.1))",
                               "drop-shadow(0 0 30px rgba(34, 197, 94, 0.5))",
                               "drop-shadow(0 0 10px rgba(34, 197, 94, 0.1))"
                             ]
                         }}
                         transition={{ 
                           duration: 2, 
                           repeat: simulationStep === 'finished' ? 0 : Infinity, 
                           ease: "easeInOut" 
                         }}
                         className="flex items-center justify-center relative w-[320px] h-[320px]"
                       >
                         <svg viewBox="0 0 24 24" className="w-full h-full text-brand-green" fill="currentColor">
                           {/* Left Half */}
                           <motion.path 
                             d="M6 3 L12 3 L12 21 L2 9 L6 3" 
                             animate={{ 
                               x: simulationStep === 'finished' ? -20 : 0, 
                               rotate: simulationStep === 'finished' ? -45 : 0,
                               originX: "12px",
                               originY: "3px"
                             }}
                             transition={{ type: "spring", stiffness: 80, damping: 15 }}
                           />
                           {/* Right Half */}
                           <motion.path 
                             d="M12 3 L18 3 L22 9 L12 21 L12 3" 
                             animate={{ 
                               x: simulationStep === 'finished' ? 20 : 0, 
                               rotate: simulationStep === 'finished' ? 45 : 0,
                               originX: "12px",
                               originY: "3px"
                             }}
                             transition={{ type: "spring", stiffness: 80, damping: 15 }}
                           />
                         </svg>
                       </motion.div>
                     </div>

                     {/* Row 1: 5 Diamonds */}
                     <div className="flex justify-between w-full max-w-[300px] mb-4 relative z-10">
                       {[
                         { date: '2026.1', simIdx: 0 },
                         { date: '2026.2', simIdx: 1 },
                         { date: '2026.3', simIdx: 2 },
                         { date: '2026.4', simIdx: -1, alert: true },
                         { date: '2026.5', simIdx: -1 },
                       ].map((box, idx) => {
                         const isShattering = simulationStep === 'dimming' && dimmedCount === box.simIdx + 1;
                         const isBoxActive = box.simIdx !== -1 && (simulationStep !== 'idle' ? box.simIdx >= dimmedCount : true);
                         return (
                           <div key={idx} className="flex flex-col items-center gap-2 flex-1 relative">
                             <div className="relative">
                               <EmeraldGem active={isBoxActive} isShattering={isShattering} />
                               {box.alert && (
                                 <div className="absolute -top-1 -right-1">
                                   <AlertCircle className="w-3.5 h-3.5 text-red-500 fill-white" />
                                 </div>
                               )}
                             </div>
                             <span className={`text-[8px] font-black transition-colors duration-500 leading-none ${isBoxActive ? 'text-brand-green/80' : 'text-slate-400'}`}>
                               {box.date}
                             </span>
                           </div>
                         );
                       })}
                     </div>

                     {/* Row 2: 4 Diamonds - More Compact */}
                     <div className="flex justify-center gap-2.5 w-full max-w-[150px] mb-4 relative z-10">
                       {['2026.6', '2026.7', '2026.8', '2026.9'].map((date, idx) => (
                         <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                           <EmeraldGem active={false} />
                           <span className="text-[8px] font-black text-slate-400 leading-none">{date}</span>
                         </div>
                       ))}
                     </div>

                     {/* Row 3: 2 Diamonds - More Compact */}
                     <div className="flex justify-center gap-4 w-full max-w-[80px] mb-4 relative z-10">
                       {['2026.10', '2026.11'].map((date, idx) => (
                         <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                           <EmeraldGem active={false} />
                           <span className="text-[8px] font-black text-slate-400 leading-none">{date}</span>
                         </div>
                       ))}
                     </div>

                     {/* Row 4: 1 Diamond */}
                     <div className="flex justify-center w-full max-w-[60px] relative z-10">
                       <div className="flex flex-col items-center gap-2">
                         <EmeraldGem active={false} />
                         <span className="text-[8px] font-black text-slate-400 leading-none">2026.12</span>
                       </div>
                     </div>
                   </div>

                   {/* Simulation Button Area */}
                   <div className="w-full space-y-4 -mt-2">
                     <button 
                       onClick={() => simulationStep === 'finished' ? setShowPoster(false) : setSimulationStep('dimming')}
                       disabled={simulationStep === 'dimming' || simulationStep === 'resetting'}
                       className={`
                         w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all active:scale-95
                         ${simulationStep === 'finished' 
                           ? 'bg-slate-500 text-white shadow-sm hover:bg-slate-600' 
                           : simulationStep !== 'idle'
                             ? 'bg-brand-green/50 text-white cursor-wait'
                             : 'bg-white border-2 border-brand-green text-brand-green hover:bg-brand-green group'}
                       `}
                     >
                       {simulationStep === 'idle' && <AlertCircle className="w-4 h-4 transition-colors group-hover:text-white" />}
                       <span className={simulationStep === 'idle' ? 'group-hover:text-white' : ''}>
                         {simulationStep === 'finished' ? '已知晓' : '如果本月未达标可能会发生什么'}
                       </span>
                     </button>
                     
                     {simulationStep === 'finished' && (
                       <div className="flex flex-col items-start gap-1.5 ml-2">
                         <span className="text-red-500 text-[11px] font-black">若本月未达标：</span>
                         <motion.div 
                           initial={{ opacity: 0, y: -10 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="flex items-center gap-1.5"
                         >
                           <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                           <span className="text-red-500 text-[11px] font-black whitespace-nowrap">您的连星荣誉可能将重新开始计算</span>
                         </motion.div>
                         <motion.div 
                           initial={{ opacity: 0, y: -10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: 0.2 }}
                           className="flex items-center gap-1.5"
                         >
                           <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                           <span className="text-red-500 text-[11px] font-black whitespace-nowrap">您将失去获得本年度连星中断豁免资格的机会</span>
                         </motion.div>
                       </div>
                     )}
                   </div>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicator Definition Modal */}
      <AnimatePresence>
        {showIndicatorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            {/* Header */}
            <div className="bg-white border-b border-slate-100 flex items-center justify-between px-4 py-3 pt-6">
              <button 
                onClick={() => setShowIndicatorModal(false)}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 active:scale-95 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-base font-black text-slate-800 tracking-tight">指标定义</h3>
              <div className="w-10" />
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-slate-100 flex overflow-x-auto no-scrollbar px-2 sticky top-0 z-10">
              {[
                { key: '业务', icon: Activity },
                { key: '人力', icon: Users },
                { key: '续保率', icon: RefreshCw },
                { key: '组织架构', icon: Building2 },
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setIndicatorTab(cat.key)}
                  className={`flex-none px-4 py-3 text-xs font-black transition-all relative ${
                    indicatorTab === cat.key ? 'text-brand-green' : 'text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <cat.icon className="w-3.5 h-3.5" />
                    {cat.key}
                  </div>
                  {indicatorTab === cat.key && (
                    <motion.div 
                      layoutId="indicatorTab" 
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-green rounded-full" 
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-10 bg-slate-50">
              {indicatorTab === '续保率' ? (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-3.5 bg-brand-green rounded-full"></div>
                    <h4 className="text-[13px] font-black text-slate-800 leading-tight">13个月寿险保单保费续保率-滚动6个月/滚动12个月</h4>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[11px] text-slate-600 font-bold leading-relaxed">(统计期内生效之年缴寿险保单实收第二保单年度保费总和+统计期内生效之月缴保单实收第一、第二年度保单保费总和)/(统计期内生效之年缴寿险保单实收第一保单年度保费总和+统计期内生效之月缴保单应收第一、第二年度保单保费总和) x 100%</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">说明</p>
                    <ul className="space-y-2">
                      {[
                        '年缴/月缴：以保单首次生效时的缴费方式认定',
                        '统计期 (滚动6个月)：考核月往前第14个月至第19个月',
                        '统计期 (滚动12个月)：考核月往前第14个月至第25个月',
                        '保单统计范围：主险保单生效第14个月保单状态为"缴费期内""失效""合同退保""减额缴清"的期缴寿险保单。不含趸缴寿险、意外险、投连险、万能险、团体保险、网销保单。',
                        '实收保费：指实收主险（含附加险）保费，不含"中宏自动增额权益 (IPO)"以及自动贷款垫缴保费产生的保费。',
                        '应收保费：指月缴保单首次生效时的月缴保费金额 x 保单统计时月缴保单应收保费月数。月缴保费计算规则根据运营规则适时调整，目前计算规则为：月缴保费=年缴保费x0.09',
                        '特别说明：月缴保单如单张保单实收保费大于应收保费，则此单实收保费将按应收保费计入续保率核算。',
                      ].map((note, nIdx) => (
                        <li key={nIdx} className="flex gap-2">
                          <span className="text-brand-green text-[8px] mt-1">•</span>
                          <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{note}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                (
                  {
                    业务: [
                      { name: '净FYC发佣', definition: '当月实收且已折算的佣金总额（扣除撤件等变动金额）' },
                      { name: '净FYC签发', definition: '当月已签发保单对应折算的应发佣金总额' },
                      { name: '签发可计佣FYC', definition: '当月已签发且达到可计发佣金标准的应折算佣金总额' },
                      { name: '续佣RYC', definition: '非首年保单实收保费折算的续期服务津贴/佣金' },
                      { name: '净签发件数', definition: '当月已签发且过了犹豫期的净寿险保单件数（不含退保、撤单）' },
                      { name: '递交保单数（件）', definition: '当月发起递交并获得投保单号的寿险保单总数' },
                      { name: '递交APE', definition: '当月递交的所有寿险保单的折算年缴标准保费' },
                      { name: '总净APE', definition: '当月已签发且生效的保单按首年折算的标准保费（扣除犹豫期退保）' },
                      { name: '建议书打印量', definition: '通过业务系统指导/生成的个人及家庭保障建议书份数' },
                      { name: '双考勤出席率', definition: '同时满足线上/线下双重考勤规定的合格天数比例' },
                    ],
                    人力: [
                      { name: '直招人力', definition: '由主管或辅导人直接推荐并成功入司的大专及以上学历新进营销员' },
                      { name: '主管数量', definition: '团队中所有主管的数量，不含主管本人。' },
                      { name: '出单人力', definition: '当月净寿险保单件数大于等于1件的在职营销员人数' },
                      { name: '3M0', definition: '连续3个月净寿险保单件数<1的人数' },
                      { name: '递交出单人力', definition: '当月有新进阶或递交保单记录的营销员人力' },
                      { name: '净出单人力', definition: '当月完成了净寿险签单且至少有1件签发的营销员人力' },
                    ],
                    组织架构: [
                      { name: '直辖工作室', definition: '是指由业务主管及其直辖职级为FC的保险营销员组成的营业单位。' },
                      { name: '营业区', definition: '是指职级为助理区经理(ADM) 及以上的业务主管所辖团队中扣除其直接或间接育成之高级助理区经理(SADM) 及以上职级业务主管团队后的营业单位。' },
                      { name: '所辖团队', definition: '是指由业务主管及所有与其具有所辖关系的保险营销员组成的营业单位。' },
                    ],
                  } as Record<string, { name: string; definition: string }[]>
                )[indicatorTab]?.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-3.5 bg-brand-green rounded-full"></div>
                      <h4 className="text-[13px] font-black text-slate-800 leading-tight">{item.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold leading-relaxed pl-3">{item.definition}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StarDiamondHonorPage;

