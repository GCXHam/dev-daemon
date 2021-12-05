import React from "react";
import "./Badge.css";

function Badge({ title, text_color, bg_color }) {
  const checkTextColor = text_color ? text_color : "text-dark";
  const checkBgColor = bg_color ? bg_color : "text-white";
  return (
    <div className={`badge-style ${checkTextColor} ${checkBgColor}`}>
      {title}
    </div>
  );
}

export default Badge;
