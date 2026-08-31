import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Check,
  X,
  TrendingUp,
  Calendar,
  ShieldCheck,
  DollarSign,
  Users,
  Compass,
  UserCheck,
  CheckCircle,
  Target,
  Clock,
  FileText,
  BarChart3,
  Search,
  ChevronDown,
} from 'lucide-react';
import { PerformanceStats } from './types';
import {
  P2_POLICIES,
  P2_AWARD_NAME,
  buildP2AwardSummary,
  p2ApeQualifies,
  ciPiecesOf,
  SSY_POLICIES,
  SSY_AWARD_NAME,
  buildSsyAwardSummary,
  isPension,
  isCare,
  Phase2RulesPanel,
  SsyRulesPanel,
} from './scheme-p2-ssy';
import type { ExtraPolicy } from './scheme-p2-ssy';

export type SchemeId = 'p1' | 'p2' | 'ssy';

interface CompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PerformanceStats;
  isAmountHidden: boolean;
  scheme?: SchemeId;
  ended?: boolean;   // 已结束视图：不展示倒计时，保单按"基本都已过犹、个别未签发"假设
}

// ─── 保单级别 Mock 数据 ──
interface Policy {
  id: string;
  product: string;      // 产品简称
  payYears: string;     // 缴费年限
  holderName: string;   // 投保人姓名
  premium: number;
  ape: number;
  submitDate: string;
  issueDate: string;
  hesitationEnd?: string | null; // 不填则按签发日+15天；null 表示核心系统取不到
  submitted: boolean;
  issued: boolean;
  coolingOff: boolean;
  riderApe?: number;
  riderName?: string;
  awardTags?: string[];
  splitFlag?: boolean; // 拆单件：同一投保人同一险种同缴费期间多张保单合计为1件
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const MOCK_TODAY = '2026-01-02';

function hesitationEndOf(p: Policy): string | null {
  if (p.hesitationEnd === null || p.issueDate === '') return null;
  return p.hesitationEnd || addDays(p.issueDate, 15);
}

function currentStatusOf(p: Policy): string {
  if (p.coolingOff) return '已过犹';
  if (p.issued) return '已签发';
  return '已递交';
}

const AWARD_NAME: Record<string, string> = {
  firstDay: '首爆日奖励',
  hongtu: '宏图相伴尊享版奖励',
  big: '大单奖励',
  count: '累计件数奖励',
  ape: '累计APE奖励',
};

function qualifiesForAward(p: Policy, key: string): boolean {
  if (key === 'hongtu') return p.product.includes('宏图相伴尊享版');
  if (key === 'big') return p.ape >= 500000;
  if (key === 'count') return p.ape >= 50000;
  if (key === 'ape') return true;
  if (key === 'firstDay') {
    return p.submitDate === '2025-12-01' && p.issueDate >= '2026-01-01' && p.issueDate <= '2026-01-15';
  }
  return false;
}

/** 跨方案奖项合格判定：p1 用本地规则，p2/双税优用各自方案规则 */
function qualifiesInScheme(scheme: SchemeId, p: Policy, key: string): boolean {
  if (scheme === 'p2') return key === 'ape' ? p2ApeQualifies(p as ExtraPolicy) : ciPiecesOf(p as ExtraPolicy).length > 0;
  if (scheme === 'ssy') return key === 'pension' ? isPension(p as ExtraPolicy) : isCare(p as ExtraPolicy);
  return qualifiesForAward(p, key);
}

function awardsOf(p: Policy): string[] {
  if (p.awardTags?.length) return p.awardTags;
  return (['firstDay', 'hongtu', 'big', 'count', 'ape'] as const)
    .filter((key) => qualifiesForAward(p, key))
    .map((key) => AWARD_NAME[key]);
}

type PolicySeed = Omit<Policy, 'submitted' | 'issued' | 'coolingOff'>;

function hydratePolicy(seed: PolicySeed, today: string): Policy {
  const submitted = seed.submitDate <= today;
  const issued = seed.issueDate !== '' && seed.issueDate <= today;   // 空签发日 = 未签发
  const end = seed.issueDate === '' ? null : (seed.hesitationEnd === null ? null : (seed.hesitationEnd ?? addDays(seed.issueDate, 15)));
  const coolingOff = issued && end !== null && end <= today;
  return { ...seed, submitted, issued, coolingOff };
}

/** 拆单口径（ADO-2023-058）：同一投保人、同一缴费期间、同一险种的多张保单合计为 1 件 */
function countAsNetPieces(policies: Policy[]): number {
  return new Set(policies.map((p) => `${p.holderName}|${p.product}|${p.payYears}`)).size;
}

// 预售：递交时即填写签发日。是否已签发/已过犹按今天相对签发日、签发日+15天判断
const MOCK_POLICY_SEEDS: PolicySeed[] = [
  { id: 'A102840410', product: '宏图相伴尊享版', payYears: '3年', holderName: '周建国', premium: 80000, ape: 80000, submitDate: '2025-12-01', issueDate: '2026-01-01' },
  { id: 'A102840420', product: '宏图相伴尊享版', payYears: '3年', holderName: '周建国', premium: 40000, ape: 40000, submitDate: '2025-12-01', issueDate: '2026-01-02', splitFlag: true },
  { id: 'A102840411', product: '宏图相伴尊享版', payYears: '3年', holderName: '吴芳', premium: 90000, ape: 90000, submitDate: '2025-12-02', issueDate: '2026-01-01' },
  { id: 'A102840412', product: '乐享丰年心享版', payYears: '3年', holderName: '郑浩', premium: 520000, ape: 520000, submitDate: '2025-12-03', issueDate: '2026-01-01' },
  { id: 'A102840417', product: '宏图相伴尊享版', payYears: '3年', holderName: '钱涛', premium: 65000, ape: 65000, submitDate: '2025-12-04', issueDate: '2026-01-02' },
  { id: 'A102840418', product: '乐享丰年心享版', payYears: '3年', holderName: '冯雪', premium: 55000, ape: 55000, submitDate: '2025-12-05', issueDate: '2026-01-02' },
  { id: 'A102840398', product: '宏图相伴尊享版', payYears: '3年', holderName: '王小明', premium: 50000, ape: 50000, submitDate: '2025-12-01', issueDate: '2026-01-01' },
  { id: 'A102840413', product: '宏图相伴尊享版', payYears: '3年', holderName: '孙丽华', premium: 120000, ape: 120000, submitDate: '2025-12-08', issueDate: '2026-01-01' },
  { id: 'A102840414', product: '乐享丰年心享版', payYears: '3年', holderName: '黄伟', premium: 1000000, ape: 1000000, submitDate: '2025-12-10', issueDate: '2026-01-01' },
  { id: 'A102840415', product: '宏图相伴尊享版', payYears: '3年', holderName: '马晓东', premium: 70000, ape: 70000, submitDate: '2025-12-15', issueDate: '2026-01-02' },
  { id: 'A102840416', product: '乐享丰年心享版', payYears: '3年', holderName: '林佳', premium: 60000, ape: 60000, submitDate: '2025-12-18', issueDate: '2026-01-03' },
  { id: 'A102840419', product: '宏图相伴尊享版', payYears: '3年', holderName: '何静', premium: 50000, ape: 50000, submitDate: '2025-12-01', issueDate: '2026-01-08' },
  { id: 'A102840399', product: '宏图相伴尊享版', payYears: '3年', holderName: '张美丽', premium: 600000, ape: 600000, submitDate: '2025-12-05', issueDate: '2026-01-05' },
  { id: 'A102840400', product: '乐享丰年心享版', payYears: '3年', holderName: '李志强', premium: 1200000, ape: 1200000, submitDate: '2025-12-25', issueDate: '2026-01-25' },
  { id: 'A102840402', product: '宏图相伴尊享版', payYears: '3年', holderName: '刘大伟', premium: 80000, ape: 80000, submitDate: '2025-12-22', issueDate: '2026-01-02', hesitationEnd: null },
  { id: 'A102840401', product: '健康守卫A款', payYears: '10年', holderName: '陈小红', premium: 6000, ape: 6000, submitDate: '2025-12-26', issueDate: '2026-01-26', hesitationEnd: null },
  { id: 'A102840403', product: '健康守卫B款', payYears: '10年', holderName: '赵美玲', premium: 50000, ape: 50000, submitDate: '2025-12-28', issueDate: '2026-01-01' },
];

const MOCK_POLICIES: Policy[] = MOCK_POLICY_SEEDS.map((s) => hydratePolicy(s, MOCK_TODAY));

// ─── 已结束（历史）视图数据：竞赛已结束，假设全部已递交、基本都已过犹，个别未签发 ───
const ENDED_TODAY = '2026-03-02';   // 过犹截止(02-28)之后，模拟"竞赛已结束"时点
const ENDED_NOT_ISSUED_IDS = new Set(['A102840401', 'A102840416']);   // 陈小红、林佳：递交了但最终未签发
const ENDED_POLICIES: Policy[] = MOCK_POLICY_SEEDS.map((s) => {
  if (ENDED_NOT_ISSUED_IDS.has(s.id)) return hydratePolicy({ ...s, issueDate: '', hesitationEnd: null }, ENDED_TODAY);
  if (s.id === 'A102840402') return hydratePolicy({ ...s, hesitationEnd: '' }, ENDED_TODAY);   // 刘大伟：补全犹豫期止期
  return hydratePolicy(s, ENDED_TODAY);
});

type AwardStage = 'submit' | 'issue' | 'cooling';

function policiesForAward(key: string, pool: Policy[] = MOCK_POLICIES): Policy[] {
  return pool.filter((p) => qualifiesForAward(p, key));
}

/** 漏斗累计：已递交 ⊃ 已签发 ⊃ 已过犹，与卡片件数、预达成签发口径同一套 */
function inStage(p: Policy, stage: AwardStage): boolean {
  if (stage === 'cooling') return p.coolingOff;
  if (stage === 'issue') return p.issued;
  return p.submitted;
}

function policiesForAwardStage(key: string, stage: AwardStage, pool: Policy[] = MOCK_POLICIES): Policy[] {
  const rank = (p: Policy) => (!p.issued ? 0 : !p.coolingOff ? 1 : 2);
  return policiesForAward(key, pool)
    .filter((p) => inStage(p, stage))
    .sort((a, b) => rank(a) - rank(b) || a.submitDate.localeCompare(b.submitDate));
}

const STAGE_META: Record<AwardStage, { label: string }> = {
  submit: { label: '已递交' },
  issue: { label: '已签发' },
  cooling: { label: '已过犹' },
};

// ─── 奖项档位常量 ───
// 累计件数奖档位（仅计 APE≥5万 的合格保单）：5件¥2,888 / 10件¥5,888 / 15件¥18,888
const COUNT_TIER_REWARDS = [
  { min: 5, reward: 2888 },
  { min: 10, reward: 5888 },
  { min: 15, reward: 18888 },
];

// 累计APE奖档位：20万¥1,600 / 30万¥2,700 / 50万¥5,000 / 100万¥11,000 / 200万¥24,000 / 500万¥75,000 / 1000万¥250,000
const APE_TIER_REWARDS = [
  { min: 200000, reward: 1600 },
  { min: 300000, reward: 2700 },
  { min: 500000, reward: 5000 },
  { min: 1000000, reward: 11000 },
  { min: 2000000, reward: 24000 },
  { min: 5000000, reward: 75000 },
  { min: 10000000, reward: 250000 },
];

// ─── 倒计时环组件 ───
// 变色规则：>14 天绿色；8~14 天琥珀色；≤7 天红色；已截止红色
// 满环基准 = 从方案起点 2025-12-01 到该截止日的完整天数（totalDays）
const CountdownRing: React.FC<{ daysLeft: number; label: string; deadline: string; totalDays: number; ended?: boolean }> = ({ daysLeft, label, deadline, totalDays, ended = false }) => {
  const isExpired = daysLeft <= 0;
  const isCritical = daysLeft <= 7 && !isExpired;                  // ≤7 天：红
  const isWarning = daysLeft <= 14 && !isCritical && !isExpired;   // 8~14 天：琥珀
  const progress = ended ? 0 : Math.max(0, Math.min(100, daysLeft / totalDays * 100));
  const circumference = 2 * Math.PI * 26;
  const offset = circumference * (1 - progress / 100);

  let strokeColor = '#D80D18';
  let labelColor = 'text-[#D80D18]';
  let statusText = '天 剩余';
  if (isExpired) {
    strokeColor = '#D80D18';
    labelColor = 'text-[#D80D18]';
    statusText = '已截止';
  } else if (isCritical) {
    strokeColor = 'url(#urgentGradient)';
    labelColor = 'text-[#D80D18]';
    statusText = '天 紧迫';
  } else if (isWarning) {
    strokeColor = '#CB9A59';
    labelColor = 'text-[#B5873F]';
    statusText = '天 临近';
  }

  return (
    <div className="flex flex-col items-center gap-1 min-w-[68px]">
      <div className="relative w-[72px] h-[72px] drop-shadow-[0_0_8px_rgba(239,68,68,0.25)]">
        <svg className="w-full h-full transform -rotate-90">
          {isCritical && (
            <defs>
              <linearGradient id="urgentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#CB9A59" />
                <stop offset="100%" stopColor="#D80D18" />
              </linearGradient>
            </defs>
          )}
          <circle cx="36" cy="36" r="26" stroke="#E5E7EB" strokeWidth="5" fill="transparent" />
          <circle
            cx="36" cy="36" r="26"
            stroke={strokeColor}
            strokeWidth="5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {ended ? (
            <span className="text-[9px] font-black leading-tight text-[#D80D18]">已结束</span>
          ) : (
            <>
              <span className={`text-sm font-black tracking-tight leading-none ${isExpired ? 'text-[#D80D18]' : isCritical ? 'text-[#D80D18]' : 'text-[#A40000]'}`}>
                {isExpired ? '0' : daysLeft}
              </span>
              <span className={`text-[7px] font-bold mt-0.5 ${labelColor}`}>{statusText}</span>
            </>
          )}
        </div>
      </div>
      <div className="text-center">
        <div className="text-[8px] text-slate-500 font-bold">{label}</div>
        <div className="text-[8px] text-slate-700 font-black">{deadline}</div>
      </div>
    </div>
  );
};

