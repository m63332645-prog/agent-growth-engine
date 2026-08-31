import React, { useState } from 'react';
import { ChevronDown, Compass } from 'lucide-react';

export type ExtraSchemeId = 'p2' | 'ssy';

export interface ExtraPolicy {
  id: string;
  product: string;
  payYears: string;
  holderName: string;
  premium: number;
  ape: number;
  submitDate: string;
  issueDate: string;
  hesitationEnd?: string | null;
  submitted: boolean;
  issued: boolean;
  coolingOff: boolean;
  riderApe?: number;
  riderName?: string;
  awardTags: string[];
  line?: 'pension' | 'care';
}

type Seed = Omit<ExtraPolicy, 'submitted' | 'issued' | 'coolingOff' | 'awardTags'> & { awardTags?: string[] };

const MOCK_TODAY = '2026-01-02';

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function hydrate(seed: Seed): ExtraPolicy {
  const submitted = seed.submitDate <= MOCK_TODAY;
  const issued = seed.issueDate <= MOCK_TODAY;
  const end = seed.hesitationEnd === null ? null : (seed.hesitationEnd ?? addDays(seed.issueDate, 15));
  const coolingOff = issued && end !== null && end <= MOCK_TODAY;
  return { awardTags: [], ...seed, submitted, issued, coolingOff };
}

export type ExtraAwardStage = 'submit' | 'issue' | 'cooling';

function inStage(p: ExtraPolicy, stage: ExtraAwardStage): boolean {
  if (stage === 'cooling') return p.coolingOff;
  if (stage === 'issue') return p.issued;
  return p.submitted;
}

export const P2_AWARD_NAME: Record<string, string> = {
  ape: '累计APE奖励',
  ci: '重疾康养件数奖励',
};

const P2_APE_TIERS = [
  { min: 50000, reward: 800 },
  { min: 100000, reward: 1800 },
  { min: 200000, reward: 4000 },
  { min: 300000, reward: 7500 },
  { min: 500000, reward: 15000 },
  { min: 1000000, reward: 35000 },
  { min: 2000000, reward: 80000 },
  { min: 5000000, reward: 225000 },
];

const CI_MAIN = ['健康双星守护版', '健康魔方守护版', '健康守卫A款', '健康守卫B款'];

export function p2ApeQualifies(p: ExtraPolicy): boolean {
  if (p.product.includes('宏图相伴') && p.payYears.includes('3')) return false;
  if (p.product.includes('乐享丰年') && p.payYears.includes('3')) return false;
  return true;
}

export function ciPiecesOf(p: ExtraPolicy): { ape: number }[] {
  const pieces: { ape: number }[] = [];
  if (CI_MAIN.some((n) => p.product.includes(n)) && p.ape >= 6000) pieces.push({ ape: p.ape });
  if ((p.riderApe ?? 0) >= 6000) pieces.push({ ape: p.riderApe! });
  return pieces;
}

function p2ApeReward(ape: number): number {
  const tier = [...P2_APE_TIERS].reverse().find((t) => ape >= t.min);
  return tier ? tier.reward : 0;
}

function ciRates(totalPieces: number): { low: number; high: number } {
  if (totalPieces >= 5) return { low: 500, high: 1000 };
  if (totalPieces >= 3) return { low: 350, high: 700 };
  if (totalPieces >= 2) return { low: 280, high: 560 };
  return { low: 0, high: 0 };
}

function ciReward(list: ExtraPolicy[]): number {
  const pieces = list.flatMap(ciPiecesOf);
  const { low, high } = ciRates(pieces.length);
  return pieces.reduce((sum, x) => sum + (x.ape >= 10000 ? high : low), 0);
}

