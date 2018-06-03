import AllRules from "./allrules";
import OneRules from "./onerules";

const makeRules = (name: "one" | "all") => name === "one" ? new OneRules() : new AllRules();
export default makeRules;
