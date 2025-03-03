// ConsumerDatabase.js
import React, { useState, useEffect } from "react";
import { config, clampPercentage, getColorArray } from "./config";

// 生成球體粒子
export const generateSphereParticles = () => {
  // 生成一些粒子，這些粒子會被用於視覺效果
  const particles = [];
  const count = config.audienceData.particleCount || 80; // 從配置獲取粒子數量
  const colors = getColorArray();

  for (let i = 0; i < count; i++) {
    const size = 3 + Math.random() * 4;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.random() * Math.PI * 2;
    const radius = 80 + Math.random() * 40;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    particles.push({
      id: `sphere-particle-${i}`,
      x,
      y,
      z: Math.random() * 50 - 25,
      size,
      color,
      opacity: 0.3 + Math.random() * 0.7,
      angle,
      radius,
      rotationSpeed: 0.001 + Math.random() * 0.003,
      matched: false,
      highlighted: false,
    });
  }

  console.log("生成球體粒子數量:", particles.length);
  return particles;
};

// 更新球體粒子
export const updateSphereParticles = (
  particles,
  sphereRotation,
  showMatching
) => {
  return particles.map(p => {
    // 更新角度
    const newAngle = p.angle + p.rotationSpeed;
    const x = Math.cos(newAngle) * p.radius;
    const y = Math.sin(newAngle) * p.radius;

    // 如果在匹配階段，移動匹配的粒子
    let z = p.z;
    if (showMatching && p.matched) {
      z = Math.min(p.z + 0.5, 30);
    }

    return {
      ...p,
      angle: newAngle,
      x,
      y,
      z,
      opacity: showMatching ? (p.matched ? 0.9 : 0.3) : p.opacity
    };
  });
};

