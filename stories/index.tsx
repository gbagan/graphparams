/* tslint:disable */
import { storiesOf } from "@storybook/react";
/* tslint:enable */
import * as React from "react";

import Button from "../src/styled/Button";

storiesOf("Button", module)
.add("standard", () => <Button>Standard</Button>)
.add("primary", () => <Button color="primary">Primary</Button>);