import React, { FunctionComponent } from "React";

type InstructionProps = {
  text: string;
};

export const Instructions: FunctionComponent<InstructionProps> = ({ text }) => {
  return <p className="view-instructions">{text}</p>;
};
