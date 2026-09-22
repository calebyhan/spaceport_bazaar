import * as $protobuf from "protobufjs";
import Long = require("long");

/** Namespace bazaar. */
export namespace bazaar {

    /** Namespace v2. */
    namespace v2 {

        /** Resource enum. */
        enum Resource {

            /** RESOURCE_WATER value */
            RESOURCE_WATER = 1,

            /** RESOURCE_FOOD value */
            RESOURCE_FOOD = 2,

            /** RESOURCE_COMPONENTS value */
            RESOURCE_COMPONENTS = 3
        }

        /** Phase enum. */
        enum Phase {

            /** PHASE_READY value */
            PHASE_READY = 1,

            /** PHASE_RUNNING value */
            PHASE_RUNNING = 2,

            /** PHASE_PAUSED value */
            PHASE_PAUSED = 3,

            /** PHASE_FINISHED value */
            PHASE_FINISHED = 4,

            /** PHASE_ABORTED value */
            PHASE_ABORTED = 5
        }

        /** OfferStatus enum. */
        enum OfferStatus {

            /** OFFER_STATUS_OPEN value */
            OFFER_STATUS_OPEN = 1,

            /** OFFER_STATUS_ACCEPTED value */
            OFFER_STATUS_ACCEPTED = 2,

            /** OFFER_STATUS_WITHDRAWN value */
            OFFER_STATUS_WITHDRAWN = 3,

            /** OFFER_STATUS_EXPIRED value */
            OFFER_STATUS_EXPIRED = 4,

            /** OFFER_STATUS_RUN_ENDED value */
            OFFER_STATUS_RUN_ENDED = 5
        }

        /** PublicationStatus enum. */
        enum PublicationStatus {

            /** PUBLICATION_STATUS_ACTIVE value */
            PUBLICATION_STATUS_ACTIVE = 1,

            /** PUBLICATION_STATUS_REPLACED value */
            PUBLICATION_STATUS_REPLACED = 2,

            /** PUBLICATION_STATUS_WITHDRAWN value */
            PUBLICATION_STATUS_WITHDRAWN = 3,

            /** PUBLICATION_STATUS_EXPIRED value */
            PUBLICATION_STATUS_EXPIRED = 4,

            /** PUBLICATION_STATUS_RUN_ENDED value */
            PUBLICATION_STATUS_RUN_ENDED = 5
        }

        /** ResultCode enum. */
        enum ResultCode {

            /** RESULT_CODE_OK value */
            RESULT_CODE_OK = 1,

            /** RESULT_CODE_REQUEST_ID_CONFLICT value */
            RESULT_CODE_REQUEST_ID_CONFLICT = 2,

            /** RESULT_CODE_RUN_NOT_RUNNING value */
            RESULT_CODE_RUN_NOT_RUNNING = 3,

            /** RESULT_CODE_RATE_LIMITED value */
            RESULT_CODE_RATE_LIMITED = 4,

            /** RESULT_CODE_INVALID_ARGUMENT value */
            RESULT_CODE_INVALID_ARGUMENT = 5,

            /** RESULT_CODE_NOT_FOUND value */
            RESULT_CODE_NOT_FOUND = 6,

            /** RESULT_CODE_EXPIRED value */
            RESULT_CODE_EXPIRED = 7,

            /** RESULT_CODE_NOT_OPEN value */
            RESULT_CODE_NOT_OPEN = 8,

            /** RESULT_CODE_LIMIT_REACHED value */
            RESULT_CODE_LIMIT_REACHED = 9,

            /** RESULT_CODE_INSUFFICIENT_RESOURCES value */
            RESULT_CODE_INSUFFICIENT_RESOURCES = 10,

            /** RESULT_CODE_STATION_FAILED value */
            RESULT_CODE_STATION_FAILED = 11
        }

        /** ControlCode enum. */
        enum ControlCode {

            /** CONTROL_CODE_BAD_MESSAGE value */
            CONTROL_CODE_BAD_MESSAGE = 1,

            /** CONTROL_CODE_REQUEST_CAPACITY_EXCEEDED value */
            CONTROL_CODE_REQUEST_CAPACITY_EXCEEDED = 2,

            /** CONTROL_CODE_UNSUPPORTED_VERSION value */
            CONTROL_CODE_UNSUPPORTED_VERSION = 3,

            /** CONTROL_CODE_RUN_MISMATCH value */
            CONTROL_CODE_RUN_MISMATCH = 4,

            /** CONTROL_CODE_INVALID_AUTHENTICATION value */
            CONTROL_CODE_INVALID_AUTHENTICATION = 5,

            /** CONTROL_CODE_SESSION_FENCED value */
            CONTROL_CODE_SESSION_FENCED = 6
        }

        /**
         * Properties of a Bundle.
         * @deprecated Use bazaar.v2.Bundle.$Properties instead.
         */
        interface IBundle extends bazaar.v2.Bundle.$Properties {
        }

        /** Represents a Bundle. */
        class Bundle {

            /**
             * Constructs a new Bundle.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.Bundle.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** Bundle water. */
            water: Long;

            /** Bundle food. */
            food: Long;

            /** Bundle components. */
            components: Long;

            /**
             * Creates a new Bundle instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Bundle instance
             */
            static create(properties: bazaar.v2.Bundle.$Shape): bazaar.v2.Bundle & bazaar.v2.Bundle.$Shape;
            static create(properties?: bazaar.v2.Bundle.$Properties): bazaar.v2.Bundle;

            /**
             * Encodes the specified Bundle message. Does not implicitly {@link bazaar.v2.Bundle.verify|verify} messages.
             * @param message Bundle message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.Bundle.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Bundle message, length delimited. Does not implicitly {@link bazaar.v2.Bundle.verify|verify} messages.
             * @param message Bundle message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.Bundle.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Bundle message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.Bundle & bazaar.v2.Bundle.$Shape} Bundle
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.Bundle & bazaar.v2.Bundle.$Shape;

            /**
             * Decodes a Bundle message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.Bundle & bazaar.v2.Bundle.$Shape} Bundle
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.Bundle & bazaar.v2.Bundle.$Shape;

            /**
             * Verifies a Bundle message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Bundle message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Bundle
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.Bundle;

            /**
             * Creates a plain object from a Bundle message. Also converts values to other types if specified.
             * @param message Bundle
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.Bundle, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Bundle to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for Bundle
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace Bundle {

            /** Properties of a Bundle. */
            interface $Properties {

                /** Bundle water */
                water: Long;

                /** Bundle food */
                food: Long;

                /** Bundle components */
                components: Long;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a Bundle. */
            type $Shape = bazaar.v2.Bundle.$Properties;
        }

        /**
         * Properties of a ListResource.
         * @deprecated Use bazaar.v2.ListResource.$Properties instead.
         */
        interface IListResource extends bazaar.v2.ListResource.$Properties {
        }

        /** Represents a ListResource. */
        class ListResource {

            /**
             * Constructs a new ListResource.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.ListResource.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** ListResource items. */
            items: bazaar.v2.Resource[];

            /**
             * Creates a new ListResource instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ListResource instance
             */
            static create(properties: bazaar.v2.ListResource.$Shape): bazaar.v2.ListResource & bazaar.v2.ListResource.$Shape;
            static create(properties?: bazaar.v2.ListResource.$Properties): bazaar.v2.ListResource;

            /**
             * Encodes the specified ListResource message. Does not implicitly {@link bazaar.v2.ListResource.verify|verify} messages.
             * @param message ListResource message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.ListResource.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ListResource message, length delimited. Does not implicitly {@link bazaar.v2.ListResource.verify|verify} messages.
             * @param message ListResource message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.ListResource.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ListResource message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.ListResource & bazaar.v2.ListResource.$Shape} ListResource
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.ListResource & bazaar.v2.ListResource.$Shape;

            /**
             * Decodes a ListResource message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.ListResource & bazaar.v2.ListResource.$Shape} ListResource
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.ListResource & bazaar.v2.ListResource.$Shape;

            /**
             * Verifies a ListResource message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ListResource message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ListResource
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.ListResource;

            /**
             * Creates a plain object from a ListResource message. Also converts values to other types if specified.
             * @param message ListResource
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.ListResource, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ListResource to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for ListResource
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace ListResource {

            /** Properties of a ListResource. */
            interface $Properties {

                /** ListResource items */
                items?: (bazaar.v2.Resource[]|null);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a ListResource. */
            type $Shape = bazaar.v2.ListResource.$Properties;
        }

        /**
         * Properties of an AdvertiseBody.
         * @deprecated Use bazaar.v2.AdvertiseBody.$Properties instead.
         */
        interface IAdvertiseBody extends bazaar.v2.AdvertiseBody.$Properties {
        }

        /** Represents an AdvertiseBody. */
        class AdvertiseBody {

            /**
             * Constructs a new AdvertiseBody.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.AdvertiseBody.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** AdvertiseBody selling. */
            selling: bazaar.v2.ListResource.$Properties;

            /** AdvertiseBody seeking. */
            seeking: bazaar.v2.ListResource.$Properties;

            /** AdvertiseBody expires_tick. */
            expires_tick: Long;

            /**
             * Creates a new AdvertiseBody instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AdvertiseBody instance
             */
            static create(properties: bazaar.v2.AdvertiseBody.$Shape): bazaar.v2.AdvertiseBody & bazaar.v2.AdvertiseBody.$Shape;
            static create(properties?: bazaar.v2.AdvertiseBody.$Properties): bazaar.v2.AdvertiseBody;

            /**
             * Encodes the specified AdvertiseBody message. Does not implicitly {@link bazaar.v2.AdvertiseBody.verify|verify} messages.
             * @param message AdvertiseBody message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.AdvertiseBody.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AdvertiseBody message, length delimited. Does not implicitly {@link bazaar.v2.AdvertiseBody.verify|verify} messages.
             * @param message AdvertiseBody message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.AdvertiseBody.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AdvertiseBody message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.AdvertiseBody & bazaar.v2.AdvertiseBody.$Shape} AdvertiseBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.AdvertiseBody & bazaar.v2.AdvertiseBody.$Shape;

            /**
             * Decodes an AdvertiseBody message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.AdvertiseBody & bazaar.v2.AdvertiseBody.$Shape} AdvertiseBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.AdvertiseBody & bazaar.v2.AdvertiseBody.$Shape;

            /**
             * Verifies an AdvertiseBody message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AdvertiseBody message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AdvertiseBody
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.AdvertiseBody;

            /**
             * Creates a plain object from an AdvertiseBody message. Also converts values to other types if specified.
             * @param message AdvertiseBody
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.AdvertiseBody, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AdvertiseBody to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for AdvertiseBody
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace AdvertiseBody {

            /** Properties of an AdvertiseBody. */
            interface $Properties {

                /** AdvertiseBody selling */
                selling: bazaar.v2.ListResource.$Properties;

                /** AdvertiseBody seeking */
                seeking: bazaar.v2.ListResource.$Properties;

                /** AdvertiseBody expires_tick */
                expires_tick: Long;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of an AdvertiseBody. */
            type $Shape = bazaar.v2.AdvertiseBody.$Properties;
        }

        /**
         * Properties of an OfferBody.
         * @deprecated Use bazaar.v2.OfferBody.$Properties instead.
         */
        interface IOfferBody extends bazaar.v2.OfferBody.$Properties {
        }

        /** Represents an OfferBody. */
        class OfferBody {

            /**
             * Constructs a new OfferBody.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.OfferBody.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** OfferBody recipient_id. */
            recipient_id: string;

            /** OfferBody give. */
            give: bazaar.v2.Bundle.$Properties;

            /** OfferBody receive. */
            receive: bazaar.v2.Bundle.$Properties;

            /** OfferBody expires_tick. */
            expires_tick: Long;

            /**
             * Creates a new OfferBody instance using the specified properties.
             * @param [properties] Properties to set
             * @returns OfferBody instance
             */
            static create(properties: bazaar.v2.OfferBody.$Shape): bazaar.v2.OfferBody & bazaar.v2.OfferBody.$Shape;
            static create(properties?: bazaar.v2.OfferBody.$Properties): bazaar.v2.OfferBody;

            /**
             * Encodes the specified OfferBody message. Does not implicitly {@link bazaar.v2.OfferBody.verify|verify} messages.
             * @param message OfferBody message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.OfferBody.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified OfferBody message, length delimited. Does not implicitly {@link bazaar.v2.OfferBody.verify|verify} messages.
             * @param message OfferBody message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.OfferBody.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an OfferBody message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.OfferBody & bazaar.v2.OfferBody.$Shape} OfferBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.OfferBody & bazaar.v2.OfferBody.$Shape;

            /**
             * Decodes an OfferBody message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.OfferBody & bazaar.v2.OfferBody.$Shape} OfferBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.OfferBody & bazaar.v2.OfferBody.$Shape;

            /**
             * Verifies an OfferBody message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an OfferBody message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns OfferBody
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.OfferBody;

            /**
             * Creates a plain object from an OfferBody message. Also converts values to other types if specified.
             * @param message OfferBody
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.OfferBody, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this OfferBody to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for OfferBody
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace OfferBody {

            /** Properties of an OfferBody. */
            interface $Properties {

