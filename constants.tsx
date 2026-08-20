import { PerformanceStats, AttendanceData, GrowthStep, PromotionData, TeamMember, PolicyDetail } from './types';

export const MOCK_PERSONAL_STATS: PerformanceStats = {
  ape: 125000,
  paidFyc: 25000,
  unpaidFyc: 13000,
  policyCount: 12,
  targetApe: 200000,
  dailyNewFyc: 4500,
  dailyNewRyc: 1200,
  dailyNewBonus: 500,
  bonusIncome: 5000,
  renewalCommission: 8000,
  issuedCommissionableFyc: 9533,
  issuedCommissionableCount: 9 
};

export const MOCK_TEAM_STATS: PerformanceStats = {
  ape: 850000,
  paidFyc: 150000,
  unpaidFyc: 70000,
  policyCount: 56,
  targetApe: 1000000,
  dailyNewFyc: 15000,
  dailyNewRyc: 3500,
  dailyNewBonus: 2000,
  bonusIncome: 25000,
  renewalCommission: 45000,
  issuedCommissionableFyc: 125000,
  issuedCommissionableCount: 45,
  directRecruits: 8,
  activeManpower: 12,
  starDiamondManpower: 5
};

export const MOCK_GROWTH_TREND = [
  { month: '1月', ape: 45000 },
  { month: '2月', ape: 52000 },
  { month: '3月', ape: 85000 },
  { month: '4月', ape: 78000 },
  { month: '5月', ape: 110000 },
  { month: '6月', ape: 125000 },
];

export const MOCK_RANKINGS = [
  { project: '递交APE', rank: '45', comparison: '85%' },
  { project: '总净APE', rank: '32', comparison: '91%' },
  { project: '递交件数', rank: '120', comparison: '65%' },
  { project: '净件数(签发)', rank: '115', comparison: '68%' },
  { project: '净FYC(签发)', rank: '58', comparison: '82%' },
  { project: '净FYC(发佣)', rank: '62', comparison: '80%' },
];

// Radar data for growth dimensions
export const MOCK_GROWTH_RADAR = [
  { subject: '收入', value: 85, fullMark: 100, key: 'income' },
  { subject: '个人发展', value: 70, fullMark: 100, key: 'rank' },
  { subject: '团队发展', value: 65, fullMark: 100, key: 'manpower' },
  { subject: '荣誉', value: 90, fullMark: 100, key: 'honor' },
  { subject: '专业度', value: 80, fullMark: 100, key: 'professional' },
];

// Historical trends for each dimension
export const MOCK_DIMENSION_TRENDS: Record<string, { label: string; data: any[] }> = {
  income: {
    label: '年度收入趋势 (FYC)',
    data: [
      { year: '2021', val: 58000 },
      { year: '2022', val: 125000 },
      { year: '2023', val: 189000 },
      { year: '2024', val: 245000 },
    ]
  },
  rank: {
    label: '职级晋升轨迹 (分值)',
    data: [
      { year: '2021', val: 1 }, // FC
      { year: '2022', val: 1 }, // FC
      { year: '2023', val: 2 }, // SUM
      { year: '2024', val: 2 }, // SUM
    ]
  },
  manpower: {
    label: '团队人力增长',
    data: [
      { year: '2021', val: 0 },
      { year: '2022', val: 2 },
      { year: '2023', val: 5 },
      { year: '2024', val: 8 },
    ]
  },
  honor: {
    label: '荣誉入围进度',
    data: [
      { year: '2021', val: 10 },
      { year: '2022', val: 40 },
      { year: '2023', val: 85 },
      { year: '2024', val: 95 },
    ]
  },
  professional: {
    label: '专业度评分 (测验/时长)',
    data: [
      { year: '2021', val: 60 },
      { year: '2022', val: 75 },
      { year: '2023', val: 88 },
      { year: '2024', val: 92 },
    ]
  }
};

