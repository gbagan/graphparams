import * as React from "react";
import styled from "styled-components";

type Props = {
    color?: "warning" | "error";
    className?: string;
};

const Text: React.SFC<Props> = p => <span className={p.className}>{p.children}</span>;

export default styled(Text)`
    color: ${p => p.color === "warning" && "orange"
           || p.color === "error" && "red"
           || "black"}
`;
