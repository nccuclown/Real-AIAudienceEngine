// DocumentCube.js - 文檔立方體模組
// 負責展示提案與結案的RAG豐富化立方體及其動畫效果

import React, { useState, useEffect } from "react";
import { config, clampPercentage, getColorArray } from "./config";

// 生成文檔立方體的粒子
export const generateDocumentParticles = () => {
  console.log("生成立方體粒子開始");
  const particles = [];
  const colors = getColorArray();
  const { documentTypes, particleCount, cubeSize } = config.documentData;

  // 立方體面的基本參數
  const centerX = 50; // 中心X座標
  const centerY = 50; // 中心Y座標

  for (let i = 0; i < particleCount; i++) {
    // 為每個粒子隨機選一個立方體面
    const face = Math.floor(Math.random() * 6);

    // 在選定面上隨機位置
    let x, y, z;

    switch (face) {
      case 0: // 正面
        x = centerX + (Math.random() - 0.5) * cubeSize;
        y = centerY + (Math.random() - 0.5) * cubeSize;
        z = centerY + cubeSize / 2;
        break;
      case 1: // 背面
        x = centerX + (Math.random() - 0.5) * cubeSize;
        y = centerY + (Math.random() - 0.5) * cubeSize;
        z = centerY - cubeSize / 2;
        break;
      case 2: // 頂面
        x = centerX + (Math.random() - 0.5) * cubeSize;
        z = centerY + (Math.random() - 0.5) * cubeSize;
        y = centerY - cubeSize / 2;
        break;
      case 3: // 底面
        x = centerX + (Math.random() - 0.5) * cubeSize;
        z = centerY + (Math.random() - 0.5) * cubeSize;
        y = centerY + cubeSize / 2;
        break;
      case 4: // 左面
        z = centerX + (Math.random() - 0.5) * cubeSize;
        y = centerY + (Math.random() - 0.5) * cubeSize;
        x = centerX - cubeSize / 2;
        break;
      case 5: // 右面
        z = centerX + (Math.random() - 0.5) * cubeSize;
        y = centerY + (Math.random() - 0.5) * cubeSize;
        x = centerX + cubeSize / 2;
        break;
      default:
        x = centerX;
        y = centerY;
        z = centerY;
    }

    // 從文檔類型中隨機選一個
    const docIndex = Math.floor(Math.random() * documentTypes.length);
    const docType = documentTypes[docIndex];

    const color = colors[Math.floor(Math.random() * colors.length)];

    // 基本粒子屬性
    const particle = {
      id: `doc-${i}-${Date.now()}`, // 確保ID唯一
      x: clampPercentage(x),
      y: clampPercentage(y),
      z,
      face,
      size: 2 + Math.random() * 2,
      color,
      opacity: 0.3 + Math.random() * 0.5,
      docType,
      showType: Math.random() < 0.15, // 只有部分粒子顯示文檔類型
      isDocument: true,
      isFlying: i > particleCount * 0.7, // 30%的粒子是飛行中狀態
      flyProgress: 0,
      flyStartX: Math.random() * 100,
      flyStartY: Math.random() * 100,
      // 新增：文檔內容預覽
      hasContent: Math.random() < 0.2, // 20%的粒子顯示內容預覽
      contentPreview: getRandomContent(docType),
    };

    particles.push(particle);
  }

  console.log(`生成的粒子數量: ${particles.length}`);
  return particles;
};

// 生成隨機文檔內容預覽
const getRandomContent = (docType) => {
  const contents = {
    旅遊廣告成效: ["點閱率提升38%", "轉換率達15%", "目標受眾:旅遊愛好者"],
    科技產品提案: ["AI相機新功能", "續航提升30%", "高端用戶首選"],
    美妝品牌成功案例: ["社群互動率增長", "25-34女性轉換高", "品牌忠誠度提升"],
    汽車行銷策略: ["豪華車專屬活動", "試駕率提升45%", "男性高收入族群"],
    遊戲APP推廣: ["遊戲時長增加", "付費率提升", "遊戲社群擴大"],
    金融服務方案: ["投資組合優化", "高資產客戶", "理財規劃服務"],
    食品飲料行銷: ["年輕族群喜好", "季節性偏好", "健康訴求成效佳"],
    時尚產業分析: ["高端品牌趨勢", "電商轉換率", "Instagram行銷效益"],
    電商平台報告: ["購物車轉換優化", "重複購買率", "會員價值提升"],
    串流媒體行銷: ["訂閱率增長策略", "內容吸引力分析", "付費轉換優化"],
  };

  // 如果找不到對應類型，使用一般內容
  const contentList = contents[docType] || [
    "使用者行為分析",
    "轉換率優化",
    "客戶回饋",
  ];
  return contentList[Math.floor(Math.random() * contentList.length)];
};

