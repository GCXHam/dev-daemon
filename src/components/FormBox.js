import React from "react";
import "./FormBox.css";

function FormBox({ name, type, placeholder }) {
  return (
    <div>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="formbox-style"
      />
    </div>
  );
}

export default FormBox;
