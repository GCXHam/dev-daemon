import React, { Dispatch, SetStateAction } from "react";
import "./FormBox.css";

function FormBox(props: { name: string, type: string, placeholder: string, onChange: Dispatch<SetStateAction<string>> }): JSX.Element {
  return (
    <div>
      <input
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        className="formbox-style"
        onChange={(v) => props.onChange(v.target.value)}
      />
    </div>
  );
}

export default FormBox;
