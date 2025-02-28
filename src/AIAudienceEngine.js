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

  useEffect(() => {
    if (isPaused) return;
    const timeline = config.timeline;
    const { particleUpdateInterval, progressIncrement } = getAnimationParams();

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + progressIncrement;
        timeline.forEach((point) => {
          if (
            Math.floor(prev) < point.milestone &&
            Math.floor(newProgress) >= point.milestone
          ) {
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
                setClientDataParticles(generateClientDataParticles());
                setShowSphere(false);
                setShowCube(false);
                setShowDataFusion(true);
                setShowMatching(false);
                setShowReport(false);
                setTechLabel(config.techLabels[2]);
                setStageDescription(config.stageDescriptions[2]);
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
                setShowSphere(false);
                setShowCube(false);
                setShowDataFusion(false);
                setShowMatching(false);
                setShowReport(true);
                setTechLabel(config.techLabels[4]);
                setStageDescription(config.stageDescriptions[4]);
                break;
              case "showFullReport":
                break;
              case "complete":
                setTimeout(() => handleReset(), getAnimationParams().resetDelay);
                break;
              default:
                break;
            }
          }
        });

        if (newProgress < 20) {
          const maxCount = config.audienceData.maxAudienceCount;
          setDataCount(Math.min(maxCount, Math.floor((newProgress / 15) * maxCount)));
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
      <div className="stage-description-bottom">{description}</div>
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
      <div className="engine-content">
        <div className="header-container">
          <h1 className="main-title">AI Audience 智能受眾引擎</h1>
          <div className="progress-container">
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <div className="stage-indicator">{config.stages[stage]}</div>
          </div>
        </div>
        <div className="visualization-container animation-boundary">
          <div className="left-zone">
            <ClientDataFusion showDataFusion={showDataFusion} clientDataParticles={clientDataParticles} progress={progress} />
          </div>
          <div className="center-zone">
            <div className="sphere-layer" style={{ position: "absolute", inset: 0, zIndex: showSphere ? 50 : 10, height: "100%" }}>
              <ConsumerDatabase progress={progress} showSphere={showSphere} audienceParticles={audienceParticles} dataCount={dataCount} />
            </div>
            <div className="cube-layer" style={{ position: "absolute", inset: 0, zIndex: showCube ? 25 : 10, height: "100%" }}>
              <DocumentCube showCube={showCube} documentParticles={documentParticles} progress={progress} cubeRotation={cubeRotation} />
            </div>
          </div>
          <div className="right-zone">
            <ProductMatching showMatching={showMatching} progress={progress} />
          </div>
          <AnalysisReport showReport={showReport} progress={progress} />
          <TechLabel label={techLabel} />
        </div>
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
  );
};