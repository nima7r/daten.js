var ellipticcurve = require('ellipticcurve');

var _a = "0x0000000000000000000000000000000000000000000000000000000000000000";
var _b = "0x0000000000000000000000000000000000000000000000000000000000000007";
var _p = "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f";
var _Gx = "0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798";
var _Gy = "0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8";
var _r = "0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141";

var curve_secp256k1 = ellipticcurve.CurveFp(_p, _a, _b);
var generator_secp256k1 = ellipticcurve.Point(curve_secp256k1, _Gx, _Gy, _r);