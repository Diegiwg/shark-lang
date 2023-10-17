import { Keywords, Specials, TokensType } from "./models.js";

function parseKeyword(keyword) {
    switch (keyword) {
        case "var": {
            return "var";
        }

        case "func": {
            return "function";
        }

        case "print": {
            return "console.log";
        }
    }
}

/**
 *
 * @param {{type: TokensType, value: string}} tokens
 */
export function compiler(tokens) {
    let javascriptCode = "";

    for (; tokens.length > 0; ) {
        const token = tokens.shift();

        switch (token.type) {
            case TokensType.KEYWORD:
                javascriptCode += parseKeyword(token.value) + " ";
                break;
            case TokensType.IDENTIFIER:
                javascriptCode += token.value;
                break;
            case TokensType.LITERAL_STRING:
                javascriptCode += `"${token.value}"`;
                break;
            case TokensType.LITERAL_NUMBER:
                javascriptCode += token.value;
                break;
            case TokensType.OPEN_PARENTHESIS:
                javascriptCode += "(";
                break;
            case TokensType.CLOSE_PARENTHESIS:
                javascriptCode += ")";
                break;
            case TokensType.CLOSE_BRACE:
                javascriptCode += "}";
                break;
            case TokensType.OPEN_BRACE:
                javascriptCode += "{";
                break;

            case TokensType.SEMICOLON:
                javascriptCode += "; ";
                break;
            case TokensType.EQUALS:
                javascriptCode += " = ";
                break;
        }
    }

    return javascriptCode;
}
