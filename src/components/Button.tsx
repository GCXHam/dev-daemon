import React from "react";
import "./Button.css";

function Button(props: { title: string, button_size: string, text_color: string, bg_color: string }): JSX.Element {
  const checkButtonSize = props.button_size ?? "";
  const checkTextColor = props.text_color ?? "text-dark";
  const checkBgColor = props.bg_color ?? "text-white";

  return (
    // TODO: if `react-router-dom` is installed, insert `Link` tag.
    <div>
      <input
        className={`button-style ${checkButtonSize} ${checkTextColor} ${checkBgColor}`}
        type="submit"
        value={props.title}
      />
    </div>
  );
}

export default Button;