                /** OfferBody recipient_id */
                recipient_id: string;

                /** OfferBody give */
                give: bazaar.v2.Bundle.$Properties;

                /** OfferBody receive */
                receive: bazaar.v2.Bundle.$Properties;

                /** OfferBody expires_tick */
                expires_tick: Long;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of an OfferBody. */
            type $Shape = bazaar.v2.OfferBody.$Properties;
        }

        /**
         * Properties of an AcceptBody.
         * @deprecated Use bazaar.v2.AcceptBody.$Properties instead.
         */
        interface IAcceptBody extends bazaar.v2.AcceptBody.$Properties {
        }

        /** Represents an AcceptBody. */
        class AcceptBody {

            /**
             * Constructs a new AcceptBody.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.AcceptBody.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** AcceptBody offer_id. */
            offer_id: string;

            /**
             * Creates a new AcceptBody instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AcceptBody instance
             */
            static create(properties: bazaar.v2.AcceptBody.$Shape): bazaar.v2.AcceptBody & bazaar.v2.AcceptBody.$Shape;
            static create(properties?: bazaar.v2.AcceptBody.$Properties): bazaar.v2.AcceptBody;

            /**
             * Encodes the specified AcceptBody message. Does not implicitly {@link bazaar.v2.AcceptBody.verify|verify} messages.
             * @param message AcceptBody message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.AcceptBody.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AcceptBody message, length delimited. Does not implicitly {@link bazaar.v2.AcceptBody.verify|verify} messages.
             * @param message AcceptBody message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.AcceptBody.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AcceptBody message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.AcceptBody & bazaar.v2.AcceptBody.$Shape} AcceptBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.AcceptBody & bazaar.v2.AcceptBody.$Shape;

            /**
             * Decodes an AcceptBody message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.AcceptBody & bazaar.v2.AcceptBody.$Shape} AcceptBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.AcceptBody & bazaar.v2.AcceptBody.$Shape;

            /**
             * Verifies an AcceptBody message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AcceptBody message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AcceptBody
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.AcceptBody;

            /**
             * Creates a plain object from an AcceptBody message. Also converts values to other types if specified.
             * @param message AcceptBody
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.AcceptBody, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AcceptBody to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for AcceptBody
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace AcceptBody {

            /** Properties of an AcceptBody. */
            interface $Properties {

                /** AcceptBody offer_id */
                offer_id: string;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of an AcceptBody. */
            type $Shape = bazaar.v2.AcceptBody.$Properties;
        }

        /**
         * Properties of a WithdrawBody.
         * @deprecated Use bazaar.v2.WithdrawBody.$Properties instead.
         */
        interface IWithdrawBody extends bazaar.v2.WithdrawBody.$Properties {
        }

        /** Represents a WithdrawBody. */
        class WithdrawBody {

            /**
             * Constructs a new WithdrawBody.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.WithdrawBody.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** WithdrawBody object_id. */
            object_id: string;

            /**
             * Creates a new WithdrawBody instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WithdrawBody instance
             */
            static create(properties: bazaar.v2.WithdrawBody.$Shape): bazaar.v2.WithdrawBody & bazaar.v2.WithdrawBody.$Shape;
            static create(properties?: bazaar.v2.WithdrawBody.$Properties): bazaar.v2.WithdrawBody;

            /**
             * Encodes the specified WithdrawBody message. Does not implicitly {@link bazaar.v2.WithdrawBody.verify|verify} messages.
             * @param message WithdrawBody message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.WithdrawBody.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WithdrawBody message, length delimited. Does not implicitly {@link bazaar.v2.WithdrawBody.verify|verify} messages.
             * @param message WithdrawBody message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.WithdrawBody.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WithdrawBody message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.WithdrawBody & bazaar.v2.WithdrawBody.$Shape} WithdrawBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.WithdrawBody & bazaar.v2.WithdrawBody.$Shape;

            /**
             * Decodes a WithdrawBody message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.WithdrawBody & bazaar.v2.WithdrawBody.$Shape} WithdrawBody
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.WithdrawBody & bazaar.v2.WithdrawBody.$Shape;

            /**
             * Verifies a WithdrawBody message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WithdrawBody message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WithdrawBody
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.WithdrawBody;

            /**
             * Creates a plain object from a WithdrawBody message. Also converts values to other types if specified.
             * @param message WithdrawBody
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.WithdrawBody, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WithdrawBody to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for WithdrawBody
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace WithdrawBody {

            /** Properties of a WithdrawBody. */
            interface $Properties {

                /** WithdrawBody object_id */
                object_id: string;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a WithdrawBody. */
            type $Shape = bazaar.v2.WithdrawBody.$Properties;
        }

        /** AdvertiseType enum. */
        enum AdvertiseType {

            /** ADVERTISE_TYPE_ADVERTISE value */
            ADVERTISE_TYPE_ADVERTISE = 1
        }

        /**
         * Properties of an Advertise.
         * @deprecated Use bazaar.v2.Advertise.$Properties instead.
         */
        interface IAdvertise extends bazaar.v2.Advertise.$Properties {
        }

        /** Represents an Advertise. */
        class Advertise {

            /**
             * Constructs a new Advertise.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.Advertise.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** Advertise type. */
            type: bazaar.v2.AdvertiseType;

            /** Advertise protocol_version. */
            protocol_version: string;

            /** Advertise run_id. */
            run_id: string;

            /** Advertise request_id. */
            request_id: string;

            /** Advertise body. */
            body: bazaar.v2.AdvertiseBody.$Properties;

            /**
             * Creates a new Advertise instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Advertise instance
             */
            static create(properties: bazaar.v2.Advertise.$Shape): bazaar.v2.Advertise & bazaar.v2.Advertise.$Shape;
            static create(properties?: bazaar.v2.Advertise.$Properties): bazaar.v2.Advertise;

            /**
             * Encodes the specified Advertise message. Does not implicitly {@link bazaar.v2.Advertise.verify|verify} messages.
             * @param message Advertise message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.Advertise.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Advertise message, length delimited. Does not implicitly {@link bazaar.v2.Advertise.verify|verify} messages.
             * @param message Advertise message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.Advertise.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Advertise message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.Advertise & bazaar.v2.Advertise.$Shape} Advertise
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.Advertise & bazaar.v2.Advertise.$Shape;

            /**
             * Decodes an Advertise message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.Advertise & bazaar.v2.Advertise.$Shape} Advertise
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.Advertise & bazaar.v2.Advertise.$Shape;

            /**
             * Verifies an Advertise message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Advertise message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Advertise
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.Advertise;

            /**
             * Creates a plain object from an Advertise message. Also converts values to other types if specified.
             * @param message Advertise
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.Advertise, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Advertise to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for Advertise
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace Advertise {

            /** Properties of an Advertise. */
            interface $Properties {

                /** Advertise type */
                type: bazaar.v2.AdvertiseType;

                /** Advertise protocol_version */
                protocol_version: string;

                /** Advertise run_id */
                run_id: string;

                /** Advertise request_id */
                request_id: string;

                /** Advertise body */
                body: bazaar.v2.AdvertiseBody.$Properties;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of an Advertise. */
            type $Shape = bazaar.v2.Advertise.$Properties;
        }

        /** OfferCommandType enum. */
        enum OfferCommandType {

            /** OFFER_COMMAND_TYPE_OFFER value */
            OFFER_COMMAND_TYPE_OFFER = 1
        }

        /**
         * Properties of an OfferCommand.
         * @deprecated Use bazaar.v2.OfferCommand.$Properties instead.
         */
        interface IOfferCommand extends bazaar.v2.OfferCommand.$Properties {
        }

        /** Represents an OfferCommand. */
        class OfferCommand {

            /**
             * Constructs a new OfferCommand.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.OfferCommand.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** OfferCommand type. */
            type: bazaar.v2.OfferCommandType;

            /** OfferCommand protocol_version. */
            protocol_version: string;

            /** OfferCommand run_id. */
            run_id: string;

            /** OfferCommand request_id. */
            request_id: string;

            /** OfferCommand body. */
            body: bazaar.v2.OfferBody.$Properties;

            /**
             * Creates a new OfferCommand instance using the specified properties.
             * @param [properties] Properties to set
             * @returns OfferCommand instance
             */
            static create(properties: bazaar.v2.OfferCommand.$Shape): bazaar.v2.OfferCommand & bazaar.v2.OfferCommand.$Shape;
            static create(properties?: bazaar.v2.OfferCommand.$Properties): bazaar.v2.OfferCommand;

            /**
             * Encodes the specified OfferCommand message. Does not implicitly {@link bazaar.v2.OfferCommand.verify|verify} messages.
             * @param message OfferCommand message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.OfferCommand.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified OfferCommand message, length delimited. Does not implicitly {@link bazaar.v2.OfferCommand.verify|verify} messages.
             * @param message OfferCommand message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.OfferCommand.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an OfferCommand message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.OfferCommand & bazaar.v2.OfferCommand.$Shape} OfferCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.OfferCommand & bazaar.v2.OfferCommand.$Shape;

            /**
             * Decodes an OfferCommand message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.OfferCommand & bazaar.v2.OfferCommand.$Shape} OfferCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.OfferCommand & bazaar.v2.OfferCommand.$Shape;

            /**
             * Verifies an OfferCommand message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an OfferCommand message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns OfferCommand
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.OfferCommand;

            /**
             * Creates a plain object from an OfferCommand message. Also converts values to other types if specified.
             * @param message OfferCommand
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.OfferCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this OfferCommand to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for OfferCommand
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace OfferCommand {

            /** Properties of an OfferCommand. */
            interface $Properties {

                /** OfferCommand type */
                type: bazaar.v2.OfferCommandType;

                /** OfferCommand protocol_version */
                protocol_version: string;

                /** OfferCommand run_id */
                run_id: string;

                /** OfferCommand request_id */
                request_id: string;

                /** OfferCommand body */
                body: bazaar.v2.OfferBody.$Properties;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of an OfferCommand. */
            type $Shape = bazaar.v2.OfferCommand.$Properties;
        }

        /** AcceptType enum. */
        enum AcceptType {

            /** ACCEPT_TYPE_ACCEPT value */
            ACCEPT_TYPE_ACCEPT = 1
        }

        /**
         * Properties of an Accept.
         * @deprecated Use bazaar.v2.Accept.$Properties instead.
         */
        interface IAccept extends bazaar.v2.Accept.$Properties {
        }

        /** Represents an Accept. */
        class Accept {

            /**
             * Constructs a new Accept.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.Accept.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** Accept type. */
            type: bazaar.v2.AcceptType;

            /** Accept protocol_version. */
            protocol_version: string;

            /** Accept run_id. */
            run_id: string;

            /** Accept request_id. */
            request_id: string;

            /** Accept body. */
            body: bazaar.v2.AcceptBody.$Properties;

            /**
             * Creates a new Accept instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Accept instance
             */
            static create(properties: bazaar.v2.Accept.$Shape): bazaar.v2.Accept & bazaar.v2.Accept.$Shape;
            static create(properties?: bazaar.v2.Accept.$Properties): bazaar.v2.Accept;

            /**
             * Encodes the specified Accept message. Does not implicitly {@link bazaar.v2.Accept.verify|verify} messages.
             * @param message Accept message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.Accept.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Accept message, length delimited. Does not implicitly {@link bazaar.v2.Accept.verify|verify} messages.
             * @param message Accept message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.Accept.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Accept message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.Accept & bazaar.v2.Accept.$Shape} Accept
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.Accept & bazaar.v2.Accept.$Shape;

            /**
             * Decodes an Accept message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.Accept & bazaar.v2.Accept.$Shape} Accept
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.Accept & bazaar.v2.Accept.$Shape;

            /**
             * Verifies an Accept message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Accept message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Accept
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.Accept;

            /**
             * Creates a plain object from an Accept message. Also converts values to other types if specified.
             * @param message Accept
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.Accept, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Accept to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for Accept
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace Accept {

            /** Properties of an Accept. */
            interface $Properties {

                /** Accept type */
                type: bazaar.v2.AcceptType;

                /** Accept protocol_version */
                protocol_version: string;

                /** Accept run_id */
                run_id: string;

                /** Accept request_id */
                request_id: string;

                /** Accept body */
                body: bazaar.v2.AcceptBody.$Properties;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of an Accept. */
            type $Shape = bazaar.v2.Accept.$Properties;
        }

