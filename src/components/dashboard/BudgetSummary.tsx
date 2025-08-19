import React, { useState } from 'react'
import KPICard from '@/components/dashboard/KPICard'
import { CurrencyYenIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

// 予算集計データ（上半期、下半期、通年）
const budgetData = {
  2024: {
    firstHalf: { 
      sales: 60000000, 
      expenses: 25000000, 
      grossProfit: 35000000, 
      salesBudget: 3000000, 
      miscBudget: 600000, 
      incentiveBudget: 870000 
    },
    secondHalf: { 
      sales: 72000000, 
      expenses: 30000000, 
      grossProfit: 42000000, 
      salesBudget: 4400000, 
      miscBudget: 880000, 
      incentiveBudget: 996000 
    },
    fullYear: { 
      sales: 132000000, 
      expenses: 55000000, 
      grossProfit: 77000000, 
      salesBudget: 7400000, 
      miscBudget: 1480000, 
      incentiveBudget: 1866000 
    },
  },
  2025: {
    firstHalf: { 
      sales: 66000000, 
      expenses: 27500000, 
      grossProfit: 38500000, 
      salesBudget: 3300000, 
      miscBudget: 660000, 
      incentiveBudget: 957000 
    },
    secondHalf: { 
      sales: 79200000, 
      expenses: 33000000, 
      grossProfit: 46200000, 
      salesBudget: 4840000, 
      miscBudget: 968000, 
      incentiveBudget: 1095600 
    },
    fullYear: { 
      sales: 145200000, 
      expenses: 60500000, 
      grossProfit: 84700000, 
      salesBudget: 8140000, 
      miscBudget: 1628000, 
      incentiveBudget: 2052600 
    },
  },
  2026: {
    firstHalf: { 
      sales: 72600000, 
      expenses: 30250000, 
      grossProfit: 42350000, 
      salesBudget: 3630000, 
      miscBudget: 726000, 
      incentiveBudget: 1052700 
    },
    secondHalf: { 
      sales: 87120000, 
      expenses: 36300000, 
      grossProfit: 50820000, 
      salesBudget: 5324000, 
      miscBudget: 1064800, 
      incentiveBudget: 1205160 
    },
    fullYear: { 
      sales: 159720000, 
      expenses: 66550000, 
      grossProfit: 93170000, 
      salesBudget: 8954000, 
      miscBudget: 1790800, 
      incentiveBudget: 2257860 
    },
  },
}

// 内訳データ
const detailData = {
  farm: {
    2024: {
      firstHalf: { sales: 30000000, expenses: 10000000, grossProfit: 20000000, incentiveBudget: 600000 },
      secondHalf: { sales: 30000000, expenses: 10000000, grossProfit: 20000000, incentiveBudget: 600000 },
      fullYear: { sales: 60000000, expenses: 20000000, grossProfit: 40000000, incentiveBudget: 1200000 },
    },
    2025: {
      firstHalf: { sales: 33000000, expenses: 11000000, grossProfit: 22000000, incentiveBudget: 660000 },
      secondHalf: { sales: 33000000, expenses: 11000000, grossProfit: 22000000, incentiveBudget: 660000 },
      fullYear: { sales: 66000000, expenses: 22000000, grossProfit: 44000000, incentiveBudget: 1320000 },
    },
    2026: {
      firstHalf: { sales: 36300000, expenses: 12100000, grossProfit: 24200000, incentiveBudget: 726000 },
      secondHalf: { sales: 36300000, expenses: 12100000, grossProfit: 24200000, incentiveBudget: 726000 },
      fullYear: { sales: 72600000, expenses: 24200000, grossProfit: 48400000, incentiveBudget: 1452000 },
    },
  },
  prime: {
    2024: {
      firstHalf: { sales: 30000000, expenses: 15000000, grossProfit: 15000000, salesBudget: 3000000, miscBudget: 600000, incentiveBudget: 270000 },
      secondHalf: { sales: 42000000, expenses: 20000000, grossProfit: 22000000, salesBudget: 4400000, miscBudget: 880000, incentiveBudget: 396000 },
      fullYear: { sales: 72000000, expenses: 35000000, grossProfit: 37000000, salesBudget: 7400000, miscBudget: 1480000, incentiveBudget: 666000 },
    },
    2025: {
      firstHalf: { sales: 33000000, expenses: 16500000, grossProfit: 16500000, salesBudget: 3300000, miscBudget: 660000, incentiveBudget: 297000 },
      secondHalf: { sales: 46200000, expenses: 22000000, grossProfit: 24200000, salesBudget: 4840000, miscBudget: 968000, incentiveBudget: 435600 },
      fullYear: { sales: 79200000, expenses: 38500000, grossProfit: 40700000, salesBudget: 8140000, miscBudget: 1628000, incentiveBudget: 732600 },
    },
    2026: {
      firstHalf: { sales: 36300000, expenses: 18150000, grossProfit: 18150000, salesBudget: 3630000, miscBudget: 726000, incentiveBudget: 326700 },
      secondHalf: { sales: 50820000, expenses: 24200000, grossProfit: 26620000, salesBudget: 5324000, miscBudget: 1064800, incentiveBudget: 479160 },
      fullYear: { sales: 87120000, expenses: 42350000, grossProfit: 44770000, salesBudget: 8954000, miscBudget: 1790800, incentiveBudget: 805860 },
    },
  },
}

// 営業予算の内訳データ
const salesBudgetDetail = {
  2024: {
    firstHalf: [
      { 
        category: '広告費', 
        amount: 1200000, 
        description: 'Web広告、印刷物広告',
        details: [
          { item: 'Web広告', amount: 800000 },
          { item: 'SNS広告', amount: 300000 },
          { item: '印刷物広告', amount: 100000 }
        ]
      },
      { 
        category: 'イベント費', 
        amount: 800000, 
        description: '展示会、セミナー参加費',
        details: [
          { item: '展示会出展費', amount: 500000 },
          { item: 'セミナー参加費', amount: 200000 },
          { item: 'イベント準備費', amount: 100000 }
        ]
      },
      { 
        category: '交通費', 
        amount: 600000, 
        description: '営業活動の交通費',
        details: [
          { item: '新幹線・飛行機', amount: 400000 },
          { item: 'タクシー・レンタカー', amount: 150000 },
          { item: '宿泊費', amount: 50000 }
        ]
      },
      { 
        category: '接待費', 
        amount: 400000, 
        description: '顧客接待費用',
        details: [
          { item: '会食費', amount: 250000 },
          { item: 'ゴルフ接待', amount: 100000 },
          { item: 'その他接待', amount: 50000 }
        ]
      }
    ],
    secondHalf: [
      { 
        category: '広告費', 
        amount: 1760000, 
        description: 'Web広告、印刷物広告',
        details: [
          { item: 'Web広告', amount: 1200000 },
          { item: 'SNS広告', amount: 400000 },
          { item: '印刷物広告', amount: 160000 }
        ]
      },
      { 
        category: 'イベント費', 
        amount: 1200000, 
        description: '展示会、セミナー参加費',
        details: [
          { item: '展示会出展費', amount: 700000 },
          { item: 'セミナー参加費', amount: 350000 },
          { item: 'イベント準備費', amount: 150000 }
        ]
      },
      { 
        category: '交通費', 
        amount: 880000, 
        description: '営業活動の交通費',
        details: [
          { item: '新幹線・飛行機', amount: 600000 },
          { item: 'タクシー・レンタカー', amount: 200000 },
          { item: '宿泊費', amount: 80000 }
        ]
      },
      { 
        category: '接待費', 
        amount: 560000, 
        description: '顧客接待費用',
        details: [
          { item: '会食費', amount: 350000 },
          { item: 'ゴルフ接待', amount: 150000 },
          { item: 'その他接待', amount: 60000 }
        ]
      }
    ],
    fullYear: [
      { 
        category: '広告費', 
        amount: 2960000, 
        description: 'Web広告、印刷物広告',
        details: [
          { item: 'Web広告', amount: 2000000 },
          { item: 'SNS広告', amount: 700000 },
          { item: '印刷物広告', amount: 260000 }
        ]
      },
      { 
        category: 'イベント費', 
        amount: 2000000, 
        description: '展示会、セミナー参加費',
        details: [
          { item: '展示会出展費', amount: 1200000 },
          { item: 'セミナー参加費', amount: 550000 },
          { item: 'イベント準備費', amount: 250000 }
        ]
      },
      { 
        category: '交通費', 
        amount: 1480000, 
        description: '営業活動の交通費',
        details: [
          { item: '新幹線・飛行機', amount: 1000000 },
          { item: 'タクシー・レンタカー', amount: 350000 },
          { item: '宿泊費', amount: 130000 }
        ]
      },
      { 
        category: '接待費', 
        amount: 960000, 
        description: '顧客接待費用',
        details: [
          { item: '会食費', amount: 600000 },
          { item: 'ゴルフ接待', amount: 250000 },
          { item: 'その他接待', amount: 110000 }
        ]
      }
    ]
  },
  2025: {
    firstHalf: [
      { 
        category: '広告費', 
        amount: 1320000, 
        description: 'Web広告、印刷物広告',
        details: [
          { item: 'Web広告', amount: 880000 },
          { item: 'SNS広告', amount: 330000 },
          { item: '印刷物広告', amount: 110000 }
        ]
      },
      { 
        category: 'イベント費', 
        amount: 880000, 
        description: '展示会、セミナー参加費',
        details: [
          { item: '展示会出展費', amount: 550000 },
          { item: 'セミナー参加費', amount: 220000 },
          { item: 'イベント準備費', amount: 110000 }
        ]
      },
      { 
        category: '交通費', 
        amount: 660000, 
        description: '営業活動の交通費',
        details: [
          { item: '新幹線・飛行機', amount: 440000 },
          { item: 'タクシー・レンタカー', amount: 165000 },
          { item: '宿泊費', amount: 55000 }
        ]
      },
      { 
        category: '接待費', 
        amount: 440000, 
        description: '顧客接待費用',
        details: [
          { item: '会食費', amount: 275000 },
          { item: 'ゴルフ接待', amount: 110000 },
          { item: 'その他接待', amount: 55000 }
        ]
      }
    ],
    secondHalf: [
      { 
        category: '広告費', 
        amount: 1936000, 
        description: 'Web広告、印刷物広告',
        details: [
          { item: 'Web広告', amount: 1320000 },
          { item: 'SNS広告', amount: 440000 },
          { item: '印刷物広告', amount: 176000 }
        ]
      },
      { 
        category: 'イベント費', 
        amount: 1320000, 
        description: '展示会、セミナー参加費',
        details: [
          { item: '展示会出展費', amount: 770000 },
          { item: 'セミナー参加費', amount: 385000 },
          { item: 'イベント準備費', amount: 165000 }
        ]
      },
      { 
        category: '交通費', 
        amount: 968000, 
        description: '営業活動の交通費',
        details: [
          { item: '新幹線・飛行機', amount: 660000 },
          { item: 'タクシー・レンタカー', amount: 220000 },
          { item: '宿泊費', amount: 88000 }
        ]
      },
      { 
        category: '接待費', 
        amount: 616000, 
        description: '顧客接待費用',
        details: [
          { item: '会食費', amount: 385000 },
          { item: 'ゴルフ接待', amount: 165000 },
          { item: 'その他接待', amount: 66000 }
        ]
      }
    ],
    fullYear: [
      { 
        category: '広告費', 
        amount: 3256000, 
        description: 'Web広告、印刷物広告',
        details: [
          { item: 'Web広告', amount: 2200000 },
          { item: 'SNS広告', amount: 770000 },
          { item: '印刷物広告', amount: 286000 }
        ]
      },
      { 
        category: 'イベント費', 
        amount: 2200000, 
        description: '展示会、セミナー参加費',
        details: [
          { item: '展示会出展費', amount: 1320000 },
          { item: 'セミナー参加費', amount: 605000 },
          { item: 'イベント準備費', amount: 275000 }
        ]
      },
      { 
        category: '交通費', 
        amount: 1628000, 
        description: '営業活動の交通費',
        details: [
          { item: '新幹線・飛行機', amount: 1100000 },
          { item: 'タクシー・レンタカー', amount: 385000 },
          { item: '宿泊費', amount: 143000 }
        ]
      },
      { 
        category: '接待費', 
        amount: 1056000, 
        description: '顧客接待費用',
        details: [
          { item: '会食費', amount: 660000 },
          { item: 'ゴルフ接待', amount: 275000 },
          { item: 'その他接待', amount: 121000 }
        ]
      }
    ]
  },
  2026: {
    firstHalf: [
      { 
        category: '広告費', 
        amount: 1452000, 
        description: 'Web広告、印刷物広告',
        details: [
          { item: 'Web広告', amount: 968000 },
          { item: 'SNS広告', amount: 363000 },
          { item: '印刷物広告', amount: 121000 }
        ]
      },
      { 
        category: 'イベント費', 
        amount: 968000, 
        description: '展示会、セミナー参加費',
        details: [
          { item: '展示会出展費', amount: 605000 },
          { item: 'セミナー参加費', amount: 242000 },
          { item: 'イベント準備費', amount: 121000 }
        ]
      },
      { 
        category: '交通費', 
        amount: 726000, 
        description: '営業活動の交通費',
        details: [
          { item: '新幹線・飛行機', amount: 484000 },
          { item: 'タクシー・レンタカー', amount: 182000 },
          { item: '宿泊費', amount: 60000 }
        ]
      },
      { 
        category: '接待費', 
        amount: 484000, 
        description: '顧客接待費用',
        details: [
          { item: '会食費', amount: 302000 },
          { item: 'ゴルフ接待', amount: 121000 },
          { item: 'その他接待', amount: 61000 }
        ]
      }
    ],
    secondHalf: [
      { 
        category: '広告費', 
        amount: 2129600, 
        description: 'Web広告、印刷物広告',
        details: [
          { item: 'Web広告', amount: 1452000 },
          { item: 'SNS広告', amount: 484000 },
          { item: '印刷物広告', amount: 193600 }
        ]
      },
      { 
        category: 'イベント費', 
        amount: 1452000, 
        description: '展示会、セミナー参加費',
        details: [
          { item: '展示会出展費', amount: 847000 },
          { item: 'セミナー参加費', amount: 423000 },
          { item: 'イベント準備費', amount: 182000 }
        ]
      },
      { 
        category: '交通費', 
        amount: 1064800, 
        description: '営業活動の交通費',
        details: [
          { item: '新幹線・飛行機', amount: 726000 },
          { item: 'タクシー・レンタカー', amount: 242000 },
          { item: '宿泊費', amount: 96800 }
        ]
      },
      { 
        category: '接待費', 
        amount: 677600, 
        description: '顧客接待費用',
        details: [
          { item: '会食費', amount: 423000 },
          { item: 'ゴルフ接待', amount: 182000 },
          { item: 'その他接待', amount: 72600 }
        ]
      }
    ],
    fullYear: [
      { 
        category: '広告費', 
        amount: 3581600, 
        description: 'Web広告、印刷物広告',
        details: [
          { item: 'Web広告', amount: 2420000 },
          { item: 'SNS広告', amount: 847000 },
          { item: '印刷物広告', amount: 314600 }
        ]
      },
      { 
        category: 'イベント費', 
        amount: 2420000, 
        description: '展示会、セミナー参加費',
        details: [
          { item: '展示会出展費', amount: 1452000 },
          { item: 'セミナー参加費', amount: 665000 },
          { item: 'イベント準備費', amount: 303000 }
        ]
      },
      { 
        category: '交通費', 
        amount: 1790800, 
        description: '営業活動の交通費',
        details: [
          { item: '新幹線・飛行機', amount: 1210000 },
          { item: 'タクシー・レンタカー', amount: 424000 },
          { item: '宿泊費', amount: 156800 }
        ]
      },
      { 
        category: '接待費', 
        amount: 1161600, 
        description: '顧客接待費用',
        details: [
          { item: '会食費', amount: 725000 },
          { item: 'ゴルフ接待', amount: 303000 },
          { item: 'その他接待', amount: 133600 }
        ]
      }
    ]
  }
}

// 雑費予算の内訳データ
const miscBudgetDetail = {
  2024: {
    firstHalf: [
      { category: '事務用品費', amount: 180000, description: '文具、消耗品' },
      { category: '通信費', amount: 150000, description: '電話、インターネット' },
      { category: '水道光熱費', amount: 120000, description: '電気、ガス、水道' },
      { category: '保険料', amount: 90000, description: '事務所保険、賠償責任保険' },
      { category: 'その他', amount: 60000, description: 'その他の雑費' }
    ],
    secondHalf: [
      { category: '事務用品費', amount: 264000, description: '文具、消耗品' },
      { category: '通信費', amount: 220000, description: '電話、インターネット' },
      { category: '水道光熱費', amount: 176000, description: '電気、ガス、水道' },
      { category: '保険料', amount: 132000, description: '事務所保険、賠償責任保険' },
      { category: 'その他', amount: 88000, description: 'その他の雑費' }
    ],
    fullYear: [
      { category: '事務用品費', amount: 444000, description: '文具、消耗品' },
      { category: '通信費', amount: 370000, description: '電話、インターネット' },
      { category: '水道光熱費', amount: 296000, description: '電気、ガス、水道' },
      { category: '保険料', amount: 222000, description: '事務所保険、賠償責任保険' },
      { category: 'その他', amount: 148000, description: 'その他の雑費' }
    ]
  },
  2025: {
    firstHalf: [
      { category: '事務用品費', amount: 198000, description: '文具、消耗品' },
      { category: '通信費', amount: 165000, description: '電話、インターネット' },
      { category: '水道光熱費', amount: 132000, description: '電気、ガス、水道' },
      { category: '保険料', amount: 99000, description: '事務所保険、賠償責任保険' },
      { category: 'その他', amount: 66000, description: 'その他の雑費' }
    ],
    secondHalf: [
      { category: '事務用品費', amount: 290400, description: '文具、消耗品' },
      { category: '通信費', amount: 242000, description: '電話、インターネット' },
      { category: '水道光熱費', amount: 193600, description: '電気、ガス、水道' },
      { category: '保険料', amount: 145200, description: '事務所保険、賠償責任保険' },
      { category: 'その他', amount: 96800, description: 'その他の雑費' }
    ],
    fullYear: [
      { category: '事務用品費', amount: 488400, description: '文具、消耗品' },
      { category: '通信費', amount: 407000, description: '電話、インターネット' },
      { category: '水道光熱費', amount: 325600, description: '電気、ガス、水道' },
      { category: '保険料', amount: 244200, description: '事務所保険、賠償責任保険' },
      { category: 'その他', amount: 162800, description: 'その他の雑費' }
    ]
  },
  2026: {
    firstHalf: [
      { category: '事務用品費', amount: 217800, description: '文具、消耗品' },
      { category: '通信費', amount: 181500, description: '電話、インターネット' },
      { category: '水道光熱費', amount: 145200, description: '電気、ガス、水道' },
      { category: '保険料', amount: 108900, description: '事務所保険、賠償責任保険' },
      { category: 'その他', amount: 72600, description: 'その他の雑費' }
    ],
    secondHalf: [
      { category: '事務用品費', amount: 319440, description: '文具、消耗品' },
      { category: '通信費', amount: 266200, description: '電話、インターネット' },
      { category: '水道光熱費', amount: 212960, description: '電気、ガス、水道' },
      { category: '保険料', amount: 159720, description: '事務所保険、賠償責任保険' },
      { category: 'その他', amount: 106480, description: 'その他の雑費' }
    ],
    fullYear: [
      { category: '事務用品費', amount: 537240, description: '文具、消耗品' },
      { category: '通信費', amount: 447700, description: '電話、インターネット' },
      { category: '水道光熱費', amount: 358160, description: '電気、ガス、水道' },
      { category: '保険料', amount: 268620, description: '事務所保険、賠償責任保険' },
      { category: 'その他', amount: 179080, description: 'その他の雑費' }
    ]
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export default function BudgetSummary() {
  const [selectedYear, setSelectedYear] = useState('2025')
  const [selectedPeriod, setSelectedPeriod] = useState('上半期')
  const [timeUnit, setTimeUnit] = useState<'year' | 'month'>('year')
  const [salesTimeUnit, setSalesTimeUnit] = useState<'year' | 'month'>('year')
  const [miscTimeUnit, setMiscTimeUnit] = useState<'year' | 'month'>('year')
  const [expandedSalesItem, setExpandedSalesItem] = useState<string | null>(null)

  // 選択された年のデータを取得
  const yearData = budgetData[selectedYear as '2024' | '2025' | '2026'] || budgetData['2025']
  
  // 選択された期間のデータを取得
  const periodKey = selectedPeriod === '上半期' ? 'firstHalf' : selectedPeriod === '下半期' ? 'secondHalf' : 'fullYear'
  const selectedPeriodData = yearData[periodKey as 'firstHalf' | 'secondHalf' | 'fullYear']

  return (
    <div className="space-y-8">
      {/* 予算集計表 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">予算サマリー</h3>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-md">{selectedYear}年</span>
            の{timeUnit === 'year' ? '上半期・下半期・通年' : '月別'}の予算を確認できます
          </p>
          
          {/* 予算概要カード */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">総予算</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(yearData.fullYear.salesBudget + yearData.fullYear.miscBudget + yearData.fullYear.incentiveBudget)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <CurrencyYenIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-green-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">使用済み金額</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(Math.round((yearData.fullYear.salesBudget + yearData.fullYear.miscBudget + yearData.fullYear.incentiveBudget) * 0.65))}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-yellow-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">残り予算</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(Math.round((yearData.fullYear.salesBudget + yearData.fullYear.miscBudget + yearData.fullYear.incentiveBudget) * 0.35))}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* 期間設定エリア */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 w-fit">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-900">期間設定</label>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">単位:</span>
                  <select
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                    value={timeUnit}
                    onChange={e => setTimeUnit(e.target.value as 'year' | 'month')}
                  >
                    <option value="year">年単位</option>
                    <option value="month">月単位</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">年:</span>
                  <select
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 hover:border-blue-300 transition-colors duration-200">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="w-1/7 px-4 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">期間</th>
                <th className="w-1/7 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">売上見込み</th>
                <th className="w-1/7 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">支出見込み</th>
                <th className="w-1/7 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">粗利</th>
                <th className="w-1/7 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">営業予算</th>
                <th className="w-1/7 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">雑費予算</th>
                <th className="w-1/7 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50">インセンティブ予算</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {timeUnit === 'year' ? (
                <>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">{selectedYear}年上半期</td>
                    <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200 hover:bg-gray-100 transition-all duration-200">
                      {formatCurrency(yearData.firstHalf.sales)}
                    </td>
                    <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200 hover:bg-gray-100 transition-all duration-200">
                      {formatCurrency(yearData.firstHalf.expenses)}
                    </td>
                    <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200 hover:bg-gray-100 transition-all duration-200">
                      {formatCurrency(yearData.firstHalf.grossProfit)}
                    </td>
                    <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200 hover:bg-gray-100 transition-all duration-200">
                      {formatCurrency(yearData.firstHalf.salesBudget)}
                    </td>
                    <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200 hover:bg-gray-100 transition-all duration-200">
                      {formatCurrency(yearData.firstHalf.miscBudget)}
                    </td>
                    <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 hover:bg-gray-100 transition-all duration-200">
                      {formatCurrency(yearData.firstHalf.incentiveBudget)}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">{selectedYear}年下半期</td>
                    <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200 hover:bg-gray-100 transition-all duration-200">
                      {formatCurrency(yearData.secondHalf.sales)}
                    </td>
                    <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200 hover:bg-gray-100 transition-all duration-200">
                      {formatCurrency(yearData.secondHalf.expenses)}
                    </td>
                    <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200 hover:bg-gray-100 transition-all duration-200">
                      {formatCurrency(yearData.secondHalf.grossProfit)}
                    </td>
                    <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200 hover:bg-gray-100 transition-all duration-200">
                      {formatCurrency(yearData.secondHalf.salesBudget)}
                    </td>
                    <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200 hover:bg-gray-100 transition-all duration-200">
                      {formatCurrency(yearData.secondHalf.miscBudget)}
                    </td>
                    <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 hover:bg-gray-100 transition-all duration-200">
                      {formatCurrency(yearData.secondHalf.incentiveBudget)}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">通年</td>
                    <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200 hover:bg-gray-100 transition-all duration-200">
                      {formatCurrency(yearData.fullYear.sales)}
                    </td>
                    <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200 hover:bg-gray-100 transition-all duration-200">
                      {formatCurrency(yearData.fullYear.expenses)}
                    </td>
                    <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200 hover:bg-gray-100 transition-all duration-200">
                      {formatCurrency(yearData.fullYear.grossProfit)}
                    </td>
                    <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200 hover:bg-gray-100 transition-all duration-200">
                      {formatCurrency(yearData.fullYear.salesBudget)}
                    </td>
                    <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200 hover:bg-gray-100 transition-all duration-200">
                      {formatCurrency(yearData.fullYear.miscBudget)}
                    </td>
                    <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 hover:bg-gray-100 transition-all duration-200">
                      {formatCurrency(yearData.fullYear.incentiveBudget)}
                    </td>
                  </tr>
                </>
              ) : (
                // 月単位の表示（上半期を6ヶ月分、下半期を6ヶ月分に分割）
                <>
                  {[1, 2, 3, 4, 5, 6].map(month => (
                    <tr key={`first-${month}`} className="border-b border-gray-200">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">{selectedYear}年{month}月</td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                        {formatCurrency(Math.round(yearData.firstHalf.sales / 6))}
                      </td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                        {formatCurrency(Math.round(yearData.firstHalf.expenses / 6))}
                      </td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                        {formatCurrency(Math.round(yearData.firstHalf.grossProfit / 6))}
                      </td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                        {formatCurrency(Math.round(yearData.firstHalf.salesBudget / 6))}
                      </td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                        {formatCurrency(Math.round(yearData.firstHalf.miscBudget / 6))}
                      </td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-gray-900">
                        {formatCurrency(Math.round(yearData.firstHalf.incentiveBudget / 6))}
                      </td>
                    </tr>
                  ))}
                  {[7, 8, 9, 10, 11, 12].map(month => (
                    <tr key={`second-${month}`} className="border-b border-gray-200">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">{selectedYear}年{month}月</td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                        {formatCurrency(Math.round(yearData.secondHalf.sales / 6))}
                      </td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                        {formatCurrency(Math.round(yearData.secondHalf.expenses / 6))}
                      </td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                        {formatCurrency(Math.round(yearData.secondHalf.grossProfit / 6))}
                      </td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                        {formatCurrency(Math.round(yearData.secondHalf.salesBudget / 6))}
                      </td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                        {formatCurrency(Math.round(yearData.secondHalf.miscBudget / 6))}
                      </td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-gray-900">
                        {formatCurrency(Math.round(yearData.secondHalf.incentiveBudget / 6))}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>



      {/* 営業予算の内訳テーブル */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-purple-200">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">営業予算の内訳</h3>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-md">{selectedYear}年</span>
            の営業予算の詳細な内訳を確認できます
          </p>
          
          {/* 営業予算概要カード */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">営業予算</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(salesBudgetDetail[selectedYear as '2024' | '2025' | '2026'][periodKey as 'firstHalf' | 'secondHalf' | 'fullYear'].reduce((sum, item) => sum + item.amount, 0))}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-green-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">使用済み金額</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(Math.round(salesBudgetDetail[selectedYear as '2024' | '2025' | '2026'][periodKey as 'firstHalf' | 'secondHalf' | 'fullYear'].reduce((sum, item) => sum + item.amount, 0) * 0.72))}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-yellow-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">残り予算</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(Math.round(salesBudgetDetail[selectedYear as '2024' | '2025' | '2026'][periodKey as 'firstHalf' | 'secondHalf' | 'fullYear'].reduce((sum, item) => sum + item.amount, 0) * 0.28))}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* 期間設定エリア */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 w-fit">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-900">期間設定</label>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">単位:</span>
                  <select
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                    value={salesTimeUnit}
                    onChange={e => setSalesTimeUnit(e.target.value as 'year' | 'month')}
                  >
                    <option value="year">年単位</option>
                    <option value="month">月単位</option>
                  </select>
                </div>
                {salesTimeUnit === 'year' && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">期間:</span>
                    <select
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                      value={selectedPeriod}
                      onChange={e => setSelectedPeriod(e.target.value)}
                    >
                      <option value="上半期">上半期</option>
                      <option value="下半期">下半期</option>
                      <option value="通年">通年</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 hover:border-purple-300 transition-colors duration-200">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="w-1/2 px-4 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">項目</th>
                <th className="w-1/2 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50">金額</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {salesTimeUnit === 'year' ? (
                <>
                  {salesBudgetDetail[selectedYear as '2024' | '2025' | '2026'][periodKey as 'firstHalf' | 'secondHalf' | 'fullYear'].map((item, index) => (
                    <>
                      <tr 
                        key={index} 
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setExpandedSalesItem(expandedSalesItem === item.category ? null : item.category)}
                      >
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                          <div className="flex items-center">
                            <span>{item.category}</span>
                            <svg 
                              className={`ml-2 w-4 h-4 transition-transform ${expandedSalesItem === item.category ? 'rotate-90' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-right font-medium text-gray-900">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                      {expandedSalesItem === item.category && 'details' in item && item.details && (
                        <tr>
                          <td colSpan={2} className="px-4 py-2 bg-blue-50 border-b border-gray-200">
                            <div className="pl-6">
                              <h4 className="text-sm font-semibold text-gray-800 mb-2">内訳詳細</h4>
                              <div className="space-y-1">
                                {item.details.map((detail: { item: string; amount: number }, detailIndex: number) => (
                                  <div key={detailIndex} className="flex justify-between text-sm">
                                    <span className="text-gray-700">{detail.item}</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(detail.amount)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                    <td className="px-4 py-4 text-sm font-bold text-gray-900 border-r border-gray-200">
                      合計
                    </td>
                    <td className="px-4 py-4 text-sm text-right font-bold text-gray-900">
                      {formatCurrency(salesBudgetDetail[selectedYear as '2024' | '2025' | '2026'][periodKey as 'firstHalf' | 'secondHalf' | 'fullYear'].reduce((sum, item) => sum + item.amount, 0))}
                    </td>
                  </tr>
                </>
              ) : (
                // 月単位の表示（上半期を6ヶ月分、下半期を6ヶ月分に分割）
                <>
                  {[1, 2, 3, 4, 5, 6].map(month => (
                    <tr key={`first-${month}`} className="border-b border-gray-200">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">{selectedYear}年{month}月</td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                        {formatCurrency(Math.round(salesBudgetDetail[selectedYear as '2024' | '2025' | '2026'].firstHalf.reduce((sum, item) => sum + item.amount, 0) / 6))}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        上半期の営業予算を6ヶ月で均等分割
                      </td>
                    </tr>
                  ))}
                  {[7, 8, 9, 10, 11, 12].map(month => (
                    <tr key={`second-${month}`} className="border-b border-gray-200">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">{selectedYear}年{month}月</td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                        {formatCurrency(Math.round(salesBudgetDetail[selectedYear as '2024' | '2025' | '2026'].secondHalf.reduce((sum, item) => sum + item.amount, 0) / 6))}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        下半期の営業予算を6ヶ月で均等分割
                      </td>
                    </tr>
                  ))}
                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                    <td className="px-4 py-4 text-sm font-bold text-gray-900 border-r border-gray-200">
                      通年合計
                    </td>
                    <td className="px-4 py-4 text-sm text-right font-bold text-gray-900 border-r border-gray-200">
                      {formatCurrency(salesBudgetDetail[selectedYear as '2024' | '2025' | '2026'].fullYear.reduce((sum, item) => sum + item.amount, 0))}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      -
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 雑費予算の内訳テーブル */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-orange-200">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">雑費予算の内訳</h3>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-md">{selectedYear}年</span>
            の雑費予算の詳細な内訳を確認できます
          </p>
          
          {/* 雑費予算概要カード */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">雑費予算</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(miscBudgetDetail[selectedYear as '2024' | '2025' | '2026'][periodKey as 'firstHalf' | 'secondHalf' | 'fullYear'].reduce((sum, item) => sum + item.amount, 0))}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-green-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">使用済み金額</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(Math.round(miscBudgetDetail[selectedYear as '2024' | '2025' | '2026'][periodKey as 'firstHalf' | 'secondHalf' | 'fullYear'].reduce((sum, item) => sum + item.amount, 0) * 0.68))}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-yellow-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">残り予算</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(Math.round(miscBudgetDetail[selectedYear as '2024' | '2025' | '2026'][periodKey as 'firstHalf' | 'secondHalf' | 'fullYear'].reduce((sum, item) => sum + item.amount, 0) * 0.32))}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* 期間設定エリア */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 w-fit">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-900">期間設定</label>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">単位:</span>
                  <select
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                    value={miscTimeUnit}
                    onChange={e => setMiscTimeUnit(e.target.value as 'year' | 'month')}
                  >
                    <option value="year">年単位</option>
                    <option value="month">月単位</option>
                  </select>
                </div>
                {miscTimeUnit === 'year' && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">期間:</span>
                    <select
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                      value={selectedPeriod}
                      onChange={e => setSelectedPeriod(e.target.value)}
                    >
                      <option value="上半期">上半期</option>
                      <option value="下半期">下半期</option>
                      <option value="通年">通年</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 hover:border-orange-300 transition-colors duration-200">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="w-1/4 px-4 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">項目</th>
                <th className="w-1/4 px-4 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50 border-r border-gray-200">金額</th>
                <th className="w-1/2 px-4 py-4 text-left text-sm font-semibold text-gray-900 bg-gray-50">説明</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {miscTimeUnit === 'year' ? (
                <>
                  {miscBudgetDetail[selectedYear as '2024' | '2025' | '2026'][periodKey as 'firstHalf' | 'secondHalf' | 'fullYear'].map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                        {item.category}
                      </td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {item.description}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                    <td className="px-4 py-4 text-sm font-bold text-gray-900 border-r border-gray-200">
                      合計
                    </td>
                    <td className="px-4 py-4 text-sm text-right font-bold text-gray-900 border-r border-gray-200">
                      {formatCurrency(miscBudgetDetail[selectedYear as '2024' | '2025' | '2026'][periodKey as 'firstHalf' | 'secondHalf' | 'fullYear'].reduce((sum, item) => sum + item.amount, 0))}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      -
                    </td>
                  </tr>
                </>
              ) : (
                // 月単位の表示（上半期を6ヶ月分、下半期を6ヶ月分に分割）
                <>
                  {[1, 2, 3, 4, 5, 6].map(month => (
                    <tr key={`first-${month}`} className="border-b border-gray-200">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">{selectedYear}年{month}月</td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                        {formatCurrency(Math.round(miscBudgetDetail[selectedYear as '2024' | '2025' | '2026'].firstHalf.reduce((sum, item) => sum + item.amount, 0) / 6))}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        上半期の雑費予算を6ヶ月で均等分割
                      </td>
                    </tr>
                  ))}
                  {[7, 8, 9, 10, 11, 12].map(month => (
                    <tr key={`second-${month}`} className="border-b border-gray-200">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">{selectedYear}年{month}月</td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 border-r border-gray-200">
                        {formatCurrency(Math.round(miscBudgetDetail[selectedYear as '2024' | '2025' | '2026'].secondHalf.reduce((sum, item) => sum + item.amount, 0) / 6))}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        下半期の雑費予算を6ヶ月で均等分割
                      </td>
                    </tr>
                  ))}
                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                    <td className="px-4 py-4 text-sm font-bold text-gray-900 border-r border-gray-200">
                      通年合計
                    </td>
                    <td className="px-4 py-4 text-sm text-right font-bold text-gray-900 border-r border-gray-200">
                      {formatCurrency(miscBudgetDetail[selectedYear as '2024' | '2025' | '2026'].fullYear.reduce((sum, item) => sum + item.amount, 0))}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      -
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 