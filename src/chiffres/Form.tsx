import * as React from 'react';
import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import { WrappedFormUtils } from 'antd/lib/form/Form';

interface Props {
    form: WrappedFormUtils;
    onSubmit?: (vals: ReadonlyArray<number>, target: number) => void;
}

export function toArrayOfNumbers(data: string): ReadonlyArray<number> | null {
    const vals = data.split(" ");
    const values: number[] = [];
    for (const val of vals) {
        if (val === "")
            continue;
        const value = parseInt(val);
        if (value === undefined || value <= 0)
            return null;
        values.push(value);
    }
    if (values.length === 0)
        return null;
    return values;
}

class ChiffresForm extends React.Component<Props, {}> {
    handleSubmit = (e: React.FormEvent<any>) => {
        e.preventDefault();

        const { onSubmit } = this.props;
        this.props.form.validateFields((err, values) => {
            if (err)
                return;
            const values2 = toArrayOfNumbers(values.values);
            const target = parseInt(values.target);
            onSubmit && values2 && onSubmit(values2, target);
        });
    }

    checkInputValues = (rule: any, value: string, callback: any) => {
        if (value && toArrayOfNumbers(value))
            callback();
        else
            callback("Invalid input");
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline" onSubmit={this.handleSubmit}>
                <Form.Item label="Values given">
                    {getFieldDecorator('values', {
                        rules: [{ required: true, message: 'Please input values separated by spaces!' },
                        { validator: this.checkInputValues }]
                    })
                        (<Input placeholder="3 5 10" />)}
                </Form.Item>
                <Form.Item label="Target">
                    {getFieldDecorator('target', { rules: [{ required: true, message: 'Please input the target value!' }] })
                        (<InputNumber min={1} max={999} />)}
                </Form.Item>
                <Button htmlType="submit" type="primary">Solve</Button>
            </Form>
        );
    }
}

export default Form.create<Props>()(ChiffresForm);