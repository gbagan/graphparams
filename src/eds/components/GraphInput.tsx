import * as R from "ramda";
import * as React from "react";
import { connect } from "react-redux";

import {Button, Row} from "@/ui";
import Input from "antd/lib/input";
import Radio, { RadioChangeEvent } from "antd/lib/radio";
import Select, { SelectValue } from "antd/lib/select";

import * as actions from "../redux/actions";
const style = require("./GraphInput.scss");

const mapStateToProps = () => ({});
const mapDispatchToProps = { onSubmit: actions.submitInput };
type Props = typeof mapDispatchToProps & {className?: string};

type State = {
    readonly code: string;
    readonly loadName: string;
    readonly saveName: string;
    readonly loadList: ReadonlyArray<string>;
    readonly rules: "one" | "all";
};

export class GraphInput extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        if (!localStorage.getItem("graph-petersen")) {
            this.addToLocalStorage("petersen", "petersen",
            [[-237, -31], [-121, -22], [113, -28], [202, -61], [3, -211], [-115, 208],
            [51, 100], [-81, 104], [73, 203], [-16, -93]]);
        }
        if (!localStorage.getItem("graph-hajos")) {
            this.addToLocalStorage("hajos", "sun(3)",
            [[92, -7], [-21, 158], [-102, -21],
            [193, 157], [-202, 151], [-11, -178]]);
        }
        if (!localStorage.getItem("graph-sun4")) {
            this.addToLocalStorage("sun4", "sun(4)", [[-49, -71], [51, -69], [49, 30], [-53, 30],
            [4, -194], [204, -14], [-12, 177], [-205, -19]]);
        }

        const loadNames = localStorageKeys();

        this.state = {
            code: "test",
            loadList: loadNames,
            loadName: loadNames[0],
            rules: "all",
            saveName: "",
        };
    }

    public render() {
        const { loadList, code, saveName, loadName, rules } = this.state;

        // const onSaveSubmit = !onSubmit ? undefined : () => onSubmit({action: "save", input: saveName, rules });

        return (
            <div>
                <Radio.Group onChange={this.handleRulesChange} value={rules}>
                    <Radio.Button value="one">One guard</Radio.Button>
                    <Radio.Button value="all">All guards</Radio.Button>
                </Radio.Group>
                <Row>
                    <Input name="values" onChange={this.handleSaveNameChange} value={saveName} />
                    <Button color="primary">Save</Button>
                </Row>
                <Row>
                    <Select onChange={this.handleSelectChange} value={loadName}>
                        {loadList.map((name, i) => <Select.Option key={i} value={name}>{name}</Select.Option>)}
                    </Select>
                    <Button color="primary" onClick={this.onLoadSubmit}>Load</Button>
                    <Button color="danger" onClick={this.onRemove}>Remove</Button>
                </Row>
                <Input.TextArea rows={10} className={style.graph} onChange={this.handleCodeChange} value={code} />
                <Button color="primary" onClick={this.onCodeSubmit}>Generate</Button>
            </div>
        );
    }

    handleSaveNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        this.setState({ saveName: e.target.value })

    handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        this.setState({ code: e.target.value })

    handleSelectChange = (loadName: SelectValue) =>
        this.setState({ loadName: loadName as string });

    handleRulesChange = (e: RadioChangeEvent) =>
        this.setState({ rules: e.target.value });

    addToLocalStorage(name: string, code: string, positions: Array<[number, number]>) {
        localStorage.setItem("graph-" + name, JSON.stringify({ code, positions }));
        this.setState({ loadList: localStorageKeys() });
    }

    onCodeSubmit = () =>
        this.props.onSubmit({ type: "generate", input: this.state.code, rules: this.state.rules });

    onLoadSubmit = () =>
        this.props.onSubmit({ type: "load", input: this.state.loadName, rules: this.state.rules });

    onRemove = () => this.removeFromLocalStorage(this.state.loadName);

    removeFromLocalStorage(name: string) {
        localStorage.removeItem("graph-" + name);
        this.setState({ loadList: localStorageKeys() });
    }
}

const localStorageKeys = () =>
    R.range(0, localStorage.length)
        .map(i => localStorage.key(i) || "")
        .filter(key => key.startsWith("graph-"))
        .map(key => key.slice(6));

export default connect(mapStateToProps, mapDispatchToProps)(GraphInput);
