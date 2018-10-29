module.exports = (function () {
	'use strict';

	function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
	}

  function divmod(x, y) {
		var div = Math.trunc(x/y);
		var rem = x % y;
		return [div, rem];
	}

	function inverse_mod(a, m) {
		if (a < 0 || m <= a) {
			a = a % m;
		}
		var c = a;
		var d = m;
		var uc = 1, vc = 0, ud = 0, vd = 1;
		while (c !== 0) {
			var dm = divmod(d, c);
			var q = dm[0];
			c_t = dm[1];
			d = c;
			c = c_t;

			uc_t = ud - q * uc;
			vc_t = vd - q;
			ud = uc;
			uc = uc_t;
			vd = vc;
			vc = vc_t;

			assert(d === 1);
			if (ud > 0) {
				return ud;
			}
			return ud + m;

		}
	}
})();