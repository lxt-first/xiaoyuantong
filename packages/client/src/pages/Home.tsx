export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#fff",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🏫 校园通</h1>
      <p style={{ fontSize: "1.25rem", opacity: 0.9 }}>
        校园本地信息聚合平台
      </p>
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        {["校招内推", "租房找房", "二手交易"].map((label) => (
          <span
            key={label}
            style={{
              padding: "0.5rem 1.5rem",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "999px",
              fontSize: "0.95rem",
              backdropFilter: "blur(4px)",
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
