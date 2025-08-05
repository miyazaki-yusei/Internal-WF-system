import { useState, useEffect } from 'react'
import KPICard from '@/components/dashboard/KPICard'
import { CurrencyYenIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import { XMarkIcon, PencilIcon } from '@heroicons/react/24/outline'

const kpi = {
  sales: 12000000,
  profit: 4000000,
  profitRate: 33.3,
}

// 月別データ（1月から12月）
const monthlyData = [
  { month: '1月', sales: 4000000, expense: 2800000, profit: 1200000, profitRate: 30 },
  { month: '2月', sales: 4500000, expense: 3150000, profit: 1350000, profitRate: 30 },
  { month: '3月', sales: 5000000, expense: 3500000, profit: 1500000, profitRate: 30 },
  { month: '4月', sales: 5700000, expense: 4000000, profit: 1700000, profitRate: 30 },
  { month: '5月', sales: 5200000, expense: 3640000, profit: 1560000, profitRate: 30 },
  { month: '6月', sales: 4800000, expense: 3360000, profit: 1440000, profitRate: 30 },
  { month: '7月', sales: 5500000, expense: 3850000, profit: 1650000, profitRate: 30 },
  { month: '8月', sales: 6000000, expense: 4200000, profit: 1800000, profitRate: 30 },
  { month: '9月', sales: 5300000, expense: 3710000, profit: 1590000, profitRate: 30 },
  { month: '10月', sales: 5800000, expense: 4060000, profit: 1740000, profitRate: 30 },
  { month: '11月', sales: 6200000, expense: 4340000, profit: 1860000, profitRate: 30 },
  { month: '12月', sales: 6500000, expense: 4550000, profit: 1950000, profitRate: 30 },
]

// 売上見込みデータ（年別・月別）
const salesForecastData = {
  2024: [
    { month: '1月', forecast: 3800000, actual: 4000000, variance: 200000, varianceRate: 5.3 },
    { month: '2月', forecast: 4200000, actual: 4500000, variance: 300000, varianceRate: 7.1 },
    { month: '3月', forecast: 4800000, actual: 5000000, variance: 200000, varianceRate: 4.2 },
    { month: '4月', forecast: 5500000, actual: 5700000, variance: 200000, varianceRate: 3.6 },
    { month: '5月', forecast: 5000000, actual: 5200000, variance: 200000, varianceRate: 4.0 },
    { month: '6月', forecast: 4600000, actual: 4800000, variance: 200000, varianceRate: 4.3 },
    { month: '7月', forecast: 5200000, actual: 5500000, variance: 300000, varianceRate: 5.8 },
    { month: '8月', forecast: 5800000, actual: 6000000, variance: 200000, varianceRate: 3.4 },
    { month: '9月', forecast: 5100000, actual: 5300000, variance: 200000, varianceRate: 3.9 },
    { month: '10月', forecast: 5600000, actual: 5800000, variance: 200000, varianceRate: 3.6 },
    { month: '11月', forecast: 6000000, actual: 6200000, variance: 200000, varianceRate: 3.3 },
    { month: '12月', forecast: 6300000, actual: 6500000, variance: 200000, varianceRate: 3.2 },
  ],
  2025: [
    { month: '1月', forecast: 4200000, actual: 4400000, variance: 200000, varianceRate: 4.8 },
    { month: '2月', forecast: 4600000, actual: 4800000, variance: 200000, varianceRate: 4.3 },
    { month: '3月', forecast: 5200000, actual: 5400000, variance: 200000, varianceRate: 3.8 },
    { month: '4月', forecast: 5900000, actual: 6100000, variance: 200000, varianceRate: 3.4 },
    { month: '5月', forecast: 5400000, actual: 5600000, variance: 200000, varianceRate: 3.7 },
    { month: '6月', forecast: 5000000, actual: 5200000, variance: 200000, varianceRate: 4.0 },
    { month: '7月', forecast: 5700000, actual: 5900000, variance: 200000, varianceRate: 3.5 },
    { month: '8月', forecast: 6300000, actual: 6500000, variance: 200000, varianceRate: 3.2 },
    { month: '9月', forecast: 5600000, actual: 5800000, variance: 200000, varianceRate: 3.6 },
    { month: '10月', forecast: 6100000, actual: 6300000, variance: 200000, varianceRate: 3.3 },
    { month: '11月', forecast: 6500000, actual: 6700000, variance: 200000, varianceRate: 3.1 },
    { month: '12月', forecast: 6800000, actual: 7000000, variance: 200000, varianceRate: 2.9 },
  ],
  2026: [
    { month: '1月', forecast: 4600000, actual: 4800000, variance: 200000, varianceRate: 4.3 },
    { month: '2月', forecast: 5000000, actual: 5200000, variance: 200000, varianceRate: 4.0 },
    { month: '3月', forecast: 5600000, actual: 5800000, variance: 200000, varianceRate: 3.6 },
    { month: '4月', forecast: 6300000, actual: 6500000, variance: 200000, varianceRate: 3.2 },
    { month: '5月', forecast: 5800000, actual: 6000000, variance: 200000, varianceRate: 3.4 },
    { month: '6月', forecast: 5400000, actual: 5600000, variance: 200000, varianceRate: 3.7 },
    { month: '7月', forecast: 6100000, actual: 6300000, variance: 200000, varianceRate: 3.3 },
    { month: '8月', forecast: 6700000, actual: 6900000, variance: 200000, varianceRate: 3.0 },
    { month: '9月', forecast: 6000000, actual: 6200000, variance: 200000, varianceRate: 3.3 },
    { month: '10月', forecast: 6500000, actual: 6700000, variance: 200000, varianceRate: 3.1 },
    { month: '11月', forecast: 6900000, actual: 7100000, variance: 200000, varianceRate: 2.9 },
    { month: '12月', forecast: 7200000, actual: 7400000, variance: 200000, varianceRate: 2.8 },
  ],
}

// 各月の実績データ
const monthlyDetailData = {
  '1月': [
    { 
      projectName: '基幹システム保守・運用', 
      customer: '株式会社テクノソリューションズ', 
      assignee: ['田中'], 
      sales: 800000, 
      expense: 560000, 
      profit: 240000, 
      profitRate: 30,
      memberDetails: [
        { name: '田中', sales: 800000, expense: 560000, profit: 240000, profitRate: 30, utilizationRate: 100 }
      ],
      payments: [
        { recipient: '田中', item: '人件費', amount: 560000 }
      ]
    },
    { 
      projectName: '業務改善コンサルティング', 
      customer: 'グローバルコンサルティング株式会社', 
      assignee: ['鈴木'], 
      sales: 1200000, 
      expense: 840000, 
      profit: 360000, 
      profitRate: 30,
      memberDetails: [
        { name: '鈴木', sales: 1200000, expense: 840000, profit: 360000, profitRate: 30, utilizationRate: 90 }
      ],
      payments: [
        { recipient: '鈴木', item: '人件費', amount: 840000 }
      ]
    },
    { 
      projectName: 'DX推進支援', 
      customer: '株式会社イノベーション・パートナーズ', 
      assignee: ['高橋'], 
      sales: 1000000, 
      expense: 700000, 
      profit: 300000, 
      profitRate: 30,
      memberDetails: [
        { name: '高橋', sales: 1000000, expense: 700000, profit: 300000, profitRate: 30, utilizationRate: 85 }
      ],
      payments: [
        { recipient: '高橋', item: '人件費', amount: 700000 }
      ]
    },
    { 
      projectName: 'デジタル化基盤構築', 
      customer: '株式会社デジタル・トランスフォーメーション', 
      assignee: ['佐藤'], 
      sales: 1000000, 
      expense: 700000, 
      profit: 300000, 
      profitRate: 30,
      memberDetails: [
        { name: '佐藤', sales: 1000000, expense: 700000, profit: 300000, profitRate: 30, utilizationRate: 95 }
      ],
      payments: [
        { recipient: '佐藤', item: '人件費', amount: 700000 }
      ]
    },
  ],
  '2月': [
    { 
      projectName: '基幹システム保守・運用', 
      customer: '株式会社テクノソリューションズ', 
      assignee: ['田中'], 
      sales: 900000, 
      expense: 630000, 
      profit: 270000, 
      profitRate: 30,
      memberDetails: [
        { name: '田中', sales: 900000, expense: 630000, profit: 270000, profitRate: 30, utilizationRate: 100 }
      ]
    },
    { 
      projectName: '業務改善コンサルティング', 
      customer: 'グローバルコンサルティング株式会社', 
      assignee: ['鈴木'], 
      sales: 1300000, 
      expense: 910000, 
      profit: 390000, 
      profitRate: 30,
      memberDetails: [
        { name: '鈴木', sales: 1300000, expense: 910000, profit: 390000, profitRate: 30, utilizationRate: 95 }
      ]
    },
    { 
      projectName: 'DX推進支援', 
      customer: '株式会社イノベーション・パートナーズ', 
      assignee: ['高橋'], 
      sales: 1100000, 
      expense: 770000, 
      profit: 330000, 
      profitRate: 30,
      memberDetails: [
        { name: '高橋', sales: 1100000, expense: 770000, profit: 330000, profitRate: 30, utilizationRate: 85 }
      ]
    },
    { 
      projectName: 'デジタル化基盤構築', 
      customer: '株式会社デジタル・トランスフォーメーション', 
      assignee: ['佐藤'], 
      sales: 1200000, 
      expense: 840000, 
      profit: 360000, 
      profitRate: 30,
      memberDetails: [
        { name: '佐藤', sales: 1200000, expense: 840000, profit: 360000, profitRate: 30, utilizationRate: 90 }
      ]
    },
  ],
  '3月': [
    { 
      projectName: '基幹システム保守・運用', 
      customer: '株式会社テクノソリューションズ', 
      assignee: ['田中'], 
      sales: 1000000, 
      expense: 700000, 
      profit: 300000, 
      profitRate: 30,
      memberDetails: [
        { name: '田中', sales: 1000000, expense: 700000, profit: 300000, profitRate: 30, utilizationRate: 100 }
      ]
    },
    { 
      projectName: '業務改善コンサルティング', 
      customer: 'グローバルコンサルティング株式会社', 
      assignee: ['鈴木'], 
      sales: 1400000, 
      expense: 980000, 
      profit: 420000, 
      profitRate: 30,
      memberDetails: [
        { name: '鈴木', sales: 1400000, expense: 980000, profit: 420000, profitRate: 30, utilizationRate: 100 }
      ]
    },
    { 
      projectName: 'DX推進支援', 
      customer: '株式会社イノベーション・パートナーズ', 
      assignee: ['高橋'], 
      sales: 1200000, 
      expense: 840000, 
      profit: 360000, 
      profitRate: 30,
      memberDetails: [
        { name: '高橋', sales: 1200000, expense: 840000, profit: 360000, profitRate: 30, utilizationRate: 80 }
      ]
    },
    { 
      projectName: 'デジタル化基盤構築', 
      customer: '株式会社デジタル・トランスフォーメーション', 
      assignee: ['佐藤'], 
      sales: 1400000, 
      expense: 980000, 
      profit: 420000, 
      profitRate: 30,
      memberDetails: [
        { name: '佐藤', sales: 1400000, expense: 980000, profit: 420000, profitRate: 30, utilizationRate: 95 }
      ]
    },
  ],
  '4月': [
    { 
      projectName: '基幹システム保守・運用', 
      customer: '株式会社テクノソリューションズ', 
      assignee: ['田中'], 
      sales: 1000000, 
      expense: 700000, 
      profit: 300000, 
      profitRate: 30,
      payments: [
        { recipient: '田中', item: '人件費', amount: 700000 }
      ]
    },
    { 
      projectName: '新機能開発', 
      customer: '株式会社テクノソリューションズ', 
      assignee: ['鈴木'], 
      sales: 800000, 
      expense: 500000, 
      profit: 300000, 
      profitRate: 38,
      payments: [
        { recipient: '鈴木', item: '人件費', amount: 500000 }
      ]
    },
    { 
      projectName: 'システム改修', 
      customer: '株式会社テクノソリューションズ', 
      assignee: ['橋本（外注）'], 
      sales: 800000, 
      expense: 600000, 
      profit: 200000, 
      profitRate: 25,
      payments: [
        { recipient: '株式会社システム開発', item: '外注費', amount: 600000 }
      ]
    },
    { 
      projectName: '業務改善コンサルティング', 
      customer: 'グローバルコンサルティング株式会社', 
      assignee: ['安部'], 
      sales: 1200000, 
      expense: 700000, 
      profit: 500000, 
      profitRate: 42,
      payments: [
        { recipient: '安部', item: '人件費', amount: 700000 }
      ]
    },
    { 
      projectName: 'DX推進支援', 
      customer: '株式会社イノベーション・パートナーズ', 
      assignee: ['高橋', '佐藤'], 
      sales: 1000000, 
      expense: 700000, 
      profit: 300000, 
      profitRate: 30,
      memberDetails: [
        { name: '高橋', sales: 600000, expense: 420000, profit: 180000, profitRate: 30, utilizationRate: 80 },
        { name: '佐藤', sales: 400000, expense: 280000, profit: 120000, profitRate: 30, utilizationRate: 60 }
      ]
    },
    { 
      projectName: 'データ分析支援', 
      customer: '株式会社イノベーション・パートナーズ', 
      assignee: ['吉田（外注）'], 
      sales: 900000, 
      expense: 800000, 
      profit: 100000, 
      profitRate: 11,
      payments: [
        { recipient: '株式会社データソリューションズ', item: '外注費', amount: 800000 }
      ]
    },
    { 
      projectName: '営業支援プロジェクト', 
      customer: '株式会社マーケティング・パートナーズ', 
      assignee: ['山田'], 
      sales: 1500000, 
      expense: 1200000, 
      profit: 300000, 
      profitRate: 20,
      memberDetails: [
        { name: '山田', sales: 1500000, expense: 1200000, profit: 300000, profitRate: 20, utilizationRate: 100 }
      ],
      payments: [
        { recipient: '山田', item: '人件費', amount: 800000 },
        { recipient: '株式会社営業支援サービス', item: '営業支援費', amount: 400000 }
      ]
    },
  ],
  '5月': [
    { 
      projectName: '基幹システム保守・運用', 
      customer: '株式会社テクノソリューションズ', 
      assignee: ['田中'], 
      sales: 900000, 
      expense: 630000, 
      profit: 270000, 
      profitRate: 30,
      payments: [
        { recipient: '田中', item: '人件費', amount: 630000 }
      ]
    },
    { 
      projectName: '業務改善コンサルティング', 
      customer: 'グローバルコンサルティング株式会社', 
      assignee: ['鈴木'], 
      sales: 1100000, 
      expense: 770000, 
      profit: 330000, 
      profitRate: 30,
      payments: [
        { recipient: '鈴木', item: '人件費', amount: 770000 }
      ]
    },
    { 
      projectName: '組織改革支援', 
      customer: 'グローバルコンサルティング株式会社', 
      assignee: ['山田'], 
      sales: 800000, 
      expense: 560000, 
      profit: 240000, 
      profitRate: 30,
      payments: [
        { recipient: '山田', item: '人件費', amount: 560000 }
      ]
    },
    { 
      projectName: 'DX推進支援', 
      customer: '株式会社イノベーション・パートナーズ', 
      assignee: ['高橋', '佐藤'], 
      sales: 1000000, 
      expense: 700000, 
      profit: 300000, 
      profitRate: 30,
      memberDetails: [
        { name: '高橋', sales: 550000, expense: 385000, profit: 165000, profitRate: 30 },
        { name: '佐藤', sales: 450000, expense: 315000, profit: 135000, profitRate: 30 }
      ],
      payments: [
        { recipient: '高橋', item: '人件費', amount: 385000 },
        { recipient: '佐藤', item: '人件費', amount: 315000 }
      ]
    },
    { 
      projectName: 'デジタル化基盤構築', 
      customer: '株式会社デジタル・トランスフォーメーション', 
      assignee: ['渡辺', '中村'], 
      sales: 1200000, 
      expense: 840000, 
      profit: 360000, 
      profitRate: 30,
      memberDetails: [
        { name: '渡辺', sales: 700000, expense: 490000, profit: 210000, profitRate: 30 },
        { name: '中村', sales: 500000, expense: 350000, profit: 150000, profitRate: 30 }
      ],
      payments: [
        { recipient: '渡辺', item: '人件費', amount: 490000 },
        { recipient: '中村', item: '人件費', amount: 350000 }
      ]
    },
    { 
      projectName: 'クラウド移行支援', 
      customer: '株式会社デジタル・トランスフォーメーション', 
      assignee: ['中村'], 
      sales: 1000000, 
      expense: 700000, 
      profit: 300000, 
      profitRate: 30,
      payments: [
        { recipient: '中村', item: '人件費', amount: 700000 }
      ]
    },
    { 
      projectName: 'マーケティング戦略立案', 
      customer: '株式会社ブランド・コンサルティング', 
      assignee: ['佐々木'], 
      sales: 2000000, 
      expense: 1600000, 
      profit: 400000, 
      profitRate: 20,
      payments: [
        { recipient: '佐々木', item: '人件費', amount: 1000000 },
        { recipient: '株式会社マーケティング・リサーチ', item: '営業支援費', amount: 600000 }
      ]
    },
  ],
  '6月': [
    { projectName: '基幹システム保守・運用', customer: '株式会社テクノソリューションズ', assignee: ['田中'], sales: 800000, expense: 560000, profit: 240000, profitRate: 30 },
    { projectName: '業務改善コンサルティング', customer: 'グローバルコンサルティング株式会社', assignee: ['鈴木'], sales: 1000000, expense: 700000, profit: 300000, profitRate: 30 },
    { projectName: '組織改革支援', customer: 'グローバルコンサルティング株式会社', assignee: ['佐々木'], sales: 700000, expense: 490000, profit: 210000, profitRate: 30 },
    { 
      projectName: 'DX推進支援', 
      customer: '株式会社イノベーション・パートナーズ', 
      assignee: ['高橋', '佐藤'], 
      sales: 900000, 
      expense: 630000, 
      profit: 270000, 
      profitRate: 30,
      memberDetails: [
        { name: '高橋', sales: 500000, expense: 350000, profit: 150000, profitRate: 30 },
        { name: '佐藤', sales: 400000, expense: 280000, profit: 120000, profitRate: 30 }
      ]
    },
    { projectName: 'データ分析支援', customer: '株式会社イノベーション・パートナーズ', assignee: ['小林'], sales: 1100000, expense: 770000, profit: 330000, profitRate: 30 },
    { projectName: 'デジタル化基盤構築', customer: '株式会社デジタル・トランスフォーメーション', assignee: ['加藤'], sales: 1000000, expense: 700000, profit: 300000, profitRate: 30 },
  ],
  '7月': [
    { projectName: '基幹システム保守・運用', customer: '株式会社テクノソリューションズ', assignee: ['田中'], sales: 1000000, expense: 700000, profit: 300000, profitRate: 30 },
    { projectName: '新機能開発', customer: '株式会社テクノソリューションズ', assignee: ['伊藤'], sales: 600000, expense: 420000, profit: 180000, profitRate: 30 },
    { projectName: '業務改善コンサルティング', customer: 'グローバルコンサルティング株式会社', assignee: ['鈴木'], sales: 1200000, expense: 840000, profit: 360000, profitRate: 30 },
    { 
      projectName: 'DX推進支援', 
      customer: '株式会社イノベーション・パートナーズ', 
      assignee: ['高橋', '佐藤'], 
      sales: 1100000, 
      expense: 770000, 
      profit: 330000, 
      profitRate: 30,
      memberDetails: [
        { name: '高橋', sales: 650000, expense: 455000, profit: 195000, profitRate: 30 },
        { name: '佐藤', sales: 450000, expense: 315000, profit: 135000, profitRate: 30 }
      ]
    },
    { 
      projectName: 'デジタル化基盤構築', 
      customer: '株式会社デジタル・トランスフォーメーション', 
      assignee: ['松本', '井上'], 
      sales: 1200000, 
      expense: 840000, 
      profit: 360000, 
      profitRate: 30,
      memberDetails: [
        { name: '松本', sales: 700000, expense: 490000, profit: 210000, profitRate: 30 },
        { name: '井上', sales: 500000, expense: 350000, profit: 150000, profitRate: 30 }
      ]
    },
    { projectName: 'クラウド移行支援', customer: '株式会社デジタル・トランスフォーメーション', assignee: ['井上'], sales: 1000000, expense: 700000, profit: 300000, profitRate: 30 },
  ],
  '8月': [
    { projectName: '基幹システム保守・運用', customer: '株式会社テクノソリューションズ', assignee: ['田中'], sales: 1100000, expense: 770000, profit: 330000, profitRate: 30 },
    { projectName: 'システム改修', customer: '株式会社テクノソリューションズ', assignee: ['山口'], sales: 500000, expense: 350000, profit: 150000, profitRate: 30 },
    { projectName: '業務改善コンサルティング', customer: 'グローバルコンサルティング株式会社', assignee: ['鈴木'], sales: 1300000, expense: 910000, profit: 390000, profitRate: 30 },
    { projectName: '組織改革支援', customer: 'グローバルコンサルティング株式会社', assignee: ['森'], sales: 600000, expense: 420000, profit: 180000, profitRate: 30 },
    { 
      projectName: 'DX推進支援', 
      customer: '株式会社イノベーション・パートナーズ', 
      assignee: ['高橋', '佐藤'], 
      sales: 1200000, 
      expense: 840000, 
      profit: 360000, 
      profitRate: 30,
      memberDetails: [
        { name: '高橋', sales: 700000, expense: 490000, profit: 210000, profitRate: 30 },
        { name: '佐藤', sales: 500000, expense: 350000, profit: 150000, profitRate: 30 }
      ]
    },
    { 
      projectName: 'デジタル化基盤構築', 
      customer: '株式会社デジタル・トランスフォーメーション', 
      assignee: ['田中', '佐々木'], 
      sales: 1300000, 
      expense: 910000, 
      profit: 390000, 
      profitRate: 30,
      memberDetails: [
        { name: '田中', sales: 750000, expense: 525000, profit: 225000, profitRate: 30 },
        { name: '佐々木', sales: 550000, expense: 385000, profit: 165000, profitRate: 30 }
      ]
    },
    { projectName: 'クラウド移行支援', customer: '株式会社デジタル・トランスフォーメーション', assignee: ['佐々木'], sales: 1100000, expense: 770000, profit: 330000, profitRate: 30 },
  ],
  '9月': [
    { projectName: '基幹システム保守・運用', customer: '株式会社テクノソリューションズ', assignee: ['田中'], sales: 1000000, expense: 700000, profit: 300000, profitRate: 30 },
    { projectName: '業務改善コンサルティング', customer: 'グローバルコンサルティング株式会社', assignee: ['鈴木'], sales: 1200000, expense: 840000, profit: 360000, profitRate: 30 },
    { projectName: '組織改革支援', customer: 'グローバルコンサルティング株式会社', assignee: ['池田'], sales: 800000, expense: 560000, profit: 240000, profitRate: 30 },
    { 
      projectName: 'DX推進支援', 
      customer: '株式会社イノベーション・パートナーズ', 
      assignee: ['高橋', '佐藤'], 
      sales: 1100000, 
      expense: 770000, 
      profit: 330000, 
      profitRate: 30,
      memberDetails: [
        { name: '高橋', sales: 600000, expense: 420000, profit: 180000, profitRate: 30 },
        { name: '佐藤', sales: 500000, expense: 350000, profit: 150000, profitRate: 30 }
      ]
    },
    { projectName: 'データ分析支援', customer: '株式会社イノベーション・パートナーズ', assignee: ['石川'], sales: 700000, expense: 490000, profit: 210000, profitRate: 30 },
    { 
      projectName: 'デジタル化基盤構築', 
      customer: '株式会社デジタル・トランスフォーメーション', 
      assignee: ['山口', '森'], 
      sales: 1200000, 
      expense: 840000, 
      profit: 360000, 
      profitRate: 30,
      memberDetails: [
        { name: '山口', sales: 650000, expense: 455000, profit: 195000, profitRate: 30 },
        { name: '森', sales: 550000, expense: 385000, profit: 165000, profitRate: 30 }
      ]
    },
    { projectName: 'クラウド移行支援', customer: '株式会社デジタル・トランスフォーメーション', assignee: ['森'], sales: 800000, expense: 560000, profit: 240000, profitRate: 30 },
  ],
  '10月': [
    { projectName: '基幹システム保守・運用', customer: '株式会社テクノソリューションズ', assignee: ['田中'], sales: 1100000, expense: 770000, profit: 330000, profitRate: 30 },
    { projectName: '新機能開発', customer: '株式会社テクノソリューションズ', assignee: ['原田'], sales: 700000, expense: 490000, profit: 210000, profitRate: 30 },
    { projectName: '業務改善コンサルティング', customer: 'グローバルコンサルティング株式会社', assignee: ['鈴木'], sales: 1300000, expense: 910000, profit: 390000, profitRate: 30 },
    { projectName: '組織改革支援', customer: 'グローバルコンサルティング株式会社', assignee: ['福田'], sales: 900000, expense: 630000, profit: 270000, profitRate: 30 },
    { 
      projectName: 'DX推進支援', 
      customer: '株式会社イノベーション・パートナーズ', 
      assignee: ['高橋', '佐藤'], 
      sales: 1200000, 
      expense: 840000, 
      profit: 360000, 
      profitRate: 30,
      memberDetails: [
        { name: '高橋', sales: 700000, expense: 490000, profit: 210000, profitRate: 30 },
        { name: '佐藤', sales: 500000, expense: 350000, profit: 150000, profitRate: 30 }
      ]
    },
    { 
      projectName: 'デジタル化基盤構築', 
      customer: '株式会社デジタル・トランスフォーメーション', 
      assignee: ['池田', '石川'], 
      sales: 1300000, 
      expense: 910000, 
      profit: 390000, 
      profitRate: 30,
      memberDetails: [
        { name: '池田', sales: 750000, expense: 525000, profit: 225000, profitRate: 30 },
        { name: '石川', sales: 550000, expense: 385000, profit: 165000, profitRate: 30 }
      ]
    },
    { projectName: 'クラウド移行支援', customer: '株式会社デジタル・トランスフォーメーション', assignee: ['石川'], sales: 900000, expense: 630000, profit: 270000, profitRate: 30 },
  ],
  '11月': [
    { projectName: '基幹システム保守・運用', customer: '株式会社テクノソリューションズ', assignee: ['田中'], sales: 1200000, expense: 840000, profit: 360000, profitRate: 30 },
    { projectName: 'システム改修', customer: '株式会社テクノソリューションズ', assignee: ['岡本'], sales: 800000, expense: 560000, profit: 240000, profitRate: 30 },
    { projectName: '業務改善コンサルティング', customer: 'グローバルコンサルティング株式会社', assignee: ['鈴木'], sales: 1400000, expense: 980000, profit: 420000, profitRate: 30 },
    { projectName: '組織改革支援', customer: 'グローバルコンサルティング株式会社', assignee: ['松田'], sales: 1000000, expense: 700000, profit: 300000, profitRate: 30 },
    { 
      projectName: 'DX推進支援', 
      customer: '株式会社イノベーション・パートナーズ', 
      assignee: ['高橋', '佐藤'], 
      sales: 1300000, 
      expense: 910000, 
      profit: 390000, 
      profitRate: 30,
      memberDetails: [
        { name: '高橋', sales: 750000, expense: 525000, profit: 225000, profitRate: 30 },
        { name: '佐藤', sales: 550000, expense: 385000, profit: 165000, profitRate: 30 }
      ]
    },
    { projectName: 'データ分析支援', customer: '株式会社イノベーション・パートナーズ', assignee: ['原田'], sales: 1400000, expense: 980000, profit: 420000, profitRate: 30 },
    { projectName: 'デジタル化基盤構築', customer: '株式会社デジタル・トランスフォーメーション', assignee: ['福田'], sales: 1000000, expense: 700000, profit: 300000, profitRate: 30 },
  ],
  '12月': [
    { projectName: '基幹システム保守・運用', customer: '株式会社テクノソリューションズ', assignee: ['田中'], sales: 1300000, expense: 910000, profit: 390000, profitRate: 30 },
    { projectName: '新機能開発', customer: '株式会社テクノソリューションズ', assignee: ['松田'], sales: 900000, expense: 630000, profit: 270000, profitRate: 30 },
    { projectName: '業務改善コンサルティング', customer: 'グローバルコンサルティング株式会社', assignee: ['鈴木'], sales: 1500000, expense: 1050000, profit: 450000, profitRate: 30 },
    { projectName: '組織改革支援', customer: 'グローバルコンサルティング株式会社', assignee: ['岡本'], sales: 1100000, expense: 770000, profit: 330000, profitRate: 30 },
    { 
      projectName: 'DX推進支援', 
      customer: '株式会社イノベーション・パートナーズ', 
      assignee: ['高橋', '佐藤'], 
      sales: 1400000, 
      expense: 980000, 
      profit: 420000, 
      profitRate: 30,
      memberDetails: [
        { name: '高橋', sales: 800000, expense: 560000, profit: 240000, profitRate: 30 },
        { name: '佐藤', sales: 600000, expense: 420000, profit: 180000, profitRate: 30 }
      ]
    },
    { projectName: 'データ分析支援', customer: '株式会社イノベーション・パートナーズ', assignee: ['松田'], sales: 1200000, expense: 840000, profit: 360000, profitRate: 30 },
    { 
      projectName: 'デジタル化基盤構築', 
      customer: '株式会社デジタル・トランスフォーメーション', 
      assignee: ['岡本', '松田'], 
      sales: 1500000, 
      expense: 1050000, 
      profit: 450000, 
      profitRate: 30,
      memberDetails: [
        { name: '岡本', sales: 850000, expense: 595000, profit: 255000, profitRate: 30 },
        { name: '松田', sales: 650000, expense: 455000, profit: 195000, profitRate: 30 }
      ]
    },
    { projectName: 'クラウド移行支援', customer: '株式会社デジタル・トランスフォーメーション', assignee: ['松田'], sales: 1100000, expense: 770000, profit: 330000, profitRate: 30 },
  ],
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export default function FarmSummary() {
  const [startYear, setStartYear] = useState('2025')
  const [startMonth, setStartMonth] = useState('4月')
  const [endYear, setEndYear] = useState('2025')
  const [endMonth, setEndMonth] = useState('6月')
  const [selectedDetailMonth, setSelectedDetailMonth] = useState('4月')
  const [selectedYear, setSelectedYear] = useState('2025')
  const [showProjectDetailModal, setShowProjectDetailModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])

  // ローカルストレージからプロジェクトを読み込み
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
  }, [])

  // 月の順序を定義
  const monthOrder = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

  // 選択された期間のデータを取得
  const startIndex = monthOrder.indexOf(startMonth)
  const endIndex = monthOrder.indexOf(endMonth)
  const selectedPeriodData = monthlyData.slice(startIndex, endIndex + 1)

  // 期間内の合計を計算
  const totalSales = selectedPeriodData.reduce((sum: number, item: any) => sum + item.sales, 0)
  const totalExpense = selectedPeriodData.reduce((sum: number, item: any) => sum + item.expense, 0)
  const totalProfit = selectedPeriodData.reduce((sum: number, item: any) => sum + item.profit, 0)
  const totalProfitRate = Math.round((totalProfit / totalSales) * 100)

  // 選択された月の詳細データを取得
  const selectedMonthDetailData = monthlyDetailData[selectedDetailMonth as keyof typeof monthlyDetailData] || []
  
  // 選択された月の合計を計算
  const selectedMonthTotalSales = selectedMonthDetailData.reduce((sum: number, item: any) => sum + item.sales, 0)
  const selectedMonthTotalExpense = selectedMonthDetailData.reduce((sum: number, item: any) => sum + item.expense, 0)
  const selectedMonthTotalProfit = selectedMonthDetailData.reduce((sum: number, item: any) => sum + item.profit, 0)
  const selectedMonthTotalProfitRate = Math.round((selectedMonthTotalProfit / selectedMonthTotalSales) * 100)

  return (
    <div className="space-y-8">
      {/* KPIカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="売上合計"
          value={formatCurrency(totalSales)}
          icon={CurrencyYenIcon}
          color="blue"
        />
        <KPICard
          title="粗利益"
          value={formatCurrency(totalProfit)}
          icon={ArrowTrendingUpIcon}
          color="green"
        />
        <KPICard
          title="粗利率(%)"
          value={`${totalProfitRate}%`}
          icon={ArrowTrendingUpIcon}
          color="yellow"
        />
      </div>

             {/* 月別集計表 */}
       <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">ファーム集計表</h3>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-md">{startYear}年{startMonth}から{endYear}年{endMonth}</span>
              までの期間を選択して月別の売上・利益を確認できます
            </p>
            
            {/* 期間設定エリア */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-900">期間設定</label>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">開始:</span>
                    <select
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                      value={startYear}
                      onChange={e => setStartYear(e.target.value)}
                    >
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                    </select>
                    <span className="text-sm text-gray-500">年</span>
                    <select
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                      value={startMonth}
                      onChange={e => setStartMonth(e.target.value)}
                    >
                      {monthlyData.map((item) => (
                        <option key={item.month} value={item.month}>{item.month}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">終了:</span>
                    <select
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                      value={endYear}
                      onChange={e => setEndYear(e.target.value)}
                    >
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                    </select>
                    <span className="text-sm text-gray-500">年</span>
                    <select
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                      value={endMonth}
                      onChange={e => setEndMonth(e.target.value)}
                    >
                      {monthlyData.map((item) => (
                        <option key={item.month} value={item.month}>{item.month}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 hover:border-blue-300 transition-colors duration-200">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">項目</th>
                                 {selectedPeriodData.map((item) => (
                   <th 
                     key={item.month} 
                     className={`px-6 py-4 text-center text-sm font-semibold text-gray-900 border-r border-gray-200 transition-all duration-200 cursor-pointer ${
                       item.month === selectedDetailMonth 
                         ? 'bg-blue-50' 
                         : 'bg-gray-50 hover:bg-gray-100'
                     }`}
                     onClick={() => setSelectedDetailMonth(item.month)}
                   >
                     <div className={`w-full h-full transition-all duration-200 py-2 rounded-lg font-medium ${
                       item.month === selectedDetailMonth 
                         ? 'text-blue-700' 
                         : 'text-gray-900'
                     }`}>
                       {item.month}
                     </div>
                   </th>
                 ))}
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 bg-gray-100">
                  合計
                </th>
              </tr>
            </thead>
                         <tbody className="bg-white">
               <tr className="border-b border-gray-200">
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">売上</td>
                {selectedPeriodData.map((item, index) => (
                                     <td 
                     key={`sales-${item.month}`} 
                     className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                       item.month === selectedDetailMonth 
                         ? 'bg-blue-50 text-blue-700' 
                         : 'text-gray-900 hover:bg-gray-100'
                     }`}
                     onClick={() => setSelectedDetailMonth(item.month)}
                   >
                     {formatCurrency(item.sales)}
                   </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900 bg-gray-50">
                  {formatCurrency(totalSales)}
                </td>
              </tr>
                             <tr className="border-b border-gray-200">
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">支出</td>
                {selectedPeriodData.map((item, index) => (
                                     <td 
                     key={`expense-${item.month}`} 
                     className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                       item.month === selectedDetailMonth 
                         ? 'bg-blue-50 text-blue-700' 
                         : 'text-gray-900 hover:bg-gray-100'
                     }`}
                     onClick={() => setSelectedDetailMonth(item.month)}
                   >
                     {formatCurrency(item.expense)}
                   </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900 bg-gray-50">
                  {formatCurrency(totalExpense)}
                </td>
              </tr>
                             <tr className="border-b border-gray-200 hover:border-blue-200 transition-colors duration-200">
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">粗利益</td>
                {selectedPeriodData.map((item, index) => (
                                     <td 
                     key={`profit-${item.month}`} 
                     className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                       item.month === selectedDetailMonth 
                         ? 'bg-blue-50 text-blue-700' 
                         : 'text-gray-900 hover:bg-gray-100'
                     }`}
                     onClick={() => setSelectedDetailMonth(item.month)}
                   >
                     {formatCurrency(item.profit)}
                   </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900 bg-gray-50">
                  {formatCurrency(totalProfit)}
                </td>
              </tr>
                             <tr className="border-b border-gray-200">
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">粗利率</td>
                {selectedPeriodData.map((item, index) => (
                                     <td 
                     key={`profitRate-${item.month}`} 
                     className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium cursor-pointer transition-all duration-200 border-r border-gray-200 ${
                       item.month === selectedDetailMonth 
                         ? 'bg-blue-50 text-blue-700' 
                         : 'text-gray-900 hover:bg-gray-100'
                     }`}
                     onClick={() => setSelectedDetailMonth(item.month)}
                   >
                     {item.profitRate}%
                   </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900 bg-gray-50">
                  {totalProfitRate}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

             {/* 選択された月の内訳テーブル */}
       <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-200">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{selectedDetailMonth}内訳</h3>
          <p className="text-sm text-gray-600">選択された月の詳細な売上・利益の内訳を確認できます</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 hover:border-green-300 transition-colors duration-200">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">案件名</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">顧客名</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">アサイン</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">稼働率</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">売上</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">支出</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">支払先1</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">項目1</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">支払先2</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">項目2</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">粗利益</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">粗利率</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {selectedMonthDetailData.map((row: any, i: number) => {
                // 複数メンバーがいる場合は展開して表示
                if (row.memberDetails && row.memberDetails.length > 0) {
                                    return row.memberDetails.map((member: any, memberIndex: number) => (
                    <tr 
                      key={`${i}-${memberIndex}`} 
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        if (memberIndex === 0) {
                          // ローカルストレージから対応する案件データを取得
                          const projectData = projects.find(p => p.formData.name === row.projectName && p.type === 'farm')
                          if (projectData) {
                            setSelectedProject(projectData)
                          } else {
                            // 案件データが見つからない場合は、内訳データを使用
                            setSelectedProject({
                              id: `temp-${Date.now()}`,
                              type: 'farm',
                              formData: {
                                name: row.projectName,
                                customer: row.customer,
                                startDate: '2025-04-01',
                                deliveryDate: '',
                                revenueMonth: '',
                                revenue: row.sales.toString(),
                                expenses: row.expense.toString(),
                                laborCost: row.expense.toString(),
                                memo: ''
                              },
                              teamMembers: [{
                                id: `member-${Date.now()}`,
                                role: 'member',
                                name: row.assignee.join(', '),
                                utilizationRate: row.memberDetails && row.memberDetails.length > 0 ? 
                                  row.memberDetails[0].utilizationRate.toString() : '100',
                                unitPrice: (row.expense / (row.memberDetails && row.memberDetails.length > 0 ? 
                                  row.memberDetails[0].utilizationRate / 100 : 1)).toString(),
                                incentive: '10'
                              }],
                              payments: row.payments ? row.payments.map((payment: any) => ({
                                id: payment.id || `payment-${Date.now()}`,
                                recipient: payment.recipient,
                                item: payment.item,
                                amount: typeof payment.amount === 'number' ? payment.amount.toString() : payment.amount
                              })) : [{
                                id: `payment-${Date.now()}`,
                                recipient: row.assignee.join(', '),
                                item: '人件費',
                                amount: row.expense.toString()
                              }],
                              budgetRatio: {
                                salesBudget: '10',
                                miscellaneousBudget: '4',
                                incentiveBudget: '1.8'
                              },
                              budgetAmounts: {
                                salesBudgetAmount: (row.sales * 0.1).toString(),
                                miscellaneousBudgetAmount: (row.sales * 0.04).toString(),
                                incentiveBudgetAmount: (row.sales * 0.018).toString()
                              }
                            })
                          }
                          setShowProjectDetailModal(true)
                        }
                      }}
                    >
                                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {memberIndex === 0 ? row.projectName : ''}
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                        {memberIndex === 0 ? row.customer : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                        {member.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                        {member.utilizationRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium border-r border-gray-200">
                        {formatCurrency(member.sales)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium border-r border-gray-200">
                        {formatCurrency(member.expense)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                        {row.payments && row.payments.find((p: any) => p.recipient === member.name) ? 
                          row.payments.find((p: any) => p.recipient === member.name)?.recipient : 
                          member.name
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                        {row.payments && row.payments.find((p: any) => p.recipient === member.name) ? 
                          `${row.payments.find((p: any) => p.recipient === member.name)?.item} (${formatCurrency(row.payments.find((p: any) => p.recipient === member.name)?.amount)})` : 
                          `人件費 (${formatCurrency(member.expense)})`
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                        {/* 支払先2は複数メンバーの場合は空 */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                        {/* 項目2は複数メンバーの場合は空 */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium border-r border-gray-200">
                        {formatCurrency(member.profit)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        {member.profitRate}%
                      </td>
                    </tr>
                  ));
                } else {
                  // 単一メンバーの場合
                  return (
                    <tr 
                      key={i} 
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        // ローカルストレージから対応する案件データを取得
                        const projectData = projects.find(p => p.formData.name === row.projectName && p.type === 'farm')
                        if (projectData) {
                          setSelectedProject(projectData)
                        } else {
                          // 案件データが見つからない場合は、内訳データを使用
                          setSelectedProject({
                            id: `temp-${Date.now()}`,
                            type: 'farm',
                            formData: {
                              name: row.projectName,
                              customer: row.customer,
                              startDate: '2025-04-01',
                              deliveryDate: '',
                              revenueMonth: '',
                              revenue: row.sales.toString(),
                              expenses: row.expense.toString(),
                              laborCost: row.expense.toString(),
                              memo: ''
                            },
                            teamMembers: row.memberDetails ? row.memberDetails.map((member: any, index: number) => ({
                              id: `member-${Date.now()}-${index}`,
                              role: 'member',
                              name: member.name,
                              utilizationRate: member.utilizationRate.toString(),
                              unitPrice: (member.expense / (member.utilizationRate / 100)).toString(),
                              incentive: '10'
                            })) : [{
                              id: `member-${Date.now()}`,
                              role: 'member',
                              name: row.assignee.join(', '),
                              utilizationRate: '100',
                              unitPrice: row.expense.toString(),
                              incentive: '10'
                            }],
                            payments: row.payments ? row.payments.map((payment: any) => ({
                              id: payment.id || `payment-${Date.now()}`,
                              recipient: payment.recipient,
                              item: payment.item,
                              amount: typeof payment.amount === 'number' ? payment.amount.toString() : payment.amount
                            })) : [{
                              id: `payment-${Date.now()}`,
                              recipient: row.assignee.join(', '),
                              item: '人件費',
                              amount: row.expense.toString()
                            }],
                            budgetRatio: {
                              salesBudget: '10',
                              miscellaneousBudget: '4',
                              incentiveBudget: '1.8'
                            },
                            budgetAmounts: {
                              salesBudgetAmount: (row.sales * 0.1).toString(),
                              miscellaneousBudgetAmount: (row.sales * 0.04).toString(),
                              incentiveBudgetAmount: (row.sales * 0.018).toString()
                            }
                          })
                        }
                        setShowProjectDetailModal(true)
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                        {row.projectName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                        {row.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                        {row.assignee.join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                        {row.memberDetails && row.memberDetails.length > 0 ? 
                          row.memberDetails[0].utilizationRate : 100}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium border-r border-gray-200">
                        {formatCurrency(row.sales)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium border-r border-gray-200">
                        {formatCurrency(row.expense)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                        {row.payments && row.payments.length > 0 ? 
                          row.payments[0]?.recipient || row.assignee.join(', ') : 
                          row.assignee.join(', ')
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                        {row.payments && row.payments.length > 0 ? 
                          `${row.payments[0]?.item} (${formatCurrency(row.payments[0]?.amount)})` : 
                          `人件費 (${formatCurrency(row.expense)})`
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                        {row.payments && row.payments.length > 1 ? 
                          row.payments[1]?.recipient : ''
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                        {row.payments && row.payments.length > 1 ? 
                          `${row.payments[1]?.item} (${formatCurrency(row.payments[1]?.amount)})` : ''
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium border-r border-gray-200">
                        {formatCurrency(row.profit)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        {row.profitRate}%
                      </td>
                    </tr>
                  );
                }
              })}
              {/* 合計行 */}
              <tr className="bg-gray-50 border-t-2 border-gray-300">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 border-r border-gray-200">合計</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                  {/* 合計稼働率は複数メンバーの場合は空 */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900 border-r border-gray-200">
                  {formatCurrency(selectedMonthTotalSales)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900 border-r border-gray-200">
                  {formatCurrency(selectedMonthTotalExpense)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900 border-r border-gray-200">
                  {formatCurrency(selectedMonthTotalProfit)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                  {selectedMonthTotalProfitRate}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 売上見込みテーブル */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">売上見込み vs 実績</h3>
            <p className="text-sm text-gray-600">{selectedYear}年の月別売上見込みと実績の比較を確認できます</p>
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="forecast-year-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">年:</label>
          <select
              id="forecast-year-select"
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
          </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 hover:border-indigo-300 transition-colors duration-200">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="w-1/6 px-4 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">月</th>
                <th className="w-1/6 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">売上見込み</th>
                <th className="w-1/6 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">実績</th>
                <th className="w-1/6 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">差異</th>
                <th className="w-1/6 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">差異率</th>
                <th className="w-1/6 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50">達成率</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {salesForecastData[selectedYear as '2024' | '2025' | '2026'].map((item, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                    {item.month}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(item.forecast)}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                    {formatCurrency(item.actual)}
                  </td>
                  <td className={`px-4 py-4 text-sm text-right font-medium border-r border-gray-200 ${
                    item.variance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.variance >= 0 ? '+' : ''}{formatCurrency(item.variance)}
                  </td>
                  <td className={`px-4 py-4 text-sm text-right font-medium border-r border-gray-200 ${
                    item.varianceRate >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.varianceRate >= 0 ? '+' : ''}{item.varianceRate}%
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900">
                    {((item.actual / item.forecast) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
              {/* 年間合計行 */}
              <tr className="bg-gray-50 border-t-2 border-gray-300">
                <td className="px-4 py-4 text-sm font-bold text-gray-900 border-r border-gray-200">年間合計</td>
                <td className="px-4 py-4 text-sm text-right font-bold text-gray-900 border-r border-gray-200">
                  {formatCurrency(salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.forecast, 0))}
                </td>
                <td className="px-4 py-4 text-sm text-right font-bold text-gray-900 border-r border-gray-200">
                  {formatCurrency(salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.actual, 0))}
                </td>
                <td className={`px-4 py-4 text-sm text-right font-bold border-r border-gray-200 ${
                  salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.variance, 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.variance, 0) >= 0 ? '+' : ''}
                  {formatCurrency(salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.variance, 0))}
                </td>
                <td className={`px-4 py-4 text-sm text-right font-bold border-r border-gray-200 ${
                  (salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.variance, 0) / salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.forecast, 0) * 100) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.variance, 0) / salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.forecast, 0) * 100) >= 0 ? '+' : ''}
                  {(salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.variance, 0) / salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.forecast, 0) * 100).toFixed(1)}%
                </td>
                <td className="px-4 py-4 text-sm text-right font-bold text-gray-900">
                  {((salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.actual, 0) / salesForecastData[selectedYear as '2024' | '2025' | '2026'].reduce((sum, item) => sum + item.forecast, 0)) * 100).toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* プロジェクト詳細モーダル */}
      {showProjectDetailModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl max-h-full">
            <div className="relative bg-white rounded-xl shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800">
                  ファーム案件詳細
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      // プロジェクトデータをローカルストレージに保存して編集ページに渡す
                      const editData = {
                        id: selectedProject.id || 'temp-id',
                        type: selectedProject.type,
                        formData: selectedProject.formData,
                        teamMembers: selectedProject.teamMembers,
                        payments: selectedProject.payments,
                        budgetRatio: selectedProject.budgetRatio,
                        budgetAmounts: selectedProject.budgetAmounts
                      };
                      localStorage.setItem('editProjectData', JSON.stringify(editData));
                      
                      // ファーム案件登録ページに遷移
                      window.location.href = '/projects/new/farm';
                    }}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    編集
                  </button>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
                    onClick={() => {
                      setShowProjectDetailModal(false);
                      setSelectedProject(null);
                    }}
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-8">
                {/* 案件情報 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    案件情報
                  </h4>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700 w-24">案件名:</span>
                      <span className="ml-3 text-gray-900">{selectedProject.formData.name}</span>
                    </div>
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700 w-24">顧客名:</span>
                      <span className="ml-3 text-gray-900">{selectedProject.formData.customer}</span>
                    </div>
                    <div className="flex items-center py-2">
                      <span className="font-medium text-gray-700 w-24">案件種別:</span>
                      <span className="ml-3 text-gray-900">ファーム案件</span>
                    </div>
                  </div>
                </div>

                {/* スケジュール情報 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    スケジュール情報
                  </h4>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700 w-24">開始年月日:</span>
                      <span className="ml-3 text-gray-900">{selectedProject.formData.startDate}</span>
                    </div>
                    {selectedProject.formData.deliveryDate && (
                      <div className="flex items-center py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700 w-24">納品予定日:</span>
                        <span className="ml-3 text-gray-900">{selectedProject.formData.deliveryDate}</span>
                      </div>
                    )}
                    {selectedProject.formData.revenueMonth && (
                      <div className="flex items-center py-2">
                        <span className="font-medium text-gray-700 w-24">売上計上予定月:</span>
                        <span className="ml-3 text-gray-900">{selectedProject.formData.revenueMonth}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* アサイン情報 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    アサイン情報
                  </h4>
                  <div className="space-y-3">
                    {selectedProject.teamMembers.map((member: any, index: number) => (
                      <div key={member.id} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">役割:</span>
                            <span className="ml-2 text-gray-900">
                              {member.role === 'leader' ? 'リーダー' : member.role === 'member' ? 'メンバー' : '外注'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">名前:</span>
                            <span className="ml-2 text-gray-900">{member.name}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">単価:</span>
                            <span className="ml-2 text-gray-900">{member.unitPrice}円</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">インセンティブ:</span>
                            <span className="ml-2 text-gray-900">{member.incentive}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 財務情報 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    財務情報
                  </h4>
                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-600">売上（自動計算）:</span>
                        <span className="ml-2 text-gray-900 font-semibold">{selectedProject.formData.revenue}円</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-600">労務費（概算）:</span>
                        <span className="ml-2 text-gray-900">{selectedProject.formData.laborCost}円</span>
                      </div>
                    </div>
                    
                    {/* その他支出項目 */}
                    {selectedProject.payments.length > 0 && (
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-600 block mb-2">その他支出項目:</span>
                        <div className="space-y-2">
                          {selectedProject.payments.map((payment: any, index: number) => (
                            <div key={payment.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                              <span className="font-medium text-gray-600">{payment.item}:</span>
                              <span className="text-gray-900">{payment.amount}円</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-600">支出合計:</span>
                        <span className="ml-2 text-gray-900 font-semibold">{selectedProject.formData.expenses}円</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-600">粗利:</span>
                        <span className="ml-2 text-gray-900 font-semibold">
                          {(parseInt(selectedProject.formData.revenue.replace(/[^\d]/g, '')) - parseInt(selectedProject.formData.expenses.replace(/[^\d]/g, ''))).toLocaleString()}円
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 予算情報 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    予算情報
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-600">営業予算:</span>
                      <div className="mt-1">
                        <span className="text-gray-600">{selectedProject.budgetRatio.salesBudget}%</span>
                        <span className="ml-2 text-gray-900">({selectedProject.budgetAmounts.salesBudgetAmount}円)</span>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-600">雑費予算:</span>
                      <div className="mt-1">
                        <span className="text-gray-600">{selectedProject.budgetRatio.miscellaneousBudget}%</span>
                        <span className="ml-2 text-gray-900">({selectedProject.budgetAmounts.miscellaneousBudgetAmount}円)</span>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-600">インセンティブ予算:</span>
                      <div className="mt-1">
                        <span className="text-gray-600">{selectedProject.budgetRatio.incentiveBudget}%</span>
                        <span className="ml-2 text-gray-900">({selectedProject.budgetAmounts.incentiveBudgetAmount}円)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* メモ欄 */}
                {selectedProject.formData.memo && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      メモ欄
                    </h4>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm">
                      <span className="whitespace-pre-wrap text-gray-900">{selectedProject.formData.memo}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end p-6 space-x-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowProjectDetailModal(false);
                    setSelectedProject(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
  