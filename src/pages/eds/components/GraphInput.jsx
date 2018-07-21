import React from 'react';
import {connect} from 'react-redux';
import {compose, withStateHandlers, withHandlers} from 'recompose';

import {Radio, TextArea} from "@/ui";
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Row from 'antd/lib/row';

// import Select, { SelectValue } from "antd/lib/select";

import {fillLocalStorage, removeFromLocalStorage} from "../localstorage";

import * as actions from '../redux/actions';
const style = require("./GraphInput.scss");

const mapStateToProps = () => ({});
const mapDispatchToProps = {
    onSubmit: actions.submitInput
};

const render = ({loadList, code, saveName, loadName, rules,
                handleSaveNameChange, handleCodeChange, /* handleSelectChange, */ handleRulesChange,
                handleCodeSubmit, handleLoadSubmit, handleRemove}) => (
    <div>
        <Radio
            onChange={handleRulesChange} value={rules}
            options={[{value: "one", text: "One guard"},
                      {value: "all", text: "All guards"}]}
        />
        <Row>
            <Input onChange={handleSaveNameChange} value={saveName} />
            <Button type="primary">Save</Button>
        </Row>
        <Row> { /*
            <Select onChange={handleSelectChange} value={loadName}>
                {loadList.map(name => <Select.Option key={name} value={name}>{name}</Select.Option>)}
            </Select>
        */ }

            <Button type="primary" onClick={handleLoadSubmit}>Load</Button>
            <Button type="danger" onClick={handleRemove}>Remove</Button>
        </Row>
        <TextArea
            className={style.graph}
            onChange={handleCodeChange}
            value={code}
        />
        <Button type="primary" onClick={handleCodeSubmit}>Generate</Button>
    </div>
);

export default
compose(
    connect(mapStateToProps, mapDispatchToProps),
    withStateHandlers(
    () => {
        const loadNames = fillLocalStorage();
        return {
            code: 'test',
            loadList: loadNames,
            loadName: loadNames[0],
            rules: 'all',
            saveName: ''
        }
    },{
        handleSaveNameChange: state => e => ({ saveName: e.target.value }),
        handleCodeChange: state => e => ({ code: e.target.value }),
        // handleSelectChange: state => loadName =>  ({ loadName: loadName }), 
        handleRulesChange: state => e => ({ rules: e.target.value }),
        handleRemove: ({loadName}) => () => ({ loadList: removeFromLocalStorage(loadName) }),
    }),
    withHandlers({
        handleCodeSubmit: props => () => props.onSubmit({ type: "generate", input: props.code, rules: props.rules }),
        handleLoadSubmit: props => () => props.onSubmit({ type: "load", input: props.loadName, rules: props.rules }),
    })
)(render);

