// ConsumerDatabase.js
import React, { useState, useEffect } from "react";
import { config, clampPercentage, getColorArray } from "./config";

export const generateSphereParticles = () => {
  // 仍然返回粒子數組，但我們不會呈現它們
  const particles = [];
  console.log("生成球體粒子數量:", particles.length);
  return particles;
};

export const updateSphereParticles = (
  particles,
  sphereRotation,
  showMatching
) => {
  // 直接返回粒子，但不會被渲染
  return particles;
};

const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const ConsumerDatabase = ({
  progress,
  showSphere,
  audienceParticles,
  dataCount,
}) => {
  const [displayCount, setDisplayCount] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [internalProgress, setInternalProgress] = useState(0);
  const [traits] = useState([
    // 廣告點擊行為標籤
    { name: "搜尋廣告點擊", color: "#ffbb00", value: "22%", category: "ad" },
    { name: "影片廣告完整觀看", color: "#ffbb00", value: "36%", category: "ad" },
    { name: "社群廣告互動", color: "#ffbb00", value: "41%", category: "ad" },
    { name: "購物車廣告", color: "#ffbb00", value: "18%", category: "ad" },
    { name: "周末促銷活動", color: "#ffbb00", value: "25%", category: "ad" },

    // 閱覽興趣標籤
    { name: "科技新聞閱讀", color: "#ff8a00", value: "57%", category: "interest" },
    { name: "旅遊資訊搜尋", color: "#ff8a00", value: "46%", category: "interest" },
    { name: "美食探索內容", color: "#ff8a00", value: "38%", category: "interest" },
    { name: "理財相關文章", color: "#ff8a00", value: "33%", category: "interest" },
    { name: "運動賽事關注", color: "#ff8a00", value: "29%", category: "interest" },
    { name: "時尚流行趨勢", color: "#ff8a00", value: "42%", category: "interest" },

    // 零售消費行為標籤
    { name: "線上購物頻率", color: "#26c6da", value: "52%", category: "retail" },
    { name: "高單價商品購買", color: "#26c6da", value: "29%", category: "retail" },
    { name: "季節性消費模式", color: "#26c6da", value: "44%", category: "retail" },
    { name: "促銷活動響應", color: "#26c6da", value: "37%", category: "retail" },
    { name: "品牌忠誠度", color: "#26c6da", value: "33%", category: "retail" },

    // 用戶特性標籤
    { name: "行動裝置使用者", color: "#ff5500", value: "68%", category: "user" },
    { name: "高消費力族群", color: "#ff5500", value: "46%", category: "user" },
    { name: "科技產品愛好者", color: "#ff5500", value: "57%", category: "user" },
    { name: "社群媒體活躍用戶", color: "#ff5500", value: "72%", category: "user" },
    { name: "旅遊相關興趣", color: "#00bcd4", value: "41%", category: "user" }
  ]);

  useEffect(() => {
    if (!showSphere) {
      setDisplayCount(0);
      setAnimationComplete(false);
      setInternalProgress(0);
      return;
    }

    let startCount = 1;
    const targetCount = 3000000; // 設置正確的目標數為300萬
    const duration = 12000; // 持續時間12秒
    const interval = 30;
    const steps = duration / interval;
    const increment = (targetCount - startCount) / steps;

    let currentCount = startCount;
    const timer = setInterval(() => {
      currentCount += increment;

      // 更新內部進度，用於控制顯示
      setInternalProgress(prev => Math.min(100, prev + 100/steps));

      if (currentCount >= targetCount) {
        currentCount = targetCount;
        clearInterval(timer);

        // 必須確保計數完成才標記動畫完成
        setAnimationComplete(true);
        console.log("消費者資料庫動畫計數完成:", targetCount);

        // 使用自定義事件通知父組件此動畫已完成
        setTimeout(() => {
          const event = new CustomEvent('sphereAnimationComplete');
          window.dispatchEvent(event);
          console.log("發送球體動畫完成事件");
        }, 1000); // 給一些緩衝時間確保UI更新
      }

      setDisplayCount(Math.floor(currentCount));
    }, interval);

    return () => clearInterval(timer);
  }, [showSphere]); // 簡化依賴

  if (!showSphere) return null;

  // 計算內部階段
  const showCategoryA = internalProgress > 20;
  const showCategoryB = internalProgress > 40;
  const showCategoryC = internalProgress > 60;
  const fadeOut = internalProgress > 85;

  // 根據類別過濾標籤
  const getVisibleTraits = (category) => {
    if ((category === 'ad' && !showCategoryA) || 
        (category === 'interest' && !showCategoryB) || 
        (category === 'retail' && !showCategoryC)) {
      return [];
    }
    return traits.filter(t => t.category === category);
  };

  // 獲取所有可見標籤
  const visibleAdTraits = getVisibleTraits('ad');
  const visibleInterestTraits = getVisibleTraits('interest');
  const visibleRetailTraits = getVisibleTraits('retail');
  const visibleUserTraits = getVisibleTraits('user'); // 用戶特性標籤與零售消費同時顯示

  return (
    <div className="sphere-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* 左側計數器 */}
      <div
        className="database-counter fade-in"
        style={{
          zIndex: 200,
          position: 'relative',
          left: '5%',
          animation: fadeOut ? "fadeOut 1s forwards" : "none",
          padding: "15px 25px",
          backdropFilter: "blur(5px)",
          boxShadow: "0 0 20px rgba(255, 187, 0, 0.5)",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderRadius: "8px",
          border: "1px solid rgba(255, 187, 0, 0.3)",
          width: "35%",
          maxWidth: "300px"
        }}
      >
        <div className="counter-value">{formatNumber(displayCount)}</div>
        <div className="counter-label">消費者輪廓資料庫</div>
        <div className="counter-sublabel" style={{ marginTop: "5px", fontSize: "0.9rem", color: "#ffdd77" }}>
          收集標籤數: {Math.floor(displayCount * 0.35 / 1000)}K+ 種
        </div>
        <div className="data-categories" style={{ marginTop: "10px", fontSize: "0.8rem", color: "#ffffff", display: "flex", flexDirection: "column", gap: "5px" }}>
          <div style={{ opacity: showCategoryA ? 1 : 0.2, transition: "opacity 0.5s" }}>
            <span style={{ color: "#ffbb00" }}>●</span> 廣告點擊行為: {showCategoryA ? Math.floor(displayCount * 0.15 / 1000) : 0}K+
          </div>
          <div style={{ opacity: showCategoryB ? 1 : 0.2, transition: "opacity 0.5s" }}>
            <span style={{ color: "#ff8a00" }}>●</span> 閱覽興趣偏好: {showCategoryB ? Math.floor(displayCount * 0.22 / 1000) : 0}K+
          </div>
          <div style={{ opacity: showCategoryC ? 1 : 0.2, transition: "opacity 0.5s" }}>
            <span style={{ color: "#26c6da" }}>●</span> 零售消費行為: {showCategoryC ? Math.floor(displayCount * 0.18 / 1000) : 0}K+
          </div>
        </div>

        {/* 動畫進度指示器 - 僅在開發模式顯示 */}
        <div style={{ marginTop: "10px", fontSize: "0.7rem", color: "#aaaaaa" }}>
          動畫進度: {Math.floor(internalProgress)}%
          {animationComplete && <span style={{ color: "#26c6da" }}> (完成)</span>}
        </div>
      </div>

      {/* 右側標籤容器 */}
      <div 
        className="traits-block-container"
        style={{
          position: 'relative',
          right: '5%',
          width: '50%',
          maxWidth: '450px',
          height: '400px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 187, 0, 0.3)',
          padding: '15px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
          transition: 'all 0.5s ease',
          opacity: showCategoryA || showCategoryB || showCategoryC ? 1 : 0,
          transform: `scale(${showCategoryA || showCategoryB || showCategoryC ? 1 : 0.9})`,
          zIndex: 100
        }}
      >
        <div className="traits-header" style={{ marginBottom: '10px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#ffbb00', fontSize: '1.2rem' }}>消費者特性標籤</h3>
          <div style={{ fontSize: '0.8rem', color: '#ffffff', marginTop: '5px' }}>
            即時收集的用戶行為與偏好數據
          </div>
        </div>

        <div className="traits-content" style={{ 
          flex: 1, 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '10px',
          overflow: 'hidden',
          alignContent: 'flex-start',
          justifyContent: 'center'
        }}>
          {/* 廣告點擊行為標籤 */}
          {visibleAdTraits.map((trait, index) => (
            <div
              key={`ad-trait-${index}`}
              className="trait-tag-animated"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: trait.color,
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "0.8rem",
                border: `1px solid ${trait.color}`,
                boxShadow: `0 0 15px rgba(${trait.color.replace(/^#/, '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.5)`,
                animation: `pulse ${2 + index % 3}s infinite ease-in-out`,
                animationDelay: `${index * 0.1}s`,
                margin: "2px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "180px"
              }}
            >
              <span style={{ fontWeight: "bold" }}>{trait.name}</span>
              <span style={{ marginLeft: "8px", fontSize: "0.8rem" }}>{trait.value}</span>
            </div>
          ))}

          {/* 閱覽興趣標籤 */}
          {visibleInterestTraits.map((trait, index) => (
            <div
              key={`interest-trait-${index}`}
              className="trait-tag-animated"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: trait.color,
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "0.8rem",
                border: `1px solid ${trait.color}`,
                boxShadow: `0 0 15px rgba(${trait.color.replace(/^#/, '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.5)`,
                animation: `pulse ${2 + index % 3}s infinite ease-in-out`,
                animationDelay: `${index * 0.1}s`,
                margin: "2px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "180px"
              }}
            >
              <span style={{ fontWeight: "bold" }}>{trait.name}</span>
              <span style={{ marginLeft: "8px", fontSize: "0.8rem" }}>{trait.value}</span>
            </div>
          ))}

          {/* 零售消費行為標籤 */}
          {visibleRetailTraits.map((trait, index) => (
            <div
              key={`retail-trait-${index}`}
              className="trait-tag-animated"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: trait.color,
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "0.8rem",
                border: `1px solid ${trait.color}`,
                boxShadow: `0 0 15px rgba(${trait.color.replace(/^#/, '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.5)`,
                animation: `pulse ${2 + index % 3}s infinite ease-in-out`,
                animationDelay: `${index * 0.1}s`,
                margin: "2px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "180px"
              }}
            >
              <span style={{ fontWeight: "bold" }}>{trait.name}</span>
              <span style={{ marginLeft: "8px", fontSize: "0.8rem" }}>{trait.value}</span>
            </div>
          ))}

          {/* 用戶特性標籤 - 與零售消費同步出現 */}
          {visibleUserTraits.map((trait, index) => (
            <div
              key={`user-trait-${index}`}
              className="trait-tag-animated"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: trait.color,
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "0.8rem",
                border: `1px solid ${trait.color}`,
                boxShadow: `0 0 15px rgba(${trait.color.replace(/^#/, '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.5)`,
                animation: `pulse ${2 + index % 3}s infinite ease-in-out`,
                animationDelay: `${index * 0.1}s`,
                margin: "2px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "180px"
              }}
            >
              <span style={{ fontWeight: "bold" }}>{trait.name}</span>
              <span style={{ marginLeft: "8px", fontSize: "0.8rem" }}>{trait.value}</span>
            </div>
          ))}
        </div>

        {/* 視覺連接線 */}
        <div className="connection-line" style={{
          position: 'absolute',
          left: '-50px',
          top: '50%',
          width: '50px',
          height: '2px',
          backgroundColor: '#ffbb00',
          transform: 'translateY(-50%)',
          opacity: showCategoryA || showCategoryB || showCategoryC ? 1 : 0,
          transition: 'opacity 0.5s ease'
        }}></div>
      </div>
    </div>
  );
};

export default ConsumerDatabase;