export const MOCK_POLICIES: PolicyDetail[] = [
  {
    policyNo: 'P202405001',
    customerName: '王小明',
    productType: '中宏宏图相伴悦享版终身寿险（分红型）',
    productCode: 'AQR',
    receiptDate: '2024-05-10',
    followUpDate: '2024-05-12',
    idCopy: '通过',
    ePolicyQc: '完成',
    videoQc: '合格',
    lapseDate: '2024-06-10',
    fycType: 'paid',
    amount: 12000,
    isSelfMutual: true,
    commissionDate: '2026-03-01',
    policyEffectiveDate: '2024-05-11',
    commissionGenDate: '2026-03-01',
    commissionBonusMonth: '2026年03月',
    policyStatus: '有效-交费有效'
  },
  {
    policyNo: 'P202405002',
    customerName: '张美玲',
    productType: '中宏健康魔方守护版重大疾病保险',
    productCode: 'CSQ',
    receiptDate: '2024-05-15',
    followUpDate: '2024-05-16',
    idCopy: '通过',
    ePolicyQc: '完成',
    videoQc: '合格',
    lapseDate: '2024-06-15',
    fycType: 'paid',
    amount: 8000,
    isSelfPurchase: true,
    commissionDate: '2026-03-03',
    policyEffectiveDate: '2024-05-16',
    commissionGenDate: '2026-03-03',
    commissionBonusMonth: '2026年03月',
    policyStatus: '有效-交费有效'
  },
  {
    policyNo: 'P202405003',
    customerName: '陈志强',
    productType: '中宏宏福一生年金保险（分红型）',
    productCode: 'BOH',
    receiptDate: '2024-05-18',
    followUpDate: '2024-05-20',
    idCopy: '通过',
    ePolicyQc: '完成',
    videoQc: '合格',
    lapseDate: '2024-06-18',
    fycType: 'paid',
    amount: 5000,
    isNew: true,
    commissionDate: '2026-03-04',
    policyEffectiveDate: '2024-05-19',
    commissionGenDate: '2026-03-04',
    commissionBonusMonth: '2026年03月',
    policyStatus: '终止-犹豫期退保'
  },
  {
    policyNo: 'P202405009',
    customerName: '李大为',
    productType: '中宏健康双星守护版重大疾病保险',
    productCode: 'CZC',
    receiptDate: '2024-05-20',
    followUpDate: '待回访',
    idCopy: '待核对',
    ePolicyQc: '进行中',
    videoQc: '未上传',
    lapseDate: '2026-03-20',
    fycType: 'unpaid',
    amount: 4500,
    isNew: true,
    isRelativePolicy: true,
    policyEffectiveDate: '2024-05-21',
    commissionGenDate: '2026-03-05',
    commissionBonusMonth: '2026年03月',
    policyStatus: '有效-交费有效',
    additionalProducts: [
      {
        productType: '中宏健康魔方守护版重大疾病保险',
        productCode: 'CSQ',
        receiptDate: '2024-05-20',
        followUpDate: '待回访',
        idCopy: '待核对',
        ePolicyQc: '进行中',
        videoQc: '未上传',
        lapseDate: '2026-03-20'
      }
    ]
  },
  {
    policyNo: 'P202405010',
    customerName: '张美玲',
    productType: '中宏健康守卫恶性肿瘤A款疾病保险',
    productCode: 'CCX',
    receiptDate: '2024-05-25',
    followUpDate: '待回访',
    idCopy: '已核对',
    ePolicyQc: '完成',
    videoQc: '进行中',
    lapseDate: '2026-03-25',
    fycType: 'unpaid',
    amount: 8500,
    isNew: false,
    policyEffectiveDate: '2024-05-26',
    commissionGenDate: '2026-03-08',
    commissionBonusMonth: '2026年03月',
    policyStatus: '有效-交费有效'
  },
  {
    policyNo: 'R202405020',
    customerName: '赵铁柱',
    productType: '中宏宏图相伴尊享版终身寿险（分红型） - 续期',
    productCode: 'APY',
    receiptDate: '2023-05-10',
    followUpDate: '2024-05-10',
    idCopy: '已核对',
    ePolicyQc: '完成',
    videoQc: '合格',
    lapseDate: '2025-05-10',
    fycType: 'renewal',
    amount: 1200,
    isNew: true,
    policyEffectiveDate: '2023-05-11',
    commissionGenDate: '2026-03-10',
    commissionBonusMonth: '2026年03月',
    policyStatus: '有效-交费有效'
  },
  {
    policyNo: 'R202405021',
    customerName: '孙悟空',
    productType: '中宏健康魔方守护版重大疾病保险 - 续期',
    productCode: 'CSQ',
    receiptDate: '2022-05-15',
    followUpDate: '2024-05-15',
    idCopy: '已核对',
    ePolicyQc: '完成',
    videoQc: '合格',
    lapseDate: '2025-05-15',
    fycType: 'renewal',
    amount: 4500,
    policyEffectiveDate: '2022-05-16',
    commissionGenDate: '2026-03-12',
    commissionBonusMonth: '2026年03月',
    policyStatus: '有效-交费有效'
  },
  {
    policyNo: 'P202406001',
    customerName: '李大为',
    productType: '中宏健康双星守护版重大疾病保险',
    productCode: 'CZC',
    receiptDate: '2024-05-20',
    followUpDate: '2024-05-21',
    idCopy: '已核对',
    ePolicyQc: '完成',
    videoQc: '合格',
    lapseDate: '2026-03-20',
    fycType: 'issued_commissionable',
    amount: 4500,
    isNew: true,
    isSelfMutual: true,
    policyEffectiveDate: '2024-05-21',
    commissionGenDate: '2026-03-05',
    commissionBonusMonth: '2026年03月',
    policyStatus: '有效-交费有效',
    additionalProducts: [
      {
        productType: '中宏附加百万无忧守护版长期医疗保险（费率可调）',
        productCode: 'DMM',
        policyEffectiveDate: '2024-05-21',
        commissionGenDate: '2026-03-05',
        commissionBonusMonth: '2026年03月'
      }
    ]
  },
  {
    policyNo: 'P202406002',
    customerName: '张美玲',
    productType: '中宏宏佑世家逸享版养老年金保险（分红型）',
    productCode: 'AOD',
    receiptDate: '2024-05-25',
    followUpDate: '2024-05-26',
    idCopy: '已核对',
    ePolicyQc: '完成',
    videoQc: '合格',
    lapseDate: '2026-03-25',
    fycType: 'issued_commissionable',
    amount: 8500,
    isNew: false,
    policyEffectiveDate: '2024-05-26',
    commissionGenDate: '2026-03-08',
    commissionBonusMonth: '2026年03月',
    policyStatus: '有效-交费有效'
  }
];

