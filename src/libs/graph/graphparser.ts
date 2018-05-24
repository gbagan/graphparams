import { Graph, MutableGraph, generatePetersen, generateSun } from "./graph";
import { range } from "../iter";

enum LexerToken {
    Comma,
    LeftParen,
    RightParen,
    Litteral,
    Method,
    Number,
    Edge,
    Begin,
    Error
}

enum ParserToken {
    Graph,
    Method,
    Number,
    Edge,
    Function,
    Begin
}

type PTokenPair = { type: ParserToken.Graph, data: MutableGraph }
    | { type: ParserToken.Method, data: string }
    | { type: ParserToken.Number, data: number }
    | { type: ParserToken.Edge, data: number }
    | { type: ParserToken.Function, data: string }


function* lexer(str: string): Iterable<[LexerToken, any]> {
    let i = 0;
    while (i < str.length) {
        if ([" ", "\n", "\t"].includes(str[i])) {
            i++;
        }
        else if (str[i] === ',') {
            yield [LexerToken.Comma, ','];
            i++;
        }
        else if (str[i] === '(') {
            yield [LexerToken.LeftParen, '('];
            i++;
        }
        else if (str[i] === ')') {
            yield [LexerToken.RightParen, ')'];
            i++;
        }
        else if ('a' <= str[i] && str[i] <= 'z' || ('A' <= str[i] && str[i] <= 'Z')) {
            let val = '';
            while ('a' <= str[i] && str[i] <= 'z' || ('A' <= str[i] && str[i] <= 'Z')) {
                val += str[i];
                i++;
            }
            yield [LexerToken.Litteral, val];
        }
        else if (str[i] === '.') {
            let val = '';
            i++;
            while ('a' <= str[i] && str[i] <= 'z' || ('A' <= str[i] && str[i] <= 'Z')) {
                val += str[i];
                i++;
            }
            if (val !== '')
                yield [LexerToken.Method, val];
            else {
                yield [LexerToken.Error, null];
                return;
            }
        }
        else if ('0' <= str[i] && str[i] <= '9') {
            let val = '';
            while ('0' <= str[i] && str[i] <= '9') {
                val += str[i];
                i++;
            }
            if (str[i] === '-') {
                let val2 = '';
                i++;
                while ('0' <= str[i] && str[i] <= '9') {
                    val2 += str[i];
                    i++;
                }
                if (val2 !== '')
                    yield [LexerToken.Edge, [parseInt(val), parseInt(val2)]];
                else {
                    yield [LexerToken.Error, null];
                    return;
                }
            } else {
                yield [LexerToken.Number, parseInt(val)];
            }
        } else {
            yield [LexerToken.Error, null];
            return;
        }
    }
}

