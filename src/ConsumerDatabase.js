
// ConsumerDatabase.js
import React, { useEffect, useState } from 'react';
import './styles/components/consumer-database.css';
import { config } from './config';

export const generateSphereParticles = () => {
  const particles = [];
  const particleCount = 80;
  
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 100 + Math.random() * 50;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const z = Math.random() * 360 - 180;
    
    particles.push({
      id: i,
      x,
      y,
      z,
      size: 2 + Math.random() * 3,
      color: i % 3 === 0 ? '#ffbb00' : i % 3 === 1 ? '#ff8a00' : '#00bcd4',
      opacity: 0.6 + Math.random() * 0.4,
      trait: null,
      highlighted: false,
      matched: false,
      rotation: Math.random() * 360,
    });
  }
  
  return particles;
};

export const updateSphereParticles = (particles, rotation, showMatching = false) => {
  return particles.map(p => {
    // 旋轉球體
    const angle = Math.atan2(p.y, p.x) + (rotation * Math.PI / 180) * 0.01;
    const radius = Math.sqrt(p.x * p.x + p.y * p.y);
    
    // 更新位置
    const newX = Math.cos(angle) * radius;
    const newY = Math.sin(angle) * radius;
    
    // 如果是匹配階段，將匹配的粒子向前移動
    const newZ = p.matched && showMatching 
      ? p.z + (Math.random() * 2 - 1) * 5 
      : p.z + (Math.random() * 2 - 1) * 0.5;
    
    return {
      ...p,
      x: newX,
      y: newY,
      z: newZ > 180 ? -180 : newZ < -180 ? 180 : newZ,
      opacity: p.highlighted ? 0.9 : Math.max(0.4, Math.min(0.8, p.opacity + (Math.random() * 0.2 - 0.1))),
    };
  });
};

function ConsumerDatabase({ progress, showSphere, audienceParticles, dataCount }) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [prevDataCount, setPrevDataCount] = useState(0);
  const [showTickAnimation, setShowTickAnimation] = useState(false);
  
  // 當數據計數變化時添加跳動動畫
  useEffect(() => {
    if (dataCount !== prevDataCount && dataCount > 0) {
      setShowTickAnimation(true);
      const timer = setTimeout(() => setShowTickAnimation(false), 500);
      setPrevDataCount(dataCount);
      return () => clearTimeout(timer);
    }
  }, [dataCount, prevDataCount]);
  
  // 當數據達到最大值時觸發動畫完成事件
  useEffect(() => {
    if (dataCount >= config.audienceData.maxAudienceCount && !animationComplete) {
      setAnimationComplete(true);
      console.log("消費者資料庫動畫計數完成:", dataCount);
      
      // 派發自定義事件通知父組件動畫已完成
      const event = new CustomEvent('sphereAnimationComplete');
      window.dispatchEvent(event);
      
      console.log("發送球體動畫完成事件" + (progress >= 25 ? " - 直接進入第一階段" : ""));
    }
  }, [dataCount, animationComplete, progress]);

  if (!showSphere) return null;

  return (
    <div className="sphere-container">
      <div className="sphere-glow"></div>
      
      {audienceParticles.map((particle) => (
        <div
          key={`audience-particle-${particle.id}`}
          className={`particle ${particle.highlighted ? 'glowing' : ''}`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            transform: `translate3d(${particle.x}px, ${particle.y}px, ${particle.z}px) rotateY(${particle.rotation}deg)`,
            zIndex: Math.floor(particle.z) + 200,
          }}
        ></div>
      ))}
      
      {/* 數據庫計數器 */}
      <div className={`database-counter ${progress < 5 ? 'fade-in' : ''}`}>
        <div className={`counter-value ${showTickAnimation ? 'number-tick' : ''}`}>
          {dataCount.toLocaleString()}
        </div>
        <div className="counter-label">消費者輪廓</div>
      </div>
    </div>
  );
}

export default ConsumerDatabase;
