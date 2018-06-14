import * as React from "react";

import Button from "antd/lib/button";
import Form from "antd/lib/form";
import { WrappedFormUtils } from "antd/lib/form/Form";
import Input from "antd/lib/input";
import InputNumber from "antd/lib/input-number";

type Props = {
    form: WrappedFormUtils;
    onSubmit: (vals: number[], target: number) => void;
};

export function toArrayOfNumbers(data: string): number[] | null {
    const values = data.split(" ").filter(val => val !== "")
        .map(val => parseInt(val, 10))
        .filter(val => val && val > 0);

    return values.length === 0 ? null : values;
}

function checkInputValues(rule: any, value: string, callback: any) {
    if (value && toArrayOfNumbers(value)) {
        callback();
    } else {
        callback("Invalid input");
    }
}

class ChiffresForm extends React.Component<Props> {
    public render() {
        const { getFieldDecorator } = this.props.form;

        const valuesInput = getFieldDecorator("values", {
            rules: [{ message: "Please input values separated by spaces!",
                      required: true,
                    }, { validator: checkInputValues }]})
                    (<Input placeholder="3 5 10" />);

        const targetInput = getFieldDecorator("target", {
            rules: [{ required: true, message: "Please input the target value!" }] })
            (<InputNumber min={1} max={999} />);

        return (
            <Form layout="inline" onSubmit={this.handleSubmit}>
                <Form.Item label="Values given">{valuesInput}</Form.Item>
                <Form.Item label="Target">{targetInput}</Form.Item>
                <Button htmlType="submit" type="primary">Solve</Button>
            </Form>
        );
    }

    private handleSubmit = (e: React.FormEvent<any>) => {
        e.preventDefault();
        const { onSubmit } = this.props;
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const values2 = toArrayOfNumbers(values.values);
            const target = parseInt(values.target, 10);
            if (values2) {
                onSubmit(values2, target);
            }
        });
    }
}

export default Form.create<Props>()(ChiffresForm);
