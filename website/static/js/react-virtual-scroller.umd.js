(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
	(factory((global.VirtualScroller = {}),global.React));
}(this, (function (exports,React) { 'use strict';

React = React && React.hasOwnProperty('default') ? React['default'] : React;

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

var emptyFunction_1 = emptyFunction;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

{
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

var invariant_1 = invariant;

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction_1;

{
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

var warning_1 = warning;

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

{
  var invariant$1 = invariant_1;
  var warning$1 = warning_1;
  var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant$1(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
        } catch (ex) {
          error = ex;
        }
        warning$1(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning$1(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

var checkPropTypes_1 = checkPropTypes;

var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret_1) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant_1(
            false,
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
        } else if ("development" !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            warning_1(
              false,
              'You are manually calling a React.PropTypes validation ' +
              'function for the `%s` prop on `%s`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
              propFullName,
              componentName
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction_1.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      warning_1(false, 'Invalid argument supplied to oneOf, expected an instance of array.');
      return emptyFunction_1.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      warning_1(false, 'Invalid argument supplied to oneOfType, expected an instance of array.');
      return emptyFunction_1.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        warning_1(
          false,
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received %s at index %s.',
          getPostfixForTypeWarning(checker),
          i
        );
        return emptyFunction_1.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = objectAssign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes_1;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

{
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = factoryWithTypeCheckers(isValidElement, throwOnDirectAccess);
}
});

var lib = createCommonjsModule(function (module, exports) {
exports.__esModule = true;
exports.defaultMemoize = defaultMemoize;
exports.createSelectorCreator = createSelectorCreator;
exports.createStructuredSelector = createStructuredSelector;
function defaultEqualityCheck(a, b) {
  return a === b;
}

function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
  if (prev === null || next === null || prev.length !== next.length) {
    return false;
  }

  // Do this in a for loop (and not a `forEach` or an `every`) so we can determine equality as fast as possible.
  var length = prev.length;
  for (var i = 0; i < length; i++) {
    if (!equalityCheck(prev[i], next[i])) {
      return false;
    }
  }

  return true;
}

function defaultMemoize(func) {
  var equalityCheck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultEqualityCheck;

  var lastArgs = null;
  var lastResult = null;
  // we reference arguments instead of spreading them for performance reasons
  return function () {
    if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
      // apply arguments instead of spreading for performance.
      lastResult = func.apply(null, arguments);
    }

    lastArgs = arguments;
    return lastResult;
  };
}

function getDependencies(funcs) {
  var dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs;

  if (!dependencies.every(function (dep) {
    return typeof dep === 'function';
  })) {
    var dependencyTypes = dependencies.map(function (dep) {
      return typeof dep;
    }).join(', ');
    throw new Error('Selector creators expect all input-selectors to be functions, ' + ('instead received the following types: [' + dependencyTypes + ']'));
  }

  return dependencies;
}

function createSelectorCreator(memoize) {
  for (var _len = arguments.length, memoizeOptions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    memoizeOptions[_key - 1] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, funcs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      funcs[_key2] = arguments[_key2];
    }

    var recomputations = 0;
    var resultFunc = funcs.pop();
    var dependencies = getDependencies(funcs);

    var memoizedResultFunc = memoize.apply(undefined, [function () {
      recomputations++;
      // apply arguments instead of spreading for performance.
      return resultFunc.apply(null, arguments);
    }].concat(memoizeOptions));

    // If a selector is called with the exact same arguments we don't need to traverse our dependencies again.
    var selector = defaultMemoize(function () {
      var params = [];
      var length = dependencies.length;

      for (var i = 0; i < length; i++) {
        // apply arguments instead of spreading and mutate a local list of params for performance.
        params.push(dependencies[i].apply(null, arguments));
      }

      // apply arguments instead of spreading for performance.
      return memoizedResultFunc.apply(null, params);
    });

    selector.resultFunc = resultFunc;
    selector.recomputations = function () {
      return recomputations;
    };
    selector.resetRecomputations = function () {
      return recomputations = 0;
    };
    return selector;
  };
}

var createSelector = exports.createSelector = createSelectorCreator(defaultMemoize);

function createStructuredSelector(selectors) {
  var selectorCreator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : createSelector;

  if (typeof selectors !== 'object') {
    throw new Error('createStructuredSelector expects first argument to be an object ' + ('where each property is a selector, instead received a ' + typeof selectors));
  }
  var objectKeys = Object.keys(selectors);
  return selectorCreator(objectKeys.map(function (key) {
    return selectors[key];
  }), function () {
    for (var _len3 = arguments.length, values = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      values[_key3] = arguments[_key3];
    }

    return values.reduce(function (composition, value, index) {
      composition[objectKeys[index]] = value;
      return composition;
    }, {});
  });
}
});

unwrapExports(lib);
var lib_1 = lib.defaultMemoize;
var lib_2 = lib.createSelectorCreator;
var lib_3 = lib.createStructuredSelector;
var lib_4 = lib.createSelector;

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

function defaultPicker(object) {
  return [object.props, object.state];
}

function createComputedCreater() {
  return function (instance) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var selector = lib_4.apply(undefined, args);

    var computed = function computed() {
      var overided = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : instance;
      return selector.apply(undefined, toConsumableArray(defaultPicker(overided)).concat([overided]));
    };

    return computed;
  };
}

var recomputed$1 = createComputedCreater(defaultPicker);

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;
var nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var lodash_throttle = throttle;

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var nullFunc = function nullFunc() {
  return null;
};

function defaultGetHeightForDomNode(node) {
  return node ? node.getBoundingClientRect().height : 0;
}

var List = function (_React$PureComponent) {
  inherits(List, _React$PureComponent);

  function List(props) {
    classCallCheck(this, List);

    var _this = possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));

    _this._refs = {};
    _this._handleViewRefUpdate = _this._handleViewRefUpdate.bind(_this);
    return _this;
  }

  createClass(List, [{
    key: '_handleViewRefUpdate',
    value: function _handleViewRefUpdate(ref) {
      this._view = ref;
    }
  }, {
    key: '_handleItemRefUpdate',
    value: function _handleItemRefUpdate(id, ref) {
      if (!ref) {
        delete this._refs[id];
      } else {
        this._refs[id] = ref;
      }
    }
  }, {
    key: '_renderContent',
    value: function _renderContent() {
      var _this2 = this;

      return this.props.list.map(function (item, index) {
        var id = item.id;
        var data = item.data;
        var reactElement = _this2.props.renderItem(data, index);
        var savedRefFunc = 'function' === typeof reactElement.ref ? reactElement.ref : nullFunc;
        return React.cloneElement(reactElement, {
          key: id,
          ref: function ref(r) {
            _this2._handleItemRefUpdate(id, r);
            savedRefFunc(r);
          }
        });
      });
    }
  }, {
    key: 'getWrapperNode',
    value: function getWrapperNode() {
      return this._view;
    }
  }, {
    key: 'getItemHeights',
    value: function getItemHeights() {
      var _this3 = this;

      var _props = this.props,
          list = _props.list,
          getHeightForDomNode = _props.getHeightForDomNode;


      return list.reduce(function (heightsMap, item) {
        var id = item.id;
        var node = _this3._refs[id];

        // eslint-disable-next-line no-param-reassign
        heightsMap[id] = getHeightForDomNode(node);
        return heightsMap;
      }, {});
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          blankSpaceAbove = _props2.blankSpaceAbove,
          blankSpaceBelow = _props2.blankSpaceBelow;


      return React.createElement(
        'div',
        {
          ref: this._handleViewRefUpdate,
          style: {
            paddingTop: blankSpaceAbove,
            paddingBottom: blankSpaceBelow
          },
          onScroll: this.handleScroll
        },
        this._renderContent()
      );
    }
  }]);
  return List;
}(React.PureComponent);

List.defaultProps = {
  getHeightForDomNode: defaultGetHeightForDomNode
};

function createScheduler(callback, scheduler) {
  var ticking = false;

  var update = function update() {
    ticking = false;
    callback();
  };

  var requestTick = function requestTick() {
    if (!ticking) {
      scheduler(update);
    }
    ticking = true;
  };

  return requestTick;
}

function findIndex(list, predictor) {
  var startIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  for (var index = 0 + startIndex; index < list.length; index++) {
    if (predictor(list[index], index)) {
      return index;
    }
  }

  return -1;
}

function searchIndexWhen(list, initSearchIndex, predicator) {
  if (initSearchIndex < 0 || initSearchIndex >= list.length) {
    return -1;
  }

  if (predicator(list[initSearchIndex])) {
    return initSearchIndex;
  }

  for (var step = 1;; step++) {
    var back = initSearchIndex - step;
    var forward = initSearchIndex + step;
    var illegal = back < 0;
    var outOfBound = forward >= list.length;
    if (illegal && outOfBound) {
      break;
    }
    if (!outOfBound && predicator(list[forward])) {
      return forward;
    }

    if (!illegal && predicator(list[back])) {
      return back;
    }
  }

  return -1;
}

function findNewSlice(originList, newList, sliceStart, sliceEnd) {
  var newIds = newList.reduce(function (ids, item) {
    // eslint-disable-next-line no-param-reassign
    ids[item.id] = true;
    return ids;
  }, {});

  var commonItemIndex = searchIndexWhen(originList, sliceStart, function (item) {
    return newIds[item.id];
  });
  if (-1 === commonItemIndex) {
    return null;
  }

  var newSliceStart = findIndex(newList, function (item) {
    return originList[commonItemIndex].id === item.id;
  });

  return {
    sliceStart: newSliceStart,
    sliceEnd: Math.min(newList.length, newSliceStart + sliceEnd - sliceStart)
  };
}

function isBetween(value, begin, end) {
  return value >= begin && value < end;
}

var Rectangle = function () {
  function Rectangle() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$top = _ref.top,
        top = _ref$top === undefined ? 0 : _ref$top,
        _ref$left = _ref.left,
        left = _ref$left === undefined ? 0 : _ref$left,
        _ref$height = _ref.height,
        height = _ref$height === undefined ? 0 : _ref$height,
        _ref$width = _ref.width,
        width = _ref$width === undefined ? 0 : _ref$width;

    classCallCheck(this, Rectangle);

    this._top = top;
    this._left = left;
    this._height = height;
    this._width = width;
  }

  createClass(Rectangle, [{
    key: "getTop",
    value: function getTop() {
      return this._top;
    }
  }, {
    key: "getBottom",
    value: function getBottom() {
      return this._top + this._height;
    }
  }, {
    key: "getLeft",
    value: function getLeft() {
      return this._left;
    }
  }, {
    key: "getRight",
    value: function getRight() {
      return this._left + this._width;
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      return this._height;
    }
  }, {
    key: "getWidth",
    value: function getWidth() {
      return this._width;
    }
  }, {
    key: "doesIntersectWith",
    value: function doesIntersectWith(rect) {
      var top = this.getTop();
      var bottom = this.getBottom();
      var left = this.getLeft();
      var right = this.getRight();
      var aTop = rect.getTop();
      var aBottom = rect.getBottom();
      var aLeft = rect.getLeft();
      var aRight = rect.getRight();

      return isBetween(top, aTop, aBottom) || isBetween(aTop, top, bottom) || isBetween(left, aLeft, aRight) || isBetween(aLeft, left, right);
    }
  }, {
    key: "contains",
    value: function contains(point) {
      if (point.x === undefined) {
        return isBetween(point.y, this.getTop(), this.getBottom());
      } else if (point.y === undefined) {
        return isBetween(point.x, this.getLeft(), this.getRight());
      } else {
        return isBetween(point.y, this.getTop(), this.getBottom()) && isBetween(point.x, this.getLeft(), this.getRight());
      }
    }
  }, {
    key: "translateBy",
    value: function translateBy(x, y) {
      var left = this.getLeft();
      var top = this.getTop();

      if (x) {
        left += x;
      }

      if (y) {
        top += y;
      }

      return new Rectangle({
        left: left,
        top: top,
        width: this.getWidth(),
        height: this.getHeight()
      });
    }
  }]);
  return Rectangle;
}();