const P2_SEEDS: Seed[] = [
  { id: 'B202601001', product: '宏瑞年年', payYears: '5年', holderName: '周启明', premium: 80000, ape: 80000, submitDate: '2026-01-01', issueDate: '2026-01-18' },
  { id: 'B202601002', product: '健康双星守护版', payYears: '10年', holderName: '李康年', premium: 12000, ape: 12000, submitDate: '2026-01-02', issueDate: '2026-01-02', riderName: '附加康养畅享版', riderApe: 12000 },
  { id: 'B202601003', product: '健康魔方守护版', payYears: '10年', holderName: '王悦', premium: 8000, ape: 8000, submitDate: '2026-01-03', issueDate: '2026-02-01' },
  { id: 'B202601004', product: '宏愿长伴乐享版', payYears: '终身', holderName: '赵长青', premium: 250000, ape: 250000, submitDate: '2026-01-01', issueDate: '2026-01-01' },
  { id: 'B202601005', product: '健康守卫A款', payYears: '10年', holderName: '钱卫', premium: 15000, ape: 15000, submitDate: '2026-01-04', issueDate: '2026-03-01', riderName: '附加康养畅享版', riderApe: 7000 },
  { id: 'B202601006', product: '畅行无忧2025', payYears: '10年', holderName: '孙行', premium: 60000, ape: 60000, submitDate: '2026-01-04', issueDate: '2026-01-20' },
  { id: 'B202601007', product: '宏佑世家逸享版', payYears: '5年', holderName: '周逸', premium: 100000, ape: 100000, submitDate: '2026-01-02', issueDate: '2026-01-10' },
  { id: 'B202601008', product: '健康双星守护版', payYears: '10年', holderName: '陈安', premium: 5000, ape: 5000, submitDate: '2026-01-03', issueDate: '2026-01-03', riderName: '附加康养畅享版', riderApe: 8000 },
  { id: 'B202601009', product: '乐享丰年心享版', payYears: '5年', holderName: '吴丰', premium: 40000, ape: 40000, submitDate: '2026-01-01', issueDate: '2026-01-08' },
  { id: 'B202601010', product: '健康守卫B款', payYears: '10年', holderName: '郑宁', premium: 11000, ape: 11000, submitDate: '2026-01-04', issueDate: '2026-01-04' },
];

export const P2_POLICIES: ExtraPolicy[] = P2_SEEDS.map((s) => {
  const p = hydrate(s);
  const tags: string[] = [];
  if (p2ApeQualifies(p)) tags.push(P2_AWARD_NAME.ape);
  if (ciPiecesOf(p).length > 0) tags.push(P2_AWARD_NAME.ci);
  return { ...p, awardTags: tags };
});

export function p2PoliciesForAwardStage(key: string, stage: ExtraAwardStage): ExtraPolicy[] {
  const rank = (p: ExtraPolicy) => (!p.issued ? 0 : !p.coolingOff ? 1 : 2);
  return P2_POLICIES
    .filter((p) => (key === 'ci' ? ciPiecesOf(p).length > 0 : p2ApeQualifies(p)))
    .filter((p) => inStage(p, stage))
    .sort((a, b) => rank(a) - rank(b) || a.submitDate.localeCompare(b.submitDate));
}

export function buildP2AwardSummary() {
  const apeBy = (pred: (p: ExtraPolicy) => boolean) => P2_POLICIES.filter(p2ApeQualifies).filter(pred);
  const ciBy = (pred: (p: ExtraPolicy) => boolean) => P2_POLICIES.filter((p) => ciPiecesOf(p).length > 0).filter(pred);
  const apeSum = (list: ExtraPolicy[]) => list.reduce((s, p) => s + p.ape, 0);
  const ciCount = (list: ExtraPolicy[]) => list.reduce((s, p) => s + ciPiecesOf(p).length, 0);
  return [
    {
      key: 'ape',
      name: P2_AWARD_NAME.ape,
      submittedAmount: apeBy((p) => p.submitted).length,
      issuedAmount: apeBy((p) => p.issued).length,
      coolingOffAmount: apeBy((p) => p.coolingOff).length,
      submittedReward: p2ApeReward(apeSum(apeBy((p) => p.submitted))),
      issuedReward: p2ApeReward(apeSum(apeBy((p) => p.issued))),
      coolingOffReward: p2ApeReward(apeSum(apeBy((p) => p.coolingOff))),
      formula: '',
    },
    {
      key: 'ci',
      name: P2_AWARD_NAME.ci,
      submittedAmount: ciCount(ciBy((p) => p.submitted)),
      issuedAmount: ciCount(ciBy((p) => p.issued)),
      coolingOffAmount: ciCount(ciBy((p) => p.coolingOff)),
      submittedReward: ciReward(ciBy((p) => p.submitted)),
      issuedReward: ciReward(ciBy((p) => p.issued)),
      coolingOffReward: ciReward(ciBy((p) => p.coolingOff)),
      formula: '',
    },
  ];
}

