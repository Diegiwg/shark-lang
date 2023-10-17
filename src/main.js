#!/usr/bin/env node

import fs from "fs";

const Args = {
    /**
     * @private
     * @type {string[]}
     */
    _args: process.argv.slice(2),

    /**
     * @readonly
     * @type {string}
     */
    cliPath: process.argv[1],

    peek: function () {
        if (this._args.length === 0) return null;

        return this._args.shift();
    },
};

const TokensType = {
    KEYWORD: "keyword",
    IDENTIFIER: "identifier",
    LITERAL_STRING: "literal_string",
    LITERAL_NUMBER: "literal_number",

    OPEN_PARENTHESIS: "open_parenthesis",
    CLOSE_PARENTHESIS: "close_parenthesis",
    OPEN_BRACE: "open_brace",
    CLOSE_BRACE: "close_brace",

    EQUALS: "equals",
    SEMICOLON: "semicolon",
};

const Specials = ["(", ")", "{", "}", ";"];
const Keywords = ["var", "func"];

/**
 * @param {string} source
 */
function parse(source) {
    function peek() {
        const token = source[0];
        source = source.slice(1);
        return token;
    }

    const tokens = [];

    while (source.length > 0) {
        const token = peek();

        switch (token) {
            case "(": {
                tokens.push({
                    type: TokensType.OPEN_PARENTHESIS,
                });

                break;
            }

            case ")": {
                tokens.push({
                    type: TokensType.CLOSE_PARENTHESIS,
                });

                break;
            }

            case "{": {
                tokens.push({
                    type: TokensType.OPEN_BRACE,
                });

                break;
            }

            case "}": {
                tokens.push({
                    type: TokensType.CLOSE_BRACE,
                });

                break;
            }

            case "=": {
                tokens.push({
                    type: TokensType.EQUALS,
                });

                break;
            }

            case ";": {
                tokens.push({
                    type: TokensType.SEMICOLON,
                });

                break;
            }

            case '"': {
                let value = "";

                for (let c = peek(); c !== '"'; c = peek()) {
                    value += c;
                }

                tokens.push({
                    type: TokensType.LITERAL_STRING,
                    value,
                });

                break;
            }

            case " ": {
                break;
            }

            default:
                {
                    // \r \n \t trim()
                    if (token === "\r" || token === "\n" || token === "\t") {
                        break;
                    }
                    // number
                    else if (token.search(/[0-9]/) === 0) {
                        let num = token;

                        while (true) {
                            const c = source[0];

                            if (c === "." && num.includes(".")) break;
                            if (c.search(/[.0-9]/) === -1) break;

                            num += peek();
                        }

                        tokens.push({
                            type: TokensType.LITERAL_NUMBER,
                            value: num.includes(".")
                                ? parseFloat(num)
                                : parseInt(num),
                        });
                    }
                    // identifier or keyword
                    else {
                        let name = token;

                        while (true) {
                            const c = source[0];

                            if (Specials.includes(c)) break;
                            if (c === " ") break;

                            name += peek();
                        }

                        if (Keywords.includes(name)) {
                            tokens.push({
                                type: TokensType.KEYWORD,
                                value: name,
                            });
                        } else {
                            tokens.push({
                                type: TokensType.IDENTIFIER,
                                value: name,
                            });
                        }
                    }
                }
                break;
        }
    }

    return tokens;
}

// CLI entry point
(function () {
    // Ver se foi passado o source <file.sl>

    const file = Args.peek();

    if (file === null) {
        console.log(`Error: is necessary to pass the source file.`);
        process.exit(1);
    }

    if (file.endsWith(".sl") === false) {
        console.log(`Error: ${file} is not a source file.`);
        process.exit(1);
    }

    if (!fs.existsSync(file)) {
        console.log(`Error: ${file} does not exist.`);
        process.exit(1);
    }

    const source = fs.readFileSync(file, {
        flag: "r",
        encoding: "utf-8",
    });

    console.log(parse(source));
})();
