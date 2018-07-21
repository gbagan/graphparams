import * as React from 'react';

import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';

const toArrayOfNumbers = data => {
    const values = data.split(' ').filter(val => val !== '')
        .map(val => parseInt(val, 10))
        .filter(val => val && val > 0);
    return values.length === 0 ? null : values;
}

const checkInputValues = (rule, value, callback) => {
    if (value && toArrayOfNumbers(value)) {
        callback();
    } else {
        callback("Invalid input");
    }
}

const render = () => (
    <Form layout="inline">
        <Form.Item>
            <Input />
        </Form.Item>
        <Form.Item>
            <InputNumber min={1} max={999} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" type="primary">Solve</Button>
        </Form.Item>
    </Form>
)

export default render;