export const SSY_AWARD_NAME: Record<string, string> = {
  pension: '个养特别奖励',
  care: '福佑护理特别奖励',
};

function ssyUnits(total: number): { pension: number; care: number } {
  if (total >= 30) return { pension: 500, care: 150 };
  if (total >= 20) return { pension: 400, care: 120 };
  if (total >= 10) return { pension: 300, care: 100 };
  if (total >= 5) return { pension: 200, care: 80 };
  return { pension: 0, care: 0 };
}

export function isPension(p: ExtraPolicy): boolean {
  return (p.line === 'pension' || p.product.includes('养老')) && p.ape >= 10000;
}

export function isCare(p: ExtraPolicy): boolean {
  return (p.line === 'care' || p.product.includes('福佑护理')) && p.ape >= 2400;
}

const SSY_SEEDS: Seed[] = [
  { id: 'C202512001', product: '养老顺心', payYears: '10年', holderName: '王养老', premium: 20000, ape: 20000, submitDate: '2025-12-20', issueDate: '2026-01-02', line: 'pension' },
  { id: 'C202512002', product: '养老添福', payYears: '10年', holderName: '李养心', premium: 15000, ape: 15000, submitDate: '2025-12-18', issueDate: '2026-01-20', line: 'pension' },
  { id: 'C202601011', product: '福佑护理', payYears: '20年', holderName: '张护理', premium: 3600, ape: 3600, submitDate: '2026-01-01', issueDate: '2026-01-01', line: 'care' },
  { id: 'C202601012', product: '养老顺心', payYears: '10年', holderName: '赵安年', premium: 12000, ape: 12000, submitDate: '2026-01-02', issueDate: '2026-02-01', line: 'pension' },
  { id: 'C202601013', product: '福佑护理', payYears: '20年', holderName: '钱康护', premium: 2400, ape: 2400, submitDate: '2026-01-03', issueDate: '2026-01-10', line: 'care' },
  { id: 'C202512003', product: '养老添福', payYears: '10年', holderName: '孙福年', premium: 30000, ape: 30000, submitDate: '2025-12-25', issueDate: '2026-01-03', line: 'pension' },
  { id: 'C202601014', product: '福佑护理', payYears: '20年', holderName: '周护宁', premium: 4800, ape: 4800, submitDate: '2026-01-04', issueDate: '2026-03-01', line: 'care' },
  { id: 'C202601015', product: '养老顺心', payYears: '10年', holderName: '吴颐年', premium: 10000, ape: 10000, submitDate: '2026-01-04', issueDate: '2026-01-04', line: 'pension' },
  { id: 'C202601016', product: '福佑护理', payYears: '20年', holderName: '冯护安', premium: 3000, ape: 3000, submitDate: '2026-01-02', issueDate: '2026-01-02', line: 'care' },
  { id: 'C202512004', product: '养老顺心', payYears: '10年', holderName: '陈岁安', premium: 18000, ape: 18000, submitDate: '2025-12-16', issueDate: '2026-01-01', line: 'pension' },
];