// 更新文檔粒子 - 立方體旋轉和飛行效果
export const updateDocumentParticles = (particles, cubeRotation) => {
  if (!particles || particles.length === 0) {
    console.warn("沒有粒子可更新");
    return [];
  }

  // 只處理可見區域的粒子或飛行中的粒子
  return particles.map((particle) => {
    // 文檔飛行效果
    if (particle.isFlying) {
      // 更新飛行進度 - 保持原邏輯但考慮優化計算
      const newProgress = Math.min(1, particle.flyProgress + 0.01);

      if (newProgress >= 1) {
        return {
          ...particle,
          flyProgress: 0,
          flyStartX: Math.random() * 100,
          flyStartY: Math.random() * 100,
          hasContent: Math.random() < 0.3, // 減少到30%
        };
      }

      // 簡化貝茲曲線計算，使用直線插值代替
      const t = newProgress;
      const startX = particle.flyStartX;
      const startY = particle.flyStartY;
      const endX = 50 + (particle.x - 50) * 0.2;
      const endY = 50 + (particle.y - 50) * 0.2;

      return {
        ...particle,
        displayX: clampPercentage(startX + (endX - startX) * t),
        displayY: clampPercentage(startY + (endY - startY) * t),
        flyProgress: newProgress,
      };
    }

    // 立方體旋轉效果 - 只在必要時計算
    // 以立方體中心為原點旋轉計算
    const angle = cubeRotation * (Math.PI / 180);
    const sinAngle = Math.sin(angle);
    const cosAngle = Math.cos(angle);

    const relX = particle.x - 50;
    const relZ = particle.z - 50;

    // 繞Y軸旋轉
    const rotatedX = relX * cosAngle - relZ * sinAngle;
    const rotatedZ = relX * sinAngle + relZ * cosAngle;

    return {
      ...particle,
      displayX: clampPercentage(rotatedX + 50),
      displayY: particle.y,
      displayZ: rotatedZ + 50,
      opacity: ((rotatedZ + 50) / 100) * 0.8 + 0.2,
    };
  });
};

// RAG連接線效果組件
const RAGConnectionLines = ({ progress }) => {
  if (progress < 30) return null;

  // 創建多條連接線，顯示RAG的檢索和生成過程
  const connections = [];
  const connectionCount = 5;

  for (let i = 0; i < connectionCount; i++) {
    const startY = 30 + i * 10;
    const startX = 30;
    const controlX1 = 40 + Math.random() * 5;
    const controlY1 = startY - (10 + Math.random() * 5);
    const controlX2 = 50 + Math.random() * 10;
    const controlY2 = startY + (5 + Math.random() * 10);
    const endX = 70;
    const endY = 50;

    const delay = i * 0.2;
    const opacity = 0.5 + i * 0.1;

    connections.push(
      <path
        key={`connection-${i}`}
        d={`M${startX},${startY} C${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`}
        stroke="#ffbb00"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="4,3"
        opacity={opacity}
        className="rag-connection"
        style={{ animationDelay: `${delay}s` }}
      />
    );
  }

  return (
    <svg
      className="rag-connections-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="ragGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {connections}

      {/* 箭頭指示資料流動方向 */}
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="0"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 10 3.5, 0 7" fill="#ffbb00" />
      </marker>
    </svg>
  );
};

// RAG內容抽取與增強效果
const RAGContentExtraction = ({ progress }) => {
  if (progress < 25 || progress > 39) return null;

  // 隨著進度增加展示RAG抽取的重要信息
  const contentTexts = [
    "抽取關鍵數據...",
    "整合相似提案資訊...",
    "分析目標受眾特徵...",
    "計算轉換率模式...",
    "提取成功案例模型...",
  ];

  const visibleCount = Math.min(
    Math.floor((progress - 25) / 3),
    contentTexts.length
  );

  return (
    <div className="rag-extraction">
      {contentTexts.slice(0, visibleCount).map((text, index) => (
        <div key={`extract-${index}`} className="rag-extraction-item fade-in">
          <div className="rag-extraction-icon">✓</div>
          <div className="rag-extraction-text">{text}</div>
        </div>
      ))}
    </div>
  );
};

// 知識庫視覺化效果
const KnowledgeBaseVisualization = ({ progress }) => {
  if (progress < 30) return null;

  // 設置知識庫的圓環效果，代表RAG的知識儲存
  return (
    <div className="knowledge-base">
      <div className="knowledge-ring outer-ring"></div>
      <div className="knowledge-ring middle-ring"></div>
      <div className="knowledge-ring inner-ring"></div>
      <div className="knowledge-core">
        <span>AI知識庫</span>
      </div>
    </div>
  );
};

