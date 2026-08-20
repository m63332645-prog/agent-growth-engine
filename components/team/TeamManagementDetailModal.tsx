import React, { useState, useMemo, useEffect, useRef } from 'react';
import { TeamMember } from '@/types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronDown, 
  Search, 
  ArrowLeft, 
  SlidersHorizontal, 
  User, 
  Users, 
  Calendar, 
  Minimize2, 
  Maximize2,
  Info,
  CheckCircle2,
  ChevronLeft,
  Filter,
  Sparkles,
  Check,
  X,
  RotateCcw,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

export interface TeamNodeData {
  id: string;
  name: string;
  empId: string;
  rank: string; // EDD | SDD | DD | SDM | DM | SADM | ADM | SUM | UM | FC(AUM) | FC
  generation: string; // '1代' | '2代' | '3代' | '--'
  nodeType: 'supervisor' | 'personal' | 'direct_fc';
  parentId?: string;
  depth: number; // 0, 1, 2, 3...
  
  // 27 Columns Metrics
  递交件数: number;
  递交APE: number; // 万
  递交保单数: number;
  递交出单人数: number;
  净APE: number; // 万
  净件数: number;
  净FYC签发: number; // 万
  净FYC: number; // 万
  净出单人力: number;
  活动率: number; // %
  活动人均件数: number;
  系统人力: number;
  增员人数: number;
  星钻人力: number;
  '3MO': number;
  辖下主管数: number;
  第一代主管数: number;
  保费续保率6M: number; // %
  保费续保率12M: number; // %
  件数续保率6M: number; // %
  件数续保率12M: number; // %
  人均建议书打印量: number;

  children?: TeamNodeData[];
}

