
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
  const [traitsOpacity, setTraitsOpacity] = useState(0);
  const [traits, setTraits] = useState([
    // 廣告點擊行為標籤
    { name: "搜尋廣告點擊", color: "#ffbb00", value: "22%", category: "ad", position: { top: "35%", left: "55%" } },
    { name: "影片廣告完整觀看", color: "#ffbb00", value: "36%", category: "ad", position: { top: "40%", left: "70%" } },
    { name: "社群廣告互動", color: "#ffbb00", value: "41%", category: "ad", position: { top: "25%", left: "65%" } },
    
    // 閱覽興趣標籤
    { name: "科技新聞閱讀", color: "#ff8a00", value: "57%", category: "interest", position: { top: "20%", left: "40%" } },
    { name: "旅遊資訊搜尋", color: "#ff8a00", value: "46%", category: "interest", position: { top: "60%", left: "35%" } },
    { name: "美食探索內容", color: "#ff8a00", value: "38%", category: "interest", position: { top: "50%", left: "75%" } },
    { name: "理財相關文章", color: "#ff8a00", value: "33%", category: "interest", position: { top: "15%", left: "55%" } },
    
    // 零售消費行為標籤
    { name: "線上購物頻率", color: "#26c6da", value: "52%", category: "retail", position: { top: "70%", left: "55%" } },
    { name: "高單價商品購買", color: "#26c6da", value: "29%", category: "retail", position: { top: "45%", left: "30%" } },
    { name: "季節性消費模式", color: "#26c6da", value: "44%", category: "retail", position: { top: "65%", left: "65%" } },
    
    // 用戶特性標籤
    { name: "行動裝置使用者", color: "#ff5500", value: "68%", category: "user", position: { top: "30%", left: "20%" } },
    { name: "高消費力族群", color: "#ff5500", value: "46%", category: "user", position: { top: "75%", left: "45%" } },
    { name: "科技產品愛好者", color: "#ff5500", value: "57%", category: "user", position: { top: "55%", left: "20%" } },
    { name: "社群媒體活躍用戶", color: "#ff5500", value: "72%", category: "user", position: { top: "25%", left: "80%" } },
    { name: "旅遊相關興趣", color: "#00bcd4", value: "41%", category: "user", position: { top: "80%", left: "70%" } }
  ]);

  // 根據計數進度更新標籤透明度
  useEffect(() => {
    if (showSphere && internalProgress > 30) {
      const fadeInTimer = setInterval(() => {
        setTraitsOpacity(prev => {
          const target = internalProgress > 60 ? 1 : (internalProgress - 30) / 30;
          return Math.min(prev + 0.05, target);
        });
      }, 100);
      return () => clearInterval(fadeInTimer);
    } else {
      setTraitsOpacity(0);
    }
  }, [showSphere, internalProgress]);

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

  return (
    <div className="sphere-container">
      {/* 移除了所有球體粒子的渲染 */}

      <div
        className="database-counter fade-in"
        style={{
          zIndex: 200,
          top: "50%", // 調整到中央
          left: "50%",
          transform: "translate(-50%, -50%)",
          animation: fadeOut ? "fadeOut 1s forwards" : "none",
          padding: "15px 25px",
          backdropFilter: "blur(5px)",
          boxShadow: "0 0 20px rgba(255, 187, 0, 0.5)",
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

      {/* 特性標籤動畫 - 現在直接整合到startSphere階段 */}
      {showSphere && (
        <div className="traits-container" style={{ position: "absolute", width: "100%", height: "100%", pointerEvents: "none" }}>
          {traits.map((trait, index) => (
            <div
              key={`trait-${index}`}
              className="trait-tag-animated"
              style={{
                position: "absolute",
                top: trait.position.top,
                left: trait.position.left,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: trait.color,
                borderRadius: "4px",
                padding: "5px 10px",
                fontSize: "0.85rem",
                border: `1px solid ${trait.color}`,
                opacity: Math.min(traitsOpacity * (1 + (index % 3) * 0.1), 1), // 不同標籤有不同的淡入時間
                transition: "opacity 0.8s, transform 0.5s",
                transform: `scale(${0.8 + traitsOpacity * 0.2}) translateY(${(1 - traitsOpacity) * 15}px)`,
                boxShadow: `0 0 15px rgba(${trait.color.replace(/^#/, '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.5)`,
                zIndex: 300,
                animation: `pulse ${2 + index % 3}s infinite ease-in-out`,
                animationDelay: `${index * 0.1}s`,
                // 添加連接線
                '--line-color': trait.color
              }}
            >
              <span style={{ fontWeight: "bold" }}>{trait.name}</span>
              <span style={{ marginLeft: "8px", fontSize: "0.8rem" }}>{trait.value}</span>
              {/* 類別標記 */}
              <span 
                style={{ 
                  position: "absolute", 
                  top: "-6px", 
                  right: "-6px",
                  backgroundColor: trait.color,
                  color: "#000",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  fontSize: "0.6rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              ></span>
            </div>
          ))}
          
          {/* 添加分類圖例 - 僅在標籤開始顯示後才顯示 */}
          {traitsOpacity > 0.3 && (
            <div 
              className="traits-legend"
              style={{
                position: "absolute",
                bottom: "5%",
                right: "5%",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                padding: "8px 12px",
                borderRadius: "4px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                opacity: traitsOpacity,
                transition: "opacity 1s",
                zIndex: 310,
                fontSize: "0.8rem",
                border: "1px solid rgba(255, 255, 255, 0.2)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "10px", height: "10px", backgroundColor: "#ffbb00", borderRadius: "50%" }}></span>
                <span>廣告點擊行為</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "10px", height: "10px", backgroundColor: "#ff8a00", borderRadius: "50%" }}></span>
                <span>閱覽興趣偏好</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "10px", height: "10px", backgroundColor: "#26c6da", borderRadius: "50%" }}></span>
                <span>零售消費行為</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "10px", height: "10px", backgroundColor: "#ff5500", borderRadius: "50%" }}></span>
                <span>用戶特性標籤</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsumerDatabase;
