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

export interface HolisticRequest {
  request: Data[];
}

export interface Data {
  index: number;
  data: string;
}

export interface HolisticResponse {
  result: HolisticDetail[];
}

export interface HolisticDetail {
  index: number;
  faceLandmarks: Vector[];
  leftHandLandmarks: Vector[];
  poseLandmarks: Vector[];
  rightHandLandmark: Vector[];
}

export interface Vector {
  x: number;
  y: number;
  z: number;
  visibility: number;
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

function createBaseHolisticResponse(): HolisticResponse {
  return { result: [] };
}

export const HolisticResponse = {
  encode(message: HolisticResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.result) {
      HolisticDetail.encode(v!, writer.uint32(10).fork()).ldelim();
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
          message.result.push(HolisticDetail.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): HolisticResponse {
    return { result: Array.isArray(object?.result) ? object.result.map((e: any) => HolisticDetail.fromJSON(e)) : [] };
  },

  toJSON(message: HolisticResponse): unknown {
    const obj: any = {};
    if (message.result) {
      obj.result = message.result.map((e) => e ? HolisticDetail.toJSON(e) : undefined);
    } else {
      obj.result = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<HolisticResponse>, I>>(base?: I): HolisticResponse {
    return HolisticResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<HolisticResponse>, I>>(object: I): HolisticResponse {
    const message = createBaseHolisticResponse();
    message.result = object.result?.map((e) => HolisticDetail.fromPartial(e)) || [];
    return message;
  },
};

function createBaseHolisticDetail(): HolisticDetail {
  return { index: 0, faceLandmarks: [], leftHandLandmarks: [], poseLandmarks: [], rightHandLandmark: [] };
}

export const HolisticDetail = {
  encode(message: HolisticDetail, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.index !== 0) {
      writer.uint32(8).int64(message.index);
    }
    for (const v of message.faceLandmarks) {
      Vector.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.leftHandLandmarks) {
      Vector.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.poseLandmarks) {
      Vector.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    for (const v of message.rightHandLandmark) {
      Vector.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HolisticDetail {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHolisticDetail();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.index = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.faceLandmarks.push(Vector.decode(reader, reader.uint32()));
          break;
        case 3:
          message.leftHandLandmarks.push(Vector.decode(reader, reader.uint32()));
          break;
        case 4:
          message.poseLandmarks.push(Vector.decode(reader, reader.uint32()));
          break;
        case 5:
          message.rightHandLandmark.push(Vector.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): HolisticDetail {
    return {
      index: isSet(object.index) ? Number(object.index) : 0,
      faceLandmarks: Array.isArray(object?.faceLandmarks)
        ? object.faceLandmarks.map((e: any) => Vector.fromJSON(e))
        : [],
      leftHandLandmarks: Array.isArray(object?.leftHandLandmarks)
        ? object.leftHandLandmarks.map((e: any) => Vector.fromJSON(e))
        : [],
      poseLandmarks: Array.isArray(object?.poseLandmarks)
        ? object.poseLandmarks.map((e: any) => Vector.fromJSON(e))
        : [],
      rightHandLandmark: Array.isArray(object?.rightHandLandmark)
        ? object.rightHandLandmark.map((e: any) => Vector.fromJSON(e))
        : [],
    };
  },

  toJSON(message: HolisticDetail): unknown {
    const obj: any = {};
    message.index !== undefined && (obj.index = Math.round(message.index));
    if (message.faceLandmarks) {
      obj.faceLandmarks = message.faceLandmarks.map((e) => e ? Vector.toJSON(e) : undefined);
    } else {
      obj.faceLandmarks = [];
    }
    if (message.leftHandLandmarks) {
      obj.leftHandLandmarks = message.leftHandLandmarks.map((e) => e ? Vector.toJSON(e) : undefined);
    } else {
      obj.leftHandLandmarks = [];
    }
    if (message.poseLandmarks) {
      obj.poseLandmarks = message.poseLandmarks.map((e) => e ? Vector.toJSON(e) : undefined);
    } else {
      obj.poseLandmarks = [];
    }
    if (message.rightHandLandmark) {
      obj.rightHandLandmark = message.rightHandLandmark.map((e) => e ? Vector.toJSON(e) : undefined);
    } else {
      obj.rightHandLandmark = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<HolisticDetail>, I>>(base?: I): HolisticDetail {
    return HolisticDetail.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<HolisticDetail>, I>>(object: I): HolisticDetail {
    const message = createBaseHolisticDetail();
    message.index = object.index ?? 0;
    message.faceLandmarks = object.faceLandmarks?.map((e) => Vector.fromPartial(e)) || [];
    message.leftHandLandmarks = object.leftHandLandmarks?.map((e) => Vector.fromPartial(e)) || [];
    message.poseLandmarks = object.poseLandmarks?.map((e) => Vector.fromPartial(e)) || [];
    message.rightHandLandmark = object.rightHandLandmark?.map((e) => Vector.fromPartial(e)) || [];
    return message;
  },
};

function createBaseVector(): Vector {
  return { x: 0, y: 0, z: 0, visibility: 0 };
}

export const Vector = {
  encode(message: Vector, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.x !== 0) {
      writer.uint32(13).float(message.x);
    }
    if (message.y !== 0) {
      writer.uint32(21).float(message.y);
    }
    if (message.z !== 0) {
      writer.uint32(29).float(message.z);
    }
    if (message.visibility !== 0) {
      writer.uint32(37).float(message.visibility);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Vector {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVector();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.x = reader.float();
          break;
        case 2:
          message.y = reader.float();
          break;
        case 3:
          message.z = reader.float();
          break;
        case 4:
          message.visibility = reader.float();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Vector {
    return {
      x: isSet(object.x) ? Number(object.x) : 0,
      y: isSet(object.y) ? Number(object.y) : 0,
      z: isSet(object.z) ? Number(object.z) : 0,
      visibility: isSet(object.visibility) ? Number(object.visibility) : 0,
    };
  },

  toJSON(message: Vector): unknown {
    const obj: any = {};
    message.x !== undefined && (obj.x = message.x);
    message.y !== undefined && (obj.y = message.y);
    message.z !== undefined && (obj.z = message.z);
    message.visibility !== undefined && (obj.visibility = message.visibility);
    return obj;
  },

  create<I extends Exact<DeepPartial<Vector>, I>>(base?: I): Vector {
    return Vector.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Vector>, I>>(object: I): Vector {
    const message = createBaseVector();
    message.x = object.x ?? 0;
    message.y = object.y ?? 0;
    message.z = object.z ?? 0;
    message.visibility = object.visibility ?? 0;
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