var Position = function () {
  function Position(_ref) {
    var viewportRectangle = _ref.viewportRectangle,
        list = _ref.list,
        rectangles = _ref.rectangles,
        sliceStart = _ref.sliceStart,
        sliceEnd = _ref.sliceEnd;
    classCallCheck(this, Position);

    this._viewportRectangle = viewportRectangle;
    this._list = list;
    this._rectangles = rectangles;
    this._sliceStart = sliceStart;
    this._sliceEnd = sliceEnd;
  }

  createClass(Position, [{
    key: 'getViewportRect',
    value: function getViewportRect() {
      return this._viewportRectangle;
    }
  }, {
    key: 'getListRect',
    value: function getListRect() {
      var list = this._list;
      if (list.length <= 0) {
        return new Rectangle({
          top: 0,
          height: 0
        });
      }
      return this._viewportRectangle;
    }
  }, {
    key: 'getAllItems',
    value: function getAllItems() {
      var _this = this;

      return this._list.map(function (item) {
        var id = item.id;
        return {
          id: id,
          rectangle: _this._rectangles[id]
        };
      });
    }
  }, {
    key: 'getList',
    value: function getList() {
      return this._list;
    }
  }, {
    key: 'getItemRect',
    value: function getItemRect(id) {
      return this._rectangles[id];
    }
  }, {
    key: 'findVisibleItems',
    value: function findVisibleItems() {
      var _this2 = this;

      var viewportRectangle = this._viewportRectangle;
      var rectangles = this._rectangles;
      var list = this._list;
      var startIndex = findIndex(list, function (item) {
        var id = item.id;
        return rectangles[id].doesIntersectWith(viewportRectangle);
      });
      if (startIndex < 0) {
        return [];
      }

      var endIndex = findIndex(list, function (item) {
        var id = item.id;
        return !rectangles[id].doesIntersectWith(viewportRectangle);
      }, startIndex);
      if (endIndex < 0) {
        endIndex = list.length;
      }

      return list.slice(startIndex, endIndex).filter(function (item) {
        var id = item.id;
        return _this2.isRendered(id);
      }).map(function (item) {
        var id = item.id;
        return {
          id: id,
          rectangle: rectangles[id]
        };
      });
    }
  }, {
    key: 'getRenderedItems',
    value: function getRenderedItems() {
      var rectangles = this._rectangles;
      return this._list.slice(this._sliceStart, this._sliceEnd).map(function (item) {
        var id = item.id;
        return {
          id: id,
          rectangle: rectangles[id]
        };
      });
    }
  }, {
    key: 'isRendered',
    value: function isRendered(id) {
      return this._getRenderedIdSet().hasOwnProperty(id);
    }
  }, {
    key: '_getRenderedIdSet',
    value: function _getRenderedIdSet() {
      if (!this._renderedIdSet) {
        this._renderedIdSet = {};
        for (var t = this._sliceStart; t < this._sliceEnd; t++) {
          this._renderedIdSet[this._list[t].id] = true;
        }
      }

      return this._renderedIdSet;
    }
  }]);
  return Position;
}();

