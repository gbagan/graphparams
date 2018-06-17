import * as React from "react";
import { FormikProps, withFormik, } from "formik";
import {Button, Checkbox, InputNumber, Select} from "@/ui";
import { FormData as Values } from "../types";

type Props = {
    onSubmit: (d: Values) => void;
}

const render: React.SFC<Props & FormikProps<Values>> = ({values, handleChange, handleBlur,
                                                         handleSubmit, setFieldValue}) => (
    <form onSubmit={handleSubmit}>
        <label>
            <span>Rows: </span>
            <InputNumber
                name="rows"
                value={values.rows}
                min={2}
                max={100}
                onChange={val => setFieldValue("rows", val)}
                onBlur={handleBlur}
            />
        </label>
        <label>
            <span>Rows: </span>
            <InputNumber
                name="columns"
                value={values.columns}
                min={2}
                max={100}
                onChange={val => setFieldValue("columns", val)}
                onBlur={handleBlur}
            />
        </label>
        <label>
            <span>Number of colors: </span>
            <Select
                value={values.nbcolors.toString()}
                onChange={val => setFieldValue("nbcolors", val)}
                options={[
                    { value: "2", label: "2" },
                    { value: "3", label: "3" },
                    { value: "4", label: "4" },
                    { value: "5", label: "5" },
                    { value: "6", label: "6" },
                ]}
            />
        </label>

        <Checkbox
            name="toroidal"
            checked={values.toroidal}
            onChange={handleChange}
            onBlur={handleBlur}
        >Toroidal</Checkbox>

        <Button htmlType="submit" color="primary">Generate</Button>
    </form>
);

export default withFormik<Props, Values>({
    mapPropsToValues: () => ({
        columns: 5,
        nbcolors: 2,
        rows: 5,
        toroidal: false,
    }),
    handleSubmit: (values, {props}) => {
        props.onSubmit(values);
    }
})(render);
