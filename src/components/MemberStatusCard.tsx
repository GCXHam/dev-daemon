import React from "react";
import Badge from "../components/Badge";
import "./MemberStatusCard.css";

function MemberStatusCard(props: {
  name: string;
  status: string;
}): JSX.Element {
  return (
    <div>
      <p>{props.name}</p>
      <Badge
        title={props.status}
        text_color="text-white"
        bg_color="bg-green"
      />
    </div>
  );
}

export default MemberStatusCard;
