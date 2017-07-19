'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Link component is responsible for encapsulating link render.
 * @example
 * const onClickLink = function(source, target) {
 *      window.alert(`Clicked link between ${source} and ${target}`);
 * };
 *
 * <Link
 *     source='idSourceNode'
 *     target='idTargetNode'
 *     x1=22
 *     y1=22
 *     x2=22
 *     y2=22
 *     strokeWidth=1.5
 *     stroke='green'
 *     className='link'
 *     opacity=1
 *     onClickLink={onClickLink} />
 */
var Link = function (_React$Component) {
    _inherits(Link, _React$Component);

    function Link() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Link);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Link.__proto__ || Object.getPrototypeOf(Link)).call.apply(_ref, [this].concat(args))), _this), _this.handleOnClickLink = function () {
            return _this.props.onClickLink && _this.props.onClickLink(_this.props.source, _this.props.target);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }
    /**
     * Handle link click event.
     * @return {undefined}
     */


    _createClass(Link, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            // Properties more likely to mutate are evaluated first to take advantage of short-circuit evaluation
            return nextProps.x1 !== this.props.x1 || nextProps.y1 !== this.props.y1 || nextProps.x2 !== this.props.x2 || nextProps.y2 !== this.props.y2 || nextProps.opacity !== this.props.opacity || nextProps.stroke !== this.props.stroke || nextProps.strokeWidth !== this.props.strokeWidth || nextProps.color !== this.props.color;
        }
    }, {
        key: 'render',
        value: function render() {
            var lineStyle = {
                strokeWidth: this.props.strokeWidth,
                stroke: this.props.stroke,
                opacity: this.props.opacity
            };

            // console.log(this.props)

            var x1 = parseFloat(this.props.x1);
            var x2 = parseFloat(this.props.x2);
            var y1 = parseFloat(this.props.y1);
            var y2 = parseFloat(this.props.y2);

            var deltaX = x2 - x1;
            var deltaY = y2 - y1;
            var dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            var normX = deltaX / dist;
            var normY = deltaY / dist;
            // var targetPadding = 16.0; 120 16
            
            var k = 0.013594737
            var b = 14.3626315
            var targetPadding = k * this.props.targetSize + b;
            targetPadding += lineStyle.strokeWidth * 4.5 - this.props.targetSize / 150

            var lineProps = {
                className: this.props.className,
                onClick: this.handleOnClickLink,
                style: lineStyle,
                x1: this.props.x1,
                // x2: this.props.x2,
                x2: x2 - (targetPadding * normX),
                y1: this.props.y1,
                y2: y2 - (targetPadding * normY),
                // y2: this.props.y2,
                markerEnd: "url(#arrow-" + this.props.stroke + ")"
            };

            return _react2.default.createElement('line', lineProps);
        }
    }]);

    return Link;
}(_react2.default.Component);

exports.default = Link;