import * as React from "react";

import {Button, Input, InputNumber} from "@/ui";

type Props = {
    onSubmit: (vals: number[], target: number) => void;
};

export function toArrayOfNumbers(data: string): number[] | null {
    const values = data.split(" ").filter(val => val !== "")
        .map(val => parseInt(val, 10))
        .filter(val => val && val > 0);

    return values.length === 0 ? null : values;
}

/*
function checkInputValues(rule: any, value: string, callback: any) {
    if (value && toArrayOfNumbers(value)) {
        callback();
    } else {
        callback("Invalid input");
    }
}
*/

const render: React.SFC<Props> = () => (
    <form>
        <Input />
        <InputNumber min={1} max={999} />
        <Button htmlType="submit" color="primary">Solve</Button>
    </form>
)

export default render;
