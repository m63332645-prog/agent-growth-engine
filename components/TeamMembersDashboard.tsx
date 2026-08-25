import React from 'react';
import { motion } from 'motion/react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

interface MetricBadgeProps {
  label: string;
  value: number;
}

interface TeamMembersDashboardProps {
  activeMetricDashboard: string;
  activeScope: string;
  timeMult: number;
  actualNum: number;
  expandedManagers: Record<string, boolean>;
  toggleManager: (name: string) => void;
  forceEfficiencyStyle?: boolean; // 强制使用效能看板样式
  titleSuffix?: string; // 标题后缀，如"（活动量）"或"（效能）"
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
          return (
            <span
              key={m.label}
              className="inline-flex items-center gap-0.5 text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-100/50"
            >
              {m.label} <b className="font-extrabold font-mono text-slate-800">{val}</b>
            </span>
          );
        }

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

const TeamMembersDashboard: React.FC<TeamMembersDashboardProps> = ({
  activeMetricDashboard,
  activeScope,
  timeMult,
  actualNum,
  expandedManagers,
  toggleManager,
  forceEfficiencyStyle = false,
  titleSuffix = '',
}) => {
  const [searchKeyword, setSearchKeyword] = React.useState('');

  const matchesSearch = (name: string) => {
    if (!searchKeyword.trim()) return true;
    return name.toLowerCase().includes(searchKeyword.trim().toLowerCase());
  };

  const managerSubordinates: Record<string, string[]> = {
    '杨毅': ['杨毅', '李晓明', '徐丽华', '王小林', '张艳'],
    '田雨': ['田雨', '陈志强', '刘洋', '赵慧'],
    '钱鹏': ['钱鹏', '黄建国', '曾建明', '邓小凤'],
    '郑卫红': ['郑卫红', '郭建华', '彭玉琴', '欧阳龙'],
  };

  const hasAnyMatch = (names: string[]) => names.some(n => matchesSearch(n));

  // 根据 forceEfficiencyStyle 强制决定样式
  const isActivityStyle = forceEfficiencyStyle ? false : activeMetricDashboard === '活动量看板';
  return (
    <div id="team-members-dashboard" className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-50">
        <h3 className="text-sm font-black text-slate-800 tracking-wide flex items-center gap-2">
          <span className="w-1 bg-[#00A758] h-3.5 rounded-full inline-block"></span>
          {`团队人员看板${titleSuffix}`}
        </h3>
        <span className="text-[10px] text-slate-400 font-bold">
          共贡献入司 <b>{actualNum}</b> 人
        </span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="输入姓名搜索"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A758]/30 focus:border-[#00A758] transition-all"
        />
      </div>

      <div className="divide-y divide-slate-100">
        {activeScope === '直辖组' ? (
          <>
            {/* Direct recruitment contributors list */}
            {/* 杨毅 */}
            {matchesSearch('杨毅') && (
            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>杨毅</span>
                  <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">FC</span>
                </p>
                <MemberMetricBadges
                  keyId="direct-yangyi"
                  isActivityDashboard={isActivityStyle}
                  metrics={isActivityStyle ? [
                    { label: '建档', value: Math.round(12 * timeMult) },
                    { label: 'POP', value: Math.round(8 * timeMult) },
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
            {(!searchKeyword.trim() || matchesSearch('杨毅')) && (
            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>李晓明</span>
                  <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">FC</span>
                </p>
                <MemberMetricBadges
                  keyId="direct-lixiaoming"
                  isActivityDashboard={isActivityStyle}
                  metrics={isActivityStyle ? [
                    { label: '建档', value: Math.round(10 * timeMult) },
                    { label: 'POP', value: Math.round(7 * timeMult) },
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
            {(!searchKeyword.trim() || matchesSearch('杨毅')) && (
            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>徐丽华</span>
                  <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">FC</span>
                </p>
                <MemberMetricBadges
                  keyId="direct-xulihua"
                  isActivityDashboard={isActivityStyle}
                  metrics={isActivityStyle ? [
                    { label: '建档', value: Math.round(8 * timeMult) },
                    { label: 'POP', value: Math.round(5 * timeMult) },
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
            {(!searchKeyword.trim() || matchesSearch('杨毅')) && (
            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>王小林</span>
                  <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">FC</span>
                </p>
                <MemberMetricBadges
                  keyId="direct-wangxiaolin"
                  isActivityDashboard={isActivityStyle}
                  metrics={isActivityStyle ? [
                    { label: '建档', value: Math.round(5 * timeMult) },
                    { label: 'POP', value: Math.round(3 * timeMult) },
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
            {(!searchKeyword.trim() || matchesSearch('杨毅')) && (
            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>张艳</span>
                  <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">FC</span>
                </p>
                <MemberMetricBadges
                  keyId="direct-zhangyan"
                  isActivityDashboard={isActivityStyle}
                  metrics={isActivityStyle ? [
                    { label: '建档', value: Math.round(3 * timeMult) },
                    { label: 'POP', value: Math.round(1 * timeMult) },
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

            {searchKeyword.trim() && !matchesSearch('杨毅') && (
              <div className="py-8 text-center text-slate-400 text-xs">
                无匹配结果
              </div>
            )}
          </>
        ) : activeScope === '营业区' ? (
          <>
            {/* Division branch contributors list */}
            {/* 杨毅 */}
            {hasAnyMatch(managerSubordinates['杨毅']) && (
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
                    isActivityDashboard={isActivityStyle}
                    metrics={isActivityStyle ? [
                      { label: '建档', value: Math.round(40 * timeMult) },
                      { label: 'POP', value: Math.round(30 * timeMult) },
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
                  
                  {/* 主管本人数据 */}
                  {matchesSearch('杨毅') && (
                  <div className="flex items-center justify-between py-1 border-b border-dashed border-emerald-200/50 bg-emerald-50/30 rounded px-1">
                    <div>
                      <p className="font-bold text-[#00A758] flex items-center gap-1.5">
                        <span>杨毅</span>
                        <span className="text-[8.5px] font-normal text-[#00A758] bg-white border border-[#00A758]/20 px-1.5 py-0.5 rounded">UM</span>
                      </p>
                      <MemberMetricBadges
                        keyId="dist-yangyi-self"
                        isActivityDashboard={isActivityStyle}
                        metrics={isActivityStyle ? [
                          { label: '建档', value: Math.round(40 * timeMult) },
                          { label: 'POP', value: Math.round(30 * timeMult) },
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
                  
                  {(!searchKeyword.trim() || matchesSearch('杨毅')) && (
                  <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span>李晓明</span>
                        <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                      </p>
                      <MemberMetricBadges
                        keyId="dist-yangyi-lixiaoming"
                        isActivityDashboard={isActivityStyle}
                        metrics={[
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
                      <p className="font-extrabold text-[#00A758] text-xs font-mono">{Math.round(3 * timeMult)}人入司</p>
                    </div>
                  </div>
                  )}

                  {(!searchKeyword.trim() || matchesSearch('杨毅')) && (
                  <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span>徐丽华</span>
                        <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                      </p>
                      <MemberMetricBadges
                        keyId="dist-yangyi-xulihua"
                        isActivityDashboard={isActivityStyle}
                        metrics={[
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
                      <p className="font-extrabold text-[#00A758] text-xs font-mono">{Math.round(2 * timeMult)}人入司</p>
                    </div>
                  </div>
                  )}

                  {(!searchKeyword.trim() || matchesSearch('杨毅')) && (
                  <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span>王小林</span>
                        <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                      </p>
                      <MemberMetricBadges
                        keyId="dist-yangyi-wangxiaolin"
                        isActivityDashboard={isActivityStyle}
                        metrics={[
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
                      <p className="font-extrabold text-[#00A758] text-xs font-mono">{Math.round(1 * timeMult)}人入司</p>
                    </div>
                  </div>
                  )}

                  {(!searchKeyword.trim() || matchesSearch('杨毅')) && (
                  <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span>张艳</span>
                        <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                      </p>
                      <MemberMetricBadges
                        keyId="dist-yangyi-zhangyan"
                        isActivityDashboard={isActivityStyle}
                        metrics={[
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
                      <p className="font-extrabold text-slate-400 text-xs font-mono">0人入司</p>
                    </div>
                  </div>
                  )}
                </div>
              )}
            </div>
            )}

            {/* 田雨 */}
            {hasAnyMatch(managerSubordinates['田雨']) && (
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
                    isActivityDashboard={isActivityStyle}
                    metrics={isActivityStyle ? [
                      { label: '建档', value: Math.round(35 * timeMult) },
                      { label: 'POP', value: Math.round(25 * timeMult) },
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

                  {/* 主管本人数据 */}
                  {matchesSearch('田雨') && (
                  <div className="flex items-center justify-between py-1 border-b border-dashed border-emerald-200/50 bg-emerald-50/30 rounded px-1">
                    <div>
                      <p className="font-bold text-[#00A758] flex items-center gap-1.5">
                        <span>田雨</span>
                        <span className="text-[8.5px] font-normal text-[#00A758] bg-white border border-[#00A758]/20 px-1.5 py-0.5 rounded">SUM</span>
                      </p>
                      <MemberMetricBadges
                        keyId="dist-tianyu-self"
                        isActivityDashboard={isActivityStyle}
                        metrics={isActivityStyle ? [
                          { label: '建档', value: Math.round(35 * timeMult) },
                          { label: 'POP', value: Math.round(25 * timeMult) },
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

                  {(!searchKeyword.trim() || matchesSearch('田雨')) && (
                  <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span>陈志强</span>
                        <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                      </p>
                      <MemberMetricBadges
                        keyId="dist-tianyu-chenzhiqiang"
                        isActivityDashboard={isActivityStyle}
                        metrics={[
                          { label: '建档', value: Math.round(11 * timeMult) },
                          { label: 'POP', value: Math.round(8 * timeMult) },
                          { label: '深面', value: Math.round(4 * timeMult) },
                          { label: '决面', value: Math.round(4 * timeMult) },
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

                  {(!searchKeyword.trim() || matchesSearch('田雨')) && (
                  <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span>刘洋</span>
                        <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                      </p>
                      <MemberMetricBadges
                        keyId="dist-tianyu-liuyang"
                        isActivityDashboard={isActivityStyle}
                        metrics={[
                          { label: '建档', value: Math.round(7 * timeMult) },
                          { label: 'POP', value: Math.round(5 * timeMult) },
                          { label: '深面', value: Math.round(2 * timeMult) },
                          { label: '决面', value: Math.round(2 * timeMult) },
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

                  {(!searchKeyword.trim() || matchesSearch('田雨')) && (
                  <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span>赵慧</span>
                        <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                      </p>
                      <MemberMetricBadges
                        keyId="dist-tianyu-zhaohui"
                        isActivityDashboard={isActivityStyle}
                        metrics={[
                          { label: '建档', value: Math.round(4 * timeMult) },
                          { label: 'POP', value: Math.round(3 * timeMult) },
                          { label: '深面', value: 0 },
                          { label: '决面', value: 0 },
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
            {hasAnyMatch(managerSubordinates['钱鹏']) && (
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
                    isActivityDashboard={isActivityStyle}
                    metrics={isActivityStyle ? [
                      { label: '建档', value: Math.round(30 * timeMult) },
                      { label: 'POP', value: Math.round(18 * timeMult) },
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

                  {/* 主管本人数据 */}
                  {matchesSearch('钱鹏') && (
                  <div className="flex items-center justify-between py-1 border-b border-dashed border-emerald-200/50 bg-emerald-50/30 rounded px-1">
                    <div>
                      <p className="font-bold text-[#00A758] flex items-center gap-1.5">
                        <span>钱鹏</span>
                        <span className="text-[8.5px] font-normal text-[#00A758] bg-white border border-[#00A758]/20 px-1.5 py-0.5 rounded">UM</span>
                      </p>
                      <MemberMetricBadges
                        keyId="dist-qianpeng-self"
                        isActivityDashboard={isActivityStyle}
                        metrics={isActivityStyle ? [
                          { label: '建档', value: Math.round(30 * timeMult) },
                          { label: 'POP', value: Math.round(18 * timeMult) },
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

                  {(!searchKeyword.trim() || matchesSearch('钱鹏')) && (
                  <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span>黄建国</span>
                        <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                      </p>
                      <MemberMetricBadges
                        keyId="dist-qianpeng-huangjianguo"
                        isActivityDashboard={isActivityStyle}
                        metrics={[
                          { label: '建档', value: Math.round(9 * timeMult) },
                          { label: 'POP', value: Math.round(6 * timeMult) },
                          { label: '深面', value: Math.round(3 * timeMult) },
                          { label: '决面', value: Math.round(3 * timeMult) },
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

                  {(!searchKeyword.trim() || matchesSearch('钱鹏')) && (
                  <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span>曾建明</span>
                        <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                      </p>
                      <MemberMetricBadges
                        keyId="dist-qianpeng-zengjianming"
                        isActivityDashboard={isActivityStyle}
                        metrics={[
                          { label: '建档', value: Math.round(6 * timeMult) },
                          { label: 'POP', value: Math.round(4 * timeMult) },
                          { label: '深面', value: Math.round(2 * timeMult) },
                          { label: '决面', value: Math.round(2 * timeMult) },
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

                  {(!searchKeyword.trim() || matchesSearch('钱鹏')) && (
                  <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span>邓小凤</span>
                        <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                      </p>
                      <MemberMetricBadges
                        keyId="dist-qianpeng-dengxiaofeng"
                        isActivityDashboard={isActivityStyle}
                        metrics={[
                          { label: '建档', value: Math.round(3 * timeMult) },
                          { label: 'POP', value: Math.round(2 * timeMult) },
                          { label: '深面', value: 0 },
                          { label: '决面', value: 0 },
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
            {hasAnyMatch(managerSubordinates['郑卫红']) && (
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
                    isActivityDashboard={isActivityStyle}
                    metrics={isActivityStyle ? [
                      { label: '建档', value: Math.round(25 * timeMult) },
                      { label: 'POP', value: Math.round(15 * timeMult) },
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

                  {/* 主管本人数据 */}
                  {matchesSearch('郑卫红') && (
                  <div className="flex items-center justify-between py-1 border-b border-dashed border-emerald-200/50 bg-emerald-50/30 rounded px-1">
                    <div>
                      <p className="font-bold text-[#00A758] flex items-center gap-1.5">
                        <span>郑卫红</span>
                        <span className="text-[8.5px] font-normal text-[#00A758] bg-white border border-[#00A758]/20 px-1.5 py-0.5 rounded">UM</span>
                      </p>
                      <MemberMetricBadges
                        keyId="dist-zhengweihong-self"
                        isActivityDashboard={isActivityStyle}
                        metrics={isActivityStyle ? [
                          { label: '建档', value: Math.round(25 * timeMult) },
                          { label: 'POP', value: Math.round(15 * timeMult) },
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

                  {(!searchKeyword.trim() || matchesSearch('郑卫红')) && (
                  <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span>郭建华</span>
                        <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                      </p>
                      <MemberMetricBadges
                        keyId="dist-zhengweihong-guojianhua"
                        isActivityDashboard={isActivityStyle}
                        metrics={[
                          { label: '建档', value: Math.round(8 * timeMult) },
                          { label: 'POP', value: Math.round(5 * timeMult) },
                          { label: '深面', value: Math.round(2 * timeMult) },
                          { label: '决面', value: Math.round(2 * timeMult) },
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

                  {(!searchKeyword.trim() || matchesSearch('郑卫红')) && (
                  <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span>彭玉琴</span>
                        <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                      </p>
                      <MemberMetricBadges
                        keyId="dist-zhengweihong-pengyuqin"
                        isActivityDashboard={isActivityStyle}
                        metrics={[
                          { label: '建档', value: Math.round(5 * timeMult) },
                          { label: 'POP', value: Math.round(3 * timeMult) },
                          { label: '深面', value: 0 },
                          { label: '决面', value: 0 },
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

                  {(!searchKeyword.trim() || matchesSearch('郑卫红')) && (
                  <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span>欧阳龙</span>
                        <span className="text-[8.5px] font-normal text-slate-400 bg-white border px-1.5 py-0.5 rounded">FC</span>
                      </p>
                      <MemberMetricBadges
                        keyId="dist-zhengweihong-ouyanglong"
                        isActivityDashboard={isActivityStyle}
                        metrics={[
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

            {matchesSearch('杨毅') && (
            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>杨毅</span>
                  <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">FC</span>
                </p>
                <MemberMetricBadges
                  keyId="dist-sub-yangyi"
                  isActivityDashboard={isActivityStyle}
                  metrics={[
                    { label: '建档', value: Math.round(12 * timeMult) },
                    { label: 'POP', value: Math.round(8 * timeMult) },
                    { label: '深面', value: Math.round(5 * timeMult) },
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

            {(!searchKeyword.trim() || matchesSearch('杨毅')) && (
            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>李晓明</span>
                  <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">FC</span>
                </p>
                <MemberMetricBadges
                  keyId="dist-sub-lixiaoming"
                  isActivityDashboard={isActivityStyle}
                  metrics={[
                    { label: '建档', value: Math.round(10 * timeMult) },
                    { label: 'POP', value: Math.round(7 * timeMult) },
                    { label: '深面', value: Math.round(4 * timeMult) },
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

            {(!searchKeyword.trim() || matchesSearch('杨毅')) && (
            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>徐丽华</span>
                  <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">FC</span>
                </p>
                <MemberMetricBadges
                  keyId="dist-sub-xulihua"
                  isActivityDashboard={isActivityStyle}
                  metrics={[
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

            {(!searchKeyword.trim() || matchesSearch('杨毅')) && (
            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>王小林</span>
                  <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">FC</span>
                </p>
                <MemberMetricBadges
                  keyId="dist-sub-wangxiaolin"
                  isActivityDashboard={isActivityStyle}
                  metrics={[
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

            {(!searchKeyword.trim() || matchesSearch('杨毅')) && (
            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>张艳</span>
                  <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">FC</span>
                </p>
                <MemberMetricBadges
                  keyId="dist-sub-zhangyan"
                  isActivityDashboard={isActivityStyle}
                  metrics={[
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

            {searchKeyword.trim() && !hasAnyMatch(managerSubordinates['杨毅']) && !hasAnyMatch(managerSubordinates['田雨']) && !hasAnyMatch(managerSubordinates['钱鹏']) && !hasAnyMatch(managerSubordinates['郑卫红']) && !matchesSearch('杨毅') && (
              <div className="py-8 text-center text-slate-400 text-xs">
                无匹配结果
              </div>
            )}
          </>
        ) : (
          <>
            {/* Overall regional contributors list */}
            {matchesSearch('杨毅') && (
            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>杨毅</span>
                  <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">UM</span>
                </p>
                <MemberMetricBadges
                  keyId="dist-contrib-yangyi"
                  isActivityDashboard={isActivityStyle}
                  metrics={isActivityStyle ? [
                    { label: '建档', value: Math.round(120 * timeMult) },
                    { label: 'POP', value: Math.round(90 * timeMult) },
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

            {matchesSearch('田雨') && (
            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>田雨</span>
                  <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">SUM</span>
                </p>
                <MemberMetricBadges
                  keyId="dist-contrib-tianyu"
                  isActivityDashboard={isActivityStyle}
                  metrics={isActivityStyle ? [
                    { label: '建档', value: Math.round(100 * timeMult) },
                    { label: 'POP', value: Math.round(75 * timeMult) },
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

            {matchesSearch('钱鹏') && (
            <div className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>钱鹏</span>
                  <span className="text-[8.5px] font-normal text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded">UM</span>
                </p>
                <MemberMetricBadges
                  keyId="dist-contrib-qianpeng"
                  isActivityDashboard={isActivityStyle}
                  metrics={isActivityStyle ? [
                    { label: '建档', value: Math.round(90 * timeMult) },
                    { label: 'POP', value: Math.round(60 * timeMult) },
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

            {searchKeyword.trim() && !matchesSearch('杨毅') && !matchesSearch('田雨') && !matchesSearch('钱鹏') && (
              <div className="py-8 text-center text-slate-400 text-xs">无匹配结果</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TeamMembersDashboard;