var Viewport = function () {
  function Viewport(window) {
    var scroller = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
    classCallCheck(this, Viewport);

    this._scroller = scroller;
    this._window = window;
    this._programticScrollListeners = [];
    this._offsetTop = 0;
    this._useWindow = this._scroller === this._window;
  }

  createClass(Viewport, [{
    key: '_getScrollerHeight',
    value: function _getScrollerHeight() {
      if (this._useWindow) {
        return Math.ceil(this._window.document.documentElement.clientHeight);
      }

      return this._scroller.clientHeight;
    }
  }, {
    key: '_addListener',
    value: function _addListener(event, listener, useWindow) {
      var target = useWindow ? this._window : this._scroller;

      var eventCallback = function eventCallback() {
        return listener();
      };

      target.addEventListener(event, eventCallback);

      return function () {
        target.removeEventListener(event, eventCallback);
      };
    }
  }, {
    key: 'getRectRelativeTo',
    value: function getRectRelativeTo(node) {
      var top = node.getBoundingClientRect().top;
      var scrollerTop = this._useWindow ? 0 : this._scroller.getBoundingClientRect().top;

      return this.getRect().translateBy(0, Math.ceil(scrollerTop - top));
    }
  }, {
    key: 'setOffsetTop',
    value: function setOffsetTop(value) {
      this._offsetTop = value;
    }
  }, {
    key: 'getRect',
    value: function getRect() {
      var windowHeight = this._getScrollerHeight();
      var height = Math.max(0, windowHeight - this._offsetTop);
      return new Rectangle({ top: this._offsetTop, height: height });
    }

    // get scroll left

  }, {
    key: 'scrollX',
    value: function scrollX() {
      if (this._useWindow) {
        return -1 * this._window.document.body.getBoundingClientRect().left;
      }

      return this._scroller.scrollLeft;
    }

    // get scroll top

  }, {
    key: 'scrollY',
    value: function scrollY() {
      if (this._useWindow) {
        return -1 * this._window.document.body.getBoundingClientRect().top;
      }

      return this._scroller.scrollTop;
    }
  }, {
    key: 'scrollBy',
    value: function scrollBy(vertically) {
      if (this._useWindow) {
        this._window.scrollBy(0, vertically);
      } else {
        this._scroller.scrollTop += vertically;
      }

      this._programticScrollListeners.forEach(function (listener) {
        return listener(vertically);
      });
    }
  }, {
    key: 'addRectChangeListener',
    value: function addRectChangeListener(listener) {
      return this._addListener('resize', listener, true);
    }
  }, {
    key: 'addScrollListener',
    value: function addScrollListener(listener) {
      return this._addListener('scroll', listener, false);
    }

    // listener triggered by programmatic scroll

  }, {
    key: 'addProgrammaticScrollListener',
    value: function addProgrammaticScrollListener(listener) {
      var _this = this;

      if (this._programticScrollListeners.indexOf(listener) < 0) this._programticScrollListeners.push(listener);
      return function () {
        return _this.removeProgrammaticScrollListener(listener);
      };
    }
  }, {
    key: 'removeProgrammaticScrollListener',
    value: function removeProgrammaticScrollListener(listener) {
      var index = this._programticScrollListeners.indexOf(listener);
      if (index > -1) this._programticScrollListeners.splice(index, 1);
    }
  }]);
  return Viewport;
}();

