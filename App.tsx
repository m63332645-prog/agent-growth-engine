import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  TrendingUp, 
  Award, 
  Medal, 
  CheckCircle2, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown, 
  Info, 
  Target, 
  Gem, 
  Calendar, 
  Trophy, 
  Star, 
  Users,
  User,
  AlertCircle, 
  ShieldCheck, 
  LayoutDashboard,
  ArrowRight,
  Sparkles,
  History,
  Clock,
  Diamond,
  HelpCircle,
  Calculator
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType, PolicyDetail, BasicLawRequirement, TeamMember, PromotionData, PerformanceStats } from './types';
import { 
  MOCK_PERSONAL_STATS, 
  MOCK_TEAM_STATS, 
  MOCK_ATTENDANCE, 
  MOCK_TRAJECTORY, 
  MOCK_PROMOTION,
  MOCK_TEAM_MEMBERS,
  MOCK_POLICIES,
  MOCK_GROWTH_TREND,
  MOCK_GROWTH_RADAR,
  MOCK_DIMENSION_TRENDS,
  MOCK_RANKINGS
} from './constants';
import FloatingButton from './FloatingButton';
import MyIncome from './MyIncome';
import TeamPerformance from './TeamPerformance';
import HongyunZone from './HongyunZone';
import SupervisorIncomeCalculator from './SupervisorIncomeCalculator';
import { MemberPerformanceDetail } from './components/team/MemberPerformanceDetail';
import { TeamManagementDetailModal } from './components/team/TeamManagementDetailModal';
import StarDiamondHonorPage from './components/StarDiamondHonorPage';
import { RecruitmentManagementModal } from './components/RecruitmentManagementSystem';
import { RetentionManagementModal } from './components/RetentionManagementPage';
import { PromotionManagementModal } from './components/PromotionManagementPage';
import { FinancialSubsidyModal } from './components/FinancialSubsidyPage';

// --- Gap Indicator Component ---
const GapIndicator: React.FC<{ item: any; isHidden?: boolean }> = ({ item, isHidden }) => {
  const percentage = Math.min(100, (item.current / item.target) * 100);
  const formatValue = (val: any) => isHidden ? '****' : val;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end px-0.5">
        <span className="text-[10px] text-slate-500 font-bold leading-tight">{item.label}</span>
        <div className="text-right">
          <span className={`text-[10px] font-black ${item.type === 'gap' ? 'text-rose-500' : 'text-orange-500'}`}>
            {formatValue(item.current)}{item.unit}
          </span>
          <span className="text-[9px] text-slate-400 font-bold mx-1">/</span>
          <span className="text-[10px] text-slate-400 font-bold">
            {formatValue(item.target)}{item.unit}
          </span>
        </div>
      </div>
      <div className="h-3 w-full bg-slate-100/50 rounded-full overflow-hidden border border-white/40 flex p-0.5 shadow-inner">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${
            item.type === 'gap' ? 'bg-gradient-to-r from-rose-400 to-rose-500' : 'bg-gradient-to-r from-orange-400 to-orange-500'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
        {percentage < 100 && (
          <div className="flex-1 h-full bg-slate-200/10 ml-0.5 rounded-full relative overflow-hidden">
          </div>
        )}
      </div>
    </div>
  );
};

// --- Member Metric Badges Component ---
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

// --- Amount Display Component ---
const AmountDisplay: React.FC<{ 
  value: number | string; 
  isHidden: boolean; 
  className?: string;
  prefix?: string;
  suffix?: string;
}> = ({ value, isHidden, className, prefix = '', suffix = '' }) => {
  if (isHidden) {
    return <span className={className}>{prefix}****{suffix}</span>;
  }
  return <span className={className}>{prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}</span>;
};