// ─── 保单状态指示器 ───
const StatusDot: React.FC<{ active: boolean; label: string; color: string }> = ({ active, label, color }) => (
  <div className="flex items-center gap-1">
    {active ? (
      <CheckCircle className="w-3.5 h-3.5" style={{ color }} />
    ) : (
      <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200" />
    )}
    <span className={`text-[8px] font-bold ${active ? '' : 'text-slate-300'}`} style={{ color: active ? color : undefined }}>{label}</span>
  </div>
);

const Field: React.FC<{ label: string; value: string; danger?: boolean }> = ({ label, value, danger }) => (
  <div className="min-w-0">
    <div className="text-[8px] text-slate-400 font-bold">{label}</div>
    <div className={`text-[11px] font-black mt-0.5 truncate ${danger ? 'text-[#D80D18]' : 'text-slate-800'}`}>{value}</div>
  </div>
);

const PolicyListScreen: React.FC<{
  title?: string;
  subtitle?: string;
  highlightAward?: string;
  policies: Policy[];
  initialStage?: AwardStage | null;
  initialAward?: string | null;
  awardOptions?: { key: string; name: string }[];
  qualifier?: (p: Policy, key: string) => boolean;
  onBack: () => void;
  onOpenInquiry: (p: Policy) => void;
}> = ({ title = '保单明细', subtitle, highlightAward, policies, initialStage = null, initialAward = null, awardOptions = [], qualifier, onBack, onOpenInquiry }) => {
  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<AwardStage | null>(initialStage);
  const [awardFilter, setAwardFilter] = useState<string | null>(initialAward);
  const [stageOpen, setStageOpen] = useState(false);
  const [awardOpen, setAwardOpen] = useState(false);
  const stageOptions: { key: AwardStage | 'all'; label: string }[] = [
    { key: 'all', label: '全部状态' },
    { key: 'submit', label: STAGE_META.submit.label },
    { key: 'issue', label: STAGE_META.issue.label },
    { key: 'cooling', label: STAGE_META.cooling.label },
  ];
  const stageLabel = stageFilter ? STAGE_META[stageFilter].label : '全部状态';
  const awardLabel = awardFilter ? (awardOptions.find((o) => o.key === awardFilter)?.name ?? '全部奖励') : '全部奖励';
  const filtered = policies
    .filter(p => !stageFilter || (stageFilter === 'submit' ? p.submitted : stageFilter === 'issue' ? p.issued : p.coolingOff))
    .filter(p => !awardFilter || (qualifier ? qualifier(p, awardFilter) : qualifiesForAward(p, awardFilter)))
    .filter(p => p.holderName.includes(query.trim()))
    .sort((a, b) => b.issueDate.localeCompare(a.issueDate));
  return (
    <div className="absolute inset-0 z-[20] bg-[#F6F7F8] flex flex-col">
      <div className="bg-white border-b border-slate-100/80 flex items-center justify-between px-4 py-3.5 pt-8 shrink-0">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 active:scale-95">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center px-2 min-w-0">
          <h3 className="text-base font-black text-slate-800 tracking-tight truncate">{title}</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {subtitle ? `${subtitle} · ` : ''}{filtered.length} 张
          </p>
        </div>
        <div className="w-9" />
      </div>
      <div className="px-4 pt-3 shrink-0">
        <div className="flex items-center gap-2">
          {/* 姓名搜索框（缩短，与两个下拉同排） */}
          <div className="flex-1 min-w-0 flex items-center gap-1.5 bg-white border border-slate-200/80 rounded-2xl px-3 py-2.5">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="按姓名搜索"
              className="flex-1 min-w-0 text-xs text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
            />
          </div>
          {/* 状态下拉 */}
          <div className="relative shrink-0">
            <button
              onClick={() => { setStageOpen(!stageOpen); setAwardOpen(false); }}
              className={`flex items-center gap-1 rounded-2xl border px-2.5 py-2.5 transition ${stageFilter !== null ? 'bg-[#FDF3F3] border-[#F9DBDC]' : 'bg-white border-slate-200/80'}`}
            >
              <span className={`text-[9px] font-black max-w-[56px] truncate ${stageFilter !== null ? 'text-[#BE060C]' : 'text-slate-600'}`}>{stageLabel}</span>
              <ChevronDown className={`w-3 h-3 transition ${stageOpen ? 'rotate-180' : ''} ${stageFilter !== null ? 'text-[#BE060C]' : 'text-slate-400'}`} />
            </button>
            {stageOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setStageOpen(false)} />
                <div className="absolute right-0 top-full mt-1.5 z-40 w-32 bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-900/10 py-1">
                  {stageOptions.map((opt) => {
                    const active = opt.key === 'all' ? stageFilter === null : stageFilter === opt.key;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => { setStageFilter(opt.key === 'all' ? null : opt.key); setStageOpen(false); }}
                        className={`w-full flex items-center justify-between text-left text-[9px] font-black px-3 py-2 ${active ? 'text-[#BE060C] bg-[#FDF3F3]' : 'text-slate-600'}`}
                      >
                        {opt.label}
                        {active && <Check className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          {/* 奖励方案类别下拉 */}
          <div className="relative shrink-0">
            <button
              onClick={() => { setAwardOpen(!awardOpen); setStageOpen(false); }}
              className={`flex items-center gap-1 rounded-2xl border px-2.5 py-2.5 transition ${awardFilter !== null ? 'bg-[#FDF3F3] border-[#F9DBDC]' : 'bg-white border-slate-200/80'}`}
            >
              <span className={`text-[9px] font-black max-w-[56px] truncate ${awardFilter !== null ? 'text-[#BE060C]' : 'text-slate-600'}`}>{awardLabel}</span>
              <ChevronDown className={`w-3 h-3 transition ${awardOpen ? 'rotate-180' : ''} ${awardFilter !== null ? 'text-[#BE060C]' : 'text-slate-400'}`} />
            </button>
            {awardOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setAwardOpen(false)} />
                <div className="absolute right-0 top-full mt-1.5 z-40 w-44 bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-900/10 py-1 max-h-56 overflow-y-auto">
                  <button
                    onClick={() => { setAwardFilter(null); setAwardOpen(false); }}
                    className={`w-full flex items-center justify-between text-left text-[9px] font-black px-3 py-2 ${awardFilter === null ? 'text-[#BE060C] bg-[#FDF3F3]' : 'text-slate-600'}`}
                  >
                    全部奖励
                    {awardFilter === null && <Check className="w-3 h-3" />}
                  </button>
                  {awardOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => { setAwardFilter(opt.key); setAwardOpen(false); }}
                      className={`w-full flex items-center justify-between text-left text-[9px] font-black px-3 py-2 ${awardFilter === opt.key ? 'text-[#BE060C] bg-[#FDF3F3]' : 'text-slate-600'}`}
                    >
                      {opt.name}
                      {awardFilter === opt.key && <Check className="w-3 h-3 shrink-0" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2.5">
        {filtered.length === 0 && (
          <p className="text-center text-[10px] text-slate-400 font-medium py-10">无匹配保单</p>
        )}
        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => onOpenInquiry(p)}
            className="w-full text-left bg-white rounded-2xl border border-slate-100 px-3.5 py-3 active:bg-slate-50 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-black text-slate-800">{p.holderName}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-slate-400">{p.id}</span>
                  {p.splitFlag && (
                    <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-[#FDF3F3] text-[#D80D18] border border-[#F9DBDC]">拆单件</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0 pt-0.5">
                <StatusDot active={p.submitted} label="递交" color="#CB9A59" />
                <StatusDot active={p.issued} label="签发" color="#CB9A59" />
                <StatusDot active={p.coolingOff} label="过犹" color="#CB9A59" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-x-2 gap-y-2 mt-2.5">
              <Field label="产品简称" value={p.product} />
              <Field label="缴费年限" value={p.payYears} />
              <Field label="APE" value={`¥${p.ape.toLocaleString()}`} />
              {p.riderName && <Field label={p.riderName} value={`¥${(p.riderApe ?? 0).toLocaleString()}`} />}
              <Field label="递交日" value={p.submitDate} />
              <Field label="签发日" value={p.issueDate || '—'} />
              <Field label="犹豫期截止日" value={hesitationEndOf(p) ?? '—'} danger={hesitationEndOf(p) === null} />
            </div>
            <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-slate-50">
              {awardsOf(p).map((name) => {
                const on = highlightAward === name;
                return (
                <span
                  key={name}
                  className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                    on
                      ? 'text-[#A40000] bg-[#F9DBDC] border border-[#F5C3C5]'
                      : 'text-[#BE060C] bg-[#FDF3F3] border border-[#F9DBDC]'
                  }`}
                >
                  {name}
                </span>
                );
              })}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const PolicyInquiryScreen: React.FC<{
  policy: Policy;
  onBack: () => void;
}> = ({ policy, onBack }) => {
  const status = currentStatusOf(policy);
  const rows: [string, string, boolean?][] = [
    ['保单号', policy.id],
    ['投保人姓名', policy.holderName],
    ['产品简称', policy.product],
    ['缴费年限', policy.payYears],
    ['APE', `¥${policy.ape.toLocaleString()}`],
    ['递交日', policy.submitDate],
    ['签发日', policy.issueDate || '—'],
    ['犹豫期截止日', hesitationEndOf(policy) ?? '—', hesitationEndOf(policy) === null],
    ['保单状态', status],
    ['参与奖励', awardsOf(policy).join('、')],
  ];
  if (policy.riderName) {
    rows.splice(5, 0, [policy.riderName, `APE ¥${(policy.riderApe ?? 0).toLocaleString()}`]);
  }
  if (policy.splitFlag) {
    rows.splice(rows.length - 1, 0, ['拆单标识', '拆单件', true]);
  }
  return (
    <div className="absolute inset-0 z-[30] bg-[#F6F7F8] flex flex-col">
      <div className="bg-white border-b border-slate-100/80 flex items-center justify-between px-4 py-3.5 pt-8 shrink-0">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 active:scale-95">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-base font-black text-slate-800 tracking-tight">保单查询</h3>
        <div className="w-9" />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-[#F2E0C8] bg-[#FFF7E9] px-3 py-2">
          <FileText className="w-3.5 h-3.5 text-[#CB9A59] shrink-0" />
          <p className="text-[10px] font-bold text-[#8A6A33]">本页面后续参照 AMA 现有保单明细页开发</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {rows.map(([label, value, danger], i) => (
            <div key={label} className={`flex items-start justify-between gap-3 px-4 py-3 ${i > 0 ? 'border-t border-slate-50' : ''}`}>
              <span className="text-[10px] text-slate-400 font-bold shrink-0">{label}</span>
              <span className={`text-[11px] font-black text-right ${danger ? 'text-[#D80D18]' : 'text-slate-800'}`}>{value}</span>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-slate-400 leading-relaxed mt-3 px-1">
          * 犹豫期截止日默认按签发日加15天显示，实际以核心系统犹豫期止期为准；核心系统未取到的保单以红色横杠展示
        </p>
      </div>
    </div>
  );
};

// ─── 全国排名 Mock 数据（参照最初版本） ───
interface RankingRow {
  rank: number;
  branch: string;
  agentId: string;
  name: string;
  value: string;
  isSelf?: boolean;
}

interface RankingMetricDef {
  id: string;
  label: string;
  myRank: string;
  myValue: string;
  rows: RankingRow[];
}

const RANKING_BY_SCHEME: Record<SchemeId, RankingMetricDef[]> = {
  p1: [
    {
      id: 'p1_main_ape',
      label: '主险累计 APE',
      myRank: '第 12 名',
      myValue: '¥1,200,000',
      rows: [
        { rank: 1, branch: '广东分公司', agentId: '80011293', name: '陈静怡', value: '¥3,850,000' },
        { rank: 2, branch: '上海分公司', agentId: '80009182', name: '林伟杰', value: '¥3,210,000' },
        { rank: 3, branch: '北京分公司', agentId: '80015520', name: '郭建国', value: '¥2,980,000' },
        { rank: 4, branch: '浙江分公司', agentId: '80020194', name: '许晓梅', value: '¥2,650,000' },
        { rank: 5, branch: '江苏分公司', agentId: '80031849', name: '黄嘉明', value: '¥2,420,000' },
        { rank: 6, branch: '四川分公司', agentId: '80017732', name: '赵丽萍', value: '¥2,150,000' },
        { rank: 7, branch: '深圳分公司', agentId: '80024910', name: '周志强', value: '¥1,980,000' },
        { rank: 8, branch: '湖北分公司', agentId: '80010382', name: '吴佩芬', value: '¥1,760,000' },
        { rank: 9, branch: '福建分公司', agentId: '80028817', name: '郑一鸣', value: '¥1,540,000' },
        { rank: 10, branch: '上海分公司', agentId: '80014290', name: '孙雅婷', value: '¥1,380,000' },
        { rank: 12, branch: '上海分公司', agentId: '80029314', name: '王立强 (我)', value: '¥1,200,000', isSelf: true },
      ],
    },
    {
      id: 'p1_hongtu_ape',
      label: '宏图相伴 APE',
      myRank: '第 15 名',
      myValue: '¥200,000',
      rows: [
        { rank: 1, branch: '上海分公司', agentId: '80009182', name: '林伟杰', value: '¥1,200,000' },
        { rank: 2, branch: '广东分公司', agentId: '80011293', name: '陈静怡', value: '¥980,000' },
        { rank: 3, branch: '浙江分公司', agentId: '80020194', name: '许晓梅', value: '¥850,000' },
        { rank: 4, branch: '北京分公司', agentId: '80015520', name: '郭建国', value: '¥720,000' },
        { rank: 5, branch: '江苏分公司', agentId: '80031849', name: '黄嘉明', value: '¥610,000' },
        { rank: 6, branch: '四川分公司', agentId: '80017732', name: '赵丽萍', value: '¥520,000' },
        { rank: 7, branch: '深圳分公司', agentId: '80024910', name: '周志强', value: '¥450,000' },
        { rank: 8, branch: '湖北分公司', agentId: '80010382', name: '吴佩芬', value: '¥380,000' },
        { rank: 9, branch: '福建分公司', agentId: '80028817', name: '郑一鸣', value: '¥310,000' },
        { rank: 10, branch: '上海分公司', agentId: '80014290', name: '孙雅婷', value: '¥260,000' },
        { rank: 15, branch: '上海分公司', agentId: '80029314', name: '王立强 (我)', value: '¥200,000', isSelf: true },
      ],
    },
    {
      id: 'p1_qualifying_count',
      label: '达标件数',
      myRank: '第 8 名',
      myValue: '8 件',
      rows: [
        { rank: 1, branch: '广东分公司', agentId: '80011293', name: '陈静怡', value: '22 件' },
        { rank: 2, branch: '北京分公司', agentId: '80015520', name: '郭建国', value: '19 件' },
        { rank: 3, branch: '上海分公司', agentId: '80009182', name: '林伟杰', value: '16 件' },
        { rank: 4, branch: '浙江分公司', agentId: '80020194', name: '许晓梅', value: '14 件' },
        { rank: 5, branch: '江苏分公司', agentId: '80031849', name: '黄嘉明', value: '12 件' },
        { rank: 6, branch: '四川分公司', agentId: '80017732', name: '赵丽萍', value: '10 件' },
        { rank: 7, branch: '深圳分公司', agentId: '80024910', name: '周志强', value: '9 件' },
        { rank: 8, branch: '上海分公司', agentId: '80029314', name: '王立强 (我)', value: '8 件', isSelf: true },
        { rank: 9, branch: '湖北分公司', agentId: '80010382', name: '吴佩芬', value: '7 件' },
        { rank: 10, branch: '福建分公司', agentId: '80028817', name: '郑一鸣', value: '6 件' },
      ],
    },
  ],
  p2: [
    {
      id: 'p2_main_ape',
      label: '主险累计 APE',
      myRank: '第 18 名',
      myValue: '¥250,000',
      rows: [
        { rank: 1, branch: '北京分公司', agentId: '80015520', name: '郭建国', value: '¥1,680,000' },
        { rank: 2, branch: '广东分公司', agentId: '80011293', name: '陈静怡', value: '¥1,420,000' },
        { rank: 3, branch: '浙江分公司', agentId: '80020194', name: '许晓梅', value: '¥1,250,000' },
        { rank: 4, branch: '上海分公司', agentId: '80009182', name: '林伟杰', value: '¥1,100,000' },
        { rank: 5, branch: '江苏分公司', agentId: '80031849', name: '黄嘉明', value: '¥920,000' },
        { rank: 6, branch: '四川分公司', agentId: '80017732', name: '赵丽萍', value: '¥780,000' },
        { rank: 7, branch: '深圳分公司', agentId: '80024910', name: '周志强', value: '¥650,000' },
        { rank: 8, branch: '湖北分公司', agentId: '80010382', name: '吴佩芬', value: '¥540,000' },
        { rank: 9, branch: '福建分公司', agentId: '80028817', name: '郑一鸣', value: '¥460,000' },
        { rank: 10, branch: '上海分公司', agentId: '80014290', name: '孙雅婷', value: '¥390,000' },
        { rank: 18, branch: '上海分公司', agentId: '80029314', name: '王立强 (我)', value: '¥250,000', isSelf: true },
      ],
    },
    {
      id: 'p2_huli_count',
      label: '重疾康养总件数',
      myRank: '第 9 名',
      myValue: '4 件',
      rows: [
        { rank: 1, branch: '江苏分公司', agentId: '80031849', name: '黄嘉明', value: '15 件' },
        { rank: 2, branch: '广东分公司', agentId: '80011293', name: '陈静怡', value: '12 件' },
        { rank: 3, branch: '上海分公司', agentId: '80009182', name: '林伟杰', value: '10 件' },
        { rank: 4, branch: '北京分公司', agentId: '80015520', name: '郭建国', value: '8 件' },
        { rank: 5, branch: '浙江分公司', agentId: '80020194', name: '许晓梅', value: '7 件' },
        { rank: 6, branch: '四川分公司', agentId: '80017732', name: '赵丽萍', value: '6 件' },
        { rank: 7, branch: '深圳分公司', agentId: '80024910', name: '周志强', value: '5 件' },
        { rank: 8, branch: '湖北分公司', agentId: '80010382', name: '吴佩芬', value: '5 件' },
        { rank: 9, branch: '上海分公司', agentId: '80029314', name: '王立强 (我)', value: '4 件', isSelf: true },
        { rank: 10, branch: '福建分公司', agentId: '80028817', name: '郑一鸣', value: '3 件' },
      ],
    },
    {
      id: 'p2_high_count',
      label: '高档重疾件数',
      myRank: '第 11 名',
      myValue: '2 件',
      rows: [
        { rank: 1, branch: '江苏分公司', agentId: '80031849', name: '黄嘉明', value: '10 件' },
        { rank: 2, branch: '广东分公司', agentId: '80011293', name: '陈静怡', value: '8 件' },
        { rank: 3, branch: '上海分公司', agentId: '80009182', name: '林伟杰', value: '7 件' },
        { rank: 4, branch: '北京分公司', agentId: '80015520', name: '郭建国', value: '6 件' },
        { rank: 5, branch: '浙江分公司', agentId: '80020194', name: '许晓梅', value: '5 件' },
        { rank: 6, branch: '四川分公司', agentId: '80017732', name: '赵丽萍', value: '4 件' },
        { rank: 7, branch: '深圳分公司', agentId: '80024910', name: '周志强', value: '3 件' },
        { rank: 8, branch: '湖北分公司', agentId: '80010382', name: '吴佩芬', value: '3 件' },
        { rank: 9, branch: '福建分公司', agentId: '80028817', name: '郑一鸣', value: '2 件' },
        { rank: 10, branch: '上海分公司', agentId: '80014290', name: '孙雅婷', value: '2 件' },
        { rank: 11, branch: '上海分公司', agentId: '80029314', name: '王立强 (我)', value: '2 件', isSelf: true },
      ],
    },
  ],
  ssy: [
    {
      id: 'ssy_total_count',
      label: '双税优累计总件数',
      myRank: '第 5 名',
      myValue: '10 件 (个养6件 + 护理4件)',
      rows: [
        { rank: 1, branch: '广东分公司', agentId: '80011293', name: '陈静怡', value: '36 件 (个养22+护理14)' },
        { rank: 2, branch: '浙江分公司', agentId: '80020194', name: '许晓梅', value: '28 件 (个养18+护理10)' },
        { rank: 3, branch: '北京分公司', agentId: '80015520', name: '郭建国', value: '24 件 (个养15+护理9)' },
        { rank: 4, branch: '江苏分公司', agentId: '80031849', name: '黄嘉明', value: '18 件 (个养11+护理7)' },
        { rank: 5, branch: '上海分公司', agentId: '80029314', name: '王立强 (我)', value: '10 件 (个养6+护理4)', isSelf: true },
        { rank: 6, branch: '湖北分公司', agentId: '80010382', name: '吴佩芬', value: '9 件 (个养5+护理4)' },
        { rank: 7, branch: '福建分公司', agentId: '80028817', name: '郑一鸣', value: '8 件 (个养5+护理3)' },
        { rank: 8, branch: '四川分公司', agentId: '80017732', name: '赵丽萍', value: '7 件 (个养4+护理3)' },
        { rank: 9, branch: '深圳分公司', agentId: '80024910', name: '周志强', value: '6 件 (个养4+护理2)' },
        { rank: 10, branch: '上海分公司', agentId: '80014290', name: '孙雅婷', value: '5 件 (个养3+护理2)' },
      ],
    },
    {
      id: 'ssy_geyang_count',
      label: '个人养老金件数',
      myRank: '第 5 名',
      myValue: '6 件',
      rows: [
        { rank: 1, branch: '广东分公司', agentId: '80011293', name: '陈静怡', value: '22 件' },
        { rank: 2, branch: '浙江分公司', agentId: '80020194', name: '许晓梅', value: '18 件' },
        { rank: 3, branch: '北京分公司', agentId: '80015520', name: '郭建国', value: '15 件' },
        { rank: 4, branch: '江苏分公司', agentId: '80031849', name: '黄嘉明', value: '11 件' },
        { rank: 5, branch: '上海分公司', agentId: '80029314', name: '王立强 (我)', value: '6 件', isSelf: true },
        { rank: 6, branch: '湖北分公司', agentId: '80010382', name: '吴佩芬', value: '5 件' },
        { rank: 7, branch: '福建分公司', agentId: '80028817', name: '郑一鸣', value: '5 件' },
        { rank: 8, branch: '四川分公司', agentId: '80017732', name: '赵丽萍', value: '4 件' },
        { rank: 9, branch: '深圳分公司', agentId: '80024910', name: '周志强', value: '4 件' },
        { rank: 10, branch: '上海分公司', agentId: '80014290', name: '孙雅婷', value: '3 件' },
      ],
    },
    {
      id: 'ssy_huli_count',
      label: '福佑护理险件数',
      myRank: '第 4 名',
      myValue: '4 件',
      rows: [
        { rank: 1, branch: '广东分公司', agentId: '80011293', name: '陈静怡', value: '14 件' },
        { rank: 2, branch: '浙江分公司', agentId: '80020194', name: '许晓梅', value: '10 件' },
        { rank: 3, branch: '北京分公司', agentId: '80015520', name: '郭建国', value: '9 件' },
        { rank: 4, branch: '上海分公司', agentId: '80029314', name: '王立强 (我)', value: '4 件', isSelf: true },
        { rank: 5, branch: '江苏分公司', agentId: '80031849', name: '黄嘉明', value: '4 件' },
        { rank: 6, branch: '湖北分公司', agentId: '80010382', name: '吴佩芬', value: '4 件' },
        { rank: 7, branch: '福建分公司', agentId: '80028817', name: '郑一鸣', value: '3 件' },
        { rank: 8, branch: '四川分公司', agentId: '80017732', name: '赵丽萍', value: '3 件' },
        { rank: 9, branch: '深圳分公司', agentId: '80024910', name: '周志强', value: '2 件' },
        { rank: 10, branch: '上海分公司', agentId: '80014290', name: '孙雅婷', value: '2 件' },
      ],
    },
  ],
};

const AwardPosterScreen: React.FC<{
  awardKey: string;
  awardName: string;
  amountText: string;
  schemeLabel: string;
  onBack: () => void;
}> = ({ awardKey, awardName, amountText, schemeLabel, onBack }) => {
  const copy: Record<string, { kicker: string; lines: string[] }> = {
    firstDay: { kicker: '开门红首爆', lines: ['锁定纪念银币资格', '待过犹后正式发放'] },
    hongtu: { kicker: '尊享版专属', lines: ['签发APE × 2%', '宏图相伴出单嘉奖'] },
    big: { kicker: '大单高光', lines: ['50万档 0.5% / 100万档 1%', '大单推动奖励'] },
    count: { kicker: '件数冲档', lines: ['合格件累计计奖', '5 / 10 / 15 件阶梯'] },
    ape: { kicker: 'APE登顶', lines: ['方案APE累计计奖', '按档位锁定现金'] },
    ci: { kicker: '重疾康养', lines: ['主险与OCR可兼得计件', '按累计净件数阶梯'] },
    pension: { kicker: '个人养老金', lines: ['与护理件数合并定档', '个养按档内单价计奖'] },
    care: { kicker: '福佑护理', lines: ['与个养件数合并定档', '护理按档内单价计奖'] },
  };
  const item = copy[awardKey] ?? copy.ape;
  return (
  <div className="absolute inset-0 z-[40] bg-[#4C0000] flex flex-col">
    <div className="flex items-center justify-between px-4 py-4 pt-8 shrink-0">
      <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h3 className="text-base font-black text-white tracking-tight">获奖海报</h3>
      <div className="w-10" />
    </div>
    <div className="flex-1 overflow-y-auto px-5 pb-8">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#6B0000] via-[#D80D18] to-[#4C0000] p-5 text-white min-h-[520px] flex flex-col">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute bottom-10 -left-8 w-28 h-28 rounded-full bg-white/5" />
        <p className="text-[10px] font-black tracking-[0.2em] text-[#F2DCA8] relative">YINGLING FUTURE</p>
        <p className="text-[11px] font-bold text-[#F9DBDC] mt-1 relative">{schemeLabel}</p>
        <p className="text-[10px] font-black text-[#FFEBC8] mt-4 relative">{item.kicker}</p>
        <h2 className="text-[20px] font-black mt-1 leading-tight relative">{awardName}</h2>
        <p className="text-[14px] font-black mt-3 relative">营销员 李明</p>
        <div className="mt-6 rounded-2xl bg-white/12 border border-white/20 p-4 relative">
          <p className="text-[9px] font-black text-[#F2DCA8] tracking-wide">预达成</p>
          <p className="text-[18px] font-black mt-1">{amountText}</p>
        </div>
        <div className="mt-4 space-y-1.5 relative text-[11px] font-bold text-[#FDF3F3]">
          {item.lines.map((line) => <p key={line}>{line}</p>)}
        </div>
        <p className="mt-auto pt-8 text-[8px] text-white/50 font-medium relative">
          演示海报 · 奖励区间结束后正式开放 · 以过犹豫及结算单为准
        </p>
      </div>
    </div>
  </div>
  );
};

const PHASE1_RULE_FAQS: { q: string; a: string }[] = [
  {
    q: '1. 什么样的保单能计入本方案？',
    a: '须于 2025年12月1日至2026年1月5日期间递交，并于2026年1月1日至2月5日期间签发，且于2026年2月28日（含）前过犹豫期；产品须为指定产品清单内的主险。计件保单还须符合公司寿险保单计件最低业绩标准。',
  },
  {
    q: '2. 拆单件如何计算件数？',
    a: '方案期间签发的同一被保险人、同一缴费期间、同一险种（主险）的多张“指定产品”保单，适用《关于营销员“拆单件”的管控措施（调整方案）》（ADO-2023-058）关于拆单件定义，将合计为1件计入本方案的件数指标核算。',
  },
  {
    q: '3. 自保件、互保件、亲属件能参加吗？',
    a: '根据当地监管要求，自保件/互保件/亲属件不得参与任何形式的业绩考核和业务竞赛的，相关自保件/互保件/亲属件不计入本奖励方案。',
  },
  {
    q: '4. 特别奖励金计不计入基本法和其他竞赛？',
    a: '本奖励方案适用《关于执行品质发展基金管控措施的通知》（适用版）。以上特别奖励金不计入《保险营销员报酬准则及晋升考核标准》（适用版本）中各奖金项的计算，也不计入竞赛期间任何正在执行的其他业绩和招募奖励方案的计算。',
  },
  {
    q: '5. 奖励什么时候发放？还要在职吗？',
    a: '获奖营销员于奖励发放时须仍为中宏人寿保险有限公司之签约营销员。营销员所获特别奖励金随保险营销员2026年2月份佣金奖金一起发放，且以2026年2月份《营销员佣金奖金结算单》为准。获奖营销员需承担相应的所得税。',
  },
  {
    q: '6. 奖励能否转赠给客户？',
    a: '营销员不得将通过竞赛激励方案获得的各类奖励转赠给客户。',
  },
  {
    q: '7. 品质风险或违纪会取消资格吗？',
    a: '如达标营销员于结果公示前最近一次依据相关个险渠道业务品质管理办法被评估为中、高风险的，公司有权取消其达标资格。如达标营销员在结果公示前12个月内受到严重警告及以上违纪违规处罚的，则取消其达标资格；如达标营销员在结果公示前12个月内有违纪违规行为尚在处理中未结案的，则相关奖励暂缓发放，若后续处理结果不影响达标资格，再予以补发。',
  },
  {
    q: '8. 结案后保单变更会追回奖励吗？',
    a: '竞赛结束后12个月内进行的所有保单变更，若其业绩的变化足以影响竞赛成绩，公司将追回得奖营销员之所有奖励。总公司拥有本奖励方案的最终解释权。',
  },
];

const Phase1RulesPanel: React.FC = () => {
  const [yinglingTab, setYinglingTab] = useState<'rewards' | 'products'>('rewards');
  const [openRuleIdx, setOpenRuleIdx] = useState<number | null>(null);
  return (
    <div className="space-y-4">
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60 shadow-inner">
        <button
          onClick={() => setYinglingTab('rewards')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition ${
            yinglingTab === 'rewards' ? 'bg-[#D80D18] text-white shadow-xs' : 'text-slate-500'
          }`}
        >
          奖励方案规则
        </button>
        <button
          onClick={() => setYinglingTab('products')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition ${
            yinglingTab === 'products' ? 'bg-[#D80D18] text-white shadow-xs' : 'text-slate-500'
          }`}
        >
          指定产品与换算规则
        </button>
      </div>

      {yinglingTab === 'rewards' ? (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-1.5">
            <h4 className="text-xs font-black text-slate-800">基本信息</h4>
            <p className="text-[10px] text-slate-600 leading-relaxed">
              <strong>文号：</strong>ADO-2025-054<br />
              <strong>参加对象：</strong>全体营销员<br />
              <strong>活动期间：</strong>2025年12月1日至2026年1月5日期间递交，并于2026年1月1日至2月5日期间签发，且于2026年2月28日（含）前过犹豫期
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-1.5">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-slate-800">(一) 首爆日奖励方案</h4>
              <span className="text-[8.5px] bg-[#FDF3F3] text-[#BE060C] font-bold px-2 py-0.5 rounded-full border border-[#F9DBDC]">纪念银币</span>
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed">
              <strong>活动期间：</strong>2025年12月1日递交，并于2026年1月1日至1月15日期间签发，且于2026年1月31日（含）前过犹豫期。
              <br />
              营销员于活动期间销售指定产品，将可获得<strong className="text-[#7E5A22]">中宏保险30周年专属纪念银币1枚</strong>。每人最多可获得1枚纪念银币。
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-1.5">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-slate-800">(二) 宏图相伴尊享版奖励方案</h4>
              <span className="text-[8.5px] bg-[#FDF3F3] text-[#BE060C] font-bold px-2 py-0.5 rounded-full border border-[#F9DBDC]">特别奖励 2%</span>
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed">
              <strong>活动期间：</strong>2025年12月1日至2026年1月5日期间递交，并于2026年1月1日至2月5日期间签发，且于2026年2月28日（含）前过犹豫期。
              <br />
              营销员于活动期间销售指定产品宏图相伴尊享版，将可获得一次性特别奖励金：
              <br />
              <strong className="text-[#D80D18]">特别奖励金 = 宏图相伴尊享版主险 APE × 2%</strong>
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-1.5">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-slate-800">(三) 大单奖励方案</h4>
              <span className="text-[8.5px] bg-[#FDF3F3] text-[#BE060C] font-bold px-2 py-0.5 rounded-full border border-[#F9DBDC]">最高 1.0%</span>
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed">
              <strong>活动期间：</strong>2025年12月1日至2026年1月5日期间递交，并于2026年1月1日至2月5日期间签发，且于2026年2月28日（含）前过犹豫期。
              <br />
              营销员于活动期间销售任一指定产品并达成以下要求，将可获得一次性特别奖励金：
              <br />
              • 50万 ≤ 单张保单主险APE &lt; 100万：主险APE × <strong className="text-[#D80D18]">0.5%</strong>
              <br />
              • 单张保单主险APE ≥ 100万：主险APE × <strong className="text-[#D80D18]">1%</strong>
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-1.5">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-slate-800">(四) 累计件数奖励方案</h4>
              <span className="text-[8.5px] bg-[#FDF3F3] text-[#BE060C] font-bold px-2 py-0.5 rounded-full border border-[#F9DBDC]">最高 ¥18,888</span>
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed">
              <strong>活动期间：</strong>2025年12月1日至2026年1月5日期间递交，并于2026年1月1日至2月5日期间签发，且于2026年2月28日（含）前过犹豫期。
              <br />
              营销员于活动期间销售任一指定产品且单张保单主险APE ≥ 50,000，并达成以下累计净件数要求，将可获得一次性特别奖励金：
              <br />
              • 累计净件数 [5, 10)：<strong className="text-[#D80D18]">2,888元人民币</strong>
              <br />
              • 累计净件数 [10, 15)：<strong className="text-[#D80D18]">5,888元人民币</strong>
              <br />
              • 累计净件数 ≥ 15：<strong className="text-[#D80D18]">18,888元人民币</strong>
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-1.5">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-slate-800">(五) 累计 APE 阶梯奖励方案</h4>
              <span className="text-[8.5px] bg-[#FDF3F3] text-[#BE060C] font-bold px-2 py-0.5 rounded-full border border-[#F9DBDC]">最高 ¥250,000</span>
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed">
              <strong>活动期间：</strong>2025年12月1日至2026年1月5日期间递交，并于2026年1月1日至2月5日期间签发，且于2026年2月28日（含）前过犹豫期。
              <br />
              营销员于活动期间销售指定产品并达成以下累计APE要求，将可获得一次性特别奖励金（就高不兼得）：
              <br />
              • 20万 ≤ 累计主险APE &lt; 30万：<strong className="text-[#D80D18]">1,600元人民币</strong>
              <br />
              • 30万 ≤ 累计主险APE &lt; 50万：<strong className="text-[#D80D18]">2,700元人民币</strong>
              <br />
              • 50万 ≤ 累计主险APE &lt; 100万：<strong className="text-[#D80D18]">5,000元人民币</strong>
              <br />
              • 100万 ≤ 累计主险APE &lt; 200万：<strong className="text-[#D80D18]">11,000元人民币</strong>
              <br />
              • 200万 ≤ 累计主险APE &lt; 500万：<strong className="text-[#D80D18]">24,000元人民币</strong>
              <br />
              • 500万 ≤ 累计主险APE &lt; 1000万：<strong className="text-[#D80D18]">75,000元人民币</strong>
              <br />
              • 累计主险APE ≥ 1000万：<strong className="text-[#D80D18]">250,000元人民币</strong>
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-3">
            <h4 className="text-xs font-black text-slate-800">指定产品列表</h4>
            <div className="overflow-hidden border border-slate-100 rounded-xl">
              <table className="w-full text-left text-[9.5px]">
                <thead className="bg-[#FDF3F3] font-black text-[#A40000] border-b border-slate-100">
                  <tr>
                    <th className="p-2">序号</th>
                    <th className="p-2">指定产品</th>
                    <th className="p-2">缴费期间</th>
                    <th className="p-2">简称</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  <tr><td className="p-2">1</td><td className="p-2 font-bold text-slate-900">中宏宏图相伴尊享版终身寿险（分红型）(APY)</td><td className="p-2">3年缴</td><td className="p-2 font-bold text-[#D80D18]">宏图相伴尊享版</td></tr>
                  <tr><td className="p-2">2</td><td className="p-2 font-bold text-slate-900">中宏宏图相伴悦享版终身寿险（分红型）(AQR)</td><td className="p-2">3年缴</td><td className="p-2 font-bold text-[#D80D18]">宏图相伴悦享版</td></tr>
                  <tr><td className="p-2">3</td><td className="p-2 font-bold text-slate-900">中宏乐享丰年心享版年金保险 (AOC)</td><td className="p-2">3年缴</td><td className="p-2 font-bold text-[#D80D18]">乐享丰年心享版</td></tr>
                  <tr><td className="p-2">4</td><td className="p-2 font-bold text-slate-900">中宏健康双星守护版重大疾病保险 (CZC)</td><td className="p-2">不限</td><td className="p-2 font-bold text-[#D80D18]">健康双星守护版</td></tr>
                  <tr><td className="p-2">5</td><td className="p-2 font-bold text-slate-900">中宏健康魔方守护版重大疾病保险 (CSQ)</td><td className="p-2">不限</td><td className="p-2 font-bold text-[#D80D18]">健康魔方守护版</td></tr>
                  <tr><td className="p-2">6</td><td className="p-2 font-bold text-slate-900">中宏健康守卫恶性肿瘤 A 款疾病保险 (CCX)</td><td className="p-2">不限</td><td className="p-2 font-bold text-[#D80D18]">健康守卫 A 款</td></tr>
                  <tr><td className="p-2">7</td><td className="p-2 font-bold text-slate-900">中宏健康守卫恶性肿瘤 B 款疾病保险 (CCZ)</td><td className="p-2">不限</td><td className="p-2 font-bold text-[#D80D18]">健康守卫 B 款</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-3">
            <h4 className="text-xs font-black text-slate-800">指定产品主险 APE 计入规则</h4>
            <div className="overflow-hidden border border-slate-100 rounded-xl">
              <table className="w-full text-left text-[10px]">
                <thead className="bg-slate-50 font-black text-slate-700 border-b border-slate-100">
                  <tr>
                    <th className="p-2">缴费期间</th>
                    <th className="p-2">计入规则</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  <tr><td className="p-2 font-bold">趸缴</td><td className="p-2 text-purple-700 font-bold">主险 APE = 年化新单保费 × 10%</td></tr>
                  <tr><td className="p-2 font-bold">非趸缴</td><td className="p-2 text-purple-700 font-bold">主险 APE = 年化新单保费 × 100%</td></tr>
                </tbody>
              </table>
            </div>
            <div className="text-[9px] text-slate-500 font-medium space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <p><strong>拆单管控：</strong>严格执行《关于拆单件的管控措施》（ADO-2023-058），符合拆单定义的保单将合并为1件计算。</p>
              <p><strong>发放规则：</strong>获奖营销员所获特别奖励金随中宏保险 2026 年 2 月份佣金奖金一起发放，且须承担个人所得税。</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-3">
        <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2">
          <Compass className="w-4 h-4 text-[#D80D18]" />
          <h4 className="text-xs font-black text-slate-800">规则解答</h4>
        </div>
        <div className="space-y-2">
          {PHASE1_RULE_FAQS.map((rule, idx) => {
            const isOpen = openRuleIdx === idx;
            return (
              <div key={rule.q} className="border border-slate-100 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenRuleIdx(isOpen ? null : idx)}
                  className="w-full flex justify-between items-center p-3.5 bg-slate-50/50 text-left"
                >
                  <span className="text-[10px] font-bold text-slate-800 leading-snug pr-2">{rule.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-3.5 bg-white text-[10px] text-slate-500 font-medium leading-relaxed border-t border-slate-50">
                    {rule.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const CompetitionModal: React.FC<CompetitionModalProps> = ({ isOpen, onClose, stats, isAmountHidden, scheme = 'p1' as SchemeId, ended = false }) => {
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

  const mockNow = new Date('2026-01-04');
  const deadlineSet = scheme === 'p1'
    ? { submit: '2026-01-05', issue: '2026-02-05', cooling: '2026-02-28', submitTotal: 35, issueTotal: 66, coolingTotal: 89 }
    : { submit: '2026-03-09', issue: '2026-03-31', cooling: '2026-04-15', submitTotal: scheme === 'p2' ? 67 : 84, issueTotal: scheme === 'p2' ? 89 : 106, coolingTotal: scheme === 'p2' ? 104 : 121 };
  const submissionDeadline = new Date(deadlineSet.submit);
  const issuanceDeadline = new Date(deadlineSet.issue);
  const coolingOffDeadline = new Date(deadlineSet.cooling);

  const daysToSubmit = Math.max(0, Math.ceil((submissionDeadline.getTime() - mockNow.getTime()) / (1000 * 60 * 60 * 24)));
  const daysToIssue = Math.max(0, Math.ceil((issuanceDeadline.getTime() - mockNow.getTime()) / (1000 * 60 * 60 * 24)));
  const daysToCoolingOff = Math.max(0, Math.ceil((coolingOffDeadline.getTime() - mockNow.getTime()) / (1000 * 60 * 60 * 24)));

  // ─── 保单明细折叠状态 ───
  const [subView, setSubView] = useState<'none' | 'policies' | 'inquiry' | 'poster'>('none');
  const [inquiryPolicy, setInquiryPolicy] = useState<Policy | null>(null);
  const [listTitle, setListTitle] = useState('保单明细');
  const [listSubtitle, setListSubtitle] = useState('');
  const [listPolicies, setListPolicies] = useState<Policy[]>(MOCK_POLICIES);
  const [listHighlight, setListHighlight] = useState('');
  const [listInitialStage, setListInitialStage] = useState<AwardStage | null>(null);
  const [listInitialAward, setListInitialAward] = useState<string | null>(null);
  const [posterAward, setPosterAward] = useState<{ key: string; name: string; amountText: string } | null>(null);
  const [detailTab, setDetailTab] = useState<'progress' | 'rules' | 'ranking'>('progress');
  const [activeRankingMetric, setActiveRankingMetric] = useState<string>('');
  const [rankingSearch, setRankingSearch] = useState('');

  const schemePolicies: Policy[] = ended && scheme === 'p1'
    ? ENDED_POLICIES
    : scheme === 'p2' ? P2_POLICIES : scheme === 'ssy' ? SSY_POLICIES : MOCK_POLICIES;
  const awardNameMap = scheme === 'p2' ? P2_AWARD_NAME : scheme === 'ssy' ? SSY_AWARD_NAME : AWARD_NAME;
  const meta = scheme === 'p2'
    ? { title: '2026年个险渠道赢领未来二阶段产品奖励方案', doc: 'ADO-2025-064', period: '2026-01-01 ~ 2026-03-31', poster: '2026 赢领未来 · 二阶段', funnelNote: '* 件数口径：已剔除拆单件（ADO-2023-058）及监管地区自保件、互保件、亲属件。重疾康养奖项件数为主险+OCR净件数，一张保单最多计2件' }
    : scheme === 'ssy'
    ? { title: '2026年个险渠道赢领未来双税优产品奖励方案', doc: 'ADO-2025-055', period: '2025-12-15 ~ 2026-03-31', poster: '2026 赢领未来 · 双税优', funnelNote: '* 件数口径：个养单张主险APE≥10,000计1件，福佑护理≥2,400计1件。个养不同场景不按拆单合并；其他指定产品适用ADO-2023-058' }
    : { title: '2026年个险渠道赢领未来一阶段产品奖励方案', doc: 'ADO-2025-054', period: '2025-12-01 ~ 2026-02-05', poster: '2026 赢领未来 · 一阶段', funnelNote: '* 件数口径：已剔除行政规则第2点"拆单件"（ADO-2023-058，同一被保险人同一缴费期间同一险种多张保单合计为1件）及第3点监管地区自保件、互保件、亲属件' };

  const summaryStats = useMemo(() => {
    const submittedPolicies = schemePolicies.filter(p => p.submitted);
    const issuedPolicies = schemePolicies.filter(p => p.issued);
    const coolingOffPolicies = schemePolicies.filter(p => p.coolingOff);
    const submittedCount = countAsNetPieces(submittedPolicies);
    const issuedCount = countAsNetPieces(issuedPolicies);
    const coolingOffCount = countAsNetPieces(coolingOffPolicies);
    const submittedApe = submittedPolicies.reduce((sum, p) => sum + p.ape, 0);
    const issuedApe = issuedPolicies.reduce((sum, p) => sum + p.ape, 0);
    
    // 一阶段专属：四个指标计算
    const hongtuPolicies = policiesForAward('hongtu', schemePolicies);
    const hongtuSubmitted = hongtuPolicies.filter(p => p.submitted);
    const hongtuIssued = hongtuPolicies.filter(p => p.issued);
    const hongtuSubmittedApe = hongtuSubmitted.reduce((sum, p) => sum + p.ape, 0);
    const hongtuIssuedApe = hongtuIssued.reduce((sum, p) => sum + p.ape, 0);
    
    const singleMaxSubmittedApe = submittedPolicies.length > 0 ? Math.max(...submittedPolicies.map(p => p.ape)) : 0;
    const singleMaxIssuedApe = issuedPolicies.length > 0 ? Math.max(...issuedPolicies.map(p => p.ape)) : 0;
    
    return { 
      submittedCount, issuedCount, coolingOffCount, submittedApe, issuedApe,
      hongtuSubmittedApe, hongtuIssuedApe,
      singleMaxSubmittedApe, singleMaxIssuedApe
    };
  }, [schemePolicies]);

  const awardSummary = useMemo(() => {
    if (scheme === 'p2') return buildP2AwardSummary();
    if (scheme === 'ssy') return buildSsyAwardSummary();
    const getCountReward = (count: number) => {
      const tier = [...COUNT_TIER_REWARDS].reverse().find(t => count >= t.min);
      return tier ? tier.reward : 0;
    };
    const getApeReward = (ape: number) => {
      const tier = [...APE_TIER_REWARDS].reverse().find(t => ape >= t.min);
      return tier ? tier.reward : 0;
    };
    // 宏图/大单奖公式用具体数据表达（APE × 费率 = 奖励金额，不带货币符号）；件数/APE 档位奖展示当前满足的区间
    const countFormula = (n: number) => n >= 15 ? '累计净件数 ≥ 15' : n >= 10 ? '累计净件数 [10, 15)' : n >= 5 ? '累计净件数 [5, 10)' : '';
    const apeFormula = (ape: number) => {
      if (ape >= 10000000) return '累计主险APE ≥ 1000万';
      const ranges: [number, number][] = [[200000, 300000], [300000, 500000], [500000, 1000000], [1000000, 2000000], [2000000, 5000000], [5000000, 10000000]];
      for (const [min, max] of ranges) {
        if (ape >= min && ape < max) return `${min / 10000}万 ≤ 累计主险APE < ${max / 10000}万`;
      }
      return '';
    };
    const bigFormula = (list: Policy[]) => {
      if (!list.length) return '';
      const maxApe = Math.max(...list.map(p => p.ape));
      const pct = maxApe >= 1000000 ? '1%' : '0.5%';
      return `${maxApe.toLocaleString()} × ${pct} = ${Math.round(maxApe * (maxApe >= 1000000 ? 0.01 : 0.005)).toLocaleString()}`;
    };
    const hongtuFormula = (list: Policy[]) => {
      if (!list.length) return '';
      const totalApe = list.reduce((sum, p) => sum + p.ape, 0);
      return `${totalApe.toLocaleString()} × 2% = ${Math.round(totalApe * 0.02).toLocaleString()}`;
    };
    const hongtuReward = (list: Policy[]) => list.reduce((sum, p) => sum + p.ape * 0.02, 0);
    const bigReward = (list: Policy[]) => list.reduce((sum, p) => sum + (p.ape >= 1000000 ? p.ape * 0.01 : p.ape * 0.005), 0);
    const apeSum = (list: Policy[]) => list.reduce((sum, p) => sum + p.ape, 0);
    const by = (key: string, pred: (p: Policy) => boolean) => policiesForAward(key, schemePolicies).filter(pred);
    const stageCount = (key: string, stage: AwardStage) => countAsNetPieces(policiesForAwardStage(key, stage, schemePolicies));
    return [
      { key: 'firstDay', name: AWARD_NAME.firstDay, submittedAmount: stageCount('firstDay', 'submit'), issuedAmount: stageCount('firstDay', 'issue'), coolingOffAmount: stageCount('firstDay', 'cooling'), submittedReward: 0, issuedReward: 0, coolingOffReward: 0, formula: '' },
      { key: 'hongtu', name: AWARD_NAME.hongtu, submittedAmount: stageCount('hongtu', 'submit'), issuedAmount: stageCount('hongtu', 'issue'), coolingOffAmount: stageCount('hongtu', 'cooling'), submittedReward: hongtuReward(by('hongtu', p => p.submitted)), issuedReward: hongtuReward(by('hongtu', p => p.issued)), coolingOffReward: hongtuReward(by('hongtu', p => p.coolingOff)), formula: hongtuFormula(by('hongtu', p => p.issued)) },
      { key: 'big', name: AWARD_NAME.big, submittedAmount: stageCount('big', 'submit'), issuedAmount: stageCount('big', 'issue'), coolingOffAmount: stageCount('big', 'cooling'), submittedReward: bigReward(by('big', p => p.submitted)), issuedReward: bigReward(by('big', p => p.issued)), coolingOffReward: bigReward(by('big', p => p.coolingOff)), formula: bigFormula(by('big', p => p.issued)) },
      { key: 'count', name: AWARD_NAME.count, submittedAmount: stageCount('count', 'submit'), issuedAmount: stageCount('count', 'issue'), coolingOffAmount: stageCount('count', 'cooling'), submittedReward: getCountReward(by('count', p => p.submitted).length), issuedReward: getCountReward(by('count', p => p.issued).length), coolingOffReward: getCountReward(by('count', p => p.coolingOff).length), formula: countFormula(stageCount('count', 'issue')) },
      { key: 'ape', name: AWARD_NAME.ape, submittedAmount: stageCount('ape', 'submit'), issuedAmount: stageCount('ape', 'issue'), coolingOffAmount: stageCount('ape', 'cooling'), submittedReward: getApeReward(apeSum(by('ape', p => p.submitted))), issuedReward: getApeReward(apeSum(by('ape', p => p.issued))), coolingOffReward: getApeReward(apeSum(by('ape', p => p.coolingOff))), formula: apeFormula(apeSum(by('ape', p => p.issued))) },
    ];
  }, [scheme, schemePolicies]);

  const awardFilterOptions = Object.entries(awardNameMap).map(([key, name]) => ({ key, name }));

  // 已结束视图：最终奖励金额 = 各奖项"过犹"口径奖励之和（首爆日为纪念银币，不计入金额）
  const finalRewardTotal = ended
    ? awardSummary.reduce((sum, a) => sum + (a.key === 'firstDay' ? 0 : 'coolingOffReward' in a ? (a.coolingOffReward as number) : 0), 0)
    : 0;

  const openPolicyList = (title: string, key?: string, stage?: AwardStage) => {
    setListTitle(title);
    setListInitialStage(stage ?? null);
    setListInitialAward(key ?? null);
    if (key && stage) {
      setListSubtitle(STAGE_META[stage].label);
      setListHighlight(awardNameMap[key] ?? '');
    } else {
      setListSubtitle('本方案全部保单');
      setListHighlight('');
    }
    // 全量保单传入，状态/奖项筛选在列表页内完成（可从预置条件自由切换）
    setListPolicies(schemePolicies);
    setSubView('policies');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-50 flex flex-col font-sans animate-slide-up">
      <div className="bg-white border-b border-slate-100 flex items-center justify-between px-4 py-4 pt-8 shrink-0">
        <button 
          onClick={onClose} 
          className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 active:scale-95 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-base font-black text-slate-800 tracking-tight">
          竞赛追踪详情
        </h3>
        <div className="w-10" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="px-4 pt-3 pb-6 space-y-3">

          <div>
          <div className="bg-[#A40000] text-white p-6 pb-8 relative overflow-hidden rounded-t-2xl">
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mb-10 -mr-10"></div>
            {ended && (
              /* 已结束：金色荣誉徽章悬浮右上角，不撑高横幅 */
              <span className="absolute top-3 right-3 z-10 flex flex-col items-center gap-0.5">
                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E9C27C] via-[#CB9A59] to-[#A97C32] flex items-center justify-center shadow-md">
                  <Trophy className="w-5 h-5 text-white drop-shadow" />
                </span>
                <span className="text-[8px] font-bold text-[#E9C27C]">已结束</span>
              </span>
            )}
            <h2 className={`text-lg font-black leading-tight tracking-wide mb-1 ${ended ? 'pr-14' : ''}`}>
              {meta.title}
            </h2>
            <p className="text-[10px] text-[#F9DBDC] font-medium opacity-90">
              文号: {meta.doc}
            </p>
            <p className="text-[10px] text-[#F9DBDC] font-medium opacity-90 mb-3">
              方案期间: {meta.period}
            </p>
          </div>

          <div className="flex border-b border-slate-100 bg-white shadow-xs sticky top-0 z-40 rounded-b-2xl overflow-hidden">
            <button
              onClick={() => setDetailTab('progress')}
              className={`flex-1 text-center py-3 text-xs font-black border-b-2 transition ${detailTab === 'progress' ? 'border-[#D80D18] text-[#D80D18]' : 'border-transparent text-slate-500'}`}
            >
              指标进度
            </button>
            <button
              onClick={() => setDetailTab('ranking')}
              className={`flex-1 text-center py-3 text-xs font-black border-b-2 transition ${detailTab === 'ranking' ? 'border-[#D80D18] text-[#D80D18]' : 'border-transparent text-slate-500'}`}
            >
              全国排名
            </button>
            <button
              onClick={() => setDetailTab('rules')}
              className={`flex-1 text-center py-3 text-xs font-black border-b-2 transition ${detailTab === 'rules' ? 'border-[#D80D18] text-[#D80D18]' : 'border-transparent text-slate-500'}`}
            >
              竞赛规则
            </button>
          </div>
          </div>

          {detailTab === 'rules' && (scheme === 'p2' ? <Phase2RulesPanel /> : scheme === 'ssy' ? <SsyRulesPanel /> : <Phase1RulesPanel />)}

          {detailTab === 'ranking' && (() => {
            const metricDefs = RANKING_BY_SCHEME[scheme] ?? [];
            const currentMetric = metricDefs.find(m => m.id === (activeRankingMetric || metricDefs[0]?.id)) ?? metricDefs[0];
            if (!currentMetric) return null;
            const filteredRows = currentMetric.rows.filter(item => {
              if (!rankingSearch) return true;
              const q = rankingSearch.toLowerCase();
              return item.branch.toLowerCase().includes(q) ||
                     item.agentId.toLowerCase().includes(q) ||
                     item.name.toLowerCase().includes(q);
            });
            return (
              <div className="space-y-3 animate-fade-in">

                {/* 指标切换 */}
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
                  {metricDefs.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setActiveRankingMetric(m.id)}
                      className={`py-2 text-[10.5px] font-black rounded-xl transition cursor-pointer ${
                        currentMetric.id === m.id
                          ? 'bg-[#D80D18] text-white shadow-xs'
                          : 'text-slate-600 hover:text-[#D80D18]'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* 我的全国排名概览 */}
                <div className="bg-white text-slate-800 rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D80D18] animate-ping"></span>
                      <span className="text-[11px] font-black text-slate-800">我的全国排名概览</span>
                    </div>
                    <span className="text-[9px] bg-[#FDF3F3] text-[#D80D18] border border-[#D80D18]/20 font-black px-2 py-0.5 rounded-full">
                      {currentMetric.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100">
                      <p className="text-[9px] text-slate-500 font-bold">全国排名</p>
                      <p className="text-base font-black text-[#D80D18] mt-0.5">{currentMetric.myRank}</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100">
                      <p className="text-[9px] text-slate-500 font-bold">{currentMetric.label}</p>
                      <p className="text-xs font-black text-slate-800 mt-1">{currentMetric.myValue}</p>
                    </div>
                  </div>
                </div>

                {/* 搜索框 */}
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <Search className="w-4 h-4 text-slate-400 ml-1 shrink-0" />
                  <input
                    type="text"
                    placeholder="搜索机构、营销员姓名或编号..."
                    value={rankingSearch}
                    onChange={(e) => setRankingSearch(e.target.value)}
                    className="w-full text-xs bg-transparent outline-none text-slate-800 placeholder-slate-400 font-medium"
                  />
                  {rankingSearch && (
                    <button onClick={() => setRankingSearch('')} className="text-xs text-slate-400 hover:text-slate-600 px-1">
                      ✕
                    </button>
                  )}
                </div>

                {/* 全国 TOP 榜单 */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
                  <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-[11px] font-black text-slate-800 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-[#CB9A59]" />
                      全国 TOP 榜单与排名明细
                    </span>
                    <span className="text-[9.5px] text-slate-400 font-bold">
                      全国参评人数: 12,480 人
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[10px]">
                      <thead className="bg-slate-50/70 font-black text-slate-600 border-b border-slate-100">
                        <tr>
                          <th className="py-2.5 px-3 text-center w-12">排名</th>
                          <th className="py-2.5 px-3">机构</th>
                          <th className="py-2.5 px-3">营销员编号</th>
                          <th className="py-2.5 px-3">姓名</th>
                          <th className="py-2.5 px-3 text-right">指标项金额 / 数值</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                        {filteredRows.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                              未找到符合条件的营销员记录
                            </td>
                          </tr>
                        ) : (
                          filteredRows.map((item) => (
                            <tr
                              key={`${item.rank}-${item.agentId}`}
                              className={`transition hover:bg-[#FDF3F3]/40 ${
                                item.isSelf ? 'bg-[#FFF7E9]/90 font-bold text-[#62441B] border-l-4 border-[#CB9A59]' : ''
                              }`}
                            >
                              <td className="py-3 px-3 text-center">
                                {item.rank === 1 && (
                                  <span className="w-6 h-6 rounded-full bg-[#DDB05F] text-white font-black text-[10px] inline-flex items-center justify-center shadow-2xs">🥇 1</span>
                                )}
                                {item.rank === 2 && (
                                  <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-black text-[10px] inline-flex items-center justify-center shadow-2xs">🥈 2</span>
                                )}
                                {item.rank === 3 && (
                                  <span className="w-6 h-6 rounded-full bg-[#9A7030]/60 text-white font-black text-[10px] inline-flex items-center justify-center shadow-2xs">🥉 3</span>
                                )}
                                {item.rank > 3 && (
                                  <span className="text-slate-600 font-black text-[11px]">{item.rank}</span>
                                )}
                              </td>
                              <td className="py-3 px-3 font-bold text-slate-800">
                                {item.branch}
                              </td>
                              <td className="py-3 px-3 font-mono text-slate-500 text-[9.5px]">
                                {item.agentId}
                              </td>
                              <td className="py-3 px-3">
                                <span className="font-bold">{item.name}</span>
                                {item.isSelf && (
                                  <span className="ml-1.5 px-1.5 py-0.2 bg-[#CB9A59] text-white text-[8px] font-black rounded-full">
                                    我的
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-right font-black text-[#D80D18] text-[11px]">
                                {item.value}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {detailTab === 'progress' && (
          <>

              {/* ═══════════════════════════════════════════
                  区域 1: 倒计时（已结束方案展示"已结束"态）
              ═══════════════════════════════════════════ */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100">
                <div className="flex items-center gap-1.5 mb-3">
                  <Clock className="w-3.5 h-3.5 text-[#D80D18]" />
                  <span className="text-[10px] font-black text-slate-700">倒计时</span>
                </div>
                <div className="flex justify-between px-1">
                  <CountdownRing daysLeft={daysToSubmit} label="递交截止" deadline={deadlineSet.submit} totalDays={deadlineSet.submitTotal} ended={ended} />
                  <CountdownRing daysLeft={daysToIssue} label="签发截止" deadline={deadlineSet.issue} totalDays={deadlineSet.issueTotal} ended={ended} />
                  <CountdownRing daysLeft={daysToCoolingOff} label="过犹截止" deadline={deadlineSet.cooling} totalDays={deadlineSet.coolingTotal} ended={ended} />
                </div>
              </div>

              {/* 已结束：最终达成情况（等最终结果出来后展示；当前先展示最终奖励金额） */}
              {ended && (
              <div className="bg-white rounded-2xl p-4 border border-slate-100">
                <div className="flex items-center gap-1.5 mb-3">
                  <CheckCircle className="w-3.5 h-3.5 text-[#CB9A59]" />
                  <span className="text-[10px] font-black text-slate-700">最终达成情况</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#F2E0C8] bg-[#FFF7E9] px-3 py-2.5">
                  <span className="text-[9px] font-bold text-slate-600">最终奖励金额</span>
                  <span className="text-base font-black tracking-tight text-[#D80D18]">¥{finalRewardTotal.toLocaleString()}</span>
                </div>
              </div>
              )}

              {/* ═══════════════════════════════════════════
                  区域 2: 竞赛方案进度 + 保单明细（可折叠）
              ═══════════════════════════════════════════ */}
              <div>
                {/* 竞赛方案进度 */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 mb-2.5">
                  <div className="flex items-center gap-1.5 mb-3.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#D80D18]" />
                    <span className="text-[10px] font-black text-slate-700">竞赛方案进度</span>
                  </div>

                  {/* 一阶段专属：四个指标紧凑网格（2×2） */}
                  {scheme === 'p1' && (
                    <div className="grid grid-cols-2 gap-1 mb-2">
                      {[
                        { title: '宏图相伴尊享版主险 APE', submitted: `¥${summaryStats.hongtuSubmittedApe.toLocaleString()}`, issued: `¥${summaryStats.hongtuIssuedApe.toLocaleString()}` },
                        { title: '单张保单主险 APE', submitted: `¥${summaryStats.singleMaxSubmittedApe.toLocaleString()}`, issued: `¥${summaryStats.singleMaxIssuedApe.toLocaleString()}` },
                        { title: '累计主险 APE', submitted: `¥${summaryStats.submittedApe.toLocaleString()}`, issued: `¥${summaryStats.issuedApe.toLocaleString()}` },
                        { title: '累计主险件数', submitted: `${summaryStats.submittedCount}件`, issued: `${summaryStats.issuedCount}件` },
                      ].map((m) => (
                        <div key={m.title} className={`rounded-xl px-2.5 py-2 border bg-[#FDF3F3]/60 ${ended ? 'border-[#D80D18]' : 'border-[#F9DBDC]'}`}>
                          <div className="text-[8px] font-black text-slate-700 leading-snug mb-1">{m.title}</div>
                          <div className="space-y-0.5">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[7px] font-bold text-slate-400">已递交</span>
                              <span className="text-[9px] font-black text-[#D80D18]">{m.submitted}</span>
                            </div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[7px] font-bold text-slate-400">已签发</span>
                              <span className="text-[9px] font-black text-[#D80D18]">{m.issued}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 二阶段 / 双税优：保持原 APE、件数进度条 */}
                  {scheme !== 'p1' && (
                    <>
                      <div className="mb-2">
                        <span className="text-[9px] font-black text-slate-600">APE</span>
                      </div>
                      <div className="space-y-1.5 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-bold text-slate-500 w-10 shrink-0">已递交</span>
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#D80D18] rounded-full" style={{ width: '100%' }} />
                          </div>
                          <span className="text-[8px] font-black text-slate-900 text-right shrink-0">¥{summaryStats.submittedApe.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-bold text-slate-500 w-10 shrink-0">已签发</span>
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#E4565E] rounded-full" style={{ width: `${(summaryStats.issuedApe / (summaryStats.submittedApe || 1)) * 100}%` }} />
                          </div>
                          <span className="text-[8px] font-black text-slate-900 text-right shrink-0">¥{summaryStats.issuedApe.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="mb-2">
                        <span className="text-[9px] font-black text-slate-600">件数</span>
                      </div>
                      <div className="space-y-1.5 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-bold text-slate-500 w-10 shrink-0">已递交</span>
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#D80D18] rounded-full" style={{ width: `${(summaryStats.submittedCount / (summaryStats.submittedCount || 1)) * 100}%` }} />
                          </div>
                          <span className="text-[8px] font-black text-slate-900 w-10 text-right shrink-0">{summaryStats.submittedCount}件</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-bold text-slate-500 w-10 shrink-0">已签发</span>
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#E4565E] rounded-full" style={{ width: `${(summaryStats.issuedCount / (summaryStats.submittedCount || 1)) * 100}%` }} />
                          </div>
                          <span className="text-[8px] font-black text-slate-900 w-10 text-right shrink-0">{summaryStats.issuedCount}件</span>
                        </div>
                      </div>
                    </>
                  )}
                  <p className="text-[7.5px] text-slate-400 leading-relaxed">
                    {meta.funnelNote}
                  </p>
                </div>

                <button
                  onClick={() => openPolicyList('保单明细')}
                  className="w-full flex items-center justify-between bg-white rounded-xl border border-slate-200/80 px-3 py-2.5 mb-2 active:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#D80D18]" />
                    <span className="text-[10px] font-black text-slate-700">保单明细</span>
                    <span className="text-[8px] text-slate-400 font-medium ml-1">共 {schemePolicies.length} 张</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* ═══════════════════════════════════════════
                  区域 3: 奖励方案
              ══════════════════════════════════════════ */}
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <BarChart3 className="w-3.5 h-3.5 text-[#D80D18]" />
                  <span className="text-[10px] font-black text-slate-700">奖励方案</span>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                  {awardSummary.map((award, idx) => {
                    const isFirstDay = award.key === 'firstDay';
                    const finalReward = 'coolingOffReward' in award ? (award.coolingOffReward as number) : 0;
                    const stages: { key: AwardStage; count: number }[] = [
                      { key: 'submit', count: award.submittedAmount },
                      { key: 'issue', count: award.issuedAmount },
                      { key: 'cooling', count: award.coolingOffAmount },
                    ];
                    return (
                    <div key={award.name} className={`px-3 py-3 ${idx > 0 ? 'border-t border-slate-100' : ''}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-black text-slate-800">{award.name}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        {stages.map((s) => (
                          <button
                            key={s.key}
                            onClick={() => openPolicyList(award.name, award.key, s.key)}
                            className="text-center py-1 active:opacity-70"
                          >
                            {/* 三档件数：有件数金色、无件数灰色（与进行中同款） */}
                            <div className={`text-[7px] font-bold ${s.count > 0 ? 'text-[#CB9A59]' : 'text-slate-400'}`}>
                              {STAGE_META[s.key].label}
                            </div>
                            <div className={`text-[11px] font-black ${s.count > 0 ? 'text-[#CB9A59]' : 'text-slate-400'}`}>
                              {s.count}件
                            </div>
                          </button>
                        ))}
                      </div>
                      {ended ? (
                        /* 已结束：淡红底红框两行卡片（与进行中同款底色），保留"预达成"与"最终奖励"两行 */
                        <div className="mt-1.5 rounded-xl border border-[#D80D18] bg-[#FDF3F3]/60 px-2.5 py-1.5 space-y-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="text-[8px] text-slate-500 font-medium shrink-0">预达成 · 签发口径</span>
                            {!isFirstDay && award.formula && (
                              <span className="flex-1 min-w-0 text-center text-[8px] text-[#BE060C]/80 font-medium leading-snug">{award.formula}</span>
                            )}
                            <span className="text-[11px] font-black text-[#D80D18] shrink-0">
                              {isFirstDay ? '中宏保险30周年专属纪念银币' : `¥${Math.round(award.issuedReward).toLocaleString()}`}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#D80D18]/30">
                            <span className="text-[8px] text-slate-500 font-medium shrink-0">最终奖励 · 过犹口径</span>
                            <span className="text-[12px] font-black text-[#D80D18] text-right">
                              {isFirstDay ? '中宏保险30周年专属纪念银币' : `¥${Math.round(finalReward).toLocaleString()}`}
                            </span>
                          </div>
                        </div>
                      ) : (
                      <div className="mt-1.5 rounded-xl border border-[#F9DBDC] bg-[#FDF3F3]/60 px-2.5 py-1.5">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-[8px] text-slate-500 font-medium shrink-0">预达成 · 签发口径</span>
                          {!isFirstDay && award.formula && (
                            <span className="flex-1 min-w-0 text-center text-[8px] text-[#BE060C]/80 font-medium leading-snug">{award.formula}</span>
                          )}
                          <span className="text-[11px] font-black text-[#D80D18] shrink-0">
                            {isFirstDay ? '中宏保险30周年专属纪念银币' : `¥${Math.round(award.issuedReward).toLocaleString()}`}
                          </span>
                        </div>
                      </div>
                      )}
                    </div>
                    );
                  })}
                </div>
              </div>
          </>
          )}

        </div>
      </div>
      {(subView === 'policies' || subView === 'inquiry') && (
        <PolicyListScreen
          key={`${listTitle}-${listInitialStage}-${listInitialAward}`}
          title={listTitle}
          subtitle={listSubtitle}
          highlightAward={listHighlight}
          policies={listPolicies}
          initialStage={listInitialStage}
          initialAward={listInitialAward}
          awardOptions={awardFilterOptions}
          qualifier={(p, k) => qualifiesInScheme(scheme, p, k)}
          onBack={() => { setSubView('none'); setInquiryPolicy(null); }}
          onOpenInquiry={(p) => { setInquiryPolicy(p); setSubView('inquiry'); }}
        />
      )}
      {subView === 'inquiry' && inquiryPolicy && (
        <PolicyInquiryScreen
          policy={inquiryPolicy}
          onBack={() => setSubView('policies')}
        />
      )}
      {subView === 'poster' && posterAward && (
        <AwardPosterScreen
          awardKey={posterAward.key}
          awardName={posterAward.name}
          amountText={posterAward.amountText}
          schemeLabel={meta.poster}
          onBack={() => { setSubView('none'); setPosterAward(null); }}
        />
      )}
    </div>
  );
};
