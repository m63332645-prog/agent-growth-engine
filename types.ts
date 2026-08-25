export enum ViewType {
  PERSONAL = 'PERSONAL',
  TEAM = 'TEAM',
  MY_INCOME = 'MY_INCOME',
  TEAM_PERFORMANCE = 'TEAM_PERFORMANCE',
  HONGYUN_ZONE = 'HONGYUN_ZONE',
  SUPERVISOR_INCOME = 'SUPERVISOR_INCOME'
}

export interface PerformanceStats {
  ape: number;
  paidFyc: number;
  unpaidFyc: number;
  policyCount: number;
  targetApe: number;
  dailyNewFyc?: number;
  dailyNewRyc?: number;
  dailyNewBonus?: number;
  bonusIncome?: number;
  renewalCommission?: number;
  issuedCommissionableFyc?: number;
  issuedCommissionableCount?: number;
  // Team specific metrics
  directRecruits?: number;
  activeManpower?: number;
  starDiamondManpower?: number;
}

export interface AttendanceData {
  daysPresent: number;
  totalDays: number;
  lateCount: number;
}

export interface GrowthStep {
  date: string;
  title: string;
  description: string;
  type: 'achievement' | 'training' | 'promotion';
}

export interface PromotionData {
  currentRank: string;
  nextRank: string;
  progress: number;
  requirements: {
    label: string;
    current: number;
    target: number;
  }[];
}

export interface TeamMember {
  id: string;
  name: string;
  rank: string;
  ape: number;
  retentionRisk: 'low' | 'medium' | 'high';
  // 新增详情字段
  groupName?: string;
  birthday?: string;
  hireDate?: string;
  hireDays?: number;
}

export interface PolicyDetail {
  policyNo: string;
  customerName: string;
  productType: string;
  productCode?: string;
  receiptDate: string;
  followUpDate: string;
  idCopy: string;
  ePolicyQc: string;
  videoQc: string;
  lapseDate: string;
  fycType: 'paid' | 'unpaid' | 'renewal' | 'issued_commissionable';
  amount: number;
  isNew?: boolean;
  commissionDate?: string;
  policyEffectiveDate?: string;
  commissionGenDate?: string;
  commissionBonusMonth?: string;
  policyStatus?: string;
  isSelfMutual?: boolean;
  isSelfPurchase?: boolean;
  isRelativePolicy?: boolean;
  additionalProducts?: Array<{
    productType: string;
    productCode?: string;
    policyEffectiveDate?: string;
    commissionGenDate?: string;
    commissionBonusMonth?: string;
    receiptDate?: string;
    followUpDate?: string;
    idCopy?: string;
    ePolicyQc?: string;
    videoQc?: string;
    lapseDate?: string;
  }>;
}

export interface BasicLawRequirement {
  name: string;
  current: string | number;
  target: string | number;
  gap: string | number;
  status: 'achieved' | 'warning' | 'critical';
  unit: string;
}