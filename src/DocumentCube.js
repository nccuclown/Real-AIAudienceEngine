// DocumentCube.js
import React, { useState, useEffect } from "react";
import "./styles/components/document-cube.css";
import { config } from "./config";

// 生成文檔粒子
export const generateDocumentParticles = () => {
  console.log("生成立方體粒子開始");
  const particles = [];
  const radius = 140;
  const count = 50;
  const documentTypes = config.documentData.documentTypes;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const type = documentTypes[Math.floor(Math.random() * documentTypes.length)];
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();

    // 使用球面坐標系創建更均勻的分佈
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    particles.push({
      id: `doc-${i}`,
      x: x,
      y: y,
      z: z,
      size: 4 + Math.random() * 3,
      type: type,
      opacity: 0.1 + Math.random() * 0.3, // 開始時透明度較低
      showType: false,
      color: (i % 3 === 0) ? config.colors.primary : 
             (i % 3 === 1) ? config.colors.secondary : config.colors.blue,
      isConnecting: false,
      connectionProgress: 0,
      isExtracted: false,
    });
  }
  console.log("生成的粒子數量:", particles.length);
  return particles;
};

// 更新文檔粒子的位置和狀態
export const updateDocumentParticles = (particles, progress) => {
  return particles.map(p => {
    // 基本旋轉邏輯
    const angle = Math.atan2(p.y, p.x) + 0.01;
    const radius = Math.sqrt(p.x * p.x + p.y * p.y);

    // 根據進度調整粒子行為
    let newX = p.x;
    let newY = p.y;
    let newZ = p.z;
    let newOpacity = p.opacity;
    let showType = p.showType;
    let isConnecting = p.isConnecting;
    let connectionProgress = p.connectionProgress;
    let isExtracted = p.isExtracted;

    // 30-35% 進度範圍：部分文檔開始連接到知識庫
    if (progress > 30 && progress < 35 && Math.random() < 0.001 && !isConnecting) {
      isConnecting = true;
    }

    // 已經在連接狀態的粒子，增加連接進度
    if (isConnecting && connectionProgress < 1) {
      connectionProgress += 0.01;

      // 連接完成後，標記為已提取
      if (connectionProgress >= 1 && !isExtracted) {
        isExtracted = true;
        newOpacity = 0.9; // 提取後提高亮度
      }
    }

    // 根據進度增加顯示類型的概率
    if (progress > 32 && !showType && Math.random() < 0.005) {
      showType = true;
      newOpacity = 0.8; // 顯示類型時提高亮度
    }

    return {
      ...p,
      x: newX,
      y: newY,
      z: newZ,
      opacity: newOpacity,
      showType: showType,
      isConnecting: isConnecting,
      connectionProgress: connectionProgress,
      isExtracted: isExtracted,
    };
  });
};

