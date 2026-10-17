import { ImageResponse } from "next/og";
export const alt = "Sanket Mohanty — AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#f5f1e8",
        color: "#243b32",
        width: "100%",
        height: "100%",
        padding: 80,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", color: "#90412e", fontSize: 25 }}>
        SM. / AI ENGINEERING
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 65,
          maxWidth: 980,
          fontWeight: 700,
        }}
      >
        Building intelligent systems for the real world.
      </div>
      <div style={{ display: "flex", fontSize: 28, color: "#5f665c" }}>
        Sanket Mohanty · Generative AI · Python · RAG
      </div>
    </div>,
    size,
  );
}
