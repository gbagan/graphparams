import * as React from "react";

/*
import {Button} from "@/ui";
import Dropdown from "antd/lib/dropdown";
import Menu from "antd/lib/menu";
*/
import Dropdown from "@/ui/Dropdown";

type NameAndData<T> = {
    readonly name: string;
    readonly data: T;
};

type Props = {
    readonly label: string,
    readonly action: (x: any) => void;
    data: ReadonlyArray<NameAndData<any>>;
};

//  public handleAction = (e: any) => this.props.action(this.props.data[e.key].data);

const render: React.SFC<Props> = ({label, data}) => (
    <Dropdown title={label} list={
                                    data.map(({name}, i) => ({ id: i, label: name}))
                                 }
    />
);


export default render;
