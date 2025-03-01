// AIAudienceEngine.js
import React, { useState, useEffect, useRef } from "react";
import "./styles/main.css";
import { config, getAnimationParams, calculateProgressFromStage } from "./config";
import ConsumerDatabase, {
  generateSphereParticles,
  updateSphereParticles,
} from "./ConsumerDatabase";
import { config } from "./config";
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

// 将AIAudienceEngine组件作为默认导出
const App = () => {
  // 直接返回AIAudienceEngine组件
  return <AIAudienceEngine />;
};

export default App;

const AIAudienceEngine = () => {
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
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState(0);

  const animationRef = useRef(null);
  const intervalRef = useRef(null);
  const rotationIntervalRef = useRef(null);

  useEffect(() => {
    setAudienceParticles([]);
    setDocumentParticles([]);
    setClientDataParticles([]);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (rotationIntervalRef.current)
        clearInterval(rotationIntervalRef.current);
    };
  }, []);

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (rotationIntervalRef.current) clearInterval(rotationIntervalRef.current);

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
    setCurrentTimelineIndex(0);
    setAnimationStates({
      sphereComplete: false,
      cubeComplete: false,
      dataFusionComplete: false,
      matchingComplete: false,
      reportComplete: false
    });
  };

  const togglePause = () => setIsPaused(!isPaused);

  useEffect(() => {
    if (isPaused) return;
    rotationIntervalRef.current = setInterval(() => {
      if (showSphere) setSphereRotation((prev) => (prev + 0.1) % 360);
      if (showCube) setCubeRotation((prev) => (prev + 0.2) % 360);
    }, 150);
    return () => {
      if (rotationIntervalRef.current)
        clearInterval(rotationIntervalRef.current);
    };
  }, [isPaused, showSphere, showCube]);

  // 動畫完成狀態追蹤
  const [animationStates, setAnimationStates] = useState({
    sphereComplete: false,
    cubeComplete: false,
    dataFusionComplete: false,
    matchingComplete: false,
    reportComplete: false
  });

  // 檢查動畫完成
  const checkAnimationComplete = (animationType, value = true) => {
    setAnimationStates(prev => {
      const newStates = {...prev, [animationType]: value};
      console.log(`動畫狀態更新: ${animationType} = ${value}`, newStates);
      return newStates;
    });
  };

  // 監聽動畫完成事件
  useEffect(() => {
    const handleSphereComplete = () => {
      // 檢查是否已完成，避免重複觸發
      if (!animationStates.sphereComplete) {
        checkAnimationComplete('sphereComplete', true);
        console.log("球體動畫完成事件觸發");
        // 當球體動畫完成，直接跳到第一階段
        setStage(1);
        setProgress(calculateProgressFromStage(2, config.timeline.length - 1));
        // 不需要調用 advanceTimeline()，因為我們已經手動設置了階段和進度
      }
    };

    const handleCubeComplete = () => {
      if (!animationStates.cubeComplete) {
        checkAnimationComplete('cubeComplete', true);
        console.log("立方體動畫完成事件觸發");
        // 當立方體動畫完成，更新進度並移動到下一階段
        advanceTimeline();
      }
    };

    const handleDataFusionComplete = () => {
      if (!animationStates.dataFusionComplete) {
        checkAnimationComplete('dataFusionComplete', true);
        console.log("數據融合動畫完成事件觸發");
        advanceTimeline();
      }
    };

    const handleMatchingComplete = () => {
      if (!animationStates.matchingComplete) {
        checkAnimationComplete('matchingComplete', true);
        console.log("匹配動畫完成事件觸發");
        advanceTimeline();
      }
    };

    const handleReportComplete = () => {
      if (!animationStates.reportComplete) {
        checkAnimationComplete('reportComplete', true);
        console.log("報告動畫完成事件觸發");
        advanceTimeline();
      }
    };

    window.addEventListener('sphereAnimationComplete', handleSphereComplete);
    window.addEventListener('cubeAnimationComplete', handleCubeComplete);
    window.addEventListener('dataFusionComplete', handleDataFusionComplete);
    window.addEventListener('matchingComplete', handleMatchingComplete);
    window.addEventListener('reportComplete', handleReportComplete);

    return () => {
      window.removeEventListener('sphereAnimationComplete', handleSphereComplete);
      window.removeEventListener('cubeAnimationComplete', handleCubeComplete);
      window.removeEventListener('dataFusionComplete', handleDataFusionComplete);
      window.removeEventListener('matchingComplete', handleMatchingComplete);
      window.removeEventListener('reportComplete', handleReportComplete);
    };
  }, [animationStates]);

  // 推進時間線到下一個階段
  const advanceTimeline = () => {
    if (isPaused) return;

    // 確保不會超出時間線範圍
    if (currentTimelineIndex >= config.timeline.length - 1) {
      return;
    }

    const nextIndex = currentTimelineIndex + 1;
    setCurrentTimelineIndex(nextIndex);

    // 根據當前階段更新進度條
    setProgress(calculateProgressFromStage(nextIndex, config.timeline.length - 1));

    // 執行相應的動畫階段
    executeTimelineAction(config.timeline[nextIndex].action);
  };

  // 執行時間線動作
  const executeTimelineAction = (action) => {
    console.log(`執行動作: ${action}`);

    switch (action) {
      case "startSphere":
        const newParticles = generateSphereParticles();
        setAudienceParticles(newParticles);
        setShowSphere(true);
        setShowCube(false);
        setShowDataFusion(false);
        setShowMatching(false);
        setShowReport(false);
        setTechLabel(config.techLabels[0]);
        setStageDescription(config.stageDescriptions[0]);
        checkAnimationComplete('sphereComplete', false); // 重置動畫完成狀態
        console.log("啟動球體階段，更新後粒子數:", newParticles.length);
        break;
      case "showSphereTraits":
        // 強調一些粒子以顯示特性
        setAudienceParticles(prev => 
          prev.map(p => ({
            ...p,
            highlighted: Math.random() < 0.3, // 隨機高亮約30%的粒子
            opacity: Math.random() < 0.3 ? 0.9 : 0.5 // 高亮粒子更亮
          }))
        );
        console.log("顯示球體特性");
        break;
      case "startStage1":
        setStage(1);
        break;
      case "startCube":
        if (!animationStates.sphereComplete) {
          console.log("等待球體動畫完成...");
          return;
        }
        const cubeParticles = generateDocumentParticles();
        console.log("生成文檔粒子:", cubeParticles.length);
        setDocumentParticles(cubeParticles);
        setShowSphere(false);
        setShowCube(true);
        setShowDataFusion(false);
        setShowMatching(false);
        setShowReport(false);
        setTechLabel(config.techLabels[1]);
        setStageDescription(config.stageDescriptions[1]);
        setAudienceParticles([]);
        checkAnimationComplete('cubeComplete', false); // 重置立方體動畫完成狀態
        break;
      case "showCubeDocuments":
        setDocumentParticles((prev) =>
          prev.map((p) => ({
            ...p,
            opacity: 0.6 + Math.random() * 0.4,
            showType: Math.random() < 0.25,
          }))
        );
        break;
      case "startStage2":
        setStage(2);
        break;
      case "startDataFusion":
        if (!animationStates.cubeComplete) {
          console.log("等待立方體動畫完成...");
          return;
        }
        setClientDataParticles(generateClientDataParticles());
        setShowSphere(false);
        setShowCube(false);
        setShowDataFusion(true);
        setShowMatching(false);
        setShowReport(false);
        setTechLabel(config.techLabels[2]);
        setStageDescription(config.stageDescriptions[2]);
        checkAnimationComplete('dataFusionComplete', false); // 重置數據融合動畫完成狀態
        break;
      case "showDataMerging":
        setClientDataParticles((prev) =>
          prev.map((p) => ({
            ...p,
            isMerging: Math.random() < 0.6,
          }))
        );
        break;
      case "startStage3":
        setStage(3);
        break;
      case "startMatching":
        if (!animationStates.dataFusionComplete) {
          console.log("等待數據融合動畫完成...");
          return;
        }
        setShowSphere(false);
        setShowCube(false);
        setShowDataFusion(false);
        setShowMatching(true);
        setShowReport(false);
        setTechLabel(config.techLabels[3]);
        setStageDescription(config.stageDescriptions[3]);
        setAudienceParticles((prev) =>
          prev.map((p) => ({
            ...p,
            matched: Math.random() < 0.25,
            highlighted: false,
          }))
        );
        checkAnimationComplete('matchingComplete', false); // 重置匹配動畫完成狀態
        break;
      case "showMatchedAudience":
        setAudienceParticles((prev) =>
          prev.map((p) => ({
            ...p,
            highlighted: p.matched,
            opacity: p.matched ? 0.9 : 0.3,
          }))
        );
        break;
      case "startStage4":
        setStage(4);
        break;
      case "startReport":
        if (!animationStates.matchingComplete) {
          console.log("等待匹配動畫完成...");
          return;
        }
        setShowSphere(false);
        setShowCube(false);
        setShowDataFusion(false);
        setShowMatching(false);
        setShowReport(true);
        setTechLabel(config.techLabels[4]);
        setStageDescription(config.stageDescriptions[4]);
        checkAnimationComplete('reportComplete', false); // 重置報告動畫完成狀態
        break;
      case "showFullReport":
        // 報告顯示完成處理
        break;
      case "complete":
        setTimeout(() => handleReset(), getAnimationParams().resetDelay);
        break;
      default:
        break;
    }
  };

  // 初始化時啟動第一個階段
  useEffect(() => {
    if (!isPaused && currentTimelineIndex === 0) {
      executeTimelineAction(config.timeline[0].action);
      setCurrentTimelineIndex(0);
    }
  }, [isPaused]);

  // 更新粒子和動畫狀態
  useEffect(() => {
    if (isPaused) return;

    const { particleUpdateInterval } = getAnimationParams();

    intervalRef.current = setInterval(() => {
      if (showSphere && audienceParticles.length > 0) {
        setAudienceParticles((prev) =>
          updateSphereParticles(prev, sphereRotation, showMatching)
        );
      }
      if (showCube && documentParticles.length > 0) {
        setDocumentParticles((prev) =>
          updateDocumentParticles(prev, currentTimelineIndex / config.timeline.length * 100)
        );
      }
      if (showDataFusion && clientDataParticles.length > 0) {
        setClientDataParticles((prev) => updateClientDataParticles(prev));
      }

      // 確保消費者數據顯示完整
      if (showSphere) {
        const maxCount = config.audienceData.maxAudienceCount;
        // 基於動畫進度來設置數據計數
        const animationProgress = currentTimelineIndex / (config.timeline.length - 1) * 100;
        setDataCount(Math.min(maxCount, Math.floor((animationProgress / 100) * maxCount)));
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
    currentTimelineIndex
  ]);

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

  // 將組件定義在父組件外部以避免每次重新渲染
  const MainTitle = () => {
    return <h1 className="main-title">AI Audience 智能受眾引擎</h1>;
  };

  const StageIndicator = ({ currentStage }) => {
    if (!currentStage) return null;
    return <div className="stage-indicator">{currentStage}</div>;
  };

  const TechLabel = ({ label }) => {
    if (!label || typeof label !== 'string') return null;
    return (
      <div className="tech-label" style={{ top: "15%", bottom: "auto", right: "3%" }}>
        {label}
      </div>
    );
  };

  const StageDescription = ({ description }) => {
    if (!description || typeof description !== 'string') return null;
    return (
      <div className="stage-description-container">
        <div className="stage-description-content">
          {description}
        </div>
      </div>
    );
  };

  // 顯示目前執行的階段名稱，將其以更友好的方式展示
  const getCurrentStageAction = () => {
    if (currentTimelineIndex < config.timeline.length) {
      const action = config.timeline[currentTimelineIndex].action;
      
      // 將階段名轉換為更友好的中文名稱
      const stageNameMap = {
        "startSphere": "消費者數據收集",
        "startStage1": "第一階段",
        "startCube": "建立知識庫",
        "showCubeDocuments": "文檔分析",
        "startStage2": "第二階段",
        "startDataFusion": "數據融合",
        "showDataMerging": "數據合併",
        "startStage3": "第三階段",
        "startMatching": "精準匹配",
        "showMatchedAudience": "受眾匹配",
        "startStage4": "第四階段",
        "startReport": "產生報告",
        "showFullReport": "完整報告",
        "complete": "完成"
      };
      
      return stageNameMap[action] || action;
    }
    return "完成";
  };

  return (
    <div className="engine-container">
      <div className="engine-background" />
      {generateColorParticles()}
      <div className="flow-lines">
        <svg width="100%" height="100%" viewBox="0 0 500 300" preserveAspectRatio="none">
          <path d="M0,150 C100,100 200,200 300,100 S400,150 500,120" stroke={config.colors.primary} strokeWidth="1" fill="none" className="wave" />
          <path d="M0,100 C150,180 250,80 350,150 S450,120 500,150" stroke={config.colors.secondary} strokeWidth="1" fill="none" className="wave" style={{ animationDelay: "0.5s" }} />
          <path d="M0,200 C100,150 200,220 300,150 S450,180 500,170" stroke={config.colors.blue} strokeWidth="1" fill="none" className="wave" style={{ animationDelay: "1s" }} />
        </svg>
      </div>
      <div className="app-layout">
        {/* 上區塊：標題與進度條 */}
        <div className="top-section">
          <div className="header-container">
            <div className="title-stage-row">
              <MainTitle />
              <StageIndicator currentStage={config.stages[stage]} />
              {/* 改進的動畫階段指示器 */}
              <div className="animation-stage-indicator" style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px 12px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                border: "1px solid rgba(255, 187, 0, 0.4)",
                borderRadius: "4px",
                fontSize: "0.9rem",
                color: "#ffdd77",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)"
              }}>
                目前階段: <span style={{ 
                  marginLeft: "5px", 
                  fontWeight: "bold",
                  color: "#ffbb00"
                }}>{getCurrentStageAction()}</span>
              </div>
            </div>
            <div className="progress-container">
              <div className="progress-bar-container" style={{
                height: "8px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                border: "1px solid rgba(255, 187, 0, 0.3)",
                borderRadius: "4px",
                overflow: "hidden"
              }}>
                <div className="progress-bar" style={{ 
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #ffbb00, #ff8a00)",
                  boxShadow: "0 0 8px rgba(255, 187, 0, 0.7)",
                  height: "100%"
                }} />
                {/* 進度指示標記 */}
                <div style={{
                  position: "absolute",
                  left: `${progress}%`,
                  top: "0",
                  width: "3px",
                  height: "8px",
                  backgroundColor: "#ffffff",
                  transform: "translateX(-50%)",
                  borderRadius: "1px",
                  boxShadow: "0 0 5px rgba(255, 255, 255, 0.8)",
                  transition: "left 0.3s ease-out"
                }}></div>
              </div>
              {/* 進度百分比指示 */}
              <div style={{
                textAlign: "right",
                fontSize: "0.8rem",
                color: "#ffdd77",
                marginTop: "4px"
              }}>
                完成進度: {Math.floor(progress)}%
              </div>
            </div>
          </div>
        </div>

        {/* 中區塊：視覺化內容 - 分為左中右三區域 */}
        <div className="middle-section">
          <div className="visualization-container animation-boundary">
            {/* 左區域 - 資料融合和知識擷取 */}
            <div className="left-zone">
              <div className="zone-content">
                <div className="data-fusion-layer" style={{ zIndex: showDataFusion ? 100 : 10 }}>
                  <ClientDataFusion showDataFusion={showDataFusion} clientDataParticles={clientDataParticles} progress={progress} />
                </div>
                {/* 左側區域不再顯示知識擷取面板 */}
              </div>
            </div>

            {/* 中間區域 - 球體和立方體 */}
            <div className="center-zone">
              {/* 中央上方的RAG標籤 */}
              {showCube && progress > 25 && (
                <div style={{ 
                  position: "absolute", 
                  top: "10%", 
                  left: "50%", 
                  transform: "translateX(-50%)",
                  zIndex: 150,
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  border: "1px solid #ffbb00",
                  borderRadius: "4px",
                  padding: "8px 15px",
                  color: "#ffbb00",
                  fontWeight: "bold",
                  textAlign: "center"
                }}>
                  RAG - Retrieval-Augmented Generation
                </div>
              )}
              <div className="sphere-layer" style={{ zIndex: showSphere ? 100 : 10 }}>
                <ConsumerDatabase progress={progress} showSphere={showSphere} audienceParticles={audienceParticles} dataCount={dataCount} />
              </div>
              <div className="cube-layer" style={{ zIndex: showCube ? 100 : 10 }}>
                <DocumentCube showCube={showCube} documentParticles={documentParticles} progress={progress} cubeRotation={cubeRotation} />
              </div>
            </div>

            {/* 右區域 - 已清空 */}
            <div className="right-zone">
              <div className="zone-content">
                {/* 右側區域元件已移除 */}
              </div>
            </div>

            {/* 報告層 - 當啟用時覆蓋在中間區域上 */}
            <div className="report-layer" style={{ 
              position: "absolute", 
              inset: 0, 
              zIndex: showReport ? 150 : 0,
              display: showReport ? "flex" : "none",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <AnalysisReport showReport={showReport} progress={progress} />
            </div>

            {/* 技術標籤 - 顯示在右上角 */}
            <TechLabel label={techLabel} />
          </div>
        </div>

        {/* 下區塊：描述文字與控制按鈕 */}
        <div className="bottom-section">
          <div className="bottom-content">
            <StageDescription description={stageDescription} />
            <div className="controls-container">
              <button onClick={togglePause} className={`control-button ${isPaused ? "pause-button" : "play-button"}`}>
                {isPaused ? "繼續" : "暫停"}
              </button>
              <button onClick={handleReset} className="control-button reset-button">
                重新播放
              </button>
              {/* 新增：手動推進按鈕 */}
              <button 
                onClick={() => !isPaused && advanceTimeline()} 
                className="control-button advance-button"
                disabled={isPaused || currentTimelineIndex >= config.timeline.length - 1}
              >
                推進到下一階段
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};