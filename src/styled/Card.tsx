import * as React from "react";
import styled from "styled-components";

import * as theme from "./theme";

type Props = {
    className?: string;
    title: string;
};

const Head = styled.div`
background: #fff;
border-bottom: 1px solid #e8e8e8;
padding: 0 24px;
border-radius: 2px 2px 0 0;
zoom: 1;
margin-bottom: -1px;
min-height: 48px;
`;

const Wrapper = styled.div`
display: flex;
`;

const Title = styled.div`
font-size: 16px;
padding: 16px 0;
text-overflow: ellipsis;
overflow: hidden;
white-space: nowrap;
color: rgba(0, 0, 0, 0.85);
font-weight: 500;
display: inline-block;
flex: 1;
`;

const Body = styled.div`
padding: 24px;
zoom: 1;
`;

const Container = styled.div`
font-family: ${theme.fontFamily};
font-size: 14px;
line-height: 1.5;
color: rgba(0, 0, 0, 0.65);
box-sizing: border-box;
margin: 0;
padding: 0;
list-style: none;
background: #fff;
border-radius: 2px;
position: relative;
transition: all .3s;
border: 1px solid #e8e8e8;
`;

const Card: React.SFC<Props> = props => (
    <Container {...props}>
        <Head>
            <Wrapper>
                <Title>{props.title}</Title>
            </Wrapper>
        </Head>
        <Body>
            {props.children}
        </Body>
    </Container>
);

export default Card;
