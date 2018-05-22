import { Graph, MutableGraph, generatePetersen, generateSun } from "./graph";
import {range} from "../iter";

enum GraphLexerToken {
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

enum GraphParserToken {
    Graph,
    Method,
    Number,
    Edge,
    Function,
    Begin
}


function * lexer(str: string): Iterable<[GraphLexerToken, any]> {
    let i = 0;
    while (i < str.length) {
        if ([" ", "\n", "\t"].includes(str[i])) {
            i++;
        }
        else if (str[i] === ',') {
            yield[GraphLexerToken.Comma, ','];
            i++;
        }
        else if (str[i] === '(') {
            yield[GraphLexerToken.LeftParen, '('];
            i++;
        }
        else if (str[i] === ')') {
            yield[GraphLexerToken.RightParen, ')'];
            i++;
        }
        else if ('a' <= str[i] && str[i] <= 'z' || ('A' <= str[i] && str[i] <= 'Z')) {
            let val = '';
            while ('a' <= str[i] && str[i] <= 'z' || ('A' <= str[i] && str[i] <= 'Z')) {
                val += str[i];
                i++;
            }
            yield[GraphLexerToken.Litteral, val];
        }
        else if (str[i] === '.') {
            let val = '';
            i++;
            while ('a' <= str[i] && str[i] <= 'z' || ('A' <= str[i] && str[i] <= 'Z')) {
                val += str[i];
                i++;
            }
            if (val !== '')
                yield[GraphLexerToken.Method, val];
            else {
                yield[GraphLexerToken.Error, null];
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
                    yield[GraphLexerToken.Edge, [parseInt(val), parseInt(val2)]];
                else {
                    yield[GraphLexerToken.Error, null];
                    return;
                }
            } else {
                yield[GraphLexerToken.Number, parseInt(val)];
            }
        } else {
            yield[GraphLexerToken.Error, null];
            return;
        }
    }
}

function parse(str: string): Graph |  string {
    const constants = new Map([
        ['petersen', () => generatePetersen()]
    ]);

    const functions = new Map([
        ['graph', [1, GraphParserToken.Number, (n: number) => new MutableGraph(n)]],
        //['digraph', (n: number) => new Digraph(n)]
        ['path', [1, GraphParserToken.Number, (n: number) => new MutableGraph(n).addPath(...range(n))]],
        ['clique', [1, GraphParserToken.Number, (n: number) => new MutableGraph(n).addClique(...range(n))]],
        //['grid', [1, GraphParserToken.Number, (n: number, m: number) => new Graph('G' + n + ',' + m)]],
        ['star', [1, GraphParserToken.Number, (n: number) => new MutableGraph(1).join(new MutableGraph(n))]],
        ['cycle', [1, GraphParserToken.Number, (n: number) => new MutableGraph(n).addCycle(...range(n))]],
        ['biclique', [1, GraphParserToken.Number, (n: number, m: number) => new MutableGraph(n).join(new MutableGraph(m))]],
        ['sun', [1, GraphParserToken.Number, (n: number) => generateSun(n)]]
    ]);

    const methods = new Map([
        ['addEdge', [2, GraphParserToken.Number]],
        ['addClique', [-1, GraphParserToken.Number]],
        ['addPath', [-1, GraphParserToken.Number]],
        ['addCycle', [-1, GraphParserToken.Number]],
        ['addEdges', [-1, GraphParserToken.Edge]],
        ['complement', [0, GraphParserToken.Number]],
        ['lineGraph', [0, GraphParserToken.Number]],
        ['union', [1, GraphParserToken.Graph]],
        ['join', [1, GraphParserToken.Graph]],
    ]);


    const stack: [GraphParserToken, any][] = [];
    let lastToken: GraphLexerToken = GraphLexerToken.Begin;
    let topToken = GraphParserToken.Begin;
    for (const [token, value] of lexer(str)) {
        if (stack.length > 0)
            topToken = stack[stack.length - 1][0];
        if (token === GraphLexerToken.Number) {
            if (![GraphLexerToken.Comma, GraphLexerToken.LeftParen].includes(lastToken)) {
                return 'syntax error';
            } else {
                stack.push([GraphParserToken.Number, value]);
            }
        }

        else if (token === GraphLexerToken.Edge) {
            if (![GraphLexerToken.Comma, GraphLexerToken.LeftParen].includes(lastToken)) {
                return 'syntax error';
            } else {
                stack.push([GraphParserToken.Edge, value]);
            }
        }

        else if (token === GraphLexerToken.LeftParen) {
            if (![GraphParserToken.Function, GraphParserToken.Method].includes(topToken) ||
                lastToken === GraphLexerToken.LeftParen) {
                return 'syntax error';
            }
        }
        else if (token === GraphLexerToken.Comma) {
            if (![GraphParserToken.Graph, GraphParserToken.Number, GraphParserToken.Edge].includes(topToken) ||
                lastToken === GraphLexerToken.Comma) {
                return 'syntax error';
            }
        }

        else if (token === GraphLexerToken.Litteral) {
            if (![GraphLexerToken.Comma, GraphLexerToken.LeftParen, GraphLexerToken.Begin].includes(lastToken)) {
                return 'syntax error';
            } else if (constants.has(value)) {
                const graph = constants.get(value)!();
                stack.push([GraphParserToken.Graph, graph]);
            } else if (functions.has(value)) {
                stack.push([GraphParserToken.Function, value]);
            } else {
                return 'function not found: ' + value;
            }
        }
        else if (token === GraphLexerToken.Method) {
            if (topToken !== GraphParserToken.Graph) {
                return 'syntax error';
            } else if (!methods.has(value)) {
                return 'method not found: ' + value;
            } else {
                stack.push([GraphParserToken.Method, value]);
            }
        }

        else if (token === GraphLexerToken.RightParen) {
            const parameters: [GraphParserToken, any][] = [];
            while (stack.length >= 2 && ![GraphParserToken.Method, GraphParserToken.Method].includes(stack[stack.length - 1][0])) {
                const parameter = stack.pop();
                parameters.unshift(parameter as [GraphParserToken, any]);
            }
            if (stack.length === 0) {
                return 'unexpected error';
            } else {
                const [type, fname] = stack.pop() as [GraphParserToken, string];
                if (type === GraphParserToken.Function) {
                    const [arity, type, fn] = functions.get(fname)!;
                    if (parameters.length !== arity) {
                        return 'invalid number of arguments: ' + fname;
                    } else if (!parameters.every((p) => p[0] === type)) {
                        return 'invalid argument types: ' + fname;
                    } else {
                        const rgraph = (fn as (...x: any[]) => Graph)(...parameters.map(x => x[1]));
                        stack.push([GraphParserToken.Graph, rgraph]);
                    }
                } else {
                    const graph = stack.pop()![1] as Graph;

                    const [arity, type] = methods.get(fname)!;
                    if (parameters.length !== arity && arity !== -1) {
                        return 'invalid number of arguments: ' + fname;
                    } else if (!parameters.every((p) => p[0] === type)) {
                        return 'invalid argument types: ' + fname;
                    } else {
                        const rgraph = (graph as any)[fname](...parameters.map(x => x[1]));
                        stack.push([GraphParserToken.Graph, rgraph]);
                    }
                }
            }
        }
        else if (token === GraphLexerToken.Error) {
            return "lexer error";
        }
        lastToken = token;
    }
    if (stack.length !== 1)
        return 'unexcepted error';
    else {
        const [type, res] = stack.pop()!;
        if (type !== GraphParserToken.Graph)
            return 'invalid type';
        else
            return res;
    }
}

export default parse;