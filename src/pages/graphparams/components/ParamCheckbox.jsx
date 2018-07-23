import {React, withHandlers} from "@/commonreact";
import {Checkbox} from "@/ui";

const render = ({data: {checked, fullname}, handleToggle}) => (
    <React.Fragment>
        <Checkbox checked={checked} onChange={handleToggle}>
            {fullname}
        </Checkbox>
        <br />
    </React.Fragment>
);

export default
withHandlers({
    handleToggle: ({data, onToggle}) => () => onToggle(data.name)
})(render);