function parse(str: string): Graph | string {
    const constants = new Map([
        ['petersen', () => generatePetersen()]
    ]);

    const functions = new Map([
        ['graph', [1, ParserToken.Number, (n: number) => new MutableGraph(n)]],
        //['digraph', (n: number) => new Digraph(n)]
        ['path', [1, ParserToken.Number, (n: number) => new MutableGraph(n).addPath(...range(n))]],
        ['clique', [1, ParserToken.Number, (n: number) => new MutableGraph(n).addClique(...range(n))]],
        //['grid', [1, GraphParserToken.Number, (n: number, m: number) => new Graph('G' + n + ',' + m)]],
        ['star', [1, ParserToken.Number, (n: number) => new MutableGraph(1).join(new MutableGraph(n))]],
        ['cycle', [1, ParserToken.Number, (n: number) => new MutableGraph(n).addCycle(...range(n))]],
        ['biclique', [1, ParserToken.Number, (n: number, m: number) => new MutableGraph(n).join(new MutableGraph(m))]],
        ['sun', [1, ParserToken.Number, (n: number) => generateSun(n)]]
    ]);

    const methods = new Map([
        ['addEdge', [2, ParserToken.Number]],
        ['addClique', [-1, ParserToken.Number]],
        ['addPath', [-1, ParserToken.Number]],
        ['addCycle', [-1, ParserToken.Number]],
        ['addEdges', [-1, ParserToken.Edge]],
        ['complement', [0, ParserToken.Number]],
        ['lineGraph', [0, ParserToken.Number]],
        ['union', [1, ParserToken.Graph]],
        ['join', [1, ParserToken.Graph]],
    ]);


    const stack: PTokenPair[] = [];
    let lastToken: LexerToken = LexerToken.Begin;
    let topToken = ParserToken.Begin;
    for (const [token, value] of lexer(str)) {
        if (stack.length > 0)
            topToken = stack[stack.length - 1][0];
        if (token === LexerToken.Number) {
            if (![LexerToken.Comma, LexerToken.LeftParen].includes(lastToken)) {
                return 'syntax error';
            } else {
                stack.push({ type: ParserToken.Number, data: value });
            }
        }

        else if (token === LexerToken.Edge) {
            if (![LexerToken.Comma, LexerToken.LeftParen].includes(lastToken)) {
                return 'syntax error';
            } else {
                stack.push({ type: ParserToken.Edge, data: value });
            }
        }

        else if (token === LexerToken.LeftParen) {
            if (![ParserToken.Function, ParserToken.Method].includes(topToken) ||
                lastToken === LexerToken.LeftParen) {
                return 'syntax error';
            }
        }
        else if (token === LexerToken.Comma) {
            if (![ParserToken.Graph, ParserToken.Number, ParserToken.Edge].includes(topToken) ||
                lastToken === LexerToken.Comma) {
                return 'syntax error';
            }
        }

        else if (token === LexerToken.Litteral) {
            if (![LexerToken.Comma, LexerToken.LeftParen, LexerToken.Begin].includes(lastToken)) {
                return 'syntax error';
            } else if (constants.has(value)) {
                const graph = constants.get(value)!();
                stack.push({ type: ParserToken.Graph, data: graph });
            } else if (functions.has(value)) {
                stack.push({ type: ParserToken.Function, data: value });
            } else {
                return 'function not found: ' + value;
            }
        }
        else if (token === LexerToken.Method) {
            if (topToken !== ParserToken.Graph) {
                return 'syntax error';
            } else if (!methods.has(value)) {
                return 'method not found: ' + value;
            } else {
                stack.push({ type: ParserToken.Method, data: value });
            }
        }

        else if (token === LexerToken.RightParen) {
            const parameters: PTokenPair[] = [];
            while (stack.length >= 2 && ![ParserToken.Method, ParserToken.Method].includes(stack[stack.length - 1].type)) {
                const parameter = stack.pop()!;
                parameters.unshift(parameter);
            }
            const ttoken = stack.pop();
            if (!ttoken) {
                return 'unexpected error'
            } else if (ttoken.type === ParserToken.Function) {
                const [arity, type, fn] = functions.get(ttoken.data)!;
                if (parameters.length !== arity) {
                    return 'invalid number of arguments: ' + ttoken.data;
                } else if (!parameters.every((p) => p[0] === type)) {
                    return 'invalid argument types: ' + ttoken.data;
                } else if (typeof fn === "number") {
                    return 'unexpected error'
                } else {
                    const rgraph = (fn as (...x: any[]) => MutableGraph)(...parameters.map(x => x.data));
                    stack.push({ type: ParserToken.Graph, data: rgraph });
                }
            } else if (ttoken.type === ParserToken.Method) {
                const token2 = stack.pop();
                if (!token2 || token2.type !== ParserToken.Graph)
                    return 'unexcepted error'
                const [arity, type] = methods.get(ttoken.data)!;
                if (parameters.length !== arity && arity !== -1) {
                    return 'invalid number of arguments: ' + ttoken.data;
                } else if (!parameters.every((p) => p.type === type)) {
                    return 'invalid argument types: ' + ttoken.data;
                } else {
                    const rgraph = (token2.data as any)[ttoken.data](...parameters.map(x => x.data));
                    stack.push({ type: ParserToken.Graph, data: rgraph });
                }
            }
        }
        else if (token === LexerToken.Error) {
            return "lexer error";
        }
        lastToken = token;
    }
    const token = stack.pop();
    if (!token || token.type !== ParserToken.Graph)
        return 'invalid type';
    else
        return token.data.freeze();
}

export default parse;