        /** WithdrawType enum. */
        enum WithdrawType {

            /** WITHDRAW_TYPE_WITHDRAW value */
            WITHDRAW_TYPE_WITHDRAW = 1
        }

        /**
         * Properties of a Withdraw.
         * @deprecated Use bazaar.v2.Withdraw.$Properties instead.
         */
        interface IWithdraw extends bazaar.v2.Withdraw.$Properties {
        }

        /** Represents a Withdraw. */
        class Withdraw {

            /**
             * Constructs a new Withdraw.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.Withdraw.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** Withdraw type. */
            type: bazaar.v2.WithdrawType;

            /** Withdraw protocol_version. */
            protocol_version: string;

            /** Withdraw run_id. */
            run_id: string;

            /** Withdraw request_id. */
            request_id: string;

            /** Withdraw body. */
            body: bazaar.v2.WithdrawBody.$Properties;

            /**
             * Creates a new Withdraw instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Withdraw instance
             */
            static create(properties: bazaar.v2.Withdraw.$Shape): bazaar.v2.Withdraw & bazaar.v2.Withdraw.$Shape;
            static create(properties?: bazaar.v2.Withdraw.$Properties): bazaar.v2.Withdraw;

            /**
             * Encodes the specified Withdraw message. Does not implicitly {@link bazaar.v2.Withdraw.verify|verify} messages.
             * @param message Withdraw message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.Withdraw.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Withdraw message, length delimited. Does not implicitly {@link bazaar.v2.Withdraw.verify|verify} messages.
             * @param message Withdraw message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.Withdraw.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Withdraw message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.Withdraw & bazaar.v2.Withdraw.$Shape} Withdraw
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.Withdraw & bazaar.v2.Withdraw.$Shape;

            /**
             * Decodes a Withdraw message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.Withdraw & bazaar.v2.Withdraw.$Shape} Withdraw
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.Withdraw & bazaar.v2.Withdraw.$Shape;

            /**
             * Verifies a Withdraw message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Withdraw message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Withdraw
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.Withdraw;

            /**
             * Creates a plain object from a Withdraw message. Also converts values to other types if specified.
             * @param message Withdraw
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.Withdraw, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Withdraw to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for Withdraw
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace Withdraw {

            /** Properties of a Withdraw. */
            interface $Properties {

                /** Withdraw type */
                type: bazaar.v2.WithdrawType;

                /** Withdraw protocol_version */
                protocol_version: string;

                /** Withdraw run_id */
                run_id: string;

                /** Withdraw request_id */
                request_id: string;

                /** Withdraw body */
                body: bazaar.v2.WithdrawBody.$Properties;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a Withdraw. */
            type $Shape = bazaar.v2.Withdraw.$Properties;
        }

        /** SyncType enum. */
        enum SyncType {

            /** SYNC_TYPE_SYNC value */
            SYNC_TYPE_SYNC = 1
        }

        /**
         * Properties of a Sync.
         * @deprecated Use bazaar.v2.Sync.$Properties instead.
         */
        interface ISync extends bazaar.v2.Sync.$Properties {
        }

        /** Represents a Sync. */
        class Sync {

            /**
             * Constructs a new Sync.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.Sync.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** Sync type. */
            type: bazaar.v2.SyncType;

            /** Sync protocol_version. */
            protocol_version: string;

            /** Sync run_id. */
            run_id: string;

            /**
             * Creates a new Sync instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Sync instance
             */
            static create(properties: bazaar.v2.Sync.$Shape): bazaar.v2.Sync & bazaar.v2.Sync.$Shape;
            static create(properties?: bazaar.v2.Sync.$Properties): bazaar.v2.Sync;

            /**
             * Encodes the specified Sync message. Does not implicitly {@link bazaar.v2.Sync.verify|verify} messages.
             * @param message Sync message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.Sync.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Sync message, length delimited. Does not implicitly {@link bazaar.v2.Sync.verify|verify} messages.
             * @param message Sync message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.Sync.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Sync message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.Sync & bazaar.v2.Sync.$Shape} Sync
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.Sync & bazaar.v2.Sync.$Shape;

            /**
             * Decodes a Sync message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.Sync & bazaar.v2.Sync.$Shape} Sync
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.Sync & bazaar.v2.Sync.$Shape;

            /**
             * Verifies a Sync message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Sync message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Sync
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.Sync;

            /**
             * Creates a plain object from a Sync message. Also converts values to other types if specified.
             * @param message Sync
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.Sync, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Sync to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for Sync
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace Sync {

            /** Properties of a Sync. */
            interface $Properties {

                /** Sync type */
                type: bazaar.v2.SyncType;

                /** Sync protocol_version */
                protocol_version: string;

                /** Sync run_id */
                run_id: string;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a Sync. */
            type $Shape = bazaar.v2.Sync.$Properties;
        }

        /** ReadyType enum. */
        enum ReadyType {

            /** READY_TYPE_READY value */
            READY_TYPE_READY = 1
        }

        /**
         * Properties of a Ready.
         * @deprecated Use bazaar.v2.Ready.$Properties instead.
         */
        interface IReady extends bazaar.v2.Ready.$Properties {
        }

        /** Represents a Ready. */
        class Ready {

            /**
             * Constructs a new Ready.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.Ready.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** Ready type. */
            type: bazaar.v2.ReadyType;

            /** Ready protocol_version. */
            protocol_version: string;

            /** Ready run_id. */
            run_id: string;

            /** Ready ready. */
            ready: boolean;

            /** Ready snapshot_sequence. */
            snapshot_sequence: Long;

            /**
             * Creates a new Ready instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Ready instance
             */
            static create(properties: bazaar.v2.Ready.$Shape): bazaar.v2.Ready & bazaar.v2.Ready.$Shape;
            static create(properties?: bazaar.v2.Ready.$Properties): bazaar.v2.Ready;

            /**
             * Encodes the specified Ready message. Does not implicitly {@link bazaar.v2.Ready.verify|verify} messages.
             * @param message Ready message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.Ready.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Ready message, length delimited. Does not implicitly {@link bazaar.v2.Ready.verify|verify} messages.
             * @param message Ready message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.Ready.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Ready message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.Ready & bazaar.v2.Ready.$Shape} Ready
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.Ready & bazaar.v2.Ready.$Shape;

            /**
             * Decodes a Ready message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.Ready & bazaar.v2.Ready.$Shape} Ready
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.Ready & bazaar.v2.Ready.$Shape;

            /**
             * Verifies a Ready message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Ready message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Ready
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.Ready;

            /**
             * Creates a plain object from a Ready message. Also converts values to other types if specified.
             * @param message Ready
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.Ready, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Ready to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for Ready
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace Ready {

            /** Properties of a Ready. */
            interface $Properties {

                /** Ready type */
                type: bazaar.v2.ReadyType;

                /** Ready protocol_version */
                protocol_version: string;

                /** Ready run_id */
                run_id: string;

                /** Ready ready */
                ready: boolean;

                /** Ready snapshot_sequence */
                snapshot_sequence: Long;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a Ready. */
            type $Shape = bazaar.v2.Ready.$Properties;
        }

        /** ResultType enum. */
        enum ResultType {

            /** RESULT_TYPE_RESULT value */
            RESULT_TYPE_RESULT = 1
        }

        /**
         * Properties of a NullableString.
         * @deprecated Use bazaar.v2.NullableString.$Properties instead.
         */
        interface INullableString extends bazaar.v2.NullableString.$Properties {
        }

        /** Represents a NullableString. */
        class NullableString {

            /**
             * Constructs a new NullableString.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.NullableString.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** NullableString null. */
            null?: (boolean|null);

            /** NullableString value. */
            value?: (string|null);

            /** NullableString kind. */
            kind?: ("null"|"value");

            /**
             * Creates a new NullableString instance using the specified properties.
             * @param [properties] Properties to set
             * @returns NullableString instance
             */
            static create(properties: bazaar.v2.NullableString.$Shape): bazaar.v2.NullableString & bazaar.v2.NullableString.$Shape;
            static create(properties?: bazaar.v2.NullableString.$Properties): bazaar.v2.NullableString;

            /**
             * Encodes the specified NullableString message. Does not implicitly {@link bazaar.v2.NullableString.verify|verify} messages.
             * @param message NullableString message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.NullableString.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified NullableString message, length delimited. Does not implicitly {@link bazaar.v2.NullableString.verify|verify} messages.
             * @param message NullableString message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.NullableString.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a NullableString message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.NullableString & bazaar.v2.NullableString.$Shape} NullableString
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.NullableString & bazaar.v2.NullableString.$Shape;

            /**
             * Decodes a NullableString message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.NullableString & bazaar.v2.NullableString.$Shape} NullableString
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.NullableString & bazaar.v2.NullableString.$Shape;

            /**
             * Verifies a NullableString message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a NullableString message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns NullableString
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.NullableString;

            /**
             * Creates a plain object from a NullableString message. Also converts values to other types if specified.
             * @param message NullableString
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.NullableString, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this NullableString to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for NullableString
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace NullableString {

            /** Properties of a NullableString. */
            interface $Properties {

                /** NullableString null */
                "null"?: (boolean|null);

                /** NullableString value */
                value?: (string|null);

                /** NullableString kind */
                kind?: ("null"|"value");

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Narrowed shape of a NullableString. */
            type $Shape = {
              "null"?: boolean|null;
              value?: string|null;
              $unknowns?: Uint8Array[];
            } & (
              ({ kind?: undefined; "null"?: null; value?: null }|{ kind?: "null"; "null": boolean; value?: null }|{ kind?: "value"; "null"?: null; value: string })
            );
        }

        /**
         * Properties of a NullableUint.
         * @deprecated Use bazaar.v2.NullableUint.$Properties instead.
         */
        interface INullableUint extends bazaar.v2.NullableUint.$Properties {
        }

        /** Represents a NullableUint. */
        class NullableUint {

            /**
             * Constructs a new NullableUint.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.NullableUint.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** NullableUint null. */
            null?: (boolean|null);

            /** NullableUint value. */
            value?: (Long|null);

            /** NullableUint kind. */
            kind?: ("null"|"value");

            /**
             * Creates a new NullableUint instance using the specified properties.
             * @param [properties] Properties to set
             * @returns NullableUint instance
             */
            static create(properties: bazaar.v2.NullableUint.$Shape): bazaar.v2.NullableUint & bazaar.v2.NullableUint.$Shape;
            static create(properties?: bazaar.v2.NullableUint.$Properties): bazaar.v2.NullableUint;

            /**
             * Encodes the specified NullableUint message. Does not implicitly {@link bazaar.v2.NullableUint.verify|verify} messages.
             * @param message NullableUint message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.NullableUint.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified NullableUint message, length delimited. Does not implicitly {@link bazaar.v2.NullableUint.verify|verify} messages.
             * @param message NullableUint message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.NullableUint.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a NullableUint message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.NullableUint & bazaar.v2.NullableUint.$Shape} NullableUint
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.NullableUint & bazaar.v2.NullableUint.$Shape;

            /**
             * Decodes a NullableUint message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.NullableUint & bazaar.v2.NullableUint.$Shape} NullableUint
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.NullableUint & bazaar.v2.NullableUint.$Shape;

            /**
             * Verifies a NullableUint message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a NullableUint message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns NullableUint
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.NullableUint;

            /**
             * Creates a plain object from a NullableUint message. Also converts values to other types if specified.
             * @param message NullableUint
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.NullableUint, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this NullableUint to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for NullableUint
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace NullableUint {

            /** Properties of a NullableUint. */
            interface $Properties {

                /** NullableUint null */
                "null"?: (boolean|null);

                /** NullableUint value */
                value?: (Long|null);

                /** NullableUint kind */
                kind?: ("null"|"value");

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Narrowed shape of a NullableUint. */
            type $Shape = {
              "null"?: boolean|null;
              value?: Long|null;
              $unknowns?: Uint8Array[];
            } & (
              ({ kind?: undefined; "null"?: null; value?: null }|{ kind?: "null"; "null": boolean; value?: null }|{ kind?: "value"; "null"?: null; value: Long })
            );
        }

        /**
         * Properties of a Result.
         * @deprecated Use bazaar.v2.Result.$Properties instead.
         */
        interface IResult extends bazaar.v2.Result.$Properties {
        }

        /** Represents a Result. */
        class Result {

            /**
             * Constructs a new Result.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.Result.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** Result type. */
            type: bazaar.v2.ResultType;

            /** Result protocol_version. */
            protocol_version: string;

            /** Result run_id. */
            run_id: string;

            /** Result request_id. */
            request_id: string;

            /** Result ok. */
            ok: boolean;

            /** Result code. */
            code: bazaar.v2.ResultCode;

            /** Result processed_tick. */
            processed_tick: Long;

            /** Result processed_version. */
            processed_version: Long;

            /** Result object_id. */
            object_id: bazaar.v2.NullableString.$Properties;

            /** Result transaction_id. */
            transaction_id: bazaar.v2.NullableString.$Properties;

            /** Result retry_after_tick. */
            retry_after_tick: bazaar.v2.NullableUint.$Properties;

            /**
             * Creates a new Result instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Result instance
             */
            static create(properties: bazaar.v2.Result.$Shape): bazaar.v2.Result & bazaar.v2.Result.$Shape;
            static create(properties?: bazaar.v2.Result.$Properties): bazaar.v2.Result;

            /**
             * Encodes the specified Result message. Does not implicitly {@link bazaar.v2.Result.verify|verify} messages.
             * @param message Result message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.Result.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Result message, length delimited. Does not implicitly {@link bazaar.v2.Result.verify|verify} messages.
             * @param message Result message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.Result.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Result message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.Result & bazaar.v2.Result.$Shape} Result
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.Result & bazaar.v2.Result.$Shape;

            /**
             * Decodes a Result message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.Result & bazaar.v2.Result.$Shape} Result
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.Result & bazaar.v2.Result.$Shape;

            /**
             * Verifies a Result message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Result message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Result
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.Result;

            /**
             * Creates a plain object from a Result message. Also converts values to other types if specified.
             * @param message Result
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.Result, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Result to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for Result
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace Result {

            /** Properties of a Result. */
            interface $Properties {

                /** Result type */
                type: bazaar.v2.ResultType;

                /** Result protocol_version */
                protocol_version: string;

                /** Result run_id */
                run_id: string;

                /** Result request_id */
                request_id: string;

                /** Result ok */
                ok: boolean;

                /** Result code */
                code: bazaar.v2.ResultCode;

                /** Result processed_tick */
                processed_tick: Long;

                /** Result processed_version */
                processed_version: Long;

                /** Result object_id */
                object_id: bazaar.v2.NullableString.$Properties;

                /** Result transaction_id */
                transaction_id: bazaar.v2.NullableString.$Properties;

                /** Result retry_after_tick */
                retry_after_tick: bazaar.v2.NullableUint.$Properties;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a Result. */
            type $Shape = {
              type: bazaar.v2.ResultType;
              protocol_version: string;
              run_id: string;
              request_id: string;
              ok: boolean;
              code: bazaar.v2.ResultCode;
              processed_tick: Long;
              processed_version: Long;
              object_id: bazaar.v2.NullableString.$Shape;
              transaction_id: bazaar.v2.NullableString.$Shape;
              retry_after_tick: bazaar.v2.NullableUint.$Shape;
              $unknowns?: Uint8Array[];
            };
        }

        /** ProtocolErrorType enum. */
        enum ProtocolErrorType {

            /** PROTOCOL_ERROR_TYPE_PROTOCOL_ERROR value */
            PROTOCOL_ERROR_TYPE_PROTOCOL_ERROR = 1
        }

        /**
         * Properties of a ProtocolError.
         * @deprecated Use bazaar.v2.ProtocolError.$Properties instead.
         */
        interface IProtocolError extends bazaar.v2.ProtocolError.$Properties {
        }

        /** Represents a ProtocolError. */
        class ProtocolError {

            /**
             * Constructs a new ProtocolError.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.ProtocolError.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** ProtocolError type. */
            type: bazaar.v2.ProtocolErrorType;

            /** ProtocolError protocol_version. */
            protocol_version: string;

            /** ProtocolError run_id. */
            run_id: bazaar.v2.NullableString.$Properties;

            /** ProtocolError request_id. */
            request_id: bazaar.v2.NullableString.$Properties;

            /** ProtocolError code. */
            code: bazaar.v2.ControlCode;

            /** ProtocolError close_session. */
            close_session: boolean;

            /**
             * Creates a new ProtocolError instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ProtocolError instance
             */
            static create(properties: bazaar.v2.ProtocolError.$Shape): bazaar.v2.ProtocolError & bazaar.v2.ProtocolError.$Shape;
            static create(properties?: bazaar.v2.ProtocolError.$Properties): bazaar.v2.ProtocolError;

            /**
             * Encodes the specified ProtocolError message. Does not implicitly {@link bazaar.v2.ProtocolError.verify|verify} messages.
             * @param message ProtocolError message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.ProtocolError.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ProtocolError message, length delimited. Does not implicitly {@link bazaar.v2.ProtocolError.verify|verify} messages.
             * @param message ProtocolError message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.ProtocolError.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ProtocolError message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.ProtocolError & bazaar.v2.ProtocolError.$Shape} ProtocolError
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.ProtocolError & bazaar.v2.ProtocolError.$Shape;

            /**
             * Decodes a ProtocolError message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.ProtocolError & bazaar.v2.ProtocolError.$Shape} ProtocolError
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.ProtocolError & bazaar.v2.ProtocolError.$Shape;

            /**
             * Verifies a ProtocolError message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ProtocolError message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ProtocolError
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.ProtocolError;

            /**
             * Creates a plain object from a ProtocolError message. Also converts values to other types if specified.
             * @param message ProtocolError
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.ProtocolError, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ProtocolError to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for ProtocolError
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace ProtocolError {

            /** Properties of a ProtocolError. */
            interface $Properties {

                /** ProtocolError type */
                type: bazaar.v2.ProtocolErrorType;

                /** ProtocolError protocol_version */
                protocol_version: string;

                /** ProtocolError run_id */
                run_id: bazaar.v2.NullableString.$Properties;

                /** ProtocolError request_id */
                request_id: bazaar.v2.NullableString.$Properties;

                /** ProtocolError code */
                code: bazaar.v2.ControlCode;

                /** ProtocolError close_session */
                close_session: boolean;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a ProtocolError. */
            type $Shape = {
              type: bazaar.v2.ProtocolErrorType;
              protocol_version: string;
              run_id: bazaar.v2.NullableString.$Shape;
              request_id: bazaar.v2.NullableString.$Shape;
              code: bazaar.v2.ControlCode;
              close_session: boolean;
              $unknowns?: Uint8Array[];
            };
        }

        /**
         * Properties of an Offer.
         * @deprecated Use bazaar.v2.Offer.$Properties instead.
         */
        interface IOffer extends bazaar.v2.Offer.$Properties {
        }

        /** Represents an Offer. */
        class Offer {

            /**
             * Constructs a new Offer.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.Offer.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** Offer offer_id. */
            offer_id: string;

            /** Offer proposer_id. */
            proposer_id: string;

            /** Offer recipient_id. */
            recipient_id: string;

            /** Offer give. */
            give: bazaar.v2.Bundle.$Properties;

            /** Offer receive. */
            receive: bazaar.v2.Bundle.$Properties;

            /** Offer created_tick. */
            created_tick: Long;

            /** Offer created_version. */
            created_version: Long;

            /** Offer expires_tick. */
            expires_tick: Long;

            /** Offer status. */
            status: bazaar.v2.OfferStatus;

            /** Offer closed_tick. */
            closed_tick: bazaar.v2.NullableUint.$Properties;

            /** Offer transaction_id. */
            transaction_id: bazaar.v2.NullableString.$Properties;

            /**
             * Creates a new Offer instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Offer instance
             */
            static create(properties: bazaar.v2.Offer.$Shape): bazaar.v2.Offer & bazaar.v2.Offer.$Shape;
            static create(properties?: bazaar.v2.Offer.$Properties): bazaar.v2.Offer;

            /**
             * Encodes the specified Offer message. Does not implicitly {@link bazaar.v2.Offer.verify|verify} messages.
             * @param message Offer message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.Offer.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Offer message, length delimited. Does not implicitly {@link bazaar.v2.Offer.verify|verify} messages.
             * @param message Offer message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.Offer.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Offer message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.Offer & bazaar.v2.Offer.$Shape} Offer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.Offer & bazaar.v2.Offer.$Shape;

            /**
             * Decodes an Offer message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.Offer & bazaar.v2.Offer.$Shape} Offer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.Offer & bazaar.v2.Offer.$Shape;

            /**
             * Verifies an Offer message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Offer message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Offer
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.Offer;

            /**
             * Creates a plain object from an Offer message. Also converts values to other types if specified.
             * @param message Offer
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.Offer, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Offer to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for Offer
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace Offer {

            /** Properties of an Offer. */
            interface $Properties {

                /** Offer offer_id */
                offer_id: string;

                /** Offer proposer_id */
                proposer_id: string;

                /** Offer recipient_id */
                recipient_id: string;

                /** Offer give */
                give: bazaar.v2.Bundle.$Properties;

                /** Offer receive */
                receive: bazaar.v2.Bundle.$Properties;

                /** Offer created_tick */
                created_tick: Long;

                /** Offer created_version */
                created_version: Long;

                /** Offer expires_tick */
                expires_tick: Long;

                /** Offer status */
                status: bazaar.v2.OfferStatus;

                /** Offer closed_tick */
                closed_tick: bazaar.v2.NullableUint.$Properties;

                /** Offer transaction_id */
                transaction_id: bazaar.v2.NullableString.$Properties;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of an Offer. */
            type $Shape = {
              offer_id: string;
              proposer_id: string;
              recipient_id: string;
              give: bazaar.v2.Bundle.$Shape;
              receive: bazaar.v2.Bundle.$Shape;
              created_tick: Long;
              created_version: Long;
              expires_tick: Long;
              status: bazaar.v2.OfferStatus;
              closed_tick: bazaar.v2.NullableUint.$Shape;
              transaction_id: bazaar.v2.NullableString.$Shape;
              $unknowns?: Uint8Array[];
            };
        }

        /**
         * Properties of a Transaction.
         * @deprecated Use bazaar.v2.Transaction.$Properties instead.
         */
        interface ITransaction extends bazaar.v2.Transaction.$Properties {
        }

        /** Represents a Transaction. */
        class Transaction {

            /**
             * Constructs a new Transaction.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.Transaction.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** Transaction transaction_id. */
            transaction_id: string;

            /** Transaction offer_id. */
            offer_id: string;

            /** Transaction proposer_id. */
            proposer_id: string;

            /** Transaction recipient_id. */
            recipient_id: string;

            /** Transaction give. */
            give: bazaar.v2.Bundle.$Properties;

            /** Transaction receive. */
            receive: bazaar.v2.Bundle.$Properties;

            /** Transaction settled_tick. */
            settled_tick: Long;

            /** Transaction settled_version. */
            settled_version: Long;

            /**
             * Creates a new Transaction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Transaction instance
             */
            static create(properties: bazaar.v2.Transaction.$Shape): bazaar.v2.Transaction & bazaar.v2.Transaction.$Shape;
            static create(properties?: bazaar.v2.Transaction.$Properties): bazaar.v2.Transaction;

            /**
             * Encodes the specified Transaction message. Does not implicitly {@link bazaar.v2.Transaction.verify|verify} messages.
             * @param message Transaction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.Transaction.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Transaction message, length delimited. Does not implicitly {@link bazaar.v2.Transaction.verify|verify} messages.
             * @param message Transaction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.Transaction.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Transaction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.Transaction & bazaar.v2.Transaction.$Shape} Transaction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.Transaction & bazaar.v2.Transaction.$Shape;

            /**
             * Decodes a Transaction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.Transaction & bazaar.v2.Transaction.$Shape} Transaction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.Transaction & bazaar.v2.Transaction.$Shape;

            /**
             * Verifies a Transaction message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Transaction message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Transaction
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.Transaction;

            /**
             * Creates a plain object from a Transaction message. Also converts values to other types if specified.
             * @param message Transaction
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.Transaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Transaction to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for Transaction
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace Transaction {

            /** Properties of a Transaction. */
            interface $Properties {

                /** Transaction transaction_id */
                transaction_id: string;

                /** Transaction offer_id */
                offer_id: string;

                /** Transaction proposer_id */
                proposer_id: string;

                /** Transaction recipient_id */
                recipient_id: string;

                /** Transaction give */
                give: bazaar.v2.Bundle.$Properties;

                /** Transaction receive */
                receive: bazaar.v2.Bundle.$Properties;

                /** Transaction settled_tick */
                settled_tick: Long;

                /** Transaction settled_version */
                settled_version: Long;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a Transaction. */
            type $Shape = bazaar.v2.Transaction.$Properties;
        }

        /**
         * Properties of an Advertisement.
         * @deprecated Use bazaar.v2.Advertisement.$Properties instead.
         */
        interface IAdvertisement extends bazaar.v2.Advertisement.$Properties {
        }

        /** Represents an Advertisement. */
        class Advertisement {

            /**
             * Constructs a new Advertisement.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.Advertisement.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** Advertisement advertisement_id. */
            advertisement_id: string;

            /** Advertisement station_id. */
            station_id: string;

            /** Advertisement selling. */
            selling: bazaar.v2.ListResource.$Properties;

            /** Advertisement seeking. */
            seeking: bazaar.v2.ListResource.$Properties;

            /** Advertisement created_tick. */
            created_tick: Long;

            /** Advertisement expires_tick. */
            expires_tick: Long;

            /** Advertisement created_version. */
            created_version: Long;

            /** Advertisement status. */
            status: bazaar.v2.PublicationStatus;

            /**
             * Creates a new Advertisement instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Advertisement instance
             */
            static create(properties: bazaar.v2.Advertisement.$Shape): bazaar.v2.Advertisement & bazaar.v2.Advertisement.$Shape;
            static create(properties?: bazaar.v2.Advertisement.$Properties): bazaar.v2.Advertisement;

            /**
             * Encodes the specified Advertisement message. Does not implicitly {@link bazaar.v2.Advertisement.verify|verify} messages.
             * @param message Advertisement message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.Advertisement.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Advertisement message, length delimited. Does not implicitly {@link bazaar.v2.Advertisement.verify|verify} messages.
             * @param message Advertisement message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.Advertisement.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Advertisement message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.Advertisement & bazaar.v2.Advertisement.$Shape} Advertisement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.Advertisement & bazaar.v2.Advertisement.$Shape;

            /**
             * Decodes an Advertisement message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.Advertisement & bazaar.v2.Advertisement.$Shape} Advertisement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.Advertisement & bazaar.v2.Advertisement.$Shape;

            /**
             * Verifies an Advertisement message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Advertisement message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Advertisement
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.Advertisement;

            /**
             * Creates a plain object from an Advertisement message. Also converts values to other types if specified.
             * @param message Advertisement
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.Advertisement, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Advertisement to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for Advertisement
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace Advertisement {

            /** Properties of an Advertisement. */
            interface $Properties {

                /** Advertisement advertisement_id */
                advertisement_id: string;

                /** Advertisement station_id */
                station_id: string;

                /** Advertisement selling */
                selling: bazaar.v2.ListResource.$Properties;

                /** Advertisement seeking */
                seeking: bazaar.v2.ListResource.$Properties;

                /** Advertisement created_tick */
                created_tick: Long;

                /** Advertisement expires_tick */
                expires_tick: Long;

                /** Advertisement created_version */
                created_version: Long;

                /** Advertisement status */
                status: bazaar.v2.PublicationStatus;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of an Advertisement. */
            type $Shape = bazaar.v2.Advertisement.$Properties;
        }

        /**
         * Properties of a DirectoryEntry.
         * @deprecated Use bazaar.v2.DirectoryEntry.$Properties instead.
         */
        interface IDirectoryEntry extends bazaar.v2.DirectoryEntry.$Properties {
        }

        /** Represents a DirectoryEntry. */
        class DirectoryEntry {

            /**
             * Constructs a new DirectoryEntry.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.DirectoryEntry.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** DirectoryEntry station_id. */
            station_id: string;

            /** DirectoryEntry display_name. */
            display_name: string;

            /**
             * Creates a new DirectoryEntry instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DirectoryEntry instance
             */
            static create(properties: bazaar.v2.DirectoryEntry.$Shape): bazaar.v2.DirectoryEntry & bazaar.v2.DirectoryEntry.$Shape;
            static create(properties?: bazaar.v2.DirectoryEntry.$Properties): bazaar.v2.DirectoryEntry;

            /**
             * Encodes the specified DirectoryEntry message. Does not implicitly {@link bazaar.v2.DirectoryEntry.verify|verify} messages.
             * @param message DirectoryEntry message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.DirectoryEntry.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DirectoryEntry message, length delimited. Does not implicitly {@link bazaar.v2.DirectoryEntry.verify|verify} messages.
             * @param message DirectoryEntry message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.DirectoryEntry.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DirectoryEntry message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.DirectoryEntry & bazaar.v2.DirectoryEntry.$Shape} DirectoryEntry
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.DirectoryEntry & bazaar.v2.DirectoryEntry.$Shape;

            /**
             * Decodes a DirectoryEntry message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.DirectoryEntry & bazaar.v2.DirectoryEntry.$Shape} DirectoryEntry
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.DirectoryEntry & bazaar.v2.DirectoryEntry.$Shape;

            /**
             * Verifies a DirectoryEntry message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DirectoryEntry message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DirectoryEntry
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.DirectoryEntry;

            /**
             * Creates a plain object from a DirectoryEntry message. Also converts values to other types if specified.
             * @param message DirectoryEntry
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.DirectoryEntry, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DirectoryEntry to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for DirectoryEntry
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace DirectoryEntry {

            /** Properties of a DirectoryEntry. */
            interface $Properties {

                /** DirectoryEntry station_id */
                station_id: string;

                /** DirectoryEntry display_name */
                display_name: string;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a DirectoryEntry. */
            type $Shape = bazaar.v2.DirectoryEntry.$Properties;
        }

        /**
         * Properties of a StationObservation.
         * @deprecated Use bazaar.v2.StationObservation.$Properties instead.
         */
        interface IStationObservation extends bazaar.v2.StationObservation.$Properties {
        }

        /** Represents a StationObservation. */
        class StationObservation {

            /**
             * Constructs a new StationObservation.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.StationObservation.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** StationObservation station_id. */
            station_id: string;

            /** StationObservation inventory. */
            inventory: bazaar.v2.Bundle.$Properties;

            /** StationObservation health. */
            health: Long;

            /** StationObservation failed_once. */
            failed_once: boolean;

            /** StationObservation first_failure_tick. */
            first_failure_tick: bazaar.v2.NullableUint.$Properties;

            /** StationObservation last_production. */
            last_production: bazaar.v2.Bundle.$Properties;

            /** StationObservation last_unmet_upkeep. */
            last_unmet_upkeep: bazaar.v2.Bundle.$Properties;

            /** StationObservation fully_supplied_ticks. */
            fully_supplied_ticks: Long;

            /** StationObservation shortage_ticks. */
            shortage_ticks: Long;

            /** StationObservation current_shortage_streak. */
            current_shortage_streak: Long;

            /** StationObservation longest_shortage_streak. */
            longest_shortage_streak: Long;

            /** StationObservation produced_total. */
            produced_total: bazaar.v2.Bundle.$Properties;

            /** StationObservation consumed_total. */
            consumed_total: bazaar.v2.Bundle.$Properties;

            /** StationObservation unmet_total. */
            unmet_total: bazaar.v2.Bundle.$Properties;

            /** StationObservation imported_total. */
            imported_total: bazaar.v2.Bundle.$Properties;

            /** StationObservation exported_total. */
            exported_total: bazaar.v2.Bundle.$Properties;

            /** StationObservation upkeep_per_tick. */
            upkeep_per_tick: bazaar.v2.Bundle.$Properties;

            /** StationObservation specialty. */
            specialty: bazaar.v2.Resource;

            /**
             * Creates a new StationObservation instance using the specified properties.
             * @param [properties] Properties to set
             * @returns StationObservation instance
             */
            static create(properties: bazaar.v2.StationObservation.$Shape): bazaar.v2.StationObservation & bazaar.v2.StationObservation.$Shape;
            static create(properties?: bazaar.v2.StationObservation.$Properties): bazaar.v2.StationObservation;

            /**
             * Encodes the specified StationObservation message. Does not implicitly {@link bazaar.v2.StationObservation.verify|verify} messages.
             * @param message StationObservation message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.StationObservation.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified StationObservation message, length delimited. Does not implicitly {@link bazaar.v2.StationObservation.verify|verify} messages.
             * @param message StationObservation message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.StationObservation.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a StationObservation message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.StationObservation & bazaar.v2.StationObservation.$Shape} StationObservation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.StationObservation & bazaar.v2.StationObservation.$Shape;

            /**
             * Decodes a StationObservation message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.StationObservation & bazaar.v2.StationObservation.$Shape} StationObservation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.StationObservation & bazaar.v2.StationObservation.$Shape;

            /**
             * Verifies a StationObservation message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a StationObservation message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns StationObservation
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.StationObservation;

            /**
             * Creates a plain object from a StationObservation message. Also converts values to other types if specified.
             * @param message StationObservation
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.StationObservation, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this StationObservation to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for StationObservation
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace StationObservation {

            /** Properties of a StationObservation. */
            interface $Properties {

                /** StationObservation station_id */
                station_id: string;

                /** StationObservation inventory */
                inventory: bazaar.v2.Bundle.$Properties;

                /** StationObservation health */
                health: Long;

                /** StationObservation failed_once */
                failed_once: boolean;

                /** StationObservation first_failure_tick */
                first_failure_tick: bazaar.v2.NullableUint.$Properties;

                /** StationObservation last_production */
                last_production: bazaar.v2.Bundle.$Properties;

                /** StationObservation last_unmet_upkeep */
                last_unmet_upkeep: bazaar.v2.Bundle.$Properties;

                /** StationObservation fully_supplied_ticks */
                fully_supplied_ticks: Long;

                /** StationObservation shortage_ticks */
                shortage_ticks: Long;

                /** StationObservation current_shortage_streak */
                current_shortage_streak: Long;

                /** StationObservation longest_shortage_streak */
                longest_shortage_streak: Long;

                /** StationObservation produced_total */
                produced_total: bazaar.v2.Bundle.$Properties;

                /** StationObservation consumed_total */
                consumed_total: bazaar.v2.Bundle.$Properties;

                /** StationObservation unmet_total */
                unmet_total: bazaar.v2.Bundle.$Properties;

                /** StationObservation imported_total */
                imported_total: bazaar.v2.Bundle.$Properties;

                /** StationObservation exported_total */
                exported_total: bazaar.v2.Bundle.$Properties;

                /** StationObservation upkeep_per_tick */
                upkeep_per_tick: bazaar.v2.Bundle.$Properties;

                /** StationObservation specialty */
                specialty: bazaar.v2.Resource;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a StationObservation. */
            type $Shape = {
              station_id: string;
              inventory: bazaar.v2.Bundle.$Shape;
              health: Long;
              failed_once: boolean;
              first_failure_tick: bazaar.v2.NullableUint.$Shape;
              last_production: bazaar.v2.Bundle.$Shape;
              last_unmet_upkeep: bazaar.v2.Bundle.$Shape;
              fully_supplied_ticks: Long;
              shortage_ticks: Long;
              current_shortage_streak: Long;
              longest_shortage_streak: Long;
              produced_total: bazaar.v2.Bundle.$Shape;
              consumed_total: bazaar.v2.Bundle.$Shape;
              unmet_total: bazaar.v2.Bundle.$Shape;
              imported_total: bazaar.v2.Bundle.$Shape;
              exported_total: bazaar.v2.Bundle.$Shape;
              upkeep_per_tick: bazaar.v2.Bundle.$Shape;
              specialty: bazaar.v2.Resource;
              $unknowns?: Uint8Array[];
            };
        }

        /**
         * Properties of a PublicRules.
         * @deprecated Use bazaar.v2.PublicRules.$Properties instead.
         */
        interface IPublicRules extends bazaar.v2.PublicRules.$Properties {
        }

        /** Represents a PublicRules. */
        class PublicRules {

            /**
             * Constructs a new PublicRules.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.PublicRules.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** PublicRules rules_version. */
            rules_version: string;

            /** PublicRules duration_ticks. */
            duration_ticks: Long;

            /** PublicRules tick_duration_ms. */
            tick_duration_ms: Long;

            /** PublicRules resource_order. */
            resource_order: bazaar.v2.ListResource.$Properties;

            /** PublicRules max_health. */
            max_health: Long;

            /** PublicRules shortage_damage_per_unit. */
            shortage_damage_per_unit: Long;

            /** PublicRules recovery_per_fully_supplied_tick. */
            recovery_per_fully_supplied_tick: Long;

            /** PublicRules max_publication_ttl_ticks. */
            max_publication_ttl_ticks: Long;

            /** PublicRules max_offer_ttl_ticks. */
            max_offer_ttl_ticks: Long;

            /** PublicRules new_commands_per_station_per_tick. */
            new_commands_per_station_per_tick: Long;

            /** PublicRules max_request_records_per_station. */
            max_request_records_per_station: Long;

            /** PublicRules max_open_outgoing_offers. */
            max_open_outgoing_offers: Long;

            /** PublicRules max_command_bytes. */
            max_command_bytes: Long;

            /**
             * Creates a new PublicRules instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PublicRules instance
             */
            static create(properties: bazaar.v2.PublicRules.$Shape): bazaar.v2.PublicRules & bazaar.v2.PublicRules.$Shape;
            static create(properties?: bazaar.v2.PublicRules.$Properties): bazaar.v2.PublicRules;

            /**
             * Encodes the specified PublicRules message. Does not implicitly {@link bazaar.v2.PublicRules.verify|verify} messages.
             * @param message PublicRules message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.PublicRules.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PublicRules message, length delimited. Does not implicitly {@link bazaar.v2.PublicRules.verify|verify} messages.
             * @param message PublicRules message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.PublicRules.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PublicRules message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.PublicRules & bazaar.v2.PublicRules.$Shape} PublicRules
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.PublicRules & bazaar.v2.PublicRules.$Shape;

            /**
             * Decodes a PublicRules message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.PublicRules & bazaar.v2.PublicRules.$Shape} PublicRules
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.PublicRules & bazaar.v2.PublicRules.$Shape;

            /**
             * Verifies a PublicRules message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PublicRules message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PublicRules
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.PublicRules;

            /**
             * Creates a plain object from a PublicRules message. Also converts values to other types if specified.
             * @param message PublicRules
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.PublicRules, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this PublicRules to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for PublicRules
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace PublicRules {

            /** Properties of a PublicRules. */
            interface $Properties {

                /** PublicRules rules_version */
                rules_version: string;

                /** PublicRules duration_ticks */
                duration_ticks: Long;

                /** PublicRules tick_duration_ms */
                tick_duration_ms: Long;

                /** PublicRules resource_order */
                resource_order: bazaar.v2.ListResource.$Properties;

                /** PublicRules max_health */
                max_health: Long;

                /** PublicRules shortage_damage_per_unit */
                shortage_damage_per_unit: Long;

                /** PublicRules recovery_per_fully_supplied_tick */
                recovery_per_fully_supplied_tick: Long;

                /** PublicRules max_publication_ttl_ticks */
                max_publication_ttl_ticks: Long;

                /** PublicRules max_offer_ttl_ticks */
                max_offer_ttl_ticks: Long;

                /** PublicRules new_commands_per_station_per_tick */
                new_commands_per_station_per_tick: Long;

                /** PublicRules max_request_records_per_station */
                max_request_records_per_station: Long;

                /** PublicRules max_open_outgoing_offers */
                max_open_outgoing_offers: Long;

                /** PublicRules max_command_bytes */
                max_command_bytes: Long;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a PublicRules. */
            type $Shape = bazaar.v2.PublicRules.$Properties;
        }

        /**
         * Properties of a NullableBool.
         * @deprecated Use bazaar.v2.NullableBool.$Properties instead.
         */
        interface INullableBool extends bazaar.v2.NullableBool.$Properties {
        }

        /** Represents a NullableBool. */
        class NullableBool {

            /**
             * Constructs a new NullableBool.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.NullableBool.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** NullableBool null. */
            null?: (boolean|null);

            /** NullableBool value. */
            value?: (boolean|null);

            /** NullableBool kind. */
            kind?: ("null"|"value");

            /**
             * Creates a new NullableBool instance using the specified properties.
             * @param [properties] Properties to set
             * @returns NullableBool instance
             */
            static create(properties: bazaar.v2.NullableBool.$Shape): bazaar.v2.NullableBool & bazaar.v2.NullableBool.$Shape;
            static create(properties?: bazaar.v2.NullableBool.$Properties): bazaar.v2.NullableBool;

            /**
             * Encodes the specified NullableBool message. Does not implicitly {@link bazaar.v2.NullableBool.verify|verify} messages.
             * @param message NullableBool message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.NullableBool.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified NullableBool message, length delimited. Does not implicitly {@link bazaar.v2.NullableBool.verify|verify} messages.
             * @param message NullableBool message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.NullableBool.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a NullableBool message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.NullableBool & bazaar.v2.NullableBool.$Shape} NullableBool
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.NullableBool & bazaar.v2.NullableBool.$Shape;

            /**
             * Decodes a NullableBool message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.NullableBool & bazaar.v2.NullableBool.$Shape} NullableBool
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.NullableBool & bazaar.v2.NullableBool.$Shape;

            /**
             * Verifies a NullableBool message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a NullableBool message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns NullableBool
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.NullableBool;

            /**
             * Creates a plain object from a NullableBool message. Also converts values to other types if specified.
             * @param message NullableBool
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.NullableBool, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this NullableBool to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for NullableBool
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace NullableBool {

            /** Properties of a NullableBool. */
            interface $Properties {

                /** NullableBool null */
                "null"?: (boolean|null);

                /** NullableBool value */
                value?: (boolean|null);

                /** NullableBool kind */
                kind?: ("null"|"value");

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Narrowed shape of a NullableBool. */
            type $Shape = {
              "null"?: boolean|null;
              value?: boolean|null;
              $unknowns?: Uint8Array[];
            } & (
              ({ kind?: undefined; "null"?: null; value?: null }|{ kind?: "null"; "null": boolean; value?: null }|{ kind?: "value"; "null"?: null; value: boolean })
            );
        }

        /**
         * Properties of a PlayerOutcome.
         * @deprecated Use bazaar.v2.PlayerOutcome.$Properties instead.
         */
        interface IPlayerOutcome extends bazaar.v2.PlayerOutcome.$Properties {
        }

        /** Represents a PlayerOutcome. */
        class PlayerOutcome {

            /**
             * Constructs a new PlayerOutcome.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.PlayerOutcome.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** PlayerOutcome collective_success. */
            collective_success: bazaar.v2.NullableBool.$Properties;

            /** PlayerOutcome self_failed. */
            self_failed: boolean;

            /** PlayerOutcome aborted. */
            aborted: boolean;

            /**
             * Creates a new PlayerOutcome instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PlayerOutcome instance
             */
            static create(properties: bazaar.v2.PlayerOutcome.$Shape): bazaar.v2.PlayerOutcome & bazaar.v2.PlayerOutcome.$Shape;
            static create(properties?: bazaar.v2.PlayerOutcome.$Properties): bazaar.v2.PlayerOutcome;

            /**
             * Encodes the specified PlayerOutcome message. Does not implicitly {@link bazaar.v2.PlayerOutcome.verify|verify} messages.
             * @param message PlayerOutcome message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.PlayerOutcome.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PlayerOutcome message, length delimited. Does not implicitly {@link bazaar.v2.PlayerOutcome.verify|verify} messages.
             * @param message PlayerOutcome message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.PlayerOutcome.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PlayerOutcome message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.PlayerOutcome & bazaar.v2.PlayerOutcome.$Shape} PlayerOutcome
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.PlayerOutcome & bazaar.v2.PlayerOutcome.$Shape;

            /**
             * Decodes a PlayerOutcome message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.PlayerOutcome & bazaar.v2.PlayerOutcome.$Shape} PlayerOutcome
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.PlayerOutcome & bazaar.v2.PlayerOutcome.$Shape;

            /**
             * Verifies a PlayerOutcome message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PlayerOutcome message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PlayerOutcome
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.PlayerOutcome;

            /**
             * Creates a plain object from a PlayerOutcome message. Also converts values to other types if specified.
             * @param message PlayerOutcome
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.PlayerOutcome, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this PlayerOutcome to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for PlayerOutcome
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace PlayerOutcome {

            /** Properties of a PlayerOutcome. */
            interface $Properties {

                /** PlayerOutcome collective_success */
                collective_success: bazaar.v2.NullableBool.$Properties;

                /** PlayerOutcome self_failed */
                self_failed: boolean;

                /** PlayerOutcome aborted */
                aborted: boolean;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a PlayerOutcome. */
            type $Shape = {
              collective_success: bazaar.v2.NullableBool.$Shape;
              self_failed: boolean;
              aborted: boolean;
              $unknowns?: Uint8Array[];
            };
        }

        /** StateType enum. */
        enum StateType {

            /** STATE_TYPE_STATE value */
            STATE_TYPE_STATE = 1
        }

        /**
         * Properties of a ListDirectoryEntry.
         * @deprecated Use bazaar.v2.ListDirectoryEntry.$Properties instead.
         */
        interface IListDirectoryEntry extends bazaar.v2.ListDirectoryEntry.$Properties {
        }

        /** Represents a ListDirectoryEntry. */
        class ListDirectoryEntry {

            /**
             * Constructs a new ListDirectoryEntry.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.ListDirectoryEntry.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** ListDirectoryEntry items. */
            items: bazaar.v2.DirectoryEntry.$Properties[];

            /**
             * Creates a new ListDirectoryEntry instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ListDirectoryEntry instance
             */
            static create(properties: bazaar.v2.ListDirectoryEntry.$Shape): bazaar.v2.ListDirectoryEntry & bazaar.v2.ListDirectoryEntry.$Shape;
            static create(properties?: bazaar.v2.ListDirectoryEntry.$Properties): bazaar.v2.ListDirectoryEntry;

            /**
             * Encodes the specified ListDirectoryEntry message. Does not implicitly {@link bazaar.v2.ListDirectoryEntry.verify|verify} messages.
             * @param message ListDirectoryEntry message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.ListDirectoryEntry.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ListDirectoryEntry message, length delimited. Does not implicitly {@link bazaar.v2.ListDirectoryEntry.verify|verify} messages.
             * @param message ListDirectoryEntry message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.ListDirectoryEntry.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ListDirectoryEntry message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.ListDirectoryEntry & bazaar.v2.ListDirectoryEntry.$Shape} ListDirectoryEntry
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.ListDirectoryEntry & bazaar.v2.ListDirectoryEntry.$Shape;

            /**
             * Decodes a ListDirectoryEntry message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.ListDirectoryEntry & bazaar.v2.ListDirectoryEntry.$Shape} ListDirectoryEntry
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.ListDirectoryEntry & bazaar.v2.ListDirectoryEntry.$Shape;

            /**
             * Verifies a ListDirectoryEntry message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ListDirectoryEntry message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ListDirectoryEntry
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.ListDirectoryEntry;

            /**
             * Creates a plain object from a ListDirectoryEntry message. Also converts values to other types if specified.
             * @param message ListDirectoryEntry
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.ListDirectoryEntry, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ListDirectoryEntry to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for ListDirectoryEntry
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace ListDirectoryEntry {

            /** Properties of a ListDirectoryEntry. */
            interface $Properties {

                /** ListDirectoryEntry items */
                items?: (bazaar.v2.DirectoryEntry.$Properties[]|null);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a ListDirectoryEntry. */
            type $Shape = bazaar.v2.ListDirectoryEntry.$Properties;
        }

        /**
         * Properties of a ListOffer.
         * @deprecated Use bazaar.v2.ListOffer.$Properties instead.
         */
        interface IListOffer extends bazaar.v2.ListOffer.$Properties {
        }

        /** Represents a ListOffer. */
        class ListOffer {

            /**
             * Constructs a new ListOffer.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.ListOffer.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** ListOffer items. */
            items: bazaar.v2.Offer.$Properties[];

            /**
             * Creates a new ListOffer instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ListOffer instance
             */
            static create(properties: bazaar.v2.ListOffer.$Shape): bazaar.v2.ListOffer & bazaar.v2.ListOffer.$Shape;
            static create(properties?: bazaar.v2.ListOffer.$Properties): bazaar.v2.ListOffer;

            /**
             * Encodes the specified ListOffer message. Does not implicitly {@link bazaar.v2.ListOffer.verify|verify} messages.
             * @param message ListOffer message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.ListOffer.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ListOffer message, length delimited. Does not implicitly {@link bazaar.v2.ListOffer.verify|verify} messages.
             * @param message ListOffer message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.ListOffer.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ListOffer message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.ListOffer & bazaar.v2.ListOffer.$Shape} ListOffer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.ListOffer & bazaar.v2.ListOffer.$Shape;

            /**
             * Decodes a ListOffer message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.ListOffer & bazaar.v2.ListOffer.$Shape} ListOffer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.ListOffer & bazaar.v2.ListOffer.$Shape;

            /**
             * Verifies a ListOffer message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ListOffer message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ListOffer
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.ListOffer;

            /**
             * Creates a plain object from a ListOffer message. Also converts values to other types if specified.
             * @param message ListOffer
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.ListOffer, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ListOffer to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for ListOffer
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace ListOffer {

            /** Properties of a ListOffer. */
            interface $Properties {

                /** ListOffer items */
                items?: (bazaar.v2.Offer.$Properties[]|null);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a ListOffer. */
            type $Shape = {
              items?: bazaar.v2.Offer.$Shape[]|null;
              $unknowns?: Uint8Array[];
            };
        }

        /**
         * Properties of a ListAdvertisement.
         * @deprecated Use bazaar.v2.ListAdvertisement.$Properties instead.
         */
        interface IListAdvertisement extends bazaar.v2.ListAdvertisement.$Properties {
        }

        /** Represents a ListAdvertisement. */
        class ListAdvertisement {

            /**
             * Constructs a new ListAdvertisement.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.ListAdvertisement.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** ListAdvertisement items. */
            items: bazaar.v2.Advertisement.$Properties[];

            /**
             * Creates a new ListAdvertisement instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ListAdvertisement instance
             */
            static create(properties: bazaar.v2.ListAdvertisement.$Shape): bazaar.v2.ListAdvertisement & bazaar.v2.ListAdvertisement.$Shape;
            static create(properties?: bazaar.v2.ListAdvertisement.$Properties): bazaar.v2.ListAdvertisement;

            /**
             * Encodes the specified ListAdvertisement message. Does not implicitly {@link bazaar.v2.ListAdvertisement.verify|verify} messages.
             * @param message ListAdvertisement message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.ListAdvertisement.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ListAdvertisement message, length delimited. Does not implicitly {@link bazaar.v2.ListAdvertisement.verify|verify} messages.
             * @param message ListAdvertisement message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.ListAdvertisement.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ListAdvertisement message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.ListAdvertisement & bazaar.v2.ListAdvertisement.$Shape} ListAdvertisement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.ListAdvertisement & bazaar.v2.ListAdvertisement.$Shape;

            /**
             * Decodes a ListAdvertisement message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.ListAdvertisement & bazaar.v2.ListAdvertisement.$Shape} ListAdvertisement
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.ListAdvertisement & bazaar.v2.ListAdvertisement.$Shape;

            /**
             * Verifies a ListAdvertisement message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ListAdvertisement message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ListAdvertisement
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.ListAdvertisement;

            /**
             * Creates a plain object from a ListAdvertisement message. Also converts values to other types if specified.
             * @param message ListAdvertisement
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.ListAdvertisement, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ListAdvertisement to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for ListAdvertisement
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace ListAdvertisement {

            /** Properties of a ListAdvertisement. */
            interface $Properties {

                /** ListAdvertisement items */
                items?: (bazaar.v2.Advertisement.$Properties[]|null);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a ListAdvertisement. */
            type $Shape = bazaar.v2.ListAdvertisement.$Properties;
        }

        /**
         * Properties of a ListTransaction.
         * @deprecated Use bazaar.v2.ListTransaction.$Properties instead.
         */
        interface IListTransaction extends bazaar.v2.ListTransaction.$Properties {
        }

        /** Represents a ListTransaction. */
        class ListTransaction {

            /**
             * Constructs a new ListTransaction.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.ListTransaction.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** ListTransaction items. */
            items: bazaar.v2.Transaction.$Properties[];

            /**
             * Creates a new ListTransaction instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ListTransaction instance
             */
            static create(properties: bazaar.v2.ListTransaction.$Shape): bazaar.v2.ListTransaction & bazaar.v2.ListTransaction.$Shape;
            static create(properties?: bazaar.v2.ListTransaction.$Properties): bazaar.v2.ListTransaction;

            /**
             * Encodes the specified ListTransaction message. Does not implicitly {@link bazaar.v2.ListTransaction.verify|verify} messages.
             * @param message ListTransaction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.ListTransaction.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ListTransaction message, length delimited. Does not implicitly {@link bazaar.v2.ListTransaction.verify|verify} messages.
             * @param message ListTransaction message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.ListTransaction.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ListTransaction message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.ListTransaction & bazaar.v2.ListTransaction.$Shape} ListTransaction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.ListTransaction & bazaar.v2.ListTransaction.$Shape;

            /**
             * Decodes a ListTransaction message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.ListTransaction & bazaar.v2.ListTransaction.$Shape} ListTransaction
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.ListTransaction & bazaar.v2.ListTransaction.$Shape;

            /**
             * Verifies a ListTransaction message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ListTransaction message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ListTransaction
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.ListTransaction;

            /**
             * Creates a plain object from a ListTransaction message. Also converts values to other types if specified.
             * @param message ListTransaction
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.ListTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ListTransaction to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for ListTransaction
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace ListTransaction {

            /** Properties of a ListTransaction. */
            interface $Properties {

                /** ListTransaction items */
                items?: (bazaar.v2.Transaction.$Properties[]|null);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a ListTransaction. */
            type $Shape = bazaar.v2.ListTransaction.$Properties;
        }

        /**
         * Properties of a ListResult.
         * @deprecated Use bazaar.v2.ListResult.$Properties instead.
         */
        interface IListResult extends bazaar.v2.ListResult.$Properties {
        }

        /** Represents a ListResult. */
        class ListResult {

            /**
             * Constructs a new ListResult.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.ListResult.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** ListResult items. */
            items: bazaar.v2.Result.$Properties[];

            /**
             * Creates a new ListResult instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ListResult instance
             */
            static create(properties: bazaar.v2.ListResult.$Shape): bazaar.v2.ListResult & bazaar.v2.ListResult.$Shape;
            static create(properties?: bazaar.v2.ListResult.$Properties): bazaar.v2.ListResult;

            /**
             * Encodes the specified ListResult message. Does not implicitly {@link bazaar.v2.ListResult.verify|verify} messages.
             * @param message ListResult message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.ListResult.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ListResult message, length delimited. Does not implicitly {@link bazaar.v2.ListResult.verify|verify} messages.
             * @param message ListResult message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.ListResult.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ListResult message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.ListResult & bazaar.v2.ListResult.$Shape} ListResult
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.ListResult & bazaar.v2.ListResult.$Shape;

            /**
             * Decodes a ListResult message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.ListResult & bazaar.v2.ListResult.$Shape} ListResult
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.ListResult & bazaar.v2.ListResult.$Shape;

            /**
             * Verifies a ListResult message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ListResult message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ListResult
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.ListResult;

            /**
             * Creates a plain object from a ListResult message. Also converts values to other types if specified.
             * @param message ListResult
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.ListResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ListResult to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for ListResult
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace ListResult {

            /** Properties of a ListResult. */
            interface $Properties {

                /** ListResult items */
                items?: (bazaar.v2.Result.$Properties[]|null);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a ListResult. */
            type $Shape = {
              items?: bazaar.v2.Result.$Shape[]|null;
              $unknowns?: Uint8Array[];
            };
        }

        /**
         * Properties of a NullablePlayerOutcome.
         * @deprecated Use bazaar.v2.NullablePlayerOutcome.$Properties instead.
         */
        interface INullablePlayerOutcome extends bazaar.v2.NullablePlayerOutcome.$Properties {
        }

        /** Represents a NullablePlayerOutcome. */
        class NullablePlayerOutcome {

            /**
             * Constructs a new NullablePlayerOutcome.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.NullablePlayerOutcome.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** NullablePlayerOutcome null. */
            null?: (boolean|null);

            /** NullablePlayerOutcome value. */
            value?: (bazaar.v2.PlayerOutcome.$Properties|null);

            /** NullablePlayerOutcome kind. */
            kind?: ("null"|"value");

            /**
             * Creates a new NullablePlayerOutcome instance using the specified properties.
             * @param [properties] Properties to set
             * @returns NullablePlayerOutcome instance
             */
            static create(properties: bazaar.v2.NullablePlayerOutcome.$Shape): bazaar.v2.NullablePlayerOutcome & bazaar.v2.NullablePlayerOutcome.$Shape;
            static create(properties?: bazaar.v2.NullablePlayerOutcome.$Properties): bazaar.v2.NullablePlayerOutcome;

            /**
             * Encodes the specified NullablePlayerOutcome message. Does not implicitly {@link bazaar.v2.NullablePlayerOutcome.verify|verify} messages.
             * @param message NullablePlayerOutcome message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.NullablePlayerOutcome.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified NullablePlayerOutcome message, length delimited. Does not implicitly {@link bazaar.v2.NullablePlayerOutcome.verify|verify} messages.
             * @param message NullablePlayerOutcome message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.NullablePlayerOutcome.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a NullablePlayerOutcome message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.NullablePlayerOutcome & bazaar.v2.NullablePlayerOutcome.$Shape} NullablePlayerOutcome
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.NullablePlayerOutcome & bazaar.v2.NullablePlayerOutcome.$Shape;

            /**
             * Decodes a NullablePlayerOutcome message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.NullablePlayerOutcome & bazaar.v2.NullablePlayerOutcome.$Shape} NullablePlayerOutcome
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.NullablePlayerOutcome & bazaar.v2.NullablePlayerOutcome.$Shape;

            /**
             * Verifies a NullablePlayerOutcome message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a NullablePlayerOutcome message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns NullablePlayerOutcome
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.NullablePlayerOutcome;

            /**
             * Creates a plain object from a NullablePlayerOutcome message. Also converts values to other types if specified.
             * @param message NullablePlayerOutcome
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.NullablePlayerOutcome, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this NullablePlayerOutcome to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for NullablePlayerOutcome
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace NullablePlayerOutcome {

            /** Properties of a NullablePlayerOutcome. */
            interface $Properties {

                /** NullablePlayerOutcome null */
                "null"?: (boolean|null);

                /** NullablePlayerOutcome value */
                value?: (bazaar.v2.PlayerOutcome.$Properties|null);

                /** NullablePlayerOutcome kind */
                kind?: ("null"|"value");

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Narrowed shape of a NullablePlayerOutcome. */
            type $Shape = {
              "null"?: boolean|null;
              value?: bazaar.v2.PlayerOutcome.$Shape|null;
              $unknowns?: Uint8Array[];
            } & (
              ({ kind?: undefined; "null"?: null; value?: null }|{ kind?: "null"; "null": boolean; value?: null }|{ kind?: "value"; "null"?: null; value: bazaar.v2.PlayerOutcome.$Shape })
            );
        }

        /**
         * Properties of a State.
         * @deprecated Use bazaar.v2.State.$Properties instead.
         */
        interface IState extends bazaar.v2.State.$Properties {
        }

        /** Represents a State. */
        class State {

            /**
             * Constructs a new State.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.State.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** State type. */
            type: bazaar.v2.StateType;

            /** State protocol_version. */
            protocol_version: string;

            /** State run_id. */
            run_id: string;

            /** State snapshot_sequence. */
            snapshot_sequence: Long;

            /** State world_version. */
            world_version: Long;

            /** State tick. */
            tick: Long;

            /** State phase. */
            phase: bazaar.v2.Phase;

            /** State self_station_id. */
            self_station_id: string;

            /** State rules. */
            rules: bazaar.v2.PublicRules.$Properties;

            /** State directory. */
            directory: bazaar.v2.ListDirectoryEntry.$Properties;

            /** State self. */
            self: bazaar.v2.StationObservation.$Properties;

            /** State offers. */
            offers: bazaar.v2.ListOffer.$Properties;

            /** State advertisements. */
            advertisements: bazaar.v2.ListAdvertisement.$Properties;

            /** State transactions. */
            transactions: bazaar.v2.ListTransaction.$Properties;

            /** State request_results. */
            request_results: bazaar.v2.ListResult.$Properties;

            /** State outcome. */
            outcome: bazaar.v2.NullablePlayerOutcome.$Properties;

            /**
             * Creates a new State instance using the specified properties.
             * @param [properties] Properties to set
             * @returns State instance
             */
            static create(properties: bazaar.v2.State.$Shape): bazaar.v2.State & bazaar.v2.State.$Shape;
            static create(properties?: bazaar.v2.State.$Properties): bazaar.v2.State;

            /**
             * Encodes the specified State message. Does not implicitly {@link bazaar.v2.State.verify|verify} messages.
             * @param message State message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.State.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified State message, length delimited. Does not implicitly {@link bazaar.v2.State.verify|verify} messages.
             * @param message State message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.State.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a State message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.State & bazaar.v2.State.$Shape} State
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.State & bazaar.v2.State.$Shape;

            /**
             * Decodes a State message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.State & bazaar.v2.State.$Shape} State
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.State & bazaar.v2.State.$Shape;

            /**
             * Verifies a State message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a State message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns State
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.State;

            /**
             * Creates a plain object from a State message. Also converts values to other types if specified.
             * @param message State
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.State, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this State to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for State
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace State {

            /** Properties of a State. */
            interface $Properties {

                /** State type */
                type: bazaar.v2.StateType;

                /** State protocol_version */
                protocol_version: string;

                /** State run_id */
                run_id: string;

                /** State snapshot_sequence */
                snapshot_sequence: Long;

                /** State world_version */
                world_version: Long;

                /** State tick */
                tick: Long;

                /** State phase */
                phase: bazaar.v2.Phase;

                /** State self_station_id */
                self_station_id: string;

                /** State rules */
                rules: bazaar.v2.PublicRules.$Properties;

                /** State directory */
                directory: bazaar.v2.ListDirectoryEntry.$Properties;

                /** State self */
                self: bazaar.v2.StationObservation.$Properties;

                /** State offers */
                offers: bazaar.v2.ListOffer.$Properties;

                /** State advertisements */
                advertisements: bazaar.v2.ListAdvertisement.$Properties;

                /** State transactions */
                transactions: bazaar.v2.ListTransaction.$Properties;

                /** State request_results */
                request_results: bazaar.v2.ListResult.$Properties;

                /** State outcome */
                outcome: bazaar.v2.NullablePlayerOutcome.$Properties;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a State. */
            type $Shape = {
              type: bazaar.v2.StateType;
              protocol_version: string;
              run_id: string;
              snapshot_sequence: Long;
              world_version: Long;
              tick: Long;
              phase: bazaar.v2.Phase;
              self_station_id: string;
              rules: bazaar.v2.PublicRules.$Shape;
              directory: bazaar.v2.ListDirectoryEntry.$Shape;
              self: bazaar.v2.StationObservation.$Shape;
              offers: bazaar.v2.ListOffer.$Shape;
              advertisements: bazaar.v2.ListAdvertisement.$Shape;
              transactions: bazaar.v2.ListTransaction.$Shape;
              request_results: bazaar.v2.ListResult.$Shape;
              outcome: bazaar.v2.NullablePlayerOutcome.$Shape;
              $unknowns?: Uint8Array[];
            };
        }

        /** ReadinessType enum. */
        enum ReadinessType {

            /** READINESS_TYPE_READINESS value */
            READINESS_TYPE_READINESS = 1
        }

        /**
         * Properties of a Readiness.
         * @deprecated Use bazaar.v2.Readiness.$Properties instead.
         */
        interface IReadiness extends bazaar.v2.Readiness.$Properties {
        }

        /** Represents a Readiness. */
        class Readiness {

            /**
             * Constructs a new Readiness.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.Readiness.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** Readiness type. */
            type: bazaar.v2.ReadinessType;

            /** Readiness protocol_version. */
            protocol_version: string;

            /** Readiness run_id. */
            run_id: string;

            /** Readiness ready. */
            ready: boolean;

            /** Readiness snapshot_sequence. */
            snapshot_sequence: Long;

            /**
             * Creates a new Readiness instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Readiness instance
             */
            static create(properties: bazaar.v2.Readiness.$Shape): bazaar.v2.Readiness & bazaar.v2.Readiness.$Shape;
            static create(properties?: bazaar.v2.Readiness.$Properties): bazaar.v2.Readiness;

            /**
             * Encodes the specified Readiness message. Does not implicitly {@link bazaar.v2.Readiness.verify|verify} messages.
             * @param message Readiness message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.Readiness.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Readiness message, length delimited. Does not implicitly {@link bazaar.v2.Readiness.verify|verify} messages.
             * @param message Readiness message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.Readiness.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Readiness message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.Readiness & bazaar.v2.Readiness.$Shape} Readiness
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.Readiness & bazaar.v2.Readiness.$Shape;

            /**
             * Decodes a Readiness message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.Readiness & bazaar.v2.Readiness.$Shape} Readiness
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.Readiness & bazaar.v2.Readiness.$Shape;

            /**
             * Verifies a Readiness message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Readiness message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Readiness
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.Readiness;

            /**
             * Creates a plain object from a Readiness message. Also converts values to other types if specified.
             * @param message Readiness
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.Readiness, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Readiness to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for Readiness
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace Readiness {

            /** Properties of a Readiness. */
            interface $Properties {

                /** Readiness type */
                type: bazaar.v2.ReadinessType;

                /** Readiness protocol_version */
                protocol_version: string;

                /** Readiness run_id */
                run_id: string;

                /** Readiness ready */
                ready: boolean;

                /** Readiness snapshot_sequence */
                snapshot_sequence: Long;

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Shape of a Readiness. */
            type $Shape = bazaar.v2.Readiness.$Properties;
        }

        /**
         * Properties of a ClientMessage.
         * @deprecated Use bazaar.v2.ClientMessage.$Properties instead.
         */
        interface IClientMessage extends bazaar.v2.ClientMessage.$Properties {
        }

        /** Represents a ClientMessage. */
        class ClientMessage {

            /**
             * Constructs a new ClientMessage.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.ClientMessage.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** ClientMessage advertise. */
            advertise?: (bazaar.v2.Advertise.$Properties|null);

            /** ClientMessage offer. */
            offer?: (bazaar.v2.OfferCommand.$Properties|null);

            /** ClientMessage accept. */
            accept?: (bazaar.v2.Accept.$Properties|null);

            /** ClientMessage withdraw. */
            withdraw?: (bazaar.v2.Withdraw.$Properties|null);

            /** ClientMessage sync. */
            sync?: (bazaar.v2.Sync.$Properties|null);

            /** ClientMessage ready. */
            ready?: (bazaar.v2.Ready.$Properties|null);

            /** ClientMessage message. */
            message?: ("advertise"|"offer"|"accept"|"withdraw"|"sync"|"ready");

            /**
             * Creates a new ClientMessage instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ClientMessage instance
             */
            static create(properties: bazaar.v2.ClientMessage.$Shape): bazaar.v2.ClientMessage & bazaar.v2.ClientMessage.$Shape;
            static create(properties?: bazaar.v2.ClientMessage.$Properties): bazaar.v2.ClientMessage;

            /**
             * Encodes the specified ClientMessage message. Does not implicitly {@link bazaar.v2.ClientMessage.verify|verify} messages.
             * @param message ClientMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.ClientMessage.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ClientMessage message, length delimited. Does not implicitly {@link bazaar.v2.ClientMessage.verify|verify} messages.
             * @param message ClientMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.ClientMessage.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ClientMessage message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.ClientMessage & bazaar.v2.ClientMessage.$Shape} ClientMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.ClientMessage & bazaar.v2.ClientMessage.$Shape;

            /**
             * Decodes a ClientMessage message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.ClientMessage & bazaar.v2.ClientMessage.$Shape} ClientMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.ClientMessage & bazaar.v2.ClientMessage.$Shape;

            /**
             * Verifies a ClientMessage message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ClientMessage message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ClientMessage
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.ClientMessage;

            /**
             * Creates a plain object from a ClientMessage message. Also converts values to other types if specified.
             * @param message ClientMessage
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.ClientMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ClientMessage to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for ClientMessage
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace ClientMessage {

            /** Properties of a ClientMessage. */
            interface $Properties {

                /** ClientMessage advertise */
                advertise?: (bazaar.v2.Advertise.$Properties|null);

                /** ClientMessage offer */
                offer?: (bazaar.v2.OfferCommand.$Properties|null);

                /** ClientMessage accept */
                accept?: (bazaar.v2.Accept.$Properties|null);

                /** ClientMessage withdraw */
                withdraw?: (bazaar.v2.Withdraw.$Properties|null);

                /** ClientMessage sync */
                sync?: (bazaar.v2.Sync.$Properties|null);

                /** ClientMessage ready */
                ready?: (bazaar.v2.Ready.$Properties|null);

                /** ClientMessage message */
                message?: ("advertise"|"offer"|"accept"|"withdraw"|"sync"|"ready");

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Narrowed shape of a ClientMessage. */
            type $Shape = {
              advertise?: bazaar.v2.Advertise.$Shape|null;
              offer?: bazaar.v2.OfferCommand.$Shape|null;
              accept?: bazaar.v2.Accept.$Shape|null;
              withdraw?: bazaar.v2.Withdraw.$Shape|null;
              sync?: bazaar.v2.Sync.$Shape|null;
              ready?: bazaar.v2.Ready.$Shape|null;
              $unknowns?: Uint8Array[];
            } & (
              ({ message?: undefined; advertise?: null; offer?: null; accept?: null; withdraw?: null; sync?: null; ready?: null }|{ message?: "advertise"; advertise: bazaar.v2.Advertise.$Shape; offer?: null; accept?: null; withdraw?: null; sync?: null; ready?: null }|{ message?: "offer"; advertise?: null; offer: bazaar.v2.OfferCommand.$Shape; accept?: null; withdraw?: null; sync?: null; ready?: null }|{ message?: "accept"; advertise?: null; offer?: null; accept: bazaar.v2.Accept.$Shape; withdraw?: null; sync?: null; ready?: null }|{ message?: "withdraw"; advertise?: null; offer?: null; accept?: null; withdraw: bazaar.v2.Withdraw.$Shape; sync?: null; ready?: null }|{ message?: "sync"; advertise?: null; offer?: null; accept?: null; withdraw?: null; sync: bazaar.v2.Sync.$Shape; ready?: null }|{ message?: "ready"; advertise?: null; offer?: null; accept?: null; withdraw?: null; sync?: null; ready: bazaar.v2.Ready.$Shape })
            );
        }

        /**
         * Properties of a ServerMessage.
         * @deprecated Use bazaar.v2.ServerMessage.$Properties instead.
         */
        interface IServerMessage extends bazaar.v2.ServerMessage.$Properties {
        }

        /** Represents a ServerMessage. */
        class ServerMessage {

            /**
             * Constructs a new ServerMessage.
             * @param [properties] Properties to set
             */
            constructor(properties?: bazaar.v2.ServerMessage.$Properties);

            /** Unknown fields preserved while decoding when enabled */
            $unknowns?: Uint8Array[];

            /** ServerMessage state. */
            state?: (bazaar.v2.State.$Properties|null);

            /** ServerMessage result. */
            result?: (bazaar.v2.Result.$Properties|null);

            /** ServerMessage protocol_error. */
            protocol_error?: (bazaar.v2.ProtocolError.$Properties|null);

            /** ServerMessage readiness. */
            readiness?: (bazaar.v2.Readiness.$Properties|null);

            /** ServerMessage message. */
            message?: ("state"|"result"|"protocol_error"|"readiness");

            /**
             * Creates a new ServerMessage instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ServerMessage instance
             */
            static create(properties: bazaar.v2.ServerMessage.$Shape): bazaar.v2.ServerMessage & bazaar.v2.ServerMessage.$Shape;
            static create(properties?: bazaar.v2.ServerMessage.$Properties): bazaar.v2.ServerMessage;

            /**
             * Encodes the specified ServerMessage message. Does not implicitly {@link bazaar.v2.ServerMessage.verify|verify} messages.
             * @param message ServerMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encode(message: bazaar.v2.ServerMessage.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ServerMessage message, length delimited. Does not implicitly {@link bazaar.v2.ServerMessage.verify|verify} messages.
             * @param message ServerMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            static encodeDelimited(message: bazaar.v2.ServerMessage.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ServerMessage message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns {bazaar.v2.ServerMessage & bazaar.v2.ServerMessage.$Shape} ServerMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): bazaar.v2.ServerMessage & bazaar.v2.ServerMessage.$Shape;

            /**
             * Decodes a ServerMessage message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns {bazaar.v2.ServerMessage & bazaar.v2.ServerMessage.$Shape} ServerMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): bazaar.v2.ServerMessage & bazaar.v2.ServerMessage.$Shape;

            /**
             * Verifies a ServerMessage message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ServerMessage message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ServerMessage
             */
            static fromObject(object: { [k: string]: any }): bazaar.v2.ServerMessage;

            /**
             * Creates a plain object from a ServerMessage message. Also converts values to other types if specified.
             * @param message ServerMessage
             * @param [options] Conversion options
             * @returns Plain object
             */
            static toObject(message: bazaar.v2.ServerMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ServerMessage to JSON.
             * @returns JSON object
             */
            toJSON(): { [k: string]: any };

            /**
             * Gets the type url for ServerMessage
             * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns The type url
             */
            static getTypeUrl(prefix?: string): string;
        }

        namespace ServerMessage {

            /** Properties of a ServerMessage. */
            interface $Properties {

                /** ServerMessage state */
                state?: (bazaar.v2.State.$Properties|null);

                /** ServerMessage result */
                result?: (bazaar.v2.Result.$Properties|null);

                /** ServerMessage protocol_error */
                protocol_error?: (bazaar.v2.ProtocolError.$Properties|null);

                /** ServerMessage readiness */
                readiness?: (bazaar.v2.Readiness.$Properties|null);

                /** ServerMessage message */
                message?: ("state"|"result"|"protocol_error"|"readiness");

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];
            }

            /** Narrowed shape of a ServerMessage. */
            type $Shape = {
              state?: bazaar.v2.State.$Shape|null;
              result?: bazaar.v2.Result.$Shape|null;
              protocol_error?: bazaar.v2.ProtocolError.$Shape|null;
              readiness?: bazaar.v2.Readiness.$Shape|null;
              $unknowns?: Uint8Array[];
            } & (
              ({ message?: undefined; state?: null; result?: null; protocol_error?: null; readiness?: null }|{ message?: "state"; state: bazaar.v2.State.$Shape; result?: null; protocol_error?: null; readiness?: null }|{ message?: "result"; state?: null; result: bazaar.v2.Result.$Shape; protocol_error?: null; readiness?: null }|{ message?: "protocol_error"; state?: null; result?: null; protocol_error: bazaar.v2.ProtocolError.$Shape; readiness?: null }|{ message?: "readiness"; state?: null; result?: null; protocol_error?: null; readiness: bazaar.v2.Readiness.$Shape })
            );
        }
    }
}
