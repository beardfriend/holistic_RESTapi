/* eslint-disable */
import {
  CallOptions,
  ChannelCredentials,
  Client,
  ClientOptions,
  ClientUnaryCall,
  handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "";

/** (1) */

/** (2) */
export interface HolisticRequest {
  request: Data[];
}

export interface HolisticResponse {
  response: Data[];
}

export interface Data {
  index: number;
  data: string;
}

function createBaseHolisticRequest(): HolisticRequest {
  return { request: [] };
}

export const HolisticRequest = {
  encode(message: HolisticRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.request) {
      Data.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HolisticRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHolisticRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.request.push(Data.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): HolisticRequest {
    return { request: Array.isArray(object?.request) ? object.request.map((e: any) => Data.fromJSON(e)) : [] };
  },

  toJSON(message: HolisticRequest): unknown {
    const obj: any = {};
    if (message.request) {
      obj.request = message.request.map((e) => e ? Data.toJSON(e) : undefined);
    } else {
      obj.request = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<HolisticRequest>, I>>(base?: I): HolisticRequest {
    return HolisticRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<HolisticRequest>, I>>(object: I): HolisticRequest {
    const message = createBaseHolisticRequest();
    message.request = object.request?.map((e) => Data.fromPartial(e)) || [];
    return message;
  },
};

function createBaseHolisticResponse(): HolisticResponse {
  return { response: [] };
}

export const HolisticResponse = {
  encode(message: HolisticResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.response) {
      Data.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HolisticResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHolisticResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.response.push(Data.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): HolisticResponse {
    return { response: Array.isArray(object?.response) ? object.response.map((e: any) => Data.fromJSON(e)) : [] };
  },

  toJSON(message: HolisticResponse): unknown {
    const obj: any = {};
    if (message.response) {
      obj.response = message.response.map((e) => e ? Data.toJSON(e) : undefined);
    } else {
      obj.response = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<HolisticResponse>, I>>(base?: I): HolisticResponse {
    return HolisticResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<HolisticResponse>, I>>(object: I): HolisticResponse {
    const message = createBaseHolisticResponse();
    message.response = object.response?.map((e) => Data.fromPartial(e)) || [];
    return message;
  },
};

function createBaseData(): Data {
  return { index: 0, data: "" };
}

export const Data = {
  encode(message: Data, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.index !== 0) {
      writer.uint32(8).int64(message.index);
    }
    if (message.data !== "") {
      writer.uint32(18).string(message.data);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Data {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.index = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.data = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Data {
    return {
      index: isSet(object.index) ? Number(object.index) : 0,
      data: isSet(object.data) ? String(object.data) : "",
    };
  },

  toJSON(message: Data): unknown {
    const obj: any = {};
    message.index !== undefined && (obj.index = Math.round(message.index));
    message.data !== undefined && (obj.data = message.data);
    return obj;
  },

  create<I extends Exact<DeepPartial<Data>, I>>(base?: I): Data {
    return Data.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Data>, I>>(object: I): Data {
    const message = createBaseData();
    message.index = object.index ?? 0;
    message.data = object.data ?? "";
    return message;
  },
};

export type HolisticServiceService = typeof HolisticServiceService;
export const HolisticServiceService = {
  getHolistics: {
    path: "/HolisticService/GetHolistics",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: HolisticRequest) => Buffer.from(HolisticRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => HolisticRequest.decode(value),
    responseSerialize: (value: HolisticResponse) => Buffer.from(HolisticResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => HolisticResponse.decode(value),
  },
} as const;

export interface HolisticServiceServer extends UntypedServiceImplementation {
  getHolistics: handleUnaryCall<HolisticRequest, HolisticResponse>;
}

export interface HolisticServiceClient extends Client {
  getHolistics(
    request: HolisticRequest,
    callback: (error: ServiceError | null, response: HolisticResponse) => void,
  ): ClientUnaryCall;
  getHolistics(
    request: HolisticRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: HolisticResponse) => void,
  ): ClientUnaryCall;
  getHolistics(
    request: HolisticRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: HolisticResponse) => void,
  ): ClientUnaryCall;
}

export const HolisticServiceClient = makeGenericClientConstructor(
  HolisticServiceService,
  "HolisticService",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): HolisticServiceClient;
  service: typeof HolisticServiceService;
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
