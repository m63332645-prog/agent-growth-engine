import React from 'react';
import { TeamMember } from '@/types';

export const MemberPerformanceDetail: React.FC<{
  member: TeamMember;
  onBack: () => void;
  isAmountHidden: boolean;
  onOpenBasicLaw: () => void;
  onOpenPromotion: () => void;
  onOpenHonor: () => void;
  onOpenSubsidy: () => void;
}> = ({ member, onBack, isAmountHidden, onOpenBasicLaw, onOpenPromotion, onOpenHonor, onOpenSubsidy }) => {
  return (
    <div className="fixed inset-0 z-[1200] bg-slate-50 flex flex-col animate-slide-up">
      {/* Header */}
      <div className="p-5 border-b border-white/20 flex items-center gap-4 glass-card sticky top-0 z-10 squircle-sm mx-2 mt-2">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-slate-600 glass-interaction shadow-sm">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div>
          <h3 className="text-lg font-bold text-slate-800">个人收入详情</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">成长与业绩管理</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-24 bg-slate-50">
        {/* Personal Card */}
        <section className="liquid-gradient-green squircle-lg p-7 text-white shadow-2xl relative overflow-hidden ios-shadow">
          <div className="absolute right-0 top-0 opacity-10 translate-x-4 -translate-y-4">
            <i className="fa-solid fa-address-card text-[140px]"></i>
          </div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-3xl font-black shadow-inner">
              {member.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black tracking-tight">{member.name}</h2>
                <span className="bg-yellow-400/90 backdrop-blur-sm text-yellow-900 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                  {member.rank}
                </span>
              </div>
              <p className="text-green-50/80 text-xs mt-1.5 font-bold uppercase tracking-wide">{member.groupName}</p>
              <div className="flex gap-6 mt-4 pt-4 border-t border-white/20">
                <div>
                  <p className="text-[9px] text-green-100 font-bold uppercase tracking-widest opacity-70">职级天数</p>
                  <p className="text-sm font-black mt-0.5">{member.hireDays}D</p>
                </div>
                <div>
                  <p className="text-[9px] text-green-100 font-bold uppercase tracking-widest opacity-70">入职日期</p>
                  <p className="text-sm font-black mt-0.5">{member.hireDate}</p>
                </div>
                <div>
                  <p className="text-[9px] text-green-100 font-bold uppercase tracking-widest opacity-70">出生月份</p>
                  <p className="text-sm font-black mt-0.5">{member.birthday?.split('-')[1]}M</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tracking Buttons Matrix */}
        <section className="space-y-4 px-1">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <i className="fa-solid fa-sliders text-[#00A758]"></i>
            指标追踪工具
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={onOpenBasicLaw}
              className="glass-card p-5 squircle border-white flex flex-col items-start gap-4 glass-interaction ios-shadow"
            >
              <div className="w-11 h-11 rounded-2xl bg-green-50 text-[#00A758] flex items-center justify-center text-xl shadow-inner border border-green-100">
                <i className="fa-solid fa-scroll"></i>
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-800 tracking-tight">基本法奖金</p>
                <p className="text-[10px] text-[#00A758] font-bold mt-1 bg-green-50 px-2 py-0.5 rounded-full inline-block">已达标(10k档)</p>
              </div>
            </button>

            <button 
              onClick={onOpenSubsidy}
              className="glass-card p-5 squircle border-white flex flex-col items-start gap-4 glass-interaction ios-shadow"
            >
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-xl shadow-inner border border-rose-100">
                <i className="fa-solid fa-sack-dollar"></i>
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-800 tracking-tight">财补追踪</p>
                <p className="text-[10px] text-rose-500 font-bold mt-1 bg-rose-50 px-2 py-0.5 rounded-full inline-block">还差 1 件保单</p>
              </div>
            </button>

            <button 
              onClick={onOpenPromotion}
              className="glass-card p-5 squircle border-white flex flex-col items-start gap-4 glass-interaction ios-shadow"
            >
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-[#00A758] flex items-center justify-center text-xl shadow-inner border border-indigo-100">
                <i className="fa-solid fa-arrow-up-right-dots"></i>
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-800 tracking-tight">晋升考核</p>
                <p className="text-[10px] text-[#00A758] font-bold mt-1 bg-indigo-50 px-2 py-0.5 rounded-full inline-block">目标: UM (75%)</p>
              </div>
            </button>

            <button 
              onClick={onOpenHonor}
              className="glass-card p-5 squircle border-white flex flex-col items-start gap-4 glass-interaction ios-shadow"
            >
              <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl shadow-inner border border-orange-100">
                <i className="fa-solid fa-trophy"></i>
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-800 tracking-tight">荣誉竞赛</p>
                <p className="text-[10px] text-orange-600 font-bold mt-1 bg-orange-50 px-2 py-0.5 rounded-full inline-block">MDRT进度 85%</p>
              </div>
            </button>
          </div>
        </section>

        {/* Action Call for Manager */}
        <section className="glass-card squircle-sm p-5 border-green-100 flex items-center gap-5 ios-shadow">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-[#00A758] shadow-inner border border-green-100">
            <i className="fa-solid fa-comments text-lg"></i>
          </div>
          <div className="flex-1">
            <h5 className="text-sm font-black text-slate-800">二轮面谈建议</h5>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">
              {member.name} 的财补进度临近，建议本周进行面谈，辅导其完成最后一单。
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
