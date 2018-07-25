import { biclique, clique, cycle, graph, grid, path, petersen, sun } from "./generate";
import Graph from "./graph";
import {complement, join, lineGraph, product, union, addEdges, addPath, addCycle, addClique} from "./operators";

const LexerToken = {
    Comma: 1,
    LeftParen: 2,
    RightParen: 3,
    Litteral: 4,
    Method: 5,
    Number: 6,
    Edge: 7,
    Begin: 8,
    Error: 9,
}

const ParserToken = {
    Graph: 1,
    Method: 2,
    Number: 3,
    Edge: 4,
    Function: 5,
    Begin: 6,
}

function* lexer(str) {
    let i = 0;
    while (i < str.length) {
        if ([" ", "\n", "\t"].includes(str[i])) {
            i++;
        } else if (str[i] === ",") {
            yield [LexerToken.Comma, ","];
            i++;
        } else if (str[i] === "(") {
            yield [LexerToken.LeftParen, "("];
            i++;
        } else if (str[i] === ")") {
            yield [LexerToken.RightParen, ")"];
            i++;
        } else if ("a" <= str[i] && str[i] <= "z" || ("A" <= str[i] && str[i] <= "Z")) {
            let val = "";
            while ("a" <= str[i] && str[i] <= "z" || ("A" <= str[i] && str[i] <= "Z")) {
                val += str[i];
                i++;
            }
            yield [LexerToken.Litteral, val];
        } else if (str[i] === ".") {
            let val = "";
            i++;
            while ("a" <= str[i] && str[i] <= "z" || ("A" <= str[i] && str[i] <= "Z")) {
                val += str[i];
                i++;
            }
            if (val !== "") {
                yield [LexerToken.Method, val];
            } else {
                yield [LexerToken.Error, null];
                return;
            }
        } else if ("0" <= str[i] && str[i] <= "9") {
            let val = "";
            while ("0" <= str[i] && str[i] <= "9") {
                val += str[i];
                i++;
            }
            if (str[i] === "-") {
                let val2 = "";
                i++;
                while ("0" <= str[i] && str[i] <= "9") {
                    val2 += str[i];
                    i++;
                }
                if (val2 !== "") {
                    yield [LexerToken.Edge, [parseInt(val, 10), parseInt(val2, 10)]];
                } else {
                    yield [LexerToken.Error, null];
                    return;
                }
            } else {
                yield [LexerToken.Number, parseInt(val, 10)];
            }
        } else {
            yield [LexerToken.Error, null];
            return;
        }
    }
}

const addEdge = (g, u, v) => g.addEdge(u, v);

