// AIAudienceEngine.js - 主入口組件
// 整合所有模組並控制整體流程

import React, { useState, useEffect, useRef } from "react";
import "./styles/main.css";

// 引入配置文件
import { config, getAnimationParams } from "./config";

// 引入各模組組件及函數
import ConsumerDatabase, {
  generateSphereParticles,
  updateSphereParticles,
} from "./ConsumerDatabase";

import DocumentCube, {
  generateDocumentParticles,
  updateDocumentParticles,
} from "./DocumentCube";

import ClientDataFusion, {
  generateClientDataParticles,
  updateClientDataParticles,
} from "./ClientDataFusion";

import ProductMatching from "./ProductMatching";
import AnalysisReport from "./AnalysisReport";

// App入口
export default function App() {
  return (
    <div className="app-container">
      <AIAudienceEngine />
    </div>
  );
}

// 主組件
const AIAudienceEngine = () => {
  // 動畫和狀態
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [audienceParticles, setAudienceParticles] = useState([]);
  const [documentParticles, setDocumentParticles] = useState([]);
  const [clientDataParticles, setClientDataParticles] = useState([]);
  const [selectedParticles, setSelectedParticles] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [showSphere, setShowSphere] = useState(false);
  const [showCube, setShowCube] = useState(false);
  const [showDataFusion, setShowDataFusion] = useState(false);
  const [showMatching, setShowMatching] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [sphereRotation, setSphereRotation] = useState(0);
  const [cubeRotation, setCubeRotation] = useState(0);
  const [dataCount, setDataCount] = useState(0);
  const [techLabel, setTechLabel] = useState("");
  const [stageDescription, setStageDescription] = useState("");

  // 引用計時器，用於清理
  const animationRef = useRef(null);
  const intervalRef = useRef(null);
  const rotationIntervalRef = useRef(null);

  // 初始化
  useEffect(() => {
    // 初始化空的粒子陣列
    setAudienceParticles([]);
    setDocumentParticles([]);
    setClientDataParticles([]);

    return () => {
      // 清理所有動畫定時器
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (rotationIntervalRef.current)
        clearInterval(rotationIntervalRef.current);
    };
  }, []);

  // 重置函數
  const handleReset = () => {
    // 清理所有動畫定時器
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (rotationIntervalRef.current) clearInterval(rotationIntervalRef.current);

    // 重置所有狀態
    setProgress(0);
    setStage(0);
    setSphereRotation(0);
    setCubeRotation(0);
    setAudienceParticles([]);
    setDocumentParticles([]);
    setClientDataParticles([]);
    setSelectedParticles([]);
    setShowSphere(false);
    setShowCube(false);
    setShowDataFusion(false);
    setShowMatching(false);
    setShowReport(false);
    setDataCount(0);
    setTechLabel("");
    setStageDescription("");
    setIsPaused(false);
  };

  // 暫停/繼續
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // 分離旋轉更新邏輯，使用較低頻率
  useEffect(() => {
    if (isPaused) return;

    rotationIntervalRef.current = setInterval(() => {
      if (showSphere) {
        setSphereRotation((prev) => (prev + 0.1) % 360);
      }
      if (showCube) {
        setCubeRotation((prev) => (prev + 0.2) % 360);
      }
    }, 150); // 更慢的旋轉更新頻率

    return () => {
      if (rotationIntervalRef.current)
        clearInterval(rotationIntervalRef.current);
    };
  }, [isPaused, showSphere, showCube]);

  // 主要動畫控制
  useEffect(() => {
    if (isPaused) return;

    // 使用配置中的時間軸
    const timeline = config.timeline;

    // 獲取經過速度調整的動畫參數
    const { particleUpdateInterval, progressIncrement } = getAnimationParams();

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + progressIncrement;

        // 檢查里程碑
        timeline.forEach((point) => {
          if (
            Math.floor(prev) < point.milestone &&
            Math.floor(newProgress) >= point.milestone
          ) {
            switch (point.action) {
              case "startSphere":
                // 開始生成球體粒子
                setAudienceParticles(generateSphereParticles());
                setShowSphere(true);
                setShowCube(false); // 確保其他階段是關閉的
                setShowDataFusion(false);
                setShowMatching(false);
                setShowReport(false);
                setTechLabel(config.techLabels[0]);
                setStageDescription(config.stageDescriptions[0]);
                break;

              case "showSphereTraits":
                // 顯示輪廓特徵
                setAudienceParticles((prev) =>
                  prev.map((p) => ({
                    ...p,
                    opacity: 0.6 + Math.random() * 0.4,
                    showTrait: Math.random() < 0.2,
                  }))
                );
                break;

              case "startStage1":
                // 完成第一階段
                setStage(1);
                break;

              case "startCube":
                // 開始生成文檔立方體
                const newParticles = generateDocumentParticles();
                console.log("生成文檔粒子:", newParticles.length);
                setDocumentParticles(newParticles);
                setShowSphere(false); // 關閉前一階段
                setShowCube(true);
                setShowDataFusion(false);
                setShowMatching(false);
                setShowReport(false);
                setTechLabel(config.techLabels[1]);
                setStageDescription(config.stageDescriptions[1]);
                break;

              case "showCubeDocuments":
                // 顯示文檔類型
                setDocumentParticles((prev) =>
                  prev.map((p) => ({
                    ...p,
                    opacity: 0.6 + Math.random() * 0.4,
                    showType: Math.random() < 0.25,
                  }))
                );
                break;

              case "startStage2":
                // 完成第二階段
                setStage(2);
                break;

              case "startDataFusion":
                // 開始數據融合
                setClientDataParticles(generateClientDataParticles());
                setShowSphere(false);
                setShowCube(false); // 關閉前一階段
                setShowDataFusion(true);
                setShowMatching(false);
                setShowReport(false);
                setTechLabel(config.techLabels[2]);
                setStageDescription(config.stageDescriptions[2]);
                break;

              case "showDataMerging":
                // 展示數據合併效果
                setClientDataParticles((prev) =>
                  prev.map((p) => ({
                    ...p,
                    isMerging: Math.random() < 0.6,
                  }))
                );
                break;

              case "startStage3":
                // 完成第三階段
                setStage(3);
                break;

              case "startMatching":
                // 開始受眾匹配
                setShowSphere(false);
                setShowCube(false);
                setShowDataFusion(false); // 關閉前一階段
                setShowMatching(true);
                setShowReport(false);
                setTechLabel(config.techLabels[3]);
                setStageDescription(config.stageDescriptions[3]);

                // 標記部分球體粒子為匹配
                setAudienceParticles((prev) =>
                  prev.map((p) => ({
                    ...p,
                    matched: Math.random() < 0.25,
                    highlighted: false,
                  }))
                );
                break;

              case "showMatchedAudience":
                // 高亮匹配的粒子
                setAudienceParticles((prev) =>
                  prev.map((p) => ({
                    ...p,
                    highlighted: p.matched,
                    opacity: p.matched ? 0.9 : 0.3,
                  }))
                );
                break;

              case "startStage4":
                // 完成第四階段
                setStage(4);
                break;

              case "startReport":
                // 開始生成報告
                setShowSphere(false);
                setShowCube(false);
                setShowDataFusion(false);
                setShowMatching(false); // 關閉前一階段
                setShowReport(true);
                setTechLabel(config.techLabels[4]);
                setStageDescription(config.stageDescriptions[4]);
                break;

              case "showFullReport":
                // 展示完整報告
                // 這裡不需要特別處理，報告會在渲染函數中根據進度顯示
                break;

              case "complete":
                // 完成演示 - 短暫暫停後重置
                setTimeout(() => {
                  handleReset();
                }, getAnimationParams().resetDelay);
                break;

              default:
                break;
            }
          }
        });

        // 更新數據計數
        if (newProgress < 20) {
          const maxCount = config.audienceData.maxAudienceCount;
          setDataCount(
            Math.min(maxCount, Math.floor((newProgress / 15) * maxCount))
          );
        }

        // 超過100%後重置
        if (newProgress >= 100) {
          return 99.9;
        }

        return newProgress;
      });

      // 優化：只在需要時才更新粒子
      // 1. 球體粒子更新
      if (showSphere && audienceParticles.length > 0) {
        setAudienceParticles((prev) =>
          updateSphereParticles(prev, sphereRotation, showMatching)
        );
      }

      // 2. 文檔粒子更新 - 只在顯示立方體時更新
      if (showCube && documentParticles.length > 0) {
        setDocumentParticles((prev) =>
          updateDocumentParticles(prev, cubeRotation)
        );
      }

      // 3. 客戶數據粒子更新
      if (showDataFusion && clientDataParticles.length > 0) {
        setClientDataParticles((prev) => updateClientDataParticles(prev));
      }
    }, particleUpdateInterval);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [
    isPaused,
    showSphere,
    showCube,
    showDataFusion,
    showMatching,
    sphereRotation,
    cubeRotation,
    audienceParticles.length,
    documentParticles.length,
    clientDataParticles.length,
  ]);

  // 創建彩色粒子背景效果
  const generateColorParticles = () => {
    const particles = [];
    const colors = [
      config.colors.primary,
      config.colors.secondary,
      config.colors.accent,
      config.colors.blue,
      config.colors.lightBlue,
    ];

    for (let i = 0; i < 30; i++) {
      const size = 2 + Math.random() * 4;
      particles.push(
        <div
          key={`bg-particle-${i}`}
          className="background-particle"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: 0.2 + Math.random() * 0.5,
            filter: `blur(${Math.random() * 2}px)`,
            animation: `wave ${5 + Math.random() * 10}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      );
    }

    return particles;
  };

  // 渲染技術標籤 - 修改為右上角顯示
  const renderTechLabel = () => {
    if (!techLabel) return null;

    return (
      <div
        className="tech-label"
        style={{ top: "15%", bottom: "auto", right: "3%" }}
      >
        {techLabel}
      </div>
    );
  };

  // 渲染階段描述 - 移到底部位置
  const renderStageDescription = () => {
    if (!stageDescription) return null;

    return (
      <div className="stage-description-bottom fade-in">{stageDescription}</div>
    );
  };

  return (
    <div className="engine-container">
      {/* 動態背景 */}
      <div className="engine-background" />

      {/* 彩色粒子 */}
      {generateColorParticles()}

      {/* 流線效果 */}
      <div className="flow-lines">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 500 300"
          preserveAspectRatio="none"
        >
          <path
            d="M0,150 C100,100 200,200 300,100 S400,150 500,120"
            stroke={config.colors.primary}
            strokeWidth="1"
            fill="none"
            className="wave"
          />
          <path
            d="M0,100 C150,180 250,80 350,150 S450,120 500,150"
            stroke={config.colors.secondary}
            strokeWidth="1"
            fill="none"
            className="wave"
            style={{ animationDelay: "0.5s" }}
          />
          <path
            d="M0,200 C100,150 200,220 300,150 S450,180 500,170"
            stroke={config.colors.blue}
            strokeWidth="1"
            fill="none"
            className="wave"
            style={{ animationDelay: "1s" }}
          />
        </svg>
      </div>

      {/* 主內容容器 */}
      <div className="engine-content">
        {/* 頂部標題和進度條 */}
        <div className="header-container">
          <h1 className="main-title">AI Audience 智能受眾引擎</h1>
          <div className="progress-container">
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <div className="stage-indicator">{config.stages[stage]}</div>
          </div>
        </div>

        {/* 主視覺區域 - 添加限制區域的樣式 */}
        <div className="visualization-container animation-boundary">
          <div className="left-zone">
            {/* 客戶數據框 */}
            <ClientDataFusion
              showDataFusion={showDataFusion}
              clientDataParticles={clientDataParticles}
              progress={progress}
            />
          </div>

          <div className="center-zone">
            // 在 AIAudienceEngine.js 中{/* 3D球體粒子 */}
            <div
              className="spherer-layer"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: showSphere ? 30 : 10, // 增加為 30
              }}
            >
              <ConsumerDatabase
                progress={progress}
                showSphere={showSphere}
                audienceParticles={audienceParticles}
                dataCount={dataCount}
              />
            </div>
            {/* 文檔立方體 */}
            <div
              className="cube-layer"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: showCube ? 25 : 10,
              }}
            >
              <DocumentCube
                showCube={showCube}
                documentParticles={documentParticles}
                progress={progress}
                cubeRotation={cubeRotation}
              />
            </div>
          </div>

          <div className="right-zone">
            {/* 產品匹配區域 */}
            <ProductMatching showMatching={showMatching} progress={progress} />
          </div>

          {/* 分析報告 - 覆蓋在中心 */}
          <AnalysisReport showReport={showReport} progress={progress} />

          {/* 技術標籤 */}
          {renderTechLabel()}
        </div>

        {/* 移動階段描述文字到底部 */}
        {renderStageDescription()}

        {/* 底部控制按鈕 */}
        <div className="controls-container">
          <button
            onClick={togglePause}
            className={`control-button ${
              isPaused ? "pause-button" : "play-button"
            }`}
          >
            {isPaused ? "繼續" : "暫停"}
          </button>
          <button onClick={handleReset} className="control-button reset-button">
            重新播放
          </button>
        </div>
      </div>
    </div>
  );
};
