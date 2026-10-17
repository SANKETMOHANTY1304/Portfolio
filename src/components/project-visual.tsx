import {
  BrainCircuit,
  FileText,
  Layers3,
  Network,
  ShieldCheck,
  Activity,
  BarChart3,
} from "lucide-react";
export function ProjectVisual({
  kind = "graph",
  compact = false,
}: {
  kind?: string;
  compact?: boolean;
}) {
  if (kind === "graph")
    return (
      <div
        className={`project-visual graph-visual ${compact ? "compact" : ""}`}
        role="img"
        aria-label="Conceptual document retrieval workflow"
      >
        <span className="visual-label">DOCUMENT → UNDERSTANDING</span>
        <div className="graph-flow">
          <div className="flow-node">
            <FileText />
            <span>Document</span>
          </div>
          <span className="flow-line" />
          <div className="flow-node core">
            <BrainCircuit />
            <span>Intelligence</span>
          </div>
          <span className="flow-line" />
          <div className="flow-node">
            <Network />
            <span>Knowledge</span>
          </div>
        </div>
        <div className="graph-foot">
          <span>
            <i />
            Chapter-aware
          </span>
          <span>Context. Connected.</span>
        </div>
        <span className="visual-corner">01 / RAG</span>
      </div>
    );
  if (kind === "fraud")
    return (
      <div
        className="project-visual fraud-visual"
        role="img"
        aria-label="Illustrative transaction decision workflow"
      >
        <span className="visual-label">FROM PROBABILITY TO DECISION</span>
        <div className="risk-dashboard">
          <div className="risk-icon">
            <ShieldCheck size={30} />
          </div>
          <div className="risk-bars">
            {[32, 51, 38, 66, 47, 76, 61, 87, 70, 94, 82, 100].map((h, i) => (
              <span key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="decision-row">
          <span>Approve</span>
          <span>Review</span>
          <span>Block</span>
        </div>
        <span className="visual-corner">02 / MACHINE LEARNING</span>
      </div>
    );
  if (kind === "activity" || kind === "audio")
    return (
      <div
        className="project-visual activity-visual"
        role="img"
        aria-label="Illustrative sequential sensor signals"
      >
        <span className="visual-label">PATTERNS IN MOTION</span>
        <div className="waveform">
          <Activity size={30} />
          <svg viewBox="0 0 500 120" aria-hidden="true">
            <path
              d="M0 60 L20 60 30 48 42 78 57 23 68 96 80 50 91 65 105 60 122 60 137 32 148 90 160 8 175 109 188 43 202 71 215 60 245 60 258 42 272 83 284 22 297 97 308 48 326 65 340 60 365 60 381 31 394 88 408 12 420 105 435 45 450 70 470 60 500 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M0 85 Q40 10 80 85 T160 85 T240 85 T320 85 T400 85 T480 85"
              fill="none"
              stroke="currentColor"
              strokeOpacity=".18"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="sensor-tags">
          <span>ACCELEROMETER</span>
          <span>GYROSCOPE</span>
          <span>LSTM + GRU</span>
        </div>
        <span className="visual-corner">03 / DEEP LEARNING</span>
      </div>
    );
  return (
    <div
      className="project-visual data-visual"
      role="img"
      aria-label="Illustrative analytics and customer segments"
    >
      <span className="visual-label">DATA INTO PERSPECTIVE</span>
      <div className="data-graphic">
        <BarChart3 size={60} strokeWidth={1} />
        <span />
        <Layers3 size={52} strokeWidth={1} />
      </div>
      <div className="sensor-tags">
        <span>SALES TRENDS</span>
        <span>RFM SEGMENTS</span>
      </div>
      <span className="visual-corner">04 / DATA SCIENCE</span>
    </div>
  );
}
