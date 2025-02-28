// AnalysisReport.js - 分析報告模組
// 負責展示生成AI如何生成完整的受眾分析報告

import React from "react";
import { config } from "./config";

// 分析報告組件
export const AnalysisReport = ({ showReport, progress }) => {
  if (!showReport) return null;

  // 計算動畫進度 - 0到1之間
  const animationProgress = (progress - 80) / 15;

  // 報告卡片位置和大小
  let reportWidth = 320;
  let reportLeft = 50;
  let reportTop = 45;

  // 根據進度調整報告大小
  if (animationProgress > 0.7) {
    reportWidth = 320 + (animationProgress - 0.7) * 400;
    reportLeft = 50 - (animationProgress - 0.7) * 15;
    reportTop = 45 - (animationProgress - 0.7) * 8;
  }

  const { matchedAudience } = config;
  const { title, matchAnalysis } = config.reportConfig;

  return (
    <div
      className="report-container fade-in"
      style={{
        top: `${reportTop}%`,
        left: `${reportLeft}%`,
        width: `${reportWidth}px`,
      }}
    >
      <h3 className="report-title">{title}</h3>

      <div className="report-subtitle">{matchedAudience.name}</div>

      {/* 報告內容 - 根據動畫進度顯示 */}
      <div
        className="report-content"
        style={{ opacity: animationProgress > 0.3 ? 1 : 0 }}
      >
        {/* 人口統計區塊 */}
        <div className="report-section">
          <div className="section-title">人口統計</div>

          {/* 性別分布 */}
          <div className="gender-chart">
            <div className="chart-label">性別分布:</div>
            <div className="gender-bar">
              <div
                className="male-bar"
                style={{
                  width: `${matchedAudience.demographics.gender.male}%`,
                }}
              >
                {animationProgress > 0.5
                  ? `${matchedAudience.demographics.gender.male}%`
                  : ""}
              </div>
              <div
                className="female-bar"
                style={{
                  width: `${matchedAudience.demographics.gender.female}%`,
                }}
              >
                {animationProgress > 0.5
                  ? `${matchedAudience.demographics.gender.female}%`
                  : ""}
              </div>
            </div>
            {animationProgress > 0.5 && (
              <div className="gender-labels">
                <span>男性</span>
                <span>女性</span>
              </div>
            )}
          </div>

          {/* 年齡分布 */}
          {animationProgress > 0.6 && (
            <div className="age-chart">
              <div className="chart-label">年齡分布:</div>
              <div className="age-bars">
                {Object.entries(matchedAudience.demographics.age).map(
                  ([age, percentage]) => (
                    <div key={age} className="age-bar-container">
                      <div
                        className="age-bar"
                        style={{ height: `${percentage}%` }}
                      ></div>
                      <div className="age-label">{age}</div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 行為數據 */}
      {animationProgress > 0.7 && (
        <div className="report-section">
          <div className="section-title">消費行為</div>

          <div className="behavior-grid">
            <div className="behavior-item">
              <div className="behavior-label">平均消費:</div>
              <div className="behavior-value">
                ${matchedAudience.behavior.avgSpend}
              </div>
            </div>
            <div className="behavior-item">
              <div className="behavior-label">購買頻率:</div>
              <div className="behavior-value">
                {matchedAudience.behavior.purchaseFrequency}
              </div>
            </div>
            <div className="behavior-item">
              <div className="behavior-label">品牌忠誠度:</div>
              <div className="behavior-value">
                {matchedAudience.behavior.brandLoyalty}
              </div>
            </div>
            <div className="behavior-item">
              <div className="behavior-label">研究習慣:</div>
              <div className="behavior-value">
                {matchedAudience.behavior.researchHabits}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 興趣標籤 */}
      {animationProgress > 0.8 && (
        <div className="report-section">
          <div className="section-title">興趣標籤</div>

          <div className="interest-tags">
            {matchedAudience.traits.map((trait, idx) => (
              <span key={idx} className="interest-tag">
                {trait}
              </span>
            ))}
          </div>

          {/* 匹配分析 */}
          <div className="analysis-box">
            <div className="analysis-title">匹配分析:</div>
            <div className="analysis-content">{matchAnalysis}</div>
          </div>
        </div>
      )}

      {/* 報告飛出效果 */}
      {animationProgress > 0.9 && <div className="report-glow" />}
    </div>
  );
};

export default AnalysisReport;