function findAnchor(prevPos, nextPos) {
  var viewportRect = prevPos.getViewportRect();

  var findBest = function findBest(list, comparator) {
    if (list.length <= 0) {
      return null;
    }

    return list.reduce(function (best, item) {
      return comparator(item, best) > 0 ? item : best;
    });
  };

  var inViewport = function inViewport(rect) {
    return rect && rect.doesIntersectWith(viewportRect);
  };

  var distanceToViewportTop = function distanceToViewportTop(rect) {
    return rect ? Math.abs(viewportRect.getTop() - rect.getTop()) : 1 / 0;
  };

  var boolCompartor = function boolCompartor(getValue, a, b) {
    var aResult = getValue(a);
    var bResult = getValue(b);
    if (aResult && !bResult) {
      return 1;
    } else if (!aResult && bResult) {
      return -1;
    } else {
      return 0;
    }
  };

  var numberCompartor = function numberCompartor(getValue, a, b) {
    var aResult = getValue(a);
    var bResult = getValue(b);
    return bResult - aResult;
  };

  var bothRendered = nextPos.getList().filter(function (item) {
    var id = item.id;
    return prevPos.isRendered(id) && nextPos.isRendered(id);
  });

  if (bothRendered.length <= 0) {
    return null;
  }

  var theBest = findBest(bothRendered, function (current, best) {
    var item = prevPos.getItemRect(current.id);
    var bestItem = prevPos.getItemRect(best.id);
    return boolCompartor(inViewport, item, bestItem) || numberCompartor(distanceToViewportTop, item, bestItem);
  });

  return theBest;
}

