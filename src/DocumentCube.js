
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
  
  // 生成知識環
  useEffect(() => {
    if (showCube) {
      const rings = [];
      // 內環
      rings.push({
        id: 'inner-ring',
        radius: 60,
        particleCount: 20,
        color: config.colors.primary,
        rotationSpeed: 0.5,
        width: 3
      });
      
      // 中環
      rings.push({
        id: 'middle-ring',
        radius: 90,
        particleCount: 30,
        color: config.colors.secondary,
        rotationSpeed: -0.3,
        width: 2
      });
      
      // 外環
      rings.push({
        id: 'outer-ring',
        radius: 120,
        particleCount: 40,
        color: config.colors.blue,
        rotationSpeed: 0.2,
        width: 1.5
      });
      
      setKnowledgeRings(rings);
      
      // 模擬提取信息
      const infoTypes = [
        "提案分析...", "白皮書關鍵點...", "產業報告摘要...", 
        "媒體投放建議...", "受眾洞察...", "策略趨勢...",
        "競品分析...", "消費者行為...", "KOL影響力..."
      ];
      
      const infoBatch = [];
      for (let i = 0; i < 9; i++) {
        infoBatch.push({
          id: `info-${i}`,
          text: infoTypes[i],
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
  
  if (!showCube) return null;
  
  // 計算立方體旋轉
  const cubeStyle = {
    transform: `rotateY(${cubeRotation}deg) rotateX(${cubeRotation * 0.5}deg)`,
  };

  return (
    <div className="cube-container">
      {/* 知識庫核心 */}
      <div className="knowledge-core" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        backgroundColor: config.colors.primary,
        boxShadow: `0 0 15px ${config.colors.primary}`,
        transform: 'translate(-50%, -50%)',
        zIndex: 30
      }}>
        <div className="core-pulse" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          backgroundColor: 'transparent',
          border: `2px solid ${config.colors.primary}`,
          transform: 'translate(-50%, -50%) scale(1)',
          animation: 'pulse 2s infinite',
          opacity: 0.7
        }}></div>
      </div>
      
      {/* 知識環 */}
      {knowledgeRings.map(ring => (
        <div key={ring.id} className="knowledge-ring" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: `${ring.radius * 2}px`,
          height: `${ring.radius * 2}px`,
          borderRadius: '50%',
          border: `${ring.width}px solid ${ring.color}`,
          transform: 'translate(-50%, -50%) rotate(0deg)',
          animation: `rotate ${10/ring.rotationSpeed}s linear infinite`,
          opacity: 0.6,
          boxShadow: `0 0 10px ${ring.color}`,
        }}>
          {Array.from({length: ring.particleCount}).map((_, i) => {
            const angle = (Math.PI * 2 * i) / ring.particleCount;
            const x = Math.cos(angle) * ring.radius;
            const y = Math.sin(angle) * ring.radius;
            return (
              <div key={`${ring.id}-p-${i}`} className="ring-particle" style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: ring.color,
                transform: `translate(${x}px, ${y}px)`,
                boxShadow: `0 0 3px ${ring.color}`,
              }}></div>
            );
          })}
        </div>
      ))}
      
      {/* 文檔粒子 */}
      <div className="document-particles" style={cubeStyle}>
        {documentParticles.map((particle) => (
          <React.Fragment key={particle.id}>
            <div
              className={`document-particle ${particle.isExtracted ? 'extracted-document' : ''}`}
              style={{
                top: `calc(50% + ${particle.y}px)`,
                left: `calc(50% + ${particle.x}px)`,
                width: `${particle.size}px`,
                height: `${particle.size * 1.3}px`,
                opacity: particle.opacity,
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.isExtracted ? 8 : 3}px ${particle.color}`,
                transform: `translate(-50%, -50%) translateZ(${particle.z}px) ${particle.isExtracted ? 'scale(1.2)' : ''}`,
              }}
            ></div>
            
            {/* 文檔類型標籤 */}
            {particle.showType && (
              <div
                className="particle-label"
                style={{
                  top: `calc(50% + ${particle.y}px)`,
                  left: `calc(50% + ${particle.x}px)`,
                  transform: `translate(-50%, -150%) translateZ(${particle.z + 1}px)`,
                  backgroundColor: `rgba(0, 0, 0, 0.7)`,
                  border: `1px solid ${particle.color}`,
                  color: particle.color,
                }}
              >
                {particle.type}
              </div>
            )}
            
            {/* 連接線 */}
            {particle.isConnecting && (
              <svg
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  zIndex: 5,
                  opacity: 0.7,
                }}
              >
                <line
                  x1={particle.x}
                  y1={particle.y}
                  x2={0}
                  y2={0}
                  stroke={particle.color}
                  strokeWidth="1"
                  strokeDasharray="4"
                  strokeDashoffset={(1 - particle.connectionProgress) * 100}
                  style={{
                    animation: 'dash 1s linear infinite',
                  }}
                />
              </svg>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* 提取信息面板 */}
      <div className="extraction-panel" style={{
        position: 'absolute',
        top: '25%',
        left: '5%',
        width: '240px',
        padding: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '5px',
        border: `1px solid ${config.colors.primary}`,
        boxShadow: `0 0 10px ${config.colors.primary}`,
        zIndex: 40,
        opacity: progress > 28 ? 1 : 0,
        transition: 'opacity 0.5s',
      }}>
        <div className="panel-header" style={{
          fontSize: '0.9rem',
          fontWeight: 'bold',
          marginBottom: '8px',
          color: config.colors.primary,
          borderBottom: `1px solid ${config.colors.primary}`,
          paddingBottom: '3px',
        }}>
          <span className="blink-dot" style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: config.colors.primary,
            marginRight: '6px',
            animation: 'blink 1s infinite',
          }}></span>
          知識擷取中...
        </div>
        
        <div className="extraction-list">
          {extractedInfo.map((info, index) => {
            // 為每個項目添加詳細內容
            const detailTexts = [
              "從1,243筆提案數據中提取關鍵洞察",
              "整合8份產業白皮書的市場趨勢",
              "分析526個競品數據與優勢特點",
              "萃取372個行銷策略關鍵成功因素",
              "辨識目標受眾的5大消費傾向",
              "彙整128項消費者行為調查結果",
              "提煉18個品牌差異化指標",
              "統整83個高轉化率廣告文案特徵",
              "匯總57個目標KPI達成策略"
            ];
            const detailText = index < detailTexts.length ? detailTexts[index] : "分析關鍵數據中...";
            
            return (
              <div key={info.id} className="extraction-item" style={{
                fontSize: '0.8rem',
                marginBottom: '10px',
                opacity: info.opacity,
                transform: `translateX(${(1 - info.opacity) * -20}px)`,
                transition: 'all 0.3s',
              }}>
                <div style={{ display: 'flex' }}>
                  <span className="item-icon" style={{
                    display: 'inline-block',
                    marginRight: '6px',
                    color: config.colors.secondary,
                  }}>✓</span>
                  <strong>{info.text}</strong>
                </div>
                <div style={{ 
                  marginLeft: '18px', 
                  fontSize: '0.7rem', 
                  color: '#cccccc',
                  marginTop: '3px',
                  lineHeight: '1.2'
                }}>
                  {detailText}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* RAG 技術標籤 */}
      <div className="rag-tag" style={{
        position: 'absolute',
        top: '45%',
        right: '10%',
        padding: '8px 12px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '5px',
        border: `1px solid ${config.colors.secondary}`,
        color: config.colors.secondary,
        fontSize: '0.9rem',
        fontWeight: 'bold',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
      }}>
        <span className="blink-dot" style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: config.colors.secondary,
          marginRight: '8px',
          animation: 'blink 1s infinite',
        }}></span>
        RAG 知識檢索進行中
      </div>
      
      {/* 處理步驟指示器 */}
      <div className="processing-steps" style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '20px',
        zIndex: 40,
      }}>
        <div className="step" style={{
          padding: '5px 10px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '3px',
          border: `1px solid ${progress > 25 ? config.colors.primary : 'rgba(255, 187, 0, 0.3)'}`,
          color: progress > 25 ? config.colors.primary : 'rgba(255, 187, 0, 0.5)',
          fontSize: '0.8rem',
          opacity: progress > 25 ? 1 : 0.6,
        }}>
          <span style={{ marginRight: '5px' }}>1</span>
          抽取關鍵資訊
        </div>
        
        <div className="step" style={{
          padding: '5px 10px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '3px',
          border: `1px solid ${progress > 30 ? config.colors.secondary : 'rgba(255, 138, 0, 0.3)'}`,
          color: progress > 30 ? config.colors.secondary : 'rgba(255, 138, 0, 0.5)',
          fontSize: '0.8rem',
          opacity: progress > 30 ? 1 : 0.6,
        }}>
          <span style={{ marginRight: '5px' }}>2</span>
          整合客戶數據
        </div>
        
        <div className="step" style={{
          padding: '5px 10px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '3px',
          border: `1px solid ${progress > 35 ? config.colors.blue : 'rgba(38, 198, 218, 0.3)'}`,
          color: progress > 35 ? config.colors.blue : 'rgba(38, 198, 218, 0.5)',
          fontSize: '0.8rem',
          opacity: progress > 35 ? 1 : 0.6,
        }}>
          <span style={{ marginRight: '5px' }}>3</span>
          生成受眾洞察
        </div>
      </div>
    </div>
  );
};

export default DocumentCube;