const parse = str => {
    const constants = new Map([
        ["petersen", () => petersen()],
    ]);

    const functions = new Map([
        ["graph",    { arity: 1, type: ParserToken.Number, fn: graph}],
        ["path",     { arity: 1, type: ParserToken.Number, fn: path}],
        ["clique",   { arity: 1, type: ParserToken.Number, fn: clique}],
        ["grid",     { arity: 2, type: ParserToken.Number, fn: grid}],
        ["star",     { arity: 1, type: ParserToken.Number, fn: n => biclique(1, n)}],
        ["cycle",    { arity: 1, type: ParserToken.Number, fn: cycle }],
        ["biclique", { arity: 2, type: ParserToken.Number, fn: biclique}],
        ["sun",      { arity: 1, type: ParserToken.Number, fn: sun}],
    ]);

    const methods = new Map([
        ["addEdge",    {arity: 2,  type: ParserToken.Number, fn: addEdge}],
        ["addClique",  {arity: -1, type: ParserToken.Number, fn: addClique}],
        ["addPath",    {arity: -1, type: ParserToken.Number, fn: addPath}],
        ["addCycle",   {arity: -1, type: ParserToken.Number, fn: addCycle}],
        ["addEdges",   {arity: -1, type: ParserToken.Edge,   fn: addEdges}],
        ["complement", {arity: 0,  type: ParserToken.Number, fn: complement}],
        ["lineGraph",  {arity: 0,  type: ParserToken.Number, fn: lineGraph}],
        ["union",      {arity: 1,  type: ParserToken.Graph, fn: union}],
        ["join",       {arity: 1,  type: ParserToken.Graph, fn: join}],
        ["product",    {arity: 1,  type: ParserToken.Graph, fn: product}],
    ]);

    const stack = [];
    let lastLexerToken = LexerToken.Begin;
    let topToken = ParserToken.Begin;
    for (const [currentToken, value] of lexer(str)) {
        if (stack.length > 0) {
            topToken = stack[stack.length - 1].type;
        }
        if (currentToken === LexerToken.Number) {
            if (![LexerToken.Comma, LexerToken.LeftParen].includes(lastLexerToken)) {
                return "syntax error";
            } else {
                stack.push({ type: ParserToken.Number, data: value });
            }
        } else if (currentToken === LexerToken.Edge) {
            if (![LexerToken.Comma, LexerToken.LeftParen].includes(lastLexerToken)) {
                return "syntax error";
            } else {
                stack.push({ type: ParserToken.Edge, data: value });
            }
        } else if (currentToken === LexerToken.LeftParen) {
            if (![ParserToken.Function, ParserToken.Method].includes(topToken) ||
                lastLexerToken === LexerToken.LeftParen) {
                return "syntax error";
            }
        } else if (currentToken === LexerToken.Comma) {
            if (![ParserToken.Graph, ParserToken.Number, ParserToken.Edge].includes(topToken) ||
                lastLexerToken === LexerToken.Comma) {
                return "syntax error";
            }
        } else if (currentToken === LexerToken.Litteral) {
            if (![LexerToken.Comma, LexerToken.LeftParen, LexerToken.Begin].includes(lastLexerToken)) {
                return "syntax error";
            } else if (constants.has(value)) {
                const g = constants.get(value)();
                stack.push({ type: ParserToken.Graph, data: g });
            } else if (functions.has(value)) {
                stack.push({ type: ParserToken.Function, data: value });
            } else {
                return "function not found: " + value;
            }
        } else if (currentToken === LexerToken.Method) {
            if (topToken !== ParserToken.Graph) {
                return "syntax error";
            } else if (!methods.has(value)) {
                return "method not found: " + value;
            } else {
                stack.push({ type: ParserToken.Method, data: value });
            }
        } else if (currentToken === LexerToken.RightParen) {
            const parameters = [];
            while (true) {
                const lastToken = stack[stack.length - 1];
                if (lastToken.type === ParserToken.Function || lastToken.type === ParserToken.Method) {
                    break;
                }
                const parameter = stack.pop();
                if (!parameter) {
                    throw Error("unexpected error");
                }
                parameters.unshift(parameter);
            }
            const fntoken = stack.pop();
            if (!fntoken) {
                throw Error("unexpected error");
            } else if (fntoken.type === ParserToken.Function) {
                const fn = functions.get(fntoken.data);
                if (parameters.length !== fn.arity) {
                    return "invalid number of arguments: " + fntoken.data;
                } else if (!parameters.every(p => p.type === fn.type)) {
                    return "invalid argument types: " + fntoken.data;
                } else {
                    const rgraph = fn.fn(...parameters.map(x => x.data));
                    if (!(rgraph instanceof Graph)) {
                        throw Error("unexpected error");
                    }
                    stack.push({ type: ParserToken.Graph, data: rgraph });
                }
            } else if (fntoken.type === ParserToken.Method) {
                const graphToken = stack.pop();
                if (!graphToken || graphToken.type !== ParserToken.Graph) {
                    throw Error("unexcepted error");
                }
                const method = methods.get(fntoken.data);
                if (parameters.length !== method.arity && method.arity !== -1) {
                    return "invalid number of arguments for " + fntoken.data + " : " +
                            method.arity + " expected, " + parameters.length + " received";
                } else if (!parameters.every(p => p.type === method.type)) {
                    return "invalid argument types: " + fntoken.data;
                } else {
                    const fn = method.fn;
                    const rgraph = fn(graphToken.data, ...parameters.map(x => x.data));
                    stack.push({ type: ParserToken.Graph, data: rgraph });
                }
            }
        } else if (currentToken === LexerToken.Error) {
            return "lexer error";
        }
        lastLexerToken = currentToken;
    }
    const token = stack.pop();
    return !token || token.type !== ParserToken.Graph ? "invalid type" : token.data.clean();
}

export default parse;
