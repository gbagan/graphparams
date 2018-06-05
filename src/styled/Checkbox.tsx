import * as React from "react";
import styled, {css} from "styled-components";
import * as theme from "./theme";

type Props = {
    checked?: boolean;
    className?: string;
    onChange?: (e: any) => void;
};

const Span = styled.span``;
const Inner = styled.span``;
const Input = styled.input``;

const Wrapper = styled.div`
& {
    font-family: ${theme.fontFamily};
    font-size: 14px;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.65);
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
    line-height: unset;
    cursor: pointer;
    display: inline-block;
}

${Span} {
    font-family: ${theme.fontFamily};
    font-size: 14px;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.65);
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    line-height: 1;
    position: relative;
    vertical-align: middle;
    top: -0.09em;
}

& ${Span} + span {
    padding-left: 8px;
    padding-right: 8px;
}

& ${Input} {
    position: absolute;
    left: 0;
    z-index: 1;
    cursor: pointer;
    opacity: 0;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
}

${Inner} {
    position: relative;
    top: 0;
    left: 0;
    display: block;
    width: 16px;
    height: 16px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    background-color: #fff;
    transition: all .3s;
}

${(p: any) => p.checked && css`${Inner} {
    background-color: #1890ff;
    border-color: #1890ff;
}`}
`;

const Checkbox: React.SFC<Props> = props => (
    <Wrapper {...props}>
        <Span>
            <Input type="checkbox" checked={props.checked} onChange={props.onChange} />
            <Inner />
        </Span>
        <span>{props.children}</span>
    </Wrapper>
);

export default Checkbox;

/*
.ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: #1890ff;
  }
*/
/*
.ant-checkbox-checked:after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 2px;
    border: 1px solid #1890ff;
    content: '';
    -webkit-animation: antCheckboxEffect 0.36s ease-in-out;
            animation: antCheckboxEffect 0.36s ease-in-out;
    -webkit-animation-fill-mode: both;
            animation-fill-mode: both;
    visibility: hidden;
  }
  .ant-checkbox:hover:after,
  .ant-checkbox-wrapper:hover .ant-checkbox:after {
    visibility: visible;
  }

.ant-checkbox-checked .ant-checkbox-inner,
.ant-checkbox-indeterminate .ant-checkbox-inner {
  background-color: #1890ff;
  border-color: #1890ff;
}
.ant-checkbox-disabled {
  cursor: not-allowed;
}
.ant-checkbox-disabled.ant-checkbox-checked .ant-checkbox-inner:after {
  -webkit-animation-name: none;
          animation-name: none;
  border-color: rgba(0, 0, 0, 0.25);
}
.ant-checkbox-disabled .ant-checkbox-input {
  cursor: not-allowed;
}
.ant-checkbox-disabled .ant-checkbox-inner {
  border-color: #d9d9d9 !important;
  background-color: #f5f5f5;
}
.ant-checkbox-disabled .ant-checkbox-inner:after {
  -webkit-animation-name: none;
          animation-name: none;
  border-color: #f5f5f5;
}
.ant-checkbox-disabled + span {
  color: rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
}
*/
