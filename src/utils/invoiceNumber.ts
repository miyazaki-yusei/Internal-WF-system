// 請求番号自動発番ロジック
// フォーマット: YYYYMMDDSSCC
// YYYY: 発行年
// MM: 稼働月
// DD: 稼働当月末日
// SS: セクターID
// CC: 顧客ID（仮番号）

// セクターID定義
const SECTOR_IDS = {
  // 営業
  'event': 11,      // イベント
  
  // コンサル
  'strategy': 21,   // 戦略
  'it': 22,         // IT
  'regional': 23,   // 地方創生
  'improvement': 24, // 業務改善
  
  // BPO
  'callcenter': 31, // コールセンター
  'sales_support': 32, // 営業支援
} as const;

// 案件タイプからセクターIDを取得
const getSectorId = (projectType: 'farm' | 'prime' | 'new', projectName?: string): number => {
  // ファーム案件はITコンサルとして扱う
  if (projectType === 'farm') {
    return SECTOR_IDS.it;
  }
  
  // プライム案件は戦略コンサルとして扱う
  if (projectType === 'prime') {
    return SECTOR_IDS.strategy;
  }
  
  // 新規作成は業務改善として扱う
  if (projectType === 'new') {
    return SECTOR_IDS.improvement;
  }
  
  // デフォルト
  return SECTOR_IDS.it;
};

// 顧客IDの仮番号生成（今後実際のデータと紐づける予定）
const getCustomerId = (clientName: string): string => {
  // クライアント名のハッシュ値から仮の顧客IDを生成
  let hash = 0;
  for (let i = 0; i < clientName.length; i++) {
    const char = clientName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // 2桁の数字に変換（01-99の範囲）
  const customerId = Math.abs(hash % 99) + 1;
  return customerId.toString().padStart(2, '0');
};

// 請求番号生成
export const generateInvoiceNumber = (
  projectType: 'farm' | 'prime' | 'new',
  clientName: string,
  issueDate: Date = new Date()
): string => {
  const year = issueDate.getFullYear();
  const month = (issueDate.getMonth() + 1).toString().padStart(2, '0');
  
  // 稼働当月末日を取得
  const lastDayOfMonth = new Date(year, issueDate.getMonth() + 1, 0).getDate();
  const lastDay = lastDayOfMonth.toString().padStart(2, '0');
  
  // セクターIDを取得
  const sectorId = getSectorId(projectType, clientName).toString().padStart(2, '0');
  
  // 顧客IDを取得（仮番号）
  const customerId = getCustomerId(clientName);
  
  // 請求番号を組み立て
  const invoiceNumber = `${year}${month}${lastDay}${sectorId}${customerId}`;
  
  return invoiceNumber;
};

// 請求番号の解析
export const parseInvoiceNumber = (invoiceNumber: string) => {
  if (invoiceNumber.length !== 12) {
    throw new Error('Invalid invoice number format');
  }
  
  const year = invoiceNumber.substring(0, 4);
  const month = invoiceNumber.substring(4, 6);
  const lastDay = invoiceNumber.substring(6, 8);
  const sectorId = parseInt(invoiceNumber.substring(8, 10));
  const customerId = invoiceNumber.substring(10, 12);
  
  // セクターIDから案件タイプを逆引き
  let projectType: 'farm' | 'prime' | 'new' = 'farm';
  if (sectorId === SECTOR_IDS.strategy) {
    projectType = 'prime';
  } else if (sectorId === SECTOR_IDS.improvement) {
    projectType = 'new';
  }
  
  return {
    year,
    month,
    lastDay,
    sectorId,
    customerId,
    projectType
  };
};

// セクターIDの定義をエクスポート
export { SECTOR_IDS }; 