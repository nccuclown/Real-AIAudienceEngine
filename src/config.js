
// config.js
export const config = {
  speedFactor: 1.0, // 降低速度因子以允許動畫完整展示
  stages: [
    "龐大的消費者資料庫",
    "提案與結案的RAG豐富化",
    "TNL MG Tag整合客戶數據",
    "精準受眾匹配",
    "完整受眾分析報告",
  ],
  techLabels: [
    "Powered by Predictive AI",
    "RAG - Retrieval-Augmented Generation",
    "Data Fusion with TNL MG Tag",
    "AI Agent + Predictive AI",
    "Generative AI",
  ],
  stageDescriptions: [
    "AI Audience 從數百萬消費者輪廓開始，打造了一個龐大的資料庫。Predictive AI 讓我們預測每個人的潛在需求。",
    "我們將過去的提案、結案與產業白皮書融入 AI Audience，用 RAG 技術豐富它的知識庫，讓它更專業、更懂市場與客戶。",
    "透過獨特的 TNL MG Tag，我們整合客戶的第一方數據，讓 AI Audience 的資料庫更豐富、更貼近您的需求。",
    "在完整的內外數據支援下，AI Audience 能迅速找到最精準的受眾，無論您的產品是什麼。",
    "最後，AI Audience 為您生成一份完整的受眾分析報告，涵蓋性別、年齡、興趣與購買行為，幫助您做出最佳決策。",
  ],
  // 時間軸現在只標記階段轉換點，不再控制具體時間
  timeline: [
    { milestone: "sphere", action: "startSphere" },      // 開始球體動畫
    { milestone: "stage1", action: "startStage1" },     // 第一階段標記
    { milestone: "cube", action: "startCube" },       // 等待球體動畫完成後開始立方體
    { milestone: "cubeDocuments", action: "showCubeDocuments" },
    { milestone: "stage2", action: "startStage2" },
    { milestone: "dataFusion", action: "startDataFusion" }, // 等待立方體動畫完成後開始數據融合
    { milestone: "dataMerging", action: "showDataMerging" },
    { milestone: "stage3", action: "startStage3" },
    { milestone: "matching", action: "startMatching" },   // 等待數據融合完成
    { milestone: "matchedAudience", action: "showMatchedAudience" },
    { milestone: "stage4", action: "startStage4" },
    { milestone: "report", action: "startReport" },     // 等待匹配動畫完成
    { milestone: "fullReport", action: "showFullReport" },
    { milestone: "complete", action: "complete" },
  ],
  colors: {
    primary: "#ffbb00",
    secondary: "#ff8a00",
    accent: "#ff5500",
    blue: "#26c6da",
    lightBlue: "#00bcd4",
    background: "#0a0a10",
  },
  audienceData: {
    audienceTraits: [
      "興趣：科技",
      "消費力：高",
      "職業：專業人士",
      "年齡：25-34",
      "裝置：iOS用戶",
      "消費頻率：高",
      "品牌忠誠度：中",
      "社群活躍度：高",
      "購買決策：快速",
      "價格敏感度：低",
    ],
    maxAudienceCount: 3000000,
    particleCount: 80,
  },
  documentData: {
    documentTypes: [
      "旅遊廣告成效",
      "科技產品提案",
      "美妝品牌成功案例",
      "汽車行銷策略",
      "遊戲APP推廣",
      "金融服務方案",
      "食品飲料行銷",
      "時尚產業分析",
      "電商平台報告",
      "串流媒體行銷",
      "消費者行為調查",
      "產業白皮書",
    ],
    particleCount: 60,
    cubeSize: 30,
  },
  clientData: {
    clientDataTypes: [
      "購買記錄",
      "瀏覽行為",
      "品牌偏好",
      "帳戶數據",
      "忠誠度分數",
      "商品回購率",
      "流失風險",
      "客戶服務互動",
      "價格敏感度",
      "季節性模式",
    ],
    particleCount: 30,
  },
  productDemand: {
    name: "新款高端智能手機",
    features: ["AI相機", "高續航", "全面屏"],
    targetAudience: ["科技愛好者", "專業人士", "高消費族群"],
  },
  matchedAudience: {
    name: "科技迷 - 高消費力",
    size: 1240000,
    traits: ["科技", "攝影", "科技新聞", "早期採用者"],
    demographics: {
      gender: { male: 62, female: 38 },
      age: { "18-24": 15, "25-34": 45, "35-44": 30, "45+": 10 },
      income: { high: 65, medium: 30, low: 5 },
      education: { college: 80, highSchool: 20 },
    },
    behavior: {
      avgSpend: 3500,
      purchaseFrequency: "每月1-2次",
      brandLoyalty: "中偏高",
      researchHabits: "深度研究型",
    },
  },
  reportConfig: {
    title: "受眾分析報告",
    matchAnalysis:
      "此受眾群體對新科技產品有高度興趣，購買力強，消費決策速度快。對品質與創新有高度追求，非常適合高端智能手機的推廣活動。預估轉化率提升38%。",
  },
  animation: {
    particleUpdateInterval: 100,
    resetDelay: 5000,
    progressIncrement: 0.1,
  },
};

export const getAnimationParams = () => {
  return {
    particleUpdateInterval: Math.max(
      10,
      Math.floor(config.animation.particleUpdateInterval / config.speedFactor)
    ),
    progressIncrement: config.animation.progressIncrement * config.speedFactor,
    resetDelay: Math.max(
      1000,
      Math.floor(config.animation.resetDelay / config.speedFactor)
    ),
  };
};

export const getColorArray = () => [
  config.colors.primary,
  config.colors.secondary,
  config.colors.accent,
  config.colors.blue,
  config.colors.lightBlue,
];

export const clampPercentage = (value) => {
  return Math.max(0, Math.min(100, value));
};

// 為進度條提供基於階段完成的進度計算
export const calculateProgressFromStage = (currentStage, totalStages) => {
  return (currentStage / totalStages) * 100;
};
