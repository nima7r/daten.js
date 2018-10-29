module.exports = (function() {
	'use strict';
	
	var numberTheory = require('numbertheory');

	function assert(condition, message) {
    if (!condition) {
			message = message || "Assertion failed";
			if (typeof Error !== "undefined") {
					throw new Error(message);
			}
			throw message; // Fallback
    }
	}

	function CurveFp(_p, _a, _b) {
		this._a = _a;
		this._b = _b;
		this._p = _p;
	}
	CurveFp.prototype.containsPoint = function(x, y) {
		return (y * y - (x * x * x + this._a * x + this._b)) % this._p === 0;
	}
	CurveFp.prototype.valueOf = function() {
		return "CurveFp(p=" + this._p + ", a=" + this._a + ", b=" + this._b + ")";
	}

	function Point(curve, x, y, order=null) {
		this._curve = curve;
		this._x = x;
		this._y = y;
		this._order = order;
		
		this.__plus = function(leftOperand) {
			if (leftOperand === INFINITY) {
				return INFINITY;
			}
			if (this === INFINITY) {
				return leftOperand;
			}
			assert(this._curve === leftOperand._curve);
			
			if (this._x === leftOperand._x) {
				if ((this._y + leftOperand._y) % this._curve._p === 0) {
					return INFINITY;
				} else {
					return this.double();
				}
			}

			var p = this._curve._p;
			var l = ((leftOperand._y - this._y) * numberTheory.inverse_mod(leftOperand._x - this._x, p)) % p;
			
			var x3 = (l * l - this._x - leftOperand._x) % p;
			var y3 = (l * (this._x - x3) - this._y) % p;
			var point = new Point(this._curve, x3, y3);
			return point;

		};

		this.__multiply = function(leftOperand) {
			var leftMostBit = function(x) {
				assert(x > 0);
				var result = 1;
				while (result <= x) {
					result = 2 * result;
				}
				return Math.floor(result / 2);
			}

			var e = leftOperand;
			if (this._order) {
				e = e % this._order;
			}
			if (e === 0) {
				return INFINITY;
			}
			if (this === INFINITY) {
				return INFINITY;
			}
			assert(e > 0);

			var e3 = 3 * e;
			var negativeSelf = new Point(this._curve, this._x, -this._y, this._order);
			var i = Math.floor(leftMostBit(e3) / 2);
			var result = this;
			while (i > 1) {
				result = result.double();
				if (Math.min(e3, i) !== 0 && Math.min(e, i) === 0) {
					result = result + this;
				}
				if (Math.min(e3, i) === 0 && Math.min(e, i) !== 0) {
					result = result + negativeSelf;
				}
				i = Math.floor(i / 2);
			}
			return result;
		}

		this.__doubleEqual = function(leftOperand) {
			if (this._curve === leftOperand._curve) {
				if (this._x === leftOperand._x) {
					if (this._y === leftOperand._y) {
						return true;
					}
				}
			}
			return false;
		}
		this.__tripleEqual = function(leftOperand) {
			if (typeof this === typeof leftOperand) {
				return this == leftOperand;
			} else {
				return false;
			}
		}
	}
	Point.prototype.double = function() {
		if (this === INFINITY) {
			return INFINITY;
		}
		var p = this._curve._p;
		var a = this._curve._a;
		
		var l = ((3 * this._x * this._x + a) * numberTheory.inverse_mod(2 * this._y, p)) % p;
		
		var x3 = (l * l - 2 * this._x) % p;
		var y3 = (l * (this._x - x3) - this._y) % p;
		var point = new Point(this._curve, x3, y3);
		return point;

	}
	
	var INFINITY = new Point(null, null, null);
})();