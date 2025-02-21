
/*!
 * jQuery JavaScript Library v3.5.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2020-05-04T22:49Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

      // Support: Chrome <=57, Firefox <=52
      // In some browsers, typeof returns "function" for HTML <object> elements
      // (i.e., `typeof document.createElement( "object" ) === "function"`).
      // We don't want to classify *any* DOM node as a function.
      return typeof obj === "function" && typeof obj.nodeType !== "number";
  };


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.5.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( _i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.5
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2020-03-14
 */
( function( window ) {
var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ( {} ).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	pushNative = arr.push,
	push = arr.push,
	slice = arr.slice,

	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[ i ] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
		"ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5]
		// or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
		whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
		"*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
			whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
			whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rhtml = /HTML$/i,
	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		return nonHex ?

			// Strip the backslash prefix from a non-hex escape sequence
			nonHex :

			// Replace a hexadecimal escape sequence with the encoded Unicode code point
			// Support: IE <=11+
			// For values outside the Basic Multilingual Plane (BMP), manually construct a
			// surrogate pair
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" +
				ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);

	// Support: Android<4.0
	// Detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;

			// Can't trust NodeList.length
			while ( ( target[ j++ ] = els[ i++ ] ) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&

				// Support: IE 8 only
				// Exclude object elements
				( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rcombinators.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					if ( newContext !== context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = nid.replace( rcssescape, fcssescape );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split( "|" ),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[ i ] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( ( cur = cur.nextSibling ) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return ( name === "input" || name === "button" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
					inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	var namespace = elem.namespaceURI,
		docElem = ( elem.ownerDocument || elem ).documentElement;

	// Support: IE <=8
	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
	// https://bugs.jquery.com/ticket/4833
	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
	// Safari 4 - 5 only, Opera <=11.6 - 12.x only
	// IE/Edge & older browsers don't support the :scope pseudo-class.
	// Support: Safari 6.0 only
	// Safari 6.0 supports :scope but it's an alias of :root there.
	support.scope = assert( function( el ) {
		docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
		return typeof el.querySelectorAll !== "undefined" &&
			!el.querySelectorAll( ":scope fieldset div" ).length;
	} );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert( function( el ) {
		el.className = "i";
		return !el.getAttribute( "className" );
	} );

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert( function( el ) {
		el.appendChild( document.createComment( "" ) );
		return !el.getElementsByTagName( "*" ).length;
	} );

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter[ "ID" ] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter[ "ID" ] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find[ "TAG" ] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,

				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( ( elem = results[ i++ ] ) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert( function( el ) {

			var input;

			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll( "[selected]" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push( "~=" );
			}

			// Support: IE 11+, Edge 15 - 18+
			// IE 11/Edge don't find elements on a `[name='']` query in some cases.
			// Adding a temporary attribute to the document before the selection works
			// around the issue.
			// Interestingly, IE 10 & older don't seem to have the issue.
			input = document.createElement( "input" );
			input.setAttribute( "name", "" );
			el.appendChild( input );
			if ( !el.querySelectorAll( "[name='']" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
					whitespace + "*(?:''|\"\")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll( ":checked" ).length ) {
				rbuggyQSA.push( ":checked" );
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push( ".#.+[+~]" );
			}

			// Support: Firefox <=3.6 - 5 only
			// Old Firefox doesn't throw on a badly-escaped identifier.
			el.querySelectorAll( "\\\f" );
			rbuggyQSA.push( "[\\r\\n\\f]" );
		} );

		assert( function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement( "input" );
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll( "[name=d]" ).length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: Opera 10 - 11 only
			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll( "*,:x" );
			rbuggyQSA.push( ",.*:" );
		} );
	}

	if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector ) ) ) ) {

		assert( function( el ) {

			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		} );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			) );
		} :
		function( a, b ) {
			if ( b ) {
				while ( ( b = b.parentNode ) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a == document || a.ownerDocument == preferredDoc &&
				contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b == document || b.ownerDocument == preferredDoc &&
				contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			return a == document ? -1 :
				b == document ? 1 :
				/* eslint-enable eqeqeq */
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( ( cur = cur.parentNode ) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( ( cur = cur.parentNode ) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[ i ] === bp[ i ] ) {
			i++;
		}

		return i ?

			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[ i ], bp[ i ] ) :

			// Otherwise nodes in our document sort first
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			ap[ i ] == preferredDoc ? -1 :
			bp[ i ] == preferredDoc ? 1 :
			/* eslint-enable eqeqeq */
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( support.matchesSelector && documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

				// As well, disconnected nodes are said to be in a document
				// fragment in IE 9
				elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			( val = elem.getAttributeNode( name ) ) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {

		// If no nodeType, this is expected to be an array
		while ( ( node = elem[ i++ ] ) ) {

			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {

			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}

	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
				match[ 5 ] || "" ).replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					Sizzle.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

				// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				Sizzle.error( match[ 0 ] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace +
					")" + className + "(" + whitespace + "|$)" ) ) && classCache(
						className, function( elem ) {
							return pattern.test(
								typeof elem.className === "string" && elem.className ||
								typeof elem.getAttribute !== "undefined" &&
									elem.getAttribute( "class" ) ||
								""
							);
				} );
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				/* eslint-disable max-len */

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
				/* eslint-enable max-len */

			};
		},

		"CHILD": function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || ( node[ expando ] = {} );

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								( outerCache[ node.uniqueID ] = {} );

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {

								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || ( node[ expando ] = {} );

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									( outerCache[ node.uniqueID ] = {} );

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												( outerCache[ node.uniqueID ] = {} );

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		"not": markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element (issue #299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		"has": markFunction( function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		} ),

		"contains": markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement &&
				( !document.hasFocus || document.hasFocus() ) &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return ( nodeName === "input" && !!elem.checked ) ||
				( nodeName === "option" && !!elem.selected );
		},

		"selected": function( elem ) {

			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {

			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos[ "empty" ]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		"last": createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		"even": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"odd": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ?
				argument + length :
				argument > length ?
					length :
					argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rcombinators.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :

			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] ||
							( outerCache[ elem.uniqueID ] = {} );

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = uniqueCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts(
				selector || "*",
				context.nodeType ? [ context ] : context,
				[]
			),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?

				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

					// If the preceding token was a descendant combinator, insert an implicit any-element `*`
					tokens
						.slice( 0, i - 1 )
						.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache(
			selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers )
		);

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
			context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
				.replace( runescape, funescape ), context ) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
						context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert( function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute( "href" ) === "#";
} ) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	} );
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert( function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
} ) ) {
	addHandle( "value", function( elem, _name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	} );
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert( function( el ) {
	return el.getAttribute( "disabled" ) == null;
} ) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
				( val = elem.getAttributeNode( name ) ) && val.specified ?
					val.value :
					null;
		}
	} );
}

return Sizzle;

} )( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 - 11+
// focus() and blur() are asynchronous, except when they are no-op.
// So expect focus to be synchronous when the element is already active,
// and blur to be synchronous when the element is not already active.
// (focus and blur are always synchronous in other supported browsers,
// this just defines when we can count on it).
function expectSync( elem, type ) {
	return ( elem === safeActiveElement() ) === ( type === "focus" );
}

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
					dataPriv.get( this, "events" ) || Object.create( null )
				)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", returnTrue );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, expectSync ) {

	// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
	if ( !expectSync ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var notAsync, result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				// Saved data should be false in such cases, but might be a leftover capture object
				// from an async native handler (gh-4350)
				if ( !saved.length ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					// Support: IE <=9 - 11+
					// focus() and blur() are asynchronous
					notAsync = expectSync( this, type );
					this[ type ]();
					result = dataPriv.get( this, type );
					if ( saved !== result || notAsync ) {
						dataPriv.set( this, type, false );
					} else {
						result = {};
					}
					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();
						return result.value;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering the
				// native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved.length ) {

				// ...and capture the result
				dataPriv.set( this, type, {
					value: jQuery.event.trigger(

						// Support: IE <=9 - 11+
						// Extend with the prototype to reset the above stopImmediatePropagation()
						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
						saved.slice( 1 ),
						this
					)
				} );

				// Abort handling of the native event
				event.stopImmediatePropagation();
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, expectSync );

			// Return false to allow normal processing in the caller
			return false;
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		delegateType: delegateType
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px";
				tr.style.height = "1px";
				trChild.style.height = "9px";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = parseInt( trStyle.height ) > 3;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"gridArea": true,
		"gridColumn": true,
		"gridColumnEnd": true,
		"gridColumnStart": true,
		"gridRow": true,
		"gridRowEnd": true,
		"gridRowStart": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
					jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = (
					dataPriv.get( cur, "events" ) || Object.create( null )
				)[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {

				// Handle: regular nodes (via `this.ownerDocument`), window
				// (via `this.document`) & document (via `this`).
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = { guid: Date.now() };

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Use a noop converter for missing script
			if ( !isSuccess && jQuery.inArray( "script", s.dataTypes ) > -1 ) {
				s.converters[ "text script" ] = function() {};
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( _i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

jQuery.ajaxPrefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.toLowerCase() === "content-type" ) {
			s.contentType = s.headers[ i ] || "";
		}
	}
} );


jQuery._evalUrl = function( url, options, doc ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options, doc );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			if ( typeof props.top === "number" ) {
				props.top += "px";
			}
			if ( typeof props.left === "number" ) {
				props.left += "px";
			}
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( _i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );

jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	} );




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "" );
};



// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

/*! jQuery UI - v1.12.1 - 2020-11-18
* http://jqueryui.com
* Includes: widget.js, position.js, data.js, disable-selection.js, focusable.js, form-reset-mixin.js, jquery-1-7.js, keycode.js, labels.js, scroll-parent.js, tabbable.js, unique-id.js, widgets/draggable.js, widgets/droppable.js, widgets/resizable.js, widgets/mouse.js
* Copyright jQuery Foundation and other contributors; Licensed MIT */

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

$.ui = $.ui || {};

var version = $.ui.version = "1.12.1";


/*!
 * jQuery UI Widget 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Widget
//>>group: Core
//>>description: Provides a factory for creating stateful widgets with a common API.
//>>docs: http://api.jqueryui.com/jQuery.widget/
//>>demos: http://jqueryui.com/widget/



var widgetUuid = 0;
var widgetSlice = Array.prototype.slice;

$.cleanData = ( function( orig ) {
	return function( elems ) {
		var events, elem, i;
		for ( i = 0; ( elem = elems[ i ] ) != null; i++ ) {
			try {

				// Only trigger remove when necessary to save time
				events = $._data( elem, "events" );
				if ( events && events.remove ) {
					$( elem ).triggerHandler( "remove" );
				}

			// Http://bugs.jquery.com/ticket/8235
			} catch ( e ) {}
		}
		orig( elems );
	};
} )( $.cleanData );

$.widget = function( name, base, prototype ) {
	var existingConstructor, constructor, basePrototype;

	// ProxiedPrototype allows the provided prototype to remain unmodified
	// so that it can be used as a mixin for multiple widgets (#8876)
	var proxiedPrototype = {};

	var namespace = name.split( "." )[ 0 ];
	name = name.split( "." )[ 1 ];
	var fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	if ( $.isArray( prototype ) ) {
		prototype = $.extend.apply( null, [ {} ].concat( prototype ) );
	}

	// Create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {

		// Allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// Allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};

	// Extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,

		// Copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),

		// Track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	} );

	basePrototype = new base();

	// We need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = ( function() {
			function _super() {
				return base.prototype[ prop ].apply( this, arguments );
			}

			function _superApply( args ) {
				return base.prototype[ prop ].apply( this, args );
			}

			return function() {
				var __super = this._super;
				var __superApply = this._superApply;
				var returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		} )();
	} );
	constructor.prototype = $.widget.extend( basePrototype, {

		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? ( basePrototype.widgetEventPrefix || name ) : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	} );

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// Redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor,
				child._proto );
		} );

		// Remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );

	return constructor;
};

$.widget.extend = function( target ) {
	var input = widgetSlice.call( arguments, 1 );
	var inputIndex = 0;
	var inputLength = input.length;
	var key;
	var value;

	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {

				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :

						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );

				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string";
		var args = widgetSlice.call( arguments, 1 );
		var returnValue = this;

		if ( isMethodCall ) {

			// If this is an empty collection, we need to have the instance method
			// return undefined instead of the jQuery instance
			if ( !this.length && options === "instance" ) {
				returnValue = undefined;
			} else {
				this.each( function() {
					var methodValue;
					var instance = $.data( this, fullName );

					if ( options === "instance" ) {
						returnValue = instance;
						return false;
					}

					if ( !instance ) {
						return $.error( "cannot call methods on " + name +
							" prior to initialization; " +
							"attempted to call method '" + options + "'" );
					}

					if ( !$.isFunction( instance[ options ] ) || options.charAt( 0 ) === "_" ) {
						return $.error( "no such method '" + options + "' for " + name +
							" widget instance" );
					}

					methodValue = instance[ options ].apply( instance, args );

					if ( methodValue !== instance && methodValue !== undefined ) {
						returnValue = methodValue && methodValue.jquery ?
							returnValue.pushStack( methodValue.get() ) :
							methodValue;
						return false;
					}
				} );
			}
		} else {

			// Allow multiple hashes to be passed on init
			if ( args.length ) {
				options = $.widget.extend.apply( null, [ options ].concat( args ) );
			}

			this.each( function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} );
					if ( instance._init ) {
						instance._init();
					}
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			} );
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",

	options: {
		classes: {},
		disabled: false,

		// Callbacks
		create: null
	},

	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = widgetUuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();
		this.classesElementLookup = {};

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			} );
			this.document = $( element.style ?

				// Element within the document
				element.ownerDocument :

				// Element is window or document
				element.document || element );
			this.window = $( this.document[ 0 ].defaultView || this.document[ 0 ].parentWindow );
		}

		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this._create();

		if ( this.options.disabled ) {
			this._setOptionDisabled( this.options.disabled );
		}

		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},

	_getCreateOptions: function() {
		return {};
	},

	_getCreateEventData: $.noop,

	_create: $.noop,

	_init: $.noop,

	destroy: function() {
		var that = this;

		this._destroy();
		$.each( this.classesElementLookup, function( key, value ) {
			that._removeClass( value, key );
		} );

		// We can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.off( this.eventNamespace )
			.removeData( this.widgetFullName );
		this.widget()
			.off( this.eventNamespace )
			.removeAttr( "aria-disabled" );

		// Clean up events and states
		this.bindings.off( this.eventNamespace );
	},

	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key;
		var parts;
		var curOption;
		var i;

		if ( arguments.length === 0 ) {

			// Don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {

			// Handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( arguments.length === 1 ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},

	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},

	_setOption: function( key, value ) {
		if ( key === "classes" ) {
			this._setOptionClasses( value );
		}

		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this._setOptionDisabled( value );
		}

		return this;
	},

	_setOptionClasses: function( value ) {
		var classKey, elements, currentElements;

		for ( classKey in value ) {
			currentElements = this.classesElementLookup[ classKey ];
			if ( value[ classKey ] === this.options.classes[ classKey ] ||
					!currentElements ||
					!currentElements.length ) {
				continue;
			}

			// We are doing this to create a new jQuery object because the _removeClass() call
			// on the next line is going to destroy the reference to the current elements being
			// tracked. We need to save a copy of this collection so that we can add the new classes
			// below.
			elements = $( currentElements.get() );
			this._removeClass( currentElements, classKey );

			// We don't use _addClass() here, because that uses this.options.classes
			// for generating the string of classes. We want to use the value passed in from
			// _setOption(), this is the new value of the classes option which was passed to
			// _setOption(). We pass this value directly to _classes().
			elements.addClass( this._classes( {
				element: elements,
				keys: classKey,
				classes: value,
				add: true
			} ) );
		}
	},

	_setOptionDisabled: function( value ) {
		this._toggleClass( this.widget(), this.widgetFullName + "-disabled", null, !!value );

		// If the widget is becoming disabled, then nothing is interactive
		if ( value ) {
			this._removeClass( this.hoverable, null, "ui-state-hover" );
			this._removeClass( this.focusable, null, "ui-state-focus" );
		}
	},

	enable: function() {
		return this._setOptions( { disabled: false } );
	},

	disable: function() {
		return this._setOptions( { disabled: true } );
	},

	_classes: function( options ) {
		var full = [];
		var that = this;

		options = $.extend( {
			element: this.element,
			classes: this.options.classes || {}
		}, options );

		function processClassString( classes, checkOption ) {
			var current, i;
			for ( i = 0; i < classes.length; i++ ) {
				current = that.classesElementLookup[ classes[ i ] ] || $();
				if ( options.add ) {
					current = $( $.unique( current.get().concat( options.element.get() ) ) );
				} else {
					current = $( current.not( options.element ).get() );
				}
				that.classesElementLookup[ classes[ i ] ] = current;
				full.push( classes[ i ] );
				if ( checkOption && options.classes[ classes[ i ] ] ) {
					full.push( options.classes[ classes[ i ] ] );
				}
			}
		}

		this._on( options.element, {
			"remove": "_untrackClassesElement"
		} );

		if ( options.keys ) {
			processClassString( options.keys.match( /\S+/g ) || [], true );
		}
		if ( options.extra ) {
			processClassString( options.extra.match( /\S+/g ) || [] );
		}

		return full.join( " " );
	},

	_untrackClassesElement: function( event ) {
		var that = this;
		$.each( that.classesElementLookup, function( key, value ) {
			if ( $.inArray( event.target, value ) !== -1 ) {
				that.classesElementLookup[ key ] = $( value.not( event.target ).get() );
			}
		} );
	},

	_removeClass: function( element, keys, extra ) {
		return this._toggleClass( element, keys, extra, false );
	},

	_addClass: function( element, keys, extra ) {
		return this._toggleClass( element, keys, extra, true );
	},

	_toggleClass: function( element, keys, extra, add ) {
		add = ( typeof add === "boolean" ) ? add : extra;
		var shift = ( typeof element === "string" || element === null ),
			options = {
				extra: shift ? keys : extra,
				keys: shift ? element : keys,
				element: shift ? this.element : element,
				add: add
			};
		options.element.toggleClass( this._classes( options ), add );
		return this;
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement;
		var instance = this;

		// No suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// No element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {

				// Allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
						$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// Copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^([\w:-]*)\s*(.*)$/ );
			var eventName = match[ 1 ] + instance.eventNamespace;
			var selector = match[ 2 ];

			if ( selector ) {
				delegateElement.on( eventName, selector, handlerProxy );
			} else {
				element.on( eventName, handlerProxy );
			}
		} );
	},

	_off: function( element, eventName ) {
		eventName = ( eventName || "" ).split( " " ).join( this.eventNamespace + " " ) +
			this.eventNamespace;
		element.off( eventName ).off( eventName );

		// Clear the stack to avoid memory leaks (#10056)
		this.bindings = $( this.bindings.not( element ).get() );
		this.focusable = $( this.focusable.not( element ).get() );
		this.hoverable = $( this.hoverable.not( element ).get() );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				this._addClass( $( event.currentTarget ), null, "ui-state-hover" );
			},
			mouseleave: function( event ) {
				this._removeClass( $( event.currentTarget ), null, "ui-state-hover" );
			}
		} );
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				this._addClass( $( event.currentTarget ), null, "ui-state-focus" );
			},
			focusout: function( event ) {
				this._removeClass( $( event.currentTarget ), null, "ui-state-focus" );
			}
		} );
	},

	_trigger: function( type, event, data ) {
		var prop, orig;
		var callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();

		// The original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// Copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[ 0 ], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}

		var hasOptions;
		var effectName = !options ?
			method :
			options === true || typeof options === "number" ?
				defaultEffect :
				options.effect || defaultEffect;

		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}

		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;

		if ( options.delay ) {
			element.delay( options.delay );
		}

		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue( function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			} );
		}
	};
} );

var widget = $.widget;


/*!
 * jQuery UI Position 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */

//>>label: Position
//>>group: Core
//>>description: Positions elements relative to other elements.
//>>docs: http://api.jqueryui.com/position/
//>>demos: http://jqueryui.com/position/


( function() {
var cachedScrollbarWidth,
	max = Math.max,
	abs = Math.abs,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+(\.[\d]+)?%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getOffsets( offsets, width, height ) {
	return [
		parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}

function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
	var raw = elem[ 0 ];
	if ( raw.nodeType === 9 ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: 0, left: 0 }
		};
	}
	if ( $.isWindow( raw ) ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
		};
	}
	if ( raw.preventDefault ) {
		return {
			width: 0,
			height: 0,
			offset: { top: raw.pageY, left: raw.pageX }
		};
	}
	return {
		width: elem.outerWidth(),
		height: elem.outerHeight(),
		offset: elem.offset()
	};
}

$.position = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth !== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div " +
				"style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'>" +
				"<div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[ 0 ];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[ 0 ].clientWidth;
		}

		div.remove();

		return ( cachedScrollbarWidth = w1 - w2 );
	},
	getScrollInfo: function( within ) {
		var overflowX = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-x" ),
			overflowY = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-y" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "auto" && within.width < within.element[ 0 ].scrollWidth ),
			hasOverflowY = overflowY === "scroll" ||
				( overflowY === "auto" && within.height < within.element[ 0 ].scrollHeight );
		return {
			width: hasOverflowY ? $.position.scrollbarWidth() : 0,
			height: hasOverflowX ? $.position.scrollbarWidth() : 0
		};
	},
	getWithinInfo: function( element ) {
		var withinElement = $( element || window ),
			isWindow = $.isWindow( withinElement[ 0 ] ),
			isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9,
			hasOffset = !isWindow && !isDocument;
		return {
			element: withinElement,
			isWindow: isWindow,
			isDocument: isDocument,
			offset: hasOffset ? $( element ).offset() : { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft(),
			scrollTop: withinElement.scrollTop(),
			width: withinElement.outerWidth(),
			height: withinElement.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// Make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
		target = $( options.of ),
		within = $.position.getWithinInfo( options.within ),
		scrollInfo = $.position.getScrollInfo( within ),
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	dimensions = getDimensions( target );
	if ( target[ 0 ].preventDefault ) {

		// Force left top to allow flipping
		options.at = "left top";
	}
	targetWidth = dimensions.width;
	targetHeight = dimensions.height;
	targetOffset = dimensions.offset;

	// Clone to reuse original targetOffset later
	basePosition = $.extend( {}, targetOffset );

	// Force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1 ) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// Calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// Reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	} );

	// Normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === "center" ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each( function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseCss( this, "marginLeft" ),
			marginTop = parseCss( this, "marginTop" ),
			collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) +
				scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) +
				scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem: elem
				} );
			}
		} );

		if ( options.using ) {

			// Adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetOffset.left - position.left,
					right = left + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						target: {
							element: target,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
							height: elemHeight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontal = "center";
				}
				if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	} );
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
				outerWidth = within.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// Element is wider than within
			if ( data.collisionWidth > outerWidth ) {

				// Element is initially over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth -
						withinOffset;
					position.left += overLeft - newOverRight;

				// Element is initially over right side of within
				} else if ( overRight > 0 && overLeft <= 0 ) {
					position.left = withinOffset;

				// Element is initially over both left and right sides of within
				} else {
					if ( overLeft > overRight ) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} else {
						position.left = withinOffset;
					}
				}

			// Too far left -> align with left edge
			} else if ( overLeft > 0 ) {
				position.left += overLeft;

			// Too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;

			// Adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// Element is taller than within
			if ( data.collisionHeight > outerHeight ) {

				// Element is initially over the top of within
				if ( overTop > 0 && overBottom <= 0 ) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight -
						withinOffset;
					position.top += overTop - newOverBottom;

				// Element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;

				// Element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}
				}

			// Too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;

			// Too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;

			// Adjust based on position and margin
			} else {
				position.top = max( position.top - collisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = within.width,
				offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					data.at[ 0 ] === "right" ?
						-data.targetWidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newOverRight,
				newOverLeft;

			if ( overLeft < 0 ) {
				newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth -
					outerWidth - withinOffset;
				if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			} else if ( overRight > 0 ) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset +
					atOffset + offset - offsetLeft;
				if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
					position.left += myOffset + atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					data.at[ 1 ] === "bottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
			if ( overTop < 0 ) {
				newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight -
					outerHeight - withinOffset;
				if ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) {
					position.top += myOffset + atOffset + offset;
				}
			} else if ( overBottom > 0 ) {
				newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset +
					offset - offsetTop;
				if ( newOverTop > 0 || abs( newOverTop ) < overBottom ) {
					position.top += myOffset + atOffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ui.position.flip.left.apply( this, arguments );
			$.ui.position.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.apply( this, arguments );
		}
	}
};

} )();

var position = $.ui.position;


/*!
 * jQuery UI :data 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: :data Selector
//>>group: Core
//>>description: Selects elements which have data stored under the specified key.
//>>docs: http://api.jqueryui.com/data-selector/


var data = $.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo( function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		} ) :

		// Support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		}
} );

/*!
 * jQuery UI Disable Selection 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: disableSelection
//>>group: Core
//>>description: Disable selection of text content within the set of matched elements.
//>>docs: http://api.jqueryui.com/disableSelection/

// This file is deprecated


var disableSelection = $.fn.extend( {
	disableSelection: ( function() {
		var eventType = "onselectstart" in document.createElement( "div" ) ?
			"selectstart" :
			"mousedown";

		return function() {
			return this.on( eventType + ".ui-disableSelection", function( event ) {
				event.preventDefault();
			} );
		};
	} )(),

	enableSelection: function() {
		return this.off( ".ui-disableSelection" );
	}
} );


/*!
 * jQuery UI Focusable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: :focusable Selector
//>>group: Core
//>>description: Selects elements which can be focused.
//>>docs: http://api.jqueryui.com/focusable-selector/



// Selectors
$.ui.focusable = function( element, hasTabindex ) {
	var map, mapName, img, focusableIfVisible, fieldset,
		nodeName = element.nodeName.toLowerCase();

	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap='#" + mapName + "']" );
		return img.length > 0 && img.is( ":visible" );
	}

	if ( /^(input|select|textarea|button|object)$/.test( nodeName ) ) {
		focusableIfVisible = !element.disabled;

		if ( focusableIfVisible ) {

			// Form controls within a disabled fieldset are disabled.
			// However, controls within the fieldset's legend do not get disabled.
			// Since controls generally aren't placed inside legends, we skip
			// this portion of the check.
			fieldset = $( element ).closest( "fieldset" )[ 0 ];
			if ( fieldset ) {
				focusableIfVisible = !fieldset.disabled;
			}
		}
	} else if ( "a" === nodeName ) {
		focusableIfVisible = element.href || hasTabindex;
	} else {
		focusableIfVisible = hasTabindex;
	}

	return focusableIfVisible && $( element ).is( ":visible" ) && visible( $( element ) );
};

// Support: IE 8 only
// IE 8 doesn't resolve inherit to visible/hidden for computed values
function visible( element ) {
	var visibility = element.css( "visibility" );
	while ( visibility === "inherit" ) {
		element = element.parent();
		visibility = element.css( "visibility" );
	}
	return visibility !== "hidden";
}

$.extend( $.expr[ ":" ], {
	focusable: function( element ) {
		return $.ui.focusable( element, $.attr( element, "tabindex" ) != null );
	}
} );

var focusable = $.ui.focusable;




// Support: IE8 Only
// IE8 does not support the form attribute and when it is supplied. It overwrites the form prop
// with a string, so we need to find the proper form.
var form = $.fn.form = function() {
	return typeof this[ 0 ].form === "string" ? this.closest( "form" ) : $( this[ 0 ].form );
};


/*!
 * jQuery UI Form Reset Mixin 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Form Reset Mixin
//>>group: Core
//>>description: Refresh input widgets when their form is reset
//>>docs: http://api.jqueryui.com/form-reset-mixin/



var formResetMixin = $.ui.formResetMixin = {
	_formResetHandler: function() {
		var form = $( this );

		// Wait for the form reset to actually happen before refreshing
		setTimeout( function() {
			var instances = form.data( "ui-form-reset-instances" );
			$.each( instances, function() {
				this.refresh();
			} );
		} );
	},

	_bindFormResetHandler: function() {
		this.form = this.element.form();
		if ( !this.form.length ) {
			return;
		}

		var instances = this.form.data( "ui-form-reset-instances" ) || [];
		if ( !instances.length ) {

			// We don't use _on() here because we use a single event handler per form
			this.form.on( "reset.ui-form-reset", this._formResetHandler );
		}
		instances.push( this );
		this.form.data( "ui-form-reset-instances", instances );
	},

	_unbindFormResetHandler: function() {
		if ( !this.form.length ) {
			return;
		}

		var instances = this.form.data( "ui-form-reset-instances" );
		instances.splice( $.inArray( this, instances ), 1 );
		if ( instances.length ) {
			this.form.data( "ui-form-reset-instances", instances );
		} else {
			this.form
				.removeData( "ui-form-reset-instances" )
				.off( "reset.ui-form-reset" );
		}
	}
};


/*!
 * jQuery UI Support for jQuery core 1.7.x 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 */

//>>label: jQuery 1.7 Support
//>>group: Core
//>>description: Support version 1.7.x of jQuery core



// Support: jQuery 1.7 only
// Not a great way to check versions, but since we only support 1.7+ and only
// need to detect <1.8, this is a simple check that should suffice. Checking
// for "1.7." would be a bit safer, but the version string is 1.7, not 1.7.0
// and we'll never reach 1.70.0 (if we do, we certainly won't be supporting
// 1.7 anymore). See #11197 for why we're not using feature detection.
if ( $.fn.jquery.substring( 0, 3 ) === "1.7" ) {

	// Setters for .innerWidth(), .innerHeight(), .outerWidth(), .outerHeight()
	// Unlike jQuery Core 1.8+, these only support numeric values to set the
	// dimensions in pixels
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			} );
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each( function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			} );
		};

		$.fn[ "outer" + name ] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each( function() {
				$( this ).css( type, reduce( this, size, true, margin ) + "px" );
			} );
		};
	} );

	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

;
/*!
 * jQuery UI Keycode 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Keycode
//>>group: Core
//>>description: Provide keycodes as keynames
//>>docs: http://api.jqueryui.com/jQuery.ui.keyCode/


var keycode = $.ui.keyCode = {
	BACKSPACE: 8,
	COMMA: 188,
	DELETE: 46,
	DOWN: 40,
	END: 35,
	ENTER: 13,
	ESCAPE: 27,
	HOME: 36,
	LEFT: 37,
	PAGE_DOWN: 34,
	PAGE_UP: 33,
	PERIOD: 190,
	RIGHT: 39,
	SPACE: 32,
	TAB: 9,
	UP: 38
};




// Internal use only
var escapeSelector = $.ui.escapeSelector = ( function() {
	var selectorEscape = /([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g;
	return function( selector ) {
		return selector.replace( selectorEscape, "\\$1" );
	};
} )();


/*!
 * jQuery UI Labels 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: labels
//>>group: Core
//>>description: Find all the labels associated with a given input
//>>docs: http://api.jqueryui.com/labels/



var labels = $.fn.labels = function() {
	var ancestor, selector, id, labels, ancestors;

	// Check control.labels first
	if ( this[ 0 ].labels && this[ 0 ].labels.length ) {
		return this.pushStack( this[ 0 ].labels );
	}

	// Support: IE <= 11, FF <= 37, Android <= 2.3 only
	// Above browsers do not support control.labels. Everything below is to support them
	// as well as document fragments. control.labels does not work on document fragments
	labels = this.eq( 0 ).parents( "label" );

	// Look for the label based on the id
	id = this.attr( "id" );
	if ( id ) {

		// We don't search against the document in case the element
		// is disconnected from the DOM
		ancestor = this.eq( 0 ).parents().last();

		// Get a full set of top level ancestors
		ancestors = ancestor.add( ancestor.length ? ancestor.siblings() : this.siblings() );

		// Create a selector for the label based on the id
		selector = "label[for='" + $.ui.escapeSelector( id ) + "']";

		labels = labels.add( ancestors.find( selector ).addBack( selector ) );

	}

	// Return whatever we have found for labels
	return this.pushStack( labels );
};


/*!
 * jQuery UI Scroll Parent 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: scrollParent
//>>group: Core
//>>description: Get the closest ancestor element that is scrollable.
//>>docs: http://api.jqueryui.com/scrollParent/



var scrollParent = $.fn.scrollParent = function( includeHidden ) {
	var position = this.css( "position" ),
		excludeStaticParent = position === "absolute",
		overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
		scrollParent = this.parents().filter( function() {
			var parent = $( this );
			if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
				return false;
			}
			return overflowRegex.test( parent.css( "overflow" ) + parent.css( "overflow-y" ) +
				parent.css( "overflow-x" ) );
		} ).eq( 0 );

	return position === "fixed" || !scrollParent.length ?
		$( this[ 0 ].ownerDocument || document ) :
		scrollParent;
};


/*!
 * jQuery UI Tabbable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: :tabbable Selector
//>>group: Core
//>>description: Selects elements which can be tabbed to.
//>>docs: http://api.jqueryui.com/tabbable-selector/



var tabbable = $.extend( $.expr[ ":" ], {
	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			hasTabindex = tabIndex != null;
		return ( !hasTabindex || tabIndex >= 0 ) && $.ui.focusable( element, hasTabindex );
	}
} );


/*!
 * jQuery UI Unique ID 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: uniqueId
//>>group: Core
//>>description: Functions to generate and remove uniqueId's
//>>docs: http://api.jqueryui.com/uniqueId/



var uniqueId = $.fn.extend( {
	uniqueId: ( function() {
		var uuid = 0;

		return function() {
			return this.each( function() {
				if ( !this.id ) {
					this.id = "ui-id-" + ( ++uuid );
				}
			} );
		};
	} )(),

	removeUniqueId: function() {
		return this.each( function() {
			if ( /^ui-id-\d+$/.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		} );
	}
} );




// This file is deprecated
var ie = $.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

/*!
 * jQuery UI Mouse 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Mouse
//>>group: Widgets
//>>description: Abstracts mouse-based interactions to assist in creating certain widgets.
//>>docs: http://api.jqueryui.com/mouse/



var mouseHandled = false;
$( document ).on( "mouseup", function() {
	mouseHandled = false;
} );

var widgetsMouse = $.widget( "ui.mouse", {
	version: "1.12.1",
	options: {
		cancel: "input, textarea, button, select, option",
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.on( "mousedown." + this.widgetName, function( event ) {
				return that._mouseDown( event );
			} )
			.on( "click." + this.widgetName, function( event ) {
				if ( true === $.data( event.target, that.widgetName + ".preventClickEvent" ) ) {
					$.removeData( event.target, that.widgetName + ".preventClickEvent" );
					event.stopImmediatePropagation();
					return false;
				}
			} );

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.off( "." + this.widgetName );
		if ( this._mouseMoveDelegate ) {
			this.document
				.off( "mousemove." + this.widgetName, this._mouseMoveDelegate )
				.off( "mouseup." + this.widgetName, this._mouseUpDelegate );
		}
	},

	_mouseDown: function( event ) {

		// don't let more than one widget handle mouseStart
		if ( mouseHandled ) {
			return;
		}

		this._mouseMoved = false;

		// We may have missed mouseup (out of window)
		( this._mouseStarted && this._mouseUp( event ) );

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = ( event.which === 1 ),

			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = ( typeof this.options.cancel === "string" && event.target.nodeName ?
				$( event.target ).closest( this.options.cancel ).length : false );
		if ( !btnIsLeft || elIsCancel || !this._mouseCapture( event ) ) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if ( !this.mouseDelayMet ) {
			this._mouseDelayTimer = setTimeout( function() {
				that.mouseDelayMet = true;
			}, this.options.delay );
		}

		if ( this._mouseDistanceMet( event ) && this._mouseDelayMet( event ) ) {
			this._mouseStarted = ( this._mouseStart( event ) !== false );
			if ( !this._mouseStarted ) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if ( true === $.data( event.target, this.widgetName + ".preventClickEvent" ) ) {
			$.removeData( event.target, this.widgetName + ".preventClickEvent" );
		}

		// These delegates are required to keep context
		this._mouseMoveDelegate = function( event ) {
			return that._mouseMove( event );
		};
		this._mouseUpDelegate = function( event ) {
			return that._mouseUp( event );
		};

		this.document
			.on( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.on( "mouseup." + this.widgetName, this._mouseUpDelegate );

		event.preventDefault();

		mouseHandled = true;
		return true;
	},

	_mouseMove: function( event ) {

		// Only check for mouseups outside the document if you've moved inside the document
		// at least once. This prevents the firing of mouseup in the case of IE<9, which will
		// fire a mousemove event if content is placed under the cursor. See #7778
		// Support: IE <9
		if ( this._mouseMoved ) {

			// IE mouseup check - mouseup happened when mouse was out of window
			if ( $.ui.ie && ( !document.documentMode || document.documentMode < 9 ) &&
					!event.button ) {
				return this._mouseUp( event );

			// Iframe mouseup check - mouseup occurred in another document
			} else if ( !event.which ) {

				// Support: Safari <=8 - 9
				// Safari sets which to 0 if you press any of the following keys
				// during a drag (#14461)
				if ( event.originalEvent.altKey || event.originalEvent.ctrlKey ||
						event.originalEvent.metaKey || event.originalEvent.shiftKey ) {
					this.ignoreMissingWhich = true;
				} else if ( !this.ignoreMissingWhich ) {
					return this._mouseUp( event );
				}
			}
		}

		if ( event.which || event.button ) {
			this._mouseMoved = true;
		}

		if ( this._mouseStarted ) {
			this._mouseDrag( event );
			return event.preventDefault();
		}

		if ( this._mouseDistanceMet( event ) && this._mouseDelayMet( event ) ) {
			this._mouseStarted =
				( this._mouseStart( this._mouseDownEvent, event ) !== false );
			( this._mouseStarted ? this._mouseDrag( event ) : this._mouseUp( event ) );
		}

		return !this._mouseStarted;
	},

	_mouseUp: function( event ) {
		this.document
			.off( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.off( "mouseup." + this.widgetName, this._mouseUpDelegate );

		if ( this._mouseStarted ) {
			this._mouseStarted = false;

			if ( event.target === this._mouseDownEvent.target ) {
				$.data( event.target, this.widgetName + ".preventClickEvent", true );
			}

			this._mouseStop( event );
		}

		if ( this._mouseDelayTimer ) {
			clearTimeout( this._mouseDelayTimer );
			delete this._mouseDelayTimer;
		}

		this.ignoreMissingWhich = false;
		mouseHandled = false;
		event.preventDefault();
	},

	_mouseDistanceMet: function( event ) {
		return ( Math.max(
				Math.abs( this._mouseDownEvent.pageX - event.pageX ),
				Math.abs( this._mouseDownEvent.pageY - event.pageY )
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function( /* event */ ) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function( /* event */ ) {},
	_mouseDrag: function( /* event */ ) {},
	_mouseStop: function( /* event */ ) {},
	_mouseCapture: function( /* event */ ) { return true; }
} );




// $.ui.plugin is deprecated. Use $.widget() extensions instead.
var plugin = $.ui.plugin = {
	add: function( module, option, set ) {
		var i,
			proto = $.ui[ module ].prototype;
		for ( i in set ) {
			proto.plugins[ i ] = proto.plugins[ i ] || [];
			proto.plugins[ i ].push( [ option, set[ i ] ] );
		}
	},
	call: function( instance, name, args, allowDisconnected ) {
		var i,
			set = instance.plugins[ name ];

		if ( !set ) {
			return;
		}

		if ( !allowDisconnected && ( !instance.element[ 0 ].parentNode ||
				instance.element[ 0 ].parentNode.nodeType === 11 ) ) {
			return;
		}

		for ( i = 0; i < set.length; i++ ) {
			if ( instance.options[ set[ i ][ 0 ] ] ) {
				set[ i ][ 1 ].apply( instance.element, args );
			}
		}
	}
};



var safeActiveElement = $.ui.safeActiveElement = function( document ) {
	var activeElement;

	// Support: IE 9 only
	// IE9 throws an "Unspecified error" accessing document.activeElement from an <iframe>
	try {
		activeElement = document.activeElement;
	} catch ( error ) {
		activeElement = document.body;
	}

	// Support: IE 9 - 11 only
	// IE may return null instead of an element
	// Interestingly, this only seems to occur when NOT in an iframe
	if ( !activeElement ) {
		activeElement = document.body;
	}

	// Support: IE 11 only
	// IE11 returns a seemingly empty object in some cases when accessing
	// document.activeElement from an <iframe>
	if ( !activeElement.nodeName ) {
		activeElement = document.body;
	}

	return activeElement;
};



var safeBlur = $.ui.safeBlur = function( element ) {

	// Support: IE9 - 10 only
	// If the <body> is blurred, IE will switch windows, see #9420
	if ( element && element.nodeName.toLowerCase() !== "body" ) {
		$( element ).trigger( "blur" );
	}
};


/*!
 * jQuery UI Draggable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Draggable
//>>group: Interactions
//>>description: Enables dragging functionality for any element.
//>>docs: http://api.jqueryui.com/draggable/
//>>demos: http://jqueryui.com/draggable/
//>>css.structure: ../../themes/base/draggable.css



$.widget( "ui.draggable", $.ui.mouse, {
	version: "1.12.1",
	widgetEventPrefix: "drag",
	options: {
		addClasses: true,
		appendTo: "parent",
		axis: false,
		connectToSortable: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		grid: false,
		handle: false,
		helper: "original",
		iframeFix: false,
		opacity: false,
		refreshPositions: false,
		revert: false,
		revertDuration: 500,
		scope: "default",
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		snap: false,
		snapMode: "both",
		snapTolerance: 20,
		stack: false,
		zIndex: false,

		// Callbacks
		drag: null,
		start: null,
		stop: null
	},
	_create: function() {

		if ( this.options.helper === "original" ) {
			this._setPositionRelative();
		}
		if ( this.options.addClasses ) {
			this._addClass( "ui-draggable" );
		}
		this._setHandleClassName();

		this._mouseInit();
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "handle" ) {
			this._removeHandleClassName();
			this._setHandleClassName();
		}
	},

	_destroy: function() {
		if ( ( this.helper || this.element ).is( ".ui-draggable-dragging" ) ) {
			this.destroyOnClear = true;
			return;
		}
		this._removeHandleClassName();
		this._mouseDestroy();
	},

	_mouseCapture: function( event ) {
		var o = this.options;

		// Among others, prevent a drag on a resizable-handle
		if ( this.helper || o.disabled ||
				$( event.target ).closest( ".ui-resizable-handle" ).length > 0 ) {
			return false;
		}

		//Quit if we're not on a valid handle
		this.handle = this._getHandle( event );
		if ( !this.handle ) {
			return false;
		}

		this._blurActiveElement( event );

		this._blockFrames( o.iframeFix === true ? "iframe" : o.iframeFix );

		return true;

	},

	_blockFrames: function( selector ) {
		this.iframeBlocks = this.document.find( selector ).map( function() {
			var iframe = $( this );

			return $( "<div>" )
				.css( "position", "absolute" )
				.appendTo( iframe.parent() )
				.outerWidth( iframe.outerWidth() )
				.outerHeight( iframe.outerHeight() )
				.offset( iframe.offset() )[ 0 ];
		} );
	},

	_unblockFrames: function() {
		if ( this.iframeBlocks ) {
			this.iframeBlocks.remove();
			delete this.iframeBlocks;
		}
	},

	_blurActiveElement: function( event ) {
		var activeElement = $.ui.safeActiveElement( this.document[ 0 ] ),
			target = $( event.target );

		// Don't blur if the event occurred on an element that is within
		// the currently focused element
		// See #10527, #12472
		if ( target.closest( activeElement ).length ) {
			return;
		}

		// Blur any element that currently has focus, see #4261
		$.ui.safeBlur( activeElement );
	},

	_mouseStart: function( event ) {

		var o = this.options;

		//Create and append the visible helper
		this.helper = this._createHelper( event );

		this._addClass( this.helper, "ui-draggable-dragging" );

		//Cache the helper size
		this._cacheHelperProportions();

		//If ddmanager is used for droppables, set the global draggable
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.current = this;
		}

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Store the helper's css position
		this.cssPosition = this.helper.css( "position" );
		this.scrollParent = this.helper.scrollParent( true );
		this.offsetParent = this.helper.offsetParent();
		this.hasFixedAncestor = this.helper.parents().filter( function() {
				return $( this ).css( "position" ) === "fixed";
			} ).length > 0;

		//The element's absolute position on the page minus margins
		this.positionAbs = this.element.offset();
		this._refreshOffsets( event );

		//Generate the original position
		this.originalPosition = this.position = this._generatePosition( event, false );
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if "cursorAt" is supplied
		( o.cursorAt && this._adjustOffsetFromHelper( o.cursorAt ) );

		//Set a containment if given in the options
		this._setContainment();

		//Trigger event + callbacks
		if ( this._trigger( "start", event ) === false ) {
			this._clear();
			return false;
		}

		//Recache the helper size
		this._cacheHelperProportions();

		//Prepare the droppable offsets
		if ( $.ui.ddmanager && !o.dropBehaviour ) {
			$.ui.ddmanager.prepareOffsets( this, event );
		}

		// Execute the drag once - this causes the helper not to be visible before getting its
		// correct position
		this._mouseDrag( event, true );

		// If the ddmanager is used for droppables, inform the manager that dragging has started
		// (see #5003)
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.dragStart( this, event );
		}

		return true;
	},

	_refreshOffsets: function( event ) {
		this.offset = {
			top: this.positionAbs.top - this.margins.top,
			left: this.positionAbs.left - this.margins.left,
			scroll: false,
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset()
		};

		this.offset.click = {
			left: event.pageX - this.offset.left,
			top: event.pageY - this.offset.top
		};
	},

	_mouseDrag: function( event, noPropagation ) {

		// reset any necessary cached properties (see #5009)
		if ( this.hasFixedAncestor ) {
			this.offset.parent = this._getParentOffset();
		}

		//Compute the helpers position
		this.position = this._generatePosition( event, true );
		this.positionAbs = this._convertPositionTo( "absolute" );

		//Call plugins and callbacks and use the resulting position if something is returned
		if ( !noPropagation ) {
			var ui = this._uiHash();
			if ( this._trigger( "drag", event, ui ) === false ) {
				this._mouseUp( new $.Event( "mouseup", event ) );
				return false;
			}
			this.position = ui.position;
		}

		this.helper[ 0 ].style.left = this.position.left + "px";
		this.helper[ 0 ].style.top = this.position.top + "px";

		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.drag( this, event );
		}

		return false;
	},

	_mouseStop: function( event ) {

		//If we are using droppables, inform the manager about the drop
		var that = this,
			dropped = false;
		if ( $.ui.ddmanager && !this.options.dropBehaviour ) {
			dropped = $.ui.ddmanager.drop( this, event );
		}

		//if a drop comes from outside (a sortable)
		if ( this.dropped ) {
			dropped = this.dropped;
			this.dropped = false;
		}

		if ( ( this.options.revert === "invalid" && !dropped ) ||
				( this.options.revert === "valid" && dropped ) ||
				this.options.revert === true || ( $.isFunction( this.options.revert ) &&
				this.options.revert.call( this.element, dropped ) )
		) {
			$( this.helper ).animate(
				this.originalPosition,
				parseInt( this.options.revertDuration, 10 ),
				function() {
					if ( that._trigger( "stop", event ) !== false ) {
						that._clear();
					}
				}
			);
		} else {
			if ( this._trigger( "stop", event ) !== false ) {
				this._clear();
			}
		}

		return false;
	},

	_mouseUp: function( event ) {
		this._unblockFrames();

		// If the ddmanager is used for droppables, inform the manager that dragging has stopped
		// (see #5003)
		if ( $.ui.ddmanager ) {
			$.ui.ddmanager.dragStop( this, event );
		}

		// Only need to focus if the event occurred on the draggable itself, see #10527
		if ( this.handleElement.is( event.target ) ) {

			// The interaction is over; whether or not the click resulted in a drag,
			// focus the element
			this.element.trigger( "focus" );
		}

		return $.ui.mouse.prototype._mouseUp.call( this, event );
	},

	cancel: function() {

		if ( this.helper.is( ".ui-draggable-dragging" ) ) {
			this._mouseUp( new $.Event( "mouseup", { target: this.element[ 0 ] } ) );
		} else {
			this._clear();
		}

		return this;

	},

	_getHandle: function( event ) {
		return this.options.handle ?
			!!$( event.target ).closest( this.element.find( this.options.handle ) ).length :
			true;
	},

	_setHandleClassName: function() {
		this.handleElement = this.options.handle ?
			this.element.find( this.options.handle ) : this.element;
		this._addClass( this.handleElement, "ui-draggable-handle" );
	},

	_removeHandleClassName: function() {
		this._removeClass( this.handleElement, "ui-draggable-handle" );
	},

	_createHelper: function( event ) {

		var o = this.options,
			helperIsFunction = $.isFunction( o.helper ),
			helper = helperIsFunction ?
				$( o.helper.apply( this.element[ 0 ], [ event ] ) ) :
				( o.helper === "clone" ?
					this.element.clone().removeAttr( "id" ) :
					this.element );

		if ( !helper.parents( "body" ).length ) {
			helper.appendTo( ( o.appendTo === "parent" ?
				this.element[ 0 ].parentNode :
				o.appendTo ) );
		}

		// Http://bugs.jqueryui.com/ticket/9446
		// a helper function can return the original element
		// which wouldn't have been set to relative in _create
		if ( helperIsFunction && helper[ 0 ] === this.element[ 0 ] ) {
			this._setPositionRelative();
		}

		if ( helper[ 0 ] !== this.element[ 0 ] &&
				!( /(fixed|absolute)/ ).test( helper.css( "position" ) ) ) {
			helper.css( "position", "absolute" );
		}

		return helper;

	},

	_setPositionRelative: function() {
		if ( !( /^(?:r|a|f)/ ).test( this.element.css( "position" ) ) ) {
			this.element[ 0 ].style.position = "relative";
		}
	},

	_adjustOffsetFromHelper: function( obj ) {
		if ( typeof obj === "string" ) {
			obj = obj.split( " " );
		}
		if ( $.isArray( obj ) ) {
			obj = { left: +obj[ 0 ], top: +obj[ 1 ] || 0 };
		}
		if ( "left" in obj ) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ( "right" in obj ) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ( "top" in obj ) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ( "bottom" in obj ) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_isRootNode: function( element ) {
		return ( /(html|body)/i ).test( element.tagName ) || element === this.document[ 0 ];
	},

	_getParentOffset: function() {

		//Get the offsetParent and cache its position
		var po = this.offsetParent.offset(),
			document = this.document[ 0 ];

		// This is a special case where we need to modify a offset calculated on start, since the
		// following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the
		// next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't
		// the document, which means that the scroll is included in the initial calculation of the
		// offset of the parent, and never recalculated upon drag
		if ( this.cssPosition === "absolute" && this.scrollParent[ 0 ] !== document &&
				$.contains( this.scrollParent[ 0 ], this.offsetParent[ 0 ] ) ) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if ( this._isRootNode( this.offsetParent[ 0 ] ) ) {
			po = { top: 0, left: 0 };
		}

		return {
			top: po.top + ( parseInt( this.offsetParent.css( "borderTopWidth" ), 10 ) || 0 ),
			left: po.left + ( parseInt( this.offsetParent.css( "borderLeftWidth" ), 10 ) || 0 )
		};

	},

	_getRelativeOffset: function() {
		if ( this.cssPosition !== "relative" ) {
			return { top: 0, left: 0 };
		}

		var p = this.element.position(),
			scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] );

		return {
			top: p.top - ( parseInt( this.helper.css( "top" ), 10 ) || 0 ) +
				( !scrollIsRootNode ? this.scrollParent.scrollTop() : 0 ),
			left: p.left - ( parseInt( this.helper.css( "left" ), 10 ) || 0 ) +
				( !scrollIsRootNode ? this.scrollParent.scrollLeft() : 0 )
		};

	},

	_cacheMargins: function() {
		this.margins = {
			left: ( parseInt( this.element.css( "marginLeft" ), 10 ) || 0 ),
			top: ( parseInt( this.element.css( "marginTop" ), 10 ) || 0 ),
			right: ( parseInt( this.element.css( "marginRight" ), 10 ) || 0 ),
			bottom: ( parseInt( this.element.css( "marginBottom" ), 10 ) || 0 )
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var isUserScrollable, c, ce,
			o = this.options,
			document = this.document[ 0 ];

		this.relativeContainer = null;

		if ( !o.containment ) {
			this.containment = null;
			return;
		}

		if ( o.containment === "window" ) {
			this.containment = [
				$( window ).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
				$( window ).scrollTop() - this.offset.relative.top - this.offset.parent.top,
				$( window ).scrollLeft() + $( window ).width() -
					this.helperProportions.width - this.margins.left,
				$( window ).scrollTop() +
					( $( window ).height() || document.body.parentNode.scrollHeight ) -
					this.helperProportions.height - this.margins.top
			];
			return;
		}

		if ( o.containment === "document" ) {
			this.containment = [
				0,
				0,
				$( document ).width() - this.helperProportions.width - this.margins.left,
				( $( document ).height() || document.body.parentNode.scrollHeight ) -
					this.helperProportions.height - this.margins.top
			];
			return;
		}

		if ( o.containment.constructor === Array ) {
			this.containment = o.containment;
			return;
		}

		if ( o.containment === "parent" ) {
			o.containment = this.helper[ 0 ].parentNode;
		}

		c = $( o.containment );
		ce = c[ 0 ];

		if ( !ce ) {
			return;
		}

		isUserScrollable = /(scroll|auto)/.test( c.css( "overflow" ) );

		this.containment = [
			( parseInt( c.css( "borderLeftWidth" ), 10 ) || 0 ) +
				( parseInt( c.css( "paddingLeft" ), 10 ) || 0 ),
			( parseInt( c.css( "borderTopWidth" ), 10 ) || 0 ) +
				( parseInt( c.css( "paddingTop" ), 10 ) || 0 ),
			( isUserScrollable ? Math.max( ce.scrollWidth, ce.offsetWidth ) : ce.offsetWidth ) -
				( parseInt( c.css( "borderRightWidth" ), 10 ) || 0 ) -
				( parseInt( c.css( "paddingRight" ), 10 ) || 0 ) -
				this.helperProportions.width -
				this.margins.left -
				this.margins.right,
			( isUserScrollable ? Math.max( ce.scrollHeight, ce.offsetHeight ) : ce.offsetHeight ) -
				( parseInt( c.css( "borderBottomWidth" ), 10 ) || 0 ) -
				( parseInt( c.css( "paddingBottom" ), 10 ) || 0 ) -
				this.helperProportions.height -
				this.margins.top -
				this.margins.bottom
		];
		this.relativeContainer = c;
	},

	_convertPositionTo: function( d, pos ) {

		if ( !pos ) {
			pos = this.position;
		}

		var mod = d === "absolute" ? 1 : -1,
			scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] );

		return {
			top: (

				// The absolute mouse position
				pos.top	+

				// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.relative.top * mod +

				// The offsetParent's offset without borders (offset + border)
				this.offset.parent.top * mod -
				( ( this.cssPosition === "fixed" ?
					-this.offset.scroll.top :
					( scrollIsRootNode ? 0 : this.offset.scroll.top ) ) * mod )
			),
			left: (

				// The absolute mouse position
				pos.left +

				// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.relative.left * mod +

				// The offsetParent's offset without borders (offset + border)
				this.offset.parent.left * mod	-
				( ( this.cssPosition === "fixed" ?
					-this.offset.scroll.left :
					( scrollIsRootNode ? 0 : this.offset.scroll.left ) ) * mod )
			)
		};

	},

	_generatePosition: function( event, constrainPosition ) {

		var containment, co, top, left,
			o = this.options,
			scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] ),
			pageX = event.pageX,
			pageY = event.pageY;

		// Cache the scroll
		if ( !scrollIsRootNode || !this.offset.scroll ) {
			this.offset.scroll = {
				top: this.scrollParent.scrollTop(),
				left: this.scrollParent.scrollLeft()
			};
		}

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		// If we are not dragging yet, we won't check for options
		if ( constrainPosition ) {
			if ( this.containment ) {
				if ( this.relativeContainer ) {
					co = this.relativeContainer.offset();
					containment = [
						this.containment[ 0 ] + co.left,
						this.containment[ 1 ] + co.top,
						this.containment[ 2 ] + co.left,
						this.containment[ 3 ] + co.top
					];
				} else {
					containment = this.containment;
				}

				if ( event.pageX - this.offset.click.left < containment[ 0 ] ) {
					pageX = containment[ 0 ] + this.offset.click.left;
				}
				if ( event.pageY - this.offset.click.top < containment[ 1 ] ) {
					pageY = containment[ 1 ] + this.offset.click.top;
				}
				if ( event.pageX - this.offset.click.left > containment[ 2 ] ) {
					pageX = containment[ 2 ] + this.offset.click.left;
				}
				if ( event.pageY - this.offset.click.top > containment[ 3 ] ) {
					pageY = containment[ 3 ] + this.offset.click.top;
				}
			}

			if ( o.grid ) {

				//Check for grid elements set to 0 to prevent divide by 0 error causing invalid
				// argument errors in IE (see ticket #6950)
				top = o.grid[ 1 ] ? this.originalPageY + Math.round( ( pageY -
					this.originalPageY ) / o.grid[ 1 ] ) * o.grid[ 1 ] : this.originalPageY;
				pageY = containment ? ( ( top - this.offset.click.top >= containment[ 1 ] ||
					top - this.offset.click.top > containment[ 3 ] ) ?
						top :
						( ( top - this.offset.click.top >= containment[ 1 ] ) ?
							top - o.grid[ 1 ] : top + o.grid[ 1 ] ) ) : top;

				left = o.grid[ 0 ] ? this.originalPageX +
					Math.round( ( pageX - this.originalPageX ) / o.grid[ 0 ] ) * o.grid[ 0 ] :
					this.originalPageX;
				pageX = containment ? ( ( left - this.offset.click.left >= containment[ 0 ] ||
					left - this.offset.click.left > containment[ 2 ] ) ?
						left :
						( ( left - this.offset.click.left >= containment[ 0 ] ) ?
							left - o.grid[ 0 ] : left + o.grid[ 0 ] ) ) : left;
			}

			if ( o.axis === "y" ) {
				pageX = this.originalPageX;
			}

			if ( o.axis === "x" ) {
				pageY = this.originalPageY;
			}
		}

		return {
			top: (

				// The absolute mouse position
				pageY -

				// Click offset (relative to the element)
				this.offset.click.top -

				// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.relative.top -

				// The offsetParent's offset without borders (offset + border)
				this.offset.parent.top +
				( this.cssPosition === "fixed" ?
					-this.offset.scroll.top :
					( scrollIsRootNode ? 0 : this.offset.scroll.top ) )
			),
			left: (

				// The absolute mouse position
				pageX -

				// Click offset (relative to the element)
				this.offset.click.left -

				// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.relative.left -

				// The offsetParent's offset without borders (offset + border)
				this.offset.parent.left +
				( this.cssPosition === "fixed" ?
					-this.offset.scroll.left :
					( scrollIsRootNode ? 0 : this.offset.scroll.left ) )
			)
		};

	},

	_clear: function() {
		this._removeClass( this.helper, "ui-draggable-dragging" );
		if ( this.helper[ 0 ] !== this.element[ 0 ] && !this.cancelHelperRemoval ) {
			this.helper.remove();
		}
		this.helper = null;
		this.cancelHelperRemoval = false;
		if ( this.destroyOnClear ) {
			this.destroy();
		}
	},

	// From now on bulk stuff - mainly helpers

	_trigger: function( type, event, ui ) {
		ui = ui || this._uiHash();
		$.ui.plugin.call( this, type, [ event, ui, this ], true );

		// Absolute position and offset (see #6884 ) have to be recalculated after plugins
		if ( /^(drag|start|stop)/.test( type ) ) {
			this.positionAbs = this._convertPositionTo( "absolute" );
			ui.offset = this.positionAbs;
		}
		return $.Widget.prototype._trigger.call( this, type, event, ui );
	},

	plugins: {},

	_uiHash: function() {
		return {
			helper: this.helper,
			position: this.position,
			originalPosition: this.originalPosition,
			offset: this.positionAbs
		};
	}

} );

$.ui.plugin.add( "draggable", "connectToSortable", {
	start: function( event, ui, draggable ) {
		var uiSortable = $.extend( {}, ui, {
			item: draggable.element
		} );

		draggable.sortables = [];
		$( draggable.options.connectToSortable ).each( function() {
			var sortable = $( this ).sortable( "instance" );

			if ( sortable && !sortable.options.disabled ) {
				draggable.sortables.push( sortable );

				// RefreshPositions is called at drag start to refresh the containerCache
				// which is used in drag. This ensures it's initialized and synchronized
				// with any changes that might have happened on the page since initialization.
				sortable.refreshPositions();
				sortable._trigger( "activate", event, uiSortable );
			}
		} );
	},
	stop: function( event, ui, draggable ) {
		var uiSortable = $.extend( {}, ui, {
			item: draggable.element
		} );

		draggable.cancelHelperRemoval = false;

		$.each( draggable.sortables, function() {
			var sortable = this;

			if ( sortable.isOver ) {
				sortable.isOver = 0;

				// Allow this sortable to handle removing the helper
				draggable.cancelHelperRemoval = true;
				sortable.cancelHelperRemoval = false;

				// Use _storedCSS To restore properties in the sortable,
				// as this also handles revert (#9675) since the draggable
				// may have modified them in unexpected ways (#8809)
				sortable._storedCSS = {
					position: sortable.placeholder.css( "position" ),
					top: sortable.placeholder.css( "top" ),
					left: sortable.placeholder.css( "left" )
				};

				sortable._mouseStop( event );

				// Once drag has ended, the sortable should return to using
				// its original helper, not the shared helper from draggable
				sortable.options.helper = sortable.options._helper;
			} else {

				// Prevent this Sortable from removing the helper.
				// However, don't set the draggable to remove the helper
				// either as another connected Sortable may yet handle the removal.
				sortable.cancelHelperRemoval = true;

				sortable._trigger( "deactivate", event, uiSortable );
			}
		} );
	},
	drag: function( event, ui, draggable ) {
		$.each( draggable.sortables, function() {
			var innermostIntersecting = false,
				sortable = this;

			// Copy over variables that sortable's _intersectsWith uses
			sortable.positionAbs = draggable.positionAbs;
			sortable.helperProportions = draggable.helperProportions;
			sortable.offset.click = draggable.offset.click;

			if ( sortable._intersectsWith( sortable.containerCache ) ) {
				innermostIntersecting = true;

				$.each( draggable.sortables, function() {

					// Copy over variables that sortable's _intersectsWith uses
					this.positionAbs = draggable.positionAbs;
					this.helperProportions = draggable.helperProportions;
					this.offset.click = draggable.offset.click;

					if ( this !== sortable &&
							this._intersectsWith( this.containerCache ) &&
							$.contains( sortable.element[ 0 ], this.element[ 0 ] ) ) {
						innermostIntersecting = false;
					}

					return innermostIntersecting;
				} );
			}

			if ( innermostIntersecting ) {

				// If it intersects, we use a little isOver variable and set it once,
				// so that the move-in stuff gets fired only once.
				if ( !sortable.isOver ) {
					sortable.isOver = 1;

					// Store draggable's parent in case we need to reappend to it later.
					draggable._parent = ui.helper.parent();

					sortable.currentItem = ui.helper
						.appendTo( sortable.element )
						.data( "ui-sortable-item", true );

					// Store helper option to later restore it
					sortable.options._helper = sortable.options.helper;

					sortable.options.helper = function() {
						return ui.helper[ 0 ];
					};

					// Fire the start events of the sortable with our passed browser event,
					// and our own helper (so it doesn't create a new one)
					event.target = sortable.currentItem[ 0 ];
					sortable._mouseCapture( event, true );
					sortable._mouseStart( event, true, true );

					// Because the browser event is way off the new appended portlet,
					// modify necessary variables to reflect the changes
					sortable.offset.click.top = draggable.offset.click.top;
					sortable.offset.click.left = draggable.offset.click.left;
					sortable.offset.parent.left -= draggable.offset.parent.left -
						sortable.offset.parent.left;
					sortable.offset.parent.top -= draggable.offset.parent.top -
						sortable.offset.parent.top;

					draggable._trigger( "toSortable", event );

					// Inform draggable that the helper is in a valid drop zone,
					// used solely in the revert option to handle "valid/invalid".
					draggable.dropped = sortable.element;

					// Need to refreshPositions of all sortables in the case that
					// adding to one sortable changes the location of the other sortables (#9675)
					$.each( draggable.sortables, function() {
						this.refreshPositions();
					} );

					// Hack so receive/update callbacks work (mostly)
					draggable.currentItem = draggable.element;
					sortable.fromOutside = draggable;
				}

				if ( sortable.currentItem ) {
					sortable._mouseDrag( event );

					// Copy the sortable's position because the draggable's can potentially reflect
					// a relative position, while sortable is always absolute, which the dragged
					// element has now become. (#8809)
					ui.position = sortable.position;
				}
			} else {

				// If it doesn't intersect with the sortable, and it intersected before,
				// we fake the drag stop of the sortable, but make sure it doesn't remove
				// the helper by using cancelHelperRemoval.
				if ( sortable.isOver ) {

					sortable.isOver = 0;
					sortable.cancelHelperRemoval = true;

					// Calling sortable's mouseStop would trigger a revert,
					// so revert must be temporarily false until after mouseStop is called.
					sortable.options._revert = sortable.options.revert;
					sortable.options.revert = false;

					sortable._trigger( "out", event, sortable._uiHash( sortable ) );
					sortable._mouseStop( event, true );

					// Restore sortable behaviors that were modfied
					// when the draggable entered the sortable area (#9481)
					sortable.options.revert = sortable.options._revert;
					sortable.options.helper = sortable.options._helper;

					if ( sortable.placeholder ) {
						sortable.placeholder.remove();
					}

					// Restore and recalculate the draggable's offset considering the sortable
					// may have modified them in unexpected ways. (#8809, #10669)
					ui.helper.appendTo( draggable._parent );
					draggable._refreshOffsets( event );
					ui.position = draggable._generatePosition( event, true );

					draggable._trigger( "fromSortable", event );

					// Inform draggable that the helper is no longer in a valid drop zone
					draggable.dropped = false;

					// Need to refreshPositions of all sortables just in case removing
					// from one sortable changes the location of other sortables (#9675)
					$.each( draggable.sortables, function() {
						this.refreshPositions();
					} );
				}
			}
		} );
	}
} );

$.ui.plugin.add( "draggable", "cursor", {
	start: function( event, ui, instance ) {
		var t = $( "body" ),
			o = instance.options;

		if ( t.css( "cursor" ) ) {
			o._cursor = t.css( "cursor" );
		}
		t.css( "cursor", o.cursor );
	},
	stop: function( event, ui, instance ) {
		var o = instance.options;
		if ( o._cursor ) {
			$( "body" ).css( "cursor", o._cursor );
		}
	}
} );

$.ui.plugin.add( "draggable", "opacity", {
	start: function( event, ui, instance ) {
		var t = $( ui.helper ),
			o = instance.options;
		if ( t.css( "opacity" ) ) {
			o._opacity = t.css( "opacity" );
		}
		t.css( "opacity", o.opacity );
	},
	stop: function( event, ui, instance ) {
		var o = instance.options;
		if ( o._opacity ) {
			$( ui.helper ).css( "opacity", o._opacity );
		}
	}
} );

$.ui.plugin.add( "draggable", "scroll", {
	start: function( event, ui, i ) {
		if ( !i.scrollParentNotHidden ) {
			i.scrollParentNotHidden = i.helper.scrollParent( false );
		}

		if ( i.scrollParentNotHidden[ 0 ] !== i.document[ 0 ] &&
				i.scrollParentNotHidden[ 0 ].tagName !== "HTML" ) {
			i.overflowOffset = i.scrollParentNotHidden.offset();
		}
	},
	drag: function( event, ui, i  ) {

		var o = i.options,
			scrolled = false,
			scrollParent = i.scrollParentNotHidden[ 0 ],
			document = i.document[ 0 ];

		if ( scrollParent !== document && scrollParent.tagName !== "HTML" ) {
			if ( !o.axis || o.axis !== "x" ) {
				if ( ( i.overflowOffset.top + scrollParent.offsetHeight ) - event.pageY <
						o.scrollSensitivity ) {
					scrollParent.scrollTop = scrolled = scrollParent.scrollTop + o.scrollSpeed;
				} else if ( event.pageY - i.overflowOffset.top < o.scrollSensitivity ) {
					scrollParent.scrollTop = scrolled = scrollParent.scrollTop - o.scrollSpeed;
				}
			}

			if ( !o.axis || o.axis !== "y" ) {
				if ( ( i.overflowOffset.left + scrollParent.offsetWidth ) - event.pageX <
						o.scrollSensitivity ) {
					scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft + o.scrollSpeed;
				} else if ( event.pageX - i.overflowOffset.left < o.scrollSensitivity ) {
					scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft - o.scrollSpeed;
				}
			}

		} else {

			if ( !o.axis || o.axis !== "x" ) {
				if ( event.pageY - $( document ).scrollTop() < o.scrollSensitivity ) {
					scrolled = $( document ).scrollTop( $( document ).scrollTop() - o.scrollSpeed );
				} else if ( $( window ).height() - ( event.pageY - $( document ).scrollTop() ) <
						o.scrollSensitivity ) {
					scrolled = $( document ).scrollTop( $( document ).scrollTop() + o.scrollSpeed );
				}
			}

			if ( !o.axis || o.axis !== "y" ) {
				if ( event.pageX - $( document ).scrollLeft() < o.scrollSensitivity ) {
					scrolled = $( document ).scrollLeft(
						$( document ).scrollLeft() - o.scrollSpeed
					);
				} else if ( $( window ).width() - ( event.pageX - $( document ).scrollLeft() ) <
						o.scrollSensitivity ) {
					scrolled = $( document ).scrollLeft(
						$( document ).scrollLeft() + o.scrollSpeed
					);
				}
			}

		}

		if ( scrolled !== false && $.ui.ddmanager && !o.dropBehaviour ) {
			$.ui.ddmanager.prepareOffsets( i, event );
		}

	}
} );

$.ui.plugin.add( "draggable", "snap", {
	start: function( event, ui, i ) {

		var o = i.options;

		i.snapElements = [];

		$( o.snap.constructor !== String ? ( o.snap.items || ":data(ui-draggable)" ) : o.snap )
			.each( function() {
				var $t = $( this ),
					$o = $t.offset();
				if ( this !== i.element[ 0 ] ) {
					i.snapElements.push( {
						item: this,
						width: $t.outerWidth(), height: $t.outerHeight(),
						top: $o.top, left: $o.left
					} );
				}
			} );

	},
	drag: function( event, ui, inst ) {

		var ts, bs, ls, rs, l, r, t, b, i, first,
			o = inst.options,
			d = o.snapTolerance,
			x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
			y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

		for ( i = inst.snapElements.length - 1; i >= 0; i-- ) {

			l = inst.snapElements[ i ].left - inst.margins.left;
			r = l + inst.snapElements[ i ].width;
			t = inst.snapElements[ i ].top - inst.margins.top;
			b = t + inst.snapElements[ i ].height;

			if ( x2 < l - d || x1 > r + d || y2 < t - d || y1 > b + d ||
					!$.contains( inst.snapElements[ i ].item.ownerDocument,
					inst.snapElements[ i ].item ) ) {
				if ( inst.snapElements[ i ].snapping ) {
					( inst.options.snap.release &&
						inst.options.snap.release.call(
							inst.element,
							event,
							$.extend( inst._uiHash(), { snapItem: inst.snapElements[ i ].item } )
						) );
				}
				inst.snapElements[ i ].snapping = false;
				continue;
			}

			if ( o.snapMode !== "inner" ) {
				ts = Math.abs( t - y2 ) <= d;
				bs = Math.abs( b - y1 ) <= d;
				ls = Math.abs( l - x2 ) <= d;
				rs = Math.abs( r - x1 ) <= d;
				if ( ts ) {
					ui.position.top = inst._convertPositionTo( "relative", {
						top: t - inst.helperProportions.height,
						left: 0
					} ).top;
				}
				if ( bs ) {
					ui.position.top = inst._convertPositionTo( "relative", {
						top: b,
						left: 0
					} ).top;
				}
				if ( ls ) {
					ui.position.left = inst._convertPositionTo( "relative", {
						top: 0,
						left: l - inst.helperProportions.width
					} ).left;
				}
				if ( rs ) {
					ui.position.left = inst._convertPositionTo( "relative", {
						top: 0,
						left: r
					} ).left;
				}
			}

			first = ( ts || bs || ls || rs );

			if ( o.snapMode !== "outer" ) {
				ts = Math.abs( t - y1 ) <= d;
				bs = Math.abs( b - y2 ) <= d;
				ls = Math.abs( l - x1 ) <= d;
				rs = Math.abs( r - x2 ) <= d;
				if ( ts ) {
					ui.position.top = inst._convertPositionTo( "relative", {
						top: t,
						left: 0
					} ).top;
				}
				if ( bs ) {
					ui.position.top = inst._convertPositionTo( "relative", {
						top: b - inst.helperProportions.height,
						left: 0
					} ).top;
				}
				if ( ls ) {
					ui.position.left = inst._convertPositionTo( "relative", {
						top: 0,
						left: l
					} ).left;
				}
				if ( rs ) {
					ui.position.left = inst._convertPositionTo( "relative", {
						top: 0,
						left: r - inst.helperProportions.width
					} ).left;
				}
			}

			if ( !inst.snapElements[ i ].snapping && ( ts || bs || ls || rs || first ) ) {
				( inst.options.snap.snap &&
					inst.options.snap.snap.call(
						inst.element,
						event,
						$.extend( inst._uiHash(), {
							snapItem: inst.snapElements[ i ].item
						} ) ) );
			}
			inst.snapElements[ i ].snapping = ( ts || bs || ls || rs || first );

		}

	}
} );

$.ui.plugin.add( "draggable", "stack", {
	start: function( event, ui, instance ) {
		var min,
			o = instance.options,
			group = $.makeArray( $( o.stack ) ).sort( function( a, b ) {
				return ( parseInt( $( a ).css( "zIndex" ), 10 ) || 0 ) -
					( parseInt( $( b ).css( "zIndex" ), 10 ) || 0 );
			} );

		if ( !group.length ) { return; }

		min = parseInt( $( group[ 0 ] ).css( "zIndex" ), 10 ) || 0;
		$( group ).each( function( i ) {
			$( this ).css( "zIndex", min + i );
		} );
		this.css( "zIndex", ( min + group.length ) );
	}
} );

$.ui.plugin.add( "draggable", "zIndex", {
	start: function( event, ui, instance ) {
		var t = $( ui.helper ),
			o = instance.options;

		if ( t.css( "zIndex" ) ) {
			o._zIndex = t.css( "zIndex" );
		}
		t.css( "zIndex", o.zIndex );
	},
	stop: function( event, ui, instance ) {
		var o = instance.options;

		if ( o._zIndex ) {
			$( ui.helper ).css( "zIndex", o._zIndex );
		}
	}
} );

var widgetsDraggable = $.ui.draggable;


/*!
 * jQuery UI Droppable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Droppable
//>>group: Interactions
//>>description: Enables drop targets for draggable elements.
//>>docs: http://api.jqueryui.com/droppable/
//>>demos: http://jqueryui.com/droppable/



$.widget( "ui.droppable", {
	version: "1.12.1",
	widgetEventPrefix: "drop",
	options: {
		accept: "*",
		addClasses: true,
		greedy: false,
		scope: "default",
		tolerance: "intersect",

		// Callbacks
		activate: null,
		deactivate: null,
		drop: null,
		out: null,
		over: null
	},
	_create: function() {

		var proportions,
			o = this.options,
			accept = o.accept;

		this.isover = false;
		this.isout = true;

		this.accept = $.isFunction( accept ) ? accept : function( d ) {
			return d.is( accept );
		};

		this.proportions = function( /* valueToWrite */ ) {
			if ( arguments.length ) {

				// Store the droppable's proportions
				proportions = arguments[ 0 ];
			} else {

				// Retrieve or derive the droppable's proportions
				return proportions ?
					proportions :
					proportions = {
						width: this.element[ 0 ].offsetWidth,
						height: this.element[ 0 ].offsetHeight
					};
			}
		};

		this._addToManager( o.scope );

		o.addClasses && this._addClass( "ui-droppable" );

	},

	_addToManager: function( scope ) {

		// Add the reference and positions to the manager
		$.ui.ddmanager.droppables[ scope ] = $.ui.ddmanager.droppables[ scope ] || [];
		$.ui.ddmanager.droppables[ scope ].push( this );
	},

	_splice: function( drop ) {
		var i = 0;
		for ( ; i < drop.length; i++ ) {
			if ( drop[ i ] === this ) {
				drop.splice( i, 1 );
			}
		}
	},

	_destroy: function() {
		var drop = $.ui.ddmanager.droppables[ this.options.scope ];

		this._splice( drop );
	},

	_setOption: function( key, value ) {

		if ( key === "accept" ) {
			this.accept = $.isFunction( value ) ? value : function( d ) {
				return d.is( value );
			};
		} else if ( key === "scope" ) {
			var drop = $.ui.ddmanager.droppables[ this.options.scope ];

			this._splice( drop );
			this._addToManager( value );
		}

		this._super( key, value );
	},

	_activate: function( event ) {
		var draggable = $.ui.ddmanager.current;

		this._addActiveClass();
		if ( draggable ) {
			this._trigger( "activate", event, this.ui( draggable ) );
		}
	},

	_deactivate: function( event ) {
		var draggable = $.ui.ddmanager.current;

		this._removeActiveClass();
		if ( draggable ) {
			this._trigger( "deactivate", event, this.ui( draggable ) );
		}
	},

	_over: function( event ) {

		var draggable = $.ui.ddmanager.current;

		// Bail if draggable and droppable are same element
		if ( !draggable || ( draggable.currentItem ||
				draggable.element )[ 0 ] === this.element[ 0 ] ) {
			return;
		}

		if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem ||
				draggable.element ) ) ) {
			this._addHoverClass();
			this._trigger( "over", event, this.ui( draggable ) );
		}

	},

	_out: function( event ) {

		var draggable = $.ui.ddmanager.current;

		// Bail if draggable and droppable are same element
		if ( !draggable || ( draggable.currentItem ||
				draggable.element )[ 0 ] === this.element[ 0 ] ) {
			return;
		}

		if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem ||
				draggable.element ) ) ) {
			this._removeHoverClass();
			this._trigger( "out", event, this.ui( draggable ) );
		}

	},

	_drop: function( event, custom ) {

		var draggable = custom || $.ui.ddmanager.current,
			childrenIntersection = false;

		// Bail if draggable and droppable are same element
		if ( !draggable || ( draggable.currentItem ||
				draggable.element )[ 0 ] === this.element[ 0 ] ) {
			return false;
		}

		this.element
			.find( ":data(ui-droppable)" )
			.not( ".ui-draggable-dragging" )
			.each( function() {
				var inst = $( this ).droppable( "instance" );
				if (
					inst.options.greedy &&
					!inst.options.disabled &&
					inst.options.scope === draggable.options.scope &&
					inst.accept.call(
						inst.element[ 0 ], ( draggable.currentItem || draggable.element )
					) &&
					intersect(
						draggable,
						$.extend( inst, { offset: inst.element.offset() } ),
						inst.options.tolerance, event
					)
				) {
					childrenIntersection = true;
					return false; }
			} );
		if ( childrenIntersection ) {
			return false;
		}

		if ( this.accept.call( this.element[ 0 ],
				( draggable.currentItem || draggable.element ) ) ) {
			this._removeActiveClass();
			this._removeHoverClass();

			this._trigger( "drop", event, this.ui( draggable ) );
			return this.element;
		}

		return false;

	},

	ui: function( c ) {
		return {
			draggable: ( c.currentItem || c.element ),
			helper: c.helper,
			position: c.position,
			offset: c.positionAbs
		};
	},

	// Extension points just to make backcompat sane and avoid duplicating logic
	// TODO: Remove in 1.13 along with call to it below
	_addHoverClass: function() {
		this._addClass( "ui-droppable-hover" );
	},

	_removeHoverClass: function() {
		this._removeClass( "ui-droppable-hover" );
	},

	_addActiveClass: function() {
		this._addClass( "ui-droppable-active" );
	},

	_removeActiveClass: function() {
		this._removeClass( "ui-droppable-active" );
	}
} );

var intersect = $.ui.intersect = ( function() {
	function isOverAxis( x, reference, size ) {
		return ( x >= reference ) && ( x < ( reference + size ) );
	}

	return function( draggable, droppable, toleranceMode, event ) {

		if ( !droppable.offset ) {
			return false;
		}

		var x1 = ( draggable.positionAbs ||
				draggable.position.absolute ).left + draggable.margins.left,
			y1 = ( draggable.positionAbs ||
				draggable.position.absolute ).top + draggable.margins.top,
			x2 = x1 + draggable.helperProportions.width,
			y2 = y1 + draggable.helperProportions.height,
			l = droppable.offset.left,
			t = droppable.offset.top,
			r = l + droppable.proportions().width,
			b = t + droppable.proportions().height;

		switch ( toleranceMode ) {
		case "fit":
			return ( l <= x1 && x2 <= r && t <= y1 && y2 <= b );
		case "intersect":
			return ( l < x1 + ( draggable.helperProportions.width / 2 ) && // Right Half
				x2 - ( draggable.helperProportions.width / 2 ) < r && // Left Half
				t < y1 + ( draggable.helperProportions.height / 2 ) && // Bottom Half
				y2 - ( draggable.helperProportions.height / 2 ) < b ); // Top Half
		case "pointer":
			return isOverAxis( event.pageY, t, droppable.proportions().height ) &&
				isOverAxis( event.pageX, l, droppable.proportions().width );
		case "touch":
			return (
				( y1 >= t && y1 <= b ) || // Top edge touching
				( y2 >= t && y2 <= b ) || // Bottom edge touching
				( y1 < t && y2 > b ) // Surrounded vertically
			) && (
				( x1 >= l && x1 <= r ) || // Left edge touching
				( x2 >= l && x2 <= r ) || // Right edge touching
				( x1 < l && x2 > r ) // Surrounded horizontally
			);
		default:
			return false;
		}
	};
} )();

/*
	This manager tracks offsets of draggables and droppables
*/
$.ui.ddmanager = {
	current: null,
	droppables: { "default": [] },
	prepareOffsets: function( t, event ) {

		var i, j,
			m = $.ui.ddmanager.droppables[ t.options.scope ] || [],
			type = event ? event.type : null, // workaround for #2317
			list = ( t.currentItem || t.element ).find( ":data(ui-droppable)" ).addBack();

		droppablesLoop: for ( i = 0; i < m.length; i++ ) {

			// No disabled and non-accepted
			if ( m[ i ].options.disabled || ( t && !m[ i ].accept.call( m[ i ].element[ 0 ],
					( t.currentItem || t.element ) ) ) ) {
				continue;
			}

			// Filter out elements in the current dragged item
			for ( j = 0; j < list.length; j++ ) {
				if ( list[ j ] === m[ i ].element[ 0 ] ) {
					m[ i ].proportions().height = 0;
					continue droppablesLoop;
				}
			}

			m[ i ].visible = m[ i ].element.css( "display" ) !== "none";
			if ( !m[ i ].visible ) {
				continue;
			}

			// Activate the droppable if used directly from draggables
			if ( type === "mousedown" ) {
				m[ i ]._activate.call( m[ i ], event );
			}

			m[ i ].offset = m[ i ].element.offset();
			m[ i ].proportions( {
				width: m[ i ].element[ 0 ].offsetWidth,
				height: m[ i ].element[ 0 ].offsetHeight
			} );

		}

	},
	drop: function( draggable, event ) {

		var dropped = false;

		// Create a copy of the droppables in case the list changes during the drop (#9116)
		$.each( ( $.ui.ddmanager.droppables[ draggable.options.scope ] || [] ).slice(), function() {

			if ( !this.options ) {
				return;
			}
			if ( !this.options.disabled && this.visible &&
					intersect( draggable, this, this.options.tolerance, event ) ) {
				dropped = this._drop.call( this, event ) || dropped;
			}

			if ( !this.options.disabled && this.visible && this.accept.call( this.element[ 0 ],
					( draggable.currentItem || draggable.element ) ) ) {
				this.isout = true;
				this.isover = false;
				this._deactivate.call( this, event );
			}

		} );
		return dropped;

	},
	dragStart: function( draggable, event ) {

		// Listen for scrolling so that if the dragging causes scrolling the position of the
		// droppables can be recalculated (see #5003)
		draggable.element.parentsUntil( "body" ).on( "scroll.droppable", function() {
			if ( !draggable.options.refreshPositions ) {
				$.ui.ddmanager.prepareOffsets( draggable, event );
			}
		} );
	},
	drag: function( draggable, event ) {

		// If you have a highly dynamic page, you might try this option. It renders positions
		// every time you move the mouse.
		if ( draggable.options.refreshPositions ) {
			$.ui.ddmanager.prepareOffsets( draggable, event );
		}

		// Run through all droppables and check their positions based on specific tolerance options
		$.each( $.ui.ddmanager.droppables[ draggable.options.scope ] || [], function() {

			if ( this.options.disabled || this.greedyChild || !this.visible ) {
				return;
			}

			var parentInstance, scope, parent,
				intersects = intersect( draggable, this, this.options.tolerance, event ),
				c = !intersects && this.isover ?
					"isout" :
					( intersects && !this.isover ? "isover" : null );
			if ( !c ) {
				return;
			}

			if ( this.options.greedy ) {

				// find droppable parents with same scope
				scope = this.options.scope;
				parent = this.element.parents( ":data(ui-droppable)" ).filter( function() {
					return $( this ).droppable( "instance" ).options.scope === scope;
				} );

				if ( parent.length ) {
					parentInstance = $( parent[ 0 ] ).droppable( "instance" );
					parentInstance.greedyChild = ( c === "isover" );
				}
			}

			// We just moved into a greedy child
			if ( parentInstance && c === "isover" ) {
				parentInstance.isover = false;
				parentInstance.isout = true;
				parentInstance._out.call( parentInstance, event );
			}

			this[ c ] = true;
			this[ c === "isout" ? "isover" : "isout" ] = false;
			this[ c === "isover" ? "_over" : "_out" ].call( this, event );

			// We just moved out of a greedy child
			if ( parentInstance && c === "isout" ) {
				parentInstance.isout = false;
				parentInstance.isover = true;
				parentInstance._over.call( parentInstance, event );
			}
		} );

	},
	dragStop: function( draggable, event ) {
		draggable.element.parentsUntil( "body" ).off( "scroll.droppable" );

		// Call prepareOffsets one final time since IE does not fire return scroll events when
		// overflow was caused by drag (see #5003)
		if ( !draggable.options.refreshPositions ) {
			$.ui.ddmanager.prepareOffsets( draggable, event );
		}
	}
};

// DEPRECATED
// TODO: switch return back to widget declaration at top of file when this is removed
if ( $.uiBackCompat !== false ) {

	// Backcompat for activeClass and hoverClass options
	$.widget( "ui.droppable", $.ui.droppable, {
		options: {
			hoverClass: false,
			activeClass: false
		},
		_addActiveClass: function() {
			this._super();
			if ( this.options.activeClass ) {
				this.element.addClass( this.options.activeClass );
			}
		},
		_removeActiveClass: function() {
			this._super();
			if ( this.options.activeClass ) {
				this.element.removeClass( this.options.activeClass );
			}
		},
		_addHoverClass: function() {
			this._super();
			if ( this.options.hoverClass ) {
				this.element.addClass( this.options.hoverClass );
			}
		},
		_removeHoverClass: function() {
			this._super();
			if ( this.options.hoverClass ) {
				this.element.removeClass( this.options.hoverClass );
			}
		}
	} );
}

var widgetsDroppable = $.ui.droppable;


/*!
 * jQuery UI Resizable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Resizable
//>>group: Interactions
//>>description: Enables resize functionality for any element.
//>>docs: http://api.jqueryui.com/resizable/
//>>demos: http://jqueryui.com/resizable/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/resizable.css
//>>css.theme: ../../themes/base/theme.css



$.widget( "ui.resizable", $.ui.mouse, {
	version: "1.12.1",
	widgetEventPrefix: "resize",
	options: {
		alsoResize: false,
		animate: false,
		animateDuration: "slow",
		animateEasing: "swing",
		aspectRatio: false,
		autoHide: false,
		classes: {
			"ui-resizable-se": "ui-icon ui-icon-gripsmall-diagonal-se"
		},
		containment: false,
		ghost: false,
		grid: false,
		handles: "e,s,se",
		helper: false,
		maxHeight: null,
		maxWidth: null,
		minHeight: 10,
		minWidth: 10,

		// See #7960
		zIndex: 90,

		// Callbacks
		resize: null,
		start: null,
		stop: null
	},

	_num: function( value ) {
		return parseFloat( value ) || 0;
	},

	_isNumber: function( value ) {
		return !isNaN( parseFloat( value ) );
	},

	_hasScroll: function( el, a ) {

		if ( $( el ).css( "overflow" ) === "hidden" ) {
			return false;
		}

		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;

		if ( el[ scroll ] > 0 ) {
			return true;
		}

		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	},

	_create: function() {

		var margins,
			o = this.options,
			that = this;
		this._addClass( "ui-resizable" );

		$.extend( this, {
			_aspectRatio: !!( o.aspectRatio ),
			aspectRatio: o.aspectRatio,
			originalElement: this.element,
			_proportionallyResizeElements: [],
			_helper: o.helper || o.ghost || o.animate ? o.helper || "ui-resizable-helper" : null
		} );

		// Wrap the element if it cannot hold child nodes
		if ( this.element[ 0 ].nodeName.match( /^(canvas|textarea|input|select|button|img)$/i ) ) {

			this.element.wrap(
				$( "<div class='ui-wrapper' style='overflow: hidden;'></div>" ).css( {
					position: this.element.css( "position" ),
					width: this.element.outerWidth(),
					height: this.element.outerHeight(),
					top: this.element.css( "top" ),
					left: this.element.css( "left" )
				} )
			);

			this.element = this.element.parent().data(
				"ui-resizable", this.element.resizable( "instance" )
			);

			this.elementIsWrapper = true;

			margins = {
				marginTop: this.originalElement.css( "marginTop" ),
				marginRight: this.originalElement.css( "marginRight" ),
				marginBottom: this.originalElement.css( "marginBottom" ),
				marginLeft: this.originalElement.css( "marginLeft" )
			};

			this.element.css( margins );
			this.originalElement.css( "margin", 0 );

			// support: Safari
			// Prevent Safari textarea resize
			this.originalResizeStyle = this.originalElement.css( "resize" );
			this.originalElement.css( "resize", "none" );

			this._proportionallyResizeElements.push( this.originalElement.css( {
				position: "static",
				zoom: 1,
				display: "block"
			} ) );

			// Support: IE9
			// avoid IE jump (hard set the margin)
			this.originalElement.css( margins );

			this._proportionallyResize();
		}

		this._setupHandles();

		if ( o.autoHide ) {
			$( this.element )
				.on( "mouseenter", function() {
					if ( o.disabled ) {
						return;
					}
					that._removeClass( "ui-resizable-autohide" );
					that._handles.show();
				} )
				.on( "mouseleave", function() {
					if ( o.disabled ) {
						return;
					}
					if ( !that.resizing ) {
						that._addClass( "ui-resizable-autohide" );
						that._handles.hide();
					}
				} );
		}

		this._mouseInit();
	},

	_destroy: function() {

		this._mouseDestroy();

		var wrapper,
			_destroy = function( exp ) {
				$( exp )
					.removeData( "resizable" )
					.removeData( "ui-resizable" )
					.off( ".resizable" )
					.find( ".ui-resizable-handle" )
						.remove();
			};

		// TODO: Unwrap at same DOM position
		if ( this.elementIsWrapper ) {
			_destroy( this.element );
			wrapper = this.element;
			this.originalElement.css( {
				position: wrapper.css( "position" ),
				width: wrapper.outerWidth(),
				height: wrapper.outerHeight(),
				top: wrapper.css( "top" ),
				left: wrapper.css( "left" )
			} ).insertAfter( wrapper );
			wrapper.remove();
		}

		this.originalElement.css( "resize", this.originalResizeStyle );
		_destroy( this.originalElement );

		return this;
	},

	_setOption: function( key, value ) {
		this._super( key, value );

		switch ( key ) {
		case "handles":
			this._removeHandles();
			this._setupHandles();
			break;
		default:
			break;
		}
	},

	_setupHandles: function() {
		var o = this.options, handle, i, n, hname, axis, that = this;
		this.handles = o.handles ||
			( !$( ".ui-resizable-handle", this.element ).length ?
				"e,s,se" : {
					n: ".ui-resizable-n",
					e: ".ui-resizable-e",
					s: ".ui-resizable-s",
					w: ".ui-resizable-w",
					se: ".ui-resizable-se",
					sw: ".ui-resizable-sw",
					ne: ".ui-resizable-ne",
					nw: ".ui-resizable-nw"
				} );

		this._handles = $();
		if ( this.handles.constructor === String ) {

			if ( this.handles === "all" ) {
				this.handles = "n,e,s,w,se,sw,ne,nw";
			}

			n = this.handles.split( "," );
			this.handles = {};

			for ( i = 0; i < n.length; i++ ) {

				handle = $.trim( n[ i ] );
				hname = "ui-resizable-" + handle;
				axis = $( "<div>" );
				this._addClass( axis, "ui-resizable-handle " + hname );

				axis.css( { zIndex: o.zIndex } );

				this.handles[ handle ] = ".ui-resizable-" + handle;
				this.element.append( axis );
			}

		}

		this._renderAxis = function( target ) {

			var i, axis, padPos, padWrapper;

			target = target || this.element;

			for ( i in this.handles ) {

				if ( this.handles[ i ].constructor === String ) {
					this.handles[ i ] = this.element.children( this.handles[ i ] ).first().show();
				} else if ( this.handles[ i ].jquery || this.handles[ i ].nodeType ) {
					this.handles[ i ] = $( this.handles[ i ] );
					this._on( this.handles[ i ], { "mousedown": that._mouseDown } );
				}

				if ( this.elementIsWrapper &&
						this.originalElement[ 0 ]
							.nodeName
							.match( /^(textarea|input|select|button)$/i ) ) {
					axis = $( this.handles[ i ], this.element );

					padWrapper = /sw|ne|nw|se|n|s/.test( i ) ?
						axis.outerHeight() :
						axis.outerWidth();

					padPos = [ "padding",
						/ne|nw|n/.test( i ) ? "Top" :
						/se|sw|s/.test( i ) ? "Bottom" :
						/^e$/.test( i ) ? "Right" : "Left" ].join( "" );

					target.css( padPos, padWrapper );

					this._proportionallyResize();
				}

				this._handles = this._handles.add( this.handles[ i ] );
			}
		};

		// TODO: make renderAxis a prototype function
		this._renderAxis( this.element );

		this._handles = this._handles.add( this.element.find( ".ui-resizable-handle" ) );
		this._handles.disableSelection();

		this._handles.on( "mouseover", function() {
			if ( !that.resizing ) {
				if ( this.className ) {
					axis = this.className.match( /ui-resizable-(se|sw|ne|nw|n|e|s|w)/i );
				}
				that.axis = axis && axis[ 1 ] ? axis[ 1 ] : "se";
			}
		} );

		if ( o.autoHide ) {
			this._handles.hide();
			this._addClass( "ui-resizable-autohide" );
		}
	},

	_removeHandles: function() {
		this._handles.remove();
	},

	_mouseCapture: function( event ) {
		var i, handle,
			capture = false;

		for ( i in this.handles ) {
			handle = $( this.handles[ i ] )[ 0 ];
			if ( handle === event.target || $.contains( handle, event.target ) ) {
				capture = true;
			}
		}

		return !this.options.disabled && capture;
	},

	_mouseStart: function( event ) {

		var curleft, curtop, cursor,
			o = this.options,
			el = this.element;

		this.resizing = true;

		this._renderProxy();

		curleft = this._num( this.helper.css( "left" ) );
		curtop = this._num( this.helper.css( "top" ) );

		if ( o.containment ) {
			curleft += $( o.containment ).scrollLeft() || 0;
			curtop += $( o.containment ).scrollTop() || 0;
		}

		this.offset = this.helper.offset();
		this.position = { left: curleft, top: curtop };

		this.size = this._helper ? {
				width: this.helper.width(),
				height: this.helper.height()
			} : {
				width: el.width(),
				height: el.height()
			};

		this.originalSize = this._helper ? {
				width: el.outerWidth(),
				height: el.outerHeight()
			} : {
				width: el.width(),
				height: el.height()
			};

		this.sizeDiff = {
			width: el.outerWidth() - el.width(),
			height: el.outerHeight() - el.height()
		};

		this.originalPosition = { left: curleft, top: curtop };
		this.originalMousePosition = { left: event.pageX, top: event.pageY };

		this.aspectRatio = ( typeof o.aspectRatio === "number" ) ?
			o.aspectRatio :
			( ( this.originalSize.width / this.originalSize.height ) || 1 );

		cursor = $( ".ui-resizable-" + this.axis ).css( "cursor" );
		$( "body" ).css( "cursor", cursor === "auto" ? this.axis + "-resize" : cursor );

		this._addClass( "ui-resizable-resizing" );
		this._propagate( "start", event );
		return true;
	},

	_mouseDrag: function( event ) {

		var data, props,
			smp = this.originalMousePosition,
			a = this.axis,
			dx = ( event.pageX - smp.left ) || 0,
			dy = ( event.pageY - smp.top ) || 0,
			trigger = this._change[ a ];

		this._updatePrevProperties();

		if ( !trigger ) {
			return false;
		}

		data = trigger.apply( this, [ event, dx, dy ] );

		this._updateVirtualBoundaries( event.shiftKey );
		if ( this._aspectRatio || event.shiftKey ) {
			data = this._updateRatio( data, event );
		}

		data = this._respectSize( data, event );

		this._updateCache( data );

		this._propagate( "resize", event );

		props = this._applyChanges();

		if ( !this._helper && this._proportionallyResizeElements.length ) {
			this._proportionallyResize();
		}

		if ( !$.isEmptyObject( props ) ) {
			this._updatePrevProperties();
			this._trigger( "resize", event, this.ui() );
			this._applyChanges();
		}

		return false;
	},

	_mouseStop: function( event ) {

		this.resizing = false;
		var pr, ista, soffseth, soffsetw, s, left, top,
			o = this.options, that = this;

		if ( this._helper ) {

			pr = this._proportionallyResizeElements;
			ista = pr.length && ( /textarea/i ).test( pr[ 0 ].nodeName );
			soffseth = ista && this._hasScroll( pr[ 0 ], "left" ) ? 0 : that.sizeDiff.height;
			soffsetw = ista ? 0 : that.sizeDiff.width;

			s = {
				width: ( that.helper.width()  - soffsetw ),
				height: ( that.helper.height() - soffseth )
			};
			left = ( parseFloat( that.element.css( "left" ) ) +
				( that.position.left - that.originalPosition.left ) ) || null;
			top = ( parseFloat( that.element.css( "top" ) ) +
				( that.position.top - that.originalPosition.top ) ) || null;

			if ( !o.animate ) {
				this.element.css( $.extend( s, { top: top, left: left } ) );
			}

			that.helper.height( that.size.height );
			that.helper.width( that.size.width );

			if ( this._helper && !o.animate ) {
				this._proportionallyResize();
			}
		}

		$( "body" ).css( "cursor", "auto" );

		this._removeClass( "ui-resizable-resizing" );

		this._propagate( "stop", event );

		if ( this._helper ) {
			this.helper.remove();
		}

		return false;

	},

	_updatePrevProperties: function() {
		this.prevPosition = {
			top: this.position.top,
			left: this.position.left
		};
		this.prevSize = {
			width: this.size.width,
			height: this.size.height
		};
	},

	_applyChanges: function() {
		var props = {};

		if ( this.position.top !== this.prevPosition.top ) {
			props.top = this.position.top + "px";
		}
		if ( this.position.left !== this.prevPosition.left ) {
			props.left = this.position.left + "px";
		}
		if ( this.size.width !== this.prevSize.width ) {
			props.width = this.size.width + "px";
		}
		if ( this.size.height !== this.prevSize.height ) {
			props.height = this.size.height + "px";
		}

		this.helper.css( props );

		return props;
	},

	_updateVirtualBoundaries: function( forceAspectRatio ) {
		var pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b,
			o = this.options;

		b = {
			minWidth: this._isNumber( o.minWidth ) ? o.minWidth : 0,
			maxWidth: this._isNumber( o.maxWidth ) ? o.maxWidth : Infinity,
			minHeight: this._isNumber( o.minHeight ) ? o.minHeight : 0,
			maxHeight: this._isNumber( o.maxHeight ) ? o.maxHeight : Infinity
		};

		if ( this._aspectRatio || forceAspectRatio ) {
			pMinWidth = b.minHeight * this.aspectRatio;
			pMinHeight = b.minWidth / this.aspectRatio;
			pMaxWidth = b.maxHeight * this.aspectRatio;
			pMaxHeight = b.maxWidth / this.aspectRatio;

			if ( pMinWidth > b.minWidth ) {
				b.minWidth = pMinWidth;
			}
			if ( pMinHeight > b.minHeight ) {
				b.minHeight = pMinHeight;
			}
			if ( pMaxWidth < b.maxWidth ) {
				b.maxWidth = pMaxWidth;
			}
			if ( pMaxHeight < b.maxHeight ) {
				b.maxHeight = pMaxHeight;
			}
		}
		this._vBoundaries = b;
	},

	_updateCache: function( data ) {
		this.offset = this.helper.offset();
		if ( this._isNumber( data.left ) ) {
			this.position.left = data.left;
		}
		if ( this._isNumber( data.top ) ) {
			this.position.top = data.top;
		}
		if ( this._isNumber( data.height ) ) {
			this.size.height = data.height;
		}
		if ( this._isNumber( data.width ) ) {
			this.size.width = data.width;
		}
	},

	_updateRatio: function( data ) {

		var cpos = this.position,
			csize = this.size,
			a = this.axis;

		if ( this._isNumber( data.height ) ) {
			data.width = ( data.height * this.aspectRatio );
		} else if ( this._isNumber( data.width ) ) {
			data.height = ( data.width / this.aspectRatio );
		}

		if ( a === "sw" ) {
			data.left = cpos.left + ( csize.width - data.width );
			data.top = null;
		}
		if ( a === "nw" ) {
			data.top = cpos.top + ( csize.height - data.height );
			data.left = cpos.left + ( csize.width - data.width );
		}

		return data;
	},

	_respectSize: function( data ) {

		var o = this._vBoundaries,
			a = this.axis,
			ismaxw = this._isNumber( data.width ) && o.maxWidth && ( o.maxWidth < data.width ),
			ismaxh = this._isNumber( data.height ) && o.maxHeight && ( o.maxHeight < data.height ),
			isminw = this._isNumber( data.width ) && o.minWidth && ( o.minWidth > data.width ),
			isminh = this._isNumber( data.height ) && o.minHeight && ( o.minHeight > data.height ),
			dw = this.originalPosition.left + this.originalSize.width,
			dh = this.originalPosition.top + this.originalSize.height,
			cw = /sw|nw|w/.test( a ), ch = /nw|ne|n/.test( a );
		if ( isminw ) {
			data.width = o.minWidth;
		}
		if ( isminh ) {
			data.height = o.minHeight;
		}
		if ( ismaxw ) {
			data.width = o.maxWidth;
		}
		if ( ismaxh ) {
			data.height = o.maxHeight;
		}

		if ( isminw && cw ) {
			data.left = dw - o.minWidth;
		}
		if ( ismaxw && cw ) {
			data.left = dw - o.maxWidth;
		}
		if ( isminh && ch ) {
			data.top = dh - o.minHeight;
		}
		if ( ismaxh && ch ) {
			data.top = dh - o.maxHeight;
		}

		// Fixing jump error on top/left - bug #2330
		if ( !data.width && !data.height && !data.left && data.top ) {
			data.top = null;
		} else if ( !data.width && !data.height && !data.top && data.left ) {
			data.left = null;
		}

		return data;
	},

	_getPaddingPlusBorderDimensions: function( element ) {
		var i = 0,
			widths = [],
			borders = [
				element.css( "borderTopWidth" ),
				element.css( "borderRightWidth" ),
				element.css( "borderBottomWidth" ),
				element.css( "borderLeftWidth" )
			],
			paddings = [
				element.css( "paddingTop" ),
				element.css( "paddingRight" ),
				element.css( "paddingBottom" ),
				element.css( "paddingLeft" )
			];

		for ( ; i < 4; i++ ) {
			widths[ i ] = ( parseFloat( borders[ i ] ) || 0 );
			widths[ i ] += ( parseFloat( paddings[ i ] ) || 0 );
		}

		return {
			height: widths[ 0 ] + widths[ 2 ],
			width: widths[ 1 ] + widths[ 3 ]
		};
	},

	_proportionallyResize: function() {

		if ( !this._proportionallyResizeElements.length ) {
			return;
		}

		var prel,
			i = 0,
			element = this.helper || this.element;

		for ( ; i < this._proportionallyResizeElements.length; i++ ) {

			prel = this._proportionallyResizeElements[ i ];

			// TODO: Seems like a bug to cache this.outerDimensions
			// considering that we are in a loop.
			if ( !this.outerDimensions ) {
				this.outerDimensions = this._getPaddingPlusBorderDimensions( prel );
			}

			prel.css( {
				height: ( element.height() - this.outerDimensions.height ) || 0,
				width: ( element.width() - this.outerDimensions.width ) || 0
			} );

		}

	},

	_renderProxy: function() {

		var el = this.element, o = this.options;
		this.elementOffset = el.offset();

		if ( this._helper ) {

			this.helper = this.helper || $( "<div style='overflow:hidden;'></div>" );

			this._addClass( this.helper, this._helper );
			this.helper.css( {
				width: this.element.outerWidth(),
				height: this.element.outerHeight(),
				position: "absolute",
				left: this.elementOffset.left + "px",
				top: this.elementOffset.top + "px",
				zIndex: ++o.zIndex //TODO: Don't modify option
			} );

			this.helper
				.appendTo( "body" )
				.disableSelection();

		} else {
			this.helper = this.element;
		}

	},

	_change: {
		e: function( event, dx ) {
			return { width: this.originalSize.width + dx };
		},
		w: function( event, dx ) {
			var cs = this.originalSize, sp = this.originalPosition;
			return { left: sp.left + dx, width: cs.width - dx };
		},
		n: function( event, dx, dy ) {
			var cs = this.originalSize, sp = this.originalPosition;
			return { top: sp.top + dy, height: cs.height - dy };
		},
		s: function( event, dx, dy ) {
			return { height: this.originalSize.height + dy };
		},
		se: function( event, dx, dy ) {
			return $.extend( this._change.s.apply( this, arguments ),
				this._change.e.apply( this, [ event, dx, dy ] ) );
		},
		sw: function( event, dx, dy ) {
			return $.extend( this._change.s.apply( this, arguments ),
				this._change.w.apply( this, [ event, dx, dy ] ) );
		},
		ne: function( event, dx, dy ) {
			return $.extend( this._change.n.apply( this, arguments ),
				this._change.e.apply( this, [ event, dx, dy ] ) );
		},
		nw: function( event, dx, dy ) {
			return $.extend( this._change.n.apply( this, arguments ),
				this._change.w.apply( this, [ event, dx, dy ] ) );
		}
	},

	_propagate: function( n, event ) {
		$.ui.plugin.call( this, n, [ event, this.ui() ] );
		( n !== "resize" && this._trigger( n, event, this.ui() ) );
	},

	plugins: {},

	ui: function() {
		return {
			originalElement: this.originalElement,
			element: this.element,
			helper: this.helper,
			position: this.position,
			size: this.size,
			originalSize: this.originalSize,
			originalPosition: this.originalPosition
		};
	}

} );

/*
 * Resizable Extensions
 */

$.ui.plugin.add( "resizable", "animate", {

	stop: function( event ) {
		var that = $( this ).resizable( "instance" ),
			o = that.options,
			pr = that._proportionallyResizeElements,
			ista = pr.length && ( /textarea/i ).test( pr[ 0 ].nodeName ),
			soffseth = ista && that._hasScroll( pr[ 0 ], "left" ) ? 0 : that.sizeDiff.height,
			soffsetw = ista ? 0 : that.sizeDiff.width,
			style = {
				width: ( that.size.width - soffsetw ),
				height: ( that.size.height - soffseth )
			},
			left = ( parseFloat( that.element.css( "left" ) ) +
				( that.position.left - that.originalPosition.left ) ) || null,
			top = ( parseFloat( that.element.css( "top" ) ) +
				( that.position.top - that.originalPosition.top ) ) || null;

		that.element.animate(
			$.extend( style, top && left ? { top: top, left: left } : {} ), {
				duration: o.animateDuration,
				easing: o.animateEasing,
				step: function() {

					var data = {
						width: parseFloat( that.element.css( "width" ) ),
						height: parseFloat( that.element.css( "height" ) ),
						top: parseFloat( that.element.css( "top" ) ),
						left: parseFloat( that.element.css( "left" ) )
					};

					if ( pr && pr.length ) {
						$( pr[ 0 ] ).css( { width: data.width, height: data.height } );
					}

					// Propagating resize, and updating values for each animation step
					that._updateCache( data );
					that._propagate( "resize", event );

				}
			}
		);
	}

} );

$.ui.plugin.add( "resizable", "containment", {

	start: function() {
		var element, p, co, ch, cw, width, height,
			that = $( this ).resizable( "instance" ),
			o = that.options,
			el = that.element,
			oc = o.containment,
			ce = ( oc instanceof $ ) ?
				oc.get( 0 ) :
				( /parent/.test( oc ) ) ? el.parent().get( 0 ) : oc;

		if ( !ce ) {
			return;
		}

		that.containerElement = $( ce );

		if ( /document/.test( oc ) || oc === document ) {
			that.containerOffset = {
				left: 0,
				top: 0
			};
			that.containerPosition = {
				left: 0,
				top: 0
			};

			that.parentData = {
				element: $( document ),
				left: 0,
				top: 0,
				width: $( document ).width(),
				height: $( document ).height() || document.body.parentNode.scrollHeight
			};
		} else {
			element = $( ce );
			p = [];
			$( [ "Top", "Right", "Left", "Bottom" ] ).each( function( i, name ) {
				p[ i ] = that._num( element.css( "padding" + name ) );
			} );

			that.containerOffset = element.offset();
			that.containerPosition = element.position();
			that.containerSize = {
				height: ( element.innerHeight() - p[ 3 ] ),
				width: ( element.innerWidth() - p[ 1 ] )
			};

			co = that.containerOffset;
			ch = that.containerSize.height;
			cw = that.containerSize.width;
			width = ( that._hasScroll ( ce, "left" ) ? ce.scrollWidth : cw );
			height = ( that._hasScroll ( ce ) ? ce.scrollHeight : ch ) ;

			that.parentData = {
				element: ce,
				left: co.left,
				top: co.top,
				width: width,
				height: height
			};
		}
	},

	resize: function( event ) {
		var woset, hoset, isParent, isOffsetRelative,
			that = $( this ).resizable( "instance" ),
			o = that.options,
			co = that.containerOffset,
			cp = that.position,
			pRatio = that._aspectRatio || event.shiftKey,
			cop = {
				top: 0,
				left: 0
			},
			ce = that.containerElement,
			continueResize = true;

		if ( ce[ 0 ] !== document && ( /static/ ).test( ce.css( "position" ) ) ) {
			cop = co;
		}

		if ( cp.left < ( that._helper ? co.left : 0 ) ) {
			that.size.width = that.size.width +
				( that._helper ?
					( that.position.left - co.left ) :
					( that.position.left - cop.left ) );

			if ( pRatio ) {
				that.size.height = that.size.width / that.aspectRatio;
				continueResize = false;
			}
			that.position.left = o.helper ? co.left : 0;
		}

		if ( cp.top < ( that._helper ? co.top : 0 ) ) {
			that.size.height = that.size.height +
				( that._helper ?
					( that.position.top - co.top ) :
					that.position.top );

			if ( pRatio ) {
				that.size.width = that.size.height * that.aspectRatio;
				continueResize = false;
			}
			that.position.top = that._helper ? co.top : 0;
		}

		isParent = that.containerElement.get( 0 ) === that.element.parent().get( 0 );
		isOffsetRelative = /relative|absolute/.test( that.containerElement.css( "position" ) );

		if ( isParent && isOffsetRelative ) {
			that.offset.left = that.parentData.left + that.position.left;
			that.offset.top = that.parentData.top + that.position.top;
		} else {
			that.offset.left = that.element.offset().left;
			that.offset.top = that.element.offset().top;
		}

		woset = Math.abs( that.sizeDiff.width +
			( that._helper ?
				that.offset.left - cop.left :
				( that.offset.left - co.left ) ) );

		hoset = Math.abs( that.sizeDiff.height +
			( that._helper ?
				that.offset.top - cop.top :
				( that.offset.top - co.top ) ) );

		if ( woset + that.size.width >= that.parentData.width ) {
			that.size.width = that.parentData.width - woset;
			if ( pRatio ) {
				that.size.height = that.size.width / that.aspectRatio;
				continueResize = false;
			}
		}

		if ( hoset + that.size.height >= that.parentData.height ) {
			that.size.height = that.parentData.height - hoset;
			if ( pRatio ) {
				that.size.width = that.size.height * that.aspectRatio;
				continueResize = false;
			}
		}

		if ( !continueResize ) {
			that.position.left = that.prevPosition.left;
			that.position.top = that.prevPosition.top;
			that.size.width = that.prevSize.width;
			that.size.height = that.prevSize.height;
		}
	},

	stop: function() {
		var that = $( this ).resizable( "instance" ),
			o = that.options,
			co = that.containerOffset,
			cop = that.containerPosition,
			ce = that.containerElement,
			helper = $( that.helper ),
			ho = helper.offset(),
			w = helper.outerWidth() - that.sizeDiff.width,
			h = helper.outerHeight() - that.sizeDiff.height;

		if ( that._helper && !o.animate && ( /relative/ ).test( ce.css( "position" ) ) ) {
			$( this ).css( {
				left: ho.left - cop.left - co.left,
				width: w,
				height: h
			} );
		}

		if ( that._helper && !o.animate && ( /static/ ).test( ce.css( "position" ) ) ) {
			$( this ).css( {
				left: ho.left - cop.left - co.left,
				width: w,
				height: h
			} );
		}
	}
} );

$.ui.plugin.add( "resizable", "alsoResize", {

	start: function() {
		var that = $( this ).resizable( "instance" ),
			o = that.options;

		$( o.alsoResize ).each( function() {
			var el = $( this );
			el.data( "ui-resizable-alsoresize", {
				width: parseFloat( el.width() ), height: parseFloat( el.height() ),
				left: parseFloat( el.css( "left" ) ), top: parseFloat( el.css( "top" ) )
			} );
		} );
	},

	resize: function( event, ui ) {
		var that = $( this ).resizable( "instance" ),
			o = that.options,
			os = that.originalSize,
			op = that.originalPosition,
			delta = {
				height: ( that.size.height - os.height ) || 0,
				width: ( that.size.width - os.width ) || 0,
				top: ( that.position.top - op.top ) || 0,
				left: ( that.position.left - op.left ) || 0
			};

			$( o.alsoResize ).each( function() {
				var el = $( this ), start = $( this ).data( "ui-resizable-alsoresize" ), style = {},
					css = el.parents( ui.originalElement[ 0 ] ).length ?
							[ "width", "height" ] :
							[ "width", "height", "top", "left" ];

				$.each( css, function( i, prop ) {
					var sum = ( start[ prop ] || 0 ) + ( delta[ prop ] || 0 );
					if ( sum && sum >= 0 ) {
						style[ prop ] = sum || null;
					}
				} );

				el.css( style );
			} );
	},

	stop: function() {
		$( this ).removeData( "ui-resizable-alsoresize" );
	}
} );

$.ui.plugin.add( "resizable", "ghost", {

	start: function() {

		var that = $( this ).resizable( "instance" ), cs = that.size;

		that.ghost = that.originalElement.clone();
		that.ghost.css( {
			opacity: 0.25,
			display: "block",
			position: "relative",
			height: cs.height,
			width: cs.width,
			margin: 0,
			left: 0,
			top: 0
		} );

		that._addClass( that.ghost, "ui-resizable-ghost" );

		// DEPRECATED
		// TODO: remove after 1.12
		if ( $.uiBackCompat !== false && typeof that.options.ghost === "string" ) {

			// Ghost option
			that.ghost.addClass( this.options.ghost );
		}

		that.ghost.appendTo( that.helper );

	},

	resize: function() {
		var that = $( this ).resizable( "instance" );
		if ( that.ghost ) {
			that.ghost.css( {
				position: "relative",
				height: that.size.height,
				width: that.size.width
			} );
		}
	},

	stop: function() {
		var that = $( this ).resizable( "instance" );
		if ( that.ghost && that.helper ) {
			that.helper.get( 0 ).removeChild( that.ghost.get( 0 ) );
		}
	}

} );

$.ui.plugin.add( "resizable", "grid", {

	resize: function() {
		var outerDimensions,
			that = $( this ).resizable( "instance" ),
			o = that.options,
			cs = that.size,
			os = that.originalSize,
			op = that.originalPosition,
			a = that.axis,
			grid = typeof o.grid === "number" ? [ o.grid, o.grid ] : o.grid,
			gridX = ( grid[ 0 ] || 1 ),
			gridY = ( grid[ 1 ] || 1 ),
			ox = Math.round( ( cs.width - os.width ) / gridX ) * gridX,
			oy = Math.round( ( cs.height - os.height ) / gridY ) * gridY,
			newWidth = os.width + ox,
			newHeight = os.height + oy,
			isMaxWidth = o.maxWidth && ( o.maxWidth < newWidth ),
			isMaxHeight = o.maxHeight && ( o.maxHeight < newHeight ),
			isMinWidth = o.minWidth && ( o.minWidth > newWidth ),
			isMinHeight = o.minHeight && ( o.minHeight > newHeight );

		o.grid = grid;

		if ( isMinWidth ) {
			newWidth += gridX;
		}
		if ( isMinHeight ) {
			newHeight += gridY;
		}
		if ( isMaxWidth ) {
			newWidth -= gridX;
		}
		if ( isMaxHeight ) {
			newHeight -= gridY;
		}

		if ( /^(se|s|e)$/.test( a ) ) {
			that.size.width = newWidth;
			that.size.height = newHeight;
		} else if ( /^(ne)$/.test( a ) ) {
			that.size.width = newWidth;
			that.size.height = newHeight;
			that.position.top = op.top - oy;
		} else if ( /^(sw)$/.test( a ) ) {
			that.size.width = newWidth;
			that.size.height = newHeight;
			that.position.left = op.left - ox;
		} else {
			if ( newHeight - gridY <= 0 || newWidth - gridX <= 0 ) {
				outerDimensions = that._getPaddingPlusBorderDimensions( this );
			}

			if ( newHeight - gridY > 0 ) {
				that.size.height = newHeight;
				that.position.top = op.top - oy;
			} else {
				newHeight = gridY - outerDimensions.height;
				that.size.height = newHeight;
				that.position.top = op.top + os.height - newHeight;
			}
			if ( newWidth - gridX > 0 ) {
				that.size.width = newWidth;
				that.position.left = op.left - ox;
			} else {
				newWidth = gridX - outerDimensions.width;
				that.size.width = newWidth;
				that.position.left = op.left + os.width - newWidth;
			}
		}
	}

} );

var widgetsResizable = $.ui.resizable;




}));
/*!
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011–2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function ($) {

  // Detect touch support
  $.support.touch = 'ontouchend' in document;

  // Ignore browsers without touch support
  if (!$.support.touch) {
    return;
  }

  var mouseProto = $.ui.mouse.prototype,
      _mouseInit = mouseProto._mouseInit,
      _mouseDestroy = mouseProto._mouseDestroy,
      touchHandled;

  /**
   * Simulate a mouse event based on a corresponding touch event
   * @param {Object} event A touch event
   * @param {String} simulatedType The corresponding mouse event
   */
  function simulateMouseEvent (event, simulatedType) {

    // Ignore multi-touch events
    if (event.originalEvent.touches.length > 1) {
      return;
    }

    event.preventDefault();

    var touch = event.originalEvent.changedTouches[0],
        simulatedEvent = document.createEvent('MouseEvents');
    
    // Initialize the simulated mouse event using the touch event's coordinates
    simulatedEvent.initMouseEvent(
      simulatedType,    // type
      true,             // bubbles                    
      true,             // cancelable                 
      window,           // view                       
      1,                // detail                     
      touch.screenX,    // screenX                    
      touch.screenY,    // screenY                    
      touch.clientX,    // clientX                    
      touch.clientY,    // clientY                    
      false,            // ctrlKey                    
      false,            // altKey                     
      false,            // shiftKey                   
      false,            // metaKey                    
      0,                // button                     
      null              // relatedTarget              
    );

    // Dispatch the simulated event to the target element
    event.target.dispatchEvent(simulatedEvent);
  }

  /**
   * Handle the jQuery UI widget's touchstart events
   * @param {Object} event The widget element's touchstart event
   */
  mouseProto._touchStart = function (event) {

    var self = this;

    // Ignore the event if another widget is already being handled
    if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
      return;
    }

    // Set the flag to prevent other widgets from inheriting the touch event
    touchHandled = true;

    // Track movement to determine if interaction was a click
    self._touchMoved = false;

    // Simulate the mouseover event
    simulateMouseEvent(event, 'mouseover');

    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');

    // Simulate the mousedown event
    simulateMouseEvent(event, 'mousedown');
  };

  /**
   * Handle the jQuery UI widget's touchmove events
   * @param {Object} event The document's touchmove event
   */
  mouseProto._touchMove = function (event) {

    // Ignore event if not handled
    if (!touchHandled) {
      return;
    }

    // Interaction was not a click
    this._touchMoved = true;

    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');
  };

  /**
   * Handle the jQuery UI widget's touchend events
   * @param {Object} event The document's touchend event
   */
  mouseProto._touchEnd = function (event) {

    // Ignore event if not handled
    if (!touchHandled) {
      return;
    }

    // Simulate the mouseup event
    simulateMouseEvent(event, 'mouseup');

    // Simulate the mouseout event
    simulateMouseEvent(event, 'mouseout');

    // If the touch interaction did not move, it should trigger a click
    if (!this._touchMoved) {

      // Simulate the click event
      simulateMouseEvent(event, 'click');
    }

    // Unset the flag to allow other widgets to inherit the touch event
    touchHandled = false;
  };

  /**
   * A duck punch of the $.ui.mouse _mouseInit method to support touch events.
   * This method extends the widget with bound touch event handlers that
   * translate touch events to mouse events and pass them to the widget's
   * original mouse event handling methods.
   */
  mouseProto._mouseInit = function () {
    
    var self = this;

    // Delegate the touch handlers to the widget's element
    self.element.bind({
      touchstart: $.proxy(self, '_touchStart'),
      touchmove: $.proxy(self, '_touchMove'),
      touchend: $.proxy(self, '_touchEnd')
    });

    // Call the original $.ui.mouse init method
    _mouseInit.call(self);
  };

  /**
   * Remove the touch event handlers
   */
  mouseProto._mouseDestroy = function () {
    
    var self = this;

    // Delegate the touch handlers to the widget's element
    self.element.unbind({
      touchstart: $.proxy(self, '_touchStart'),
      touchmove: $.proxy(self, '_touchMove'),
      touchend: $.proxy(self, '_touchEnd')
    });

    // Call the original $.ui.mouse destroy method
    _mouseDestroy.call(self);
  };

})(jQuery);

//class ARect

function ARect(l, t, w, h)
{
	if(h==undefined) this.setEmpty();
	else this.setSizeRect(l,t,w,h);
}

ARect.prototype.setPointRect = function(l, t, r, b)
{
	this.left = l;
	this.top = t;
	this.right = r;
	this.bottom = b;
	
	this.refreshSize();
};

ARect.prototype.setSizeRect = function(l, t, w, h)
{
	this.left = l;
	this.top = t;
	this.width = w;
	this.height = h;
	
	this.refreshRect();
};

ARect.prototype.offsetRect = function(offsetX, offsetY)
{
	this.left += offsetX;
	this.top += offsetY;
	this.right += offsetX;
	this.bottom += offsetY;
	
	this.refreshSize();
};


ARect.prototype.copyRect = function(src)
{
	this.left = src.left;
	this.top = src.top;
	this.right = src.right;
	this.bottom = src.bottom;
	
	this.refreshSize();
};

ARect.prototype.setEmpty = function()
{
	this.setSizeRect(0,0,0,0);
};

ARect.prototype.absRect = function()
{
	if(this.width<0) this.reverseX();
	if(this.height<0) this.reverseY();
};

ARect.prototype.reverseX = function()
{
	var tmp = this.left;
	this.left = this.right;
	this.right = tmp;
	this.refreshSize();
};

ARect.prototype.reverseY = function()
{
	var tmp = this.top;
	this.top = this.bottom;
	this.bottom = tmp;
	this.refreshSize();
};

ARect.prototype.refreshSize = function()
{
	this.width = this.right-this.left;
	this.height = this.bottom-this.top;
};

ARect.prototype.refreshRect = function()
{
	this.right = this.left+this.width;
	this.bottom = this.top+this.height;
};

ARect.prototype.isSubsetPt = function(x, y)
{
	return (x>this.left && x<this.right && y>this.top && y<this.bottom);
};

//포함하는 rect 인지
ARect.prototype.isSubsetRt = function(rt)
{
	return (rt.left>this.left && rt.right<this.right && rt.top>this.top && rt.bottom<this.bottom);
};

//교차하는 rect 인지
ARect.prototype.isIntersectRt = function(rt)
{
	return !(rt.left > this.right || rt.right < this.left || rt.top > this.bottom || rt.bottom < this.top);
};

ARect.prototype.isRectEmpty = function()
{
    return (this.width==0 && this.height==0);
};

var AUtil = 
{
};



AUtil.RgbToHsl = function(r, g, b)
{
	//r = parseInt(r)/255, g = parseInt(g)/255, b = parseInt(b)/255;
	
	r /= 255, g /= 255, b /= 255;
	
	var max = Math.max(r,g,b), min = Math.min(r,g,b),
		h, s, l = (max + min) / 2;
		
	if(max==min)
	{
		h = s = 0;
	}
	else
	{
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch(max)
		{
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		
		h /= 6;
	}
	
	//return [h*360, s*100, l*100];
	return [h, s, l];
};

AUtil.OppositeColor = function(r, g, b)
{
	return [255-r, 255-g, 255-b];
};

	
AUtil.formatDate = function(dateStr)
{
	dateStr += '';
	var date = dateStr.replace(/:/g, '');
	return date.substring(0, 2)+':'+date.substring(2, 4)+':'+date.substring(4, 6);
};

AUtil.makeNumString = function(size, value)
{
	var ret = '';
	value = ''+value;

	//빈자리는 0 으로 채움
	var valueInx = size - value.length; 
	for(var i=0; i<valueInx; i++)
		ret += '0';

	//실제 숫자를 채움
	for(var j=0; i<size; i++, j++)
		ret += value.charAt(j);

	return ret;
};

AUtil.autoShrink = function(ele, info) 
{
	if(info)
	{		
		var $ele = $(ele);
		var len = $.trim($ele.text()).length;
		var unit = info.unit?info.unit:'px';
		len = (info.maxChar-len)/len;
		if(len<0) ele.style.setProperty('font-size', (info.fontSize+info.fontSize*len)+unit, 'important');
		else ele.style.setProperty('font-size', info.fontSize+unit, 'important');
	}
		
};
	
AUtil.makeStack = function(targetDom)
{
	var stack = $('<div style="display:none;"></div>');
	targetDom.append(stack);
	return stack;
};

//curDom에서 tagName을 가진 바로 이전 돔객체 리턴
AUtil.findPrevByTagName = function(curDom, tagName)
{
	
	var resTag = null;
	var findLen = 0;
	var childTag = null;
	
	resTag = $(curDom).prev(tagName+':visible');
	findLen = resTag.length;
	if(findLen > 0)
	{
		childTag = resTag.find(tagName+':visible');
		findLen = childTag.length;
		if(findLen > 0) resTag = childTag.last();
	}
	else
	{
		resTag = $(curDom).parents(tagName+':visible');
		if(resTag.length > 0) resTag = resTag.first();
		else resTag = null;
	} 
	
	if(resTag) resTag = resTag[0];
	return resTag;
};


//curDom에서 tagName을 가진 바로 다음 돔객체 리턴
AUtil.findNextByTagName = function(curDom, tagName)
{	
	var resTag = null;
	var findLen = 0;
	var childTag = null;
	
	resTag = $(curDom).find(tagName+':visible');
	findLen = resTag.length;
	if(findLen > 0) return resTag.first()[0];
	else
	{
		resTag = $(curDom).next(tagName+':visible');
		if(resTag.length > 0) return resTag[0];
		else
		{
			var parentsTags = $(curDom).parents(tagName+':visible');
			if(parentsTags.length > 0)
			{
				var nextTag = null;
				for(var i = 0; i<parentsTags.length; i++)
				{
					nextTag = parentsTags.eq(i).next(tagName+':visible');
					if(nextTag.length > 0) return nextTag[0];
				}
				return null;
			}
			else return null;
		}  
	}
};

AUtil.extractFileName = function(path, split)
{
	if(!split) split = afc.DIV;
	var start = path.lastIndexOf(split);
 	var end = path.length;
 	return path.substring(start+1, end);
};

AUtil.extractFileNameExceptExt = function(path, split)
{
	if(!split) split = afc.DIV;

	var start = path.lastIndexOf(split);
	var end = path.lastIndexOf('.');
	if(end < 0) end = path.length;
 	return path.substring(start+1, end);
};

AUtil.extractLoc = function(path, split)
{
	if(!split) split = afc.DIV;
 	var end = path.lastIndexOf(split);
 	return path.substring(0, end+1);
};
	
AUtil.extractExtName = function(path)
{
 	var start = path.lastIndexOf(".");
 	var end = path.length;
	
	if(start<0) return '';
	
 	return path.substring(start+1, end);
};

AUtil.filePathExceptExt = function(fileName)
{
 	return fileName.substring(0, fileName.lastIndexOf("."));
};


AUtil.shuffle = function(arr) 
{
    var i, j, x;
    for(i=arr.length-1; i>0; i--) 
	{
        j = Math.floor(Math.random() * (i + 1));
        x = arr[i];
        arr[i] = arr[j];
        arr[j] = x;
    }
};

AUtil.randInt = function(min, max) 
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

AUtil.readTextFile = function(filePathName){
	var result = null;
	
	var pre = '';
	if(PROJECT_OPTION.build.subName) pre = PROJECT_OPTION.build.subName + '/';
	
	$.ajax({
	  dataType: "json",
	  url: pre + filePathName,
	  data: null,
	  async: false, 
	  success: function(res) {
		  if(res) result = res;
	  },
	  error: function (){}
	});
	return result;
};

AUtil.isExistFile = function(fileUrl)
{
	var result = null;
	
	var pre = '';
	if(PROJECT_OPTION.build.subName) pre = PROJECT_OPTION.build.subName + '/';
	
	$.ajax({
		type: "html",
		url: pre + fileUrl,
		async: false, 
		success: function(data) {
			if(data) result = true;
			else result = false;
		},
		error: function () {
			result = false;
		}
	});
	return result;
};

//noOverwrite 가 true 이면, 기존의 값이 존재할 경우 덮어쓰지 않는다.
AUtil.optionHelper = function(obj, option, noOverwrite)
{
    for(var p in option)
    {
    	if(!option.hasOwnProperty(p)) continue;
    	
		if(!noOverwrite || obj.option[p]==undefined)
		{
			obj.option[p] = option[p];
		}
    }
};

AUtil.safeDelay = function(chkComp, func, delay)
{
	return setTimeout(function()
   	{
		if(chkComp && !chkComp.isValid()) return;
		
		func();

	}, delay);

};

AUtil.tagEvent = function(tag, e, eventName)
{
	var acomp, parentEle = tag.parentElement;
	while(parentEle) {
		acomp = parentEle.acomp;
		if(acomp) break;
		parentEle = parentEle.parentElement;
	}
	if(acomp) {
		if(acomp.isDev()) return;
		
		var rootView = acomp.getRootView();
		if(rootView[eventName]) {
			rootView[eventName].call(rootView, tag, acomp, e);
		}
	}
};

AUtil.tagCheckedByName = function(tag, name)
{
	var checked = tag.checked;
	var acomp, parentEle = tag.parentElement;
	while(parentEle) {
		acomp = parentEle.acomp;
		if(acomp) break;
		parentEle = parentEle.parentElement;
	}
	if(acomp) {
		parentEle.querySelectorAll(`[name="${name}"]`).forEach(ele => {
			ele.checked = checked;
		});
	}
};

//----------------------------------------------------------------------------

(function($) {
    $.fn.textfill = function(maxFontPixels) 
	{
        var fontSize = maxFontPixels, ourText = $('span:visible:first', this),
        	maxHeight = $(this).height(), maxWidth = $(this).width(), textHeight, textWidth;
			
        do 
		{
            ourText.css('font-size', fontSize);
            textHeight = ourText.height();
            textWidth = ourText.width();
            fontSize = fontSize - 1;
        } while ((textHeight > maxHeight || textWidth > maxWidth) && fontSize > 3);
		
        return this;
    }
})(jQuery);


//info : {maxChar:15, fontSize:24, unit:'px'}
(function($) {
    $.fn.autoShrink = function(info) 
	{
		if(info)
		{
			var $ele = $(this);
			var len = $.trim($ele.text()).length;
			var unit = info.unit?info.unit:'px';
			len = (info.maxChar-len)/len;
			if(len<0) $ele[0].style.setProperty('font-size', (info.fontSize+info.fontSize*len)+unit, 'important');
			else $ele[0].style.setProperty('font-size', info.fontSize+unit, 'important');
		}
		
        return this;
    }
})(jQuery);

/*
(function($) {
    $.fn.removeNoLeak = function() 
	{
		var $ele = $(this);
		//$ele.unbind();
		$ele.remove();
    }
})(jQuery);
*/


var tmpl_style = ['font-family', 'font-size', 'font-weight','font-style','color',
    'word-spacing','line-height','text-align','vertical-align',
    'opacity', 'white-space',
    'background',
	'background-color', 'background-image','background-repeat','background-position', 'background-size',
	
    'border', 'padding',
	
	'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-content',
	'border-radius', 'word-break',
    ];

var tmpl_style_obj = {
	'border' : ['border-width', 'border-color', 'border-style'],
	'border-width' : ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'],
	'border-color' : ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'],
	'border-style' : ['border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style'],
	'padding' : ['padding-top', 'padding-right', 'padding-bottom', 'padding-left']
};

(function($) {
    $.fn.getDefinedStyle = function(isComputed) {
        var dom = this.get(0), retObj = {}, style, val;
		
		if(!dom) return retObj;
        
        if(isComputed)
        {
	        if(window.getComputedStyle)
	        {
	            style = window.getComputedStyle(dom, null);
	            
				_style_helper(tmpl_style);
				/*
	            for(var i=0; i<tmpl_style.length; i++)
	            {
	            	val = style.getPropertyValue(tmpl_style[i]);
	            	if(val) retObj[tmpl_style[i]] = val;
	            }*/
	        }
        	
        }
        else
        {
            style = dom.style;
	        
			_style_helper(tmpl_style);
			/*
            for(var i=0; i<tmpl_style.length; i++)
            {
            	val = style[tmpl_style[i]];
            	if(val) retObj[tmpl_style[i]] = val;
            }*/
        }
		
		function _style_helper(styleArr)
		{
            for(var i=0; i<styleArr.length; i++)
            {
				if(isComputed) val = style.getPropertyValue(styleArr[i]);
				else val = style[styleArr[i]];
				
            	if(val) retObj[styleArr[i]] = val;
				else if(tmpl_style_obj[styleArr[i]])
				{
					_style_helper(tmpl_style_obj[styleArr[i]]);
				}
            }
		}
        
        return retObj;
    };
    
})(jQuery);

(function($) 
{
    $.fn.hasScrollBar = function() {
        return ( this.get(0).scrollHeight-this.height() >= 1 );	//ie 11 에서는 소수점이 나오는 버그 수정
    };
})(jQuery);

//for ie11
(function(E, d, w) {
    if(!E.composedPath) 
    {
      E.composedPath = function() 
      {
        if (this.path) 
        {
          return this.path;
        } 
        var target = this.target;
      
        this.path = [];
        while (target.parentNode !== null) 
        {
            this.path.push(target);
            target = target.parentNode;
        }
        this.path.push(d, w);
        return this.path;
      };
    }
})(Event.prototype, document, window);
  
//---------------------------------------------------------------------------------------------------


function AHistoryInfo()
{
    this.infoHistory = new Array();
    this.curHisIndex = -1;
}

AHistoryInfo.prototype.pushInfo = function(info)
{
	this.curHisIndex++;
    this.infoHistory.length = this.curHisIndex;
    this.infoHistory.push(info);
};

AHistoryInfo.prototype.prevInfo = function()
{
	if(this.canGoPrev())
	{
		this.curHisIndex--;
		return this.infoHistory[this.curHisIndex];
	}
	
	else return null;
};

AHistoryInfo.prototype.nextInfo = function()
{
	if(this.canGoNext())
	{
		this.curHisIndex++;
		return this.infoHistory[this.curHisIndex];
	}
	
	else return null;
};

AHistoryInfo.prototype.canGoPrev = function()
{
	return (this.curHisIndex>0);
};

AHistoryInfo.prototype.canGoNext = function()
{
	return (this.curHisIndex<this.infoHistory.length-1);
};

AHistoryInfo.prototype.clearHistory = function()
{
	this.infoHistory.length = 0;
	this.curHisIndex = -1;
};

//----------------------------------------------------------------------


function AAwait()
{
	this.count = 0;
	this.endCallbacks = [];
	this.proms = [];
    this.waitMap = {};
}

//addProm 과 waitAllProm 은 세트로 사용 
//프라미스를 이용한 완료 대기
AAwait.prototype.addProm = function(prom)
{
	this.proms.push(prom);
	return prom;
};

AAwait.prototype.waitAllProm = function()
{
	return Promise.all(this.proms);
};

AAwait.prototype.resetProm = function()
{
	this.proms = [];
};


//----------------------------------------------------------------------
//add, remove, waitAll 세트로 사용 

//비동기 작업이 시작될 때 호출
AAwait.prototype.begin = function(key)
{
	this.count++;

    //for debug
    this.waitMap[key] = key;
};

//비동기 작업이 완료되면 호출
AAwait.prototype.end = function(key, isCache)
{
    this.count--;

    //for debug
    this.waitMap[key] = null;

    //자신이 마지막 비동기 작업이면
	if(this.count==0) 
	{
        if(!isCache) 
        {
            //console.log('report done : ' + key);
            //등록되어진 콜백함수들을 호출해 준다.
            this._reportDone(key);
        }
	}
};

//등록된 모든 비동기 작업이 완료되면 endCallback 을 호출해 준다.
AAwait.prototype.waitAll = function(endCallback)
{
	if(this.count==0) 
	{
		endCallback();
	}
	
	//차후에 호출할 때는 나중에 추가된 것이 먼저 호출되어야 한다.
    else this.endCallbacks.push(endCallback);
};

AAwait.prototype._reportDone = function(key)
{
    if(this.endCallbacks.length==0) 
    {
        //console.log('end callback clear =========== : ' + key);
        this.waitMap = {};
        return;
    }

    //나중에 추가된 것부터 꺼내온다.
    let callback = this.endCallbacks.pop();

    callback();

    //callback 내부에서 promise 의 resolve 가 호출된다.
    //그 이후 추가로 로드된 스크립트가 있는 지 체크하기 위해 
    //timeout 을 이용한다.
    setTimeout(()=>{

        //더 추가된 것이 없으면 계속 진행
        if(this.count==0) this._reportDone(key);

        //추가로 호출된 스크립트 로드가 있으면 
        //남아 있는 endCallback 이 호출되지 않게 하여 resolve 를 보류한다.
        //else console.log('additional wait -------- : ' + key);

    });

};


/**
 * @author asoocool
 */

var afc = 
{
    BTN_STATE: ['normal', 'touch', 'disable'],
    CHECK_STATE: ['check', 'normal'],
    
    ATTR_BASE: 'data-base',
    ATTR_CLASS: 'data-class',
    //ATTR_COLOR: 'data-color',               //텍스트 색상
    ATTR_GROUP: 'data-group',
    
    //ATTR_BGCOLOR: 'data-bgcolor',  			//배경 색상
    //ATTR_BGIMAGE: 'data-bgimage',  			//배경 이미지
    ATTR_STYLE: 'data-style',           	//스타일
    ATTR_STYLE_TAB: 'data-style-tab',       //탭 버튼 스타일
    ATTR_DEFAULT: 'data-default',           //라디오버튼(초기셀렉트 아이디)
    
    ATTR_LISTENER: 'data-listener',
    ATTR_QUERY_NAME: 'data-query-name',
    //ATTR_RESP: 'data-responsive',
	ATTR_MASK: 'data-mask',
    
    CLASS_MARK: '--',
    CMARK_LEN: 2,
    
    MASK_NONE: 0,
    MASK_MONEY: 1,
	MASK_FLOAT: 2,

	DISABLE_TIME: 500,
	//TOUCH_DELAY_TIME: 300,	//AppManager 로 옮겨짐, 차후 삭제
	CLICK_DELAY: 100,
	
    //키이벤트
	KEY_TAB: 9, KEY_ENTER: 13, KEY_ESC: 27, KEY_SPACE: 32, KEY_PGUP: 33, KEY_PGDOWN: 34, KEY_END: 35, KEY_HOME: 36, 
	KEY_SHIFT: 16, KEY_CTRL: 17, KEY_ALT: 18,
    KEY_LEFT: 37, KEY_UP: 38, KEY_RIGHT: 39, KEY_DOWN: 40, KEY_DEL: 46,
    KEY_A: 65, KEY_B: 66, KEY_C: 67, KEY_D: 68, KEY_E: 69, KEY_F: 70, KEY_G: 71,KEY_H: 72, KEY_N: 78, KEY_O: 79, 
	KEY_Q: 81, KEY_S: 83, KEY_V: 86, KEY_W: 87, KEY_X: 88, KEY_Y: 89, KEY_Z: 90,
    KEY_F1: 112, KEY_F2: 113, KEY_F3: 114, KEY_F4: 115, KEY_F5: 116, KEY_F6: 117, KEY_F7: 118, KEY_F8: 119, KEY_F9: 120, KEY_F10: 121, 
	
	
	LBUTTON: 1, MBUTTON: 2, RBUTTON: 3,
	
	PHONE_DOC_WIDTH: 640,
	TABLET_DOC_WIDTH: 1280,	//1024
	
};

//deprecated 
afc.ClassName =
{
    LABEL:'ALabel',
	TEXTBOX:'ATextBox',
    BUTTON:'AButton',
    CHECKBOX:'ACheckBox',
    RADIOGROUP:'ARadioGroup',
    RADIOBUTTON:'ARadioButton',
    TEXTFIELD:'ATextField',
    TEXTAREA:'ATextArea',
    DROPBOX:'ADropBox',
    SELECTBOX:'ASelectBox',
    GRID:'AGrid',
    TREE:'ATree',
    SWITCHBUTTON:'ASwitchButton',
    IMAGE:'AImage',
    CANVAS:'ACanvas',
    PROGRESS : 'AProgress',
    SLIDER : 'ASlider',
    //DATEPICKER : 'ADatePicker',
    TIMEPICKER : 'ATimePicker',
	SCROLLBAR : 'AScrollBar',
	
    GRIDLAYOUT : 'AGridLayout',
    FLEXLAYOUT : 'AFlexLayout',
	
    VIEW:'AView',
    LISTVIEW:'AListView',
    TABVIEW:'ATabView',
    WEBVIEW:'AWebView',
    SLIDEVIEW:'ASlideView',

    FLEXVIEW:'AFlexView',
    SPLITVIEW:'ASplitView',
    ACCORDION: 'AAccordion',

	BAR: 'ABar',
    TOOLBAR: 'AToolBar',
	MENUBAR: 'AMenuBar',
	TABBAR: 'ATabBar',
	
	FLOAT: 'AFloat',
	TOAST: 'AToast',
	INDICATOR: 'AIndicator',
	MENU: 'AMenu',
    
    PAGE:'APage',
    WINDOW: 'AWindow',
    APPLICATION: 'AApplication'
    
};

//afc.ACTION_DOWN = 'touchstart';
//afc.ACTION_MOVE = 'touchmove';
//afc.ACTION_UP = 'touchend';

afc.COMP_CTX = {};

//afc.COMP_CTX.defEvents = ['actiondown', 'actionmove', 'actionup'];

afc.compLabel = {
	"ALabel": "Label",
	"ATextBox": "TextBox",
	"AButton": "Button",
	"ACheckBox": "CheckBox",
	"ARadioButton": "RadioButton",
	"ADropBox": "DropBox",
	"ASelectBox": "SelectBox",
	"ATextField": "TextField",
	"ATextArea": "TextArea",
	"ASwitchButton": "SwitchButton",
	"AImage": "Image",
	"AVideo": "Video",
	"ACanvas": "Canvas",
	"AGrid": "Grid",
	"ATree": "Tree",
	"AScrollBar": "ScrollBar",
	"AView": "View",
	"ARadioGroup": "RadioGroup",
	"AListView": "ListView",
	"ATabView": "TabView",
	"AWebView": "WebView",
	"AProgress": "Progress",
	"ASlider": "Slider",
	"AGridLayout": "GridLayout",
	"AFlexLayout": "FlexLayout",
	"AFlexView": "FlexView",
	"ASplitView": "SplitView",
	"AAccordion": "Accordion",
	"ADataGrid": "DataGrid",
	"ASlideView": "SlideView",
	"APivotGrid": "PivotGrid",
	"AForm": "Form",
	"AFileUploader": "FileUploader",
	"ACalendarPicker": "CalendarPicker",
	"APagingBar": "PagingBar",
	"AFlowOneLine": "FlowOneLine",
	"AFlowTwoLine": "FlowTwoLine",
	"AFlowThreeLine": "FlowThreeLine",
	"AVertical": "Vertical",
	"AHorizontal": "Horizontal",
	"ASpacer": "Spacer"
};

//--------------------------------------- Component -------------------------------------------------------------------------

afc.enableUserSelect = function(enable, element)
{
	var $ele;
	
	if(element) $ele = $(element);
	else $ele = $('body');
	
	if(enable)
	{
		$ele.css('-webkit-user-select', 'auto');
		$ele.find('span').css('-webkit-user-select', 'auto');
	}
	else
	{
		$ele.css('-webkit-user-select', 'none');
		$ele.find('span').css('-webkit-user-select', 'none');
	}
};

afc.enableScrollIndicator = function()
{
	//var strCss = '';
	
	//strCss += 'div { -ms-overflow-style: none; }';		//ie
	//strCss += '::-webkit-scrollbar { display: none; }';	//webkit
	//$('<style></style>').text(strCss).appendTo('head');	

	afc.isScrollIndicator = true;
};

//----------------------------
//	비동기 쿼리 로드 완료 대기

afc.qryWait = new AAwait();
afc.queryReady = function(acomp, callback)
{
	afc.qryWait.waitAllProm().then(values => 
    {
		acomp._applyLoadedQuery();
        callback(values);

        afc.qryWait.resetProm();
    });
};

//-----------------------------------
// 	비동기 스크립트 로드 완료 대기
//	afc._loadScriptWait 에서 사용

afc.scriptWait = new AAwait();
afc.scriptReady = function(callback)
{
	afc.scriptWait.waitAllProm().then(values => 
    {
        callback(values);
        afc.scriptWait.resetProm();
    });
};

//----------------------------
//	비동기 html 로드 완료 대기
/*
afc.htmlWait = new AAwait();
afc.htmlReady = function(callback)
{
	afc.htmlWait.waitAllProm().then(values => 
    {
        callback(values);
        afc.htmlWait.resetProm();
    });

};
*/

//----------------------------
//	

afc.loadWait = new AAwait();

afc._loadScriptWait = function(url, isReload) 
{
	afc.loadWait.begin(url);

	var prom = new Promise(function(resolve, reject) 
	{
		afc.loadScript(url, function(isCache)
		{
            //이전에 이미 로드되어져 있는 파일은 바로 resolve
            if(isCache)
            {
                afc.loadWait.end(url, true);

                resolve(url);
            }
            else
            {
                //모든 비동기 작업이 완료되면 호출될 콜백을 등록한다.
                //즉, 자신의 스크립트 파일의 로드가 완료되었지만 추가적인 비동기 작업이 등록되어 있으면
                //자신의 resolve 를 보류하고 모든 비동기 작업이 완료되면 다음 콜백이 호출되면서 
                //자신의 promise 를 resolve 시킨다.
                afc.loadWait.waitAll(function()
                {
                    resolve(url);
                });	

                //다음 함수가 호출될 때 자신의 end 가 마지막 비동기이면 등록된 모든 콜백이 호출된다.
                afc.loadWait.end(url);
            }
		}, isReload);
	});
	
	return afc.scriptWait.addProm(prom);
};

//화면 개발시점에는 이 함수를 사용해야 한다.
afc.import = function(url) 
{
    //console.log('script url : ' ,url);
	return afc._loadScriptWait(url);
};


//--------------------------------------------------------------------------------------------
// About Log
//--------------------------------------------------------------------------------------------

afc.disableLog = function()
{
	afc.log = function() { return ''; };
	console.log = function() {};
};

afc.logFilter = 'SpiderGen';
afc.logOption = 
{
	compElement: false,
};

afc.log = function(msg)
{
	var logMsg = '';
	
	if(msg instanceof AComponent || msg instanceof AContainer) logMsg = msg.toString(); 
	else if(msg instanceof HTMLElement) logMsg = $(msg)[0].outerHTML;
	else if(msg instanceof Object) logMsg = afc.stringifyOnce(msg, undefined, 4);
	else logMsg = msg;
	
	logMsg = afc.logFilter + ' => ' + logMsg;
	console.log(logMsg);
	
	if(afc.isIos && window.AppManager) AppManager.consoleLog(logMsg);
	
	return logMsg;
};

afc.log2 = function(msg)
{
	var logMsg = '';
	
	if(msg instanceof HTMLElement) logMsg = $(msg)[0].outerHTML;
	else if(msg instanceof Object) logMsg = afc.stringifyOnce(msg, undefined, 4);
	else logMsg = msg;
	
	logMsg = afc.logFilter + ' => ' + logMsg;
	console.log(logMsg);
	
	if(afc.isIos && window.AppManager) AppManager.consoleLog(logMsg);
	
	return logMsg;
};


afc.setLogFilter = function(filter)
{
	afc.logFilter = filter;
};

afc.setLogOption = function(option)
{
	for(var p in option)
	{
		if(!option.hasOwnProperty(p)) continue;
		afc.logOption[p] = option[p];
	}
};

afc.stringifyOnce = function(obj, replacer, indent)
{
    var printedObjects = [];
    var printedObjectKeys = [];

    function printOnceReplacer(key, value)
    {
        if ( printedObjects.length > 200) // browsers will not print more than 20K, I don't see the point to allow 2K.. algorithm will not be fast anyway if we have too many objects
        { 
        	return 'object too long';
        }
        
        var printedObjIndex = false;
        printedObjects.forEach(function(obj, index)
        {
            if(obj===value)
                printedObjIndex = index;
        });

		//root element
        if ( key == '')
        {
        	printedObjects.push(obj);
            printedObjectKeys.push("root");
            return value;
        }
        else if(printedObjIndex+"" != "false" && typeof(value)=="object")
        {
            if ( printedObjectKeys[printedObjIndex] == "root") return "(pointer to root)";
            else return "(see " + ((!!value && !!value.constructor) ? afc.getClassName(value).toLowerCase()  : typeof(value)) + " with key " + printedObjectKeys[printedObjIndex] + ")";
        }
        else
        {
            var qualifiedKey = key || "(empty key)";
            printedObjects.push(value);
            printedObjectKeys.push(qualifiedKey);
            
            if(replacer) return replacer(key, value);
            else return value;
        }
    }
    
    return JSON.stringify(obj, printOnceReplacer, indent);
};


//--------------------------------------------------------------------------------------------
// About Time Check
//--------------------------------------------------------------------------------------------

afc.startTime = 0;
afc.oldTime = 0;
afc.beginTimeCheck = function(msg)
{
	afc.startTime = afc.oldTime = Date.now();
	
	if(!msg) msg = '';
	console.log(msg + ' -- Start time ==>			' + afc.startTime + ' --------------------------------------------------');
};

afc.ellapseCheck = function(msg, isEnd)
{
	if(afc.startTime==0) afc.beginTimeCheck(msg);
	else if(isEnd) afc.endTimeCheck(msg);
	else
	{
		if(!msg) msg = '';

		console.log(msg + ' -- Ellapsed time ==>		' + (Date.now() - afc.oldTime));
		afc.oldTime = Date.now();
	}
	
};

afc.endTimeCheck = function(msg)
{
	if(!msg) msg = '';
	
	afc.oldTime = Date.now();
	
	console.log(msg + ' -- End time ==> 			' + afc.oldTime + ' -------------------------------------');
	console.log(msg + ' -- Total Ellapsed time ==>	' + (afc.oldTime - afc.startTime) + ' -------------------------------------');
	
	afc.startTime = 0;
	afc.oldTime = 0;
};

afc.prefixCnt = 0;

afc.makeCompIdPrefix = function()
{
/*
	var time = new Date().getTime(),
		//rnd = parseInt(Math.random()*1000, 10);
		rnd = Math.random(),
		ret = time + rnd + afc.CLASS_MARK;
	
	return ret.replace('.', '');
	*/
	
	// Number.MAX_SAFE_INTEGER == 9007199254740991
	// IE에서는 지원하지 않는 변수이기 때문에 실제 숫자로 비교한다.
	if(afc.prefixCnt == 9007199254740991) afc.prefixCnt = 0;
	
	afc.prefixCnt++;
	
	return '_' + afc.prefixCnt + afc.CLASS_MARK;
};

//-------------------------------------------------------------------
//  function MyObject()
//  {
//      ParentObject.call(this); //부모에 변수 선언이 있다면 호출해 줄 것.
//  }
//  afc.extendsClass(MyObject, ParentObject);
//--------------------------------------------------------------------

//클래스 상속 관련 처리를 해준다.
afc.extendsClass = function(childClass, parentClass)
{
    //이미 상속처리가 되어져 있는 경우는 리턴
    if(childClass.prototype.superClass) return;
	
	if(!parentClass)
	{
		console.error('afc.extendsClass : parentClass is not defined.');
		return;
	}

	//상속 받을 부모의 프로토 타입 객체를 생성한다.
	var superProto = new parentClass(); //파라미터 없이 호출한다.
	for(var p in superProto) 
		if(superProto.hasOwnProperty(p)) delete superProto[p];

	childClass.prototype = superProto;
	childClass.prototype.constructor = childClass;
	childClass.prototype.superClass = parentClass;
};

//newObj 에 존재하는 프로퍼티만 curObj 에 셋팅해 준다.
afc.mergeObject = function(curObj, newObj)
{
	if(newObj)
	{
		for(var p in newObj)
		{
			if (newObj.hasOwnProperty(p))
				curObj[p] = newObj[p];
		}
	}
	
	return curObj;
};


afc.getClassName = function(funcObj)
{
	if(afc.isIE)
	{
		var funcNameRegex = /function (\w*)/;	//   /function (.{1,})\(/;
		var results = (funcNameRegex).exec(funcObj.constructor.toString());
		return (results && results.length > 1) ? results[1] : "";
/*		
  		var f = typeof funcObj == 'function';
  		var s = f && ((funcObj.name && ['', funcObj.name]) || funcObj.toString().match(/function ([^\(]+)/));
  		return (!f && 'not a function') || (s && s[1] || 'anonymous');
  */
	}
	else return funcObj.constructor.name;
};

afc.getUrlParameter = function()
{  
    var ParameterObject = {};  
    var locate = location.href;  
 
    if(locate.indexOf("?")==-1)  
        return ParameterObject;  
 
    var parameter = locate.split("?")[1];  
    var paramAreay = parameter.split("&");  
    for ( var i=0; i<paramAreay.length; i++ )  
    {  
        var tem = paramAreay[i].split("=");  
        ParameterObject[tem[0]] = tem[1];  
    }

    return ParameterObject;  
};


//---------------------------
//	lay, cls 로드 캐시 설정

afc.isLoadCache = true;

afc.enableLoadCache = function(enable)
{
	afc.isLoadCache = enable;
};

afc._loadHtmlHelper = function(trgEle, url, callback, searchValue, newValue, isSync) 
{
	var pre = '';
	if(PROJECT_OPTION.build.subName) pre = PROJECT_OPTION.build.subName + '/';

	//url = pre + url.replace('.lay', '.html');
	url = url.replace('.lay', '.html');

	var tmp = url.split('#'), viewId = null;

	if(tmp.length==2)	//url 뒤에 #view_id 를 붙이면 lay 내의 특정 뷰만 로드한다.
	{
		url = tmp[0];
		viewId = tmp[1];
	}

	if(afc.versionMap)
	{
		var vCode = afc.versionMap[url];
		if(vCode) url += '?v=' + vCode;
	}

	$.ajax(
	{
		async: !isSync,
		cache: afc.isLoadCache,
		url: pre+url,
		dataType: 'text',
		success: function(txt)
		{
			if(searchValue)
				txt = txt.replace(searchValue, newValue);

			if(trgEle)
			{
				let trgObj = $(trgEle);
                
				if(viewId)	//url 뒤에 #view_id 를 붙이면 lay 내의 특정 뷰만 로드한다.
				{
                    let loadObj = $(txt);

					let _className = loadObj.attr(afc.ATTR_CLASS) + afc.CLASS_MARK,
						_classMap = loadObj.attr('data-class-map');

					loadObj = loadObj.find('#' + _className + viewId);
					loadObj.attr('data-class-map', _classMap);

					//trgObj.html(findView);
                    trgObj.html(loadObj);
				}
                else trgObj.html(txt);

				if(callback) callback.call(trgEle, txt);
				//else resolve(txt);
			}
			else 
			{
				if(callback) callback(txt);
				//else resolve(txt);
			}
		},

		error: function() 
		{
			if(callback) callback.call(trgEle, null);
			//else resolve(null);
		}
	});
};

afc.loadHtmlSync = function(trgEle, url, callback, searchValue, newValue)
{
	afc._loadHtmlHelper(trgEle, url, callback, searchValue, newValue, true);
};

afc.loadHtml = function(trgEle, url, callback, searchValue, newValue) 
{
    //console.log('html url : ' ,url);  

	return new Promise(function(resolve, reject) 
	{
		afc._loadHtmlHelper(trgEle, url, function(txt)
		{
			if(callback) callback.call(trgEle, txt);
			else 
            {
                if(txt) resolve(txt);
                else reject();
            }
			
		}, searchValue, newValue, false);
	});	
};

afc.scriptMap = {};
afc.cssMap = {};

afc.versionMap = null;

afc.setVersionMap = function(obj)
{
	if(!afc.versionMap) afc.versionMap = {};

	var url, p;
	
    for(p in obj)
	{
		url = p;
		
		url = url.replace('.cls', '.js');
		url = url.replace('.lay', '.html');
		
		afc.versionMap[url] = obj[p];
	}
};


afc.getFileSrc = function(url, isEnc)
{
	var retVal = '';
	jQuery.ajax(
	{
		async:false, type:'GET', url: url, dataType:'text',
		success: function(data) 
		{
			if(isEnc)
			{
				//GibberishAES.size(128);	
				//retVal = GibberishAES.aesDecrypt(data, 'asydhf745igjdfdf'); //asydhf745igjdfdf 암호화 키(16자리)
			}
			else retVal = data;
		},
		error: function(xhr, textStatus, errorThrown) 
		{ 
			retVal = null;
		}
	});

	return retVal;
};

//특별히 afc.import 로직을 타지 말아야 할 경우를 제외하면 
//화면 개발 시점에는 afc.import 를 사용할 것.
afc.loadScript = function(url, callback, isReload)
{
	//Promise 지원
	var prom = new Promise(function(resolve, reject) 
	{
		var pre = '';
		if(PROJECT_OPTION.build.subName) pre = PROJECT_OPTION.build.subName + '/';

		//여기서 하면 안됨..
		//url = pre + url.replace('.cls', '.js');

		url = url.replace('.cls', '.js');

		if(isReload) afc.removeScript(url);
		
		
		var scriptObj = afc.scriptMap[url];

		if(scriptObj)
		{
			//네트웍 로딩 상태이면
			if(scriptObj.isPending)
			{
				if(!scriptObj.pendingQueue) scriptObj.pendingQueue = [];

				if(callback) scriptObj.pendingQueue.push(callback);
				else scriptObj.pendingQueue.push(resolve);
			}
			else 
			{
                //cache is true
				if(callback) callback(true);
				else resolve(true);
			}		
		}
		else
		{
			scriptObj = {};
			//펜딩 상태로 셋팅하고 로드를 시작한다.
			scriptObj.isPending = true;

			afc.scriptMap[url] = scriptObj;

			if(afc.versionMap)
			{
				var vCode = afc.versionMap[url];
				if(vCode) url += '?v=' + vCode;
			}

			if(!afc.isLoadCache)
			{
				var _add = Math.random();

				if(url.indexOf('?')>-1) url += _add;
				else url += '?' + _add;
			}
			
			var tag = document.createElement('script');
			
			var retFunc = function(success)
			{
				var pendingQueue = scriptObj.pendingQueue;

				scriptObj.isPending = undefined;
				scriptObj.pendingQueue = undefined;
				
				//실패 시 지운다.
				if(!success) afc.scriptMap[url] = null;

				if(callback) callback();
				else resolve();

				//펜딩큐에 있는 콜백함수들에게도 알린다.
				if(pendingQueue)
				{
					pendingQueue.forEach(function(_callback)
					{
						_callback();
					});
				}			
			
			};

			tag.onload = function()
			{
				//if(callback) callback(resolve);
				//else resolve(url);
				
				
				retFunc(true);
			};
			
			tag.onerror = function()
			{
				//if(callback) callback(resolve);
				//else resolve(null);
				
				
				retFunc(false);
			};
			
			tag.src = pre + url;
			tag.defer = true;
			
            //console.log('script url : ' , tag.src);
			document.getElementsByTagName('head')[0].appendChild(tag);
		}

	});
	
	//if(!callback) afc.scriptWait.addProm(prom);
	
	return prom;
	
};

if(window.afc_)
{
	afc.loadScript = afc_.loadScript;
	afc._loadScriptWait = function(url)
	{
		var prom = new Promise(function(resolve, reject) 
		{
			afc_.loadScript(url);
			
			resolve();
			//if(callback) callback();
		});
		
		return afc.scriptWait.addProm(prom);
	};
}

afc.removeScript = function(url, objNameArr)
{
	var node = $.find('[src="' + url + '"]')[0];
	if(node) node.remove();
	
	afc.scriptMap[url] = undefined;
	
	if(objNameArr)
	{
		objNameArr.forEach(function(name)
		{
			delete window[name];
		});
	}
};

//하나의 파일로 연결할 때도 다음 로직을 사용한다.
afc.existScriptSrc = function(chkSrc)
{
	var ss = document.getElementsByTagName('script'),
		src, loc = window.location.href;
		
	loc = loc.substring(0, loc.lastIndexOf('/')+1);

	for(var i=0; i<ss.length; i++)
	{
		src = ss[i].src.replace(loc, '');
		
		if(src==chkSrc) return true;
	}
	
	return false;
};

afc.setIndexScriptMap = function(loc)
{
	var ss = document.getElementsByTagName('script'), src;

	if(!loc) loc = window.location.href;
		
	var subLen = PROJECT_OPTION.build.subLength;
	
	//html 의 위치와 script 의 위치가 다르면 sbuLen 은 2 이상일 수 있다.
	if(!subLen) subLen = 1;
	
	for(var h=0; h<subLen; h++)
		//loc = loc.substring(0, loc.lastIndexOf('/')+1);
		loc = loc.substring(0, loc.lastIndexOf('/'));
		
	loc += '/';
		
	//console.log('loc => ' + loc);
		
	for(var i=0; i<ss.length; i++)
	{
		src = ss[i].src.replace(loc, '');
		
		src = src.split('?')[0];
		
		if(!afc.scriptMap[src])
		{
			afc.scriptMap[src] = {};

			//console.log('afc.setIndexScriptMap => ' + src);
		}
		//else console.log('afc.setIndexScriptMap already => ' + src);
	}
};


//--------------------------------------------------------------------
//	ex) <link href="styles.css" rel="stylesheet" media="all and (max-width: 1024px)">

afc.loadCss = function(url, attrObj)
{
	var pre = '';
	if(PROJECT_OPTION.build.subName) pre = PROJECT_OPTION.build.subName + '/';
	
	if(!afc.cssMap[url])
	{
		afc.cssMap[url] = true;
	
		/*
		var strAttr = '';
		
		if(attrObj)
		{
			for(var p in attrObj)
				strAttr += ' ' + p + '="' + attrObj[p] + '"';
		}
		
		$('<link rel="stylesheet" href="' + pre + url + '"' + strAttr + '/>').appendTo('head');
		*/
		
		var link = document.createElement('link');
		link.rel = "stylesheet";
		link.href = pre + url;
		
		if(attrObj)
		{
			for(var p in attrObj)
				link[p] = attrObj[p];
		}
		
		document.getElementsByTagName('head')[0].appendChild(link);
	}
};

afc.removeCss = function(url)
{
	var pre = '';
	if(PROJECT_OPTION.build.subName) pre = PROJECT_OPTION.build.subName + '/';
	
	$('head link[href="' + pre + url + '"]').remove();
	
	// 2번 이상 로드를 하는 경우 로드여부를 제거해야 다시 loadCss를 호출할 수 있으므로 제거한다.
	delete afc.cssMap[url];
};

afc.refreshApp = function($cntr)
{
	var tmp = $('<div style="position:absolute; z-index:0; width:1px; height:1px;"> </div>');
	
	if(!$cntr) $cntr = $('body');
	
	$cntr.append(tmp);

	setTimeout(function() { tmp.remove(); }, 700);
};

//컴포넌트 클래스가 구현 가능한 모든 이벤트 목록을 얻어온다. 
//셋팅한 파라미터의 이벤트 목록만 리턴한다. 둘다 null 이면 AEvent.events 리턴
afc.getEventList = function(baseName)
{
	/*
	var retArr = AEvent.events;
	
	if(baseName) retArr = retArr.concat(window[baseName+'Event'].events);
	if(className && baseName!=className) 
	{
		var evtClass = window[className+'Event'];
		if(evtClass) retArr = retArr.concat(evtClass.events);
	}
	
	return retArr;
	*/
	var ctx = window[baseName].CONTEXT;
	
	if(ctx) return ctx.events.concat(AEvent.defEvents);
	else return [];
};

//컴포넌트 클래스가 구현 가능한 자식이벤트 목록을 얻어온다. AView(_childSelect==2)에서만 사용한다.
afc.getChildEventList = function(baseName)
{
	var ctx = window[baseName].CONTEXT;
	if(ctx && ctx.childEvents) return ctx.childEvents.concat();
	else return [];
};

//--------------------------------------------------------------------------------------------
// About Device & Version
//--------------------------------------------------------------------------------------------

afc.isAndroid = false;
afc.isIos = false;
afc.isTizen = false;
afc.isPC = false;
afc.isMobile = false;
afc.isSimulator = false;
afc.isChrome = false;
afc.isIE = false;
afc.isHybrid = false;
afc.isSamsungBrowser = false;
afc.isFirefox = false;

afc.isTablet = false;
afc.isPhone = false;

//pc
afc.isWindow = false;
afc.isMac = false;
afc.isLinux = false;

//
afc.isExec = false;		//old chrome bridge version
afc.isNwjs = false;		//node webkit, nwjs
afc.isElectron = false;	//electron
afc.isCloud = false;	//클라우드 버전, 웹버전


afc.andVer = 1000.0;	//버전값으로만 ios 제외하기 위해 , 4.1, 4.2 ...
afc.iosVer = 1000.0;	//7.0, 7.1 ...

afc.strAndVer = ''; 	//4.1.2
afc.strIosVer = '';		//7.1.2
afc.strIEVer = '';		//edge

afc.strModuleName = '';
afc.scrlWidth = 17;

afc.OS = '';
afc.DIV = '/';

//Win32
if(window.navigator.platform.indexOf('Win')>-1) 
{
	afc.OS = 'WIN';
	afc.DIV = '\\';
	afc.isWindow = true;
}
//MacIntel
else if(window.navigator.platform.indexOf('Mac')>-1) 
{
	afc.OS = 'MAC';
	afc.DIV = '/';
	afc.isMac = true;
}
else
{
	afc.OS = 'LNX';
	afc.DIV = '/';
	afc.isLinux = true;
}


afc.isDeviceOf = function(device)
{
	return (navigator.userAgent.indexOf(device)>-1);
};

afc.androidVersion = function()
{
	var match = navigator.userAgent.match(/Android\s([0-9\.]*)/);
	afc.strAndVer = match ? match[1] : null;
	
	return afc.strAndVer;
};

afc.iosVersion = function()
{
	var match;
	if(afc.isDeviceOf('iPhone')) 
	{
		match = navigator.userAgent.match(/iPhone OS\s([0-9\_]*)/);
	}
	else if(afc.isDeviceOf('iPad'))
	{
		match = navigator.userAgent.match(/iPad; CPU OS\s([0-9\_]*)/);
	}
	
	afc.strIosVer = match ? match[1] : null;
	
	if(afc.strIosVer) 
	{
		afc.strIosVer = afc.strIosVer.replace(/_/g, '.');
		return afc.strIosVer;
	}
	else return null; 
};

afc.makeMeta = function()
{
	//------------------------------------------------------------------------------
	//  param check
	//------------------------------------------------------------------------------
    var params = afc.getUrlParameter();
    var scale = params['scale'];
    var density = params['density'];
    
	afc.urlParameter = params;
	
    //alert(navigator.userAgent);
    
	//var meta = null,
	//	docWidth = PROJECT_OPTION.general.docWidth;
	
	var meta = document.createElement('meta'), docWidth = null, content;
	meta.setAttribute('name', 'viewport');
	
	//이전 버전
	if(PROJECT_OPTION.general.phoneDocWidth==undefined) docWidth = PROJECT_OPTION.general.docWidth;
	
	//폰, 태블릿 별 세로모드 시점의 document width
	else docWidth = afc.isPhone ? PROJECT_OPTION.general.phoneDocWidth : PROJECT_OPTION.general.tabletDocWidth;

	
	//자동으로 스케일 값을 계산해 주는 경우
	if(PROJECT_OPTION.general.autoScale)
	{
		//킷캣 이하 버전
		//if(density)	meta = '<meta name="viewport" content="width=device-width, target-densitydpi=' + density + 'dpi';
		if(density)	content = `width=device-width, target-densitydpi=${density}dpi`;
		else
		{
			//screen width, height 가 세로모드일 때... 800, 1280 이었으면 
			//가로모드일 때는 1280, 800 이다. 
			
			//가로모드로 시작할 경우, 스케일 계산 오류 수정
			var chkWidth = Math.min(screen.width, screen.height);
			
			//######################################################################
			//	차후 각 기기별(폰, 태블릿, 제품별)로 chkWidth 가 어떻게 나오는지 확인해서
			//	docWidth 를 지정하지 않은 경우 자동으로 할당해줄 최적값을 구하도록 한다.
			//######################################################################
			
			//auto 로 지정한 경우
			if(!docWidth)
			{
				//태블릿 인 경우
				if(afc.isTablet) docWidth = afc.TABLET_DOC_WIDTH;	//1280;
				else docWidth = afc.PHONE_DOC_WIDTH;				//640
			}
			
			//alert(screen.width + ', ' + screen.height);

			if(!scale) scale = chkWidth / docWidth;
			
			//확대시킬 경우, 가로나 세로가 body 를 넘어가 스크롤이 발생
			if(scale>1)
			{
				$('body').css('overflow', 'hidden');
			}
			
			//meta = '<meta name="viewport" content="width=device-width, initial-scale=' + scale;
			content = `width=device-width, initial-scale=${scale}`;
			
			PROJECT_OPTION.general.scaleVal = scale;
		}
	}
	
	//설정값으로 스케일 하는 경우
	else
	{
		//meta = '<meta name="viewport" content="width=' ;
		//meta += !docWidth ? 'device-width' : docWidth;	//자동인 경우는 diveice-width, 아닌 경우는 설정값으로
		//meta += ', initial-scale=' + PROJECT_OPTION.general.scaleVal;
		content = `width=${!docWidth ? 'device-width' : docWidth}, initial-scale=${PROJECT_OPTION.general.scaleVal}`;	
		//자동인 경우는 device-width, 아닌 경우는 설정값으로
	}

	//if(PROJECT_OPTION.general.userScalable && !afc.isHybrid) meta += ', user-scalable=yes"/>';
	//else meta += ', user-scalable=no"/>';
	if(PROJECT_OPTION.general.userScalable && !afc.isHybrid) content += ', user-scalable=yes';
	else content += ', user-scalable=no';
	
	meta.setAttribute('content', content);
	
console.log(meta);
	
	document.getElementsByTagName('head')[0].prepend(meta);//$(meta).prependTo('head');
   	
	$('<meta http-equiv="Content-Security-Policy" content="connect-src *; default-src * gap://ready file:; img-src * data: blob:; style-src * \'unsafe-inline\'; script-src * \'unsafe-inline\' \'unsafe-eval\'">').prependTo('head');
    
	//아이폰 숫자 폰번호 인식 방지
	$('<meta name="format-detection" content="telephone=no"/>').prependTo('head');
};

afc.changeScale = function(scale)
{
	if(!scale) scale = PROJECT_OPTION.general.scaleVal;
	var viewport = document.querySelector('meta[name="viewport"]');
	viewport.content = viewport.content.replace(/initial-scale[\s\S]*?(?=,|")/, 'initial-scale='+scale);
};

afc.browserCheck = function()
{
	var agent = navigator.userAgent.toLowerCase(); 
	var name = navigator.appName;

	// IE old version ( IE 10 or Lower ) 
	if ( name == "Microsoft Internet Explorer" ) afc.strIEVer = "msie"; 
	else 
	{
		// IE 11 
		if(agent.indexOf("trident") > -1) afc.strIEVer = "trident"; 
		// Microsoft Edge  
		else if(agent.indexOf("edge/") > -1 )
		{
			afc.strIEVer = "edge";
			//edge에서 12에서 17로 변경.
			afc.scrlWidth = 17;
		}
		
		else if(agent.indexOf("chrome") > -1) 
		{
			afc.isChrome = true;
			afc.scrlWidth = 17;
			
			//프로젝트에서 커스텀한 경우 이 값을 변경한다.
		}
	}
	
	afc.isIE = (afc.strIEVer!='');
	
	if(afc.isDeviceOf('SamsungBrowser')) 
	{
		afc.isSamsungBrowser = true;
	}
	
	if(afc.isDeviceOf('Firefox'))
	{
		afc.isFirefox = true;
		afc.scrlWidth = 17;
	}
};

afc.deviceCheck = function()
{
	if(window.exec) afc.isExec = true;
	else if(window.nw) afc.isNwjs = true;	//node webkit, nwjs
	else 
	{
		if(afc.isDeviceOf(' Electron/')) afc.isElectron = true;
		else
		{
			afc.isCloud = true;				//클라우드 버전, 웹버전
			afc.DIV = '/';
		}
	}

	afc.isMobile = true;
	
	afc.isHybrid = (window.PROJECT_OPTION && PROJECT_OPTION.build.bridgeName!='none');
	
	//스파이더젠 시뮬레이터, 크롬 브라우저이지만 agent 에 Simulator 값을 가지고 있다.
	if(afc.isDeviceOf('Simulator'))
	{
		afc.isSimulator = true;
	}
	
	//----------------------------------------
	
	
	if(afc.isDeviceOf('Android')) 
	{
		afc.isAndroid = true;
		afc.andVer = parseFloat(afc.androidVersion());
	}
	else if(afc.isDeviceOf('iPhone') || afc.isDeviceOf('iPad') || afc.isDeviceOf('iPod')) 
	{
		//ios 13이상의 아이패드에서 userAgent에서 iPad가 빠지고 맥os로 자동변경되어
		//아이패드라는걸 인식하지 못하는 이슈가 있는데 이는 네이티브에서 처리해야한다.
		//RND\SpiderGen3.0\document의 Wkebview 가이드 참고.
		afc.isIos = true;
		afc.iosVer = parseFloat(afc.iosVersion());
		
		//document에 touchend 이벤트를 바인드하지 않으면 아이폰에서 특정 컴포넌트의 touchend가 가끔식 발생하지 않음
		$(document).bind('touchend', function(e){});
	}
	else if(afc.isDeviceOf('Tizen')) 
	{
		afc.isTizen = true;
	}
	
	//pc 
	else
	{
		//alert(navigator.userAgent);
		
		afc.isPC = true;
		afc.isMobile = false;
		
		//시뮬레이터에서 모바일 모드로 변경할 수 있으므로 여기서 비교하면 안됨.		
		//if(afc.isDeviceOf('Simulator'))
		//{
		//	afc.isSimulator = true;
		//}
	}
	
	if(afc.isMobile)
	{
		var chkWidth = Math.min(screen.width, screen.height);
	
		//###########################################################################################################
		// 예외 상황이 있을 경우 window.devicePixelRatio 값도 비교해 보기
		//###########################################################################################################

		if(!PROJECT_OPTION.general.tabletMinWidth) PROJECT_OPTION.general.tabletMinWidth = 500;
		
		afc.isTablet = (chkWidth>PROJECT_OPTION.general.tabletMinWidth);
		afc.isPhone = !afc.isTablet;
		
		//모바일일때만 키보드매니저를 동적으로 추가해준다. 비동기 로드
		afc.import('Framework/afc/library/KeyboardManager.js');
		afc.import('Framework/afc/library/ScrollIndicator.js');
	}
	
	
	//시뮬레이터 pc모드인데 브릿지 셋팅이 되어 있으면 모바일 처럼 작동하기위해 
	//스크롤바를 숨김
	if(afc.isPC && afc.isSimulator && afc.isHybrid )
	{
		var strCss = '::-webkit-scrollbar { display: none; }'; 
		$('<style></style>').text(strCss).appendTo('head');	
	}
	
	if(window.PROJECT_OPTION && !window.afc_)
	{
		if(PROJECT_OPTION.deployment.checkVersion)
		{
			afc.import('Source/Version.js?ver=' + Date.now());
		}
	
		if(PROJECT_OPTION.build.bridgeName=='cordova')
		{
			//시뮬레이터 모바일 모드에서 오류가 발생하므로
			//무조건 windows/cordova.js 를 로드한다.
			if(afc.isSimulator) afc.import('Bridge/windows/cordova.js');
			else if(afc.isIos) afc.import('Bridge/ios/cordova.js');
			else if(afc.isAndroid) afc.import('Bridge/android/cordova.js');
			else if(afc.isPC) afc.import('Bridge/windows/cordova.js');
		}
	}
};

//--------------------------------------------------------------------------------------------
// About BugFix
//--------------------------------------------------------------------------------------------

//스타일을 동적으로 수정하기
afc.addRule = function(sheet, selector, styles)
{
	if(sheet.insertRule) return sheet.insertRule(selector + '{' + styles + '}');
	if(sheet.addRule) return sheet.addRule(selector, styles);
};

//전화걸기
//This function is deprecated, instead of this, use AppManager.phoneCall()
/*
afc.phoneCall = function(phoneNumber)
{
	var phoneStr = 'tel:'+phoneNumber;
	if(afc.isAndroid) AppManager.goUrl(phoneStr);
	else if(afc.isIos) window.location = phoneStr;
};
*/

//pos자리만큼 소수점 버림
afc.floor = function(value, pos) 
{
	var digits = Math.pow(10, pos);
	return parseFloat(parseInt(value*digits, 10)/digits).toFixed(pos);
};

//pos자리만큼 소수점 버림 + '%'
afc.floorPer = function(value, pos) 
{
	var digits = Math.pow(10, pos);
	return parseFloat(parseInt(value*digits, 10)/digits).toFixed(pos)+'%';
};


//pos만큼 소수점 자리 자르기
afc.floatFix = function(value, pos) 
{
	if(!value) value = 0;
	else value = parseFloat(value);
	
	if(!pos) pos = 2;
	return value.toFixed(pos);
};

//천단위마다 콤마 추가
afc.addComma = function(val) 
{
	if(val != undefined)
	{
		var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
		val += '';  // 숫자를 문자열로 변환
		while (reg.test(val))
			val = val.replace(reg, '$1' + ',' + '$2');
		return val;	
	}
	else return '';
	
	/*
	if(val != undefined) return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	else return '';
	*/
};

//천단위마다 콤마 추가 값이 0인 경우 특수문자 "　" 리턴
afc.hogaComma = function(val) 
{
	if(val != 0)
	{
		var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
		val += '';  // 숫자를 문자열로 변환
		while (reg.test(val))
			val = val.replace(reg, '$1' + ',' + '$2');
		return val;	
	}
	else return '　';
	
	/*
	if(val != undefined) return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	else return '';
	*/
};

//콤마 삭제
afc.removeComma = function(val) 
{
	if(!val) return '';
	else return val.toString().replace(/,/g, '');
};

//더미 데이터의 길이만큼 '*'를 생성
afc.makeDummyString = function(length) 
{
	var dumStr = '';
	for(var i=0; i<length; i++) dumStr += '●';
	return dumStr;
};

//계좌정보에서 계좌정보에 셋팅할 텍스트를 생성
afc.makeAccText = function(accInfo, isGroup) 
{
	var regAcNo = accInfo['D1계좌번호'];
	var accText = '';
	if(theApp.systemInfo)
	{
		accText = theApp.systemInfo.makeAccNumber(regAcNo);
	}
	else accText = regAcNo.substring(0, 3) + "-" + regAcNo.substring(3, 5) + "-" + regAcNo.substring(5, regAcNo.length);
	return accText;
};

//랜덤컬러값을 생성
afc.getRandomColor = function()
{
	return "#"+((1<<24)*Math.random()|0).toString(16);
};

//DATE객체를 String으로 
afc.dateToString = function(date) 
{
	//return sprintf('%4d%02d%02d', date.getFullYear(), date.getMonth()+1, date.getDate());
	return date.getFullYear().zf(4) + (date.getMonth()+1).zf(2) + date.getDate().zf(2);
};

afc.formatDate = function(dateNum)
{
	if(!parseInt(dateNum, 10)) return '';
    dateNum+='';
    return dateNum.substring(0,4)+'/'+dateNum.substring(4,6)+'/'+dateNum.substring(6,8); 
};

afc.formatDate2 = function(dateNum)
{
	if(!parseInt(dateNum, 10)) return '';
    dateNum+='';
    return dateNum.substring(2,4)+'/'+dateNum.substring(4,6)+'/'+dateNum.substring(6,8); 
};

afc.formatMonth = function(monthNum)
{
    monthNum+='';
	return monthNum.substring(0,4)+'/'+monthNum.substring(4,6); 
};

afc.formatDateTime = function(datetimeNum)
{
    datetimeNum+='';
	return datetimeNum.substring(0,2)+'/'+datetimeNum.substring(2,4)+' '+datetimeNum.substring(4,6)+':'+datetimeNum.substring(6,8); 
};

afc.formatTime = function(time)
{
	if(!parseInt(time, 10)) return '';
	
	var map1 = { '31000000':'장마감',
			   '41000000':'시간외마감',
			   '51000000':'장전',
			   '61000000':'장중',
			   '71000000':'장후',
			   '81000000':'단일가',
			   '88000000':'단일가 마감',
			   '91000000':'BN 마감',
			   '91000001':'BN 마감',
			   '91000002':'BN 마감',
			   '91000003':'BN 마감',
			   '91000004':'BN 마감',
			   '91000005':'BN 마감',
			   '91000006':'BN 마감',
			   '91000007':'BN 마감',
			   '91000008':'단일가BN마감'};
	if(map1[time]) return map1[time];
	
	var map2 = ['3','4','5','6','7','8','9'];
    time+='';
	if(map2.indexOf(time.substring(0,1)) > -1) time = '0' + time;	

	return time.substring(0,2)+':'+time.substring(2,4); 
};

afc.formatHMS = function(time)
{
	if(!parseInt(time, 10)) return '';
	
	var map1 = { '31000000':'장마감',
			   '41000000':'시간외마감',
			   '51000000':'장전',
			   '61000000':'장중',
			   '71000000':'장후',
			   '81000000':'단일가 마감',
			   '88000000':'단일가 마감',
			   '91000000':'BN 마감',
			   '91000001':'BN 마감',
			   '91000002':'BN 마감',
			   '91000003':'BN 마감',
			   '91000004':'BN 마감',
			   '91000005':'BN 마감',
			   '91000006':'BN 마감',
			   '91000007':'BN 마감',
			   '91000008':'단일가BN마감'};
	if(map1[time]) return map1[time];
	
	var map2 = ['3','4','5','6','7','8','9'];
    time+='';
	if(map2.indexOf(time.substring(0,1)) > -1) time = '0' + time;

	return time.substring(0,2)+':'+time.substring(2,4)+':'+time.substring(4,6);
};

afc.formatTic = function(ticNum)
{
    ticNum+='';
	return ticNum.substring(0,2)+' '+ticNum.substring(2,4)+':'+ticNum.substring(4,6)+':'+ticNum.substring(6,8); 
};

afc.formatSecond = function(t)
{
    t+='';
	return t.substring(0,2)*3600+t.substring(2,4)*60+t.substring(4,6)*1; 
};

afc.switchButtonColor = function(comp)
{
	comp.removeClass('BT38_K00007');
	
    if(comp.getText() == 'ON')
	{
		comp.removeClass('BT92_K06102');
		comp.addClass('BT91_K06101');
	}
	else
	{
		comp.removeClass('BT91_K06101');
		comp.addClass('BT92_K06102');
	}
};

afc.returnAsIt = function(val)
{
	return val;
};

afc.abs = function(val)
{/*
	if(val == '') val = 0;
	else val *= 1;
	
	return val<0 ? val*-1 : val;*/
	val = val.toString();
	if(val.charAt(0) == '-') return val.substring(1);
	else return val;
};

afc.addPercent = function(val)
{
	return val + '%';
};

afc.absComma = function(val)
{
	return afc.addComma(afc.abs(val));
};

afc.intComma = function(val)
{
	return afc.addComma(parseInt(val));
};

afc.absPercent = function(val)
{
	return afc.abs(val) + '%';
};

afc.commaPercent = function(val)
{
	return afc.addComma(val) + '%';
};

afc.absCommaPercent = function(val)
{
	return afc.addComma(val) + '%';
};

afc.plusfloorPercent = function(val)
{
	var digits = Math.pow(10, 2);
	var retVal = parseFloat(parseInt(val*digits, 10)/digits).toFixed(2)+'%';
	//if(val > 0) retVal = ('+'+retVal);
	return retVal;
};

//소수점2자리 버림
afc.floor2 = function(value)
{
	var digits = Math.pow(10, 2);
	return afc.addComma(parseFloat(parseInt(value*digits, 10)/digits).toFixed(2));
};

//소수점2자리 반올림
afc.toFixed2 = function(value)
{
	return afc.addComma(value.toFixed(2));
};

//절대값 소수점2자리 버림
afc.absFloor2 = function(value)
{
	var digits = Math.pow(10, 2);
	value = afc.abs(value);
	return afc.addComma(parseFloat(parseInt(value*digits, 10)/digits).toFixed(2));
};

//절대값 소수점1자리 버림
afc.absFloor1 = function(value)
{
	var digits = Math.pow(10, 1);
	value = afc.abs(value);
	return afc.addComma(parseFloat(parseInt(value*digits, 10)/digits).toFixed(1));
};

//소수점2자리 버림 + '%'
afc.floor2Per = function(value)
{
	
	if(!value) return null;  // 임의 처리 오류 확인을 하기 위함. 2016.12.01
	
//value값이 0.28 등으로 들어올 때 0.29로 javascript에서 처리하기에 toFixed 함수 새로 생성	2016.11.21. 황청유
	//var digits = Math.pow(10, 2);
	//return parseFloat(parseInt(value*digits, 10)/digits).toFixed(2)+'%';
	return ( afc.toFixed(value, 2) + '%' );
};

//num 을 소숫점 fixed 자릿수 이하에서 버리는 함수
afc.toFixed = function (num, fixed) 
{
	if((num != undefined) && (fixed != undefined))
	{
		var numArr = num.toString().split('.');
		var decimal = '';
		if(numArr[1] != undefined)
		{
			var len = numArr[1].length;
			if(len > fixed)
			{
				return parseFloat(numArr[0]+"."+numArr[1].substring(0, fixed)).toFixed(fixed);	
			}
			return parseFloat(num).toFixed(fixed);
		}
		else
		{
			return parseFloat(num).toFixed(fixed);
		}
	}
	else 
	{
		var tmp = '0.';
		for(var i = 0; i < fixed; i++) tmp = tmp + "0";
		return tmp;
	}
	
	/*
	if(!num || !fixed) { // 임의 처리 오류 확인을 하기 위함. 216.12.01
		return null;
	}
	//값이 없을 경우 처리
	if(num*10 == 0) {
		var tmp = '0.';
		for(var i = 0; i < fixed; i++) tmp = tmp + "0";
		return tmp;
	}

    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0]; // <<- // 오류 사항 : TypeError:null is not an object (evaluation 'a.toString().match(d)'), ....
    */ 
};

afc.absFloor2Per = function(value) 
{
	var digits = Math.pow(10, 2);
	value = afc.abs(value);
	return parseFloat(parseInt(value*digits, 10)/digits).toFixed(2)+'%';
};

afc.sigaTotalAmount = function(value) 
{
	if(!value) return '0';
	else
	{
		value = value/1000000000;
		if(value < 0) return value.toFixed(2);
		else return afc.addComma(parseInt(value, 10));
	}
};

afc.capitalAmount = function(value) 
{
	if(!value) return '0';
	else
	{
		value = value/1000000;
		if(value < 0) return value.toFixed(2);
		else return afc.addComma(parseInt(value, 10));
	}
};

afc.addCommaIfFixed = function(value) 
{
	if(!value) return 0;
	else
	{
		if(value.toString().indexOf('.') > -1)
		{
			if(value<0) value *= -1;
			value = parseFloat(value)*1;
			return afc.addComma(value.toFixed(2));
		}
		else return afc.addComma(value);
	}
};

afc.absCommaIfFixed = function(value) 
{
	if(!value) return 0;
	else
	{
		if(value.toString().indexOf('.') > -1)
		{
			if(value<0) value *= -1;
			value = afc.absComma(parseFloat(value))*1;
			return value.toFixed(2);
		}
		else return afc.absComma(value);
	}
};

afc.oneHundredMillionAmount = function(value)
{
	if(!value) return '0';
	else
	{
		value = value/100000000;
		if(value < 0) return value.toFixed(2);
		else return afc.addComma(parseInt(value, 10));
	}
};

afc.isResize = true;

//------------------------------------------------------------------------------------------------------------------
Date.prototype.format = function(f) 
{
    if (!this.valueOf()) return " ";
    
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;

    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ms|ss|a\/p)/gi, function($1) 
    {
        switch ($1) 
        {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
			case "ms": return d.getMilliseconds().zf(3);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};

String.prototype.str = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".str(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

String.prototype.replaceAt = function(inx, searchVal, newVal)
{
	inx = this.indexOf(searchVal, inx);
	
	if(inx<0) return this;
	else return this.substr(0, inx) + newVal + this.substr(inx + searchVal.length);
};


//------------------------------------------------------------------------------------------------------------------

	
window.onerror = function(message, url, lineNumber, colNumber, error)
{

	if(!lineNumber || !url) return;

	//if(window.theApp) theApp.onError(message, url, lineNumber);
	//if(window.theApp) theApp.onError.apply(theApp, arguments);
	if(window.theApp) theApp.onError(message, url, lineNumber, colNumber, error);
};

window.onunhandledrejection = function(error)
{
	if(error.reason && error.reason.stack)
	{
		error.stack = error.reason.stack;
		const match = error.reason.stack.match(/(\w+:\/\/[\s\S]*?):(\d*):(\d*)/),
			  message = error.reason.message;
			  
		let url, lineNumber, colNumber;
		if(match)
		{
			url = match[1];
			lineNumber = match[2];
			colNumber = match[3];
		}
		
		window.onerror(message, url, lineNumber, colNumber, error);
	}
};

afc.loadCSSIfNotLoaded = function() 
{
    var ss = document.styleSheets;
	var headEle = document.getElementsByTagName("head")[0];
	
	var ssLen = ss.length;
    for(var i=0; i<ssLen; i++) 
	{
		if(ss[i].cssRules.length==0)
		{
			ss[i].disabled = true;
			
			var link = document.createElement("link");
			link.rel = "stylesheet";
			link.href = ss[i].href;
			headEle.appendChild(link);
		}
    }
};

//------------------------------------------------------------------------------------------------------------------
// function call


	afc.deviceCheck();
	afc.browserCheck();

	if(!window.afc_) afc.makeMeta();


	//다음 주석은 지우지 말 것. 화면 개발 시점에 필요한 정보
	console.log(navigator.userAgent);
	console.log('devicePixelRatio : ' + window.devicePixelRatio);
	console.log('screen : ' + screen.width + 'px, ' + screen.height+'px');
	//------------------------------------------------------------------------------------------------------------------

	afc.setIndexScriptMap();

	afc.beginTimeCheck('---- end of afc ----');







	

function ADataMask(ele, acomp)
{
	this.ele = ele;
	this.acomp = acomp;
	
	this.maskFuncs = [];
	this.maskParams = [];
	
	this.isClear = true;
}

// 기본 데이터
ADataMask.dataInfoArr = [];

// update 할 때마다 전체 마스크함수 목록을 저장해두는 변수
ADataMask.maskListArr = [];

// 루트뷰가 내부 컴포넌트를 realize 하고 삭제된 마스크함수 목록으로 알림창 띄우기 위한 변수
ADataMask.removedArr = [];

// 이전 업데이트 데이터와 현재 데이터로 추가된 함수를 판단하여 리턴한다.
ADataMask.update = function()
{
	var allMaskArr = [], updateArr = [], removeArr = [], tmp, i;
	
	// 함수와 배열이 아닌 전체 마스크 함수 목록을 뽑는다. type.funcName
	for(var type in ADataMask)
	{
		if(typeof ADataMask[type] == 'function' ||
		  Array.isArray(ADataMask[type])) continue;
		
		for(var funcName in ADataMask[type])
		{
			tmp = type+'.'+funcName;
			allMaskArr.push(tmp);
		}
	}
	/*
	// 전체 마스크 함수 목록에 없는 항목 제거
	for(i=0; i<ADataMask.maskListArr.length; i++)
	{
		if(allMaskArr.indexOf(ADataMask.maskListArr[i]) < 0)
		{
			removeArr.push(ADataMask.maskListArr[i]);
		}
	}*/
	
	// 이전에 확인했을 때의 마스크 함수 외에 추가된 함수 추가
	for(i=allMaskArr.length-1; i>0; i--)
	{
		if(ADataMask.maskListArr.indexOf(allMaskArr[i]) < 0)
		{
			updateArr.push(allMaskArr[i]);
		}
	}
	
	ADataMask.maskListArr = allMaskArr;
	
	return updateArr;
};

ADataMask.get = function(type, name)
{
	if(ADataMask[type]) return ADataMask[type][name];
};

ADataMask.getFunc = function(type, name)
{
	var mask = ADataMask.get(type, name);
	if(mask) return mask.func;
};

ADataMask.prototype.mask = function(value, ele, obj)
{
	if(ele) this.ele = ele;
	this.setOriginal(value);
	
	if(this.acomp.isDev())
	{
		this.ele.setAttribute('data-maskorigin', value);
		try{
			for(var i=0; i<this.maskFuncs.length; i++)
				value = this.maskFuncs[i].call(this, value, this.maskParams[i], this.ele, obj );
		}catch(e){
			//console.log(e);
		}
	}
	else
	{
		for(var i=0; i<this.maskFuncs.length; i++)
			value = this.maskFuncs[i].call(this, value, this.maskParams[i], this.ele, obj );
	}
	
	if(this.isClear) this.data = this.keyArr = this.queryData = null;
	
	return value;
};

ADataMask.prototype.unmask = function(ele)
{
	if(ele) this.ele = ele;
	return this.getOriginal(ele);
};

ADataMask.prototype.getMaskFunc = function(inx)
{
	if(!this.maskFuncs[inx]) return;
	
	return [ this.maskFuncs[inx], this.maskParams[inx] ];
};

ADataMask.prototype.insertMaskFunc = function(func, param, inx)
{
	if(func) 
	{
		if(inx==undefined)
		{
			this.maskFuncs.push(func);
			this.maskParams.push(param);
		}
		else
		{
			this.maskFuncs.splice(inx, 0, func);
			this.maskParams.splice(inx, 0, param);
		}
	}
};

ADataMask.prototype.updateMaskFunc = function(func, param, inx)
{
	if(inx!=undefined && inx < this.maskFuncs.length)
	{
		if(func) this.maskFuncs[inx] = func;
		if(param) this.maskParams[inx] = param;
	}
};

ADataMask.prototype.moveMaskFunc = function(fromIdx, toIdx)
{
	if(fromIdx == undefined || toIdx == undefined) return;
	if(fromIdx < 0 || fromIdx > this.maskFuncs.length-1) return;
	if(toIdx < 0 || toIdx > this.maskFuncs.length-1) return;
	
	var func = this.maskFuncs.splice(fromIdx, 1)[0];
	var param = this.maskParams.splice(fromIdx, 1)[0];
	
	this.maskFuncs.splice(toIdx, 0, func);
	this.maskParams.splice(toIdx, 0, param);
};


ADataMask.prototype.removeMaskFunc = function(inx)
{
	if(inx != undefined)
	{
		this.maskFuncs.splice(inx, 1);
		this.maskParams.splice(inx, 1);
	}
};

// 개발에서 마스크를 제거하거나 추가할 때 호출하여 마스킹처리하는 함수
ADataMask.prototype.resetElement = function()
{
	if(!this.ele) return;
	
	if(this.ele.acomp)
	{
		if(this.ele.acomp.setMaskValue) this.ele.acomp.setMaskValue(this.getOriginal());
	}
	else
	{
		var value = this.mask(this.getOriginal());
		if(typeof value != 'string') value = '';
		this.ele.innerHTML = value;
	}
};

ADataMask.prototype.setOriginal = function(original)
{
	this.ele.dmOriginal = original;
};

ADataMask.prototype.getOriginal = function()
{
	return this.ele.dmOriginal;
};

ADataMask.setQueryData = function(data, keyArr, queryData)
{
	ADataMask.dataInfoArr = [data, keyArr, queryData];
};

ADataMask.getQueryData = function(data, keyArr, queryData)
{
	return ADataMask.dataInfoArr;
};

ADataMask.clearQueryData = function()
{
	ADataMask.dataInfoArr = [];
};
/*
ADataMask.prototype.setQueryData = function(data, keyArr, queryData)
{
	this.data = data;
	this.keyArr = keyArr;
	this.queryData = queryData;
};

ADataMask.prototype.getQueryData = function()
{
	return {data: this.data, keyArr: this.keyArr, queryData: this.queryData};
};
*/
ADataMask.Number = 
{
	money:
	{
		title: '정수부의 3자리마다 콤마를 넣는다.',
		func: function money(value, param, ele)
		{
			if(value == undefined) value = '';
			else
			{
				var reg = /(^[+-]?\d+)(\d{3})/;
				value += "";
				//while (reg.test(value.toString()))
				while( reg.test(value) )
					value = value.replace(reg, '$1' + ',' + '$2');
			}

			return value;
		}
	},
	
	removeComma:
	{
		title: '콤마를 제거한다.',
		func: function removeComma(value, param, ele)
		{
			if(!value) return '';
			else return value.toString().replace(/,/g, '');
		}
	},
	
	decimalAdjust:
	{
		title: '숫자의 소수점 이하를 조절한다. 숫자값 리턴',
		param: ['유형(floor, round, ceil)', '지수값'],
		func: function decimalAdjust(value, param, ele)
		{
			var type = param[0]?param[0]:'floor',
				exp = param[1];
			
			// If the exp is undefined or zero...
			if (typeof exp === 'undefined' || +exp === 0) {
				return Math[type](value);
			}
			value = +value;
			exp = +exp;
			// If the value is not a number or the exp is not an integer...
			if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
				return NaN;
			}
			// Shift
			value = value.toString().split('e');
			value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
			// Shift back
			value = value.toString().split('e');
			return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
		}
	},
	
	toFixed:
	{
		title: '지정된 숫자를 고정 소수점 표기법을 사용한 문자열로 만들어 리턴한다.',
		param: ['소수점 뒤 자릿수'],
		func: function toFixed(value, param, ele)
		{
			return (+value).toFixed(param[0]);
		}
	},
	
	abs:
	{
		title: '절대값을 만들어 문자로 리턴한다.',
		func: function abs(value, param, ele)
		{
			value = value.toString();
			if(value.charAt(0) == '-') return value.substring(1);
			else return value;
		}
	},
	
	percent:
	{
		title: '뒷부분에 %를 붙인다.',
		func: function percent(value, param, ele)
		{
			return value + '%';
		}
	},
	
	abs_percent:
	{
		title: '절대값을 만들고 뒷부분에 %를 붙여 리턴한다.',
		func: function abs_percent(value, param, ele)
		{
			return ADataMask.Number.percent.func(ADataMask.Number.abs.func(value));
		}
	},
	// 더미 데이터의 길이만큼 '●'를 생성
	makeDummyString:
	{
		title: '더미 데이터의 길이만큼 ●문자를 넣는다.',
		func: function makeDummyString(value, param, ele)
		{
			var dumStr = '';
			for(var i=0; i<value.length; i++) dumStr += '●';
			return dumStr;
		}
	},
	// 사업자번호
	business:
	{
		title: '입력된 값을 사업자번호 포맷으로 변경한다. ###-##-#####',
		func: function business(value, param, ele)
		{
			value = value.replace(/[^0-9]/g, '');
			value = value.substring(0, 10);
			
			if(value.length>5) value = value.substring(0,3) + '-' + value.substring(3,5) + '-' + value.substring(5,10);
			else if(value.length>3) value = value.substring(0,3) + '-' + value.substring(3,5);
			return value;	//value.replace(/([0-9]{3})([0-9]{2})([0-9]{5})/,"$1-$2-$3");
		}
	},
	// 법인등록번호
	corporate:
	{
		title: '입력된 값을 법인등록번호 포맷으로 변경한다. ######-#######',
		func: function corporate(value, param, ele)
		{
			value = value.replace(/[^0-9]/g, '');
			value = value.substring(0, 13);
			
			if(value.length>6) value = value.substring(0,6) + '-' + value.substring(6,13);
			return value;	//value.replace(/([0-9]{6})([0-9]{7})/,"$1-$2");
		}
	},
	// 숫자로 변경
	number:
	{
		title: '입력된 값을 숫자로 변경한다. 맨앞의 0과 소숫점 끝의 0이 제거된다.',
		func: function number(value, param, ele)
		{
			value = Number(value);
			if(isNaN(value)) value = 0;
			
			return value;
		}
	}
};

ADataMask.Date = 
{
	date:
	{
		title: 'YYYY@MM@DD 형태로 변경한다. parseInt 처리한 값으로 표현한다.',
		param: ['구분자(기본값 /)'],
		func: function date(value, param, ele)
		{
			var divider = '/';
			if(param[0]) divider = param[0];
			if(!parseInt(value, 10)) return '';
			value+='';
			return value.substring(0,4)+divider+value.substring(4,6)+divider+value.substring(6,8); 
		}
	},
	time:
	{
		title: 'HH@MM@SS 형태로 변경한다. parseInt 처리한 값으로 표현한다.',
		param: ['구분자(기본값 /)'],
		func: function time(value, param, ele)
		{
			var divider = '/';
			if(param[0]) divider = param[0];
			if(!parseInt(value, 10)) return '';
			value+='';
			return value.substring(0,2)+divider+value.substring(2,4)+divider+value.substring(4,6); 
		}
	},
};

ADataMask.DataGrid = 
{
    dataType:
    {
        title: 'ADataGrid 셀의 type을 지정한다.',
        param: ['타입(button, checkbox, radio)'],
        func: function(value, param, ele, dataObj)
        {
            dataObj.type = param[0];
            dataObj.value = value;
            return dataObj;
        }
    }
};

ADataMask.Text = 
{
	prefix:
	{
		title: '데이터의 앞부분에 문자를 넣는다.',
		param: ['들어갈 문자', '값 있을때만 문자추가(생략시 false)'],
		func: function(value, param, ele)
		{
			var txt = '';
			if(param[0]) txt = param[0];
            if(param[1]&&!value) txt = '';
			return (value = txt + value);
		}
	},
	suffix:
	{
		title: '데이터의 뒷부분에 문자를 넣는다.',
		param: ['들어갈 문자', '값 있을때만 문자추가(생략시 false)'],
		func: function(value, param, ele)
		{
			var txt = '';
			if(param[0]) txt = param[0];
            if(param[1]&&!value) txt = '';
			return value += txt;
		}
	}
};


function TabKeyController()
{
	//depth가 있는 맵. 기본적으로 이곳에 쌓임.
	this.componentMap = 
	[
		
	];
	
	//탭인덱스를 빠르게 검색하기 위한 배열
	this.tabIndexArr =
	[
	
	];
}

TabKeyController.prototype.init = function(rootView)
{
	this.rootView = rootView;
	this.rootView.element.setAttribute('tabindex', -1);
	this.rootView.element.addEventListener('keydown', this._keydown);
};

TabKeyController.prototype.focusOnInit = function(flag, noActive)
{
	if(flag)
	{
		this.makeTabIndexArr();
		var nextComp = this._getFirstComp();
		if(nextComp) nextComp.setFocus(noActive);
		else
		{
			if(this.rootView && this.rootView.isValid())
			{	
				this.rootView.enableActiveFocus(true);
				AComponent.setFocusComp(this.rootView, noActive);
			}
		}
	}
};

//key down 이벤트
TabKeyController.prototype._keydown = function(e)
{
	var acont = this.acomp.getContainer();
	if(!acont) return;

	if(e.keyCode == 9 && acont.tabKey)
	{
		TabKeyController.nextFocus(AComponent.getFocusComp(), e);
	}
};

//다음 탭이 가능한 컴포넌트를 찾음. 
//없으면 탭이 가능한 첫번째 컴포넌트로. (주로 포커스가 rootView에 있을경우 발생한다.)
TabKeyController.prototype.findNextTab = function(comp, isShift)
{
	if(this.componentMap.length == 0) return;
	
	if(!this._isMakeArr) this.makeTabIndexArr();
	
	var nowIndex = this._getCompIndex(comp);
	
	if(nowIndex != null)
	{
		if(isShift)
		{
			return this._getPrevCompByIndex(nowIndex, nowIndex-1);
		}
		else
		{
			return this._getNextCompByIndex(nowIndex, nowIndex+1);
		}
	}
	else
	{
		return this._getFirstComp();
	}
};



//현재 컴포넌트의 순서를 찾음.
TabKeyController.prototype._getCompIndex = function(comp)
{
	if(!comp) return null;
	
	for(var i=0;i<this.tabIndexArr.length;i++)
	{
		if(this.tabIndexArr[i] == comp)
		{
			return i;
		}
	}
	return null;
};

//다음.
TabKeyController.prototype._getNextCompByIndex = function(start, inx)
{
	if(start == inx) return this.tabIndexArr[start];

	if(inx < this.tabIndexArr.length)
	{
		if(this._checkTabValieComp(this.tabIndexArr[inx])) return this.tabIndexArr[inx];
		else return this._getNextCompByIndex(start, inx+1);
	}
	else
	{
		return this._getNextCompByIndex(start, 0);
	}
};

//이전
TabKeyController.prototype._getPrevCompByIndex = function(start, inx)
{
	if(start == inx) return this.tabIndexArr[start];
	
	if(inx < 0)
	{
		return this._getPrevCompByIndex(start, this.tabIndexArr.length-1);
	}
	else
	{
		if(this._checkTabValieComp(this.tabIndexArr[inx])) return this.tabIndexArr[inx];
		else return this._getPrevCompByIndex(start, inx-1);
	}
};

//탭이 가능한 첫번쨰 컴포넌트를 리턴한다.
TabKeyController.prototype._getFirstComp = function()
{
	for(var i=0;i<this.tabIndexArr.length;i++)
	{
		if(this._checkTabValieComp(this.tabIndexArr[i])) return this.tabIndexArr[i];
	}
};

//뷰에서 호출함. 탭키컨트롤러 배열로 컴포넌트맵을 만듬.
TabKeyController.prototype.addCompMap = function(acomp, owner)
{
	this._isMakeArr = false;
	var inx = acomp.getAttr('tabindex'), map;
	
	if(owner)
	{
		if(owner.ownerTabMap) map = owner.ownerTabMap;
		else 
		{
			owner.ownerTabMap = [];
			map = owner.ownerTabMap;
		}
	}
	
	if(!map) map = this.componentMap;
	
	if(inx == 0 || inx == null)
	{
		this.pushCompIntoMap(map, acomp);
	}
	else
	{
		if(map.length == 0) this.pushCompIntoMap(map, acomp);
		else
		{
			var chk = false;
			for(var i in map)
			{
				if(!map[i].comp.element.getAttribute('tabindex') || parseInt(inx) < parseInt(map[i].comp.element.getAttribute('tabindex')))
				{
					map.splice(i, false, {comp:acomp, childArr:[]});
					chk = true;
					break;
				}
			}
			if(!chk) this.pushCompIntoMap(map, acomp);
		}	
	}
};

//컴포넌트를 추가할때 여러 예외처리를 위해서 따로 함수로 뺌
//예외 사항이 생기면 예외처리 부분에 주석을 달아놓기로함.
TabKeyController.prototype.pushCompIntoMap = function(map, acomp)
{
	//예외1 캘린더피커
	//캘린더피커는 내부적으로 아이템을 가지고 있는데
	//이 아이템에 탭인덱스 지정이 불가능하므로 아이템 자체는 탭 배열에 넣지않고 있다가
	//캘린더피커 자체가 들어가는 시점에서 텍스트 필드를 대신 넣어준다.
	if(acomp.parent && acomp.parent.className == "ACalendarPickerItem") return;
	if(acomp.baseName == "ACalendarPicker") 
	{
		acomp.childComp.textfield.setAttr('tabindex', acomp.getAttr('tabindex'));
		acomp = acomp.childComp.textfield;
	}

	//////////////////////////////////////////////////////////////////////////
	map.push({comp:acomp, childArr:[]});
};
//동적로드된 경우에는 따로 모아두는데
//모아 뒀던 탭인덱스 배열을 세이브하는 함수.
TabKeyController.prototype.saveOwnerMap = function(owner)
{
	if(owner.ownerTabMap)
	{
		var result = this._setOwnerChild(owner, this.componentMap);
		if(!result) this.componentMap.push({comp: owner, childArr: owner.ownerTabMap.slice()});

		delete owner.ownerTabMap;
	}
};

TabKeyController.prototype._setOwnerChild = function(owner, targetArr)
{
	for(var i=0;i<targetArr.length;i++)
	{
		if(targetArr[i].comp == owner) 
		{
			targetArr[i].childArr = targetArr[i].childArr.concat(owner.ownerTabMap.slice());
			let aIndex, bIndex;
			targetArr[i].childArr.sort((a, b) => {
				aIndex = a.comp.getAttr('tabindex');
				bIndex = b.comp.getAttr('tabindex');
				if(aIndex == null && bIndex == null) return 0; //둘 다 tabindex가 없는 경우 순서 유지
				if(bIndex == null) return -1;
				if(aIndex == null) return 1;
				return parseInt(aIndex) - parseInt(bIndex);
			});
			return true;
		}
		if(targetArr[i].childArr.length > 0) 
		{
			var res = this._setOwnerChild(owner, targetArr[i].childArr);
			if(res) return res;
		}
	}
};

//트리탐색은 for문이 겹쳐서 매번 탭마다 부하를 줄이기 위해
//빠른탐색 배열을 최초1회 만들어둔다.
TabKeyController.prototype.makeTabIndexArr = function()
{	
	this.tabIndexArr = [];
	this._makeArray(this.componentMap);
	this._isMakeArr = true;
};

TabKeyController.prototype._makeArray = function(arr)
{
	for(var i=0;i<arr.length;i++)
	{
		if(arr[i].childArr.length > 0) this._makeArray(arr[i].childArr);
		else this.tabIndexArr.push(arr[i].comp);
	}
};

//탭키이동이 가능한 컴포넌트인지 검사한다.
// tabindex가 -1이 아님
// 숨겨진 상태가 아님.
// enable false 상태가 아님.
// 탭키가 가능한 컴포넌트인가?
TabKeyController.prototype._checkTabValieComp = function(comp)
{
	if(!comp.isValid()) return false;
	
	if(comp.getAttr('tabindex') == -1) return false;
	
	if(!comp.isEnable) return false;
	
	if(!comp.isShow()) return false;
	
	if(!comp.isTabable) return false;

	//readonly 제외.
	//if(comp.getAttr('readonly') == 'readonly') return false;
	
	return true;
};

TabKeyController.nextFocus = function(acomp, e)
{
	if(!acomp) return;
	var acont = acomp.getContainer();
	if(!acont) return;
	var nextComp = acont.tabKey.findNextTab(acomp, e.shiftKey);
	if(nextComp) nextComp.setFocus(); 
	e.preventDefault();
	e.stopPropagation();
}



//차후에 afc 의 library 로 옮기기
/**
 * @author asoocool
 */

ScrollManager = class ScrollManager
{
	constructor()
	{
        this.scrlTimer = null
        
        this.startTime = null
        this.oldTime = null
        
        this.startPos = 0
        this.oldPos = 0
        this.posGap = 0
        
        this.oldDis = 0//distance
        this.totDis = 0
        
        this.scrollState = 0	//1: initScroll, 2: updateScroll, 3: scrollCheck
        this.isScrollStop = false
        this.scrollEnable = true
        //this.disableManager = null
        this.disableManagers = null
        
        this.moveStart = false
        this.stopCallback = null
        
        this.option = 
        {
            moveDelay: 40
        }
        
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
        window.cancelAnimationFrame  = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;

	}
}


ScrollManager.prototype.setOption = function(option)
{
    for(var p in option)
    {
		if(!option.hasOwnProperty(p)) continue;
        this.option[p] = option[p];
    }
};

//스크롤 on/off 기능
ScrollManager.prototype.enableScroll = function(enable)
{
	this.scrollEnable = enable;
};

//자신이 스크롤될 때 움직이지 말아야할 스크롤 매니저 지정
/*
ScrollManager.prototype.setDisableManager = function(manager)
{
	this.disableManager = manager;
};
*/

//자신이 스크롤될 때 움직이지 말아야할 스크롤 매니저 지정
ScrollManager.prototype.addDisableManager = function(manager)
{
	if(!this.disableManagers) this.disableManagers = [];
	
	for(var i=0; i<this.disableManagers.length; i++)
		if(this.disableManagers[i]===manager) return;
	
	this.disableManagers.push(manager);
};

ScrollManager.prototype.removeDisableManager = function(manager)
{
	for(var i=0; i<this.disableManagers.length; i++)
	{
		if(this.disableManagers[i]===manager)
		{
			manager.enableScroll(true);
			this.disableManagers.splice(i, 1);
			return;
		}
	}
};

ScrollManager.prototype.removeAllDisableManager = function()
{
	for(var i=0; i<this.disableManagers.length; i++)
		this.disableManagers[i].enableScroll(true);

	this.disableManagers = [];
};


//스크롤 애니메이션이 중지됐을 때 호출할 함수 지정
ScrollManager.prototype.setStopCallback = function(callback)
{
	this.stopCallback = callback;
};

ScrollManager.prototype.stopScrollTimer = function()
{
	//touchmove 인 경우는 계속해서 updateScroll 이 발생할 수 있으므로 
	//DisableManager 를 초기화 하지 않는다.
	
	//auto scroll 상태인 경우만 실행되도록 한다.
	if(this.scrollState!=3) return;

	this.isScrollStop = true;

	if(this.scrlTimer)
	{
		if(window.cancelAnimationFrame) window.cancelAnimationFrame(this.scrlTimer);
		else clearTimeout(this.scrlTimer);

		this.scrlTimer = null;
	}

	if(this.stopCallback) 
	{
		this.stopCallback.call(this);
	}
	
	if(this.disableManagers) 
	{
		for(var i=0; i<this.disableManagers.length; i++)
			this.disableManagers[i].enableScroll(true);
	}
};

ScrollManager.prototype.initScroll = function(pos)
{
	//if(!this.scrollEnable) return;

	//stopScrollTimer 를 호출한 후...
	this.stopScrollTimer();
	
	//상태값을 셋팅해 줘야 타이머가 제거됨.
	this.scrollState = 1;
	
	this.oldTime = this.startTime = Date.now();
	
	this.posGap = 0;
	this.oldPos = this.startPos = pos;
	
	this.oldDis = 0;
	this.totDis = 0;
	
	this.isScrollStop = false;
	this.moveStart = false;

/*
	if(this.disableManagers) 
	{
		for(var i=0; i<this.disableManagers.length; i++)
			this.disableManagers[i].enableScroll(true);
	}
	*/
};

ScrollManager.prototype.updateScroll = function(pos, updateFunc)
{
	if(!this.scrollEnable) return;
	
	this.scrollState = 2;

	var dis = this.oldPos - pos;
	var newTime = Date.now();
	var elapse = newTime - this.oldTime;
	var velocity = dis/elapse;
	
	this.oldTime = newTime;
	this.oldPos = pos;
	
	this.totDis += dis;
	
	//일정한 속도 밑으로 떨어지면 시작 지점을 재설정한다.
	//if(Math.abs(velocity*10)<1)

	//방향이 바뀌면 시작 지점을 재설정한다.
	if(this.oldDis*dis<0 || Math.abs(velocity*10)<1)
	{
		this.startTime = newTime;
		this.startPos = pos;
		
		//if(!this.moveStart) this.posGap = 0;
	}
	
	this.oldDis = dis;	
	
	if(!this.moveStart)
	{
		this.posGap += dis;
		if(Math.abs(this.posGap)<this.option.moveDelay) return;
		
		this.moveStart = true;
		
		if(this.disableManagers) 
		{
			for(var i=0; i<this.disableManagers.length; i++)
				this.disableManagers[i].enableScroll(false);
		}
	}
	
	updateFunc.call(this, dis);
};

ScrollManager.prototype.scrollCheck = function(pos, scrollFunc)
{
	if(!this.scrollEnable || this.isScrollStop) return;

	this.scrollState = 3;
	
	//var dis = (this.startPos+this.posGap) - pos;
	var chkDis = this.startPos - pos;
	var dis = this.oldPos - pos;

	//최종 이동 거리를 이곳에 저장해 둔다.
	this.oldDis = dis;
	this.totDis += dis;

	//if(Math.abs(dis)<this.option.moveDelay) 
	if(!this.moveStart)
	{
		if(Math.abs(chkDis)<this.option.moveDelay) 
		{
			this.stopScrollTimer();
			//this.initScroll(0);
			return;
		}
	}

	//터치 다운부터 터치 업까지 걸린 시간
	var elapse = Date.now() - this.startTime, velocity;
	if(elapse == 0) elapse = 1;
	
	if(window.requestAnimationFrame)
	{
		velocity = chkDis/elapse;
		this.autoScroll(velocity, scrollFunc);
	}
};

ScrollManager.prototype.autoScroll = function(acceleration, scrollFunc)
{
	var thisObj = this, elapsed, move;
	var oldTime = 0, velocity = acceleration*1500, resistance = -0.1;//, totalElapsed = 0;
	
	//scroll up, or scroll down
	if(acceleration<0) resistance = 0.1;
	
	function render(timestamp) 
	{
		if(thisObj.isScrollStop) return;
	
		if(oldTime==0) oldTime = timestamp;

		elapsed = timestamp - oldTime;
		oldTime = timestamp;
		
		//totalElapsed += elapsed;
		
		//console.log('totalElapsed : ' + totalElapsed);
		
		/*
		//after one second, resistance is down of its 10%
		if(totalElapsed>500) 
		{
			resistance = resistance*0.5;
			totalElapsed = 0;
		}
		*/
		
		acceleration += resistance;
		
		velocity += acceleration * elapsed;
		move = (velocity * elapsed)/1000;

		//저항값과 이동값의 부호는 반대이다. 
		//즉, move 값의 부호가 바뀌면 이동을 멈춰야 한다.
		if(resistance*move>0 || !scrollFunc.call(thisObj, move, velocity)) 
		{
			setTimeout(function()
			{
				thisObj.stopScrollTimer();
				//thisObj.initScroll(0);
			}, 50);
			
			return;
		}
		
	  	thisObj.scrlTimer = window.requestAnimationFrame(render);
	}

	this.scrlTimer = window.requestAnimationFrame(render);

};


/**
 * @author asoocool
 */

function PosUtil(acomp)
{
	this.acomp = acomp;
	
	this.PIXEL = 10;
	this.moveX = 0;
	this.moveY = 0;
	this.dw = 0;
	this.dh = 0;
	
	this.stickyMoveX = 0;
	this.stickyMoveY = 0;
}

PosUtil.prototype.setSize = function(width, height)
{
	var acomp = this.acomp;
	if(width) acomp.element.style['width'] = width;
	if(height) acomp.element.style['height'] = height;
	
	//알컴포넌트 리사이즈
	this.resizeRcomp(acomp);
	
};

// 컴포넌트의 현재 위치 기준으로 위치값을 변경하는 함수
// stretch 옵션이 켜져있거나 %로 입력이 되어있는 경우에는 위치값이 변경되지 않는다.
// 스티키 기능 때문에 함수가 너무 길어져서 분리함. moveX와 moveY를 계산하는
// offsetPosMoveX offsetPosMoveY
PosUtil.prototype.offsetPos = function(moveX, moveY, isDetail, isMulti, stickyArr)
{
	var stickyX, stickyY, value, unit, posArr = this.getPosInfo();
	if(stickyArr && stickyArr.length > 0)
	{
		for(var i in stickyArr)
		{
			if(stickyArr[i].type == 'left' || stickyArr[i].type == 'right')
			{
				value = posArr[1];
				value = parseFloat(value);
				unit = posArr[1].replace(value, '');
				if(unit == '%')
				{
					var parentWidth = this.acomp.getElement().parentElement.clientWidth;
					stickyX = stickyArr[i].sticky/parentWidth * 100;
				}
				else
				{
					stickyX = stickyArr[i].sticky;
				}
				
				this.stickyCompX = stickyArr[i];
				this.stickyX = 0;
				this.stickyMoveX = 0;
			}
			else
			{
				value = posArr[3];
				value = parseFloat(value);
				unit = posArr[3].replace(value, '');
				if(unit == '%')
				{
					var parentHeight = this.acomp.getElement().parentElement.clientHeight;
					stickyY = stickyArr[i].sticky/parentHeight * 100;
				}
				else
				{
					stickyY = stickyArr[i].sticky;
				}
				
				this.stickyCompY = stickyArr[i];
				this.stickyY = 0;
				this.stickyMoveY = 0;
			}
		}
	}
	
	if(this.stickyX)
	{
		value = posArr[1];
		value = parseFloat(value);
		unit = posArr[1].replace(value, '');
		if(unit == '%')
		{
			var parentWidth = this.acomp.getElement().parentElement.clientWidth;
			var	pixel = (10/parentWidth).toFixed(2)*parentWidth*10*10;
 			moveX = pixel*parseFloat(moveX/pixel, 10);
		}
		this.stickyMoveX += moveX;
		if(Math.abs(this.stickyMoveX) >= Math.abs(this.stickyX))
		{
			this.stickyCompX = null;
			this.offsetPosMoveX(this.stickyMoveX-this.stickyX, isDetail, isMulti);
			this.stickyMoveX = 0;
			this.stickyX = 0;
		}
	}
	else
	{
		if(stickyX) this.stickyX = stickyX;
		this.offsetPosMoveX(moveX, isDetail, isMulti, stickyX);
	}
	
	if(this.stickyY)
	{
		value = posArr[3];
		value = parseFloat(value);
		unit = posArr[3].replace(value, '');
		if(unit == '%')
		{
			var parentHeight = this.acomp.getElement().parentElement.clientHeight;
			var	pixel = (10/parentHeight).toFixed(2)*parentHeight*10*10;
 			moveY = pixel*parseFloat(moveY/pixel, 10);
		}
		this.stickyMoveY += moveY;
		if(Math.abs(this.stickyMoveY) >= Math.abs(this.stickyY))
		{
			this.stickyCompY = null;
			this.offsetPosMoveY(this.stickyMoveY-this.stickyY, isDetail, isMulti);
			this.stickyMoveY = 0;
			this.stickyY = 0;
		}
	}
	else
	{
		if(stickyY) this.stickyY = stickyY;
		this.offsetPosMoveY(moveY, isDetail, isMulti, stickyY);
	}
};

PosUtil.prototype.offsetPosMoveX = function(moveX, isDetail, isMulti, stickyX)
{
	var acomp = this.acomp,
		posArr = this.getPosInfo(), 
		pixel = this.PIXEL, chgPos, sign = 1, roundFunc,
		chgX = 0, chgY = 0;
	
	if(acomp.$ele.css('position') != 'absolute')
	{
		posArr = this.getMarginInfo();
	}
	
	//% -> px 안되게 수정 관련 변수
	var value, unit, parentWidth = acomp.getElement().parentElement.clientWidth;
		
	if(moveX != 0)
	{
		value = posArr[1];
		value = parseFloat(value);
		unit = posArr[1].replace(value, '');
		
		//stretch 상태이거나 단위가 %가 아닌 경우 위치값은 무조건 px로 변경한다.
		if(acomp.sgapW || unit != '%')
		{
			value = parseFloat(acomp.$ele.css(posArr[0]));
			unit = 'px';
		}
		//stretch 가 아니고 위치값에 %인 경우
		else if(unit == '%')
		{
			moveX *= 100;
			value = value*parentWidth;

			//detail 인 경우에는 pixel 값은 1%에 해당하는 값
			if(isDetail)
			{
				pixel = parentWidth;
				isDetail = false;
			}
			//detail이 아닌 경우 pixel 값은 10px 과 근접한 값
			else pixel = (10/parentWidth).toFixed(2)*parentWidth*10*10;
		}

		this.moveX += moveX;
		
		if(!stickyX && Math.abs(this.moveX) > 0)
		{
			if(!isDetail) moveX = pixel*parseInt(this.moveX/pixel, 10);
			
			if(moveX)
			{
				// right 기준인 경우 보수값으로 변경
				if(posArr[0].includes('right')) moveX *= sign = -1;
				
				if(!isDetail)
				{
					// move값이 음수:올림 양수:내림
					if(moveX < 0) roundFunc = Math.ceil;
					else roundFunc = Math.floor;

					//다수의 컴포넌트 이동시 변경위치값은 현재위치값에 단위값을 더한값
					if(isMulti) chgPos = parseInt(roundFunc(value+moveX), 10);
					//하나의 컴포넌트 이동시 변경위치값은 단위값의 배수에 해당하는 값
					else chgPos = pixel*parseInt(roundFunc((value+moveX)/pixel), 10);
				}
				else chgPos = value+moveX;

				if(value != chgPos)
				{
					chgX = (value-chgPos);
					this.moveX += chgX*sign;
					value = chgPos;
				}
			}
		}
		
		if(unit == '%')
		{
			//value(실제px*100)/부모넓이 => n%
			value = value/parentWidth;
			
			//chgX(이동px*100)/100 => 이동px
			chgX = chgX/100;
		}
		
		if(stickyX)
		{
			if(posArr[0] == 'right') stickyX *= sign = -1;
			value += stickyX;
		}
		
		value += unit;
		
		//acomp.$ele.css(posArr[0], value);
		this.setStyle(posArr[0], value);
		
		if(acomp.sgapW)
		{
			//스트레치 정보가 있으면 먼저 방향값을 변경한다.
			this.setStretchValue(posArr[0], value);
			
			unit = this.getStretchValue('width');
			value = parseFloat(unit);
			unit = unit.replace(value, '');

			if(unit == '%')
			{
				//스트레치값 % -> px 변경
				value = value*parentWidth/10/10;
				unit = 'px';
			}
			
			//방향값을 번경한 뒤 넓이값을 변경한다.
			this.setStretchValue('width', value + chgX + unit);
			//this.setStretchValue('width', parseFloat(this.getStretchValue('width')) + chgX);
		}
	}
};

PosUtil.prototype.offsetPosMoveY = function(moveY, isDetail, isMulti, stickyY)
{
	var acomp = this.acomp,
		posArr = this.getPosInfo(), 
		pixel = this.PIXEL, chgPos, sign = 1, roundFunc,
		chgX = 0, chgY = 0;
	
	if(acomp.$ele.css('position') != 'absolute')
	{
		posArr = this.getMarginInfo();
	}
	
	//% -> px 안되게 수정 관련 변수
	var value, unit, parentHeight = acomp.getElement().parentElement.clientHeight;
		
	if(moveY != 0)
	{
		sign = 1;
		pixel = this.PIXEL;
		
		value = posArr[3];
		value = parseFloat(value);
		unit = posArr[3].replace(value, '');
		
		//stretch 상태이거나 단위가 %가 아닌 경우 위치값은 무조건 px로 변경한다.
		if(acomp.sgapH || unit != '%')
		{
			value = parseFloat(acomp.$ele.css(posArr[2]));
			unit = 'px';
		}
		//stretch 가 아니고 위치값에 %인 경우
		else if(unit == '%')
		{
			moveY *= 100;
			value = value*parentHeight;
			
			//detail 인 경우에는 pixel 값은 1%에 해당하는 값
			if(isDetail)
			{
				pixel = parentHeight;
				isDetail = false;
			}
			//detail이 아닌 경우 pixel 값은 10px 과 근접한 값
			else pixel = (10/parentHeight).toFixed(2)*parentHeight*10*10;
		}
		
		this.moveY += moveY;
		
		if(!stickyY && Math.abs(this.moveY) > 0)
		{
			if(!isDetail) moveY = pixel*parseInt(this.moveY/pixel, 10);
			
			if(moveY)
			{
				// bottom 기준인 경우 보수값으로 변경
				if(posArr[2].includes('bottom')) moveY *= sign = -1;

				if(!isDetail)
				{
					// move값이 음수:올림 양수:내림
					if(moveY < 0) roundFunc = Math.ceil;
					else roundFunc = Math.floor;

					//다수의 컴포넌트 이동시 변경위치값은 현재위치값에 단위값을 더한값
					if(isMulti) chgPos = parseInt(roundFunc(value+moveY), 10);
					//하나의 컴포넌트 이동시 변경위치값은 단위값의 배수에 해당하는 값
					else chgPos = pixel*parseInt(roundFunc((value+moveY)/pixel), 10);
				}
				else chgPos = value+moveY;

				if(value != chgPos)
				{
					chgY = (value-chgPos);
					this.moveY += chgY*sign;
					value = chgPos;
				}
			}
		}
		
		if(unit == '%')
		{
			//value(실제px*100)/부모넓이 => n%
			value = value/parentHeight;
			
			//chgY(이동px*100)/100 => 이동px
			chgY = chgY/100;
		}
		
		if(stickyY)
		{
			if(posArr[0] == 'bottom') stickyY *= sign = -1;
			value += stickyY;
		}
		
		value += unit;
		
		//acomp.$ele.css(posArr[2], value);
		this.setStyle(posArr[2], value);
		
		if(acomp.sgapH)
		{
			//스트레치 정보가 있으면 먼저 방향값을 변경한다.
			this.setStretchValue(posArr[2], value);
			
			unit = this.getStretchValue('height');
			value = parseFloat(unit);
			unit = unit.replace(value, '');

			if(unit == '%')
			{
				//스트레치값 % -> px 변경
				value = value*parentHeight/10/10;
				unit = 'px';
			}
			
			//방향값을 번경한 뒤 넓이값을 변경한다.
			this.setStretchValue('height', value + chgY + unit);
			//this.setStretchValue('height', parseFloat(this.getStretchValue('height')) + chgY);
		}
	}
};


PosUtil.prototype.setPos = function(pos, posVal)
{
	var acomp = this.acomp;
	
	//acomp.setStyle(pos, posVal);
	//acomp.$ele.css(pos, posVal);
	this.setStyle(pos, posVal);
	
	if(pos=='left' || pos=='top') this.setStyle(pos=='left'?'right':'bottom', '');//acomp.$ele.css(pos=='left'?'right':'bottom', '');
	else if(pos=='right' || pos=='bottom') this.setStyle(pos=='right'?'left':'top', '');//acomp.$ele.css(pos=='right'?'left':'top', '');
	
// 	if(acomp.sgapW || acomp.sgapH) this.setStretchValue(pos, posVal);
};

PosUtil.prototype.resizeComp = function(guideInx, moveX, moveY, isDetail, isMulti)
{
	var acomp = this.acomp, isAbs = (acomp.$ele.css('position')=='absolute'),
		posArr = isAbs ? this.getPosInfo(true) : this.getMarginInfo(true),
		oriW = acomp.$ele.width(),	outerW = acomp.$ele.outerWidth(),
		oriH = acomp.$ele.height(),	outerH = acomp.$ele.outerHeight(),
		borderW = outerW - oriW , borderH = outerH - oriH,
		pixel = this.PIXEL, chgPos, chgVal, sign = 1, roundFunc;
	
	// 컴포넌트 방향이동 유무
	var compMoveX, compMoveY;
	var dw = moveX, dh = moveY;
	
	if(posArr[0].includes('left'))
	{
		switch(guideInx)
		{
			case 1:
			case 5:
				moveX = dw = 0;
			break;
			case 0: //pw pw
			case 6: //-+ +-
			case 7:
				compMoveX = true;
				dw *= -1;
			break;
			case 2:	//pw pw
			case 3: //0- 0+
			case 4:
				moveX = 0;
			break;
		}
	}
	else
	{
		switch(guideInx)
		{
			case 1:
			case 5:
				moveX = dw = 0;
			break;
			case 0:	//pw pw
			case 6: //0+ 0-
			case 7:
				moveX = 0;
				dw *= -1;
			break;
			case 2: //pw pw
			case 3: //+- -+
			case 4:
				compMoveX = true;
			break;
		}
	}
	
	this.moveX += moveX;
	this.dw += dw;
	posArr[1] = parseFloat(posArr[1]);
	
	// 방향값이 있는 경우
	if(compMoveX)
	{
		if(!isDetail) moveX = pixel*parseInt(this.moveX/pixel, 10);
		
		// right 기준인 경우 보수값으로 변경
		if(posArr[0].includes('right')) moveX *= sign = -1;
		
		// move값이 음수:올림 양수:내림
		if(moveX < 0) roundFunc = Math.ceil;
		else roundFunc = Math.floor;
		
		if(isMulti) chgPos = parseInt(roundFunc(posArr[1]+moveX), 10);
		else chgPos = pixel*parseInt(roundFunc((posArr[1]+moveX)/pixel), 10);
		
		//(현재 포지션값 != 계산한 이동값)
		if(posArr[1] != chgPos)
		{
			//(현재 포지션값+넓이값 < 계산한 이동값)
			if(posArr[1]+oriW < chgPos) chgPos = posArr[1]+oriW;
			
			chgVal = (posArr[1]-chgPos)*sign;
			this.moveX += chgVal;
			posArr[1] = chgPos;
		
			if(posArr[0].includes('right')) chgVal *= sign;
		}
	}
	// 방향값이 없는경우 outerWidth 사용(위치값에 padding, border값을 더한 값이 반대위치이므로)
	else
	{
		if(!isDetail) dw = pixel*parseInt(this.dw/pixel, 10);
		
		// 크기 변경값
		if(dw)
		{
			//if(posArr[0].includes('right')) dw *= sign = -1;	// right 기준인 경우 보수값으로 변경
			if(!isDetail)
			{
				// dw값이 음수:올림 양수:내림
				if(dw < 0) roundFunc = Math.ceil;
				else roundFunc = Math.floor;
				
				if(isMulti) chgPos = parseInt(roundFunc(posArr[1]+outerW+dw), 10);
				else chgPos = pixel*parseInt(roundFunc((posArr[1]+outerW+dw)/pixel), 10);
			}
			else chgPos = posArr[1]+outerW+dw;
			
			if(posArr[1] + borderW > chgPos) chgPos = posArr[1] + borderW;
			
			chgVal = (posArr[1]+outerW-chgPos)*sign;
			this.dw += chgVal;
			chgVal *= -1;
			chgPos = null;
		}
	}
	
	// 변경된 값이 있는 경우에만 방향값을 변경한다.
	if(chgPos != undefined)
	{
		posArr[1] += 'px';
		//acomp.$ele.css(posArr[0], posArr[1]);
		this.setStyle(posArr[0], posArr[1]);
	}
	
	if(chgVal)
	{
		if(isAbs) chgVal += borderW;
	
		acomp.setWidth(oriW+chgVal);	//acomp.$ele.outerWidth(oriW+chgVal);
		if(acomp.sgapW) this.setStretchValue('data-stretch-width', true);
	}

//------------------------------------------------------------------------
	
	if(posArr[2].includes('top'))
	{
		switch(guideInx)
		{
			case 3:
			case 7:
				moveY = dh = 0;
			break;					
			case 0: //pw pw
			case 1: //-+ +-
			case 2:
				dh *= -1;
				compMoveY = true;
			break;
			case 4: //pw pw
			case 5: //0- 0+
			case 6:
				moveY = 0;
				break;
		}
	}
	else
	{
		switch(guideInx)
		{
			case 3:
			case 7:
				moveY = dh = 0;
			break;
			case 0:	//pw pw
			case 1: //0+ 0-
			case 2:
				moveY = 0;
				dh *= -1;
			break;
			case 4:	//pw pw
			case 5: //+- -+
			case 6:
				compMoveY = true;
			break;
		}
	}
	
	sign = 1;
	chgVal = 0;
	this.moveY += moveY;
	this.dh += dh;
	posArr[3] = parseFloat(posArr[3]);
	if(compMoveY)
	{
		if(!isDetail) moveY = pixel*parseInt(this.moveY/pixel, 10);
		// bottom 기준인 경우 보수값으로 변경
		if(posArr[2].includes('bottom')) moveY *= sign = -1;
		// move값이 음수:올림 양수:내림
		if(moveY < 0) roundFunc = Math.ceil;
		else roundFunc = Math.floor;
		
		if(isMulti) chgPos = parseInt(roundFunc((posArr[3]+moveY)), 10);
		else chgPos = pixel*parseInt(roundFunc((posArr[3]+moveY)/pixel), 10);
		
		//(현재 포지션값 != 계산한 이동값)
		if(posArr[3] != chgPos)
		{
			//(현재 포지션값+넓이값 < 계산한 이동값)
			if(posArr[3]+oriH < chgPos) chgPos = posArr[3]+oriH;
			
			chgVal = (posArr[3]-chgPos)*sign;
			this.moveY += chgVal;
			posArr[3] = chgPos;
		
			if(posArr[2].includes('bottom')) chgVal *= sign;
		}
	}
	// 방향값이 없는경우 outerHeight 사용(위치값에 padding, border값을 더한 값이 반대위치이므로)
	else
	{
		if(!isDetail) dh = pixel*parseInt(this.dh/pixel, 10);
		
		// 크기 변경값이 있고 방향값의 크기와 다른 경우
		if(dh)
		{
			// if(posArr[2].includes('bottom')) dh *= sign = -1;	// right 기준인 경우 보수값으로 변경
			if(!isDetail)
			{
				// dh값이 음수:올림 양수:내림
				if(dh < 0) roundFunc = Math.ceil;
				else roundFunc = Math.floor;
				
				
				if(isMulti) chgPos = parseInt(roundFunc((posArr[3]+outerH+dh)), 10);
				else chgPos = pixel*parseInt(roundFunc((posArr[3]+outerH+dh)/pixel), 10);
			}
			else chgPos = posArr[3]+outerH+dh;
			
			if(posArr[3]+ borderH > chgPos) chgPos = posArr[3] + borderH;	//(현재 포지션값 > 계산한 이동값)

			chgVal = (posArr[3]+outerH-chgPos)*sign;
			this.dh += chgVal;
			chgVal *= -1;
			chgPos = null;
		}
	}
	
	// 변경된 값이 있는 경우에만 방향값을 변경한다.
	if(chgPos != undefined)
	{
		posArr[3] += 'px';
		//acomp.$ele.css(posArr[2], posArr[3]);
		this.setStyle(posArr[2], posArr[3]);
	}
	
	if(chgVal)
	{
		if(isAbs) chgVal += borderH;
		
		acomp.setHeight(oriH+chgVal);	//acomp.$ele.outerHeight(oriH+chgVal);
		if(acomp.sgapH) this.setStretchValue('data-stretch-height', true);
	}
	
	this.resizeRcomp(acomp);
	this.resetSticky(true);
};

PosUtil.prototype.resizeRcomp = function(comp)
{
	if(comp.className == "RGrid")
	{
		comp.gridApp.resize();
	}
	else if(comp.ChartNameOfType)
	{
		comp.rChartElement.resize();
	}
	else if(comp.className == "AView")
	{
		var child = comp.getChildren();
		for(var i=0;i<child.length;i++)
		{
			if(child[i].ChartNameOfType)
			{
				child[i].rChartElement.resize();
			}

			if(child[i].className == "RGrid")
			{
				child[i].gridApp.resize();
			}

			if(child[i].className == "AView")
			{
				this.resizeRcomp(child[i]);
			}
		}
	}
	
	comp.updatePosition();
	
};

PosUtil.prototype.resetSticky = function(chk)
{
	if(chk && this.stickyX)
	{
		this.stickyCompX = null;
		this.stickyMoveX = 0;
		this.stickyX = 0;
	}
	
	if(chk && this.stickyY)
	{
		this.stickyCompY = null;
		this.stickyMoveY = 0;
		this.stickyY = 0;
	}
	
	this.stickyMoveX = this.stickyMoveY = 0;
};

PosUtil.prototype.setPosInfo = function(arr)
{
	this.moveX = this.moveY = 0;
	this.dw = this.dh = 0;
	this.setStyle(arr[0], arr[1]);
	this.setStyle(arr[2], arr[3]);
	
	this.resetSticky();
};

PosUtil.prototype.setStyle = function(key, value)
{
	if(typeof(value) == 'number') value += 'px';
	
	this.acomp.setStyle(key, value);
};

// isPixel true면 해당 위치기준의 값을 무조건 px값으로 리턴
// return ['left', 113, 'bottom', 10]
PosUtil.prototype.getPosInfo = function(isPixel)
{
	var arr = [],
		acomp = this.acomp;
	
	var pos = 'left';
	var posVal = acomp.element.style[pos];
	
	if(posVal=='' || posVal.indexOf('auto')>-1) 
	{
		pos = 'right';
		posVal = _get_style_value(pos);
		
		if(posVal=='' || posVal.indexOf('auto')>-1) 
		{
			pos = 'left';
			posVal = '0px';
		}
	}
	else posVal = _get_style_value(pos);
	
	arr.push(pos);
	arr.push(posVal);
	
	pos = 'top';
	posVal = acomp.element.style[pos];
	
	if(posVal=='' || posVal.indexOf('auto')>-1) 
	{
		pos = 'bottom';
		posVal = _get_style_value(pos);
		
		if(posVal=='' || posVal.indexOf('auto')>-1) 
		{
			pos = 'top';
			posVal = '0px';
		}
	}
	else posVal = _get_style_value(pos);
	
	arr.push(pos);
	arr.push(posVal);
	
	return arr;
	
	function _get_style_value(pos)
	{
		if(isPixel) return acomp.$ele.css(pos);
		else return acomp.element.style[pos];
	}
};

PosUtil.prototype.getMarginInfo = function(isPixel)
{
	var arr = [],
		acomp = this.acomp;
	
	var pos = 'margin-left';
	var posVal = _get_style_value(pos);
	//var posVal = acomp.element.style[pos];
	
	/*if(posVal=='' || posVal.indexOf('auto')>-1) 
	{
		pos = 'margin-right';
		posVal = _get_style_value(pos);
		
		if(posVal=='' || posVal.indexOf('auto')>-1) 
		{
			pos = 'margin-left';
			posVal = '0px';
		}
	}
	else posVal = _get_style_value(pos);*/
	
	arr.push(pos);
	arr.push(posVal);
	
	pos = 'margin-top';
	posVal = _get_style_value(pos);
	//posVal = acomp.element.style[pos];
	
	/*if(posVal=='' || posVal.indexOf('auto')>-1) 
	{
		pos = 'margin-bottom';
		posVal = _get_style_value(pos);
		
		if(posVal=='' || posVal.indexOf('auto')>-1) 
		{
			pos = 'margin-top';
			posVal = '0px';
		}
	}
	else posVal = _get_style_value(pos);*/
	
	arr.push(pos);
	arr.push(posVal);
	
	return arr;
	
	function _get_style_value(pos)
	{
		if(isPixel) return acomp.$ele.css(pos);
		else return acomp.element.style[pos];
	}
};

// stretch 관련 정보를 꺼낸다.
PosUtil.prototype.getStretchValue = function(dataKey, isForce)
{
	var acomp = this.acomp,
		pos = 'left',
		value = acomp.element.style[dataKey],
		stretchType, posVal, start, end;
	
	if(dataKey == 'width')
	{
		stretchType = acomp.getSgapW();
		pos = 'left';
	}
	else if(dataKey == 'height')
	{
		stretchType = acomp.getSgapH();
		pos = 'top';
	}
	else
	{
		// data-auto-width, data-auto-height
		dataKey = dataKey.replace('data-auto-', '');
		value = acomp.element.style[dataKey]=='auto'?true:false;
	}
	
	// sgap이 0, undefined, null 이면서 width, height 값이 calc가 아닌 경우
	if(!isForce && (!stretchType || value.indexOf('calc')<0)) return value;
	
	//calc(100% - 10px - 10px)	[100%, 10px, 10px]
	//calc(100% - 10px - 10%)	[100%, 10px, 10%]
	//calc(90% - 10px)			[90%, 10px]
	//calc(80%)					[80%]
	start = value.lastIndexOf('(') + 1;
	end = value.lastIndexOf(')');
	value = value.slice(start, end).replace(/\)|\(/g, '').split(' - ');
	posVal = acomp.element.style[pos];
	if(posVal=='' || posVal == 'auto')
	{
		pos = pos=='left'?'right':'bottom';
		posVal = acomp.element.style[pos];
	}
	
	if(value.length < 2)
	{
		value = 100 - parseFloat(value[0]) - parseFloat(posVal);
		value += '%';
	}
	else
	{
		//value 가 2개 이상인 경우에는 마지막 요소가 넓이임.
		value = value[value.length-1];
	}
	/*
	start = value.lastIndexOf(' ') + 1;
	end = value.lastIndexOf(')');
	
	if(stretchType < 4)
	{
		value = value.slice(start, end);
	}
	else
	{
		start = value.indexOf('(') + 1;
		posVal = acomp.element.style[pos];
		
		if(posVal=='' || posVal.indexOf('auto')>-1)
		{
			pos = pos=='left'?'right':'bottom'
			posVal = acomp.element.style[pos];
		}
		value = value.slice(start, end).replace('%', '');
		value = 100 - value - posVal.replace('%', '');
		value += '%';
	}
	*/
	return value;
};

// dataKey : 'left', 'right', 'top', 'bottom', 'width', 'height'
// value : number(+'px' or +'%') or boolean
PosUtil.prototype.setStretchValue = function(dataKey, value)
{
	var thisObj = this,
		acomp = this.acomp;
	
	//넓이 auto checkbox를 누른 경우
	if(dataKey == 'data-auto-width')
	{
		dataKey = 'width';
		if(value == '') value = [acomp.$ele.outerWidth(), null];
		else value = [value, null];
	}
	//높이 auto checkbox를 누른 경우
	else if(dataKey == 'data-auto-height')
	{
		dataKey = 'height';
		if(value == '') value = [acomp.$ele.outerHeight(), null];
		else value = [value, null];
	}
	//그외 방향값 입력, stretch checkbox 누른 경우, 넓이/높이 입력
	else 
	{
		var posArr =['left', 'right', 'top', 'bottom'],
			posIdx = $.inArray(dataKey, posArr),
			stretchType, posVal, sizeVal;

		//방향값 입력
		if(posIdx > -1)
		{
			if(posIdx < 2) stretchType = acomp.getSgapW();	//getAttr('data-sgap-width');
			else stretchType = acomp.getSgapH();			//getAttr('data-sgap-height');
			
			//stretch 옵션이 아닌 경우 리턴
			if(!stretchType) return;

			dataKey = 'width';
			if(posIdx > 1) dataKey = 'height';

			value = _calc_helper(posArr[posIdx], this.getStretchValue(dataKey));
		}
		//체크박스 선택
		else if(typeof(value) == 'boolean')
		{
			dataKey = dataKey.replace('data-stretch-', '');
			
			//체크
			if(value)
			{
				if(dataKey == 'width') posIdx = 0;
				else if(dataKey == 'height') posIdx = 2;

				value = _calc_helper(posArr[posIdx], null);
			}
			//언체크
			else
			{
				//체크박스를 언체크할 때는 이미 sgapWH 값이 null로 변경 되기 때문에
				//기존 getStretchValue 에서는 stretchValue를 뽑아올 수 없어서 isForce값을 추가
				if(dataKey == 'width')
				{
					if(this.getStretchValue('width', true).includes('%')) value = [this.calcPercentValue(acomp.$ele.outerWidth(), acomp.getParent().getWidth()), null];
					else value = [acomp.$ele.outerWidth(), null];
				}
				else if(dataKey == 'height')
				{
					if(this.getStretchValue('height', true).includes('%')) value = [this.calcPercentValue(acomp.$ele.outerHeight(), acomp.getParent().getHeight()), null];
					else value = [acomp.$ele.outerHeight(), null];
				}
			}
		}
		//그 외 넓이/높이 입력
		else
		{
			if(dataKey == 'width') stretchType = acomp.getSgapW();
			else if(dataKey == 'height') stretchType = acomp.getSgapH();
			
			//stretch 옵션이 아닌 경우 리턴
			if(!stretchType)
			{
				// 넓이 값을 변경이므로 rComp resize 호출 필요
				this.resizeRcomp(acomp);
				return;
			}
			
			value = _calc_helper(dataKey=='width'?posArr[0]:posArr[2], value);
		}
	}

	if(dataKey == 'width') acomp.setSgapW(value[1]);
	else acomp.setSgapH(value[1]);
	value = value[0];
	
	//acomp.element.style[dataKey] = value;
	//acomp.$ele.css(dataKey, value);
	this.setStyle(dataKey, value);

	//알컴포넌트 리사이즈
	this.resizeRcomp(acomp);
	
	//계산 함수
	function _calc_helper(pos, size)
	{
		var posVal = acomp.element.style[pos],
			stretchType;
		
		if(posVal=='' || posVal.indexOf('auto')>-1)
		{
			pos = pos=='left'?'right':'bottom';
			posVal = acomp.element.style[pos];
		}
		
		// checkbox를 클릭해서 stretch할 size 값이 없는 경우
		if(size == undefined)
		{
			/*
			//무조건 px로 변경---------------------------------------------------------------------
			if(pos=='left' || pos=='right')
			{
				size = acomp.getParent().getWidth() - acomp.$ele.css(pos).replace('px', '');
				size -= acomp.$ele.outerWidth();
			}
			else
			{
				size = acomp.getParent().getHeight() - acomp.$ele.css(pos).replace('px', '');
				size -= acomp.$ele.outerHeight();
			}
			size += 'px';
			//-----------------------------------------------------------------------------------
			*/
			
			//px - px : 부모 - 방향값 - 넓이높이값
			//px - %  : 부모 - 방향값 - 넓이높이%에 해당하는 px 값 구한뒤 %로 변경
			//%  - px : 부모 - 방향값에 해당하는 px 값 - 넓이높이값 
			//%  - %  : 부모 - 방향값 - 넓이높이값
			var parentWH, compWH;
			if(pos=='left' || pos=='right')
			{
				parentWH = acomp.getParent().getWidth();
				compWH = acomp.$ele.outerWidth();
				size = acomp.getStyle('width');
			}
			else
			{
				parentWH = acomp.getParent().getHeight();
				compWH = acomp.$ele.outerHeight();
				size = acomp.getStyle('height');
			}
			
			if(posVal.includes('%'))
			{
				if(size.includes('%'))
				{
					//% %
					size = 100 - parseFloat(posVal) - parseFloat(size) + '%';
				}
				else
				{
					//% px
					size = (parentWH * (100 - parseFloat(posVal)) / 100) - compWH + 'px';
				}
			}
			else
			{
				if(size.includes('%'))
				{
					//px %
					size = (parentWH - parseFloat(posVal) - (parseFloat(size)/100*parentWH))/parentWH*100 + '%';
				}
				else
				{
					//px px
					size = parentWH - parseFloat(posVal) - parseFloat(size) + 'px';
				}
			}
		}
		else
		{
			if(!isNaN(size)) size += 'px';
		}
		
		if(posVal.indexOf('%') > -1)
		{
			if(size.indexOf('%') > -1) stretchType = 4;
			else stretchType = 3;
		}
		else
		{
			if(size.indexOf('%') > -1) stretchType = 2;
			else stretchType = 1;
		}
		
		return ['calc(100% - ' + posVal + ' - ' + size + ')', stretchType];
	}
};

PosUtil.prototype.calcPercentValue = function(val, parentVal)
{
	return val*100/parentVal + '%';
};


//----------------------------------------------------------------------------------------------

/*
	로컬라이즈 특정언어에서 테스트가 필요할때 방법
	theApp에서 ready된후에
	LocalizeManager.LANGUAGE 에 언어를 지정해준다. en, ko, zh 등등
	!!주의 : 첫 페이지를 로드하기 전에 해야함.
*/

var LocalizeManager = {};

LocalizeManager.loadMap = function()
{
	LocalizeManager.resMap = AUtil.readTextFile('Resource/LocalizeInfo.json');
};

if(PROJECT_OPTION.general.localizing)
{
	LocalizeManager.loadMap();
}


LocalizeManager.isExistFile = function(url, lang)
{
	if(LocalizeManager.resMap && LocalizeManager.resMap[lang])
	{
		return LocalizeManager.resMap[lang][url] || LocalizeManager.resMap[lang][LocalizeManager.FLAVOR][url];
	}
};

LocalizeManager.getFlavor = function()
{
	return PROJECT_OPTION.general.flavor;
};

LocalizeManager.setFlavor = function(flavor)
{
	LocalizeManager.FLAVOR = flavor || PROJECT_OPTION.general.flavor;
	
	//변경시 화면 전부 변경처리
	document.querySelectorAll('[data-localizing-key]').forEach(ele => {
		if(!ele.acomp || !ele.acomp.setText) return;
		ele.acomp.setText(LocalizeManager.getLocalizedStr(ele.getAttribute('data-localizing-key')));
	});
};

LocalizeManager.getLanguage = function()
{	
	var langStr;
	//ie11
	if(afc.isIE && afc.strIEVer == "msie") langStr = navigator.browserLanguage;
	else langStr = navigator.language;
	
	if(langStr) return langStr.split('-')[0];
	else return PROJECT_OPTION.general.language || 'en';
};

LocalizeManager.LANGUAGE = LocalizeManager.getLanguage();
LocalizeManager.FLAVOR = LocalizeManager.getFlavor();

LocalizeManager.conversionText = function(key, callback)
{
	//if(PROJECT_OPTION.general.localizing)
	{
		LocalizeManager.getLocalizedStr(key, callback);
	}
};

LocalizeManager.getLocalizedStr = function(key, callback)
{
	var ret, arr = LocalizeManager.DATA_ARRAY,
		flavor = LocalizeManager.FLAVOR;
	if(!arr)// || LocalizeManager.DATA_ARRAY[0] != LocalizeManager.LANGUAGE)
	{
		arr = LocalizeManager.DATA_ARRAY = [];
		const lang = PROJECT_OPTION.general.localizing?LocalizeManager.LANGUAGE:'common';
		arr.push(lang);
		var resData = AUtil.readTextFile('Resource/'+lang+'.json');
		if(resData)
		{
			var obj = resData[flavor];
			if(!obj) { 
				obj = {};
				obj[flavor] = resData;
				resData = obj;
			}
			arr.push(resData);
		}
		else
		{
			//arr.push({});
		}
	}
	
	if(arr[1]) ret = arr[1][flavor][key];
	else ret = null;
	
	if(callback) callback(ret);
	return ret;
};

String.prototype.localize = function()
{
	if(!window.LocalizeManager) return this;
	return LocalizeManager.getLocalizedStr(this);
};


/**
 * @author asoocool
 */

/*
this.dataKeyMap = 
{
	obcpp_logn_025a:
	{
		InBlock1: ['UI_UNIT_CLS', 'WRAP_ACNT_YN', '', '', ''], 
		InBlock2: ['', '' ,'ACNO', 'ASNO', '']
	},
	
	obcpp_logn_101a:
	{
		OutBlock1: ['UI_UNIT_CLS', 'WRAP_ACNT_YN', '', '', ''], 
		OutBlock2: ['', '' ,'ACNO', 'ASNO', ''],
		NextBlock1: ['WRAP_ACNT_YN'],
	}
}
*/

class AComponent
{
	constructor()
	{
		this.element = null;		//dom tree object
		this.$ele = null;			//jQuery object
		this.parent = null;			//parent AView
		//this.aevent = null;

		//클릭 이벤트시 상위로 터치 이벤트 전달 막음
		//상위 전달이 필요한 경우 개별적으로 설정(false)
		this.eventStop = true;

		this.isEnable = true;
		this.events = null;
		this.baseName = '';
		this.className = afc.getClassName(this);

		this.compId = '';
		this.groupName = '';

		//	드래그 & 드랍 Manager
		//this.ddManager = null;

		//자신이 사용할 네트웍 블럭의 data key
		this.dataKeyMap = null;
		this.mappingType = 0;

		this.sgapW = null;
		this.sgapH = null;
		//this.centerX = null;
		//this.centerY = null;

		this.rect = null;

		//attr 에서 값을 불러올 경우
        //여기에서 값을 초기화 하면 안됨. init 함수에서 setOption 함수를 이용함.
		this.option = {};
	
	}

}

window.AComponent = AComponent

AComponent.focusComp = null;

AComponent.setFocusComp = function(newComp, noActive) 
{
	if(AComponent.focusComp!==newComp)
	{
		//기존 컴프의 포커스 제거
		//if(AComponent.focusComp && AComponent.focusComp.$ele) AComponent.focusComp.$ele.blur();
		//--> blur 이벤트가 두번 발생해서 주석... 이걸 왜 해줬는지 기억이 나지 않음. 살펴볼 것.
		//--> coding 으로 직접 다른 컴포넌트로 포커스를 주기 위해 넣은 코드 같음.

		//새로운 컴프에게 포커스를 줌.
		//if(newComp && newComp.$ele) newComp.$ele.focus();

		//포커스가 이동하는 엘리먼트가 아닌 경우 이전 포커스 컴포넌트에 직접 블러처리를 해준다.
		//newComp가 codemirror인 경우 $ele는 element이므로 다시 jquery로 감싸서 확인한다.
		if(AComponent.focusComp && (!newComp || !$(newComp.$ele).is(':focusable')) &&
			AComponent.focusComp.$ele) $(AComponent.focusComp.$ele).blur();

		AComponent.focusComp = newComp;

		//if(newComp)
		//	console.log(newComp.className);

        if(newComp && !noActive)
        {
            let cntr = newComp.getContainer()
            if(cntr instanceof AWindow)
            {
                AWindow.makeTopWindow(cntr);
            }
        }
	}
	
	//rMate 컨텍스트 메뉴 종료 관련 예외처리, asoocool
	if(window['rMate'])
	{
		var $ctxMenu = theApp.rootContainer.$ele.find('.rMateH5__ContextMenu');
		
		$ctxMenu.each(function()
		{
			if( !$(this).is(':hidden') )
				$(this).parent().remove();
		});
	}
	
};

AComponent.getFocusComp = function() { return AComponent.focusComp; };

if(window.afc_)
{
	AComponent.getFocusComp = AComponent_.getFocusComp;
	AComponent.setFocusComp = AComponent_.setFocusComp;
}

//---------------------------------------------------------------------------------

AComponent.VISIBLE = 0;
AComponent.INVISIBLE = 1;
AComponent.GONE = 2;

AComponent.MASK = [afc.returnAsIt, afc.addComma, afc.addPercent, afc.commaPercent, afc.absPercent,
				   afc.absComma, afc.absCommaPercent, afc.abs, afc.formatDate, afc.formatTime,
				   afc.formatMonth, afc.formatDateTime, afc.formatTic, afc.floor2, afc.floor2Per,
				   afc.intComma, afc.plusfloorPercent, afc.absFloor2, afc.absFloor2Per, afc.formatHMS,
				   afc.sigaTotalAmount, afc.capitalAmount, afc.intComma, afc.addCommaIfFixed, afc.absCommaIfFixed,
				   afc.absFloor1, afc.formatDate2, afc.oneHundredMillionAmount ];
				   
//-------------------------------------------------------------------------------------



AComponent.realizeContext = function(context, container, rootView, parentView, listener)
{
	var className = context.getAttribute(afc.ATTR_CLASS);

	//item
	if(!className) 
	{
		return null;
	}

	var classFunc = window[className];
	if(!classFunc) 
	{
		afc.log('We can not find the class of ' + className );
		//alert(afc.log('We can not find the class of ' + className ));
		
		className = context.getAttribute(afc.ATTR_BASE);
		classFunc = window[className];
		
		//return null;
	}

	var acomp = new classFunc();
	
	context.container = container;
	
	if(rootView) context.rootView = rootView;
	else context.rootView = acomp;

	//parent 변수만 셋팅해야 하므로 setParent 함수를 호출하지 않는다.
	//acomp.setParent(parentView);

	acomp.parent = parentView;
	
	acomp.init(context, listener);

	return acomp;
};

//--------------------------------------------------------------------------------------------

AComponent.prototype.enableKeyPropagation = function(enable)
{
	this.keyPropagation = enable;
};

AComponent.prototype.createElement = function(context)
{
	//컨텍스트를 지정하지 않은 경우
	if(!context) context = this.className;
	
	//컨텍스트를 생성하도록 문자열로 지정한 경우. 즉, 클래스 이름으로 지정
	if(typeof(context)=="string") 
	{
		var compInfo = window[context].CONTEXT;	//AButton.CONTEXT
		
		if(!compInfo)
		{
			//확장컴포넌트인 경우 부모클래스를 얻어온다.
			context = window[context].prototype.superClass.name;
			compInfo = window[context].CONTEXT;
		}

		context = $(compInfo.tag);
		context.css(compInfo.defStyle);
		this.element = context[0];
	}
	
	//컨텍스트를 직접 지정한 경우
	else this.element = context;
	
	this.rect = new ARect();
    
	this.events = {};
    this.element.acomp = this;	//AComponent object
	
    this.$ele = $(this.element);
	
	this.version = this.$ele.attr('data-ver');
	
	if(!this.version) this.version = 0;
	else this.version = Number(this.version);
};

AComponent.prototype.init = function(context, evtListener)
{
	var $oldEle = null;
	
	//같은 메모리 주소의 context 가 온 경우(같은 리소스를 다시 초기화 하는 경우)
	this.reInitComp = (this.element===context);
	
	//기존에 이미 생성되어져 있는 컴포넌트이면 context 를 교체한다. reInitComp 가 아닌 경우
	//기존 리소스를 삭제하기위해 this.$ele 백업
	if(this.$ele && !this.reInitComp) 
	{
		$oldEle = this.$ele;
	}

	if(!this.reInitComp) this.createElement(context);
	
	if($oldEle)
	{
		$oldEle.after(this.$ele);
		$oldEle.remove();
	}
	
	var rootView = this.getRootView();
	
	if(this.element.id)
	{
		//컴포넌트 아이디값 셋팅, 클래스 명은 제거한다.
		var inx = this.element.id.indexOf(afc.CLASS_MARK);
		if(inx>-1) 
		{
			this.compId = this.element.id.substring(inx+afc.CMARK_LEN);

			//아이디를 지정한 경우 멤버 변수로 셋팅해 준다.
			//var rv = this.getRootView();
			if(rootView) rootView[this.compId] = this;
		}
	}
	
	//$ele 값 생성후 초기화 되기 이전에 필요한 작업을 하는 함수
	//if(this.preset) this.preset.call(this);
	if(this.beforeInit) this.beforeInit();
	
	//루트뷰에게 각각의 컴포넌트가 초기화 되기 이전임을 알린다.
	if(rootView && rootView.beforeChildInit) rootView.beforeChildInit(this);
	
	//----------------------------------------------------------------------------------	
	
	//그룹네임을 셋팅한다.
	this.groupName = this.getAttr(afc.ATTR_GROUP);
    
	this.baseName = this.getAttr(afc.ATTR_BASE);
	//APage 와 같이 delegator 방식인 경우 className 을 다싯 셋팅해야 하기 때문에 
	//다시 한번 셋팅한다.
	//this.className = this.getAttr(afc.ATTR_CLASS);

	this.sgapW = this.getAttr('data-sgap-width');
	this.sgapH = this.getAttr('data-sgap-height');
	//this.centerX = this.getAttr('data-center-left');
	//this.centerY = this.getAttr('data-center-top');
	
	if(!evtListener) evtListener = rootView;
	
	//런타임 시점(프로그램 실행 시점)
	if(!this.isDev())
	{
		this.eventStop = !this.getAttr('data-event-propagation');
		//this.loadQueryInfo( (rootView && rootView.isAsyncQryLoad) );
		this.loadQueryInfo();
		
		// 런타임시에만 disabled -> enable 변경 처리
		if(this.getAttr('disabled'))
		{
			this.removeAttr('disabled');
			this.enable(false);
		}

        // 애니메이션 init
        if(this.getAttr('data-animation-init')) this.playAnimate();
	}
	
	if(afc.isIos && !afc.isHybrid)
	{
		if(this.getAttr('data-ios-scroll')) this.escapePreventDefault();
	}
	
	//if(this.defaultAction) this.defaultAction();
	
	if(!this.reInitComp) 
	{
		this.loadEventInfo(evtListener);
		//툴팁설정
		this.initTooltip();
	}
	
	this.loadDataMask();
	
	this.loadShrinkInfo();
	
	// 위치 변경 Util 내부변수 설정
	if(this.isDev())
	{
		this.posUtil = new PosUtil(this);
		
		//--------------------------------------------------------
		//	data-flag="1100", 현재는 앞에 두자리만 사용
		//	attribute 보다 CONTEXT.flag 에 셋팅된 값을 우선한다.
		//	마지막 자리값이 셋팅되어져 있는 것은 예전에 사용하던 값, 이제는 사용안함.
		//	다음 사항이 필요한 경우가 아니면, 컴포넌트 태그에 기본적으로 data-flag 는 셋팅하지 않는다.
		
		var flag = window[this.baseName].CONTEXT.flag || this.getAttr('data-flag');
		if(flag)
		{
			//개발 시점에 자신의 컴포넌트가 선택되지 않도록 하는 옵션
			//하위의 여러 컴포넌트 중에서 특정 컴포넌트만 선택되지 않도록 할 경우
			if(flag.charCodeAt(0)==0x31) this._noSelectComp = true;	//--------------> 이 옵션이 필요한지 검토, 안 쓰고 있는듯
			
			//개발 시점에 하위 컴포넌트 관련 옵션
			//1: 하위 컴포넌트 선택불가 2: 하위 컴포넌트 선택가능하지만 순서변경 및 삭제는 불가
			this._childSelect = Number(flag.charAt(1));
		}
	}
	
	//로컬라이징..
	//if(PROJECT_OPTION.general.localizing)
	{
		var key_loc = this.getAttr('data-localizing-key');
		if(key_loc && this.setText)
		{
			var thisObj = this;
			LocalizeManager.conversionText(key_loc, function(result){
				if(result) thisObj.setText(result);
			});
		}
	}	
};

//터치나 마우스 다운 시 자신이 포커스 컴포넌트 되기, 필요한 컴포넌트만 호출해서 쓰기
AComponent.prototype.actionToFocusComp = function()
{
	var thisObj = this;
	
	this.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		//e.stopPropagation();
		//최초로 클릭된 컴포넌트만 셋팅하기 위해

		//currentTarget으로 바꿔야하는 이유가 있었는지는 모르겠지만
		//일단 target으로 바꿔서 최초 이벤트 수신 컴포넌트가 포커스 컴포넌트가 되도록 한다.
		//추후 focusComp가 넘어가도 되는 경우 플래그변수를 지정하여 다음 컴포넌트가 포커스 컴포넌트 되도록 한다.
		//타겟이 컴포넌트 안에 포함된 요소인 경우를 위해 _get_helper 함수 추가
		if(e.target===thisObj.element || _get_helper(e.target) === thisObj)
		//if(e.target===thisObj.element)
		//if(e.currentTarget===thisObj.element)
			AComponent.setFocusComp(thisObj);
	});

	function _get_helper(ele)
	{
		if(!ele) return;
		if(ele.acomp) return ele.acomp;
		return _get_helper(ele.parentElement);
	}
};

/*
AComponent.prototype.reuse = function()
{
	//기존 정보를 이용하여 aquery.addQueryComp() 다시 셋팅한다.
	this.reuseQueryInfo();
};
*/

//Do not call directly 
AComponent.prototype.release = function()
{
	if(this.aevent)
	{
		if(this.aevent.bindKeyDown) theApp.removeKeyEventListener('keydown', this.aevent);
		if(this.aevent.bindKeyUp) theApp.removeKeyEventListener('keyup', this.aevent);
	}

	this.removeFromAQuery();
	this.ddManager = undefined;
};

//현재 받은 데이터의 key에 값이 없을경우 이전 데이터를 merge함
//#### 코스콤에서 네트웍 성능 향상을 위해 사용하너 같은데...
//#### 현재는 사용하는 곳이 없어 보임... 나중에 사용하는지 확인 ####
AComponent.prototype.preValMerge = function(comp, data, keyArr)
{
	if(!comp.preVal) comp.preVal = {};
	
	var keyOne = null;
	for(var i = 0; i<keyArr.length; i++)
	{
		keyOne = keyArr[i];
		if(data[keyOne]) comp.preVal[keyOne] = data[keyOne];
		else data[keyOne] = comp.preVal[keyOne];
	}
};

AComponent.prototype.getContainer = function()
{
	if(this.isValid()) return this.element.container; 
	else return null;
};

AComponent.prototype.getContainerId = function()
{
	if(this.isValid() && this.element.container) return this.element.container.getContainerId();
	else return null;
};

AComponent.prototype.getRootView = function()
{
	if(this.isValid()) return this.element.rootView; 
	else return null;
};

//컨테이너의 메인뷰를 리턴한다.
AComponent.prototype.getContainerView = function()
{
	if(this.isValid()) return this.element.container.getView();
	else return null;
};

AComponent.prototype.getElement = function()
{
    return this.element;
};

AComponent.prototype.get$ele = function()
{
	return this.$ele;
};

AComponent.prototype.getStyle = function(key)
{
	if(this.isValid()) return this.element.style[key];
	else return '';
};

AComponent.prototype.setStyle = function(key, value)
{
	if(this.isValid()) this.element.style[key] = value;
};

AComponent.prototype.setStyleObj = function(obj)
{
	if(this.isValid())
	{
		for(var p in obj)
    		this.element.style[p] = obj[p];
	}
};

//url: 'Asset/test.png', pos: '10px 50%', size: '100% 100px', repeat: 'no-repeat'
AComponent.prototype.setBackgroundImage = function(url, pos, size, repeat)
{
	if(this.isValid()) 
	{
		this.element.style['background-image'] = 'url('+url+')';
		
		if(pos) this.element.style['background-position'] = pos;
		if(size) this.element.style['background-size'] = size;
		if(repeat) this.element.style['background-repeat'] = repeat;
	}
};

/*
//defVal : 아무값도 셋팅되어져 있을 않을 경우 리턴
AComponent.prototype.getAttr = function(key, defVal)
{
	var val = this.element.getAttribute(key);
	
	//아무값도 셋팅하지 않았으면
	if(!val && defVal!=undefined) val = defVal;
	else if(val=='false') val = Boolean(val);
	
	return val;
};
*/

AComponent.prototype.getAttr = function(key)
{
	if(this.isValid()) return this.element.getAttribute(key);
	else return null;
};


AComponent.prototype.setAttr = function(key, value)
{
	if(this.isValid()) return this.element.setAttribute(key, value);
	else return null;
};

AComponent.prototype.removeAttr = function(key)
{
	if(this.isValid()) return this.element.removeAttribute(key);
	else return null;
};

AComponent.prototype.isValid = function()
{
	return Boolean(this.element);
};


AComponent.prototype.setSgapW = function(sgapW)
{
	if(sgapW)
	{
		this.sgapW = sgapW;
		this.setAttr('data-sgap-width', sgapW);
	}
	else
	{
		this.sgapW = null;
		this.removeAttr('data-sgap-width');
	}
};

AComponent.prototype.setSgapH = function(sgapH)
{
	if(sgapH)
	{
		this.sgapH = sgapH;
		this.setAttr('data-sgap-height', sgapH);
	}
	else
	{
		this.sgapH = null;
		this.removeAttr('data-sgap-height');
	}
};

AComponent.prototype.getSgapW = function()
{
	return this.sgapW;
};

AComponent.prototype.getSgapH = function()
{
	return this.sgapH;
};


/*
AComponent.prototype.addClass = function(className)
{
	var curClass = this.element.className;
	
    if(curClass.indexOf(className)==-1)
    	this.element.className = curClass+' '+className;
};

AComponent.prototype.removeClass = function(className)
{
	this.element.className = this.element.className.replace(' '+className, '');
};
*/

AComponent.prototype.addClass = function(className)
{
	if(this.$ele) this.$ele.addClass(className);
};

AComponent.prototype.removeClass = function(className)
{
	if(this.$ele) this.$ele.removeClass(className);
};

//직접 호출하지 말것. 실제로 컴포넌트의 부모를 바꾸러면 parent.addComponent 를 사용해야 함.
//addComponent 만 호출하면 이전 부모에서 자동으로 새로운 부모로 이동함, 이전 부모에서 삭제하지 않아도 됨.
AComponent.prototype.setParent = function(parent)
{
	// 20171214 parent 무조건 세팅하게 임시처리 -김민수
	//if(this.parent===parent) return;
	
	if(parent)
	{
		this.element.container = parent.getContainer();
		this.element.rootView = parent.getRootView();
		
		if(this.compId)
		{
			//새로 바뀐 부모의 prefix 로 변경해 준다.
			this.element.id = this.element.rootView.compIdPrefix+this.compId;
			
			//--------------------------------------------------------------------------------------
			//	TODO. ★
			//	새로운 부모가 가지고 있는 자식중에 같은 아이디가 존재할 수 있으므로...변경 로직이 필요...
			//	그렇다고 지정한 아이디를 임의로 바꾸는 것도 문제....
			//	아이디 중복을 체크하여 중복이라는 알림을 보여주는 로직 생각해 보기
			//--------------------------------------------------------------------------------------
		}
	}
	
	this.parent = parent;
};

//AView
AComponent.prototype.getParent = function()
{
	return this.parent;
};

AComponent.prototype.getOwner = function()
{
	return this.owner;
};

AComponent.prototype.getPrevComp = function()
{
	var ele = this.$ele.prev().get(0);
	if(ele) return ele.acomp;
	return null;
};

AComponent.prototype.getNextComp = function()
{
	var ele = this.$ele.next().get(0);
	if(ele) return ele.acomp;
	return null;
};

//편집기에서 셋팅한 id
AComponent.prototype.getComponentId = function()
{
	return this.compId;
};

AComponent.prototype.setComponentId = function(compId)
{
	//if(this.element.id)
	//	this.element.id.replace(afc.CLASS_MARK+this.compId, afc.CLASS_MARK+compId);
	
	if(this.isValid() && this.element.rootView) 
		this.element.id = this.element.rootView.compIdPrefix+compId;
	
	this.compId = compId;
};

AComponent.prototype.getGroupName = function()
{
	return this.groupName;
};

AComponent.prototype.setGroupName = function(groupName)
{
	this.setAttr('data-group', groupName);
	this.groupName = groupName;
};

AComponent.prototype.getClassName = function()
{
	return this.className;
};

AComponent.prototype.setClassName = function(className)
{
	this.setAttr(afc.ATTR_CLASS, className);
	this.className = className;
};

//태그의 id attribute (실제 id)
AComponent.prototype.getElementId = function()
{
	return this.element.id;
};

AComponent.prototype.setName = function(name)
{
	this.setAttr('name', name);
};

AComponent.prototype.getName = function()
{
	return this.getAttr('name');
};

AComponent.prototype.isShow = function()
{
	//return (this.$ele.css('display')!='none' && this.$ele.css('visibility')=='visible');
	
	if(!this.isValid()) return false;
	
	return this.$ele.is(":visible");
};

/*
AComponent.prototype.show = function(showType)
{
	switch(showType)
	{
		case AComponent.VISIBLE:
			this.$ele.show(); 
			this.$ele.css('visibility', 'visible');
		break;
		
		case AComponent.INVISIBLE: 
			this.$ele.css('visibility', 'hidden');
		break;
			
		case AComponent.GONE: this.$ele.hide(); break;
	}
};
*/

AComponent.prototype.show = function() 
{ 
	if(!this.isValid()) return;
	
	this.$ele.css('visibility', 'visible'); 
	this.$ele.show(); 
};

AComponent.prototype.hide = function() 
{ 
	if(!this.isValid()) return;
	
	this.$ele.hide(); 
};

AComponent.prototype.visible = function() 
{ 
	if(!this.isValid()) return;
	
	this.$ele.css('visibility', 'visible'); 
};

AComponent.prototype.invisible = function() 
{ 
	if(!this.isValid()) return;
	
	this.$ele.css('visibility', 'hidden'); 
};

AComponent.prototype.enable = function(isEnable)
{
	this.isEnable = isEnable;
	
	//ios 14.6 에서 pointer-events : none 이 작동하지 않는다. 터치 작동이 막히지도 않고 css 도 반영되지 않는다.
	//임시로 disabled 어트리뷰트를 사용, 이 속성은 input 계열에서만 작동된다.
	//즉, input 계열이 아닌 다른 컴포넌트에서 enable(false) 를 호출해도 disable 되지 않는다.
	//이 증상은 ios 14.6 의 자체 버그이다. 14.7 에서 fix 될 예정
	if(afc.iosVer==14.5 || afc.iosVer==14.6)
	{
		if(isEnable) this.$ele.removeAttr('disabled');
		else this.$ele.css('disabled', 'true');
	}
	
	else
	{
		if(isEnable) this.$ele.css('pointer-events', 'auto');
		else this.$ele.css('pointer-events', 'none');
	}
	
};

//{left,top,right,bottom}
AComponent.prototype.getBoundRect = function()
{
	return this.element.getBoundingClientRect();
};

//return ARect
AComponent.prototype.getCompRect = function()
{
	var pos = this.getPos();
	this.rect.setSizeRect(pos.left, pos.top, this.getWidth(), this.getHeight());
	
	return this.rect;
};

AComponent.prototype.setCompRect = function(x, y, w, h)
{
	this.$ele.css( { left: x+'px', top: y+'px', width: w+'px', height: h+'px' });
};

AComponent.prototype.getPos = function()
{
	return this.$ele.position();
};

AComponent.prototype.setPos = function(x, y)
{
	//x 가 object 인 경우, {left: 100, top:100}
	if(typeof(x)=='object')
	{
		y = x.top;
		x = x.left;
	}
	
	x = Math.floor(x);
	y = Math.floor(y);
	
	this.$ele.css( { 'left': x+'px', 'top': y+'px' });
};

AComponent.prototype.offsetPos = function(dx, dy)
{
	var curPos = this.$ele.position();
	this.$ele.css( { 'left': (curPos.left+dx)+'px', 'top': (curPos.top+dy)+'px' });
};


AComponent.prototype.getWidth = function()
{
	return this.$ele.width();
};

AComponent.prototype.getHeight = function()
{
	return this.$ele.height();
};

AComponent.prototype.setWidth = function(w)
{
	this.$ele.width(w);
};

AComponent.prototype.setHeight = function(h)
{
	this.$ele.height(h);
};

AComponent.prototype.setSize = function(w, h)
{
	this.$ele.width(w);
	this.$ele.height(h);
};

AComponent.prototype.offsetSize = function(dw, dh)
{
	this.setSize(this.$ele.width()+dw, this.$ele.height()+dh);
};

AComponent.prototype.centerX = function()
{
	this.$ele.css('left', 'calc(50% - ' + this.$ele.width()/2 + 'px)');
	this.$ele.css('right', '');
};

AComponent.prototype.centerY = function()
{
	this.$ele.css('top', 'calc(50% - ' + this.$ele.height()/2 + 'px)');
	this.$ele.css('bottom', '');
};

AComponent.prototype.setInlineStyle = function(pos)
{
	if(!pos) pos = 'static';
	
	this.setStyleObj({ position:pos, display:'inline-block', 'vertical-align':'top' });	//'margin-bottom':'-5px'
	//this.setStyleObj({ position:'static', display:'inline-table', 'margin-bottom':'-5px' });
};

AComponent.prototype.removeFromView = function(onlyRelease)
{
	this.release();
	
	//리스트뷰가 view pool 을 사용할 경우 
	if(!onlyRelease)
	{
		//let con = this.getContainer();
		this.setParent(null)
		this.$ele.remove()
    	this.$ele = null
		this.element = null

        this.hideTooltip()
	}
};

AComponent.prototype.addEventListener = function(evtName, listener, funcName, isPrepend)
{
	var evts = this.events[evtName];
	if(!evts) 
	{
		evts = [];
		this.events[evtName] = evts;
		
		//AXEvent 가 구현해 놓은 event 처리 함수를 얻어온다.
		if(this.aevent)
		{
			var evtFunc = this.aevent[evtName];
			if(evtFunc) evtFunc.call(this.aevent);
		}
	}
	
	//기존에 같은 이벤트, 같은 리스너가 등록되어 있다면 삭제 -> removeEventListener 함수 내부에서 체크
	else this.removeEventListener(evtName, listener);
	
	var info =
	{
		'listener': listener,
		'funcName': funcName
	};
	
	if(isPrepend) evts.unshift(info);
	else evts.push(info);
};

AComponent.prototype.removeEventListener = function(evtName, listener)
{
	var evts = this.events[evtName];
	
	if(evts)
	{
		for(var i=0; i<evts.length; i++)
		{
			if(evts[i].listener===listener)
			{
				evts.splice(i, 1);
				return;
			}
		}
	}
};

//setTimeout so slow...
AComponent.prototype.reportEvent = function(evtName, info, event)
{
	//if(window.afc_ && !this._unitTest) return;
	
	if(!this.isValid()) return;
	
	var evts = this.events[evtName];
	
	if(evts)
	{
		var evt, func;
		for(var i=0; i<evts.length; i++)
		{
			evt = evts[i];
			func = evt.listener[evt.funcName];
			if(func) func.call(evt.listener, this, info, event);
			
			//evt.listener[evt.funcName](this, info, event);
		}
	}
};

AComponent.prototype.reportEventDelay = function(evtName, info, delay, event)
{
	var thisObj = this;
	
	setTimeout(function()
	{
		//if(thisObj.isValid())
		thisObj.reportEvent(evtName, info, event);
		
	}, delay);
};

//pWidth : parent width, pHeight : parent height
AComponent.prototype.updatePosition = function(pWidth, pHeight)
{

};

/*
AComponent.prototype.calcStretch = function(key, margin, pSize)
{
	var isPercent = (margin.indexOf('%')>-1);
	
	margin = parseInt(margin, 10);
	
	//if(isPercent) alert(margin);	
	
	var pos = this.getStyle(key);
	if(!pos || pos=='auto')
	{
		key = (key=='left') ? 'right' : 'bottom';
		pos = this.getStyle(key);
	}
	
	if(isPercent) margin = pSize*(margin/100);

	return (pSize - margin - parseInt(pos, 10));
};
*/

AComponent.prototype.setDataMask = function(func, param, ele)
{
	if(!ele) ele = this.element;
	
	var dm = null;
	
	if(typeof(func)=='string') 
	{
		func = func.split('.');
		
		dm = new ADataMask(ele);
		dm.insertMaskFunc(ADataMask[func[0]][func[1]].func, param);
	}
	else if(typeof(func)=='function') 
	{
		dm = new ADataMask(ele);
		dm.insertMaskFunc(func, param);
	}
	else dm = func;
	
	ele.dm = dm;
	
	if(dm)
	{
		dm.ele = ele;
		dm.acomp = this;
	}
};

AComponent.prototype.loadDataMask = function(ele)
{
	if(!ele) ele = this.element;

	var maskfunc = ele.getAttribute('data-maskfunc');
	
	if(maskfunc)
	{
		var dm = new ADataMask(ele, this), temp, i,
			maskparam = ele.getAttribute('data-maskparam'),
			attrObj = {'maskfunc': [], 'maskparam': []},
			isTryCatch;
		
		dm.setOriginal(ele.getAttribute('data-maskorigin'));
		
		maskfunc = maskfunc.split('|');
		if(maskparam) maskparam = maskparam.split('|');
		else
		{
			// 기존에 maskparam이 없었던 경우
			maskparam = [];
			for(i=0; i<maskfunc.length; i++)
			{
				maskparam.push('[]');
			}
		}
		
		for(i=0; i<maskfunc.length; i++)
		{
			//타입과 함수명 분리
			temp = maskfunc[i].split('.');
			attrObj.maskfunc.push(maskfunc[i]);
			attrObj.maskparam.push(maskparam[i]);
			try
			{
				dm.insertMaskFunc(ADataMask[temp[0]][temp[1]].func, JSON.parse(maskparam[i]));
			}
			catch(err)
			{
				isTryCatch = true;
				attrObj.maskfunc.pop();
				attrObj.maskparam.pop();
				if(ADataMask.removedArr.indexOf(maskfunc[i]) < 0) ADataMask.removedArr.push(maskfunc[i]);
			}
		}
		
		// fmt 파일에 사용자 포맷 함수를 만들어 설정하고 fmt 파일을 제거한 경우에 알림처리
		if(isTryCatch)
		{
			//문서의 읽기모드와 관계없이 무조건 수정처리한다.
			//MDIManager가 여러개인 경우 수정여부가 다른 문서에 전달되어 수정여부 체크 제거
			dm.resetElement();

			if(attrObj.maskfunc.length < 1)
			{
				ele.removeAttribute('data-maskfunc');
				ele.removeAttribute('data-maskparam');
				ele.removeAttribute('data-maskorigin');
			}
			else
			{
				ele.setAttribute('data-maskfunc', attrObj.maskfunc.join('|'));
				ele.setAttribute('data-maskparam', attrObj.maskparam.join('|'));
			}
		}
		
		ele.dm = dm;
		
		return dm;
	}
	
	else return null;
};

AComponent.prototype.getDataMask = function(idx, ele)
{
	if(!ele) ele = this.element;
	
	if(idx == undefined) return ele.dm;
	else if(!ele.dm) return null;
	else return ele.dm.getMaskFunc(idx);
};

AComponent.prototype.loadShrinkInfo = function(ele)
{
	if(!ele) ele = this.element;

	var shrinkInfo = ele.getAttribute('data-shrink-info');
	if(shrinkInfo)
	{
		shrinkInfo = shrinkInfo.split(',');
		this.setShrinkInfo({fontSize:Number(shrinkInfo[0]), maxChar:Number(shrinkInfo[1]), unit:shrinkInfo[2]}, ele);
	}
};

AComponent.prototype.loadEventInfo = function(evtListener)
{
	var evtClass = window[this.baseName+'Event']; 
	//이벤트 구현 클래스가 존재하지 않을 경우
	if(!evtClass) 
    {
        console.warn(this.baseName+'Event is not defined.');
        return;
    }
	
	this.aevent = new evtClass(this);
	
	//if(this.presetEvent) this.presetEvent.call(this);
	if(this.beforeLoadEvent) this.beforeLoadEvent();
	
	this.aevent.defaultAction();
	
	if(evtListener)
	{
        let evtObj = this.getMultiAttrInfo(afc.ATTR_LISTENER+'-');
        for(let p in evtObj)
        {
			evtInfo = evtObj[p];
			if(evtInfo)
			{
				evtInfo = evtInfo.split(':');
				this.addEventListener(p, evtListener, $.trim(evtInfo[1]));
			}
        }
        /*
		var evtInfo, events = afc.getEventList(this.baseName);
	
		for(var i=0; i<events.length; i++)
		{
			evtInfo = this.getAttr(afc.ATTR_LISTENER+'-'+events[i]);
			if(evtInfo)
			{
				evtInfo = evtInfo.split(':');
				this.addEventListener(events[i], evtListener, $.trim(evtInfo[1]));
			}
		}
        */
	}
};

AComponent.prototype.bindEvent = function(eventName, callback, options)
{
	return AEvent.bindEvent(this.element, eventName, callback, options);
};

AComponent.prototype.unbindEvent = function(eventName, callback, options)
{
	AEvent.unbindEvent(this.element, eventName, callback, options);
};

AComponent.prototype.setQueryInfo = async function(qryName, blockName, dataKeyArr, index)
{
	if(!qryName || !blockName || !dataKeyArr) return;

	//이미 로드해 놓은 정보가 없으면 메모리 할당
	if(!this.dataKeyMap) this.dataKeyMap = {};
	
	var aquery = await AQuery.getSafeQuery(qryName),
		ctnrId = this.getContainerId();

	if(!aquery) return;

	//auto mapping --> 필드키를 매핑한 상태를 보고 자동으로 블럭을 셋팅한다.
	if(this.mappingType==0)
	{
		if(blockName)
		{
			if(aquery.getValue('input')[blockName])
			{
				//if(aquery.getQueryComps(ctnrId, 'input').indexOf(this) > -1)
				if(this.dataKeyMap[blockName]) aquery.removeQueryComp(ctnrId, 'input', this);
				aquery.addQueryComp(ctnrId, 'input', this);
			}
			if(aquery.getValue('output')[blockName])
			{
				if(this.dataKeyMap[blockName]) aquery.removeQueryComp(ctnrId, 'output', this);
				aquery.addQueryComp(ctnrId, 'output', this);
			}
		}
	}
	//inblock mapping --> 필드키를 등록하지 않고도 input 영역에 컴포넌트를 등록할 수 있다.
	else if(this.mappingType==1)
	{
		if(this.dataKeyMap[blockName]) aquery.removeQueryComp(ctnrId, 'input', this);
		aquery.addQueryComp(ctnrId, 'input', this);
	}
	//outblock mapping --> 필드키를 등록하지 않고도 output 영역에 컴포넌트를 등록할 수 있다.
	else if(this.mappingType==2)
	{
		if(this.dataKeyMap[blockName]) aquery.removeQueryComp(ctnrId, 'output', this);
		aquery.addQueryComp(ctnrId, 'output', this);
	}

	if(!this.dataKeyMap[qryName]) this.dataKeyMap[qryName] = {};
	if(!this.dataKeyMap[qryName][blockName]) this.dataKeyMap[qryName][blockName] = [];
	
	if(index == undefined) this.dataKeyMap[qryName][blockName] = dataKeyArr;
	//index를 넣었다는 얘기는 dataKeyArr이 field명이라는 뜻이므로 해당 위치에 넣어준다.
	else this.dataKeyMap[qryName][blockName][index] = dataKeyArr;
};

//쿼리로드 완료시 처리 함수
AComponent.prototype._qryLoadDone = function(aquery)
{
	if(!this.isValid() || !aquery) return;
		
	//--------------------------------------
		
	var keyBlocks, dataKeyArr, keyMapObj, qryName = aquery.getName(), ctnrId = this.getContainerId();
		
//console.log('query load done - ' + qryName);

	//"InBlock1,UI_UNIT_CLS,WRAP_ACNT_YN,,,|OutBlock2,,,ACNO,ASNO,"
	keyBlocks = this.getAttr('data-blocks-'+qryName);

	//auto mapping --> 필드키를 매핑한 상태를 보고 자동으로 블럭을 셋팅한다.
	//블락명이 InBlock 으로 시작하지 않는 경우가 있어서 아래 dataKeyMap 세팅 부분에서
	//input, output 영역에 해당 블락정보가 있는지 체크하여 쿼리컴포넌트에 추가한다.
	/*if(this.mappingType==0)
	{
		//쿼리는 셋팅했지만 필드키를 매핑하지 않은 경우는 
		//쿼리에 컴포넌트를 등록하지 않는다.
		if(keyBlocks)
		{
			if(keyBlocks.indexOf('InBlock')>-1) aquery.addQueryComp(ctnrId, 'input', this);
			if(keyBlocks.indexOf('OutBlock')>-1) aquery.addQueryComp(ctnrId, 'output', this);
		}
	}*/

	//inblock mapping --> 필드키를 등록하지 않고도 input 영역에 컴포넌트를 등록할 수 있다.
	if(this.mappingType==1) aquery.addQueryComp(ctnrId, 'input', this);

	//outblock mapping --> 필드키를 등록하지 않고도 output 영역에 컴포넌트를 등록할 수 있다.
	else if(this.mappingType==2) aquery.addQueryComp(ctnrId, 'output', this);

	//AView 에서만 사용함
	//child mapping -> 부모 뷰가 자식의 updateComponent 를 호출해 주므로 addQueryComp 를 하지 않는다.
	//else if(this.mappingType==3);

	if(!keyBlocks || keyBlocks=='') this.dataKeyMap[qryName] = null;
	else 
	{
		keyMapObj = this.dataKeyMap[qryName] = {};

		//["InBlock1,UI_UNIT_CLS,WRAP_ACNT_YN,,,", "OutBlock2,,,ACNO,ASNO,"]
		keyBlocks = keyBlocks.split('|');
		
		var blockName;
		for(var j=0; j<keyBlocks.length; j++)
		{
			dataKeyArr = keyBlocks[j].split(',');

			//obcpp_logn_101a: 
			//{ 
			//	InBlock1: ['UI_UNIT_CLS', 'WRAP_ACNT_YN', '', '', ''], 
			//	OutBlock2:['', '' ,'ACNO', 'ASNO', ''] 
			//}
			blockName = dataKeyArr[0];
			keyMapObj[blockName] = dataKeyArr;
			dataKeyArr.shift();	//첫번째 원소 blockName 은 삭제
			
			//auto mapping --> 필드키를 매핑한 상태를 보고 자동으로 블럭을 셋팅한다.
			if(this.mappingType==0)
			{
				if(aquery.hasQueryBlock('input', blockName)) aquery.addQueryComp(ctnrId, 'input', this);
				if(aquery.hasQueryBlock('output', blockName)) aquery.addQueryComp(ctnrId, 'output', this);
			}
		}
	}
	
};

AComponent.prototype.loadQueryInfo = async function()
{
	//if(this.isDev()) return;
	
	//"obacb_balc_041r|obcpp_scrn_001r"
	var queryNames = this.getAttr(afc.ATTR_QUERY_NAME);
	
	if(!queryNames) return;

	//정보가 존재하면 메모리 할당
	this.dataKeyMap = {};
	
	//수신된 데이터 적용 방법, default, add, remove, select
	this.applyType = this.getAttr('data-apply-type');
	
	//쿼리 매핑 방법에 대한 셋팅 값
	var mtype = this.getAttr('data-mapping-type');
	if(mtype) this.mappingType = parseInt(mtype, 10);
	
	queryNames = queryNames.split('|');	//[obacb_balc_041r, obcpp_scrn_001r]
	
	/*
	for(var i=0; i<queryNames.length; i++)
	{
		this._qryLoadDone(await AQuery.getSafeQuery(queryNames[i]));
	}
	*/
	
	/*
	var qrys = await AQuery.getSafeQuerys(queryNames);
	for(var i=0; i<qrys.length; i++)
	{
		this._qryLoadDone(qrys[i]);
	}
	*/
	
	this.qryProms = AQuery.getSafeQuerys(queryNames, true);
};

AComponent.prototype._applyLoadedQuery = function()
{
	if(this.qryProms)
	{
		Promise.all(this.qryProms).then( values =>
		{
			for(var i=0; i<values.length; i++)
			{
				this._qryLoadDone(values[i]);
			}
		});
	}
};

AComponent.prototype.removeFromAQuery = function()
{
	if(!this.dataKeyMap) return;
	
	var aquery, qryName;
	var ctnrId = this.getContainerId();
	for(qryName in this.dataKeyMap)
	{
		aquery = AQuery.getQuery(qryName);
		
		if(aquery)
		{
			//afc.log(ctnrId + ':' + qryName);
		
			aquery.removeQueryComp(ctnrId, 'input', this);
			aquery.removeQueryComp(ctnrId, 'output', this);
		}
	}
};

AComponent.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	/*	
	//---- example ----
	
	if(!keyArr) return;
	
	var data, value;
	for(var i=0; i<3; i++)
	{
		data = dataArr[i];
		for(var j=0; j<keyArr.length; j++)
		{
			value = ... ;
			data[keyArr[j]] = value;
		}
	}
	
	//InBlock 이 occurs 인 경우
	//실제로 셋팅된 개수로 맞춰줘야 한다. 이후의 원소는 삭제된다.	
	dataArr.length = 3;	
	
	//--------------------
	// simple
	//--------------------
	
	if(!keyArr) return;
	
	var data = dataArr[0];
	data[keyArr[0]] = this.getText();
	*/
};

AComponent.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	/*	
	//---- example ----
	
	if(!keyArr) return;
	
	var data, value;
	for(var i=0; i<dataArr.length; i++)
	{
		data = dataArr[i];
		for(var j=0; j<keyArr.length; j++)
		{
			value = data[keyArr[j]];
			...
		}
	}
	
	//--------------------
	// simple
	//--------------------
	
	if(!keyArr) return;
	
	var data = dataArr[0];
	this.setText(data[keyArr[0]]);
	*/
};

//Component 의 값을 QueryData 에 반영한다.
AComponent.prototype.updateQueryData = function(queryData)
{
	var keyMap = this.dataKeyMap[queryData.getQueryName()];
	if(keyMap)
	{
		for(var blockName in keyMap)
		{
			// OutBlock 정보는 송신데이터에 세팅되지않는다.
			if(blockName.indexOf('OutB')>-1) continue;
		
			this.getQueryData(queryData.getBlockData(blockName), keyMap[blockName], queryData);
		}
	}
	
	else this.getQueryData(null, null, queryData);
};


//queryData 의 값을 컴포넌트에 반영한다.

//--------------------------------------------------------------------------------------------------------------------
//리얼데이터 수신 시 dataKey 가 동일한 컴포넌트 들은 일단 모두 updateComponent 가 호출된다.
//자신이 사용하는 fid 와 사용하지 않는 fid 가 혼합되어 들어오기 때문에(자신이 사용하지 않는 fid 만 셋팅 되어져 올 수도 있다.)
//setQueryData 내부에서 비교 로직을 구현해야 한다. io 엔진에서 미리 비교하여 사용하지 않으면 넘겨주지 않을 수도 있지만
//여러개중에서 하나라도 사용되면 넘겨주기때문에 어차피 setQueryData 내부에서 다시 비교해야 하므로 비효율적이다.

//--> 다음과 같이 변경
	
//자신과 상관없는 queryData 는 들어오지 않도록 체크해 주고 있음.
//하지만 자신이 사용하는 fid 와 사용하지 않는 fid 가 혼합되어 들어오기 때문에(여러개 중에서 하나라도 사용되면 넘겨준다.)
//setQueryData 내부에서 비교 로직을 구현해야 한다. 
//--------------------------------------------------------------------------------------------------------------------

AComponent.prototype.updateComponent = function(queryData)
{
	var qryName = queryData.getQueryName(), keyMap, blockName;

	keyMap = this.dataKeyMap[qryName];
	if(keyMap)
	{
		for(blockName in keyMap)
		{
			// InBlock 정보는 데이터 수신 후 컴포넌트에 세팅되지않는다.
			if(blockName.indexOf('InB')>-1) continue;
			var blockData = queryData.getBlockData(blockName);

			//데이터가 없거나 길이가 0인 경우는 처리하지 않는다.
			if(!blockData || blockData.length==0) continue;
			
			//현재 처리중인 블록명을 지정한다. updateChildMappingComp 를 호출되는 경우에 사용된다.
			queryData.curBlockName = blockName;
			ADataMask.setQueryData(blockData[0], keyMap[blockName], queryData);
			this.setQueryData(blockData, keyMap[blockName], queryData);
		}
	}
	else this.setQueryData(null, null, queryData);

	ADataMask.clearQueryData();
	
	//현재 처리중인 블록명을 제거한다.
	delete queryData.curBlockName;
};

AComponent.prototype.updateChildMappingComp = function(dataArr, queryData)
{
	var keyMap, blockName = queryData.curBlockName;
	
	//listview 에서 subview 를 호출하는 경우, dataKeyMap 자체가 없을 수도 있다.
	if(this.dataKeyMap) keyMap = this.dataKeyMap[queryData.getQueryName()];
		
	if(keyMap)
	{
		//처리중인 블록명이 있으면 블록명에 해당하는 매핑정보만 처리한다.
		if(blockName) this.setQueryData(dataArr, keyMap[blockName], queryData);
		else
		{
			for(blockName in keyMap)
			{
				this.setQueryData(dataArr, keyMap[blockName], queryData);
			}
		}
	}
	else this.setQueryData(dataArr, null, queryData);
};


//----------------------

AComponent.prototype.toString = function()
{
	var ret = '\n{\n', value;
    for(var p in this) 
    {
        if(!this.hasOwnProperty(p)) continue;
        
        value = this[p];
        
        if(typeof(value) == 'function') continue;
        
        else if(value instanceof HTMLElement)
        {
        	if(afc.logOption.compElement) ret += '    ' + p + ' : ' + $(value)[0].outerHTML + ',\n';
        	else ret += '    ' + p + ' : ' + value + ',\n';
        }
        else if(value instanceof Object) ret += '    ' + p +' : ' + afc.getClassName(value) + ',\n';
		else ret += '    ' + p + ' : ' + value + ',\n';
    }
    ret += '}\n';
    
    return ret;
};

//drag & drop 관련
AComponent.prototype.enableDrag = function(isDraggable, offsetX, offsetY, listener)
{
	if(!this.ddManager) this.ddManager = new DDManager(this);
	
	if(!offsetX) offsetX = 0;
	if(!offsetY) offsetY = 0;
	
	this.ddManager.setOffset(offsetX, offsetY);
	this.ddManager.enableDrag(isDraggable, listener);
};

AComponent.prototype.enableDrop = function(isDroppable, listener)
{
	if(!this.ddManager) this.ddManager = new DDManager(this);
	this.ddManager.enableDrop(isDroppable, listener);
};

/*
AComponent.prototype.actionDelay = function(filter)
{
	var fComp = this.$ele;
	if(filter) fComp = this.$ele.find(filter);
	 
	if(!fComp) return;
	
	fComp.css('pointer-events', 'none');
	
	var thisObj = this;
	setTimeout(function() 
	{
		if(thisObj.$ele) fComp.css('pointer-events', 'auto'); 
	}, afc.DISABLE_TIME);
};
*/

AComponent.prototype.actionDelay = function()
{
	var thisObj = this;
	
	this.enable(false);
	
	setTimeout(function() 
	{
		if(thisObj.isValid()) thisObj.enable(true); 
		
	}, afc.DISABLE_TIME);
};

//android 4.3 이하, BugFix
//윈도우가 구현한 preventDefault 가 실행되지 않도록, AWindow.prototype.preventTouch 참조
AComponent.prototype.escapePreventTouch = function()
{
/*
	if(afc.andVer>4.3) return;
	
	if(this.getContainer() instanceof AWindow)
	{
		var thisObj = this;
	    this.$ele.on('touchstart', function(e)
	    {
			//스크롤 매니저가 구현된 컴포넌트는 리턴
			if(thisObj.scrlManager || thisObj.scrlManagerX || thisObj.scrlManagerY) return;
	    	
	    	if(thisObj.isScroll && !thisObj.isScroll()) return; 
	    	
	    	e.stopPropagation();
	    });
	}
	*/
};

//컨테이너에 기본 touch 를 disable 시켜 드래그 바운스 효과를 없앨 경우 
//기본적인 스크롤 기능도 사라진다. 이 경우 scrollManager 를 사용하거나
//자체 스크롤 기능을 활성화 시키기 위해 이 함수를 호출하면 특정 컴포넌트만 활성화 된다.
AComponent.prototype.escapePreventDefault = function()
{
	/*
    this.$ele.on('touchstart', function(e)
    {
    	e.stopPropagation();
    });
	*/
	
	//iphone web
	this.$ele.bind('touchstart', function(e)
	{
		e.target.noPreventDefault = true;
	});
	
	
	
};

AComponent.prototype.setEventSync = function(dstEventEle) 
{
	if(dstEventEle)
	{
		if(this.downHandler) this.setEventSync(null);
	
		this.downHandler = AEvent.bindEvent(this.element, AEvent.ACTION_DOWN, function(e)	{ AEvent.triggerEvent(dstEventEle, AEvent.ACTION_DOWN, e); });
		this.moveHandler = AEvent.bindEvent(this.element, AEvent.ACTION_MOVE, function(e)	{ AEvent.triggerEvent(dstEventEle, AEvent.ACTION_MOVE, e); });
		this.upHandler = AEvent.bindEvent(this.element, AEvent.ACTION_UP, function(e)	{ AEvent.triggerEvent(dstEventEle, AEvent.ACTION_UP, e); });
	}
	else
	{
		AEvent.unbindEvent(this.element, AEvent.ACTION_DOWN, this.downHandler);
		AEvent.unbindEvent(this.element, AEvent.ACTION_MOVE, this.moveHandler);
		AEvent.unbindEvent(this.element, AEvent.ACTION_UP, this.upHandler);
		
		this.downHandler = this.moveHandler = this.upHandler = null;
	}
};

//info : {maxChar:15, fontSize:24}
AComponent.prototype.autoShrink = function(info) 
{
	this.$ele.autoShrink(info);
};

//info : {maxChar:15, fontSize:24, unit:'px'}
AComponent.prototype.setShrinkInfo = function(info, ele)
{
	if(!ele) ele = this.element;

	if(info) ele.shrinkInfo = info;
	else
	{
		delete ele.shrinkInfo;
		ele.style['font-size'] = '';
	}
};




//start make by ukmani
//툴팁설정
AComponent.prototype.initTooltip = function()
{
	var thisObj = this;
	
	this.ttMsg = this.getAttr('data-tooltip');
	
	if(this.ttMsg)
	{
		if(!window['ATooltip'])
		{
			AToast.show('ATooltip is not imported.');
			return;
		}
		
		var timer = null;
		
		this.$ele.hover(
			function()
			{ 
				timer = setTimeout(function()
				{
					timer = null;
					thisObj.showTooltip(); 
				}, 700);
				
			},
			function()
			{ 
				if(timer) 
				{
					clearTimeout(timer);
					timer = null;
				}
				else thisObj.hideTooltip(); 
			}
		);
	}
};

AComponent.prototype.showTooltip = function()
{
	if(this.tooltip)
	{
		this.tooltip.hide();
		this.tooltip = null;
	}

    if(this.isValid())
    {
	    this.tooltip = new ATooltip();
	    this.tooltip.show(this.ttMsg, this.getBoundRect());
    }
};

AComponent.prototype.hideTooltip = function()
{
	if(this.tooltip)
	{
		this.tooltip.hide();
		this.tooltip = null;
	}
};

AComponent.prototype.reloadTooltip = function()
{
	this.hideTooltip();
	this.showTooltip();
};

AComponent.prototype.getTooltip = function()
{
	return this.ttMsg;
};

AComponent.prototype.setTooltip = function(ttMsg)
{
	this.$ele.attr('data-tooltip', ttMsg);

	if(!this.ttMsg) this.initTooltip();
	else this.ttMsg = ttMsg;
};

//	현재 스타일을 객체로 반환한다.
AComponent.prototype.getCompStyleObj = function()
{
	//	getDefinedStyle 함수는 AUtil에서 만든 함수
	return {"main": this.get$ele().getDefinedStyle()};
};

//	스타일을 다른 컴포넌트의 스타일로 변경한다.
AComponent.prototype.setCompStyleObj = function(obj)
{
	for(var p in obj.main) this.setStyle(p, obj.main[p]);
};

// 매핑가능한 개수를 리턴한다.
AComponent.prototype.getMappingCount = function()
{
	return 1;
};

//cursor
AComponent.prototype.setCursor = function(cursorName)
{
	this.$ele.css('cursor', !cursorName ? 'default' : cursorName);
};

AComponent.prototype.getCursor = function()
{
	return this.$ele.css('cursor');
};


AComponent.prototype.setFocus = function(noActive)
{
	if(this.isValid())
	{
		this.element.focus();
		AComponent.setFocusComp(this, noActive);
	}
};

//compIdPrefix 는 AView 인 경우만 사용한다.

//이미 초기화 된 컴포넌트의 클론은 문제 발생 요소가 많아 제거함
AComponent.prototype.cloneComponent = function()
{
	if(!this.isValid()) return null;

	let cloneComp = new window[this.getClassName()](),
		context = this.$ele.clone()[0];

    context.id = undefined
	context.container = undefined
	context.rootView = undefined
	
	cloneComp.init(context);
	
	return cloneComp;
};

AComponent.prototype.getMultiAttrInfo = function(dataKey)
{
	var attrs = this.element.attributes, obj = {}, attrName, key;

	//dataKey 가 포함된 태그의 attribute 들을 object 로 만들어 리턴한다.
	//attribute 이름에서 dataKey 부분을 제외한 영역을 오브젝트의 키로 하고 attribute value 를 
	//object 의 값으로 한다.
	for(var p in attrs)	//p is 0,1,2, ...
	{
		attrName = attrs[p].name;
		if(attrName && attrName.indexOf(dataKey)>-1)
		{
			key = attrName.replace(dataKey, '');
			obj[key] = this.$ele.attr(attrName);
		}
	}
	
	return obj;
};

// 컴포넌트 내부에 드랍 가능여부 리턴
AComponent.prototype.getDroppable = function()
{
	return false;
};

//noOverwrite 가 true 이면, 기존의 값이 존재할 경우 덮어쓰지 않는다.
AComponent.prototype.setOption = function(option, noOverwrite)
{
    for(var p in option)
    {
    	if(!option.hasOwnProperty(p)) continue;
    	
		if(!noOverwrite || this.option[p]==undefined)
		{
			this.option[p] = option[p];
		}
    }
};

AComponent.prototype.setUpdateType = function(updateType)
{
	this.updateType = updateType;
};

AComponent.prototype.includeChildView = function(parentView, groupName)
{
    let inx = 0

    if(!groupName)
    {
        parentView.eachChild((acomp)=>
        {
            if(acomp !== this && acomp instanceof AView) this._includeView(acomp, inx++)
        })
    }
    else
    {
        parentView.findCompByGroup(groupName).forEach((acomp)=>
        {
            if(acomp !== this && acomp instanceof AView) this._includeView(acomp, inx++)
        })
    }
}

AComponent.prototype._includeView = function(view, inx)
{

}

//-----------------------------------------------------------------
//	다음 두 함수는 개발 시점에만 사용되어진다.

//Apperance 의 style 에 추가된 css class 값들을 object 형태로 리턴
//default style 값만 리턴한다.
//서브 태그에 data-style- 이 추가된 컴포넌트는 함수를 재구현한다.
AComponent.prototype._getDataStyleObj = function()
{
	var ret = {}, val = this.getAttr(afc.ATTR_STYLE);
	
	//attr value 에 null 이나 undefined 가 들어가지 않도록
	ret[afc.ATTR_STYLE] = val ? val : '';
	
	return ret;
};

// object 형식의 css class 값을 컴포넌트에 셋팅한다.
// default style 값만 셋팅한다.
AComponent.prototype._setDataStyleObj = function(styleObj)
{
	this._set_class_helper(this.$ele, null, styleObj, afc.ATTR_STYLE);
};

AComponent.prototype._set_class_helper = function($attrEle, $cssEle, styleObj, attrKey)
{
	var attrVal = $attrEle.attr(attrKey);
	
	if(!$cssEle) $cssEle = $attrEle;

	//기존에 추가되어져 있던 default style 을 제거하고
	if(attrVal) $cssEle.removeClass(attrVal);

	attrVal = styleObj[attrKey];

	//새로 셋팅되는 default style을 추가한다.
	if(attrVal) $cssEle.addClass(attrVal);
	
	$attrEle.attr(attrKey, attrVal);
};

//컴포넌트에 데이터를 세팅하는 함수, 가져오는 함수
AComponent.prototype.setData = function(){};
AComponent.prototype.getData = function(){};

//개발시점을 판단하는 함수
AComponent.prototype.isDev = function()
{
	return window._isDev;
};

//컴포넌트의 animation을 재생하는 함수.
AComponent.prototype.playAnimate = function()
{
    let keyframeArr;
	try
	{
		keyframeArr = JSON.parse(this.getAttr('data-keyframe'));
	}
	catch(e)
	{
		return;
	}

    if(!keyframeArr) return;

	//이미 재생중인 애니메이션을 cancel 요청한뒤에 잠시후에 다시 재생시도.
	if(this.__AnimObj) 
	{	
		this.__AnimObj.cancel();
		setTimeout(()=>{
			this.playAnimate();
		}, 50)
		return;
	}
	
	let option = {
		duration: parseTime(this.element.style.getPropertyValue('animation-duration'), 0),
		easing: this.element.style.getPropertyValue('animation-timing-function') || 'linear',
		delay: parseTime(this.element.style.getPropertyValue('animation-delay'), 0),
		iterations: parseIterations(this.element.style.getPropertyValue('animation-iteration-count'), 1),
		direction: this.element.style.getPropertyValue('animation-direction') || 'normal',
		fill: this.element.style.getPropertyValue('animation-fill-mode') || 'none'
	};
		
	let AnimObj = this.element.animate(keyframeArr, option);
	this.__AnimObj = AnimObj;
	AnimObj.onfinish = () => {
		this.__AnimObj = null;
	}
	
	AnimObj.oncancel = () => {
		this.__AnimObj = null;
	}
	
	function parseTime(timeString, defaultValue) {
		if (timeString === "" || timeString === undefined) return defaultValue;
		if (timeString.endsWith('ms')) {
			return parseFloat(timeString);
		} else if (timeString.endsWith('s')) {
			return parseFloat(timeString) * 1000;
		}
		return defaultValue;
	}

	function parseIterations(iterationsString, defaultValue) {
		if (iterationsString === "" || iterationsString === undefined) return defaultValue;
		if (iterationsString === 'infinite') return Infinity;
		return parseFloat(iterationsString);
	}
};

               
/**
 * @author asoocool
 */

class ALayout extends AComponent
{
	constructor()
	{
		super()
	
	}

    

}

window.ALayout = ALayout

ALayout.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);

	
};


ALayout.prototype.setParent = function(parent)
{
	AComponent.prototype.setParent.call(this, parent);
	
	var children = this.getAllLayoutComps();
	
	for(var i=0; i<children.length; i++)
		children[i].setParent(parent);
};


ALayout.prototype.getAllLayoutComps = function()
{
	return [];
};

ALayout.prototype.eachChild = function(callback, isReverse)
{

};

ALayout.prototype.updatePosition = function(pWidth, pHeight)
{
	AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
	
	this.eachChild(function(acomp, inx)
	{
		acomp.updatePosition();
	});
};

ALayout.prototype.onContextAvailable = function()
{
	this.eachChild(function(acomp, inx)
	{
		if(acomp.onContextAvailable) acomp.onContextAvailable();
	});
};


ALayout.prototype.removeFromView = function(onlyRelease)
{
	this.eachChild(function(acomp, inx)
	{
		acomp.removeFromView(onlyRelease);
	});

	AComponent.prototype.removeFromView.call(this, onlyRelease);
};

ALayout.prototype._changeCompIdPrefix = function() 
{
	var compId;
	
	this.eachChild(function(acomp, inx)
	{
		compId = acomp.getComponentId();
		
		//componentId 가 존재하면 새로운 compIdPrefix 가 적용되도록 다시 호출해 준다.
		if(compId) acomp.setComponentId(compId);
		
		//자신이 포함하고 있는 하위의 컴포넌트들도 바꿔주기 위해, AView, ALayout
		if(acomp._changeCompIdPrefix) acomp._changeCompIdPrefix();
	});
};

ALayout.prototype.getMappingCount = function()
{
	//return this.getAllLayoutComps().length;

    let tot = 0

	this.getAllLayoutComps().forEach((child)=>{
		tot += child.getMappingCount()
	})

	return tot    


};

ALayout.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	var keyVal, children = this.getAllLayoutComps(), child;
	for(var i=0; i<children.length; i++)
	{
		child = children[i];
		
		keyVal = keyArr[i];
		if(keyVal) child.getQueryData(dataArr, [keyVal], queryData);
	}
};

ALayout.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	
	let children = this.getAllLayoutComps(), child, i, cnt;
	for(i=0; i<children.length; i++)
	{
		child = children[i];
		
		//하위 컴포넌트가 그리드인 경우 데이터가 변경되므로 매번 처음 인덱스값으로 변경
		//dataArr 가 없는 경우도 있으므로 예외처리한다.
		if(dataArr) ADataMask.setQueryData(dataArr[0], keyArr, queryData);
		
		if(child.mappingType==3) child.updateChildMappingComp(dataArr, queryData);
		else 
		{
            cnt = child.getMappingCount()
            child.setQueryData(dataArr, keyArr.slice(i, i+cnt), queryData);
		}
	}
};

// 컴포넌트 내부에 드랍 가능여부 리턴
ALayout.prototype.getDroppable = function()
{
	//return true;
	//_childSelect 가 세팅되어있지 않거나 0인 경우에만 드랍가능
	return !this._childSelect;
};

ALayout.prototype._callSubActiveEvent = function(funcName, isFirst) 
{
	this.eachChild(function(acomp, inx)
	{
		if(acomp._callSubActiveEvent) acomp._callSubActiveEvent(funcName, isFirst);
	});

};

ALayout.prototype.reset = function()
{
	this.eachChild(function(acomp)
	{
		if(acomp.reset) acomp.reset();
	});
};

//컴포넌트에 데이터를 세팅하는 함수
ALayout.prototype.setData = function(data)
{
	var children = this.getAllLayoutComps();
	if(Object.prototype.toString.call(data) == '[object Array]')
	{
		var len = Math.min(children.length, data.length);
		for(var i=0; i<len; i++)
		{
			if(data[i] != undefined) children[i].setData(data[i]);
		}
	}
	else if(Object.prototype.toString.call(data) == '[object Object]')
	{
		var keys = Object.keys(data);
		var len = Math.min(children.length, keys.length);
		for(var i=0; i<len; i++)
		{
			if(data[keys[i]] != undefined) children[i].setData(data[keys[i]]);
		}
	}
};

//컴포넌트의 데이터를 얻어오는 함수
ALayout.prototype.getData = function()
{
	var arr = [];
	var children = this.getAllLayoutComps();
	children.forEach(function(comp)
	{
		arr.push(comp.getData());
	});
	
	return arr;
};

ALayout.prototype._applyLoadedQuery = function()
{
	AComponent.prototype._applyLoadedQuery.call(this);
	
	this.eachChild(function(acomp, inx)
	{
		acomp._applyLoadedQuery();
	});
};


/**
 * @author asoocool
 */
 
//------------------------------------------------------------------------
//	뷰에는 내부에 다른 뷰를 로드하는 기능이 없도록 한다. 
//	뷰는 오로지 addcomponent 를 통해서만 다른 컴포넌트를 추가할 수 있다. 
//	폼을 구성하기 위한 기본 요소이다.
//------------------------------------------------------------------------

class AView extends AComponent
{
	constructor()
	{
		super()
	
		this.isActiveActionDelay = afc.isMobile;   //모바일인 경우만 true

		//AView 의 소유자, 자신을 로드한 주체
		this.owner = null;
		this.document = null;
		this.url = null;

		//중복 아이디를 막기 위해 동적으로 할당된 prefix
		//afc.CLASS_MARK 를 포함하고 있다. ex, 4736352637362--
		this.compIdPrefix = '';

		//자체적인 스크롤 구현
		this.scrlManagerX = null;
		this.scrlManagerY = null;

		//this.isInitDone = false;	//init 이 완전히 완료되었는지, 알메이트 컴포넌트 관련해서 체크해야 함


		this.ldView = null;	//loaded view --> deprecated
		this.ldCntr = null;
	}

	
	
}

window.AView = AView


//--------------------------------------------------------------------------------------------
//	static area

AView.CONTEXT = 
{
    tag: '<div data-base="AView" data-class="AView" class="AView-Style"></div>',

    defStyle: 
    {
        width:'400px', height:'200px'
    },

    //events: ['swipe', 'longtab', 'scroll', 'scrollleft', 'scrollright', 'scrolltop', 'scrollbottom', 'drop', 'dragStart', 'dragEnd' ]
    events: ['click', 'dblclick', 'swipe', 'longtab', 'scroll', 'scrollleft', 'scrollright', 'scrolltop', 'scrollbottom' ]
};

AView.NAME = "AView";

//lay 에 매칭된 cls 파일이 이미 로드되어 있어도 재로드 한다.
AView.enforceClsLoad = false;

AView.setViewInItem = function(aview, item, owner)
{
	aview.$ele.css(
	{
		position: 'relative',
		left: '0px', top: '0px'
	});

	$(item).append(aview.$ele);

	aview.owner = owner;	//자신을 로드한 주체(AComponent, AContainer)
	aview._item = item;		//뷰를 감싸고 있는 dom element 값을 item 이란 변수로 저장
	item.view = aview;		//item 은 view 란 변수로 AView 객체를 저장

	if(owner) aview.element.container = owner.getContainer();
	
	return aview;
};


//	뷰 객체만 로드하여 얻고 싶은 경우는 
//	item 에 null 값을 주고 url 만 입력하면 됨
//	--> AView.createView(null, 'view/test.lay');
//
//	turnback 은 비동기 함수인 callback 에 다시 되돌려주는 변수
//	callback 변수를 거짓으로 넘기면서 turnback 에 이미 로드된 html 을 넘기면 loadHtml 를 호출하지 않고 view 를 생성한다.

AView.createView = function(item, url, owner, eventListener, skipUpdatePos, skipActiveDone, callback, turnback)
{
	//Promise 지원
	return new Promise(function(resolve, reject) 
	{
		var aview = null;
		//var searchValue = AUtil.extractFileNameExceptExt(url, '/') + afc.CLASS_MARK;

		if(!item) item = $('<div></div>')[0];

		//반응형 사용여부
		if(PROJECT_OPTION.general.responsiveLay)
		{
			var RESPONSIVE_MODE = null;

			if(afc.isPC) RESPONSIVE_MODE = 'Pc'; 
			else if(afc.isMobile) 
			{
				if(afc.isTablet) RESPONSIVE_MODE = 'Pc';
				else RESPONSIVE_MODE = 'Mobile';

				//RESPONSIVE_MODE = 'Mobile';
			}

			if(afc.isSimulator && PROJECT_OPTION.general.responsiveTest)
			{
				RESPONSIVE_MODE = PROJECT_OPTION.general.responsiveTest;
			}

			if(RESPONSIVE_MODE)
			{
				var path = AUtil.extractLoc(url,'/');
				var fileName = AUtil.extractFileNameExceptExt(url,'/');
				var resUrl = path + RESPONSIVE_MODE + '/' +fileName+'.lay';
				if(ResponsiveManager.isExistFile(url, RESPONSIVE_MODE)) url = resUrl;
			}
		}

		//로컬라이징 사용여부
		if(PROJECT_OPTION.general.localizing)
		{
			let path = AUtil.extractLoc(url,'/');
			let fileName = AUtil.extractFileNameExceptExt(url,'/');
			let resUrl = path + LocalizeManager.LANGUAGE + '/' +fileName+'.lay';
			if(LocalizeManager.isExistFile(url, LocalizeManager.LANGUAGE)) url = resUrl;
		}
		
		//afc.asyncWait.reg(url);

		// turnback 은 비동기 함수인 callback 에 다시 되돌려주는 변수
		// callback 변수를 거짓으로 넘기면서 turnback 에 이미 로드된 html 을 넘기면 loadHtml 를 호출하지 않고 view 를 생성한다.

		if(!callback && turnback) 
		{
			item.innerHTML = turnback;

			_loadHelper.call(item, turnback);
		}
		else 
		{
			//afc.loadHtml(item, url, _loadHelper, null, null, Boolean(asyncCallback));
			afc.loadHtml(item, url, _loadHelper); 
		}

		async function _loadHelper(retHtml)
		{
			//retHtml 이 null 인 경우는 ajax 에러이므로 리턴한다.
			if(!retHtml) 
			{
				if(callback) callback(null);
				else resolve(null);
				
				//afc.asyncWait.unreg(url);
				return;
			}
		
			//마지막으로 로드 성공한 html 문자열 정보를 저장해 둔다.
			//if(retHtml) AView.lastLoadedHtml = retHtml;
			if(owner) owner.lastLoadedHtml = retHtml;

            let viewObj = $(item).children();
	        let viewContext = viewObj[0];

			//AView의 absolute 옵션을 relative로 바꿔준다.
			//그래야 자식 컴포넌트들이 자신을 기준으로 배치된다.
			viewObj.css(
			{
				position: 'relative',
				left: '', top: ''
			});

			var _className = viewObj.attr(afc.ATTR_CLASS), isAView = (_className=='AView'),	//lay 에 매칭된 cls 가 없는 경우는 기본 AView class 이다.
				isRespCss = viewObj.hasClass(_className+'-resp');

			if(!_className)
			{
				console.warn(afc.log('There is no className in attribute. url : ' + url));
			}

			if(isRespCss)
			{
				afc.loadCss('Template/' + _className + '-resp.css');
			}

			//-------------------------------------------------------------------------
			// 컴포넌트 파일 동적 로딩
			//if(PROJECT_OPTION.build.dynamicComp && !isAView) 
			if(PROJECT_OPTION.build.frwLoadOption=='inTimeLoad')// && !isAView) 
			{
				var classMap = viewObj.attr('data-class-map');

				if(classMap)
				{
					var arr, p, i;

					classMap = JSON.parse(classMap);
					for(p in classMap)
					{
						arr = classMap[p];

						for(i=0; i<arr.length; i++)
						{
							afc.import('Framework/' + p + '/component/' + arr[i] + '.js');
							afc.import('Framework/' + p + '/event/' + arr[i] + 'Event.js');
						}
					}
				}
			}
			//-------------------------------------------------------------------------

			//-------------------------------------------------------------------------
			// cls 파일 동적 로딩
			//if(PROJECT_OPTION.build.dynamicInc && !isAView) 
			//cls 파일은 무조건 동적 로딩으로 바뀌어서 PROJECT_OPTION.build.dynamicInc 이 옵션을 비교할 필요 없음.
			if(!isAView && url) 
			{
				//로컬라이징 사용여부
				if(PROJECT_OPTION.general.localizing) url = url.replace("/"+LocalizeManager.LANGUAGE+"/","/");
				//반응형
				if(PROJECT_OPTION.general.responsiveLay) url = url.replace("/"+RESPONSIVE_MODE+"/","/");

				//로드가 완료된 이후에 scriptReady 가 호출되어야 한다.
				await afc._loadScriptWait( url.substring(0, url.lastIndexOf(".")) + '.js', AView.enforceClsLoad);	//true, 무조건 강제 로드
			}
			//-------------------------------------------------------------------------		

			//위에서 동적으로 로드한 스크립트가 모두 로드된 후에 진행되도록
			//위의 스크립트 내부에서 호출된 await afc.import(); 까지 모두 로드되어야 호출된다.
			afc.scriptReady(function()
			{
                let _classFunc = window[_className];
                if(!_classFunc) 
                {
                    //alert(afc.log('We can not find the class of ' + _className ));
                    console.warn(afc.log('We can not find the class of ' + _className ));

                    aview = new AView();
                }
                else aview = new _classFunc();

				aview.url = url;
				aview.owner = owner;	//자신을 로드한 주체(AComponent, AContainer)
				aview._item = item;		//뷰를 감싸고 있는 dom element 값을 item 이란 변수로 저장
				item.view = aview;		//item 은 view 란 변수로 AView 객체를 저장


				var rootView = aview;

				if(owner) 
				{
					viewContext.container = owner.getContainer();

					//단독으로 로드된 lay 인 경우 owner 의 루트뷰로 변경해 준다.
					if(isAView && owner.getRootView) //AContainer 인 경우는 함수가 없다.
					{
						rootView = owner.getRootView();
					}
				}

				if(!eventListener) eventListener = rootView;

				//비동기 로드이면 쿼리 파일도 비동기로 로드되도록
				//rootView.isAsyncQryLoad = true;

				viewContext.rootView = rootView;
				viewContext.compIdPrefix = afc.makeCompIdPrefix();

				aview.init(viewContext, eventListener);

                //hot reload 기능
                if(theApp.isHotReload())
                {
                    //로드된 뷰인 경우만
                    if(!isAView && url) theApp.watchReloadFile(aview);
                }

                //afc.queryReady의 타이밍 이슈로 afc.queryReady호출되기전에 처리.
                aview._rMateManage(skipUpdatePos, skipActiveDone, function()
                {
                    afc.queryReady(aview, function()
                    {
                        //initDone, activeDone 이전에 호출된다.
                        if(callback) callback(aview, turnback);
                        else resolve(aview);

                        aview._initDoneManage(skipUpdatePos, skipActiveDone);
                    })
                })

			});
		}
	
	});
	
	//return aview;

};

AView._findTextContains = function(viewComp, text, ignoreCase, retArr)
{
	var ret = null, tmp;
	
	if(retArr) ret = retArr;
	else ret = [];
	
	if(ignoreCase) text = text.toLowerCase();
	
	viewComp.eachChild(function(acomp)
	{
		if(acomp instanceof AView || acomp instanceof ALayout) 
		{
			AView._findTextContains(acomp, text, ignoreCase, ret);
		}
		else if(acomp.getText) 
		{
			tmp = acomp.getText();

			if(ignoreCase) tmp = tmp.toLowerCase();

			if(tmp.indexOf(text)>-1) ret.push(acomp);
		}
	});
	
	return ret;
};


//--------------------------------------------------------------------------------------------


AView.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	//context 에 rootView 가 셋팅되어져 있지 않으면 자신을 rootView 로 셋팅한다.	
	if(!this.element.rootView) this.element.rootView = this;

	//var respClass = this.getAttr(afc.ATTR_RESP);
	//if(respClass) this.addClass(respClass);
	
	this.setOption(
	{
		getDataAsArray : this.getAttr('data-option-getdata-as-array')
		
	}, true);
	
	//jQuery droppable 클래스 제거
	this.removeClass('ui-droppable');
	
	//if(!this.element.noRealizeChildren) this._realizeChildren(evtListener);
	
	this._realizeChildren(evtListener, this.reInitComp);
	
	// 개발중에 하위 컴포넌트를 선택하지 못하는 경우 직접 하위 컴포넌트의 이벤트를 등록하여 전달해준다.
	this.loadChildEventInfo(evtListener);
	
	/*
	if(afc.isIos)
	{
		if(this.$ele.css('overflow')!='hidden')
			this.$ele.css('-webkit-overflow-scrolling', 'touch');
	}
	else
	{
		var val = this.$ele.css('overflow');
		
		//뷰에 스크롤이 발생할 경우 가속기능을 부여하기 위해, z-index가 없거나 auto인 경우 0으로 대체
		//이 부분이 없으면 크롬 브라우저에서 뷰 스크롤 시 안보이던 부분이 안그려지는 버그가 생김
		if(val=='auto' || val=='scroll')
		{
			val = this.$ele.css('z-index');
			if(!val || val == 'auto') this.$ele.css('z-index', 0);
			
			// 여러 absolue 태그가 중첩되어 스크롤 기능이 작동될 때
			// 겹쳐지는 버그 수정(z-index 관련 오류)
			this.$ele.css('-webkit-backface-visibility', afc.isSimulator?'':'hidden');
			// 이미 backface0visibility 값이 SpiderGen에서 화면 오픈 할 때 hidden으로 처리되었으므로 일단 제거하고
			// 추후에 아래의 내용으로 변경할지 고민 필요
			//if(!afc.isSimulator && !window.afc_) this.$ele.css('-webkit-backface-visibility', 'hidden');
		}
		
		
		//android 4.3 이하, BugFix
		//스크롤뷰 안의 컴포넌트 터치 안되는 버그 수정
		if(afc.andVer<4.4)
		{
			this.$ele.css('-webkit-transform', 'translateZ(0)');
			
			//thisObj = this;
			//setTimeout(function() { thisObj.$ele.css('-webkit-transform', ''); }, 100);
		}
	}
	*/
	
	//-----------------------------------------------------------------------
	//	asoocool 2019.04.09 
	var val = this.$ele.css('overflow');

	if(val=='auto' || val=='scroll')
	{
		if(afc.isIos)
		{
			this.$ele.css('-webkit-overflow-scrolling', 'touch');
		}

		//	android
		//	뷰에 스크롤이 발생할 경우 가속기능을 부여하기 위해, z-index가 없거나 auto인 경우 0으로 대체
		//	이 부분이 없으면 크롬 브라우저에서 뷰 스크롤 시 안보이던 부분이 안그려지는 버그가 생김
		else
		{
			val = this.$ele.css('z-index');
			if(!val || val == 'auto') this.$ele.css('z-index', 0);
			
			// 여러 absolue 태그가 중첩되어 스크롤 기능이 작동될 때
			// 겹쳐지는 버그 수정(z-index 관련 오류)
			this.$ele.css('-webkit-backface-visibility', afc.isSimulator?'':'hidden');

			// 이미 backface0visibility 값이 SpiderGen에서 화면 오픈 할 때 hidden으로 처리되었으므로 일단 제거하고
			// 추후에 아래의 내용으로 변경할지 고민 필요
			//if(!afc.isSimulator && !window.afc_) this.$ele.css('-webkit-backface-visibility', 'hidden');
			
			if(afc.isScrollIndicator) 
			{
				this._enableScrollIndicatorX();
				this._enableScrollIndicatorY();
			}
		}
	}
	
	//-----------------------------------------------------------------------	
	
	//this.escapePreventTouch();
	
	if(!this.reInitComp)
	{
		this.actionToFocusComp();

		if(context && context.compIdPrefix) this._changeCompIdPrefix(context.compIdPrefix);

		//for mirae - crud component 확인
		//this._initCrudComponent();


		var loadUrl = this.getAttr('data-load-url');
		if(loadUrl && !this.isDev()) 
		{
			var thisObj = this;

			//setTimeout(function()
			//{
				thisObj.loadView(loadUrl);

			//}, 0);
		}
	}
	
	
};


AView.prototype._initCrudComponent = function() 
{
	if(typeof CrudManager != "function") return;
	
	this.crudObj = CrudManager.getCrudbyFileName(this.className);
	if(!this.crudObj) return;
    var children = this.getChildren();

	for(var i=0;i<children.length;i++)
	{
		this._findChildCrudComp(children[i]);
	}

};

AView.prototype._findChildCrudComp = function(comp) 
{
	if(comp.baseName == 'AGridLayout' || comp.baseName == 'AFlexLayout')
	{
		var thisObj = this;
		comp.eachChild(function(acomp){
			thisObj._findChildCrudComp(acomp);
		});
	}
	else if(comp.baseName == 'AView' || comp.baseName == 'ARadioGroup')
	{
		var childView = comp.getChildren();
		for(var i in childView)
		{
			this._findChildCrudComp(childView[i]);
		}
	}
	else
	{
		var crud = comp.getAttr('data-crud');
		switch(crud)
		{
			case '1':
				if(this.crudObj.create == '0') comp.enable(false);
			break;
			case '2':
				if(this.crudObj.read == '0') comp.enable(false);
			break;
			case '3':
				if(this.crudObj.update == '0') comp.enable(false);
			break;
			case '4':
				if(this.crudObj.delete == '0') comp.enable(false);
			break;
		}
	}
};

//리턴값과 상관없이 callback 만 있으면 되지만 기존 코드와의 호환성을 위해 유지
AView.prototype._rMateManage = function(skipUpdatePos, skipActiveDone, callback) 
{
	if(!window.rMate) 
    {
        if(callback) callback()
        return false;
    }

	let $rGrid = this.$ele.find('.RGrid-Style'),
		$rChart = this.$ele.find('.RChart-Style'),
		gridCnt = $rGrid.length, chartCnt = $rChart.length, thisObj = this;

	function _initDoneCheck()
	{
		if( gridCnt+chartCnt == 0 && thisObj.isValid())
		{
			//thisObj._initDoneManage(skipUpdatePos, skipActiveDone);
            if(callback) callback()
            else thisObj._initDoneManage(skipUpdatePos, skipActiveDone);
		}
	}

	if(gridCnt+chartCnt > 0)
	{
		let delegator = 
		{
			onChartReady: function(rChart)
			{
				//console.log(rChart.className + ':' + chartCnt);

				chartCnt--;
				_initDoneCheck();
			},

			onGridReady: function(rGrid)
			{
				//console.log(rGrid.className + ':' + gridCnt);

				gridCnt--;
				_initDoneCheck();
			}
		};

		$rGrid.each(function() { this.acomp.setDelegator(delegator); });
		$rChart.each(function() { this.acomp.setDelegator(delegator); });

		return true;
	}
	
	else 
    {
        if(callback) callback()
        return false;
    }
};

AView.prototype.onContextAvailable = function()
{
    this.eachChild(function(acomp)
    {
        if(acomp.onContextAvailable) acomp.onContextAvailable();
    });
};

AView.prototype._initDoneManage = function(skipUpdatePos, skipActiveDone) 
{
	var thisObj = this;
	
	//화면이 렌더링된 후 onInitDone 이 호출되도록 
	setTimeout(function()
	{
		if(!thisObj.isValid()) return;
	
		//thisObj.onInitDone();

		if(!skipUpdatePos) 
        {
            thisObj.onContextAvailable();
            thisObj.updatePosition();
        }

        thisObj.onInitDone();

		if(!skipActiveDone) 
		{
			thisObj.onActiveDone(true);

			var tabview = thisObj.owner;

			//동적 로드 옵션인 경우는 없을 수도 있다.
			if(window['ATabView'] && tabview instanceof ATabView)
			{
				if(tabview.delegator && tabview.delegator.afterTabChanged) 
				{
					var oldView = tabview.oldTab ? tabview.oldTab.content.view : null;
					tabview.delegator.afterTabChanged(oldView, thisObj, true, tabview);
				}
			}
		}
	
	}, 0);
	
};


AView.prototype.getUrl = function() 
{
	return this.url;
};

AView.prototype._callSubActiveEvent = function(funcName, isFirst) 
{
	//최초 onActiveDone 은 initDoneManage 에서 호출해 주므로 스킵한다.
	if(funcName=='onActiveDone' && isFirst) return;

	if(this.ldView)
	{
		this.ldView[funcName].call(this.ldView, isFirst);
	}
	
	else if(this.ldCntr)
	{
		this.ldCntr[funcName].call(this.ldCntr, isFirst);
	}
	
	else
	{
		this.$ele.children().each(function()
		{
			if(!this.acomp) return;
			
			//서브 아이템으로 뷰를 가지고 있는 컴포넌트들(ATabView, ASplitView, AFlexView)은 
			//_callSubActiveEvent 란 함수를 가지고 있다.	AListView는 필요시 동적으로 함수를 만든다.
			if(this.acomp._callSubActiveEvent) this.acomp._callSubActiveEvent(funcName, isFirst);
		});
	}
	
};

AView.prototype.enableActiveFocus = function(enable) 
{
	this.isActiveFocus = enable;
};


AView.prototype.onInitDone = function() 
{

};


//필요한 곳에서 재구현해서 사용한다.
//_callSubActiveEvent 함수 호출하면 서브 컴포넌트에 전달해 준다.

//뷰가 활성화되기 바로 전에 호출된다.
AView.prototype.onWillActive = function(isFirst) 
{
	if(this.isActiveFocus) AComponent.setFocusComp(this);
	
	var cntr = this.getContainer();
	if(cntr && cntr.isActiveRecursive) this._callSubActiveEvent('onWillActive', isFirst);
};

//뷰의 활성화가 시작되면 호출된다.
AView.prototype.onActive = function(isFirst) 
{
	var cntr = this.getContainer();
	if(cntr && cntr.isActiveRecursive) this._callSubActiveEvent('onActive', isFirst);
};

//뷰의 활성화가 완료되면 호출된다.
AView.prototype.onActiveDone = function(isFirst) 
{
	var cntr = this.getContainer();
	if(cntr && cntr.isActiveRecursive) this._callSubActiveEvent('onActiveDone', isFirst);
	
	//IOS 웹 브라우저에서 스크롤이 안되는 버그 수정
	if(!AContainer.disableIosScroll && afc.isIos && !afc.isHybrid) afc.refreshApp(this.$ele);
	
	//뷰가 활성화 될 때 화면을 다시 한번 그려준다.
	//브라우저의 여러 경우에 따라 화면 렌더링의 버그가 있을 경우 옵션을 설정해 준다.
	//else if(this.option.isActiveRerender) afc.refreshApp();
};

AView.prototype.onWillDeactive = function() 
{
	var cntr = this.getContainer();
	if(cntr && cntr.isActiveRecursive) this._callSubActiveEvent('onWillDeactive');
};

AView.prototype.onDeactive = function() 
{
	var cntr = this.getContainer();
	if(cntr && cntr.isActiveRecursive) this._callSubActiveEvent('onDeactive');
};

AView.prototype.onDeactiveDone = function() 
{

	var cntr = this.getContainer();
	if(cntr && cntr.isActiveRecursive) this._callSubActiveEvent('onDeactiveDone');
};


//--------------------------------------------------------

/*
AView.prototype.reuse = function()
{
	AComponent.prototype.reuse.call(this);
	
	var container = this.getContainer();
	
	this.$ele.children().each(function()
	{
		if(this.acomp) 
		{
			this.container = container;
			//루트뷰는 변경되지 않는다.
			//this.rootView = rootView;
			this.acomp.reuse();
		}
	});
};
*/

AView.prototype.setScrollArrowX = function()
{
	var sa = new ScrollArrow();
	sa.setArrow('horizontal');
	sa.apply(this.element);
};

AView.prototype.setScrollArrowY = function()
{
	var sa = new ScrollArrow();
	sa.setArrow('vertical');
	sa.apply(this.element);
};


AView.prototype._enableScrollIndicatorX = function()
{
	this.scrlIndicatorX = new ScrollIndicator();
	this.scrlIndicatorX.init('horizontal', this.element);
	
	var thisObj = this;
	
	//scrollIndicator 는 상위 element 에 추가된다.
	//view 는 scrollArea 가 없기 때문에 스크롤바의 위치를 보정해야 함.
	this.scrlIndicatorX.resetScrollPos(function()
	{
		if(!thisObj.isValid()) return;
		var value = thisObj.getPos().left;
		
		this.setStyle({left: value+'px'});
		this.setScrollOffset(value);
	});	
};

AView.prototype._enableScrollIndicatorY = function()
{
	this.scrlIndicatorY = new ScrollIndicator();
	this.scrlIndicatorY.init('vertical', this.element);
	
	var thisObj = this;
	
	this.scrlIndicatorY.resetScrollPos(function()
	{
		if(!thisObj.isValid()) return;
		var value = thisObj.getPos().top;
		
		this.setStyle({top: value+'px'});
		this.setScrollOffset(value);
	});	
};

AView.prototype.enableScrlManagerX = function()
{
	if(this.scrlManagerX) return this.scrlManagerX;
	
	this.scrlManagerX = new ScrollManager();
	
	//animationFrame 이 지원되지 않는 경우만 작동되는 옵션
	this.scrlManagerX.setOption(
	{
		startDelay: 10,
		endDelay: 20,
		scrollAmount: 10,
		speedRatio: 0.03
	});
	
	this.$ele.css({'overflow':'auto', '-webkit-overflow-scrolling': ''});
	
	this._scrollXImplement();
	this.aevent._scroll();
	
	return this.scrlManagerX;
};

AView.prototype.enableScrlX = function()
{
	this.scrlManagerX.enableScroll(true);
};

AView.prototype.disableScrlX = function()
{
	this.scrlManagerX.enableScroll(false);
};

AView.prototype.enableScrlManagerY = function()
{
	if(this.scrlManagerY) return this.scrlManagerY;
	
	this.scrlManagerY = new ScrollManager();
	this.$ele.css({'overflow':'auto', '-webkit-overflow-scrolling': ''});
	
	this._scrollYImplement();
	this.aevent._scroll();
	
	return this.scrlManagerY;
};

AView.prototype.setScrollXComp = function(acomp)
{
	this.scrollXComp = acomp;
};

AView.prototype._scrollXImplement = function()
{
	var aview = this;
	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다.
	var isDown = false;
	
	this.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		isDown = true;
		
		//e.preventDefault();
		
		aview.scrlManagerX.initScroll(e.changedTouches[0].clientX);
	});
	
	this.bindEvent(AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown) return;
		
		e.preventDefault();
		
		var scrlArea = this;
		aview.scrlManagerX.updateScroll(e.changedTouches[0].clientX, function(move)
		{
			scrlArea.scrollLeft += move;
			if(aview.scrollXComp) aview.scrollXComp.element.scrollLeft += move;
		});
	});
	
	this.bindEvent(AEvent.ACTION_UP, function(e)
	{
		if(!isDown) return;
		isDown = false;
		
		//e.preventDefault();
		
		var scrlArea = this;
		aview.scrlManagerX.scrollCheck(e.changedTouches[0].clientX, function(move)
		{
			scrlArea.scrollLeft += move;
			if(aview.scrollXComp) aview.scrollXComp.element.scrollLeft += move;
			
			return true;
		});
	});
};

AView.prototype._scrollYImplement = function()
{
	var aview = this;
	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다.
	var isDown = false;
	
	this.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		isDown = true;
		
		//e.preventDefault();
		
		aview.scrlManagerY.initScroll(e.changedTouches[0].clientY);
	});
	
	this.bindEvent(AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown) return;
		
		e.preventDefault();
		
		var scrlArea = this;
		aview.scrlManagerY.updateScroll(e.changedTouches[0].clientY, function(move)
		{
			scrlArea.scrollTop += move;
		});
	});
	
	this.bindEvent(AEvent.ACTION_UP, function(e)
	{
		if(!isDown) return;
		isDown = false;
		
		//e.preventDefault();
		
		var scrlArea = this;
		aview.scrlManagerY.scrollCheck(e.changedTouches[0].clientY, function(move)
		{
			scrlArea.scrollTop += move;
			return true;
		});
	});
};


AView.prototype._scrollTopManage = function()
{
	if(this.scrlManagerY) this.scrlManagerY.stopScrollTimer();
	
	return true;
};

AView.prototype._scrollBottomManage = function()
{
	if(this.scrlManagerY) this.scrlManagerY.stopScrollTimer();

	return true;
};

AView.prototype._scrollLeftManage = function()
{
	if(this.scrlManagerX) this.scrlManagerX.stopScrollTimer();
	
	return true;
};

AView.prototype._scrollRightManage = function()
{
	if(this.scrlManagerX) this.scrlManagerX.stopScrollTimer();
	
	return true;
};

AView.prototype._realizeChildren = function(evtListener, reInitComp)
{
	var thisObj = this, acomp,
		container = this.getContainer(), rootView = this.getRootView();
	
	if(reInitComp)
	{
		this.$ele.children().each(function()
		{
			if(this.acomp) this.acomp.init(this.acomp.element, evtListener);
			
			//뷰를 감싸고 있는 item 인 경우
			else
			{
				acomp = $(this).children()[0].acomp;
				acomp.init(acomp.element);
			}
		});
	}
	else
	{
		this.$ele.children().each(function()
		{
			acomp = AComponent.realizeContext(this, container, rootView, thisObj, evtListener);
			if(acomp)
			{
				if(acomp.baseName != 'AView' && container && container.tabKey) container.tabKey.addCompMap(acomp, rootView.owner);
			}
			//뷰를 감싸고 있는 item 인 경우
			else
			{
				//동적으로 로드한 뷰에 대한 realize 를 시작한다.
				acomp = AComponent.realizeContext($(this).children()[0], container);

				acomp.owner = thisObj;
				acomp._item = this;		//뷰를 감싸고 있는 dom element 값을 item 이란 변수로 저장
				this.view = acomp;		//item 은 view 란 변수로 AView 객체를 저장
			}
		});
		
		if(container && container.tabKey && rootView.owner) container.tabKey.saveOwnerMap(rootView.owner);
		
	}
	
};

AView.prototype._applyLoadedQuery = function()
{
	AComponent.prototype._applyLoadedQuery.call(this);
	
	this.eachChild(function(acomp, inx)
	{
		acomp._applyLoadedQuery();
	});
};

AView.prototype._changeCompIdPrefix = function(newPrefix) 
{
	//compIdPrefix 값은 rootView 만 가지고 있다.
	if(newPrefix) this.compIdPrefix = newPrefix;
	
	var compId;
	
	this.eachChild(function(acomp, inx)
	{
		compId = acomp.getComponentId();
		
		//componentId 가 존재하면 새로운 compIdPrefix 가 적용되도록 다시 호출해 준다.
		if(compId) acomp.setComponentId(compId);
		
		//자신이 포함하고 있는 하위의 컴포넌트들도 바꿔주기 위해, AView, ALayout
		if(acomp._changeCompIdPrefix) acomp._changeCompIdPrefix();
	});
};

// 개발중에 하위 컴포넌트를 선택하지 못하는 경우 직접 하위 컴포넌트의 이벤트를 등록하여 전달해준다.
AView.prototype.loadChildEventInfo = function(evtListener)
{
	//setTimeout 을 사용해야만 해당 컴포넌트의 super init 이후의 코드도 호출되므로
	//이벤트 등록시점에 super init 이후의 코드상에서 저장한 멤버변수 등에 접근하여 사용이 가능하다.
	//setTimeout(() => {
		if(!this.aevent) return;
		const flag = window[this.baseName].CONTEXT.flag || this.getAttr('data-flag');
		if(!flag || flag.charCodeAt(1)!=0x31) return;
		//if(!flag || Number(flag.charAt(1)) != 1) return;

		if(evtListener)
		{
			var evtInfo, events = afc.getChildEventList(this.baseName);

			for(var i=0; i<events.length; i++)
			{
				evtInfo = this.getAttr(afc.ATTR_LISTENER+'-'+events[i]);
				if(evtInfo)
				{
					evtInfo = evtInfo.split(':');
					this.addEventListener(events[i], evtListener, $.trim(evtInfo[1]));
				}
			}
		}
	//});
};

/*
AView.prototype._realizeChildren = function(evtListener)
{
	var thisObj = this, container = this.getContainer(), rootView = this.getRootView();
	
	_realize_helper(this.$ele.children(), evtListener, null);
	
	//--------------------------------------------------------------------
	
	function _realize_helper($children, listener, item)
	{
		var acomp, className, classFunc;
		
		$children.each(function()
		{
			className = this.getAttribute(afc.ATTR_CLASS);

			//item
			if(!className) 
			{
				//동적으로 로드한 뷰에 대한 realize 를 시작한다.
				_realize_helper($(this).children(), null, this);
				return;
			}

			classFunc = window[className];
			if(!classFunc) 
			{
				alert(afc.log('We can not find the class of ' + className ));
				return;
			}

			acomp = new classFunc();
			this.container = container;

			//item 이 참이면 동적 로드뷰 이므로 parent 가 없다. 즉, 자신이 rootView 이다.
			if(item)
			{
				//this.owner = thisObj;
				acomp._item = item;		//뷰를 감싸고 있는 dom element 값을 item 이란 변수로 저장
				item.view = acomp;		//item 은 view 란 변수로 AView 객체를 저장
				
				this.rootView = acomp;
				//listener = acomp;		//init 시점에 listener 가 null 이면 자동으로 rootView 가 리스너가 된다.
			}
			else 
			{
				//parent 변수만 셋팅해야 하므로 setParent 함수를 호출하지 않는다.
				//acomp.setParent(thisObj);
			
				acomp.parent = thisObj;
				this.rootView = rootView;
			}

			acomp.init(this, listener);
		});
	}
};
*/

AView.prototype.setParent = function(parent)
{
	AComponent.prototype.setParent.call(this, parent);
	
	var children = this.getChildren();
	
	for(var i=0; i<children.length; i++)
	{
		// 자식들의 부모까지 바뀐 것은 아니므로 parent 를 넘겨선 안됨.
		// 그대신 자신을 넘기면서 새로운 값으로 변경된 this 의 값들을 자식들에게 셋팅해 준다.
		children[i].setParent(this);
	}
};

AView.prototype.setHtml = function(html)
{
	$(this.element).html(html);
};

AView.prototype.findCompById = function(strId)
{
	//var ele = document.getElementById(this.getRootView().compIdPrefix+strId);
	var ele = this.$ele.find('#'+this.getRootView().compIdPrefix+strId)[0];
	
	if(ele) return ele.acomp;
	else return null;
};

//return : Array
AView.prototype.findCompByGroup = function(strGroup)
{
	var ret = [];
	$(this.element).find('*[data-group="'+strGroup+'"]').each(function()
	{
		if(this.acomp) 
			ret.push(this.acomp);
	});
	
	return ret;
};

//return : Array
AView.prototype.findCompByClass = function(className)
{
	var ret = [];
	$(this.element).find('*['+afc.ATTR_CLASS+'="'+className+'"]').each(function()
	{
		if(this.acomp) 
			ret.push(this.acomp);
	});
	
	return ret;
};

//return : Array
AView.prototype.findCompByBase = function(baseName)
{
	var ret = [];
	$(this.element).find('*['+afc.ATTR_BASE+'="'+baseName+'"]').each(function()
	{
		if(this.acomp) 
			ret.push(this.acomp);
	});
	
	return ret;
};

AView.prototype.findCompByText = function(text)
{
	return AView._findTextContains(this, text, true);
};

AView.prototype.findCompByName = function(name)
{
	var ret = [];
	this.$ele.find('*[name="'+name+'"]').each(function()
	{
		if(this.acomp) 
			ret.push(this.acomp);
	});
	
	return ret;
};

AView.prototype.addComponent = function(acomp, isPrepend, posComp)
{
	if(!acomp.element) 
	{
		alert('First of all, you must call function init();');
		return;
	}
	
	if(posComp)
	{
		if(isPrepend) acomp.$ele.insertBefore(posComp.element);
		else acomp.$ele.insertAfter(posComp.element);
	}
	else
	{
		if(isPrepend) this.$ele.prepend(acomp.element);
		else this.$ele.append(acomp.element);
	}
	
	//1.0에 있던 사라진 기능
	//var arrange = this.$ele.attr('data-arrange');
	//if(arrange) acomp.$ele.css({'position':'relative', left:'0px', top:'0px', 'float':arrange});
	
	acomp.setParent(this);
};

AView.prototype.removeComponent = function(acomp)
{
	acomp.removeFromView();
};

AView.prototype.getFirstChild = function()
{
	var ele = this.$ele.children()[0];
	if(ele) return ele.acomp;
	else return null;
};

AView.prototype.getLastChild = function()
{
	var ele = this.$ele.children().last()[0];
	if(ele) return ele.acomp;
	else return null;
};

AView.prototype.getChild = function(index)
{
	var ele = this.$ele.children()[index];
	if(ele) return ele.acomp;
	else return null;
};

AView.prototype.getChildCount = function()
{
	return this.$ele.children().length;
};

AView.prototype.eachChild = function(callback, isReverse)
{
	var $children;
	
	if(isReverse) $children = $(this.$ele.children().get().reverse());
	else $children = this.$ele.children();

	$children.each(function(inx)
	{
		if(!this.acomp) return;
		
		if(callback(this.acomp, inx)==false) return false;
	});
};

AView.prototype.getChildren = function()
{
	var ret = [];
	this.$ele.children().each(function()
	{
		if(this.acomp) 
			ret.push(this.acomp);
	});
	
	return ret;
};

AView.prototype.removeChildren = function(onlyRelease)
{
	this.$ele.children().each(function()
	{
		if(this.acomp) 
			this.acomp.removeFromView(onlyRelease);
	});
};

AView.prototype.removeFromView = function(onlyRelease)
{
	this.removeChildren(onlyRelease);
	
	this.removeLoadView();
	
	this.removeLoadContainer();

    //hot reload 기능
    if(theApp.isHotReload() && this.url) theApp.unWatchFile(this);
	
	AComponent.prototype.removeFromView.call(this, onlyRelease);
};

AView.prototype.setWidth = function(w)
{
	AComponent.prototype.setWidth.call(this, w);
	
	this.updatePosition();
};

AView.prototype.setHeight = function(h)
{
	AComponent.prototype.setHeight.call(this, h);
	
	this.updatePosition();
};

AView.prototype.updatePosition = function(pWidth, pHeight)
{
	//AView 클래스만 다음 비교를 한다.
	if(pWidth!=undefined) 
		AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
	
	if(this.ldView)
	{
		this.ldView.updatePosition();
	}
	
	else if(this.ldCntr)
	{
		this.ldCntr.onResize();
	}
	
	else
	{
		var width = this.$ele.width();
		var height = this.$ele.height();

		this.$ele.children().each(function()
		{
			if(this.acomp)
				this.acomp.updatePosition(width, height);
		});

		if(this.onUpdatePosition) this.onUpdatePosition(width, height);
	}
};

//툴바의 inline 기능을 추가
AView.prototype.inlineChildren = function()
{
	var children = this.getChildren();
	
	for(var i=0; i<children.length; i++)
		children[i].setInlineStyle();
};


/*
//스크롤이 있을경우 스크롤을 가운데로 셋팅
AView.prototype.scrollToCenter = function(tHeight)
{
	var tremHeight = 0;
	if(tHeight) tremHeight = tHeight;
	this.element.scrollTop = ((this.element.scrollHeight + tremHeight) - this.element.offsetHeight)/2;
};
*/

AView.prototype.scrollTo = function(pos)
{
	this.element.scrollTop = pos;
};

AView.prototype.scrollOffset = function(offset)
{
	this.element.scrollTop += offset;
};

AView.prototype.scrollToTop = function()
{
	this.element.scrollTop = this.element.scrollHeight*-1;
};

AView.prototype.scrollToBottom = function()
{
	this.element.scrollTop = this.element.scrollHeight;
};

AView.prototype.scrollToCenter = function()
{
	this.element.scrollTop = (this.element.scrollHeight - this.element.offsetHeight)/2;
};

AView.prototype.isMoreScrollTop = function()
{
	if(this.element.scrollTop > 0) return true;
	else return false;	
};

AView.prototype.isMoreScrollBottom = function()
{
	if(this.element.offsetHeight + this.element.scrollTop < this.element.scrollHeight) return true;
	else return false;	
};

AView.prototype.isMoreScrollLeft = function()
{
	if(this.element.scrollLeft > 0) return true;
	else return false;	
};

AView.prototype.isMoreScrollRight = function()
{
	if(this.element.offsetWidth + this.element.scrollLeft < this.element.scrollWidth) return true;
	else return false;
};

AView.prototype.isHscroll = function()
{
	return (this.element.offsetWidth < this.element.scrollWidth);
};

AView.prototype.isVscroll = function()
{
    return (this.element.offsetHeight < this.element.scrollHeight);
};

AView.prototype.isScroll = function()
{
	return (this.isHscroll() || this.isVscroll());
};

/*
enable 은 원래가 자신만 하면 되는데..
버그 때문에 하위까지 하게 된 것.... 그러므로...
하위까지 해야 하는 경우를 enable 함수의 파람으로 구별해서 처리하게 한다.
하위까지 해야 하는 경우는...
disable 시점에 기존의 정보를 저장해 두었다가 enable 시점에 확인하여 
기존의 값으로 복원...
하위까지 변경하는 경우 disable 없이 enable 만 호출하면 모두 풀리게 되는 것이 정상
*/
AView.prototype.enable = function(isEnable)
{
	AComponent.prototype.enable.call(this, isEnable);

	//input, textarea tag 도 같이 해줘야 이벤트 전달시 키보드 오픈을 막을 수 있다.
    this.enableChildren(isEnable);
};

AView.prototype.enableChildren = function(isEnable)
{
	//input, textarea tag 도 같이 해줘야 이벤트 전달시 키보드 오픈을 막을 수 있다.
	_enable_helper(this.element.getElementsByTagName('input'))
	_enable_helper(this.element.getElementsByTagName('textarea'))
	_enable_helper(this.element.getElementsByClassName('.RGrid-Style'))
	_enable_helper(this.element.getElementsByTagName('button')) //button 도 전달되므로 추가
	
    //@param {HTMLCollection} forms `요소의 문서 내 순서대로 정렬된 일반 컬렉션`
	function _enable_helper(forms)
	{
        if(isEnable)
        {
            // 엘리먼트이거나 컴포넌트인데 이전에 isEnable true 였던 경우 auto 처리
            // **엘리먼트인 경우에도 이전에 isEnable false 였다면 문제가 될수도 있을듯함
            Array.prototype.forEach.call(forms, function(ele) {
                if(!ele.acomp || (ele.acomp && ele.acomp.isEnable))
                    ele.style.setProperty('pointer-events', 'auto')
            })
        }
        else
        {
            Array.prototype.forEach.call(forms, function(ele)
            {
                ele.style.setProperty('pointer-events', 'none')
            })
        }
	}
};

AView.prototype.show = function()
{
	if(this.isShow()) return;
	
	this.onWillActive(false);
	
	AComponent.prototype.show.call(this);
	
	this.onActive(false);

	var thisObj = this;
	setTimeout(function() 
	{
		thisObj.onActiveDone(false);
	}, 0);
};

AView.prototype.hide = function()
{
	if(!this.isShow()) return;
	
	this.onWillDeactive();

	AComponent.prototype.hide.call(this);

	this.onDeactive();
	
	var thisObj = this;
	setTimeout(function() 
	{
		if(thisObj.isValid()) thisObj.onDeactiveDone();
	}, 0);
};

AView.prototype.shrinkChildren = function(ratio)
{
	var children = this.getChildren(), acomp, newTop, newHeight, newFontSize, unit;
	
	for(var i=0; i<children.length; i++)
	{
		acomp = children[i];
		
		//afc.log('[' + acomp.$ele.css('bottom') + ']');
		
		//newTop = acomp.getPos().top * ratio;
		//newHeight  = acomp.getHeight() * ratio;
		
		newTop = acomp.getPos().top;
		newHeight  = acomp.getHeight();
		newFontSize = acomp.$ele.css('font-size');
		
		unit = newFontSize.substring(newFontSize.length-2);
		newFontSize = Number(newFontSize.substring(0, newFontSize.length-2));
		
		//afc.log('[' + unit + ']');

		newTop = parseInt(newTop * ratio, 10);
		newHeight = parseInt(newHeight * ratio, 10);
		newFontSize = parseInt(newFontSize * ratio, 10);

		if(acomp.$ele.css('bottom')!='auto') 
		{
			acomp.$ele.css(
			{
				'height': newHeight+'px'
			});
			
			acomp.element.style.setProperty('font-size', newFontSize+unit, 'important');
		}
		else
		{
			acomp.$ele.css(
			{
				'top': newTop+'px',
				'height': newHeight+'px'
			});
			
			acomp.element.style.setProperty('font-size', newFontSize+unit, 'important');
		}
		
		//afc.log('[' + newFontSize+unit + ']');
		
		if(acomp.baseName=='AView') acomp.shrinkChildren(ratio);
	}

};

//컴포넌트에 데이터를 세팅하는 함수
AView.prototype.setData = function(data)
{
	if(Object.prototype.toString.call(data) == '[object Array]')
	{
		var children = this.getChildren();
		var len = Math.min(children.length, data.length);
		for(var i=0; i<len; i++)
		{
			if(data[i] != undefined) children[i].setData(data[i]);
		}
	}
	else if(Object.prototype.toString.call(data) == '[object Object]')
	{
		for(var key in data)
		{
			this.findCompByName(key).forEach(function(comp)
			{
				if(data[key] != undefined) comp.setData(data[key]);
			});
		}
		/*this.eachChild(function(comp)
		{
			compName = comp.getName();
			if(data[compName]) comp.setData(data[compName]);
		});*/
	}
};

//컴포넌트의 데이터를 얻어오는 함수
//isRecursive : 내부적으로 호출했는지 여부
AView.prototype.getData = function()
{
	if(this.option.getDataAsArray)
	{
		var arr = [];
		this.eachChild(function(comp)
		{
			if(comp instanceof AView || comp instanceof ALayout) arr.push(comp.getData());
			else arr.push(comp.getData());
		});

		return arr;
	}
	else
	{
		var obj = {};
		var finder = this.$ele.find('[name][name!=""]');
		if(finder.length > 0)
		{
			var comp;
			finder.each(function(idx, ele)
			{
				comp = ele.acomp;
				if(comp && !obj[comp.getName()]) obj[comp.getName()] = comp.getData();
			});
		}
		return obj;
	}
	
};

AView.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	var keyVal, children = this.getChildren(), child;
	for(var i=0; i<children.length; i++)
	{
		child = children[i];
		
		keyVal = keyArr[i];
		if(keyVal) child.getQueryData(dataArr, [keyVal], queryData);
	}
};

AView.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
    if(!keyArr) return;

	let children = this.getChildren(), child, i, cnt
	for(i=0; i<children.length; i++)
	{
		child = children[i];
		
		//하위 컴포넌트가 그리드인 경우 데이터가 변경되므로 매번 처음 인덱스값으로 변경
		//dataArr 가 없는 경우도 있으므로 예외처리한다.
		if(dataArr) ADataMask.setQueryData(dataArr[0], keyArr, queryData);
		
		//AView 에서만 사용함
		//매핑 타입이 child mapping 이면 자식 컴포넌트 자체에 셋팅된 필드키를 적용한다.
		if(child.mappingType==3) child.updateChildMappingComp(dataArr, queryData);
		else 
		{
            cnt = child.getMappingCount()
            child.setQueryData(dataArr, keyArr.slice(i, i+cnt), queryData);
		}
	}
	
};

AView.prototype.getDocument = function() 
{
	return this.document;
};

AView.prototype.bindDocument = function(doc) 
{
	this.document = doc;
	
	doc.setView(this);
};

AView.prototype.setLoadView = function(view)
{
	this.ldView = view;
	
	AView.setViewInItem(view, this.element, this);
};
 
AView.prototype.loadView = async function(url)//, asyncCallback, turnback)
{
	//기존에 존재하던 로드뷰가 있으면 제거
	this.removeLoadView();

    var $item = $('<div></div>');
    $item.css(
    {
        width: '100%', height: '100%', overflow: 'auto'
    });
	
    this.$ele.html($item);
	
	//this.ldView = await AView.createView($item[0], url, this);
    this.ldProm = AView.createView($item[0], url, this);
    this.ldView = await this.ldProm;

    //여기에 하면 안됨... createView 에서 로드되는 태그들은 실제 활성화된 돔에 추가되어야 한다. 
	//this.$ele.html($item);
	
	return this.ldView;
};

AView.prototype.loadContainer = async function(viewUrl, cntrId, data, cntrClass)
{
	//기존에 존재하던 로드컨테이너가 있으면 제거
	this.removeLoadContainer();

	if(cntrClass==undefined) cntrClass = 'APanel';
	
	var acont = new window[cntrClass](cntrId);
	
	this.ldCntr = acont;

	acont.init();
		
	this.$ele.html(acont.$ele);
	
	//새로운 값으로 변경
	acont._item = this.element;
	this.element.acont = acont;
	acont.parent = this.getContainer();
	acont.owner = this;
	
	acont.$ele.css({ left:'0px', top:'0px', width:'100%', height:'100%' });
	
	acont.setData(data);
	
	if(viewUrl) 
	{
		await acont.setView(viewUrl);
	}

	acont.onCreate();
	
	return acont;
};

AView.prototype.getLoadCntr = function()
{
	return this.ldCntr;
};


AView.prototype.getLoadView = function()
{
	return this.ldView;
};

AView.prototype.awaitLoadView = function()
{
	return this.ldProm;
};

AView.prototype.removeLoadView = function()
{
	if(this.ldView)
	{
		this.ldView.removeFromView();
		this.ldView = null;
        this.ldProm = null;
	}
};

AView.prototype.removeLoadContainer = function()
{
	if(this.ldCntr)
	{
		this.ldCntr.close();
		this.ldCntr = null;
	}
};

// 매핑가능한 개수를 리턴한다.
AView.prototype.getMappingCount = function()
{
	//return this.getChildren().length;

    let tot = 0

	this.getChildren().forEach((child)=>{
		tot += child.getMappingCount()
	})

	return tot    
};

// 컴포넌트 내부에 드랍 가능여부 리턴
AView.prototype.getDroppable = function()
{
	//return true;
	//_childSelect 가 세팅되어있지 않거나 0인 경우에만 드랍가능
	return !this._childSelect;
};

AView.prototype.getItem = function()
{
	return this._item;
};


//탭뷰에 로드되어진 경우 선택시 넘겨준 데이터를 얻어온다.
AView.prototype.getTabData = function()
{
	if(this._item.tab) return this._item.tab.data;
	else return null;
};

AView.prototype.setTabData = function(data)
{
	if(this._item.tab) this._item.tab.data = data;
};


AView.prototype.getItemData = function()
{
	if(this._item) return this._item.itemData;
	else return null;
};

AView.prototype.setItemData = function(data)
{
	if(this._item) this._item.itemData = data;
};


AView.prototype.getCntrData = function()
{
	var cntr = this.getContainer();
	
	if(cntr) return cntr.getData();
	else return null;
};

AView.prototype.setCntrData = function(data)
{
	var cntr = this.getContainer();
	if(cntr) cntr.setData(data);
};

AView.prototype.getOwnerData = function()
{
    if(window['ATabView'] && this.owner instanceof ATabView) return this.getTabData()
    else if(window['AListView'] && this.owner instanceof AListView) return this.getItemData()
    else return this.getCntrData()
};

AView.prototype.reset = function()
{
	this.eachChild(function(acomp)
	{
		if(acomp.reset) acomp.reset();
	});
};



/**
 * @author asoocool
 */

class AFloat
{
	constructor()
	{
		this.$frame = null;
		this.$bg = null;

		this.isBgCheck = true;
		this.isFocusLostClose = true;

		this.zIndex = 9999;
		this.closeCallback = null;
	
	}

}

window.AFloat = AFloat

AFloat.prototype.init = function()
{
	this.$frame = $('<div></div>');
};


AFloat.prototype.append = function(ele)
{
	this.$frame.append(ele);
};


/*
AFloat.prototype.popup = function(left, top, width, height)
{
	//window position size
	if(!isNaN(left)) left += 'px';
	if(!isNaN(top)) top += 'px';
	if(!isNaN(width)) width += 'px';
	if(!isNaN(height)) height += 'px';
	
	this.$frame.css( { 'position':'fixed', 'left':left, 'top':top, 'z-index':this.zIndex });
	if(width) this.$frame.css('width', width);
	if(height) this.$frame.css('height', height);
	
	if(this.isBgCheck) this._checkBg();
	
	$('body').append(this.$frame);
};
*/

AFloat.prototype.popup = function(left, top, width, height, closeCallback, cntr)
{
	//window position size
	if(!isNaN(left)) left += 'px';
	if(!isNaN(top)) top += 'px';
	if(!isNaN(width)) width += 'px';
	if(!isNaN(height)) height += 'px';
	
	this.popupEx({ 'left': left, 'top': top, 'width': width, 'height': height }, closeCallback, cntr);
};

AFloat.prototype.popupEx = function(info, closeCallback, cntr)
{
	if(!cntr) 
	{
		//현재 활성화된 브라우저의 body 에 Element 를 추가하기 위해
		cntr = AApplication.getFocusedApp()?.getRootContainer();
		if(!cntr) return
	}
	
	info['position'] = 'fixed';
	info['z-index'] = this.zIndex;
	info['pointer-events'] = 'auto';
	//this.$frame.css( { 'position':'fixed', 'z-index':this.zIndex });
	this.$frame.css( info );
	
	this.closeCallback = closeCallback;
	
	if(this.isBgCheck) this._checkBg(cntr);
	
	//$('body').append(this.$frame);
	cntr.$ele.append(this.$frame);
};

/*
AFloat.prototype.moveToCenter = function()
{
    //var cenX = theApp.rootContainer.getWidth()/2 - this.getWidth()/2;
    //var cenY = theApp.rootContainer.getHeight()/2 - this.getHeight()/2;
	
	var cenX, cenY;
	
	if(this.option.inParent)
	{
    	cenX = this.parent.$ele.width()/2 - this.getWidth()/2;
    	cenY = this.parent.$ele.height()/2 - this.getHeight()/2;
	}
	else
	{
    	cenX = $(window).width()/2 - this.getWidth()/2;
    	cenY = $(window).height()/2 - this.getHeight()/2;
	}
    
    this.move(cenX, cenY);
};
*/


AFloat.prototype.close = function(result)
{
	if(this.$frame)
	{
    	this.$frame.remove();
    	this.$frame = null;
    }
    
    if(this.$bg)
    {
		this.$bg.remove();
		this.$bg = null;
	}
	
	if(this.closeCallback) this.closeCallback(result);
};


AFloat.prototype.enableBgCheck = function(enable)
{
	this.isBgCheck = enable;
};

AFloat.prototype._checkBg = function(cntr)
{
	if(this.$bg) return;
	
	this.$bg = $('<div></div>');
	this.$bg.css(
	{
		'width':'100%', 'height':'100%',
		'position':'fixed',
		'top':'0px', 'left':'0px',
		'z-index': (this.zIndex-1),
		'pointer-events': 'auto'
	});
	
	//$('body').append(this.$bg);
	cntr.$ele.append(this.$bg);
	
	if(this.isFocusLostClose)
	{
		var thisObj = this;
		AEvent.bindEvent(this.$bg[0], AEvent.ACTION_DOWN, function(e)
		{
			e.preventDefault();
			e.stopPropagation();

			thisObj.close();
		});
	}
	
	/*
	this.$bg.mousemove(function(e)
	{
		e.preventDefault();
		e.stopPropagation();
		
		return false;
	});
	*/
	
};


/**
 * @author bks
 * @working date 2017-08-18
 */
 
class AToast extends AFloat
{
	constructor()
	{
		super()
	
		this.isBgCheck = false;
		this.curSpan = null;

		this.divCss = {
			'position': 'absolute',
			'width': '100%',
			'bottom': '100px',
			'text-align': 'center',
			'z-index': '2147483647'
		};

		this.spanCss = [
			'background-color:rgba(32, 32, 32, 0.7)',
			'border-radius:6px',
			'color:#fff',
			'padding:20px',
			'margin:20px',
			'box-shadow:3px 3px 8px #222222',
			'font-size:20px',
			'white-space:pre-line',
			'display:inline-block',
			'word-break:break-all'
		];
	}

	
	
}

window.AToast = AToast

AToast.globalToast = null;
AToast.single = function(){
	AToast.globalToast = new AToast();
};

AToast.show = function(text, duration)
{
	var toast;
	if(AToast.globalToast) toast = AToast.globalToast;
	else toast = new AToast();
	toast.show(text, duration);
};

AToast.callback = function(text, callback, duration)
{
	var toast;
	if(AToast.globalToast) toast = AToast.globalToast;
	else toast = new AToast();
	toast.callback(text, callback, duration);
};


AToast.prototype.init = function()
{
	AFloat.prototype.init.call(this);
	
};

AToast.prototype._createSpan = function(text)
{
	this.curSpan =  document.createElement('span');
	this.curSpan.style.cssText = this.spanCss.join(";");
	this.curSpan.innerHTML = text;
};

AToast.prototype.show = function(text, duration)
{
	if(this.curSpan) this.curSpan.innerHTML = text;
	else
	{
		var thisObj = this;
		if(!duration) duration = 2;	
		
		this.init();	//Toast div 생성
		
		this._createSpan(text);	//Toast Span 생성

		AFloat.prototype.append.call(this, this.curSpan);	//Toast 객체 삽입
		//this.$frame.addClass('show-toast' + duration);

		//Toast DIV css 정보 추가
		AFloat.prototype.popupEx.call(this, this.divCss, null);
		
		setTimeout(function(){
			thisObj.curSpan = null;
			AFloat.prototype.close.call(thisObj);
		}, duration*1000);

	}
};

/*
AToast.prototype.close = function()
{
	AFloat.prototype.close.call(this);

};
*/

AToast.prototype.callback = function(text, callback, duration)
{
	callback({"proc": "start"});
	
	if(this.curSpan) this.curSpan.innerHTML = text;
	else
	{
		var thisObj = this;
		if(!duration) duration = 2;	
		
		this.init();	//Toast div 생성
		
		this._createSpan(text);	//Toast Span 생성

		AFloat.prototype.append.call(this, this.curSpan);	//Toast 객체 삽입
		//this.$frame.addClass('show-toast' + duration);

		//Toast DIV css 정보 추가
		AFloat.prototype.popupEx.call(this, this.divCss, null);
		
		setTimeout(function(){
			thisObj.curSpan = null;
			AFloat.prototype.close.call(thisObj);
			
			callback({"proc": "end"});
		}, duration*1000);

	}
};



/**
 * @author bks
 * @working date 2017-08-18
 */
 
class AIndicator extends AFloat
{
	constructor()
	{
		super()
	
		this.isFocusLostClose = false;
		this.indiSpan = null;
		this.spinClassName = 'loader_type2';

		this.divCss = {
			'position': 'absolute',
			'width': '100%',
			'height': '100%',
			//'z-index': '2147483647',
			'background': 'rgba(0,0,0,0)'
		};

		this.spanCss = [
			'box-shadow:2px 2px 5px rgba(34, 34, 34, 0.5)',
			'-webkit-filter: drop-shadow(2px 2px 5px rgba(34, 34, 34, 0.5))',
			'-moz-filter: drop-shadow(2px 2px 5px rgba(34, 34, 34, 0.5))',
			'-ms-filter: drop-shadow(2px 2px 5px rgba(34, 34, 34, 0.5))',
			'-o-filter: drop-shadow(2px 2px 5px rgba(34, 34, 34, 0.5))',
			'filter: drop-shadow(2px 2px 5px rgba(34, 34, 34, 0.5))'
		];
	}
	
}

window.AIndicator = AIndicator

AIndicator.indicator = null;
AIndicator.prgRefCount = 0;
AIndicator.isOltp = false;

AIndicator.setBackground = function(background)
{
	if(!AIndicator.indicator) AIndicator.indicator = new AIndicator();
	AIndicator.indicator.divCss.background = background || 'rgba(0,0,0,0)';
};

AIndicator.setClass = function(cssName)
{
	if(!AIndicator.indicator) AIndicator.indicator = new AIndicator();
	AIndicator.indicator.setClassName(cssName);
};

AIndicator.show = function()
{
	if(AIndicator.isOltp) return;
	if(++AIndicator.prgRefCount>1) return;

	if(AIndicator.timeout)
	{
		clearTimeout(AIndicator.timeout);
		AIndicator.timeout = null;
		return;
	}
	
	if(!AIndicator.indicator) AIndicator.indicator = new AIndicator();
	AIndicator.indicator.show();
};

AIndicator.hide = function()
{
	if(AIndicator.isOltp || AIndicator.prgRefCount==0) return;
	if(--AIndicator.prgRefCount>0) return;
	
	if(AIndicator.timeout)
	{
		clearTimeout(AIndicator.timeout);
		AIndicator.timeout = null;
	}

	//show 상태에서 hide, show 호출되면 인디케이터가 사라졌다 보임처리 되므로
	//연속성을 위해 setTimeout 으로 숨김처리한다.
	AIndicator.timeout = setTimeout(function()
	{
		AIndicator.timeout = null;
		if(AIndicator.indicator) AIndicator.indicator.hide();
	});
};

AIndicator.beginOltp = function()
{
	if(AIndicator.isOltp) return;
	//oltp가 아니고 프로그레스가 더 있으면 무조건 제거
	if(AIndicator.prgRefCount>0) AIndicator.endOltp();
	
	AIndicator.prgRefCount = 0;
	AIndicator.show();
	AIndicator.isOltp = true;
};

AIndicator.endOltp = function()
{
	AIndicator.isOltp = false;
	AIndicator.prgRefCount = 1;
	AIndicator.hide();
};

AIndicator.prototype.init = function()
{
	AFloat.prototype.init.call(this);
	
};

AIndicator.prototype.setClassName = function(cssName)
{
	this.spinClassName = cssName||'loader_type2';
	
	if(this.indiSpan) this.indiSpan.setAttribute('class', this.spinClassName);
};

AIndicator.prototype.createSpan = function()
{
	this.indiSpan = document.createElement('div');
	//this.indiSpan.style.cssText = this.spanCss.join(";");
	//this.indiSpan.setAttribute('class', 'loadspin-box');
	
	this.indiSpan.setAttribute('class', this.spinClassName);
};

AIndicator.prototype.show = function()
{
	AIndicator.isShow = true;

	if(!afc.isSimulator && window.cordova) window.cordova.exec( null , null, "AppPlugin" , "progress", [AppManager.PROGRESS_SHOW]);
	else 
	{
		this.init();	//Indicator div 생성		
		
		this.createSpan();	//Indicator Span 생성
		
		this.append(this.indiSpan);	//Indicator 객체 삽입

		//Toast DIV css 정보 추가
		this.popupEx(this.divCss, null);

	}

};


AIndicator.prototype.hide = function()
{
	AIndicator.isShow = false;
	
	if(!afc.isSimulator && window.cordova) window.cordova.exec( null , null, "AppPlugin" , "progress", [AppManager.PROGRESS_HIDE]);
	else
	{
		if(this.$frame) 
		{
			this.indiSpan = null;		
			this.close();
		}
	}
};



/**
 * @author asoocool
 */
 
//-------------------------------------------------------------------------------------------------------- 
//	* AContainer 는 추상적인 클래스로만 사용
//	1) 컨테이너가 init 만 호출하고 open 을 호출하지 않으면 프레임만 존재하고 어떤 영역에도 추가되어져 있지 않은 상태이다.
//	2) 컨테이너가 open 을 호출했지만 url 을 셋팅하지 않은 경우는 컨테이너의 빈 프레임만 부모에 추가된 상태이고 내부 영역(클라이언트 영역)에는
//	뷰가 없는 상태이다. 내부 뷰는 setView 를 통해 이후에 셋팅할 수 있다.
//
//	* 컨테이너는 오직 하나의 뷰만을 갖는다. 뷰가 내부적으로 스플릿뷰나 플렉스뷰를 가지고 화면을 다시 분할 할 수 있다.
//---------------------------------------------------------------------------------------------------------  

class AContainer	
{
	constructor(containerId)	//필요시만 셋팅
	{
		this.view = null;

		//뷰를 감싸고 있는 아이템
		this.viewItem = null;

		this.containerId = containerId;	//컨테이너를 구분 짓는 아이디(APage, AWindow)

		this.element = null;
		this.$ele = null;

		this.parent = null;			//parent AContainer
		this.url = null;

		this.className = afc.getClassName(this);

		//같은 컨테이너를 여러 윈도우가 disable 시킬 수 있으므로 레퍼런스 카운팅을 한다.
		this.disableCount = 0;

		//여기에서 값을 초기화 하면 안됨. init 함수에서 setOption 함수를 이용함.
		/*
		this.option = 
		{
			isAsync: true,
			inParent: true
		};
		*/
		this.option = {};

		this.wndList = [];
	
	}

    awaitView()
    {
        return this.viewProm;
    }


}

window.AContainer = AContainer

//-------------------------------------------------------------------------
//	static area

AContainer.openContainers = {};

AContainer.findOpenContainer = function(cntrId)
{
	return AContainer.openContainers[cntrId];
};

AContainer.getDefaultParent = function(self)
{
    //현재 활성화된 브라우저의 body 에 Element 를 추가하기 위해
    var fApp = AApplication.getFocusedApp();

	var parent = fApp.getMainContainer();
	if(!parent) 
	{
		var navi = ANavigator.getRootNavigator();
		if(navi) parent = navi.getActivePage();
	}

	if(!parent || parent===self) parent = fApp.rootContainer;
	
	return parent;
};


AContainer.TAG = '<div class="AContainer-Style"></div>';

AContainer.disableIosScroll = false;

//AContainer.isAsyncLoad = true;

//--------------------------------------------------------------------------


AContainer.prototype.init = function(context, noViewItem)
{
	this.setOption(
	{
		//isAsync: AContainer.isAsyncLoad,
		inParent: true
		
	}, true);	

	if(!context) context = $(AContainer.TAG)[0];

    this.element = context;
    this.element.acont = this;	//AContainer
    this.$ele = $(this.element);
	
	//this.isActiveRecursive = !afc.isMobile;
	
	this.isActiveRecursive = false;
	
	this.tabKey = new TabKeyController();
	
	if(!noViewItem) this.makeViewItem();
};


AContainer.prototype.setData = function(data) { this.data = data; };
AContainer.prototype.getData = function() { return this.data; };

AContainer.prototype.makeViewItem = function()
{
	var $item = $('<div class="_view_item_"></div>');
	
    $item.css(
    {
        width: '100%',
        height: '100%',
        position: 'relative'
    });

    this.$ele.append($item);

    this.viewItem = $item[0];
};

AContainer.prototype.deleteView = function()
{
	if(this.view)
	{
		var doc = this.view.getDocument();
		if(doc) doc.closeDocument();
		
		this.view.removeFromView();
		this.view = null;
        this.viewProm = null;
	}
}

AContainer.prototype.setView = async function(view, isFull)//, asyncCallback)
{
	var thisObj = this;

    this.deleteView();

	if(typeof(view)=='string') view = await AView.createView(this.viewItem, view, this);
	else
	{
		this.viewItem.appendChild(view.element);

		//기존의 뷰가 들어올 경우 새로운 값으로 변경
		view.owner = this;
		view._item = this.viewItem;
		this.viewItem.view = view;
		view.element.container = this.getContainer();
		view.element.rootView = view;

		//기존의 뷰가 들어올경우에는 view의 realizeChild가 호출을 안하므로
		//여기서 탭키추가를 위해 호출해준다.

		var _find_child = function(item)
		{
			item.eachChild(function(acomp){
				//하위 컴포넌트에도 컨테이너를 다시 넣어준다.
				acomp.element.container = view.element.container;
				thisObj.tabKey.addCompMap(acomp, item.owner);
				if(acomp.eachChild) _find_child(acomp);
			});
		}

		_find_child(view);

		this.tabKey.saveOwnerMap(view.owner);
	}

	_after_helper(view);

	//새로 생성되어진 뷰를 리턴
	return this.view;
	

	function _after_helper(_view)
	{
		thisObj.view = _view;
		
		if(!_view || !_view.isValid()) return;
		
		//컨테이너에 셋팅되는 기본 뷰를 가득차게 한다.
		if(isFull) _view.$ele.css({ left:'0px', top:'0px', width:'100%', height:'100%' });

		thisObj.tabKey.init(thisObj.view);

		//iphone web
		if(AContainer.disableIosScroll)
		{
			if(afc.isIos && !afc.isHybrid)
			{
				//컨테이너에 기본 touch 를 disable 시켜 드래그 바운스 효과를 없앰.
				thisObj.$ele.bind('touchstart', function(e)
				{
					//자체 스크롤이 필요한 컴포넌트는 예외, AComponent 의 escapePreventDefault 함수를 호출하면 된다.
					if(!e.target.noPreventDefault) e.preventDefault();
				});	
			}
		}
	}

};

//return : Promise
AContainer.prototype.open = async function(url, parent, left, top, width, height)
{
	//parent 가 지정 되어져 있지 않으면
	if(!parent) parent = AContainer.getDefaultParent(this);
	
	if(!(parent instanceof AContainer)) 
	{
		console.error('parent must be AContainer');
	}
	
	this.parent = parent;
    this.url = url;
    
	//init 이 호출되지 않은 경우 
	if(!this.element) this.init();

	//position size
	if(!isNaN(left)) left += 'px';
	if(!isNaN(top)) top += 'px';
	if(!isNaN(width)) width += 'px';
	if(!isNaN(height)) height += 'px';
	
	if(!width) width = 'auto';
	if(!height) height = 'auto';
	
	// container 의 넓이 높이에 비율이 주어지면 리사이즈 시 이벤트를 보내주기위해
	//if( width.indexOf('%')>-1 || height.indexOf('%')>-1 ) this.isResizeEvent = true;
	
	this.$ele.css( { 'left':left, 'top':top, 'width': width, 'height': height, 'display': 'none' }); //뷰의 로드가 완료되면 보여준다.
	
    //현재 활성화된 브라우저의 body 에 Element 를 추가하기 위해
    let fApp = AApplication.getFocusedApp();
    
	//비동기 구조로 인해 컨테이너를 숨김상태로 일단 추가한 후
    //_after_setview 함수에서 보여줌.
    if(this.option.inParent) this.parent.element.appendChild(this.element);
    else fApp.rootContainer.element.appendChild(this.element);


	let thisObj = this;

    if(this.option.isTitleBar && this._makeTitle) await this._makeTitle();

	if(url) 
	{
		//await this.setView(url);
        this.viewProm = this.setView(url);
        await this.viewProm;
	}
	
	//if(this.option.isTitleBar && this._makeTitle) await this._makeTitle();
	
	_after_setview();
	
	//return true;
	
	function _after_setview()
	{
        //창을 생성 후 위치를 이동하는 경우.. 화면에 보였다가 이동하는 문제때문에
        //로드 완료 후 컨테이너를 보여줌.
        thisObj.$ele.css('display', 'block');

		thisObj.tabKey.focusOnInit(thisObj.option.focusOnInit, true);
	
		//컨테이너가 오픈되면 전역 메모리에 컨테이너아이디를 키로 하여 모두 저장해 둔다.
		AContainer.openContainers[thisObj.getContainerId()] = thisObj;

		//parent 가 static 으로 지정되어 있으면 자신도 static 로 변경해 준다.
		//container split 시 static 으로 지정할 경우 셋팅되어짐.
		if(thisObj.parent!==fApp.rootContainer && thisObj.parent.$ele.css('position')=='static')
		{
			thisObj.$ele.css('position', 'static');
		}

		//모바일이고 noAutoScale 값이 참이면 
		if(afc.isMobile && thisObj.option.noAutoScale)
		{
			//autoScale 이 적용되지 않은 효과가 나타나도록
			//반대로 줌을 적용해 준다.
			var scale = 1/PROJECT_OPTION.general.scaleVal;
			thisObj.$ele.css('zoom', scale);
		}
		
		thisObj.onCreate();
	}
	
    /*
	function _append_helper()
	{
		if(thisObj.option.inParent) 
		{
			//루트컨테이너를 생성할 때는 viewItem 을 만들지 않기 때문에 비교
			//if(thisObj.parent.viewItem) thisObj.parent.viewItem.appendChild(thisObj.element);
			//else thisObj.parent.element.appendChild(thisObj.element);

            //핫리로드 기능때문에 viewItem 에 넣으면 안됨. 
            //이전에 왜 viewItem 에 넣었는지 확인 필요. 아마도 타이틀 밑으로 들어가도록 하기위해서인듯.
            thisObj.parent.element.appendChild(thisObj.element);
		}
		else 
		{
			//if(fApp.rootContainer.viewItem) fApp.rootContainer.viewItem.appendChild(thisObj.element);
			//else fApp.rootContainer.element.appendChild(thisObj.element);

            fApp.rootContainer.element.appendChild(thisObj.element);
		}
        
	}
    */
};

AContainer.prototype.close = function(result, data)
{
	this.onClose();
	
	//컨테이너 내에 윈도우가 떠 있는 경우 닫아준다.
	for(let i=this.wndList.length-1; i>-1; i--)
	{
		this.wndList[i].setResultListener(null);
		this.wndList[i].setResultCallback(null);
		this.wndList[i].close();
	}
	this.wndList.length = 0;
	
	//자신이 네비게이터의 프레임 컨테이너인 경우
	if(this.childNavigator)
	{
		this.childNavigator.closeAllPage();
	}
	
	else //if(this.view) 
	{
        this.deleteView();
	}

    if(this.title && this.title.view)
	{
		this.title.view.removeFromView();
	}
	
	//if container is splitted, destroy all them
	this.destroySplit();
	
    this.$ele.remove();
    this.$ele = null;
	this.element = null;
	
	//delete AContainer.openContainers[this.getContainerId()];
	AContainer.openContainers[this.getContainerId()] = undefined;	
	
	//return true;
};

AContainer.prototype.setParent = function(newParent, styleObj)
{
	if(!newParent) newParent = AContainer.getDefaultParent(this);
	
	if(!(newParent instanceof AContainer)) 
	{
		console.error('parent must be AContainer');
		//return null;
	}
	
	var oldParent = this.parent;
	this.parent = newParent;

	if(styleObj) this.$ele.css(styleObj);

	//inParent 옵션이 있는 경우만 element 를 이동시켜 준다.
	if(this.option.inParent)
	{
		this.parent.$ele.append(this.$ele);

		this.onResize();
	}
	
	return oldParent;
};

AContainer.prototype.getClassName = function()
{
	return this.className;
};

//active 이벤트를 자식들에게 재귀적으로 호출해 줄지 여부
//이 값이 false 이고 원하는 자식에게만 전달하고 싶을 경우
//수동으로 뷰의 onActive 함수내에서 _callSubActiveEvent 함수를 호출해 주면 된다.
AContainer.prototype.setActiveRecursive = function(isRecursive) 
{
	this.isActiveRecursive = isRecursive;
};

AContainer.prototype.show = function()
{
	this.$ele.show();
};

AContainer.prototype.hide = function()
{
    this.$ele.hide();
};

//컨테이너의 리소스 로드가 완료되면 호출, 최초 한번만 호출된다.
//리소스는 로드됐지만 컨테이너가 보여지진 않는다. 
//안전하게 접근하려면 onCreateDone 사용
AContainer.prototype.onCreate = function()
{
	var thisObj = this;
	setTimeout(function() 
	{
		if(thisObj.onCreateDone) thisObj.onCreateDone();
		
	}, 0);

};


//Application 이 Background 로 이동하는 경우
AContainer.prototype.onAppPause = function() 
{
};

//Application 이 Foreground 로 이동하는 경우
AContainer.prototype.onAppResume = function()
{
};

AContainer.prototype.onClose = function()
{
	
};



AContainer.prototype._callSubActiveEvent = function(funcName, isFirst)
{
	if(!this.isValid()) return;
	if(this.splitter)
	{
		var count = this.getSplitCount(), acont;

		for(var i=0; i<count; i++)
		{
			acont = this.getSplitPanel(i);
			if(acont) acont[funcName].call(acont, isFirst);
		}
	}
	
	else if(this.view && this.view.isValid()) 
	{
		// isFirst 가 참인 경우, onInitDone 이후 자동으로 호출됨.
		if(funcName=='onActiveDone' && isFirst) return;
		
		this.view[funcName].call(this.view, isFirst);
	}

};

//--------------------------------------------------------------------

//뷰가 활성화되기 바로 전에 호출된다.
AContainer.prototype.onWillActive = function(isFirst) 
{
	this._callSubActiveEvent('onWillActive', isFirst);
};

//뷰의 활성화가 시작되면 호출된다.
AContainer.prototype.onActive = function(isFirst) 
{
	this._callSubActiveEvent('onActive', isFirst);
};

//뷰의 활성화가 완료되면 호출된다.
AContainer.prototype.onActiveDone = function(isFirst) 
{
	this._callSubActiveEvent('onActiveDone', isFirst);
};

AContainer.prototype.onWillDeactive = function() 
{
	this._callSubActiveEvent('onWillDeactive');
};

AContainer.prototype.onDeactive = function() 
{
	this._callSubActiveEvent('onDeactive');
};

AContainer.prototype.onDeactiveDone = function() 
{
	this._callSubActiveEvent('onDeactiveDone');
};


//-------------------------------------------------------------------

AContainer.prototype.onOrientationChange = function(info)
{
	
};

AContainer.prototype.onBackKey = function()
{
	return false;
};

AContainer.prototype.onResize = function()
{
	if(this.splitter) 
	{
		this.splitter.updateSize();
	}
	
	//자신이 네비게이터의 프레임 컨테이너인 경우
	else if(this.childNavigator)
	{
		this.childNavigator.onResize();
	}

	else if(this.view) this.view.updatePosition();
	
	//자신을 부모로 해서 open 을 호출한 자식 컨테이너들
	this.$ele.children('.AContainer-Style').each(function()
	{
		if(this.acont && this.acont.isShow())
			this.acont.onResize();
	});
	
	
};

//----------------------------------------------------------------------

AContainer.prototype.getPos = function()
{
	return this.$ele.position();
};

AContainer.prototype.setPos = function(pos)
{
	this.$ele.css( { 'left': pos.left+'px', 'top': pos.top+'px' });
};

AContainer.prototype.getWidth = function()
{
	return this.$ele.width();
};

AContainer.prototype.getHeight = function()
{
	return this.$ele.height();
};

AContainer.prototype.setWidth = function(width)
{
	return this.$ele.width(width);
};

AContainer.prototype.setHeight = function(height)
{
	return this.$ele.height(height);
};

AContainer.prototype.getStyle = function(key)
{
	return this.element.style.getProperty(key);
};

AContainer.prototype.setStyle = function(key, value, priority)
{
	this.element.style.setProperty(key, value, priority);
};

//----------------------------------------------------------------------------------------

AContainer.prototype.getParent = function()
{
	return this.parent;
};


AContainer.prototype.setContainerId = function(containerId)
{
	this.containerId = containerId;
};

AContainer.prototype.getContainerId = function()
{
	return this.containerId;
};

AContainer.prototype.getContainer = function()
{
	return this;
};

AContainer.prototype.getView = function()
{
	return this.view;
};

AContainer.prototype.isShow = function()
{
	return this.$ele.is(":visible");
};

AContainer.prototype.isOpen = function()
{
	return (this.element!=null);
};

AContainer.prototype.isValid = function()
{
	return Boolean(this.element);
};



AContainer.prototype.toString = function()
{
	var ret = '\n{\n', value;
    for(var p in this) 
    {
        if(!this.hasOwnProperty(p)) continue;
        
        value = this[p];
        
        if(typeof(value) == 'function') continue;
        
        else if(value instanceof HTMLElement)
        {
        	if(afc.logOption.compElement) ret += '    ' + p + ' : ' + $(value)[0].outerHTML + ',\n';
        	else ret += '    ' + p + ' : ' + value + ',\n';
        }
        else if(value instanceof Object) ret += '    ' + p +' : ' + afc.getClassName(value) + ',\n';
		else ret += '    ' + p + ' : ' + value + ',\n';
    }
    ret += '}\n';
    
    return ret;
};

/*
AContainer.prototype.actionDelay = function(filter)
{
	if(this.view) this.view.actionDelay(filter);
};
*/

AContainer.prototype.actionDelay = function()
{
	var thisObj = this;
	
	this.enable(false);
	
	setTimeout(function() 
	{
		if(thisObj.isValid()) thisObj.enable(true);
		
	}, afc.DISABLE_TIME);
};

//tabview 를 찾아서 selectedView 에 enable 처리를 하면
//문제가 해결되는지... 컨테이너의 $ele.find 하면 탭뷰까지 찾아서 처리해 주고 있는게 아닌지... 확인
AContainer.prototype.enable = function(isEnable)
{
	//스플릿되어 있는 경우는 뷰가 없는 경우인데 처리해야 하므로
	//아래 처럼 view 의 enable 을 호출하면 안되고 직접 찾아서 해야 함.
	
	//if(this.view) this.view.enable(isEnable);
	
	this.isEnable = isEnable;
	
	if(isEnable) this.$ele.css('pointer-events', 'auto');
	else this.$ele.css('pointer-events', 'none');
	
	this.enableChildren(isEnable);
};

AContainer.prototype.enableChildren = function(isEnable)
{
	//input, textarea tag 도 같이 해줘야 이벤트 전달시 키보드 오픈을 막을 수 있다.
	_enable_helper(this.element.getElementsByTagName('input'))
	_enable_helper(this.element.getElementsByTagName('textarea'))
	_enable_helper(this.element.getElementsByClassName('.RGrid-Style'))
	_enable_helper(this.element.getElementsByTagName('button')) //button 도 전달되므로 추가
	
	//탭뷰는 선택된 뷰가 pointer-events: auto 되어있으므로 이벤트 전달을 막기 위해 처리한다.
	Array.prototype.forEach.call(this.element.getElementsByClassName('.ATabView-Style'), function(ele)
	{
		if(ele.acomp)
		{
			var view = ele.acomp.getSelectedView();
			if(view)
			{
				if(isEnable)
				{
					if(view.isEnable) view.setStyle('pointer-events', 'auto')
				}
				else view.setStyle('pointer-events', 'none')
			}
		}
	})
	
    //@param {HTMLCollection} forms `요소의 문서 내 순서대로 정렬된 일반 컬렉션`
	function _enable_helper(forms)
	{
        if(isEnable)
        {
            // 엘리먼트이거나 컴포넌트인데 이전에 isEnable true 였던 경우 auto 처리
            // **엘리먼트인 경우에도 이전에 isEnable false 였다면 문제가 될수도 있을듯함
            Array.prototype.forEach.call(forms, function(ele) {
                if(!ele.acomp || (ele.acomp && ele.acomp.isEnable))
                    ele.style.setProperty('pointer-events', 'auto')
            })
        }
        else
        {
            Array.prototype.forEach.call(forms, function(ele)
            {
                ele.style.setProperty('pointer-events', 'none')
            })
        }
	}
};

/*
//--------------------------------------------------------------
//	패널은 다른 컨테이너의 부분 컨테이너 역할만 할 수 있다. 
AContainer.prototype.addPanel = function(panel)
{
	this.panels.push(panel);
	
	//차후 실제로 컨테이너 밑으로 들어가도록 하는 작업하기
	
};

AContainer.prototype.removePanel = function(panel)
{
	//this.panels.push(panel);
	
};
*/


//----------------------------------------------------------------------------------------
// split functions

//	createSplit 호출 시 내부에 분할 개수만큼의 빈 컨테이너가 생긴다.
//	이후 분할된 컨터이너에 setView 함수를 호출하여 뷰를 셋팅 또는 로드한다.
//	cntrClass 는 분할 시 셋팅할 컨테이너 클래스. 생략하면 APanel. null 이나 '' 이면 컨테이너를 셋팅하지 않는다. 이 경우 차후 setSplitPanel 을 호출하여 셋팅해 줘야한다.
//	APanel 이외의 다른 클래스는 지정할 수 없다.
AContainer.prototype.createSplit = function(count, sizeArr, splitDir, barSize, panelClass)
{
	if(this.splitter) return null;
	
	if(!window.ASplitter)
	{
		console.error('ASplitter is not defined.');
		console.info("Check Default Load Settings. or ");
		console.info("afc.import('Framework/afc/library/ASplitter.js');");
		return;
	}

	this.splitter = new ASplitter(this, barSize);
	this.splitter.createSplit(this.viewItem, count, sizeArr, splitDir);

	if(panelClass==undefined) panelClass = 'APanel';
	
	//null 이나 '' 을 입력하면 셋팅하지 않음.
	else if(!panelClass) return null;	
	
	var newCntr = null, ret = [];
	for(var i=0; i<count; i++)
	{
		newCntr = new window[panelClass]();
		newCntr.init();
		this.setSplitPanel(i, newCntr);
		
		newCntr.onCreate();
		
		ret.push(newCntr);
	}
	
	return ret;
};

AContainer.prototype.destroySplit = function()
{
	if(!this.splitter) return;
	
	var count = this.getSplitCount(), acont;
	
	for(var i=0; i<count; i++)
	{
		acont = this.getSplitPanel(i);
		if(acont) acont.close();
	}
	
	this.splitter.removeAllSplit();
	this.splitter = null;
};

//새롭게 분할 컨테이너를 추가한다.
AContainer.prototype.insertSplit = function(inx, splitSize, isAfter, cntrClass)
{
	if(!this.splitter) return null;
	
	var item = this.splitter.insertSplit(inx, splitSize, isAfter);
	
	if(cntrClass==undefined) cntrClass = 'APanel';
	
	//null 이나 '' 을 입력하면 셋팅하지 않음.
	else if(!cntrClass) return null;
	
	var newCntr = new window[cntrClass]();
	newCntr.init();
	this.setSplitPanel(item, newCntr);
	
	newCntr.onCreate();
	
	return newCntr;
};

AContainer.prototype.appendSplit = function(splitSize, cntrClass)
{
	return this.insertSplit(-1, splitSize, true, cntrClass);
};

AContainer.prototype.prependSplit = function(splitSize, cntrClass)
{
	return this.insertSplit(0, splitSize, false, cntrClass);
};

AContainer.prototype.removeSplit = function(inx)
{
	this.splitter.removeSplit(inx, function(removeItem)	
	{ 
		removeItem.acont.close();
	});
};

AContainer.prototype.getSplit = function(inx)
{
	return this.splitter.getSplit(inx);
};

AContainer.prototype.getSplitPanel = function(inx)
{
	var split = this.splitter.getSplit(inx);
	if(split) return split.acont;
	else return null;
	
	//return this.splitter.getSplit(inx).acont;
};

AContainer.prototype.getSplitCount = function()
{
	if(!this.splitter) return -1;
	return this.splitter.getSplitCount();
};

AContainer.prototype.indexOfPanel = function(panel)
{
	var count = this.getSplitCount();
	for(var i=0; i<count; i++)
	{
		if(panel===this.getSplitPanel(i)) return i;
	}
	
	return -1;
};

//open 되어 있지 않은 Panel 은 open 과 같은 효과를 갖는다.
//split 인 경우 parent 를 기준으로 open 함수를 호출할 수 없다.
//parent frame 으로 들어가는 것이 아니라 parent 밑의 split frame 로 들어가기 때문에
//setSplitPanel 함수를 호출해 줘야 한다.
AContainer.prototype.setSplitPanel = function(inx, acont)
{
	if(!(acont instanceof APanel)) 
	{
		alert('Container class should be APanel');
		return;
	}
	
	var $item;
	if(typeof(inx) == 'number') $item = $(this.splitter.getSplit(inx));
	else $item = $(inx);
	
	$item.append(acont.$ele);
	
	//새로운 값으로 변경
	acont._item = $item[0];
	$item[0].acont = acont;
	acont.parent = this;
	
	if(this.splitter.isStatic) acont.$ele.css('position', 'static');
	
	acont.$ele.css({ left:'0px', top:'0px', width:'100%', height:'100%' });
};


AContainer.prototype.onSplitChanged = function(splitFrame)
{
	if(splitFrame.acont)
		splitFrame.acont.onResize();
};



//------------------------------------------
//	asoocool test
//drag & drop 관련


//drag & drop 관련
/*
AContainer.prototype.enableDrag = function(isDraggable, offsetX, offsetY)
{
	if(!this.ddManager) this.ddManager = new DDManager(this);
	
	if(!offsetX) offsetX = 0;
	if(!offsetY) offsetY = 0;
	
	this.ddManager.setOffset(offsetX, offsetY);
	this.ddManager.enableDrag(isDraggable);
};

AContainer.prototype.enableDrop = function(isDroppable)
{
	if(!this.ddManager) this.ddManager = new DDManager(this);
	this.ddManager.enableDrop(isDroppable);
};
*/

//전역 리얼을 등록하기 위해 컨테이너도 registerReal 이 가능하도록 함.
//리얼데이터 수신시 컨테이너의 updateComponent 가 호출됨.
AContainer.prototype.updateComponent = function(queryData)
{

};

//noOverwrite 가 true 이면, 기존의 값이 존재할 경우 덮어쓰지 않는다.
AContainer.prototype.setOption = function(option, noOverwrite)
{
    for(var p in option)
    {
    	if(!option.hasOwnProperty(p)) continue;
    	
		if(!noOverwrite || this.option[p]==undefined)
		{
			this.option[p] = option[p];
		}
    }
};

AContainer.prototype.addWindow = function(awnd)
{
	var length = this.wndList.length;

	//이미 존재하는지 체크
	for(var i=0; i<length; i++)
	{
		if(this.wndList[i]===awnd) return false;
	}
	
	this.wndList.push(awnd);
	return true;
};

AContainer.prototype.removeWindow = function(awnd)
{
	var length = this.wndList.length;

	for(var i=0; i<length; i++)
	{
		if(this.wndList[i]===awnd)
		{
			this.wndList.splice(i,1);
			break;
		}
	}
};


//-----------------------------------------------------------------------
//	deprecated
//
AContainer.prototype.setId = function(containerId)
{
	this.containerId = containerId;
};

AContainer.prototype.getId = function()
{
	return this.containerId;
};

AContainer.prototype.getElement = function()
{
    return this.view.element;
};

AContainer.prototype.get$ele = function()
{
	return this.view.$ele;	
};

AContainer.prototype.addComponent = function(acomp, isPrepend, insComp)
{
	this.view.addComponent(acomp, isPrepend, insComp);
};

AContainer.prototype.findCompById = function(strId)
{
	return this.view.findCompById(strId);
};

AContainer.prototype.findCompByGroup = function(strGroup)
{
	return this.view.findCompByGroup(strGroup);
};

//-----------------------------------------------------------------------

/**
 *	@author asoocool
 * 
 */

class AWindow extends AContainer
{
	constructor(containerId)
	{
		super(containerId)
	
		this.modalBg = null;	//모달용 배경 div

		this.isOpenActionDelay = true;


		//show 함수 호출시 delay 를 주었는지
		this.isDelayShow = false; 
		//사라지면서 터치한 정보가 하위 컨테이너에게 전달되는 것을 시간 지연을 통해서 막음.
		this.isDisableTime = true;

		//init 함수에서 초기화 함
		//AContainer 로 옮겨짐
		//this.option = {};

		/*
		if(afc.andVer<4.4) 
		{
			//4.3 이하에서만 작동
			this.option.isPreventTouch = true;
		}
		*/

		//this.resultListener = null;
	}

	

}

window.AWindow = AWindow


//--------------------------------------------------------------------------------
//	static area
//--------------------------------------------------------------------------------

AWindow.BASE_ZINDEX = 1000;

//팝업된 AWindow 객체들을 모아 둔다.
AWindow.wndList = [];

//top window has the max z-index 
AWindow.topWindow = null;

//AWindow.wndList 에 윈도우를 추가한다.
//윈도우 오픈 시 내부적으로 자동 호출해 준다.
AWindow.addWindow = function(awnd)
{
	var length = AWindow.wndList.length;

	//이미 존재하는지 체크
	for(var i=0; i<length; i++)
	{
		if(AWindow.wndList[i]===awnd) return false;
	}
	
	AWindow.wndList.push(awnd);
	return true;
};

//AWindow.wndList 에서 윈도우를 제거한다.
//윈도우 close 시 내부적으로 자동 호출해 준다.
AWindow.removeWindow = function(awnd)
{
	var length = AWindow.wndList.length;

	for(var i=0; i<length; i++)
	{
		if(AWindow.wndList[i]===awnd)
		{
			AWindow.wndList.splice(i,1);
			break;
		}
	}
};

// @deprecated, use AContainer.findOpenContainer
AWindow.findWindow = function(cntrId)
{
	var length = AWindow.wndList.length, retWnd = null;

	for(var i=0; i<length; i++)
	{
		retWnd = AWindow.wndList[i];
		
		if(retWnd.getContainerId()==cntrId) return retWnd;
	}
	
	return null;
};


//보여지고 있는 윈도우 중에서 최상단 윈도우에게 backKey 이벤트를 전달한다.
//디바이스에서 backKey 가 눌려지면 자동으로 호출된다. 
AWindow.reportBackKeyEvent = function()
{
	var topWnd = AWindow.getTopWindow();

	if(topWnd) return topWnd.onBackKey();

	return false;
};

//오픈된 윈도우들에게 resize 이벤트를 전달한다.
//네이티브 WebView 의 사이즈가 변경되면 자동으로 호출된다.
/*
AWindow.reportResizeEvent = function()
{
	var length = AWindow.wndList.length;

	for(var i=0; i<length; i++)
		AWindow.wndList[i].onResize();
};
*/

AWindow.reportMoveCenter = function()
{
	var length = AWindow.wndList.length;
	var wnd;
	for(var i=0; i<length; i++)
	{
		wnd = AWindow.wndList[i];
		if(wnd.option.isCenter) wnd.moveToCenter();
	}
};

AWindow.getTopWindow = function()
{
	return AWindow.topWindow;
};

//close 나 hide 가 호출되면 z-index 를 0 으로 셋팅한 후 updateTopWindow 가 호출된다.
AWindow.updateTopWindow = function()
{
	var toTopWnd = null, length = AWindow.wndList.length, max = 0, tmp;

	//hide 된 윈도우까지 값을 비교해도 됨.
	for(var i=0; i<length; i++)
	{
		//asoocool test
		//if(AWindow.wndList[i].option.isAbsolute) continue;
	
		tmp = Number(AWindow.wndList[i].$ele.css('z-index'));
		
		//console.log( '(' + max + ', ' + tmp +')' );

		if(max<tmp)
		{
			toTopWnd = AWindow.wndList[i];
			max = tmp;
		}
	}
	
	//마지막 윈도우가 닫히면서 호출될 경우, 더이상의 윈도우가 없으면 toTopWnd 는 null 이 될 수 있다.
	AWindow.makeTopWindow(toTopWnd);
};

//---------------------------------------------------------------------------------------------
//modalBg 및 윈도우의 z-index 변경 로직과 container 의 active, deactive 이벤트를 발생시켜준다.
//toTopWnd 		: 최상위로 활성화 될 윈도우, null 이 될 수도 있으며 deactive 이벤트만 발생
//isFirst 		: 최초 오픈 시점인지
AWindow.makeTopWindow = function(toTopWnd, isFirst)
{
	//새로운 toTopWnd 가 활성화 되면서 현재 AWindow.topWindow 는 비활성화 된다.
	//최초 윈도우가 띄워지는 경우 deactWnd 는 null 이 된다.
	
	var deactWnd = AWindow.topWindow, zIndex = AWindow.BASE_ZINDEX;
	
	if(deactWnd===toTopWnd) return;
	
	//활성, 비활성 이벤트를 발생시켜줄 지 여부
	//활성 또는 비활성되는 창이 참인 경우만 호출...
	var isActive = 	 Boolean(toTopWnd);
	var isDeactive = Boolean(deactWnd);
	
	//1) 비활성화 창이 null 일 수 있으므로 비교하고, 2) 비활성창의 부모가 활성화 되는 경우, 3) 비활성창이 inParent 옵션으로 열렸으면
	//부모가 활성화되어도 비활성창이 그 앞에 그대로 보여지므로 결국 변화가 없는 것이므로 이벤트를 발생시키지 않는다.
	isActive &= !(deactWnd && deactWnd.getParent()===toTopWnd && deactWnd.option.inParent);
	//위와 같은 이유로... 
	isDeactive &= !(toTopWnd && toTopWnd.getParent()===deactWnd && toTopWnd.option.inParent);
	
	if(isActive) toTopWnd.onWillActive(isFirst, deactWnd);
	if(isDeactive) deactWnd.onWillDeactive(toTopWnd);
	
	//최초 윈도우가 띄워지는 경우 AWindow.topWindow 가 null 이 될 수 있다.
	if(isDeactive) 
	{
		zIndex = Number(deactWnd.$ele.css('z-index')) + 2;	//비활성 윈도우보다 2단계 높게, modalBg 자리를 비워둠
	
		//topWindow 에서 close 가 호출되면 z-index 를 0 으로 셋팅한 후 updateTopWindow 가 호출된다.
		//즉, deactWnd의 zIndex 가 0이면 곧 닫힐 윈도우이다.
		//그런 경우는 z-index 를 deactWnd의 의 값을 기준으로 셋팅해선 안되고 현재 자신의 값을 유지하면 된다.
		
		if(zIndex==2 && toTopWnd) zIndex = toTopWnd.$ele.css('z-index');
	}
	
	//활성화되는 창이 부모 element 안에 있는 경우는 부모의 z-index 를 변경해야 한다.
	if(isActive) 
	{
		var tmp = toTopWnd;
		
		//비활성화되는 창의 z-index 값보다 높은값을 추가하는 것이므로 isDeactive 가 참인 경우만
		while(isDeactive && tmp)
		{
			//부모 엘리먼트가 같을 때까지 검색
			if(tmp.option.inParent && tmp.element.parentNode!==deactWnd.element.parentNode)
			{
				tmp = tmp.getParent();
				
				//SubFolder 프로퍼티 세팅되어 다른 웹 프로젝트에 서브로 세팅되어 동작되는 경우
				//tmp의 부모컴포넌트가 존재하지 않을 수 있으므로 예외처리한다.
				if(!tmp)
				{
					tmp = toTopWnd;
					break;
				}
			}
			else break;
		}

		//APage 등, 즉 AWindow 가 아닌 컨테이너는 z-index 값이 셋팅되지 않도록
		if(tmp && tmp instanceof AWindow) tmp.$ele.css('z-index', zIndex);

        toTopWnd.$ele.css('z-index', zIndex);
	}
	
	//if(isActive) toTopWnd.$ele.css('z-index', zIndex);
	
	AWindow.topWindow = toTopWnd;
	
	//모달 다이얼로그인 경우 modalBg 의 z-index 도 변경시켜준다.	
	if(isActive && toTopWnd.option.isModal) 
	{
		if(toTopWnd.modalBg) toTopWnd.modalBg.css('z-index', zIndex-1);
		else toTopWnd.modalManage(zIndex-1);
	}
	
	if(isActive) toTopWnd.onActive(isFirst, deactWnd);
	if(isDeactive) deactWnd.onDeactive(toTopWnd);
	
	//topWindow 가 close 되는 경우는 setTimeout 을 주면 안됨. 
	//윈도우가 먼저 클로즈 된 후 onDeactiveDone 이 호출되어 $ele 가 null 인데도 _callSubActiveEvent 함수를 호출한다.
	
	if(zIndex>2) setTimeout(_active_done_helper, 0);
	else _active_done_helper();
	
	function _active_done_helper()
	{
		if(isActive && toTopWnd.isValid() ) toTopWnd.onActiveDone(isFirst, deactWnd);
		if(isDeactive && deactWnd.isValid() ) deactWnd.onDeactiveDone(toTopWnd);
	}
	
};

//개발중에 AWindow open 할 경우 z-index가 공유되지 않아 윈도우가 뒤로 뜨는 버그 수정
if(window.afc_)
{
	AWindow.addWindow = AWindow_.addWindow;
	AWindow.removeWindow = AWindow_.removeWindow;
	AWindow.getTopWindow = AWindow_.getTopWindow;
	AWindow.updateTopWindow = AWindow_.updateTopWindow;
	AWindow.makeTopWindow = AWindow_.makeTopWindow;
}

//---------------------------------------------------------------------------------------------

AWindow.prototype.init = function(context)
{
	//-------------------------------------------------------------------------------
	//	isModal 은 모바일인 경우만 (ios 브라우저 등에서) 
	//	윈도우 밑(뒤)에 있는 화면에 터치 액션이 전달되는 버그가 있으므로 기본값을 true 로 한다.
	//	isModal 이 true 이면 windowTouchBugFix 에서 부모를 disable 시켜 오류를 방지한다.
	//	모달리스로 셋팅을 하게 되면 ios 에서는 터치 액션이 배경에 전달됨. --> 차후 이 경우도 처리 필요.
	
	this.setOption(
	{
		//isModal: afc.isMobile,		//모바일이면 기본을 modal 로 셋팅, 위에 설명 참조.
		isModal: false,				//윈도우 모달/모달리스 여부, 위에 설명 참조.
		isCenter: false,			//자동 중앙정렬 할지
		isFocusLostClose: false,	//모달인 경우 포커스를 잃을 때 창을 닫을지
		isFocusLostHide: false,		//모달인 경우 포커스를 잃을 때 창을 숨길지
		modalBgOption: afc.isMobile ? 'dark' : 'none',		//none, light, dark 모달인 경우 배경을 어둡기 정도
		overflow: 'hidden',			//hidden, auto, visible, scroll
		dragHandle: null,			//드래가 핸들이 될 클래스명이나 아이디, .windowHandle or #windowHandle
		isResizable: false,			//윈도우 창을 리사이즈 가능하게 할지
		isDraggable: false,			//윈도우 창을 드래그로 움직이게 할지
		inParent: true,				//부모 컨테이너 안에 창을 띄울 경우, 모달리스(isModal:false)이고 부모를 클릭해도 항상 부모보다 위에 보이게 하려면 이 값을 true 로 셋팅해야 한다.
		focusOnInit: true,			//init될때 자동으로 윈도우의 첫번째 컴포넌트(tabIndex기준)에 포커스
		//activePropagation: true		//윈도우가 활성화 될 때 컨테이너의 active 호출여부(onWillActive, onActive, onActiveDone)
		
	}, true);

	//	no overwrite 가 true 이기 때문에 init 위에 두어야 한다.
	//------------------------------------------------------------

	AContainer.prototype.init.call(this, context);
	
	
	//타이틀을 만든다던가....등등의 태그 생성 작업
	
	//afc.log('AWindow init');
	
	
	if(theApp.webHistoryMgr) theApp.webHistoryMgr.setHistoryTarget(this.getContainerId(), this);
	
};

AWindow.prototype.onCreate = function()
{
	AContainer.prototype.onCreate.call(this);

	if(this.option.isCenter) this.moveToCenter();
	
    if(this.option.isDraggable) this.enableDrag();
	if(this.option.isResizable) this.enableResize();

	this.windowTouchManage();
	
	this.$ele.css( { 'overflow':this.option.overflow });
	
};

AWindow.prototype.setDragOption = function(key, value)
{
	if(this.option.isDraggable) 
	{
		this.$ele.draggable('option', key, value);
	}
};

AWindow.prototype.setResizeOption = function(key, value)
{
	if(this.option.isResizable) 
	{
		this.$ele.resizable('option', key, value);
	}
};

AWindow.prototype.onDragStart = function(event, ui)
{

};

AWindow.prototype.onDragStop = function(event, ui)
{
    //상단은 외부로 나가지 않도록
    if(ui.position.top<25) this.moveY(25);
};

AWindow.prototype.onResize = function()
{
	//if(this.option.isCenter) this.moveToCenter();

	AContainer.prototype.onResize.call(this);
};


AWindow.prototype.enableDrag = function()
{
    //윈도우를 오픈한 이후에 옵션을 켤 수도 있으므로 변수값을 셋팅한다.
    this.option.isDraggable = true;
    
    var dragOpt = 
    {
        scroll: false,
        //containment: 'window'
    };
    
    if(this.option.dragHandle) dragOpt.handle = this.option.dragHandle;

    this.$ele.draggable(dragOpt);
    
    var thisObj = this;
    
    //drag start
    this.setDragOption('start', function(event, ui)
    {
        thisObj.onDragStart(event, ui);
    });
    
    this.setDragOption('stop', function(event, ui)
    {
        thisObj.onDragStop(event, ui);
    });
};

AWindow.prototype.enableResize = function()
{
    //윈도우를 오픈한 이후에 옵션을 켤 수도 있으므로 변수값을 셋팅한다.
    this.option.isResizable = true;

    var thisObj = this;
    this.$ele.resizable(
    {
        handles: 'all',
        resize: function(event, ui)
        {
            //ui.size.height = Math.round( ui.size.height / 30 ) * 30;
            thisObj.onResize();
        },
        stop: function(event, ui)
        {
			//상단은 외부로 나가지 않도록
			let top = 0;
            if(ui.position.top < top) thisObj.moveY(top);
        }
    });
    
    //resizable 을 호출하면 position 값이 바뀌므로 다시 셋팅해 준다.
    this.$ele.css('position', 'absolute');

};

AWindow.prototype.setResultListener = function(resultListener)
{
	this.resultListener = resultListener;
};

AWindow.prototype.setResultCallback = function(callback)
{
	this.callback = callback;
};

AWindow.prototype.moveToCenter = function()
{
    var w = this.getWidth()/2;
    var h = this.getHeight()/2;

    var cenX = 'calc(50% - ' + w +'px)';
    var cenY = 'calc(50% - ' + h +'px)';
    
    this.move(cenX, cenY);
};

//This is deprecated, use setOption
AWindow.prototype.setWindowOption = function(option, noOverwrite)
{
	for(var p in option)
    {
		if(!option.hasOwnProperty(p)) continue;
		
		if(!noOverwrite || this.option[p]==undefined)
		{
			this.option[p] = option[p];
		}
    }
};

AWindow.prototype.setModalBgOption = function(option)
{
	this.option.modalBgOption = option;

	if(this.option.modalBgOption=='light') this.modalBg.css('background-color', 'rgba(0, 0, 0, 0.3)');
	else if(this.option.modalBgOption=='dark') this.modalBg.css('background-color', 'rgba(0, 0, 0, 0.5)');
	else this.modalBg.css('background-color', '');
};


//window buf fix
/*
AWindow.prototype.windowTouchBugFix = function(isOpen)
{
	if(!afc.isMobile || afc.isIos) return;
	
	if(isOpen)
	{
		//IOS UIWebOverflowContentView BugFix
		if(afc.isIos && window.AppManager) AppManager.touchDelay();
		
		this.isDisableTime = true;
		
		var isActionDelay = (!afc.isIos && this.isOpenActionDelay);
		
		//이전 윈도우가 사라지면서 자신을 띄웠을 때, 이전 윈도우가 터치한 정보가 자신에게 전달되는 것을 막음.
		//아이폰에서는 this.actionDelay('input'); 이 작동하지 않는다.
		//actionDelay 호출 때문에...ios 웹브라우저에서는 윈도우 자체 스크롤이 안되고 배경이 스크롤되는 버그가 발생한다.
		//그럴 경우 actionDelay 가 호출되지 않도록 한다.
		if(isActionDelay) this.actionDelay();
		
		//자신을 띄운 하위 컨테이너에게 터치 정보가 전달되는 것을 막음. 
		if(this.option.isModal)
		{
			if(++this.parent.disableCount==1)
			{
				this.parent.enable(false);
			}
			
			//actionDelay 가 호출된 경우는 delay 후에 풀어 주므로 
			if(!isActionDelay)
			{
				//자식인 자신도 disable 되므로 자신은 풀어준다.
				this.enable(true);
			}
			
			this.modalBg.css('pointer-events', 'auto');
		}
	}
	
	//close
	else
	{
		var thisObj = this;

		//IOS UIWebOverflowContentView BugFix
		if(afc.isIos && window.AppManager) AppManager.touchDelay();
		
		if(this.option.isModal)
		{
			//사라지면서 터치한 정보가 하위 컨테이너에게 전달되는 것을 시간 지연을 통해서 막음.
 			if(this.isDisableTime) setTimeout(_closeHelper, afc.DISABLE_TIME);
			//Disable delay가 없는 경우
 			else _closeHelper();
 			
		}
		else
		{
			//모달리스인 경우는 띄울 때 배경을 disable 시키지 않으므로 
			//닫을 때 터치 정보가 배경으로 전달된다. 그렇기 때문에 닫힐 경우 무조건 disable 시킨 후
			//활성화 시켜준다.
			if(++this.parent.disableCount==1) this.parent.enable(false);
			setTimeout(_closeHelper, afc.DISABLE_TIME);
		}
		
		
		function _closeHelper()
		{
			if(!thisObj.parent.isOpen()) return;

			if(--thisObj.parent.disableCount==0)
			{
				//var $ele = thisObj.parent.get$ele();
				//$ele.find('input').css('pointer-events', 'auto');
				//$ele.css('pointer-events', 'auto');

				thisObj.parent.enable(true);
			}
		}
		
	}
};
*/

AWindow.prototype.windowTouchManage = function()
{
	var thisObj = this;
	
    AEvent.bindEvent(this.element, AEvent.ACTION_DOWN, function(e)
    {
		e.stopPropagation();
		
		if(thisObj.isValid()) AWindow.makeTopWindow(thisObj);
    });
};

//android 4.3 이하, BugFix
//배경으로 터치 전달되어 스크롤되는 버그
AWindow.prototype.preventTouch = function()
{
/*
	if(afc.andVer>4.3) return;
	
    AEvent.bindEvent(this.element, AEvent.ACTION_DOWN, function(e)
    {
		e.preventDefault();
		e.stopPropagation();
    });
	*/
};

//윈도우가 모달 모드인 경우의 처리
AWindow.prototype.modalManage = function(zIndex)
{
	this.modalBg = $('<div class="_modal_bg_"></div>');
	this.modalBg.css({
		'width':'100%', 'height':'100%',
		'position':'absolute',
		'top':'0px', 'left':'0px',
		'z-index':zIndex, 
		//아래 값이 inherit 되어 none 값이 세팅되면 모달 뒷부분에 포인터 이벤트가 전달되므로 auto로 지정한다.
		'pointer-events': 'auto'
	});
	
	if(this.option.isModal)
	{
		if(this.option.modalBgOption=='light') this.modalBg.css('background-color', 'rgba(0, 0, 0, 0.3)');
		else if(this.option.modalBgOption=='dark') this.modalBg.css('background-color', 'rgba(0, 0, 0, 0.5)');
	}

	//현재 활성화된 브라우저의 body 에 Element 를 추가하기 위해
	var fApp = AApplication.getFocusedApp();

	if(this.option.inParent) this.parent.$ele.append(this.modalBg);
	else fApp.rootContainer.$ele.append(this.modalBg);

	//modalBg의 enable 로는 바로 닫히는 경우는 해결가능하지만 기존에 떠있는 윈도우가 있는 경우
	//enable 되기전에 클릭시 기존 윈도우의 z-index가 높게 설정되어 Top으로 위치하게 되는 버그가 있어 이벤트를 나중에 바인드하게 수정(setTimeout)
	//위의 로직은 윈도우A, B, C 가 있는 경우 A가 B를 띄우면서 B가 Top Window가 되지만 A에서 빠르게 두번 버튼을 클릭하게 되면
	//A가 Top Window가 되고 C를 띄우게 되면 B와 C의 z-index가 동일해져 C가 안보이게 되는 현상이 있어 이벤트는 바로 바인드하고 시간으로 막는다.
	var thisObj = this;
	var appendTime = Date.now();
	AEvent.bindEvent(thisObj.modalBg[0], AEvent.ACTION_DOWN, function(e) {
	
		e.preventDefault();
		e.stopPropagation();

		//오픈
		if(appendTime + afc.DISABLE_TIME > Date.now()) return;

		if(thisObj.option.isFocusLostClose) 
		{
			thisObj.isDisableTime = false;

			//close가 호출되어 modalBg afc.DISABLE_TIME 이후에 제거되는데
			//그전에 ACTION_DOWN이 호출되면 close가 또 발생되므로 isValid로 체크한다.
			//unbindEvent 를 하는 방법도 생각해 볼 것.
			if(thisObj.isValid()) thisObj.close();
		}
		else if(thisObj.option.isFocusLostHide) 
		{
			thisObj.isDisableTime = false;
			thisObj.hide();
		}
	});

/*
	//화면에서 클릭시 닫는 로직이 있는 경우 이벤트가 전달되어 바로 닫히는 현상이 있어 enable로 처리
	this.enable(false);
	setTimeout(()=> { if(this.isValid()) this.enable(true); }, afc.DISABLE_TIME);
	*/
};

//다이얼로그와 같은 속성으로 윈도우를 오픈한다.
AWindow.prototype.openAsDialog = function(viewUrl, parent, width, height)
{
	//var bgOpt = '';
	
	//if(afc.isPC) bgOpt = 'none';
	//else bgOpt = 'light';
	
	this.setOption(
	{
		isModal: true,
		isCenter: true,
		//modalBgOption: bgOpt
	});
	
	return this.open(viewUrl, parent, 0, 0, width, height);
};

//팝업메뉴와 같은 속성으로 윈도우를 오픈한다.
AWindow.prototype.openAsMenu = function(viewUrl, parent, width, height)
{
	this.setOption(
	{
		isModal: true,
		isCenter: true,
		isFocusLostClose: true,
	});
	
	return this.open(viewUrl, parent, 0, 0, width, height);
};

AWindow.prototype.openCenter = function(viewUrl, parent, width, height)
{
	this.setOption(
    {
		isCenter: true
    });
	
	return this.open(viewUrl, parent, 0, 0, width, height);
};


AWindow.prototype.openFull = function(viewUrl, parent)
{
	return this.open(viewUrl, parent, 0, 0, '100%', '100%');
};



//	윈도우 창을 연다.
//
AWindow.prototype.open = async function(viewUrl, parent, left, top, width, height)
{
	await AContainer.prototype.open.call(this, viewUrl, parent, left, top, width, height);
	
	//부모 wndList 에 추가. 닫힐 때 같이 닫아주기 위함
	if(this.option.inParent) this.parent.addWindow(this);
	
    //전역 wndList 에 추가
	AWindow.addWindow(this);
	
	AWindow.makeTopWindow(this, true);
	
	//modalBg 가 생성된 후 호출되어야 하므로 makeTopWindow 이후에 호출
	//this.windowTouchBugFix(true);

	if(theApp.webHistoryMgr) theApp.webHistoryMgr.pushHistory({target:this.getContainerId(), id:this.getContainerId()});
};

/*
AWindow.prototype.setView = function(view, isFull)
{
	AContainer.prototype.setView.call(this, view, isFull);
	
	//윈도우에 한해서 뷰터치시 포커스를 준다.
	this.view.actionToFocusComp();
};
*/

//윈도우 창을 닫는다.
//----------------------------------------------------------
//	result function
//	function onWindowResult(result, awindow);
//----------------------------------------------------------

AWindow.prototype.close = function(result, data)
{
	var thisObj = this;
	//현재는 최상위 z-index 이지만 
	//곧 닫힐 윈도우이기 때문에 정렬에서 맨 하위가 되도록 0을 셋팅한다.
	this.$ele.css('z-index', 0);
	
	AWindow.updateTopWindow(this);
	
	//--------------------------------

	AContainer.prototype.close.call(this, result, data);
	
	//this.windowTouchBugFix(false);
	
	if(this.option.isModal) 
	{
		this.modalBg.remove();
	 	this.modalBg = null;
	}
	
	//부모 wndList 에서 제거
	if(this.option.inParent) this.parent.removeWindow(this);
	
	//전역 wndList 에서 제거
	AWindow.removeWindow(this);
	
	if(this.resultListener) 
	{
		setTimeout(function()
		{
			thisObj.resultListener.onWindowResult(result, data, thisObj);
		}, 10);
	}
	
	if(this.callback)
	{
		setTimeout(function()
		{
			thisObj.callback(result, data);
		}, 10);
	}
	
	//result -909 is from WebHistoryManager
	if(theApp.webHistoryMgr && result!=-909) theApp.webHistoryMgr.popHistory();
};

AWindow.prototype.show = function(delay)
{	
	//this.windowTouchBugFix(true);
	
	AWindow.makeTopWindow(this);	
	
	if(this.option.isModal) this.modalBg.show();
	
    if(delay==undefined) this.$ele.show();
	else
    {
      	var thisObj = this;
       	thisObj.isDelayShow = true;

       	setTimeout(function() 
       	{
       		if(thisObj.isDelayShow) 
       			thisObj.$ele.show();
       	}, delay);
    }

};

AWindow.prototype.hide = function()
{
	this.isDelayShow = false;
	
	//this.windowTouchBugFix(false);
	
	this.$ele.css('z-index', 0);
	
	AWindow.updateTopWindow(this);
	
    this.$ele.hide();
	
	if(this.option.isModal) this.modalBg.hide();
};

/*
AWindow.prototype.restore = function()
{

};

AWindow.prototype.minimize = function()
{

};

AWindow.prototype.maximize = function()
{

};
*/

AWindow.prototype.move = function(x, y)
{
	if(!isNaN(x)) x += 'px';
	if(!isNaN(y)) y += 'px';
	
	this.$ele.css( { 'left':x, 'top':y });
};

AWindow.prototype.moveX = function(x)
{
	if(!isNaN(x)) x += 'px';
	this.$ele.css('left', x);
};

AWindow.prototype.moveY = function(y)
{
	if(!isNaN(y)) y += 'px';
	this.$ele.css('top', y);
};

AWindow.prototype.offset = function(x, y)
{
	var pos = this.getPos();
	this.$ele.css( { 'left':(pos.left+x)+'px', 'top':(pos.top+y)+'px' });
};

AWindow.prototype.onBackKey = function()
{
	this.close();
	return true;
};




                 
/**
 * @author asoocool
 */

//	APage 는 부모컨테이너 밑의 풀화면으로 추가될 수 있다.
//	싱글페이지만 사용할 경우 open() 함수를 호출하면 된다.
//	네비게이션 기능을 이용할 경우 ANavigator 객체와 같이 사용해야 한다.
class APage extends AContainer
{
	constructor(containerId)
	{
		super(containerId)
		
		this.navigator = null;
		this.pageData = null;	//deprecated
	}

	

	
}

window.APage = APage

APage.prototype.init = function(context)
{
	this.setOption(
	{
		isOneshot: false,			//활성화시 로드되고 비활성화시 바로 삭제한다. true 이면 매번 새로 로드된다.
		
	}, true);

	//	no overwrite 가 true 이기 때문에 
	//	부모의 옵션보다 우선 하려면 init 위에 두어야 한다.
	//------------------------------------------------------------

	AContainer.prototype.init.call(this, context);

	//afc.log('APage init');
};

APage.prototype.open = function(viewUrl, parent)
{
	return AContainer.prototype.open.call(this, viewUrl, parent, 0, 0, '100%', '100%');
};

APage.prototype.getNavigator = function()
{
	return this.navigator;
};

//deprecated, instead use getData
APage.prototype.getPageData = function()
{
	return this.pageData;
};

APage.prototype.onBackKey = function()
{
    if(this.navigator.canGoPrev())
    {
        this.navigator.goPrevPage(false);
        return true;
    }
    
	return false;
};


/**
 * @author asoocool
 */

class AApplication
{
	constructor()
	{
		//this.navigator = null;

		this.rootContainer = null;		//응용프로그램이 시작되는 최상위 컨테이너, 화면을 표현하지는 않는다. mainContainer 의 부모 컨테이너 역할만 한다.
		this.mainContainer = null;		//루트 컨테이너 밑으로, 화면을 표현하는 시작 컨테이너 
		this.rootElement = null;

		//this.indicator = null;
		this.orientation = 'portrait';

		//this.appContainer = null;
		this.curPath = null;

		//this.resPool = null;
		this.mdiManager = null;

		this.keyDownListeners = null;
		this.keyUpListeners = null;

	}

}

window.AApplication = AApplication

//현재 활성화된 브라우저의 body 에 Element 를 추가하기 위해 필요한 변수
AApplication.focusedBrowser = window;

AApplication.getFocusedApp = function()
{
    return AApplication.focusedBrowser.theApp;
};

AApplication.prototype.unitTest = function(unitUrl)
{
//console.log('unitTest : ' + unitUrl);

	//if(this.mainContainer) this.mainContainer.close();

	//this.rootContainer.$ele.children().remove();
	
	//this.setMainContainer(new APage('unit'));
	//this.mainContainer.open(unitUrl);
	
	
	//this.rootContainer.$ele.children().hide();
	
	var cntr = new APage('unit');
	cntr.open(unitUrl);
};


AApplication.prototype.onReady = function()
{
	this.setCurrentPath();

	//라이브러리 추가시 동적으로 생성
	//
	if(window['ResPool']) this.resPool = new ResPool();
	//if(window['MDIManager']) this.mdiManager = new MDIManager();
	if(window['WebHistoryManager']) 
	{
		this.webHistoryMgr = new WebHistoryManager();
		this.webHistoryMgr.init();
	}
	//-------------------------

	this.rootContainer = new AContainer();

    
    if(!this.rootElement)
    {
        if(PROJECT_OPTION.build.subName) 
        {
            this.rootElement = document.querySelector('._global_style_')
        }

        if(!this.rootElement) this.rootElement = document.querySelector('body')
    }

    //onReady 이전에 직접 원하는 Element 를 셋팅할 수도 있음.
    else this.rootElement = $(this.rootElement)[0];
	
	this.rootContainer.init(this.rootElement, true);	//default is body
	
	//edge 소수점 전화번호 인식 버그 수정
	this.rootContainer.$ele.attr('x-ms-format-detection','none');
	
	/*
	if(afc.isPC)
	{
		//pc 버전용 글로벌 스크롤 스타일 추가
		this.rootContainer.$ele.addClass('_global_scroll_style_');
	}
	*/
	
	if(this.isLoadTheme) this.loadThemeInfo();

	//키보드 이벤트 초기화
	this.initKeyEvent();
	
	var windowHeight = $(window).height(),
		_originalSize = $(window).width() + windowHeight, isKeypadVisible = false,
		_originalViewport = document.querySelector("meta[name=viewport]").content;
		
	//console.log('--> ' + windowHeight + ',' + _originalSize);

    var thisObj = this;
    window.addEventListener('orientationchange', function()
    {
		//console.log("... orientationchange ...");
		
		//PC 로 로드된 뒤에 디버그창에서 Mobile로 변경시에는 
		//키보드매니저가 추가되지 않아 에러가 나므로 새로고침 해준다.
		if(!window.KeyboardManager)
		{
			console.log('We need to reload.');
			location.reload();
			return;
		}
		
		var _cntr = KeyboardManager.container;
		
		if(_cntr && _cntr.isValid() && KeyboardManager.resizeWebview) KeyboardManager.restoreHeight(_cntr);
		
      	switch (window.orientation) 
      	{
        	case 0: //portrait
        	case 180:
        		thisObj.orientation = 'portrait';
				windowHeight = $(window).width();	//반대값을 저장해야 실제 회전된 후의 값이 된다.
          	break;
          	
        	case 90: 
        	case -90: //landscape
        		thisObj.orientation = 'landscape';
				windowHeight = $(window).height();	//반대값을 저장해야 실제 회전된 후의 값이 된다.
          	break;
          	
        	default:
	            //viewport.setAttribute('content', 'width=' + vpwidth + ', initial-scale=0.25, maximum-scale=1.0;')
          	break;
      	}
		
    }, false);
	
    window.addEventListener('resize', function(e)
    {
		//키보드가 떠 있는 상태에서 오리지날 사이즈를 변경하게 되면 문제가 생길 수 있으므로 비교한다.
		if(!isKeypadVisible)
		{
			//마지막으로 originalSize가 저장된 viewport 정보와 다른 경우 originalSize를 갱신한다.
            var metaViewPort = document.querySelector("meta[name=viewport]");

            if(metaViewPort)
            {
                var curViewport = metaViewPort.content;
                if(_originalViewport != curViewport)
                {
                    windowHeight = $(window).height();
                    _originalSize = $(window).width() + windowHeight;
                    _originalViewport = curViewport;
                    
                    //originalSize를 변경했기 때문에 아래의 키보드 오픈은 되지 않는다.
                }
            }
		}
	
		var isResize = true;
		
		//#########################################################
		// 아이폰의 경우 키패드가 올라올 때, resize 가 발생하지 않는다.
		// 아이폰인 경우, 다음 키패드 로직을 타면 안됨
		
		//모든 모바일 브라우저, native 의 경우도 adjustResize 일 경우 발생한다.
		if(afc.isMobile && !afc.isIos)
		{
			var wh = $(window).height(), ww = $(window).width();
			
			//console.log('====> ' + ww + ',' + wh + ',' + _originalSize);
			
			//# 키패드가 올라 오는 경우
			//키패드 없이, 가로/세로 모드 전환 시 2픽셀 정도 차이가 날 수 있으므로 
			//if(ww+wh!=_originalSize) 이렇게 비교하면 안됨. 좀 더 차이가 날 경우 수치를 조정한다.
			if(Math.abs(ww+wh - _originalSize) > 2)
			{
				//console.log("keyboard show up");
				
				isResize = false;			//키패드에 의해 리사이즈 이벤트가 발생된 경우는 reportEvent 를 전송하지 않는다.
				isKeypadVisible = true;
				
				KeyboardManager.onKeyBoardShow(wh, windowHeight - wh);
			}
			
			//# 키패드가 사라지는 경우
			else if(isKeypadVisible)
			{
				//console.log("keyboard closed");
				
				isResize = false;			//키패드에 의해 리사이즈 이벤트가 발생된 경우는 reportEvent 를 전송하지 않는다.
				isKeypadVisible = false;

				KeyboardManager.onKeyBoardHide();
				
				AWindow.reportMoveCenter();
			}
			
			windowHeight = wh;
		}
		
		// resize를 해도 되는 경우에만 resize 처리한다.
		// 키패드에 의해 리사이즈 이벤트가 발생된 경우는 reportEvent 를 전송하지 않는다.
		if(isResize)
		{
			/*
			AWindow.reportResizeEvent();

			if(theApp.mainContainer)
				theApp.mainContainer.onResize();

			else ANavigator.reportResizeEvent();
			*/
			
			theApp.rootContainer.onResize();
		}

    });	

    if(afc.isSimulator) this.enableHotReload();

};

//현재 응용프로그램의 작업 디렉토리 셋팅
AApplication.prototype.setCurrentPath = function()
{
	var curPath = decodeURI(window.location.pathname);
	
    if(afc.isWindow) 
    {
    	curPath = AUtil.extractLoc(curPath.replace(/[/]/g, afc.DIV));
    	//this.curPath = curPath.slice(1, curPath.length);
		this.curPath = curPath.slice(1);
    }
    //mac, linux
    else 
    {
    	curPath = AUtil.extractLoc(curPath);
    	//this.curPath = curPath.slice(0, curPath.length);
		//this.curPath = curPath.slice(0);
		this.curPath = curPath;
    }
};

//다음 세 함수는 필요한 경우
//실제 응용 프로그램(~App.cls)에서 상황에 맞게 재구현한다.

//index.html location
AApplication.prototype.getCurrentPath = function()
{
	return this.curPath;
};

//user data path to write something
AApplication.prototype.getDataPath = function()
{
	return this.curPath;
};

//exe file path
AApplication.prototype.getProcessPath = function()
{
	return this.curPath;
};


//android 의 백키 터치시 기본적으로 처리해 줘야 할 것들. 
//true를 리턴하면 받는 곳에서 아무처리도 하지 않도록 한다.
AApplication.prototype.onBackKeyManage = function()
{
    if(AWindow.reportBackKeyEvent()) return true;
    
    /*
    if(this.navigator.canGoPrev())
    {
        this.navigator.goPrevPage(true);
        return true;
    }
    */
   
   /*
   //asoocool
   	var page = this.navigator.getActivePage();
   	if(page && page.onBackKey()) return true;
	*/
	
	return ANavigator.reportBackKeyEvent();
};

AApplication.prototype.getOrientation = function()
{
	return this.orientation;
};

/*
AApplication.prototype.getCurrentPage = function()
{
	//asoocool
	//return this.navigator.getActivePage();
	return null;
};
*/

AApplication.prototype.setMainContainer = function(container)
{
	this.mainContainer = container;
};

AApplication.prototype.getMainContainer = function()
{
	return this.mainContainer;
};

AApplication.prototype.getRootContainer = function()
{
	return this.rootContainer;
};


AApplication.prototype.getActiveContainer = function()
{
	if(this.mdiManager) return this.mdiManager.getActiveContainer();
	else return null;
};

AApplication.prototype.getActiveView = function()
{
    var childContainer = this.getActiveContainer();
    if(childContainer) return childContainer.getView();
    else return null;
};

AApplication.prototype.getActiveDocument = function()
{
    var childContainer = this.getActiveContainer();
    if(childContainer) return childContainer.getView().getDocument();
    else return null;
};

AApplication.prototype.changeActiveMdiManager = function(mdiManager)
{
	this.mdiManager = mdiManager;
	
};

/* 
//------------------------------------------------------------------
var docTmpl = 
{
	containerClass: 'MDIPage',
	documentClass: 'MDIDocument',
	viewUrl: 'views/MainPageView.lay',
	extNames: ['txt','js','cls'],
};
//------------------------------------------------------------------
*/

AApplication.prototype.openDocTmplFile = async function(filePath, noLoad, bSilent)
{
	if(!this.mdiManager) return null;
	
	return await this.mdiManager.openDocContainer(filePath, null, noLoad, bSilent);
};

AApplication.prototype.saveActiveDocTmplFile = function()
{
	if(!this.mdiManager) return false;
	
	var doc = this.getActiveDocument();
	if(doc) this.mdiManager.saveDocContainer(doc.uri);
};

AApplication.prototype.closeActiveDocTmplFile = function(callback, isForce, isSave)
{
	if(!this.mdiManager) return false;
	
	var doc = this.getActiveDocument();
	if(doc) this.mdiManager.closeDocContainer(doc.uri, callback, isForce, isSave);
	else if(callback) callback(-1);
};

AApplication.prototype.initKeyEvent = function()
{
	var keyDownListeners = this.keyDownListeners = [],
		keyUpListeners = this.keyUpListeners = [];

	$(document).keydown(function(e)
	{
		//리스너는 메인윈도우의 리스너를 바라보게
		if(theApp.isSharedIFrame) keyDownListeners = opener.window.theApp.keyDownListeners;
		
		if(afc.isMac) e.ctrlKey = e.metaKey;

		var listener = null;
		for(var i=keyDownListeners.length-1; i>-1; i--)
		{
			//이전 onKeyDown 에서 리스너가 삭제될 수도 있으므로 null 비교를 해야함.
			listener = keyDownListeners[i];
			
			//onKeyDown 함수에서 true 를 리턴하면 다른 리스너에게 더 이상 전달되지 않는다.
			//마지막에 추가된 리스너가 우선적으로 호출된다.
			if(listener && listener.onKeyDown(e)) break;
		}
	});

	$(document).keyup(function(e)
	{
		//리스너는 메인윈도우의 리스너를 바라보게
		if(theApp.isSharedIFrame) keyUpListeners = opener.window.theApp.keyUpListeners;
		
		if(afc.isMac) e.ctrlKey = e.metaKey;

		var listener = null;
		for(var i=keyUpListeners.length-1; i>-1; i--)
		{
			//이전 onKeyUp 에서 리스너가 삭제될 수도 있으므로 null 비교를 해야함.
			listener = keyUpListeners[i];
			
			//onKeyUp 함수에서 true 를 리턴하면 다른 리스너에게 더 이상 전달되지 않는다.
			//마지막에 추가된 리스너가 우선적으로 호출된다.
			if(listener && listener.onKeyUp(e)) break;
		}
	});
	
};

AApplication.prototype.addKeyEventListener = function(type, listener)
{
	//기존에 추가된 것이 있으면 제거
	this.removeKeyEventListener(type, listener);

	//마지막에 추가된 리스너가 우선적으로 호출 되도록 
	if(type=='keydown') this.keyDownListeners.push(listener);
	//keyup
	else this.keyUpListeners.push(listener);
};

AApplication.prototype.removeKeyEventListener = function(type, listener)
{
	var keyListeners = this.keyUpListeners;
	
	if(type=='keydown') keyListeners = this.keyDownListeners;

	if(!keyListeners) return;
	
   	for(var i=0; i<keyListeners.length; i++)
	{
		if(keyListeners[i]===listener)
		{
			keyListeners.splice(i,1);
			break;
		}
	}
};



AApplication.prototype.onClose = function()
{
	return true;
};



AApplication.prototype.onError = function(message, url, lineNumber, colNumber, error)
{
	if(window['AIndicator']) AIndicator.hide();
	
	var totMsg = message + ', Line - ' + lineNumber + ', ' + url + ' ====> ' + error.stack;
	
	//AfcMessageBox('error', totMsg);
    alert(totMsg);
	
	return totMsg;
};

AApplication.prototype.loadThemeInfo = function()
{
	var pre = '';
	if(PROJECT_OPTION.build.subName) pre = PROJECT_OPTION.build.subName + '/';
	
	theApp.themeInfo = {};
	
    $.ajax(
    {
        url: pre + 'Template/Theme/themeInfo.inf',
        dataType: 'text',
        success: function(jsonStr)
        {
			try
			{
				theApp.themeInfo = JSON.parse(jsonStr);
			}
			catch(e){}
			
			var theme = theApp.themeInfo.activeTheme;
			if(theme)
			{
				//기존에 값을 클리어 해주고 changeTheme 를 해야 제대로 작동
				//theApp.setTheme();
				theApp.changeTheme(theme);
			}
		},
        
        error: function() 
        {
        }
    });
};

AApplication.prototype.changeTheme = function(theme)
{
	var curTheme = this.getTheme();
	
	//asoocool
	//이 비교를 하는게 성능상 유리한데... 잘 작동하는지 kb 프로젝트에서 테스트 해보기
	
	//if(curTheme != theme)
	{
		var i, info;
		if(curTheme)
		{
			info = theApp.themeInfo[curTheme];
			for(i=0; i<info.length; i++)
			{
				afc.removeCss(info[i]);
			}
		}
		
		info = theApp.themeInfo[theme];
		for(i=0; i<info.length; i++)
		{
			afc.loadCss(info[i]);
		}
		
		this.setTheme(theme);

		this.reportThemeEvent(curTheme, theme);
	}
};

AApplication.prototype.getTheme = function()
{
	return this.themeInfo.activeTheme;
};

AApplication.prototype.setTheme = function(theme)
{
	this.themeInfo.activeTheme = theme;
};

AApplication.prototype.reportThemeEvent = function(preTheme, curTheme)
{
	var event = document.createEvent('CustomEvent');
	event.initCustomEvent('themechange', false, false, {preTheme: preTheme, curTheme: curTheme});
	//e.detail = {preTheme: preTheme, curTheme: curTheme}
	window.dispatchEvent(event);
};

AApplication.prototype.addThemeEventListener = function(callback)
{
	window.addEventListener('themechange', callback);
};

AApplication.prototype.removeThemeEventListener = function(callback)
{
	window.removeEventListener('themechange', callback);
};

///////////////////////////////////////////////////////////////
// hot reload 

AApplication.prototype.enableHotReload = function()
{
    this.hrfs = nodeRequire('fs');
    this.watchers = {};
};

AApplication.prototype.disableHotReload = function()
{
    this.hrfs = null;

    for(let info of this.watchers)
    {
        if(info.watcher) info.watcher.close()
    }

    this.watchers = undefined;
};

AApplication.prototype.isHotReload = function()
{
    return this.hrfs;
};

AApplication.prototype._watchHelper = function(aview, path, isJs)
{
    let timer, info = this.watchers[path];

    //변경 감시를 이미 하고 있으면 
    if(info)
    {
        //변경시 리로드할 뷰 추가, 하나의 lay 파일로 여러개의 뷰가 생성될 수 있으므로
        info.views.push(aview)

        //console.log('already - ' + path + ' : ' + info.views.length)
    }

    //새롭게 변경 감시를 시작하는 경우
    else
    {
	    var pre = '';
	    if(PROJECT_OPTION.build.subName) pre = PROJECT_OPTION.build.subName + '/';

        info = 
        {
            watcher: null,
            views: []
        }

        this.watchers[path] = info

        //변경시 리로드할 뷰 추가, 하나의 lay 파일로 여러개의 뷰가 생성될 수 있으므로
        info.views.push(aview)

        //console.log(path + ' : ' + info.views.length)
        
        //변경시 감지할 파일을 등록한다.
        info.watcher = this.hrfs.watch(__dirname+'/'+ pre + path, (event, fileName) =>
        {
            if(event=='change')
            {
                if(timer) clearTimeout(timer);

                //운영체제의 변경 감지 이벤트를 사용하므로
                //변경 감지 이벤트가 여러번 발생한다. 
                //타임아웃을 이용하여 0.7초 안에 다시 발생하는 변경 감지는 무시한다.
                timer = setTimeout(async function() 
                {
                    //console.log('change ---- ' + fileName)
                    timer = null

                    //뷰와 연결된 자바스크립트 파일이 변경되면
                    //js도 다시 로드하고 연관된 뷰도 다시 로드한다.
                    if(isJs) await afc._loadScriptWait(path, true);  //true, 무조건 강제 로드

                    let cntr, view;
                    //파일 변경과 연관된 모든 뷰들을 리로드한다.
                    //info.views.forEach((view)=>

                    for(let i=0; i<info.views.length; i++)
                    {
                        view = info.views[i]

                        //owner가 탭뷰인 경우 탭에 로드된 뷰만 다시 로드
                        if(window.ATabView && view.owner instanceof ATabView)
                        {
                            let tabView = view.owner,
                                tab = tabView.getTabByUrl(aview.url)
                            
                            if(tab)
                            {
                                tabView.clearTabContent(tab)
                                tabView._loadTabContent(tab)
                            }
                            else
                            {
                                console.log('parent loading... ' + aview.url)
                            }
                        }

                        //그 외 컨테이너(APage, AWindow, APanel...)의 뷰나 
                        //리스트뷰, 슬라이드뷰 등은 자신의 컨테이너를 다시 로드한다.
                        else
                        {
                            cntr = view.getContainer()
                            if(cntr && cntr.view) cntr.setView(cntr.view.url)
                        }

                        //위의 reload 과정에서 소멸되면 에서 삭제되면
                        //unWatchFile 함수에서 info.views 의 원소가 삭제된다.
                        if(!view.isValid()) 
                        {
                            //console.log('setView remove from view')
                            i--;
                        }
                    }

                }, 700);
            }
        });

    }
};

AApplication.prototype.watchReloadFile = function(aview)
{
    let url = aview.url,
        htmlPath = url.replace('.lay', '.html'),
        jsPath = url.substring(0, url.lastIndexOf(".")) + '.js';

    this._watchHelper(aview, htmlPath);
    this._watchHelper(aview, jsPath, true);
};

AApplication.prototype._unWatchHelper = function(aview, path)
{
    let info = this.watchers[path];

    //변경 감시 객체가 있으면 
    if(info)
    {
        for(let i=0; i<info.views.length; i++)
        {
            if(info.views[i]===aview)
            {
                info.views.splice(i, 1)
                break
            }
        }

        //console.log('unWatchFile : ' + path + ' : ' + info.views.length)

        //더이상 등록된 뷰가 없으면
        if(info.views.length==0)
        {
            if(info.watcher) info.watcher.close()
            delete this.watchers[path]
        }
    }
};

AApplication.prototype.unWatchFile = function(aview)
{
    let url = aview.url,
        htmlPath = url.replace('.lay', '.html'),
        jsPath = url.substring(0, url.lastIndexOf(".")) + '.js';

    this._unWatchHelper(aview, htmlPath);
    this._unWatchHelper(aview, jsPath);
};




//---------------------------------------------------------------------------------
//	called from native


function onCloseApp()
{
	setTimeout(function()
	{
		if(theApp.onClose()) 
		{
			if(afc.isExec) window.exec(null, null, 'AppPlugin', 'CloseApp', []);
			else if(afc.isNwjs) theApp.nwWin.close(true);
			else if(afc.isElectron)
			{
				var wnd = theApp.elecRemote.getCurrentWindow();
				theApp.forceClose = true;
				wnd.close();
			}
			else window.close();
		}
		
	}, 0);
}

//native open event
function onOpenDocument(filePath)
{
	
}

/*
async function AfcMessageBox(title, message, type, callback, modaless)
{
	if(!window['AMessageBox']) return null;
	
	var wnd = new AMessageBox();
	wnd.setOption({isModal: !modaless});
	await wnd.openBox(null, message, type, callback);
	wnd.setTitleText(title);
	
	return wnd;
}
*/





/**
 * @author asoocool
 */

//-----------------------------------------------------------------------------------------
//  AEvent class
//-----------------------------------------------------------------------------------------

class AEvent
{
	constructor(acomp)
	{
		this.acomp = acomp;
		this.isTouchValid = false;
	}
}
window.AEvent = AEvent;

//--------------------------------------------------------------
// static area

AEvent.defEvents = ['actiondown', 'actionmove', 'actionup', 'actioncancel', 'actionenter', 'actionleave', 'keydown', 'keyup'];

//AEvent.TOUCHTIME = 0;
AEvent.LONGPRESS_TIME = 700;

AEvent.TOUCHLEAVE = 20;
if(afc.isIos) AEvent.TOUCHLEAVE = 40;


AEvent.actMap = null;

if(afc.isPC)
{
	AEvent.ACTION_DOWN = 'mousedown';
	AEvent.ACTION_MOVE = 'mousemove';
	AEvent.ACTION_UP = 'mouseup';
	
	//pc 에서는 발생하지 않는 이벤트지만 변수를 맞추기 위해 넣어 놓음, 
	//실제로 pc 버전에서는 아무작동도 하지 않아야 함.
	AEvent.ACTION_CANCEL = 'touchcancel';
	
	AEvent.actMap = 
	{
		touchstart: 'mousedown',
		touchmove: 'mousemove',
		touchend: 'mouseup'
	};
}
else
{
	AEvent.ACTION_DOWN = 'touchstart';
	AEvent.ACTION_MOVE = 'touchmove';
	AEvent.ACTION_UP = 'touchend';
	AEvent.ACTION_CANCEL = 'touchcancel';
	
	AEvent.actMap = 
	{
		mousedown: 'touchstart',
		mousemove: 'touchmove',
		mouseup: 'touchend'
	};
}

//pc 환경에서 touch 관련 이벤트 이름을 mouse 로 바꿔줌...또는 그 반대로
AEvent.actName = function(name)
{
	var ret = AEvent.actMap[name];
	return ret ? ret : name;
};


//The mouseout(over) event triggers when the mouse pointer leaves any child elements as well the selected element.
//The mouseleave(enter) event is only triggered when the mouse pointer leaves the selected element.

AEvent.ACTION_OVER = 'mouseover';
AEvent.ACTION_OUT = 'mouseout';
AEvent.ACTION_ENTER = 'mouseenter';
AEvent.ACTION_LEAVE = 'mouseleave';

AEvent.bindCallback = null;
AEvent.isFreezing = false;

AEvent.bindEvent = function(element, eventName, callback, options)
{
	var returnCallback = null;
	
	if(afc.isPC)
	{
		returnCallback = function(e)
		{
			if(!e.isTrigger && AEvent.isFreezing) 
			{
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
		
			if(e.clientX != undefined)
			{
				e.targetTouches = e.touches = e.changedTouches = [ e ];
			}

			if(AEvent.bindCallback) AEvent.bindCallback(element, eventName, e);

			callback.call(this, e);
		};
	}
	else
	{
		returnCallback = function(e)
		{
			//트리거가 아니고 프리징 된 경우, 즉 실제로 발생된 이벤트인 경우만 프리징 체크를 한다.
			//임의로 발생시킨 트리거는 프리징변수에 영향을 받지 않는다.
			if(!e.isTrigger && AEvent.isFreezing) 
			{
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
			
			if(AEvent.bindCallback) AEvent.bindCallback(element, eventName, e);

			callback.call(this, e);
		};
	}
		
	element.addEventListener(eventName, returnCallback, options);
	
	return returnCallback;
};

AEvent.unbindEvent = function(element, eventName, callback, options)
{
	element.removeEventListener(eventName, callback, options);
};

AEvent.triggerEvent = function(element, eventName, info)
{
	var evt = null;
	
	if(window.Event) 
	{
		evt = new Event(eventName, { bubbles: true, cancelable: true });
	}
	else
	{
		evt = document.createEvent('Event');
		evt.initEvent(eventName, true, true);
	}
	
	if(info)
	{
		evt.clientX = info.clientX;
		evt.clientY = info.clientY;
		evt.pageX = info.pageX;
		evt.pageY = info.pageY;
		
		evt.changedTouches = info.changedTouches;
		evt.targetTouches = info.targetTouches;
		evt.touches = info.touches;
	
		if(info.userData) evt.userData = info.userData;
	}
	
	evt.isTrigger = true;
	
   	element.dispatchEvent(evt);
};

AEvent.keyTrigger = function(element, eventName, which, ctrlKey)
{
	var e = jQuery.Event(eventName);
	e.which = which;
	e.ctrlKey = ctrlKey;
	$(element).trigger(e);
	
	return e;
};



//모든 클릭 이벤트들이 중복해서 발생되지 않도록 체크함.
AEvent.clickComp = null;

//-------------------------------------------------------------




//	overloading functions

//각 터치 상태에 따라 컴포넌트 상태를 상속받아 구현한다.
AEvent.prototype.actionDownState = function(){};
AEvent.prototype.actionMoveState = function(){};
AEvent.prototype.actionUpState = function(){};
AEvent.prototype.actionCancelState = function(){};
AEvent.prototype.actionEnterState = function(){};
AEvent.prototype.actionLeaveState = function(){};
AEvent.prototype.actionClickState = function(){};

//defaultAction 을 제외한 나머지 이벤트 함수들은 이벤트 함수 등록시만 호출된다.
AEvent.prototype.defaultAction = function(){};
//------------------------------------------------------



//---------------------------------------------------------------------------------------------------
//	Component Event Functions

AEvent.prototype.actiondown = function()
{
	this._actiondown();
};

AEvent.prototype.actionmove = function()
{
	this._actionmove();
};

AEvent.prototype.actionup = function()
{
	this._actionup();
};

AEvent.prototype.actioncancel = function()
{
	this._actioncancel();
};

AEvent.prototype.keydown = function()
{
	this._keydown();
};

AEvent.prototype.keyup = function()
{
	this._keyup();
};

AEvent.prototype.actionenter = function()
{
	this._actionenter();
};

AEvent.prototype.actionleave = function()
{
	this._actionleave();
};




//---------------------------------------------------------------------------------------------------


//공통으로 사용되어질 수 있는 이벤트 액션 구현
//상속받아 이벤트 함수를 선언하고 그 함수 안에서 다음 함수들 중 필요한 함수를 호출하면 됨.

AEvent.prototype._actiondown = function()
{
	var thisObj = this;
	this.acomp.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		thisObj.actionDownState();
		thisObj.acomp.reportEvent('actiondown', null, e);
	});
};

AEvent.prototype._actionmove = function()
{
	var thisObj = this;
	
	this.acomp.bindEvent(AEvent.ACTION_MOVE, function(e)
	{
		thisObj.actionMoveState();
		thisObj.acomp.reportEvent('actionmove', null, e);
	});
};

AEvent.prototype._actionup = function()
{
	var thisObj = this;
	
	this.acomp.bindEvent(AEvent.ACTION_UP, function(e)
	{
		thisObj.actionUpState();
		thisObj.acomp.reportEvent('actionup', null, e);
	});
};

AEvent.prototype._actioncancel = function()
{
	var thisObj = this;
	
	this.acomp.bindEvent(AEvent.ACTION_CANCEL, function(e)
	{
		thisObj.actionCancelState();
		thisObj.acomp.reportEvent('actioncancel', null, e);
	});
};

AEvent.prototype._dblclick = function()
{
	var thisObj = this;
	
	this.acomp.element.addEventListener('dblclick', function(e)
	{
		thisObj.acomp.reportEvent('dblclick', null, e);
	});
};

AEvent.prototype._click = function(evtName)
{
	var thisObj = this, acomp = this.acomp;
	var startX = 0, startY = 0;
	
	if(!evtName) evtName = 'click';
	
	acomp.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		//좌클릭만 허용
		if(e.which==3) return;
		 
		//afc.log('AEvent.ACTION_DOWN');
		if(!acomp.isEnable || e.touches.length > 1) return;
		if(acomp.ddManager && acomp.ddManager.isDraggable) return;
		
		//AEvent.TOUCHTIME = Date.now();
		
		if(acomp.eventStop) e.stopPropagation();
		
		/*
		if(AEvent.clickComp) return;
		AEvent.clickComp = acomp;
		*/

		thisObj.isTouchValid = true

		var oe = e.changedTouches[0];
		startX = oe.clientX;
		startY = oe.clientY;
		
		thisObj.actionDownState();
		
	});
	
	//모바일인 경우 자신의 영역에 touchstart 를 하지 않으면 touchmove 가 발생하지 않는다.
	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다. 
	acomp.bindEvent(AEvent.ACTION_MOVE, function(e)
	{
		
		if(!thisObj.isTouchValid || !acomp.isEnable || e.touches.length > 1) return;
		if(acomp.ddManager && acomp.ddManager.isDraggable) return;
		
		if(acomp.eventStop) e.stopPropagation();
		
		//PC 버전의 AButton 은 AButtonEvent 의 action leave 에서 처리
		if(afc.isPC && window.AButton && acomp instanceof AButton) return;
		
		var oe = e.changedTouches[0];
		if(Math.abs(oe.clientX - startX) > AEvent.TOUCHLEAVE || Math.abs(oe.clientY - startY) > AEvent.TOUCHLEAVE) 
		{
			thisObj.isTouchValid = false;
			thisObj.actionCancelState();
		}
	});
	
	acomp.bindEvent(AEvent.ACTION_UP, function(e) 
	{
		if(!thisObj.isTouchValid || !acomp.isEnable || e.touches.length > 1) return;
		if(acomp.ddManager && acomp.ddManager.isDraggable) return;

	   	//상위 뷰가 터치 이벤트를 받지 않도록, ex)리스트뷰의 셀렉트 이벤트 발생 방지
	    if(acomp.eventStop) e.stopPropagation();
	
		thisObj.actionUpState();
		
		//acomp.reportEvent(evtName, null, e);
		
	});
	
	acomp.bindEvent(AEvent.ACTION_CANCEL, function(e) 
	{
		thisObj.isTouchValid = false;
		
		thisObj.actionCancelState();
		
	});
	
	//웹접근성 관련 처리, 스크린리더기가 작동되면 input 계열의 태그인 경우 위 세가지 이벤트가 발생되지 않음(label 등은 발생함)
	//그래서 위 세 이벤트는 각 상태를 변경하는 용도로만 사용하고 실제 이벤트는 웹의 실제 클릭 이벤트를 사용하도록
	//구조가 변경됨. 이 경우 isSafeClick 은 작동하지 않을 수 있음. 차후에 테스트 해보기
	//acomp.$ele.on('click', function(e)
	acomp.bindEvent('click', function(e)
	{
		if(!acomp.isEnable || !thisObj.isTouchValid) return;
		
	   	//상위 뷰가 터치 이벤트를 받지 않도록, ex)리스트뷰의 셀렉트 이벤트 발생 방지
	    if(acomp.eventStop) e.stopPropagation();
	
		//click 이벤트에는 changedTouches 이벤트가 없기 때문에 셋팅
		//이전 버전에서 사용하고 있기때문에 오류를 막기 위해 셋팅, 향후 제거하기
		e.targetTouches = e.touches = e.changedTouches = [ e ];
		
		//특정한 경우에 click이벤트만 동작하고 actionup이 발생되지 않아 setCheck하는 로직을
		//actionUpState에서 actionClickState로 이동
		//1. 모바일기기(안드로이드 ios)에서 두손가락으로 버튼 클릭시
		//2. ios 13 이상에서 버튼의 바깥영역이지만 아주 가까운 부분 클릭시 클릭이벤트만 발생된다.
		thisObj.actionClickState();
		
		acomp.reportEvent(evtName, null, e);
	});
	
};

AEvent.prototype._longtab = function()
{
	var thisObj = this, acomp = this.acomp, timeout = null, startX = 0, startY = 0;
	
	acomp.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		if(!acomp.isEnable || e.touches.length > 1) return;
		
		//if((new Date().getTime() - AEvent.TOUCHTIME) < afc.CLICK_DELAY) return; 
		
		thisObj.actionDownState();

		var oe = e.changedTouches[0];
		startX = oe.clientX;
		startY = oe.clientY;
		
		if(timeout) 
		{
			clearTimeout(timeout);
			timeout = null;
		}
        
        timeout = setTimeout(function()
        {
			//롱탭 이벤트 시에는 버튼의 클릭이벤트가 발생되지 않도록 하기 위해
			thisObj.isTouchValid = false;
			
        	timeout = null;
            acomp.reportEvent('longtab', null, e);
            
        }, AEvent.LONGPRESS_TIME);
	});

	acomp.bindEvent(AEvent.ACTION_MOVE, function(e) 
	{
		var oe = e.changedTouches[0];
		if(Math.abs(oe.clientX - startX) > AEvent.TOUCHLEAVE || Math.abs(oe.clientY - startY) > AEvent.TOUCHLEAVE)
		{
			if(timeout) 
			{
				clearTimeout(timeout);
				timeout = null;
			}
			thisObj.actionCancelState();
		}
	});

	acomp.bindEvent(AEvent.ACTION_UP, function(e) 
	{
        if(timeout) 
        {
        	clearTimeout(timeout);
        	timeout = null;
        }
		
		thisObj.actionUpState();
		
		//if((new Date().getTime() - AEvent.TOUCHTIME) > afc.CLICK_DELAY) AEvent.TOUCHTIME = new Date().getTime();	
		
	});
	
	acomp.bindEvent(AEvent.ACTION_CANCEL, function(e) 
	{
		thisObj.isTouchValid = false;
		
		if(timeout) 
		{
			clearTimeout(timeout);
			timeout = null;
		}
		thisObj.actionCancelState();
	});
};

AEvent.prototype._swipe = function()
{
	var scrlManager = new ScrollManager();
	//scrlManager.setOption({moveDelay:200});
	//스와이프 이벤트 감도, 값이 작을 수록 작은 스와이프에도 이벤트가 발생한다.
	scrlManager.setOption({moveDelay:100});
	
	var isDown = false, acomp = this.acomp;
	
	acomp.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		isDown = true;
		
		if(acomp.eventStop) e.stopPropagation();
		
		//asoocool
		//이 부분을 추가하면 다른 스크롤이 발생하지 않음.
		//e.preventDefault();

		scrlManager.initScroll(e.changedTouches[0].clientX);
	});
	
	//move
	acomp.bindEvent(AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown) return;
		
		if(acomp.eventStop) e.stopPropagation();
		
		scrlManager.updateScroll(e.changedTouches[0].clientX, function(move)
		{
		});
	});
	
	acomp.bindEvent(AEvent.ACTION_UP, function(e)
	{
		if(!isDown) return;
		isDown = false;
		
		if(acomp.eventStop) e.stopPropagation();
		
		scrlManager.scrollCheck(e.changedTouches[0].clientX, function(move)
		{
			var evtObj = 
			{
				direction: 'left',//next
				distance: this.totDis
			};
			
			if(this.totDis<0) 
				evtObj.direction = 'right';
		
			acomp.reportEvent('swipe', evtObj, e);
			return false;
		});
	});
};


AEvent.prototype._actionenter = function()
{
	var thisObj = this;
	this.acomp.$ele.on('mouseenter', function(e)
	{
		thisObj.actionEnterState();
		thisObj.acomp.reportEvent('actionenter', null, e);
	});
};

AEvent.prototype._actionleave = function()
{
	var thisObj = this;
	this.acomp.$ele.on('mouseleave', function(e)
	{
		thisObj.actionLeaveState();
		thisObj.acomp.reportEvent('actionleave', null, e);
	});
};

AEvent.prototype._keydown = function()
{
	this.bindKeyDown = true;
	if(!this.acomp.isDev()) theApp.addKeyEventListener('keydown', this);
};

AEvent.prototype._keyup = function()
{
	this.bindKeyUp = true;
	if(!this.acomp.isDev()) theApp.addKeyEventListener('keyup', this);
};


AEvent.prototype._load = function()
{
	var thisObj = this;
	
	this.acomp.element.addEventListener('load', function(e)
	{
		thisObj.acomp.reportEvent('load', this.src, e);	
	});
};

AEvent.prototype.onKeyDown = function(e)
{
	let focusComp = AComponent.getFocusComp()
	if(focusComp && this.acomp.element.contains(focusComp.element))
	{
		this.acomp.reportEvent('keydown', null, e)
	}

	//if(this.acomp===AComponent.getFocusComp())
	//	this.acomp.reportEvent('keydown', null, e);
};

AEvent.prototype.onKeyUp = function(e)
{
	let focusComp = AComponent.getFocusComp()
	if(focusComp && this.acomp.element.contains(focusComp.element))
	{
		this.acomp.reportEvent('keyup', null, e)
	}

	//if(this.acomp===AComponent.getFocusComp())
	//	this.acomp.reportEvent('keyup', null, e);
};



/**
 * @author asoocool
 */

class AViewEvent extends AEvent
{
	constructor(acomp)
	{
		super(acomp);
		
		this.bScrollBind = false;
	}
}
window.AViewEvent = AViewEvent;



//['click', 'dblclick', 'swipe', 'longtab', 'scroll', 'scrollleft', 'scrollright', 'scrolltop', 'scrollbottom' ]

//---------------------------------------------------------------------------------------------------
//	Component Event Functions

AViewEvent.prototype.click = function()
{
	this._click();
};

AViewEvent.prototype.dblclick = function()
{
	this._dblclick();
};

AViewEvent.prototype.swipe = function()
{
	this._swipe();
};

AViewEvent.prototype.longtab = function()
{
	this._longtab();
};

AViewEvent.prototype.scroll = function()
{
	this._scroll();
};

AViewEvent.prototype.scrollleft = function()
{
	this._scroll();
};

AViewEvent.prototype.scrollright = function()
{
	this._scroll();
};

AViewEvent.prototype.scrolltop = function()
{
	this._scroll();
};

AViewEvent.prototype.scrollbottom = function()
{
	this._scroll();
};

//---------------------------------------------------------------------------------------------------

AViewEvent.prototype._scroll = function()
{
	if(this.bScrollBind) return;
	this.bScrollBind = true;
	
	var aview = this.acomp, lastTop = aview.element.scrollTop, lastLeft = aview.element.scrollLeft;
	
	aview.element.addEventListener('scroll', function(e)
	{
		//scrollTo 함수 호출과 같이 임의로 스크롤을 발생시킨 경우 이벤트가 발생되지 않게 하려면 셋팅
		if(aview.ignoreScrollEvent)
		{
			aview.ignoreScrollEvent = false;
			return;
		}
	
		//---------------------------------
		//	가로 세로 이벤트를 구분하기 위해
				
		//horizontal
		if(lastLeft!=this.scrollLeft)
		{
			//스크롤 방향
			this.vert = false;
			
			aview.reportEvent('scroll', this, e);
			
			var rightVal = this.scrollWidth - this.clientWidth - this.scrollLeft;
		
			if(rightVal < 1) 	//안드로이드인 경우 0.398472 와 같이 소수점이 나올 수 있다.
			{
				//ios 는 overscrolling 때문에 음수값이 여러번 발생한다.
				//이미 scroll bottom 이벤트가 발생했으므로 overscrolling 에 대해서는 무시한다.
				if(afc.isIos && (this.scrollWidth-this.clientWidth-lastLeft) < 1) return;
			
				if(aview._scrollRightManage())
					aview.reportEvent('scrollright', this, e);
			}
			else if(this.scrollLeft < 1)
			{
				if(afc.isIos && lastLeft < 1) return;
				
				if(aview._scrollLeftManage())
					aview.reportEvent('scrollleft', this, e);
			}
			
			lastLeft = this.scrollLeft;
		}
		
		//vertical
		if(lastTop!=this.scrollTop)
		{
			//스크롤 방향
			this.vert = true;
		
			aview.reportEvent('scroll', this, e);
			
			var bottomVal = this.scrollHeight - this.clientHeight - this.scrollTop;
		
			if(bottomVal < 1)	
	        {
				if(afc.isIos && (this.scrollHeight-this.clientHeight-lastTop) < 1) return;
				
	        	if(aview._scrollBottomManage())
					aview.reportEvent('scrollbottom', this, e);
	        }
	        else if(this.scrollTop < 1)
	        {
				if(afc.isIos && lastTop < 1) return;
				
	        	if(aview._scrollTopManage())
					aview.reportEvent('scrolltop', this, e);
	        }
			
			lastTop = this.scrollTop;
		}
	});
};

afc.scriptMap["Framework/afc/library/jquery-core.js"] = true;
afc.scriptMap["Framework/afc/library/jquery-ui.js"] = true;
afc.scriptMap["Framework/afc/library/jquery.ui.touch-punch.js"] = true;
afc.scriptMap["Framework/afc/library/ARect.js"] = true;
afc.scriptMap["Framework/afc/library/AUtil.js"] = true;
afc.scriptMap["Framework/afc/library/afc.js"] = true;
afc.scriptMap["Framework/afc/library/ADataMask.js"] = true;
afc.scriptMap["Framework/afc/library/TabKeyController.js"] = true;
afc.scriptMap["Framework/afc/library/ScrollManager.js"] = true;
afc.scriptMap["Framework/afc/library/PosUtil.js"] = true;
afc.scriptMap["Framework/afc/library/LocalizeManager.js"] = true;
afc.scriptMap["Framework/afc/component/AComponent.js"] = true;
afc.scriptMap["Framework/afc/component/ALayout.js"] = true;
afc.scriptMap["Framework/afc/component/AView.js"] = true;
afc.scriptMap["Framework/afc/component/AFloat.js"] = true;
afc.scriptMap["Framework/afc/component/AToast.js"] = true;
afc.scriptMap["Framework/afc/component/AIndicator.js"] = true;
afc.scriptMap["Framework/afc/component/AContainer.js"] = true;
afc.scriptMap["Framework/afc/component/AWindow.js"] = true;
afc.scriptMap["Framework/afc/component/APage.js"] = true;
afc.scriptMap["Framework/afc/component/AApplication.js"] = true;
afc.scriptMap["Framework/afc/event/AEvent.js"] = true;
afc.scriptMap["Framework/afc/event/AViewEvent.js"] = true;