// Mock Data Tree with Root = 陈志远 (ADM)
const INITIAL_TREE_DATA: TeamNodeData = {
  id: 'root-chen',
  name: '陈志远',
  empId: 'MH880123',
  rank: 'ADM',
  generation: '--',
  nodeType: 'supervisor',
  depth: 0,
  递交件数: 386,
  递交APE: 168.5,
  递交保单数: 386,
  递交出单人数: 68,
  净APE: 152.2,
  净件数: 412,
  净FYC签发: 58.6,
  净FYC: 64.5,
  净出单人力: 62,
  活动率: 84.5,
  活动人均件数: 6.8,
  系统人力: 78,
  增员人数: 16,
  星钻人力: 36,
  '3MO': 8,
  辖下主管数: 10,
  第一代主管数: 3,
  保费续保率6M: 96.8,
  保费续保率12M: 94.5,
  件数续保率6M: 95.2,
  件数续保率12M: 92.8,
  人均建议书打印量: 18.4,
  children: [
    // 本人业绩
    {
      id: 'chen-self',
      name: '陈志远',
      empId: 'MH880123',
      rank: 'ADM',
      generation: '--',
      nodeType: 'personal',
      parentId: 'root-chen',
      depth: 1,
      递交件数: 42,
      递交APE: 22.8,
      递交保单数: 42,
      递交出单人数: 9,
      净APE: 20.1,
      净件数: 48,
      净FYC签发: 8.2,
      净FYC: 9.5,
      净出单人力: 1,
      活动率: 100,
      活动人均件数: 48,
      系统人力: 1,
      增员人数: 3,
      星钻人力: 1,
      '3MO': 1,
      辖下主管数: 0,
      第一代主管数: 0,
      保费续保率6M: 98.2,
      保费续保率12M: 96.5,
      件数续保率6M: 97.0,
      件数续保率12M: 95.1,
      人均建议书打印量: 24.5,
    },
    // 直辖 FC 成员 1
    {
      id: 'fc-li',
      name: '李晓东',
      empId: 'MH880201',
      rank: 'FC',
      generation: '--',
      nodeType: 'direct_fc',
      parentId: 'root-chen',
      depth: 1,
      递交件数: 18,
      递交APE: 8.6,
      递交保单数: 18,
      递交出单人数: 4,
      净APE: 8.2,
      净件数: 21,
      净FYC签发: 3.1,
      净FYC: 3.5,
      净出单人力: 1,
      活动率: 88.0,
      活动人均件数: 21,
      系统人力: 1,
      增员人数: 1,
      星钻人力: 1,
      '3MO': 0,
      辖下主管数: 0,
      第一代主管数: 0,
      保费续保率6M: 95.0,
      保费续保率12M: 92.4,
      件数续保率6M: 93.8,
      件数续保率12M: 90.5,
      人均建议书打印量: 15.2,
    },
    // 直辖 FC 成员 2
    {
      id: 'fc-wang',
      name: '王丽华',
      empId: 'MH880202',
      rank: 'FC',
      generation: '--',
      nodeType: 'direct_fc',
      parentId: 'root-chen',
      depth: 1,
      递交件数: 15,
      递交APE: 7.2,
      递交保单数: 15,
      递交出单人数: 3,
      净APE: 6.8,
      净件数: 16,
      净FYC签发: 2.5,
      净FYC: 2.8,
      净出单人力: 1,
      活动率: 82.0,
      活动人均件数: 16,
      系统人力: 1,
      增员人数: 0,
      星钻人力: 1,
      '3MO': 0,
      辖下主管数: 0,
      第一代主管数: 0,
      保费续保率6M: 94.1,
      保费续保率12M: 91.8,
      件数续保率6M: 92.5,
      件数续保率12M: 89.6,
      人均建议书打印量: 12.0,
    },
    // 直辖 FC 成员 3
    {
      id: 'fc-zhang',
      name: '张敏',
      empId: 'MH880203',
      rank: 'FC',
      generation: '--',
      nodeType: 'direct_fc',
      parentId: 'root-chen',
      depth: 1,
      递交件数: 12,
      递交APE: 5.4,
      递交保单数: 12,
      递交出单人数: 2,
      净APE: 5.0,
      净件数: 14,
      净FYC签发: 1.9,
      净FYC: 2.1,
      净出单人力: 1,
      活动率: 75.0,
      活动人均件数: 14,
      系统人力: 1,
      增员人数: 0,
      星钻人力: 0,
      '3MO': 0,
      辖下主管数: 0,
      第一代主管数: 0,
      保费续保率6M: 91.5,
      保费续保率12M: 88.0,
      件数续保率6M: 90.2,
      件数续保率12M: 87.1,
      人均建议书打印量: 9.8,
    },

    // 1代主管 1: 林晓芳 (DM) - 1代主管
    {
      id: 'sup-lin',
      name: '林晓芳',
      empId: 'MH880301',
      rank: 'DM',
      generation: '1代',
      nodeType: 'supervisor',
      parentId: 'root-chen',
      depth: 1,
      递交件数: 154,
      递交APE: 68.2,
      递交保单数: 154,
      递交出单人数: 28,
      净APE: 62.8,
      净件数: 168,
      净FYC签发: 23.5,
      净FYC: 26.0,
      净出单人力: 25,
      活动率: 83.3,
      活动人均件数: 6.9,
      系统人力: 32,
      增员人数: 7,
      星钻人力: 16,
      '3MO': 4,
      辖下主管数: 2,
      第一代主管数: 1,
      保费续保率6M: 97.1,
      保费续保率12M: 95.0,
      件数续保率6M: 96.0,
      件数续保率12M: 93.5,
      人均建议书打印量: 19.1,
      children: [
        {
          id: 'lin-self',
          name: '林晓芳',
          empId: 'MH880301',
          rank: 'DM',
          generation: '--',
          nodeType: 'personal',
          parentId: 'sup-lin',
          depth: 2,
          递交件数: 32,
          递交APE: 15.1,
          递交保单数: 32,
          递交出单人数: 6,
          净APE: 14.0,
          净件数: 35,
          净FYC签发: 5.6,
          净FYC: 6.2,
          净出单人力: 1,
          活动率: 100,
          活动人均件数: 35,
          系统人力: 1,
          增员人数: 2,
          星钻人力: 1,
          '3MO': 1,
          辖下主管数: 0,
          第一代主管数: 0,
          保费续保率6M: 98.5,
          保费续保率12M: 96.8,
          件数续保率6M: 97.5,
          件数续保率12M: 95.5,
          人均建议书打印量: 22.0,
        },
        {
          id: 'fc-sun',
          name: '孙强',
          empId: 'MH880302',
          rank: 'FC',
          generation: '--',
          nodeType: 'direct_fc',
          parentId: 'sup-lin',
          depth: 2,
          递交件数: 22,
          递交APE: 9.8,
          递交保单数: 22,
          递交出单人数: 4,
          净APE: 9.0,
          净件数: 24,
          净FYC签发: 3.4,
          净FYC: 3.8,
          净出单人力: 1,
          活动率: 85.0,
          活动人均件数: 24,
          系统人力: 1,
          增员人数: 1,
          星钻人力: 1,
          '3MO': 0,
          辖下主管数: 0,
          第一代主管数: 0,
          保费续保率6M: 96.0,
          保费续保率12M: 93.5,
          件数续保率6M: 94.8,
          件数续保率12M: 92.0,
          人均建议书打印量: 16.5,
        },
        // 2代主管: 周子涵 (UM) - 林晓芳育成的 1 代主管，相对于陈志远为 2 代
        {
          id: 'sup-zhou',
          name: '周子涵',
          empId: 'MH880303',
          rank: 'UM',
          generation: '2代',
          nodeType: 'supervisor',
          parentId: 'sup-lin',
          depth: 2,
          递交件数: 100,
          递交APE: 43.3,
          递交保单数: 100,
          递交出单人数: 18,
          净APE: 39.8,
          净件数: 109,
          净FYC签发: 14.5,
          净FYC: 16.0,
          净出单人力: 16,
          活动率: 80.0,
          活动人均件数: 7.2,
          系统人力: 20,
          增员人数: 4,
          星钻人力: 9,
          '3MO': 3,
          辖下主管数: 1,
          第一代主管数: 1,
          保费续保率6M: 95.8,
          保费续保率12M: 93.8,
          件数续保率6M: 94.5,
          件数续保率12M: 91.9,
          人均建议书打印量: 17.0,
          children: [
            {
              id: 'zhou-self',
              name: '周子涵',
              empId: 'MH880303',
              rank: 'UM',
              generation: '--',
              nodeType: 'personal',
              parentId: 'sup-zhou',
              depth: 3,
              递交件数: 28,
              递交APE: 12.2,
              递交保单数: 28,
              递交出单人数: 5,
              净APE: 11.2,
              净件数: 30,
              净FYC签发: 4.2,
              净FYC: 4.8,
              净出单人力: 1,
              活动率: 100,
              活动人均件数: 30,
              系统人力: 1,
              增员人数: 1,
              星钻人力: 1,
              '3MO': 1,
              辖下主管数: 0,
              第一代主管数: 0,
              保费续保率6M: 97.0,
              保费续保率12M: 95.0,
              件数续保率6M: 96.0,
              件数续保率12M: 93.5,
              人均建议书打印量: 18.0,
            },
            {
              id: 'fc-liu',
              name: '刘洋',
              empId: 'MH880304',
              rank: 'FC',
              generation: '--',
              nodeType: 'direct_fc',
              parentId: 'sup-zhou',
              depth: 3,
              递交件数: 20,
              递交APE: 8.5,
              递交保单数: 20,
              递交出单人数: 3,
              净APE: 7.8,
              净件数: 22,
              净FYC签发: 2.8,
              净FYC: 3.2,
              净出单人力: 1,
              活动率: 80.0,
              活动人均件数: 22,
              系统人力: 1,
              增员人数: 1,
              星钻人力: 1,
              '3MO': 0,
              辖下主管数: 0,
              第一代主管数: 0,
              保费续保率6M: 94.5,
              保费续保率12M: 92.0,
              件数续保率6M: 93.0,
              件数续保率12M: 90.0,
              人均建议书打印量: 14.5,
            },
            // 3代主管: 吴嘉伟 (UM) - 周子涵育成的 1 代主管，相对于陈志远为 3 代
            {
              id: 'sup-wu',
              name: '吴嘉伟',
              empId: 'MH880305',
              rank: 'UM',
              generation: '3代',
              nodeType: 'supervisor',
              parentId: 'sup-zhou',
              depth: 3,
              递交件数: 52,
              递交APE: 22.6,
              递交保单数: 52,
              递交出单人数: 10,
              净APE: 20.8,
              净件数: 57,
              净FYC签发: 7.5,
              净FYC: 8.0,
              净出单人力: 9,
              活动率: 75.0,
              活动人均件数: 6.3,
              系统人力: 12,
              增员人数: 2,
              星钻人力: 4,
              '3MO': 1,
              辖下主管数: 0,
              第一代主管数: 0,
              保费续保率6M: 94.0,
              保费续保率12M: 91.5,
              件数续保率6M: 92.8,
              件数续保率12M: 89.8,
              人均建议书打印量: 15.0,
              children: [
                {
                  id: 'wu-self',
                  name: '吴嘉伟',
                  empId: 'MH880305',
                  rank: 'UM',
                  generation: '--',
                  nodeType: 'personal',
                  parentId: 'sup-wu',
                  depth: 4,
                  递交件数: 26,
                  递交APE: 11.2,
                  递交保单数: 26,
                  递交出单人数: 4,
                  净APE: 10.2,
                  净件数: 28,
                  净FYC签发: 3.8,
                  净FYC: 4.2,
                  净出单人力: 1,
                  活动率: 100,
                  活动人均件数: 28,
                  系统人力: 1,
                  增员人数: 1,
                  星钻人力: 1,
                  '3MO': 1,
                  辖下主管数: 0,
                  第一代主管数: 0,
                  保费续保率6M: 95.5,
                  保费续保率12M: 93.0,
                  件数续保率6M: 94.0,
                  件数续保率12M: 91.5,
                  人均建议书打印量: 17.5,
                },
                {
                  id: 'fc-zheng',
                  name: '郑小玲',
                  empId: 'MH880306',
                  rank: 'FC',
                  generation: '--',
                  nodeType: 'direct_fc',
                  parentId: 'sup-wu',
                  depth: 4,
                  递交件数: 26,
                  递交APE: 11.4,
                  递交保单数: 26,
                  递交出单人数: 6,
                  净APE: 10.6,
                  净件数: 29,
                  净FYC签发: 3.7,
                  净FYC: 3.8,
                  净出单人力: 1,
                  活动率: 83.3,
                  活动人均件数: 29,
                  系统人力: 1,
                  增员人数: 1,
                  星钻人力: 1,
                  '3MO': 0,
                  辖下主管数: 0,
                  第一代主管数: 0,
                  保费续保率6M: 93.0,
                  保费续保率12M: 90.0,
                  件数续保率6M: 91.5,
                  件数续保率12M: 88.5,
                  人均建议书打印量: 13.0,
                }
              ]
            }
          ]
        }
      ]
    },

    // 1代主管 2: 王建国 (UM) - 1代主管，营业区保留
    {
      id: 'sup-wangjg',
      name: '王建国',
      empId: 'MH880401',
      rank: 'UM',
      generation: '1代',
      nodeType: 'supervisor',
      parentId: 'root-chen',
      depth: 1,
      递交件数: 58,
      递交APE: 24.5,
      递交保单数: 58,
      递交出单人数: 11,
      净APE: 22.8,
      净件数: 62,
      净FYC签发: 8.2,
      净FYC: 9.1,
      净出单人力: 10,
      活动率: 80.0,
      活动人均件数: 6.2,
      系统人力: 12,
      增员人数: 2,
      星钻人力: 5,
      '3MO': 1,
      辖下主管数: 0,
      第一代主管数: 0,
      保费续保率6M: 96.0,
      保费续保率12M: 93.8,
      件数续保率6M: 94.2,
      件数续保率12M: 91.5,
      人均建议书打印量: 16.2,
      children: [
        {
          id: 'wangjg-self',
          name: '王建国',
          empId: 'MH880401',
          rank: 'UM',
          generation: '--',
          nodeType: 'personal',
          parentId: 'sup-wangjg',
          depth: 2,
          递交件数: 28,
          递交APE: 12.0,
          递交保单数: 28,
          递交出单人数: 5,
          净APE: 11.0,
          净件数: 30,
          净FYC签发: 4.0,
          净FYC: 4.5,
          净出单人力: 1,
          活动率: 100,
          活动人均件数: 30,
          系统人力: 1,
          增员人数: 1,
          星钻人力: 1,
          '3MO': 1,
          辖下主管数: 0,
          第一代主管数: 0,
          保费续保率6M: 97.0,
          保费续保率12M: 95.0,
          件数续保率6M: 95.5,
          件数续保率12M: 93.0,
          人均建议书打印量: 18.0,
        },
        {
          id: 'fc-qian',
          name: '钱伟',
          empId: 'MH880402',
          rank: 'FC',
          generation: '--',
          nodeType: 'direct_fc',
          parentId: 'sup-wangjg',
          depth: 2,
          递交件数: 30,
          递交APE: 12.5,
          递交保单数: 30,
          递交出单人数: 6,
          净APE: 11.8,
          净件数: 32,
          净FYC签发: 4.2,
          净FYC: 4.6,
          净出单人力: 1,
          活动率: 83.3,
          活动人均件数: 32,
          系统人力: 1,
          增员人数: 1,
          星钻人力: 1,
          '3MO': 0,
          辖下主管数: 0,
          第一代主管数: 0,
          保费续保率6M: 95.0,
          保费续保率12M: 92.5,
          件数续保率6M: 93.0,
          件数续保率12M: 90.0,
          人均建议书打印量: 14.4,
        }
      ]
    },

    // 1代主管 3: 赵天佑 (SADM) - 1代主管，营业区需剔除（已达 SADM 职级），所辖保留
    {
      id: 'sup-zhao',
      name: '赵天佑',
      empId: 'MH880501',
      rank: 'SADM',
      generation: '1代',
      nodeType: 'supervisor',
      parentId: 'root-chen',
      depth: 1,
      递交件数: 98,
      递交APE: 42.1,
      递交保单数: 98,
      递交出单人数: 18,
      净APE: 38.6,
      净件数: 108,
      净FYC签发: 14.2,
      净FYC: 16.0,
      净出单人力: 16,
      活动率: 88.9,
      活动人均件数: 6.8,
      系统人力: 18,
      增员人数: 4,
      星钻人力: 9,
      '3MO': 2,
      辖下主管数: 1,
      第一代主管数: 1,
      保费续保率6M: 97.5,
      保费续保率12M: 95.8,
      件数续保率6M: 96.2,
      件数续保率12M: 94.0,
      人均建议书打印量: 20.5,
      children: [
        {
          id: 'zhao-self',
          name: '赵天佑',
          empId: 'MH880501',
          rank: 'SADM',
          generation: '--',
          nodeType: 'personal',
          parentId: 'sup-zhao',
          depth: 2,
          递交件数: 38,
          递交APE: 16.5,
          递交保单数: 38,
          递交出单人数: 7,
          净APE: 15.2,
          净件数: 42,
          净FYC签发: 5.8,
          净FYC: 6.5,
          净出单人力: 1,
          活动率: 100,
          活动人均件数: 42,
          系统人力: 1,
          增员人数: 2,
          星钻人力: 1,
          '3MO': 1,
          辖下主管数: 0,
          第一代主管数: 0,
          保费续保率6M: 98.0,
          保费续保率12M: 96.0,
          件数续保率6M: 97.0,
          件数续保率12M: 95.0,
          人均建议书打印量: 22.5,
        },
        {
          id: 'fc-zheng-y',
          name: '郑阳',
          empId: 'MH880502',
          rank: 'FC',
          generation: '--',
          nodeType: 'direct_fc',
          parentId: 'sup-zhao',
          depth: 2,
          递交件数: 20,
          递交APE: 8.6,
          递交保单数: 20,
          递交出单人数: 4,
          净APE: 7.9,
          净件数: 22,
          净FYC签发: 2.9,
          净FYC: 3.3,
          净出单人力: 1,
          活动率: 80.0,
          活动人均件数: 22,
          系统人力: 1,
          增员人数: 1,
          星钻人力: 1,
          '3MO': 0,
          辖下主管数: 0,
          第一代主管数: 0,
          保费续保率6M: 95.5,
          保费续保率12M: 93.0,
          件数续保率6M: 94.0,
          件数续保率12M: 91.0,
          人均建议书打印量: 15.5,
        },
        // 2代主管: 黄伟强 (DM) - 赵天佑育成的 1 代主管，相对于陈志远为 2 代
        {
          id: 'sup-huang',
          name: '黄伟强',
          empId: 'MH880503',
          rank: 'DM',
          generation: '2代',
          nodeType: 'supervisor',
          parentId: 'sup-zhao',
          depth: 2,
          递交件数: 40,
          递交APE: 17.0,
          递交保单数: 40,
          递交出单人数: 7,
          净APE: 15.5,
          净件数: 44,
          净FYC签发: 5.5,
          净FYC: 6.2,
          净出单人力: 6,
          活动率: 85.7,
          活动人均件数: 7.3,
          系统人力: 7,
          增员人数: 1,
          星钻人力: 3,
          '3MO': 1,
          辖下主管数: 0,
          第一代主管数: 0,
          保费续保率6M: 96.0,
          保费续保率12M: 93.5,
          件数续保率6M: 95.0,
          件数续保率12M: 92.0,
          人均建议书打印量: 17.0,
          children: [
            {
              id: 'huang-self',
              name: '黄伟强',
              empId: 'MH880503',
              rank: 'DM',
              generation: '--',
              nodeType: 'personal',
              parentId: 'sup-huang',
              depth: 3,
              递交件数: 40,
              递交APE: 17.0,
              递交保单数: 40,
              递交出单人数: 7,
              净APE: 15.5,
              净件数: 44,
              净FYC签发: 5.5,
              净FYC: 6.2,
              净出单人力: 1,
              活动率: 100,
              活动人均件数: 44,
              系统人力: 1,
              增员人数: 1,
              星钻人力: 1,
              '3MO': 1,
              辖下主管数: 0,
              第一代主管数: 0,
              保费续保率6M: 96.0,
              保费续保率12M: 93.5,
              件数续保率6M: 95.0,
              件数续保率12M: 92.0,
              人均建议书打印量: 17.0,
            }
          ]
        }
      ]
    }
  ]
};