// 文檔立方體組件
export const DocumentCube = ({
  showCube,
  documentParticles,
  progress,
  cubeRotation,
}) => {
  // 嚴格檢查showCube狀態，若為false則完全不渲染
  if (!showCube) {
    return null; // 當階段切換時完全不渲染，避免任何內容殘留
  }

  // 增加一個跟踪選中的文檔的狀態
  const [selectedDoc, setSelectedDoc] = useState(null);

  // 自動循環選擇文檔，用於演示 - 降低頻率
  useEffect(() => {
    if (!showCube || progress < 25) return;

    const interval = setInterval(() => {
      if (documentParticles && documentParticles.length > 0) {
        const staticParticles = documentParticles.filter((p) => !p.isFlying);
        if (staticParticles.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * staticParticles.length
          );
          setSelectedDoc(staticParticles[randomIndex]);
        }
      }
    }, 5000); // 5秒選擇一次，而非原來的3秒

    return () => clearInterval(interval);
  }, [showCube, documentParticles, progress]);

  // 確保文檔粒子存在
  const hasParticles = documentParticles && documentParticles.length > 0;

  // 為了效能，限制顯示的粒子數量
  const visibleParticles = hasParticles
    ? documentParticles.filter((p) => p.isFlying || Math.random() < 0.7)
    : [];

  return (
    <div
      className="cube-container"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        zIndex: 30,
      }}
    >
      {/* 基本元素保持不變 */}
      <KnowledgeBaseVisualization progress={progress} />
      <RAGConnectionLines progress={progress} />
      <RAGContentExtraction progress={progress} />
      <div className="cube-glow" />
      <div className="database-label fade-in">提案與結案數據庫</div>

      {/* 選中的文檔預覽 */}
      {selectedDoc && selectedDoc.hasContent && !selectedDoc.isFlying && (
        <div
          className="document-preview"
          style={{
            left: `${selectedDoc.displayX || selectedDoc.x}%`,
            top: `${(selectedDoc.displayY || selectedDoc.y) - 15}%`,
            borderColor: selectedDoc.color,
            zIndex: 200,
            position: "absolute",
          }}
        >
          <div
            className="document-preview-title"
            style={{ backgroundColor: selectedDoc.color }}
          >
            {selectedDoc.docType}
          </div>
          <div className="document-preview-content">
            {selectedDoc.contentPreview}
          </div>
        </div>
      )}

      {/* RAG技術標籤 */}
      <div className="rag-tech-badge">
        <div className="rag-tech-pulse"></div>
        <span>RAG 知識檢索進行中</span>
      </div>

      {/* 文檔粒子 - 只渲染一部分，減少DOM負擔 */}
      {visibleParticles.map((particle) => {
        // 計算顯示位置和樣式
        const displayX = particle.isFlying
          ? particle.displayX || particle.x
          : particle.displayX || particle.x;
        const displayY = particle.isFlying
          ? particle.displayY || particle.y
          : particle.displayY || particle.y;
        const displayZ = particle.isFlying
          ? 0
          : particle.displayZ || particle.z;

        // 檢查是否為選中的文檔
        const isSelected = selectedDoc && selectedDoc.id === particle.id;

        return (
          <div
            key={particle.id}
            className="particle-wrapper"
            style={{ zIndex: Math.floor(displayZ + 100) }}
          >
            {/* 文檔圖標 */}
            <div
              className={`document-particle ${
                isSelected ? "selected-document" : ""
              }`}
              style={{
                left: `${displayX}%`,
                top: `${displayY}%`,
                width: `${particle.size}px`,
                height: `${particle.size * 1.3}px`,
                backgroundColor: particle.color,
                opacity: particle.opacity,
                boxShadow: isSelected
                  ? `0 0 15px ${particle.color}, 0 0 10px ${particle.color}`
                  : particle.showType
                  ? `0 0 8px ${particle.color}`
                  : "none",
                position: "absolute",
              }}
            />

            {/* 飛行中的文檔顯示內容 */}
            {particle.isFlying && particle.hasContent && (
              <div
                className="flying-content-label"
                style={{
                  left: `${displayX + particle.size / 2}%`,
                  top: `${displayY - 10}%`,
                  color: particle.color,
                  borderColor: particle.color,
                  position: "absolute",
                }}
              >
                {particle.contentPreview}
              </div>
            )}

            {/* 文檔類型標籤 */}
            {particle.showType && !particle.isFlying && !isSelected && (
              <div
                className="particle-label"
                style={{
                  left: `${displayX + particle.size / 2}%`,
                  top: `${displayY - 10}%`,
                  color: particle.color,
                  opacity: particle.opacity * 1.2,
                  position: "absolute",
                }}
              >
                {particle.docType}
              </div>
            )}
          </div>
        );
      })}

      {/* RAG處理步驟 */}
      <div className="rag-steps">
        <div className={`rag-step ${progress >= 25 ? "active" : ""}`}>
          <div className="rag-step-number">1</div>
          <div className="rag-step-text">檢索相關文件</div>
        </div>
        <div className={`rag-step ${progress >= 30 ? "active" : ""}`}>
          <div className="rag-step-number">2</div>
          <div className="rag-step-text">分析關鍵內容</div>
        </div>
        <div className={`rag-step ${progress >= 35 ? "active" : ""}`}>
          <div className="rag-step-number">3</div>
          <div className="rag-step-text">融入知識庫</div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCube;