export const SSY_POLICIES: ExtraPolicy[] = SSY_SEEDS.map((s) => {
  const p = hydrate(s);
  const tags: string[] = [];
  if (isPension(p)) tags.push(SSY_AWARD_NAME.pension);
  if (isCare(p)) tags.push(SSY_AWARD_NAME.care);
  return { ...p, awardTags: tags };
});

export function ssyPoliciesForAwardStage(key: string, stage: ExtraAwardStage): ExtraPolicy[] {
  const rank = (p: ExtraPolicy) => (!p.issued ? 0 : !p.coolingOff ? 1 : 2);
  return SSY_POLICIES
    .filter((p) => (key === 'care' ? isCare(p) : isPension(p)))
    .filter((p) => inStage(p, stage))
    .sort((a, b) => rank(a) - rank(b) || a.submitDate.localeCompare(b.submitDate));
}

export function buildSsyAwardSummary() {
  const pensionBy = (pred: (p: ExtraPolicy) => boolean) => SSY_POLICIES.filter(isPension).filter(pred);
  const careBy = (pred: (p: ExtraPolicy) => boolean) => SSY_POLICIES.filter(isCare).filter(pred);
  const reward = (pred: (p: ExtraPolicy) => boolean) => {
    const pCount = pensionBy(pred).length;
    const cCount = careBy(pred).length;
    const u = ssyUnits(pCount + cCount);
    return { pCount, cCount, pPay: pCount * u.pension, cPay: cCount * u.care };
  };
  const sub = reward((p) => p.submitted);
  const iss = reward((p) => p.issued);
  const cool = reward((p) => p.coolingOff);
  return [
    {
      key: 'pension',
      name: SSY_AWARD_NAME.pension,
      submittedAmount: sub.pCount,
      issuedAmount: iss.pCount,
      coolingOffAmount: cool.pCount,
      submittedReward: sub.pPay,
      issuedReward: iss.pPay,
      coolingOffReward: cool.pPay,
      formula: '',
    },
    {
      key: 'care',
      name: SSY_AWARD_NAME.care,
      submittedAmount: sub.cCount,
      issuedAmount: iss.cCount,
      coolingOffAmount: cool.cCount,
      submittedReward: sub.cPay,
      issuedReward: iss.cPay,
      coolingOffReward: cool.cPay,
      formula: '',
    },
  ];
}

