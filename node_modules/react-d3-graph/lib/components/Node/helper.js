'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _const = require('./const');

var _const2 = _interopRequireDefault(_const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Converts a string that specifies a symbol into a concrete instance
 * of d3 symbol.<br/>
 * {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol}
 * @param  {string} typeName - the string that specifies the symbol type (should be one of {@link #node-symbol-type|node.symbolType}).
 * @return {Object} concrete instance of d3 symbol.
 * @memberof Node/helper
 */
/**
 * @module Node/helper
 * @description
 * Some methods that help no the process of rendering a node.
 */
function _convertTypeToD3Symbol(typeName) {
    switch (typeName) {
        case _const2.default.SYMBOLS.CIRCLE:
            return d3.symbolCircle;
        case _const2.default.SYMBOLS.CROSS:
            return d3.symbolCross;
        case _const2.default.SYMBOLS.DIAMOND:
            return d3.symbolDiamond;
        case _const2.default.SYMBOLS.SQUARE:
            return d3.symbolSquare;
        case _const2.default.SYMBOLS.STAR:
            return d3.symbolStar;
        case _const2.default.SYMBOLS.TRIANGLE:
            return d3.symbolTriangle;
        case _const2.default.SYMBOLS.WYE:
            return d3.symbolWye;
        default:
            return d3.symbolTriangle;
    }
}

/**
 * Build a d3 svg symbol based on passed symbol and symbol type.
 * @param  {number} [size=80] - the size of the symbol.
 * @param  {string} [symbolTypeDesc='circle'] - the string containing the type of symbol that we want to build
 * (should be one of {@link #node-symbol-type|node.symbolType}).
 * @return {Object} concrete instance of d3 symbol.
 * @memberof Node/helper
 */
function buildSvgSymbol() {
    var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 80;
    var symbolTypeDesc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _const2.default.SYMBOLS.CIRCLE;

    return d3.symbol().size(function () {
        return size;
    }).type(function () {
        return _convertTypeToD3Symbol(symbolTypeDesc);
    })(); // @todo: Strange behavior d3.Symbol ret function
}

exports.default = {
    buildSvgSymbol: buildSvgSymbol
};