// 文檔立方體組件
const DocumentCube = ({ showCube, documentParticles, progress, cubeRotation }) => {
  const [knowledgeRings, setKnowledgeRings] = useState([]);
  const [extractedInfo, setExtractedInfo] = useState([]);

  // 生成知識環 - 縮小尺寸以確保完全在中間區域顯示
  useEffect(() => {
    if (showCube) {
      const rings = [];
      // 內環 - 縮小半徑
      rings.push({
        id: 'inner-ring',
        radius: 45, // 從60縮小到45
        particleCount: 20,
        color: config.colors.primary,
        rotationSpeed: 0.5,
        width: 3
      });

      // 中環 - 縮小半徑
      rings.push({
        id: 'middle-ring',
        radius: 70, // 從90縮小到70
        particleCount: 30,
        color: config.colors.secondary,
        rotationSpeed: -0.3,
        width: 2
      });

      // 外環 - 縮小半徑
      rings.push({
        id: 'outer-ring',
        radius: 95, // 從120縮小到95
        particleCount: 40,
        color: config.colors.blue,
        rotationSpeed: 0.2,
        width: 1.5
      });

      setKnowledgeRings(rings);

      // 模擬提取信息
      const infoTypes = [
        "提案分析", "白皮書關鍵點", "產業報告摘要", 
        "媒體投放建議", "受眾洞察", "策略趨勢",
        "競品分析", "消費者行為", "KOL影響力"
      ];

      const infoDetails = [
        "從1,243筆提案數據中提取關鍵市場洞察，發現可應用於5大垂直產業領域",
        "整合8份產業白皮書的市場趨勢，辨識15個關鍵增長點，預測未來3年發展趨勢",
        "分析526個競品數據與優勢特點，歸納12個成功商業模式，發現差異化機會",
        "萃取372個行銷策略關鍵成功因素，建立效益評估模型，提高投放ROI達38%",
        "辨識目標受眾的5大消費傾向，23種購買決策因素，8種媒體接觸習慣",
        "彙整128項消費者行為調查結果，分析4大類群體偏好，建立精準溝通框架",
        "提煉18個品牌差異化指標，發掘3個未滿足市場需求，創建品牌獨特定位",
        "統整83個高轉化率廣告文案特徵，優化創意表現，提升點擊率達43%",
        "匯總57個目標KPI達成策略，建立跨通路整合方案，優化全通路體驗"
      ];

      const infoBatch = [];
      for (let i = 0; i < 9; i++) {
        infoBatch.push({
          id: `info-${i}`,
          text: infoTypes[i],
          detail: infoDetails[i],
          opacity: 0,
          delay: i * 0.5
        });
      }

      setExtractedInfo(infoBatch);
    }
  }, [showCube]);

  // 更新提取信息的顯示
  useEffect(() => {
    if (showCube && progress > 28) {
      const timer = setInterval(() => {
        setExtractedInfo(prev => 
          prev.map(info => ({
            ...info,
            opacity: progress > (28 + info.delay) ? 
              Math.min(info.opacity + 0.05, 1) : info.opacity
          }))
        );
      }, 100);

      return () => clearInterval(timer);
    }
  }, [showCube, progress]);

  // 當文件立方體展示完成時，發送完成事件
  useEffect(() => {
    // 只有當所有知識點都已顯示(progress > 52)且文檔粒子存在時
    if (showCube && documentParticles.length > 0 && progress > 52) {
      // 透過計時器確保動畫有足夠時間執行
      const timer = setTimeout(() => {
        console.log("立方體動畫完成，發送完成事件");
        const event = new CustomEvent('cubeAnimationComplete');
        window.dispatchEvent(event);
      }, 3000); // 增加延遲確保動畫完成

      return () => clearTimeout(timer);
    }
  }, [showCube, documentParticles.length, progress]);


  if (!showCube) return null;

  // 計算立方體旋轉
  const cubeStyle = {
    transform: `rotateY(${cubeRotation}deg) rotateX(${cubeRotation * 0.5}deg)`,
  };

  return (
    <div className={`cube-container ${showCube ? "active" : ""}`}>
      {/* 移除了右側的RAG標籤 */}

      <div className="knowledge-base-container" style={{
        position: "absolute", 
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none"
      }}>
        {showCube && progress >= 25 && (
          <div className="knowledge-core" style={{
            width: "150px",
            height: "150px",
            position: "relative",
            animation: "pulse 3s infinite"
          }}>
            <div className="core-sphere" style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: `radial-gradient(circle at 30% 30%, ${config.colors.primary}, ${config.colors.secondary}, ${config.colors.accent})`,
              boxShadow: `0 0 50px ${config.colors.primary}, 0 0 100px ${config.colors.secondary}`,
              opacity: 0.8
            }}></div>
            <div className="core-ring" style={{
              position: "absolute",
              inset: "-30px",
              border: `2px solid ${config.colors.primary}`,
              borderRadius: "50%",
              opacity: 0.5,
              animation: "rotate 10s linear infinite"
            }}></div>
            <div className="core-ring" style={{
              position: "absolute",
              inset: "-20px",
              border: `3px solid ${config.colors.blue}`,
              borderRadius: "50%",
              opacity: 0.3,
              animation: "rotate 7s linear infinite reverse"
            }}></div>
            <div className="core-ring" style={{
              position: "absolute",
              inset: "-10px",
              border: `1px solid ${config.colors.secondary}`,
              borderRadius: "50%",
              opacity: 0.7,
              animation: "rotate 5s linear infinite"
            }}></div>

            {/* 動態知識擷取動畫 */}
            {progress > 30 && progress < 65 && (
              <>
                {/* 知識擷取的閃光效果 */}
                <div className="knowledge-extraction-rays" style={{
                  position: "absolute",
                  inset: "-50px",
                  borderRadius: "50%",
                  background: "transparent",
                  zIndex: 20
                }}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={`ray-${i}`} style={{
                      position: "absolute",
                      width: "2px",
                      height: `${80 + Math.random() * 100}px`,
                      background: i % 3 === 0 ? config.colors.primary : 
                                i % 3 === 1 ? config.colors.secondary : config.colors.blue,
                      left: "50%",
                      top: "50%",
                      transformOrigin: "0 0",
                      transform: `rotate(${i * 30 + Math.random() * 10}deg) translateY(-50%)`,
                      opacity: 0.7,
                      animation: `rayPulse ${2 + Math.random() * 3}s infinite alternate ${Math.random()}s`
                    }}></div>
                  ))}
                </div>

                {/* 知識點文字飛入效果 */}
                <div className="knowledge-extraction-texts" style={{
                  position: "absolute",
                  inset: "-200px",
                  zIndex: 30
                }}>
                  {/* 第一個知識點 - 產業專案 */}
                  <div className={`knowledge-item ${progress > 32 ? 'knowledge-item-active' : ''}`} style={{
                    position: "absolute",
                    top: "-130px",
                    left: "50%",
                    transform: `translate(-50%, ${progress > 32 ? '0' : '-50px'})`,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    border: `1px solid ${config.colors.primary}`,
                    borderRadius: "8px",
                    padding: "8px 12px",
                    color: "white",
                    fontSize: "0.8rem",
                    opacity: progress > 32 ? 1 : 0,
                    transition: "opacity 0.5s, transform 0.5s",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    boxShadow: `0 0 15px ${config.colors.primary}`
                  }}>
                    <span style={{ color: "#26c6da", marginRight: "5px" }}>✓</span>
                    從1234篇產業專案中提取關鍵詞彙
                    <div className="knowledge-particles" style={{ position: "absolute", inset: 0 }}>
                      {progress > 32 && Array.from({ length: 5 }).map((_, i) => (
                        <div key={`particle-1-${i}`} style={{
                          position: "absolute",
                          width: "3px", 
                          height: "3px",
                          backgroundColor: config.colors.primary,
                          borderRadius: "50%",
                          left: `${10 + i * 20}%`,
                          top: "100%",
                          opacity: 0,
                          animation: `flyToCore 1s forwards ${i * 0.2}s`
                        }}></div>
                      ))}
                    </div>
                  </div>

                  {/* 第二個知識點 - 白皮書 */}
                  <div className={`knowledge-item ${progress > 37 ? 'knowledge-item-active' : ''}`} style={{
                    position: "absolute",
                    top: "50%",
                    right: "-180px",
                    transform: `translateY(-50%) ${progress > 37 ? 'translateX(0)' : 'translateX(50px)'}`,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    border: `1px solid ${config.colors.secondary}`,
                    borderRadius: "8px",
                    padding: "8px 12px",
                    color: "white",
                    fontSize: "0.8rem",
                    opacity: progress > 37 ? 1 : 0,
                    transition: "opacity 0.5s, transform 0.5s",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    boxShadow: `0 0 15px ${config.colors.secondary}`
                  }}>
                    <span style={{ color: "#26c6da", marginRight: "5px" }}>✓</span>
                    整合543份產業白皮書
                    <div className="knowledge-particles" style={{ position: "absolute", inset: 0 }}>
                      {progress > 37 && Array.from({ length: 5 }).map((_, i) => (
                        <div key={`particle-2-${i}`} style={{
                          position: "absolute",
                          width: "3px", 
                          height: "3px",
                          backgroundColor: config.colors.secondary,
                          borderRadius: "50%",
                          left: "0%",
                          top: `${10 + i * 20}%`,
                          opacity: 0,
                          animation: `flyToCore 1s forwards ${i * 0.2}s`
                        }}></div>
                      ))}
                    </div>
                  </div>

                  {/* 第三個知識點 - 廣告投放 */}
                  <div className={`knowledge-item ${progress > 42 ? 'knowledge-item-active' : ''}`} style={{
                    position: "absolute",
                    bottom: "-130px",
                    left: "50%",
                    transform: `translate(-50%, ${progress > 42 ? '0' : '50px'})`,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    border: `1px solid ${config.colors.blue}`,
                    borderRadius: "8px",
                    padding: "8px 12px",
                    color: "white",
                    fontSize: "0.8rem",
                    opacity: progress > 42 ? 1 : 0,
                    transition: "opacity 0.5s, transform 0.5s",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    boxShadow: `0 0 15px ${config.colors.blue}`
                  }}>
                    <span style={{ color: "#26c6da", marginRight: "5px" }}>✓</span>
                    分析527個廣告投放數據
                    <div className="knowledge-particles" style={{ position: "absolute", inset: 0 }}>
                      {progress > 42 && Array.from({ length: 5 }).map((_, i) => (
                        <div key={`particle-3-${i}`} style={{
                          position: "absolute",
                          width: "3px", 
                          height: "3px",
                          backgroundColor: config.colors.blue,
                          borderRadius: "50%",
                          left: `${10 + i * 20}%`,
                          top: "0%",
                          opacity: 0,
                          animation: `flyToCore 1s forwards ${i * 0.2}s`
                        }}></div>
                      ))}
                    </div>
                  </div>

                  {/* 第四個知識點 - 成功提案 */}
                  <div className={`knowledge-item ${progress > 47 ? 'knowledge-item-active' : ''}`} style={{
                    position: "absolute",
                    top: "50%",
                    left: "-180px",
                    transform: `translateY(-50%) ${progress > 47 ? 'translateX(0)' : 'translateX(-50px)'}`,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    border: `1px solid ${config.colors.accent}`,
                    borderRadius: "8px",
                    padding: "8px 12px",
                    color: "white",
                    fontSize: "0.8rem",
                    opacity: progress > 47 ? 1 : 0,
                    transition: "opacity 0.5s, transform 0.5s",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    boxShadow: `0 0 15px ${config.colors.accent}`
                  }}>
                    <span style={{ color: "#26c6da", marginRight: "5px" }}>✓</span>
                    學習372個成功提案
                    <div className="knowledge-particles" style={{ position: "absolute", inset: 0 }}>
                      {progress > 47 && Array.from({ length: 5 }).map((_, i) => (
                        <div key={`particle-4-${i}`} style={{
                          position: "absolute",
                          width: "3px", 
                          height: "3px",
                          backgroundColor: config.colors.accent,
                          borderRadius: "50%",
                          left: "100%",
                          top: `${10 + i * 20}%`,
                          opacity: 0,
                          animation: `flyToCore 1s forwards ${i * 0.2}s`
                        }}></div>
                      ))}
                    </div>
                  </div>

                  {/* 中央處理指示器 */}
                  {progress > 52 && (
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      border: `1px solid ${config.colors.primary}`,
                      borderRadius: "50%",
                      width: "100px",
                      height: "100px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      color: "#ffbb00",
                      fontSize: "0.8rem",
                      boxShadow: `0 0 20px ${config.colors.primary}`,
                      animation: "pulse 2s infinite",
                      zIndex: 40
                    }}>
                      <div style={{ fontWeight: "bold", marginBottom: "5px" }}>知識整合中</div>
                      <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{Math.min(99, Math.floor((progress - 52) * 6))}%</div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default DocumentCube;