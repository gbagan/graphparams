export type GraphInputData = {
    type: "load" | "generate",
    input: string,
    rules: "one" | "all"
}

export {Shift} from "@/lib/arena/types";