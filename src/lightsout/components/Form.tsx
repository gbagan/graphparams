import * as React from "react";
import {Button, Checkbox, InputNumber} from "@/ui";

import { FormData } from "../types";

type Props = {
    onSubmit: (data: FormData) => void;
};


        /*
        const inputNbcolors = getFieldDecorator("nbColors", { initialValue: 2 })(
            <Select>
                <Select.Option value={2}>2</Select.Option>
                <Select.Option value={3}>3</Select.Option>
                <Select.Option value={4}>4</Select.Option>
                <Select.Option value={5}>5</Select.Option>
            </Select>);
            */

const render: React.SFC<Props> = () => (
    <form>
        <InputNumber name="rows" min={2} max={100} />
        <InputNumber name="columns" min={2} max={100} />
        <Checkbox name="toroidal">Toroidal</Checkbox>
        <Button htmlType="submit" color="primary">Generate</Button>
    </form>
);

    /*
    private handleSubmit = (e: React.FormEvent<any>) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.props.onSubmit(values);
        });
    }
    */

export default render;
