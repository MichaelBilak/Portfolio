import React from "react";

/** Compact mark in the admin nav sidebar. */
export function Icon() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/logo-d-letter.png"
      alt="DormUp"
      style={{
        width: 28,
        height: 28,
        objectFit: "contain",
        display: "block",
        borderRadius: 6,
      }}
    />
  );
}

export default Icon;
