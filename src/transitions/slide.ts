import { keyframes } from "styled-components";
import transition from "styled-transition-group";

// const transitionClassName = "pageslide";
const duration = 1000;

const slideOut = keyframes`
0% { }
25% { opacity: .5; transform: translateZ(-500px); }
75% { opacity: .5; transform: translateZ(-500px) translateX(-200%); }
100% { opacity: .5; transform: translateZ(-500px) translateX(-200%); }
`;

const slideIn = keyframes`
0%, 25% { opacity: .5; transform: translateZ(-500px) translateX(200%); }
75% { opacity: .5; transform: translateZ(-500px); }
100% { opacity: 1; transform: translateZ(0) translateX(0); }
`;

export default transition.div.attrs({ timeout: duration })`
    width: 100%;
    height: 100%;
    &:enter-active {
        animation: ${slideIn} ${duration}ms both ease;
    }
    &:exit-active {
        animation: ${slideOut} ${duration}ms both ease;
    }
`;