// 增強的數字格式化函數，可以處理不同格式的數字
const formatNumber = (num) => {
  // 如果數字大於1百萬，顯示為百萬格式，否則使用千分位逗號
  if (num >= 1000000) {
    // 顯示百萬，保留一位小數
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (num >= 1000) {
    // 顯示千，保留一位小數
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    // 小數字直接添加千分位逗號
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};

// 主要消費者資料庫組件
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

  // 計數器動畫效果
  useEffect(() => {
    if (!showSphere) {
      setDisplayCount(0);
      setAnimationComplete(false);
      setInternalProgress(0);
      return;
    }

    let startCount = 1;
    const targetCount = config.audienceData.maxAudienceCount || 3000000; // 從配置獲取目標數量
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
          console.log("發送球體動畫完成事件 - 直接進入第一階段");
        }, 1000); // 給一些緩衝時間確保UI更新
      }

      setDisplayCount(Math.floor(currentCount));
    }, interval);

    return () => clearInterval(timer);
  }, [showSphere]); // 簡化依賴

  // 當不顯示球體時不渲染任何內容
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

  // 渲染標籤組
  const renderTraitGroup = (traits, category, color, title) => {
    if (!traits.length) return null;
    
    return (
      <div className="tag-category" style={{
        width: '100%',
        marginBottom: '8px'
      }}>
        <div style={{
          fontSize: '0.9rem',
          color: color,
          marginBottom: '6px',
          paddingLeft: '4px',
          borderLeft: `3px solid ${color}`
        }}>
          {title}
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
          {traits.map((trait, index) => (
            <div
              key={`${category}-trait-${index}`}
              className="trait-tag-animated"
              style={{
                backgroundColor: "rgba(10, 10, 10, 0.8)",
                color: "#fff",
                borderRadius: "4px",
                padding: "3px 6px",
                fontSize: "0.7rem",
                border: `1px solid ${trait.color}`,
                boxShadow: `0 0 10px rgba(${trait.color.replace(/^#/, '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.5)`,
                animation: `pulse ${2 + index % 3}s infinite ease-in-out`,
                animationDelay: `${index * 0.15}s`,
                margin: "1px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "150px",
                transition: "all 0.3s ease-in-out",
                transform: "translateY(0)",
              }}
            >
              <span style={{ fontWeight: "bold", color: trait.color }}>{trait.name}</span>
              <span style={{ marginLeft: "8px", fontSize: "0.85rem" }}>{trait.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="sphere-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* 渲染球體粒子 */}
      <div className="sphere-particles-container" style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '300px',
        perspective: '1000px',
        zIndex: 50
      }}>
        {audienceParticles.map((particle) => (
          <div
            key={particle.id}
            className={`particle ${particle.highlighted ? "glowing" : ""}`}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              transform: `translate3d(${particle.x}px, ${particle.y}px, ${particle.z}px)`,
              boxShadow: particle.highlighted ? `0 0 10px ${particle.color}` : 'none'
            }}
          />
        ))}
        {/* 球體光暈效果 */}
        <div className="sphere-glow"></div>
      </div>

      {/* 左側計數器 */}
      <div
        className="database-counter fade-in"
        style={{
          zIndex: 200,
          position: 'relative',
          left: '5%',
          animation: fadeOut ? "fadeOut 1s forwards" : "none",
          padding: "20px 25px",
          backdropFilter: "blur(5px)",
          boxShadow: "0 0 30px rgba(255, 187, 0, 0.6)",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          borderRadius: "10px",
          border: "2px solid rgba(255, 187, 0, 0.4)",
          width: "40%",
          maxWidth: "320px"
        }}
      >
        <div className="counter-value" style={{ 
          fontSize: "2.2rem", 
          textShadow: "0 0 10px rgba(255, 187, 0, 0.7)" 
        }}>{formatNumber(displayCount)}</div>
        <div className="counter-label" style={{ 
          fontSize: "1.1rem",
          fontWeight: "600",
          color: "#ffdd77"
        }}>消費者輪廓資料庫</div>
        <div className="counter-sublabel" style={{ 
          marginTop: "8px", 
          fontSize: "0.95rem", 
          color: "#ffdd77" 
        }}>
          收集標籤數: {formatNumber(Math.floor(displayCount * 0.35 / 1000))}K+ 種
        </div>
        <div className="data-categories" style={{ 
          marginTop: "15px", 
          fontSize: "0.9rem", 
          color: "#ffffff", 
          display: "flex", 
          flexDirection: "column", 
          gap: "8px" 
        }}>
          <div style={{ 
            opacity: showCategoryA ? 1 : 0.2, 
            transition: "opacity 0.8s ease, transform 0.5s ease",
            transform: showCategoryA ? "translateX(0)" : "translateX(-10px)",
            padding: "4px 8px",
            borderRadius: "4px",
            background: showCategoryA ? "rgba(255, 187, 0, 0.1)" : "transparent",
            border: showCategoryA ? "1px solid rgba(255, 187, 0, 0.3)" : "none"
          }}>
            <span style={{ color: "#ffbb00", marginRight: "6px", fontSize: "1.1rem" }}>●</span> 
            <strong>廣告點擊行為:</strong> {showCategoryA ? formatNumber(Math.floor(displayCount * 0.15 / 1000)) : 0}K+
          </div>
          <div style={{ 
            opacity: showCategoryB ? 1 : 0.2, 
            transition: "opacity 0.8s ease, transform 0.5s ease",
            transform: showCategoryB ? "translateX(0)" : "translateX(-10px)",
            padding: "4px 8px",
            borderRadius: "4px",
            background: showCategoryB ? "rgba(255, 138, 0, 0.1)" : "transparent",
            border: showCategoryB ? "1px solid rgba(255, 138, 0, 0.3)" : "none"
          }}>
            <span style={{ color: "#ff8a00", marginRight: "6px", fontSize: "1.1rem" }}>●</span> 
            <strong>閱覽興趣偏好:</strong> {showCategoryB ? formatNumber(Math.floor(displayCount * 0.22 / 1000)) : 0}K+
          </div>
          <div style={{ 
            opacity: showCategoryC ? 1 : 0.2, 
            transition: "opacity 0.8s ease, transform 0.5s ease",
            transform: showCategoryC ? "translateX(0)" : "translateX(-10px)",
            padding: "4px 8px",
            borderRadius: "4px",
            background: showCategoryC ? "rgba(38, 198, 218, 0.1)" : "transparent",
            border: showCategoryC ? "1px solid rgba(38, 198, 218, 0.3)" : "none"
          }}>
            <span style={{ color: "#26c6da", marginRight: "6px", fontSize: "1.1rem" }}>●</span> 
            <strong>零售消費行為:</strong> {showCategoryC ? formatNumber(Math.floor(displayCount * 0.18 / 1000)) : 0}K+
          </div>
        </div>

        {/* 動畫進度指示器 - 僅在開發模式顯示 */}
        <div style={{ marginTop: "12px", fontSize: "0.7rem", color: "#aaaaaa" }}>
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
          width: '52%', // 增加寬度比例
          maxWidth: '580px', // 增加最大寬度
          height: 'auto', // 自適應高度
          minHeight: '380px',
          maxHeight: '420px', // 稍微限制最大高度
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '12px',
          border: '2px solid rgba(255, 187, 0, 0.3)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 0 25px rgba(0, 0, 0, 0.6)',
          transition: 'all 0.6s ease-in-out',
          opacity: 1, // 保持可見
          transform: `scale(1)`, // 保持可見
          zIndex: 100
        }}
      >
        <div className="traits-header" style={{ 
          marginBottom: '15px', 
          textAlign: 'center',
          padding: '5px',
          borderBottom: '1px solid rgba(255, 187, 0, 0.3)'
        }}>
          <h3 style={{ 
            margin: 0, 
            color: '#ffbb00', 
            fontSize: '1.3rem',
            textShadow: '0 0 8px rgba(255, 187, 0, 0.5)' 
          }}>消費者特性標籤</h3>
          <div style={{ 
            fontSize: '0.9rem', 
            color: '#ffffff', 
            marginTop: '5px',
            opacity: 0.9 
          }}>
            即時收集的用戶行為與偏好數據
          </div>
        </div>

        <div className="traits-content" style={{ 
          flex: 1, 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '8px',
          overflowY: 'auto',
          overflowX: 'hidden',
          alignContent: 'flex-start',
          justifyContent: 'flex-start',
          padding: '5px 10px'
        }}>
          {/* 使用封裝的渲染函數來顯示各分類標籤 */}
          {showCategoryA && renderTraitGroup(visibleAdTraits, 'ad', '#ffbb00', '廣告點擊行為')}
          {showCategoryB && renderTraitGroup(visibleInterestTraits, 'interest', '#ff8a00', '閱覽興趣偏好')}
          {showCategoryC && renderTraitGroup(visibleRetailTraits, 'retail', '#26c6da', '零售消費行為')}
          {showCategoryC && renderTraitGroup(visibleUserTraits, 'user', '#ff5500', '用戶特性')}
        </div>

        {/* 強化的視覺連接線 */}
        <div className="connection-line" style={{
          position: 'absolute',
          left: '-80px',
          top: '50%',
          width: '80px',
          height: '3px',
          background: 'linear-gradient(90deg, rgba(255, 187, 0, 0.2) 0%, rgba(255, 187, 0, 1) 100%)',
          transform: 'translateY(-50%)',
          opacity: 1, // 保持可見
          transition: 'opacity 0.8s ease, width 0.5s ease',
          boxShadow: '0 0 8px rgba(255, 187, 0, 0.8)'
        }}></div>

        {/* 額外的點綴連接線 */}
        <div className="connection-dots" style={{
          position: 'absolute',
          left: '-80px',
          top: '40%',
          width: '60px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 187, 0, 0.6) 100%)',
          transform: 'translateY(-50%) rotate(-15deg)',
          opacity: showCategoryA ? 0.7 : 0,
          transition: 'opacity 0.8s ease',
        }}></div>

        <div className="connection-dots" style={{
          position: 'absolute',
          left: '-80px',
          top: '60%',
          width: '60px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 187, 0, 0.6) 100%)',
          transform: 'translateY(-50%) rotate(15deg)',
          opacity: showCategoryC ? 0.7 : 0,
          transition: 'opacity 0.8s ease',
        }}></div>
      </div>
    </div>
  );
};

export default ConsumerDatabase;