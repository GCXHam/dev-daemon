import React from "react";
import "./Button.css";

function Button({ title, button_size, text_color, bg_color }) {
  const checkButtonSize = button_size ? button_size : "";
  const checkTextColor = text_color ? text_color : "text-dark";
  const checkBgColor = bg_color ? bg_color : "text-white";

  return (
    // TODO: if `react-router-dom` is installed, insert `Link` tag.
    <div
      className={`button-style ${checkButtonSize} ${checkTextColor} ${checkBgColor}`}
    >
      {title}
    </div>
  );
}

export default Button;
