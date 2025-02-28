// DocumentCube.js
import React, { useState, useEffect } from "react";
import { config, getColorArray } from "./config";
import "./styles/components/document-cube.css";

export const generateDocumentParticles = () => {
  console.log("生成立方體粒子開始");
  // 粒子數量
  const count = config.documentData.particleCount || 50;
  const particles = [];
  const colors = getColorArray();

  for (let i = 0; i < count; i++) {
    const documentTypes = config.documentData.documentTypes;
    const type = documentTypes[Math.floor(Math.random() * documentTypes.length)];

    particles.push({
      id: `doc-particle-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 100,
      opacity: 0.2 + Math.random() * 0.6,
      size: 4 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      type,
      showType: false,
      speed: 1 + Math.random() * 2,
    });
  }
  console.log("生成的粒子數量:", particles.length);
  return particles;
};

export const updateDocumentParticles = (particles, progress) => {
  // 返回更新後的粒子，但不會渲染具體的粒子
  return particles;
};

const DocumentCube = ({ showCube, documentParticles, progress, cubeRotation }) => {
  const [extractedItems, setExtractedItems] = useState([]);
  const maxItems = 5;
  const displayInterval = 400; // 加快顯示速度，從800ms改為400ms

  useEffect(() => {
    if (!showCube) {
      setExtractedItems([]);
      return;
    }

    const items = [
      {
        type: "提案",
        description: "過去24個提案案例用於數據庫市場研究，幫助可應用於各大業務需求域",
      },
      {
        type: "結案",
        description: "彙整超過34個產業行業的詳細數據，提煉15個關鍵指標與數，強化未來行銷規劃",
      },
      {
        type: "白皮書",
        description: "分析26家領先品牌策略與成功因素，納入12項成功方案範本，發掘致勝關鍵",
      },
      {
        type: "產業趨勢",
        description: "累積37篇行銀專題調研成功經驗，建立完整評估模型，提高92%專案ROI達成率",
      },
      {
        type: "消費者數據",
        description: "整理出超過905個消費趨勢，23種跨產業流程最佳化模型，提高轉換效率",
      },
      {
        type: "市場調查",
        description: "彙整128個消費者深度訪談結果，提煉關鍵評價與潛在需求策略",
      },
      {
        type: "競爭分析",
        description: "提供18個品牌差異化指南，定義3個主要競爭群組，助力品牌定位",
      },
    ];

    const timer = setTimeout(() => {
      const displayCount = Math.min(Math.floor((progress - 30) / 2), maxItems);
      const shuffled = [...items].sort(() => 0.5 - Math.random());
      setExtractedItems(shuffled.slice(0, displayCount));
    }, 800);

    return () => clearTimeout(timer);
  }, [showCube, progress]);

  useEffect(() => {
    if (!showCube || progress < 30) return;

    // 如果已經有項目且進度增加，添加新項目
    const items = [
      {
        type: "提案",
        description: "過去24個提案案例用於數據庫市場研究，幫助可應用於各大業務需求域",
      },
      {
        type: "結案",
        description: "彙整超過34個產業行業的詳細數據，提煉15個關鍵指標與數，強化未來行銷規劃",
      },
      {
        type: "白皮書",
        description: "分析26家領先品牌策略與成功因素，納入12項成功方案範本，發掘致勝關鍵",
      },
      {
        type: "產業趨勢",
        description: "累積37篇行銀專題調研成功經驗，建立完整評估模型，提高92%專案ROI達成率",
      },
      {
        type: "消費者數據",
        description: "整理出超過905個消費趨勢，23種跨產業流程最佳化模型，提高轉換效率",
      },
      {
        type: "市場調查",
        description: "彙整128個消費者深度訪談結果，提煉關鍵評價與潛在需求策略",
      },
      {
        type: "競爭分析",
        description: "提供18個品牌差異化指南，定義3個主要競爭群組，助力品牌定位",
      },
    ];

    const currentCount = extractedItems.length;
    const targetCount = Math.min(Math.floor((progress - 30) / 2), maxItems);

    if (targetCount > currentCount && currentCount < items.length) {
      const timer = setInterval(() => {
        setExtractedItems((prev) => {
          if (prev.length >= targetCount || prev.length >= items.length) {
            clearInterval(timer);
            return prev;
          }
          const shuffled = [...items].sort(() => 0.5 - Math.random());
          const newItem = shuffled.find(
            (item) => !prev.some((p) => p.type === item.type)
          );
          if (!newItem) return prev;
          return [...prev, newItem];
        });
      }, displayInterval);

      return () => clearInterval(timer);
    }
  }, [showCube, progress, extractedItems.length]);

  if (!showCube) return null;

  // 生成文檔粒子
  console.log("生成文檔粒子:", documentParticles.length);

  return (
    <div className="cube-container">
      <div
        className="document-extraction-container"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "90%",
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 50,
        }}
      >
        {/* 左側：知識截取面板 */}
        <div
          className="extraction-panel"
          style={{
            width: "45%",
            maxHeight: "60vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            border: "1px solid #ffbb00",
            borderRadius: "10px",
            padding: "15px",
            color: "white",
            boxShadow: "0 0 15px rgba(255, 187, 0, 0.3)",
            overflow: "hidden",
            marginRight: "20px"
          }}
        >
          <h3
            style={{
              color: "#ffbb00",
              marginBottom: "15px",
              borderBottom: "1px solid rgba(255, 187, 0, 0.3)",
              paddingBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#ffbb00",
                marginRight: "8px",
              }}
            ></span>
            知識擷取中...
          </h3>
          {extractedItems.map((item, i) => (
            <div
              key={`extract-${i}`}
              style={{
                margin: "10px 0",
                padding: "8px",
                borderLeft: "2px solid #ffbb00",
                animation: "fadeIn 0.3s ease-in",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <span
                  style={{
                    color: "#ffbb00",
                    marginRight: "10px",
                    fontSize: "1rem",
                  }}
                >
                  ✓
                </span>
                <span
                  style={{
                    fontWeight: "bold",
                    color: "#ffbb00",
                  }}
                >
                  {item.type}
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  paddingLeft: "25px",
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                {item.description}
              </div>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "15px",
              borderTop: "1px solid rgba(255, 187, 0, 0.3)",
              paddingTop: "15px",
            }}
          >
            <div
              className="step-item"
              style={{
                border: "1px solid #ffbb00",
                borderRadius: "5px",
                padding: "5px 10px",
                fontSize: "0.8rem",
                backgroundColor: "rgba(255, 187, 0, 0.2)",
              }}
            >
              1. 抽取關鍵數據
            </div>
            <div
              className="step-item"
              style={{
                border: "1px solid #ffbb00",
                borderRadius: "5px",
                padding: "5px 10px",
                fontSize: "0.8rem",
                backgroundColor: "rgba(255, 187, 0, 0.1)",
              }}
            >
              2. 整合所有相關資訊
            </div>
            <div
              className="step-item"
              style={{
                border: "1px solid #ffbb00",
                borderRadius: "5px",
                padding: "5px 10px",
                fontSize: "0.8rem",
                backgroundColor: "rgba(255, 187, 0, 0.1)",
              }}
            >
              3. 生成受眾策略
            </div>
          </div>
        </div>

        {/* 右側：RAG處理與視覺效果 */}
        <div
          className="rag-visual"
          style={{
            width: "45%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* RAG 處理指示器 */}
          <div
            className="rag-processor"
            style={{
              backgroundColor: "rgba(255, 85, 0, 0.1)",
              border: "1px solid #ff5500",
              borderRadius: "8px",
              padding: "10px 15px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 15px rgba(255, 85, 0, 0.3)",
            }}
          >
            <div
              className="processing-indicator"
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#ff5500",
                marginRight: "10px",
                animation: "pulsate 1.5s infinite",
              }}
            ></div>
            <span style={{ color: "#ff8a00", fontWeight: "bold" }}>
              RAG 知識檢索處理行中
            </span>
          </div>

          {/* 產業行成效 指示器 */}
          <div
            className="industry-indicator"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              border: "1px solid #ffbb00",
              borderRadius: "5px",
              padding: "8px 15px",
              marginTop: "15px",
              fontWeight: "bold",
              color: "#ffbb00",
              boxShadow: "0 0 10px rgba(255, 187, 0, 0.3)",
            }}
          >
            產業行成效
          </div>

          {/* 3D旋轉立方體視覺效果位置 */}
          <div 
            style={{
              position: "relative",
              width: "100%",
              height: "200px",
              marginTop: "20px",
              perspective: "1000px",
            }}
          >
            {/* 立方體視覺效果的容器 - 只有位置，不會實際渲染立方體 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCube;