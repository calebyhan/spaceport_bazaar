/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-mixed-operators, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars, default-case, jsdoc/require-param*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
var $Object = $util.global.Object, $undefined = $util.global.undefined, $Error = $util.global.Error, $RangeError = $util.global.RangeError, $TypeError = $util.global.TypeError, $parseInt = $util.global.parseInt, $String = $util.global.String, $Number = $util.global.Number, $BigInt = $util.global.BigInt, $Array = $util.global.Array, $Boolean = $util.global.Boolean;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.bazaar = (function() {

    /**
     * Namespace bazaar.
     * @exports bazaar
     * @namespace
     */
    var bazaar = {};

    bazaar.v2 = (function() {

        /**
         * Namespace v2.
         * @memberof bazaar
         * @namespace
         */
        var v2 = {};

        /**
         * Resource enum.
         * @name bazaar.v2.Resource
         * @enum {number}
         * @property {number} RESOURCE_WATER=1 RESOURCE_WATER value
         * @property {number} RESOURCE_FOOD=2 RESOURCE_FOOD value
         * @property {number} RESOURCE_COMPONENTS=3 RESOURCE_COMPONENTS value
         */
        v2.Resource = (function() {
            var valuesById = $Object.create(null), values = $Object.create(valuesById);
            values[valuesById[1] = "RESOURCE_WATER"] = 1;
            values[valuesById[2] = "RESOURCE_FOOD"] = 2;
            values[valuesById[3] = "RESOURCE_COMPONENTS"] = 3;
            return values;
        })();

        /**
         * Phase enum.
         * @name bazaar.v2.Phase
         * @enum {number}
         * @property {number} PHASE_READY=1 PHASE_READY value
         * @property {number} PHASE_RUNNING=2 PHASE_RUNNING value
         * @property {number} PHASE_PAUSED=3 PHASE_PAUSED value
         * @property {number} PHASE_FINISHED=4 PHASE_FINISHED value
         * @property {number} PHASE_ABORTED=5 PHASE_ABORTED value
         */
        v2.Phase = (function() {
            var valuesById = $Object.create(null), values = $Object.create(valuesById);
            values[valuesById[1] = "PHASE_READY"] = 1;
            values[valuesById[2] = "PHASE_RUNNING"] = 2;
            values[valuesById[3] = "PHASE_PAUSED"] = 3;
            values[valuesById[4] = "PHASE_FINISHED"] = 4;
            values[valuesById[5] = "PHASE_ABORTED"] = 5;
            return values;
        })();

        /**
         * OfferStatus enum.
         * @name bazaar.v2.OfferStatus
         * @enum {number}
         * @property {number} OFFER_STATUS_OPEN=1 OFFER_STATUS_OPEN value
         * @property {number} OFFER_STATUS_ACCEPTED=2 OFFER_STATUS_ACCEPTED value
         * @property {number} OFFER_STATUS_WITHDRAWN=3 OFFER_STATUS_WITHDRAWN value
         * @property {number} OFFER_STATUS_EXPIRED=4 OFFER_STATUS_EXPIRED value
         * @property {number} OFFER_STATUS_RUN_ENDED=5 OFFER_STATUS_RUN_ENDED value
         */
        v2.OfferStatus = (function() {
            var valuesById = $Object.create(null), values = $Object.create(valuesById);
            values[valuesById[1] = "OFFER_STATUS_OPEN"] = 1;
            values[valuesById[2] = "OFFER_STATUS_ACCEPTED"] = 2;
            values[valuesById[3] = "OFFER_STATUS_WITHDRAWN"] = 3;
            values[valuesById[4] = "OFFER_STATUS_EXPIRED"] = 4;
            values[valuesById[5] = "OFFER_STATUS_RUN_ENDED"] = 5;
            return values;
        })();

        /**
         * PublicationStatus enum.
         * @name bazaar.v2.PublicationStatus
         * @enum {number}
         * @property {number} PUBLICATION_STATUS_ACTIVE=1 PUBLICATION_STATUS_ACTIVE value
         * @property {number} PUBLICATION_STATUS_REPLACED=2 PUBLICATION_STATUS_REPLACED value
         * @property {number} PUBLICATION_STATUS_WITHDRAWN=3 PUBLICATION_STATUS_WITHDRAWN value
         * @property {number} PUBLICATION_STATUS_EXPIRED=4 PUBLICATION_STATUS_EXPIRED value
         * @property {number} PUBLICATION_STATUS_RUN_ENDED=5 PUBLICATION_STATUS_RUN_ENDED value
         */
        v2.PublicationStatus = (function() {
            var valuesById = $Object.create(null), values = $Object.create(valuesById);
            values[valuesById[1] = "PUBLICATION_STATUS_ACTIVE"] = 1;
            values[valuesById[2] = "PUBLICATION_STATUS_REPLACED"] = 2;
            values[valuesById[3] = "PUBLICATION_STATUS_WITHDRAWN"] = 3;
            values[valuesById[4] = "PUBLICATION_STATUS_EXPIRED"] = 4;
            values[valuesById[5] = "PUBLICATION_STATUS_RUN_ENDED"] = 5;
            return values;
        })();

        /**
         * ResultCode enum.
         * @name bazaar.v2.ResultCode
         * @enum {number}
         * @property {number} RESULT_CODE_OK=1 RESULT_CODE_OK value
         * @property {number} RESULT_CODE_REQUEST_ID_CONFLICT=2 RESULT_CODE_REQUEST_ID_CONFLICT value
         * @property {number} RESULT_CODE_RUN_NOT_RUNNING=3 RESULT_CODE_RUN_NOT_RUNNING value
         * @property {number} RESULT_CODE_RATE_LIMITED=4 RESULT_CODE_RATE_LIMITED value
         * @property {number} RESULT_CODE_INVALID_ARGUMENT=5 RESULT_CODE_INVALID_ARGUMENT value
         * @property {number} RESULT_CODE_NOT_FOUND=6 RESULT_CODE_NOT_FOUND value
         * @property {number} RESULT_CODE_EXPIRED=7 RESULT_CODE_EXPIRED value
         * @property {number} RESULT_CODE_NOT_OPEN=8 RESULT_CODE_NOT_OPEN value
         * @property {number} RESULT_CODE_LIMIT_REACHED=9 RESULT_CODE_LIMIT_REACHED value
         * @property {number} RESULT_CODE_INSUFFICIENT_RESOURCES=10 RESULT_CODE_INSUFFICIENT_RESOURCES value
         * @property {number} RESULT_CODE_STATION_FAILED=11 RESULT_CODE_STATION_FAILED value
         */
        v2.ResultCode = (function() {
            var valuesById = $Object.create(null), values = $Object.create(valuesById);
            values[valuesById[1] = "RESULT_CODE_OK"] = 1;
            values[valuesById[2] = "RESULT_CODE_REQUEST_ID_CONFLICT"] = 2;
            values[valuesById[3] = "RESULT_CODE_RUN_NOT_RUNNING"] = 3;
            values[valuesById[4] = "RESULT_CODE_RATE_LIMITED"] = 4;
            values[valuesById[5] = "RESULT_CODE_INVALID_ARGUMENT"] = 5;
            values[valuesById[6] = "RESULT_CODE_NOT_FOUND"] = 6;
            values[valuesById[7] = "RESULT_CODE_EXPIRED"] = 7;
            values[valuesById[8] = "RESULT_CODE_NOT_OPEN"] = 8;
            values[valuesById[9] = "RESULT_CODE_LIMIT_REACHED"] = 9;
            values[valuesById[10] = "RESULT_CODE_INSUFFICIENT_RESOURCES"] = 10;
            values[valuesById[11] = "RESULT_CODE_STATION_FAILED"] = 11;
            return values;
        })();

        /**
         * ControlCode enum.
         * @name bazaar.v2.ControlCode
         * @enum {number}
         * @property {number} CONTROL_CODE_BAD_MESSAGE=1 CONTROL_CODE_BAD_MESSAGE value
         * @property {number} CONTROL_CODE_REQUEST_CAPACITY_EXCEEDED=2 CONTROL_CODE_REQUEST_CAPACITY_EXCEEDED value
         * @property {number} CONTROL_CODE_UNSUPPORTED_VERSION=3 CONTROL_CODE_UNSUPPORTED_VERSION value
         * @property {number} CONTROL_CODE_RUN_MISMATCH=4 CONTROL_CODE_RUN_MISMATCH value
         * @property {number} CONTROL_CODE_INVALID_AUTHENTICATION=5 CONTROL_CODE_INVALID_AUTHENTICATION value
         * @property {number} CONTROL_CODE_SESSION_FENCED=6 CONTROL_CODE_SESSION_FENCED value
         */
        v2.ControlCode = (function() {
            var valuesById = $Object.create(null), values = $Object.create(valuesById);
            values[valuesById[1] = "CONTROL_CODE_BAD_MESSAGE"] = 1;
            values[valuesById[2] = "CONTROL_CODE_REQUEST_CAPACITY_EXCEEDED"] = 2;
            values[valuesById[3] = "CONTROL_CODE_UNSUPPORTED_VERSION"] = 3;
            values[valuesById[4] = "CONTROL_CODE_RUN_MISMATCH"] = 4;
            values[valuesById[5] = "CONTROL_CODE_INVALID_AUTHENTICATION"] = 5;
            values[valuesById[6] = "CONTROL_CODE_SESSION_FENCED"] = 6;
            return values;
        })();

        v2.Bundle = (function() {

            /**
             * Properties of a Bundle.
             * @typedef {Object} bazaar.v2.Bundle.$Properties
             * @property {Long} water Bundle water
             * @property {Long} food Bundle food
             * @property {Long} components Bundle components
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a Bundle.
             * @memberof bazaar.v2
             * @interface IBundle
             * @augments bazaar.v2.Bundle.$Properties
             * @deprecated Use bazaar.v2.Bundle.$Properties instead.
             */

            /**
             * Shape of a Bundle.
             * @typedef {bazaar.v2.Bundle.$Properties} bazaar.v2.Bundle.$Shape
             */

            /**
             * Constructs a new Bundle.
             * @memberof bazaar.v2
             * @classdesc Represents a Bundle.
             * @constructor
             * @param {bazaar.v2.Bundle.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var Bundle = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * Bundle water.
             * @member {Long} water
             * @memberof bazaar.v2.Bundle
             * @instance
             */
            Bundle.prototype.water = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Bundle food.
             * @member {Long} food
             * @memberof bazaar.v2.Bundle
             * @instance
             */
            Bundle.prototype.food = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Bundle components.
             * @member {Long} components
             * @memberof bazaar.v2.Bundle
             * @instance
             */
            Bundle.prototype.components = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new Bundle instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.Bundle
             * @static
             * @param {bazaar.v2.Bundle.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.Bundle} Bundle instance
             * @type {{
             *   (properties: bazaar.v2.Bundle.$Shape): bazaar.v2.Bundle & bazaar.v2.Bundle.$Shape;
             *   (properties?: bazaar.v2.Bundle.$Properties): bazaar.v2.Bundle;
             * }}
             */
            Bundle.create = function(properties) {
                return new Bundle(properties);
            };

            /**
             * Encodes the specified Bundle message. Does not implicitly {@link bazaar.v2.Bundle.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.Bundle
             * @static
             * @param {bazaar.v2.Bundle.$Properties} message Bundle message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Bundle.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.water);
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.food);
                writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.components);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified Bundle message, length delimited. Does not implicitly {@link bazaar.v2.Bundle.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.Bundle
             * @static
             * @param {bazaar.v2.Bundle.$Properties} message Bundle message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Bundle.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a Bundle message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.Bundle
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.Bundle & bazaar.v2.Bundle.$Shape} Bundle
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Bundle.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.Bundle();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 0)
                                break;
                            message.water = reader.uint64();
                            continue;
                        }
                    case 2: {
                            if (wireType !== 0)
                                break;
                            message.food = reader.uint64();
                            continue;
                        }
                    case 3: {
                            if (wireType !== 0)
                                break;
                            message.components = reader.uint64();
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "water"))
                    throw $util.ProtocolError("missing required 'water'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "food"))
                    throw $util.ProtocolError("missing required 'food'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "components"))
                    throw $util.ProtocolError("missing required 'components'", { instance: message });
                return message;
            };

            /**
             * Decodes a Bundle message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.Bundle
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.Bundle & bazaar.v2.Bundle.$Shape} Bundle
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Bundle.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Bundle message.
             * @function verify
             * @memberof bazaar.v2.Bundle
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Bundle.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (!$util.isInteger(message.water) && !(message.water && $util.isInteger(message.water.low) && $util.isInteger(message.water.high)))
                    return "water: integer|Long expected";
                if (!$util.isInteger(message.food) && !(message.food && $util.isInteger(message.food.low) && $util.isInteger(message.food.high)))
                    return "food: integer|Long expected";
                if (!$util.isInteger(message.components) && !(message.components && $util.isInteger(message.components.low) && $util.isInteger(message.components.high)))
                    return "components: integer|Long expected";
                return null;
            };

            /**
             * Creates a Bundle message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.Bundle
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.Bundle} Bundle
             */
            Bundle.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.Bundle)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.Bundle: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.Bundle();
                if (object.water != null)
                    if ($util.Long)
                        message.water = $util.Long.fromValue(object.water, true);
                    else if (typeof object.water === "string")
                        message.water = $parseInt(object.water, 10);
                    else if (typeof object.water === "number")
                        message.water = object.water;
                    else if (typeof object.water === "object")
                        message.water = new $util.LongBits(object.water.low >>> 0, object.water.high >>> 0).toNumber(true);
                if (object.food != null)
                    if ($util.Long)
                        message.food = $util.Long.fromValue(object.food, true);
                    else if (typeof object.food === "string")
                        message.food = $parseInt(object.food, 10);
                    else if (typeof object.food === "number")
                        message.food = object.food;
                    else if (typeof object.food === "object")
                        message.food = new $util.LongBits(object.food.low >>> 0, object.food.high >>> 0).toNumber(true);
                if (object.components != null)
                    if ($util.Long)
                        message.components = $util.Long.fromValue(object.components, true);
                    else if (typeof object.components === "string")
                        message.components = $parseInt(object.components, 10);
                    else if (typeof object.components === "number")
                        message.components = object.components;
                    else if (typeof object.components === "object")
                        message.components = new $util.LongBits(object.components.low >>> 0, object.components.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a Bundle message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.Bundle
             * @static
             * @param {bazaar.v2.Bundle} message Bundle
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Bundle.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.water = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.water = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.food = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.food = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.components = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.components = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                }
                if (message.water != null && $Object.hasOwnProperty.call(message, "water"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.water = typeof message.water === "number" ? $BigInt(message.water) : $util.Long.fromBits(message.water.low >>> 0, message.water.high >>> 0, true).toBigInt();
                    else if (typeof message.water === "number")
                        object.water = options.longs === $String ? $String(message.water) : message.water;
                    else
                        object.water = options.longs === $String ? $util.Long.prototype.toString.call(message.water) : options.longs === $Number ? new $util.LongBits(message.water.low >>> 0, message.water.high >>> 0).toNumber(true) : message.water;
                if (message.food != null && $Object.hasOwnProperty.call(message, "food"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.food = typeof message.food === "number" ? $BigInt(message.food) : $util.Long.fromBits(message.food.low >>> 0, message.food.high >>> 0, true).toBigInt();
                    else if (typeof message.food === "number")
                        object.food = options.longs === $String ? $String(message.food) : message.food;
                    else
                        object.food = options.longs === $String ? $util.Long.prototype.toString.call(message.food) : options.longs === $Number ? new $util.LongBits(message.food.low >>> 0, message.food.high >>> 0).toNumber(true) : message.food;
                if (message.components != null && $Object.hasOwnProperty.call(message, "components"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.components = typeof message.components === "number" ? $BigInt(message.components) : $util.Long.fromBits(message.components.low >>> 0, message.components.high >>> 0, true).toBigInt();
                    else if (typeof message.components === "number")
                        object.components = options.longs === $String ? $String(message.components) : message.components;
                    else
                        object.components = options.longs === $String ? $util.Long.prototype.toString.call(message.components) : options.longs === $Number ? new $util.LongBits(message.components.low >>> 0, message.components.high >>> 0).toNumber(true) : message.components;
                return object;
            };

            /**
             * Converts this Bundle to JSON.
             * @function toJSON
             * @memberof bazaar.v2.Bundle
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Bundle.prototype.toJSON = function() {
                return Bundle.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for Bundle
             * @function getTypeUrl
             * @memberof bazaar.v2.Bundle
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            Bundle.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.Bundle";
            };

            return Bundle;
        })();

        v2.ListResource = (function() {

            /**
             * Properties of a ListResource.
             * @typedef {Object} bazaar.v2.ListResource.$Properties
             * @property {Array.<bazaar.v2.Resource>|null} [items] ListResource items
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a ListResource.
             * @memberof bazaar.v2
             * @interface IListResource
             * @augments bazaar.v2.ListResource.$Properties
             * @deprecated Use bazaar.v2.ListResource.$Properties instead.
             */

            /**
             * Shape of a ListResource.
             * @typedef {bazaar.v2.ListResource.$Properties} bazaar.v2.ListResource.$Shape
             */

            /**
             * Constructs a new ListResource.
             * @memberof bazaar.v2
             * @classdesc Represents a ListResource.
             * @constructor
             * @param {bazaar.v2.ListResource.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var ListResource = function (properties) {
                this.items = [];
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * ListResource items.
             * @member {Array.<bazaar.v2.Resource>} items
             * @memberof bazaar.v2.ListResource
             * @instance
             */
            ListResource.prototype.items = $util.emptyArray;

            /**
             * Creates a new ListResource instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.ListResource
             * @static
             * @param {bazaar.v2.ListResource.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.ListResource} ListResource instance
             * @type {{
             *   (properties: bazaar.v2.ListResource.$Shape): bazaar.v2.ListResource & bazaar.v2.ListResource.$Shape;
             *   (properties?: bazaar.v2.ListResource.$Properties): bazaar.v2.ListResource;
             * }}
             */
            ListResource.create = function(properties) {
                return new ListResource(properties);
            };

            /**
             * Encodes the specified ListResource message. Does not implicitly {@link bazaar.v2.ListResource.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.ListResource
             * @static
             * @param {bazaar.v2.ListResource.$Properties} message ListResource message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListResource.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.items != null && message.items.length)
                    for (var i = 0; i < message.items.length; ++i)
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.items[i]);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified ListResource message, length delimited. Does not implicitly {@link bazaar.v2.ListResource.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.ListResource
             * @static
             * @param {bazaar.v2.ListResource.$Properties} message ListResource message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListResource.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a ListResource message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.ListResource
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.ListResource & bazaar.v2.ListResource.$Shape} ListResource
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListResource.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.ListResource();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType === 2) {
                                var end2 = reader.uint32() + reader.pos;
                                if (end2 > reader.len)
                                    throw $RangeError("index out of range");
                                reader.len = end2;
                                while (reader.pos < end2) {
                                    start = reader.pos;
                                    value = reader.int32();
                                    if ($root.bazaar.v2.Resource[value] !== $undefined) {
                                        if (!(message.items && message.items.length))
                                            message.items = [];
                                        message.items.push(value);
                                    } else if (!reader.discardUnknown) {
                                        $util.makeProp(message, "$unknowns", false);
                                        (message.$unknowns || (message.$unknowns = [])).push($util.rawField(1, 0, reader.raw(start, reader.pos)));
                                    }
                                }
                                if (reader.pos !== end2)
                                    throw $RangeError("index out of range");
                                reader.len = end;
                                continue;
                            }
                            if (wireType !== 0)
                                break;
                            value = reader.int32();
                            if ($root.bazaar.v2.Resource[value] !== $undefined) {
                                if (!(message.items && message.items.length))
                                    message.items = [];
                                message.items.push(value);
                            } else if (!reader.discardUnknown) {
                                $util.makeProp(message, "$unknowns", false);
                                (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                            }
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes a ListResource message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.ListResource
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.ListResource & bazaar.v2.ListResource.$Shape} ListResource
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListResource.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ListResource message.
             * @function verify
             * @memberof bazaar.v2.ListResource
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ListResource.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (message.items != null && $Object.hasOwnProperty.call(message, "items")) {
                    if (!$Array.isArray(message.items))
                        return "items: array expected";
                    for (var i = 0; i < message.items.length; ++i)
                        switch (message.items[i]) {
                        default:
                            return "items: enum value[] expected";
                        case 1:
                        case 2:
                        case 3:
                            break;
                        }
                }
                return null;
            };

            /**
             * Creates a ListResource message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.ListResource
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.ListResource} ListResource
             */
            ListResource.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.ListResource)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.ListResource: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.ListResource();
                if (object.items) {
                    if (!$Array.isArray(object.items))
                        throw $TypeError(".bazaar.v2.ListResource.items: array expected");
                    message.items = [];
                    for (var i = 0; i < object.items.length; ++i)
                        switch (object.items[i]) {
                        case "RESOURCE_WATER":
                        case 1:
                            message.items[message.items.length] = 1;
                            break;
                        case "RESOURCE_FOOD":
                        case 2:
                            message.items[message.items.length] = 2;
                            break;
                        case "RESOURCE_COMPONENTS":
                        case 3:
                            message.items[message.items.length] = 3;
                            break;
                        default:
                        }
                }
                return message;
            };

            /**
             * Creates a plain object from a ListResource message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.ListResource
             * @static
             * @param {bazaar.v2.ListResource} message ListResource
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ListResource.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.arrays || options.defaults)
                    object.items = [];
                if (message.items && message.items.length) {
                    object.items = $Array(message.items.length);
                    for (var j = 0; j < message.items.length; ++j)
                        object.items[j] = options.enums === $String ? $root.bazaar.v2.Resource[message.items[j]] === $undefined ? message.items[j] : $root.bazaar.v2.Resource[message.items[j]] : message.items[j];
                }
                return object;
            };

            /**
             * Converts this ListResource to JSON.
             * @function toJSON
             * @memberof bazaar.v2.ListResource
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ListResource.prototype.toJSON = function() {
                return ListResource.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for ListResource
             * @function getTypeUrl
             * @memberof bazaar.v2.ListResource
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            ListResource.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.ListResource";
            };

            return ListResource;
        })();

        v2.AdvertiseBody = (function() {

            /**
             * Properties of an AdvertiseBody.
             * @typedef {Object} bazaar.v2.AdvertiseBody.$Properties
             * @property {bazaar.v2.ListResource.$Properties} selling AdvertiseBody selling
             * @property {bazaar.v2.ListResource.$Properties} seeking AdvertiseBody seeking
             * @property {Long} expires_tick AdvertiseBody expires_tick
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an AdvertiseBody.
             * @memberof bazaar.v2
             * @interface IAdvertiseBody
             * @augments bazaar.v2.AdvertiseBody.$Properties
             * @deprecated Use bazaar.v2.AdvertiseBody.$Properties instead.
             */

            /**
             * Shape of an AdvertiseBody.
             * @typedef {bazaar.v2.AdvertiseBody.$Properties} bazaar.v2.AdvertiseBody.$Shape
             */

            /**
             * Constructs a new AdvertiseBody.
             * @memberof bazaar.v2
             * @classdesc Represents an AdvertiseBody.
             * @constructor
             * @param {bazaar.v2.AdvertiseBody.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var AdvertiseBody = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * AdvertiseBody selling.
             * @member {bazaar.v2.ListResource.$Properties} selling
             * @memberof bazaar.v2.AdvertiseBody
             * @instance
             */
            AdvertiseBody.prototype.selling = null;

            /**
             * AdvertiseBody seeking.
             * @member {bazaar.v2.ListResource.$Properties} seeking
             * @memberof bazaar.v2.AdvertiseBody
             * @instance
             */
            AdvertiseBody.prototype.seeking = null;

            /**
             * AdvertiseBody expires_tick.
             * @member {Long} expires_tick
             * @memberof bazaar.v2.AdvertiseBody
             * @instance
             */
            AdvertiseBody.prototype.expires_tick = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new AdvertiseBody instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.AdvertiseBody
             * @static
             * @param {bazaar.v2.AdvertiseBody.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.AdvertiseBody} AdvertiseBody instance
             * @type {{
             *   (properties: bazaar.v2.AdvertiseBody.$Shape): bazaar.v2.AdvertiseBody & bazaar.v2.AdvertiseBody.$Shape;
             *   (properties?: bazaar.v2.AdvertiseBody.$Properties): bazaar.v2.AdvertiseBody;
             * }}
             */
            AdvertiseBody.create = function(properties) {
                return new AdvertiseBody(properties);
            };

            /**
             * Encodes the specified AdvertiseBody message. Does not implicitly {@link bazaar.v2.AdvertiseBody.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.AdvertiseBody
             * @static
             * @param {bazaar.v2.AdvertiseBody.$Properties} message AdvertiseBody message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AdvertiseBody.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                $root.bazaar.v2.ListResource.encode(message.selling, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.ListResource.encode(message.seeking, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
                writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.expires_tick);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified AdvertiseBody message, length delimited. Does not implicitly {@link bazaar.v2.AdvertiseBody.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.AdvertiseBody
             * @static
             * @param {bazaar.v2.AdvertiseBody.$Properties} message AdvertiseBody message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AdvertiseBody.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an AdvertiseBody message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.AdvertiseBody
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.AdvertiseBody & bazaar.v2.AdvertiseBody.$Shape} AdvertiseBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AdvertiseBody.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.AdvertiseBody();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            message.selling = $root.bazaar.v2.ListResource.decode(reader, reader.uint32(), $undefined, _depth + 1, message.selling);
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.seeking = $root.bazaar.v2.ListResource.decode(reader, reader.uint32(), $undefined, _depth + 1, message.seeking);
                            continue;
                        }
                    case 3: {
                            if (wireType !== 0)
                                break;
                            message.expires_tick = reader.uint64();
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "selling"))
                    throw $util.ProtocolError("missing required 'selling'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "seeking"))
                    throw $util.ProtocolError("missing required 'seeking'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "expires_tick"))
                    throw $util.ProtocolError("missing required 'expires_tick'", { instance: message });
                return message;
            };

            /**
             * Decodes an AdvertiseBody message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.AdvertiseBody
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.AdvertiseBody & bazaar.v2.AdvertiseBody.$Shape} AdvertiseBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AdvertiseBody.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AdvertiseBody message.
             * @function verify
             * @memberof bazaar.v2.AdvertiseBody
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AdvertiseBody.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                {
                    var error = $root.bazaar.v2.ListResource.verify(message.selling, _depth + 1);
                    if (error)
                        return "selling." + error;
                }
                {
                    var error = $root.bazaar.v2.ListResource.verify(message.seeking, _depth + 1);
                    if (error)
                        return "seeking." + error;
                }
                if (!$util.isInteger(message.expires_tick) && !(message.expires_tick && $util.isInteger(message.expires_tick.low) && $util.isInteger(message.expires_tick.high)))
                    return "expires_tick: integer|Long expected";
                return null;
            };

            /**
             * Creates an AdvertiseBody message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.AdvertiseBody
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.AdvertiseBody} AdvertiseBody
             */
            AdvertiseBody.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.AdvertiseBody)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.AdvertiseBody: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.AdvertiseBody();
                if (object.selling != null) {
                    if (!$util.isObject(object.selling))
                        throw $TypeError(".bazaar.v2.AdvertiseBody.selling: object expected");
                    message.selling = $root.bazaar.v2.ListResource.fromObject(object.selling, _depth + 1);
                }
                if (object.seeking != null) {
                    if (!$util.isObject(object.seeking))
                        throw $TypeError(".bazaar.v2.AdvertiseBody.seeking: object expected");
                    message.seeking = $root.bazaar.v2.ListResource.fromObject(object.seeking, _depth + 1);
                }
                if (object.expires_tick != null)
                    if ($util.Long)
                        message.expires_tick = $util.Long.fromValue(object.expires_tick, true);
                    else if (typeof object.expires_tick === "string")
                        message.expires_tick = $parseInt(object.expires_tick, 10);
                    else if (typeof object.expires_tick === "number")
                        message.expires_tick = object.expires_tick;
                    else if (typeof object.expires_tick === "object")
                        message.expires_tick = new $util.LongBits(object.expires_tick.low >>> 0, object.expires_tick.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from an AdvertiseBody message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.AdvertiseBody
             * @static
             * @param {bazaar.v2.AdvertiseBody} message AdvertiseBody
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AdvertiseBody.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.selling = null;
                    object.seeking = null;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.expires_tick = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.expires_tick = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                }
                if (message.selling != null && $Object.hasOwnProperty.call(message, "selling"))
                    object.selling = $root.bazaar.v2.ListResource.toObject(message.selling, options, _depth + 1);
                if (message.seeking != null && $Object.hasOwnProperty.call(message, "seeking"))
                    object.seeking = $root.bazaar.v2.ListResource.toObject(message.seeking, options, _depth + 1);
                if (message.expires_tick != null && $Object.hasOwnProperty.call(message, "expires_tick"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.expires_tick = typeof message.expires_tick === "number" ? $BigInt(message.expires_tick) : $util.Long.fromBits(message.expires_tick.low >>> 0, message.expires_tick.high >>> 0, true).toBigInt();
                    else if (typeof message.expires_tick === "number")
                        object.expires_tick = options.longs === $String ? $String(message.expires_tick) : message.expires_tick;
                    else
                        object.expires_tick = options.longs === $String ? $util.Long.prototype.toString.call(message.expires_tick) : options.longs === $Number ? new $util.LongBits(message.expires_tick.low >>> 0, message.expires_tick.high >>> 0).toNumber(true) : message.expires_tick;
                return object;
            };

            /**
             * Converts this AdvertiseBody to JSON.
             * @function toJSON
             * @memberof bazaar.v2.AdvertiseBody
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AdvertiseBody.prototype.toJSON = function() {
                return AdvertiseBody.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for AdvertiseBody
             * @function getTypeUrl
             * @memberof bazaar.v2.AdvertiseBody
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            AdvertiseBody.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.AdvertiseBody";
            };

            return AdvertiseBody;
        })();

        v2.OfferBody = (function() {

            /**
             * Properties of an OfferBody.
             * @typedef {Object} bazaar.v2.OfferBody.$Properties
             * @property {string} recipient_id OfferBody recipient_id
             * @property {bazaar.v2.Bundle.$Properties} give OfferBody give
             * @property {bazaar.v2.Bundle.$Properties} receive OfferBody receive
             * @property {Long} expires_tick OfferBody expires_tick
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an OfferBody.
             * @memberof bazaar.v2
             * @interface IOfferBody
             * @augments bazaar.v2.OfferBody.$Properties
             * @deprecated Use bazaar.v2.OfferBody.$Properties instead.
             */

            /**
             * Shape of an OfferBody.
             * @typedef {bazaar.v2.OfferBody.$Properties} bazaar.v2.OfferBody.$Shape
             */

            /**
             * Constructs a new OfferBody.
             * @memberof bazaar.v2
             * @classdesc Represents an OfferBody.
             * @constructor
             * @param {bazaar.v2.OfferBody.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var OfferBody = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * OfferBody recipient_id.
             * @member {string} recipient_id
             * @memberof bazaar.v2.OfferBody
             * @instance
             */
            OfferBody.prototype.recipient_id = "";

            /**
             * OfferBody give.
             * @member {bazaar.v2.Bundle.$Properties} give
             * @memberof bazaar.v2.OfferBody
             * @instance
             */
            OfferBody.prototype.give = null;

            /**
             * OfferBody receive.
             * @member {bazaar.v2.Bundle.$Properties} receive
             * @memberof bazaar.v2.OfferBody
             * @instance
             */
            OfferBody.prototype.receive = null;

            /**
             * OfferBody expires_tick.
             * @member {Long} expires_tick
             * @memberof bazaar.v2.OfferBody
             * @instance
             */
            OfferBody.prototype.expires_tick = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new OfferBody instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.OfferBody
             * @static
             * @param {bazaar.v2.OfferBody.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.OfferBody} OfferBody instance
             * @type {{
             *   (properties: bazaar.v2.OfferBody.$Shape): bazaar.v2.OfferBody & bazaar.v2.OfferBody.$Shape;
             *   (properties?: bazaar.v2.OfferBody.$Properties): bazaar.v2.OfferBody;
             * }}
             */
            OfferBody.create = function(properties) {
                return new OfferBody(properties);
            };

            /**
             * Encodes the specified OfferBody message. Does not implicitly {@link bazaar.v2.OfferBody.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.OfferBody
             * @static
             * @param {bazaar.v2.OfferBody.$Properties} message OfferBody message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            OfferBody.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.recipient_id);
                $root.bazaar.v2.Bundle.encode(message.give, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.Bundle.encode(message.receive, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
                writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.expires_tick);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified OfferBody message, length delimited. Does not implicitly {@link bazaar.v2.OfferBody.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.OfferBody
             * @static
             * @param {bazaar.v2.OfferBody.$Properties} message OfferBody message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            OfferBody.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an OfferBody message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.OfferBody
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.OfferBody & bazaar.v2.OfferBody.$Shape} OfferBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            OfferBody.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.OfferBody();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            message.recipient_id = reader.string();
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.give = $root.bazaar.v2.Bundle.decode(reader, reader.uint32(), $undefined, _depth + 1, message.give);
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.receive = $root.bazaar.v2.Bundle.decode(reader, reader.uint32(), $undefined, _depth + 1, message.receive);
                            continue;
                        }
                    case 4: {
                            if (wireType !== 0)
                                break;
                            message.expires_tick = reader.uint64();
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "recipient_id"))
                    throw $util.ProtocolError("missing required 'recipient_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "give"))
                    throw $util.ProtocolError("missing required 'give'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "receive"))
                    throw $util.ProtocolError("missing required 'receive'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "expires_tick"))
                    throw $util.ProtocolError("missing required 'expires_tick'", { instance: message });
                return message;
            };

            /**
             * Decodes an OfferBody message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.OfferBody
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.OfferBody & bazaar.v2.OfferBody.$Shape} OfferBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            OfferBody.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an OfferBody message.
             * @function verify
             * @memberof bazaar.v2.OfferBody
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            OfferBody.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (!$util.isString(message.recipient_id))
                    return "recipient_id: string expected";
                {
                    var error = $root.bazaar.v2.Bundle.verify(message.give, _depth + 1);
                    if (error)
                        return "give." + error;
                }
                {
                    var error = $root.bazaar.v2.Bundle.verify(message.receive, _depth + 1);
                    if (error)
                        return "receive." + error;
                }
                if (!$util.isInteger(message.expires_tick) && !(message.expires_tick && $util.isInteger(message.expires_tick.low) && $util.isInteger(message.expires_tick.high)))
                    return "expires_tick: integer|Long expected";
                return null;
            };

            /**
             * Creates an OfferBody message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.OfferBody
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.OfferBody} OfferBody
             */
            OfferBody.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.OfferBody)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.OfferBody: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.OfferBody();
                if (object.recipient_id != null)
                    message.recipient_id = $String(object.recipient_id);
                if (object.give != null) {
                    if (!$util.isObject(object.give))
                        throw $TypeError(".bazaar.v2.OfferBody.give: object expected");
                    message.give = $root.bazaar.v2.Bundle.fromObject(object.give, _depth + 1);
                }
                if (object.receive != null) {
                    if (!$util.isObject(object.receive))
                        throw $TypeError(".bazaar.v2.OfferBody.receive: object expected");
                    message.receive = $root.bazaar.v2.Bundle.fromObject(object.receive, _depth + 1);
                }
                if (object.expires_tick != null)
                    if ($util.Long)
                        message.expires_tick = $util.Long.fromValue(object.expires_tick, true);
                    else if (typeof object.expires_tick === "string")
                        message.expires_tick = $parseInt(object.expires_tick, 10);
                    else if (typeof object.expires_tick === "number")
                        message.expires_tick = object.expires_tick;
                    else if (typeof object.expires_tick === "object")
                        message.expires_tick = new $util.LongBits(object.expires_tick.low >>> 0, object.expires_tick.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from an OfferBody message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.OfferBody
             * @static
             * @param {bazaar.v2.OfferBody} message OfferBody
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            OfferBody.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.recipient_id = "";
                    object.give = null;
                    object.receive = null;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.expires_tick = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.expires_tick = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                }
                if (message.recipient_id != null && $Object.hasOwnProperty.call(message, "recipient_id"))
                    object.recipient_id = message.recipient_id;
                if (message.give != null && $Object.hasOwnProperty.call(message, "give"))
                    object.give = $root.bazaar.v2.Bundle.toObject(message.give, options, _depth + 1);
                if (message.receive != null && $Object.hasOwnProperty.call(message, "receive"))
                    object.receive = $root.bazaar.v2.Bundle.toObject(message.receive, options, _depth + 1);
                if (message.expires_tick != null && $Object.hasOwnProperty.call(message, "expires_tick"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.expires_tick = typeof message.expires_tick === "number" ? $BigInt(message.expires_tick) : $util.Long.fromBits(message.expires_tick.low >>> 0, message.expires_tick.high >>> 0, true).toBigInt();
                    else if (typeof message.expires_tick === "number")
                        object.expires_tick = options.longs === $String ? $String(message.expires_tick) : message.expires_tick;
                    else
                        object.expires_tick = options.longs === $String ? $util.Long.prototype.toString.call(message.expires_tick) : options.longs === $Number ? new $util.LongBits(message.expires_tick.low >>> 0, message.expires_tick.high >>> 0).toNumber(true) : message.expires_tick;
                return object;
            };

            /**
             * Converts this OfferBody to JSON.
             * @function toJSON
             * @memberof bazaar.v2.OfferBody
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            OfferBody.prototype.toJSON = function() {
                return OfferBody.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for OfferBody
             * @function getTypeUrl
             * @memberof bazaar.v2.OfferBody
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            OfferBody.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.OfferBody";
            };

            return OfferBody;
        })();

        v2.AcceptBody = (function() {

            /**
             * Properties of an AcceptBody.
             * @typedef {Object} bazaar.v2.AcceptBody.$Properties
             * @property {string} offer_id AcceptBody offer_id
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an AcceptBody.
             * @memberof bazaar.v2
             * @interface IAcceptBody
             * @augments bazaar.v2.AcceptBody.$Properties
             * @deprecated Use bazaar.v2.AcceptBody.$Properties instead.
             */

            /**
             * Shape of an AcceptBody.
             * @typedef {bazaar.v2.AcceptBody.$Properties} bazaar.v2.AcceptBody.$Shape
             */

            /**
             * Constructs a new AcceptBody.
             * @memberof bazaar.v2
             * @classdesc Represents an AcceptBody.
             * @constructor
             * @param {bazaar.v2.AcceptBody.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var AcceptBody = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * AcceptBody offer_id.
             * @member {string} offer_id
             * @memberof bazaar.v2.AcceptBody
             * @instance
             */
            AcceptBody.prototype.offer_id = "";

            /**
             * Creates a new AcceptBody instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.AcceptBody
             * @static
             * @param {bazaar.v2.AcceptBody.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.AcceptBody} AcceptBody instance
             * @type {{
             *   (properties: bazaar.v2.AcceptBody.$Shape): bazaar.v2.AcceptBody & bazaar.v2.AcceptBody.$Shape;
             *   (properties?: bazaar.v2.AcceptBody.$Properties): bazaar.v2.AcceptBody;
             * }}
             */
            AcceptBody.create = function(properties) {
                return new AcceptBody(properties);
            };

            /**
             * Encodes the specified AcceptBody message. Does not implicitly {@link bazaar.v2.AcceptBody.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.AcceptBody
             * @static
             * @param {bazaar.v2.AcceptBody.$Properties} message AcceptBody message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AcceptBody.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.offer_id);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified AcceptBody message, length delimited. Does not implicitly {@link bazaar.v2.AcceptBody.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.AcceptBody
             * @static
             * @param {bazaar.v2.AcceptBody.$Properties} message AcceptBody message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AcceptBody.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an AcceptBody message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.AcceptBody
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.AcceptBody & bazaar.v2.AcceptBody.$Shape} AcceptBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AcceptBody.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.AcceptBody();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            message.offer_id = reader.string();
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "offer_id"))
                    throw $util.ProtocolError("missing required 'offer_id'", { instance: message });
                return message;
            };

            /**
             * Decodes an AcceptBody message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.AcceptBody
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.AcceptBody & bazaar.v2.AcceptBody.$Shape} AcceptBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AcceptBody.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AcceptBody message.
             * @function verify
             * @memberof bazaar.v2.AcceptBody
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AcceptBody.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (!$util.isString(message.offer_id))
                    return "offer_id: string expected";
                return null;
            };

            /**
             * Creates an AcceptBody message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.AcceptBody
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.AcceptBody} AcceptBody
             */
            AcceptBody.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.AcceptBody)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.AcceptBody: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.AcceptBody();
                if (object.offer_id != null)
                    message.offer_id = $String(object.offer_id);
                return message;
            };

            /**
             * Creates a plain object from an AcceptBody message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.AcceptBody
             * @static
             * @param {bazaar.v2.AcceptBody} message AcceptBody
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AcceptBody.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults)
                    object.offer_id = "";
                if (message.offer_id != null && $Object.hasOwnProperty.call(message, "offer_id"))
                    object.offer_id = message.offer_id;
                return object;
            };

            /**
             * Converts this AcceptBody to JSON.
             * @function toJSON
             * @memberof bazaar.v2.AcceptBody
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AcceptBody.prototype.toJSON = function() {
                return AcceptBody.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for AcceptBody
             * @function getTypeUrl
             * @memberof bazaar.v2.AcceptBody
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            AcceptBody.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.AcceptBody";
            };

            return AcceptBody;
        })();

        v2.WithdrawBody = (function() {

            /**
             * Properties of a WithdrawBody.
             * @typedef {Object} bazaar.v2.WithdrawBody.$Properties
             * @property {string} object_id WithdrawBody object_id
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a WithdrawBody.
             * @memberof bazaar.v2
             * @interface IWithdrawBody
             * @augments bazaar.v2.WithdrawBody.$Properties
             * @deprecated Use bazaar.v2.WithdrawBody.$Properties instead.
             */

            /**
             * Shape of a WithdrawBody.
             * @typedef {bazaar.v2.WithdrawBody.$Properties} bazaar.v2.WithdrawBody.$Shape
             */

            /**
             * Constructs a new WithdrawBody.
             * @memberof bazaar.v2
             * @classdesc Represents a WithdrawBody.
             * @constructor
             * @param {bazaar.v2.WithdrawBody.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var WithdrawBody = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * WithdrawBody object_id.
             * @member {string} object_id
             * @memberof bazaar.v2.WithdrawBody
             * @instance
             */
            WithdrawBody.prototype.object_id = "";

            /**
             * Creates a new WithdrawBody instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.WithdrawBody
             * @static
             * @param {bazaar.v2.WithdrawBody.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.WithdrawBody} WithdrawBody instance
             * @type {{
             *   (properties: bazaar.v2.WithdrawBody.$Shape): bazaar.v2.WithdrawBody & bazaar.v2.WithdrawBody.$Shape;
             *   (properties?: bazaar.v2.WithdrawBody.$Properties): bazaar.v2.WithdrawBody;
             * }}
             */
            WithdrawBody.create = function(properties) {
                return new WithdrawBody(properties);
            };

            /**
             * Encodes the specified WithdrawBody message. Does not implicitly {@link bazaar.v2.WithdrawBody.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.WithdrawBody
             * @static
             * @param {bazaar.v2.WithdrawBody.$Properties} message WithdrawBody message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            WithdrawBody.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.object_id);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified WithdrawBody message, length delimited. Does not implicitly {@link bazaar.v2.WithdrawBody.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.WithdrawBody
             * @static
             * @param {bazaar.v2.WithdrawBody.$Properties} message WithdrawBody message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            WithdrawBody.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a WithdrawBody message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.WithdrawBody
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.WithdrawBody & bazaar.v2.WithdrawBody.$Shape} WithdrawBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            WithdrawBody.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.WithdrawBody();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            message.object_id = reader.string();
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "object_id"))
                    throw $util.ProtocolError("missing required 'object_id'", { instance: message });
                return message;
            };

            /**
             * Decodes a WithdrawBody message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.WithdrawBody
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.WithdrawBody & bazaar.v2.WithdrawBody.$Shape} WithdrawBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            WithdrawBody.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a WithdrawBody message.
             * @function verify
             * @memberof bazaar.v2.WithdrawBody
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            WithdrawBody.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (!$util.isString(message.object_id))
                    return "object_id: string expected";
                return null;
            };

            /**
             * Creates a WithdrawBody message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.WithdrawBody
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.WithdrawBody} WithdrawBody
             */
            WithdrawBody.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.WithdrawBody)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.WithdrawBody: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.WithdrawBody();
                if (object.object_id != null)
                    message.object_id = $String(object.object_id);
                return message;
            };

            /**
             * Creates a plain object from a WithdrawBody message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.WithdrawBody
             * @static
             * @param {bazaar.v2.WithdrawBody} message WithdrawBody
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            WithdrawBody.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults)
                    object.object_id = "";
                if (message.object_id != null && $Object.hasOwnProperty.call(message, "object_id"))
                    object.object_id = message.object_id;
                return object;
            };

            /**
             * Converts this WithdrawBody to JSON.
             * @function toJSON
             * @memberof bazaar.v2.WithdrawBody
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            WithdrawBody.prototype.toJSON = function() {
                return WithdrawBody.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for WithdrawBody
             * @function getTypeUrl
             * @memberof bazaar.v2.WithdrawBody
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            WithdrawBody.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.WithdrawBody";
            };

            return WithdrawBody;
        })();

        /**
         * AdvertiseType enum.
         * @name bazaar.v2.AdvertiseType
         * @enum {number}
         * @property {number} ADVERTISE_TYPE_ADVERTISE=1 ADVERTISE_TYPE_ADVERTISE value
         */
        v2.AdvertiseType = (function() {
            var valuesById = $Object.create(null), values = $Object.create(valuesById);
            values[valuesById[1] = "ADVERTISE_TYPE_ADVERTISE"] = 1;
            return values;
        })();

        v2.Advertise = (function() {

            /**
             * Properties of an Advertise.
             * @typedef {Object} bazaar.v2.Advertise.$Properties
             * @property {bazaar.v2.AdvertiseType} type Advertise type
             * @property {string} protocol_version Advertise protocol_version
             * @property {string} run_id Advertise run_id
             * @property {string} request_id Advertise request_id
             * @property {bazaar.v2.AdvertiseBody.$Properties} body Advertise body
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an Advertise.
             * @memberof bazaar.v2
             * @interface IAdvertise
             * @augments bazaar.v2.Advertise.$Properties
             * @deprecated Use bazaar.v2.Advertise.$Properties instead.
             */

            /**
             * Shape of an Advertise.
             * @typedef {bazaar.v2.Advertise.$Properties} bazaar.v2.Advertise.$Shape
             */

            /**
             * Constructs a new Advertise.
             * @memberof bazaar.v2
             * @classdesc Represents an Advertise.
             * @constructor
             * @param {bazaar.v2.Advertise.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var Advertise = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * Advertise type.
             * @member {bazaar.v2.AdvertiseType} type
             * @memberof bazaar.v2.Advertise
             * @instance
             */
            Advertise.prototype.type = 1;

            /**
             * Advertise protocol_version.
             * @member {string} protocol_version
             * @memberof bazaar.v2.Advertise
             * @instance
             */
            Advertise.prototype.protocol_version = "";

            /**
             * Advertise run_id.
             * @member {string} run_id
             * @memberof bazaar.v2.Advertise
             * @instance
             */
            Advertise.prototype.run_id = "";

            /**
             * Advertise request_id.
             * @member {string} request_id
             * @memberof bazaar.v2.Advertise
             * @instance
             */
            Advertise.prototype.request_id = "";

            /**
             * Advertise body.
             * @member {bazaar.v2.AdvertiseBody.$Properties} body
             * @memberof bazaar.v2.Advertise
             * @instance
             */
            Advertise.prototype.body = null;

            /**
             * Creates a new Advertise instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.Advertise
             * @static
             * @param {bazaar.v2.Advertise.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.Advertise} Advertise instance
             * @type {{
             *   (properties: bazaar.v2.Advertise.$Shape): bazaar.v2.Advertise & bazaar.v2.Advertise.$Shape;
             *   (properties?: bazaar.v2.Advertise.$Properties): bazaar.v2.Advertise;
             * }}
             */
            Advertise.create = function(properties) {
                return new Advertise(properties);
            };

            /**
             * Encodes the specified Advertise message. Does not implicitly {@link bazaar.v2.Advertise.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.Advertise
             * @static
             * @param {bazaar.v2.Advertise.$Properties} message Advertise message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Advertise.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.protocol_version);
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.run_id);
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.request_id);
                $root.bazaar.v2.AdvertiseBody.encode(message.body, writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified Advertise message, length delimited. Does not implicitly {@link bazaar.v2.Advertise.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.Advertise
             * @static
             * @param {bazaar.v2.Advertise.$Properties} message Advertise message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Advertise.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an Advertise message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.Advertise
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.Advertise & bazaar.v2.Advertise.$Shape} Advertise
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Advertise.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.Advertise();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 0)
                                break;
                            value = reader.int32();
                            if ($root.bazaar.v2.AdvertiseType[value] !== $undefined)
                                message.type = value;
                            else if (!reader.discardUnknown) {
                                $util.makeProp(message, "$unknowns", false);
                                (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                            }
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.protocol_version = reader.string();
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.run_id = reader.string();
                            continue;
                        }
                    case 4: {
                            if (wireType !== 2)
                                break;
                            message.request_id = reader.string();
                            continue;
                        }
                    case 5: {
                            if (wireType !== 2)
                                break;
                            message.body = $root.bazaar.v2.AdvertiseBody.decode(reader, reader.uint32(), $undefined, _depth + 1, message.body);
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "type"))
                    throw $util.ProtocolError("missing required 'type'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "protocol_version"))
                    throw $util.ProtocolError("missing required 'protocol_version'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "run_id"))
                    throw $util.ProtocolError("missing required 'run_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "request_id"))
                    throw $util.ProtocolError("missing required 'request_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "body"))
                    throw $util.ProtocolError("missing required 'body'", { instance: message });
                return message;
            };

            /**
             * Decodes an Advertise message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.Advertise
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.Advertise & bazaar.v2.Advertise.$Shape} Advertise
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Advertise.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Advertise message.
             * @function verify
             * @memberof bazaar.v2.Advertise
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Advertise.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 1:
                    break;
                }
                if (!$util.isString(message.protocol_version))
                    return "protocol_version: string expected";
                if (!$util.isString(message.run_id))
                    return "run_id: string expected";
                if (!$util.isString(message.request_id))
                    return "request_id: string expected";
                {
                    var error = $root.bazaar.v2.AdvertiseBody.verify(message.body, _depth + 1);
                    if (error)
                        return "body." + error;
                }
                return null;
            };

            /**
             * Creates an Advertise message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.Advertise
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.Advertise} Advertise
             */
            Advertise.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.Advertise)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.Advertise: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.Advertise();
                switch (object.type) {
                case "ADVERTISE_TYPE_ADVERTISE":
                case 1:
                    message.type = 1;
                    break;
                default:
                }
                if (object.protocol_version != null)
                    message.protocol_version = $String(object.protocol_version);
                if (object.run_id != null)
                    message.run_id = $String(object.run_id);
                if (object.request_id != null)
                    message.request_id = $String(object.request_id);
                if (object.body != null) {
                    if (!$util.isObject(object.body))
                        throw $TypeError(".bazaar.v2.Advertise.body: object expected");
                    message.body = $root.bazaar.v2.AdvertiseBody.fromObject(object.body, _depth + 1);
                }
                return message;
            };

            /**
             * Creates a plain object from an Advertise message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.Advertise
             * @static
             * @param {bazaar.v2.Advertise} message Advertise
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Advertise.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.type = options.enums === $String ? "ADVERTISE_TYPE_ADVERTISE" : 1;
                    object.protocol_version = "";
                    object.run_id = "";
                    object.request_id = "";
                    object.body = null;
                }
                if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                    object.type = options.enums === $String ? $root.bazaar.v2.AdvertiseType[message.type] === $undefined ? message.type : $root.bazaar.v2.AdvertiseType[message.type] : message.type;
                if (message.protocol_version != null && $Object.hasOwnProperty.call(message, "protocol_version"))
                    object.protocol_version = message.protocol_version;
                if (message.run_id != null && $Object.hasOwnProperty.call(message, "run_id"))
                    object.run_id = message.run_id;
                if (message.request_id != null && $Object.hasOwnProperty.call(message, "request_id"))
                    object.request_id = message.request_id;
                if (message.body != null && $Object.hasOwnProperty.call(message, "body"))
                    object.body = $root.bazaar.v2.AdvertiseBody.toObject(message.body, options, _depth + 1);
                return object;
            };

            /**
             * Converts this Advertise to JSON.
             * @function toJSON
             * @memberof bazaar.v2.Advertise
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Advertise.prototype.toJSON = function() {
                return Advertise.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for Advertise
             * @function getTypeUrl
             * @memberof bazaar.v2.Advertise
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            Advertise.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.Advertise";
            };

            return Advertise;
        })();

        /**
         * OfferCommandType enum.
         * @name bazaar.v2.OfferCommandType
         * @enum {number}
         * @property {number} OFFER_COMMAND_TYPE_OFFER=1 OFFER_COMMAND_TYPE_OFFER value
         */
        v2.OfferCommandType = (function() {
            var valuesById = $Object.create(null), values = $Object.create(valuesById);
            values[valuesById[1] = "OFFER_COMMAND_TYPE_OFFER"] = 1;
            return values;
        })();

        v2.OfferCommand = (function() {

            /**
             * Properties of an OfferCommand.
             * @typedef {Object} bazaar.v2.OfferCommand.$Properties
             * @property {bazaar.v2.OfferCommandType} type OfferCommand type
             * @property {string} protocol_version OfferCommand protocol_version
             * @property {string} run_id OfferCommand run_id
             * @property {string} request_id OfferCommand request_id
             * @property {bazaar.v2.OfferBody.$Properties} body OfferCommand body
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an OfferCommand.
             * @memberof bazaar.v2
             * @interface IOfferCommand
             * @augments bazaar.v2.OfferCommand.$Properties
             * @deprecated Use bazaar.v2.OfferCommand.$Properties instead.
             */

            /**
             * Shape of an OfferCommand.
             * @typedef {bazaar.v2.OfferCommand.$Properties} bazaar.v2.OfferCommand.$Shape
             */

            /**
             * Constructs a new OfferCommand.
             * @memberof bazaar.v2
             * @classdesc Represents an OfferCommand.
             * @constructor
             * @param {bazaar.v2.OfferCommand.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var OfferCommand = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * OfferCommand type.
             * @member {bazaar.v2.OfferCommandType} type
             * @memberof bazaar.v2.OfferCommand
             * @instance
             */
            OfferCommand.prototype.type = 1;

            /**
             * OfferCommand protocol_version.
             * @member {string} protocol_version
             * @memberof bazaar.v2.OfferCommand
             * @instance
             */
            OfferCommand.prototype.protocol_version = "";

            /**
             * OfferCommand run_id.
             * @member {string} run_id
             * @memberof bazaar.v2.OfferCommand
             * @instance
             */
            OfferCommand.prototype.run_id = "";

            /**
             * OfferCommand request_id.
             * @member {string} request_id
             * @memberof bazaar.v2.OfferCommand
             * @instance
             */
            OfferCommand.prototype.request_id = "";

            /**
             * OfferCommand body.
             * @member {bazaar.v2.OfferBody.$Properties} body
             * @memberof bazaar.v2.OfferCommand
             * @instance
             */
            OfferCommand.prototype.body = null;

            /**
             * Creates a new OfferCommand instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.OfferCommand
             * @static
             * @param {bazaar.v2.OfferCommand.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.OfferCommand} OfferCommand instance
             * @type {{
             *   (properties: bazaar.v2.OfferCommand.$Shape): bazaar.v2.OfferCommand & bazaar.v2.OfferCommand.$Shape;
             *   (properties?: bazaar.v2.OfferCommand.$Properties): bazaar.v2.OfferCommand;
             * }}
             */
            OfferCommand.create = function(properties) {
                return new OfferCommand(properties);
            };

            /**
             * Encodes the specified OfferCommand message. Does not implicitly {@link bazaar.v2.OfferCommand.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.OfferCommand
             * @static
             * @param {bazaar.v2.OfferCommand.$Properties} message OfferCommand message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            OfferCommand.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.protocol_version);
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.run_id);
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.request_id);
                $root.bazaar.v2.OfferBody.encode(message.body, writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified OfferCommand message, length delimited. Does not implicitly {@link bazaar.v2.OfferCommand.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.OfferCommand
             * @static
             * @param {bazaar.v2.OfferCommand.$Properties} message OfferCommand message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            OfferCommand.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an OfferCommand message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.OfferCommand
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.OfferCommand & bazaar.v2.OfferCommand.$Shape} OfferCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            OfferCommand.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.OfferCommand();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 0)
                                break;
                            value = reader.int32();
                            if ($root.bazaar.v2.OfferCommandType[value] !== $undefined)
                                message.type = value;
                            else if (!reader.discardUnknown) {
                                $util.makeProp(message, "$unknowns", false);
                                (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                            }
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.protocol_version = reader.string();
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.run_id = reader.string();
                            continue;
                        }
                    case 4: {
                            if (wireType !== 2)
                                break;
                            message.request_id = reader.string();
                            continue;
                        }
                    case 5: {
                            if (wireType !== 2)
                                break;
                            message.body = $root.bazaar.v2.OfferBody.decode(reader, reader.uint32(), $undefined, _depth + 1, message.body);
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "type"))
                    throw $util.ProtocolError("missing required 'type'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "protocol_version"))
                    throw $util.ProtocolError("missing required 'protocol_version'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "run_id"))
                    throw $util.ProtocolError("missing required 'run_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "request_id"))
                    throw $util.ProtocolError("missing required 'request_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "body"))
                    throw $util.ProtocolError("missing required 'body'", { instance: message });
                return message;
            };

            /**
             * Decodes an OfferCommand message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.OfferCommand
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.OfferCommand & bazaar.v2.OfferCommand.$Shape} OfferCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            OfferCommand.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an OfferCommand message.
             * @function verify
             * @memberof bazaar.v2.OfferCommand
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            OfferCommand.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 1:
                    break;
                }
                if (!$util.isString(message.protocol_version))
                    return "protocol_version: string expected";
                if (!$util.isString(message.run_id))
                    return "run_id: string expected";
                if (!$util.isString(message.request_id))
                    return "request_id: string expected";
                {
                    var error = $root.bazaar.v2.OfferBody.verify(message.body, _depth + 1);
                    if (error)
                        return "body." + error;
                }
                return null;
            };

            /**
             * Creates an OfferCommand message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.OfferCommand
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.OfferCommand} OfferCommand
             */
            OfferCommand.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.OfferCommand)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.OfferCommand: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.OfferCommand();
                switch (object.type) {
                case "OFFER_COMMAND_TYPE_OFFER":
                case 1:
                    message.type = 1;
                    break;
                default:
                }
                if (object.protocol_version != null)
                    message.protocol_version = $String(object.protocol_version);
                if (object.run_id != null)
                    message.run_id = $String(object.run_id);
                if (object.request_id != null)
                    message.request_id = $String(object.request_id);
                if (object.body != null) {
                    if (!$util.isObject(object.body))
                        throw $TypeError(".bazaar.v2.OfferCommand.body: object expected");
                    message.body = $root.bazaar.v2.OfferBody.fromObject(object.body, _depth + 1);
                }
                return message;
            };

            /**
             * Creates a plain object from an OfferCommand message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.OfferCommand
             * @static
             * @param {bazaar.v2.OfferCommand} message OfferCommand
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            OfferCommand.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.type = options.enums === $String ? "OFFER_COMMAND_TYPE_OFFER" : 1;
                    object.protocol_version = "";
                    object.run_id = "";
                    object.request_id = "";
                    object.body = null;
                }
                if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                    object.type = options.enums === $String ? $root.bazaar.v2.OfferCommandType[message.type] === $undefined ? message.type : $root.bazaar.v2.OfferCommandType[message.type] : message.type;
                if (message.protocol_version != null && $Object.hasOwnProperty.call(message, "protocol_version"))
                    object.protocol_version = message.protocol_version;
                if (message.run_id != null && $Object.hasOwnProperty.call(message, "run_id"))
                    object.run_id = message.run_id;
                if (message.request_id != null && $Object.hasOwnProperty.call(message, "request_id"))
                    object.request_id = message.request_id;
                if (message.body != null && $Object.hasOwnProperty.call(message, "body"))
                    object.body = $root.bazaar.v2.OfferBody.toObject(message.body, options, _depth + 1);
                return object;
            };

            /**
             * Converts this OfferCommand to JSON.
             * @function toJSON
             * @memberof bazaar.v2.OfferCommand
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            OfferCommand.prototype.toJSON = function() {
                return OfferCommand.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for OfferCommand
             * @function getTypeUrl
             * @memberof bazaar.v2.OfferCommand
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            OfferCommand.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.OfferCommand";
            };

            return OfferCommand;
        })();

        /**
         * AcceptType enum.
         * @name bazaar.v2.AcceptType
         * @enum {number}
         * @property {number} ACCEPT_TYPE_ACCEPT=1 ACCEPT_TYPE_ACCEPT value
         */
        v2.AcceptType = (function() {
            var valuesById = $Object.create(null), values = $Object.create(valuesById);
            values[valuesById[1] = "ACCEPT_TYPE_ACCEPT"] = 1;
            return values;
        })();

        v2.Accept = (function() {

            /**
             * Properties of an Accept.
             * @typedef {Object} bazaar.v2.Accept.$Properties
             * @property {bazaar.v2.AcceptType} type Accept type
             * @property {string} protocol_version Accept protocol_version
             * @property {string} run_id Accept run_id
             * @property {string} request_id Accept request_id
             * @property {bazaar.v2.AcceptBody.$Properties} body Accept body
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an Accept.
             * @memberof bazaar.v2
             * @interface IAccept
             * @augments bazaar.v2.Accept.$Properties
             * @deprecated Use bazaar.v2.Accept.$Properties instead.
             */

            /**
             * Shape of an Accept.
             * @typedef {bazaar.v2.Accept.$Properties} bazaar.v2.Accept.$Shape
             */

            /**
             * Constructs a new Accept.
             * @memberof bazaar.v2
             * @classdesc Represents an Accept.
             * @constructor
             * @param {bazaar.v2.Accept.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var Accept = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * Accept type.
             * @member {bazaar.v2.AcceptType} type
             * @memberof bazaar.v2.Accept
             * @instance
             */
            Accept.prototype.type = 1;

            /**
             * Accept protocol_version.
             * @member {string} protocol_version
             * @memberof bazaar.v2.Accept
             * @instance
             */
            Accept.prototype.protocol_version = "";

            /**
             * Accept run_id.
             * @member {string} run_id
             * @memberof bazaar.v2.Accept
             * @instance
             */
            Accept.prototype.run_id = "";

            /**
             * Accept request_id.
             * @member {string} request_id
             * @memberof bazaar.v2.Accept
             * @instance
             */
            Accept.prototype.request_id = "";

            /**
             * Accept body.
             * @member {bazaar.v2.AcceptBody.$Properties} body
             * @memberof bazaar.v2.Accept
             * @instance
             */
            Accept.prototype.body = null;

            /**
             * Creates a new Accept instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.Accept
             * @static
             * @param {bazaar.v2.Accept.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.Accept} Accept instance
             * @type {{
             *   (properties: bazaar.v2.Accept.$Shape): bazaar.v2.Accept & bazaar.v2.Accept.$Shape;
             *   (properties?: bazaar.v2.Accept.$Properties): bazaar.v2.Accept;
             * }}
             */
            Accept.create = function(properties) {
                return new Accept(properties);
            };

            /**
             * Encodes the specified Accept message. Does not implicitly {@link bazaar.v2.Accept.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.Accept
             * @static
             * @param {bazaar.v2.Accept.$Properties} message Accept message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Accept.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.protocol_version);
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.run_id);
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.request_id);
                $root.bazaar.v2.AcceptBody.encode(message.body, writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified Accept message, length delimited. Does not implicitly {@link bazaar.v2.Accept.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.Accept
             * @static
             * @param {bazaar.v2.Accept.$Properties} message Accept message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Accept.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an Accept message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.Accept
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.Accept & bazaar.v2.Accept.$Shape} Accept
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Accept.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.Accept();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 0)
                                break;
                            value = reader.int32();
                            if ($root.bazaar.v2.AcceptType[value] !== $undefined)
                                message.type = value;
                            else if (!reader.discardUnknown) {
                                $util.makeProp(message, "$unknowns", false);
                                (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                            }
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.protocol_version = reader.string();
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.run_id = reader.string();
                            continue;
                        }
                    case 4: {
                            if (wireType !== 2)
                                break;
                            message.request_id = reader.string();
                            continue;
                        }
                    case 5: {
                            if (wireType !== 2)
                                break;
                            message.body = $root.bazaar.v2.AcceptBody.decode(reader, reader.uint32(), $undefined, _depth + 1, message.body);
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "type"))
                    throw $util.ProtocolError("missing required 'type'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "protocol_version"))
                    throw $util.ProtocolError("missing required 'protocol_version'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "run_id"))
                    throw $util.ProtocolError("missing required 'run_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "request_id"))
                    throw $util.ProtocolError("missing required 'request_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "body"))
                    throw $util.ProtocolError("missing required 'body'", { instance: message });
                return message;
            };

            /**
             * Decodes an Accept message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.Accept
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.Accept & bazaar.v2.Accept.$Shape} Accept
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Accept.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Accept message.
             * @function verify
             * @memberof bazaar.v2.Accept
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Accept.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 1:
                    break;
                }
                if (!$util.isString(message.protocol_version))
                    return "protocol_version: string expected";
                if (!$util.isString(message.run_id))
                    return "run_id: string expected";
                if (!$util.isString(message.request_id))
                    return "request_id: string expected";
                {
                    var error = $root.bazaar.v2.AcceptBody.verify(message.body, _depth + 1);
                    if (error)
                        return "body." + error;
                }
                return null;
            };

            /**
             * Creates an Accept message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.Accept
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.Accept} Accept
             */
            Accept.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.Accept)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.Accept: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.Accept();
                switch (object.type) {
                case "ACCEPT_TYPE_ACCEPT":
                case 1:
                    message.type = 1;
                    break;
                default:
                }
                if (object.protocol_version != null)
                    message.protocol_version = $String(object.protocol_version);
                if (object.run_id != null)
                    message.run_id = $String(object.run_id);
                if (object.request_id != null)
                    message.request_id = $String(object.request_id);
                if (object.body != null) {
                    if (!$util.isObject(object.body))
                        throw $TypeError(".bazaar.v2.Accept.body: object expected");
                    message.body = $root.bazaar.v2.AcceptBody.fromObject(object.body, _depth + 1);
                }
                return message;
            };

            /**
             * Creates a plain object from an Accept message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.Accept
             * @static
             * @param {bazaar.v2.Accept} message Accept
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Accept.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.type = options.enums === $String ? "ACCEPT_TYPE_ACCEPT" : 1;
                    object.protocol_version = "";
                    object.run_id = "";
                    object.request_id = "";
                    object.body = null;
                }
                if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                    object.type = options.enums === $String ? $root.bazaar.v2.AcceptType[message.type] === $undefined ? message.type : $root.bazaar.v2.AcceptType[message.type] : message.type;
                if (message.protocol_version != null && $Object.hasOwnProperty.call(message, "protocol_version"))
                    object.protocol_version = message.protocol_version;
                if (message.run_id != null && $Object.hasOwnProperty.call(message, "run_id"))
                    object.run_id = message.run_id;
                if (message.request_id != null && $Object.hasOwnProperty.call(message, "request_id"))
                    object.request_id = message.request_id;
                if (message.body != null && $Object.hasOwnProperty.call(message, "body"))
                    object.body = $root.bazaar.v2.AcceptBody.toObject(message.body, options, _depth + 1);
                return object;
            };

            /**
             * Converts this Accept to JSON.
             * @function toJSON
             * @memberof bazaar.v2.Accept
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Accept.prototype.toJSON = function() {
                return Accept.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for Accept
             * @function getTypeUrl
             * @memberof bazaar.v2.Accept
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            Accept.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.Accept";
            };

            return Accept;
        })();

        /**
         * WithdrawType enum.
         * @name bazaar.v2.WithdrawType
         * @enum {number}
         * @property {number} WITHDRAW_TYPE_WITHDRAW=1 WITHDRAW_TYPE_WITHDRAW value
         */
        v2.WithdrawType = (function() {
            var valuesById = $Object.create(null), values = $Object.create(valuesById);
            values[valuesById[1] = "WITHDRAW_TYPE_WITHDRAW"] = 1;
            return values;
        })();

        v2.Withdraw = (function() {

            /**
             * Properties of a Withdraw.
             * @typedef {Object} bazaar.v2.Withdraw.$Properties
             * @property {bazaar.v2.WithdrawType} type Withdraw type
             * @property {string} protocol_version Withdraw protocol_version
             * @property {string} run_id Withdraw run_id
             * @property {string} request_id Withdraw request_id
             * @property {bazaar.v2.WithdrawBody.$Properties} body Withdraw body
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a Withdraw.
             * @memberof bazaar.v2
             * @interface IWithdraw
             * @augments bazaar.v2.Withdraw.$Properties
             * @deprecated Use bazaar.v2.Withdraw.$Properties instead.
             */

            /**
             * Shape of a Withdraw.
             * @typedef {bazaar.v2.Withdraw.$Properties} bazaar.v2.Withdraw.$Shape
             */

            /**
             * Constructs a new Withdraw.
             * @memberof bazaar.v2
             * @classdesc Represents a Withdraw.
             * @constructor
             * @param {bazaar.v2.Withdraw.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var Withdraw = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * Withdraw type.
             * @member {bazaar.v2.WithdrawType} type
             * @memberof bazaar.v2.Withdraw
             * @instance
             */
            Withdraw.prototype.type = 1;

            /**
             * Withdraw protocol_version.
             * @member {string} protocol_version
             * @memberof bazaar.v2.Withdraw
             * @instance
             */
            Withdraw.prototype.protocol_version = "";

            /**
             * Withdraw run_id.
             * @member {string} run_id
             * @memberof bazaar.v2.Withdraw
             * @instance
             */
            Withdraw.prototype.run_id = "";

            /**
             * Withdraw request_id.
             * @member {string} request_id
             * @memberof bazaar.v2.Withdraw
             * @instance
             */
            Withdraw.prototype.request_id = "";

            /**
             * Withdraw body.
             * @member {bazaar.v2.WithdrawBody.$Properties} body
             * @memberof bazaar.v2.Withdraw
             * @instance
             */
            Withdraw.prototype.body = null;

            /**
             * Creates a new Withdraw instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.Withdraw
             * @static
             * @param {bazaar.v2.Withdraw.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.Withdraw} Withdraw instance
             * @type {{
             *   (properties: bazaar.v2.Withdraw.$Shape): bazaar.v2.Withdraw & bazaar.v2.Withdraw.$Shape;
             *   (properties?: bazaar.v2.Withdraw.$Properties): bazaar.v2.Withdraw;
             * }}
             */
            Withdraw.create = function(properties) {
                return new Withdraw(properties);
            };

            /**
             * Encodes the specified Withdraw message. Does not implicitly {@link bazaar.v2.Withdraw.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.Withdraw
             * @static
             * @param {bazaar.v2.Withdraw.$Properties} message Withdraw message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Withdraw.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.protocol_version);
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.run_id);
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.request_id);
                $root.bazaar.v2.WithdrawBody.encode(message.body, writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified Withdraw message, length delimited. Does not implicitly {@link bazaar.v2.Withdraw.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.Withdraw
             * @static
             * @param {bazaar.v2.Withdraw.$Properties} message Withdraw message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Withdraw.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a Withdraw message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.Withdraw
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.Withdraw & bazaar.v2.Withdraw.$Shape} Withdraw
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Withdraw.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.Withdraw();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 0)
                                break;
                            value = reader.int32();
                            if ($root.bazaar.v2.WithdrawType[value] !== $undefined)
                                message.type = value;
                            else if (!reader.discardUnknown) {
                                $util.makeProp(message, "$unknowns", false);
                                (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                            }
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.protocol_version = reader.string();
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.run_id = reader.string();
                            continue;
                        }
                    case 4: {
                            if (wireType !== 2)
                                break;
                            message.request_id = reader.string();
                            continue;
                        }
                    case 5: {
                            if (wireType !== 2)
                                break;
                            message.body = $root.bazaar.v2.WithdrawBody.decode(reader, reader.uint32(), $undefined, _depth + 1, message.body);
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "type"))
                    throw $util.ProtocolError("missing required 'type'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "protocol_version"))
                    throw $util.ProtocolError("missing required 'protocol_version'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "run_id"))
                    throw $util.ProtocolError("missing required 'run_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "request_id"))
                    throw $util.ProtocolError("missing required 'request_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "body"))
                    throw $util.ProtocolError("missing required 'body'", { instance: message });
                return message;
            };

            /**
             * Decodes a Withdraw message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.Withdraw
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.Withdraw & bazaar.v2.Withdraw.$Shape} Withdraw
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Withdraw.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Withdraw message.
             * @function verify
             * @memberof bazaar.v2.Withdraw
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Withdraw.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 1:
                    break;
                }
                if (!$util.isString(message.protocol_version))
                    return "protocol_version: string expected";
                if (!$util.isString(message.run_id))
                    return "run_id: string expected";
                if (!$util.isString(message.request_id))
                    return "request_id: string expected";
                {
                    var error = $root.bazaar.v2.WithdrawBody.verify(message.body, _depth + 1);
                    if (error)
                        return "body." + error;
                }
                return null;
            };

            /**
             * Creates a Withdraw message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.Withdraw
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.Withdraw} Withdraw
             */
            Withdraw.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.Withdraw)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.Withdraw: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.Withdraw();
                switch (object.type) {
                case "WITHDRAW_TYPE_WITHDRAW":
                case 1:
                    message.type = 1;
                    break;
                default:
                }
                if (object.protocol_version != null)
                    message.protocol_version = $String(object.protocol_version);
                if (object.run_id != null)
                    message.run_id = $String(object.run_id);
                if (object.request_id != null)
                    message.request_id = $String(object.request_id);
                if (object.body != null) {
                    if (!$util.isObject(object.body))
                        throw $TypeError(".bazaar.v2.Withdraw.body: object expected");
                    message.body = $root.bazaar.v2.WithdrawBody.fromObject(object.body, _depth + 1);
                }
                return message;
            };

            /**
             * Creates a plain object from a Withdraw message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.Withdraw
             * @static
             * @param {bazaar.v2.Withdraw} message Withdraw
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Withdraw.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.type = options.enums === $String ? "WITHDRAW_TYPE_WITHDRAW" : 1;
                    object.protocol_version = "";
                    object.run_id = "";
                    object.request_id = "";
                    object.body = null;
                }
                if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                    object.type = options.enums === $String ? $root.bazaar.v2.WithdrawType[message.type] === $undefined ? message.type : $root.bazaar.v2.WithdrawType[message.type] : message.type;
                if (message.protocol_version != null && $Object.hasOwnProperty.call(message, "protocol_version"))
                    object.protocol_version = message.protocol_version;
                if (message.run_id != null && $Object.hasOwnProperty.call(message, "run_id"))
                    object.run_id = message.run_id;
                if (message.request_id != null && $Object.hasOwnProperty.call(message, "request_id"))
                    object.request_id = message.request_id;
                if (message.body != null && $Object.hasOwnProperty.call(message, "body"))
                    object.body = $root.bazaar.v2.WithdrawBody.toObject(message.body, options, _depth + 1);
                return object;
            };

            /**
             * Converts this Withdraw to JSON.
             * @function toJSON
             * @memberof bazaar.v2.Withdraw
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Withdraw.prototype.toJSON = function() {
                return Withdraw.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for Withdraw
             * @function getTypeUrl
             * @memberof bazaar.v2.Withdraw
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            Withdraw.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.Withdraw";
            };

            return Withdraw;
        })();

        /**
         * SyncType enum.
         * @name bazaar.v2.SyncType
         * @enum {number}
         * @property {number} SYNC_TYPE_SYNC=1 SYNC_TYPE_SYNC value
         */
        v2.SyncType = (function() {
            var valuesById = $Object.create(null), values = $Object.create(valuesById);
            values[valuesById[1] = "SYNC_TYPE_SYNC"] = 1;
            return values;
        })();

        v2.Sync = (function() {

            /**
             * Properties of a Sync.
             * @typedef {Object} bazaar.v2.Sync.$Properties
             * @property {bazaar.v2.SyncType} type Sync type
             * @property {string} protocol_version Sync protocol_version
             * @property {string} run_id Sync run_id
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a Sync.
             * @memberof bazaar.v2
             * @interface ISync
             * @augments bazaar.v2.Sync.$Properties
             * @deprecated Use bazaar.v2.Sync.$Properties instead.
             */

            /**
             * Shape of a Sync.
             * @typedef {bazaar.v2.Sync.$Properties} bazaar.v2.Sync.$Shape
             */

            /**
             * Constructs a new Sync.
             * @memberof bazaar.v2
             * @classdesc Represents a Sync.
             * @constructor
             * @param {bazaar.v2.Sync.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var Sync = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * Sync type.
             * @member {bazaar.v2.SyncType} type
             * @memberof bazaar.v2.Sync
             * @instance
             */
            Sync.prototype.type = 1;

            /**
             * Sync protocol_version.
             * @member {string} protocol_version
             * @memberof bazaar.v2.Sync
             * @instance
             */
            Sync.prototype.protocol_version = "";

            /**
             * Sync run_id.
             * @member {string} run_id
             * @memberof bazaar.v2.Sync
             * @instance
             */
            Sync.prototype.run_id = "";

            /**
             * Creates a new Sync instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.Sync
             * @static
             * @param {bazaar.v2.Sync.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.Sync} Sync instance
             * @type {{
             *   (properties: bazaar.v2.Sync.$Shape): bazaar.v2.Sync & bazaar.v2.Sync.$Shape;
             *   (properties?: bazaar.v2.Sync.$Properties): bazaar.v2.Sync;
             * }}
             */
            Sync.create = function(properties) {
                return new Sync(properties);
            };

            /**
             * Encodes the specified Sync message. Does not implicitly {@link bazaar.v2.Sync.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.Sync
             * @static
             * @param {bazaar.v2.Sync.$Properties} message Sync message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Sync.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.protocol_version);
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.run_id);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified Sync message, length delimited. Does not implicitly {@link bazaar.v2.Sync.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.Sync
             * @static
             * @param {bazaar.v2.Sync.$Properties} message Sync message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Sync.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a Sync message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.Sync
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.Sync & bazaar.v2.Sync.$Shape} Sync
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Sync.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.Sync();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 0)
                                break;
                            value = reader.int32();
                            if ($root.bazaar.v2.SyncType[value] !== $undefined)
                                message.type = value;
                            else if (!reader.discardUnknown) {
                                $util.makeProp(message, "$unknowns", false);
                                (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                            }
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.protocol_version = reader.string();
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.run_id = reader.string();
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "type"))
                    throw $util.ProtocolError("missing required 'type'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "protocol_version"))
                    throw $util.ProtocolError("missing required 'protocol_version'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "run_id"))
                    throw $util.ProtocolError("missing required 'run_id'", { instance: message });
                return message;
            };

            /**
             * Decodes a Sync message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.Sync
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.Sync & bazaar.v2.Sync.$Shape} Sync
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Sync.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Sync message.
             * @function verify
             * @memberof bazaar.v2.Sync
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Sync.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 1:
                    break;
                }
                if (!$util.isString(message.protocol_version))
                    return "protocol_version: string expected";
                if (!$util.isString(message.run_id))
                    return "run_id: string expected";
                return null;
            };

            /**
             * Creates a Sync message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.Sync
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.Sync} Sync
             */
            Sync.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.Sync)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.Sync: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.Sync();
                switch (object.type) {
                case "SYNC_TYPE_SYNC":
                case 1:
                    message.type = 1;
                    break;
                default:
                }
                if (object.protocol_version != null)
                    message.protocol_version = $String(object.protocol_version);
                if (object.run_id != null)
                    message.run_id = $String(object.run_id);
                return message;
            };

            /**
             * Creates a plain object from a Sync message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.Sync
             * @static
             * @param {bazaar.v2.Sync} message Sync
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Sync.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.type = options.enums === $String ? "SYNC_TYPE_SYNC" : 1;
                    object.protocol_version = "";
                    object.run_id = "";
                }
                if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                    object.type = options.enums === $String ? $root.bazaar.v2.SyncType[message.type] === $undefined ? message.type : $root.bazaar.v2.SyncType[message.type] : message.type;
                if (message.protocol_version != null && $Object.hasOwnProperty.call(message, "protocol_version"))
                    object.protocol_version = message.protocol_version;
                if (message.run_id != null && $Object.hasOwnProperty.call(message, "run_id"))
                    object.run_id = message.run_id;
                return object;
            };

            /**
             * Converts this Sync to JSON.
             * @function toJSON
             * @memberof bazaar.v2.Sync
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Sync.prototype.toJSON = function() {
                return Sync.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for Sync
             * @function getTypeUrl
             * @memberof bazaar.v2.Sync
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            Sync.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.Sync";
            };

            return Sync;
        })();

        /**
         * ReadyType enum.
         * @name bazaar.v2.ReadyType
         * @enum {number}
         * @property {number} READY_TYPE_READY=1 READY_TYPE_READY value
         */
        v2.ReadyType = (function() {
            var valuesById = $Object.create(null), values = $Object.create(valuesById);
            values[valuesById[1] = "READY_TYPE_READY"] = 1;
            return values;
        })();

        v2.Ready = (function() {

            /**
             * Properties of a Ready.
             * @typedef {Object} bazaar.v2.Ready.$Properties
             * @property {bazaar.v2.ReadyType} type Ready type
             * @property {string} protocol_version Ready protocol_version
             * @property {string} run_id Ready run_id
             * @property {boolean} ready Ready ready
             * @property {Long} snapshot_sequence Ready snapshot_sequence
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a Ready.
             * @memberof bazaar.v2
             * @interface IReady
             * @augments bazaar.v2.Ready.$Properties
             * @deprecated Use bazaar.v2.Ready.$Properties instead.
             */

            /**
             * Shape of a Ready.
             * @typedef {bazaar.v2.Ready.$Properties} bazaar.v2.Ready.$Shape
             */

            /**
             * Constructs a new Ready.
             * @memberof bazaar.v2
             * @classdesc Represents a Ready.
             * @constructor
             * @param {bazaar.v2.Ready.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var Ready = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * Ready type.
             * @member {bazaar.v2.ReadyType} type
             * @memberof bazaar.v2.Ready
             * @instance
             */
            Ready.prototype.type = 1;

            /**
             * Ready protocol_version.
             * @member {string} protocol_version
             * @memberof bazaar.v2.Ready
             * @instance
             */
            Ready.prototype.protocol_version = "";

            /**
             * Ready run_id.
             * @member {string} run_id
             * @memberof bazaar.v2.Ready
             * @instance
             */
            Ready.prototype.run_id = "";

            /**
             * Ready ready.
             * @member {boolean} ready
             * @memberof bazaar.v2.Ready
             * @instance
             */
            Ready.prototype.ready = false;

            /**
             * Ready snapshot_sequence.
             * @member {Long} snapshot_sequence
             * @memberof bazaar.v2.Ready
             * @instance
             */
            Ready.prototype.snapshot_sequence = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new Ready instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.Ready
             * @static
             * @param {bazaar.v2.Ready.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.Ready} Ready instance
             * @type {{
             *   (properties: bazaar.v2.Ready.$Shape): bazaar.v2.Ready & bazaar.v2.Ready.$Shape;
             *   (properties?: bazaar.v2.Ready.$Properties): bazaar.v2.Ready;
             * }}
             */
            Ready.create = function(properties) {
                return new Ready(properties);
            };

            /**
             * Encodes the specified Ready message. Does not implicitly {@link bazaar.v2.Ready.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.Ready
             * @static
             * @param {bazaar.v2.Ready.$Properties} message Ready message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Ready.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.protocol_version);
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.run_id);
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.ready);
                writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.snapshot_sequence);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified Ready message, length delimited. Does not implicitly {@link bazaar.v2.Ready.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.Ready
             * @static
             * @param {bazaar.v2.Ready.$Properties} message Ready message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Ready.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a Ready message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.Ready
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.Ready & bazaar.v2.Ready.$Shape} Ready
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Ready.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.Ready();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 0)
                                break;
                            value = reader.int32();
                            if ($root.bazaar.v2.ReadyType[value] !== $undefined)
                                message.type = value;
                            else if (!reader.discardUnknown) {
                                $util.makeProp(message, "$unknowns", false);
                                (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                            }
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.protocol_version = reader.string();
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.run_id = reader.string();
                            continue;
                        }
                    case 4: {
                            if (wireType !== 0)
                                break;
                            message.ready = reader.bool();
                            continue;
                        }
                    case 5: {
                            if (wireType !== 0)
                                break;
                            message.snapshot_sequence = reader.uint64();
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "type"))
                    throw $util.ProtocolError("missing required 'type'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "protocol_version"))
                    throw $util.ProtocolError("missing required 'protocol_version'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "run_id"))
                    throw $util.ProtocolError("missing required 'run_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "ready"))
                    throw $util.ProtocolError("missing required 'ready'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "snapshot_sequence"))
                    throw $util.ProtocolError("missing required 'snapshot_sequence'", { instance: message });
                return message;
            };

            /**
             * Decodes a Ready message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.Ready
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.Ready & bazaar.v2.Ready.$Shape} Ready
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Ready.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Ready message.
             * @function verify
             * @memberof bazaar.v2.Ready
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Ready.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 1:
                    break;
                }
                if (!$util.isString(message.protocol_version))
                    return "protocol_version: string expected";
                if (!$util.isString(message.run_id))
                    return "run_id: string expected";
                if (typeof message.ready !== "boolean")
                    return "ready: boolean expected";
                if (!$util.isInteger(message.snapshot_sequence) && !(message.snapshot_sequence && $util.isInteger(message.snapshot_sequence.low) && $util.isInteger(message.snapshot_sequence.high)))
                    return "snapshot_sequence: integer|Long expected";
                return null;
            };

            /**
             * Creates a Ready message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.Ready
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.Ready} Ready
             */
            Ready.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.Ready)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.Ready: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.Ready();
                switch (object.type) {
                case "READY_TYPE_READY":
                case 1:
                    message.type = 1;
                    break;
                default:
                }
                if (object.protocol_version != null)
                    message.protocol_version = $String(object.protocol_version);
                if (object.run_id != null)
                    message.run_id = $String(object.run_id);
                if (object.ready != null)
                    message.ready = $Boolean(object.ready);
                if (object.snapshot_sequence != null)
                    if ($util.Long)
                        message.snapshot_sequence = $util.Long.fromValue(object.snapshot_sequence, true);
                    else if (typeof object.snapshot_sequence === "string")
                        message.snapshot_sequence = $parseInt(object.snapshot_sequence, 10);
                    else if (typeof object.snapshot_sequence === "number")
                        message.snapshot_sequence = object.snapshot_sequence;
                    else if (typeof object.snapshot_sequence === "object")
                        message.snapshot_sequence = new $util.LongBits(object.snapshot_sequence.low >>> 0, object.snapshot_sequence.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a Ready message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.Ready
             * @static
             * @param {bazaar.v2.Ready} message Ready
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Ready.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.type = options.enums === $String ? "READY_TYPE_READY" : 1;
                    object.protocol_version = "";
                    object.run_id = "";
                    object.ready = false;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.snapshot_sequence = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.snapshot_sequence = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                }
                if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                    object.type = options.enums === $String ? $root.bazaar.v2.ReadyType[message.type] === $undefined ? message.type : $root.bazaar.v2.ReadyType[message.type] : message.type;
                if (message.protocol_version != null && $Object.hasOwnProperty.call(message, "protocol_version"))
                    object.protocol_version = message.protocol_version;
                if (message.run_id != null && $Object.hasOwnProperty.call(message, "run_id"))
                    object.run_id = message.run_id;
                if (message.ready != null && $Object.hasOwnProperty.call(message, "ready"))
                    object.ready = message.ready;
                if (message.snapshot_sequence != null && $Object.hasOwnProperty.call(message, "snapshot_sequence"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.snapshot_sequence = typeof message.snapshot_sequence === "number" ? $BigInt(message.snapshot_sequence) : $util.Long.fromBits(message.snapshot_sequence.low >>> 0, message.snapshot_sequence.high >>> 0, true).toBigInt();
                    else if (typeof message.snapshot_sequence === "number")
                        object.snapshot_sequence = options.longs === $String ? $String(message.snapshot_sequence) : message.snapshot_sequence;
                    else
                        object.snapshot_sequence = options.longs === $String ? $util.Long.prototype.toString.call(message.snapshot_sequence) : options.longs === $Number ? new $util.LongBits(message.snapshot_sequence.low >>> 0, message.snapshot_sequence.high >>> 0).toNumber(true) : message.snapshot_sequence;
                return object;
            };

            /**
             * Converts this Ready to JSON.
             * @function toJSON
             * @memberof bazaar.v2.Ready
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Ready.prototype.toJSON = function() {
                return Ready.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for Ready
             * @function getTypeUrl
             * @memberof bazaar.v2.Ready
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            Ready.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.Ready";
            };

            return Ready;
        })();

        /**
         * ResultType enum.
         * @name bazaar.v2.ResultType
         * @enum {number}
         * @property {number} RESULT_TYPE_RESULT=1 RESULT_TYPE_RESULT value
         */
        v2.ResultType = (function() {
            var valuesById = $Object.create(null), values = $Object.create(valuesById);
            values[valuesById[1] = "RESULT_TYPE_RESULT"] = 1;
            return values;
        })();

        v2.NullableString = (function() {

            /**
             * Properties of a NullableString.
             * @typedef {Object} bazaar.v2.NullableString.$Properties
             * @property {boolean|null} ["null"] NullableString null
             * @property {string|null} [value] NullableString value
             * @property {"null"|"value"} [kind] NullableString kind
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a NullableString.
             * @memberof bazaar.v2
             * @interface INullableString
             * @augments bazaar.v2.NullableString.$Properties
             * @deprecated Use bazaar.v2.NullableString.$Properties instead.
             */

            /**
             * Narrowed shape of a NullableString.
             * @typedef {{
             *   "null"?: boolean|null;
             *   value?: string|null;
             *   $unknowns?: Array.<Uint8Array>;
             * } & (
             *   ({ kind?: undefined; "null"?: null; value?: null }|{ kind?: "null"; "null": boolean; value?: null }|{ kind?: "value"; "null"?: null; value: string })
             * )} bazaar.v2.NullableString.$Shape
             */

            /**
             * Constructs a new NullableString.
             * @memberof bazaar.v2
             * @classdesc Represents a NullableString.
             * @constructor
             * @param {bazaar.v2.NullableString.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var NullableString = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * NullableString null.
             * @member {boolean|null|undefined} null
             * @memberof bazaar.v2.NullableString
             * @instance
             */
            NullableString.prototype["null"] = null;

            /**
             * NullableString value.
             * @member {string|null|undefined} value
             * @memberof bazaar.v2.NullableString
             * @instance
             */
            NullableString.prototype.value = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * NullableString kind.
             * @member {"null"|"value"|undefined} kind
             * @memberof bazaar.v2.NullableString
             * @instance
             */
            $Object.defineProperty(NullableString.prototype, "kind", {
                get: $util.oneOfGetter($oneOfFields = ["null", "value"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new NullableString instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.NullableString
             * @static
             * @param {bazaar.v2.NullableString.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.NullableString} NullableString instance
             * @type {{
             *   (properties: bazaar.v2.NullableString.$Shape): bazaar.v2.NullableString & bazaar.v2.NullableString.$Shape;
             *   (properties?: bazaar.v2.NullableString.$Properties): bazaar.v2.NullableString;
             * }}
             */
            NullableString.create = function(properties) {
                return new NullableString(properties);
            };

            /**
             * Encodes the specified NullableString message. Does not implicitly {@link bazaar.v2.NullableString.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.NullableString
             * @static
             * @param {bazaar.v2.NullableString.$Properties} message NullableString message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NullableString.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message["null"] != null && $Object.hasOwnProperty.call(message, "null"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message["null"]);
                if (message.value != null && $Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.value);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified NullableString message, length delimited. Does not implicitly {@link bazaar.v2.NullableString.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.NullableString
             * @static
             * @param {bazaar.v2.NullableString.$Properties} message NullableString message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NullableString.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a NullableString message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.NullableString
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.NullableString & bazaar.v2.NullableString.$Shape} NullableString
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NullableString.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.NullableString();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 0)
                                break;
                            message["null"] = reader.bool();
                            message.kind = "null";
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.value = reader.string();
                            message.kind = "value";
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes a NullableString message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.NullableString
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.NullableString & bazaar.v2.NullableString.$Shape} NullableString
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NullableString.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a NullableString message.
             * @function verify
             * @memberof bazaar.v2.NullableString
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            NullableString.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                var properties = {};
                if (message["null"] != null && $Object.hasOwnProperty.call(message, "null")) {
                    properties.kind = 1;
                    if (typeof message["null"] !== "boolean")
                        return "null: boolean expected";
                }
                if (message.value != null && $Object.hasOwnProperty.call(message, "value")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    if (!$util.isString(message.value))
                        return "value: string expected";
                }
                return null;
            };

            /**
             * Creates a NullableString message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.NullableString
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.NullableString} NullableString
             */
            NullableString.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.NullableString)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.NullableString: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.NullableString();
                if (object["null"] != null)
                    message["null"] = $Boolean(object["null"]);
                if (object.value != null)
                    message.value = $String(object.value);
                return message;
            };

            /**
             * Creates a plain object from a NullableString message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.NullableString
             * @static
             * @param {bazaar.v2.NullableString} message NullableString
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            NullableString.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (message["null"] != null && $Object.hasOwnProperty.call(message, "null")) {
                    object["null"] = message["null"];
                    if (options.oneofs)
                        object.kind = "null";
                }
                if (message.value != null && $Object.hasOwnProperty.call(message, "value")) {
                    object.value = message.value;
                    if (options.oneofs)
                        object.kind = "value";
                }
                return object;
            };

            /**
             * Converts this NullableString to JSON.
             * @function toJSON
             * @memberof bazaar.v2.NullableString
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            NullableString.prototype.toJSON = function() {
                return NullableString.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for NullableString
             * @function getTypeUrl
             * @memberof bazaar.v2.NullableString
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            NullableString.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.NullableString";
            };

            return NullableString;
        })();

        v2.NullableUint = (function() {

            /**
             * Properties of a NullableUint.
             * @typedef {Object} bazaar.v2.NullableUint.$Properties
             * @property {boolean|null} ["null"] NullableUint null
             * @property {Long|null} [value] NullableUint value
             * @property {"null"|"value"} [kind] NullableUint kind
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a NullableUint.
             * @memberof bazaar.v2
             * @interface INullableUint
             * @augments bazaar.v2.NullableUint.$Properties
             * @deprecated Use bazaar.v2.NullableUint.$Properties instead.
             */

            /**
             * Narrowed shape of a NullableUint.
             * @typedef {{
             *   "null"?: boolean|null;
             *   value?: Long|null;
             *   $unknowns?: Array.<Uint8Array>;
             * } & (
             *   ({ kind?: undefined; "null"?: null; value?: null }|{ kind?: "null"; "null": boolean; value?: null }|{ kind?: "value"; "null"?: null; value: Long })
             * )} bazaar.v2.NullableUint.$Shape
             */

            /**
             * Constructs a new NullableUint.
             * @memberof bazaar.v2
             * @classdesc Represents a NullableUint.
             * @constructor
             * @param {bazaar.v2.NullableUint.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var NullableUint = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * NullableUint null.
             * @member {boolean|null|undefined} null
             * @memberof bazaar.v2.NullableUint
             * @instance
             */
            NullableUint.prototype["null"] = null;

            /**
             * NullableUint value.
             * @member {Long|null|undefined} value
             * @memberof bazaar.v2.NullableUint
             * @instance
             */
            NullableUint.prototype.value = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * NullableUint kind.
             * @member {"null"|"value"|undefined} kind
             * @memberof bazaar.v2.NullableUint
             * @instance
             */
            $Object.defineProperty(NullableUint.prototype, "kind", {
                get: $util.oneOfGetter($oneOfFields = ["null", "value"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new NullableUint instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.NullableUint
             * @static
             * @param {bazaar.v2.NullableUint.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.NullableUint} NullableUint instance
             * @type {{
             *   (properties: bazaar.v2.NullableUint.$Shape): bazaar.v2.NullableUint & bazaar.v2.NullableUint.$Shape;
             *   (properties?: bazaar.v2.NullableUint.$Properties): bazaar.v2.NullableUint;
             * }}
             */
            NullableUint.create = function(properties) {
                return new NullableUint(properties);
            };

            /**
             * Encodes the specified NullableUint message. Does not implicitly {@link bazaar.v2.NullableUint.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.NullableUint
             * @static
             * @param {bazaar.v2.NullableUint.$Properties} message NullableUint message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NullableUint.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message["null"] != null && $Object.hasOwnProperty.call(message, "null"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message["null"]);
                if (message.value != null && $Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.value);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified NullableUint message, length delimited. Does not implicitly {@link bazaar.v2.NullableUint.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.NullableUint
             * @static
             * @param {bazaar.v2.NullableUint.$Properties} message NullableUint message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NullableUint.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a NullableUint message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.NullableUint
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.NullableUint & bazaar.v2.NullableUint.$Shape} NullableUint
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NullableUint.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.NullableUint();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 0)
                                break;
                            message["null"] = reader.bool();
                            message.kind = "null";
                            continue;
                        }
                    case 2: {
                            if (wireType !== 0)
                                break;
                            message.value = reader.uint64();
                            message.kind = "value";
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes a NullableUint message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.NullableUint
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.NullableUint & bazaar.v2.NullableUint.$Shape} NullableUint
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NullableUint.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a NullableUint message.
             * @function verify
             * @memberof bazaar.v2.NullableUint
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            NullableUint.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                var properties = {};
                if (message["null"] != null && $Object.hasOwnProperty.call(message, "null")) {
                    properties.kind = 1;
                    if (typeof message["null"] !== "boolean")
                        return "null: boolean expected";
                }
                if (message.value != null && $Object.hasOwnProperty.call(message, "value")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    if (!$util.isInteger(message.value) && !(message.value && $util.isInteger(message.value.low) && $util.isInteger(message.value.high)))
                        return "value: integer|Long expected";
                }
                return null;
            };

            /**
             * Creates a NullableUint message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.NullableUint
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.NullableUint} NullableUint
             */
            NullableUint.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.NullableUint)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.NullableUint: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.NullableUint();
                if (object["null"] != null)
                    message["null"] = $Boolean(object["null"]);
                if (object.value != null)
                    if ($util.Long)
                        message.value = $util.Long.fromValue(object.value, true);
                    else if (typeof object.value === "string")
                        message.value = $parseInt(object.value, 10);
                    else if (typeof object.value === "number")
                        message.value = object.value;
                    else if (typeof object.value === "object")
                        message.value = new $util.LongBits(object.value.low >>> 0, object.value.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a NullableUint message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.NullableUint
             * @static
             * @param {bazaar.v2.NullableUint} message NullableUint
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            NullableUint.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (message["null"] != null && $Object.hasOwnProperty.call(message, "null")) {
                    object["null"] = message["null"];
                    if (options.oneofs)
                        object.kind = "null";
                }
                if (message.value != null && $Object.hasOwnProperty.call(message, "value")) {
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.value = typeof message.value === "number" ? $BigInt(message.value) : $util.Long.fromBits(message.value.low >>> 0, message.value.high >>> 0, true).toBigInt();
                    else if (typeof message.value === "number")
                        object.value = options.longs === $String ? $String(message.value) : message.value;
                    else
                        object.value = options.longs === $String ? $util.Long.prototype.toString.call(message.value) : options.longs === $Number ? new $util.LongBits(message.value.low >>> 0, message.value.high >>> 0).toNumber(true) : message.value;
                    if (options.oneofs)
                        object.kind = "value";
                }
                return object;
            };

            /**
             * Converts this NullableUint to JSON.
             * @function toJSON
             * @memberof bazaar.v2.NullableUint
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            NullableUint.prototype.toJSON = function() {
                return NullableUint.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for NullableUint
             * @function getTypeUrl
             * @memberof bazaar.v2.NullableUint
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            NullableUint.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.NullableUint";
            };

            return NullableUint;
        })();

        v2.Result = (function() {

            /**
             * Properties of a Result.
             * @typedef {Object} bazaar.v2.Result.$Properties
             * @property {bazaar.v2.ResultType} type Result type
             * @property {string} protocol_version Result protocol_version
             * @property {string} run_id Result run_id
             * @property {string} request_id Result request_id
             * @property {boolean} ok Result ok
             * @property {bazaar.v2.ResultCode} code Result code
             * @property {Long} processed_tick Result processed_tick
             * @property {Long} processed_version Result processed_version
             * @property {bazaar.v2.NullableString.$Properties} object_id Result object_id
             * @property {bazaar.v2.NullableString.$Properties} transaction_id Result transaction_id
             * @property {bazaar.v2.NullableUint.$Properties} retry_after_tick Result retry_after_tick
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a Result.
             * @memberof bazaar.v2
             * @interface IResult
             * @augments bazaar.v2.Result.$Properties
             * @deprecated Use bazaar.v2.Result.$Properties instead.
             */

            /**
             * Shape of a Result.
             * @typedef {{
             *   type: bazaar.v2.ResultType;
             *   protocol_version: string;
             *   run_id: string;
             *   request_id: string;
             *   ok: boolean;
             *   code: bazaar.v2.ResultCode;
             *   processed_tick: Long;
             *   processed_version: Long;
             *   object_id: bazaar.v2.NullableString.$Shape;
             *   transaction_id: bazaar.v2.NullableString.$Shape;
             *   retry_after_tick: bazaar.v2.NullableUint.$Shape;
             *   $unknowns?: Array.<Uint8Array>;
             * }} bazaar.v2.Result.$Shape
             */

            /**
             * Constructs a new Result.
             * @memberof bazaar.v2
             * @classdesc Represents a Result.
             * @constructor
             * @param {bazaar.v2.Result.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var Result = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * Result type.
             * @member {bazaar.v2.ResultType} type
             * @memberof bazaar.v2.Result
             * @instance
             */
            Result.prototype.type = 1;

            /**
             * Result protocol_version.
             * @member {string} protocol_version
             * @memberof bazaar.v2.Result
             * @instance
             */
            Result.prototype.protocol_version = "";

            /**
             * Result run_id.
             * @member {string} run_id
             * @memberof bazaar.v2.Result
             * @instance
             */
            Result.prototype.run_id = "";

            /**
             * Result request_id.
             * @member {string} request_id
             * @memberof bazaar.v2.Result
             * @instance
             */
            Result.prototype.request_id = "";

            /**
             * Result ok.
             * @member {boolean} ok
             * @memberof bazaar.v2.Result
             * @instance
             */
            Result.prototype.ok = false;

            /**
             * Result code.
             * @member {bazaar.v2.ResultCode} code
             * @memberof bazaar.v2.Result
             * @instance
             */
            Result.prototype.code = 1;

            /**
             * Result processed_tick.
             * @member {Long} processed_tick
             * @memberof bazaar.v2.Result
             * @instance
             */
            Result.prototype.processed_tick = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Result processed_version.
             * @member {Long} processed_version
             * @memberof bazaar.v2.Result
             * @instance
             */
            Result.prototype.processed_version = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Result object_id.
             * @member {bazaar.v2.NullableString.$Properties} object_id
             * @memberof bazaar.v2.Result
             * @instance
             */
            Result.prototype.object_id = null;

            /**
             * Result transaction_id.
             * @member {bazaar.v2.NullableString.$Properties} transaction_id
             * @memberof bazaar.v2.Result
             * @instance
             */
            Result.prototype.transaction_id = null;

            /**
             * Result retry_after_tick.
             * @member {bazaar.v2.NullableUint.$Properties} retry_after_tick
             * @memberof bazaar.v2.Result
             * @instance
             */
            Result.prototype.retry_after_tick = null;

            /**
             * Creates a new Result instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.Result
             * @static
             * @param {bazaar.v2.Result.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.Result} Result instance
             * @type {{
             *   (properties: bazaar.v2.Result.$Shape): bazaar.v2.Result & bazaar.v2.Result.$Shape;
             *   (properties?: bazaar.v2.Result.$Properties): bazaar.v2.Result;
             * }}
             */
            Result.create = function(properties) {
                return new Result(properties);
            };

            /**
             * Encodes the specified Result message. Does not implicitly {@link bazaar.v2.Result.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.Result
             * @static
             * @param {bazaar.v2.Result.$Properties} message Result message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Result.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.protocol_version);
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.run_id);
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.request_id);
                writer.uint32(/* id 5, wireType 0 =*/40).bool(message.ok);
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.code);
                writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.processed_tick);
                writer.uint32(/* id 8, wireType 0 =*/64).uint64(message.processed_version);
                $root.bazaar.v2.NullableString.encode(message.object_id, writer.uint32(/* id 9, wireType 2 =*/74).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.NullableString.encode(message.transaction_id, writer.uint32(/* id 10, wireType 2 =*/82).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.NullableUint.encode(message.retry_after_tick, writer.uint32(/* id 11, wireType 2 =*/90).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified Result message, length delimited. Does not implicitly {@link bazaar.v2.Result.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.Result
             * @static
             * @param {bazaar.v2.Result.$Properties} message Result message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Result.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a Result message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.Result
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.Result & bazaar.v2.Result.$Shape} Result
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Result.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.Result();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 0)
                                break;
                            value = reader.int32();
                            if ($root.bazaar.v2.ResultType[value] !== $undefined)
                                message.type = value;
                            else if (!reader.discardUnknown) {
                                $util.makeProp(message, "$unknowns", false);
                                (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                            }
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.protocol_version = reader.string();
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.run_id = reader.string();
                            continue;
                        }
                    case 4: {
                            if (wireType !== 2)
                                break;
                            message.request_id = reader.string();
                            continue;
                        }
                    case 5: {
                            if (wireType !== 0)
                                break;
                            message.ok = reader.bool();
                            continue;
                        }
                    case 6: {
                            if (wireType !== 0)
                                break;
                            value = reader.int32();
                            if ($root.bazaar.v2.ResultCode[value] !== $undefined)
                                message.code = value;
                            else if (!reader.discardUnknown) {
                                $util.makeProp(message, "$unknowns", false);
                                (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                            }
                            continue;
                        }
                    case 7: {
                            if (wireType !== 0)
                                break;
                            message.processed_tick = reader.uint64();
                            continue;
                        }
                    case 8: {
                            if (wireType !== 0)
                                break;
                            message.processed_version = reader.uint64();
                            continue;
                        }
                    case 9: {
                            if (wireType !== 2)
                                break;
                            message.object_id = $root.bazaar.v2.NullableString.decode(reader, reader.uint32(), $undefined, _depth + 1, message.object_id);
                            continue;
                        }
                    case 10: {
                            if (wireType !== 2)
                                break;
                            message.transaction_id = $root.bazaar.v2.NullableString.decode(reader, reader.uint32(), $undefined, _depth + 1, message.transaction_id);
                            continue;
                        }
                    case 11: {
                            if (wireType !== 2)
                                break;
                            message.retry_after_tick = $root.bazaar.v2.NullableUint.decode(reader, reader.uint32(), $undefined, _depth + 1, message.retry_after_tick);
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "type"))
                    throw $util.ProtocolError("missing required 'type'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "protocol_version"))
                    throw $util.ProtocolError("missing required 'protocol_version'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "run_id"))
                    throw $util.ProtocolError("missing required 'run_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "request_id"))
                    throw $util.ProtocolError("missing required 'request_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "ok"))
                    throw $util.ProtocolError("missing required 'ok'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "code"))
                    throw $util.ProtocolError("missing required 'code'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "processed_tick"))
                    throw $util.ProtocolError("missing required 'processed_tick'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "processed_version"))
                    throw $util.ProtocolError("missing required 'processed_version'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "object_id"))
                    throw $util.ProtocolError("missing required 'object_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "transaction_id"))
                    throw $util.ProtocolError("missing required 'transaction_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "retry_after_tick"))
                    throw $util.ProtocolError("missing required 'retry_after_tick'", { instance: message });
                return message;
            };

            /**
             * Decodes a Result message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.Result
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.Result & bazaar.v2.Result.$Shape} Result
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Result.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Result message.
             * @function verify
             * @memberof bazaar.v2.Result
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Result.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 1:
                    break;
                }
                if (!$util.isString(message.protocol_version))
                    return "protocol_version: string expected";
                if (!$util.isString(message.run_id))
                    return "run_id: string expected";
                if (!$util.isString(message.request_id))
                    return "request_id: string expected";
                if (typeof message.ok !== "boolean")
                    return "ok: boolean expected";
                switch (message.code) {
                default:
                    return "code: enum value expected";
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                    break;
                }
                if (!$util.isInteger(message.processed_tick) && !(message.processed_tick && $util.isInteger(message.processed_tick.low) && $util.isInteger(message.processed_tick.high)))
                    return "processed_tick: integer|Long expected";
                if (!$util.isInteger(message.processed_version) && !(message.processed_version && $util.isInteger(message.processed_version.low) && $util.isInteger(message.processed_version.high)))
                    return "processed_version: integer|Long expected";
                {
                    var error = $root.bazaar.v2.NullableString.verify(message.object_id, _depth + 1);
                    if (error)
                        return "object_id." + error;
                }
                {
                    var error = $root.bazaar.v2.NullableString.verify(message.transaction_id, _depth + 1);
                    if (error)
                        return "transaction_id." + error;
                }
                {
                    var error = $root.bazaar.v2.NullableUint.verify(message.retry_after_tick, _depth + 1);
                    if (error)
                        return "retry_after_tick." + error;
                }
                return null;
            };

            /**
             * Creates a Result message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.Result
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.Result} Result
             */
            Result.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.Result)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.Result: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.Result();
                switch (object.type) {
                case "RESULT_TYPE_RESULT":
                case 1:
                    message.type = 1;
                    break;
                default:
                }
                if (object.protocol_version != null)
                    message.protocol_version = $String(object.protocol_version);
                if (object.run_id != null)
                    message.run_id = $String(object.run_id);
                if (object.request_id != null)
                    message.request_id = $String(object.request_id);
                if (object.ok != null)
                    message.ok = $Boolean(object.ok);
                switch (object.code) {
                case "RESULT_CODE_OK":
                case 1:
                    message.code = 1;
                    break;
                case "RESULT_CODE_REQUEST_ID_CONFLICT":
                case 2:
                    message.code = 2;
                    break;
                case "RESULT_CODE_RUN_NOT_RUNNING":
                case 3:
                    message.code = 3;
                    break;
                case "RESULT_CODE_RATE_LIMITED":
                case 4:
                    message.code = 4;
                    break;
                case "RESULT_CODE_INVALID_ARGUMENT":
                case 5:
                    message.code = 5;
                    break;
                case "RESULT_CODE_NOT_FOUND":
                case 6:
                    message.code = 6;
                    break;
                case "RESULT_CODE_EXPIRED":
                case 7:
                    message.code = 7;
                    break;
                case "RESULT_CODE_NOT_OPEN":
                case 8:
                    message.code = 8;
                    break;
                case "RESULT_CODE_LIMIT_REACHED":
                case 9:
                    message.code = 9;
                    break;
                case "RESULT_CODE_INSUFFICIENT_RESOURCES":
                case 10:
                    message.code = 10;
                    break;
                case "RESULT_CODE_STATION_FAILED":
                case 11:
                    message.code = 11;
                    break;
                default:
                }
                if (object.processed_tick != null)
                    if ($util.Long)
                        message.processed_tick = $util.Long.fromValue(object.processed_tick, true);
                    else if (typeof object.processed_tick === "string")
                        message.processed_tick = $parseInt(object.processed_tick, 10);
                    else if (typeof object.processed_tick === "number")
                        message.processed_tick = object.processed_tick;
                    else if (typeof object.processed_tick === "object")
                        message.processed_tick = new $util.LongBits(object.processed_tick.low >>> 0, object.processed_tick.high >>> 0).toNumber(true);
                if (object.processed_version != null)
                    if ($util.Long)
                        message.processed_version = $util.Long.fromValue(object.processed_version, true);
                    else if (typeof object.processed_version === "string")
                        message.processed_version = $parseInt(object.processed_version, 10);
                    else if (typeof object.processed_version === "number")
                        message.processed_version = object.processed_version;
                    else if (typeof object.processed_version === "object")
                        message.processed_version = new $util.LongBits(object.processed_version.low >>> 0, object.processed_version.high >>> 0).toNumber(true);
                if (object.object_id != null) {
                    if (!$util.isObject(object.object_id))
                        throw $TypeError(".bazaar.v2.Result.object_id: object expected");
                    message.object_id = $root.bazaar.v2.NullableString.fromObject(object.object_id, _depth + 1);
                }
                if (object.transaction_id != null) {
                    if (!$util.isObject(object.transaction_id))
                        throw $TypeError(".bazaar.v2.Result.transaction_id: object expected");
                    message.transaction_id = $root.bazaar.v2.NullableString.fromObject(object.transaction_id, _depth + 1);
                }
                if (object.retry_after_tick != null) {
                    if (!$util.isObject(object.retry_after_tick))
                        throw $TypeError(".bazaar.v2.Result.retry_after_tick: object expected");
                    message.retry_after_tick = $root.bazaar.v2.NullableUint.fromObject(object.retry_after_tick, _depth + 1);
                }
                return message;
            };

            /**
             * Creates a plain object from a Result message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.Result
             * @static
             * @param {bazaar.v2.Result} message Result
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Result.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.type = options.enums === $String ? "RESULT_TYPE_RESULT" : 1;
                    object.protocol_version = "";
                    object.run_id = "";
                    object.request_id = "";
                    object.ok = false;
                    object.code = options.enums === $String ? "RESULT_CODE_OK" : 1;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.processed_tick = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.processed_tick = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.processed_version = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.processed_version = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    object.object_id = null;
                    object.transaction_id = null;
                    object.retry_after_tick = null;
                }
                if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                    object.type = options.enums === $String ? $root.bazaar.v2.ResultType[message.type] === $undefined ? message.type : $root.bazaar.v2.ResultType[message.type] : message.type;
                if (message.protocol_version != null && $Object.hasOwnProperty.call(message, "protocol_version"))
                    object.protocol_version = message.protocol_version;
                if (message.run_id != null && $Object.hasOwnProperty.call(message, "run_id"))
                    object.run_id = message.run_id;
                if (message.request_id != null && $Object.hasOwnProperty.call(message, "request_id"))
                    object.request_id = message.request_id;
                if (message.ok != null && $Object.hasOwnProperty.call(message, "ok"))
                    object.ok = message.ok;
                if (message.code != null && $Object.hasOwnProperty.call(message, "code"))
                    object.code = options.enums === $String ? $root.bazaar.v2.ResultCode[message.code] === $undefined ? message.code : $root.bazaar.v2.ResultCode[message.code] : message.code;
                if (message.processed_tick != null && $Object.hasOwnProperty.call(message, "processed_tick"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.processed_tick = typeof message.processed_tick === "number" ? $BigInt(message.processed_tick) : $util.Long.fromBits(message.processed_tick.low >>> 0, message.processed_tick.high >>> 0, true).toBigInt();
                    else if (typeof message.processed_tick === "number")
                        object.processed_tick = options.longs === $String ? $String(message.processed_tick) : message.processed_tick;
                    else
                        object.processed_tick = options.longs === $String ? $util.Long.prototype.toString.call(message.processed_tick) : options.longs === $Number ? new $util.LongBits(message.processed_tick.low >>> 0, message.processed_tick.high >>> 0).toNumber(true) : message.processed_tick;
                if (message.processed_version != null && $Object.hasOwnProperty.call(message, "processed_version"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.processed_version = typeof message.processed_version === "number" ? $BigInt(message.processed_version) : $util.Long.fromBits(message.processed_version.low >>> 0, message.processed_version.high >>> 0, true).toBigInt();
                    else if (typeof message.processed_version === "number")
                        object.processed_version = options.longs === $String ? $String(message.processed_version) : message.processed_version;
                    else
                        object.processed_version = options.longs === $String ? $util.Long.prototype.toString.call(message.processed_version) : options.longs === $Number ? new $util.LongBits(message.processed_version.low >>> 0, message.processed_version.high >>> 0).toNumber(true) : message.processed_version;
                if (message.object_id != null && $Object.hasOwnProperty.call(message, "object_id"))
                    object.object_id = $root.bazaar.v2.NullableString.toObject(message.object_id, options, _depth + 1);
                if (message.transaction_id != null && $Object.hasOwnProperty.call(message, "transaction_id"))
                    object.transaction_id = $root.bazaar.v2.NullableString.toObject(message.transaction_id, options, _depth + 1);
                if (message.retry_after_tick != null && $Object.hasOwnProperty.call(message, "retry_after_tick"))
                    object.retry_after_tick = $root.bazaar.v2.NullableUint.toObject(message.retry_after_tick, options, _depth + 1);
                return object;
            };

            /**
             * Converts this Result to JSON.
             * @function toJSON
             * @memberof bazaar.v2.Result
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Result.prototype.toJSON = function() {
                return Result.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for Result
             * @function getTypeUrl
             * @memberof bazaar.v2.Result
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            Result.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.Result";
            };

            return Result;
        })();

        /**
         * ProtocolErrorType enum.
         * @name bazaar.v2.ProtocolErrorType
         * @enum {number}
         * @property {number} PROTOCOL_ERROR_TYPE_PROTOCOL_ERROR=1 PROTOCOL_ERROR_TYPE_PROTOCOL_ERROR value
         */
        v2.ProtocolErrorType = (function() {
            var valuesById = $Object.create(null), values = $Object.create(valuesById);
            values[valuesById[1] = "PROTOCOL_ERROR_TYPE_PROTOCOL_ERROR"] = 1;
            return values;
        })();

        v2.ProtocolError = (function() {

            /**
             * Properties of a ProtocolError.
             * @typedef {Object} bazaar.v2.ProtocolError.$Properties
             * @property {bazaar.v2.ProtocolErrorType} type ProtocolError type
             * @property {string} protocol_version ProtocolError protocol_version
             * @property {bazaar.v2.NullableString.$Properties} run_id ProtocolError run_id
             * @property {bazaar.v2.NullableString.$Properties} request_id ProtocolError request_id
             * @property {bazaar.v2.ControlCode} code ProtocolError code
             * @property {boolean} close_session ProtocolError close_session
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a ProtocolError.
             * @memberof bazaar.v2
             * @interface IProtocolError
             * @augments bazaar.v2.ProtocolError.$Properties
             * @deprecated Use bazaar.v2.ProtocolError.$Properties instead.
             */

            /**
             * Shape of a ProtocolError.
             * @typedef {{
             *   type: bazaar.v2.ProtocolErrorType;
             *   protocol_version: string;
             *   run_id: bazaar.v2.NullableString.$Shape;
             *   request_id: bazaar.v2.NullableString.$Shape;
             *   code: bazaar.v2.ControlCode;
             *   close_session: boolean;
             *   $unknowns?: Array.<Uint8Array>;
             * }} bazaar.v2.ProtocolError.$Shape
             */

            /**
             * Constructs a new ProtocolError.
             * @memberof bazaar.v2
             * @classdesc Represents a ProtocolError.
             * @constructor
             * @param {bazaar.v2.ProtocolError.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var ProtocolError = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * ProtocolError type.
             * @member {bazaar.v2.ProtocolErrorType} type
             * @memberof bazaar.v2.ProtocolError
             * @instance
             */
            ProtocolError.prototype.type = 1;

            /**
             * ProtocolError protocol_version.
             * @member {string} protocol_version
             * @memberof bazaar.v2.ProtocolError
             * @instance
             */
            ProtocolError.prototype.protocol_version = "";

            /**
             * ProtocolError run_id.
             * @member {bazaar.v2.NullableString.$Properties} run_id
             * @memberof bazaar.v2.ProtocolError
             * @instance
             */
            ProtocolError.prototype.run_id = null;

            /**
             * ProtocolError request_id.
             * @member {bazaar.v2.NullableString.$Properties} request_id
             * @memberof bazaar.v2.ProtocolError
             * @instance
             */
            ProtocolError.prototype.request_id = null;

            /**
             * ProtocolError code.
             * @member {bazaar.v2.ControlCode} code
             * @memberof bazaar.v2.ProtocolError
             * @instance
             */
            ProtocolError.prototype.code = 1;

            /**
             * ProtocolError close_session.
             * @member {boolean} close_session
             * @memberof bazaar.v2.ProtocolError
             * @instance
             */
            ProtocolError.prototype.close_session = false;

            /**
             * Creates a new ProtocolError instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.ProtocolError
             * @static
             * @param {bazaar.v2.ProtocolError.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.ProtocolError} ProtocolError instance
             * @type {{
             *   (properties: bazaar.v2.ProtocolError.$Shape): bazaar.v2.ProtocolError & bazaar.v2.ProtocolError.$Shape;
             *   (properties?: bazaar.v2.ProtocolError.$Properties): bazaar.v2.ProtocolError;
             * }}
             */
            ProtocolError.create = function(properties) {
                return new ProtocolError(properties);
            };

            /**
             * Encodes the specified ProtocolError message. Does not implicitly {@link bazaar.v2.ProtocolError.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.ProtocolError
             * @static
             * @param {bazaar.v2.ProtocolError.$Properties} message ProtocolError message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ProtocolError.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.protocol_version);
                $root.bazaar.v2.NullableString.encode(message.run_id, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.NullableString.encode(message.request_id, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.code);
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.close_session);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified ProtocolError message, length delimited. Does not implicitly {@link bazaar.v2.ProtocolError.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.ProtocolError
             * @static
             * @param {bazaar.v2.ProtocolError.$Properties} message ProtocolError message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ProtocolError.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a ProtocolError message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.ProtocolError
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.ProtocolError & bazaar.v2.ProtocolError.$Shape} ProtocolError
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ProtocolError.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.ProtocolError();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 0)
                                break;
                            value = reader.int32();
                            if ($root.bazaar.v2.ProtocolErrorType[value] !== $undefined)
                                message.type = value;
                            else if (!reader.discardUnknown) {
                                $util.makeProp(message, "$unknowns", false);
                                (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                            }
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.protocol_version = reader.string();
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.run_id = $root.bazaar.v2.NullableString.decode(reader, reader.uint32(), $undefined, _depth + 1, message.run_id);
                            continue;
                        }
                    case 4: {
                            if (wireType !== 2)
                                break;
                            message.request_id = $root.bazaar.v2.NullableString.decode(reader, reader.uint32(), $undefined, _depth + 1, message.request_id);
                            continue;
                        }
                    case 5: {
                            if (wireType !== 0)
                                break;
                            value = reader.int32();
                            if ($root.bazaar.v2.ControlCode[value] !== $undefined)
                                message.code = value;
                            else if (!reader.discardUnknown) {
                                $util.makeProp(message, "$unknowns", false);
                                (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                            }
                            continue;
                        }
                    case 6: {
                            if (wireType !== 0)
                                break;
                            message.close_session = reader.bool();
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "type"))
                    throw $util.ProtocolError("missing required 'type'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "protocol_version"))
                    throw $util.ProtocolError("missing required 'protocol_version'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "run_id"))
                    throw $util.ProtocolError("missing required 'run_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "request_id"))
                    throw $util.ProtocolError("missing required 'request_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "code"))
                    throw $util.ProtocolError("missing required 'code'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "close_session"))
                    throw $util.ProtocolError("missing required 'close_session'", { instance: message });
                return message;
            };

            /**
             * Decodes a ProtocolError message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.ProtocolError
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.ProtocolError & bazaar.v2.ProtocolError.$Shape} ProtocolError
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ProtocolError.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ProtocolError message.
             * @function verify
             * @memberof bazaar.v2.ProtocolError
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ProtocolError.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 1:
                    break;
                }
                if (!$util.isString(message.protocol_version))
                    return "protocol_version: string expected";
                {
                    var error = $root.bazaar.v2.NullableString.verify(message.run_id, _depth + 1);
                    if (error)
                        return "run_id." + error;
                }
                {
                    var error = $root.bazaar.v2.NullableString.verify(message.request_id, _depth + 1);
                    if (error)
                        return "request_id." + error;
                }
                switch (message.code) {
                default:
                    return "code: enum value expected";
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    break;
                }
                if (typeof message.close_session !== "boolean")
                    return "close_session: boolean expected";
                return null;
            };

            /**
             * Creates a ProtocolError message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.ProtocolError
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.ProtocolError} ProtocolError
             */
            ProtocolError.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.ProtocolError)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.ProtocolError: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.ProtocolError();
                switch (object.type) {
                case "PROTOCOL_ERROR_TYPE_PROTOCOL_ERROR":
                case 1:
                    message.type = 1;
                    break;
                default:
                }
                if (object.protocol_version != null)
                    message.protocol_version = $String(object.protocol_version);
                if (object.run_id != null) {
                    if (!$util.isObject(object.run_id))
                        throw $TypeError(".bazaar.v2.ProtocolError.run_id: object expected");
                    message.run_id = $root.bazaar.v2.NullableString.fromObject(object.run_id, _depth + 1);
                }
                if (object.request_id != null) {
                    if (!$util.isObject(object.request_id))
                        throw $TypeError(".bazaar.v2.ProtocolError.request_id: object expected");
                    message.request_id = $root.bazaar.v2.NullableString.fromObject(object.request_id, _depth + 1);
                }
                switch (object.code) {
                case "CONTROL_CODE_BAD_MESSAGE":
                case 1:
                    message.code = 1;
                    break;
                case "CONTROL_CODE_REQUEST_CAPACITY_EXCEEDED":
                case 2:
                    message.code = 2;
                    break;
                case "CONTROL_CODE_UNSUPPORTED_VERSION":
                case 3:
                    message.code = 3;
                    break;
                case "CONTROL_CODE_RUN_MISMATCH":
                case 4:
                    message.code = 4;
                    break;
                case "CONTROL_CODE_INVALID_AUTHENTICATION":
                case 5:
                    message.code = 5;
                    break;
                case "CONTROL_CODE_SESSION_FENCED":
                case 6:
                    message.code = 6;
                    break;
                default:
                }
                if (object.close_session != null)
                    message.close_session = $Boolean(object.close_session);
                return message;
            };

            /**
             * Creates a plain object from a ProtocolError message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.ProtocolError
             * @static
             * @param {bazaar.v2.ProtocolError} message ProtocolError
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ProtocolError.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.type = options.enums === $String ? "PROTOCOL_ERROR_TYPE_PROTOCOL_ERROR" : 1;
                    object.protocol_version = "";
                    object.run_id = null;
                    object.request_id = null;
                    object.code = options.enums === $String ? "CONTROL_CODE_BAD_MESSAGE" : 1;
                    object.close_session = false;
                }
                if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                    object.type = options.enums === $String ? $root.bazaar.v2.ProtocolErrorType[message.type] === $undefined ? message.type : $root.bazaar.v2.ProtocolErrorType[message.type] : message.type;
                if (message.protocol_version != null && $Object.hasOwnProperty.call(message, "protocol_version"))
                    object.protocol_version = message.protocol_version;
                if (message.run_id != null && $Object.hasOwnProperty.call(message, "run_id"))
                    object.run_id = $root.bazaar.v2.NullableString.toObject(message.run_id, options, _depth + 1);
                if (message.request_id != null && $Object.hasOwnProperty.call(message, "request_id"))
                    object.request_id = $root.bazaar.v2.NullableString.toObject(message.request_id, options, _depth + 1);
                if (message.code != null && $Object.hasOwnProperty.call(message, "code"))
                    object.code = options.enums === $String ? $root.bazaar.v2.ControlCode[message.code] === $undefined ? message.code : $root.bazaar.v2.ControlCode[message.code] : message.code;
                if (message.close_session != null && $Object.hasOwnProperty.call(message, "close_session"))
                    object.close_session = message.close_session;
                return object;
            };

            /**
             * Converts this ProtocolError to JSON.
             * @function toJSON
             * @memberof bazaar.v2.ProtocolError
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ProtocolError.prototype.toJSON = function() {
                return ProtocolError.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for ProtocolError
             * @function getTypeUrl
             * @memberof bazaar.v2.ProtocolError
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            ProtocolError.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.ProtocolError";
            };

            return ProtocolError;
        })();

        v2.Offer = (function() {

            /**
             * Properties of an Offer.
             * @typedef {Object} bazaar.v2.Offer.$Properties
             * @property {string} offer_id Offer offer_id
             * @property {string} proposer_id Offer proposer_id
             * @property {string} recipient_id Offer recipient_id
             * @property {bazaar.v2.Bundle.$Properties} give Offer give
             * @property {bazaar.v2.Bundle.$Properties} receive Offer receive
             * @property {Long} created_tick Offer created_tick
             * @property {Long} created_version Offer created_version
             * @property {Long} expires_tick Offer expires_tick
             * @property {bazaar.v2.OfferStatus} status Offer status
             * @property {bazaar.v2.NullableUint.$Properties} closed_tick Offer closed_tick
             * @property {bazaar.v2.NullableString.$Properties} transaction_id Offer transaction_id
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an Offer.
             * @memberof bazaar.v2
             * @interface IOffer
             * @augments bazaar.v2.Offer.$Properties
             * @deprecated Use bazaar.v2.Offer.$Properties instead.
             */

            /**
             * Shape of an Offer.
             * @typedef {{
             *   offer_id: string;
             *   proposer_id: string;
             *   recipient_id: string;
             *   give: bazaar.v2.Bundle.$Shape;
             *   receive: bazaar.v2.Bundle.$Shape;
             *   created_tick: Long;
             *   created_version: Long;
             *   expires_tick: Long;
             *   status: bazaar.v2.OfferStatus;
             *   closed_tick: bazaar.v2.NullableUint.$Shape;
             *   transaction_id: bazaar.v2.NullableString.$Shape;
             *   $unknowns?: Array.<Uint8Array>;
             * }} bazaar.v2.Offer.$Shape
             */

            /**
             * Constructs a new Offer.
             * @memberof bazaar.v2
             * @classdesc Represents an Offer.
             * @constructor
             * @param {bazaar.v2.Offer.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var Offer = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * Offer offer_id.
             * @member {string} offer_id
             * @memberof bazaar.v2.Offer
             * @instance
             */
            Offer.prototype.offer_id = "";

            /**
             * Offer proposer_id.
             * @member {string} proposer_id
             * @memberof bazaar.v2.Offer
             * @instance
             */
            Offer.prototype.proposer_id = "";

            /**
             * Offer recipient_id.
             * @member {string} recipient_id
             * @memberof bazaar.v2.Offer
             * @instance
             */
            Offer.prototype.recipient_id = "";

            /**
             * Offer give.
             * @member {bazaar.v2.Bundle.$Properties} give
             * @memberof bazaar.v2.Offer
             * @instance
             */
            Offer.prototype.give = null;

            /**
             * Offer receive.
             * @member {bazaar.v2.Bundle.$Properties} receive
             * @memberof bazaar.v2.Offer
             * @instance
             */
            Offer.prototype.receive = null;

            /**
             * Offer created_tick.
             * @member {Long} created_tick
             * @memberof bazaar.v2.Offer
             * @instance
             */
            Offer.prototype.created_tick = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Offer created_version.
             * @member {Long} created_version
             * @memberof bazaar.v2.Offer
             * @instance
             */
            Offer.prototype.created_version = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Offer expires_tick.
             * @member {Long} expires_tick
             * @memberof bazaar.v2.Offer
             * @instance
             */
            Offer.prototype.expires_tick = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Offer status.
             * @member {bazaar.v2.OfferStatus} status
             * @memberof bazaar.v2.Offer
             * @instance
             */
            Offer.prototype.status = 1;

            /**
             * Offer closed_tick.
             * @member {bazaar.v2.NullableUint.$Properties} closed_tick
             * @memberof bazaar.v2.Offer
             * @instance
             */
            Offer.prototype.closed_tick = null;

            /**
             * Offer transaction_id.
             * @member {bazaar.v2.NullableString.$Properties} transaction_id
             * @memberof bazaar.v2.Offer
             * @instance
             */
            Offer.prototype.transaction_id = null;

            /**
             * Creates a new Offer instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.Offer
             * @static
             * @param {bazaar.v2.Offer.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.Offer} Offer instance
             * @type {{
             *   (properties: bazaar.v2.Offer.$Shape): bazaar.v2.Offer & bazaar.v2.Offer.$Shape;
             *   (properties?: bazaar.v2.Offer.$Properties): bazaar.v2.Offer;
             * }}
             */
            Offer.create = function(properties) {
                return new Offer(properties);
            };

            /**
             * Encodes the specified Offer message. Does not implicitly {@link bazaar.v2.Offer.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.Offer
             * @static
             * @param {bazaar.v2.Offer.$Properties} message Offer message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Offer.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.offer_id);
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.proposer_id);
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.recipient_id);
                $root.bazaar.v2.Bundle.encode(message.give, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.Bundle.encode(message.receive, writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
                writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.created_tick);
                writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.created_version);
                writer.uint32(/* id 8, wireType 0 =*/64).uint64(message.expires_tick);
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.status);
                $root.bazaar.v2.NullableUint.encode(message.closed_tick, writer.uint32(/* id 10, wireType 2 =*/82).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.NullableString.encode(message.transaction_id, writer.uint32(/* id 11, wireType 2 =*/90).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified Offer message, length delimited. Does not implicitly {@link bazaar.v2.Offer.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.Offer
             * @static
             * @param {bazaar.v2.Offer.$Properties} message Offer message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Offer.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an Offer message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.Offer
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.Offer & bazaar.v2.Offer.$Shape} Offer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Offer.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.Offer();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            message.offer_id = reader.string();
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.proposer_id = reader.string();
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.recipient_id = reader.string();
                            continue;
                        }
                    case 4: {
                            if (wireType !== 2)
                                break;
                            message.give = $root.bazaar.v2.Bundle.decode(reader, reader.uint32(), $undefined, _depth + 1, message.give);
                            continue;
                        }
                    case 5: {
                            if (wireType !== 2)
                                break;
                            message.receive = $root.bazaar.v2.Bundle.decode(reader, reader.uint32(), $undefined, _depth + 1, message.receive);
                            continue;
                        }
                    case 6: {
                            if (wireType !== 0)
                                break;
                            message.created_tick = reader.uint64();
                            continue;
                        }
                    case 7: {
                            if (wireType !== 0)
                                break;
                            message.created_version = reader.uint64();
                            continue;
                        }
                    case 8: {
                            if (wireType !== 0)
                                break;
                            message.expires_tick = reader.uint64();
                            continue;
                        }
                    case 9: {
                            if (wireType !== 0)
                                break;
                            value = reader.int32();
                            if ($root.bazaar.v2.OfferStatus[value] !== $undefined)
                                message.status = value;
                            else if (!reader.discardUnknown) {
                                $util.makeProp(message, "$unknowns", false);
                                (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                            }
                            continue;
                        }
                    case 10: {
                            if (wireType !== 2)
                                break;
                            message.closed_tick = $root.bazaar.v2.NullableUint.decode(reader, reader.uint32(), $undefined, _depth + 1, message.closed_tick);
                            continue;
                        }
                    case 11: {
                            if (wireType !== 2)
                                break;
                            message.transaction_id = $root.bazaar.v2.NullableString.decode(reader, reader.uint32(), $undefined, _depth + 1, message.transaction_id);
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "offer_id"))
                    throw $util.ProtocolError("missing required 'offer_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "proposer_id"))
                    throw $util.ProtocolError("missing required 'proposer_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "recipient_id"))
                    throw $util.ProtocolError("missing required 'recipient_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "give"))
                    throw $util.ProtocolError("missing required 'give'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "receive"))
                    throw $util.ProtocolError("missing required 'receive'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "created_tick"))
                    throw $util.ProtocolError("missing required 'created_tick'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "created_version"))
                    throw $util.ProtocolError("missing required 'created_version'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "expires_tick"))
                    throw $util.ProtocolError("missing required 'expires_tick'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "status"))
                    throw $util.ProtocolError("missing required 'status'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "closed_tick"))
                    throw $util.ProtocolError("missing required 'closed_tick'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "transaction_id"))
                    throw $util.ProtocolError("missing required 'transaction_id'", { instance: message });
                return message;
            };

            /**
             * Decodes an Offer message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.Offer
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.Offer & bazaar.v2.Offer.$Shape} Offer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Offer.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Offer message.
             * @function verify
             * @memberof bazaar.v2.Offer
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Offer.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (!$util.isString(message.offer_id))
                    return "offer_id: string expected";
                if (!$util.isString(message.proposer_id))
                    return "proposer_id: string expected";
                if (!$util.isString(message.recipient_id))
                    return "recipient_id: string expected";
                {
                    var error = $root.bazaar.v2.Bundle.verify(message.give, _depth + 1);
                    if (error)
                        return "give." + error;
                }
                {
                    var error = $root.bazaar.v2.Bundle.verify(message.receive, _depth + 1);
                    if (error)
                        return "receive." + error;
                }
                if (!$util.isInteger(message.created_tick) && !(message.created_tick && $util.isInteger(message.created_tick.low) && $util.isInteger(message.created_tick.high)))
                    return "created_tick: integer|Long expected";
                if (!$util.isInteger(message.created_version) && !(message.created_version && $util.isInteger(message.created_version.low) && $util.isInteger(message.created_version.high)))
                    return "created_version: integer|Long expected";
                if (!$util.isInteger(message.expires_tick) && !(message.expires_tick && $util.isInteger(message.expires_tick.low) && $util.isInteger(message.expires_tick.high)))
                    return "expires_tick: integer|Long expected";
                switch (message.status) {
                default:
                    return "status: enum value expected";
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    break;
                }
                {
                    var error = $root.bazaar.v2.NullableUint.verify(message.closed_tick, _depth + 1);
                    if (error)
                        return "closed_tick." + error;
                }
                {
                    var error = $root.bazaar.v2.NullableString.verify(message.transaction_id, _depth + 1);
                    if (error)
                        return "transaction_id." + error;
                }
                return null;
            };

            /**
             * Creates an Offer message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.Offer
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.Offer} Offer
             */
            Offer.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.Offer)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.Offer: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.Offer();
                if (object.offer_id != null)
                    message.offer_id = $String(object.offer_id);
                if (object.proposer_id != null)
                    message.proposer_id = $String(object.proposer_id);
                if (object.recipient_id != null)
                    message.recipient_id = $String(object.recipient_id);
                if (object.give != null) {
                    if (!$util.isObject(object.give))
                        throw $TypeError(".bazaar.v2.Offer.give: object expected");
                    message.give = $root.bazaar.v2.Bundle.fromObject(object.give, _depth + 1);
                }
                if (object.receive != null) {
                    if (!$util.isObject(object.receive))
                        throw $TypeError(".bazaar.v2.Offer.receive: object expected");
                    message.receive = $root.bazaar.v2.Bundle.fromObject(object.receive, _depth + 1);
                }
                if (object.created_tick != null)
                    if ($util.Long)
                        message.created_tick = $util.Long.fromValue(object.created_tick, true);
                    else if (typeof object.created_tick === "string")
                        message.created_tick = $parseInt(object.created_tick, 10);
                    else if (typeof object.created_tick === "number")
                        message.created_tick = object.created_tick;
                    else if (typeof object.created_tick === "object")
                        message.created_tick = new $util.LongBits(object.created_tick.low >>> 0, object.created_tick.high >>> 0).toNumber(true);
                if (object.created_version != null)
                    if ($util.Long)
                        message.created_version = $util.Long.fromValue(object.created_version, true);
                    else if (typeof object.created_version === "string")
                        message.created_version = $parseInt(object.created_version, 10);
                    else if (typeof object.created_version === "number")
                        message.created_version = object.created_version;
                    else if (typeof object.created_version === "object")
                        message.created_version = new $util.LongBits(object.created_version.low >>> 0, object.created_version.high >>> 0).toNumber(true);
                if (object.expires_tick != null)
                    if ($util.Long)
                        message.expires_tick = $util.Long.fromValue(object.expires_tick, true);
                    else if (typeof object.expires_tick === "string")
                        message.expires_tick = $parseInt(object.expires_tick, 10);
                    else if (typeof object.expires_tick === "number")
                        message.expires_tick = object.expires_tick;
                    else if (typeof object.expires_tick === "object")
                        message.expires_tick = new $util.LongBits(object.expires_tick.low >>> 0, object.expires_tick.high >>> 0).toNumber(true);
                switch (object.status) {
                case "OFFER_STATUS_OPEN":
                case 1:
                    message.status = 1;
                    break;
                case "OFFER_STATUS_ACCEPTED":
                case 2:
                    message.status = 2;
                    break;
                case "OFFER_STATUS_WITHDRAWN":
                case 3:
                    message.status = 3;
                    break;
                case "OFFER_STATUS_EXPIRED":
                case 4:
                    message.status = 4;
                    break;
                case "OFFER_STATUS_RUN_ENDED":
                case 5:
                    message.status = 5;
                    break;
                default:
                }
                if (object.closed_tick != null) {
                    if (!$util.isObject(object.closed_tick))
                        throw $TypeError(".bazaar.v2.Offer.closed_tick: object expected");
                    message.closed_tick = $root.bazaar.v2.NullableUint.fromObject(object.closed_tick, _depth + 1);
                }
                if (object.transaction_id != null) {
                    if (!$util.isObject(object.transaction_id))
                        throw $TypeError(".bazaar.v2.Offer.transaction_id: object expected");
                    message.transaction_id = $root.bazaar.v2.NullableString.fromObject(object.transaction_id, _depth + 1);
                }
                return message;
            };

            /**
             * Creates a plain object from an Offer message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.Offer
             * @static
             * @param {bazaar.v2.Offer} message Offer
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Offer.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.offer_id = "";
                    object.proposer_id = "";
                    object.recipient_id = "";
                    object.give = null;
                    object.receive = null;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.created_tick = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.created_tick = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.created_version = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.created_version = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.expires_tick = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.expires_tick = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    object.status = options.enums === $String ? "OFFER_STATUS_OPEN" : 1;
                    object.closed_tick = null;
                    object.transaction_id = null;
                }
                if (message.offer_id != null && $Object.hasOwnProperty.call(message, "offer_id"))
                    object.offer_id = message.offer_id;
                if (message.proposer_id != null && $Object.hasOwnProperty.call(message, "proposer_id"))
                    object.proposer_id = message.proposer_id;
                if (message.recipient_id != null && $Object.hasOwnProperty.call(message, "recipient_id"))
                    object.recipient_id = message.recipient_id;
                if (message.give != null && $Object.hasOwnProperty.call(message, "give"))
                    object.give = $root.bazaar.v2.Bundle.toObject(message.give, options, _depth + 1);
                if (message.receive != null && $Object.hasOwnProperty.call(message, "receive"))
                    object.receive = $root.bazaar.v2.Bundle.toObject(message.receive, options, _depth + 1);
                if (message.created_tick != null && $Object.hasOwnProperty.call(message, "created_tick"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.created_tick = typeof message.created_tick === "number" ? $BigInt(message.created_tick) : $util.Long.fromBits(message.created_tick.low >>> 0, message.created_tick.high >>> 0, true).toBigInt();
                    else if (typeof message.created_tick === "number")
                        object.created_tick = options.longs === $String ? $String(message.created_tick) : message.created_tick;
                    else
                        object.created_tick = options.longs === $String ? $util.Long.prototype.toString.call(message.created_tick) : options.longs === $Number ? new $util.LongBits(message.created_tick.low >>> 0, message.created_tick.high >>> 0).toNumber(true) : message.created_tick;
                if (message.created_version != null && $Object.hasOwnProperty.call(message, "created_version"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.created_version = typeof message.created_version === "number" ? $BigInt(message.created_version) : $util.Long.fromBits(message.created_version.low >>> 0, message.created_version.high >>> 0, true).toBigInt();
                    else if (typeof message.created_version === "number")
                        object.created_version = options.longs === $String ? $String(message.created_version) : message.created_version;
                    else
                        object.created_version = options.longs === $String ? $util.Long.prototype.toString.call(message.created_version) : options.longs === $Number ? new $util.LongBits(message.created_version.low >>> 0, message.created_version.high >>> 0).toNumber(true) : message.created_version;
                if (message.expires_tick != null && $Object.hasOwnProperty.call(message, "expires_tick"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.expires_tick = typeof message.expires_tick === "number" ? $BigInt(message.expires_tick) : $util.Long.fromBits(message.expires_tick.low >>> 0, message.expires_tick.high >>> 0, true).toBigInt();
                    else if (typeof message.expires_tick === "number")
                        object.expires_tick = options.longs === $String ? $String(message.expires_tick) : message.expires_tick;
                    else
                        object.expires_tick = options.longs === $String ? $util.Long.prototype.toString.call(message.expires_tick) : options.longs === $Number ? new $util.LongBits(message.expires_tick.low >>> 0, message.expires_tick.high >>> 0).toNumber(true) : message.expires_tick;
                if (message.status != null && $Object.hasOwnProperty.call(message, "status"))
                    object.status = options.enums === $String ? $root.bazaar.v2.OfferStatus[message.status] === $undefined ? message.status : $root.bazaar.v2.OfferStatus[message.status] : message.status;
                if (message.closed_tick != null && $Object.hasOwnProperty.call(message, "closed_tick"))
                    object.closed_tick = $root.bazaar.v2.NullableUint.toObject(message.closed_tick, options, _depth + 1);
                if (message.transaction_id != null && $Object.hasOwnProperty.call(message, "transaction_id"))
                    object.transaction_id = $root.bazaar.v2.NullableString.toObject(message.transaction_id, options, _depth + 1);
                return object;
            };

            /**
             * Converts this Offer to JSON.
             * @function toJSON
             * @memberof bazaar.v2.Offer
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Offer.prototype.toJSON = function() {
                return Offer.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for Offer
             * @function getTypeUrl
             * @memberof bazaar.v2.Offer
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            Offer.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.Offer";
            };

            return Offer;
        })();

        v2.Transaction = (function() {

            /**
             * Properties of a Transaction.
             * @typedef {Object} bazaar.v2.Transaction.$Properties
             * @property {string} transaction_id Transaction transaction_id
             * @property {string} offer_id Transaction offer_id
             * @property {string} proposer_id Transaction proposer_id
             * @property {string} recipient_id Transaction recipient_id
             * @property {bazaar.v2.Bundle.$Properties} give Transaction give
             * @property {bazaar.v2.Bundle.$Properties} receive Transaction receive
             * @property {Long} settled_tick Transaction settled_tick
             * @property {Long} settled_version Transaction settled_version
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a Transaction.
             * @memberof bazaar.v2
             * @interface ITransaction
             * @augments bazaar.v2.Transaction.$Properties
             * @deprecated Use bazaar.v2.Transaction.$Properties instead.
             */

            /**
             * Shape of a Transaction.
             * @typedef {bazaar.v2.Transaction.$Properties} bazaar.v2.Transaction.$Shape
             */

            /**
             * Constructs a new Transaction.
             * @memberof bazaar.v2
             * @classdesc Represents a Transaction.
             * @constructor
             * @param {bazaar.v2.Transaction.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var Transaction = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * Transaction transaction_id.
             * @member {string} transaction_id
             * @memberof bazaar.v2.Transaction
             * @instance
             */
            Transaction.prototype.transaction_id = "";

            /**
             * Transaction offer_id.
             * @member {string} offer_id
             * @memberof bazaar.v2.Transaction
             * @instance
             */
            Transaction.prototype.offer_id = "";

            /**
             * Transaction proposer_id.
             * @member {string} proposer_id
             * @memberof bazaar.v2.Transaction
             * @instance
             */
            Transaction.prototype.proposer_id = "";

            /**
             * Transaction recipient_id.
             * @member {string} recipient_id
             * @memberof bazaar.v2.Transaction
             * @instance
             */
            Transaction.prototype.recipient_id = "";

            /**
             * Transaction give.
             * @member {bazaar.v2.Bundle.$Properties} give
             * @memberof bazaar.v2.Transaction
             * @instance
             */
            Transaction.prototype.give = null;

            /**
             * Transaction receive.
             * @member {bazaar.v2.Bundle.$Properties} receive
             * @memberof bazaar.v2.Transaction
             * @instance
             */
            Transaction.prototype.receive = null;

            /**
             * Transaction settled_tick.
             * @member {Long} settled_tick
             * @memberof bazaar.v2.Transaction
             * @instance
             */
            Transaction.prototype.settled_tick = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Transaction settled_version.
             * @member {Long} settled_version
             * @memberof bazaar.v2.Transaction
             * @instance
             */
            Transaction.prototype.settled_version = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new Transaction instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.Transaction
             * @static
             * @param {bazaar.v2.Transaction.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.Transaction} Transaction instance
             * @type {{
             *   (properties: bazaar.v2.Transaction.$Shape): bazaar.v2.Transaction & bazaar.v2.Transaction.$Shape;
             *   (properties?: bazaar.v2.Transaction.$Properties): bazaar.v2.Transaction;
             * }}
             */
            Transaction.create = function(properties) {
                return new Transaction(properties);
            };

            /**
             * Encodes the specified Transaction message. Does not implicitly {@link bazaar.v2.Transaction.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.Transaction
             * @static
             * @param {bazaar.v2.Transaction.$Properties} message Transaction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Transaction.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.transaction_id);
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.offer_id);
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.proposer_id);
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.recipient_id);
                $root.bazaar.v2.Bundle.encode(message.give, writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.Bundle.encode(message.receive, writer.uint32(/* id 6, wireType 2 =*/50).fork(), _depth + 1).ldelim();
                writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.settled_tick);
                writer.uint32(/* id 8, wireType 0 =*/64).uint64(message.settled_version);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified Transaction message, length delimited. Does not implicitly {@link bazaar.v2.Transaction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.Transaction
             * @static
             * @param {bazaar.v2.Transaction.$Properties} message Transaction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Transaction.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a Transaction message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.Transaction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.Transaction & bazaar.v2.Transaction.$Shape} Transaction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Transaction.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.Transaction();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            message.transaction_id = reader.string();
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.offer_id = reader.string();
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.proposer_id = reader.string();
                            continue;
                        }
                    case 4: {
                            if (wireType !== 2)
                                break;
                            message.recipient_id = reader.string();
                            continue;
                        }
                    case 5: {
                            if (wireType !== 2)
                                break;
                            message.give = $root.bazaar.v2.Bundle.decode(reader, reader.uint32(), $undefined, _depth + 1, message.give);
                            continue;
                        }
                    case 6: {
                            if (wireType !== 2)
                                break;
                            message.receive = $root.bazaar.v2.Bundle.decode(reader, reader.uint32(), $undefined, _depth + 1, message.receive);
                            continue;
                        }
                    case 7: {
                            if (wireType !== 0)
                                break;
                            message.settled_tick = reader.uint64();
                            continue;
                        }
                    case 8: {
                            if (wireType !== 0)
                                break;
                            message.settled_version = reader.uint64();
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "transaction_id"))
                    throw $util.ProtocolError("missing required 'transaction_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "offer_id"))
                    throw $util.ProtocolError("missing required 'offer_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "proposer_id"))
                    throw $util.ProtocolError("missing required 'proposer_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "recipient_id"))
                    throw $util.ProtocolError("missing required 'recipient_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "give"))
                    throw $util.ProtocolError("missing required 'give'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "receive"))
                    throw $util.ProtocolError("missing required 'receive'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "settled_tick"))
                    throw $util.ProtocolError("missing required 'settled_tick'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "settled_version"))
                    throw $util.ProtocolError("missing required 'settled_version'", { instance: message });
                return message;
            };

            /**
             * Decodes a Transaction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.Transaction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.Transaction & bazaar.v2.Transaction.$Shape} Transaction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Transaction.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Transaction message.
             * @function verify
             * @memberof bazaar.v2.Transaction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Transaction.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (!$util.isString(message.transaction_id))
                    return "transaction_id: string expected";
                if (!$util.isString(message.offer_id))
                    return "offer_id: string expected";
                if (!$util.isString(message.proposer_id))
                    return "proposer_id: string expected";
                if (!$util.isString(message.recipient_id))
                    return "recipient_id: string expected";
                {
                    var error = $root.bazaar.v2.Bundle.verify(message.give, _depth + 1);
                    if (error)
                        return "give." + error;
                }
                {
                    var error = $root.bazaar.v2.Bundle.verify(message.receive, _depth + 1);
                    if (error)
                        return "receive." + error;
                }
                if (!$util.isInteger(message.settled_tick) && !(message.settled_tick && $util.isInteger(message.settled_tick.low) && $util.isInteger(message.settled_tick.high)))
                    return "settled_tick: integer|Long expected";
                if (!$util.isInteger(message.settled_version) && !(message.settled_version && $util.isInteger(message.settled_version.low) && $util.isInteger(message.settled_version.high)))
                    return "settled_version: integer|Long expected";
                return null;
            };

            /**
             * Creates a Transaction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.Transaction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.Transaction} Transaction
             */
            Transaction.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.Transaction)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.Transaction: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.Transaction();
                if (object.transaction_id != null)
                    message.transaction_id = $String(object.transaction_id);
                if (object.offer_id != null)
                    message.offer_id = $String(object.offer_id);
                if (object.proposer_id != null)
                    message.proposer_id = $String(object.proposer_id);
                if (object.recipient_id != null)
                    message.recipient_id = $String(object.recipient_id);
                if (object.give != null) {
                    if (!$util.isObject(object.give))
                        throw $TypeError(".bazaar.v2.Transaction.give: object expected");
                    message.give = $root.bazaar.v2.Bundle.fromObject(object.give, _depth + 1);
                }
                if (object.receive != null) {
                    if (!$util.isObject(object.receive))
                        throw $TypeError(".bazaar.v2.Transaction.receive: object expected");
                    message.receive = $root.bazaar.v2.Bundle.fromObject(object.receive, _depth + 1);
                }
                if (object.settled_tick != null)
                    if ($util.Long)
                        message.settled_tick = $util.Long.fromValue(object.settled_tick, true);
                    else if (typeof object.settled_tick === "string")
                        message.settled_tick = $parseInt(object.settled_tick, 10);
                    else if (typeof object.settled_tick === "number")
                        message.settled_tick = object.settled_tick;
                    else if (typeof object.settled_tick === "object")
                        message.settled_tick = new $util.LongBits(object.settled_tick.low >>> 0, object.settled_tick.high >>> 0).toNumber(true);
                if (object.settled_version != null)
                    if ($util.Long)
                        message.settled_version = $util.Long.fromValue(object.settled_version, true);
                    else if (typeof object.settled_version === "string")
                        message.settled_version = $parseInt(object.settled_version, 10);
                    else if (typeof object.settled_version === "number")
                        message.settled_version = object.settled_version;
                    else if (typeof object.settled_version === "object")
                        message.settled_version = new $util.LongBits(object.settled_version.low >>> 0, object.settled_version.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a Transaction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.Transaction
             * @static
             * @param {bazaar.v2.Transaction} message Transaction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Transaction.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.transaction_id = "";
                    object.offer_id = "";
                    object.proposer_id = "";
                    object.recipient_id = "";
                    object.give = null;
                    object.receive = null;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.settled_tick = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.settled_tick = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.settled_version = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.settled_version = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                }
                if (message.transaction_id != null && $Object.hasOwnProperty.call(message, "transaction_id"))
                    object.transaction_id = message.transaction_id;
                if (message.offer_id != null && $Object.hasOwnProperty.call(message, "offer_id"))
                    object.offer_id = message.offer_id;
                if (message.proposer_id != null && $Object.hasOwnProperty.call(message, "proposer_id"))
                    object.proposer_id = message.proposer_id;
                if (message.recipient_id != null && $Object.hasOwnProperty.call(message, "recipient_id"))
                    object.recipient_id = message.recipient_id;
                if (message.give != null && $Object.hasOwnProperty.call(message, "give"))
                    object.give = $root.bazaar.v2.Bundle.toObject(message.give, options, _depth + 1);
                if (message.receive != null && $Object.hasOwnProperty.call(message, "receive"))
                    object.receive = $root.bazaar.v2.Bundle.toObject(message.receive, options, _depth + 1);
                if (message.settled_tick != null && $Object.hasOwnProperty.call(message, "settled_tick"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.settled_tick = typeof message.settled_tick === "number" ? $BigInt(message.settled_tick) : $util.Long.fromBits(message.settled_tick.low >>> 0, message.settled_tick.high >>> 0, true).toBigInt();
                    else if (typeof message.settled_tick === "number")
                        object.settled_tick = options.longs === $String ? $String(message.settled_tick) : message.settled_tick;
                    else
                        object.settled_tick = options.longs === $String ? $util.Long.prototype.toString.call(message.settled_tick) : options.longs === $Number ? new $util.LongBits(message.settled_tick.low >>> 0, message.settled_tick.high >>> 0).toNumber(true) : message.settled_tick;
                if (message.settled_version != null && $Object.hasOwnProperty.call(message, "settled_version"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.settled_version = typeof message.settled_version === "number" ? $BigInt(message.settled_version) : $util.Long.fromBits(message.settled_version.low >>> 0, message.settled_version.high >>> 0, true).toBigInt();
                    else if (typeof message.settled_version === "number")
                        object.settled_version = options.longs === $String ? $String(message.settled_version) : message.settled_version;
                    else
                        object.settled_version = options.longs === $String ? $util.Long.prototype.toString.call(message.settled_version) : options.longs === $Number ? new $util.LongBits(message.settled_version.low >>> 0, message.settled_version.high >>> 0).toNumber(true) : message.settled_version;
                return object;
            };

            /**
             * Converts this Transaction to JSON.
             * @function toJSON
             * @memberof bazaar.v2.Transaction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Transaction.prototype.toJSON = function() {
                return Transaction.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for Transaction
             * @function getTypeUrl
             * @memberof bazaar.v2.Transaction
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            Transaction.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.Transaction";
            };

            return Transaction;
        })();

        v2.Advertisement = (function() {

            /**
             * Properties of an Advertisement.
             * @typedef {Object} bazaar.v2.Advertisement.$Properties
             * @property {string} advertisement_id Advertisement advertisement_id
             * @property {string} station_id Advertisement station_id
             * @property {bazaar.v2.ListResource.$Properties} selling Advertisement selling
             * @property {bazaar.v2.ListResource.$Properties} seeking Advertisement seeking
             * @property {Long} created_tick Advertisement created_tick
             * @property {Long} expires_tick Advertisement expires_tick
             * @property {Long} created_version Advertisement created_version
             * @property {bazaar.v2.PublicationStatus} status Advertisement status
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an Advertisement.
             * @memberof bazaar.v2
             * @interface IAdvertisement
             * @augments bazaar.v2.Advertisement.$Properties
             * @deprecated Use bazaar.v2.Advertisement.$Properties instead.
             */

            /**
             * Shape of an Advertisement.
             * @typedef {bazaar.v2.Advertisement.$Properties} bazaar.v2.Advertisement.$Shape
             */

            /**
             * Constructs a new Advertisement.
             * @memberof bazaar.v2
             * @classdesc Represents an Advertisement.
             * @constructor
             * @param {bazaar.v2.Advertisement.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var Advertisement = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * Advertisement advertisement_id.
             * @member {string} advertisement_id
             * @memberof bazaar.v2.Advertisement
             * @instance
             */
            Advertisement.prototype.advertisement_id = "";

            /**
             * Advertisement station_id.
             * @member {string} station_id
             * @memberof bazaar.v2.Advertisement
             * @instance
             */
            Advertisement.prototype.station_id = "";

            /**
             * Advertisement selling.
             * @member {bazaar.v2.ListResource.$Properties} selling
             * @memberof bazaar.v2.Advertisement
             * @instance
             */
            Advertisement.prototype.selling = null;

            /**
             * Advertisement seeking.
             * @member {bazaar.v2.ListResource.$Properties} seeking
             * @memberof bazaar.v2.Advertisement
             * @instance
             */
            Advertisement.prototype.seeking = null;

            /**
             * Advertisement created_tick.
             * @member {Long} created_tick
             * @memberof bazaar.v2.Advertisement
             * @instance
             */
            Advertisement.prototype.created_tick = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Advertisement expires_tick.
             * @member {Long} expires_tick
             * @memberof bazaar.v2.Advertisement
             * @instance
             */
            Advertisement.prototype.expires_tick = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Advertisement created_version.
             * @member {Long} created_version
             * @memberof bazaar.v2.Advertisement
             * @instance
             */
            Advertisement.prototype.created_version = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Advertisement status.
             * @member {bazaar.v2.PublicationStatus} status
             * @memberof bazaar.v2.Advertisement
             * @instance
             */
            Advertisement.prototype.status = 1;

            /**
             * Creates a new Advertisement instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.Advertisement
             * @static
             * @param {bazaar.v2.Advertisement.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.Advertisement} Advertisement instance
             * @type {{
             *   (properties: bazaar.v2.Advertisement.$Shape): bazaar.v2.Advertisement & bazaar.v2.Advertisement.$Shape;
             *   (properties?: bazaar.v2.Advertisement.$Properties): bazaar.v2.Advertisement;
             * }}
             */
            Advertisement.create = function(properties) {
                return new Advertisement(properties);
            };

            /**
             * Encodes the specified Advertisement message. Does not implicitly {@link bazaar.v2.Advertisement.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.Advertisement
             * @static
             * @param {bazaar.v2.Advertisement.$Properties} message Advertisement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Advertisement.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.advertisement_id);
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.station_id);
                $root.bazaar.v2.ListResource.encode(message.selling, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.ListResource.encode(message.seeking, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
                writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.created_tick);
                writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.expires_tick);
                writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.created_version);
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.status);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified Advertisement message, length delimited. Does not implicitly {@link bazaar.v2.Advertisement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.Advertisement
             * @static
             * @param {bazaar.v2.Advertisement.$Properties} message Advertisement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Advertisement.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes an Advertisement message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.Advertisement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.Advertisement & bazaar.v2.Advertisement.$Shape} Advertisement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Advertisement.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.Advertisement();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            message.advertisement_id = reader.string();
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.station_id = reader.string();
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.selling = $root.bazaar.v2.ListResource.decode(reader, reader.uint32(), $undefined, _depth + 1, message.selling);
                            continue;
                        }
                    case 4: {
                            if (wireType !== 2)
                                break;
                            message.seeking = $root.bazaar.v2.ListResource.decode(reader, reader.uint32(), $undefined, _depth + 1, message.seeking);
                            continue;
                        }
                    case 5: {
                            if (wireType !== 0)
                                break;
                            message.created_tick = reader.uint64();
                            continue;
                        }
                    case 6: {
                            if (wireType !== 0)
                                break;
                            message.expires_tick = reader.uint64();
                            continue;
                        }
                    case 7: {
                            if (wireType !== 0)
                                break;
                            message.created_version = reader.uint64();
                            continue;
                        }
                    case 8: {
                            if (wireType !== 0)
                                break;
                            value = reader.int32();
                            if ($root.bazaar.v2.PublicationStatus[value] !== $undefined)
                                message.status = value;
                            else if (!reader.discardUnknown) {
                                $util.makeProp(message, "$unknowns", false);
                                (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                            }
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "advertisement_id"))
                    throw $util.ProtocolError("missing required 'advertisement_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "station_id"))
                    throw $util.ProtocolError("missing required 'station_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "selling"))
                    throw $util.ProtocolError("missing required 'selling'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "seeking"))
                    throw $util.ProtocolError("missing required 'seeking'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "created_tick"))
                    throw $util.ProtocolError("missing required 'created_tick'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "expires_tick"))
                    throw $util.ProtocolError("missing required 'expires_tick'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "created_version"))
                    throw $util.ProtocolError("missing required 'created_version'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "status"))
                    throw $util.ProtocolError("missing required 'status'", { instance: message });
                return message;
            };

            /**
             * Decodes an Advertisement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.Advertisement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.Advertisement & bazaar.v2.Advertisement.$Shape} Advertisement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Advertisement.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Advertisement message.
             * @function verify
             * @memberof bazaar.v2.Advertisement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Advertisement.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (!$util.isString(message.advertisement_id))
                    return "advertisement_id: string expected";
                if (!$util.isString(message.station_id))
                    return "station_id: string expected";
                {
                    var error = $root.bazaar.v2.ListResource.verify(message.selling, _depth + 1);
                    if (error)
                        return "selling." + error;
                }
                {
                    var error = $root.bazaar.v2.ListResource.verify(message.seeking, _depth + 1);
                    if (error)
                        return "seeking." + error;
                }
                if (!$util.isInteger(message.created_tick) && !(message.created_tick && $util.isInteger(message.created_tick.low) && $util.isInteger(message.created_tick.high)))
                    return "created_tick: integer|Long expected";
                if (!$util.isInteger(message.expires_tick) && !(message.expires_tick && $util.isInteger(message.expires_tick.low) && $util.isInteger(message.expires_tick.high)))
                    return "expires_tick: integer|Long expected";
                if (!$util.isInteger(message.created_version) && !(message.created_version && $util.isInteger(message.created_version.low) && $util.isInteger(message.created_version.high)))
                    return "created_version: integer|Long expected";
                switch (message.status) {
                default:
                    return "status: enum value expected";
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    break;
                }
                return null;
            };

            /**
             * Creates an Advertisement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.Advertisement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.Advertisement} Advertisement
             */
            Advertisement.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.Advertisement)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.Advertisement: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.Advertisement();
                if (object.advertisement_id != null)
                    message.advertisement_id = $String(object.advertisement_id);
                if (object.station_id != null)
                    message.station_id = $String(object.station_id);
                if (object.selling != null) {
                    if (!$util.isObject(object.selling))
                        throw $TypeError(".bazaar.v2.Advertisement.selling: object expected");
                    message.selling = $root.bazaar.v2.ListResource.fromObject(object.selling, _depth + 1);
                }
                if (object.seeking != null) {
                    if (!$util.isObject(object.seeking))
                        throw $TypeError(".bazaar.v2.Advertisement.seeking: object expected");
                    message.seeking = $root.bazaar.v2.ListResource.fromObject(object.seeking, _depth + 1);
                }
                if (object.created_tick != null)
                    if ($util.Long)
                        message.created_tick = $util.Long.fromValue(object.created_tick, true);
                    else if (typeof object.created_tick === "string")
                        message.created_tick = $parseInt(object.created_tick, 10);
                    else if (typeof object.created_tick === "number")
                        message.created_tick = object.created_tick;
                    else if (typeof object.created_tick === "object")
                        message.created_tick = new $util.LongBits(object.created_tick.low >>> 0, object.created_tick.high >>> 0).toNumber(true);
                if (object.expires_tick != null)
                    if ($util.Long)
                        message.expires_tick = $util.Long.fromValue(object.expires_tick, true);
                    else if (typeof object.expires_tick === "string")
                        message.expires_tick = $parseInt(object.expires_tick, 10);
                    else if (typeof object.expires_tick === "number")
                        message.expires_tick = object.expires_tick;
                    else if (typeof object.expires_tick === "object")
                        message.expires_tick = new $util.LongBits(object.expires_tick.low >>> 0, object.expires_tick.high >>> 0).toNumber(true);
                if (object.created_version != null)
                    if ($util.Long)
                        message.created_version = $util.Long.fromValue(object.created_version, true);
                    else if (typeof object.created_version === "string")
                        message.created_version = $parseInt(object.created_version, 10);
                    else if (typeof object.created_version === "number")
                        message.created_version = object.created_version;
                    else if (typeof object.created_version === "object")
                        message.created_version = new $util.LongBits(object.created_version.low >>> 0, object.created_version.high >>> 0).toNumber(true);
                switch (object.status) {
                case "PUBLICATION_STATUS_ACTIVE":
                case 1:
                    message.status = 1;
                    break;
                case "PUBLICATION_STATUS_REPLACED":
                case 2:
                    message.status = 2;
                    break;
                case "PUBLICATION_STATUS_WITHDRAWN":
                case 3:
                    message.status = 3;
                    break;
                case "PUBLICATION_STATUS_EXPIRED":
                case 4:
                    message.status = 4;
                    break;
                case "PUBLICATION_STATUS_RUN_ENDED":
                case 5:
                    message.status = 5;
                    break;
                default:
                }
                return message;
            };

            /**
             * Creates a plain object from an Advertisement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.Advertisement
             * @static
             * @param {bazaar.v2.Advertisement} message Advertisement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Advertisement.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.advertisement_id = "";
                    object.station_id = "";
                    object.selling = null;
                    object.seeking = null;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.created_tick = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.created_tick = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.expires_tick = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.expires_tick = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.created_version = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.created_version = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    object.status = options.enums === $String ? "PUBLICATION_STATUS_ACTIVE" : 1;
                }
                if (message.advertisement_id != null && $Object.hasOwnProperty.call(message, "advertisement_id"))
                    object.advertisement_id = message.advertisement_id;
                if (message.station_id != null && $Object.hasOwnProperty.call(message, "station_id"))
                    object.station_id = message.station_id;
                if (message.selling != null && $Object.hasOwnProperty.call(message, "selling"))
                    object.selling = $root.bazaar.v2.ListResource.toObject(message.selling, options, _depth + 1);
                if (message.seeking != null && $Object.hasOwnProperty.call(message, "seeking"))
                    object.seeking = $root.bazaar.v2.ListResource.toObject(message.seeking, options, _depth + 1);
                if (message.created_tick != null && $Object.hasOwnProperty.call(message, "created_tick"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.created_tick = typeof message.created_tick === "number" ? $BigInt(message.created_tick) : $util.Long.fromBits(message.created_tick.low >>> 0, message.created_tick.high >>> 0, true).toBigInt();
                    else if (typeof message.created_tick === "number")
                        object.created_tick = options.longs === $String ? $String(message.created_tick) : message.created_tick;
                    else
                        object.created_tick = options.longs === $String ? $util.Long.prototype.toString.call(message.created_tick) : options.longs === $Number ? new $util.LongBits(message.created_tick.low >>> 0, message.created_tick.high >>> 0).toNumber(true) : message.created_tick;
                if (message.expires_tick != null && $Object.hasOwnProperty.call(message, "expires_tick"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.expires_tick = typeof message.expires_tick === "number" ? $BigInt(message.expires_tick) : $util.Long.fromBits(message.expires_tick.low >>> 0, message.expires_tick.high >>> 0, true).toBigInt();
                    else if (typeof message.expires_tick === "number")
                        object.expires_tick = options.longs === $String ? $String(message.expires_tick) : message.expires_tick;
                    else
                        object.expires_tick = options.longs === $String ? $util.Long.prototype.toString.call(message.expires_tick) : options.longs === $Number ? new $util.LongBits(message.expires_tick.low >>> 0, message.expires_tick.high >>> 0).toNumber(true) : message.expires_tick;
                if (message.created_version != null && $Object.hasOwnProperty.call(message, "created_version"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.created_version = typeof message.created_version === "number" ? $BigInt(message.created_version) : $util.Long.fromBits(message.created_version.low >>> 0, message.created_version.high >>> 0, true).toBigInt();
                    else if (typeof message.created_version === "number")
                        object.created_version = options.longs === $String ? $String(message.created_version) : message.created_version;
                    else
                        object.created_version = options.longs === $String ? $util.Long.prototype.toString.call(message.created_version) : options.longs === $Number ? new $util.LongBits(message.created_version.low >>> 0, message.created_version.high >>> 0).toNumber(true) : message.created_version;
                if (message.status != null && $Object.hasOwnProperty.call(message, "status"))
                    object.status = options.enums === $String ? $root.bazaar.v2.PublicationStatus[message.status] === $undefined ? message.status : $root.bazaar.v2.PublicationStatus[message.status] : message.status;
                return object;
            };

            /**
             * Converts this Advertisement to JSON.
             * @function toJSON
             * @memberof bazaar.v2.Advertisement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Advertisement.prototype.toJSON = function() {
                return Advertisement.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for Advertisement
             * @function getTypeUrl
             * @memberof bazaar.v2.Advertisement
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            Advertisement.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.Advertisement";
            };

            return Advertisement;
        })();

        v2.DirectoryEntry = (function() {

            /**
             * Properties of a DirectoryEntry.
             * @typedef {Object} bazaar.v2.DirectoryEntry.$Properties
             * @property {string} station_id DirectoryEntry station_id
             * @property {string} display_name DirectoryEntry display_name
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a DirectoryEntry.
             * @memberof bazaar.v2
             * @interface IDirectoryEntry
             * @augments bazaar.v2.DirectoryEntry.$Properties
             * @deprecated Use bazaar.v2.DirectoryEntry.$Properties instead.
             */

            /**
             * Shape of a DirectoryEntry.
             * @typedef {bazaar.v2.DirectoryEntry.$Properties} bazaar.v2.DirectoryEntry.$Shape
             */

            /**
             * Constructs a new DirectoryEntry.
             * @memberof bazaar.v2
             * @classdesc Represents a DirectoryEntry.
             * @constructor
             * @param {bazaar.v2.DirectoryEntry.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var DirectoryEntry = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * DirectoryEntry station_id.
             * @member {string} station_id
             * @memberof bazaar.v2.DirectoryEntry
             * @instance
             */
            DirectoryEntry.prototype.station_id = "";

            /**
             * DirectoryEntry display_name.
             * @member {string} display_name
             * @memberof bazaar.v2.DirectoryEntry
             * @instance
             */
            DirectoryEntry.prototype.display_name = "";

            /**
             * Creates a new DirectoryEntry instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.DirectoryEntry
             * @static
             * @param {bazaar.v2.DirectoryEntry.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.DirectoryEntry} DirectoryEntry instance
             * @type {{
             *   (properties: bazaar.v2.DirectoryEntry.$Shape): bazaar.v2.DirectoryEntry & bazaar.v2.DirectoryEntry.$Shape;
             *   (properties?: bazaar.v2.DirectoryEntry.$Properties): bazaar.v2.DirectoryEntry;
             * }}
             */
            DirectoryEntry.create = function(properties) {
                return new DirectoryEntry(properties);
            };

            /**
             * Encodes the specified DirectoryEntry message. Does not implicitly {@link bazaar.v2.DirectoryEntry.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.DirectoryEntry
             * @static
             * @param {bazaar.v2.DirectoryEntry.$Properties} message DirectoryEntry message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DirectoryEntry.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.station_id);
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.display_name);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified DirectoryEntry message, length delimited. Does not implicitly {@link bazaar.v2.DirectoryEntry.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.DirectoryEntry
             * @static
             * @param {bazaar.v2.DirectoryEntry.$Properties} message DirectoryEntry message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DirectoryEntry.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a DirectoryEntry message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.DirectoryEntry
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.DirectoryEntry & bazaar.v2.DirectoryEntry.$Shape} DirectoryEntry
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DirectoryEntry.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.DirectoryEntry();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            message.station_id = reader.string();
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.display_name = reader.string();
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "station_id"))
                    throw $util.ProtocolError("missing required 'station_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "display_name"))
                    throw $util.ProtocolError("missing required 'display_name'", { instance: message });
                return message;
            };

            /**
             * Decodes a DirectoryEntry message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.DirectoryEntry
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.DirectoryEntry & bazaar.v2.DirectoryEntry.$Shape} DirectoryEntry
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DirectoryEntry.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DirectoryEntry message.
             * @function verify
             * @memberof bazaar.v2.DirectoryEntry
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DirectoryEntry.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (!$util.isString(message.station_id))
                    return "station_id: string expected";
                if (!$util.isString(message.display_name))
                    return "display_name: string expected";
                return null;
            };

            /**
             * Creates a DirectoryEntry message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.DirectoryEntry
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.DirectoryEntry} DirectoryEntry
             */
            DirectoryEntry.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.DirectoryEntry)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.DirectoryEntry: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.DirectoryEntry();
                if (object.station_id != null)
                    message.station_id = $String(object.station_id);
                if (object.display_name != null)
                    message.display_name = $String(object.display_name);
                return message;
            };

            /**
             * Creates a plain object from a DirectoryEntry message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.DirectoryEntry
             * @static
             * @param {bazaar.v2.DirectoryEntry} message DirectoryEntry
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DirectoryEntry.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.station_id = "";
                    object.display_name = "";
                }
                if (message.station_id != null && $Object.hasOwnProperty.call(message, "station_id"))
                    object.station_id = message.station_id;
                if (message.display_name != null && $Object.hasOwnProperty.call(message, "display_name"))
                    object.display_name = message.display_name;
                return object;
            };

            /**
             * Converts this DirectoryEntry to JSON.
             * @function toJSON
             * @memberof bazaar.v2.DirectoryEntry
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DirectoryEntry.prototype.toJSON = function() {
                return DirectoryEntry.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for DirectoryEntry
             * @function getTypeUrl
             * @memberof bazaar.v2.DirectoryEntry
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            DirectoryEntry.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.DirectoryEntry";
            };

            return DirectoryEntry;
        })();

        v2.StationObservation = (function() {

            /**
             * Properties of a StationObservation.
             * @typedef {Object} bazaar.v2.StationObservation.$Properties
             * @property {string} station_id StationObservation station_id
             * @property {bazaar.v2.Bundle.$Properties} inventory StationObservation inventory
             * @property {Long} health StationObservation health
             * @property {boolean} failed_once StationObservation failed_once
             * @property {bazaar.v2.NullableUint.$Properties} first_failure_tick StationObservation first_failure_tick
             * @property {bazaar.v2.Bundle.$Properties} last_production StationObservation last_production
             * @property {bazaar.v2.Bundle.$Properties} last_unmet_upkeep StationObservation last_unmet_upkeep
             * @property {Long} fully_supplied_ticks StationObservation fully_supplied_ticks
             * @property {Long} shortage_ticks StationObservation shortage_ticks
             * @property {Long} current_shortage_streak StationObservation current_shortage_streak
             * @property {Long} longest_shortage_streak StationObservation longest_shortage_streak
             * @property {bazaar.v2.Bundle.$Properties} produced_total StationObservation produced_total
             * @property {bazaar.v2.Bundle.$Properties} consumed_total StationObservation consumed_total
             * @property {bazaar.v2.Bundle.$Properties} unmet_total StationObservation unmet_total
             * @property {bazaar.v2.Bundle.$Properties} imported_total StationObservation imported_total
             * @property {bazaar.v2.Bundle.$Properties} exported_total StationObservation exported_total
             * @property {bazaar.v2.Bundle.$Properties} upkeep_per_tick StationObservation upkeep_per_tick
             * @property {bazaar.v2.Resource} specialty StationObservation specialty
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a StationObservation.
             * @memberof bazaar.v2
             * @interface IStationObservation
             * @augments bazaar.v2.StationObservation.$Properties
             * @deprecated Use bazaar.v2.StationObservation.$Properties instead.
             */

            /**
             * Shape of a StationObservation.
             * @typedef {{
             *   station_id: string;
             *   inventory: bazaar.v2.Bundle.$Shape;
             *   health: Long;
             *   failed_once: boolean;
             *   first_failure_tick: bazaar.v2.NullableUint.$Shape;
             *   last_production: bazaar.v2.Bundle.$Shape;
             *   last_unmet_upkeep: bazaar.v2.Bundle.$Shape;
             *   fully_supplied_ticks: Long;
             *   shortage_ticks: Long;
             *   current_shortage_streak: Long;
             *   longest_shortage_streak: Long;
             *   produced_total: bazaar.v2.Bundle.$Shape;
             *   consumed_total: bazaar.v2.Bundle.$Shape;
             *   unmet_total: bazaar.v2.Bundle.$Shape;
             *   imported_total: bazaar.v2.Bundle.$Shape;
             *   exported_total: bazaar.v2.Bundle.$Shape;
             *   upkeep_per_tick: bazaar.v2.Bundle.$Shape;
             *   specialty: bazaar.v2.Resource;
             *   $unknowns?: Array.<Uint8Array>;
             * }} bazaar.v2.StationObservation.$Shape
             */

            /**
             * Constructs a new StationObservation.
             * @memberof bazaar.v2
             * @classdesc Represents a StationObservation.
             * @constructor
             * @param {bazaar.v2.StationObservation.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var StationObservation = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * StationObservation station_id.
             * @member {string} station_id
             * @memberof bazaar.v2.StationObservation
             * @instance
             */
            StationObservation.prototype.station_id = "";

            /**
             * StationObservation inventory.
             * @member {bazaar.v2.Bundle.$Properties} inventory
             * @memberof bazaar.v2.StationObservation
             * @instance
             */
            StationObservation.prototype.inventory = null;

            /**
             * StationObservation health.
             * @member {Long} health
             * @memberof bazaar.v2.StationObservation
             * @instance
             */
            StationObservation.prototype.health = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * StationObservation failed_once.
             * @member {boolean} failed_once
             * @memberof bazaar.v2.StationObservation
             * @instance
             */
            StationObservation.prototype.failed_once = false;

            /**
             * StationObservation first_failure_tick.
             * @member {bazaar.v2.NullableUint.$Properties} first_failure_tick
             * @memberof bazaar.v2.StationObservation
             * @instance
             */
            StationObservation.prototype.first_failure_tick = null;

            /**
             * StationObservation last_production.
             * @member {bazaar.v2.Bundle.$Properties} last_production
             * @memberof bazaar.v2.StationObservation
             * @instance
             */
            StationObservation.prototype.last_production = null;

            /**
             * StationObservation last_unmet_upkeep.
             * @member {bazaar.v2.Bundle.$Properties} last_unmet_upkeep
             * @memberof bazaar.v2.StationObservation
             * @instance
             */
            StationObservation.prototype.last_unmet_upkeep = null;

            /**
             * StationObservation fully_supplied_ticks.
             * @member {Long} fully_supplied_ticks
             * @memberof bazaar.v2.StationObservation
             * @instance
             */
            StationObservation.prototype.fully_supplied_ticks = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * StationObservation shortage_ticks.
             * @member {Long} shortage_ticks
             * @memberof bazaar.v2.StationObservation
             * @instance
             */
            StationObservation.prototype.shortage_ticks = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * StationObservation current_shortage_streak.
             * @member {Long} current_shortage_streak
             * @memberof bazaar.v2.StationObservation
             * @instance
             */
            StationObservation.prototype.current_shortage_streak = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * StationObservation longest_shortage_streak.
             * @member {Long} longest_shortage_streak
             * @memberof bazaar.v2.StationObservation
             * @instance
             */
            StationObservation.prototype.longest_shortage_streak = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * StationObservation produced_total.
             * @member {bazaar.v2.Bundle.$Properties} produced_total
             * @memberof bazaar.v2.StationObservation
             * @instance
             */
            StationObservation.prototype.produced_total = null;

            /**
             * StationObservation consumed_total.
             * @member {bazaar.v2.Bundle.$Properties} consumed_total
             * @memberof bazaar.v2.StationObservation
             * @instance
             */
            StationObservation.prototype.consumed_total = null;

            /**
             * StationObservation unmet_total.
             * @member {bazaar.v2.Bundle.$Properties} unmet_total
             * @memberof bazaar.v2.StationObservation
             * @instance
             */
            StationObservation.prototype.unmet_total = null;

            /**
             * StationObservation imported_total.
             * @member {bazaar.v2.Bundle.$Properties} imported_total
             * @memberof bazaar.v2.StationObservation
             * @instance
             */
            StationObservation.prototype.imported_total = null;

            /**
             * StationObservation exported_total.
             * @member {bazaar.v2.Bundle.$Properties} exported_total
             * @memberof bazaar.v2.StationObservation
             * @instance
             */
            StationObservation.prototype.exported_total = null;

            /**
             * StationObservation upkeep_per_tick.
             * @member {bazaar.v2.Bundle.$Properties} upkeep_per_tick
             * @memberof bazaar.v2.StationObservation
             * @instance
             */
            StationObservation.prototype.upkeep_per_tick = null;

            /**
             * StationObservation specialty.
             * @member {bazaar.v2.Resource} specialty
             * @memberof bazaar.v2.StationObservation
             * @instance
             */
            StationObservation.prototype.specialty = 1;

            /**
             * Creates a new StationObservation instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.StationObservation
             * @static
             * @param {bazaar.v2.StationObservation.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.StationObservation} StationObservation instance
             * @type {{
             *   (properties: bazaar.v2.StationObservation.$Shape): bazaar.v2.StationObservation & bazaar.v2.StationObservation.$Shape;
             *   (properties?: bazaar.v2.StationObservation.$Properties): bazaar.v2.StationObservation;
             * }}
             */
            StationObservation.create = function(properties) {
                return new StationObservation(properties);
            };

            /**
             * Encodes the specified StationObservation message. Does not implicitly {@link bazaar.v2.StationObservation.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.StationObservation
             * @static
             * @param {bazaar.v2.StationObservation.$Properties} message StationObservation message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StationObservation.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.station_id);
                $root.bazaar.v2.Bundle.encode(message.inventory, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
                writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.health);
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.failed_once);
                $root.bazaar.v2.NullableUint.encode(message.first_failure_tick, writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.Bundle.encode(message.last_production, writer.uint32(/* id 6, wireType 2 =*/50).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.Bundle.encode(message.last_unmet_upkeep, writer.uint32(/* id 7, wireType 2 =*/58).fork(), _depth + 1).ldelim();
                writer.uint32(/* id 8, wireType 0 =*/64).uint64(message.fully_supplied_ticks);
                writer.uint32(/* id 9, wireType 0 =*/72).uint64(message.shortage_ticks);
                writer.uint32(/* id 10, wireType 0 =*/80).uint64(message.current_shortage_streak);
                writer.uint32(/* id 11, wireType 0 =*/88).uint64(message.longest_shortage_streak);
                $root.bazaar.v2.Bundle.encode(message.produced_total, writer.uint32(/* id 12, wireType 2 =*/98).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.Bundle.encode(message.consumed_total, writer.uint32(/* id 13, wireType 2 =*/106).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.Bundle.encode(message.unmet_total, writer.uint32(/* id 14, wireType 2 =*/114).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.Bundle.encode(message.imported_total, writer.uint32(/* id 15, wireType 2 =*/122).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.Bundle.encode(message.exported_total, writer.uint32(/* id 16, wireType 2 =*/130).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.Bundle.encode(message.upkeep_per_tick, writer.uint32(/* id 17, wireType 2 =*/138).fork(), _depth + 1).ldelim();
                writer.uint32(/* id 18, wireType 0 =*/144).int32(message.specialty);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified StationObservation message, length delimited. Does not implicitly {@link bazaar.v2.StationObservation.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.StationObservation
             * @static
             * @param {bazaar.v2.StationObservation.$Properties} message StationObservation message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StationObservation.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a StationObservation message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.StationObservation
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.StationObservation & bazaar.v2.StationObservation.$Shape} StationObservation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StationObservation.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.StationObservation();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            message.station_id = reader.string();
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.inventory = $root.bazaar.v2.Bundle.decode(reader, reader.uint32(), $undefined, _depth + 1, message.inventory);
                            continue;
                        }
                    case 3: {
                            if (wireType !== 0)
                                break;
                            message.health = reader.uint64();
                            continue;
                        }
                    case 4: {
                            if (wireType !== 0)
                                break;
                            message.failed_once = reader.bool();
                            continue;
                        }
                    case 5: {
                            if (wireType !== 2)
                                break;
                            message.first_failure_tick = $root.bazaar.v2.NullableUint.decode(reader, reader.uint32(), $undefined, _depth + 1, message.first_failure_tick);
                            continue;
                        }
                    case 6: {
                            if (wireType !== 2)
                                break;
                            message.last_production = $root.bazaar.v2.Bundle.decode(reader, reader.uint32(), $undefined, _depth + 1, message.last_production);
                            continue;
                        }
                    case 7: {
                            if (wireType !== 2)
                                break;
                            message.last_unmet_upkeep = $root.bazaar.v2.Bundle.decode(reader, reader.uint32(), $undefined, _depth + 1, message.last_unmet_upkeep);
                            continue;
                        }
                    case 8: {
                            if (wireType !== 0)
                                break;
                            message.fully_supplied_ticks = reader.uint64();
                            continue;
                        }
                    case 9: {
                            if (wireType !== 0)
                                break;
                            message.shortage_ticks = reader.uint64();
                            continue;
                        }
                    case 10: {
                            if (wireType !== 0)
                                break;
                            message.current_shortage_streak = reader.uint64();
                            continue;
                        }
                    case 11: {
                            if (wireType !== 0)
                                break;
                            message.longest_shortage_streak = reader.uint64();
                            continue;
                        }
                    case 12: {
                            if (wireType !== 2)
                                break;
                            message.produced_total = $root.bazaar.v2.Bundle.decode(reader, reader.uint32(), $undefined, _depth + 1, message.produced_total);
                            continue;
                        }
                    case 13: {
                            if (wireType !== 2)
                                break;
                            message.consumed_total = $root.bazaar.v2.Bundle.decode(reader, reader.uint32(), $undefined, _depth + 1, message.consumed_total);
                            continue;
                        }
                    case 14: {
                            if (wireType !== 2)
                                break;
                            message.unmet_total = $root.bazaar.v2.Bundle.decode(reader, reader.uint32(), $undefined, _depth + 1, message.unmet_total);
                            continue;
                        }
                    case 15: {
                            if (wireType !== 2)
                                break;
                            message.imported_total = $root.bazaar.v2.Bundle.decode(reader, reader.uint32(), $undefined, _depth + 1, message.imported_total);
                            continue;
                        }
                    case 16: {
                            if (wireType !== 2)
                                break;
                            message.exported_total = $root.bazaar.v2.Bundle.decode(reader, reader.uint32(), $undefined, _depth + 1, message.exported_total);
                            continue;
                        }
                    case 17: {
                            if (wireType !== 2)
                                break;
                            message.upkeep_per_tick = $root.bazaar.v2.Bundle.decode(reader, reader.uint32(), $undefined, _depth + 1, message.upkeep_per_tick);
                            continue;
                        }
                    case 18: {
                            if (wireType !== 0)
                                break;
                            value = reader.int32();
                            if ($root.bazaar.v2.Resource[value] !== $undefined)
                                message.specialty = value;
                            else if (!reader.discardUnknown) {
                                $util.makeProp(message, "$unknowns", false);
                                (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                            }
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "station_id"))
                    throw $util.ProtocolError("missing required 'station_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "inventory"))
                    throw $util.ProtocolError("missing required 'inventory'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "health"))
                    throw $util.ProtocolError("missing required 'health'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "failed_once"))
                    throw $util.ProtocolError("missing required 'failed_once'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "first_failure_tick"))
                    throw $util.ProtocolError("missing required 'first_failure_tick'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "last_production"))
                    throw $util.ProtocolError("missing required 'last_production'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "last_unmet_upkeep"))
                    throw $util.ProtocolError("missing required 'last_unmet_upkeep'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "fully_supplied_ticks"))
                    throw $util.ProtocolError("missing required 'fully_supplied_ticks'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "shortage_ticks"))
                    throw $util.ProtocolError("missing required 'shortage_ticks'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "current_shortage_streak"))
                    throw $util.ProtocolError("missing required 'current_shortage_streak'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "longest_shortage_streak"))
                    throw $util.ProtocolError("missing required 'longest_shortage_streak'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "produced_total"))
                    throw $util.ProtocolError("missing required 'produced_total'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "consumed_total"))
                    throw $util.ProtocolError("missing required 'consumed_total'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "unmet_total"))
                    throw $util.ProtocolError("missing required 'unmet_total'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "imported_total"))
                    throw $util.ProtocolError("missing required 'imported_total'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "exported_total"))
                    throw $util.ProtocolError("missing required 'exported_total'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "upkeep_per_tick"))
                    throw $util.ProtocolError("missing required 'upkeep_per_tick'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "specialty"))
                    throw $util.ProtocolError("missing required 'specialty'", { instance: message });
                return message;
            };

            /**
             * Decodes a StationObservation message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.StationObservation
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.StationObservation & bazaar.v2.StationObservation.$Shape} StationObservation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StationObservation.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a StationObservation message.
             * @function verify
             * @memberof bazaar.v2.StationObservation
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            StationObservation.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (!$util.isString(message.station_id))
                    return "station_id: string expected";
                {
                    var error = $root.bazaar.v2.Bundle.verify(message.inventory, _depth + 1);
                    if (error)
                        return "inventory." + error;
                }
                if (!$util.isInteger(message.health) && !(message.health && $util.isInteger(message.health.low) && $util.isInteger(message.health.high)))
                    return "health: integer|Long expected";
                if (typeof message.failed_once !== "boolean")
                    return "failed_once: boolean expected";
                {
                    var error = $root.bazaar.v2.NullableUint.verify(message.first_failure_tick, _depth + 1);
                    if (error)
                        return "first_failure_tick." + error;
                }
                {
                    var error = $root.bazaar.v2.Bundle.verify(message.last_production, _depth + 1);
                    if (error)
                        return "last_production." + error;
                }
                {
                    var error = $root.bazaar.v2.Bundle.verify(message.last_unmet_upkeep, _depth + 1);
                    if (error)
                        return "last_unmet_upkeep." + error;
                }
                if (!$util.isInteger(message.fully_supplied_ticks) && !(message.fully_supplied_ticks && $util.isInteger(message.fully_supplied_ticks.low) && $util.isInteger(message.fully_supplied_ticks.high)))
                    return "fully_supplied_ticks: integer|Long expected";
                if (!$util.isInteger(message.shortage_ticks) && !(message.shortage_ticks && $util.isInteger(message.shortage_ticks.low) && $util.isInteger(message.shortage_ticks.high)))
                    return "shortage_ticks: integer|Long expected";
                if (!$util.isInteger(message.current_shortage_streak) && !(message.current_shortage_streak && $util.isInteger(message.current_shortage_streak.low) && $util.isInteger(message.current_shortage_streak.high)))
                    return "current_shortage_streak: integer|Long expected";
                if (!$util.isInteger(message.longest_shortage_streak) && !(message.longest_shortage_streak && $util.isInteger(message.longest_shortage_streak.low) && $util.isInteger(message.longest_shortage_streak.high)))
                    return "longest_shortage_streak: integer|Long expected";
                {
                    var error = $root.bazaar.v2.Bundle.verify(message.produced_total, _depth + 1);
                    if (error)
                        return "produced_total." + error;
                }
                {
                    var error = $root.bazaar.v2.Bundle.verify(message.consumed_total, _depth + 1);
                    if (error)
                        return "consumed_total." + error;
                }
                {
                    var error = $root.bazaar.v2.Bundle.verify(message.unmet_total, _depth + 1);
                    if (error)
                        return "unmet_total." + error;
                }
                {
                    var error = $root.bazaar.v2.Bundle.verify(message.imported_total, _depth + 1);
                    if (error)
                        return "imported_total." + error;
                }
                {
                    var error = $root.bazaar.v2.Bundle.verify(message.exported_total, _depth + 1);
                    if (error)
                        return "exported_total." + error;
                }
                {
                    var error = $root.bazaar.v2.Bundle.verify(message.upkeep_per_tick, _depth + 1);
                    if (error)
                        return "upkeep_per_tick." + error;
                }
                switch (message.specialty) {
                default:
                    return "specialty: enum value expected";
                case 1:
                case 2:
                case 3:
                    break;
                }
                return null;
            };

            /**
             * Creates a StationObservation message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.StationObservation
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.StationObservation} StationObservation
             */
            StationObservation.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.StationObservation)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.StationObservation: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.StationObservation();
                if (object.station_id != null)
                    message.station_id = $String(object.station_id);
                if (object.inventory != null) {
                    if (!$util.isObject(object.inventory))
                        throw $TypeError(".bazaar.v2.StationObservation.inventory: object expected");
                    message.inventory = $root.bazaar.v2.Bundle.fromObject(object.inventory, _depth + 1);
                }
                if (object.health != null)
                    if ($util.Long)
                        message.health = $util.Long.fromValue(object.health, true);
                    else if (typeof object.health === "string")
                        message.health = $parseInt(object.health, 10);
                    else if (typeof object.health === "number")
                        message.health = object.health;
                    else if (typeof object.health === "object")
                        message.health = new $util.LongBits(object.health.low >>> 0, object.health.high >>> 0).toNumber(true);
                if (object.failed_once != null)
                    message.failed_once = $Boolean(object.failed_once);
                if (object.first_failure_tick != null) {
                    if (!$util.isObject(object.first_failure_tick))
                        throw $TypeError(".bazaar.v2.StationObservation.first_failure_tick: object expected");
                    message.first_failure_tick = $root.bazaar.v2.NullableUint.fromObject(object.first_failure_tick, _depth + 1);
                }
                if (object.last_production != null) {
                    if (!$util.isObject(object.last_production))
                        throw $TypeError(".bazaar.v2.StationObservation.last_production: object expected");
                    message.last_production = $root.bazaar.v2.Bundle.fromObject(object.last_production, _depth + 1);
                }
                if (object.last_unmet_upkeep != null) {
                    if (!$util.isObject(object.last_unmet_upkeep))
                        throw $TypeError(".bazaar.v2.StationObservation.last_unmet_upkeep: object expected");
                    message.last_unmet_upkeep = $root.bazaar.v2.Bundle.fromObject(object.last_unmet_upkeep, _depth + 1);
                }
                if (object.fully_supplied_ticks != null)
                    if ($util.Long)
                        message.fully_supplied_ticks = $util.Long.fromValue(object.fully_supplied_ticks, true);
                    else if (typeof object.fully_supplied_ticks === "string")
                        message.fully_supplied_ticks = $parseInt(object.fully_supplied_ticks, 10);
                    else if (typeof object.fully_supplied_ticks === "number")
                        message.fully_supplied_ticks = object.fully_supplied_ticks;
                    else if (typeof object.fully_supplied_ticks === "object")
                        message.fully_supplied_ticks = new $util.LongBits(object.fully_supplied_ticks.low >>> 0, object.fully_supplied_ticks.high >>> 0).toNumber(true);
                if (object.shortage_ticks != null)
                    if ($util.Long)
                        message.shortage_ticks = $util.Long.fromValue(object.shortage_ticks, true);
                    else if (typeof object.shortage_ticks === "string")
                        message.shortage_ticks = $parseInt(object.shortage_ticks, 10);
                    else if (typeof object.shortage_ticks === "number")
                        message.shortage_ticks = object.shortage_ticks;
                    else if (typeof object.shortage_ticks === "object")
                        message.shortage_ticks = new $util.LongBits(object.shortage_ticks.low >>> 0, object.shortage_ticks.high >>> 0).toNumber(true);
                if (object.current_shortage_streak != null)
                    if ($util.Long)
                        message.current_shortage_streak = $util.Long.fromValue(object.current_shortage_streak, true);
                    else if (typeof object.current_shortage_streak === "string")
                        message.current_shortage_streak = $parseInt(object.current_shortage_streak, 10);
                    else if (typeof object.current_shortage_streak === "number")
                        message.current_shortage_streak = object.current_shortage_streak;
                    else if (typeof object.current_shortage_streak === "object")
                        message.current_shortage_streak = new $util.LongBits(object.current_shortage_streak.low >>> 0, object.current_shortage_streak.high >>> 0).toNumber(true);
                if (object.longest_shortage_streak != null)
                    if ($util.Long)
                        message.longest_shortage_streak = $util.Long.fromValue(object.longest_shortage_streak, true);
                    else if (typeof object.longest_shortage_streak === "string")
                        message.longest_shortage_streak = $parseInt(object.longest_shortage_streak, 10);
                    else if (typeof object.longest_shortage_streak === "number")
                        message.longest_shortage_streak = object.longest_shortage_streak;
                    else if (typeof object.longest_shortage_streak === "object")
                        message.longest_shortage_streak = new $util.LongBits(object.longest_shortage_streak.low >>> 0, object.longest_shortage_streak.high >>> 0).toNumber(true);
                if (object.produced_total != null) {
                    if (!$util.isObject(object.produced_total))
                        throw $TypeError(".bazaar.v2.StationObservation.produced_total: object expected");
                    message.produced_total = $root.bazaar.v2.Bundle.fromObject(object.produced_total, _depth + 1);
                }
                if (object.consumed_total != null) {
                    if (!$util.isObject(object.consumed_total))
                        throw $TypeError(".bazaar.v2.StationObservation.consumed_total: object expected");
                    message.consumed_total = $root.bazaar.v2.Bundle.fromObject(object.consumed_total, _depth + 1);
                }
                if (object.unmet_total != null) {
                    if (!$util.isObject(object.unmet_total))
                        throw $TypeError(".bazaar.v2.StationObservation.unmet_total: object expected");
                    message.unmet_total = $root.bazaar.v2.Bundle.fromObject(object.unmet_total, _depth + 1);
                }
                if (object.imported_total != null) {
                    if (!$util.isObject(object.imported_total))
                        throw $TypeError(".bazaar.v2.StationObservation.imported_total: object expected");
                    message.imported_total = $root.bazaar.v2.Bundle.fromObject(object.imported_total, _depth + 1);
                }
                if (object.exported_total != null) {
                    if (!$util.isObject(object.exported_total))
                        throw $TypeError(".bazaar.v2.StationObservation.exported_total: object expected");
                    message.exported_total = $root.bazaar.v2.Bundle.fromObject(object.exported_total, _depth + 1);
                }
                if (object.upkeep_per_tick != null) {
                    if (!$util.isObject(object.upkeep_per_tick))
                        throw $TypeError(".bazaar.v2.StationObservation.upkeep_per_tick: object expected");
                    message.upkeep_per_tick = $root.bazaar.v2.Bundle.fromObject(object.upkeep_per_tick, _depth + 1);
                }
                switch (object.specialty) {
                case "RESOURCE_WATER":
                case 1:
                    message.specialty = 1;
                    break;
                case "RESOURCE_FOOD":
                case 2:
                    message.specialty = 2;
                    break;
                case "RESOURCE_COMPONENTS":
                case 3:
                    message.specialty = 3;
                    break;
                default:
                }
                return message;
            };

            /**
             * Creates a plain object from a StationObservation message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.StationObservation
             * @static
             * @param {bazaar.v2.StationObservation} message StationObservation
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            StationObservation.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.station_id = "";
                    object.inventory = null;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.health = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.health = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    object.failed_once = false;
                    object.first_failure_tick = null;
                    object.last_production = null;
                    object.last_unmet_upkeep = null;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.fully_supplied_ticks = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.fully_supplied_ticks = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.shortage_ticks = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.shortage_ticks = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.current_shortage_streak = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.current_shortage_streak = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.longest_shortage_streak = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.longest_shortage_streak = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    object.produced_total = null;
                    object.consumed_total = null;
                    object.unmet_total = null;
                    object.imported_total = null;
                    object.exported_total = null;
                    object.upkeep_per_tick = null;
                    object.specialty = options.enums === $String ? "RESOURCE_WATER" : 1;
                }
                if (message.station_id != null && $Object.hasOwnProperty.call(message, "station_id"))
                    object.station_id = message.station_id;
                if (message.inventory != null && $Object.hasOwnProperty.call(message, "inventory"))
                    object.inventory = $root.bazaar.v2.Bundle.toObject(message.inventory, options, _depth + 1);
                if (message.health != null && $Object.hasOwnProperty.call(message, "health"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.health = typeof message.health === "number" ? $BigInt(message.health) : $util.Long.fromBits(message.health.low >>> 0, message.health.high >>> 0, true).toBigInt();
                    else if (typeof message.health === "number")
                        object.health = options.longs === $String ? $String(message.health) : message.health;
                    else
                        object.health = options.longs === $String ? $util.Long.prototype.toString.call(message.health) : options.longs === $Number ? new $util.LongBits(message.health.low >>> 0, message.health.high >>> 0).toNumber(true) : message.health;
                if (message.failed_once != null && $Object.hasOwnProperty.call(message, "failed_once"))
                    object.failed_once = message.failed_once;
                if (message.first_failure_tick != null && $Object.hasOwnProperty.call(message, "first_failure_tick"))
                    object.first_failure_tick = $root.bazaar.v2.NullableUint.toObject(message.first_failure_tick, options, _depth + 1);
                if (message.last_production != null && $Object.hasOwnProperty.call(message, "last_production"))
                    object.last_production = $root.bazaar.v2.Bundle.toObject(message.last_production, options, _depth + 1);
                if (message.last_unmet_upkeep != null && $Object.hasOwnProperty.call(message, "last_unmet_upkeep"))
                    object.last_unmet_upkeep = $root.bazaar.v2.Bundle.toObject(message.last_unmet_upkeep, options, _depth + 1);
                if (message.fully_supplied_ticks != null && $Object.hasOwnProperty.call(message, "fully_supplied_ticks"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.fully_supplied_ticks = typeof message.fully_supplied_ticks === "number" ? $BigInt(message.fully_supplied_ticks) : $util.Long.fromBits(message.fully_supplied_ticks.low >>> 0, message.fully_supplied_ticks.high >>> 0, true).toBigInt();
                    else if (typeof message.fully_supplied_ticks === "number")
                        object.fully_supplied_ticks = options.longs === $String ? $String(message.fully_supplied_ticks) : message.fully_supplied_ticks;
                    else
                        object.fully_supplied_ticks = options.longs === $String ? $util.Long.prototype.toString.call(message.fully_supplied_ticks) : options.longs === $Number ? new $util.LongBits(message.fully_supplied_ticks.low >>> 0, message.fully_supplied_ticks.high >>> 0).toNumber(true) : message.fully_supplied_ticks;
                if (message.shortage_ticks != null && $Object.hasOwnProperty.call(message, "shortage_ticks"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.shortage_ticks = typeof message.shortage_ticks === "number" ? $BigInt(message.shortage_ticks) : $util.Long.fromBits(message.shortage_ticks.low >>> 0, message.shortage_ticks.high >>> 0, true).toBigInt();
                    else if (typeof message.shortage_ticks === "number")
                        object.shortage_ticks = options.longs === $String ? $String(message.shortage_ticks) : message.shortage_ticks;
                    else
                        object.shortage_ticks = options.longs === $String ? $util.Long.prototype.toString.call(message.shortage_ticks) : options.longs === $Number ? new $util.LongBits(message.shortage_ticks.low >>> 0, message.shortage_ticks.high >>> 0).toNumber(true) : message.shortage_ticks;
                if (message.current_shortage_streak != null && $Object.hasOwnProperty.call(message, "current_shortage_streak"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.current_shortage_streak = typeof message.current_shortage_streak === "number" ? $BigInt(message.current_shortage_streak) : $util.Long.fromBits(message.current_shortage_streak.low >>> 0, message.current_shortage_streak.high >>> 0, true).toBigInt();
                    else if (typeof message.current_shortage_streak === "number")
                        object.current_shortage_streak = options.longs === $String ? $String(message.current_shortage_streak) : message.current_shortage_streak;
                    else
                        object.current_shortage_streak = options.longs === $String ? $util.Long.prototype.toString.call(message.current_shortage_streak) : options.longs === $Number ? new $util.LongBits(message.current_shortage_streak.low >>> 0, message.current_shortage_streak.high >>> 0).toNumber(true) : message.current_shortage_streak;
                if (message.longest_shortage_streak != null && $Object.hasOwnProperty.call(message, "longest_shortage_streak"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.longest_shortage_streak = typeof message.longest_shortage_streak === "number" ? $BigInt(message.longest_shortage_streak) : $util.Long.fromBits(message.longest_shortage_streak.low >>> 0, message.longest_shortage_streak.high >>> 0, true).toBigInt();
                    else if (typeof message.longest_shortage_streak === "number")
                        object.longest_shortage_streak = options.longs === $String ? $String(message.longest_shortage_streak) : message.longest_shortage_streak;
                    else
                        object.longest_shortage_streak = options.longs === $String ? $util.Long.prototype.toString.call(message.longest_shortage_streak) : options.longs === $Number ? new $util.LongBits(message.longest_shortage_streak.low >>> 0, message.longest_shortage_streak.high >>> 0).toNumber(true) : message.longest_shortage_streak;
                if (message.produced_total != null && $Object.hasOwnProperty.call(message, "produced_total"))
                    object.produced_total = $root.bazaar.v2.Bundle.toObject(message.produced_total, options, _depth + 1);
                if (message.consumed_total != null && $Object.hasOwnProperty.call(message, "consumed_total"))
                    object.consumed_total = $root.bazaar.v2.Bundle.toObject(message.consumed_total, options, _depth + 1);
                if (message.unmet_total != null && $Object.hasOwnProperty.call(message, "unmet_total"))
                    object.unmet_total = $root.bazaar.v2.Bundle.toObject(message.unmet_total, options, _depth + 1);
                if (message.imported_total != null && $Object.hasOwnProperty.call(message, "imported_total"))
                    object.imported_total = $root.bazaar.v2.Bundle.toObject(message.imported_total, options, _depth + 1);
                if (message.exported_total != null && $Object.hasOwnProperty.call(message, "exported_total"))
                    object.exported_total = $root.bazaar.v2.Bundle.toObject(message.exported_total, options, _depth + 1);
                if (message.upkeep_per_tick != null && $Object.hasOwnProperty.call(message, "upkeep_per_tick"))
                    object.upkeep_per_tick = $root.bazaar.v2.Bundle.toObject(message.upkeep_per_tick, options, _depth + 1);
                if (message.specialty != null && $Object.hasOwnProperty.call(message, "specialty"))
                    object.specialty = options.enums === $String ? $root.bazaar.v2.Resource[message.specialty] === $undefined ? message.specialty : $root.bazaar.v2.Resource[message.specialty] : message.specialty;
                return object;
            };

            /**
             * Converts this StationObservation to JSON.
             * @function toJSON
             * @memberof bazaar.v2.StationObservation
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            StationObservation.prototype.toJSON = function() {
                return StationObservation.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for StationObservation
             * @function getTypeUrl
             * @memberof bazaar.v2.StationObservation
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            StationObservation.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.StationObservation";
            };

            return StationObservation;
        })();

        v2.PublicRules = (function() {

            /**
             * Properties of a PublicRules.
             * @typedef {Object} bazaar.v2.PublicRules.$Properties
             * @property {string} rules_version PublicRules rules_version
             * @property {Long} duration_ticks PublicRules duration_ticks
             * @property {Long} tick_duration_ms PublicRules tick_duration_ms
             * @property {bazaar.v2.ListResource.$Properties} resource_order PublicRules resource_order
             * @property {Long} max_health PublicRules max_health
             * @property {Long} shortage_damage_per_unit PublicRules shortage_damage_per_unit
             * @property {Long} recovery_per_fully_supplied_tick PublicRules recovery_per_fully_supplied_tick
             * @property {Long} max_publication_ttl_ticks PublicRules max_publication_ttl_ticks
             * @property {Long} max_offer_ttl_ticks PublicRules max_offer_ttl_ticks
             * @property {Long} new_commands_per_station_per_tick PublicRules new_commands_per_station_per_tick
             * @property {Long} max_request_records_per_station PublicRules max_request_records_per_station
             * @property {Long} max_open_outgoing_offers PublicRules max_open_outgoing_offers
             * @property {Long} max_command_bytes PublicRules max_command_bytes
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a PublicRules.
             * @memberof bazaar.v2
             * @interface IPublicRules
             * @augments bazaar.v2.PublicRules.$Properties
             * @deprecated Use bazaar.v2.PublicRules.$Properties instead.
             */

            /**
             * Shape of a PublicRules.
             * @typedef {bazaar.v2.PublicRules.$Properties} bazaar.v2.PublicRules.$Shape
             */

            /**
             * Constructs a new PublicRules.
             * @memberof bazaar.v2
             * @classdesc Represents a PublicRules.
             * @constructor
             * @param {bazaar.v2.PublicRules.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var PublicRules = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * PublicRules rules_version.
             * @member {string} rules_version
             * @memberof bazaar.v2.PublicRules
             * @instance
             */
            PublicRules.prototype.rules_version = "";

            /**
             * PublicRules duration_ticks.
             * @member {Long} duration_ticks
             * @memberof bazaar.v2.PublicRules
             * @instance
             */
            PublicRules.prototype.duration_ticks = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * PublicRules tick_duration_ms.
             * @member {Long} tick_duration_ms
             * @memberof bazaar.v2.PublicRules
             * @instance
             */
            PublicRules.prototype.tick_duration_ms = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * PublicRules resource_order.
             * @member {bazaar.v2.ListResource.$Properties} resource_order
             * @memberof bazaar.v2.PublicRules
             * @instance
             */
            PublicRules.prototype.resource_order = null;

            /**
             * PublicRules max_health.
             * @member {Long} max_health
             * @memberof bazaar.v2.PublicRules
             * @instance
             */
            PublicRules.prototype.max_health = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * PublicRules shortage_damage_per_unit.
             * @member {Long} shortage_damage_per_unit
             * @memberof bazaar.v2.PublicRules
             * @instance
             */
            PublicRules.prototype.shortage_damage_per_unit = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * PublicRules recovery_per_fully_supplied_tick.
             * @member {Long} recovery_per_fully_supplied_tick
             * @memberof bazaar.v2.PublicRules
             * @instance
             */
            PublicRules.prototype.recovery_per_fully_supplied_tick = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * PublicRules max_publication_ttl_ticks.
             * @member {Long} max_publication_ttl_ticks
             * @memberof bazaar.v2.PublicRules
             * @instance
             */
            PublicRules.prototype.max_publication_ttl_ticks = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * PublicRules max_offer_ttl_ticks.
             * @member {Long} max_offer_ttl_ticks
             * @memberof bazaar.v2.PublicRules
             * @instance
             */
            PublicRules.prototype.max_offer_ttl_ticks = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * PublicRules new_commands_per_station_per_tick.
             * @member {Long} new_commands_per_station_per_tick
             * @memberof bazaar.v2.PublicRules
             * @instance
             */
            PublicRules.prototype.new_commands_per_station_per_tick = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * PublicRules max_request_records_per_station.
             * @member {Long} max_request_records_per_station
             * @memberof bazaar.v2.PublicRules
             * @instance
             */
            PublicRules.prototype.max_request_records_per_station = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * PublicRules max_open_outgoing_offers.
             * @member {Long} max_open_outgoing_offers
             * @memberof bazaar.v2.PublicRules
             * @instance
             */
            PublicRules.prototype.max_open_outgoing_offers = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * PublicRules max_command_bytes.
             * @member {Long} max_command_bytes
             * @memberof bazaar.v2.PublicRules
             * @instance
             */
            PublicRules.prototype.max_command_bytes = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new PublicRules instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.PublicRules
             * @static
             * @param {bazaar.v2.PublicRules.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.PublicRules} PublicRules instance
             * @type {{
             *   (properties: bazaar.v2.PublicRules.$Shape): bazaar.v2.PublicRules & bazaar.v2.PublicRules.$Shape;
             *   (properties?: bazaar.v2.PublicRules.$Properties): bazaar.v2.PublicRules;
             * }}
             */
            PublicRules.create = function(properties) {
                return new PublicRules(properties);
            };

            /**
             * Encodes the specified PublicRules message. Does not implicitly {@link bazaar.v2.PublicRules.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.PublicRules
             * @static
             * @param {bazaar.v2.PublicRules.$Properties} message PublicRules message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PublicRules.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.rules_version);
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.duration_ticks);
                writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.tick_duration_ms);
                $root.bazaar.v2.ListResource.encode(message.resource_order, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
                writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.max_health);
                writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.shortage_damage_per_unit);
                writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.recovery_per_fully_supplied_tick);
                writer.uint32(/* id 8, wireType 0 =*/64).uint64(message.max_publication_ttl_ticks);
                writer.uint32(/* id 9, wireType 0 =*/72).uint64(message.max_offer_ttl_ticks);
                writer.uint32(/* id 10, wireType 0 =*/80).uint64(message.new_commands_per_station_per_tick);
                writer.uint32(/* id 11, wireType 0 =*/88).uint64(message.max_request_records_per_station);
                writer.uint32(/* id 12, wireType 0 =*/96).uint64(message.max_open_outgoing_offers);
                writer.uint32(/* id 13, wireType 0 =*/104).uint64(message.max_command_bytes);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified PublicRules message, length delimited. Does not implicitly {@link bazaar.v2.PublicRules.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.PublicRules
             * @static
             * @param {bazaar.v2.PublicRules.$Properties} message PublicRules message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PublicRules.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a PublicRules message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.PublicRules
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.PublicRules & bazaar.v2.PublicRules.$Shape} PublicRules
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PublicRules.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.PublicRules();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            message.rules_version = reader.string();
                            continue;
                        }
                    case 2: {
                            if (wireType !== 0)
                                break;
                            message.duration_ticks = reader.uint64();
                            continue;
                        }
                    case 3: {
                            if (wireType !== 0)
                                break;
                            message.tick_duration_ms = reader.uint64();
                            continue;
                        }
                    case 4: {
                            if (wireType !== 2)
                                break;
                            message.resource_order = $root.bazaar.v2.ListResource.decode(reader, reader.uint32(), $undefined, _depth + 1, message.resource_order);
                            continue;
                        }
                    case 5: {
                            if (wireType !== 0)
                                break;
                            message.max_health = reader.uint64();
                            continue;
                        }
                    case 6: {
                            if (wireType !== 0)
                                break;
                            message.shortage_damage_per_unit = reader.uint64();
                            continue;
                        }
                    case 7: {
                            if (wireType !== 0)
                                break;
                            message.recovery_per_fully_supplied_tick = reader.uint64();
                            continue;
                        }
                    case 8: {
                            if (wireType !== 0)
                                break;
                            message.max_publication_ttl_ticks = reader.uint64();
                            continue;
                        }
                    case 9: {
                            if (wireType !== 0)
                                break;
                            message.max_offer_ttl_ticks = reader.uint64();
                            continue;
                        }
                    case 10: {
                            if (wireType !== 0)
                                break;
                            message.new_commands_per_station_per_tick = reader.uint64();
                            continue;
                        }
                    case 11: {
                            if (wireType !== 0)
                                break;
                            message.max_request_records_per_station = reader.uint64();
                            continue;
                        }
                    case 12: {
                            if (wireType !== 0)
                                break;
                            message.max_open_outgoing_offers = reader.uint64();
                            continue;
                        }
                    case 13: {
                            if (wireType !== 0)
                                break;
                            message.max_command_bytes = reader.uint64();
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "rules_version"))
                    throw $util.ProtocolError("missing required 'rules_version'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "duration_ticks"))
                    throw $util.ProtocolError("missing required 'duration_ticks'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "tick_duration_ms"))
                    throw $util.ProtocolError("missing required 'tick_duration_ms'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "resource_order"))
                    throw $util.ProtocolError("missing required 'resource_order'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "max_health"))
                    throw $util.ProtocolError("missing required 'max_health'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "shortage_damage_per_unit"))
                    throw $util.ProtocolError("missing required 'shortage_damage_per_unit'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "recovery_per_fully_supplied_tick"))
                    throw $util.ProtocolError("missing required 'recovery_per_fully_supplied_tick'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "max_publication_ttl_ticks"))
                    throw $util.ProtocolError("missing required 'max_publication_ttl_ticks'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "max_offer_ttl_ticks"))
                    throw $util.ProtocolError("missing required 'max_offer_ttl_ticks'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "new_commands_per_station_per_tick"))
                    throw $util.ProtocolError("missing required 'new_commands_per_station_per_tick'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "max_request_records_per_station"))
                    throw $util.ProtocolError("missing required 'max_request_records_per_station'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "max_open_outgoing_offers"))
                    throw $util.ProtocolError("missing required 'max_open_outgoing_offers'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "max_command_bytes"))
                    throw $util.ProtocolError("missing required 'max_command_bytes'", { instance: message });
                return message;
            };

            /**
             * Decodes a PublicRules message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.PublicRules
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.PublicRules & bazaar.v2.PublicRules.$Shape} PublicRules
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PublicRules.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PublicRules message.
             * @function verify
             * @memberof bazaar.v2.PublicRules
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PublicRules.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (!$util.isString(message.rules_version))
                    return "rules_version: string expected";
                if (!$util.isInteger(message.duration_ticks) && !(message.duration_ticks && $util.isInteger(message.duration_ticks.low) && $util.isInteger(message.duration_ticks.high)))
                    return "duration_ticks: integer|Long expected";
                if (!$util.isInteger(message.tick_duration_ms) && !(message.tick_duration_ms && $util.isInteger(message.tick_duration_ms.low) && $util.isInteger(message.tick_duration_ms.high)))
                    return "tick_duration_ms: integer|Long expected";
                {
                    var error = $root.bazaar.v2.ListResource.verify(message.resource_order, _depth + 1);
                    if (error)
                        return "resource_order." + error;
                }
                if (!$util.isInteger(message.max_health) && !(message.max_health && $util.isInteger(message.max_health.low) && $util.isInteger(message.max_health.high)))
                    return "max_health: integer|Long expected";
                if (!$util.isInteger(message.shortage_damage_per_unit) && !(message.shortage_damage_per_unit && $util.isInteger(message.shortage_damage_per_unit.low) && $util.isInteger(message.shortage_damage_per_unit.high)))
                    return "shortage_damage_per_unit: integer|Long expected";
                if (!$util.isInteger(message.recovery_per_fully_supplied_tick) && !(message.recovery_per_fully_supplied_tick && $util.isInteger(message.recovery_per_fully_supplied_tick.low) && $util.isInteger(message.recovery_per_fully_supplied_tick.high)))
                    return "recovery_per_fully_supplied_tick: integer|Long expected";
                if (!$util.isInteger(message.max_publication_ttl_ticks) && !(message.max_publication_ttl_ticks && $util.isInteger(message.max_publication_ttl_ticks.low) && $util.isInteger(message.max_publication_ttl_ticks.high)))
                    return "max_publication_ttl_ticks: integer|Long expected";
                if (!$util.isInteger(message.max_offer_ttl_ticks) && !(message.max_offer_ttl_ticks && $util.isInteger(message.max_offer_ttl_ticks.low) && $util.isInteger(message.max_offer_ttl_ticks.high)))
                    return "max_offer_ttl_ticks: integer|Long expected";
                if (!$util.isInteger(message.new_commands_per_station_per_tick) && !(message.new_commands_per_station_per_tick && $util.isInteger(message.new_commands_per_station_per_tick.low) && $util.isInteger(message.new_commands_per_station_per_tick.high)))
                    return "new_commands_per_station_per_tick: integer|Long expected";
                if (!$util.isInteger(message.max_request_records_per_station) && !(message.max_request_records_per_station && $util.isInteger(message.max_request_records_per_station.low) && $util.isInteger(message.max_request_records_per_station.high)))
                    return "max_request_records_per_station: integer|Long expected";
                if (!$util.isInteger(message.max_open_outgoing_offers) && !(message.max_open_outgoing_offers && $util.isInteger(message.max_open_outgoing_offers.low) && $util.isInteger(message.max_open_outgoing_offers.high)))
                    return "max_open_outgoing_offers: integer|Long expected";
                if (!$util.isInteger(message.max_command_bytes) && !(message.max_command_bytes && $util.isInteger(message.max_command_bytes.low) && $util.isInteger(message.max_command_bytes.high)))
                    return "max_command_bytes: integer|Long expected";
                return null;
            };

            /**
             * Creates a PublicRules message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.PublicRules
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.PublicRules} PublicRules
             */
            PublicRules.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.PublicRules)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.PublicRules: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.PublicRules();
                if (object.rules_version != null)
                    message.rules_version = $String(object.rules_version);
                if (object.duration_ticks != null)
                    if ($util.Long)
                        message.duration_ticks = $util.Long.fromValue(object.duration_ticks, true);
                    else if (typeof object.duration_ticks === "string")
                        message.duration_ticks = $parseInt(object.duration_ticks, 10);
                    else if (typeof object.duration_ticks === "number")
                        message.duration_ticks = object.duration_ticks;
                    else if (typeof object.duration_ticks === "object")
                        message.duration_ticks = new $util.LongBits(object.duration_ticks.low >>> 0, object.duration_ticks.high >>> 0).toNumber(true);
                if (object.tick_duration_ms != null)
                    if ($util.Long)
                        message.tick_duration_ms = $util.Long.fromValue(object.tick_duration_ms, true);
                    else if (typeof object.tick_duration_ms === "string")
                        message.tick_duration_ms = $parseInt(object.tick_duration_ms, 10);
                    else if (typeof object.tick_duration_ms === "number")
                        message.tick_duration_ms = object.tick_duration_ms;
                    else if (typeof object.tick_duration_ms === "object")
                        message.tick_duration_ms = new $util.LongBits(object.tick_duration_ms.low >>> 0, object.tick_duration_ms.high >>> 0).toNumber(true);
                if (object.resource_order != null) {
                    if (!$util.isObject(object.resource_order))
                        throw $TypeError(".bazaar.v2.PublicRules.resource_order: object expected");
                    message.resource_order = $root.bazaar.v2.ListResource.fromObject(object.resource_order, _depth + 1);
                }
                if (object.max_health != null)
                    if ($util.Long)
                        message.max_health = $util.Long.fromValue(object.max_health, true);
                    else if (typeof object.max_health === "string")
                        message.max_health = $parseInt(object.max_health, 10);
                    else if (typeof object.max_health === "number")
                        message.max_health = object.max_health;
                    else if (typeof object.max_health === "object")
                        message.max_health = new $util.LongBits(object.max_health.low >>> 0, object.max_health.high >>> 0).toNumber(true);
                if (object.shortage_damage_per_unit != null)
                    if ($util.Long)
                        message.shortage_damage_per_unit = $util.Long.fromValue(object.shortage_damage_per_unit, true);
                    else if (typeof object.shortage_damage_per_unit === "string")
                        message.shortage_damage_per_unit = $parseInt(object.shortage_damage_per_unit, 10);
                    else if (typeof object.shortage_damage_per_unit === "number")
                        message.shortage_damage_per_unit = object.shortage_damage_per_unit;
                    else if (typeof object.shortage_damage_per_unit === "object")
                        message.shortage_damage_per_unit = new $util.LongBits(object.shortage_damage_per_unit.low >>> 0, object.shortage_damage_per_unit.high >>> 0).toNumber(true);
                if (object.recovery_per_fully_supplied_tick != null)
                    if ($util.Long)
                        message.recovery_per_fully_supplied_tick = $util.Long.fromValue(object.recovery_per_fully_supplied_tick, true);
                    else if (typeof object.recovery_per_fully_supplied_tick === "string")
                        message.recovery_per_fully_supplied_tick = $parseInt(object.recovery_per_fully_supplied_tick, 10);
                    else if (typeof object.recovery_per_fully_supplied_tick === "number")
                        message.recovery_per_fully_supplied_tick = object.recovery_per_fully_supplied_tick;
                    else if (typeof object.recovery_per_fully_supplied_tick === "object")
                        message.recovery_per_fully_supplied_tick = new $util.LongBits(object.recovery_per_fully_supplied_tick.low >>> 0, object.recovery_per_fully_supplied_tick.high >>> 0).toNumber(true);
                if (object.max_publication_ttl_ticks != null)
                    if ($util.Long)
                        message.max_publication_ttl_ticks = $util.Long.fromValue(object.max_publication_ttl_ticks, true);
                    else if (typeof object.max_publication_ttl_ticks === "string")
                        message.max_publication_ttl_ticks = $parseInt(object.max_publication_ttl_ticks, 10);
                    else if (typeof object.max_publication_ttl_ticks === "number")
                        message.max_publication_ttl_ticks = object.max_publication_ttl_ticks;
                    else if (typeof object.max_publication_ttl_ticks === "object")
                        message.max_publication_ttl_ticks = new $util.LongBits(object.max_publication_ttl_ticks.low >>> 0, object.max_publication_ttl_ticks.high >>> 0).toNumber(true);
                if (object.max_offer_ttl_ticks != null)
                    if ($util.Long)
                        message.max_offer_ttl_ticks = $util.Long.fromValue(object.max_offer_ttl_ticks, true);
                    else if (typeof object.max_offer_ttl_ticks === "string")
                        message.max_offer_ttl_ticks = $parseInt(object.max_offer_ttl_ticks, 10);
                    else if (typeof object.max_offer_ttl_ticks === "number")
                        message.max_offer_ttl_ticks = object.max_offer_ttl_ticks;
                    else if (typeof object.max_offer_ttl_ticks === "object")
                        message.max_offer_ttl_ticks = new $util.LongBits(object.max_offer_ttl_ticks.low >>> 0, object.max_offer_ttl_ticks.high >>> 0).toNumber(true);
                if (object.new_commands_per_station_per_tick != null)
                    if ($util.Long)
                        message.new_commands_per_station_per_tick = $util.Long.fromValue(object.new_commands_per_station_per_tick, true);
                    else if (typeof object.new_commands_per_station_per_tick === "string")
                        message.new_commands_per_station_per_tick = $parseInt(object.new_commands_per_station_per_tick, 10);
                    else if (typeof object.new_commands_per_station_per_tick === "number")
                        message.new_commands_per_station_per_tick = object.new_commands_per_station_per_tick;
                    else if (typeof object.new_commands_per_station_per_tick === "object")
                        message.new_commands_per_station_per_tick = new $util.LongBits(object.new_commands_per_station_per_tick.low >>> 0, object.new_commands_per_station_per_tick.high >>> 0).toNumber(true);
                if (object.max_request_records_per_station != null)
                    if ($util.Long)
                        message.max_request_records_per_station = $util.Long.fromValue(object.max_request_records_per_station, true);
                    else if (typeof object.max_request_records_per_station === "string")
                        message.max_request_records_per_station = $parseInt(object.max_request_records_per_station, 10);
                    else if (typeof object.max_request_records_per_station === "number")
                        message.max_request_records_per_station = object.max_request_records_per_station;
                    else if (typeof object.max_request_records_per_station === "object")
                        message.max_request_records_per_station = new $util.LongBits(object.max_request_records_per_station.low >>> 0, object.max_request_records_per_station.high >>> 0).toNumber(true);
                if (object.max_open_outgoing_offers != null)
                    if ($util.Long)
                        message.max_open_outgoing_offers = $util.Long.fromValue(object.max_open_outgoing_offers, true);
                    else if (typeof object.max_open_outgoing_offers === "string")
                        message.max_open_outgoing_offers = $parseInt(object.max_open_outgoing_offers, 10);
                    else if (typeof object.max_open_outgoing_offers === "number")
                        message.max_open_outgoing_offers = object.max_open_outgoing_offers;
                    else if (typeof object.max_open_outgoing_offers === "object")
                        message.max_open_outgoing_offers = new $util.LongBits(object.max_open_outgoing_offers.low >>> 0, object.max_open_outgoing_offers.high >>> 0).toNumber(true);
                if (object.max_command_bytes != null)
                    if ($util.Long)
                        message.max_command_bytes = $util.Long.fromValue(object.max_command_bytes, true);
                    else if (typeof object.max_command_bytes === "string")
                        message.max_command_bytes = $parseInt(object.max_command_bytes, 10);
                    else if (typeof object.max_command_bytes === "number")
                        message.max_command_bytes = object.max_command_bytes;
                    else if (typeof object.max_command_bytes === "object")
                        message.max_command_bytes = new $util.LongBits(object.max_command_bytes.low >>> 0, object.max_command_bytes.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a PublicRules message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.PublicRules
             * @static
             * @param {bazaar.v2.PublicRules} message PublicRules
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PublicRules.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.rules_version = "";
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.duration_ticks = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.duration_ticks = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.tick_duration_ms = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.tick_duration_ms = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    object.resource_order = null;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.max_health = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.max_health = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.shortage_damage_per_unit = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.shortage_damage_per_unit = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.recovery_per_fully_supplied_tick = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.recovery_per_fully_supplied_tick = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.max_publication_ttl_ticks = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.max_publication_ttl_ticks = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.max_offer_ttl_ticks = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.max_offer_ttl_ticks = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.new_commands_per_station_per_tick = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.new_commands_per_station_per_tick = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.max_request_records_per_station = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.max_request_records_per_station = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.max_open_outgoing_offers = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.max_open_outgoing_offers = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.max_command_bytes = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.max_command_bytes = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                }
                if (message.rules_version != null && $Object.hasOwnProperty.call(message, "rules_version"))
                    object.rules_version = message.rules_version;
                if (message.duration_ticks != null && $Object.hasOwnProperty.call(message, "duration_ticks"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.duration_ticks = typeof message.duration_ticks === "number" ? $BigInt(message.duration_ticks) : $util.Long.fromBits(message.duration_ticks.low >>> 0, message.duration_ticks.high >>> 0, true).toBigInt();
                    else if (typeof message.duration_ticks === "number")
                        object.duration_ticks = options.longs === $String ? $String(message.duration_ticks) : message.duration_ticks;
                    else
                        object.duration_ticks = options.longs === $String ? $util.Long.prototype.toString.call(message.duration_ticks) : options.longs === $Number ? new $util.LongBits(message.duration_ticks.low >>> 0, message.duration_ticks.high >>> 0).toNumber(true) : message.duration_ticks;
                if (message.tick_duration_ms != null && $Object.hasOwnProperty.call(message, "tick_duration_ms"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.tick_duration_ms = typeof message.tick_duration_ms === "number" ? $BigInt(message.tick_duration_ms) : $util.Long.fromBits(message.tick_duration_ms.low >>> 0, message.tick_duration_ms.high >>> 0, true).toBigInt();
                    else if (typeof message.tick_duration_ms === "number")
                        object.tick_duration_ms = options.longs === $String ? $String(message.tick_duration_ms) : message.tick_duration_ms;
                    else
                        object.tick_duration_ms = options.longs === $String ? $util.Long.prototype.toString.call(message.tick_duration_ms) : options.longs === $Number ? new $util.LongBits(message.tick_duration_ms.low >>> 0, message.tick_duration_ms.high >>> 0).toNumber(true) : message.tick_duration_ms;
                if (message.resource_order != null && $Object.hasOwnProperty.call(message, "resource_order"))
                    object.resource_order = $root.bazaar.v2.ListResource.toObject(message.resource_order, options, _depth + 1);
                if (message.max_health != null && $Object.hasOwnProperty.call(message, "max_health"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.max_health = typeof message.max_health === "number" ? $BigInt(message.max_health) : $util.Long.fromBits(message.max_health.low >>> 0, message.max_health.high >>> 0, true).toBigInt();
                    else if (typeof message.max_health === "number")
                        object.max_health = options.longs === $String ? $String(message.max_health) : message.max_health;
                    else
                        object.max_health = options.longs === $String ? $util.Long.prototype.toString.call(message.max_health) : options.longs === $Number ? new $util.LongBits(message.max_health.low >>> 0, message.max_health.high >>> 0).toNumber(true) : message.max_health;
                if (message.shortage_damage_per_unit != null && $Object.hasOwnProperty.call(message, "shortage_damage_per_unit"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.shortage_damage_per_unit = typeof message.shortage_damage_per_unit === "number" ? $BigInt(message.shortage_damage_per_unit) : $util.Long.fromBits(message.shortage_damage_per_unit.low >>> 0, message.shortage_damage_per_unit.high >>> 0, true).toBigInt();
                    else if (typeof message.shortage_damage_per_unit === "number")
                        object.shortage_damage_per_unit = options.longs === $String ? $String(message.shortage_damage_per_unit) : message.shortage_damage_per_unit;
                    else
                        object.shortage_damage_per_unit = options.longs === $String ? $util.Long.prototype.toString.call(message.shortage_damage_per_unit) : options.longs === $Number ? new $util.LongBits(message.shortage_damage_per_unit.low >>> 0, message.shortage_damage_per_unit.high >>> 0).toNumber(true) : message.shortage_damage_per_unit;
                if (message.recovery_per_fully_supplied_tick != null && $Object.hasOwnProperty.call(message, "recovery_per_fully_supplied_tick"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.recovery_per_fully_supplied_tick = typeof message.recovery_per_fully_supplied_tick === "number" ? $BigInt(message.recovery_per_fully_supplied_tick) : $util.Long.fromBits(message.recovery_per_fully_supplied_tick.low >>> 0, message.recovery_per_fully_supplied_tick.high >>> 0, true).toBigInt();
                    else if (typeof message.recovery_per_fully_supplied_tick === "number")
                        object.recovery_per_fully_supplied_tick = options.longs === $String ? $String(message.recovery_per_fully_supplied_tick) : message.recovery_per_fully_supplied_tick;
                    else
                        object.recovery_per_fully_supplied_tick = options.longs === $String ? $util.Long.prototype.toString.call(message.recovery_per_fully_supplied_tick) : options.longs === $Number ? new $util.LongBits(message.recovery_per_fully_supplied_tick.low >>> 0, message.recovery_per_fully_supplied_tick.high >>> 0).toNumber(true) : message.recovery_per_fully_supplied_tick;
                if (message.max_publication_ttl_ticks != null && $Object.hasOwnProperty.call(message, "max_publication_ttl_ticks"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.max_publication_ttl_ticks = typeof message.max_publication_ttl_ticks === "number" ? $BigInt(message.max_publication_ttl_ticks) : $util.Long.fromBits(message.max_publication_ttl_ticks.low >>> 0, message.max_publication_ttl_ticks.high >>> 0, true).toBigInt();
                    else if (typeof message.max_publication_ttl_ticks === "number")
                        object.max_publication_ttl_ticks = options.longs === $String ? $String(message.max_publication_ttl_ticks) : message.max_publication_ttl_ticks;
                    else
                        object.max_publication_ttl_ticks = options.longs === $String ? $util.Long.prototype.toString.call(message.max_publication_ttl_ticks) : options.longs === $Number ? new $util.LongBits(message.max_publication_ttl_ticks.low >>> 0, message.max_publication_ttl_ticks.high >>> 0).toNumber(true) : message.max_publication_ttl_ticks;
                if (message.max_offer_ttl_ticks != null && $Object.hasOwnProperty.call(message, "max_offer_ttl_ticks"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.max_offer_ttl_ticks = typeof message.max_offer_ttl_ticks === "number" ? $BigInt(message.max_offer_ttl_ticks) : $util.Long.fromBits(message.max_offer_ttl_ticks.low >>> 0, message.max_offer_ttl_ticks.high >>> 0, true).toBigInt();
                    else if (typeof message.max_offer_ttl_ticks === "number")
                        object.max_offer_ttl_ticks = options.longs === $String ? $String(message.max_offer_ttl_ticks) : message.max_offer_ttl_ticks;
                    else
                        object.max_offer_ttl_ticks = options.longs === $String ? $util.Long.prototype.toString.call(message.max_offer_ttl_ticks) : options.longs === $Number ? new $util.LongBits(message.max_offer_ttl_ticks.low >>> 0, message.max_offer_ttl_ticks.high >>> 0).toNumber(true) : message.max_offer_ttl_ticks;
                if (message.new_commands_per_station_per_tick != null && $Object.hasOwnProperty.call(message, "new_commands_per_station_per_tick"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.new_commands_per_station_per_tick = typeof message.new_commands_per_station_per_tick === "number" ? $BigInt(message.new_commands_per_station_per_tick) : $util.Long.fromBits(message.new_commands_per_station_per_tick.low >>> 0, message.new_commands_per_station_per_tick.high >>> 0, true).toBigInt();
                    else if (typeof message.new_commands_per_station_per_tick === "number")
                        object.new_commands_per_station_per_tick = options.longs === $String ? $String(message.new_commands_per_station_per_tick) : message.new_commands_per_station_per_tick;
                    else
                        object.new_commands_per_station_per_tick = options.longs === $String ? $util.Long.prototype.toString.call(message.new_commands_per_station_per_tick) : options.longs === $Number ? new $util.LongBits(message.new_commands_per_station_per_tick.low >>> 0, message.new_commands_per_station_per_tick.high >>> 0).toNumber(true) : message.new_commands_per_station_per_tick;
                if (message.max_request_records_per_station != null && $Object.hasOwnProperty.call(message, "max_request_records_per_station"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.max_request_records_per_station = typeof message.max_request_records_per_station === "number" ? $BigInt(message.max_request_records_per_station) : $util.Long.fromBits(message.max_request_records_per_station.low >>> 0, message.max_request_records_per_station.high >>> 0, true).toBigInt();
                    else if (typeof message.max_request_records_per_station === "number")
                        object.max_request_records_per_station = options.longs === $String ? $String(message.max_request_records_per_station) : message.max_request_records_per_station;
                    else
                        object.max_request_records_per_station = options.longs === $String ? $util.Long.prototype.toString.call(message.max_request_records_per_station) : options.longs === $Number ? new $util.LongBits(message.max_request_records_per_station.low >>> 0, message.max_request_records_per_station.high >>> 0).toNumber(true) : message.max_request_records_per_station;
                if (message.max_open_outgoing_offers != null && $Object.hasOwnProperty.call(message, "max_open_outgoing_offers"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.max_open_outgoing_offers = typeof message.max_open_outgoing_offers === "number" ? $BigInt(message.max_open_outgoing_offers) : $util.Long.fromBits(message.max_open_outgoing_offers.low >>> 0, message.max_open_outgoing_offers.high >>> 0, true).toBigInt();
                    else if (typeof message.max_open_outgoing_offers === "number")
                        object.max_open_outgoing_offers = options.longs === $String ? $String(message.max_open_outgoing_offers) : message.max_open_outgoing_offers;
                    else
                        object.max_open_outgoing_offers = options.longs === $String ? $util.Long.prototype.toString.call(message.max_open_outgoing_offers) : options.longs === $Number ? new $util.LongBits(message.max_open_outgoing_offers.low >>> 0, message.max_open_outgoing_offers.high >>> 0).toNumber(true) : message.max_open_outgoing_offers;
                if (message.max_command_bytes != null && $Object.hasOwnProperty.call(message, "max_command_bytes"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.max_command_bytes = typeof message.max_command_bytes === "number" ? $BigInt(message.max_command_bytes) : $util.Long.fromBits(message.max_command_bytes.low >>> 0, message.max_command_bytes.high >>> 0, true).toBigInt();
                    else if (typeof message.max_command_bytes === "number")
                        object.max_command_bytes = options.longs === $String ? $String(message.max_command_bytes) : message.max_command_bytes;
                    else
                        object.max_command_bytes = options.longs === $String ? $util.Long.prototype.toString.call(message.max_command_bytes) : options.longs === $Number ? new $util.LongBits(message.max_command_bytes.low >>> 0, message.max_command_bytes.high >>> 0).toNumber(true) : message.max_command_bytes;
                return object;
            };

            /**
             * Converts this PublicRules to JSON.
             * @function toJSON
             * @memberof bazaar.v2.PublicRules
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PublicRules.prototype.toJSON = function() {
                return PublicRules.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for PublicRules
             * @function getTypeUrl
             * @memberof bazaar.v2.PublicRules
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            PublicRules.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.PublicRules";
            };

            return PublicRules;
        })();

        v2.NullableBool = (function() {

            /**
             * Properties of a NullableBool.
             * @typedef {Object} bazaar.v2.NullableBool.$Properties
             * @property {boolean|null} ["null"] NullableBool null
             * @property {boolean|null} [value] NullableBool value
             * @property {"null"|"value"} [kind] NullableBool kind
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a NullableBool.
             * @memberof bazaar.v2
             * @interface INullableBool
             * @augments bazaar.v2.NullableBool.$Properties
             * @deprecated Use bazaar.v2.NullableBool.$Properties instead.
             */

            /**
             * Narrowed shape of a NullableBool.
             * @typedef {{
             *   "null"?: boolean|null;
             *   value?: boolean|null;
             *   $unknowns?: Array.<Uint8Array>;
             * } & (
             *   ({ kind?: undefined; "null"?: null; value?: null }|{ kind?: "null"; "null": boolean; value?: null }|{ kind?: "value"; "null"?: null; value: boolean })
             * )} bazaar.v2.NullableBool.$Shape
             */

            /**
             * Constructs a new NullableBool.
             * @memberof bazaar.v2
             * @classdesc Represents a NullableBool.
             * @constructor
             * @param {bazaar.v2.NullableBool.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var NullableBool = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * NullableBool null.
             * @member {boolean|null|undefined} null
             * @memberof bazaar.v2.NullableBool
             * @instance
             */
            NullableBool.prototype["null"] = null;

            /**
             * NullableBool value.
             * @member {boolean|null|undefined} value
             * @memberof bazaar.v2.NullableBool
             * @instance
             */
            NullableBool.prototype.value = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * NullableBool kind.
             * @member {"null"|"value"|undefined} kind
             * @memberof bazaar.v2.NullableBool
             * @instance
             */
            $Object.defineProperty(NullableBool.prototype, "kind", {
                get: $util.oneOfGetter($oneOfFields = ["null", "value"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new NullableBool instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.NullableBool
             * @static
             * @param {bazaar.v2.NullableBool.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.NullableBool} NullableBool instance
             * @type {{
             *   (properties: bazaar.v2.NullableBool.$Shape): bazaar.v2.NullableBool & bazaar.v2.NullableBool.$Shape;
             *   (properties?: bazaar.v2.NullableBool.$Properties): bazaar.v2.NullableBool;
             * }}
             */
            NullableBool.create = function(properties) {
                return new NullableBool(properties);
            };

            /**
             * Encodes the specified NullableBool message. Does not implicitly {@link bazaar.v2.NullableBool.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.NullableBool
             * @static
             * @param {bazaar.v2.NullableBool.$Properties} message NullableBool message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NullableBool.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message["null"] != null && $Object.hasOwnProperty.call(message, "null"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message["null"]);
                if (message.value != null && $Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.value);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified NullableBool message, length delimited. Does not implicitly {@link bazaar.v2.NullableBool.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.NullableBool
             * @static
             * @param {bazaar.v2.NullableBool.$Properties} message NullableBool message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NullableBool.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a NullableBool message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.NullableBool
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.NullableBool & bazaar.v2.NullableBool.$Shape} NullableBool
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NullableBool.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.NullableBool();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 0)
                                break;
                            message["null"] = reader.bool();
                            message.kind = "null";
                            continue;
                        }
                    case 2: {
                            if (wireType !== 0)
                                break;
                            message.value = reader.bool();
                            message.kind = "value";
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes a NullableBool message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.NullableBool
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.NullableBool & bazaar.v2.NullableBool.$Shape} NullableBool
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NullableBool.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a NullableBool message.
             * @function verify
             * @memberof bazaar.v2.NullableBool
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            NullableBool.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                var properties = {};
                if (message["null"] != null && $Object.hasOwnProperty.call(message, "null")) {
                    properties.kind = 1;
                    if (typeof message["null"] !== "boolean")
                        return "null: boolean expected";
                }
                if (message.value != null && $Object.hasOwnProperty.call(message, "value")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    if (typeof message.value !== "boolean")
                        return "value: boolean expected";
                }
                return null;
            };

            /**
             * Creates a NullableBool message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.NullableBool
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.NullableBool} NullableBool
             */
            NullableBool.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.NullableBool)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.NullableBool: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.NullableBool();
                if (object["null"] != null)
                    message["null"] = $Boolean(object["null"]);
                if (object.value != null)
                    message.value = $Boolean(object.value);
                return message;
            };

            /**
             * Creates a plain object from a NullableBool message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.NullableBool
             * @static
             * @param {bazaar.v2.NullableBool} message NullableBool
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            NullableBool.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (message["null"] != null && $Object.hasOwnProperty.call(message, "null")) {
                    object["null"] = message["null"];
                    if (options.oneofs)
                        object.kind = "null";
                }
                if (message.value != null && $Object.hasOwnProperty.call(message, "value")) {
                    object.value = message.value;
                    if (options.oneofs)
                        object.kind = "value";
                }
                return object;
            };

            /**
             * Converts this NullableBool to JSON.
             * @function toJSON
             * @memberof bazaar.v2.NullableBool
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            NullableBool.prototype.toJSON = function() {
                return NullableBool.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for NullableBool
             * @function getTypeUrl
             * @memberof bazaar.v2.NullableBool
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            NullableBool.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.NullableBool";
            };

            return NullableBool;
        })();

        v2.PlayerOutcome = (function() {

            /**
             * Properties of a PlayerOutcome.
             * @typedef {Object} bazaar.v2.PlayerOutcome.$Properties
             * @property {bazaar.v2.NullableBool.$Properties} collective_success PlayerOutcome collective_success
             * @property {boolean} self_failed PlayerOutcome self_failed
             * @property {boolean} aborted PlayerOutcome aborted
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a PlayerOutcome.
             * @memberof bazaar.v2
             * @interface IPlayerOutcome
             * @augments bazaar.v2.PlayerOutcome.$Properties
             * @deprecated Use bazaar.v2.PlayerOutcome.$Properties instead.
             */

            /**
             * Shape of a PlayerOutcome.
             * @typedef {{
             *   collective_success: bazaar.v2.NullableBool.$Shape;
             *   self_failed: boolean;
             *   aborted: boolean;
             *   $unknowns?: Array.<Uint8Array>;
             * }} bazaar.v2.PlayerOutcome.$Shape
             */

            /**
             * Constructs a new PlayerOutcome.
             * @memberof bazaar.v2
             * @classdesc Represents a PlayerOutcome.
             * @constructor
             * @param {bazaar.v2.PlayerOutcome.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var PlayerOutcome = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * PlayerOutcome collective_success.
             * @member {bazaar.v2.NullableBool.$Properties} collective_success
             * @memberof bazaar.v2.PlayerOutcome
             * @instance
             */
            PlayerOutcome.prototype.collective_success = null;

            /**
             * PlayerOutcome self_failed.
             * @member {boolean} self_failed
             * @memberof bazaar.v2.PlayerOutcome
             * @instance
             */
            PlayerOutcome.prototype.self_failed = false;

            /**
             * PlayerOutcome aborted.
             * @member {boolean} aborted
             * @memberof bazaar.v2.PlayerOutcome
             * @instance
             */
            PlayerOutcome.prototype.aborted = false;

            /**
             * Creates a new PlayerOutcome instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.PlayerOutcome
             * @static
             * @param {bazaar.v2.PlayerOutcome.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.PlayerOutcome} PlayerOutcome instance
             * @type {{
             *   (properties: bazaar.v2.PlayerOutcome.$Shape): bazaar.v2.PlayerOutcome & bazaar.v2.PlayerOutcome.$Shape;
             *   (properties?: bazaar.v2.PlayerOutcome.$Properties): bazaar.v2.PlayerOutcome;
             * }}
             */
            PlayerOutcome.create = function(properties) {
                return new PlayerOutcome(properties);
            };

            /**
             * Encodes the specified PlayerOutcome message. Does not implicitly {@link bazaar.v2.PlayerOutcome.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.PlayerOutcome
             * @static
             * @param {bazaar.v2.PlayerOutcome.$Properties} message PlayerOutcome message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PlayerOutcome.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                $root.bazaar.v2.NullableBool.encode(message.collective_success, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.self_failed);
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.aborted);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified PlayerOutcome message, length delimited. Does not implicitly {@link bazaar.v2.PlayerOutcome.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.PlayerOutcome
             * @static
             * @param {bazaar.v2.PlayerOutcome.$Properties} message PlayerOutcome message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PlayerOutcome.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a PlayerOutcome message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.PlayerOutcome
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.PlayerOutcome & bazaar.v2.PlayerOutcome.$Shape} PlayerOutcome
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PlayerOutcome.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.PlayerOutcome();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            message.collective_success = $root.bazaar.v2.NullableBool.decode(reader, reader.uint32(), $undefined, _depth + 1, message.collective_success);
                            continue;
                        }
                    case 2: {
                            if (wireType !== 0)
                                break;
                            message.self_failed = reader.bool();
                            continue;
                        }
                    case 3: {
                            if (wireType !== 0)
                                break;
                            message.aborted = reader.bool();
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "collective_success"))
                    throw $util.ProtocolError("missing required 'collective_success'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "self_failed"))
                    throw $util.ProtocolError("missing required 'self_failed'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "aborted"))
                    throw $util.ProtocolError("missing required 'aborted'", { instance: message });
                return message;
            };

            /**
             * Decodes a PlayerOutcome message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.PlayerOutcome
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.PlayerOutcome & bazaar.v2.PlayerOutcome.$Shape} PlayerOutcome
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PlayerOutcome.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PlayerOutcome message.
             * @function verify
             * @memberof bazaar.v2.PlayerOutcome
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PlayerOutcome.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                {
                    var error = $root.bazaar.v2.NullableBool.verify(message.collective_success, _depth + 1);
                    if (error)
                        return "collective_success." + error;
                }
                if (typeof message.self_failed !== "boolean")
                    return "self_failed: boolean expected";
                if (typeof message.aborted !== "boolean")
                    return "aborted: boolean expected";
                return null;
            };

            /**
             * Creates a PlayerOutcome message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.PlayerOutcome
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.PlayerOutcome} PlayerOutcome
             */
            PlayerOutcome.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.PlayerOutcome)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.PlayerOutcome: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.PlayerOutcome();
                if (object.collective_success != null) {
                    if (!$util.isObject(object.collective_success))
                        throw $TypeError(".bazaar.v2.PlayerOutcome.collective_success: object expected");
                    message.collective_success = $root.bazaar.v2.NullableBool.fromObject(object.collective_success, _depth + 1);
                }
                if (object.self_failed != null)
                    message.self_failed = $Boolean(object.self_failed);
                if (object.aborted != null)
                    message.aborted = $Boolean(object.aborted);
                return message;
            };

            /**
             * Creates a plain object from a PlayerOutcome message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.PlayerOutcome
             * @static
             * @param {bazaar.v2.PlayerOutcome} message PlayerOutcome
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PlayerOutcome.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.collective_success = null;
                    object.self_failed = false;
                    object.aborted = false;
                }
                if (message.collective_success != null && $Object.hasOwnProperty.call(message, "collective_success"))
                    object.collective_success = $root.bazaar.v2.NullableBool.toObject(message.collective_success, options, _depth + 1);
                if (message.self_failed != null && $Object.hasOwnProperty.call(message, "self_failed"))
                    object.self_failed = message.self_failed;
                if (message.aborted != null && $Object.hasOwnProperty.call(message, "aborted"))
                    object.aborted = message.aborted;
                return object;
            };

            /**
             * Converts this PlayerOutcome to JSON.
             * @function toJSON
             * @memberof bazaar.v2.PlayerOutcome
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PlayerOutcome.prototype.toJSON = function() {
                return PlayerOutcome.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for PlayerOutcome
             * @function getTypeUrl
             * @memberof bazaar.v2.PlayerOutcome
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            PlayerOutcome.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.PlayerOutcome";
            };

            return PlayerOutcome;
        })();

        /**
         * StateType enum.
         * @name bazaar.v2.StateType
         * @enum {number}
         * @property {number} STATE_TYPE_STATE=1 STATE_TYPE_STATE value
         */
        v2.StateType = (function() {
            var valuesById = $Object.create(null), values = $Object.create(valuesById);
            values[valuesById[1] = "STATE_TYPE_STATE"] = 1;
            return values;
        })();

        v2.ListDirectoryEntry = (function() {

            /**
             * Properties of a ListDirectoryEntry.
             * @typedef {Object} bazaar.v2.ListDirectoryEntry.$Properties
             * @property {Array.<bazaar.v2.DirectoryEntry.$Properties>|null} [items] ListDirectoryEntry items
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a ListDirectoryEntry.
             * @memberof bazaar.v2
             * @interface IListDirectoryEntry
             * @augments bazaar.v2.ListDirectoryEntry.$Properties
             * @deprecated Use bazaar.v2.ListDirectoryEntry.$Properties instead.
             */

            /**
             * Shape of a ListDirectoryEntry.
             * @typedef {bazaar.v2.ListDirectoryEntry.$Properties} bazaar.v2.ListDirectoryEntry.$Shape
             */

            /**
             * Constructs a new ListDirectoryEntry.
             * @memberof bazaar.v2
             * @classdesc Represents a ListDirectoryEntry.
             * @constructor
             * @param {bazaar.v2.ListDirectoryEntry.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var ListDirectoryEntry = function (properties) {
                this.items = [];
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * ListDirectoryEntry items.
             * @member {Array.<bazaar.v2.DirectoryEntry.$Properties>} items
             * @memberof bazaar.v2.ListDirectoryEntry
             * @instance
             */
            ListDirectoryEntry.prototype.items = $util.emptyArray;

            /**
             * Creates a new ListDirectoryEntry instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.ListDirectoryEntry
             * @static
             * @param {bazaar.v2.ListDirectoryEntry.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.ListDirectoryEntry} ListDirectoryEntry instance
             * @type {{
             *   (properties: bazaar.v2.ListDirectoryEntry.$Shape): bazaar.v2.ListDirectoryEntry & bazaar.v2.ListDirectoryEntry.$Shape;
             *   (properties?: bazaar.v2.ListDirectoryEntry.$Properties): bazaar.v2.ListDirectoryEntry;
             * }}
             */
            ListDirectoryEntry.create = function(properties) {
                return new ListDirectoryEntry(properties);
            };

            /**
             * Encodes the specified ListDirectoryEntry message. Does not implicitly {@link bazaar.v2.ListDirectoryEntry.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.ListDirectoryEntry
             * @static
             * @param {bazaar.v2.ListDirectoryEntry.$Properties} message ListDirectoryEntry message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListDirectoryEntry.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.items != null && message.items.length)
                    for (var i = 0; i < message.items.length; ++i)
                        $root.bazaar.v2.DirectoryEntry.encode(message.items[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified ListDirectoryEntry message, length delimited. Does not implicitly {@link bazaar.v2.ListDirectoryEntry.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.ListDirectoryEntry
             * @static
             * @param {bazaar.v2.ListDirectoryEntry.$Properties} message ListDirectoryEntry message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListDirectoryEntry.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a ListDirectoryEntry message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.ListDirectoryEntry
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.ListDirectoryEntry & bazaar.v2.ListDirectoryEntry.$Shape} ListDirectoryEntry
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListDirectoryEntry.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.ListDirectoryEntry();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            if (!(message.items && message.items.length))
                                message.items = [];
                            message.items.push($root.bazaar.v2.DirectoryEntry.decode(reader, reader.uint32(), $undefined, _depth + 1));
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes a ListDirectoryEntry message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.ListDirectoryEntry
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.ListDirectoryEntry & bazaar.v2.ListDirectoryEntry.$Shape} ListDirectoryEntry
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListDirectoryEntry.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ListDirectoryEntry message.
             * @function verify
             * @memberof bazaar.v2.ListDirectoryEntry
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ListDirectoryEntry.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (message.items != null && $Object.hasOwnProperty.call(message, "items")) {
                    if (!$Array.isArray(message.items))
                        return "items: array expected";
                    for (var i = 0; i < message.items.length; ++i) {
                        var error = $root.bazaar.v2.DirectoryEntry.verify(message.items[i], _depth + 1);
                        if (error)
                            return "items." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ListDirectoryEntry message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.ListDirectoryEntry
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.ListDirectoryEntry} ListDirectoryEntry
             */
            ListDirectoryEntry.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.ListDirectoryEntry)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.ListDirectoryEntry: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.ListDirectoryEntry();
                if (object.items) {
                    if (!$Array.isArray(object.items))
                        throw $TypeError(".bazaar.v2.ListDirectoryEntry.items: array expected");
                    message.items = $Array(object.items.length);
                    for (var i = 0; i < object.items.length; ++i) {
                        if (!$util.isObject(object.items[i]))
                            throw $TypeError(".bazaar.v2.ListDirectoryEntry.items: object expected");
                        message.items[i] = $root.bazaar.v2.DirectoryEntry.fromObject(object.items[i], _depth + 1);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a ListDirectoryEntry message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.ListDirectoryEntry
             * @static
             * @param {bazaar.v2.ListDirectoryEntry} message ListDirectoryEntry
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ListDirectoryEntry.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.arrays || options.defaults)
                    object.items = [];
                if (message.items && message.items.length) {
                    object.items = $Array(message.items.length);
                    for (var j = 0; j < message.items.length; ++j)
                        object.items[j] = $root.bazaar.v2.DirectoryEntry.toObject(message.items[j], options, _depth + 1);
                }
                return object;
            };

            /**
             * Converts this ListDirectoryEntry to JSON.
             * @function toJSON
             * @memberof bazaar.v2.ListDirectoryEntry
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ListDirectoryEntry.prototype.toJSON = function() {
                return ListDirectoryEntry.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for ListDirectoryEntry
             * @function getTypeUrl
             * @memberof bazaar.v2.ListDirectoryEntry
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            ListDirectoryEntry.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.ListDirectoryEntry";
            };

            return ListDirectoryEntry;
        })();

        v2.ListOffer = (function() {

            /**
             * Properties of a ListOffer.
             * @typedef {Object} bazaar.v2.ListOffer.$Properties
             * @property {Array.<bazaar.v2.Offer.$Properties>|null} [items] ListOffer items
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a ListOffer.
             * @memberof bazaar.v2
             * @interface IListOffer
             * @augments bazaar.v2.ListOffer.$Properties
             * @deprecated Use bazaar.v2.ListOffer.$Properties instead.
             */

            /**
             * Shape of a ListOffer.
             * @typedef {{
             *   items?: Array.<bazaar.v2.Offer.$Shape>|null;
             *   $unknowns?: Array.<Uint8Array>;
             * }} bazaar.v2.ListOffer.$Shape
             */

            /**
             * Constructs a new ListOffer.
             * @memberof bazaar.v2
             * @classdesc Represents a ListOffer.
             * @constructor
             * @param {bazaar.v2.ListOffer.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var ListOffer = function (properties) {
                this.items = [];
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * ListOffer items.
             * @member {Array.<bazaar.v2.Offer.$Properties>} items
             * @memberof bazaar.v2.ListOffer
             * @instance
             */
            ListOffer.prototype.items = $util.emptyArray;

            /**
             * Creates a new ListOffer instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.ListOffer
             * @static
             * @param {bazaar.v2.ListOffer.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.ListOffer} ListOffer instance
             * @type {{
             *   (properties: bazaar.v2.ListOffer.$Shape): bazaar.v2.ListOffer & bazaar.v2.ListOffer.$Shape;
             *   (properties?: bazaar.v2.ListOffer.$Properties): bazaar.v2.ListOffer;
             * }}
             */
            ListOffer.create = function(properties) {
                return new ListOffer(properties);
            };

            /**
             * Encodes the specified ListOffer message. Does not implicitly {@link bazaar.v2.ListOffer.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.ListOffer
             * @static
             * @param {bazaar.v2.ListOffer.$Properties} message ListOffer message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListOffer.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.items != null && message.items.length)
                    for (var i = 0; i < message.items.length; ++i)
                        $root.bazaar.v2.Offer.encode(message.items[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified ListOffer message, length delimited. Does not implicitly {@link bazaar.v2.ListOffer.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.ListOffer
             * @static
             * @param {bazaar.v2.ListOffer.$Properties} message ListOffer message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListOffer.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a ListOffer message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.ListOffer
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.ListOffer & bazaar.v2.ListOffer.$Shape} ListOffer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListOffer.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.ListOffer();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            if (!(message.items && message.items.length))
                                message.items = [];
                            message.items.push($root.bazaar.v2.Offer.decode(reader, reader.uint32(), $undefined, _depth + 1));
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes a ListOffer message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.ListOffer
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.ListOffer & bazaar.v2.ListOffer.$Shape} ListOffer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListOffer.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ListOffer message.
             * @function verify
             * @memberof bazaar.v2.ListOffer
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ListOffer.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (message.items != null && $Object.hasOwnProperty.call(message, "items")) {
                    if (!$Array.isArray(message.items))
                        return "items: array expected";
                    for (var i = 0; i < message.items.length; ++i) {
                        var error = $root.bazaar.v2.Offer.verify(message.items[i], _depth + 1);
                        if (error)
                            return "items." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ListOffer message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.ListOffer
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.ListOffer} ListOffer
             */
            ListOffer.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.ListOffer)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.ListOffer: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.ListOffer();
                if (object.items) {
                    if (!$Array.isArray(object.items))
                        throw $TypeError(".bazaar.v2.ListOffer.items: array expected");
                    message.items = $Array(object.items.length);
                    for (var i = 0; i < object.items.length; ++i) {
                        if (!$util.isObject(object.items[i]))
                            throw $TypeError(".bazaar.v2.ListOffer.items: object expected");
                        message.items[i] = $root.bazaar.v2.Offer.fromObject(object.items[i], _depth + 1);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a ListOffer message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.ListOffer
             * @static
             * @param {bazaar.v2.ListOffer} message ListOffer
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ListOffer.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.arrays || options.defaults)
                    object.items = [];
                if (message.items && message.items.length) {
                    object.items = $Array(message.items.length);
                    for (var j = 0; j < message.items.length; ++j)
                        object.items[j] = $root.bazaar.v2.Offer.toObject(message.items[j], options, _depth + 1);
                }
                return object;
            };

            /**
             * Converts this ListOffer to JSON.
             * @function toJSON
             * @memberof bazaar.v2.ListOffer
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ListOffer.prototype.toJSON = function() {
                return ListOffer.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for ListOffer
             * @function getTypeUrl
             * @memberof bazaar.v2.ListOffer
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            ListOffer.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.ListOffer";
            };

            return ListOffer;
        })();

        v2.ListAdvertisement = (function() {

            /**
             * Properties of a ListAdvertisement.
             * @typedef {Object} bazaar.v2.ListAdvertisement.$Properties
             * @property {Array.<bazaar.v2.Advertisement.$Properties>|null} [items] ListAdvertisement items
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a ListAdvertisement.
             * @memberof bazaar.v2
             * @interface IListAdvertisement
             * @augments bazaar.v2.ListAdvertisement.$Properties
             * @deprecated Use bazaar.v2.ListAdvertisement.$Properties instead.
             */

            /**
             * Shape of a ListAdvertisement.
             * @typedef {bazaar.v2.ListAdvertisement.$Properties} bazaar.v2.ListAdvertisement.$Shape
             */

            /**
             * Constructs a new ListAdvertisement.
             * @memberof bazaar.v2
             * @classdesc Represents a ListAdvertisement.
             * @constructor
             * @param {bazaar.v2.ListAdvertisement.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var ListAdvertisement = function (properties) {
                this.items = [];
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * ListAdvertisement items.
             * @member {Array.<bazaar.v2.Advertisement.$Properties>} items
             * @memberof bazaar.v2.ListAdvertisement
             * @instance
             */
            ListAdvertisement.prototype.items = $util.emptyArray;

            /**
             * Creates a new ListAdvertisement instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.ListAdvertisement
             * @static
             * @param {bazaar.v2.ListAdvertisement.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.ListAdvertisement} ListAdvertisement instance
             * @type {{
             *   (properties: bazaar.v2.ListAdvertisement.$Shape): bazaar.v2.ListAdvertisement & bazaar.v2.ListAdvertisement.$Shape;
             *   (properties?: bazaar.v2.ListAdvertisement.$Properties): bazaar.v2.ListAdvertisement;
             * }}
             */
            ListAdvertisement.create = function(properties) {
                return new ListAdvertisement(properties);
            };

            /**
             * Encodes the specified ListAdvertisement message. Does not implicitly {@link bazaar.v2.ListAdvertisement.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.ListAdvertisement
             * @static
             * @param {bazaar.v2.ListAdvertisement.$Properties} message ListAdvertisement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListAdvertisement.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.items != null && message.items.length)
                    for (var i = 0; i < message.items.length; ++i)
                        $root.bazaar.v2.Advertisement.encode(message.items[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified ListAdvertisement message, length delimited. Does not implicitly {@link bazaar.v2.ListAdvertisement.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.ListAdvertisement
             * @static
             * @param {bazaar.v2.ListAdvertisement.$Properties} message ListAdvertisement message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListAdvertisement.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a ListAdvertisement message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.ListAdvertisement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.ListAdvertisement & bazaar.v2.ListAdvertisement.$Shape} ListAdvertisement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListAdvertisement.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.ListAdvertisement();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            if (!(message.items && message.items.length))
                                message.items = [];
                            message.items.push($root.bazaar.v2.Advertisement.decode(reader, reader.uint32(), $undefined, _depth + 1));
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes a ListAdvertisement message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.ListAdvertisement
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.ListAdvertisement & bazaar.v2.ListAdvertisement.$Shape} ListAdvertisement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListAdvertisement.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ListAdvertisement message.
             * @function verify
             * @memberof bazaar.v2.ListAdvertisement
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ListAdvertisement.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (message.items != null && $Object.hasOwnProperty.call(message, "items")) {
                    if (!$Array.isArray(message.items))
                        return "items: array expected";
                    for (var i = 0; i < message.items.length; ++i) {
                        var error = $root.bazaar.v2.Advertisement.verify(message.items[i], _depth + 1);
                        if (error)
                            return "items." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ListAdvertisement message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.ListAdvertisement
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.ListAdvertisement} ListAdvertisement
             */
            ListAdvertisement.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.ListAdvertisement)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.ListAdvertisement: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.ListAdvertisement();
                if (object.items) {
                    if (!$Array.isArray(object.items))
                        throw $TypeError(".bazaar.v2.ListAdvertisement.items: array expected");
                    message.items = $Array(object.items.length);
                    for (var i = 0; i < object.items.length; ++i) {
                        if (!$util.isObject(object.items[i]))
                            throw $TypeError(".bazaar.v2.ListAdvertisement.items: object expected");
                        message.items[i] = $root.bazaar.v2.Advertisement.fromObject(object.items[i], _depth + 1);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a ListAdvertisement message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.ListAdvertisement
             * @static
             * @param {bazaar.v2.ListAdvertisement} message ListAdvertisement
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ListAdvertisement.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.arrays || options.defaults)
                    object.items = [];
                if (message.items && message.items.length) {
                    object.items = $Array(message.items.length);
                    for (var j = 0; j < message.items.length; ++j)
                        object.items[j] = $root.bazaar.v2.Advertisement.toObject(message.items[j], options, _depth + 1);
                }
                return object;
            };

            /**
             * Converts this ListAdvertisement to JSON.
             * @function toJSON
             * @memberof bazaar.v2.ListAdvertisement
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ListAdvertisement.prototype.toJSON = function() {
                return ListAdvertisement.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for ListAdvertisement
             * @function getTypeUrl
             * @memberof bazaar.v2.ListAdvertisement
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            ListAdvertisement.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.ListAdvertisement";
            };

            return ListAdvertisement;
        })();

        v2.ListTransaction = (function() {

            /**
             * Properties of a ListTransaction.
             * @typedef {Object} bazaar.v2.ListTransaction.$Properties
             * @property {Array.<bazaar.v2.Transaction.$Properties>|null} [items] ListTransaction items
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a ListTransaction.
             * @memberof bazaar.v2
             * @interface IListTransaction
             * @augments bazaar.v2.ListTransaction.$Properties
             * @deprecated Use bazaar.v2.ListTransaction.$Properties instead.
             */

            /**
             * Shape of a ListTransaction.
             * @typedef {bazaar.v2.ListTransaction.$Properties} bazaar.v2.ListTransaction.$Shape
             */

            /**
             * Constructs a new ListTransaction.
             * @memberof bazaar.v2
             * @classdesc Represents a ListTransaction.
             * @constructor
             * @param {bazaar.v2.ListTransaction.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var ListTransaction = function (properties) {
                this.items = [];
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * ListTransaction items.
             * @member {Array.<bazaar.v2.Transaction.$Properties>} items
             * @memberof bazaar.v2.ListTransaction
             * @instance
             */
            ListTransaction.prototype.items = $util.emptyArray;

            /**
             * Creates a new ListTransaction instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.ListTransaction
             * @static
             * @param {bazaar.v2.ListTransaction.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.ListTransaction} ListTransaction instance
             * @type {{
             *   (properties: bazaar.v2.ListTransaction.$Shape): bazaar.v2.ListTransaction & bazaar.v2.ListTransaction.$Shape;
             *   (properties?: bazaar.v2.ListTransaction.$Properties): bazaar.v2.ListTransaction;
             * }}
             */
            ListTransaction.create = function(properties) {
                return new ListTransaction(properties);
            };

            /**
             * Encodes the specified ListTransaction message. Does not implicitly {@link bazaar.v2.ListTransaction.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.ListTransaction
             * @static
             * @param {bazaar.v2.ListTransaction.$Properties} message ListTransaction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListTransaction.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.items != null && message.items.length)
                    for (var i = 0; i < message.items.length; ++i)
                        $root.bazaar.v2.Transaction.encode(message.items[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified ListTransaction message, length delimited. Does not implicitly {@link bazaar.v2.ListTransaction.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.ListTransaction
             * @static
             * @param {bazaar.v2.ListTransaction.$Properties} message ListTransaction message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListTransaction.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a ListTransaction message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.ListTransaction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.ListTransaction & bazaar.v2.ListTransaction.$Shape} ListTransaction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListTransaction.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.ListTransaction();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            if (!(message.items && message.items.length))
                                message.items = [];
                            message.items.push($root.bazaar.v2.Transaction.decode(reader, reader.uint32(), $undefined, _depth + 1));
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes a ListTransaction message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.ListTransaction
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.ListTransaction & bazaar.v2.ListTransaction.$Shape} ListTransaction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListTransaction.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ListTransaction message.
             * @function verify
             * @memberof bazaar.v2.ListTransaction
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ListTransaction.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (message.items != null && $Object.hasOwnProperty.call(message, "items")) {
                    if (!$Array.isArray(message.items))
                        return "items: array expected";
                    for (var i = 0; i < message.items.length; ++i) {
                        var error = $root.bazaar.v2.Transaction.verify(message.items[i], _depth + 1);
                        if (error)
                            return "items." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ListTransaction message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.ListTransaction
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.ListTransaction} ListTransaction
             */
            ListTransaction.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.ListTransaction)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.ListTransaction: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.ListTransaction();
                if (object.items) {
                    if (!$Array.isArray(object.items))
                        throw $TypeError(".bazaar.v2.ListTransaction.items: array expected");
                    message.items = $Array(object.items.length);
                    for (var i = 0; i < object.items.length; ++i) {
                        if (!$util.isObject(object.items[i]))
                            throw $TypeError(".bazaar.v2.ListTransaction.items: object expected");
                        message.items[i] = $root.bazaar.v2.Transaction.fromObject(object.items[i], _depth + 1);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a ListTransaction message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.ListTransaction
             * @static
             * @param {bazaar.v2.ListTransaction} message ListTransaction
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ListTransaction.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.arrays || options.defaults)
                    object.items = [];
                if (message.items && message.items.length) {
                    object.items = $Array(message.items.length);
                    for (var j = 0; j < message.items.length; ++j)
                        object.items[j] = $root.bazaar.v2.Transaction.toObject(message.items[j], options, _depth + 1);
                }
                return object;
            };

            /**
             * Converts this ListTransaction to JSON.
             * @function toJSON
             * @memberof bazaar.v2.ListTransaction
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ListTransaction.prototype.toJSON = function() {
                return ListTransaction.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for ListTransaction
             * @function getTypeUrl
             * @memberof bazaar.v2.ListTransaction
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            ListTransaction.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.ListTransaction";
            };

            return ListTransaction;
        })();

        v2.ListResult = (function() {

            /**
             * Properties of a ListResult.
             * @typedef {Object} bazaar.v2.ListResult.$Properties
             * @property {Array.<bazaar.v2.Result.$Properties>|null} [items] ListResult items
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a ListResult.
             * @memberof bazaar.v2
             * @interface IListResult
             * @augments bazaar.v2.ListResult.$Properties
             * @deprecated Use bazaar.v2.ListResult.$Properties instead.
             */

            /**
             * Shape of a ListResult.
             * @typedef {{
             *   items?: Array.<bazaar.v2.Result.$Shape>|null;
             *   $unknowns?: Array.<Uint8Array>;
             * }} bazaar.v2.ListResult.$Shape
             */

            /**
             * Constructs a new ListResult.
             * @memberof bazaar.v2
             * @classdesc Represents a ListResult.
             * @constructor
             * @param {bazaar.v2.ListResult.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var ListResult = function (properties) {
                this.items = [];
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * ListResult items.
             * @member {Array.<bazaar.v2.Result.$Properties>} items
             * @memberof bazaar.v2.ListResult
             * @instance
             */
            ListResult.prototype.items = $util.emptyArray;

            /**
             * Creates a new ListResult instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.ListResult
             * @static
             * @param {bazaar.v2.ListResult.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.ListResult} ListResult instance
             * @type {{
             *   (properties: bazaar.v2.ListResult.$Shape): bazaar.v2.ListResult & bazaar.v2.ListResult.$Shape;
             *   (properties?: bazaar.v2.ListResult.$Properties): bazaar.v2.ListResult;
             * }}
             */
            ListResult.create = function(properties) {
                return new ListResult(properties);
            };

            /**
             * Encodes the specified ListResult message. Does not implicitly {@link bazaar.v2.ListResult.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.ListResult
             * @static
             * @param {bazaar.v2.ListResult.$Properties} message ListResult message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListResult.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.items != null && message.items.length)
                    for (var i = 0; i < message.items.length; ++i)
                        $root.bazaar.v2.Result.encode(message.items[i], writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified ListResult message, length delimited. Does not implicitly {@link bazaar.v2.ListResult.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.ListResult
             * @static
             * @param {bazaar.v2.ListResult.$Properties} message ListResult message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ListResult.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a ListResult message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.ListResult
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.ListResult & bazaar.v2.ListResult.$Shape} ListResult
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListResult.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.ListResult();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            if (!(message.items && message.items.length))
                                message.items = [];
                            message.items.push($root.bazaar.v2.Result.decode(reader, reader.uint32(), $undefined, _depth + 1));
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes a ListResult message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.ListResult
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.ListResult & bazaar.v2.ListResult.$Shape} ListResult
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListResult.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ListResult message.
             * @function verify
             * @memberof bazaar.v2.ListResult
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ListResult.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                if (message.items != null && $Object.hasOwnProperty.call(message, "items")) {
                    if (!$Array.isArray(message.items))
                        return "items: array expected";
                    for (var i = 0; i < message.items.length; ++i) {
                        var error = $root.bazaar.v2.Result.verify(message.items[i], _depth + 1);
                        if (error)
                            return "items." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ListResult message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.ListResult
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.ListResult} ListResult
             */
            ListResult.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.ListResult)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.ListResult: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.ListResult();
                if (object.items) {
                    if (!$Array.isArray(object.items))
                        throw $TypeError(".bazaar.v2.ListResult.items: array expected");
                    message.items = $Array(object.items.length);
                    for (var i = 0; i < object.items.length; ++i) {
                        if (!$util.isObject(object.items[i]))
                            throw $TypeError(".bazaar.v2.ListResult.items: object expected");
                        message.items[i] = $root.bazaar.v2.Result.fromObject(object.items[i], _depth + 1);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a ListResult message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.ListResult
             * @static
             * @param {bazaar.v2.ListResult} message ListResult
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ListResult.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.arrays || options.defaults)
                    object.items = [];
                if (message.items && message.items.length) {
                    object.items = $Array(message.items.length);
                    for (var j = 0; j < message.items.length; ++j)
                        object.items[j] = $root.bazaar.v2.Result.toObject(message.items[j], options, _depth + 1);
                }
                return object;
            };

            /**
             * Converts this ListResult to JSON.
             * @function toJSON
             * @memberof bazaar.v2.ListResult
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ListResult.prototype.toJSON = function() {
                return ListResult.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for ListResult
             * @function getTypeUrl
             * @memberof bazaar.v2.ListResult
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            ListResult.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.ListResult";
            };

            return ListResult;
        })();

        v2.NullablePlayerOutcome = (function() {

            /**
             * Properties of a NullablePlayerOutcome.
             * @typedef {Object} bazaar.v2.NullablePlayerOutcome.$Properties
             * @property {boolean|null} ["null"] NullablePlayerOutcome null
             * @property {bazaar.v2.PlayerOutcome.$Properties|null} [value] NullablePlayerOutcome value
             * @property {"null"|"value"} [kind] NullablePlayerOutcome kind
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a NullablePlayerOutcome.
             * @memberof bazaar.v2
             * @interface INullablePlayerOutcome
             * @augments bazaar.v2.NullablePlayerOutcome.$Properties
             * @deprecated Use bazaar.v2.NullablePlayerOutcome.$Properties instead.
             */

            /**
             * Narrowed shape of a NullablePlayerOutcome.
             * @typedef {{
             *   "null"?: boolean|null;
             *   value?: bazaar.v2.PlayerOutcome.$Shape|null;
             *   $unknowns?: Array.<Uint8Array>;
             * } & (
             *   ({ kind?: undefined; "null"?: null; value?: null }|{ kind?: "null"; "null": boolean; value?: null }|{ kind?: "value"; "null"?: null; value: bazaar.v2.PlayerOutcome.$Shape })
             * )} bazaar.v2.NullablePlayerOutcome.$Shape
             */

            /**
             * Constructs a new NullablePlayerOutcome.
             * @memberof bazaar.v2
             * @classdesc Represents a NullablePlayerOutcome.
             * @constructor
             * @param {bazaar.v2.NullablePlayerOutcome.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var NullablePlayerOutcome = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * NullablePlayerOutcome null.
             * @member {boolean|null|undefined} null
             * @memberof bazaar.v2.NullablePlayerOutcome
             * @instance
             */
            NullablePlayerOutcome.prototype["null"] = null;

            /**
             * NullablePlayerOutcome value.
             * @member {bazaar.v2.PlayerOutcome.$Properties|null|undefined} value
             * @memberof bazaar.v2.NullablePlayerOutcome
             * @instance
             */
            NullablePlayerOutcome.prototype.value = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * NullablePlayerOutcome kind.
             * @member {"null"|"value"|undefined} kind
             * @memberof bazaar.v2.NullablePlayerOutcome
             * @instance
             */
            $Object.defineProperty(NullablePlayerOutcome.prototype, "kind", {
                get: $util.oneOfGetter($oneOfFields = ["null", "value"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new NullablePlayerOutcome instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.NullablePlayerOutcome
             * @static
             * @param {bazaar.v2.NullablePlayerOutcome.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.NullablePlayerOutcome} NullablePlayerOutcome instance
             * @type {{
             *   (properties: bazaar.v2.NullablePlayerOutcome.$Shape): bazaar.v2.NullablePlayerOutcome & bazaar.v2.NullablePlayerOutcome.$Shape;
             *   (properties?: bazaar.v2.NullablePlayerOutcome.$Properties): bazaar.v2.NullablePlayerOutcome;
             * }}
             */
            NullablePlayerOutcome.create = function(properties) {
                return new NullablePlayerOutcome(properties);
            };

            /**
             * Encodes the specified NullablePlayerOutcome message. Does not implicitly {@link bazaar.v2.NullablePlayerOutcome.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.NullablePlayerOutcome
             * @static
             * @param {bazaar.v2.NullablePlayerOutcome.$Properties} message NullablePlayerOutcome message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NullablePlayerOutcome.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message["null"] != null && $Object.hasOwnProperty.call(message, "null"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message["null"]);
                if (message.value != null && $Object.hasOwnProperty.call(message, "value"))
                    $root.bazaar.v2.PlayerOutcome.encode(message.value, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified NullablePlayerOutcome message, length delimited. Does not implicitly {@link bazaar.v2.NullablePlayerOutcome.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.NullablePlayerOutcome
             * @static
             * @param {bazaar.v2.NullablePlayerOutcome.$Properties} message NullablePlayerOutcome message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NullablePlayerOutcome.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a NullablePlayerOutcome message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.NullablePlayerOutcome
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.NullablePlayerOutcome & bazaar.v2.NullablePlayerOutcome.$Shape} NullablePlayerOutcome
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NullablePlayerOutcome.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.NullablePlayerOutcome();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 0)
                                break;
                            message["null"] = reader.bool();
                            message.kind = "null";
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.value = $root.bazaar.v2.PlayerOutcome.decode(reader, reader.uint32(), $undefined, _depth + 1, message.value);
                            message.kind = "value";
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes a NullablePlayerOutcome message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.NullablePlayerOutcome
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.NullablePlayerOutcome & bazaar.v2.NullablePlayerOutcome.$Shape} NullablePlayerOutcome
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NullablePlayerOutcome.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a NullablePlayerOutcome message.
             * @function verify
             * @memberof bazaar.v2.NullablePlayerOutcome
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            NullablePlayerOutcome.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                var properties = {};
                if (message["null"] != null && $Object.hasOwnProperty.call(message, "null")) {
                    properties.kind = 1;
                    if (typeof message["null"] !== "boolean")
                        return "null: boolean expected";
                }
                if (message.value != null && $Object.hasOwnProperty.call(message, "value")) {
                    if (properties.kind === 1)
                        return "kind: multiple values";
                    properties.kind = 1;
                    {
                        var error = $root.bazaar.v2.PlayerOutcome.verify(message.value, _depth + 1);
                        if (error)
                            return "value." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a NullablePlayerOutcome message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.NullablePlayerOutcome
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.NullablePlayerOutcome} NullablePlayerOutcome
             */
            NullablePlayerOutcome.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.NullablePlayerOutcome)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.NullablePlayerOutcome: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.NullablePlayerOutcome();
                if (object["null"] != null)
                    message["null"] = $Boolean(object["null"]);
                if (object.value != null) {
                    if (!$util.isObject(object.value))
                        throw $TypeError(".bazaar.v2.NullablePlayerOutcome.value: object expected");
                    message.value = $root.bazaar.v2.PlayerOutcome.fromObject(object.value, _depth + 1);
                }
                return message;
            };

            /**
             * Creates a plain object from a NullablePlayerOutcome message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.NullablePlayerOutcome
             * @static
             * @param {bazaar.v2.NullablePlayerOutcome} message NullablePlayerOutcome
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            NullablePlayerOutcome.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (message["null"] != null && $Object.hasOwnProperty.call(message, "null")) {
                    object["null"] = message["null"];
                    if (options.oneofs)
                        object.kind = "null";
                }
                if (message.value != null && $Object.hasOwnProperty.call(message, "value")) {
                    object.value = $root.bazaar.v2.PlayerOutcome.toObject(message.value, options, _depth + 1);
                    if (options.oneofs)
                        object.kind = "value";
                }
                return object;
            };

            /**
             * Converts this NullablePlayerOutcome to JSON.
             * @function toJSON
             * @memberof bazaar.v2.NullablePlayerOutcome
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            NullablePlayerOutcome.prototype.toJSON = function() {
                return NullablePlayerOutcome.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for NullablePlayerOutcome
             * @function getTypeUrl
             * @memberof bazaar.v2.NullablePlayerOutcome
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            NullablePlayerOutcome.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.NullablePlayerOutcome";
            };

            return NullablePlayerOutcome;
        })();

        v2.State = (function() {

            /**
             * Properties of a State.
             * @typedef {Object} bazaar.v2.State.$Properties
             * @property {bazaar.v2.StateType} type State type
             * @property {string} protocol_version State protocol_version
             * @property {string} run_id State run_id
             * @property {Long} snapshot_sequence State snapshot_sequence
             * @property {Long} world_version State world_version
             * @property {Long} tick State tick
             * @property {bazaar.v2.Phase} phase State phase
             * @property {string} self_station_id State self_station_id
             * @property {bazaar.v2.PublicRules.$Properties} rules State rules
             * @property {bazaar.v2.ListDirectoryEntry.$Properties} directory State directory
             * @property {bazaar.v2.StationObservation.$Properties} self State self
             * @property {bazaar.v2.ListOffer.$Properties} offers State offers
             * @property {bazaar.v2.ListAdvertisement.$Properties} advertisements State advertisements
             * @property {bazaar.v2.ListTransaction.$Properties} transactions State transactions
             * @property {bazaar.v2.ListResult.$Properties} request_results State request_results
             * @property {bazaar.v2.NullablePlayerOutcome.$Properties} outcome State outcome
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a State.
             * @memberof bazaar.v2
             * @interface IState
             * @augments bazaar.v2.State.$Properties
             * @deprecated Use bazaar.v2.State.$Properties instead.
             */

            /**
             * Shape of a State.
             * @typedef {{
             *   type: bazaar.v2.StateType;
             *   protocol_version: string;
             *   run_id: string;
             *   snapshot_sequence: Long;
             *   world_version: Long;
             *   tick: Long;
             *   phase: bazaar.v2.Phase;
             *   self_station_id: string;
             *   rules: bazaar.v2.PublicRules.$Shape;
             *   directory: bazaar.v2.ListDirectoryEntry.$Shape;
             *   self: bazaar.v2.StationObservation.$Shape;
             *   offers: bazaar.v2.ListOffer.$Shape;
             *   advertisements: bazaar.v2.ListAdvertisement.$Shape;
             *   transactions: bazaar.v2.ListTransaction.$Shape;
             *   request_results: bazaar.v2.ListResult.$Shape;
             *   outcome: bazaar.v2.NullablePlayerOutcome.$Shape;
             *   $unknowns?: Array.<Uint8Array>;
             * }} bazaar.v2.State.$Shape
             */

            /**
             * Constructs a new State.
             * @memberof bazaar.v2
             * @classdesc Represents a State.
             * @constructor
             * @param {bazaar.v2.State.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var State = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * State type.
             * @member {bazaar.v2.StateType} type
             * @memberof bazaar.v2.State
             * @instance
             */
            State.prototype.type = 1;

            /**
             * State protocol_version.
             * @member {string} protocol_version
             * @memberof bazaar.v2.State
             * @instance
             */
            State.prototype.protocol_version = "";

            /**
             * State run_id.
             * @member {string} run_id
             * @memberof bazaar.v2.State
             * @instance
             */
            State.prototype.run_id = "";

            /**
             * State snapshot_sequence.
             * @member {Long} snapshot_sequence
             * @memberof bazaar.v2.State
             * @instance
             */
            State.prototype.snapshot_sequence = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * State world_version.
             * @member {Long} world_version
             * @memberof bazaar.v2.State
             * @instance
             */
            State.prototype.world_version = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * State tick.
             * @member {Long} tick
             * @memberof bazaar.v2.State
             * @instance
             */
            State.prototype.tick = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * State phase.
             * @member {bazaar.v2.Phase} phase
             * @memberof bazaar.v2.State
             * @instance
             */
            State.prototype.phase = 1;

            /**
             * State self_station_id.
             * @member {string} self_station_id
             * @memberof bazaar.v2.State
             * @instance
             */
            State.prototype.self_station_id = "";

            /**
             * State rules.
             * @member {bazaar.v2.PublicRules.$Properties} rules
             * @memberof bazaar.v2.State
             * @instance
             */
            State.prototype.rules = null;

            /**
             * State directory.
             * @member {bazaar.v2.ListDirectoryEntry.$Properties} directory
             * @memberof bazaar.v2.State
             * @instance
             */
            State.prototype.directory = null;

            /**
             * State self.
             * @member {bazaar.v2.StationObservation.$Properties} self
             * @memberof bazaar.v2.State
             * @instance
             */
            State.prototype.self = null;

            /**
             * State offers.
             * @member {bazaar.v2.ListOffer.$Properties} offers
             * @memberof bazaar.v2.State
             * @instance
             */
            State.prototype.offers = null;

            /**
             * State advertisements.
             * @member {bazaar.v2.ListAdvertisement.$Properties} advertisements
             * @memberof bazaar.v2.State
             * @instance
             */
            State.prototype.advertisements = null;

            /**
             * State transactions.
             * @member {bazaar.v2.ListTransaction.$Properties} transactions
             * @memberof bazaar.v2.State
             * @instance
             */
            State.prototype.transactions = null;

            /**
             * State request_results.
             * @member {bazaar.v2.ListResult.$Properties} request_results
             * @memberof bazaar.v2.State
             * @instance
             */
            State.prototype.request_results = null;

            /**
             * State outcome.
             * @member {bazaar.v2.NullablePlayerOutcome.$Properties} outcome
             * @memberof bazaar.v2.State
             * @instance
             */
            State.prototype.outcome = null;

            /**
             * Creates a new State instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.State
             * @static
             * @param {bazaar.v2.State.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.State} State instance
             * @type {{
             *   (properties: bazaar.v2.State.$Shape): bazaar.v2.State & bazaar.v2.State.$Shape;
             *   (properties?: bazaar.v2.State.$Properties): bazaar.v2.State;
             * }}
             */
            State.create = function(properties) {
                return new State(properties);
            };

            /**
             * Encodes the specified State message. Does not implicitly {@link bazaar.v2.State.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.State
             * @static
             * @param {bazaar.v2.State.$Properties} message State message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            State.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.protocol_version);
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.run_id);
                writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.snapshot_sequence);
                writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.world_version);
                writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.tick);
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.phase);
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.self_station_id);
                $root.bazaar.v2.PublicRules.encode(message.rules, writer.uint32(/* id 9, wireType 2 =*/74).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.ListDirectoryEntry.encode(message.directory, writer.uint32(/* id 10, wireType 2 =*/82).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.StationObservation.encode(message.self, writer.uint32(/* id 11, wireType 2 =*/90).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.ListOffer.encode(message.offers, writer.uint32(/* id 12, wireType 2 =*/98).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.ListAdvertisement.encode(message.advertisements, writer.uint32(/* id 13, wireType 2 =*/106).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.ListTransaction.encode(message.transactions, writer.uint32(/* id 14, wireType 2 =*/114).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.ListResult.encode(message.request_results, writer.uint32(/* id 15, wireType 2 =*/122).fork(), _depth + 1).ldelim();
                $root.bazaar.v2.NullablePlayerOutcome.encode(message.outcome, writer.uint32(/* id 16, wireType 2 =*/130).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified State message, length delimited. Does not implicitly {@link bazaar.v2.State.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.State
             * @static
             * @param {bazaar.v2.State.$Properties} message State message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            State.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a State message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.State
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.State & bazaar.v2.State.$Shape} State
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            State.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.State();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 0)
                                break;
                            value = reader.int32();
                            if ($root.bazaar.v2.StateType[value] !== $undefined)
                                message.type = value;
                            else if (!reader.discardUnknown) {
                                $util.makeProp(message, "$unknowns", false);
                                (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                            }
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.protocol_version = reader.string();
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.run_id = reader.string();
                            continue;
                        }
                    case 4: {
                            if (wireType !== 0)
                                break;
                            message.snapshot_sequence = reader.uint64();
                            continue;
                        }
                    case 5: {
                            if (wireType !== 0)
                                break;
                            message.world_version = reader.uint64();
                            continue;
                        }
                    case 6: {
                            if (wireType !== 0)
                                break;
                            message.tick = reader.uint64();
                            continue;
                        }
                    case 7: {
                            if (wireType !== 0)
                                break;
                            value = reader.int32();
                            if ($root.bazaar.v2.Phase[value] !== $undefined)
                                message.phase = value;
                            else if (!reader.discardUnknown) {
                                $util.makeProp(message, "$unknowns", false);
                                (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                            }
                            continue;
                        }
                    case 8: {
                            if (wireType !== 2)
                                break;
                            message.self_station_id = reader.string();
                            continue;
                        }
                    case 9: {
                            if (wireType !== 2)
                                break;
                            message.rules = $root.bazaar.v2.PublicRules.decode(reader, reader.uint32(), $undefined, _depth + 1, message.rules);
                            continue;
                        }
                    case 10: {
                            if (wireType !== 2)
                                break;
                            message.directory = $root.bazaar.v2.ListDirectoryEntry.decode(reader, reader.uint32(), $undefined, _depth + 1, message.directory);
                            continue;
                        }
                    case 11: {
                            if (wireType !== 2)
                                break;
                            message.self = $root.bazaar.v2.StationObservation.decode(reader, reader.uint32(), $undefined, _depth + 1, message.self);
                            continue;
                        }
                    case 12: {
                            if (wireType !== 2)
                                break;
                            message.offers = $root.bazaar.v2.ListOffer.decode(reader, reader.uint32(), $undefined, _depth + 1, message.offers);
                            continue;
                        }
                    case 13: {
                            if (wireType !== 2)
                                break;
                            message.advertisements = $root.bazaar.v2.ListAdvertisement.decode(reader, reader.uint32(), $undefined, _depth + 1, message.advertisements);
                            continue;
                        }
                    case 14: {
                            if (wireType !== 2)
                                break;
                            message.transactions = $root.bazaar.v2.ListTransaction.decode(reader, reader.uint32(), $undefined, _depth + 1, message.transactions);
                            continue;
                        }
                    case 15: {
                            if (wireType !== 2)
                                break;
                            message.request_results = $root.bazaar.v2.ListResult.decode(reader, reader.uint32(), $undefined, _depth + 1, message.request_results);
                            continue;
                        }
                    case 16: {
                            if (wireType !== 2)
                                break;
                            message.outcome = $root.bazaar.v2.NullablePlayerOutcome.decode(reader, reader.uint32(), $undefined, _depth + 1, message.outcome);
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "type"))
                    throw $util.ProtocolError("missing required 'type'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "protocol_version"))
                    throw $util.ProtocolError("missing required 'protocol_version'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "run_id"))
                    throw $util.ProtocolError("missing required 'run_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "snapshot_sequence"))
                    throw $util.ProtocolError("missing required 'snapshot_sequence'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "world_version"))
                    throw $util.ProtocolError("missing required 'world_version'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "tick"))
                    throw $util.ProtocolError("missing required 'tick'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "phase"))
                    throw $util.ProtocolError("missing required 'phase'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "self_station_id"))
                    throw $util.ProtocolError("missing required 'self_station_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "rules"))
                    throw $util.ProtocolError("missing required 'rules'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "directory"))
                    throw $util.ProtocolError("missing required 'directory'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "self"))
                    throw $util.ProtocolError("missing required 'self'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "offers"))
                    throw $util.ProtocolError("missing required 'offers'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "advertisements"))
                    throw $util.ProtocolError("missing required 'advertisements'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "transactions"))
                    throw $util.ProtocolError("missing required 'transactions'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "request_results"))
                    throw $util.ProtocolError("missing required 'request_results'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "outcome"))
                    throw $util.ProtocolError("missing required 'outcome'", { instance: message });
                return message;
            };

            /**
             * Decodes a State message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.State
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.State & bazaar.v2.State.$Shape} State
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            State.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a State message.
             * @function verify
             * @memberof bazaar.v2.State
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            State.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 1:
                    break;
                }
                if (!$util.isString(message.protocol_version))
                    return "protocol_version: string expected";
                if (!$util.isString(message.run_id))
                    return "run_id: string expected";
                if (!$util.isInteger(message.snapshot_sequence) && !(message.snapshot_sequence && $util.isInteger(message.snapshot_sequence.low) && $util.isInteger(message.snapshot_sequence.high)))
                    return "snapshot_sequence: integer|Long expected";
                if (!$util.isInteger(message.world_version) && !(message.world_version && $util.isInteger(message.world_version.low) && $util.isInteger(message.world_version.high)))
                    return "world_version: integer|Long expected";
                if (!$util.isInteger(message.tick) && !(message.tick && $util.isInteger(message.tick.low) && $util.isInteger(message.tick.high)))
                    return "tick: integer|Long expected";
                switch (message.phase) {
                default:
                    return "phase: enum value expected";
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    break;
                }
                if (!$util.isString(message.self_station_id))
                    return "self_station_id: string expected";
                {
                    var error = $root.bazaar.v2.PublicRules.verify(message.rules, _depth + 1);
                    if (error)
                        return "rules." + error;
                }
                {
                    var error = $root.bazaar.v2.ListDirectoryEntry.verify(message.directory, _depth + 1);
                    if (error)
                        return "directory." + error;
                }
                {
                    var error = $root.bazaar.v2.StationObservation.verify(message.self, _depth + 1);
                    if (error)
                        return "self." + error;
                }
                {
                    var error = $root.bazaar.v2.ListOffer.verify(message.offers, _depth + 1);
                    if (error)
                        return "offers." + error;
                }
                {
                    var error = $root.bazaar.v2.ListAdvertisement.verify(message.advertisements, _depth + 1);
                    if (error)
                        return "advertisements." + error;
                }
                {
                    var error = $root.bazaar.v2.ListTransaction.verify(message.transactions, _depth + 1);
                    if (error)
                        return "transactions." + error;
                }
                {
                    var error = $root.bazaar.v2.ListResult.verify(message.request_results, _depth + 1);
                    if (error)
                        return "request_results." + error;
                }
                {
                    var error = $root.bazaar.v2.NullablePlayerOutcome.verify(message.outcome, _depth + 1);
                    if (error)
                        return "outcome." + error;
                }
                return null;
            };

            /**
             * Creates a State message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.State
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.State} State
             */
            State.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.State)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.State: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.State();
                switch (object.type) {
                case "STATE_TYPE_STATE":
                case 1:
                    message.type = 1;
                    break;
                default:
                }
                if (object.protocol_version != null)
                    message.protocol_version = $String(object.protocol_version);
                if (object.run_id != null)
                    message.run_id = $String(object.run_id);
                if (object.snapshot_sequence != null)
                    if ($util.Long)
                        message.snapshot_sequence = $util.Long.fromValue(object.snapshot_sequence, true);
                    else if (typeof object.snapshot_sequence === "string")
                        message.snapshot_sequence = $parseInt(object.snapshot_sequence, 10);
                    else if (typeof object.snapshot_sequence === "number")
                        message.snapshot_sequence = object.snapshot_sequence;
                    else if (typeof object.snapshot_sequence === "object")
                        message.snapshot_sequence = new $util.LongBits(object.snapshot_sequence.low >>> 0, object.snapshot_sequence.high >>> 0).toNumber(true);
                if (object.world_version != null)
                    if ($util.Long)
                        message.world_version = $util.Long.fromValue(object.world_version, true);
                    else if (typeof object.world_version === "string")
                        message.world_version = $parseInt(object.world_version, 10);
                    else if (typeof object.world_version === "number")
                        message.world_version = object.world_version;
                    else if (typeof object.world_version === "object")
                        message.world_version = new $util.LongBits(object.world_version.low >>> 0, object.world_version.high >>> 0).toNumber(true);
                if (object.tick != null)
                    if ($util.Long)
                        message.tick = $util.Long.fromValue(object.tick, true);
                    else if (typeof object.tick === "string")
                        message.tick = $parseInt(object.tick, 10);
                    else if (typeof object.tick === "number")
                        message.tick = object.tick;
                    else if (typeof object.tick === "object")
                        message.tick = new $util.LongBits(object.tick.low >>> 0, object.tick.high >>> 0).toNumber(true);
                switch (object.phase) {
                case "PHASE_READY":
                case 1:
                    message.phase = 1;
                    break;
                case "PHASE_RUNNING":
                case 2:
                    message.phase = 2;
                    break;
                case "PHASE_PAUSED":
                case 3:
                    message.phase = 3;
                    break;
                case "PHASE_FINISHED":
                case 4:
                    message.phase = 4;
                    break;
                case "PHASE_ABORTED":
                case 5:
                    message.phase = 5;
                    break;
                default:
                }
                if (object.self_station_id != null)
                    message.self_station_id = $String(object.self_station_id);
                if (object.rules != null) {
                    if (!$util.isObject(object.rules))
                        throw $TypeError(".bazaar.v2.State.rules: object expected");
                    message.rules = $root.bazaar.v2.PublicRules.fromObject(object.rules, _depth + 1);
                }
                if (object.directory != null) {
                    if (!$util.isObject(object.directory))
                        throw $TypeError(".bazaar.v2.State.directory: object expected");
                    message.directory = $root.bazaar.v2.ListDirectoryEntry.fromObject(object.directory, _depth + 1);
                }
                if (object.self != null) {
                    if (!$util.isObject(object.self))
                        throw $TypeError(".bazaar.v2.State.self: object expected");
                    message.self = $root.bazaar.v2.StationObservation.fromObject(object.self, _depth + 1);
                }
                if (object.offers != null) {
                    if (!$util.isObject(object.offers))
                        throw $TypeError(".bazaar.v2.State.offers: object expected");
                    message.offers = $root.bazaar.v2.ListOffer.fromObject(object.offers, _depth + 1);
                }
                if (object.advertisements != null) {
                    if (!$util.isObject(object.advertisements))
                        throw $TypeError(".bazaar.v2.State.advertisements: object expected");
                    message.advertisements = $root.bazaar.v2.ListAdvertisement.fromObject(object.advertisements, _depth + 1);
                }
                if (object.transactions != null) {
                    if (!$util.isObject(object.transactions))
                        throw $TypeError(".bazaar.v2.State.transactions: object expected");
                    message.transactions = $root.bazaar.v2.ListTransaction.fromObject(object.transactions, _depth + 1);
                }
                if (object.request_results != null) {
                    if (!$util.isObject(object.request_results))
                        throw $TypeError(".bazaar.v2.State.request_results: object expected");
                    message.request_results = $root.bazaar.v2.ListResult.fromObject(object.request_results, _depth + 1);
                }
                if (object.outcome != null) {
                    if (!$util.isObject(object.outcome))
                        throw $TypeError(".bazaar.v2.State.outcome: object expected");
                    message.outcome = $root.bazaar.v2.NullablePlayerOutcome.fromObject(object.outcome, _depth + 1);
                }
                return message;
            };

            /**
             * Creates a plain object from a State message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.State
             * @static
             * @param {bazaar.v2.State} message State
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            State.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.type = options.enums === $String ? "STATE_TYPE_STATE" : 1;
                    object.protocol_version = "";
                    object.run_id = "";
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.snapshot_sequence = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.snapshot_sequence = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.world_version = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.world_version = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.tick = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.tick = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                    object.phase = options.enums === $String ? "PHASE_READY" : 1;
                    object.self_station_id = "";
                    object.rules = null;
                    object.directory = null;
                    object.self = null;
                    object.offers = null;
                    object.advertisements = null;
                    object.transactions = null;
                    object.request_results = null;
                    object.outcome = null;
                }
                if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                    object.type = options.enums === $String ? $root.bazaar.v2.StateType[message.type] === $undefined ? message.type : $root.bazaar.v2.StateType[message.type] : message.type;
                if (message.protocol_version != null && $Object.hasOwnProperty.call(message, "protocol_version"))
                    object.protocol_version = message.protocol_version;
                if (message.run_id != null && $Object.hasOwnProperty.call(message, "run_id"))
                    object.run_id = message.run_id;
                if (message.snapshot_sequence != null && $Object.hasOwnProperty.call(message, "snapshot_sequence"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.snapshot_sequence = typeof message.snapshot_sequence === "number" ? $BigInt(message.snapshot_sequence) : $util.Long.fromBits(message.snapshot_sequence.low >>> 0, message.snapshot_sequence.high >>> 0, true).toBigInt();
                    else if (typeof message.snapshot_sequence === "number")
                        object.snapshot_sequence = options.longs === $String ? $String(message.snapshot_sequence) : message.snapshot_sequence;
                    else
                        object.snapshot_sequence = options.longs === $String ? $util.Long.prototype.toString.call(message.snapshot_sequence) : options.longs === $Number ? new $util.LongBits(message.snapshot_sequence.low >>> 0, message.snapshot_sequence.high >>> 0).toNumber(true) : message.snapshot_sequence;
                if (message.world_version != null && $Object.hasOwnProperty.call(message, "world_version"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.world_version = typeof message.world_version === "number" ? $BigInt(message.world_version) : $util.Long.fromBits(message.world_version.low >>> 0, message.world_version.high >>> 0, true).toBigInt();
                    else if (typeof message.world_version === "number")
                        object.world_version = options.longs === $String ? $String(message.world_version) : message.world_version;
                    else
                        object.world_version = options.longs === $String ? $util.Long.prototype.toString.call(message.world_version) : options.longs === $Number ? new $util.LongBits(message.world_version.low >>> 0, message.world_version.high >>> 0).toNumber(true) : message.world_version;
                if (message.tick != null && $Object.hasOwnProperty.call(message, "tick"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.tick = typeof message.tick === "number" ? $BigInt(message.tick) : $util.Long.fromBits(message.tick.low >>> 0, message.tick.high >>> 0, true).toBigInt();
                    else if (typeof message.tick === "number")
                        object.tick = options.longs === $String ? $String(message.tick) : message.tick;
                    else
                        object.tick = options.longs === $String ? $util.Long.prototype.toString.call(message.tick) : options.longs === $Number ? new $util.LongBits(message.tick.low >>> 0, message.tick.high >>> 0).toNumber(true) : message.tick;
                if (message.phase != null && $Object.hasOwnProperty.call(message, "phase"))
                    object.phase = options.enums === $String ? $root.bazaar.v2.Phase[message.phase] === $undefined ? message.phase : $root.bazaar.v2.Phase[message.phase] : message.phase;
                if (message.self_station_id != null && $Object.hasOwnProperty.call(message, "self_station_id"))
                    object.self_station_id = message.self_station_id;
                if (message.rules != null && $Object.hasOwnProperty.call(message, "rules"))
                    object.rules = $root.bazaar.v2.PublicRules.toObject(message.rules, options, _depth + 1);
                if (message.directory != null && $Object.hasOwnProperty.call(message, "directory"))
                    object.directory = $root.bazaar.v2.ListDirectoryEntry.toObject(message.directory, options, _depth + 1);
                if (message.self != null && $Object.hasOwnProperty.call(message, "self"))
                    object.self = $root.bazaar.v2.StationObservation.toObject(message.self, options, _depth + 1);
                if (message.offers != null && $Object.hasOwnProperty.call(message, "offers"))
                    object.offers = $root.bazaar.v2.ListOffer.toObject(message.offers, options, _depth + 1);
                if (message.advertisements != null && $Object.hasOwnProperty.call(message, "advertisements"))
                    object.advertisements = $root.bazaar.v2.ListAdvertisement.toObject(message.advertisements, options, _depth + 1);
                if (message.transactions != null && $Object.hasOwnProperty.call(message, "transactions"))
                    object.transactions = $root.bazaar.v2.ListTransaction.toObject(message.transactions, options, _depth + 1);
                if (message.request_results != null && $Object.hasOwnProperty.call(message, "request_results"))
                    object.request_results = $root.bazaar.v2.ListResult.toObject(message.request_results, options, _depth + 1);
                if (message.outcome != null && $Object.hasOwnProperty.call(message, "outcome"))
                    object.outcome = $root.bazaar.v2.NullablePlayerOutcome.toObject(message.outcome, options, _depth + 1);
                return object;
            };

            /**
             * Converts this State to JSON.
             * @function toJSON
             * @memberof bazaar.v2.State
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            State.prototype.toJSON = function() {
                return State.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for State
             * @function getTypeUrl
             * @memberof bazaar.v2.State
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            State.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.State";
            };

            return State;
        })();

        /**
         * ReadinessType enum.
         * @name bazaar.v2.ReadinessType
         * @enum {number}
         * @property {number} READINESS_TYPE_READINESS=1 READINESS_TYPE_READINESS value
         */
        v2.ReadinessType = (function() {
            var valuesById = $Object.create(null), values = $Object.create(valuesById);
            values[valuesById[1] = "READINESS_TYPE_READINESS"] = 1;
            return values;
        })();

        v2.Readiness = (function() {

            /**
             * Properties of a Readiness.
             * @typedef {Object} bazaar.v2.Readiness.$Properties
             * @property {bazaar.v2.ReadinessType} type Readiness type
             * @property {string} protocol_version Readiness protocol_version
             * @property {string} run_id Readiness run_id
             * @property {boolean} ready Readiness ready
             * @property {Long} snapshot_sequence Readiness snapshot_sequence
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a Readiness.
             * @memberof bazaar.v2
             * @interface IReadiness
             * @augments bazaar.v2.Readiness.$Properties
             * @deprecated Use bazaar.v2.Readiness.$Properties instead.
             */

            /**
             * Shape of a Readiness.
             * @typedef {bazaar.v2.Readiness.$Properties} bazaar.v2.Readiness.$Shape
             */

            /**
             * Constructs a new Readiness.
             * @memberof bazaar.v2
             * @classdesc Represents a Readiness.
             * @constructor
             * @param {bazaar.v2.Readiness.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var Readiness = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * Readiness type.
             * @member {bazaar.v2.ReadinessType} type
             * @memberof bazaar.v2.Readiness
             * @instance
             */
            Readiness.prototype.type = 1;

            /**
             * Readiness protocol_version.
             * @member {string} protocol_version
             * @memberof bazaar.v2.Readiness
             * @instance
             */
            Readiness.prototype.protocol_version = "";

            /**
             * Readiness run_id.
             * @member {string} run_id
             * @memberof bazaar.v2.Readiness
             * @instance
             */
            Readiness.prototype.run_id = "";

            /**
             * Readiness ready.
             * @member {boolean} ready
             * @memberof bazaar.v2.Readiness
             * @instance
             */
            Readiness.prototype.ready = false;

            /**
             * Readiness snapshot_sequence.
             * @member {Long} snapshot_sequence
             * @memberof bazaar.v2.Readiness
             * @instance
             */
            Readiness.prototype.snapshot_sequence = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new Readiness instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.Readiness
             * @static
             * @param {bazaar.v2.Readiness.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.Readiness} Readiness instance
             * @type {{
             *   (properties: bazaar.v2.Readiness.$Shape): bazaar.v2.Readiness & bazaar.v2.Readiness.$Shape;
             *   (properties?: bazaar.v2.Readiness.$Properties): bazaar.v2.Readiness;
             * }}
             */
            Readiness.create = function(properties) {
                return new Readiness(properties);
            };

            /**
             * Encodes the specified Readiness message. Does not implicitly {@link bazaar.v2.Readiness.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.Readiness
             * @static
             * @param {bazaar.v2.Readiness.$Properties} message Readiness message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Readiness.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.protocol_version);
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.run_id);
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.ready);
                writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.snapshot_sequence);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified Readiness message, length delimited. Does not implicitly {@link bazaar.v2.Readiness.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.Readiness
             * @static
             * @param {bazaar.v2.Readiness.$Properties} message Readiness message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Readiness.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a Readiness message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.Readiness
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.Readiness & bazaar.v2.Readiness.$Shape} Readiness
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Readiness.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message, value;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.Readiness();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 0)
                                break;
                            value = reader.int32();
                            if ($root.bazaar.v2.ReadinessType[value] !== $undefined)
                                message.type = value;
                            else if (!reader.discardUnknown) {
                                $util.makeProp(message, "$unknowns", false);
                                (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                            }
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.protocol_version = reader.string();
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.run_id = reader.string();
                            continue;
                        }
                    case 4: {
                            if (wireType !== 0)
                                break;
                            message.ready = reader.bool();
                            continue;
                        }
                    case 5: {
                            if (wireType !== 0)
                                break;
                            message.snapshot_sequence = reader.uint64();
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                if (!$Object.hasOwnProperty.call(message, "type"))
                    throw $util.ProtocolError("missing required 'type'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "protocol_version"))
                    throw $util.ProtocolError("missing required 'protocol_version'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "run_id"))
                    throw $util.ProtocolError("missing required 'run_id'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "ready"))
                    throw $util.ProtocolError("missing required 'ready'", { instance: message });
                if (!$Object.hasOwnProperty.call(message, "snapshot_sequence"))
                    throw $util.ProtocolError("missing required 'snapshot_sequence'", { instance: message });
                return message;
            };

            /**
             * Decodes a Readiness message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.Readiness
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.Readiness & bazaar.v2.Readiness.$Shape} Readiness
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Readiness.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Readiness message.
             * @function verify
             * @memberof bazaar.v2.Readiness
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Readiness.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 1:
                    break;
                }
                if (!$util.isString(message.protocol_version))
                    return "protocol_version: string expected";
                if (!$util.isString(message.run_id))
                    return "run_id: string expected";
                if (typeof message.ready !== "boolean")
                    return "ready: boolean expected";
                if (!$util.isInteger(message.snapshot_sequence) && !(message.snapshot_sequence && $util.isInteger(message.snapshot_sequence.low) && $util.isInteger(message.snapshot_sequence.high)))
                    return "snapshot_sequence: integer|Long expected";
                return null;
            };

            /**
             * Creates a Readiness message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.Readiness
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.Readiness} Readiness
             */
            Readiness.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.Readiness)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.Readiness: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.Readiness();
                switch (object.type) {
                case "READINESS_TYPE_READINESS":
                case 1:
                    message.type = 1;
                    break;
                default:
                }
                if (object.protocol_version != null)
                    message.protocol_version = $String(object.protocol_version);
                if (object.run_id != null)
                    message.run_id = $String(object.run_id);
                if (object.ready != null)
                    message.ready = $Boolean(object.ready);
                if (object.snapshot_sequence != null)
                    if ($util.Long)
                        message.snapshot_sequence = $util.Long.fromValue(object.snapshot_sequence, true);
                    else if (typeof object.snapshot_sequence === "string")
                        message.snapshot_sequence = $parseInt(object.snapshot_sequence, 10);
                    else if (typeof object.snapshot_sequence === "number")
                        message.snapshot_sequence = object.snapshot_sequence;
                    else if (typeof object.snapshot_sequence === "object")
                        message.snapshot_sequence = new $util.LongBits(object.snapshot_sequence.low >>> 0, object.snapshot_sequence.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a Readiness message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.Readiness
             * @static
             * @param {bazaar.v2.Readiness} message Readiness
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Readiness.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (options.defaults) {
                    object.type = options.enums === $String ? "READINESS_TYPE_READINESS" : 1;
                    object.protocol_version = "";
                    object.run_id = "";
                    object.ready = false;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.snapshot_sequence = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                    } else
                        object.snapshot_sequence = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                }
                if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                    object.type = options.enums === $String ? $root.bazaar.v2.ReadinessType[message.type] === $undefined ? message.type : $root.bazaar.v2.ReadinessType[message.type] : message.type;
                if (message.protocol_version != null && $Object.hasOwnProperty.call(message, "protocol_version"))
                    object.protocol_version = message.protocol_version;
                if (message.run_id != null && $Object.hasOwnProperty.call(message, "run_id"))
                    object.run_id = message.run_id;
                if (message.ready != null && $Object.hasOwnProperty.call(message, "ready"))
                    object.ready = message.ready;
                if (message.snapshot_sequence != null && $Object.hasOwnProperty.call(message, "snapshot_sequence"))
                    if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                        object.snapshot_sequence = typeof message.snapshot_sequence === "number" ? $BigInt(message.snapshot_sequence) : $util.Long.fromBits(message.snapshot_sequence.low >>> 0, message.snapshot_sequence.high >>> 0, true).toBigInt();
                    else if (typeof message.snapshot_sequence === "number")
                        object.snapshot_sequence = options.longs === $String ? $String(message.snapshot_sequence) : message.snapshot_sequence;
                    else
                        object.snapshot_sequence = options.longs === $String ? $util.Long.prototype.toString.call(message.snapshot_sequence) : options.longs === $Number ? new $util.LongBits(message.snapshot_sequence.low >>> 0, message.snapshot_sequence.high >>> 0).toNumber(true) : message.snapshot_sequence;
                return object;
            };

            /**
             * Converts this Readiness to JSON.
             * @function toJSON
             * @memberof bazaar.v2.Readiness
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Readiness.prototype.toJSON = function() {
                return Readiness.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for Readiness
             * @function getTypeUrl
             * @memberof bazaar.v2.Readiness
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            Readiness.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.Readiness";
            };

            return Readiness;
        })();

        v2.ClientMessage = (function() {

            /**
             * Properties of a ClientMessage.
             * @typedef {Object} bazaar.v2.ClientMessage.$Properties
             * @property {bazaar.v2.Advertise.$Properties|null} [advertise] ClientMessage advertise
             * @property {bazaar.v2.OfferCommand.$Properties|null} [offer] ClientMessage offer
             * @property {bazaar.v2.Accept.$Properties|null} [accept] ClientMessage accept
             * @property {bazaar.v2.Withdraw.$Properties|null} [withdraw] ClientMessage withdraw
             * @property {bazaar.v2.Sync.$Properties|null} [sync] ClientMessage sync
             * @property {bazaar.v2.Ready.$Properties|null} [ready] ClientMessage ready
             * @property {"advertise"|"offer"|"accept"|"withdraw"|"sync"|"ready"} [message] ClientMessage message
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a ClientMessage.
             * @memberof bazaar.v2
             * @interface IClientMessage
             * @augments bazaar.v2.ClientMessage.$Properties
             * @deprecated Use bazaar.v2.ClientMessage.$Properties instead.
             */

            /**
             * Narrowed shape of a ClientMessage.
             * @typedef {{
             *   advertise?: bazaar.v2.Advertise.$Shape|null;
             *   offer?: bazaar.v2.OfferCommand.$Shape|null;
             *   accept?: bazaar.v2.Accept.$Shape|null;
             *   withdraw?: bazaar.v2.Withdraw.$Shape|null;
             *   sync?: bazaar.v2.Sync.$Shape|null;
             *   ready?: bazaar.v2.Ready.$Shape|null;
             *   $unknowns?: Array.<Uint8Array>;
             * } & (
             *   ({ message?: undefined; advertise?: null; offer?: null; accept?: null; withdraw?: null; sync?: null; ready?: null }|{ message?: "advertise"; advertise: bazaar.v2.Advertise.$Shape; offer?: null; accept?: null; withdraw?: null; sync?: null; ready?: null }|{ message?: "offer"; advertise?: null; offer: bazaar.v2.OfferCommand.$Shape; accept?: null; withdraw?: null; sync?: null; ready?: null }|{ message?: "accept"; advertise?: null; offer?: null; accept: bazaar.v2.Accept.$Shape; withdraw?: null; sync?: null; ready?: null }|{ message?: "withdraw"; advertise?: null; offer?: null; accept?: null; withdraw: bazaar.v2.Withdraw.$Shape; sync?: null; ready?: null }|{ message?: "sync"; advertise?: null; offer?: null; accept?: null; withdraw?: null; sync: bazaar.v2.Sync.$Shape; ready?: null }|{ message?: "ready"; advertise?: null; offer?: null; accept?: null; withdraw?: null; sync?: null; ready: bazaar.v2.Ready.$Shape })
             * )} bazaar.v2.ClientMessage.$Shape
             */

            /**
             * Constructs a new ClientMessage.
             * @memberof bazaar.v2
             * @classdesc Represents a ClientMessage.
             * @constructor
             * @param {bazaar.v2.ClientMessage.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var ClientMessage = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * ClientMessage advertise.
             * @member {bazaar.v2.Advertise.$Properties|null|undefined} advertise
             * @memberof bazaar.v2.ClientMessage
             * @instance
             */
            ClientMessage.prototype.advertise = null;

            /**
             * ClientMessage offer.
             * @member {bazaar.v2.OfferCommand.$Properties|null|undefined} offer
             * @memberof bazaar.v2.ClientMessage
             * @instance
             */
            ClientMessage.prototype.offer = null;

            /**
             * ClientMessage accept.
             * @member {bazaar.v2.Accept.$Properties|null|undefined} accept
             * @memberof bazaar.v2.ClientMessage
             * @instance
             */
            ClientMessage.prototype.accept = null;

            /**
             * ClientMessage withdraw.
             * @member {bazaar.v2.Withdraw.$Properties|null|undefined} withdraw
             * @memberof bazaar.v2.ClientMessage
             * @instance
             */
            ClientMessage.prototype.withdraw = null;

            /**
             * ClientMessage sync.
             * @member {bazaar.v2.Sync.$Properties|null|undefined} sync
             * @memberof bazaar.v2.ClientMessage
             * @instance
             */
            ClientMessage.prototype.sync = null;

            /**
             * ClientMessage ready.
             * @member {bazaar.v2.Ready.$Properties|null|undefined} ready
             * @memberof bazaar.v2.ClientMessage
             * @instance
             */
            ClientMessage.prototype.ready = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * ClientMessage message.
             * @member {"advertise"|"offer"|"accept"|"withdraw"|"sync"|"ready"|undefined} message
             * @memberof bazaar.v2.ClientMessage
             * @instance
             */
            $Object.defineProperty(ClientMessage.prototype, "message", {
                get: $util.oneOfGetter($oneOfFields = ["advertise", "offer", "accept", "withdraw", "sync", "ready"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new ClientMessage instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.ClientMessage
             * @static
             * @param {bazaar.v2.ClientMessage.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.ClientMessage} ClientMessage instance
             * @type {{
             *   (properties: bazaar.v2.ClientMessage.$Shape): bazaar.v2.ClientMessage & bazaar.v2.ClientMessage.$Shape;
             *   (properties?: bazaar.v2.ClientMessage.$Properties): bazaar.v2.ClientMessage;
             * }}
             */
            ClientMessage.create = function(properties) {
                return new ClientMessage(properties);
            };

            /**
             * Encodes the specified ClientMessage message. Does not implicitly {@link bazaar.v2.ClientMessage.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.ClientMessage
             * @static
             * @param {bazaar.v2.ClientMessage.$Properties} message ClientMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ClientMessage.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.advertise != null && $Object.hasOwnProperty.call(message, "advertise"))
                    $root.bazaar.v2.Advertise.encode(message.advertise, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
                if (message.offer != null && $Object.hasOwnProperty.call(message, "offer"))
                    $root.bazaar.v2.OfferCommand.encode(message.offer, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
                if (message.accept != null && $Object.hasOwnProperty.call(message, "accept"))
                    $root.bazaar.v2.Accept.encode(message.accept, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
                if (message.withdraw != null && $Object.hasOwnProperty.call(message, "withdraw"))
                    $root.bazaar.v2.Withdraw.encode(message.withdraw, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
                if (message.sync != null && $Object.hasOwnProperty.call(message, "sync"))
                    $root.bazaar.v2.Sync.encode(message.sync, writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
                if (message.ready != null && $Object.hasOwnProperty.call(message, "ready"))
                    $root.bazaar.v2.Ready.encode(message.ready, writer.uint32(/* id 6, wireType 2 =*/50).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified ClientMessage message, length delimited. Does not implicitly {@link bazaar.v2.ClientMessage.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.ClientMessage
             * @static
             * @param {bazaar.v2.ClientMessage.$Properties} message ClientMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ClientMessage.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a ClientMessage message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.ClientMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.ClientMessage & bazaar.v2.ClientMessage.$Shape} ClientMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ClientMessage.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.ClientMessage();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            message.advertise = $root.bazaar.v2.Advertise.decode(reader, reader.uint32(), $undefined, _depth + 1, message.advertise);
                            message.message = "advertise";
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.offer = $root.bazaar.v2.OfferCommand.decode(reader, reader.uint32(), $undefined, _depth + 1, message.offer);
                            message.message = "offer";
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.accept = $root.bazaar.v2.Accept.decode(reader, reader.uint32(), $undefined, _depth + 1, message.accept);
                            message.message = "accept";
                            continue;
                        }
                    case 4: {
                            if (wireType !== 2)
                                break;
                            message.withdraw = $root.bazaar.v2.Withdraw.decode(reader, reader.uint32(), $undefined, _depth + 1, message.withdraw);
                            message.message = "withdraw";
                            continue;
                        }
                    case 5: {
                            if (wireType !== 2)
                                break;
                            message.sync = $root.bazaar.v2.Sync.decode(reader, reader.uint32(), $undefined, _depth + 1, message.sync);
                            message.message = "sync";
                            continue;
                        }
                    case 6: {
                            if (wireType !== 2)
                                break;
                            message.ready = $root.bazaar.v2.Ready.decode(reader, reader.uint32(), $undefined, _depth + 1, message.ready);
                            message.message = "ready";
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes a ClientMessage message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.ClientMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.ClientMessage & bazaar.v2.ClientMessage.$Shape} ClientMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ClientMessage.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ClientMessage message.
             * @function verify
             * @memberof bazaar.v2.ClientMessage
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ClientMessage.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                var properties = {};
                if (message.advertise != null && $Object.hasOwnProperty.call(message, "advertise")) {
                    properties.message = 1;
                    {
                        var error = $root.bazaar.v2.Advertise.verify(message.advertise, _depth + 1);
                        if (error)
                            return "advertise." + error;
                    }
                }
                if (message.offer != null && $Object.hasOwnProperty.call(message, "offer")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.bazaar.v2.OfferCommand.verify(message.offer, _depth + 1);
                        if (error)
                            return "offer." + error;
                    }
                }
                if (message.accept != null && $Object.hasOwnProperty.call(message, "accept")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.bazaar.v2.Accept.verify(message.accept, _depth + 1);
                        if (error)
                            return "accept." + error;
                    }
                }
                if (message.withdraw != null && $Object.hasOwnProperty.call(message, "withdraw")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.bazaar.v2.Withdraw.verify(message.withdraw, _depth + 1);
                        if (error)
                            return "withdraw." + error;
                    }
                }
                if (message.sync != null && $Object.hasOwnProperty.call(message, "sync")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.bazaar.v2.Sync.verify(message.sync, _depth + 1);
                        if (error)
                            return "sync." + error;
                    }
                }
                if (message.ready != null && $Object.hasOwnProperty.call(message, "ready")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.bazaar.v2.Ready.verify(message.ready, _depth + 1);
                        if (error)
                            return "ready." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ClientMessage message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.ClientMessage
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.ClientMessage} ClientMessage
             */
            ClientMessage.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.ClientMessage)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.ClientMessage: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.ClientMessage();
                if (object.advertise != null) {
                    if (!$util.isObject(object.advertise))
                        throw $TypeError(".bazaar.v2.ClientMessage.advertise: object expected");
                    message.advertise = $root.bazaar.v2.Advertise.fromObject(object.advertise, _depth + 1);
                }
                if (object.offer != null) {
                    if (!$util.isObject(object.offer))
                        throw $TypeError(".bazaar.v2.ClientMessage.offer: object expected");
                    message.offer = $root.bazaar.v2.OfferCommand.fromObject(object.offer, _depth + 1);
                }
                if (object.accept != null) {
                    if (!$util.isObject(object.accept))
                        throw $TypeError(".bazaar.v2.ClientMessage.accept: object expected");
                    message.accept = $root.bazaar.v2.Accept.fromObject(object.accept, _depth + 1);
                }
                if (object.withdraw != null) {
                    if (!$util.isObject(object.withdraw))
                        throw $TypeError(".bazaar.v2.ClientMessage.withdraw: object expected");
                    message.withdraw = $root.bazaar.v2.Withdraw.fromObject(object.withdraw, _depth + 1);
                }
                if (object.sync != null) {
                    if (!$util.isObject(object.sync))
                        throw $TypeError(".bazaar.v2.ClientMessage.sync: object expected");
                    message.sync = $root.bazaar.v2.Sync.fromObject(object.sync, _depth + 1);
                }
                if (object.ready != null) {
                    if (!$util.isObject(object.ready))
                        throw $TypeError(".bazaar.v2.ClientMessage.ready: object expected");
                    message.ready = $root.bazaar.v2.Ready.fromObject(object.ready, _depth + 1);
                }
                return message;
            };

            /**
             * Creates a plain object from a ClientMessage message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.ClientMessage
             * @static
             * @param {bazaar.v2.ClientMessage} message ClientMessage
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ClientMessage.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (message.advertise != null && $Object.hasOwnProperty.call(message, "advertise")) {
                    object.advertise = $root.bazaar.v2.Advertise.toObject(message.advertise, options, _depth + 1);
                    if (options.oneofs)
                        object.message = "advertise";
                }
                if (message.offer != null && $Object.hasOwnProperty.call(message, "offer")) {
                    object.offer = $root.bazaar.v2.OfferCommand.toObject(message.offer, options, _depth + 1);
                    if (options.oneofs)
                        object.message = "offer";
                }
                if (message.accept != null && $Object.hasOwnProperty.call(message, "accept")) {
                    object.accept = $root.bazaar.v2.Accept.toObject(message.accept, options, _depth + 1);
                    if (options.oneofs)
                        object.message = "accept";
                }
                if (message.withdraw != null && $Object.hasOwnProperty.call(message, "withdraw")) {
                    object.withdraw = $root.bazaar.v2.Withdraw.toObject(message.withdraw, options, _depth + 1);
                    if (options.oneofs)
                        object.message = "withdraw";
                }
                if (message.sync != null && $Object.hasOwnProperty.call(message, "sync")) {
                    object.sync = $root.bazaar.v2.Sync.toObject(message.sync, options, _depth + 1);
                    if (options.oneofs)
                        object.message = "sync";
                }
                if (message.ready != null && $Object.hasOwnProperty.call(message, "ready")) {
                    object.ready = $root.bazaar.v2.Ready.toObject(message.ready, options, _depth + 1);
                    if (options.oneofs)
                        object.message = "ready";
                }
                return object;
            };

            /**
             * Converts this ClientMessage to JSON.
             * @function toJSON
             * @memberof bazaar.v2.ClientMessage
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ClientMessage.prototype.toJSON = function() {
                return ClientMessage.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for ClientMessage
             * @function getTypeUrl
             * @memberof bazaar.v2.ClientMessage
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            ClientMessage.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.ClientMessage";
            };

            return ClientMessage;
        })();

        v2.ServerMessage = (function() {

            /**
             * Properties of a ServerMessage.
             * @typedef {Object} bazaar.v2.ServerMessage.$Properties
             * @property {bazaar.v2.State.$Properties|null} [state] ServerMessage state
             * @property {bazaar.v2.Result.$Properties|null} [result] ServerMessage result
             * @property {bazaar.v2.ProtocolError.$Properties|null} [protocol_error] ServerMessage protocol_error
             * @property {bazaar.v2.Readiness.$Properties|null} [readiness] ServerMessage readiness
             * @property {"state"|"result"|"protocol_error"|"readiness"} [message] ServerMessage message
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a ServerMessage.
             * @memberof bazaar.v2
             * @interface IServerMessage
             * @augments bazaar.v2.ServerMessage.$Properties
             * @deprecated Use bazaar.v2.ServerMessage.$Properties instead.
             */

            /**
             * Narrowed shape of a ServerMessage.
             * @typedef {{
             *   state?: bazaar.v2.State.$Shape|null;
             *   result?: bazaar.v2.Result.$Shape|null;
             *   protocol_error?: bazaar.v2.ProtocolError.$Shape|null;
             *   readiness?: bazaar.v2.Readiness.$Shape|null;
             *   $unknowns?: Array.<Uint8Array>;
             * } & (
             *   ({ message?: undefined; state?: null; result?: null; protocol_error?: null; readiness?: null }|{ message?: "state"; state: bazaar.v2.State.$Shape; result?: null; protocol_error?: null; readiness?: null }|{ message?: "result"; state?: null; result: bazaar.v2.Result.$Shape; protocol_error?: null; readiness?: null }|{ message?: "protocol_error"; state?: null; result?: null; protocol_error: bazaar.v2.ProtocolError.$Shape; readiness?: null }|{ message?: "readiness"; state?: null; result?: null; protocol_error?: null; readiness: bazaar.v2.Readiness.$Shape })
             * )} bazaar.v2.ServerMessage.$Shape
             */

            /**
             * Constructs a new ServerMessage.
             * @memberof bazaar.v2
             * @classdesc Represents a ServerMessage.
             * @constructor
             * @param {bazaar.v2.ServerMessage.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            var ServerMessage = function (properties) {
                if (properties)
                    for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * ServerMessage state.
             * @member {bazaar.v2.State.$Properties|null|undefined} state
             * @memberof bazaar.v2.ServerMessage
             * @instance
             */
            ServerMessage.prototype.state = null;

            /**
             * ServerMessage result.
             * @member {bazaar.v2.Result.$Properties|null|undefined} result
             * @memberof bazaar.v2.ServerMessage
             * @instance
             */
            ServerMessage.prototype.result = null;

            /**
             * ServerMessage protocol_error.
             * @member {bazaar.v2.ProtocolError.$Properties|null|undefined} protocol_error
             * @memberof bazaar.v2.ServerMessage
             * @instance
             */
            ServerMessage.prototype.protocol_error = null;

            /**
             * ServerMessage readiness.
             * @member {bazaar.v2.Readiness.$Properties|null|undefined} readiness
             * @memberof bazaar.v2.ServerMessage
             * @instance
             */
            ServerMessage.prototype.readiness = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * ServerMessage message.
             * @member {"state"|"result"|"protocol_error"|"readiness"|undefined} message
             * @memberof bazaar.v2.ServerMessage
             * @instance
             */
            $Object.defineProperty(ServerMessage.prototype, "message", {
                get: $util.oneOfGetter($oneOfFields = ["state", "result", "protocol_error", "readiness"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new ServerMessage instance using the specified properties.
             * @function create
             * @memberof bazaar.v2.ServerMessage
             * @static
             * @param {bazaar.v2.ServerMessage.$Properties=} [properties] Properties to set
             * @returns {bazaar.v2.ServerMessage} ServerMessage instance
             * @type {{
             *   (properties: bazaar.v2.ServerMessage.$Shape): bazaar.v2.ServerMessage & bazaar.v2.ServerMessage.$Shape;
             *   (properties?: bazaar.v2.ServerMessage.$Properties): bazaar.v2.ServerMessage;
             * }}
             */
            ServerMessage.create = function(properties) {
                return new ServerMessage(properties);
            };

            /**
             * Encodes the specified ServerMessage message. Does not implicitly {@link bazaar.v2.ServerMessage.verify|verify} messages.
             * @function encode
             * @memberof bazaar.v2.ServerMessage
             * @static
             * @param {bazaar.v2.ServerMessage.$Properties} message ServerMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ServerMessage.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.state != null && $Object.hasOwnProperty.call(message, "state"))
                    $root.bazaar.v2.State.encode(message.state, writer.uint32(/* id 1, wireType 2 =*/10).fork(), _depth + 1).ldelim();
                if (message.result != null && $Object.hasOwnProperty.call(message, "result"))
                    $root.bazaar.v2.Result.encode(message.result, writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
                if (message.protocol_error != null && $Object.hasOwnProperty.call(message, "protocol_error"))
                    $root.bazaar.v2.ProtocolError.encode(message.protocol_error, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
                if (message.readiness != null && $Object.hasOwnProperty.call(message, "readiness"))
                    $root.bazaar.v2.Readiness.encode(message.readiness, writer.uint32(/* id 4, wireType 2 =*/34).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (var i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Encodes the specified ServerMessage message, length delimited. Does not implicitly {@link bazaar.v2.ServerMessage.verify|verify} messages.
             * @function encodeDelimited
             * @memberof bazaar.v2.ServerMessage
             * @static
             * @param {bazaar.v2.ServerMessage.$Properties} message ServerMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ServerMessage.encodeDelimited = function(message, writer) {
                return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
            };

            /**
             * Decodes a ServerMessage message from the specified reader or buffer.
             * @function decode
             * @memberof bazaar.v2.ServerMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {bazaar.v2.ServerMessage & bazaar.v2.ServerMessage.$Shape} ServerMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ServerMessage.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                var end, message;
                if (length === $undefined)
                    end = reader.len;
                else {
                    end = reader.pos + length;
                    if (end > reader.len)
                        throw $RangeError("index out of range");
                    length = reader.len;
                    reader.len = end;
                }
                message = _target || new $root.bazaar.v2.ServerMessage();
                while (reader.pos < end) {
                    var start = reader.pos;
                    var tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    var wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            message.state = $root.bazaar.v2.State.decode(reader, reader.uint32(), $undefined, _depth + 1, message.state);
                            message.message = "state";
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.result = $root.bazaar.v2.Result.decode(reader, reader.uint32(), $undefined, _depth + 1, message.result);
                            message.message = "result";
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.protocol_error = $root.bazaar.v2.ProtocolError.decode(reader, reader.uint32(), $undefined, _depth + 1, message.protocol_error);
                            message.message = "protocol_error";
                            continue;
                        }
                    case 4: {
                            if (wireType !== 2)
                                break;
                            message.readiness = $root.bazaar.v2.Readiness.decode(reader, reader.uint32(), $undefined, _depth + 1, message.readiness);
                            message.message = "readiness";
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (length !== $undefined) {
                    if (reader.pos !== end)
                        throw $RangeError("index out of range");
                    reader.len = length;
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Decodes a ServerMessage message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof bazaar.v2.ServerMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {bazaar.v2.ServerMessage & bazaar.v2.ServerMessage.$Shape} ServerMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ServerMessage.decodeDelimited = function(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ServerMessage message.
             * @function verify
             * @memberof bazaar.v2.ServerMessage
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ServerMessage.verify = function (message, _depth) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    return "max depth exceeded";
                var properties = {};
                if (message.state != null && $Object.hasOwnProperty.call(message, "state")) {
                    properties.message = 1;
                    {
                        var error = $root.bazaar.v2.State.verify(message.state, _depth + 1);
                        if (error)
                            return "state." + error;
                    }
                }
                if (message.result != null && $Object.hasOwnProperty.call(message, "result")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.bazaar.v2.Result.verify(message.result, _depth + 1);
                        if (error)
                            return "result." + error;
                    }
                }
                if (message.protocol_error != null && $Object.hasOwnProperty.call(message, "protocol_error")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.bazaar.v2.ProtocolError.verify(message.protocol_error, _depth + 1);
                        if (error)
                            return "protocol_error." + error;
                    }
                }
                if (message.readiness != null && $Object.hasOwnProperty.call(message, "readiness")) {
                    if (properties.message === 1)
                        return "message: multiple values";
                    properties.message = 1;
                    {
                        var error = $root.bazaar.v2.Readiness.verify(message.readiness, _depth + 1);
                        if (error)
                            return "readiness." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ServerMessage message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof bazaar.v2.ServerMessage
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {bazaar.v2.ServerMessage} ServerMessage
             */
            ServerMessage.fromObject = function (object, _depth) {
                if (object instanceof $root.bazaar.v2.ServerMessage)
                    return object;
                if (!$util.isObject(object))
                    throw $TypeError(".bazaar.v2.ServerMessage: object expected");
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var message = new $root.bazaar.v2.ServerMessage();
                if (object.state != null) {
                    if (!$util.isObject(object.state))
                        throw $TypeError(".bazaar.v2.ServerMessage.state: object expected");
                    message.state = $root.bazaar.v2.State.fromObject(object.state, _depth + 1);
                }
                if (object.result != null) {
                    if (!$util.isObject(object.result))
                        throw $TypeError(".bazaar.v2.ServerMessage.result: object expected");
                    message.result = $root.bazaar.v2.Result.fromObject(object.result, _depth + 1);
                }
                if (object.protocol_error != null) {
                    if (!$util.isObject(object.protocol_error))
                        throw $TypeError(".bazaar.v2.ServerMessage.protocol_error: object expected");
                    message.protocol_error = $root.bazaar.v2.ProtocolError.fromObject(object.protocol_error, _depth + 1);
                }
                if (object.readiness != null) {
                    if (!$util.isObject(object.readiness))
                        throw $TypeError(".bazaar.v2.ServerMessage.readiness: object expected");
                    message.readiness = $root.bazaar.v2.Readiness.fromObject(object.readiness, _depth + 1);
                }
                return message;
            };

            /**
             * Creates a plain object from a ServerMessage message. Also converts values to other types if specified.
             * @function toObject
             * @memberof bazaar.v2.ServerMessage
             * @static
             * @param {bazaar.v2.ServerMessage} message ServerMessage
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ServerMessage.toObject = function (message, options, _depth) {
                if (!options)
                    options = {};
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                var object = {};
                if (message.state != null && $Object.hasOwnProperty.call(message, "state")) {
                    object.state = $root.bazaar.v2.State.toObject(message.state, options, _depth + 1);
                    if (options.oneofs)
                        object.message = "state";
                }
                if (message.result != null && $Object.hasOwnProperty.call(message, "result")) {
                    object.result = $root.bazaar.v2.Result.toObject(message.result, options, _depth + 1);
                    if (options.oneofs)
                        object.message = "result";
                }
                if (message.protocol_error != null && $Object.hasOwnProperty.call(message, "protocol_error")) {
                    object.protocol_error = $root.bazaar.v2.ProtocolError.toObject(message.protocol_error, options, _depth + 1);
                    if (options.oneofs)
                        object.message = "protocol_error";
                }
                if (message.readiness != null && $Object.hasOwnProperty.call(message, "readiness")) {
                    object.readiness = $root.bazaar.v2.Readiness.toObject(message.readiness, options, _depth + 1);
                    if (options.oneofs)
                        object.message = "readiness";
                }
                return object;
            };

            /**
             * Converts this ServerMessage to JSON.
             * @function toJSON
             * @memberof bazaar.v2.ServerMessage
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ServerMessage.prototype.toJSON = function() {
                return ServerMessage.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the type url for ServerMessage
             * @function getTypeUrl
             * @memberof bazaar.v2.ServerMessage
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            ServerMessage.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/bazaar.v2.ServerMessage";
            };

            return ServerMessage;
        })();

        return v2;
    })();

    return bazaar;
})();

module.exports = $root;
