import * as React from 'react';

import Button from 'antd/lib/button';
import InputNumber from 'antd/lib/input-number';
import Select from 'antd/lib/select';
import Form from 'antd/lib/form';
import Checkbox from 'antd/lib/checkbox';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import {FormData} from '../types';

type Props = {
    form: WrappedFormUtils;
    onSubmit: (data: FormData) => void;
}

const handleSubmit = (e: React.FormEvent<any>, props: Props) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
        if (err)
            return;
        props.onSubmit(values);
    });
}


const LOForm: React.SFC<Props> = props => {
    const { getFieldDecorator } = props.form;
    return (
        <Form layout="inline" onSubmit={e => handleSubmit(e, props)}>
            <Form.Item label="Rows">{
                getFieldDecorator('rows', {initialValue: 5})(
                    <InputNumber name="rows" min={2} max={100} />
                )
            }</Form.Item>
            <Form.Item label="Columns">{
                getFieldDecorator('columns', {initialValue: 5})(
                    <InputNumber name="columns" min={2} max={100} />
                )
            }</Form.Item>
            <Form.Item label="Number of colors">{
                getFieldDecorator('nbColors', {initialValue: 2})(
                    <Select>
                        <Select.Option value={2}>2</Select.Option>
                        <Select.Option value={3}>3</Select.Option>
                        <Select.Option value={4}>4</Select.Option>
                        <Select.Option value={5}>5</Select.Option>
                    </Select>
                )
            }</Form.Item>
            <Form.Item>{
                getFieldDecorator('toroidal')(
                    <Checkbox>Toroidal</Checkbox>
                )
            }</Form.Item>
            <Button htmlType="submit" type="primary">Generate</Button>
        </Form>
    )
}

export default Form.create<Props>()(LOForm);