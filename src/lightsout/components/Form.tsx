import * as React from "react";

import Button from "antd/lib/button";
import Checkbox from "antd/lib/checkbox";
import Form from "antd/lib/form";
import InputNumber from "antd/lib/input-number";
import Select from "antd/lib/select";

import { WrappedFormUtils } from "antd/lib/form/Form";
import { FormData } from "../types";

type Props = {
    form: WrappedFormUtils;
    onSubmit: (data: FormData) => void;
};

class LOForm extends React.Component<Props> {
    public render() {
        const { getFieldDecorator } = this.props.form;

        const inputRows = getFieldDecorator("rows", { initialValue: 5 })(
            <InputNumber name="rows" min={2} max={100} />);

        const inputColumns = getFieldDecorator("columns", { initialValue: 5 })(
            <InputNumber name="columns" min={2} max={100} />);

        const inputToroidal = getFieldDecorator("toroidal")(<Checkbox>Toroidal</Checkbox>);

        const inputNbcolors = getFieldDecorator("nbColors", { initialValue: 2 })(
            <Select>
                <Select.Option value={2}>2</Select.Option>
                <Select.Option value={3}>3</Select.Option>
                <Select.Option value={4}>4</Select.Option>
                <Select.Option value={5}>5</Select.Option>
            </Select>);

        return (
            <Form layout="inline" onSubmit={this.handleSubmit}>
                <Form.Item label="Rows">{inputRows}</Form.Item>
                <Form.Item label="Columns">{inputColumns}</Form.Item>
                <Form.Item label="Number of colors">{inputNbcolors}</Form.Item>
                <Form.Item>{inputToroidal}</Form.Item>
                <Button htmlType="submit" type="primary">Generate</Button>
            </Form>
        );
    }

    private handleSubmit = (e: React.FormEvent<any>) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.props.onSubmit(values);
        });
    }
}

export default Form.create<Props>()(LOForm);
