import React from "react";
import "./Badge.css";

function Badge(props: {
  title: string;
  text_color: string;
  bg_color: string;
}): JSX.Element {
  const checkTextColor = props.text_color ?? "text-dark";
  const checkBgColor = props.bg_color ?? "text-white";
  return (
    <div className={`badge-style ${checkTextColor} ${checkBgColor}`}>
      {props.title}
    </div>
  );
}

export default Badge;
