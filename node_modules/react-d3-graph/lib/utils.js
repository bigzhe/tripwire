'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @module utils
 * @description
 * Offers a series of generic methods for object manipulation, and other operations
 * that are common across rd3g such as error logging.
 */

// This variable assures that recursive methods such as merge and isEqual do not fall on
// circular JSON structure evaluation.
var MAX_DEPTH = 5;

/**
 * Checks whether a certain object property is from object type and is a non empty object.
 * @param  {Object} o - the object.
 * @param  {number|string} k - the object property.
 * @return {boolean} returns true if o[k] is an non empty object.
 * @memberof utils
 */
function _isPropertyNestedObject(o, k) {
    return o.hasOwnProperty(k) && _typeof(o[k]) === 'object' && o[k] !== null && !isObjectEmpty(o[k]);
}

/**
 * Generic deep comparison between javascript simple or complex objects.
 * @param  {Object} o1 - one of the objects to be compared.
 * @param  {Object} o2 - second object to compare with first.
 * @param  {number} [_depth=0] - this parameter serves only for internal usage.
 * @memberof utils
 * @return {boolean} returns true if o1 and o2 have exactly the same content, or are exactly the same object reference.
 */
function isEqual(o1, o2) {
    var _depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    var diffs = [];

    if (_depth === 0 && o1 === o2) {
        return true;
    }

    if (isObjectEmpty(o1) && !isObjectEmpty(o2) || !isObjectEmpty(o1) && isObjectEmpty(o2)) {
        return false;
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.keys(o1)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var k = _step.value;

            var nestedO = _isPropertyNestedObject(o1, k) && _isPropertyNestedObject(o2, k);

            if (nestedO && _depth < MAX_DEPTH) {
                diffs.push(isEqual(o1[k], o2[k], _depth + 1));
            } else {
                var r = isObjectEmpty(o1[k]) && isObjectEmpty(o2[k]) || o2.hasOwnProperty(k) && o2[k] === o1[k];

                diffs.push(r);

                if (!r) {
                    break;
                }
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return diffs.indexOf(false) === -1;
}

/**
 * Checks whether or not a certain object is empty.
 * NOTE: If the passed parameter is not an object the method return false.
 * @param  {Object}  o - object whom emptiness we want to check.
 * @return {boolean} true if the given object is n ft and object and is empty.
 * @memberof utils
 */
function isObjectEmpty(o) {
    return !!o && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && !Object.keys(o).length;
}

/**
 * This function merges two objects o1 and o2, where o2 properties override existent o1 properties, and
 * if o2 doesn't posses some o1 property the function will fallback to the o1 property.
 * @param  {Object} o1 - object.
 * @param  {Object} o2 - object that will override o1 properties.
 * @memberof utils
 * @param  {int} [_depth=0] - the depth at which we are merging the object.
 * @return {Object} object that is the result of merging o1 and o2, being o2 properties priority overriding
 * existent o1 properties.
 */
function merge() {
    var o1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var o2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    var o = {};

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = Object.keys(o1)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var k = _step2.value;

            var nestedO = o2[k] && _typeof(o2[k]) === 'object' && _typeof(o1[k]) === 'object' && _depth < MAX_DEPTH;

            if (nestedO) {
                o[k] = merge(o1[k], o2[k], _depth + 1);
            } else {
                o[k] = o2.hasOwnProperty(k) ? o2[k] : o1[k];
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return o;
}

/**
 * Helper function for customized error logging.
 * @param  {string} component - the name of the component where the error is to be thrown.
 * @param  {string} msg - the message contain a more detailed explanation about the error.
 * @return {Error} the thrown error.
 * @memberof utils
 */
function throwErr(component, msg) {
    var error = 'react-d3-graph :: ' + component + ' :: ' + msg;

    throw Error(error);
}

exports.default = {
    isEqual: isEqual,
    isObjectEmpty: isObjectEmpty,
    merge: merge,
    throwErr: throwErr
};