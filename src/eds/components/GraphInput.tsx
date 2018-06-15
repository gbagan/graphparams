import * as React from "react";
import { connect } from "react-redux";
import {compose, withStateHandlers, withHandlers} from "recompose";

import {Button, Input, Radio, Row, TextArea} from "@/ui";
import Select, { SelectValue } from "antd/lib/select";

import {fillLocalStorage, removeFromLocalStorage} from "../localstorage";

import * as actions from "../redux/actions";
const style = require("./GraphInput.scss");

const mapStateToProps = () => ({});
const mapDispatchToProps = {
    onSubmit: actions.submitInput
};

type Props = typeof mapDispatchToProps & {className?: string};

type State = {
    code: string;
    loadName: string;
    saveName: string;
    loadList: ReadonlyArray<string>;
    rules: "one" | "all";
};

type StateHandlerProps = {
    handleSaveNameChange: (e: React.ChangeEvent<HTMLInputElement>) => Partial<State>;
    handleCodeChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => Partial<State>;
    handleSelectChange: (loadName: SelectValue) => Partial<State>;
    handleRulesChange: (e: React.ChangeEvent<HTMLInputElement>) => Partial<State>;
    handleRemove: () => Partial<State>;
}

type HandlerProps = {
    handleCodeSubmit: () => void;
    handleLoadSubmit: () => void;
}

const render: React.SFC<Props & State & StateHandlerProps & HandlerProps> = ({loadList, code, saveName, loadName, rules,
                                        handleSaveNameChange, handleCodeChange, handleSelectChange, handleRulesChange,
                                        handleCodeSubmit, handleLoadSubmit, handleRemove}) => (
    <div>
        <Radio onChange={handleRulesChange} value={rules}
                options={[{value: "one", text: "One guard"},
                        {value: "all", text: "All guards"}]}
        />
        <Row>
            <Input onChange={handleSaveNameChange} value={saveName} />
            <Button color="primary">Save</Button>
        </Row>
        <Row>
            <Select onChange={handleSelectChange} value={loadName}>
                {loadList.map(name => <Select.Option key={name} value={name}>{name}</Select.Option>)}
            </Select>
            <Button color="primary" onClick={handleLoadSubmit}>Load</Button>
            <Button color="danger" onClick={handleRemove}>Remove</Button>
        </Row>
        <TextArea className={style.graph} onChange={handleCodeChange} value={code} />
        <Button color="primary" onClick={handleCodeSubmit}>Generate</Button>
    </div>
);

export default
compose<Props & State & StateHandlerProps & HandlerProps, {}>(
    connect(mapStateToProps, mapDispatchToProps),
    withStateHandlers<State, StateHandlerProps, Props>(
    () => {
        const loadNames = fillLocalStorage();
        return {
            code: "test",
            loadList: loadNames,
            loadName: loadNames[0],
            rules: "all",
            saveName: ""
        }
    },{
        handleSaveNameChange: state => e => ({ saveName: e.target.value }),
        handleCodeChange: state => e => ({ code: e.target.value }),
        handleSelectChange: state => loadName =>  ({ loadName: loadName }), 
        handleRulesChange: state => e => ({ rules: e.target.value }),
        handleRemove: ({loadName}) => () => ({ loadList: removeFromLocalStorage(loadName) }),
    }),
    withHandlers<Props & State, HandlerProps>({
        handleCodeSubmit: ({onSubmit, code, rules}) => () => onSubmit({ type: "generate", input: code, rules }),
        handleLoadSubmit: ({onSubmit, loadName, rules}) => () => onSubmit({ type: "load", input: loadName, rules }),
    })
)(render);

