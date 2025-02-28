// AIAudienceEngine.js
import React, { useState, useEffect, useRef } from "react";
import "./styles/main.css";
import { config, getAnimationParams } from "./config";
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

  // 計算消費者資料顯示進度
  const [consumerDataProgress, setConsumerDataProgress] = useState(0);
  
  // 動畫完成檢查
  const checkAnimationComplete = (animationType, value = true) => {
    setAnimationStates(prev => ({...prev, [animationType]: value}));
  };

  // 監聽動畫完成事件
  useEffect(() => {
    const handleSphereComplete = () => {
      checkAnimationComplete('sphereComplete', true);
      console.log("球體動畫完成事件觸發");
    };
    
    const handleCubeComplete = () => {
      checkAnimationComplete('cubeComplete', true);
      console.log("立方體動畫完成事件觸發");
    };
    
    window.addEventListener('sphereAnimationComplete', handleSphereComplete);
    window.addEventListener('cubeAnimationComplete', handleCubeComplete);
    
    return () => {
      window.removeEventListener('sphereAnimationComplete', handleSphereComplete);
      window.removeEventListener('cubeAnimationComplete', handleCubeComplete);
    };
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timeline = config.timeline;
    const { particleUpdateInterval, progressIncrement } = getAnimationParams();
    
    // 不再使用進度條監控，完全依賴動畫完成事件
    
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + progressIncrement;
        
        // 使用變數記錄是否需要暫停進度
        let shouldHoldProgress = false;
        
        timeline.forEach((point) => {
          if (
            Math.floor(prev) < point.milestone &&
            Math.floor(newProgress) >= point.milestone
          ) {
            // 確保前一階段動畫完成才轉到下一階段
            let shouldProceed = true;
            
            // 嚴格檢查各階段動畫是否完成
            if (point.action === "startCube" && !animationStates.sphereComplete) {
              shouldProceed = false;
              shouldHoldProgress = true;
              console.log("等待球體動畫完成...到3000000");
            } else if (point.action === "startDataFusion" && !animationStates.cubeComplete) {
              shouldProceed = false;
              shouldHoldProgress = true;
              console.log("等待立方體動畫完成...");
            } else if (point.action === "startMatching" && !animationStates.dataFusionComplete) {
              shouldProceed = false;
              shouldHoldProgress = true;
              console.log("等待數據融合動畫完成...");
            } else if (point.action === "startReport" && !animationStates.matchingComplete) {
              shouldProceed = false;
              shouldHoldProgress = true;
              console.log("等待匹配動畫完成...");
            }
            
            if (!shouldProceed) return prev; // 維持當前進度直到動畫完成
            
            switch (point.action) {
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
                setConsumerDataProgress(0); // 重置消費者資料進度
                checkAnimationComplete('sphereComplete', false); // 重置動畫完成狀態
                console.log("啟動球體階段，更新後粒子數:", newParticles.length);
                break;
              case "showSphereTraits":
                setAudienceParticles((prev) =>
                  prev.map((p) => ({
                    ...p,
                    opacity: 0.6 + Math.random() * 0.4,
                    showTrait: Math.random() < 0.2,
                  }))
                );
                // 當特徵顯示完成後，標記球體動畫完成
                setTimeout(() => {
                  checkAnimationComplete('sphereComplete');
                }, 1500);
                break;
              case "startStage1":
                setStage(1);
                break;
              case "startCube":
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
                // 當文檔顯示完成後，標記立方體動畫完成
                setTimeout(() => {
                  checkAnimationComplete('cubeComplete');
                }, 2000);
                break;
              case "startStage2":
                setStage(2);
                break;
              case "startDataFusion":
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
                // 當數據融合動畫完成
                setTimeout(() => {
                  checkAnimationComplete('dataFusionComplete');
                }, 2000);
                break;
              case "startStage3":
                setStage(3);
                break;
              case "startMatching":
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
                // 當受眾匹配動畫完成
                setTimeout(() => {
                  checkAnimationComplete('matchingComplete');
                }, 2000);
                break;
              case "startStage4":
                setStage(4);
                break;
              case "startReport":
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
                // 報告顯示完成
                setTimeout(() => {
                  checkAnimationComplete('reportComplete');
                }, 1500);
                break;
              case "complete":
                setTimeout(() => handleReset(), getAnimationParams().resetDelay);
                break;
              default:
                break;
            }
          }
        });

        // 確保消費者數據顯示完整
        if (showSphere) {
          const maxCount = config.audienceData.maxAudienceCount;
          // 基於動畫進度而不是時間軸進度來設置數據計數
          setDataCount(Math.min(maxCount, Math.floor((consumerDataProgress / 100) * maxCount)));
        }
        
        // 如果時間線被動畫完成狀態阻擋，暫停進度增長
        if (shouldHoldProgress) {
          return prev; // 保持當前進度不變
        }

        if (newProgress >= 100) return 99.9;
        return newProgress;
      });

      if (showSphere && audienceParticles.length > 0) {
        setAudienceParticles((prev) =>
          updateSphereParticles(prev, sphereRotation, showMatching)
        );
      }
      if (showCube && documentParticles.length > 0) {
        setDocumentParticles((prev) =>
          updateDocumentParticles(prev, progress)
        );
      }
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
    dataCount,
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
            </div>
            <div className="progress-container">
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};