// ConsumerDatabase.js
import React, { useState, useEffect } from "react";
import "./styles/components/consumer-database.css";
import { config, clampPercentage, getColorArray } from "./config";

export const generateSphereParticles = () => {
  // 生成一些粒子，這些粒子會被用於視覺效果
  const particles = [];
  const count = 80; // 設定適當的粒子數量
  const colors = ["#ffbb00", "#ff8a00", "#ff5500", "#26c6da", "#00bcd4"];

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
          console.log("發送球體動畫完成事件 - 直接進入第一階段");
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
    <div className="sphere-container">
      <div className="sphere-particles-container">
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
        <div className="sphere-glow"></div>
      </div>

      <div className="database-counter">
        <div className="counter-value">{formatNumber(displayCount)}</div>
        <div className="counter-label">消費者輪廓資料庫</div>
        <div className="counter-sublabel">
          收集標籤數: {formatNumber(Math.floor(displayCount * 0.35 / 1000))}K+ 種
        </div>
        <div className="data-categories">
          <div>
            <span>●</span> 
            <strong>廣告點擊行為:</strong> {showCategoryA ? formatNumber(Math.floor(displayCount * 0.15 / 1000)) : 0}K+
          </div>
          <div>
            <span>●</span> 
            <strong>閱覽興趣偏好:</strong> {showCategoryB ? formatNumber(Math.floor(displayCount * 0.22 / 1000)) : 0}K+
          </div>
          <div>
            <span>●</span> 
            <strong>零售消費行為:</strong> {showCategoryC ? formatNumber(Math.floor(displayCount * 0.18 / 1000)) : 0}K+
          </div>
        </div>
        <div>
          動畫進度: {Math.floor(internalProgress)}%
          {animationComplete && <span> (完成)</span>}
        </div>
      </div>

      <div className="traits-block-container">
        <div className="traits-header">
          <h3>消費者特性標籤</h3>
          <div>
            即時收集的用戶行為與偏好數據
          </div>
        </div>

        <div className="traits-content">
          {showCategoryA && visibleAdTraits.length > 0 && (
            <div className="tag-category">
              <div>
                廣告點擊行為
              </div>
              <div>
                {visibleAdTraits.map((trait, index) => (
                  <div
                    key={`ad-trait-${index}`}
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
                    }}
                  >
                    <span>{trait.name}</span>
                    <span>{trait.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showCategoryB && visibleInterestTraits.length > 0 && (
            <div className="tag-category">
              <div>
                閱覽興趣偏好
              </div>
              <div>
                {visibleInterestTraits.map((trait, index) => (
                  <div
                    key={`interest-trait-${index}`}
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
                    }}
                  >
                    <span>{trait.name}</span>
                    <span>{trait.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showCategoryC && (
            <>
              {visibleRetailTraits.length > 0 && (
                <div className="tag-category">
                  <div>
                    零售消費行為
                  </div>
                  <div>
                    {visibleRetailTraits.map((trait, index) => (
                      <div
                        key={`retail-trait-${index}`}
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
                        }}
                      >
                        <span>{trait.name}</span>
                        <span>{trait.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {visibleUserTraits.length > 0 && (
                <div className="tag-category">
                  <div>
                    用戶特性
                  </div>
                  <div>
                    {visibleUserTraits.map((trait, index) => (
                      <div
                        key={`user-trait-${index}`}
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
                        }}
                      >
                        <span>{trait.name}</span>
                        <span>{trait.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="connection-line"></div>
        <div className="connection-dots"></div>
        <div className="connection-dots"></div>
      </div>
    </div>
  );
};

export default ConsumerDatabase;