// Rank priority list (from high to low according to PRD VII)
// EDD -> SDD -> DD -> SDM -> DM -> SADM -> ADM -> SUM -> UM -> FC(AUM) -> FC
const SADM_AND_ABOVE_RANKS = ['SADM', 'ADM', 'SDM', 'DD', 'SDD', 'EDD'];

interface TeamManagementDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialScope?: '直辖室' | '营业区' | '所辖';
  onSelectMember?: (member: TeamMember) => void;
}

export const TeamManagementDetailModal: React.FC<TeamManagementDetailModalProps> = ({ isOpen, onClose, initialScope, onSelectMember }) => {
  // State
  const [scope, setScope] = useState<'直辖室' | '营业区' | '所辖'>(initialScope || '所辖');
  const [archMode, setArchMode] = useState<'育成' | '管理'>('管理');

  useEffect(() => {
    if (isOpen) {
      if (initialScope) {
        setScope(initialScope);
      }
      setArchMode('管理'); // 默认育成架构关闭（管理架构模式）
    }
  }, [isOpen, initialScope]);
  // Helper to format YYYY-MM to 2-digit year format XX年XX月
  const formatShortMonth = (val: string) => {
    if (!val) return '';
    const [y, m] = val.split('-');
    if (!y || !m) return val;
    const shortYear = y.length === 4 ? y.slice(2) : y;
    return `${shortYear}年${m}月`;
  };

  const [startTime, setStartTime] = useState<string>('2025-03');
  const [endTime, setEndTime] = useState<string>('2026-03');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSearchTags, setSelectedSearchTags] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef<boolean>(false);

  const startTimeInputRef = useRef<HTMLInputElement>(null);
  const endTimeInputRef = useRef<HTMLInputElement>(null);

  // Click outside to hide search suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const [selectedRanks, setSelectedRanks] = useState<string[]>([]);
  const [selectedGenerations, setSelectedGenerations] = useState<string[]>([]);
  const [isCompact, setIsCompact] = useState<boolean>(false);
  const [expandedNodeIds, setExpandedNodeIds] = useState<Record<string, boolean>>({
    'root-chen': true,
    'sup-lin': true,
    'sup-zhou': true
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;

  // Map of all nodes for fast ancestor lookups
  const allNodesMap = useMemo(() => {
    const map = new Map<string, TeamNodeData>();
    const collect = (node: TeamNodeData) => {
      map.set(node.id, node);
      if (node.children) {
        for (const child of node.children) {
          collect(child);
        }
      }
    };
    collect(INITIAL_TREE_DATA);
    return map;
  }, []);

  // Track top visible row when scrolling table
  const [activeTopRowId, setActiveTopRowId] = useState<string | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!tableContainerRef.current) return;
    const container = tableContainerRef.current;
    const scrollTop = container.scrollTop;
    const theadHeight = 36;

    const rowElements = container.querySelectorAll<HTMLTableRowElement>('tbody tr[data-node-id]');
    let topRowId: string | null = null;

    for (let i = 0; i < rowElements.length; i++) {
      const el = rowElements[i];
      if (el.offsetTop + el.offsetHeight > scrollTop + theadHeight + 4) {
        topRowId = el.getAttribute('data-node-id');
        break;
      }
    }

    if (topRowId && topRowId !== activeTopRowId) {
      setActiveTopRowId(topRowId);
    }
  };

  // Ancestor supervisor list for active top row
  const topVisibleAncestors = useMemo(() => {
    if (!activeTopRowId) return [];

    const ancestors: TeamNodeData[] = [];
    let currId: string | undefined = activeTopRowId;
    const visited = new Set<string>();

    while (currId && !visited.has(currId)) {
      visited.add(currId);
      const node = allNodesMap.get(currId);
      if (!node) break;

      if (currId !== activeTopRowId) {
        if (node.nodeType === 'supervisor' || node.id === 'root-chen') {
          ancestors.push(node);
        }
      }
      currId = node.parentId;
    }

    return ancestors.reverse();
  }, [activeTopRowId, allNodesMap]);

  const ALL_RANKS = ['ADM', 'SADM', 'DM', 'UM', 'FC'];
  const ALL_GENERATIONS = ['1代', '2代', '3代', '--'];

  // Toggle multi-select rank
  const toggleRank = (rank: string) => {
    setSelectedRanks(prev =>
      prev.includes(rank) ? prev.filter(r => r !== rank) : [...prev, rank]
    );
    setCurrentPage(1);
  };

  // Toggle multi-select generation
  const toggleGeneration = (gen: string) => {
    setSelectedGenerations(prev =>
      prev.includes(gen) ? prev.filter(g => g !== gen) : [...prev, gen]
    );
    setCurrentPage(1);
  };

  // Toggle search tag
  const toggleSearchTag = (tag: string) => {
    setSelectedSearchTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  // Add search tag from input or suggestion
  const addSearchTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !selectedSearchTags.includes(trimmed)) {
      setSelectedSearchTags(prev => [...prev, trimmed]);
      setCurrentPage(1);
    }
  };

  // Reset all search & multi-select filters
  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedSearchTags([]);
    setSelectedRanks([]);
    setSelectedGenerations([]);
    setShowSuggestions(false);
    setStartTime('2025-03');
    setEndTime('2026-03');
    setCurrentPage(1);
  };

  // Time multiplier to scale metrics if start/end month adjusted
  const timeMultiplier = useMemo(() => {
    const [startYear, startMonth] = startTime.split('-').map(Number);
    const [endYear, endMonth] = endTime.split('-').map(Number);
    if (!startYear || !startMonth || !endYear || !endMonth) return 1.0;

    const months = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
    if (months <= 0) return 0.1;
    return Number((months / 12).toFixed(2));
  }, [startTime, endTime]);

  // Expand / collapse node
  const toggleExpand = (nodeId: string) => {
    setExpandedNodeIds(prev => {
      const next = { ...prev };
      if (next[nodeId]) {
        // Cascading collapse descendants
        delete next[nodeId];
      } else {
        next[nodeId] = true;
      }
      return next;
    });
  };

  // Filter tree data according to active scope and archMode
  const filteredTree = useMemo(() => {
    const filterNode = (node: TeamNodeData): TeamNodeData | null => {
      // Scale numeric values with timeMultiplier
      const scaledNode: TeamNodeData = {
        ...node,
        递交件数: Math.round(node.递交件数 * timeMultiplier),
        递交APE: Number((node.递交APE * timeMultiplier).toFixed(1)),
        递交保单数: Math.round(node.递交保单数 * timeMultiplier),
        递交出单人数: Math.round(node.递交出单人数 * timeMultiplier),
        净APE: Number((node.净APE * timeMultiplier).toFixed(1)),
        净件数: Math.round(node.净件数 * timeMultiplier),
        净FYC签发: Number((node.净FYC签发 * timeMultiplier).toFixed(1)),
        净FYC: Number((node.净FYC * timeMultiplier).toFixed(1)),
        净出单人力: Math.round(node.净出单人力 * timeMultiplier),
        系统人力: Math.round(node.系统人力 * timeMultiplier),
        增员人数: Math.round(node.增员人数 * timeMultiplier),
        星钻人力: Math.round(node.星钻人力 * timeMultiplier),
      };

      // === 1. 育成架构模式 (archMode === '育成') ===
      if (archMode === '育成') {
        if (scope === '直辖室') {
          // 直辖室口径：仅展示被育成的普通主管（UM/DM），绝对不包含已晋升独立区的 SADM 及以上区经理
          if (node.id === 'root-chen') {
            const validChildren: TeamNodeData[] = [];
            if (node.children) {
              for (const child of node.children) {
                const filteredChild = filterNode(child);
                if (filteredChild) validChildren.push(filteredChild);
              }
            }
            return { ...scaledNode, children: validChildren };
          }
          if (node.nodeType === 'supervisor') {
            // SADM 及以上主管已有独立营业区，在直辖室口径下绝对不存在！
            if (SADM_AND_ABOVE_RANKS.includes(node.rank)) {
              return null;
            }
            // 普通主管（UM/DM）：保留展示
            const validChildren: TeamNodeData[] = [];
            if (node.children) {
              for (const child of node.children) {
                const filteredChild = filterNode(child);
                if (filteredChild) validChildren.push(filteredChild);
              }
            }
            return { ...scaledNode, children: validChildren };
          }
          return null; // 排除非主管个人节点
        }

        if (scope === '营业区') {
          // 营业区口径：展示被育成的区经理（SADM 及以上）
          if (node.id === 'root-chen') {
            const validChildren: TeamNodeData[] = [];
            if (node.children) {
              for (const child of node.children) {
                const filteredChild = filterNode(child);
                if (filteredChild) validChildren.push(filteredChild);
              }
            }
            return { ...scaledNode, children: validChildren };
          }
          if (node.nodeType === 'supervisor') {
            if (SADM_AND_ABOVE_RANKS.includes(node.rank)) {
              // 保留 SADM 及以上区经理节点
              const validChildren: TeamNodeData[] = [];
              if (node.children) {
                for (const child of node.children) {
                  const filteredChild = filterNode(child);
                  if (filteredChild) validChildren.push(filteredChild);
                }
              }
              return { ...scaledNode, children: validChildren };
            }
            // 非 SADM 主管（UM/DM），检查其下代是否有 SADM
            const validChildren: TeamNodeData[] = [];
            if (node.children) {
              for (const child of node.children) {
                const filteredChild = filterNode(child);
                if (filteredChild) validChildren.push(filteredChild);
              }
            }
            if (validChildren.length > 0) {
              return { ...scaledNode, children: validChildren };
            }
            return null;
          }
          return null; // 排除非主管节点
        }
      }

      // === 2. 管理架构模式 (archMode === '管理') ===
      if (scope === '直辖室') {
        // 直辖室（含个人）：仅查询用户本人 + 直辖 FC 成员。无任何下级主管节点。
        if (node.id === 'root-chen') {
          return {
            ...scaledNode,
            children: (node.children || []).filter(
              child => child.nodeType === 'personal' || child.nodeType === 'direct_fc'
            ).map(child => ({
              ...child,
              递交件数: Math.round(child.递交件数 * timeMultiplier),
              递交APE: Number((child.递交APE * timeMultiplier).toFixed(1)),
              净APE: Number((child.净APE * timeMultiplier).toFixed(1)),
            }))
          };
        }
        return null;
      }

      if (scope === '营业区') {
        // 营业区：展示下级主管，但剔除已晋升至 SADM 及以上职级的育成团队；未达 SADM 的下级主管保留
        if (node.nodeType === 'supervisor' && node.id !== 'root-chen' && SADM_AND_ABOVE_RANKS.includes(node.rank)) {
          return null;
        }

        const validChildren: TeamNodeData[] = [];
        if (node.children) {
          for (const child of node.children) {
            const filteredChild = filterNode(child);
            if (filteredChild) validChildren.push(filteredChild);
          }
        }
        return { ...scaledNode, children: validChildren };
      }

      // Scope === '所辖'
      const validChildren: TeamNodeData[] = [];
      if (node.children) {
        for (const child of node.children) {
          const filteredChild = filterNode(child);
          if (filteredChild) validChildren.push(filteredChild);
        }
      }
      return { ...scaledNode, children: validChildren };
    };

    return filterNode(INITIAL_TREE_DATA);
  }, [scope, archMode, timeMultiplier]);

  // Extract all personnel in tree for auto-suggest
  const allPersonnel = useMemo(() => {
    if (!filteredTree) return [];
    const list: TeamNodeData[] = [];
    const collect = (node: TeamNodeData) => {
      if (!list.some(item => item.id === node.id)) {
        list.push(node);
      }
      if (node.children) {
        for (const child of node.children) {
          collect(child);
        }
      }
    };
    collect(filteredTree);
    return list;
  }, [filteredTree]);

  // Fuzzy auto-suggest candidates
  const searchSuggestions = useMemo(() => {
    if (!searchTerm.trim()) {
      // Return top personnel when input is empty but focused
      return allPersonnel.slice(0, 8);
    }
    const term = searchTerm.trim().toLowerCase();
    return allPersonnel.filter(node => 
      node.name.toLowerCase().includes(term) ||
      node.empId.toLowerCase().includes(term) ||
      node.rank.toLowerCase().includes(term) ||
      (node.generation !== '--' && node.generation.toLowerCase().includes(term))
    ).slice(0, 8);
  }, [allPersonnel, searchTerm]);

  // Select/toggle a suggestion candidate
  const handleSelectSuggestion = (candidate: TeamNodeData) => {
    toggleSearchTag(candidate.name);
    setShowSuggestions(false);
    setSearchTerm('');
    setCurrentPage(1);

    // Auto expand parent path
    const parentsToExpand: Record<string, boolean> = { ...expandedNodeIds };
    let current: TeamNodeData | undefined = candidate;
    while (current && current.parentId) {
      parentsToExpand[current.parentId] = true;
      current = allPersonnel.find(p => p.id === current?.parentId);
    }
    setExpandedNodeIds(parentsToExpand);
  };

  // Flatten tree into visible rows based on expandedNodeIds state & multi-select filters
  const visibleRows = useMemo(() => {
    if (!filteredTree) return [];

    const RANK_OPTIONS = ['ADM', 'SADM', 'DM', 'UM', 'FC'];
    const GEN_OPTIONS = ['1代', '2代', '3代', '直辖'];

    // Separate selectedSearchTags into active categories for proper AND/OR logic
    const activeRankTags = selectedSearchTags.filter(t => RANK_OPTIONS.includes(t));
    const activeGenTags = selectedSearchTags.filter(t => GEN_OPTIONS.includes(t));
    const activePersonTags = selectedSearchTags.filter(t => !RANK_OPTIONS.includes(t) && !GEN_OPTIONS.includes(t));

    const searchMatch = (node: TeamNodeData) => {
      // 1. Rank Filter (Exact match on rank; AND with other categories, OR within rank tags)
      const allSelectedRanks = [...selectedRanks, ...activeRankTags];
      if (allSelectedRanks.length > 0) {
        if (!allSelectedRanks.includes(node.rank)) {
          return false;
        }
      }

      // 2. Generation Filter (AND with other categories, OR within generation tags)
      const allSelectedGens = [...selectedGenerations, ...activeGenTags];
      if (allSelectedGens.length > 0) {
        const genMatched = allSelectedGens.some(g => {
          if (g === '直辖' || g === '--') {
            return node.generation === '--' || node.nodeType === 'personal' || node.nodeType === 'direct_fc';
          }
          return node.generation === g;
        });
        if (!genMatched) {
          return false;
        }
      }

      // 3. Personnel / Keyword tags (AND with other categories, OR within person tags)
      if (activePersonTags.length > 0) {
        const tagMatched = activePersonTags.some(tag => {
          const t = tag.toLowerCase();
          return (
            node.name.toLowerCase().includes(t) ||
            node.empId.toLowerCase().includes(t)
          );
        });
        if (!tagMatched) return false;
      }

      // 4. Input text search term
      if (searchTerm.trim()) {
        const term = searchTerm.trim().toLowerCase();
        const nameMatch = node.name.toLowerCase().includes(term);
        const idMatch = node.empId.toLowerCase().includes(term);
        const rankMatch = node.rank.toLowerCase() === term;
        const genMatch = (term === '直辖' && node.generation === '--') || (node.generation !== '--' && node.generation.toLowerCase() === term);
        if (!(nameMatch || idMatch || rankMatch || genMatch)) return false;
      }

      return true;
    };

    const isFilterActive =
      searchTerm.trim() !== '' ||
      selectedSearchTags.length > 0 ||
      selectedRanks.length > 0 ||
      selectedGenerations.length > 0;

    const rows: TeamNodeData[] = [];

    const traverse = (node: TeamNodeData) => {
      const isRootChenInArchMode = archMode === '育成' && node.id === 'root-chen';

      if (isFilterActive) {
        // When filter is active, include any matching node
        if (!isRootChenInArchMode && searchMatch(node)) {
          rows.push(node);
        }
        if (node.children) {
          for (const child of node.children) {
            traverse(child);
          }
        }
      } else {
        // Standard tree view with expand/collapse
        if (!isRootChenInArchMode && searchMatch(node)) {
          rows.push(node);
        }
        // In 育成架构 mode, automatically show all cultivated supervisor nodes
        if (node.children && (archMode === '育成' || expandedNodeIds[node.id])) {
          for (const child of node.children) {
            traverse(child);
          }
        }
      }
    };

    traverse(filteredTree);
    return rows;
  }, [filteredTree, expandedNodeIds, scope, archMode, searchTerm, selectedSearchTags, selectedRanks, selectedGenerations]);

  // Pagination logic
  const totalSupervisorCount = useMemo(() => {
    return visibleRows.filter(r => r.nodeType === 'supervisor').length;
  }, [visibleRows]);

  const totalVisibleCount = visibleRows.length;
  const totalPages = Math.max(1, Math.ceil(visibleRows.length / itemsPerPage));

  // 已移除底部翻页功能，直接展示全部行
  const paginatedRows = visibleRows;

  // Recalculate top row when rows, page, scope or modal open state change
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        handleScroll();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, paginatedRows, currentPage, scope]);

  if (!isOpen) return null;

  const isAnyFilterActive = searchTerm.trim() !== '' || selectedRanks.length > 0 || selectedGenerations.length > 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex flex-col justify-end md:justify-center p-0 md:p-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          className="bg-[#F4F6F8] w-full h-full md:max-w-7xl md:h-[92vh] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/50"
        >
          {/* --- 1. Top Header Bar (单行栏: 返回 · 标题 · 紧凑切换 · 搜索) --- */}
          <div className="bg-white px-4 py-2 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5 shadow-2xs shrink-0 z-30">
            <div className="flex items-center gap-2.5">
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95 cursor-pointer"
                title="返回"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-black text-[#34384B] tracking-tight">
                    团队详情
                  </h1>
                </div>
              </div>

              {/* 按姓名搜索框 */}
              <div className="relative w-[180px] sm:w-[220px] ml-2">
                <div className="flex items-center gap-1.5 bg-slate-100/90 border border-slate-200/90 rounded-xl px-2.5 py-1 focus-within:border-[#00A758] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00A758]/15 transition shadow-2xs">
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="按姓名搜索..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="flex-1 w-full bg-transparent text-xs text-[#282B3E] font-medium placeholder:text-slate-400 focus:outline-none"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setCurrentPage(1);
                      }}
                      className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 shrink-0 cursor-pointer"
                      title="清空搜索"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
              {/* Counter Badge */}
              <div className="bg-[#F2F6FC] px-3 py-1.5 rounded-xl border border-slate-200/60 text-xs text-slate-500 font-bold hidden sm:block">
                共 <b className="text-[#34384B] font-mono text-sm">{totalSupervisorCount}</b> 名{archMode === '育成' ? '育成主管' : '主管'} / <b className="text-[#00A758] font-mono text-sm">{totalVisibleCount}</b> 人
              </div>
            </div>
          </div>

          {/* --- 2. Secondary Filter Bar (二级筛选栏: 范围 + 育成开关 + 时间 + 重置) --- */}
          <div className="bg-[#F8FAFC] px-3.5 py-1.5 border-b border-slate-200/60 flex flex-wrap lg:flex-nowrap items-center justify-between gap-2.5 shrink-0 z-20">
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-2.5 text-xs w-full lg:w-auto">
              {/* Range Scope Dropdown */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-slate-400 font-bold shrink-0">范围:</span>
                <div className="flex bg-slate-200/60 p-0.5 rounded-xl border border-slate-200">
                  {(['直辖室', '营业区', '所辖'] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setScope(item);
                        if (item === '所辖') {
                          setArchMode('管理');
                        }
                        setCurrentPage(1);
                      }}
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-black transition cursor-pointer whitespace-nowrap ${
                        scope === item
                          ? 'bg-[#00A758] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Architecture Mode Toggle Switch: 育成关系 (仅在直辖室与营业区视角下生效) */}
              {(scope === '直辖室' || scope === '营业区') && (
                <button
                  type="button"
                  onClick={() => setArchMode(prev => prev === '育成' ? '管理' : '育成')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-black transition cursor-pointer shrink-0 ${
                    archMode === '育成'
                      ? 'bg-[#00A758] text-white border-[#00A758] shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title="切换育成关系（直辖室/营业区专属：开启后显示核心育成指标）"
                >
                  <i className={`fa-solid ${archMode === '育成' ? 'fa-sitemap' : 'fa-list-check'} text-xs`}></i>
                  <span className="font-extrabold text-xs">育成关系</span>
                  <span className={`w-6 h-3.5 flex items-center rounded-full p-0.5 transition-colors ${
                    archMode === '育成' ? 'bg-white/30' : 'bg-slate-300'
                  }`}>
                    <span className={`w-2.5 h-2.5 bg-white rounded-full shadow-xs transform transition-transform ${
                      archMode === '育成' ? 'translate-x-2.5' : 'translate-x-0'
                    }`} />
                  </span>
                </button>
              )}
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-slate-400 font-bold shrink-0 text-xs">时间:</span>
                <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs hover:border-[#00A758]/50 focus-within:border-[#00A758] transition-colors">
                  <div 
                    onClick={() => {
                      try {
                        startTimeInputRef.current?.showPicker();
                      } catch {
                        startTimeInputRef.current?.focus();
                      }
                    }}
                    className="relative inline-flex items-center cursor-pointer hover:text-[#00A758] transition-colors"
                  >
                    <span className="text-xs font-black tracking-tight text-slate-700 pointer-events-none select-none">{formatShortMonth(startTime)}</span>
                    <input
                      ref={startTimeInputRef}
                      type="month"
                      value={startTime}
                      onChange={(e) => {
                        if (e.target.value) {
                          setStartTime(e.target.value);
                          setCurrentPage(1);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                  <span className="text-slate-300 font-bold text-[10px] select-none">-</span>
                  <div 
                    onClick={() => {
                      try {
                        endTimeInputRef.current?.showPicker();
                      } catch {
                        endTimeInputRef.current?.focus();
                      }
                    }}
                    className="relative inline-flex items-center cursor-pointer hover:text-[#00A758] transition-colors"
                  >
                    <span className="text-xs font-black tracking-tight text-slate-700 pointer-events-none select-none">{formatShortMonth(endTime)}</span>
                    <input
                      ref={endTimeInputRef}
                      type="month"
                      value={endTime}
                      onChange={(e) => {
                        if (e.target.value) {
                          setEndTime(e.target.value);
                          setCurrentPage(1);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                </div>
              </div>

              {/* Reset All Filters Button */}
              {isAnyFilterActive && (
                <button
                  onClick={resetAllFilters}
                  className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-black flex items-center gap-1 hover:bg-amber-100 transition active:scale-95 cursor-pointer shrink-0"
                  title="重置所有搜索与多选筛选标签"
                >
                  <RotateCcw className="w-3 h-3" />
                  重置筛选
                </button>
              )}
            </div>
          </div>


          {/* --- 3. Data Table Container (27 Columns or Compact 5 Columns) --- */}
          <div ref={tableContainerRef} onScroll={handleScroll} className="flex-1 overflow-auto relative no-scrollbar">
            <table className={`text-left border-collapse border-spacing-0 ${archMode === '育成' ? 'w-auto' : 'w-full min-w-[2400px]'}`}>
              {/* Header (Sticky Top) */}
              <thead className="bg-[#EAEFF5] text-[#8E90A2] text-[12px] font-extrabold uppercase sticky top-0 z-20 shadow-2xs border-b border-slate-200">
                <tr>
                  {/* Col 1: 主管姓名 (Sticky Left) */}
                  <th className={`sticky left-0 bg-[#EAEFF5] z-30 px-3 py-1.5 border-r border-slate-200/80 select-none whitespace-nowrap ${archMode === '育成' ? 'w-auto' : isCompact ? 'w-[100px]' : topVisibleAncestors.length > 0 ? 'w-[260px]' : 'w-[220px]'} transition-all duration-200`}>
                    <div className="flex items-center justify-between gap-1.5 min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <span className="truncate shrink-0 font-extrabold">{isCompact ? '主管' : '主管姓名'}</span>
                        
                        {/* Ancestor manager surname badges when page/table scrolled */}
                        {topVisibleAncestors.length > 0 && (
                          <div className="flex items-center gap-1 shrink-0 animate-in fade-in slide-in-from-left-1 duration-150">
                            <span className="text-[10px] text-slate-400 font-bold select-none">:</span>
                            <div className="flex items-center gap-1">
                              {topVisibleAncestors.map((ancestor) => (
                                <div
                                  key={ancestor.id}
                                  className="w-5 h-5 rounded-full bg-[#00A758] text-white flex items-center justify-center text-[10px] font-black shadow-2xs border border-white shrink-0 hover:scale-110 transition-transform cursor-default"
                                  title={`上级主管: ${ancestor.rank} ${ancestor.name}`}
                                >
                                  {ancestor.name.substring(0, 1)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsCompact(!isCompact)}
                        className="p-1 rounded-md text-slate-500 hover:text-[#00A758] hover:bg-slate-200/80 transition cursor-pointer shrink-0"
                        title={isCompact ? "向右展开 (恢复全称及完整列宽)" : "向左缩进 (紧凑模式，仅展示头像)"}
                      >
                        {isCompact ? (
                          <ChevronsRight className="w-3.5 h-3.5 text-[#00A758]" />
                        ) : (
                          <ChevronsLeft className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </th>
                  <th className={`px-3 py-1.5 whitespace-nowrap ${archMode === '育成' ? 'w-auto' : 'w-[90px]'}`}>职级</th>
                  <th className={`px-3 py-1.5 whitespace-nowrap ${archMode === '育成' ? 'w-auto' : 'w-[90px]'}`}>{archMode === '育成' ? '育成代数' : '主管代数'}</th>

                  {archMode !== '育成' ? (
                    <>
                      {/* 递交 (5) */}
                      <th className="px-3 py-1.5 text-right bg-slate-200/30">递交件数</th>
                      <th className="px-3 py-1.5 text-right bg-slate-200/30">递交APE(万)</th>
                      <th className="px-3 py-1.5 text-right bg-slate-200/30">递交保单数</th>
                      <th className="px-3 py-1.5 text-right bg-slate-200/30">递交出单人数</th>
                      <th className="px-3 py-1.5 text-right bg-slate-200/30">净APE(万)</th>

                      {/* 净业绩 (3) */}
                      <th className="px-3 py-1.5 text-right bg-slate-200/50">净件数</th>
                      <th className="px-3 py-1.5 text-right bg-slate-200/50">净FYC签发(万)</th>
                      <th className="px-3 py-1.5 text-right bg-slate-200/50">净FYC(万)</th>

                      {/* 活动 (3) */}
                      <th className="px-3 py-1.5 text-right">净出单人力</th>
                      <th className="px-3 py-1.5 text-right">活动率</th>
                      <th className="px-3 py-1.5 text-right">活动人均件数</th>

                      {/* 增员 / 人力 (4) */}
                      <th className="px-3 py-1.5 text-right bg-slate-200/30">系统人力</th>
                      <th className="px-3 py-1.5 text-right bg-slate-200/30">增员人数</th>
                      <th className="px-3 py-1.5 text-right bg-slate-200/30">星钻人力</th>
                      <th className="px-3 py-1.5 text-right bg-slate-200/30">3MO</th>

                      {/* 人力结构 (2) */}
                      <th className="px-3 py-1.5 text-right">{archMode === '育成' ? '辖下育成数' : '辖下主管数'}</th>
                      <th className="px-3 py-1.5 text-right">{archMode === '育成' ? '第一代育成数' : '第一代主管数'}</th>

                      {/* 续保 (4) */}
                      <th className="px-3 py-1.5 text-right bg-slate-200/50">保费续保率(6M)</th>
                      <th className="px-3 py-1.5 text-right bg-slate-200/50">保费续保率(12M)</th>
                      <th className="px-3 py-1.5 text-right bg-slate-200/50">件数续保率(6M)</th>
                      <th className="px-3 py-1.5 text-right bg-slate-200/50">件数续保率(12M)</th>

                      {/* 建议书 (1) */}
                      <th className="px-3 py-1.5 text-right">人均建议书打印量</th>
                    </>
                  ) : (
                    <>
                      {/* 核心 4 项视角中的核心指标：件数与 FYC (自适应列宽) */}
                      <th className="px-4 py-2 text-right bg-emerald-50/90 text-[#00A758] font-black text-xs border-l border-slate-200/80 whitespace-nowrap">
                        {scope === '直辖室' ? '直辖件数' : scope === '营业区' ? '营业区件数' : '件数'}
                      </th>
                      <th className="px-4 py-2 text-right bg-emerald-50/90 text-[#00A758] font-black text-xs whitespace-nowrap">
                        {scope === '直辖室' ? '直辖FYC (万)' : scope === '营业区' ? '营业区FYC (万)' : 'FYC (万)'}
                      </th>
                    </>
                  )}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-200/60 bg-white text-[14px] text-[#282B3E]">
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={25} className="p-12 text-center text-slate-400 font-bold text-sm">
                      暂无符合条件的团队成员数据
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => {
                    const isExpanded = !!expandedNodeIds[row.id];
                    const hasChildren = row.children && row.children.length > 0;
                    const isSupervisor = row.nodeType === 'supervisor';
                    const isPersonal = row.nodeType === 'personal';
                    const isFC = row.nodeType === 'direct_fc';

                    // Padding for depth indentation
                    const depthPaddingLeft = Math.max(8, row.depth * 18 + 8);

                    return (
                      <tr
                        key={row.id}
                        data-node-id={row.id}
                        className={`transition hover:bg-slate-50/90 ${
                          isSupervisor
                            ? 'font-bold bg-white'
                            : isPersonal
                            ? 'bg-emerald-50/30 font-medium'
                            : 'bg-slate-50/30 font-normal'
                        }`}
                      >
                        {/* Col 1: 主管姓名 (Sticky Left Column with 100% Opaque Solid Background) */}
                        <td
                          className={`sticky left-0 z-10 p-2.5 border-r border-slate-300 shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)] ${
                            isSupervisor ? 'bg-white' : isPersonal ? 'bg-[#F0FDF4]' : 'bg-[#F8FAFC]'
                          }`}
                          style={{ paddingLeft: `${depthPaddingLeft}px` }}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            {/* Expand / Collapse Icon for Supervisors */}
                            {isSupervisor && hasChildren ? (
                              <button
                                onClick={() => toggleExpand(row.id)}
                                className="w-5 h-5 rounded-md bg-[#00A758]/10 text-[#00A758] hover:bg-[#00A758] hover:text-white flex items-center justify-center shrink-0 transition active:scale-95 cursor-pointer"
                                title={isExpanded ? '收起' : '展开'}
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5" />
                                )}
                              </button>
                            ) : (
                              <span className="w-5 h-5 shrink-0 inline-block"></span>
                            )}

                            {/* Surname Avatar */}
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                                isSupervisor
                                  ? 'bg-[#00A758] text-white shadow-xs'
                                  : isPersonal
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {row.name.substring(0, 1)}
                            </div>

                            {/* Name & Badge (Hidden in Compact Mode) */}
                            {!isCompact && (
                              <div className="min-w-0 flex items-center gap-1.5 truncate">
                                {onSelectMember ? (
                                  <button
                                    type="button"
                                    onClick={() => onSelectMember({
                                      id: row.id,
                                      name: row.name,
                                      rank: row.rank,
                                      ape: row.净APE,
                                      retentionRisk: row.保费续保率12M >= 90 ? 'low' : row.保费续保率12M >= 80 ? 'medium' : 'high',
                                      groupName: `${row.name.substring(0, 1)}组 · ${row.generation}`,
                                      birthday: '1988-06-15',
                                      hireDate: '2019-03-01',
                                      hireDays: 365,
                                    })}
                                    className="text-[15px] font-black text-[#34384B] truncate underline decoration-[#00A758]/30 underline-offset-2 hover:text-[#00A758] transition-colors cursor-pointer"
                                  >
                                    {row.name}
                                  </button>
                                ) : (
                                  <span className="text-[15px] font-black text-[#34384B] truncate">
                                    {row.name}
                                  </span>
                                )}

                                {row.id === 'root-chen' && (
                                  <span className="bg-[#00A758] text-white text-[10px] font-black px-1.5 py-0.2 rounded shadow-2xs shrink-0">
                                    {scope}
                                  </span>
                                )}


                                {row.generation !== '--' && (
                                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded border shrink-0 ${
                                    row.generation === '1代' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                    row.generation === '2代' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                    row.generation === '3代' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                    'bg-slate-100 text-slate-700 border-slate-200'
                                  }`}>
                                    {row.generation}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Col 2: 职级 */}
                        <td className="p-3">
                          <span className={`text-xs font-extrabold px-2 py-0.5 rounded-lg border ${
                            SADM_AND_ABOVE_RANKS.includes(row.rank)
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {row.rank}
                          </span>
                        </td>

                        {/* Col 3: 主管代数 / 育成代数 */}
                        <td className="p-3 text-xs font-bold text-slate-500">
                          {row.generation !== '--' ? row.generation : '--'}
                        </td>

                        {archMode !== '育成' ? (
                          <>
                            {/* Col 4-8: 递交 (5) */}
                            <td className="p-3 text-right font-mono font-bold text-slate-800 tabular-nums">
                              {row.递交件数}
                            </td>
                            <td className="p-3 text-right font-mono font-black text-slate-900 tabular-nums">
                              {row.递交APE}
                            </td>
                            <td className="p-3 text-right font-mono text-slate-700 tabular-nums">
                              {row.递交保单数}
                            </td>
                            <td className="p-3 text-right font-mono text-slate-700 tabular-nums">
                              {row.递交出单人数}
                            </td>
                            <td className="p-3 text-right font-mono font-extrabold text-[#00A758] tabular-nums">
                              {row.净APE}
                            </td>

                            {/* Col 9-11: 净业绩 (3) */}
                            <td className="p-3 text-right font-mono font-bold text-slate-800 tabular-nums">
                              {row.净件数}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-slate-800 tabular-nums">
                              {row.净FYC签发}
                            </td>
                            <td className="p-3 text-right font-mono font-black text-slate-900 tabular-nums">
                              {row.净FYC}
                            </td>

                            {/* Col 12-14: 活动 (3) */}
                            <td className="p-3 text-right font-mono text-slate-800 tabular-nums">
                              {row.净出单人力}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-[#00A758] tabular-nums">
                              {row.活动率}%
                            </td>
                            <td className="p-3 text-right font-mono text-slate-700 tabular-nums">
                              {row.活动人均件数}
                            </td>

                            {/* Col 15-18: 增员 / 人力 (4) */}
                            <td className="p-3 text-right font-mono text-slate-800 tabular-nums">
                              {row.系统人力}
                            </td>
                            <td className="p-3 text-right font-mono font-extrabold text-blue-600 tabular-nums">
                              +{row.增员人数}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-amber-600 tabular-nums">
                              {row.星钻人力}
                            </td>
                            <td className="p-3 text-right font-mono text-slate-700 tabular-nums">
                              {row['3MO']}
                            </td>

                            {/* Col 19-20: 人力结构 (2) */}
                            <td className="p-3 text-right font-mono text-slate-800 tabular-nums">
                              {row.辖下主管数}
                            </td>
                            <td className="p-3 text-right font-mono text-slate-800 tabular-nums">
                              {row.第一代主管数}
                            </td>

                            {/* Col 21-24: 续保 (4) */}
                            <td className="p-3 text-right font-mono text-emerald-700 font-bold tabular-nums">
                              {row.保费续保率6M}%
                            </td>
                            <td className="p-3 text-right font-mono text-emerald-700 font-bold tabular-nums">
                              {row.保费续保率12M}%
                            </td>
                            <td className="p-3 text-right font-mono text-emerald-700 font-bold tabular-nums">
                              {row.件数续保率6M}%
                            </td>
                            <td className="p-3 text-right font-mono text-emerald-700 font-bold tabular-nums">
                              {row.件数续保率12M}%
                            </td>

                            {/* Col 25: 建议书 (1) */}
                            <td className="p-3 text-right font-mono text-slate-700 tabular-nums">
                              {row.人均建议书打印量}
                            </td>
                          </>
                        ) : (
                          <>
                            {/* 核心 4 项视角数据列 */}
                            <td className="p-3 text-right font-mono font-black text-[#00A758] bg-emerald-50/30 border-l border-slate-100 tabular-nums">
                              {row.净件数} 件
                            </td>
                            <td className="p-3 text-right font-mono font-black text-slate-900 bg-emerald-50/30 tabular-nums">
                              ¥{row.净FYC} 万
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
