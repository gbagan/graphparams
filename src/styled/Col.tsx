import styled, {css} from "styled-components";

/*
type Props = {
    span?: number;
};
*/

export default styled.div`
box-sizing: border-box;
display: block;
float: left;
${p => p.span && css`
    width: ${(100 / p.span) + "%"}
`}
` as any;