export const MOCK_ATTENDANCE: AttendanceData = {
  daysPresent: 18,
  totalDays: 22,
  lateCount: 1
};

export const MOCK_TRAJECTORY: GrowthStep[] = [
  { date: '2023-10-15', title: '正式入司', description: '完成新人岗前培训', type: 'training' },
  { date: '2023-12-01', title: '首单达成', description: '成功签发第一张百万标保保单', type: 'achievement' },
  { date: '2024-03-20', title: '晋升主管', description: '成功晋升为SUM', type: 'promotion' },
  { date: '2024-05-12', title: '高峰会达成', description: '荣获分公司年度业务标兵', type: 'achievement' },
];

export const MOCK_PROMOTION: PromotionData = {
  currentRank: 'SUM',
  nextRank: 'ADM',
  progress: 88,
  requirements: [
    { label: '本人累计FYC', current: 38000, target: 43200 },
    { label: '直辖工作室FYC', current: 112000, target: 129600 },
    { label: '团队累计FYC', current: 680000, target: 720000 },
    { label: '星钻人力', current: 42, target: 48 },
    { label: '主管/经理人数', current: 2, target: 2 },
  ]
};

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  { 
    id: '1', name: '张三', rank: 'FC', ape: 45000, retentionRisk: 'low', 
    groupName: '精英一组', birthday: '1992-05-20', hireDate: '2023-10', hireDays: 450 
  },
  { 
    id: '2', name: '李四', rank: 'FC', ape: 12000, retentionRisk: 'medium',
    groupName: '财富二组', birthday: '1988-11-12', hireDate: '2024-01', hireDays: 360
  },
  { 
    id: '3', name: '王五', rank: 'SUM', ape: 150000, retentionRisk: 'low',
    groupName: '先锋三组', birthday: '1995-03-08', hireDate: '2022-06', hireDays: 920
  },
  { 
    id: '4', name: '赵六', rank: '新人', ape: 5000, retentionRisk: 'high',
    groupName: '新秀四组', birthday: '2000-07-24', hireDate: '2024-08', hireDays: 120
  },
];