const RuleFaq: React.FC<{ items: { q: string; a: string }[] }> = ({ items }) => {
  const [openRuleIdx, setOpenRuleIdx] = useState<number | null>(null);
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-3">
      <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2">
        <Compass className="w-4 h-4 text-[#D80D18]" />
        <h4 className="text-xs font-black text-slate-800">规则解答</h4>
      </div>
      <div className="space-y-2">
        {items.map((rule, idx) => {
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
  );
};

export const Phase2RulesPanel: React.FC = () => {
  const [tab, setTab] = useState<'rewards' | 'products'>('rewards');
  return (
    <div className="space-y-4">
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60 shadow-inner">
        <button onClick={() => setTab('rewards')} className={`flex-1 py-2 text-xs font-black rounded-xl transition ${tab === 'rewards' ? 'bg-[#D80D18] text-white shadow-xs' : 'text-slate-500'}`}>奖励方案规则</button>
        <button onClick={() => setTab('products')} className={`flex-1 py-2 text-xs font-black rounded-xl transition ${tab === 'products' ? 'bg-[#D80D18] text-white shadow-xs' : 'text-slate-500'}`}>指定产品与换算规则</button>
      </div>
      {tab === 'rewards' ? (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-1.5">
            <h4 className="text-xs font-black text-slate-800">基本信息</h4>
            <p className="text-[10px] text-slate-600 leading-relaxed">
              <strong>文号：</strong>ADO-2025-064<br />
              <strong>参加对象：</strong>全体营销员<br />
              <strong>活动期间：</strong>2026年1月1日至3月9日期间递交，并于2026年1月1日至3月31日期间签发，且于2026年4月15日（含）前过犹豫期
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-1.5">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-slate-800">(一) 累计APE奖励方案</h4>
              <span className="text-[8.5px] bg-[#FDF3F3] text-[#BE060C] font-bold px-2 py-0.5 rounded-full border border-[#F9DBDC]">最高 ¥225,000</span>
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed">
              营销员于活动期间销售指定产品并达成以下累计APE要求，将可获得一次性特别奖励金：
              <br />• 5万 ≤ 累计主险APE &lt; 10万：<strong className="text-[#D80D18]">800元人民币</strong>
              <br />• 10万 ≤ 累计主险APE &lt; 20万：<strong className="text-[#D80D18]">1,800元人民币</strong>
              <br />• 20万 ≤ 累计主险APE &lt; 30万：<strong className="text-[#D80D18]">4,000元人民币</strong>
              <br />• 30万 ≤ 累计主险APE &lt; 50万：<strong className="text-[#D80D18]">7,500元人民币</strong>
              <br />• 50万 ≤ 累计主险APE &lt; 100万：<strong className="text-[#D80D18]">15,000元人民币</strong>
              <br />• 100万 ≤ 累计主险APE &lt; 200万：<strong className="text-[#D80D18]">35,000元人民币</strong>
              <br />• 200万 ≤ 累计主险APE &lt; 500万：<strong className="text-[#D80D18]">80,000元人民币</strong>
              <br />• 累计主险APE ≥ 500万：<strong className="text-[#D80D18]">225,000元人民币</strong>
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-1.5">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-slate-800">(二) 重疾康养件数奖励方案</h4>
              <span className="text-[8.5px] bg-[#FDF3F3] text-[#BE060C] font-bold px-2 py-0.5 rounded-full border border-[#F9DBDC]">最高 ¥1,000/件</span>
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed">
              主险健康双星守护版、健康魔方守护版、健康守卫A款、健康守卫B款单张主险APE ≥ 6,000计1件；附加康养畅享版（OCR）单张附加险APE ≥ 6,000另计1件。主附可兼得，一张保单最多计2件。于2026年1月1日前递交的重疾险保单，活动期间新增加保OCR的，不计入本方案。
            </p>
            <div className="overflow-hidden border border-slate-100 rounded-xl mt-1">
              <table className="w-full text-left text-[9.5px]">
                <thead className="bg-[#FDF3F3] font-black text-[#A40000] border-b border-slate-100">
                  <tr>
                    <th className="p-2">累计净件数</th>
                    <th className="p-2">APE [6,000, 10,000)</th>
                    <th className="p-2">APE ≥ 10,000</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  <tr><td className="p-2 font-bold">[2, 3) 件</td><td className="p-2 text-[#D80D18] font-bold">280 元/件</td><td className="p-2 text-[#D80D18] font-bold">560 元/件</td></tr>
                  <tr><td className="p-2 font-bold">[3, 5) 件</td><td className="p-2 text-[#D80D18] font-bold">350 元/件</td><td className="p-2 text-[#D80D18] font-bold">700 元/件</td></tr>
                  <tr><td className="p-2 font-bold">≥ 5 件</td><td className="p-2 text-[#D80D18] font-bold">500 元/件</td><td className="p-2 text-[#D80D18] font-bold">1,000 元/件</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-3">
            <h4 className="text-xs font-black text-slate-800">累计APE奖励 · 指定产品</h4>
            <div className="overflow-hidden border border-slate-100 rounded-xl">
              <table className="w-full text-left text-[9.5px]">
                <thead className="bg-[#FDF3F3] font-black text-[#A40000] border-b border-slate-100">
                  <tr><th className="p-2">序号</th><th className="p-2">指定产品</th><th className="p-2">缴费期间</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  <tr><td className="p-2">1</td><td className="p-2 font-bold text-slate-900">宏图相伴尊享版 (APY)</td><td className="p-2">不含3年缴</td></tr>
                  <tr><td className="p-2">2</td><td className="p-2 font-bold text-slate-900">宏图相伴悦享版 (AQR)</td><td className="p-2">不含3年缴</td></tr>
                  <tr><td className="p-2">3</td><td className="p-2 font-bold text-slate-900">乐享丰年心享版 (AOC)</td><td className="p-2">不含3年缴</td></tr>
                  <tr><td className="p-2">4</td><td className="p-2 font-bold text-slate-900">宏瑞年年 (AOH)</td><td className="p-2">不含3年缴</td></tr>
                  <tr><td className="p-2">5</td><td className="p-2 font-bold text-slate-900">宏佑世家逸享版 (AOD)</td><td className="p-2">不含3年缴 · 非个养场景</td></tr>
                  <tr><td className="p-2">6</td><td className="p-2 font-bold text-slate-900">宏愿长伴乐享版 (BTA)</td><td className="p-2">不限</td></tr>
                  <tr><td className="p-2">7-10</td><td className="p-2 font-bold text-slate-900">健康双星 / 魔方 / 守卫A / 守卫B</td><td className="p-2">不限</td></tr>
                  <tr><td className="p-2">11</td><td className="p-2 font-bold text-slate-900">畅行无忧2025 (RAC)</td><td className="p-2">不限</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-[9px] text-slate-500 font-medium">宏佑世家逸享版限非个养场景；宏瑞年年名称与上市时间以产品本部公文为准。一阶段三年缴尊享/悦享/乐享丰年不计入本方案APE。</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-3">
            <h4 className="text-xs font-black text-slate-800">重疾康养件数 · 指定产品</h4>
            <div className="overflow-hidden border border-slate-100 rounded-xl">
              <table className="w-full text-left text-[9.5px]">
                <thead className="bg-[#FDF3F3] font-black text-[#A40000] border-b border-slate-100">
                  <tr><th className="p-2">产品</th><th className="p-2">APE门槛</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  <tr><td className="p-2 font-bold text-slate-900">健康双星 / 魔方 / 守卫A / 守卫B</td><td className="p-2">主险APE ≥ 6,000</td></tr>
                  <tr><td className="p-2 font-bold text-slate-900">附加康养畅享版 (OCR)</td><td className="p-2">附加险APE ≥ 6,000</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-3">
            <h4 className="text-xs font-black text-slate-800">指定产品主险 APE 计入规则</h4>
            <div className="overflow-hidden border border-slate-100 rounded-xl">
              <table className="w-full text-left text-[10px]">
                <thead className="bg-slate-50 font-black text-slate-700 border-b border-slate-100">
                  <tr><th className="p-2">缴费期间</th><th className="p-2">计入规则</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  <tr><td className="p-2 font-bold">趸缴</td><td className="p-2 text-purple-700 font-bold">主险 APE = 年化新单保费 × 10%</td></tr>
                  <tr><td className="p-2 font-bold">非趸缴</td><td className="p-2 text-purple-700 font-bold">主险 APE = 年化新单保费 × 100%</td></tr>
                </tbody>
              </table>
            </div>
            <div className="text-[9px] text-slate-500 font-medium space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <p><strong>拆单管控：</strong>严格执行《关于拆单件的管控措施》（ADO-2023-058），符合拆单定义的保单将合并为1件计算。</p>
              <p><strong>发放规则：</strong>获奖营销员所获特别奖励金随中宏保险 2026 年 4 月份佣金奖金一起发放，且须承担个人所得税。</p>
            </div>
          </div>
        </div>
      )}
      <RuleFaq
        items={[
          { q: '1. 什么样的保单能计入二阶段？', a: '须于2026年1月1日至3月9日期间递交，并于2026年1月1日至3月31日期间签发，且于2026年4月15日（含）前过犹豫期。APE奖与件数奖各有指定产品清单，三年缴宏图/乐享丰年不进APE奖。' },
          { q: '2. 重疾加上OCR为什么能计2件？', a: '主险APE≥6,000计1件，附加康养畅享版APE≥6,000再计1件，可兼得。主险APE不足6,000但OCR达标时，只计OCR 1件。1月1日前递交的重疾事后加保OCR不计入。' },
          { q: '3. 拆单件和自保件怎么处理？', a: '同一被保险人同一缴费期间同一险种多张指定产品保单按ADO-2023-058合计为1件。监管地区自保件/互保件/亲属件不计入。' },
          { q: '4. 奖励什么时候发放？', a: '随2026年4月份佣金奖金一起发放，以4月份《营销员佣金奖金结算单》为准。发放时须仍为签约营销员，并承担个人所得税。' },
          { q: '5. 结案后保单变更会追回吗？', a: '竞赛结束后12个月内的保单变更若足以影响竞赛成绩，公司将追回全部奖励。总公司拥有最终解释权。' },
        ]}
      />
    </div>
  );
};

export const SsyRulesPanel: React.FC = () => {
  const [tab, setTab] = useState<'rewards' | 'products'>('rewards');
  return (
    <div className="space-y-4">
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60 shadow-inner">
        <button onClick={() => setTab('rewards')} className={`flex-1 py-2 text-xs font-black rounded-xl transition ${tab === 'rewards' ? 'bg-[#D80D18] text-white shadow-xs' : 'text-slate-500'}`}>奖励方案规则</button>
        <button onClick={() => setTab('products')} className={`flex-1 py-2 text-xs font-black rounded-xl transition ${tab === 'products' ? 'bg-[#D80D18] text-white shadow-xs' : 'text-slate-500'}`}>指定产品与换算规则</button>
      </div>
      {tab === 'rewards' ? (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-1.5">
            <h4 className="text-xs font-black text-slate-800">基本信息</h4>
            <p className="text-[10px] text-slate-600 leading-relaxed">
              <strong>文号：</strong>ADO-2025-055<br />
              <strong>参加对象：</strong>全体营销员<br />
              个养与福佑护理件数合并定档，再分别按各自件数 × 对应单价计奖。
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-1.5">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-slate-800">双税优件数阶梯奖励</h4>
              <span className="text-[8.5px] bg-[#FDF3F3] text-[#BE060C] font-bold px-2 py-0.5 rounded-full border border-[#F9DBDC]">最高 500元/件</span>
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed mb-2">
              营销员于活动期间销售指定产品，按个养+福佑护理累计净件数就高定档，个养与护理分别乘以该档单价。
            </p>
            <div className="overflow-hidden border border-slate-100 rounded-xl">
              <table className="w-full text-left text-[9.5px]">
                <thead className="bg-[#FDF3F3] font-black text-[#A40000] border-b border-slate-100">
                  <tr>
                    <th className="p-2">个养+护理累计净件数</th>
                    <th className="p-2">个养/件</th>
                    <th className="p-2">福佑护理/件</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  <tr><td className="p-2 font-bold">[5, 10)</td><td className="p-2 text-[#D80D18] font-bold">200元</td><td className="p-2 text-[#D80D18] font-bold">80元</td></tr>
                  <tr><td className="p-2 font-bold">[10, 20)</td><td className="p-2 text-[#D80D18] font-bold">300元</td><td className="p-2 text-[#D80D18] font-bold">100元</td></tr>
                  <tr><td className="p-2 font-bold">[20, 30)</td><td className="p-2 text-[#D80D18] font-bold">400元</td><td className="p-2 text-[#D80D18] font-bold">120元</td></tr>
                  <tr><td className="p-2 font-bold">≥ 30</td><td className="p-2 text-[#D80D18] font-bold">500元</td><td className="p-2 text-[#D80D18] font-bold">150元</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-3">
            <h4 className="text-xs font-black text-slate-800">活动期间1 · 个人养老金产品</h4>
            <p className="text-[10px] text-slate-600">递交 2025.12.15–2026.03.09 · 签发 2026.01.01–03.31 · 2026.04.15（含）前过犹。单张主险APE ≥ 10,000。</p>
            <div className="overflow-hidden border border-slate-100 rounded-xl">
              <table className="w-full text-left text-[9.5px]">
                <thead className="bg-[#FDF3F3] font-black text-[#A40000] border-b border-slate-100">
                  <tr><th className="p-2">指定产品</th><th className="p-2">简称</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  <tr><td className="p-2 font-bold text-slate-900">中宏养老顺心养老年金保险 (ARE)</td><td className="p-2 font-bold text-[#D80D18]">养老顺心</td></tr>
                  <tr><td className="p-2 font-bold text-slate-900">中宏养老添福两全保险 (AMQ)</td><td className="p-2 font-bold text-[#D80D18]">养老添福</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-3">
            <h4 className="text-xs font-black text-slate-800">活动期间2 · 福佑护理产品</h4>
            <p className="text-[10px] text-slate-600">递交 2026.01.01–2026.03.09 · 签发 2026.01.01–03.31 · 2026.04.15（含）前过犹。单张主险APE ≥ 2,400。</p>
            <div className="overflow-hidden border border-slate-100 rounded-xl">
              <table className="w-full text-left text-[9.5px]">
                <thead className="bg-[#FDF3F3] font-black text-[#A40000] border-b border-slate-100">
                  <tr><th className="p-2">指定产品</th><th className="p-2">简称</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  <tr><td className="p-2 font-bold text-slate-900">中宏福佑护理保险 (ACL)</td><td className="p-2 font-bold text-[#D80D18]">福佑护理</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-3">
            <h4 className="text-xs font-black text-slate-800">指定产品主险 APE 计入规则</h4>
            <div className="overflow-hidden border border-slate-100 rounded-xl">
              <table className="w-full text-left text-[10px]">
                <thead className="bg-slate-50 font-black text-slate-700 border-b border-slate-100">
                  <tr><th className="p-2">缴费期间</th><th className="p-2">计入规则</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  <tr><td className="p-2 font-bold">趸缴</td><td className="p-2 text-purple-700 font-bold">主险 APE = 年化新单保费 × 10%</td></tr>
                  <tr><td className="p-2 font-bold">非趸缴</td><td className="p-2 text-purple-700 font-bold">主险 APE = 年化新单保费 × 100%</td></tr>
                </tbody>
              </table>
            </div>
            <div className="text-[9px] text-slate-500 font-medium space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <p><strong>拆单管控：</strong>当月签发的同一被保险人同一缴费期间同一险种多张指定产品保单按ADO-2023-058合计为1件。个养产品不同场景内同一被保险人同一缴费期间同一险种保单，不被认定为拆单件。</p>
              <p><strong>发放规则：</strong>获奖营销员所获特别奖励金随 2026 年 4 月份佣金奖金一起发放，且须承担个人所得税。</p>
            </div>
          </div>
        </div>
      )}
      <RuleFaq
        items={[
          { q: '1. 个养和护理的窗口一样吗？', a: '签发和过犹一样：2026.01.01–03.31签发，04.15前过犹。递交不同：个养从2025.12.15起，护理从2026.01.01起，均到2026.03.09。' },
          { q: '2. 档位按什么件数算？', a: '按个养合格件+福佑护理合格件的合计净件数定档，再分别用该档的个养单价、护理单价乘各自件数。未满5件不定档、不计奖。' },
          { q: '3. 计件APE门槛是多少？', a: '个养（养老顺心、养老添福）单张主险APE≥10,000计1件；福佑护理单张主险APE≥2,400计1件。' },
          { q: '4. 个养会不会被拆单合并？', a: '方案期间签发的个养产品，不同场景内同一被保险人同一缴费期间同一险种保单，不被认定为拆单件。其他指定产品仍适用ADO-2023-058。' },
          { q: '5. 奖励什么时候发放？', a: '随2026年4月份佣金奖金一起发放，以4月份结算单为准。发放时须仍为签约营销员，并承担个人所得税。' },
        ]}
      />
    </div>
  );
};
