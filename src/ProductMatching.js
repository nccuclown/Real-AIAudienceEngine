// ProductMatching.js - 產品匹配模組
// 負責展示AI Agent如何進行精準受眾匹配

import React from "react";
import { config } from "./config";

// 產品匹配組件
export const ProductMatching = ({ showMatching, progress }) => {
  if (!showMatching) return null;

  const { productDemand, matchedAudience } = config;

  return (
    <div className="matching-container">
      {/* 產品需求卡片 */}
      <div className="product-card fade-in pulse-card">
        <h3 className="product-title">客戶產品需求</h3>

        <div className="product-name">{productDemand.name}</div>

        <div className="feature-section">
          <div className="section-label">產品特性:</div>
          <div className="tags-container">
            {productDemand.features.map((feature, idx) => (
              <span key={idx} className="feature-tag">
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className="audience-section">
          <div className="section-label">目標受眾:</div>
          <div className="tags-container">
            {productDemand.targetAudience.map((audience, idx) => (
              <span key={idx} className="audience-tag">
                {audience}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 匹配波紋效果 */}
      {progress >= 65 && progress < 75 && <div className="match-ripple" />}

      {/* 匹配結果標籤 */}
      {progress >= 70 && (
        <div className="match-result fade-in">
          <div className="match-title">{matchedAudience.name}</div>
          <div className="match-size">
            受眾規模: {(matchedAudience.size / 1000000).toFixed(2)}M
          </div>
          <div className="match-traits">
            {matchedAudience.traits.map((trait, idx) => (
              <span key={idx} className="trait-tag">
                {trait}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 匹配連接線 */}
      {progress >= 72 && (
        <svg className="match-svg">
          <defs>
            <linearGradient
              id="matchGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor={config.colors.primary}
                stopOpacity="0.8"
              />
              <stop
                offset="100%"
                stopColor={config.colors.accent}
                stopOpacity="0.8"
              />
            </linearGradient>
          </defs>

          <path
            d="M80,30 C70,45 65,50 65,60"
            stroke="url(#matchGradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4,4"
            filter="url(#glow)"
            className="pulse-line"
          />
        </svg>
      )}
    </div>
  );
};

export default ProductMatching;