function offsetCorrection(prevPos, nextPos) {
  var anchor = findAnchor(prevPos, nextPos);
  if (!anchor) {
    return 0;
  }

  var anchorId = anchor.id;
  var offsetToViewport = prevPos.getItemRect(anchorId).getTop() - prevPos.getViewportRect().getTop();
  return nextPos.getItemRect(anchorId).getTop() - nextPos.getViewportRect().getTop() - offsetToViewport;
}

function collectRect(list, heights, defaultHeight) {
  var rects = {};
  var top = 0;
  list.forEach(function (item) {
    var id = item.id;
    var height = heights[id] !== undefined ? heights[id] : defaultHeight;
    rects[id] = new Rectangle({
      top: top,
      height: height
    });

    // eslint-disable-next-line no-param-reassign
    top += height;
  });

  return rects;
}

var Updater = function (_React$PureComponent) {
  inherits(Updater, _React$PureComponent);

  function Updater(props) {
    classCallCheck(this, Updater);

    var _this = possibleConstructorReturn(this, (Updater.__proto__ || Object.getPrototypeOf(Updater)).call(this, props));

    _this._heights = {};

    /* eslint-disable no-shadow */
    _this._getRectangles = recomputed$1(_this, function (props) {
      return props.list;
    }, function (_, __, obj) {
      return obj._heights;
    }, function (props) {
      return props.assumedItemHeight;
    }, collectRect);

    _this._getSlice = recomputed$1(_this, function (props) {
      return props.list;
    }, function (_, state) {
      return state.sliceStart;
    }, function (_, state) {
      return state.sliceEnd;
    }, function (list, sliceStart, sliceEnd) {
      return list.slice(sliceStart, sliceEnd);
    });
    /* eslint-enable no-shadow */

    // $todo add initItemIndex props
    _this.state = _this._getDefaultSlice(props.list);

    _this._handleRefUpdate = _this._handleRefUpdate.bind(_this);
    _this._update = _this._update.bind(_this);

    _this._scheduleUpdate = createScheduler(_this._update, window.requestAnimationFrame);
    _this._handleScroll = lodash_throttle(_this._scheduleUpdate, 100, { trailing: true });
    return _this;
  }

  createClass(Updater, [{
    key: '_handleRefUpdate',
    value: function _handleRefUpdate(ref) {
      this._listRef = ref;
    }
  }, {
    key: '_onHeightsUpdate',
    value: function _onHeightsUpdate(prevPostion, nextPostion) {
      this.props.viewport.scrollBy(offsetCorrection(prevPostion, nextPostion));
    }
  }, {
    key: '_recordHeights',
    value: function _recordHeights() {
      var _this2 = this;

      if (!this._listRef) {
        return {
          heightDelta: 0
        };
      }

      var itemHeights = this._listRef.getItemHeights();

      var heightDelta = Object.keys(itemHeights).reduce(function (accHeight, key) {
        var itemHeight = _this2._heights.hasOwnProperty(key) ? _this2._heights[key] : _this2.props.assumedItemHeight;
        return accHeight + itemHeights[key] - itemHeight;
      }, 0);

      if (heightDelta !== 0) {
        this._heights = Object.assign({}, this._heights, itemHeights);
      }

      return {
        heightDelta: heightDelta
      };
    }
  }, {
    key: '_postRenderProcessing',
    value: function _postRenderProcessing(hasListChanged) {
      var heightState = this._recordHeights();
      var wasHeightChange = heightState.heightDelta !== 0;
      if ((hasListChanged || wasHeightChange) && this._prevPositioning) {
        this._onHeightsUpdate(this._prevPositioning, this.getPositioning());
      }

      if (hasListChanged || Math.abs(heightState.heightDelta) >= this.props.assumedItemHeight) {
        this._scheduleUpdate();
      }
    }
  }, {
    key: '_getDefaultSlice',
    value: function _getDefaultSlice(list) {
      var startIndex = 0;
      var withNewList = Object.assign({}, this, {
        props: Object.assign({}, this.props, {
          list: list
        })
      });

      var viewport = this.props.viewport;
      var viewportHeight = viewport.getRect().getHeight();
      var rects = this._getRectangles(withNewList);

      var startId = list[startIndex].id;
      var startOffset = rects[startId].getTop();
      var endIndex = findIndex(list, function (item) {
        return rects[item.id].getTop() - startOffset >= viewportHeight;
      }, startIndex);
      if (endIndex < 0) {
        endIndex = list.length;
      }

      return {
        sliceStart: startIndex,
        sliceEnd: endIndex
      };
    }
  }, {
    key: '_computeBlankSpace',
    value: function _computeBlankSpace() {
      var list = this.props.list;
      var _state = this.state,
          sliceStart = _state.sliceStart,
          sliceEnd = _state.sliceEnd;

      var rects = this._getRectangles();
      var lastIndex = list.length - 1;
      return {
        blankSpaceAbove: list.length <= 0 ? 0 : rects[list[sliceStart].id].getTop() - rects[list[0].id].getTop(),
        blankSpaceBelow: sliceEnd >= list.length ? 0 : rects[list[lastIndex].id].getBottom() - rects[list[sliceEnd].id].getTop()
      };
    }
  }, {
    key: '_getRelativeViewportRect',
    value: function _getRelativeViewportRect() {
      if (!this._listRef) {
        return new Rectangle({ top: 0, height: 0 });
      }

      var listNode = this._listRef.getWrapperNode();
      // const offsetTop = Math.ceil(listNode.getBoundingClientRect().top);
      return this.props.viewport.getRectRelativeTo(listNode);
    }
  }, {
    key: '_update',
    value: function _update() {
      var list = this.props.list;


      if (this._unmounted || 0 === list.length) {
        return;
      }

      var viewportRect = this._getRelativeViewportRect();
      var offscreenHeight = viewportRect.getHeight() * this.props.offscreenToViewportRatio;
      var renderRectTop = viewportRect.getTop() - offscreenHeight;
      var renderRectBottom = viewportRect.getBottom() + offscreenHeight;

      var rects = this._getRectangles();

      var startIndex = findIndex(list, function (item) {
        return rects[item.id].getBottom() > renderRectTop;
      });
      if (startIndex < 0) {
        startIndex = list.length - 1;
      }

      var endIndex = findIndex(list, function (item) {
        return rects[item.id].getTop() >= renderRectBottom;
      }, startIndex);
      if (endIndex < 0) {
        endIndex = list.length;
      }

      this._setSlice(startIndex, endIndex);
    }
  }, {
    key: '_setSlice',
    value: function _setSlice(start, end) {
      var _state2 = this.state,
          sliceStart = _state2.sliceStart,
          sliceEnd = _state2.sliceEnd;


      if (sliceStart !== start || sliceEnd !== end) {
        this.setState({
          sliceStart: start,
          sliceEnd: end
        });
      }
    }
  }, {
    key: 'getPositioning',
    value: function getPositioning() {
      var _state3 = this.state,
          sliceStart = _state3.sliceStart,
          sliceEnd = _state3.sliceEnd;

      return new Position({
        viewportRectangle: this._getRelativeViewportRect(),
        list: this.props.list,
        rectangles: this._getRectangles(),
        sliceStart: sliceStart,
        sliceEnd: sliceEnd
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._unlistenScroll = this.props.viewport.addScrollListener(this._handleScroll);
      this._postRenderProcessing(true);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var prevList = this.props.list;
      var prevState = this.state;
      var nextList = nextProps.list;
      if (prevList !== nextList) {
        var slice = findNewSlice(prevList, nextList, prevState.sliceStart, prevState.sliceEnd) || this._getDefaultSlice(nextList);
        this._setSlice(slice.sliceStart, slice.sliceEnd);
      }
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {
      this._prevPositioning = this.getPositioning();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      this._postRenderProcessing(prevProps.list !== this.props.list);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._unmounted = true;

      if (this._unlistenScroll) {
        this._unlistenScroll();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _computeBlankSpace2 = this._computeBlankSpace(),
          blankSpaceAbove = _computeBlankSpace2.blankSpaceAbove,
          blankSpaceBelow = _computeBlankSpace2.blankSpaceBelow;

      var sliceStart = this.state.sliceStart;

      // eslint-disable-next-line

      var _renderItem = this.props.renderItem;


      return React.createElement(List, {
        ref: this._handleRefUpdate,
        list: this._getSlice(),
        blankSpaceAbove: blankSpaceAbove,
        blankSpaceBelow: blankSpaceBelow,
        renderItem: function renderItem(data, index) {
          return _renderItem(data, sliceStart + index);
        }
      });
    }
  }]);
  return Updater;
}(React.PureComponent);

Updater.defaultProps = {
  offscreenToViewportRatio: 1.8,
  assumedItemHeight: 400
};

var defaultIdentityFunction = function defaultIdentityFunction(a) {
  return a.id;
};

var VirtualScroller$1 = function (_React$PureComponent) {
  inherits(VirtualScroller, _React$PureComponent);

  function VirtualScroller(props) {
    classCallCheck(this, VirtualScroller);

    /* eslint-disable no-shadow */
    var _this = possibleConstructorReturn(this, (VirtualScroller.__proto__ || Object.getPrototypeOf(VirtualScroller)).call(this, props));

    _this._getList = recomputed$1(_this, function (props) {
      return props.items;
    }, function (items) {
      var idMap = {};
      var resultList = [];

      items.forEach(function (item) {
        var id = _this.props.identityFunction(item);
        if (idMap.hasOwnProperty(id)) {
          // eslint-disable-next-line no-console
          console.warn('Duplicate item id generated in VirtualScroller. Latter item (id = "' + id + '") will be discarded');
          return;
        }

        resultList.push({
          id: id,
          data: item
        });
        idMap[id] = true;
      });

      return resultList;
    });
    /* eslint-enable no-shadow */
    return _this;
  }

  createClass(VirtualScroller, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          renderItem = _props.renderItem,
          assumedItemHeight = _props.assumedItemHeight,
          viewport = _props.viewport;


      return React.createElement(Updater, {
        list: this._getList(),
        renderItem: renderItem,
        assumedItemHeight: assumedItemHeight,
        viewport: viewport
      });
    }
  }]);
  return VirtualScroller;
}(React.PureComponent);

VirtualScroller$1.defaultProps = {
  identityFunction: defaultIdentityFunction,
  offscreenToViewportRatio: 1.8,
  assumedItemHeight: 400
};

exports['default'] = VirtualScroller$1;
exports.Viewport = Viewport;

Object.defineProperty(exports, '__esModule', { value: true });

})));
