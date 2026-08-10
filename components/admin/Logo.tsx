import React from "react";

/** Full wordmark on Payload login / welcome screens. */
export function Logo() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        maxWidth: 280,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo-dm-group.png"
        alt="DormUp Studio"
        style={{
          width: "min(220px, 70vw)",
          height: "auto",
          display: "block",
        }}
      />
      <span
        style={{
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
          fontSize: 13,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#fcd34d",
          fontWeight: 600,
        }}
      >
        Admin
      </span>
    </div>
  );
}

export default Logo;