// Team Detail Modal
const TeamDetailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  members: TeamMember[];
  isAmountHidden: boolean;
  // Props to trigger main app modals from the detail view
  onTriggerBasicLaw: () => void;
  onTriggerPromotion: () => void;
  onTriggerHonor: () => void;
  onTriggerSubsidy: () => void;
}> = ({ isOpen, onClose, members, isAmountHidden, onTriggerBasicLaw, onTriggerPromotion, onTriggerHonor, onTriggerSubsidy }) => {
  const [activeTab, setActiveTab] = useState<'direct' | 'subordinate'>('direct');
  const [expandedManagers, setExpandedManagers] = useState<Record<string, boolean>>({});
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  if (!isOpen) return null;

  const toggleManager = (id: string) => {
    setExpandedManagers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNameClick = (member: TeamMember) => {
    setSelectedMember(member);
  };

  // 模拟直辖室人员
  const directUnitMembers = members.filter(m => m.rank !== 'SUM');
  
  // 模拟辖下主管架构
  const managers = members.filter(m => m.rank === 'SUM');
  const getSubordinates = (managerId: string) => {
    return managerId === '3' ? directUnitMembers : []; 
  };

  const renderRow = (member: TeamMember, isSubordinate = false) => (
    <tr key={member.id} className={`${isSubordinate ? 'bg-slate-50/50' : 'hover:bg-slate-50/30'} transition-colors`}>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className={`flex items-center gap-2 ${isSubordinate ? 'pl-8' : ''}`}>
          {!isSubordinate && member.rank === 'SUM' && (
            <button 
              onClick={() => toggleManager(member.id)}
              className="w-5 h-5 flex items-center justify-center rounded bg-slate-100 text-slate-500 active:scale-90 transition"
            >
              <i className={`fa-solid ${expandedManagers[member.id] ? 'fa-minus' : 'fa-plus'} text-[10px]`}></i>
            </button>
          )}
          {!isSubordinate && member.rank !== 'SUM' && <div className="w-5" />}
          <div className={`w-6 h-6 rounded-full ${isSubordinate ? 'bg-slate-200 text-slate-500' : 'bg-green-100 text-[#00A758]'} text-[10px] flex items-center justify-center font-bold`}>
            {member.name.charAt(0)}
          </div>
          <button 
            onClick={() => handleNameClick(member)}
            className={`text-[13px] font-bold underline decoration-green-200 underline-offset-2 hover:text-[#00A758] transition-colors ${isSubordinate ? 'text-slate-600' : 'text-slate-800'}`}
          >
            {member.name}
          </button>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <span className={`text-[11px] px-1.5 py-0.5 rounded font-bold ${isSubordinate ? 'bg-slate-100 text-slate-500' : 'bg-green-50 text-[#00A758]'}`}>
          {member.rank}
        </span>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-[12px] text-slate-600 font-medium">
        {member.groupName}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-[12px] text-slate-600 tabular-nums">
        {member.birthday}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-[12px] text-slate-600 tabular-nums">
        {member.hireDate}
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="text-[12px] font-black text-[#00A758] tabular-nums">{member.hireDays}天</span>
      </td>
    </tr>
  );

  return (
    <FullScreenModal isOpen={isOpen} onClose={onClose} title="团队人员明细" bgClass="bg-slate-50">
      <div className="flex-1 flex flex-col relative font-sans">
        {/* Render nested detail view if a member is selected */}
        {selectedMember && (
          <MemberPerformanceDetail 
            member={selectedMember} 
            onBack={() => setSelectedMember(null)}
            isAmountHidden={isAmountHidden}
            onOpenBasicLaw={onTriggerBasicLaw}
            onOpenPromotion={onTriggerPromotion}
            onOpenHonor={onTriggerHonor}
            onOpenSubsidy={onTriggerSubsidy}
          />
        )}

        {/* Tab Selector */}
        <div className="px-6 py-4 bg-transparent flex justify-end">
          <div className="glass-tab p-1 rounded-2xl flex ios-shadow">
            <button 
              onClick={() => setActiveTab('direct')}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'direct' ? 'bg-white shadow-md text-[#00A758]' : 'text-slate-500'}`}
            >
              直辖室
            </button>
            <button 
              onClick={() => setActiveTab('subordinate')}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'subordinate' ? 'bg-white shadow-md text-[#00A758]' : 'text-slate-500'}`}
            >
              辖下主管
            </button>
          </div>
        </div>

        {/* Excel-like Table Content */}
        <div className="flex-1 overflow-hidden flex flex-col bg-white/40 backdrop-blur-md squircle-lg mx-3 mb-10 ios-shadow border border-white/40">
          <div className="px-6 py-4 flex items-center justify-between border-b border-white/20 bg-white/10">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {activeTab === 'direct' ? '直辖人员清单' : '主管架构清单'}
            </h4>
            <span className="text-[10px] text-[#00A758] font-black bg-green-50 px-3 py-1 rounded-full border border-green-100">
              {activeTab === 'direct' ? `TOTAL: ${directUnitMembers.length}` : `TOTAL: ${managers.length}`}
            </span>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-white/30">
                <tr>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">姓名</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">职级</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">组名</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">生日</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">入职日期</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">入职天数</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {activeTab === 'direct' ? (
                  directUnitMembers.map(member => renderRow(member))
                ) : (
                  managers.map(manager => (
                    <React.Fragment key={manager.id}>
                      {renderRow(manager)}
                      {expandedManagers[manager.id] && getSubordinates(manager.id).map(sub => renderRow(sub, true))}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Safe area spacer for mobile */}
        <div className="h-6 bg-transparent"></div>
      </div>
    </FullScreenModal>
  );
};

// Honor Ranking Modal
const HonorCompetitionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const internationalHonors = [
    { id: 'mdrt', name: 'MDRT', icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=MDRT%20medal%20icon%20with%20laurel%20wreath%20gold%20color%20simple%20clean%20design&image_size=square', tag: '达成追踪' },
    { id: 'ida', name: 'IDA', icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=IDA%20medal%20icon%20with%20dragon%20symbol%20gold%20red%20color%20simple%20clean%20design&image_size=square', tag: '达成追踪' },
  ];

  const manulifeHonors = [
    { id: 'elite', name: '群英会', icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elite%20club%20medal%20icon%20with%20laurel%20wreath%20green%20gold%20color%20simple%20clean%20design&image_size=square', tag: '达成追踪' },
    { id: 'top', name: '顶尖高手', icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=top%20achiever%20medal%20icon%20with%20fern%20leaf%20green%20blue%20color%20simple%20clean%20design&image_size=square', tag: '达成追踪' },
  ];

  if (!isOpen) return null;

  return (
    <FullScreenModal isOpen={isOpen} onClose={onClose} title="" bgClass="bg-[#F4F6F8]" hideHeader={true}>
      <div className="flex flex-col h-full">
        {/* Header Area */}
        <div className="relative bg-gradient-to-br from-[#003d25] via-[#006d3a] to-[#00A758] pt-8 pb-6 px-4">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-8 left-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white z-10"
          >
            <i className="fa-solid fa-chevron-left text-sm"></i>
          </button>

          <div className="text-center">
            <h2 className="text-white text-lg font-black tracking-wide">荣誉</h2>
          </div>

          <div className="flex justify-center mt-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center relative">
              <img 
                src="https://picsum.photos/seed/user123/100/100" 
                className="w-full h-full rounded-full object-cover"
                alt="Avatar"
              />
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="bg-white/80 backdrop-blur-md px-4 py-3 border-b border-slate-100">
          <div className="flex justify-around">
            {[
              { id: 'mdrt', label: 'MDRT' },
              { id: 'ida', label: 'IDA' },
              { id: 'elite', label: '群英会' },
            ].map((tab) => (
              <span
                key={tab.id}
                className="text-xs font-black text-[#00A758]"
              >
                {tab.label}
              </span>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
          {/* International Honors Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-800">国际荣誉</h3>
            {internationalHonors.map((honor) => (
              <div key={honor.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center overflow-hidden">
                    <img src={honor.icon} alt={honor.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">{honor.name}</h4>
                  </div>
                </div>
                <button className="text-xs font-black text-[#00A758] bg-green-50 px-4 py-1.5 rounded-full">
                  {honor.tag} <i className="fa-solid fa-chevron-right text-[8px] ml-1"></i>
                </button>
              </div>
            ))}
          </div>

          {/* Manulife Honors Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-800">中宏荣誉</h3>
            {manulifeHonors.map((honor) => (
              <div key={honor.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center overflow-hidden">
                    <img src={honor.icon} alt={honor.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">{honor.name}</h4>
                  </div>
                </div>
                <button className="text-xs font-black text-[#00A758] bg-green-50 px-4 py-1.5 rounded-full">
                  {honor.tag} <i className="fa-solid fa-chevron-right text-[8px] ml-1"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FullScreenModal>
  );
};

// FinancialSubsidyModal is imported from ./components/FinancialSubsidyPage

const TrainingManagementModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const trainingSkills = [
    { subject: '产品知识', A: 85, fullMark: 100 },
    { subject: '销售技巧', A: 90, fullMark: 100 },
    { subject: '客户开发', A: 75, fullMark: 100 },
    { subject: '团队管理', A: 60, fullMark: 100 },
    { subject: '合规经营', A: 95, fullMark: 100 },
    { subject: '系统使用', A: 80, fullMark: 100 },
  ];
  const quickLinks = [
    { label: '岗前合规', icon: 'fa-rocket', color: 'text-green-500', bg: 'bg-green-50' },
    { label: '分级分类', icon: 'fa-edit', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: '后续教育', icon: 'fa-briefcase', color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: '待学课程', icon: 'fa-book-open', color: 'text-teal-500', bg: 'bg-teal-50' },
  ];

  if (!isOpen) return null;

  return (
    <FullScreenModal isOpen={isOpen} onClose={onClose} title="培训平台" bgClass="bg-white">
      <div className="flex-1 pb-32 no-scrollbar font-sans overflow-y-auto">
        {/* Search Header */}
        <div className="p-4 flex items-center gap-3 bg-white sticky top-0 z-20 shadow-sm border-b border-gray-50">
           <div className="flex-1 relative">
             <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
             <input type="text" placeholder="搜索课程" className="w-full bg-[#f2f3f5] rounded-full py-2.5 pl-11 pr-4 text-sm font-medium focus:outline-none" />
           </div>
           <button className="w-10 h-10 flex items-center justify-center text-slate-400">
             <i className="fa-solid fa-expand"></i>
           </button>
           <div className="relative">
             <i className="fa-solid fa-comment-dots text-2xl text-slate-400"></i>
             <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] px-1 rounded-full border border-white">99+</span>
           </div>
        </div>

        <div>
          {/* Banner */}
          <div className="px-5 py-2 mt-4">
            <div className="rounded-3xl overflow-hidden shadow-sm relative">
              <img src="https://picsum.photos/seed/training/1200/600" className="w-full aspect-[2/1] object-cover" alt="Training" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/10 flex flex-col justify-center p-8">
                <h4 className="text-2xl font-bold text-white mb-2 drop-shadow-md">新培训平台IPAD版<br/>体验邀请</h4>
                <button className="bg-[#00A758] text-white text-xs font-bold px-6 py-2 rounded-full w-fit">大屏学习更舒心</button>
              </div>
            </div>
          </div>

          {/* Icons */}
          <div className="grid grid-cols-4 gap-4 px-6 py-8">
            {quickLinks.map((link, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <div className={`w-14 h-14 rounded-3xl ${link.bg} flex items-center justify-center ${link.color} text-2xl shadow-sm border border-white`}>
                  <i className={`fa-solid ${link.icon}`}></i>
                </div>
                <span className="text-[11px] font-bold text-slate-600">{link.label}</span>
              </div>
            ))}
          </div>

          {/* Skill Radar Chart */}
          <section className="px-6 mb-10">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
              <h5 className="text-xl font-bold text-slate-800 mb-2">技能雷达图</h5>
              <p className="text-[11px] text-slate-400 font-bold mb-6">寿险营销员核心6大技能评估</p>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={trainingSkills}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} />
                    <Radar name="我的技能" dataKey="A" stroke="#00A758" fill="#00A758" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </div>

        {/* Tab Bar Replacement */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around p-4 z-20">
           <div className="flex flex-col items-center gap-1 text-[#00A758]">
              <i className="fa-solid fa-puzzle-piece text-xl"></i>
              <span className="text-[10px] font-bold">导航</span>
           </div>
           <div className="flex flex-col items-center gap-1 text-slate-400">
              <i className="fa-solid fa-book text-xl"></i>
              <span className="text-[10px] font-bold">课程</span>
           </div>
           <div className="flex flex-col items-center gap-1 text-slate-400">
              <i className="fa-solid fa-user-graduate text-xl"></i>
              <span className="text-[10px] font-bold">班级</span>
           </div>
           <div className="flex flex-col items-center gap-1 text-slate-400">
              <i className="fa-solid fa-user text-xl"></i>
              <span className="text-[10px] font-bold">个人</span>
           </div>
        </div>
      </div>
    </FullScreenModal>
  );
};
const GrowthTrajectoryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const MOCK_TRAJECTORY = [
    { date: '2023-01', title: '签署入职协议' },
    { date: '2023-06', title: '达成百万圆桌会议(MDRT)' },
    { date: '2024-03', title: '晋升业务主管(UM)' },
  ];
  const [selectedKey, setSelectedKey] = useState<string>('income');

  const MOCK_GROWTH_RADAR = [
    { subject: '收入', value: 85, key: 'income' },
    { subject: '活动', value: 92, key: 'activity' },
    { subject: '客户', value: 78, key: 'customer' },
    { subject: '新人', value: 65, key: 'recruitment' },
    { subject: '技能', value: 88, key: 'skill' },
    { subject: '留存', value: 95, key: 'retention' },
  ];
  const currentTrend = {
    label: '收入成长趋势',
    data: [
      { year: '2021', val: 50 },
      { year: '2022', val: 65 },
      { year: '2023', val: 75 },
      { year: '2024', val: 85 },
      { year: '2025', val: 92 },
    ]
  };
  const handleRadarClick = () => {};

  if (!isOpen) return null;

  return (
    <FullScreenModal isOpen={isOpen} onClose={onClose} title="个人成长轨迹" bgClass="bg-slate-50">
      <div className="flex-1 p-6 pb-32 space-y-10 no-scrollbar">
        {/* Radar Chart Section */}
        <section className="glass-card squircle-lg p-10 border-white/60 ios-shadow bg-gradient-to-br from-white to-slate-50/50 flex flex-col items-center">
          <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={MOCK_GROWTH_RADAR} onClick={handleRadarClick}>
                  <PolarGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 900 }} />
                  <Radar
                    name="成长值"
                    dataKey="value"
                    stroke="#00A758"
                    strokeWidth={4}
                    fill="#00A758"
                    fillOpacity={0.1}
                    dot={{ r: 5, fill: '#00A758', stroke: '#fff', strokeWidth: 2 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-slate-50 border border-slate-100 px-5 py-2 rounded-full mt-6 shadow-inner">
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                 <i className="fa-solid fa-hand-pointer text-[#00A758]"></i> 点击数据点查看详情
               </p>
            </div>
          </section>

          {/* Detailed Trend Section */}
          <section className="glass-card squircle-lg p-10 border-white/60 ios-shadow bg-gradient-to-br from-white/90 to-emerald-50/30">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-2 h-6 bg-[#00A758] rounded-full shadow-sm"></div>
                {currentTrend.label}
              </h4>
              <span className="text-[10px] font-black text-[#00A758] bg-green-50 px-4 py-1.5 rounded-full border border-green-100 shadow-sm uppercase tracking-widest italic">入职以来</span>
            </div>
            
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentTrend.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00A758" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#00A758" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis 
                    dataKey="year" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="val" 
                    stroke="#00A758" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorVal)" 
                    animationDuration={1500}
                    dot={{ r: 6, fill: '#00A758', strokeWidth: 3, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0, shadow: '0 0 20px rgba(0,167,88,0.5)' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-8 p-6 glass-card squircle-sm border-white shadow-xl bg-gradient-to-br from-amber-50/50 to-orange-50/30">
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                <i className="fa-solid fa-wand-magic-sparkles text-amber-500 mr-2 text-sm"></i>
                <b className="text-slate-900">专家分析:</b> 您在“{MOCK_GROWTH_RADAR.find(r => r.key === selectedKey)?.subject}”维度的表现呈现持续上升趋势。近期的爆发性增长表明您已初步掌握核心能力，请继续保持这一势头。
              </p>
            </div>
          </section>

          {/* Growth Milestones Timeline */}
          <section className="space-y-8 px-1">
            <h4 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <div className="w-2 h-6 bg-slate-200 rounded-full"></div>
              成长里程碑
            </h4>
            <div className="relative pl-10 border-l-2 border-slate-100/50 ml-4 flex flex-col gap-10 py-4">
              {MOCK_TRAJECTORY.map((step, idx) => (
                <div key={step.date || idx} className="relative group">
                  <div className="absolute -left-[51px] top-1 w-5 h-5 rounded-full bg-white border-4 border-[#00A758] shadow-lg group-hover:scale-125 transition-transform duration-300"></div>
                  <div className="glass-card squircle-sm p-6 border-white shadow-sm glass-interaction ios-shadow">
                    <p className="text-[10px] text-slate-400 font-black mb-1 uppercase tracking-widest">{step.date}</p>
                    <h4 className="text-base font-black text-slate-800 tracking-tight leading-tight">{step.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">官方认证成就</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </FullScreenModal>
  );
};

// Basic Law Tracking Modal
const BasicLawModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  stats: any;
  isAmountHidden: boolean;
}> = ({ isOpen, onClose, stats, isAmountHidden }) => {
  const [selectedMonth, setSelectedMonth] = useState('06');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [dataCaliber, setDataCaliber] = useState<'签发' | '发佣'>('签发');
  const [detailCaliber, setDetailCaliber] = useState<'签发' | '发佣'>('签发');
  const [awardScaleMultiplier, setAwardScaleMultiplier] = useState(1.0);
  const [unearnedMode, setUnearnedMode] = useState(false);
  const [showAwardDropdown, setShowAwardDropdown] = useState(false);

  interface AwardItem {
    name: string;
    baseAmount: number;
    criteria: string;
    status: string;
    detail: string;
    period: string;
    gap: string;
  }

  const [activeAward, setActiveAward] = useState<AwardItem | null>(null);

  const getCaliberAmount = (item: { name: string, baseAmount: number }, caliber: '签发' | '发佣') => {
    if (caliber === '签发') {
      return item.baseAmount;
    }
    switch (item.name) {
      case '月度业绩奖':
        return 165;
      case '星钻恒星奖':
        return 850;
      case '营业区每月管理奖':
        return 2500;
      case '所辖季度达标奖':
        return 160;
      case '直辖工作室筹备奖':
        return 800;
      default:
        return item.baseAmount;
    }
  };

  if (!isOpen) return null;

  const renderProgressBar = (
    titleLeft: React.ReactNode, 
    greenValue: string | number, 
    nextLevelValue: string, 
    highestValue: string, 
    currentProgress: string | number, 
    remainderValue: string, 
    percentage: number, 
    labelNext: string = "下一等级", 
    labelMax: string = "最高",
    extraNote?: React.ReactNode
  ) => {
    return (
      <div className="space-y-2 mt-4 font-sans select-none">
        {/* Title & Threshold values line */}
        <div className="flex justify-between items-baseline">
          <div className="text-xs font-bold text-slate-500 leading-tight flex items-baseline gap-1">
            {titleLeft} <span className="text-[#00A758] font-black text-sm font-sans">{greenValue}</span>
          </div>
          <div className="flex gap-4 text-xs font-black text-slate-800 font-sans">
            <span>{nextLevelValue}</span>
            <span>{highestValue}</span>
          </div>
        </div>
        
        {/* Progress Captions below standard */}
        <div className="flex justify-between text-[10px] text-slate-400 font-bold leading-none">
          <span>当前进度</span>
          <div className="flex gap-10">
            <span>{labelNext}</span>
            <span>{labelMax}</span>
          </div>
        </div>

        {/* Progress Bar Track */}
        <div className="relative pt-1">
          <div className="overflow-hidden h-3 text-xs flex rounded-full bg-slate-100 border border-slate-50/50">
            <div 
              style={{ width: `${Math.min(100, Math.max(5, percentage))}%` }} 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#00A758] rounded-full transition-all duration-500"
            />
          </div>
          
          {/* Progress labels beneath the tracker bar */}
          <div className="flex justify-between items-center text-[11px] font-black font-sans mt-1.5">
            <span className="text-[#00A758]">{currentProgress}</span>
            <span className="text-slate-450">{remainderValue}</span>
          </div>
        </div>

        {extraNote && (
          <div className="text-[11px] text-slate-500 font-black mt-2">
            {extraNote}
          </div>
        )}
      </div>
    );
  };

  const renderAwardDetails = (name: string) => {
    switch (name) {
      case '月度业绩奖':
        return (
          <div className="space-y-4">
            {/* Key Metrics Overview */}
            <div className="bg-white rounded-2xl p-5 mx-5 border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="w-1/2 text-center border-r border-[#f4faf7]">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1 select-none">当月奖金</p>
                <p className="text-[26px] font-black text-[#00A758] tracking-tight font-sans leading-none">
                  {unearnedMode ? '0' : Math.round((detailCaliber === '签发' ? 200 : 165) * awardScaleMultiplier)}
                </p>
              </div>
              <div className="w-1/2 text-center">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1 select-none">上年度IDA/MDRT</p>
                <p className="text-[26px] font-black text-[#00A758] tracking-tight font-sans leading-none">Y</p>
              </div>
            </div>

            {/* 月度数据 section */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm space-y-5">
              <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none mb-2 border-l-4 border-[#00A758] pl-2 select-none">
                月度数据 ({detailCaliber}口径)
              </h4>

              {/* Progress bar 1 */}
              {detailCaliber === '签发' ? renderProgressBar(
                <span>FYC(签发) - FYC(发佣)</span>,
                "300",
                "1,500",
                "50,000",
                "1,200",
                "48,800",
                35,
                "下一等级",
                "最高"
              ) : renderProgressBar(
                <span>FYC(签发) - FYC(发佣)</span>,
                "300",
                "1,500",
                "50,050",
                "1,050",
                "49,000",
                28,
                "下一等级",
                "最高"
              )}

              {/* Progress bar 2 */}
              {detailCaliber === '签发' ? renderProgressBar(
                "奖金率",
                "2%",
                "10%",
                "80%",
                "当前进度",
                "8%",
                15,
                "下一等级",
                "最高"
              ) : renderProgressBar(
                "奖金率",
                "1.5%",
                "10%",
                "80%",
                "当前进度",
                "8.5%",
                11,
                "下一等级",
                "最高"
              )}

              {/* Attendance indicator */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-50 select-none">
                <div>
                  <p className="text-[11px] text-slate-400 font-bold">出席率</p>
                  <div className="flex gap-4 mt-1.5 text-xs">
                    <span className="font-bold text-slate-700">实际: <span className="text-[#00A758] font-sans">{detailCaliber === '签发' ? '30%' : '28%'}</span></span>
                    <span className="font-bold text-slate-700">系数: <span className="font-sans text-[#00A758]">1</span></span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold">低档出席要求</p>
                  <span className="inline-block px-2.5 py-1 mt-1.5 rounded-lg text-[11.5px] font-black bg-[#E6F7ED] text-[#00A758]">
                    享有
                  </span>
                </div>
              </div>
            </div>

            {/* 个人寿险保费续保率 card */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm space-y-4">
              <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1 border-l-4 border-[#00A758] pl-2 select-none">
                个人寿险保费续保率
              </h4>

              {/* Mini Table with Merged Green Cell layout */}
              <div className="border border-slate-50 rounded-2xl overflow-hidden shadow-mini">
                <div className="grid grid-cols-3 bg-slate-50 px-4 py-2.5 text-[10px] text-slate-405 font-extrabold uppercase select-none">
                  <span>名称</span>
                  <span className="text-center">实际</span>
                  <span className="text-right">系数</span>
                </div>
                <div className="relative">
                  {/* Rows Area */}
                  <div className="w-2/3 divide-y divide-slate-50 bg-white">
                    <div className="grid grid-cols-2 px-4 py-3 text-xs font-bold text-slate-705">
                      <span>滚动6个月</span>
                      <span className="text-center text-[#00A758] font-sans">60%</span>
                    </div>
                    <div className="grid grid-cols-2 px-4 py-3 text-xs font-bold text-slate-705">
                      <span>滚动12个月</span>
                      <span className="text-center text-[#00A758] font-sans">55%</span>
                    </div>
                  </div>

                  {/* Merged vertical green box on right */}
                  <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-center p-3 border-l border-slate-50 bg-[#E6F7ED]/35">
                    <div className="w-7 h-10 rounded-lg bg-[#E6F7ED] border border-[#BFF3D4]/60 flex items-center justify-center text-[#00A758] font-black font-sans text-xs shadow-sm">
                      1
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial subsidy sub-items */}
              <div className="divide-y divide-slate-50 pt-2 text-xs font-bold tracking-tight select-none">
                <div className="flex justify-between py-3">
                  <span className="text-slate-400 font-bold">财补期内</span>
                  <span className="text-[#00A758] font-black">否</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-slate-400 font-bold">财补差额</span>
                  <span className="text-slate-750 font-sans font-black">10</span>
                </div>
              </div>
            </div>

            {/* 季度通算 card */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm space-y-4">
              <div className="flex justify-between items-center select-none">
                <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none border-l-4 border-[#00A758] pl-2">
                  季度通算
                </h4>
                <span className="text-[10.5px] font-black text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1">
                  补发金额: <span className="text-[#00A758] font-sans font-black">10</span>
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold px-1 select-none">
                <span className="text-slate-455 uppercase">FYC</span>
                <span className="text-[#00A758] font-sans font-black">100</span>
              </div>
            </div>

            {/* 加扣款合计 card */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm flex justify-between items-center text-sm font-black text-slate-800 leading-none select-none">
              <span>加扣款合计</span>
              <span className="text-[#00A758] font-sans text-base">
                {unearnedMode ? '0' : (detailCaliber === '签发' ? '3,000' : '2,500')}
              </span>
            </div>
          </div>
        );

      case '星钻恒星奖':
        return (
          <div className="space-y-4">
            {/* Constellation Grid Headers */}
            <div className="bg-white rounded-2xl p-4 mx-5 border border-slate-100/80 shadow-sm grid grid-cols-4 gap-1 text-center select-none">
              <div className="border-r border-slate-50">
                <p className="text-[10px] text-slate-400 font-bold mb-1">连续月数</p>
                <p className="text-sm font-black text-slate-850 font-sans">3</p>
              </div>
              <div className="border-r border-slate-50">
                <p className="text-[10px] text-slate-400 font-bold mb-1">连续奖励系数</p>
                <p className="text-sm font-black text-slate-850 font-sans">1</p>
              </div>
              <div className="border-r border-slate-50">
                <p className="text-[10px] text-slate-400 font-bold mb-1">当月奖金</p>
                <p className="text-sm font-black text-[#00A758] font-sans">
                  {unearnedMode ? '0' : Math.round(1000 * awardScaleMultiplier).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold mb-1">状态</p>
                <p className="text-sm font-black text-[#00A758]">启动</p>
              </div>
            </div>

            {/* Monthly Comparison Table Card */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm overflow-hidden select-none">
              <div className="grid grid-cols-4 bg-slate-50/50 rounded-xl px-4 py-2.5 text-[10px] text-slate-400 font-extrabold uppercase text-center border-b border-slate-50">
                <span className="text-left font-bold">名称</span>
                <span>当月</span>
                <span>上月</span>
                <span>上上月</span>
              </div>
              <div className="divide-y divide-slate-50 text-xs font-bold text-slate-700">
                <div className="grid grid-cols-4 px-4 py-3.5 text-center items-center">
                  <span className="text-left text-slate-400">FYC</span>
                  <span className="font-sans">200</span>
                  <span className="font-sans">300</span>
                  <span className="font-sans text-rose-500">440.6</span>
                </div>
                <div className="grid grid-cols-4 px-4 py-3.5 text-center items-center">
                  <span className="text-left text-slate-400">净件数</span>
                  <span className="font-sans">2</span>
                  <span className="font-sans">2</span>
                  <span className="font-sans">1</span>
                </div>
                <div className="grid grid-cols-4 px-4 py-3.5 text-center items-center">
                  <span className="text-left text-slate-400 leading-tight">恒星会员</span>
                  <span className="text-xs font-black text-orange-500 whitespace-nowrap">白金星钻</span>
                  <span className="text-xs font-black text-amber-500 whitespace-nowrap">金星钻</span>
                  <span className="text-xs font-black text-amber-500 whitespace-nowrap">金星钻</span>
                </div>
              </div>
            </div>

            {/* 当月数据 card */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm space-y-4">
              <div className="flex justify-between items-center mb-1 select-none">
                <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none border-l-4 border-[#00A758] pl-2">
                  当月数据
                </h4>
                <span className="text-xs font-black text-orange-500">
                  白金星钻
                </span>
              </div>

              {/* Standard 1 */}
              <div className="border border-slate-50 p-4 rounded-2xl bg-slate-50/20 space-y-3">
                <p className="text-xs font-black text-slate-800 uppercase tracking-wider mb-0.5">标准一</p>
                {renderProgressBar(
                  "FYC",
                  "200",
                  "3,000",
                  "15,000",
                  "2,800",
                  "14,800",
                  75,
                  "星钻",
                  "白金星钻"
                )}
                {/* Mini Table under Standard 1 */}
                <div className="border border-slate-50 rounded-xl overflow-hidden bg-white mt-3 select-none">
                  <div className="grid grid-cols-4 bg-slate-50/50 px-3 py-2 text-[9px] text-slate-400 font-extrabold uppercase text-center border-b border-slate-50">
                    <span className="text-left font-bold">名称</span>
                    <span>实际</span>
                    <span>目标</span>
                    <span className="text-right">达标</span>
                  </div>
                  <div className="grid grid-cols-4 px-3 py-2.5 text-center text-xs font-bold text-slate-700 items-center">
                    <span className="text-left text-slate-400 leading-tight">净保单件数</span>
                    <span className="font-sans">2</span>
                    <span className="font-sans">2</span>
                    <div className="text-right">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-black bg-[#E6F7ED] text-[#00A758]">达标</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Standard 2 */}
              <div className="border border-slate-50 p-4 rounded-2xl bg-slate-50/20 space-y-3">
                <p className="text-xs font-black text-slate-800 uppercase tracking-wider mb-0.5">标准二</p>
                {renderProgressBar(
                  "FYC",
                  "200",
                  "4,500",
                  "22,500",
                  "4,300",
                  "22,300",
                  75,
                  "星钻",
                  "白金星钻"
                )}
              </div>
            </div>

            {/* interruptions options statistics */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm grid grid-cols-3 text-center gap-1 select-none">
              <div className="border-r border-slate-50">
                <p className="text-[10px] text-slate-400 font-bold mb-1 leading-tight">本年享有的中断次数</p>
                <p className="text-sm font-black text-slate-850 font-sans">1</p>
              </div>
              <div className="border-r border-slate-50">
                <p className="text-[10px] text-slate-400 font-bold mb-1 leading-tight">已使用</p>
                <p className="text-sm font-black text-[#00A758] font-sans">1</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold mb-1 leading-tight">是否补回</p>
                <p className="text-sm font-black text-slate-400 font-sans">--</p>
              </div>
            </div>

            {/* 加扣款合计 card */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm flex justify-between items-center text-sm font-black text-slate-800 leading-none select-none">
              <span>加扣款合计</span>
              <span className="text-[#00A758] font-sans text-base">
                {unearnedMode ? '0' : '200'}
              </span>
            </div>
          </div>
        );

      case '营业区每月管理奖':
        return (
          <div className="space-y-4">
            {/* Key Metrics Overview */}
            <div className="bg-white rounded-2xl p-5 mx-5 border border-slate-100/80 shadow-sm flex items-center justify-between">
              <div className="w-1/2 text-center border-r border-[#f4faf7]">
                <p className="text-xs text-slate-400 font-bold mb-1 select-none">当月奖金</p>
                <p className="text-2xl font-black text-[#00A758] font-sans leading-none">
                  {unearnedMode ? '0' : Math.round(3000 * awardScaleMultiplier).toLocaleString()}
                </p>
              </div>
              <div className="w-1/2 text-center">
                <p className="text-xs text-slate-400 font-bold mb-1 select-none">职级</p>
                <p className="text-2xl font-black text-[#00A758] font-sans leading-none">ADM</p>
              </div>
            </div>

            {/* 月度数据 */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm space-y-5">
              <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none mb-2 border-l-4 border-[#00A758] pl-2 select-none">
                月度数据
              </h4>

              {/* Progress 1 */}
              {renderProgressBar(
                "营业区FYC",
                "1,000",
                "30,000",
                "720,000",
                "29,000",
                "719,000",
                50,
                "下一等级",
                "最高"
              )}

              {/* Progress 2 */}
              {renderProgressBar(
                "奖金率",
                "100%",
                "2%",
                "2.5%",
                "当前进度",
                "",
                60,
                "下一等级",
                "最高"
              )}

              {/* Mini Table layout */}
              <div className="border border-slate-50 rounded-2xl overflow-hidden mt-4 shadow-mini select-none bg-white">
                <div className="grid grid-cols-3 bg-slate-50 px-4 py-2.5 text-[10px] text-slate-405 font-extrabold uppercase border-b border-slate-50">
                  <span>名称</span>
                  <span className="text-center">实际</span>
                  <span className="text-right">系数</span>
                </div>
                
                <div className="relative">
                  {/* Rows Area */}
                  <div className="w-2/3 divide-y divide-slate-50 bg-white">
                    <div className="grid grid-cols-2 px-4 py-3.5 text-xs font-bold text-slate-700">
                      <span>出席率</span>
                      <span className="text-center text-[#00A758] font-sans">92.31%</span>
                    </div>
                    <div className="grid grid-cols-2 px-4 py-3.5 text-xs font-bold text-slate-700">
                      <span>直辖室保费续保率(滚动6个月)</span>
                      <span className="text-center text-[#00A758] font-sans">60%</span>
                    </div>
                    <div className="grid grid-cols-2 px-4 py-3.5 text-xs font-bold text-slate-700">
                      <span>直辖室保费续保率(滚动12个月)</span>
                      <span className="text-center text-[#00A758] font-sans">99.06%</span>
                    </div>
                  </div>

                  {/* Combined top block for row-1 attendance Coefficient */}
                  <div className="absolute right-0 top-0 h-[28.5%] w-1/3 flex items-center justify-center p-2 border-l border-slate-50 bg-white font-black text-[#00A758] text-xs font-sans shadow-inner">
                    1
                  </div>

                  {/* Combined green box covering row-2 & row-3 on extreme right */}
                  <div className="absolute right-0 top-[28.5%] bottom-0 w-1/3 flex items-center justify-center p-3 border-l border-t border-slate-50 bg-[#E6F7ED]/35">
                    <div className="w-7 h-10 rounded-lg bg-[#E6F7ED] border border-[#BFF3D4]/60 flex items-center justify-center text-[#00A758] font-black font-sans text-xs shadow-sm">
                      2
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 加扣款合计 card */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm flex justify-between items-center text-sm font-black text-slate-800 leading-none select-none">
              <span>加扣款合计</span>
              <span className="text-[#00A758] font-sans text-base">
                {unearnedMode ? '0' : '200'}
              </span>
            </div>
          </div>
        );

      case '直辖工作室每月管理奖':
        return (
          <div className="space-y-4">
            {/* Key Metrics Overview */}
            <div className="bg-white rounded-2xl p-5 mx-5 border border-slate-100/80 shadow-sm flex items-center justify-between">
              <div className="w-1/2 text-center border-r border-[#f4faf7]">
                <p className="text-xs text-slate-400 font-bold mb-1 select-none">当月奖金</p>
                <p className="text-2xl font-black text-slate-400 font-sans leading-none">-</p>
              </div>
              <div className="w-1/2 text-center">
                <p className="text-xs text-slate-400 font-bold mb-1 select-none">职级</p>
                <p className="text-2xl font-black text-[#00A758] font-sans leading-none">DD</p>
              </div>
            </div>

            {/* 月度数据 */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm space-y-5">
              <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none mb-2 border-l-4 border-[#00A758] pl-2 select-none">
                月度数据
              </h4>

              {/* Progress 1 */}
              {renderProgressBar(
                <span>直辖室当月FYC(签发) - 直辖室当月FYC(发佣, 含回计)</span>,
                "0",
                "3,000",
                "216,000",
                "3,000",
                "216,000",
                15,
                "下一等级",
                "最高"
              )}

              {/* Progress 2 */}
              {renderProgressBar(
                "奖金率",
                "0%",
                "0%",
                "40%",
                "当前进度",
                "",
                5,
                "下一等级",
                "最高"
              )}

              {/* Attendance & persistence Grid */}
              <div className="border border-slate-50 rounded-2xl overflow-hidden mt-4 shadow-mini select-none bg-white">
                <div className="grid grid-cols-3 bg-slate-50 px-4 py-2.5 text-[10px] text-slate-405 font-extrabold uppercase border-b border-slate-50">
                  <span>名称</span>
                  <span className="text-center">实际</span>
                  <span className="text-right">系数</span>
                </div>
                
                <div className="relative">
                  {/* Rows Area */}
                  <div className="w-2/3 divide-y divide-slate-50 bg-white">
                    <div className="grid grid-cols-2 px-4 py-3.5 text-xs font-bold text-slate-700">
                      <span>出席率</span>
                      <span className="text-center text-slate-400 font-sans">-</span>
                    </div>
                    <div className="grid grid-cols-2 px-4 py-3.5 text-xs font-bold text-slate-700">
                      <span>直辖室保费续保率(滚动6个月)</span>
                      <span className="text-center text-slate-400 font-sans">-</span>
                    </div>
                    <div className="grid grid-cols-2 px-4 py-3.5 text-xs font-bold text-slate-700">
                      <span>直辖室保费续保率(滚动12个月)</span>
                      <span className="text-center text-[#00A758] font-sans">99.18%</span>
                    </div>
                  </div>

                  {/* Combined top block for row-1 coefficient */}
                  <div className="absolute right-0 top-0 h-[28.5%] w-1/3 flex items-center justify-center p-2 border-l border-slate-50 bg-white font-black text-slate-400 text-xs">
                    -
                  </div>

                  {/* Combined green box covering row-2 & row-3 */}
                  <div className="absolute right-0 top-[28.5%] bottom-0 w-1/3 flex items-center justify-center p-3 border-l border-t border-slate-50 bg-slate-50/25">
                    <div className="w-7 h-10 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-400 font-black font-sans text-xs">
                      -
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 加扣款合计 card */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm flex justify-between items-center text-sm font-black text-slate-800 leading-none select-none">
              <span>加扣款合计</span>
              <span className="text-slate-400 font-sans text-base">-</span>
            </div>
          </div>
        );

      case '高阶主管每月管理奖':
        return (
          <div className="space-y-4">
            {/* Key Metrics Overview */}
            <div className="bg-white rounded-2xl p-4 mx-5 border border-slate-100/80 shadow-sm grid grid-cols-3 gap-1 text-center select-none">
              <div className="border-r border-slate-50">
                <p className="text-[10px] text-slate-400 font-bold mb-1">状态</p>
                <p className="text-xs font-black text-[#00A758] tracking-tight leading-none overflow-hidden text-ellipsis whitespace-nowrap px-1">享有22版高阶</p>
              </div>
              <div className="border-r border-slate-50">
                <p className="text-[10px] text-slate-400 font-bold mb-1">当月奖金</p>
                <p className="text-sm font-black text-[#00A758] font-sans">0</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold mb-1">职级</p>
                <p className="text-sm font-black text-[#00A758] font-sans">DD</p>
              </div>
            </div>

            {/* 月度数据 */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm space-y-5">
              <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1 border-l-4 border-[#00A758] pl-2 select-none">
                月度数据
              </h4>

              {/* Progress 1 */}
              {renderProgressBar(
                "当月所辖FYC",
                "0",
                "42,000",
                "672,000",
                "42,000",
                "672,000",
                10,
                "下一等级",
                "最高"
              )}

              {/* Progress 2 */}
              {renderProgressBar(
                "奖金率",
                "-",
                "6%",
                "8%",
                "当前进度",
                "",
                3,
                "下一等级",
                "最高",
                <div className="text-[11px] text-slate-550 mt-1 select-none font-bold">奖金率下降百分点 <span className="font-sans font-black text-[#00A758]">0%</span></div>
              )}

              {/* Attendance & persistence Grid */}
              <div className="border border-slate-50 rounded-2xl overflow-hidden mt-4 shadow-mini select-none bg-white">
                <div className="grid grid-cols-3 bg-slate-50 px-4 py-2.5 text-[10px] text-slate-405 font-extrabold uppercase border-b border-slate-50">
                  <span>名称</span>
                  <span className="text-center">实际</span>
                  <span className="text-right">系数</span>
                </div>
                
                <div className="relative">
                  {/* Rows Area */}
                  <div className="w-2/3 divide-y divide-slate-50 bg-white">
                    <div className="grid grid-cols-2 px-4 py-3.5 text-xs font-bold text-slate-705">
                      <span>出席率</span>
                      <span className="text-center text-[#00A758] font-sans">100%</span>
                    </div>
                    <div className="grid grid-cols-2 px-4 py-3.5 text-xs font-bold text-slate-705">
                      <span>直辖室保费续保率(滚动6个月)</span>
                      <span className="text-center text-slate-400 font-sans">-</span>
                    </div>
                    <div className="grid grid-cols-2 px-4 py-3.5 text-xs font-bold text-slate-705">
                      <span>直辖室保费续保率(滚动12个月)</span>
                      <span className="text-center text-[#00A758] font-sans">99.49%</span>
                    </div>
                  </div>

                  {/* Combined top block for row-1 coefficient */}
                  <div className="absolute right-0 top-0 h-[28.5%] w-1/3 flex items-center justify-center p-2 border-l border-slate-50 bg-white font-black text-[#00A758] font-sans text-xs">
                    1
                  </div>

                  {/* Combined green box covering row-2 & row-3 */}
                  <div className="absolute right-0 top-[28.5%] bottom-0 w-1/3 flex items-center justify-center p-3 border-l border-t border-slate-50 bg-[#E6F7ED]/35">
                    <div className="w-7 h-10 rounded-lg bg-[#E6F7ED] border border-[#BFF3D4]/60 flex items-center justify-center text-[#00A758] font-black font-sans text-xs shadow-sm">
                      1
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Development factor track */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm space-y-4">
              <div className="flex justify-between items-center mb-1 select-none">
                <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none border-l-4 border-rose-500 pl-2">
                  发展系数追踪
                </h4>
                <span className="text-xs font-black text-rose-500">
                  未达标
                </span>
              </div>

              {/* Standard 1 */}
              <div className="border border-slate-50 p-4 rounded-xl bg-slate-50/20 space-y-3">
                <div className="flex justify-between items-center select-none">
                  <span className="text-xs font-black text-slate-700">标准一</span>
                  <span className="text-[10px] font-black text-rose-500">未达标</span>
                </div>

                {/* Table list */}
                <div className="border border-slate-50 rounded-xl overflow-hidden bg-white mt-1.5 select-none shadow-mini">
                  <div className="grid grid-cols-3 bg-slate-50 px-3 py-2 text-[9px] text-slate-400 font-extrabold uppercase text-center border-b border-slate-50">
                    <span className="text-left">名称</span>
                    <span>实际</span>
                    <span className="text-right">目标</span>
                  </div>
                  <div className="divide-y divide-slate-50 text-xs font-bold text-slate-700">
                    <div className="px-3 py-1.5 bg-slate-50/30 text-slate-800 text-[10px] font-black uppercase text-left">
                      营业区星钻人次
                    </div>
                    <div className="grid grid-cols-3 px-3 py-2 text-center items-center">
                      <span className="text-left text-slate-400">季度累计</span>
                      <span className="font-sans text-rose-500">0</span>
                      <div className="flex justify-end">
                        <span className="w-5 h-5 rounded border border-[#BFF3D4] bg-[#E6F7ED] flex items-center justify-center text-[#00A758] font-black font-sans text-[10px] shadow-sm">3</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 px-3 py-2 text-center items-center">
                      <span className="text-left text-slate-400">年度平均</span>
                      <span className="font-sans">2.5</span>
                      <span className="text-right text-slate-400 font-sans">-</span>
                    </div>

                    <div className="px-3 py-1.5 bg-slate-50/30 text-slate-800 text-[10px] font-black uppercase text-left">
                      所辖团队星钻人次
                    </div>
                    <div className="grid grid-cols-3 px-3 py-2 text-center items-center">
                      <span className="text-left text-slate-400">年度累计</span>
                      <span className="font-sans text-rose-500">0</span>
                      <div className="flex justify-end">
                        <span className="w-6 h-5 rounded border border-[#BFF3D4] bg-[#E6F7ED] flex items-center justify-center text-[#00A758] font-black font-sans text-[10px] shadow-sm">10</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 px-3 py-2 text-center items-center">
                      <span className="text-left text-slate-400">年度平均</span>
                      <span className="font-sans">5.8</span>
                      <span className="text-right text-slate-400 font-sans">-</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Standard 2 */}
              <div className="border border-slate-50 p-4 rounded-xl bg-slate-50/20 space-y-3">
                <div className="flex justify-between items-center select-none">
                  <span className="text-xs font-black text-slate-700">标准二</span>
                  <span className="text-[10px] font-black text-rose-500">未达标</span>
                </div>

                {/* Table list */}
                <div className="border border-slate-50 rounded-xl overflow-hidden bg-white mt-1.5 select-none shadow-mini">
                  <div className="grid grid-cols-3 bg-slate-50 px-3 py-2 text-[9px] text-slate-400 font-extrabold uppercase text-center border-b border-slate-50">
                    <span className="text-left">名称</span>
                    <span>实际</span>
                    <span className="text-right">目标</span>
                  </div>
                  <div className="divide-y divide-slate-50 text-xs font-bold text-slate-700">
                    <div className="px-3 py-1.5 bg-slate-50/30 text-slate-800 text-[10px] font-black uppercase text-left">
                      所辖团队星钻人次
                    </div>
                    <div className="grid grid-cols-3 px-3 py-2.5 text-center items-center">
                      <span className="text-left text-slate-400">季度累计</span>
                      <span className="font-sans text-rose-500">0</span>
                      <div className="flex justify-end">
                        <span className="w-6 h-5 rounded border border-[#BFF3D4] bg-[#E6F7ED] flex items-center justify-center text-[#00A758] font-black font-sans text-[10px] shadow-sm">13</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 px-3 py-2.5 text-center items-center">
                      <span className="text-left text-slate-400">年度平均</span>
                      <span className="font-sans">5.8</span>
                      <span className="text-right text-slate-400 font-sans">-</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 加扣款合计 card */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm flex justify-between items-center text-sm font-black text-slate-800 leading-none select-none">
              <span>加扣款合计</span>
              <span className="text-slate-400 font-sans text-base">-</span>
            </div>
          </div>
        );

      case '所辖季度达标奖':
        return (
          <div className="space-y-4">
            {/* Key Metrics Overview */}
            <div className="bg-white rounded-2xl p-4 mx-5 border border-slate-100/80 shadow-sm grid grid-cols-3 gap-1 text-center select-none">
              <div className="border-r border-slate-50">
                <p className="text-[10px] text-slate-400 font-bold mb-1">本季度达成</p>
                <p className="text-xs font-black text-[#00A758]">标准奖</p>
              </div>
              <div className="border-r border-slate-50">
                <p className="text-[10px] text-slate-400 font-bold mb-1">本季度应发奖金</p>
                <p className="text-sm font-black text-[#00A758] font-sans">
                  {unearnedMode ? '0' : Math.round(200 * awardScaleMultiplier).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold mb-1">职级</p>
                <p className="text-sm font-black text-[#00A758] font-sans">SDD</p>
              </div>
            </div>

            {/* 本季度数据 */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm space-y-5">
              <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1 border-l-4 border-[#00A758] pl-2 select-none">
                本季度数据
              </h4>

              {/* Progress 1 */}
              {renderProgressBar(
                "累计营业区FYC",
                "1,000",
                "360,000",
                "360,000",
                "359,000",
                "359,000",
                99,
                "标准奖",
                "卓越奖"
              )}

              {/* Progress 2 */}
              {renderProgressBar(
                "累计所辖FYC",
                "2,000",
                "1,500,000",
                "9,000,000",
                "1,498,000",
                "8,998,000",
                16,
                "标准奖",
                "卓越奖"
              )}

              {/* Table list */}
              <div className="border border-slate-50 rounded-xl overflow-hidden bg-white mt-4 shadow-mini select-none">
                <div className="grid grid-cols-3 bg-slate-50 px-4 py-2.5 text-[10px] text-slate-400 font-extrabold uppercase text-center border-b border-slate-50">
                  <span className="text-left font-bold">名称</span>
                  <span>实际</span>
                  <span className="text-right">目标</span>
                </div>
                <div className="divide-y divide-slate-50 text-xs font-bold text-slate-700">
                  <div className="grid grid-cols-3 px-4 py-3 text-center items-center">
                    <span className="text-left text-slate-400 font-bold leading-tight">季末月出席率</span>
                    <span className="text-[#00A758] font-sans">30%</span>
                    <span className="text-right text-slate-450 font-sans">80%</span>
                  </div>
                  <div className="grid grid-cols-3 px-4 py-3 text-center items-center">
                    <span className="text-left text-slate-400 font-bold leading-tight">所辖寿险保费续保率 (滚动6个月)</span>
                    <span className="text-[#00A758] font-sans">100%</span>
                    <span className="text-right text-slate-450 font-sans">85%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 当月实发奖金 */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm space-y-3 select-none">
              <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1 border-l-4 border-[#00A758] pl-2">
                当月实发奖金
              </h4>
              <div className="flex justify-between items-center text-xs font-bold px-1 mt-3">
                <span className="text-slate-405 font-bold uppercase tracking-widest text-[10px]">总金额</span>
                <span className="text-[#00A758] font-black text-xl font-sans">
                  {unearnedMode ? '0' : Math.round(1000 * awardScaleMultiplier).toLocaleString()}
                </span>
              </div>
            </div>

            {/* 加扣款合计 card */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm flex justify-between items-center text-sm font-black text-slate-800 leading-none select-none">
              <span>加扣款合计</span>
              <span className="text-[#00A758] font-sans text-base">
                {unearnedMode ? '0' : '300'}
              </span>
            </div>
          </div>
        );

      case '直辖工作室筹备奖':
        return (
          <div className="space-y-4">
            {/* Key Metrics Overview */}
            <div className="bg-white rounded-2xl p-5 mx-5 border border-slate-100/80 shadow-sm text-center select-none">
              <p className="text-xs text-slate-400 font-bold mb-1 leading-none uppercase tracking-widest-lg">总奖金金额</p>
              <p className="text-3xl font-black text-[#00A758] font-sans mt-3">
                {unearnedMode ? '0' : Math.round(1000 * awardScaleMultiplier).toLocaleString()}
              </p>
            </div>

            {/* Table Metrics Core Card */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm space-y-4 overflow-hidden select-none">
              <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1 border-l-4 border-[#00A758] pl-2">
                评估明细指标
              </h4>

              <div className="border border-slate-50 rounded-xl overflow-hidden bg-white shadow-mini">
                <div className="grid grid-cols-3 bg-slate-50 px-4 py-2.5 text-[10px] text-slate-400 font-extrabold uppercase text-center border-b border-slate-50">
                  <span className="text-left font-bold">名称</span>
                  <span>实际</span>
                  <span className="text-right">目标</span>
                </div>
                <div className="divide-y divide-slate-50 text-xs font-bold text-slate-700">
                  <div className="grid grid-cols-3 px-4 py-3.5 text-center items-center">
                    <span className="text-left text-slate-450 font-bold leading-tight">当月个人与直增新人首年佣金FYC合计</span>
                    <span className="text-[#00A758] font-sans">2,000</span>
                    <span className="text-right text-slate-450 font-sans">3,000</span>
                  </div>
                  <div className="grid grid-cols-3 px-4 py-3.5 text-center items-center">
                    <span className="text-left text-slate-450 font-bold leading-tight">当月寿险保费续保率(滚动6个月)</span>
                    <span className="text-[#00A758] font-sans text-rose-500">20%</span>
                    <span className="text-right text-slate-450 font-sans">90%</span>
                  </div>
                  <div className="grid grid-cols-3 px-4 py-3.5 text-center items-center">
                    <span className="text-left text-slate-450 font-bold leading-tight">出席率</span>
                    <span className="text-[#00A758] font-sans">76.92%</span>
                    <span className="text-right text-slate-450 font-sans">80%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 资格 card */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm space-y-4 select-none">
              <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none border-l-4 border-[#00A758] pl-2">
                资格
              </h4>
              <div className="divide-y divide-slate-50 text-xs font-bold text-slate-700 border-t border-slate-50 mt-1">
                <div className="flex justify-between py-3">
                  <span className="text-slate-450 leading-none">AUM第1-6月直增新人数</span>
                  <span className="text-[#00A758] font-sans font-black">1</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-slate-450 leading-none">享有奖金起始月份</span>
                  <span className="text-[#00A758] font-sans font-black">202509</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-slate-450 leading-none">当前累积已被提案月份</span>
                  <span className="text-[#00A758] font-sans font-black">2</span>
                </div>
              </div>
            </div>

            {/* 直招新人 table */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm space-y-4 select-none">
              <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none border-l-4 border-[#00A758] pl-2">
                直招新人
              </h4>
              <div className="border border-slate-55 rounded-xl overflow-hidden bg-white shadow-mini">
                <div className="grid grid-cols-3 bg-slate-50 px-4 py-2.5 text-[10px] text-slate-400 font-extrabold uppercase border-b border-slate-50">
                  <span>姓名</span>
                  <span className="text-center">职级</span>
                  <span className="text-right">副职级</span>
                </div>
                <div className="p-8 text-center text-xs font-semibold text-slate-400 bg-slate-50/20">
                  当月暂无考核期内的直招新人数据
                </div>
              </div>
            </div>

            {/* 加扣款合计 card */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-[#ecebeb] shadow-sm flex justify-between items-center text-sm font-black text-slate-800 leading-none select-none">
              <span>加扣款合计</span>
              <span className="text-[#00A758] font-sans text-base">
                {unearnedMode ? '0' : '100'}
              </span>
            </div>
          </div>
        );

      case '直辖工作室育成奖':
        return (
          <div className="space-y-4">
            {/* Key Metrics Overview */}
            <div className="bg-white rounded-2xl p-5 mx-5 border border-slate-100/80 shadow-sm text-center select-none">
              <p className="text-xs text-slate-400 font-bold mb-1 leading-none uppercase tracking-widest-lg">总奖金金额</p>
              <p className="text-3xl font-black text-[#00A758] font-sans mt-3">
                {unearnedMode ? '0' : '0'}
              </p>
            </div>

            {/* Table Metrics Core Card */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm space-y-4 overflow-hidden select-none">
              <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none border-l-4 border-[#00A758] pl-2">
                评估明细指标
              </h4>

              <div className="border border-slate-50 rounded-xl overflow-hidden bg-white shadow-mini">
                <div className="grid grid-cols-3 bg-slate-50 px-4 py-2.5 text-[10px] text-slate-400 font-extrabold uppercase text-center border-b border-slate-50">
                  <span className="text-left font-bold">名称</span>
                  <span>实际</span>
                  <span className="text-right">系数</span>
                </div>
                <div className="grid grid-cols-3 px-4 py-3.5 text-center text-xs font-bold text-[#00A758] items-center">
                  <span className="text-left text-slate-450 font-bold leading-tight">出席率</span>
                  <span className="text-[#00A758] font-sans">100%</span>
                  <span className="text-right text-[#00A758] font-sans">1</span>
                </div>
              </div>
            </div>

            {/* 育成主管 table */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm space-y-4 select-none">
              <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none border-l-4 border-[#00A758] pl-2">
                育成主管 <span className="text-[10px] font-bold text-slate-400 ml-1 font-sans">*不含回计主管</span>
              </h4>
              <div className="border border-slate-50 rounded-xl overflow-hidden bg-white shadow-mini">
                <div className="grid grid-cols-4 bg-slate-50 px-3 py-2.5 text-[10px] text-slate-400 font-extrabold uppercase text-center border-b border-slate-50">
                  <span className="text-left font-bold font-sans">姓名</span>
                  <span>代数</span>
                  <span>奖金率</span>
                  <span className="text-right">FYC</span>
                </div>
                <div className="grid grid-cols-4 px-3 py-3.5 text-center text-xs font-bold text-slate-700 items-center">
                  <div className="text-left leading-tight">
                    <p className="font-extrabold text-slate-800">黄缝</p>
                    <p className="text-[9px] text-slate-400 font-mono font-bold leading-none mt-0.5">SH73221</p>
                  </div>
                  <span className="font-sans text-slate-505 font-black">1代</span>
                  <span className="font-sans text-[#00A758]">10%</span>
                  <span className="text-right font-sans text-slate-405">0</span>
                </div>
              </div>
            </div>

            {/* 加扣款合计 card */}
            <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm flex justify-between items-center text-sm font-black text-slate-800 leading-none select-none">
              <span>加扣款合计</span>
              <span className="text-[#00A758] font-sans text-base">
                {unearnedMode ? '0' : '0'}
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const baseAwards: AwardItem[] = [
    {
      name: '月度业绩奖',
      baseAmount: 200,
      criteria: '个人当月实收FYC满12,000元，且晨会出席率≥80%',
      status: '已达标',
      detail: '根据基本法第三章规定，个人当月实收FYC在1.2万以上的，在足额出席晨会前提下，计发月度业绩奖金。',
      period: `${selectedYear}年${selectedMonth}月1日至${selectedYear}年${selectedMonth}月30日`,
      gap: '已达标'
    },
    {
      name: '星钻恒星奖',
      baseAmount: 1000,
      criteria: '连续3个月达成个人新单星钻人力，或季度FYC符合恒星标准',
      status: '已达标',
      detail: '符合季度评选标准的新单与星钻人力，可享受恒星专属阶段性奖励加成1.0。',
      period: `${selectedYear}Q2季末核算并锁定`,
      gap: '连续达成3个月，已达最高成长等级'
    },
    {
      name: '营业区每月 management 奖', // Let's use the layout names exactly
      baseAmount: 3000,
      criteria: '直辖组当月新增及主管育成人力、营业区基本法核心指标合并实收满30万',
      status: '已达成',
      detail: '根据基本法第十章规定，营业区经理及总监管理奖金按区域实收贡献率计算，计奖系数为1.1。',
      period: `按月计算发放 (${selectedYear}.${selectedMonth})`,
      gap: '已达成'
    },
    {
      name: '直辖工作室每月管理奖',
      baseAmount: 0,
      criteria: '直辖工作室管理核心人力满12人，且实收业绩达基础门槛',
      status: '已达成',
      detail: '直辖工作室的主任及总监当期基本法管理支持，配合团队纪律及两会出勤判定。',
      period: `按月核实发放 (${selectedYear}.${selectedMonth})`,
      gap: '已达成'
    },
    {
      name: '高级主管每月管理奖', // Match details name
      baseAmount: 0,
      criteria: '高级总监或区域总监主管所辖总体实收满足季度合规系数判定',
      status: '已达成',
      detail: '季度合规性判定：卓越。高阶主管按所辖组别整体业绩占比派发管理增量津贴。',
      period: '按月核算，季度合规调整',
      gap: '已达成（合规系数1.15）'
    },
    {
      name: '所辖季度达标奖',
      baseAmount: 200,
      criteria: '所辖季度累计FYC达到40万元，续保率指标满足合规标准',
      status: '接近达标',
      detail: '累计FYC当前36.4万，缺口3.65w即可享受4,500元季度终极达标补贴。建议配合增员动作锁定更高评点。',
      period: `${selectedYear}Q2度滚动考核`,
      gap: '临近标准缺口：¥3,650'
    },
    {
      name: '直辖工作室筹备奖',
      baseAmount: 1000,
      criteria: '直辖工作室完成首期筹备人力10人及业务基准要求',
      status: '筹备达标',
      detail: '筹备工作室首期专项津贴。考核期内，准工作室达成首期指标即可解锁一次性直辖筹备支持。',
      period: '筹备第一期',
      gap: '筹备已达标'
    },
    {
      name: '直辖工作室育成奖',
      baseAmount: 0,
      criteria: '在一代、二代及之后育成新工作室，并满足合规达标保持周期',
      status: '育成达标',
      detail: '育成新加盟工作室经理的后续传承性激励，按被育成工作室实收基准 of 对应基本法比例提取。',
      period: `按月追踪 (${selectedYear}.${selectedMonth})`,
      gap: '已育成1个工作室，持续达标中'
    }
  ];

  // Let's keep the real award items array aligned with actual visual screenshot display
  baseAwards[2].name = "营业区每月管理奖";
  baseAwards[4].name = "高阶主管每月管理奖";


  return (
    <FullScreenModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="奖项报酬" 
      bgClass="bg-[#f4faf7]"
      headerRight={
        <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200/40 select-none mr-2">
          {['签发', '发佣'].map((caliber) => (
            <button
              key={caliber}
              id={`caliber-btn-${caliber}`}
              onClick={() => setDataCaliber(caliber as '签发' | '发佣')}
              className={`text-[11px] font-black px-2.5 py-1 rounded-[6px] transition-all duration-200 whitespace-nowrap ${
                dataCaliber === caliber 
                  ? 'bg-[#00A758] text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-850'
              }`}
            >
              {caliber}
            </button>
          ))}
        </div>
      }
    >
      <div className="flex-1 flex flex-col font-sans bg-[#f4faf7] min-h-full pb-20">
        {/* Red Notice Banner: Page is for reference only */}
        <div className="px-4 pt-2 pb-1 shrink-0">
          <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 text-rose-600">
            <i className="fa-solid fa-circle-exclamation text-sm mt-0.5 shrink-0"></i>
            <p className="text-xs font-bold leading-relaxed">
              当前页面仅作跳转参考，页面实际样式与字段以现有2.0页面为准
            </p>
          </div>
        </div>

        {/* Banner with Month Info and warning */}
        <div className="px-5 py-4 bg-gradient-to-b from-white/90 to-transparent flex flex-col gap-2.5 select-none">
          {/* Month & Year Selection Row */}
          <div 
            onClick={() => setShowMonthPicker(true)}
            className="flex items-baseline gap-1.5 cursor-pointer group active:opacity-75 transition"
          >
            <span className="text-[34px] font-black font-sans text-slate-800 leading-none">
              {selectedMonth}
            </span>
            <span className="text-sm font-bold text-slate-700">月</span>
            <span className="text-xs font-semibold text-slate-400 font-sans ml-1 flex items-center gap-1">
              {selectedYear}年
              <i className="fa-solid fa-chevron-down text-[8px] text-slate-400 transition-transform group-hover:translate-y-0.5"></i>
            </span>
          </div>

          {/* Subtitle Info Warning Label */}
          <div className="flex items-start gap-1.5 text-slate-400 font-semibold text-[10.5px] leading-relaxed bg-white/40 p-2.5 rounded-xl border border-white/65 shadow-sm xs:whitespace-nowrap overflow-hidden text-ellipsis">
            <span className="text-xs shrink-0 text-[#00A758]">ℹ️</span>
            <span>当月为试算值，以往月份为实际值，最终以工资单为准</span>
          </div>
        </div>

        {/* List of elegant award cards */}
        <div className="px-5 space-y-3.5 pb-24">
          {baseAwards.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => {
                setActiveAward(item);
                setDetailCaliber(dataCaliber); // Initialize detail view's caliber to dashboard's caliber
              }}
              className="bg-white rounded-2xl p-5 border border-emerald-100/40 shadow-sm relative overflow-hidden transition-all duration-300 active:scale-[0.98] active:shadow-inner cursor-pointer hover:border-emerald-200/80 bg-gradient-to-br from-white via-white to-emerald-50/15"
            >
              {/* Floating watermark "AWARD" on bottom right */}
              <div className="absolute right-4 bottom-3 text-[26px] font-black tracking-widest text-[#00A758]/5 select-none pointer-events-none font-sans italic">
                AWARD
              </div>

              {/* Title left-aligned */}
              <h4 className="text-[14.5px] font-black text-slate-800 tracking-tight leading-none mb-4 bg-clip-text">
                {item.name}
              </h4>

              {/* Amount styled beautifully */}
              <div className="flex items-baseline gap-1.5 mt-2.5">
                <span className="text-sm font-black text-[#00A758]">¥</span>
                <span className="text-2xl font-black text-[#00A758] tracking-tight leading-none">
                  <AmountDisplay 
                    value={unearnedMode ? 0 : Math.round(getCaliberAmount(item, dataCaliber) * awardScaleMultiplier)} 
                    isHidden={isAmountHidden} 
                    prefix="" 
                  />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom Month Selector Drawer Overlay */}
        <AnimatePresence>
          {showMonthPicker && (
            <div className="fixed inset-0 z-[1100] flex items-end justify-center">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMonthPicker(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              
              {/* Panel container */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="relative w-full max-w-md bg-white rounded-t-[32px] p-6 pb-12 z-10 shadow-2xl flex flex-col"
              >
                {/* Drag indicator handle */}
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6" />

                <h3 className="text-sm font-black text-slate-800 tracking-tight text-center mb-5 uppercase tracking-wider">
                  选择核算核定月份
                </h3>

                {/* Year picker row */}
                <div className="flex justify-center gap-2 mb-4">
                  {['2025', '2026', '2027'].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setSelectedYear(yr)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${selectedYear === yr ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                    >
                      {yr}年
                    </button>
                  ))}
                </div>

                {/* Months Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setSelectedMonth(m);
                        setShowMonthPicker(false);
                      }}
                      className={`py-3.5 rounded-xl text-xs font-bold transition-all ${selectedMonth === m ? 'bg-[#00A758] text-white shadow-md font-black' : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100/50'}`}
                    >
                      {m}月
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowMonthPicker(false)}
                  className="mt-6 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs py-3.5 rounded-xl transition-all"
                >
                  取消
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Detailed Description modal overlay */}
        <AnimatePresence>
          {activeAward && (
            <div className="fixed inset-0 z-[1100] flex justify-center bg-[#F4F5F7] overflow-hidden">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                className="w-full max-w-md h-full flex flex-col bg-[#F7F8FA]"
              >
                {/* WeChat-style Header Top Bar */}
                <div className="bg-white border-b border-slate-100/60 px-4 py-3.5 flex items-center justify-between shrink-0 relative select-none">
                  <button 
                    onClick={() => setActiveAward(null)}
                    className="flex items-center gap-1.5 text-slate-800 hover:text-[#00A758] transition-colors py-1 pl-1"
                  >
                    <i className="fa-solid fa-chevron-left text-lg"></i>
                    <span className="text-sm font-bold">返回</span>
                  </button>
                  <h3 className="absolute left-1/2 -translate-x-1/2 text-sm font-black text-slate-900 tracking-tight">
                    {activeAward.name}
                  </h3>
                  <div className="w-8"></div> {/* Spacer for symmetry */}
                </div>

                {/* Subheader Status Pill Bar */}
                <div className="bg-white px-5 py-3 border-b border-slate-150/40 flex items-center justify-between shrink-0 select-none">
                  <div>
                    <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">基本法考核期间</h4>
                    <p className="text-xs font-black text-slate-700 font-sans mt-1.5">{activeAward.period}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-wider ${
                      unearnedMode 
                        ? 'bg-rose-50 text-rose-500 border border-rose-100/60' 
                        : 'bg-[#E6F7ED] text-[#00A758] border border-[#BFF3D4]/50'
                    }`}>
                      {unearnedMode ? '未达标' : activeAward.status}
                    </span>
                  </div>
                </div>

                {/* Scrollable Main Area */}
                <div className="flex-1 overflow-y-auto pt-5 pb-12 space-y-5">
                  {/* Caliber Selector inside Details */}
                  <div className="bg-white rounded-3xl p-4 mx-5 border border-slate-100/80 shadow-sm flex items-center justify-between select-none">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-3.5 bg-[#00A758] rounded-full"></div>
                      <span className="text-xs font-black text-slate-800 font-sans">数据口径</span>
                    </div>
                    <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200/40">
                      {['签发', '发佣'].map((caliber) => (
                        <button
                          key={caliber}
                          onClick={() => setDetailCaliber(caliber as '签发' | '发佣')}
                          className={`text-[10.5px] font-black px-3.5 py-1.5 rounded-[6px] transition-all duration-200 whitespace-nowrap ${
                            detailCaliber === caliber 
                              ? 'bg-[#00A758] text-white shadow-sm font-black' 
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {caliber}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visual Layout Container */}
                  {renderAwardDetails(activeAward.name)}

                  {/* Criteria & Policy interpretation cards */}
                  <div className="bg-white rounded-3xl p-5 mx-5 border border-slate-100/80 shadow-sm space-y-4">
                    <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1 border-l-4 border-slate-400 pl-2 select-none">
                      基本法原始条文解读
                    </h4>
                    <p className="text-xs font-semibold text-slate-500 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100/40">
                      {activeAward.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* vConsole debug panel popup removed */}
      </div>
    </FullScreenModal>
  );
};

// Retention Tracking Modal
const RetentionTrackingModal = RetentionManagementModal;

// --- Team management page data helpers (aligned with source project) ---
const STATS_BY_FILTER = {
  direct: { expected: 12, actual: 11, leave: 1, exemption: 1, attention: 2, rate: '91.7%' },
  district: { expected: 48, actual: 42, leave: 4, exemption: 3, attention: 5, rate: '87.5%' },
  org: { expected: 156, actual: 132, leave: 15, exemption: 8, attention: 12, rate: '84.6%' }
} as const;

const getFilterLabelHelper = (teamFilter: string | undefined) => {
  if (teamFilter === 'district') return '营业区';
  if (teamFilter === 'org') return '所辖';
  return '直辖室';
};

const ALL_TEAM_ACTIVITY = [
  // 直辖室 (direct) - 全部为 FC
  { id: '1', name: '王宏伟', empId: 'MH880101', rank: 'FC', group: '直辖室•精英一组', generation: '--', supervisor: '林晨', scope: 'direct' as const, attendanceRate: 100, attendedDays: 16, passedDays: 16, totalDays: 22, lateCount: 0, leaveCount: 0, lastCheckIn: '08:15 正常' },
  { id: '2', name: '陈建国', empId: 'MH880102', rank: 'FC', group: '直辖室•精英一组', generation: '--', supervisor: '林晨', scope: 'direct' as const, attendanceRate: 95, attendedDays: 15, passedDays: 16, totalDays: 22, lateCount: 1, leaveCount: 0, lastCheckIn: '08:25 正常' },
  { id: '3', name: '李思思', empId: 'MH880201', rank: 'FC', group: '直辖室•精英一组', generation: '--', supervisor: '林晨', scope: 'direct' as const, attendanceRate: 90, attendedDays: 14, passedDays: 16, totalDays: 22, lateCount: 0, leaveCount: 1, lastCheckIn: '08:20 正常' },
  { id: '4', name: '张强', empId: 'MH880202', rank: 'FC', group: '直辖室•精英一组', generation: '--', supervisor: '林晨', scope: 'direct' as const, attendanceRate: 85, attendedDays: 13, passedDays: 16, totalDays: 22, lateCount: 2, leaveCount: 0, lastCheckIn: '08:40 正常' },
  { id: '5', name: '周红', empId: 'MH880203', rank: 'FC', group: '直辖室•精英一组', generation: '--', supervisor: '林晨', scope: 'direct' as const, attendanceRate: 80, attendedDays: 12, passedDays: 16, totalDays: 22, lateCount: 1, leaveCount: 2, lastCheckIn: '08:35 正常' },
  { id: '6', name: '冯悦', empId: 'MH880204', rank: 'FC', group: '直辖室•精英二组', generation: '--', supervisor: '林晨', scope: 'direct' as const, attendanceRate: 75, attendedDays: 12, passedDays: 16, totalDays: 22, lateCount: 3, leaveCount: 1, lastCheckIn: '08:50 迟到' },
  { id: '7', name: '廖婷', empId: 'MH880205', rank: 'FC', group: '直辖室•精英二组', generation: '--', supervisor: '林晨', scope: 'direct' as const, attendanceRate: 63, attendedDays: 10, passedDays: 16, totalDays: 22, lateCount: 4, leaveCount: 2, lastCheckIn: '09:05 迟到' },
  { id: '8', name: '徐浩', empId: 'MH880206', rank: 'FC', group: '直辖室•精英一组', generation: '--', supervisor: '林晨', scope: 'direct' as const, attendanceRate: 45, attendedDays: 7, passedDays: 16, totalDays: 22, lateCount: 5, leaveCount: 1, lastCheckIn: '09:30 迟到' },
  { id: '9', name: '孙杰', empId: 'MH880207', rank: 'FC', group: '直辖室•精英二组', generation: '--', supervisor: '林晨', scope: 'direct' as const, attendanceRate: 0, attendedDays: 0, passedDays: 16, totalDays: 22, lateCount: 0, leaveCount: 0, lastCheckIn: '未打卡' },
  { id: '10', name: '彭伟', empId: 'MH880208', rank: 'FC', group: '直辖室•精英二组', generation: '--', supervisor: '林晨', scope: 'direct' as const, attendanceRate: 0, attendedDays: 0, passedDays: 16, totalDays: 22, lateCount: 0, leaveCount: 0, lastCheckIn: '未打卡' },

  // 营业区 (district)
  { id: '11', name: '刘洋', empId: 'MH880301', rank: 'UM', group: '营业区•先锋三组', generation: '1代', supervisor: '张宏', scope: 'district' as const, attendanceRate: 94, attendedDays: 15, passedDays: 16, totalDays: 22, lateCount: 0, leaveCount: 1, lastCheckIn: '08:18 正常' },
  { id: '12', name: '郭伟', empId: 'MH880302', rank: 'FC', group: '营业区•先锋二组', generation: '--', supervisor: '刘洋', scope: 'district' as const, attendanceRate: 92, attendedDays: 15, passedDays: 16, totalDays: 22, lateCount: 0, leaveCount: 1, lastCheckIn: '08:22 正常' },
  { id: '13', name: '王明', empId: 'MH880303', rank: 'FC', group: '营业区•先锋二组', generation: '--', supervisor: '刘洋', scope: 'district' as const, attendanceRate: 88, attendedDays: 14, passedDays: 16, totalDays: 22, lateCount: 1, leaveCount: 2, lastCheckIn: '08:30 正常' },
  { id: '14', name: '郭杰', empId: 'MH880304', rank: 'FC', group: '营业区•先锋三组', generation: '--', supervisor: '刘洋', scope: 'district' as const, attendanceRate: 52, attendedDays: 8, passedDays: 16, totalDays: 22, lateCount: 3, leaveCount: 2, lastCheckIn: '08:55 正常' },
  { id: '15', name: '何威', empId: 'MH880305', rank: 'FC', group: '营业区•先锋三组', generation: '--', supervisor: '刘洋', scope: 'district' as const, attendanceRate: 48, attendedDays: 7, passedDays: 16, totalDays: 22, lateCount: 4, leaveCount: 2, lastCheckIn: '09:10 迟到' },
  { id: '16', name: '林丽', empId: 'MH880306', rank: 'FC', group: '营业区•先锋三组', generation: '--', supervisor: '刘洋', scope: 'district' as const, attendanceRate: 0, attendedDays: 0, passedDays: 16, totalDays: 22, lateCount: 0, leaveCount: 0, lastCheckIn: '未打卡' },

  // 所辖 (org)
  { id: '17', name: '张磊', empId: 'MH880401', rank: 'FC', group: '所辖•卓越一组', generation: '--', supervisor: '赵强', scope: 'org' as const, attendanceRate: 96, attendedDays: 15, passedDays: 16, totalDays: 22, lateCount: 0, leaveCount: 1, lastCheckIn: '08:10 正常' },
  { id: '18', name: '赵强', empId: 'MH880402', rank: 'SUM', group: '所辖•卓越二组', generation: '2代', supervisor: '张宏', scope: 'org' as const, attendanceRate: 91, attendedDays: 14, passedDays: 16, totalDays: 22, lateCount: 1, leaveCount: 1, lastCheckIn: '08:20 正常' },
  { id: '19', name: '钱伟', empId: 'MH880403', rank: 'FC', group: '所辖•卓越一组', generation: '--', supervisor: '赵强', scope: 'org' as const, attendanceRate: 87, attendedDays: 14, passedDays: 16, totalDays: 22, lateCount: 2, leaveCount: 0, lastCheckIn: '08:32 正常' },
  { id: '20', name: '郑博', empId: 'MH880404', rank: 'FC', group: '所辖•卓越一组', generation: '--', supervisor: '赵强', scope: 'org' as const, attendanceRate: 56, attendedDays: 9, passedDays: 16, totalDays: 22, lateCount: 6, leaveCount: 1, lastCheckIn: '09:00 迟到' },
  { id: '21', name: '杨光', empId: 'MH880405', rank: 'FC', group: '所辖•卓越二组', generation: '--', supervisor: '赵强', scope: 'org' as const, attendanceRate: 38, attendedDays: 6, passedDays: 16, totalDays: 22, lateCount: 5, leaveCount: 2, lastCheckIn: '09:20 迟到' },
  { id: '22', name: '蔡明', empId: 'MH880406', rank: 'FC', group: '所辖•卓越二组', generation: '--', supervisor: '赵强', scope: 'org' as const, attendanceRate: 0, attendedDays: 0, passedDays: 16, totalDays: 22, lateCount: 0, leaveCount: 0, lastCheckIn: '未打卡' }
];

// Attendance Management Modal
const AttendanceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  view: ViewType;
  teamMembers: TeamMember[];
  teamFilter?: 'direct' | 'district' | 'org';
  initialBucketFilter?: 'all' | '80plus' | '50to79' | 'under50';
}> = ({ isOpen, onClose, view, teamMembers, teamFilter = 'direct', initialBucketFilter = 'all' }) => {
  // 组织范围（直辖室 / 营业区 / 所辖），从卡片进入时沿用团队范围
  const [localTeamFilter, setLocalTeamFilter] = useState<'direct' | 'district' | 'org'>(teamFilter || 'direct');
  // 出席率分桶预筛选（全部 / ≥80% / 50%-79% / <50%），由点击出席分布卡片传入
  const [attendanceBucketFilter, setAttendanceBucketFilter] = useState<'all' | '80plus' | '50to79' | 'under50'>(initialBucketFilter || 'all');
  // 出席率多选筛选（搜索框旁筛选项），空数组表示不限
  const [attendanceRateFilters, setAttendanceRateFilters] = useState<Array<'80plus' | '50to79' | 'under50'>>(
    initialBucketFilter && initialBucketFilter !== 'all' ? [initialBucketFilter] : []
  );
  // 出席率筛选下拉是否展开
  const [rateFilterOpen, setRateFilterOpen] = useState(false);
  // 姓名搜索
  const [searchTerm, setSearchTerm] = useState('');

  // 打开时按传入的分桶预筛选进行初始化，并重置搜索
  useEffect(() => {
    if (isOpen) {
      setLocalTeamFilter(teamFilter || 'direct');
      setAttendanceBucketFilter(initialBucketFilter || 'all');
      setAttendanceRateFilters(initialBucketFilter && initialBucketFilter !== 'all' ? [initialBucketFilter] : []);
      setRateFilterOpen(false);
      setSearchTerm('');
    }
  }, [isOpen, teamFilter, initialBucketFilter]);

  const isScopeMatch = (scope: 'direct' | 'district' | 'org') => {
    if (localTeamFilter === 'direct') return scope === 'direct';
    if (localTeamFilter === 'district') return scope === 'direct' || scope === 'district';
    return true;
  };

  // 按组织范围过滤后的基础名单
  const scopeFilteredActivityList = useMemo(() => {
    return ALL_TEAM_ACTIVITY.filter(item => isScopeMatch(item.scope));
  }, [localTeamFilter]);

  // 最终名单：范围 + 出席率多选 + 搜索，按出席率升序（需关注在前）
  const filteredActivityList = useMemo(() => {
    let list = scopeFilteredActivityList;
    // 出席率多选：命中任一勾选分桶即保留；未勾选表示不限
    if (attendanceRateFilters.length > 0) {
      list = scopeFilteredActivityList.filter(i =>
        attendanceRateFilters.some(bucket =>
          bucket === '80plus' ? i.attendanceRate >= 80 :
          bucket === '50to79' ? (i.attendanceRate >= 50 && i.attendanceRate < 80) :
          i.attendanceRate < 50
        )
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      list = list.filter(i =>
        i.name.toLowerCase().includes(term) ||
        i.empId.toLowerCase().includes(term) ||
        (i.supervisor && i.supervisor.toLowerCase().includes(term)) ||
        (i.rank && i.rank.toLowerCase().includes(term))
      );
    }
    return [...list].sort((a, b) => a.attendanceRate - b.attendanceRate);
  }, [scopeFilteredActivityList, attendanceRateFilters, searchTerm]);

  if (!isOpen) return null;

  return (
    <FullScreenModal isOpen={isOpen} onClose={onClose} title="团队出席管理" bgClass="bg-[#F8F9FB]">
      <div className="flex flex-col min-h-full font-sans">
        {/* ========================= 团队出席视图 ========================= */}
        <div className="flex-1 px-4 pt-4 pb-10 space-y-3 animate-fade-in">
          {/* 组织范围切换 + 姓名搜索 */}
          <div className="bg-white p-2.5 rounded-2xl border border-slate-100 shadow-xs flex flex-col gap-2.5">
            <div className="bg-slate-50 p-1 rounded-xl flex gap-1 w-full border border-slate-100">
              {([
                { id: 'direct', label: '直辖室' },
                { id: 'district', label: '营业区' },
                { id: 'org', label: '所辖' }
              ] as const).map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setLocalTeamFilter(filter.id);
                    setAttendanceBucketFilter('all');
                    setAttendanceRateFilters([]);
                    setRateFilterOpen(false);
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition-all text-center ${
                    localTeamFilter === filter.id
                      ? 'bg-[#00A758] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="flex items-stretch gap-2 w-full">
              {/* 姓名搜索框 */}
              <div className="relative flex-1 min-w-0">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-2 h-full focus-within:border-[#00A758] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00A758]/15 transition shadow-2xs">
                  <i className="fa-solid fa-magnifying-glass text-slate-400 text-xs shrink-0"></i>
                  <input
                    type="text"
                    placeholder="搜索姓名/工号/主管/职级..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 w-full bg-transparent text-xs text-[#282B3E] font-medium placeholder:text-slate-400 focus:outline-none"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 shrink-0 cursor-pointer"
                      title="清空搜索"
                    >
                      <i className="fa-solid fa-xmark text-xs"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* 出席率多选筛选 */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setRateFilterOpen(v => !v)}
                  className={`flex items-center gap-1.5 h-full rounded-xl px-3 py-2 text-xs font-bold border transition shadow-2xs cursor-pointer ${
                    attendanceRateFilters.length > 0
                      ? 'bg-emerald-50 border-[#00A758]/40 text-[#00A758]'
                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <i className="fa-solid fa-filter text-[11px]"></i>
                  <span className="whitespace-nowrap">
                    出席率{attendanceRateFilters.length > 0 ? ` (${attendanceRateFilters.length})` : ''}
                  </span>
                  <i className={`fa-solid fa-chevron-down text-[9px] transition-transform ${rateFilterOpen ? 'rotate-180' : ''}`}></i>
                </button>

                <AnimatePresence>
                  {rateFilterOpen && (
                    <>
                      {/* 点击外部关闭 */}
                      <div className="fixed inset-0 z-40" onClick={() => setRateFilterOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1.5 z-50 w-40 bg-white rounded-xl border border-slate-100 shadow-lg overflow-hidden py-1"
                      >
                        <div className="px-3 pt-1 pb-1.5 flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-400">出席率</span>
                          {attendanceRateFilters.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setAttendanceRateFilters([])}
                              className="text-[10px] font-bold text-slate-400 hover:text-[#00A758] cursor-pointer"
                            >
                              清空
                            </button>
                          )}
                        </div>
                        {([
                          { id: '80plus', label: '≥80%' },
                          { id: '50to79', label: '50%-79%' },
                          { id: 'under50', label: '<50%' },
                        ] as const).map((opt) => {
                          const checked = attendanceRateFilters.includes(opt.id);
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setAttendanceRateFilters(prev =>
                                  prev.includes(opt.id)
                                    ? prev.filter(x => x !== opt.id)
                                    : [...prev, opt.id]
                                );
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <span className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${
                                checked ? 'bg-[#00A758] border-[#00A758] text-white' : 'bg-white border-slate-300'
                              }`}>
                                {checked && <i className="fa-solid fa-check text-[9px]"></i>}
                              </span>
                              <span className={checked ? 'text-[#00A758]' : ''}>{opt.label}</span>
                            </button>
                          );
                        })}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* 人员名单（参考 TeamManagementDetailModal 样式） */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="divide-y divide-slate-100">
              {filteredActivityList.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-bold">
                  当前筛选条件下暂无人员
                </div>
              ) : (
                filteredActivityList.map((item) => {
                  const isSupervisor = item.rank === 'ADM' || item.rank === 'DM' || item.rank === 'UM' || item.rank === 'SUM';
                  return (
                    <div key={item.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#00A758] border border-emerald-200 flex items-center justify-center font-black text-xs shrink-0">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[13px] font-black text-slate-800">{item.name}</span>
                            <span className="text-[10px] font-mono text-slate-400 font-bold">{item.empId}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-black border ${
                              isSupervisor
                                ? 'bg-emerald-50 text-[#00A758] border-emerald-200'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}>
                              {item.rank}
                            </span>
                            {item.generation && item.generation !== '--' && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                {item.generation}
                              </span>
                            )}
                            {item.scope !== 'direct' && item.supervisor && (
                              <span className="text-[10px] font-medium text-slate-400">
                                主管：<span className="text-[#00A758] font-bold">{item.supervisor}</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                            <span>出勤: <strong className="text-slate-700 font-mono font-bold">{item.attendedDays}/{item.passedDays}天</strong></span>
                            <span>•</span>
                            <span>请假: <strong className={item.leaveCount > 0 ? "text-blue-600 font-mono font-bold" : "text-slate-700 font-mono font-bold"}>{item.leaveCount}天</strong></span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 pl-3">
                        <p className={`text-sm font-black font-mono ${
                          item.attendanceRate >= 80
                            ? 'text-[#00A758]'
                            : item.attendanceRate >= 50
                            ? 'text-amber-500'
                            : 'text-rose-500'
                        }`}>
                          {item.attendanceRate}%
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </FullScreenModal>
  );
};

const IssuedCommissionableDetailModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  policies: PolicyDetail[];
  isAmountHidden: boolean;
}> = ({ isOpen, onClose, policies, isAmountHidden }) => {
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const filteredPolicies = [...policies]
    .filter(p => p.fycType === 'issued_commissionable')
    .sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

  const toggleExpand = (policyIdx: number, productIdx: number) => {
    const key = `${policyIdx}-${productIdx}`;
    setExpandedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  return (
    <FullScreenModal isOpen={isOpen} onClose={onClose} title="签发可计佣FYC保单明细" bgClass="bg-slate-50">
      <div className="p-4 space-y-4 pb-10">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 flex justify-between items-center shadow-sm">
          <span className="text-xs font-bold text-slate-500">共 {filteredPolicies.length} 件保单记录</span>
        </div>
        {filteredPolicies.length > 0 ? (
          filteredPolicies.map((policy, idx) => (
            <div key={idx} className={`bg-white rounded-2xl p-4 shadow-sm border ${policy.isNew ? 'border-rose-200 ring-1 ring-rose-100' : 'border-slate-100'} flex flex-col gap-3 relative overflow-hidden`}>
              {policy.isNew && (
                <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg shadow-sm">
                  昨日新计佣
                </div>
              )}
              <div className="flex justify-between items-start border-b border-slate-50 pb-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-black text-slate-400 tracking-tight uppercase">保单号: {policy.policyNo}</span>
                    <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded shadow-sm border ${
                      (policy.policyStatus || '有效-交费有效').startsWith('有效')
                        ? 'text-[#00A758] bg-green-50 border-green-100'
                        : 'text-rose-600 bg-rose-50 border-rose-100'
                    }`}>
                      {policy.policyStatus || '有效-交费有效'}
                    </span>
                    {policy.isSelfMutual && (
                      <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded shadow-sm border text-[#00A758] bg-green-50 border-green-100">
                        自保件
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-black text-slate-800 mt-0.5">{policy.customerName}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#00A758] bg-green-50 px-2 py-0.5 rounded-full">
                    FYC
                  </span>
                  <p className="text-lg font-black text-[#00A758] leading-none mt-1">
                    <AmountDisplay value={policy.amount} isHidden={isAmountHidden} prefix="¥" />
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-shield-halved text-slate-300 text-xs"></i>
                  <span className="text-xs font-bold text-slate-600">
                    {policy.productType?.endsWith(' - 续期') && policy.productCode
                      ? <>{policy.productType.replace(' - 续期', '')} <span className="text-[#00A758]">{policy.productCode}</span> - 续期</>
                      : <>{policy.productType} {policy.productCode && <span className="text-[#00A758]">{policy.productCode}</span>}</>
                    }
                  </span>
                </div>
                <button 
                  onClick={() => toggleExpand(idx, 0)}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <span>{expandedProducts.has(`${idx}-0`) ? '收起' : '展开'}</span>
                  <i className={`fa-solid ${expandedProducts.has(`${idx}-0`) ? 'fa-chevron-up' : 'fa-chevron-down'} text-[8px] text-[#00A758]`}></i>
                </button>
              </div>

              {expandedProducts.has(`${idx}-0`) && (
                <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-400 font-bold">生效日期</span>
                    <span className="text-[11px] font-black text-slate-700">{policy.policyEffectiveDate || '--'}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-400 font-bold">佣金生成日</span>
                    <span className="text-[11px] font-black text-slate-700">{policy.commissionGenDate || '--'}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-400 font-bold">佣金奖金月</span>
                    <span className="text-[11px] font-black text-slate-700">{policy.commissionBonusMonth || '--'}</span>
                  </div>
                </div>
              )}

              {policy.additionalProducts?.map((product, pIdx) => (
                <div key={pIdx} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <i className="fa-solid fa-shield-halved text-slate-300 text-xs mt-0.5 shrink-0"></i>
                      <span className="text-xs font-bold text-slate-600 break-all">
                        {product.productType} {product.productCode && <span className="text-[#00A758]">{product.productCode}</span>}
                      </span>
                    </div>
                    <button 
                      onClick={() => toggleExpand(idx, pIdx + 1)}
                      className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-slate-700 transition-colors shrink-0 ml-2"
                    >
                      <span>{expandedProducts.has(`${idx}-${pIdx + 1}`) ? '收起' : '展开'}</span>
                      <i className={`fa-solid ${expandedProducts.has(`${idx}-${pIdx + 1}`) ? 'fa-chevron-up' : 'fa-chevron-down'} text-[8px] text-[#00A758]`}></i>
                    </button>
                  </div>
                  {expandedProducts.has(`${idx}-${pIdx + 1}`) && (
                    <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-slate-400 font-bold">生效日期</span>
                        <span className="text-[11px] font-black text-slate-700">{product.policyEffectiveDate || '--'}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-slate-400 font-bold">佣金生成日</span>
                        <span className="text-[11px] font-black text-slate-700">{product.commissionGenDate || '--'}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-slate-400 font-bold">佣金奖金月</span>
                        <span className="text-[11px] font-black text-slate-700">{product.commissionBonusMonth || '--'}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300">
            <i className="fa-solid fa-folder-open text-4xl mb-2"></i>
            <p className="text-sm">暂时没有记录</p>
          </div>
        )}
      </div>
    </FullScreenModal>
  );
};

// Optimized PolicyDetailModal: Unified card layout for both Paid and Unpaid views
const PolicyDetailModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  type: 'paid' | 'unpaid' | 'renewal' | 'net_issued_fyc' | null;
  policies: PolicyDetail[];
  isAmountHidden: boolean;
  trackedPolicyNos: string[];
  onToggleTrack: (policyNo: string) => void;
}> = ({ isOpen, onClose, type, policies, isAmountHidden, trackedPolicyNos, onToggleTrack }) => {
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const toggleExpand = (policyIdx: number, productIdx: number) => {
    const key = `pdm-${policyIdx}-${productIdx}`;
    setExpandedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };
  
  // Sort: New policies first
  const filteredPolicies = [...policies]
    .filter(p => {
      if (type === 'net_issued_fyc') return p.fycType === 'unpaid';
      return p.fycType === type;
    })
    .sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

  let title = '';
  if (type === 'paid') title = '净FYC发佣保单明细';
  else if (type === 'unpaid') title = '已签发未计佣保单明细';
  else if (type === 'renewal') title = '续佣保单明细';
  else if (type === 'net_issued_fyc') title = '净FYC签发保单明细';
  else if (type === 'issued_commissionable') title = '签发可计佣FYC保单明细';

  const StatusTag: React.FC<{ label: string; value: string }> = ({ label, value }) => {
    const isSuccess = value === '通过' || value === '完成' || value === '合格' || value === '已核对';
    return (
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-slate-400 font-bold">{label}</span>
        <span className={`text-[11px] font-black ${isSuccess ? 'text-[#00A758]' : 'text-amber-600'}`}>
          {value || '--'}
        </span>
      </div>
    );
  };

  return (
    <FullScreenModal isOpen={isOpen} onClose={onClose} title={title} bgClass="bg-slate-50">
      <div className="p-4 space-y-4 pb-10">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 flex justify-between items-center shadow-sm">
          <span className="text-xs font-bold text-slate-500">共 {filteredPolicies.length} 件保单记录</span>
        </div>
        {filteredPolicies.length > 0 ? (
          filteredPolicies.map((policy, idx) => (
            <div key={idx} className={`bg-white rounded-2xl p-4 shadow-sm border ${policy.isNew ? 'border-rose-200 ring-1 ring-rose-100' : 'border-slate-100'} flex flex-col gap-3 relative overflow-hidden`}>
              {policy.isNew && (
                <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg shadow-sm">
                  {(type === 'paid' || type === 'net_issued_fyc' || type === 'issued_commissionable') ? '昨日新计佣' : 'NEW 新增'}
                </div>
              )}
              <div className="flex justify-between items-start border-b border-slate-50 pb-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-black text-slate-400 tracking-tight uppercase">保单号: {policy.policyNo}</span>
                    {(type === 'paid' || type === 'renewal' || type === 'net_issued_fyc' || type === 'issued_commissionable' || type === 'unpaid') && (
                      <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded shadow-sm border ${
                        (policy.policyStatus || '有效-交费有效').startsWith('有效')
                          ? 'text-[#00A758] bg-green-50 border-green-100'
                          : 'text-rose-600 bg-rose-50 border-rose-100'
                      }`}>
                        {policy.policyStatus || '有效-交费有效'}
                      </span>
                    )}
                    {policy.isSelfMutual && (
                      <span className="text-[9px] font-black text-[#00A758] bg-green-50 px-1.5 py-0.5 rounded shadow-sm border border-green-100" title="自保件">
                        自保件
                      </span>
                    )}
                    {policy.isSelfPurchase && type !== 'paid' && (
                      <span className="text-[9px] font-black text-[#00A758] bg-green-50 px-1.5 py-0.5 rounded shadow-sm border border-green-100" title="自买单">
                        自买单
                      </span>
                    )}
                    {policy.isRelativePolicy && (
                      <span className="text-[9px] font-black text-[#00A758] bg-green-50 px-1.5 py-0.5 rounded shadow-sm border border-green-100" title="亲属单">
                        亲属单
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-black text-slate-800 mt-0.5">{policy.customerName}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#00A758] bg-green-50 px-2 py-0.5 rounded-full">
                    {type === 'renewal' ? 'RYC' : 'FYC'}
                  </span>
                  <p className="text-lg font-black text-[#00A758] leading-none mt-1">
                    <AmountDisplay value={policy.amount} isHidden={isAmountHidden} prefix="¥" />
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-shield-halved text-slate-300 text-xs"></i>
                  <span className="text-xs font-bold text-slate-600">
                    {policy.productType?.endsWith(' - 续期') && policy.productCode
                      ? <>{policy.productType.replace(' - 续期', '')} <span className="text-[#00A758]">{policy.productCode}</span> - 续期</>
                      : <>{policy.productType} {policy.productCode && <span className="text-[#00A758]">{policy.productCode}</span>}</>
                    }
                  </span>
                </div>
                <button
                  onClick={() => toggleExpand(idx, 0)}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <span>{expandedProducts.has(`pdm-${idx}-0`) ? '收起' : '展开'}</span>
                  <i className={`fa-solid ${expandedProducts.has(`pdm-${idx}-0`) ? 'fa-chevron-up' : 'fa-chevron-down'} text-[8px] text-[#00A758]`}></i>
                </button>
              </div>

              {(type === 'paid' || type === 'renewal' || type === 'net_issued_fyc' || type === 'issued_commissionable') ? (
                expandedProducts.has(`pdm-${idx}-0`) && (
                  <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-400 font-bold">生效日期</span>
                      <span className="text-[11px] font-black text-slate-700">{policy.policyEffectiveDate || '2024-05-11'}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-400 font-bold">佣金生成日</span>
                      <span className="text-[11px] font-black text-slate-700">{policy.commissionGenDate || '2026-03-01'}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-400 font-bold">佣金奖金月</span>
                      <span className="text-[11px] font-black text-slate-700">{policy.commissionBonusMonth || '2026年03月'}</span>
                    </div>
                  </div>
                )
              ) : type === 'unpaid' ? (
                <>
                  {expandedProducts.has(`pdm-${idx}-0`) && (
                    <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-slate-400 font-bold">回执日期</span>
                        <span className="text-[11px] font-black text-slate-700">{policy.receiptDate}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-slate-400 font-bold">回访日期</span>
                        <span className="text-[11px] font-black text-[#00A758]">
                          {policy.followUpDate || '待处理'}
                        </span>
                      </div>
                      <StatusTag label="证件影像留存" value={policy.idCopy} />
                      <StatusTag label="电子投保QC" value={policy.ePolicyQc} />
                      <StatusTag label="双录质检" value={policy.videoQc} />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-slate-400 font-bold">过犹豫期日期</span>
                        <span className="text-[11px] font-black text-rose-500">{policy.lapseDate || '--'}</span>
                      </div>
                      {policy.commissionDate && (
                        <div className="flex flex-col gap-0.5 col-span-2 mt-1 pt-2 border-t border-slate-200/50">
                          <span className="text-[10px] text-slate-400 font-bold">计佣日期 (满足计佣条件日期)</span>
                          <span className="text-[11px] font-black text-[#00A758]">{policy.commissionDate}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {policy.additionalProducts?.map((product, pIdx) => (
                    <div key={pIdx} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <i className="fa-solid fa-shield-halved text-slate-300 text-xs mt-0.5 shrink-0"></i>
                          <span className="text-xs font-bold text-slate-600 break-all">
                            {product.productType} {product.productCode && <span className="text-[#00A758]">{product.productCode}</span>}
                          </span>
                        </div>
                        <button 
                          onClick={() => toggleExpand(idx, pIdx + 1)}
                          className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-slate-700 transition-colors shrink-0 ml-2"
                        >
                          <span>{expandedProducts.has(`pdm-${idx}-${pIdx + 1}`) ? '收起' : '展开'}</span>
                          <i className={`fa-solid ${expandedProducts.has(`pdm-${idx}-${pIdx + 1}`) ? 'fa-chevron-up' : 'fa-chevron-down'} text-[8px] text-[#00A758]`}></i>
                        </button>
                      </div>
                      {expandedProducts.has(`pdm-${idx}-${pIdx + 1}`) && (
                        <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-slate-400 font-bold">回执日期</span>
                            <span className="text-[11px] font-black text-slate-700">{product.receiptDate}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-slate-400 font-bold">回访日期</span>
                            <span className="text-[11px] font-black text-[#00A758]">
                              {product.followUpDate || '待处理'}
                            </span>
                          </div>
                          <StatusTag label="证件影像留存" value={product.idCopy || ''} />
                          <StatusTag label="电子投保QC" value={product.ePolicyQc || ''} />
                          <StatusTag label="双录质检" value={product.videoQc || ''} />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-slate-400 font-bold">过犹豫期日期</span>
                            <span className="text-[11px] font-black text-rose-500">{product.lapseDate || '--'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-400 font-bold">{type === 'renewal' ? '上年度签单日期' : '回执日期'}</span>
                    <span className="text-[11px] font-black text-slate-700">{policy.receiptDate}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-400 font-bold">{type === 'renewal' ? '本期宽限/交费日期' : '回访日期'}</span>
                    <span className={`text-[11px] font-black text-[#00A758]`}>
                      {policy.followUpDate || '待处理'}
                    </span>
                  </div>
                  <StatusTag label="证件影像留存" value={policy.idCopy} />
                  <StatusTag label="电子投保QC" value={policy.ePolicyQc} />
                  <StatusTag label="双录质检" value={policy.videoQc} />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-400 font-bold">{type === 'renewal' ? '宽限截止日期' : '过犹豫期日期'}</span>
                    <span className="text-[11px] font-black text-rose-500">{policy.lapseDate || '--'}</span>
                  </div>
                  {policy.commissionDate && (
                    <div className="flex flex-col gap-0.5 col-span-2 mt-1 pt-2 border-t border-slate-200/50">
                      <span className="text-[10px] text-slate-400 font-bold">计佣日期 (满足计佣条件日期)</span>
                      <span className="text-[11px] font-black text-[#00A758]">{policy.commissionDate}</span>
                    </div>
                  )}
                </div>
              )}
              
              
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300">
            <i className="fa-solid fa-folder-open text-4xl mb-2"></i>
            <p className="text-sm">暂时没有记录</p>
          </div>
        )}
      </div>
    </FullScreenModal>
  );
};

// --- Insight Module ---
// --- Ranking Section Component ---
const RankingSection: React.FC<{ rankings: any[] }> = ({ rankings }) => {
  return (
    <section id="ranking-section" className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2 tracking-wide">
          <i className="fa-solid fa-ranking-star text-[#00A758]"></i>
          个人各项指标排名
        </h2>
        <span className="text-[10px] font-bold text-slate-400">分公司排名</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {rankings.map((item, idx) => (
          <div key={idx} className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex flex-col gap-1">
            <p className="text-[10px] text-slate-500 font-bold">{item.project}</p>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-0.5">
                <span className="text-[10px] text-slate-400">第</span>
                <span className="text-base font-black text-slate-800 tracking-tighter">{item.rank}</span>
                <span className="text-[10px] text-slate-400">名</span>
              </div>
              <span className="text-[9px] font-black text-[#00A758] bg-green-50 px-1.5 py-0.5 rounded-full border border-green-100">
                前 {item.comparison}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// --- FullScreen Modal Wrapper ---
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

// --- Ranking Modal Component ---
const RankingModal: React.FC<{ isOpen: boolean; onClose: () => void; rankings: any[] }> = ({ isOpen, onClose, rankings }) => {
  return (
    <FullScreenModal isOpen={isOpen} onClose={onClose} title="指标排名" bgClass="bg-slate-50">
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {rankings.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-2">
              <p className="text-xs text-slate-500 font-bold">{item.project}</p>
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xs text-slate-400">第</span>
                  <span className="text-2xl font-black text-[#00A758] tracking-tighter">{item.rank}</span>
                  <span className="text-xs text-slate-400">名</span>
                </div>
                <span className="text-[10px] font-black text-[#00A758] bg-green-50 px-2 py-1 rounded-full border border-green-100">
                  前 {item.comparison}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mt-4">
          <h4 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-circle-info text-blue-500"></i>
            排位分析
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            您在分公司的综合排位处于 <span className="font-bold text-[#00A758]">前15%</span>，表现优异。特别是“总净APE”项，您已经进入了精英第一梯队。
          </p>
        </div>
      </div>
    </FullScreenModal>
  );
};

const CollapsibleInsightItem: React.FC<{
  insight: any;
  isAmountHidden: boolean;
}> = ({ insight, isAmountHidden }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [starTab, setStarTab] = useState<'标准一' | '标准二'>('标准一');
  const isStarDiamond = insight.name === '星钻恒星奖';
  const gap = Math.max(0, insight.targetVal - insight.currentVal);

  return (
    <div 
      className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'p-3 border-slate-100 shadow-sm' : 'p-2.5 border-slate-50 shadow-xs hover:border-slate-200'}`}
    >
      {/* Header - Always visible, handles toggle */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-between items-center cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <div className={`w-1 h-3 rounded-full transition-colors ${insight.impactType === 'warning' ? 'bg-amber-400' : 'bg-[#00D76F]'}`}></div>
          <div className="flex flex-col">
            <h4 className="text-[14px] font-black text-slate-800 flex items-center gap-1.5 leading-tight">
              {insight.name}
              <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} text-[7px] text-slate-300 group-hover:text-slate-400 transition-transform`}></i>
            </h4>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* 星钻恒星奖：标准一/标准二切换，与标题同一行，展开后显示 */}
          {isStarDiamond && isExpanded && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/50 shadow-inner"
            >
              {(['标准一', '标准二'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={(e) => { e.stopPropagation(); setStarTab(tab); }}
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-black transition-all ${starTab === tab ? 'bg-white text-[#00A758] shadow-sm' : 'text-slate-400'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
          <div className="flex flex-col items-end gap-1.5">
            {gap > 0 && !(isStarDiamond && isExpanded) && (
              <span className="text-[10px] font-black text-amber-600 bg-amber-50 border-amber-100 px-1.5 py-0.5 rounded border flex items-center gap-1">
                <span className="text-[7px] font-bold opacity-60 uppercase">距下一档差</span>
                <span className="leading-none tracking-tighter">FYC {isAmountHidden ? '****' : gap.toLocaleString()}</span>
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-2.5">
              <div className="px-0.5">
                <div className="flex justify-between items-end mb-1">
                  <div className="flex flex-col gap-0.5">
                    {/* 现状渲染：月度业绩奖和星钻恒星奖删除现状文字描述 */}
                    {insight.name !== '月度业绩奖' && insight.name !== '星钻恒星奖' && (
                      <p className="text-[11px] text-blue-600 font-bold flex items-center gap-1">
                        <i className="fa-solid fa-flag text-[9px]"></i> {insight.progress}
                      </p>
                    )}
                    {insight.currentRate && (
                      <span className="text-[8px] text-blue-400 font-bold bg-blue-50 self-start px-1 rounded">当前奖金率: {insight.currentRate}</span>
                    )}
                    {insight.currentTier && !isStarDiamond && (
                      <span className="text-[8px] text-blue-400 font-bold bg-blue-50 self-start px-1 rounded">
                        {insight.isQuarterEnd ? `季度最低档位: ${insight.currentTier}` : `当前达成: ${insight.currentTier}`}
                      </span>
                    )}
                  </div>
                    {!isAmountHidden && !isStarDiamond && (
                      <span className="text-[10px] text-slate-400 font-bold">
                        当前达成: FYC {insight.currentVal.toLocaleString()}
                      </span>
                    )}
                </div>
                {/* 星钻恒星奖：当前达成 + 距下一档差，同一行，紧贴下方月份卡片 */}
                {isStarDiamond && !isAmountHidden && (
                  <div className="flex justify-between items-center mt-2 mb-0.5">
                    <p className="text-[10px] text-slate-400 font-bold">
                      当前达成: FYC {insight.currentVal.toLocaleString()}
                    </p>
                    {gap > 0 && (
                      <span className="text-[10px] font-black text-amber-600 bg-amber-50 border-amber-100 px-1.5 py-0.5 rounded border flex items-center gap-1">
                        <span className="text-[7px] font-bold opacity-60 uppercase">距下一档差</span>
                        <span className="leading-none tracking-tighter">FYC {gap.toLocaleString()}</span>
                      </span>
                    )}
                  </div>
                )}
                {/* 星钻历史追踪 */}
                {insight.history && (
                  <div className="flex gap-2 mt-0.5 mb-2 overflow-x-auto pb-1">
                    {insight.history.map((h: any, i: number) => (
                      <div key={i} className={`flex-1 min-w-[60px] p-1.5 rounded-lg border flex flex-col items-center gap-0.5 ${h.status === 'current' ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
                        <span className={`text-[8px] font-bold ${h.status === 'current' ? 'text-[#00A758]' : 'text-slate-400'}`}>{h.period}</span>
                        <span className={`text-[9px] font-black ${h.status === 'achieved' || h.status === 'current' ? 'text-green-600' : 'text-blue-600'}`}>{h.tier}</span>
                        {h.consecutive !== undefined && (
                          <span className="text-[7px] text-slate-400">连续月：{h.consecutive}</span>
                        )}
                        {h.count !== undefined && starTab === '标准一' && (() => {
                          const [done, total] = String(h.count).split('/').map((n: string) => parseInt(n, 10));
                          const met = !isNaN(done) && !isNaN(total) && done >= total;
                          return (
                            <span className={`text-[7px] ${met ? 'text-green-600' : 'text-red-500'}`}>
                              件数：<span className="font-black">{done}</span>/{total}
                            </span>
                          );
                        })()}
                        {h.fyc !== undefined && h.count === undefined && (
                          <span className="text-[7px] text-slate-400">FYC {h.fyc.toLocaleString()}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 档位进度条 */}
                <div className="relative h-2.5 mt-2 mb-5">
                  <div className="absolute inset-0 bg-slate-100 rounded-full shadow-inner"></div>
                  
                  {/* Main Progress Bar Wrapper */}
                  <div className="absolute inset-0 flex rounded-full overflow-hidden">
                    {/* 已达部分 (Green) */}
                    <div 
                      className="h-full bg-gradient-to-r from-[#00C875] to-[#00A758] transition-all duration-1000 ease-out relative"
                      style={{ width: `${Math.min(100, (insight.currentVal / (insight.targetVal * 1.15)) * 100)}%` }}
                    >
                      {/* Current Value Marker */}
                      {!isAmountHidden && (
                        <div className="absolute right-0 top-0 bottom-0 w-px bg-white/30 z-10"></div>
                      )}
                    </div>

                    {/* 追踪部分 (Yellow) - Monthly Performance and Star Diamond */}
                    {(insight.name === '月度业绩奖' || insight.name === '星钻恒星奖') && insight.targetVal > insight.currentVal && (
                      <div 
                        className="h-full bg-amber-400 bg-opacity-90 shadow-[inset_0_0_10px_rgba(251,191,36,0.4)] animate-pulse"
                        style={{ width: `${Math.min(100 - (insight.currentVal / (insight.targetVal * 1.15)) * 100, ((insight.targetVal - insight.currentVal) / (insight.targetVal * 1.15)) * 100)}%` }}
                      ></div>
                    )}
                  </div>

                  {/* Floating Marker for Current Value */}
                  <div 
                    className="absolute h-full transition-all duration-1000 ease-out pointer-events-none"
                    style={{ left: `${Math.min(100, (insight.currentVal / (insight.targetVal * 1.15)) * 100)}%` }}
                  >
                     <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[7px] font-black text-slate-400">{isAmountHidden ? '****' : insight.currentVal.toLocaleString()}</div>
                  </div>

                  {/* Target Indicator with Yellow Glow if tracked goal */}
                  <div 
                    className="absolute h-full transition-all duration-1000 ease-out"
                    style={{ left: `${(insight.targetVal / (insight.targetVal * 1.15)) * 100}%` }}
                  >
                     <div className={`absolute -top-1 bottom-1 w-[2px] ${(insight.name === '月度业绩奖' || insight.name === '星钻恒星奖') ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-slate-300'}`}></div>
                     <div className={`absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[7px] font-black px-1 rounded ${(insight.name === '月度业绩奖' || insight.name === '星钻恒星奖') ? 'text-amber-600 bg-amber-50 border border-amber-200' : 'text-slate-400 bg-slate-50 border border-slate-100'}`}>
                       目标 {isAmountHidden ? '****' : insight.targetVal.toLocaleString()}
                     </div>
                  </div>

                  {/* Notch Indicators for Tiers */}
                  <div className="absolute inset-0 flex items-center pointer-events-none">
                    {insight.tiers.map((t: number, i: number) => {
                      const pos = (t / (insight.targetVal * 1.15)) * 100;
                      if (pos > 100 || Math.abs(t - insight.targetVal) < 1000) return null; // Skip if too close to target
                      const isAchieved = insight.currentVal >= t;
                      return (
                        <div key={i} className="absolute flex flex-col items-center" style={{ left: `${pos}%` }}>
                          <div className={`w-0.5 h-1.5 ${isAchieved ? 'bg-white/40' : 'bg-slate-200'}`}></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* 星钻恒星奖、月度业绩奖：进度条下方口径提示 */}
                {(isStarDiamond || insight.name === '月度业绩奖') && (
                  <p className="text-[9px] text-slate-400 font-bold mt-1">FYC：签发可计佣口径,仅作追踪使用</p>
                )}
              </div>

              <p className="text-[11px] text-slate-600 leading-loose font-bold bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <span className="text-[#00A758] font-black mr-1">
                  [机会]
                </span>
                <span className="text-slate-700">{insight.opportunity}</span>
              </p>

              <div className="flex justify-end pt-2 border-t border-slate-50 mt-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    insight.onDetail();
                  }}
                  className="text-[10px] font-black text-amber-500 flex items-center gap-1.5 bg-amber-50/50 px-4 py-2 rounded-full border border-amber-100 transition-all hover:bg-amber-100 shadow-xs active:scale-95"
                >
                  查看明细 <i className="fa-solid fa-chevron-right text-[8px]"></i>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InsightModule: React.FC<{ 
  view: ViewType; 
  teamFilter: 'direct' | 'district' | 'org';
  setTeamFilter: (filter: 'direct' | 'district' | 'org') => void;
  isAmountHidden: boolean;
  onOpenBasicLaw: () => void;
  onOpenUnpaid: () => void;
  onOpenPromotion: () => void;
  onOpenHonor: () => void;
  stats?: any;
}> = ({ view, teamFilter, setTeamFilter, isAmountHidden, onOpenBasicLaw, onOpenUnpaid, onOpenPromotion, onOpenHonor, stats }) => {
  const [showAllIncome, setShowAllIncome] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [bonusConfigs, setBonusConfigs] = useState([
    { name: '月度业绩奖', enabled: true },
    { name: '星钻恒星奖', enabled: true }
  ]);

  // 当前模拟职级为 SUM (UM)
  const currentRank = 'SUM'; 

  // 奖金项适用人群逻辑
  const bonusEligibility = {
    '星钻恒星奖': true, // 所有职级
    '月度业绩奖': ['FC', 'AUM', 'UM', 'SUM', 'ADM'].includes(currentRank),
    '直辖工作室筹备奖': ['AUM'].includes(currentRank),
    '营业区每月管理奖': ['UM', 'SUM', 'ADM'].includes(currentRank),
    '直辖工作室育成奖': ['UM', 'SUM', 'ADM'].includes(currentRank),
    '长宏奖': ['SADM', 'SDM'].includes(currentRank),
  };

  // 生成个人收入洞察
  const getIncomeInsights = () => {
    // 仅保留已开启的奖金项，按配置顺序排列
    const eligibleBonuses = bonusConfigs
      .filter(config => config.enabled)
      .map(config => config.name);

    const allInsights = eligibleBonuses.map(name => {
      let progress = '';
      let opportunity = '';
      let estimatedBonus = 0;
      let detailAction = onOpenBasicLaw;
      let currentVal = 0;
      let targetVal = 0;
      let tiers: number[] = [];

      if (name === '月度业绩奖') {
        currentVal = 25000;
        targetVal = 30000;
        const currentRate = '40%';
        const nextRate = '50%';
        tiers = [3000, 6000, 10000, 30000, 50000];
        
        progress = `当月个人累计 FYC ${currentVal.toLocaleString()}，已达成 ${currentRate} 档位。`;
        // 计算逻辑: (30000 * 50% * 0.8) - (25000 * 40% * 0.8) = 12000 - 8000 = 4000
        // 目前系数 0.8
        estimatedBonus = 5000; 
        opportunity = `目前 5,000 FYC 的档位差额可通过完成“已签未计佣保单追踪”升至 30,000 FYC 档位，月度业绩奖奖金率可提升至50%。`;
        
        detailAction = onOpenBasicLaw;
        const coefficientWarning = "当前晨会出席率 78.5%（未达 80% 标准），对应晨会奖金系数为 0.8。建议补齐晨会后再进入核算。";

        return {
          name,
          progress,
          opportunity,
          estimatedBonus,
          currentVal,
          targetVal,
          currentRate,
          nextRate,
          tiers,
          warning: coefficientWarning,
          impactType: 'opportunity',
          onDetail: detailAction
        };
      } else if (name === '星钻恒星奖') {
        // ... (rest same except opportunity)
        const currentMonth = 3; 
        const isQuarterEnd = [3, 6, 9, 12].includes(currentMonth);
        
        currentVal = 6000; 
        targetVal = 10000; 
        tiers = [3000, 6000, 10000, 15000];
        
        const history = [
          { period: '6月', tier: '金星钻', consecutive: 6, status: 'achieved' },
          { period: '7月', tier: '金星钻', consecutive: 7, status: 'achieved' },
          { period: '8月(当前)', tier: '银星钻', count: '1/2', status: 'current' },
        ];

        const lowestTier = '银星钻';
        
        progress = `本月达成银星钻。考核期历史：1月(金)、2月(金)。`;
        opportunity = `目前 4,000 FYC 的档位差额可通过完成“已签未计佣保单追踪”补齐，即可全季维持“金星钻”档位。`;
        
        estimatedBonus = isQuarterEnd ? 1500 : 0;
        detailAction = onOpenBasicLaw;

        return {
          name,
          progress,
          opportunity,
          estimatedBonus,
          currentVal,
          targetVal,
          currentTier: lowestTier,
          history,
          tiers,
          isQuarterEnd,
          impactType: 'warning',
          onDetail: detailAction
        };
      }

      return {
        name,
        progress,
        opportunity,
        estimatedBonus,
        currentVal,
        targetVal,
        tiers,
        onDetail: detailAction
      };
    });

    return allInsights;
  };

  const StarDiamondHonorInsight = () => {
    const [activeStandard, setActiveStandard] = useState<'标准一' | '标准二'>('标准一');
    const [isExpandedStarDiamond, setIsExpandedStarDiamond] = useState(false);
    const [isExpandedContinuous, setIsExpandedContinuous] = useState(false);
    
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 tracking-tight">
            <i className="fa-solid fa-gem text-[#00A758]"></i>
            星钻荣誉洞察
          </h2>
        </div>

        <div className="space-y-3">
          {/* 首月星钻人力 */}
          <div className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${isExpandedStarDiamond ? 'p-3 border-slate-100 shadow-sm' : 'p-2.5 border-slate-50 shadow-xs hover:border-slate-200'}`}>
            <div 
              onClick={() => setIsExpandedStarDiamond(!isExpandedStarDiamond)}
              className="flex justify-between items-center cursor-pointer group"
            >
               <div className="flex items-center gap-2">
                  <div className="w-1 h-3 bg-[#00A758] rounded-full"></div>
                  <h4 className="text-[14px] font-black text-slate-800 flex items-center gap-1.5">
                    首月星钻人力
                    <i className={`fa-solid fa-chevron-${isExpandedStarDiamond ? 'up' : 'down'} text-[7px] text-slate-300 group-hover:text-slate-400 transition-transform`}></i>
                  </h4>
               </div>
               {isExpandedStarDiamond && (
                 <div 
                   onClick={(e) => e.stopPropagation()}
                   className="flex bg-slate-100 rounded-lg p-1"
                 >
                   {['标准一', '标准二'].map((s) => (
                     <button
                       key={s}
                       onClick={(e) => { e.stopPropagation(); setActiveStandard(s as '标准一' | '标准二'); }}
                       className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                         activeStandard === s ? 'bg-white text-[#00A758] shadow-sm' : 'text-slate-400'
                       }`}
                     >
                       {s}
                     </button>
                   ))}
                 </div>
               )}
            </div>

            <AnimatePresence>
              {isExpandedStarDiamond && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-5 space-y-6">
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
                              className="h-full bg-[#00A758] rounded-full"
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
                              className="h-full bg-[#00A758] rounded-full"
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
                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-500 font-medium">当月签发可计佣FYC</span>
                            <span className="text-slate-800 font-bold">2000 / 4500 元</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(2000 / 4500) * 100}%` }}
                              className="h-full bg-[#00A758] rounded-full"
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[11px] py-1">
                          <span className="text-slate-500 font-medium">参加飞鹰培训</span>
                          <span className="text-red-500 font-bold">否</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 bg-[#F7FCF9] rounded-xl p-3 border border-[#00A758]/20">
                    <p className="text-[11px] text-slate-600 leading-normal">
                      <span className="font-black text-[#00A758]">【机会】</span>
                      达成以上指标，您首个考核月即可达标，获得公司30周年纪念版司徽。
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 连续达成星钻月数 */}
          <div className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${isExpandedContinuous ? 'p-3 border-slate-100 shadow-sm' : 'p-2.5 border-slate-50 shadow-xs hover:border-slate-200'}`}>
            <div 
              onClick={() => setIsExpandedContinuous(!isExpandedContinuous)}
              className="flex justify-between items-center cursor-pointer group"
            >
               <div className="flex items-center gap-2">
                  <div className="w-1 h-3 bg-[#00A758] rounded-full"></div>
                  <h4 className="text-[14px] font-black text-slate-800 flex items-center gap-1.5">
                    连续达成星钻月数
                    <i className={`fa-solid fa-chevron-${isExpandedContinuous ? 'up' : 'down'} text-[7px] text-slate-300 group-hover:text-slate-400 transition-transform`}></i>
                  </h4>
               </div>
            </div>

            <AnimatePresence>
              {isExpandedContinuous && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-5 space-y-6">
                    {/* Scenario 1: 4/5 */}
                    <div className="space-y-4">
                      <div className="space-y-5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-500 font-medium">最高万元奖学金</span>
                          <span className="text-slate-800 font-bold">目标：达成 5 个月</span>
                        </div>
                        <div className="relative h-2">
                          <div className="absolute -top-3.5 left-[80%] -translate-x-1/2 text-[9px] font-bold text-[#00A758] whitespace-nowrap">4个月</div>
                          <div className="h-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(4 / 5) * 100}%` }}
                              className="h-full bg-[#00A758] rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#F7FCF9] rounded-xl p-3 border border-[#00A758]/20">
                        <p className="text-[11px] text-slate-600 leading-normal">
                          <span className="font-black text-[#00A758]">【机会】</span>
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
                          <div className="absolute -top-3.5 left-[87.5%] -translate-x-1/2 text-[9px] font-bold text-[#00A758] whitespace-nowrap">7个月</div>
                          <div className="h-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(7 / 8) * 100}%` }}
                              className="h-full bg-[#00A758] rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#F7FCF9] rounded-xl p-3 border border-[#00A758]/20">
                        <p className="text-[11px] text-slate-600 leading-normal">
                          <span className="font-black text-[#00A758]">【机会】</span>
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
                          <div className="absolute -top-3.5 left-[90.9%] -translate-x-1/2 text-[9px] font-bold text-[#00A758] whitespace-nowrap">10个月</div>
                          <div className="h-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(10 / 11) * 100}%` }}
                              className="h-full bg-[#00A758] rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#F7FCF9] rounded-xl p-3 border border-[#00A758]/20">
                        <p className="text-[11px] text-slate-600 leading-normal">
                          <span className="font-black text-[#00A758]">【机会】</span>
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
                          <div className="absolute -top-3.5 left-[83.3%] -translate-x-1/2 text-[9px] font-bold text-[#00A758] whitespace-nowrap">10个月</div>
                          <div className="h-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(10 / 12) * 100}%` }}
                              className="h-full bg-[#00A758] rounded-full"
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[11px] py-1">
                          <span className="text-slate-500 font-medium">累计直招星钻人力≥1</span>
                          <span className="text-red-500 font-bold">否</span>
                        </div>
                      </div>
                      <div className="bg-[#F7FCF9] rounded-xl p-3 border border-[#00A758]/20">
                        <p className="text-[11px] text-slate-600 leading-normal">
                          <span className="font-black text-[#00A758]">【机会】</span>
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
                          <div className="absolute -top-3.5 left-[33.3%] -translate-x-1/2 text-[9px] font-bold text-[#00A758] whitespace-nowrap">1个月</div>
                          <div className="h-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(1 / 3) * 100}%` }}
                              className="h-full bg-[#00A758] rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#F7FCF9] rounded-xl p-3 border border-[#00A758]/20">
                        <p className="text-[11px] text-slate-600 leading-normal">
                          <span className="font-black text-[#00A758]">【机会】</span>
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
                          <div className="absolute -top-3.5 left-[83.3%] -translate-x-1/2 text-[9px] font-bold text-[#00A758] whitespace-nowrap">10个月</div>
                          <div className="h-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(10 / 12) * 100}%` }}
                              className="h-full bg-[#00A758] rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#F7FCF9] rounded-xl p-3 border border-[#00A758]/20">
                        <p className="text-[11px] text-slate-600 leading-normal">
                          <span className="font-black text-[#00A758]">【机会】</span>
                          还需连续达成2个月的星钻人力即可获得宏运世家会员身份
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  const getRetentionInsights = () => {
    return []; // 去除留任品质洞察
  };

  if (view === ViewType.PERSONAL) {
    const incomeInsights = getIncomeInsights();
    const visibleIncome = showAllIncome ? incomeInsights : incomeInsights.slice(0, 2);

    return (
      <section className="space-y-4">
        {/* 基本法奖金洞察 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 tracking-tight">
              <i className="fa-solid fa-wand-magic-sparkles text-amber-500"></i>
              基本法奖金洞察
            </h3>
            <button 
              onClick={() => setIsConfigOpen(true)}
              className="text-[10px] font-black text-slate-400 flex items-center gap-1 hover:text-amber-500 transition-colors"
            >
              <i className="fa-solid fa-gear"></i>
              配置
            </button>
          </div>

          <div className="space-y-2">
            {visibleIncome.map((insight: any, idx: number) => (
              <CollapsibleInsightItem key={idx} insight={insight} isAmountHidden={isAmountHidden} />
            ))}

            {incomeInsights.length === 0 && (
              <div className="py-8 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <i className="fa-solid fa-layer-group text-slate-200 text-2xl mb-2"></i>
                <p className="text-[10px] font-bold text-slate-400">暂无开启的奖金洞察</p>
                <button 
                  onClick={() => setIsConfigOpen(true)}
                  className="mt-2 text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100"
                >
                  去开启
                </button>
              </div>
            )}

            {incomeInsights.length > 2 && (
              <div className="flex justify-center mt-2">
                <button 
                  onClick={() => setShowAllIncome(!showAllIncome)}
                  className="text-[10px] font-black text-slate-400 flex items-center gap-1 bg-white border border-slate-100 px-4 py-1.5 rounded-full shadow-xs active:scale-95 transition"
                >
                  {showAllIncome ? '收起部分洞察' : `查看全部 ${incomeInsights.length} 条奖金洞察`}
                  <i className={`fa-solid fa-chevron-${showAllIncome ? 'up' : 'down'} text-[8px]`}></i>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 星钻荣誉洞察 */}
        <StarDiamondHonorInsight />


        {/* 奖金项配置弹窗 */}
        <AnimatePresence>
          {isConfigOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-end justify-center"
              onClick={() => setIsConfigOpen(false)}
            >
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white w-full max-w-lg rounded-t-[32px] overflow-hidden shadow-2xl relative"
                onClick={e => e.stopPropagation()}
              >
                <div className="h-1.5 w-12 bg-slate-200 rounded-full mx-auto my-4"></div>
                
                <div className="px-6 pb-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-black text-slate-800">奖金洞察配置</h3>
                      <p className="text-xs text-slate-400 font-bold">开启或关闭各奖金项的系统洞察建议</p>
                    </div>
                    <button 
                      onClick={() => setIsConfigOpen(false)}
                      className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-2xl text-slate-400"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {bonusConfigs.map((config, idx) => (
                      <div 
                        key={config.name}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${config.enabled ? 'bg-amber-50/30 border-amber-100 shadow-xs' : 'bg-white border-slate-100 opacity-60'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col gap-1 mr-1">
                            <button 
                              disabled={idx === 0}
                              onClick={(e) => {
                                e.stopPropagation();
                                const newConfigs = [...bonusConfigs];
                                [newConfigs[idx], newConfigs[idx - 1]] = [newConfigs[idx - 1], newConfigs[idx]];
                                setBonusConfigs(newConfigs);
                              }}
                              className={`w-5 h-5 flex items-center justify-center rounded-md border border-slate-100 bg-white shadow-xs active:scale-90 transition-all ${idx === 0 ? 'opacity-20 pointer-events-none' : 'text-slate-400 hover:text-[#00A758] hover:border-[#00A758]'}`}
                            >
                              <i className="fa-solid fa-chevron-up text-[8px]"></i>
                            </button>
                            <button 
                              disabled={idx === bonusConfigs.length - 1}
                              onClick={(e) => {
                                e.stopPropagation();
                                const newConfigs = [...bonusConfigs];
                                [newConfigs[idx], newConfigs[idx + 1]] = [newConfigs[idx + 1], newConfigs[idx]];
                                setBonusConfigs(newConfigs);
                              }}
                              className={`w-5 h-5 flex items-center justify-center rounded-md border border-slate-100 bg-white shadow-xs active:scale-90 transition-all ${idx === bonusConfigs.length - 1 ? 'opacity-20 pointer-events-none' : 'text-slate-400 hover:text-[#00A758] hover:border-[#00A758]'}`}
                            >
                              <i className="fa-solid fa-chevron-down text-[8px]"></i>
                            </button>
                          </div>
                          
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.enabled ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
                            <i className={`fa-solid ${config.name === '月度业绩奖' ? 'fa-calendar-check' : 'fa-gem'}`}></i>
                          </div>
                          <div 
                             className="cursor-pointer"
                             onClick={() => {
                                const newConfigs = [...bonusConfigs];
                                newConfigs[idx].enabled = !newConfigs[idx].enabled;
                                setBonusConfigs(newConfigs);
                             }}
                          >
                            <p className={`font-black text-sm ${config.enabled ? 'text-slate-800' : 'text-slate-500'}`}>{config.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">基本法对应奖金洞察</p>
                          </div>
                        </div>
                        <div 
                          onClick={() => {
                            const newConfigs = [...bonusConfigs];
                            newConfigs[idx].enabled = !newConfigs[idx].enabled;
                            setBonusConfigs(newConfigs);
                          }}
                          className={`w-10 h-6 rounded-full relative transition-colors duration-200 cursor-pointer ${config.enabled ? 'bg-[#00A758]' : 'bg-slate-200'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${config.enabled ? 'left-5 shadow-md' : 'left-1'}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    );
  }

  const getTeamInsights = () => [];

  // --- TEAM VIEW LOGIC ---
  return (
    <div className="space-y-4">
      {/* Team Insight Title & Period Header */}
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
            <i className="fa-solid fa-lightbulb"></i>
          </div>
          <h3 className="text-sm font-black text-slate-800 tracking-tight">洞察建议 (仅展示缺口)</h3>
        </div>
        <div className="bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
          <span className="text-[10px] font-bold text-slate-400">考核周期：</span>
          <span className="text-[10px] font-black text-[#00A758]">2024Q3</span>
        </div>
      </div>
      
      {/* Promotion Category */}
      <div className="bg-[#F8FBFA] rounded-2xl p-5 border border-[#BDE8D2]/30 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E6F6EE] flex items-center justify-center text-[#00A758] shadow-xs">
            <i className="fa-solid fa-chart-line-up"></i>
          </div>
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">晋升情况</h4>
        </div>
        
        <div className="space-y-6">
          {(() => {
            let items: any[] = [];
            if (teamFilter === 'direct') {
              items = [
                { label: '直辖组星钻人力缺口 (标准 6人)', current: 4, target: 6, unit: '人' },
                { label: '直辖工作室 FYC 缺口 (标准 3.24万)', current: 2.74, target: 3.24, unit: '万' },
                { label: 'ADMTC 班结业缺口人数', current: 7, target: 10, unit: '人' }
              ];
            } else if (teamFilter === 'district') {
              items = [
                { label: '直辖组星钻人力缺口 (标准 6人)', current: 4, target: 6, unit: '人' },
                { label: '直辖工作室 FYC 缺口 (标准 3.24万)', current: 2.74, target: 3.24, unit: '万' },
                { label: 'ADMTC 班结业缺口人数', current: 7, target: 10, unit: '人' }
              ];
            } else if (teamFilter === 'district') {
              items = [
                { label: '营业区星钻人力缺口 (标准 24人)', current: 18, target: 24, unit: '人' },
                { label: '营业区 FYC 缺口 (标准 21万)', current: 18.5, target: 21, unit: '万' },
                { label: '营业区主管晋升结业人数', current: 4, target: 6, unit: '人' }
              ];
            } else if (teamFilter === 'org') {
              items = [
                { label: '一代主管晋升 SUM 达标缺口', current: 2, target: 5, unit: '人' },
                { label: '辖下主管星钻人力累计缺口', current: 45, target: 60, unit: '人' }
              ];
            }
            return items;
          })().map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-end px-0.5">
                <span className="text-[11px] font-bold text-slate-500">{item.label}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-[13px] font-black text-rose-500">{item.current}{item.unit}</span>
                  <span className="text-[10px] font-bold text-slate-300">/ {item.target}{item.unit}</span>
                </div>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                <div 
                  className="h-full bg-rose-400 rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${(item.current / item.target) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recruitment Funnel Section */}
      <RecruitmentFunnel filter={teamFilter} />
    </div>
  );
};
// --- Badge Wall Modal ---
const BadgeWallModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const internationalHonors = [
    { id: 'mdrt', name: 'MDRT', icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=MDRT%20medal%20icon%20with%20laurel%20wreath%20gold%20color%20simple%20clean%20design&image_size=square', tag: '达成追踪' },
    { id: 'ida', name: 'IDA', icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=IDA%20medal%20icon%20with%20dragon%20symbol%20gold%20red%20color%20simple%20clean%20design&image_size=square', tag: '达成追踪' },
  ];

  const manulifeHonors = [
    { id: 'elite', name: '群英会', icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elite%20club%20medal%20icon%20with%20laurel%20wreath%20green%20gold%20color%20simple%20clean%20design&image_size=square', tag: '达成追踪' },
    { id: 'top', name: '顶尖高手', icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=top%20achiever%20medal%20icon%20with%20fern%20leaf%20green%20blue%20color%20simple%20clean%20design&image_size=square', tag: '达成追踪' },
  ];

  if (!isOpen) return null;

  return (
    <FullScreenModal isOpen={isOpen} onClose={onClose} title="" bgClass="bg-[#F4F6F8]" hideHeader={true}>
      <div className="flex flex-col h-full">
        {/* Header Area */}
        <div className="relative bg-gradient-to-br from-[#003d25] via-[#006d3a] to-[#00A758] pt-8 pb-6 px-4">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-8 left-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white z-10"
          >
            <i className="fa-solid fa-chevron-left text-sm"></i>
          </button>

          <div className="text-center">
            <h2 className="text-white text-lg font-black tracking-wide">荣誉</h2>
          </div>

          <div className="flex justify-center mt-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center relative">
              <img 
                src="https://picsum.photos/seed/user123/100/100" 
                className="w-full h-full rounded-full object-cover"
                alt="Avatar"
              />
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="bg-white/80 backdrop-blur-md px-4 py-3 border-b border-slate-100">
          <div className="flex justify-around">
            {[
              { id: 'mdrt', label: 'MDRT' },
              { id: 'ida', label: 'IDA' },
              { id: 'elite', label: '群英会' },
            ].map((tab) => (
              <span
                key={tab.id}
                className="text-xs font-black text-[#00A758]"
              >
                {tab.label}
              </span>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
          {/* International Honors Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-800">国际荣誉</h3>
            {internationalHonors.map((honor) => (
              <div key={honor.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center overflow-hidden">
                    <img src={honor.icon} alt={honor.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">{honor.name}</h4>
                  </div>
                </div>
                <button className="text-xs font-black text-[#00A758] bg-green-50 px-4 py-1.5 rounded-full">
                  {honor.tag} <i className="fa-solid fa-chevron-right text-[8px] ml-1"></i>
                </button>
              </div>
            ))}
          </div>

          {/* Manulife Honors Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-800">中宏荣誉</h3>
            {manulifeHonors.map((honor) => (
              <div key={honor.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center overflow-hidden">
                    <img src={honor.icon} alt={honor.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">{honor.name}</h4>
                  </div>
                </div>
                <button className="text-xs font-black text-[#00A758] bg-green-50 px-4 py-1.5 rounded-full">
                  {honor.tag} <i className="fa-solid fa-chevron-right text-[8px] ml-1"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FullScreenModal>
  );
};

// --- Promotion Modal ---
const PromotionModal = PromotionManagementModal;


// --- Activity Management Modal ---
const ActivityManagementModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const memberActivities = [
    { name: '张旭', rank: 'UM', customers: 12, visits: 8, process: '2/15000', hours: 42, recruitment: 1 },
    { name: '李明', rank: 'FC', customers: 8, visits: 6, process: '1/8000', hours: 35, recruitment: 0 },
    { name: '王芳', rank: 'FC', customers: 15, visits: 10, process: '3/22000', hours: 50, recruitment: 1 },
    { name: '陈刚', rank: 'FC', customers: 5, visits: 3, process: '0/0', hours: 25, recruitment: 0 },
  ];

  if (!isOpen) return null;

  return (
    <FullScreenModal isOpen={isOpen} onClose={onClose} title="组员活动量明细" bgClass="bg-white">
      <div className="flex-1 flex flex-col font-sans">
        <div className="bg-slate-50 p-4 border-b border-slate-100">
           <p className="text-xs text-slate-400">实时查看组内各成员的展业记录明细</p>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col bg-white">
          {/* Table Header */}
          <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 grid grid-cols-6 gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            <div className="col-span-1">姓名/职级</div>
            <div className="text-center">客户经营</div>
            <div className="text-center">见面拜访</div>
            <div className="text-center">成交/FYC</div>
            <div className="text-center">工作时长</div>
            <div className="text-center">优增</div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {memberActivities.map((member, idx) => (
              <div key={idx} className="px-4 py-4 grid grid-cols-6 gap-2 items-center hover:bg-slate-50/50 transition-colors">
                <div className="col-span-1">
                  <p className="text-xs font-black text-slate-800">{member.name}</p>
                  <span className="text-[9px] px-1.5 py-0.5 bg-green-50 text-[#00A758] rounded font-bold mt-1 inline-block">
                    {member.rank}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-700">{member.customers}</p>
                  <p className="text-[8px] text-slate-400">位</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-700">{member.visits}</p>
                  <p className="text-[8px] text-slate-400">次</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-[#00A758] leading-tight">{member.process.split('/')[0]}</p>
                  <p className="text-[9px] text-[#00A758]">{member.process.split('/')[1]}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-700">{member.hours}</p>
                </div>
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${member.recruitment > 0 ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-slate-50 text-slate-300'}`}>
                    <span className="text-[10px] font-black">{member.recruitment}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Summary */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between pb-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00A758]"></div>
            <span className="text-[10px] font-bold text-slate-500">今日已更新 8 位成员数据</span>
          </div>
          <button className="text-[10px] font-black text-[#00A758] flex items-center gap-1">
            <i className="fa-solid fa-download"></i> 导出明细
          </button>
        </div>
      </div>
    </FullScreenModal>
  );
};

const IncomeDashboard: React.FC<{
  stats: PerformanceStats;
  paidFyc: number;
  renewalFyc: number;
  bonus: number;
  trackedFyc: number;
  isHidden: boolean;
  onPaidClick?: () => void;
  onRenewalClick?: () => void;
  onBonusClick?: () => void;
}> = ({ stats, paidFyc, renewalFyc, bonus, trackedFyc, isHidden, onPaidClick, onRenewalClick, onBonusClick }) => {
  // Calculate potential bonus from tracked policies (assume 10% for visualization)
  const trackedBonus = trackedFyc * 0.1;
  const displayBonus = bonus; // Just the paid bonus for the main display
  const total = paidFyc + renewalFyc + displayBonus;

  const getPercentage = (val: number) => {
    if (total === 0) return '0%';
    return `${((val / total) * 100).toFixed(1)}%`;
  };

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-6 mb-4 space-y-3">
      {/* Treemap Header */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-1 active:opacity-60 transition-opacity group"
      >
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <TrendingUp size={10} className="text-[#00A758]" />
          收入分布构成
          {stats.dailyNewFyc > 0 && !isExpanded && (
             <span className="flex h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          {!isExpanded && (
             <span className="text-[9px] font-bold text-slate-300">占比分析</span>
          )}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100"
          >
            <ChevronDown size={10} className="text-slate-400" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="overflow-hidden"
          >
            {/* treemap Layout */}
            <div className="grid grid-cols-5 grid-rows-2 gap-2 h-44 pb-1">
              {/* Main Block (FYC) */}
              <button 
                onClick={onPaidClick}
                className="col-span-3 row-span-2 rounded-2xl bg-[#D0EBE6] text-[#3B8A7A] p-4 flex flex-col items-center justify-center relative border border-white/40 shadow-sm glass-interaction overflow-hidden active:scale-[0.98] transition-transform text-center group"
              >
                <div className="flex flex-col items-center justify-center -mt-2">
                  <span className="text-[11px] font-black opacity-70 mb-1 tracking-tight uppercase group-hover:text-[#00A758] transition-colors flex items-center gap-1">
                    净FYC发佣
                    <i className="fa-solid fa-chevron-right text-[7px] opacity-40 group-hover:opacity-100 transition-opacity"></i>
                  </span>
                  <AmountDisplay value={paidFyc} isHidden={isHidden} prefix="¥" className="text-[22px] font-black tracking-tighter" />
                  <div className="mt-1.5 px-2 py-0.5 bg-[#3B8A7A]/10 rounded-full">
                    <span className="text-[10px] font-black">{getPercentage(paidFyc)}</span>
                  </div>
                </div>
                
                {/* Tracked FYC Info at bottom right - as per annotation */}
                {trackedFyc > 0 && (
                  <div className="absolute bottom-2 right-2 bg-[#FBE9C6] text-amber-950 px-2 py-1.5 rounded-xl border border-white/40 flex flex-col items-end shadow-sm">
                     <span className="text-[8px] font-black opacity-60 leading-none mb-0.5">正在追踪</span>
                     <AmountDisplay value={trackedFyc} isHidden={isHidden} prefix="¥" className="text-[11px] font-black leading-none" />
                  </div>
                )}
                
                <div className="absolute top-2 left-2 opacity-30">
                   <i className="fa-solid fa-chart-pie text-[9px]"></i>
                </div>
              </button>

              {/* Secondary blocks */}
              <div className="col-span-2 row-span-2 grid grid-rows-2 gap-2">
                {/* RYC Block */}
                <button 
                  onClick={onRenewalClick}
                  className="bg-[#DBEAFE] text-[#1E40AF] rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-xs border border-white/40 relative active:scale-[0.98] transition-transform group"
                >
                  <span className="text-[10px] font-black opacity-80 mb-1 uppercase tracking-tight group-hover:text-blue-700 transition-colors flex items-center gap-1">
                    续佣RYC
                    <i className="fa-solid fa-chevron-right text-[6px] opacity-40 group-hover:opacity-100 transition-opacity"></i>
                  </span>
                  <AmountDisplay value={renewalFyc} isHidden={isHidden} prefix="¥" className="text-sm font-black tracking-tight" />
                  <span className="absolute top-2 right-2 text-[9px] font-black opacity-50">{getPercentage(renewalFyc)}</span>
                </button>
                
                {/* Bonus Block */}
                <button 
                  onClick={onBonusClick}
                  className="bg-[#F4DADA] text-[#C24646] rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-xs border border-white/40 relative overflow-hidden active:scale-[0.98] transition-transform group"
                >
                  <div className="flex flex-col items-center justify-center -mt-2">
                    <span className="text-[10px] font-black opacity-80 mb-1 uppercase tracking-tight group-hover:text-rose-700 transition-colors flex items-center gap-1">
                      奖金
                      <i className="fa-solid fa-chevron-right text-[6px] opacity-40 group-hover:opacity-100 transition-opacity"></i>
                    </span>
                    <AmountDisplay value={displayBonus} isHidden={isHidden} prefix="¥" className="text-sm font-black tracking-tight" />
                    <span className="mt-1 text-[9px] font-black bg-[#C24646]/10 px-1.5 py-0.5 rounded-md self-center">{getPercentage(displayBonus)}</span>
                  </div>

                  {/* Tracked Bonus Info at bottom right - as per annotation */}
                  {trackedBonus > 0 && (
                    <div className="absolute bottom-1 right-1 bg-white/40 backdrop-blur-sm px-1.5 py-1 rounded-lg border border-white/20 flex flex-col items-end">
                      <span className="text-[7px] font-black opacity-70 leading-none">追踪奖金</span>
                      <AmountDisplay value={trackedBonus} isHidden={isHidden} prefix="¥" className="text-[9px] font-black leading-none" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Performance Board Settings Modal ---
const PerformanceBoardSettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  metrics: { id: string; label: string; inFoldArea: boolean }[];
  onChange: (metrics: { id: string; label: string; inFoldArea: boolean }[]) => void;
}> = ({ isOpen, onClose, metrics, onChange }) => {

  // Auto-sort list when modal is opened (putting metrics with inFoldArea === false to the top)
  useEffect(() => {
    if (isOpen) {
      const sorted = [...metrics].sort((a, b) => {
        if (a.inFoldArea !== b.inFoldArea) {
          return a.inFoldArea ? 1 : -1;
        }
        return 0;
      });
      const hasChanged = metrics.some((m, idx) => m.id !== sorted[idx].id || m.inFoldArea !== sorted[idx].inFoldArea);
      if (hasChanged) {
        onChange(sorted);
      }
    }
  }, [isOpen]);

  const handleToggle = (id: string) => {
    const updated = metrics.map(m => m.id === id ? { ...m, inFoldArea: !m.inFoldArea } : m);
    // Sort updated so that not in fold (inFoldArea === false) are at the front
    updated.sort((a, b) => {
      if (a.inFoldArea !== b.inFoldArea) {
        return a.inFoldArea ? 1 : -1;
      }
      return 0;
    });
    onChange(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    // Prevent manual sorting crossing the zone boundary
    if (metrics[index].inFoldArea !== metrics[index - 1].inFoldArea) return;
    const updated = [...metrics];
    const item = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = item;
    onChange(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === metrics.length - 1) return;
    // Prevent manual sorting crossing the zone boundary
    if (metrics[index].inFoldArea !== metrics[index + 1].inFoldArea) return;
    const updated = [...metrics];
    const item = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = item;
    onChange(updated);
  };

  const showAllInPrimary = () => {
    // Turn off 'inFoldArea' for everything (which means they all display in the primary top section)
    const updated = metrics.map(m => ({ ...m, inFoldArea: false }));
    onChange(updated);
  };

  const resetToDefault = () => {
    const defaults = [
      { id: 'issued_fyc', label: '净FYC发佣', inFoldArea: false },
      { id: 'net_issued_fyc', label: '净FYC签发', inFoldArea: true },
      { id: 'ryc', label: '续佣RYC', inFoldArea: false },
      { id: 'policies', label: '净签发件数', inFoldArea: false },
      { id: 'issued_commissionable_fyc', label: '签发可计佣FYC', inFoldArea: false },
      { id: 'issued_commissionable_count', label: '签发可计佣件数', inFoldArea: false },
      { id: 'submitted_policies', label: '递交保单数（件）', inFoldArea: true },
      { id: 'submissions', label: '递交APE', inFoldArea: true },
      { id: 'net_ape', label: '总净APE', inFoldArea: true },
      { id: 'proposal_prints', label: '建议书打印量', inFoldArea: true },
      { id: 'dual_attendance', label: '双考勤出席率', inFoldArea: true },
      { id: 'retention_6m', label: '续保率(6M)', inFoldArea: true },
    ];
    onChange(defaults);
  };

  if (!isOpen) return null;

  const primaryMetrics = metrics.filter(m => !m.inFoldArea);
  const foldedMetrics = metrics.filter(m => m.inFoldArea);

  return (
    <FullScreenModal isOpen={isOpen} onClose={onClose} title="指标看版自定义配置">
      <div className="flex flex-col h-full font-sans bg-slate-50">
        <div className="p-6 bg-white border-b border-slate-100 flex justify-between items-center shrink-0">
          <div>
            <h4 className="text-[15px] font-black text-slate-800">看板指标布局配置</h4>
            <p className="text-[11px] text-slate-400 font-bold mt-0.5">自定控制展示指标及显示排序</p>
          </div>
          <div className="flex gap-3">
            <button
               onClick={showAllInPrimary}
               className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-black border border-slate-200/60 active:scale-95 transition"
            >
              全部展示在首屏
            </button>
            <button
               onClick={resetToDefault}
               className="px-4 py-2 bg-[#00A758] hover:bg-[#00904C] text-white rounded-xl text-xs font-black shadow-sm active:scale-95 transition"
            >
              一键恢复默认
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Primary View Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-black text-slate-600 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-[#00A758] rounded-full inline-block"></span>
                首屏核心展示区 ({primaryMetrics.length})
              </span>
              <span className="text-[10px] text-slate-400 font-bold">指标至少保留1个</span>
            </div>
            <div className="bg-white border border-slate-100 rounded-3xl p-4 divide-y divide-slate-100 child:py-3.5 first:child:pt-0 last:child:pb-0 shadow-sm">
              {primaryMetrics.map((item, idx) => {
                const originalIndex = metrics.findIndex(m => m.id === item.id);
                return (
                  <div key={item.id} className="flex items-center justify-between py-3">
                    <span className="text-[13px] font-bold text-slate-700">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMoveUp(originalIndex)}
                        disabled={idx === 0}
                        className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center disabled:opacity-40"
                      >
                        <i className="fa-solid fa-arrow-up text-xs"></i>
                      </button>
                      <button
                        onClick={() => handleMoveDown(originalIndex)}
                        disabled={idx === primaryMetrics.length - 1}
                        className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center disabled:opacity-40"
                      >
                        <i className="fa-solid fa-arrow-down text-xs"></i>
                      </button>
                      <button
                        onClick={() => handleToggle(item.id)}
                        disabled={primaryMetrics.length <= 1}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 font-black text-xs hover:bg-red-100"
                      >
                        折叠隐藏
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Folded Area */}
          <div className="space-y-3">
            <span className="text-[12px] font-black text-slate-600 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-slate-400 rounded-full inline-block"></span>
              折叠区域指标 ({foldedMetrics.length})
            </span>
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 divide-y divide-slate-100 child:py-3.5 first:child:pt-0 last:child:pb-0">
              {foldedMetrics.length === 0 ? (
                <div className="py-6 text-center text-[12px] text-slate-400 font-bold">
                  无折叠指标，所有指标均展示在首屏
                </div>
              ) : (
                foldedMetrics.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3">
                    <span className="text-[13px] font-medium text-slate-500">{item.label}</span>
                    <button
                      onClick={() => handleToggle(item.id)}
                      className="px-3 py-1.5 rounded-lg bg-green-50 text-[#00A758] font-black text-xs hover:bg-green-100"
                    >
                      取消折叠
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </FullScreenModal>
  );
};


// --- Recruitment Report Modal Component ---
const RecruitmentReportModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  title: string;
  filter: 'direct' | 'district' | 'org'
}> = ({ isOpen, onClose, title, filter }) => {
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Mock data for the report - 8 elements aligned to: 建档, POP, 初面, 深面, 决面, COP (可选), ITC, 入司
  const teamsData = [
    {
      id: 'team1',
      name: '艾中宏',
      code: 'AI00001',
      rank: 'SADM',
      gen: 1,
      data: [2814, 2150, 1637, 1000, 565, 520, 320, 232],
      agents: [
        { name: '王晓辉', code: 'A100102', rank: 'AG', gen: '-', data: [120, 100, 80, 50, 30, 25, 20, 12] },
        { name: '李明', code: 'A100103', rank: 'AG', gen: '-', data: [90, 75, 60, 40, 25, 20, 15, 8] },
      ]
    },
    {
      id: 'team2',
      name: '张建军',
      code: 'AI00002',
      rank: 'BM',
      gen: 1,
      data: [2100, 1600, 1200, 780, 450, 400, 280, 190],
      agents: [
        { name: '陈芳', code: 'A100201', rank: 'AG', gen: '-', data: [150, 120, 95, 65, 40, 35, 30, 22] },
      ]
    }
  ];

  // For direct filter, we just show a list of agents
  const agentsData = [
    { name: '本人', code: 'AI00088', rank: 'SADM', gen: '-', data: [180, 150, 120, 85, 45, 40, 35, 25] },
    { name: '李思思', code: 'A100501', rank: 'AG', gen: '-', data: [110, 90, 75, 45, 30, 26, 22, 15] },
    { name: '周杰伦', code: 'A100502', rank: 'AG', gen: '-', data: [95, 80, 65, 38, 25, 22, 18, 12] },
    { name: '蔡依林', code: 'A100503', rank: 'AG', gen: '-', data: [130, 110, 88, 55, 35, 30, 25, 18] },
  ];

  const headers = ['建档', 'POP', '初面', '深面', '决面', 'COP (可选)', 'ITC', '入司'];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center overflow-hidden"
    >
      <motion.div 
        initial={{ scale: 1, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-[#F8F9FA] w-screen h-screen flex flex-col shadow-2xl relative"
      >
        {/* Header */}
        <div className="bg-[#00A758] px-8 py-5 flex justify-between items-center shrink-0 shadow-lg z-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <i className="fa-solid fa-chart-line text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-white font-black text-xl tracking-tight">招募环节报表 - {title}</h3>
              <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest">Global Recruitment Lifecycle Analysis</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end border-r border-white/20 pr-6">
              <span className="text-[10px] text-white/50 font-black uppercase">Viewing Mode</span>
              <span className="text-white font-bold text-sm tracking-tight">{filter === 'direct' ? '个人/直辖明细' : '主管/辖下汇总'}</span>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 bg-black/10 hover:bg-black/20 text-white rounded-2xl transition-all flex items-center justify-center active:scale-90 border border-white/10"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto bg-white mx-0 rounded-none shadow-inner relative">
          <table className="w-full border-collapse min-w-[1200px]">
            <thead className="sticky top-0 z-30">
              <tr className="bg-[#00A758] shadow-md border-b border-[#00904C]">
                <th className="px-6 py-5 text-left text-[12px] font-black text-white border-r border-[#00904C] w-[220px]">
                  {filter === 'direct' ? '代理人姓名' : '主管姓名'}
                </th>
                <th className="px-4 py-5 text-center text-[12px] font-black text-white border-r border-[#00904C] w-[120px]">职级 <i className="fa-solid fa-caret-down ml-1 opacity-50"></i></th>
                <th className="px-4 py-5 text-center text-[12px] font-black text-white border-r border-[#00904C] w-[120px]">主管代数 <i className="fa-solid fa-caret-down ml-1 opacity-50"></i></th>
                {headers.map((h, i) => (
                  <th key={i} className="px-4 py-5 text-center text-[12px] font-black text-white border-r border-[#00904C] last:border-r-0">
                    {h} <i className="fa-solid fa-caret-down ml-1 opacity-50"></i>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filter === 'direct' ? (
                // Direct agents list
                agentsData.map((agent, idx) => (
                  <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} hover:bg-green-50/30 transition-colors`}>
                    <td className="px-6 py-5 border-r border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#00A758] font-black text-[10px]">
                          {agent.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-[14px] font-black text-slate-800">{agent.name}</div>
                          <div className="text-[10px] text-slate-400 font-bold">{agent.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5 text-center border-r border-slate-100">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[11px] font-black">{agent.rank}</span>
                    </td>
                    <td className="px-4 py-5 text-center border-r border-slate-100">
                      <span className="text-slate-400 font-bold text-[13px]">{agent.gen}</span>
                    </td>
                    {agent.data.map((val, k) => (
                      <td key={k} className="px-4 py-5 text-center border-r border-slate-100 last:border-r-0 font-bold text-slate-700 tabular-nums text-lg">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                // Grouped teams list
                teamsData.map((team, idx) => (
                  <React.Fragment key={team.id}>
                    <tr className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} border-b border-slate-100 hover:bg-green-50/20 transition-colors group`}>
                      <td className="px-6 py-5 border-r border-slate-100">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setExpandedTeamId(expandedTeamId === team.id ? null : team.id)}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all ${
                              expandedTeamId === team.id ? 'border-[#00A758] bg-green-50 text-[#00A758] rotate-90 scale-110 shadow-sm' : 'border-slate-200 text-slate-400 hover:border-[#00A758] hover:text-[#00A758]'
                            }`}
                          >
                            <i className="fa-solid fa-chevron-right text-[12px]"></i>
                          </button>
                          <div>
                            <div className="text-[14px] font-black text-[#00A758] mb-0.5">{team.name}</div>
                            <div className="text-[10px] text-slate-400 font-bold">{team.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5 text-center border-r border-slate-100">
                        <span className="bg-green-50 text-[#00A758] border border-green-100 px-3 py-1 rounded-lg text-[11px] font-black">{team.rank}</span>
                      </td>
                      <td className="px-4 py-5 text-center border-r border-slate-100">
                        <span className="text-slate-600 font-bold text-[14px]">{team.gen}</span>
                      </td>
                      {team.data.map((val, k) => (
                        <td key={k} className="px-4 py-5 text-center border-r border-slate-100 last:border-r-0 font-black text-[#1e293b] tabular-nums text-lg">
                          {val}
                        </td>
                      ))}
                    </tr>

                    {/* Team Members Detail */}
                    {expandedTeamId === team.id && team.agents.map((agent, aIdx) => (
                      <tr key={`${team.id}-agent-${aIdx}`} className="bg-slate-50/50 border-b border-slate-100 shadow-inner">
                        <td className="pl-20 pr-6 py-4 border-r border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 rounded-full bg-[#00A758]/30"></div>
                            <div>
                              <div className="text-[13px] font-bold text-slate-600">{agent.name}</div>
                              <div className="text-[10px] text-slate-400 font-bold">{agent.code}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center border-r border-slate-100 opacity-60">
                          <span className="text-[11px] font-black text-slate-500">{agent.rank}</span>
                        </td>
                        <td className="px-4 py-4 text-center border-r border-slate-100 opacity-60">
                          <span className="text-[13px] font-bold text-slate-400">{agent.gen}</span>
                        </td>
                        {agent.data.map((val, k) => (
                          <td key={k} className="px-4 py-4 text-center border-r border-slate-100 last:border-r-0 text-slate-500 tabular-nums text-[13px]">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-8 py-4 bg-[#F8F9FA] border-t border-slate-200 flex justify-between items-center shrink-0 z-20">
          <div className="flex gap-8">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#00A758] shadow-sm"></span>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Manager Pool</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-slate-300 shadow-sm"></span>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Agent Detail</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200">
              <i className="fa-solid fa-database text-[#00A758]"></i>
              Real-time Analysis Engine v2.4
            </div>
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-2">
              <i className="fa-solid fa-clock"></i>
              {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Indicator Definition Modal Component ---
const IndicatorDefinitionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<'business' | 'manpower' | 'persistency' | 'org'>('business');

  if (!isOpen) return null;

  const indicators = {
    business: [
      { name: '年化新单保费（APE）', definition: '年缴保单APE为首年保费；月缴保单、季缴保单：按照月度每期保费或季度每期保费折算为年化保费；趸交保单：按照保费的10%计APE。' },
      { name: '首年佣金（FYC 签发）', definition: '首年佣金FYC = 寿险首年佣金FYC（含附加险）+意外险首年佣金FYC（含附加险）+团险首年佣金FYC' },
      { name: '首年佣金（FYC 发佣）', definition: '过犹豫期的保单"首年佣金FYC"（于该月份佣金奖金结算日前过犹豫期且完成回访与双录质检合格等发佣条件的"首年佣金FYC"计入当月，以此类推）；并遵循当地监管包括但不限于"自保件""互保件""亲属件"及保单"双录"等的要求。' },
      { name: '件数', definition: '保单的数量，一个保单号计一件，除去撤保保单件数。' },
      { name: '净寿险保单件数（签发）', definition: '当月新签发寿险保单件数扣除当月发生的撤保保单件数，一件团体保险保单可折算为一件寿险保单，意外险保单不折算为寿险保单，寿险保单及团体保险保单须符合公司最低计件业绩标准。' },
      { name: '活动率', definition: '当月净寿险保单件数（签发）大于等于1件的营销员人数/当月系统人力' },
      { name: '活动人均件数', definition: '活动人力总净寿险保单件数/出单人力' },
      { name: '活动人均APE', definition: '活动人力总APE/出单人力' },
      { name: '件均APE', definition: '总APE/净寿险保单件数' },
      { name: '人均建议书打印量', definition: '总建议书打印量/系统人力' },
      { name: '签发可计佣FYC', definition: '首年佣金(FYC发佣)+未满足发佣条件的首年佣金(FYC签发)\n说明：此数据主要用于业绩追踪，仅供参考；首年佣金FYC计奖规则详见营销员报酬准则' },
      { name: '签发可计佣件数', definition: '满足发佣条件的件数+未满足发佣条件的净签发件数\n说明：此数据主要用于业绩追踪，仅供参考；件数计奖规则详见营销员报酬准则' },
      { name: '续佣RYC', definition: '续佣RYC（Renewal Year Commission，续期年度佣金）' },
    ],
    manpower: [
      { name: '系统人力', definition: '在职的营销员人力' },
      { name: '直招人力', definition: '直接推荐招募的人力' },
      { name: '增员', definition: '当月新招募的营销员人数' },
      { name: '宏人力人次', definition: '营销员当月个人FYC≥3000，则当月计为"宏人力"1人次；营销员当月个人FYC[1500,3000)，则当月计为"宏人力"0.5人次。' },
      { name: '出席率', definition: '本月累计出勤次数/本月计勤天数' },
      { name: '主管数', definition: '职级为EDD,SDD,DD,SDM,DM，SADM,ADM,SUM,UM的营销员' },
      { name: '辖下主管数', definition: '业务主管与其所建立的团队中所有主管的数量，不含主管本人。' },
      { name: '出单人力', definition: '当月净寿险保单件数大于等于1件的在职营销员人数' },
      { name: '3M0', definition: '连续3个月净寿险保单件数<1的人数' },
    ],
    persistency: [
      { 
        name: '13个月寿险保单保费续保率-滚动6个月/滚动12个月', 
        formula: '(统计期内生效之年缴寿险保单实收第二保单年度保费总和+统计期内生效之月缴保单实收第一、第二年度保单保费总和)/(统计期内生效之年缴寿险保单实收第一保单年度保费总和+统计期内生效之月缴保单应收第一、第二年度保单保费总和) x 100%',
        notes: [
          '年缴/月缴：以保单首次生效时的缴费方式认定',
          '统计期 (滚动6个月)：考核月往前第14个月至第19个月',
          '统计期 (滚动12个月)：考核月往前第14个月至第25个月',
          '保单统计范围：主险保单生效第14个月保单状态为“缴费期内”“失效”“合同退保”“减额缴清”的期缴寿险保单。不含趸缴寿险、意外险、投连险、万能险、团体保险、网销保单。',
          '实收保费：指实收主险（含附加险）保费，不含“中宏自动增额权益 (IPO)”以及自动贷款垫缴保费产生的保费。',
          '应收保费：指月缴保单首次生效时的月缴保费金额 x 保单统计时月缴保单应收保费月数。月缴保费计算规则根据运营规则适时调整，目前计算规则为：月缴保费=年缴保费x0.09',
          '特别说明：月缴保单如单张保单实收保费大于应收保费，则此单实收保费将按应收保费计入续保率核算。',
        ]
      },
    ],
    org: [
      { name: '直辖工作室', definition: '是指由业务主管及其直辖职级为FC的保险营销员组成的营业单位。' },
      { name: '营业区', definition: '是指职级为助理区经理(ADM) 及以上的业务主管所辖团队中扣除其直接或间接育成之高级助理区经理(SADM) 及以上职级业务主管团队后的营业单位。' },
      { name: '所辖团队', definition: '是指由业务主管及所有与其具有所辖关系的保险营销员组成的营业单位。' },
    ]
  };

  const categories = [
    { id: 'business', name: '业务', icon: 'fa-chart-line' },
    { id: 'manpower', name: '人力', icon: 'fa-users' },
    { id: 'persistency', name: '续保率', icon: 'fa-arrows-rotate' },
    { id: 'org', name: '组织架构', icon: 'fa-sitemap' },
  ];

  return (
    <FullScreenModal isOpen={isOpen} onClose={onClose} title="指标定义">
      <div className="flex flex-col h-full font-sans bg-slate-50">
        {/* Category Tabs */}
        <div className="bg-white border-b border-slate-100 flex overflow-x-auto no-scrollbar px-2 sticky top-0 z-10">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as 'business' | 'manpower' | 'persistency' | 'org')}
              className={`flex-none px-4 py-3 text-xs font-black transition-all relative ${
                activeCategory === cat.id ? 'text-[#00A758]' : 'text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <i className={`fa-solid ${cat.icon}`}></i>
                {cat.name}
              </div>
              {activeCategory === cat.id && (
                <motion.div 
                  layoutId="indicatorTab" 
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#00A758] rounded-full" 
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-10">
          {activeCategory === 'persistency' ? (
            indicators.persistency.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3.5 bg-[#00A758] rounded-full"></div>
                  <h4 className="text-[13px] font-black text-slate-800 leading-tight">{item.name}</h4>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[11px] text-slate-600 font-bold leading-relaxed">{item.formula}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">说明</p>
                  <ul className="space-y-2">
                    {item.notes.map((note, nIdx) => (
                      <li key={nIdx} className="flex gap-2">
                        <span className="text-[#00A758] text-[8px] mt-1">•</span>
                        <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{note}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            (indicators as any)[activeCategory].map((item: any, idx: number) => (
              <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3.5 bg-[#00A758] rounded-full"></div>
                  <h4 className="text-[13px] font-black text-slate-800 leading-tight">{item.name}</h4>
                </div>
                <div className="text-[11px] text-slate-500 font-bold leading-relaxed pl-3 whitespace-pre-line">{item.definition}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </FullScreenModal>
  );
};

const RetentionTooltip: React.FC<{
  type: '6M' | '12M';
  onClose: () => void;
}> = ({ type, onClose }) => {
  const content = type === '6M' 
    ? '13个月寿险保单保费续保率（滚动6个月）'
    : '13个月寿险保单保费续保率（滚动12个月）';
    
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 bg-slate-900/95 backdrop-blur-sm text-white p-3 rounded-2xl text-[10px] font-bold shadow-2xl z-[100] border border-slate-700/50 pointer-events-auto leading-relaxed"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div className="flex items-start gap-2">
        <i className="fa-solid fa-circle-info text-teal-400 mt-0.5"></i>
        <span>{content}</span>
      </div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900/95"></div>
    </motion.div>
  );
};

// --- Recruitment Report Modal Component ---
// --- Recruitment Dashboard Component ---
const RecruitmentDashboard: React.FC<{
  filter: 'direct' | 'district' | 'org';
  onOpenDetails: () => void;
}> = ({ filter, onOpenDetails }) => {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'half' | 'year' | 'custom'>('month');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const getMultiplier = () => {
    let base = 1.0;
    if (filter === 'district') base = 4.5;
    if (filter === 'org') base = 12.0;
    
    // Adjust by time range
    const rangeMult = timeRange === 'quarter' ? 3 : timeRange === 'half' ? 6 : timeRange === 'year' ? 12 : 1;
    return base * rangeMult;
  };

  const m = getMultiplier();
  const actualData = [
    { label: '人才库', value: Math.round(48 * m) },
    { label: 'POP测评', value: Math.round(32 * m) },
    { label: 'POP', value: Math.round(26 * m) },
    { label: '初面', value: Math.round(20 * m) },
    { label: '决定面试', value: Math.round(16 * m) },
    { label: 'ITC', value: Math.round(12 * m) },
    { label: '入司', value: Math.round(10 * m) },
  ];

  const filterLabels = {
    'direct': '直辖组',
    'district': '营业区',
    'org': '所辖'
  };

  const rangeLabels = {
    'month': '本月',
    'quarter': '当季',
    'half': '半年',
    'year': '年度',
    'custom': '自定义'
  };

  const actualHired = actualData[6].value;
  const targetCompleted = Math.round(10 * m);
  const hireRate = Math.round((actualHired / targetCompleted) * 100) || 0;

  return (
    <div id="team-recruitment" className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-5">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-slate-800 text-xs font-bold flex items-center gap-2 tracking-wide">
            <i className="fa-solid fa-user-plus text-[#00A758]"></i>招募看板
          </h2>
          <button
            type="button"
            onClick={onOpenDetails}
            className="text-[10px] font-black text-[#00A758] bg-green-50 hover:bg-green-100 px-2.5 py-0.5 rounded border border-green-100 shadow-3xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer select-none"
            id="recruitment-details-btn"
          >
            详情
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Time Range Filter (Hidden by default) */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 flex-shrink-0">
                  {[
                    { id: 'month', label: '当月' },
                    { id: 'quarter', label: '当季' },
                    { id: 'half', label: '半年' },
                    { id: 'year', label: '一年' },
                  ].map(range => (
                    <button
                      key={range.id}
                      onClick={() => setTimeRange(range.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                        timeRange === range.id ? 'bg-white text-[#00A758] shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setTimeRange('custom')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-1 ${
                      timeRange === 'custom' ? 'bg-white text-[#00A758] shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <i className="fa-solid fa-calendar-days text-[8px]"></i>
                    自定义
                  </button>
                </div>
                
                {timeRange === 'custom' && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 flex-shrink-0"
                  >
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1">
                      <input 
                        type="date" 
                        className="text-[9px] font-bold text-slate-600 focus:outline-none"
                        value={customRange.start}
                        onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                      />
                      <span className="text-slate-300">-</span>
                      <input 
                        type="date" 
                        className="text-[9px] font-bold text-slate-600 focus:outline-none"
                        value={customRange.end}
                        onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 招募目标 & 达成情况 核心视图 */}
      <div className="bg-slate-50/80 border border-slate-100/70 rounded-xl p-4 space-y-4 shadow-inner">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00A758]"></div>
            <span className="text-[11px] font-black text-slate-700 tracking-wider">
              {filterLabels[filter]} • {rangeLabels[timeRange] || '本月'} 招募进度评估
            </span>
          </div>
          <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full ${
            actualHired >= targetCompleted ? 'bg-[#F1F9F3] text-[#00A758] border border-[#B8E0C6]' : 'bg-amber-50 text-[#F49600] border border-amber-200'
          }`}>
            {actualHired >= targetCompleted ? '进度正常' : '⏳ 正在全力推进'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Card 1: Target */}
          <div className="bg-white p-3 rounded-lg border border-slate-100 flex flex-col justify-between shadow-xs">
            <span className="text-[9px] text-[#8E90A2] font-bold">招募总目标</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-slate-800">{targetCompleted}</span>
              <span className="text-[9px] font-bold text-[#8E90A2]">人</span>
            </div>
          </div>

          {/* Card 2: Actual */}
          <div className="bg-white p-3 rounded-lg border border-slate-100 flex flex-col justify-between shadow-xs">
            <span className="text-[9px] text-[#8E90A2] font-bold">已入司达成</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-[#00A758]">{actualHired}</span>
              <span className="text-[9px] font-bold text-[#00A758]">人</span>
            </div>
          </div>

          {/* Card 3: Completion Rate */}
          <div className="bg-white p-3 rounded-lg border border-slate-100 flex flex-col justify-between shadow-xs">
            <span className="text-[9px] text-[#8E90A2] font-bold">整体达成率</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-indigo-600">{hireRate}%</span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isReportOpen && (
          <RecruitmentReportModal 
            isOpen={isReportOpen}
            onClose={() => setIsReportOpen(false)}
            title={filterLabels[filter]}
            filter={filter}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Customer Management Dashboard Component ---
const CustomerManagementDashboard: React.FC<{ filter: 'direct' | 'district' | 'org' }> = ({ filter }) => {
  const getMultiplier = () => {
    if (filter === 'district') return 4.5;
    if (filter === 'org') return 12.0;
    return 1.0;
  };

  const m = getMultiplier();
  const data = [
    { label: '分配客户', value: Math.round(120 * m) },
    { label: '约访', value: Math.round(85 * m) },
    { label: '面谈', value: Math.round(42 * m) },
    { label: '计划书', value: Math.round(28 * m) },
    { label: '签发', value: Math.round(15 * m) },
  ];

  return (
    <div id="team-customers" className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-slate-800 text-xs font-bold flex items-center gap-2 tracking-wide">
          <i className="fa-solid fa-briefcase text-[#00A758]"></i>客户经营看板
        </h2>
      </div>

      <div className="grid grid-cols-5 gap-y-6 relative">
        {data.map((item, i) => (
          <div key={i} className={`flex flex-col items-center py-2 relative ${(i !== data.length - 1) ? 'border-r border-slate-100' : ''}`}>
            <div className="flex flex-col items-center text-center">
              <span className="text-lg font-black text-slate-800 leading-none mb-1">{item.value}</span>
              <span className="text-[10px] text-slate-400 font-bold">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Team Quick Navigation Component ---
const TeamQuickNav: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const resetTimer = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsCollapsed(true), 4000);
  }, []);

  React.useEffect(() => {
    if (!isCollapsed) {
      resetTimer();
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [isCollapsed, resetTimer]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 130; // Accounting for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      resetTimer();
    }
  };

  const navs = [
    { id: 'team-results', label: '业绩', icon: 'fa-chart-pie' },
    { id: 'team-manpower', label: '人力', icon: 'fa-users' },
    { id: 'team-recruitment', label: '招募', icon: 'fa-user-plus' },
    { id: 'team-customers', label: '经营', icon: 'fa-briefcase' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ 
        opacity: 1, 
        x: isCollapsed ? 42 : 0,
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 150 }}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-[60] flex items-center"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-5 h-12 bg-white/90 backdrop-blur-md border border-slate-200 border-r-0 rounded-l-xl shadow-lg flex items-center justify-center group active:scale-95 transition-all"
      >
        <i className={`fa-solid ${isCollapsed ? 'fa-chevron-left' : 'fa-chevron-right'} text-[10px] text-slate-400 group-hover:text-[#00A758]`}></i>
      </button>

      {/* Nav Content */}
      <div className="flex flex-col gap-2 p-2 bg-white/90 backdrop-blur-md rounded-l-2xl border border-slate-200 shadow-xl ring-1 ring-slate-100">
        {navs.map((nav) => (
          <button
            key={nav.id}
            onClick={() => scrollTo(nav.id)}
            className="w-10 h-10 flex flex-col items-center justify-center rounded-xl hover:bg-green-50 transition-all group active:scale-90"
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-50 group-hover:bg-white transition-colors">
              <i className={`fa-solid ${nav.icon} text-xs text-slate-400 group-hover:text-[#00A758]`}></i>
            </div>
            <span className="text-[8px] font-black text-slate-500 group-hover:text-[#00A758] mt-1 uppercase tracking-tighter">{nav.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

// --- Recruitment Funnel Component ---
const RecruitmentFunnel: React.FC<{ filter: 'direct' | 'district' | 'org' }> = ({ filter }) => {
  const getMultiplier = () => {
    if (filter === 'district') return 1.5;
    if (filter === 'org') return 3.5; // Increased since it includes district
    return 1.0;
  };

  const m = getMultiplier();
  const funnelSteps = [
    { label: '名单获取', value: Math.round(120 * m), rate: '100%', color: 'bg-blue-600' },
    { label: '面谈/约见', value: Math.round(72 * m), rate: '60%', color: 'bg-blue-500' },
    { label: '事业说明会(COP)', value: Math.round(43 * m), rate: '59%', color: 'bg-blue-400' },
    { label: '初试', value: Math.round(25 * m), rate: '58%', color: 'bg-indigo-400' },
    { label: '复试', value: Math.round(15 * m), rate: '60%', color: 'bg-indigo-500' },
    { label: '入职签约', value: Math.round(10 * m), rate: '66%', color: 'bg-[#00A758]' },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-xs">
            <i className="fa-solid fa-filter"></i>
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">招募跟踪漏斗</h4>
            <p className="text-[9px] text-slate-400 font-bold tracking-tight">本月累计追踪进度</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
            转化效率: 优
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2 relative">
        {funnelSteps.map((step, idx) => {
          const width = 100 - (idx * 8); // Taper effect
          return (
            <div key={idx} className="relative flex items-center group">
              <div className="w-24 text-right pr-4">
                <span className="text-[10px] font-bold text-slate-400">{step.label}</span>
              </div>
              <div className="flex-1 flex items-center gap-3">
                <div 
                  className={`h-8 ${step.color} rounded-sm flex items-center justify-center transition-all duration-1000 origin-left shadow-sm relative overflow-hidden`}
                  style={{ width: `${width}%` }}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-[10px] font-black text-white">{step.value}人</span>
                </div>
                <div className="flex flex-col items-start leading-none gap-0.5">
                  <span className="text-[10px] font-black text-slate-800">{step.rate}</span>
                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">转化率</span>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Connecting lines for visual funnel */}
        <div className="absolute left-24 top-0 bottom-0 w-px bg-slate-100 -z-10"></div>
      </div>

      <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-3">
        <h5 className="text-[11px] font-black text-slate-700 flex items-center gap-1.5">
          <i className="fa-solid fa-wand-magic-sparkles text-amber-500"></i>
          招募策略优化建议
        </h5>
        <ul className="space-y-2">
          <li className="flex gap-2">
            <span className="text-[#00A758] mt-0.5">•</span>
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed">事业说明会到初试的转化率为 <span className="text-slate-800">58%</span>，略低于职场平均水平(65%)，建议加强COP后的现场面谈跟进。</p>
          </li>
          <li className="flex gap-2">
            <span className="text-[#00A758] mt-0.5">•</span>
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed">本月高活名单充足(120人)，建议加大面谈邀约力度，提升面谈率至70%以上。</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>(ViewType.PERSONAL);
  
  // Salary month configuration
  const today = useMemo(() => {
    const d = new Date();
    // Simulate being on the 10th of the month to enable last month selection
    return new Date(d.getFullYear(), d.getMonth(), 10);
  }, []);
  const currentMonthStr = useMemo(() => `${today.getFullYear()}年${today.getMonth() + 1}月`, [today]);
  const lastMonthDate = useMemo(() => new Date(today.getFullYear(), today.getMonth() - 1, 1), [today]);
  const lastMonthStr = useMemo(() => `${lastMonthDate.getFullYear()}年${lastMonthDate.getMonth() + 1}月`, [lastMonthDate]);
  const canSelectLastMonth = today.getDate() <= 15;

  const syncTimeStr = useMemo(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const minutes = d.getMinutes();
    const roundedMinutes = Math.floor(minutes / 10) * 10;
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(roundedMinutes)}`;
  }, []);

  const [salaryMonth, setSalaryMonth] = useState('custom');
  const [customStartDate, setCustomStartDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  });
  const [customEndDate, setCustomEndDate] = useState(() => {
    const d = new Date();
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(Math.min(d.getDate(), lastDay)).padStart(2, '0')}`;
  });
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
  
  const [teamFilter, setTeamFilter] = useState<'direct' | 'district' | 'org'>('direct');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [rankingModalOpen, setRankingModalOpen] = useState(false);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  // 出席弹窗打开时的分桶预筛选（点击出席分布卡片时设置）
  const [attendanceInitialBucket, setAttendanceInitialBucket] = useState<'all' | '80plus' | '50to79' | 'under50'>('all');
  const [basicLawModalOpen, setBasicLawModalOpen] = useState(false);
  const [growthModalOpen, setGrowthModalOpen] = useState(false);
  const [honorModalOpen, setHonorModalOpen] = useState(false);
  const [recruitmentModalOpen, setRecruitmentModalOpen] = useState(false);
  const [recruitmentTab, setRecruitmentTab] = useState<'individual' | 'team'>('individual');
  const [starDiamondModalOpen, setStarDiamondModalOpen] = useState(false);
  const [subsidyModalOpen, setSubsidyModalOpen] = useState(false);
  const [trainingModalOpen, setTrainingModalOpen] = useState(false);
  const [teamDetailModalOpen, setTeamDetailModalOpen] = useState(false);
  const [badgeWallModalOpen, setBadgeWallModalOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);
  const [retentionModalOpen, setRetentionModalOpen] = useState(false);
  const [indicatorModalOpen, setIndicatorModalOpen] = useState(false);
  const [performancePage, setPerformancePage] = useState<'fyc' | 'ape' | 'retention'>('fyc');
  const [issuedCommissionableModalOpen, setIssuedCommissionableModalOpen] = useState(false);
  const [hongyunZoneModalOpen, setHongyunZoneModalOpen] = useState(false);

  const [boardMetrics, setBoardMetrics] = useState<{ id: string; label: string; inFoldArea: boolean }[]>(() => {
    const defaults = [
      { id: 'issued_fyc', label: '净FYC发佣', inFoldArea: false },
      { id: 'net_issued_fyc', label: '净FYC签发', inFoldArea: true },
      { id: 'ryc', label: '续佣RYC', inFoldArea: false },
      { id: 'policies', label: '净签发件数', inFoldArea: false },
      { id: 'issued_commissionable_fyc', label: '签发可计佣FYC', inFoldArea: false },
      { id: 'issued_commissionable_count', label: '签发可计佣件数', inFoldArea: false },
      { id: 'submitted_policies', label: '递交保单数（件）', inFoldArea: true },
      { id: 'submissions', label: '递交APE', inFoldArea: true },
      { id: 'net_ape', label: '总净APE', inFoldArea: true },
      { id: 'proposal_prints', label: '建议书打印量', inFoldArea: true },
      { id: 'dual_attendance', label: '双考勤出席率', inFoldArea: true },
      { id: 'retention_6m', label: '续保率(6M)', inFoldArea: true },
      { id: 'retention_12m', label: '续保率(12M)', inFoldArea: true },
      { id: 'attendance', label: '出席率（单考勤）', inFoldArea: true },
      { id: 'direct_recruits', label: '直招人力', inFoldArea: true },
      { id: 'retention_3m0', label: '3M0', inFoldArea: true },
      { id: 'submitted_active_agents', label: '递交出单人力', inFoldArea: true },
      { id: 'net_active_agents', label: '净出单人力', inFoldArea: true },
    ];

    // Try to load v2 configuration
    const savedV2 = localStorage.getItem('board_metrics_config_v2');
    if (savedV2) {
      try {
        const parsed = JSON.parse(savedV2);
        if (Array.isArray(parsed) && parsed.length > 0 && 'inFoldArea' in parsed[0]) {
          const list = parsed.filter((m: any) => m.id !== 'est_income');
          // Add any missing defaults
          defaults.forEach(d => {
            if (!list.some((m: any) => m.id === d.id)) {
              list.push(d);
            }
          });
          return list;
        }
      } catch (e) {
        // ignore
      }
    }

    // Try to migrate from v1 (which used 'visible')
    const savedV1 = localStorage.getItem('board_metrics_config');
    if (savedV1) {
      try {
        const parsed = JSON.parse(savedV1);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const primaryIds = ['issued_fyc', 'ryc', 'policies'];
          const list = parsed
            .filter((m: any) => m.id !== 'est_income')
            .map((m: any) => ({
              id: m.id,
              label: m.label,
              inFoldArea: m.inFoldArea !== undefined ? m.inFoldArea : !primaryIds.includes(m.id)
            }));
          // Add any missing defaults
          defaults.forEach(d => {
            if (!list.some((m: any) => m.id === d.id)) {
              list.push(d);
            }
          });
          return list;
        }
      } catch (e) {
        // ignore
      }
    }

    // Default configuration: top 3 are primary (not in fold), rest are in fold
    return defaults;
  });
  const [boardSettingsOpen, setBoardSettingsOpen] = useState(false);
  const [isBoardFolded, setIsBoardFolded] = useState(true);

  useEffect(() => {
    localStorage.setItem('board_metrics_config_v2', JSON.stringify(boardMetrics));
  }, [boardMetrics]);

  const [isAutoFlipping, setIsAutoFlipping] = useState(true);
  const [retentionTip, setRetentionTip] = useState<'6M' | '12M' | null>(null);
  const [isAmountHidden, setIsAmountHidden] = useState(false);
  const [isUnpaidFycHidden, setIsUnpaidFycHidden] = useState(false);
  const [isDashboardHidden, setIsDashboardHidden] = useState(false);
  const [trackedPolicyNos, setTrackedPolicyNos] = useState<string[]>([]);
  const [selectedFycType, setSelectedFycType] = useState<'paid' | 'unpaid' | 'renewal' | 'net_issued_fyc' | null>(null);
  const [hasSeenNewPaid, setHasSeenNewPaid] = useState(false);
  const [hasSeenNewUnpaid, setHasSeenNewUnpaid] = useState(false);

  const earnedHonors = [
    { id: 'mdrt', icon: 'fa-ribbon', color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { id: 'elite', icon: 'fa-medal', color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'star', icon: 'fa-certificate', color: 'text-[#00A758]', bg: 'bg-green-50' },
    { id: 'master', icon: 'fa-award', color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const stats = useMemo(() => {
    const baseStats = view === ViewType.PERSONAL ? MOCK_PERSONAL_STATS : MOCK_TEAM_STATS;
    if (salaryMonth === 'custom') {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      const ratio = diffDays / 30;
      return {
        ...baseStats,
        ape: Math.round(baseStats.ape * ratio),
        paidFyc: Math.round(baseStats.paidFyc * ratio),
        unpaidFyc: Math.round(baseStats.unpaidFyc * ratio),
        policyCount: Math.max(1, Math.round(baseStats.policyCount * ratio)),
        bonusIncome: Math.round(baseStats.bonusIncome * ratio),
        renewalCommission: Math.round(baseStats.renewalCommission * ratio)
      };
    }
    if (salaryMonth === lastMonthStr) {
      // Mock different data for last month
      return {
        ...baseStats,
        ape: Math.round(baseStats.ape * 0.92),
        paidFyc: Math.round(baseStats.paidFyc * 0.88),
        unpaidFyc: Math.round(baseStats.unpaidFyc * 1.15),
        policyCount: Math.max(1, baseStats.policyCount - 2),
        bonusIncome: Math.round(baseStats.bonusIncome * 0.75),
        renewalCommission: Math.round(baseStats.renewalCommission * 1.05)
      };
    }
    return baseStats;
  }, [view, salaryMonth, lastMonthStr, customStartDate, customEndDate]);

  // Calculate tracked amount from unpaid policies
  const trackedAmount = useMemo(() => {
    return MOCK_POLICIES
      .filter(p => p.fycType === 'unpaid' && trackedPolicyNos.includes(p.policyNo))
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [trackedPolicyNos]);

  // 排除“已签未计佣”部分，仅计算已计佣、续佣和奖金
  const totalIncome = stats.paidFyc + (stats.renewalCommission || 0) + (stats.bonusIncome || 0) + (view === ViewType.PERSONAL ? trackedAmount : 0);

  // 团队业绩数值随选择的月份跨度缩放
  const teamTimeMultiplier = useMemo(() => {
    const start = new Date(customStartDate);
    const end = new Date(customEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    return Math.max(0.1, diffDays / 30);
  }, [customStartDate, customEndDate]);

  // 团队出席率分布统计（按当前团队范围过滤）
  const mainStats = useMemo(() => {
    const mainScopeActivity = ALL_TEAM_ACTIVITY.filter(item => {
      if (teamFilter === 'district') return item.scope === 'direct' || item.scope === 'district';
      if (teamFilter === 'org') return true;
      return item.scope === 'direct';
    });
    const total = mainScopeActivity.length;
    const bucket80Plus = mainScopeActivity.filter(i => i.attendanceRate >= 80);
    const bucket50To80 = mainScopeActivity.filter(i => i.attendanceRate >= 50 && i.attendanceRate < 80);
    const bucketUnder50 = mainScopeActivity.filter(i => i.attendanceRate > 0 && i.attendanceRate < 50);
    const bucketZero = mainScopeActivity.filter(i => i.attendanceRate === 0);

    return {
      total,
      bucket80Plus: { count: bucket80Plus.length, rate: total > 0 ? Math.round((bucket80Plus.length / total) * 100) : 0 },
      bucket50To80: { count: bucket50To80.length, rate: total > 0 ? Math.round((bucket50To80.length / total) * 100) : 0 },
      bucketUnder50: { count: bucketUnder50.length, rate: total > 0 ? Math.round((bucketUnder50.length / total) * 100) : 0 },
      bucketZero: { count: bucketZero.length, rate: total > 0 ? Math.round((bucketZero.length / total) * 100) : 0 },
    };
  }, [teamFilter]);

  const activePage = view === ViewType.PERSONAL ? 'fyc' : performancePage;

  const handleToggleTrack = (policyNo: string) => {
    setTrackedPolicyNos(prev => 
      prev.includes(policyNo) 
        ? prev.filter(id => id !== policyNo) 
        : [...prev, policyNo]
    );
  };

  const handleModuleClick = (label: string, bucketFilter?: 'all' | '80plus' | '50to79' | 'under50') => {
    if (label === '出席管理') {
      setAttendanceInitialBucket(bucketFilter || 'all');
      setAttendanceModalOpen(true);
    }
    else if (label === '基本法') setBasicLawModalOpen(true);
    else if (label === '个人成长轨迹') setGrowthModalOpen(true);
    else if (label === '我的团队') setTeamDetailModalOpen(true);
    else if (label === '活动量管理') setActivityModalOpen(true);
    else if (label === '晋升') setPromotionModalOpen(true);
    else if (label === '荣誉') setHonorModalOpen(true);
    else if (label === '星钻') setStarDiamondModalOpen(true);
    else if (label === '招募管理') setRecruitmentModalOpen(true);
    else if (label === '财补') setSubsidyModalOpen(true);
    else if (label === '培训管理') setTrainingModalOpen(true);
    else if (label === '留任') setRetentionModalOpen(true);
  };

  const openPaidDetail = () => {
    setSelectedFycType('paid');
    setDetailModalOpen(true);
    setHasSeenNewPaid(true);
  };

  const openUnpaidDetail = () => {
    setSelectedFycType('unpaid');
    setDetailModalOpen(true);
    setHasSeenNewUnpaid(true);
  };

  const openNetIssuedFycDetail = () => {
    setSelectedFycType('net_issued_fyc');
    setDetailModalOpen(true);
    setHasSeenNewUnpaid(true);
  };

  const openIssuedCommissionableDetail = () => {
    setIssuedCommissionableModalOpen(true);
    setHasSeenNewPaid(true);
  };

  const openRenewalDetail = () => {
    setSelectedFycType('renewal');
    setDetailModalOpen(true);
  };

  // Auto-flipping performance dashboard pages logic
  useEffect(() => {
    if (view !== ViewType.TEAM || !isAutoFlipping) return;

    const interval = setInterval(() => {
      setPerformancePage((current) => {
        if (current === 'fyc') return 'ape';
        if (current === 'ape') return 'retention';
        return 'fyc';
      });
    }, 5000); // Shift every 5 seconds

    return () => clearInterval(interval);
  }, [view, isAutoFlipping]);

  // Define nav items for center button expansion
  const navItems = [
    { icon: 'fa-house', label: '成长首页', color: 'text-[#00A758] bg-green-50' },
    { icon: 'fa-scroll', label: '基本法', color: 'text-blue-600 bg-blue-50' },
    { icon: 'fa-gem', label: '星钻', color: 'text-cyan-600 bg-cyan-50' },
    { icon: 'fa-sack-dollar', label: '财补', color: 'text-amber-600 bg-amber-50' },
    { icon: 'fa-trophy', label: '荣誉', color: 'text-[#00A758] bg-green-50' },
    { icon: 'fa-arrow-up-right-dots', label: '晋升', color: 'text-purple-600 bg-purple-50' },
    { icon: 'fa-shield-heart', label: '留任', color: 'text-teal-600 bg-teal-50' },
    { icon: 'fa-trophy', label: '竞赛', color: 'text-rose-600 bg-rose-50' },
    { icon: 'fa-wallet', label: '我的收入', color: 'text-[#00A758] bg-green-50' },
    { icon: '', label: '宏运特区/独立区', color: 'text-[#00A758] bg-green-50', special: true },
  ];

  const handleNavClick = (label: string) => {
    if (label === '成长首页') {
      setView(ViewType.PERSONAL);
      setRankingModalOpen(false);
      setDetailModalOpen(false);
      setBadgeWallModalOpen(false);
      setAttendanceModalOpen(false);
      setBasicLawModalOpen(false);
      setStarDiamondModalOpen(false);
      setGrowthModalOpen(false);
      setHonorModalOpen(false);
      setRecruitmentModalOpen(false);
      setSubsidyModalOpen(false);
      setTrainingModalOpen(false);
      setActivityModalOpen(false);
      setPromotionModalOpen(false);
      setRetentionModalOpen(false);
      setIndicatorModalOpen(false);
      setTeamDetailModalOpen(false);
      return;
    }
    if (label === '我的收入') {
      setView(ViewType.MY_INCOME);
      return;
    }
    if (label === '团队业绩') {
      setView(ViewType.TEAM_PERFORMANCE);
      return;
    }
    if (label === '宏运特区/独立区') {
      setView(ViewType.HONGYUN_ZONE);
      return;
    }
    if (label === '竞赛') {
      window.open('https://amasit01.manulife-sinochem.com/AI/competition/', '_blank');
      return;
    }
    handleModuleClick(label);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 relative">
      
      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pop-up { 
          from { transform: scale(0.8) translateY(20px); opacity: 0; } 
          to { transform: scale(1) translateY(0); opacity: 1; } 
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-pop-up { animation: pop-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>

      {/* Minimal Top Navigation */}
      <div className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-md pt-4 pb-2 px-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex bg-white rounded-2xl p-1 shadow-sm border border-slate-200/60 ring-1 ring-slate-100">
            <button 
              onClick={() => setView(ViewType.PERSONAL)} 
              className={`flex-1 py-2 text-xs font-black rounded-xl transition-all duration-300 ${view === ViewType.PERSONAL ? 'bg-[#00A758] text-white shadow-md shadow-green-100' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              个人视图
            </button>
            <button 
              onClick={() => setView(ViewType.TEAM)} 
              className={`flex-1 py-2 text-xs font-black rounded-xl transition-all duration-300 ${view === ViewType.TEAM ? 'bg-[#00A758] text-white shadow-md shadow-green-100' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              团队管理
            </button>
          </div>
          
          {/* Indicator Definition Entry */}
          <button 
            onClick={() => setIndicatorModalOpen(true)}
            className="flex items-center justify-center bg-white h-10 w-10 rounded-2xl border border-slate-200/60 shadow-sm ring-1 ring-slate-100 active:scale-95 transition-transform"
            title="指标定义"
          >
            <i className="fa-solid fa-book-open-reader text-[#00A758] text-sm"></i>
          </button>
        </div>

        {/* Team Scope Filters */}
        {view === ViewType.TEAM && (
          <div className="bg-white/80 backdrop-blur-sm p-1 rounded-2xl flex border border-slate-200/60 shadow-sm ring-1 ring-slate-100 overflow-x-auto no-scrollbar">
            {( [
              { id: 'direct', label: '直辖组' },
              { id: 'district', label: '营业区' },
              { id: 'org', label: '所辖' }
            ] as const).map((filter) => (
              <button
                key={filter.id}
                onClick={() => setTeamFilter(filter.id)}
                className={`flex-none px-4 py-2 rounded-xl text-[11px] font-black transition-all ${
                  teamFilter === filter.id 
                    ? 'bg-[#00A758] text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        {(view === ViewType.PERSONAL || view === ViewType.TEAM) && (
          <div className="flex flex-col gap-1.5">
            {view !== ViewType.TEAM && (
            <div className="flex justify-between items-center bg-white rounded-2xl p-1 shadow-sm border border-slate-200/40">
               <div className="flex p-0.5 bg-slate-100/80 rounded-xl flex-1 max-w-[220px]">
                  <button 
                    onClick={() => {
                      setSalaryMonth('custom');
                      setIsCustomRangeOpen(!isCustomRangeOpen);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-black bg-white text-[#00A758] shadow-sm border border-slate-200/20 active:scale-95 transition-all text-slate-700"
                  >
                    <i className="fa-solid fa-calendar text-[#00A758] opacity-90 text-[10px]"></i>
                    <span>{(() => {
                      const startParts = customStartDate.split('-');
                      const endParts = customEndDate.split('-');
                      if (startParts.length >= 2 && endParts.length >= 2) {
                        const startYear = Number(startParts[0]);
                        const startMonth = Number(startParts[1]);
                        const endYear = Number(endParts[0]);
                        const endMonth = Number(endParts[1]);
                        if (startYear === endYear && startMonth === endMonth) {
                          return `${startYear}年${startMonth}月`;
                        } else {
                          return `${startYear}.${String(startMonth).padStart(2, '0')} ~ ${endYear}.${String(endMonth).padStart(2, '0')}`;
                        }
                      }
                      return '自定义范围';
                    })()}</span>
                    <i className={`fa-solid fa-chevron-${isCustomRangeOpen ? 'up' : 'down'} text-[8px] opacity-60 ml-0.5 transition-transform`}></i>
                  </button>
               </div>
               {view !== ViewType.TEAM && (
                 <button 
                   onClick={() => setRankingModalOpen(true)}
                   className="px-3 py-1.5 bg-[#F1F9F3] text-[#00A758] rounded-full border border-[#D1EBD8] flex items-center gap-1 active:scale-95 transition-all shadow-sm group mr-1"
                 >
                   <i className="fa-solid fa-chart-line text-[9px] group-hover:scale-110 transition-transform"></i>
                   <span className="text-[10px] font-black uppercase tracking-tight">指标排名</span>
                 </button>
               )}
            </div>
            )}

            <div className="flex justify-between items-center px-2.5 text-[9px] text-slate-400 font-bold tracking-tight">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A758] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00A758]"></span>
                </span>
                数据同步时间: <span className="font-mono font-black text-slate-500">{syncTimeStr}</span>
              </span>
              <span className="font-mono font-black text-slate-500">
                SH68699
              </span>
            </div>

            <AnimatePresence>
              {view !== ViewType.TEAM && salaryMonth === 'custom' && isCustomRangeOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-slate-700 flex items-center gap-1.5 font-sans">
                        <i className="fa-solid fa-calendar-days text-[#00A758] text-sm"></i>
                        自定义月份范围筛选
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] text-slate-400 font-bold font-sans">开始月份</label>
                        <input 
                          type="month" 
                          value={customStartDate.slice(0, 7)}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              const [y, m] = val.split('-').map(Number);
                              setCustomStartDate(`${y}-${String(m).padStart(2, '0')}-01`);
                            }
                          }}
                          className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#00A758] focus:border-[#00a758] font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] text-slate-400 font-bold font-sans">结束月份</label>
                        <input 
                          type="month" 
                          value={customEndDate.slice(0, 7)}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              const [y, m] = val.split('-').map(Number);
                              const lastDay = new Date(y, m, 0).getDate();
                              setCustomEndDate(`${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`);
                            }
                          }}
                          className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#00A758] focus:border-[#00a758] font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-1">
                      {([
                        { label: '本月', type: 'curr' },
                        { label: '上月', type: 'last' },
                        { label: '近3个月', type: '3m' },
                        { label: '近6个月', type: '6m' }
                      ]).map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            const now = new Date();
                            if (preset.type === 'curr') {
                              const y = now.getFullYear();
                              const m = now.getMonth() + 1;
                              const lastDay = new Date(y, m, 0).getDate();
                              setCustomStartDate(`${y}-${String(m).padStart(2, '0')}-01`);
                              setCustomEndDate(`${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`);
                            } else if (preset.type === 'last') {
                              const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                              const y = prev.getFullYear();
                              const m = prev.getMonth() + 1;
                              const lastDay = new Date(y, m, 0).getDate();
                              setCustomStartDate(`${y}-${String(m).padStart(2, '0')}-01`);
                              setCustomEndDate(`${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`);
                            } else {
                              const monthsOffset = preset.type === '3m' ? 2 : 5;
                              const start = new Date(now.getFullYear(), now.getMonth() - monthsOffset, 1);
                              const sy = start.getFullYear();
                              const sm = start.getMonth() + 1;
                              const ey = now.getFullYear();
                              const em = now.getMonth() + 1;
                              const lastDayOfEnd = new Date(ey, em, 0).getDate();
                              setCustomStartDate(`${sy}-${String(sm).padStart(2, '0')}-01`);
                              setCustomEndDate(`${ey}-${String(em).padStart(2, '0')}-${String(lastDayOfEnd).padStart(2, '0')}`);
                            }
                          }}
                          className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100/80 active:scale-95 text-[10px] font-bold text-slate-600 rounded-lg border border-slate-200/50 transition-all font-sans"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <main className="px-4 pt-2 relative space-y-4">
        {/* 已签未计保单追踪入口 - 已摆放在日历筛选下 */}
        {view === ViewType.PERSONAL && (
          <div 
            role="button"
            tabIndex={0}
            onClick={openUnpaidDetail}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openUnpaidDetail();
              }
            }}
            className="w-full bg-amber-50/40 rounded-xl p-4 border border-amber-100 flex items-center justify-between group active:scale-[0.99] transition-all shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shadow-xs">
                <i className="fa-solid fa-file-contract"></i>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-black text-slate-800">已签未计佣保单追踪</p>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setIsUnpaidFycHidden(!isUnpaidFycHidden); }}
                    className="p-1 text-slate-300 hover:text-slate-500 transition-colors"
                    title={isUnpaidFycHidden ? "显示金额" : "隐藏金额"}
                  >
                    <i className={`fa-solid ${isUnpaidFycHidden ? 'fa-eye-slash' : 'fa-eye'} text-[10px]`}></i>
                  </button>
                </div>
                <p className="text-sm text-amber-600 font-black mt-0.5">FYC: <span className="font-black">¥{isUnpaidFycHidden ? '****' : (stats?.unpaidFyc ?? MOCK_PERSONAL_STATS.unpaidFyc).toLocaleString()}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-amber-400 font-black">去处理</span>
              <i className="fa-solid fa-chevron-right text-[10px] text-amber-300 group-hover:translate-x-1 transition-transform"></i>
            </div>
          </div>
        )}

        {/* Performance Dashboard */}
        <section 
          id="team-results"
          onClick={() => setIsAutoFlipping(false)}
          className={`bg-white rounded-2xl shadow-sm border border-slate-100 transition-all ${view === ViewType.PERSONAL ? 'py-2.5 px-4' : 'p-5'}`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h2 className="text-[12px] font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                {view === ViewType.PERSONAL ? (
                  <>
                    <i className="fa-solid fa-wallet text-[#00A758]"></i>
                    当月税前收入（签发）
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-chart-line text-[#00A758]"></i>
                    团队业绩
                  </>
                )}
              </h2>
              {view === ViewType.PERSONAL && (
                <button 
                  onClick={() => setIsAmountHidden(!isAmountHidden)}
                  className="p-1 text-slate-300 hover:text-slate-500 transition-colors"
                  title={isAmountHidden ? "显示金额" : "隐藏金额"}
                >
                  <i className={`fa-solid ${isAmountHidden ? 'fa-eye-slash' : 'fa-eye'} text-[10px]`}></i>
                </button>
              )}
            </div>

            {view === ViewType.PERSONAL && (
              <span className="text-sm font-black text-[#00A758] tracking-tight animate-fade-in">
                <AmountDisplay 
                  value={totalIncome} 
                  isHidden={isAmountHidden} 
                  prefix="¥" 
                />
              </span>
            )}

            {view === ViewType.TEAM && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSalaryMonth('custom');
                  setIsCustomRangeOpen(!isCustomRangeOpen);
                }}
                className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-black bg-slate-50 text-slate-600 shadow-sm border border-slate-200/60 active:scale-95 transition-all"
              >
                <i className="fa-solid fa-calendar text-[#00A758] opacity-90 text-[10px]"></i>
                <span className="text-slate-600">{(() => {
                  const startParts = customStartDate.split('-');
                  const endParts = customEndDate.split('-');
                  if (startParts.length >= 2 && endParts.length >= 2) {
                    const startYear = Number(startParts[0]);
                    const startMonth = Number(startParts[1]);
                    const endYear = Number(endParts[0]);
                    const endMonth = Number(endParts[1]);
                    if (startYear === endYear && startMonth === endMonth) {
                      return `${startYear}年${startMonth}月`;
                    } else {
                      return `${startYear}.${String(startMonth).padStart(2, '0')} ~ ${endYear}.${String(endMonth).padStart(2, '0')}`;
                    }
                  }
                  return '自定义范围';
                })()}</span>
                <i className={`fa-solid fa-chevron-${isCustomRangeOpen ? 'up' : 'down'} text-[8px] opacity-60 ml-0.5 transition-transform`}></i>
              </button>
            )}
          </div>

          {/* 团队业绩月份范围筛选 - 展开在标题下方，参考设计稿 */}
          {view === ViewType.TEAM && (
            <AnimatePresence>
              {salaryMonth === 'custom' && isCustomRangeOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden bg-slate-50/60 rounded-2xl p-4 border border-slate-100 mt-3"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-slate-700 flex items-center gap-1.5 font-sans">
                        <i className="fa-solid fa-calendar-days text-[#00A758] text-sm"></i>
                        团队业绩月份范围筛选
                      </span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setIsCustomRangeOpen(false); }}
                        className="px-4 py-1 bg-[#F1F9F3] hover:bg-[#E4F3E9] active:scale-95 text-[#00A758] border border-[#B8E0C6] text-[11px] font-black rounded-lg transition-all font-sans"
                      >
                        确定
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] text-slate-400 font-bold font-sans">开始月份</label>
                        <input 
                          type="month" 
                          value={customStartDate.slice(0, 7)}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              const [y, m] = val.split('-').map(Number);
                              setCustomStartDate(`${y}-${String(m).padStart(2, '0')}-01`);
                            }
                          }}
                          className="w-full text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#00A758] focus:border-[#00a758] font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] text-slate-400 font-bold font-sans">结束月份</label>
                        <input 
                          type="month" 
                          value={customEndDate.slice(0, 7)}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              const [y, m] = val.split('-').map(Number);
                              const lastDay = new Date(y, m, 0).getDate();
                              setCustomEndDate(`${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`);
                            }
                          }}
                          className="w-full text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#00A758] focus:border-[#00a758] font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-1">
                      {([
                        { label: '本月', type: 'curr' },
                        { label: '上月', type: 'last' },
                        { label: '近3个月', type: '3m' },
                        { label: '近6个月', type: '6m' }
                      ]).map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            const now = new Date();
                            if (preset.type === 'curr') {
                              const y = now.getFullYear();
                              const m = now.getMonth() + 1;
                              const lastDay = new Date(y, m, 0).getDate();
                              setCustomStartDate(`${y}-${String(m).padStart(2, '0')}-01`);
                              setCustomEndDate(`${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`);
                            } else if (preset.type === 'last') {
                              const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                              const y = prev.getFullYear();
                              const m = prev.getMonth() + 1;
                              const lastDay = new Date(y, m, 0).getDate();
                              setCustomStartDate(`${y}-${String(m).padStart(2, '0')}-01`);
                              setCustomEndDate(`${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`);
                            } else {
                              const monthsOffset = preset.type === '3m' ? 2 : 5;
                              const start = new Date(now.getFullYear(), now.getMonth() - monthsOffset, 1);
                              const sy = start.getFullYear();
                              const sm = start.getMonth() + 1;
                              const ey = now.getFullYear();
                              const em = now.getMonth() + 1;
                              const lastDayOfEnd = new Date(ey, em, 0).getDate();
                              setCustomStartDate(`${sy}-${String(sm).padStart(2, '0')}-01`);
                              setCustomEndDate(`${ey}-${String(em).padStart(2, '0')}-${String(lastDayOfEnd).padStart(2, '0')}`);
                            }
                          }}
                          className="flex-1 py-1.5 bg-white hover:bg-slate-100/80 active:scale-95 text-[10px] font-bold text-slate-600 rounded-lg border border-slate-200/50 transition-all font-sans"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {view === ViewType.TEAM && (
            <div className="mt-4 space-y-4">
              {/* Category 1: 业绩指标 */}
              <div className="bg-slate-50/45 rounded-xl p-3 border border-slate-100/70 space-y-2">
                <div className="flex items-center gap-1.5 border-b border-slate-100/50 pb-1.5 mb-1">
                  <i className="fa-solid fa-wallet text-amber-500 text-[10px]"></i>
                  <span className="text-[10px] font-extrabold text-slate-700 tracking-wide">业绩</span>
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                  {/* 1. 递交APE（元） */}
                  <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                      <AmountDisplay 
                        value={(() => {
                          const base = teamFilter === 'direct' ? 72000 : teamFilter === 'district' ? 310000 : teamFilter === 'org' ? 1150000 : 2100000;
                          return Math.round(base * teamTimeMultiplier);
                        })()} 
                        isHidden={isAmountHidden} 
                      />
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">递交APE <span className="text-slate-400">(元)</span></p>
                  </div>

                  {/* 2. 总净APE（元） */}
                  <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                      <AmountDisplay 
                        value={(() => {
                          const base = teamFilter === 'direct' ? 60000 : teamFilter === 'district' ? 260000 : teamFilter === 'org' ? 960000 : 1750000;
                          return Math.round(base * teamTimeMultiplier);
                        })()} 
                        isHidden={isAmountHidden} 
                      />
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">总净APE <span className="text-slate-400">(元)</span></p>
                  </div>

                  {/* 3. 净FYC签发（元） */}
                  <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                      <AmountDisplay 
                        value={(() => {
                          const base = teamFilter === 'direct' ? 52000 : teamFilter === 'district' ? 220000 : teamFilter === 'org' ? 810000 : 1480000;
                          return Math.round(base * teamTimeMultiplier);
                        })()} 
                        isHidden={isAmountHidden} 
                      />
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">净FYC签发 <span className="text-slate-400">(元)</span></p>
                  </div>

                  {/* 4. 净FYC发佣（元） */}
                  <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                      <AmountDisplay 
                        value={(() => {
                          const base = teamFilter === 'direct' ? 42500 : teamFilter === 'district' ? 184000 : teamFilter === 'org' ? 680000 : 1250000;
                          return Math.round(base * teamTimeMultiplier);
                        })()} 
                        isHidden={isAmountHidden} 
                      />
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">净FYC发佣 <span className="text-slate-400">(元)</span></p>
                  </div>

                  {/* 5. 签发可计佣FYC（元） */}
                  <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                      <AmountDisplay 
                        value={(() => {
                          const base = teamFilter === 'direct' ? 48000 : teamFilter === 'district' ? 205000 : teamFilter === 'org' ? 750000 : 1380000;
                          return Math.round(base * teamTimeMultiplier);
                        })()} 
                        isHidden={isAmountHidden} 
                      />
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">签发可计佣FYC <span className="text-slate-400">(元)</span></p>
                  </div>

                  {/* 6. 签发可计佣件数（件） */}
                  <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                      {(() => {
                        const base = teamFilter === 'direct' ? 11 : teamFilter === 'district' ? 45 : teamFilter === 'org' ? 148 : 270;
                        return Math.max(1, Math.round(base * teamTimeMultiplier));
                      })()}<span className="text-[10px] text-[#00A758] font-bold ml-0.5">件</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">签发可计佣件数</p>
                  </div>

                  {/* 7. 递交保单数（件） */}
                  <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                      {(() => {
                        const base = teamFilter === 'direct' ? 14 : teamFilter === 'district' ? 56 : teamFilter === 'org' ? 182 : 330;
                        return Math.max(1, Math.round(base * teamTimeMultiplier));
                      })()}<span className="text-[10px] text-[#00A758] font-bold ml-0.5">件</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">递交保单数</p>
                  </div>

                  {/* 8. 净件数（签发）（件） */}
                  <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                      {(() => {
                        const base = teamFilter === 'direct' ? 12 : teamFilter === 'district' ? 48 : teamFilter === 'org' ? 156 : 284;
                        return Math.max(1, Math.round(base * teamTimeMultiplier));
                      })()}<span className="text-[10px] text-[#00A758] font-bold ml-0.5">件</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">净件数（签发）</p>
                  </div>
                </div>
              </div>

              {/* Category 2: 人力指标 */}
              <div className="bg-slate-50/45 rounded-xl p-3 border border-slate-100/70 space-y-2">
                <div className="flex items-center gap-1.5 border-b border-slate-100/50 pb-1.5 mb-1">
                  <i className="fa-solid fa-id-badge text-purple-500 text-[10px]"></i>
                  <span className="text-[10px] font-extrabold text-slate-700 tracking-wide">人力</span>
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                  {/* 1. 增员 */}
                  <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                      +{(() => {
                        const base = teamFilter === 'direct' ? 2 : teamFilter === 'district' ? 7 : teamFilter === 'org' ? 16 : 28;
                        return Math.max(1, Math.round(base * teamTimeMultiplier));
                      })()}<span className="text-[10px] text-[#00A758]/80 font-bold ml-0.5">人</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">增员</p>
                  </div>

                  {/* 2. 递交出单人数 */}
                  <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                      {(() => {
                        const base = teamFilter === 'direct' ? 9 : teamFilter === 'district' ? 36 : teamFilter === 'org' ? 112 : 205;
                        return Math.max(1, Math.round(base * teamTimeMultiplier));
                      })()}<span className="text-[10px] text-[#00A758]/80 font-bold ml-0.5">人</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">递交出单人数</p>
                  </div>

                  {/* 3. 净出单人力 */}
                  <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                      {(() => {
                        const base = teamFilter === 'direct' ? 8 : teamFilter === 'district' ? 32 : teamFilter === 'org' ? 98 : 186;
                        return Math.max(1, Math.round(base * teamTimeMultiplier));
                      })()}<span className="text-[10px] text-[#00A758]/80 font-bold ml-0.5">人</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">净出单人力</p>
                  </div>

                  {/* 4. 星钻人力/星钻人次 */}
                  <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                      {(() => {
                        const hrBase = teamFilter === 'direct' ? 4 : teamFilter === 'district' ? 14 : teamFilter === 'org' ? 45 : 82;
                        const countBase = teamFilter === 'direct' ? 6 : teamFilter === 'district' ? 22 : teamFilter === 'org' ? 68 : 126;
                        const hr = Math.max(1, Math.round(hrBase * teamTimeMultiplier));
                        const count = Math.max(1, Math.round(countBase * teamTimeMultiplier));
                        return `${hr}/${count}`;
                      })()}<span className="text-[10px] text-[#00A758]/80 font-bold ml-0.5">人/次</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">星钻人力/星钻人次</p>
                  </div>

                  {/* 5. 3MO */}
                  <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                      {(() => {
                        const base = teamFilter === 'direct' ? 1 : teamFilter === 'district' ? 4 : teamFilter === 'org' ? 12 : 22;
                        return base;
                      })()}<span className="text-[10px] text-[#00A758]/80 font-bold ml-0.5">人</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">3MO</p>
                  </div>

                  {/* 6. 系统人力 */}
                  <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                      {(() => {
                        const base = teamFilter === 'direct' ? 12 : teamFilter === 'district' ? 48 : teamFilter === 'org' ? 156 : 284;
                        return base;
                      })()}<span className="text-[10px] text-[#00A758]/80 font-bold ml-0.5">人</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">系统人力</p>
                  </div>

                  {/* 7. 辖下主管数 (选中营业区和所辖时展示) */}
                  {(teamFilter === 'district' || teamFilter === 'org') && (
                    <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                      <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                        {teamFilter === 'district' ? 8 : 28}<span className="text-[10px] text-[#00A758]/80 font-bold ml-0.5">人</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold mt-1">辖下主管数</p>
                    </div>
                  )}

                  {/* 8. 第一代主管数 (选中营业区和所辖时展示) */}
                  {(teamFilter === 'district' || teamFilter === 'org') && (
                    <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                      <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                        {teamFilter === 'district' ? 5 : 12}<span className="text-[10px] text-[#00A758]/80 font-bold ml-0.5">人</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold mt-1">第一代主管数</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Category 3: 其他指标 */}
              <div className="bg-slate-50/45 rounded-xl p-3 border border-slate-100/70 space-y-2">
                <div className="flex items-center gap-1.5 border-b border-slate-100/50 pb-1.5 mb-1">
                  <i className="fa-solid fa-calendar-check text-[#00A758] text-[10px]"></i>
                  <span className="text-[10px] font-extrabold text-slate-700 tracking-wide">其他</span>
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                  {/* 1. 人均建议书打印量 */}
                  <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                      {(() => {
                        if (teamFilter === 'direct') return '12.4';
                        if (teamFilter === 'district') return '11.8';
                        if (teamFilter === 'org') return '10.5';
                        return '9.8';
                      })()}<span className="text-[10px] text-[#00A758] font-bold ml-0.5">份/人</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">人均建议书打印量</p>
                  </div>

                  {/* 2. 活动率 */}
                  <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                      {(() => {
                        if (teamFilter === 'direct') return '66.7%';
                        if (teamFilter === 'district') return '66.7%';
                        if (teamFilter === 'org') return '62.8%';
                        return '65.5%';
                      })()}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">活动率</p>
                  </div>

                  {/* 3. 递交活动率 */}
                  <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                      {(() => {
                        if (teamFilter === 'direct') return '75.0%';
                        if (teamFilter === 'district') return '75.0%';
                        if (teamFilter === 'org') return '71.8%';
                        return '72.2%';
                      })()}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">递交活动率</p>
                  </div>

                  {/* 4. 活动人均件数 */}
                  <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                      {(() => {
                        if (teamFilter === 'direct') return '1.5';
                        if (teamFilter === 'district') return '1.4';
                        if (teamFilter === 'org') return '1.3';
                        return '1.2';
                      })()}<span className="text-[10px] text-[#00A758] font-bold ml-0.5">件/人</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">活动人均件数</p>
                  </div>

                  {/* 5. 活动人均APE */}
                  <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                      <AmountDisplay 
                        value={(() => {
                          const base = teamFilter === 'direct' ? 18500 : teamFilter === 'district' ? 17800 : teamFilter === 'org' ? 16200 : 15500;
                          return Math.round(base * teamTimeMultiplier);
                        })()} 
                        isHidden={isAmountHidden} 
                        prefix="¥" 
                      />
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">活动人均APE</p>
                  </div>

                  {/* 6. 件均APE */}
                  <div className="flex flex-col items-center justify-center text-center py-2.5 relative">
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                      <AmountDisplay 
                        value={(() => {
                          const base = teamFilter === 'direct' ? 148000 : teamFilter === 'district' ? 570000 : teamFilter === 'org' ? 1587600 : 2883000;
                          return Math.round(base * teamTimeMultiplier);
                        })()} 
                        isHidden={isAmountHidden} 
                        prefix="¥" 
                      />
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">件均APE</p>
                  </div>

                  {/* 7. 寿险保单续保率（滚动6个月） with question mark tooltip */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setRetentionTip(retentionTip === '6M' ? null : '6M');
                    }}
                    className="flex flex-col items-center justify-center text-center py-2.5 relative cursor-pointer active:scale-95 transition-all"
                  >
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight flex items-center justify-center gap-0.5">
                      88.2% <i className="fa-solid fa-circle-info text-[9px] text-[#00A758]/50"></i>
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">寿险保单续保率（滚动6个月）</p>
                    <AnimatePresence>
                      {retentionTip === '6M' && (
                        <RetentionTooltip type="6M" onClose={() => setRetentionTip(null)} />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 8. 寿险保单续保率（滚动12个月） with question mark tooltip */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setRetentionTip(retentionTip === '12M' ? null : '12M');
                    }}
                    className="flex flex-col items-center justify-center text-center py-2.5 relative cursor-pointer active:scale-95 transition-all"
                  >
                    <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight flex items-center justify-center gap-0.5">
                      91.5% <i className="fa-solid fa-circle-info text-[9px] text-[#00A758]/50"></i>
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">寿险保单续保率（滚动12个月）</p>
                    <AnimatePresence>
                      {retentionTip === '12M' && (
                        <RetentionTooltip type="12M" onClose={() => setRetentionTip(null)} />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              {/* 净FYC和净件数说明文案 - 对齐个人视图位置/字号/颜色 */}
              <p className="text-[11px] text-[#C0C4CC] mt-2">
                净FYC（签发）和净件数（签发）均不作为基本法利益、晋升考核等最终结果，仅供参考
              </p>
            </div>
          )}
        </section>

        {/* Board Section */}
        {view === ViewType.PERSONAL && (
          <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-slate-800 text-xs font-bold flex items-center gap-2 tracking-wide">
                  <i className="fa-solid fa-gauge-high text-[#00A758]"></i>
                  绩效看板
                </h2>
                <button 
                  onClick={() => setIsDashboardHidden(!isDashboardHidden)}
                  className="p-1 text-slate-300 hover:text-slate-500 transition-colors"
                  title={isDashboardHidden ? "显示金额" : "隐藏金额"}
                >
                  <i className={`fa-solid ${isDashboardHidden ? 'fa-eye-slash' : 'fa-eye'} text-[10px]`}></i>
                </button>
              </div>
            </div>

            {(() => {
              const renderMetricCard = (metric: { id: string; label: string }) => {
                switch (metric.id) {
                  case 'submissions':
                    return (
                      <div key="submissions" className="flex flex-col items-center justify-center text-center py-2.5 relative">
                        <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                          {Math.round(stats.ape * 1.25).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">递交APE</p>
                      </div>
                    );
                  case 'net_ape':
                    return (
                      <div key="net_ape" className="flex flex-col items-center justify-center text-center py-2.5 relative">
                        <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                          {stats.ape.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">总净APE</p>
                      </div>
                    );
                  case 'policies':
                    return (
                      <div key="policies" className="flex flex-col items-center justify-center text-center py-2.5 relative">
                        <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                          {stats.policyCount} <span className="text-[10px] text-[#00A758] font-bold">件</span>
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">净签发件数</p>
                      </div>
                    );
                  case 'est_income':
                    return (
                      <div key="est_income" className="flex flex-col items-center justify-center text-center py-2.5 relative">
                        <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                          <AmountDisplay value={totalIncome} isHidden={isDashboardHidden} prefix="¥" />
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">当月预估收入</p>
                      </div>
                    );
                  case 'issued_fyc':
                    return (
                      <div 
                        key="issued_fyc" 
                        onClick={openPaidDetail}
                        className="flex flex-col items-center justify-center text-center py-2 relative cursor-pointer hover:bg-slate-50/80 active:scale-95 rounded-xl transition-all"
                        title="点击查看已计佣保单明细"
                      >
                        <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight select-none">
                          <AmountDisplay value={stats.paidFyc} isHidden={isDashboardHidden} prefix="¥" />
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1 flex items-center gap-0.5 justify-center select-none">
                          <span>净FYC发佣</span>
                          <i className="fa-solid fa-chevron-right text-[8px] text-[#00A758]/60 group-hover:translate-x-0.5 transition-transform"></i>
                        </p>
                      </div>
                    );
                  case 'ryc':
                    return (
                      <div 
                        key="ryc" 
                        onClick={openRenewalDetail}
                        className="flex flex-col items-center justify-center text-center py-2 relative cursor-pointer hover:bg-slate-50/80 active:scale-95 rounded-xl transition-all"
                        title="点击查看续佣保单明细"
                      >
                        <span className="absolute top-0 right-2 text-[9px] font-black text-red-500">New</span>
                        <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight select-none">
                          <AmountDisplay value={stats.renewalCommission || 0} isHidden={isDashboardHidden} prefix="¥" />
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1 flex items-center gap-0.5 justify-center select-none">
                          <span>续佣RYC</span>
                          <i className="fa-solid fa-chevron-right text-[8px] text-[#00A758]/60 group-hover:translate-x-0.5 transition-transform"></i>
                        </p>
                      </div>
                    );
                  case 'retention_6m':
                    return (
                      <div 
                        key="retention_6m"
                        onClick={() => setRetentionTip(retentionTip === '6M' ? null : '6M')}
                        className="flex flex-col items-center justify-center text-center py-2.5 relative cursor-pointer active:scale-95 transition-all"
                      >
                        <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight flex items-center justify-center gap-0.5">
                          88% <i className="fa-solid fa-circle-info text-[9px] text-[#00A758]/50"></i>
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">续保率(6M)</p>
                        <AnimatePresence>
                          {retentionTip === '6M' && (
                            <RetentionTooltip type="6M" onClose={() => setRetentionTip(null)} />
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  case 'retention_12m':
                    return (
                      <div 
                        key="retention_12m"
                        onClick={() => setRetentionTip(retentionTip === '12M' ? null : '12M')}
                        className="flex flex-col items-center justify-center text-center py-2.5 relative cursor-pointer active:scale-95 transition-all"
                      >
                        <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight flex items-center justify-center gap-0.5">
                          92% <i className="fa-solid fa-circle-info text-[9px] text-[#00A758]/50"></i>
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">续保率(12M)</p>
                        <AnimatePresence>
                          {retentionTip === '12M' && (
                            <RetentionTooltip type="12M" onClose={() => setRetentionTip(null)} />
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  case 'attendance':
                    return (
                      <div key="attendance" className="flex flex-col items-center justify-center text-center py-2.5 relative">
                        <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                          78.5%
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">出席率(单考勤)</p>
                      </div>
                    );
                  case 'direct_recruits':
                    return (
                      <div key="direct_recruits" className="flex flex-col items-center justify-center text-center py-2.5 relative">
                        <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                          {stats.directRecruits || 0} <span className="text-[10px] text-[#00A758]/80 font-bold">人</span>
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">直招人力</p>
                      </div>
                    );
                  case 'proposal_prints':
                    return (
                      <div key="proposal_prints" className="flex flex-col items-center justify-center text-center py-2.5 relative">
                        <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                          {Math.max(12, stats.policyCount * 3 + 2)} <span className="text-[10px] text-[#00A758] font-bold">份</span>
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">建议书打印量</p>
                      </div>
                    );
                  case 'dual_attendance':
                    return (
                      <div key="dual_attendance" className="flex flex-col items-center justify-center text-center py-2.5 relative">
                        <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                          85.0%
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">双考勤出席率</p>
                      </div>
                    );
                  case 'net_issued_fyc':
                    return (
                      <div 
                        key="net_issued_fyc" 
                        onClick={openNetIssuedFycDetail}
                        className="flex flex-col items-center justify-center text-center py-2 relative cursor-pointer hover:bg-slate-50/80 active:scale-95 rounded-xl transition-all"
                        title="点击查看净FYC签发保单明细"
                      >
                        <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight select-none flex justify-center items-center">
                          <AmountDisplay value={stats.unpaidFyc} isHidden={isDashboardHidden} prefix="¥" />
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1 flex items-center gap-0.5 justify-center select-none">
                          <span>净FYC签发</span>
                          <i className="fa-solid fa-chevron-right text-[8px] text-[#00A758]/60 group-hover:translate-x-0.5 transition-transform"></i>
                        </p>
                      </div>
                    );
                  case 'issued_commissionable_fyc':
                    return (
                      <div 
                        key="issued_commissionable_fyc" 
                        onClick={openIssuedCommissionableDetail}
                        className="flex flex-col items-center justify-center text-center py-2 relative cursor-pointer hover:bg-slate-50/80 active:scale-95 rounded-xl transition-all group"
                        title="点击查看签发可计佣FYC保单明细"
                      >
                        <span className="absolute top-0 right-2 text-[9px] font-black text-red-500">New</span>
                        <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight select-none flex justify-center items-center">
                          <AmountDisplay value={stats.issuedCommissionableFyc} isHidden={isDashboardHidden} prefix="¥" />
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1 flex items-center gap-0.5 justify-center select-none">
                          <span>签发可计佣FYC</span>
                          <i className="fa-solid fa-chevron-right text-[8px] text-[#00A758]/60 group-hover:translate-x-0.5 transition-transform"></i>
                        </p>
                      </div>
                    );
                  case 'issued_commissionable_count':
                    return (
                      <div 
                        key="issued_commissionable_count" 
                        className="flex flex-col items-center justify-center text-center py-2.5 relative"
                      >
                        <span className="absolute top-0 right-2 text-[9px] font-black text-red-500">New</span>
                        <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                          {stats.issuedCommissionableCount} <span className="text-[10px] text-[#00A758] font-bold">件</span>
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">签发可计佣件数</p>
                      </div>
                    );
                  case 'submitted_policies':
                    return (
                      <div key="submitted_policies" className="flex flex-col items-center justify-center text-center py-2.5 relative">
                        <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                          {stats.policyCount + 2} <span className="text-[10px] text-[#00A758] font-bold">件</span>
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">递交保单数（件）</p>
                      </div>
                    );
                  case 'retention_3m0':
                    return (
                      <div key="retention_3m0" className="flex flex-col items-center justify-center text-center py-2.5 relative">
                        <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                          2 <span className="text-[10px] text-[#00A758]/80 font-bold">人</span>
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">3M0</p>
                      </div>
                    );
                  case 'submitted_active_agents':
                    return (
                      <div key="submitted_active_agents" className="flex flex-col items-center justify-center text-center py-2.5 relative">
                        <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                          6 <span className="text-[10px] text-[#00A758]/80 font-bold">人</span>
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">递交出单人力</p>
                      </div>
                    );
                  case 'net_active_agents':
                    return (
                      <div key="net_active_agents" className="flex flex-col items-center justify-center text-center py-2.5 relative">
                        <p className="text-[14px] xs:text-[15px] sm:text-[16px] font-black text-[#00A758] leading-tight">
                          5 <span className="text-[10px] text-[#00A758]/80 font-bold">人</span>
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">净出单人力</p>
                      </div>
                    );
                  default:
                    return null;
                }
              };

              return (
                <div className="space-y-4">
                  {/* Primary Metrics Grouped Grid */}
                  <div className="space-y-4">
                    {boardMetrics.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                        <i className="fa-solid fa-sliders text-xs mb-1.5 opacity-60"></i>
                        <p className="text-[10px] font-bold">暂无展示指标</p>
                      </div>
                    ) : (() => {
                      const isPersonal = view === ViewType.PERSONAL;

                      const categories = isPersonal ? [
                        { id: 'earning', name: '业绩', icon: 'fa-wallet text-amber-500' },
                        { id: 'quality', name: '人力', icon: 'fa-id-badge text-purple-500' },
                        { id: 'activity', name: '其他', icon: 'fa-calendar-check text-[#00A758]' },
                      ] : [
                        { id: 'earning', name: '业绩', icon: 'fa-wallet text-amber-500' },
                        { id: 'business', name: '产能', icon: 'fa-chart-line text-blue-500' },
                        { id: 'quality', name: '人力', icon: 'fa-id-badge text-purple-500' },
                        { id: 'activity', name: '其他', icon: 'fa-calendar-check text-[#00A758]' },
                      ];

                      const getMetricCategoryId = (id: string): string => {
                        if (isPersonal) {
                          switch (id) {
                            case 'issued_fyc':
                            case 'net_issued_fyc':
                            case 'ryc':
                            case 'est_income':
                            case 'submissions':
                            case 'net_ape':
                            case 'policies':
                            case 'submitted_policies':
                            case 'retention_6m':
                            case 'retention_12m':
                            case 'issued_commissionable_fyc':
                            case 'issued_commissionable_count':
                              return 'earning';
                            case 'proposal_prints':
                            case 'attendance':
                            case 'dual_attendance':
                              return 'activity';
                            default:
                              return 'quality';
                          }
                        } else {
                          switch (id) {
                            case 'issued_fyc':
                            case 'net_issued_fyc':
                            case 'ryc':
                            case 'est_income':
                            case 'issued_commissionable_fyc':
                            case 'issued_commissionable_count':
                              return 'earning';
                            case 'submissions':
                            case 'net_ape':
                            case 'policies':
                            case 'submitted_policies':
                              return 'business';
                            case 'proposal_prints':
                            case 'attendance':
                            case 'dual_attendance':
                              return 'activity';
                            default:
                              return 'quality';
                          }
                        }
                      };

                      return categories.map(cat => {
                        let catMetrics = boardMetrics.filter(m => getMetricCategoryId(m.id) === cat.id);
                        if (catMetrics.length === 0) return null;

                        if (isPersonal && cat.id === 'earning') {
                          const earningOrder = [
                            'issued_fyc',                  // 净FYC发佣（第一行）
                            'net_issued_fyc',              // 净FYC签发（第一行）
                            'issued_commissionable_fyc',   // 签发可计佣FYC（第一行）
                            'ryc',                         // 续佣RYC（第二行）
                            'policies',                    // 净签发件数（第二行）
                            'issued_commissionable_count', // 签发可计佣件数（第二行）
                            'submitted_policies',          // 递交保单数（件）（第三行）
                            'submissions',                 // 递交APE（第三行）
                            'net_ape',                     // 总净APE（第三行）
                            'est_income',                  // 当月预估收入（第四行）
                            'retention_6m',                // 续保率(6M)（第四行）
                            'retention_12m'                // 续保率(12M)（第四行）
                          ];
                          catMetrics = [...catMetrics].sort((a, b) => {
                            const indexA = earningOrder.indexOf(a.id);
                            const indexB = earningOrder.indexOf(b.id);
                            const valA = indexA === -1 ? 999 : indexA;
                            const valB = indexB === -1 ? 999 : indexB;
                            return valA - valB;
                          });
                        }

                        return (
                          <div key={cat.id} className="bg-slate-50/45 rounded-xl p-3 border border-slate-100/70 space-y-2">
                            <div className="flex items-center gap-1.5 border-b border-slate-100/50 pb-1.5 mb-1">
                              <i className={`fa-solid ${cat.icon} text-[10px]`}></i>
                              <span className="text-[10px] font-extrabold text-slate-700 tracking-wide">{cat.name}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                              {catMetrics.map(m => renderMetricCard(m))}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                  {/* 净FYC和净件数说明文案 - 仅个人视图显示 */}
                  {view === ViewType.PERSONAL && (
                    <p className="text-[11px] text-[#C0C4CC] mt-2">
                      净FYC（签发）和净件数（签发）均不作为基本法利益、晋升考核等最终结果，仅供参考
                    </p>
                  )}
                </div>
              );
            })()}
          </section>
        )}

          {view === ViewType.TEAM && (
            <div className="flex flex-col gap-4 mt-4">
              <RecruitmentDashboard 
                filter={teamFilter} 
                onOpenDetails={() => {
                  setRecruitmentTab('team');
                  setRecruitmentModalOpen(true);
                }}
              />
            </div>
          )}

        {/* Insight Module */}
        {view === ViewType.PERSONAL && (
          <InsightModule 
            view={view} 
            teamFilter={teamFilter}
            setTeamFilter={setTeamFilter}
            isAmountHidden={isAmountHidden} 
            onOpenBasicLaw={() => setBasicLawModalOpen(true)}
            onOpenUnpaid={openUnpaidDetail}
            onOpenPromotion={() => setPromotionModalOpen(true)}
            onOpenHonor={() => setHonorModalOpen(true)}
            stats={stats}
          />
        )}

        {/* Moved Navigation Modules logic is handled by Footer Dock now */}
        {view === ViewType.TEAM && (
          <div className="space-y-4">
            {/* Standalone Team Attendance Summary Card - Direct entry to details */}
            <div 
              onClick={() => handleModuleClick('出席管理')}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 relative overflow-hidden cursor-pointer hover:border-[#00A758]/50 hover:shadow-md transition-all group"
            >
              <div className="absolute right-0 top-0 text-slate-50 opacity-15 translate-x-6 -translate-y-6 pointer-events-none">
                <i className="fa-solid fa-calendar-days text-[120px]"></i>
              </div>
              
              <div className="flex items-start justify-between gap-4 relative z-10">
                <div className="flex items-start gap-4 relative z-10 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-green-50 text-[#00A758] flex items-center justify-center text-xl group-hover:bg-[#00A758] group-hover:text-white transition-colors flex-shrink-0">
                    <i className="fa-solid fa-calendar-days"></i>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-800 group-hover:text-[#00A758] transition-colors">团队出席概览</h3>
                      <span className="text-[9px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-black animate-pulse">今日实时</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 font-bold leading-relaxed">
                      今日您辖下团队有 <span className="text-[#00A758] font-mono font-black">{(STATS_BY_FILTER[teamFilter || 'direct'] || STATS_BY_FILTER.direct).rate}</span> 的伙伴出席打卡（打卡 <span className="text-slate-700 font-mono font-black">{(STATS_BY_FILTER[teamFilter || 'direct'] || STATS_BY_FILTER.direct).actual}</span> 人/系统人力 <span className="text-slate-700 font-mono font-black">{(STATS_BY_FILTER[teamFilter || 'direct'] || STATS_BY_FILTER.direct).expected}</span> 人）
                    </p>
                  </div>
                </div>

                {/* Right Action Hint - 查看详情按钮（右上角，与"进入查看"按钮垂直对齐） */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModuleClick('出席管理');
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 group-hover:text-[#00A758] transition-colors shrink-0 pl-2 cursor-pointer"
                >
                  <span className="hidden sm:inline text-xs">查看详情</span>
                  <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
                    <i className="fa-solid fa-chevron-right text-[11px] text-slate-400 group-hover:text-[#00A758] group-hover:translate-x-0.5 transition-all"></i>
                  </div>
                </button>
              </div>

              {/* 团队出席情况 分布指标 */}
              <div className="pt-3 border-t border-slate-100 w-full relative z-10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#00A758]"></div>
                    <span className="text-[11px] font-black text-slate-800">团队出席率分布</span>
                    <span className="text-[10px] text-slate-400 font-bold">({getFilterLabelHelper(teamFilter)} • 共 {mainStats.total} 人)</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 divide-x divide-slate-100 py-1 bg-slate-50/50 rounded-xl">
                  {/* ≥80% */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModuleClick('出席管理', '80plus');
                    }}
                    className="px-2 text-center cursor-pointer hover:opacity-80 active:scale-[0.98] transition-all"
                  >
                    <div className="text-[10px] text-slate-500 font-medium">≥80%</div>
                    <div className="text-sm font-extrabold text-emerald-600 mt-0.5 font-mono">
                      {mainStats.bucket80Plus.count}<span className="text-[10px] font-normal text-slate-400 ml-0.5">人</span>
                    </div>
                    <div className="text-[9px] text-slate-400 font-medium">
                      占比 {mainStats.bucket80Plus.rate}%
                    </div>
                  </div>

                  {/* 50%-79% */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModuleClick('出席管理', '50to79');
                    }}
                    className="px-2 text-center cursor-pointer hover:opacity-80 active:scale-[0.98] transition-all"
                  >
                    <div className="text-[10px] text-slate-500 font-medium">50%-79%</div>
                    <div className="text-sm font-extrabold text-amber-600 mt-0.5 font-mono">
                      {mainStats.bucket50To80.count}<span className="text-[10px] font-normal text-slate-400 ml-0.5">人</span>
                    </div>
                    <div className="text-[9px] text-slate-400 font-medium">
                      占比 {mainStats.bucket50To80.rate}%
                    </div>
                  </div>

                  {/* 需关注 <50% */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModuleClick('出席管理', 'under50');
                    }}
                    className="px-2 text-center cursor-pointer hover:opacity-80 active:scale-[0.98] transition-all"
                  >
                    <div className="text-[10px] text-slate-500 font-medium">需关注 (&lt;50%)</div>
                    <div className="text-sm font-extrabold text-rose-600 mt-0.5 font-mono">
                      {mainStats.bucketUnder50.count + mainStats.bucketZero.count}<span className="text-[10px] font-normal text-slate-400 ml-0.5">人</span>
                    </div>
                    <div className="text-[9px] text-slate-400 font-medium">
                      占比 {Math.round(((mainStats.bucketUnder50.count + mainStats.bucketZero.count) / (mainStats.total || 1)) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section 
              id="team-manpower" 
              onClick={() => setTeamDetailModalOpen(true)}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs relative overflow-hidden cursor-pointer hover:border-[#00A758]/40 hover:shadow-md transition-all group active:scale-[0.99]"
            >
              <div className="absolute right-0 top-0 text-slate-50 opacity-15 translate-x-6 -translate-y-6 pointer-events-none">
                <i className="fa-solid fa-users text-[110px]"></i>
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 text-[#00A758] flex items-center justify-center text-xl group-hover:bg-[#00A758] group-hover:text-white transition-all duration-300 shadow-2xs shrink-0">
                    <i className="fa-solid fa-users"></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-black text-slate-800 group-hover:text-[#00A758] transition-colors tracking-wide">
                        我的团队
                      </h2>
                      <span className="text-[10px] bg-emerald-50/80 text-[#00A758] border border-emerald-100/80 px-2 py-0.5 rounded-full font-bold">
                        团队详情
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                      团队架构、育成关系，人员明细及业绩
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 group-hover:text-[#00A758] transition-colors shrink-0 pl-2">
                  <span className="hidden sm:inline text-xs">进入查看</span>
                  <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
                    <i className="fa-solid fa-chevron-right text-[11px] text-slate-400 group-hover:text-[#00A758] group-hover:translate-x-0.5 transition-all"></i>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Extra spacing */}
        <div className="h-10"></div>
      </main>

      {/* Floating Navigation Button */}
      <FloatingButton 
        navItems={navItems} 
        onNavClick={handleNavClick}
      />

      {/* 首页小工具：直辖工作室奖金测算胶囊按钮 (仅在个人视图且未打开测算页面时显示) */}
      {view === ViewType.PERSONAL && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setView(ViewType.SUPERVISOR_INCOME)}
          className="fixed right-4 bottom-20 z-40 bg-white border border-[#A7F3D0] rounded-full px-3.5 py-1.5 shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer transition-all group"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>
          <div className="w-6 h-6 rounded-full bg-[#E6F7ED] flex items-center justify-center text-[#00A758]">
            <Calculator className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800 tracking-tight">直辖工作室奖金测算</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
        </motion.button>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] px-4 min-h-16 flex flex-col z-50">
        <div className="flex items-center justify-between h-16">
          <button className="flex flex-col items-center gap-1 flex-1 py-1 text-slate-400">
            <i className="fa-solid fa-house text-lg"></i>
            <span className="text-[10px] font-bold">首页</span>
          </button>

          <button className="flex flex-col items-center gap-1 flex-1 py-1 text-slate-400">
            <i className="fa-solid fa-box text-lg"></i>
            <span className="text-[10px] font-bold">产品</span>
          </button>

          <button className="flex flex-col items-center gap-1 flex-1 py-1 text-slate-400">
            <i className="fa-solid fa-heart text-lg"></i>
            <span className="text-[10px] font-bold">客户</span>
          </button>

          <button className="flex flex-col items-center gap-1 flex-1 py-1 text-[#00A758]">
            <i className="fa-solid fa-chart-line text-lg"></i>
            <span className="text-[10px] font-bold">成长</span>
          </button>

          <button className="flex flex-col items-center gap-1 flex-1 py-1 text-slate-400">
            <i className="fa-solid fa-user text-lg"></i>
            <span className="text-[10px] font-bold">我的</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <RankingModal isOpen={rankingModalOpen} onClose={() => setRankingModalOpen(false)} rankings={MOCK_RANKINGS} />
      <IssuedCommissionableDetailModal 
        isOpen={issuedCommissionableModalOpen} 
        onClose={() => setIssuedCommissionableModalOpen(false)} 
        policies={MOCK_POLICIES} 
        isAmountHidden={isDashboardHidden} 
      />
      <PolicyDetailModal 
        isOpen={detailModalOpen} 
        onClose={() => setDetailModalOpen(false)} 
        type={selectedFycType} 
        policies={MOCK_POLICIES} 
        isAmountHidden={
          selectedFycType === 'unpaid' ? isUnpaidFycHidden :
          selectedFycType === 'paid' || selectedFycType === 'renewal' || selectedFycType === 'net_issued_fyc' ? isDashboardHidden :
          isAmountHidden
        } 
        trackedPolicyNos={trackedPolicyNos}
        onToggleTrack={handleToggleTrack}
      />
      <BadgeWallModal isOpen={badgeWallModalOpen} onClose={() => setBadgeWallModalOpen(false)} />
      <AttendanceModal isOpen={attendanceModalOpen} onClose={() => setAttendanceModalOpen(false)} view={view} teamMembers={MOCK_TEAM_MEMBERS} teamFilter={teamFilter} initialBucketFilter={attendanceInitialBucket} />
      <BasicLawModal isOpen={basicLawModalOpen} onClose={() => setBasicLawModalOpen(false)} stats={stats} isAmountHidden={isAmountHidden} />
      <StarDiamondHonorPage isOpen={starDiamondModalOpen} onClose={() => setStarDiamondModalOpen(false)} />
      <GrowthTrajectoryModal isOpen={growthModalOpen} onClose={() => setGrowthModalOpen(false)} />
      <HonorCompetitionModal isOpen={honorModalOpen} onClose={() => setHonorModalOpen(false)} />
      <RecruitmentManagementModal isOpen={recruitmentModalOpen} onClose={() => setRecruitmentModalOpen(false)} initialTab={recruitmentTab} />
      <FinancialSubsidyModal isOpen={subsidyModalOpen} onClose={() => setSubsidyModalOpen(false)} isAmountHidden={isAmountHidden} />
      <TrainingManagementModal isOpen={trainingModalOpen} onClose={() => setTrainingModalOpen(false)} />
      <ActivityManagementModal isOpen={activityModalOpen} onClose={() => setActivityModalOpen(false)} />
      <PromotionModal isOpen={promotionModalOpen} onClose={() => setPromotionModalOpen(false)} data={MOCK_PROMOTION} stats={stats} />
      <RetentionTrackingModal isOpen={retentionModalOpen} onClose={() => setRetentionModalOpen(false)} stats={stats} />
      <IndicatorDefinitionModal isOpen={indicatorModalOpen} onClose={() => setIndicatorModalOpen(false)} />
      <PerformanceBoardSettingsModal 
        isOpen={boardSettingsOpen} 
        onClose={() => setBoardSettingsOpen(false)} 
        metrics={boardMetrics}
        onChange={setBoardMetrics}
      />
      <TeamManagementDetailModal
        isOpen={teamDetailModalOpen}
        onClose={() => setTeamDetailModalOpen(false)}
        initialScope={teamFilter === 'direct' ? '直辖室' : teamFilter === 'district' ? '营业区' : '所辖'}
      />

      <AnimatePresence>
        {view === ViewType.MY_INCOME && (
          <MyIncome 
            isOpen={view === ViewType.MY_INCOME} 
            onClose={() => setView(ViewType.PERSONAL)} 
          />
        )}
        {view === ViewType.TEAM_PERFORMANCE && (
          <TeamPerformance 
            isOpen={view === ViewType.TEAM_PERFORMANCE} 
            onClose={() => setView(ViewType.PERSONAL)} 
          />
        )}
        {view === ViewType.HONGYUN_ZONE && (
          <HongyunZone 
            isOpen={view === ViewType.HONGYUN_ZONE} 
            onClose={() => setView(ViewType.PERSONAL)} 
          />
        )}
        {view === ViewType.SUPERVISOR_INCOME && (
          <SupervisorIncomeCalculator 
            isOpen={view === ViewType.SUPERVISOR_INCOME} 
            onClose={() => setView(ViewType.PERSONAL)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;
