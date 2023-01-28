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

export interface HealthRequest {
  health?: number | undefined;
}

export interface HealthResponse {
  health: number;
}

function createBaseHealthRequest(): HealthRequest {
  return { health: undefined };
}

export const HealthRequest = {
  encode(message: HealthRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.health !== undefined) {
      writer.uint32(8).int64(message.health);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HealthRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHealthRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.health = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): HealthRequest {
    return { health: isSet(object.health) ? Number(object.health) : undefined };
  },

  toJSON(message: HealthRequest): unknown {
    const obj: any = {};
    message.health !== undefined && (obj.health = Math.round(message.health));
    return obj;
  },

  create<I extends Exact<DeepPartial<HealthRequest>, I>>(base?: I): HealthRequest {
    return HealthRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<HealthRequest>, I>>(object: I): HealthRequest {
    const message = createBaseHealthRequest();
    message.health = object.health ?? undefined;
    return message;
  },
};

function createBaseHealthResponse(): HealthResponse {
  return { health: 0 };
}

export const HealthResponse = {
  encode(message: HealthResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.health !== 0) {
      writer.uint32(8).int64(message.health);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HealthResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHealthResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.health = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): HealthResponse {
    return { health: isSet(object.health) ? Number(object.health) : 0 };
  },

  toJSON(message: HealthResponse): unknown {
    const obj: any = {};
    message.health !== undefined && (obj.health = Math.round(message.health));
    return obj;
  },

  create<I extends Exact<DeepPartial<HealthResponse>, I>>(base?: I): HealthResponse {
    return HealthResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<HealthResponse>, I>>(object: I): HealthResponse {
    const message = createBaseHealthResponse();
    message.health = object.health ?? 0;
    return message;
  },
};

export type HealthServiceService = typeof HealthServiceService;
export const HealthServiceService = {
  getHealth: {
    path: "/HealthService/GetHealth",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: HealthRequest) => Buffer.from(HealthRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => HealthRequest.decode(value),
    responseSerialize: (value: HealthResponse) => Buffer.from(HealthResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => HealthResponse.decode(value),
  },
} as const;

export interface HealthServiceServer extends UntypedServiceImplementation {
  getHealth: handleUnaryCall<HealthRequest, HealthResponse>;
}

export interface HealthServiceClient extends Client {
  getHealth(
    request: HealthRequest,
    callback: (error: ServiceError | null, response: HealthResponse) => void,
  ): ClientUnaryCall;
  getHealth(
    request: HealthRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: HealthResponse) => void,
  ): ClientUnaryCall;
  getHealth(
    request: HealthRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: HealthResponse) => void,
  ): ClientUnaryCall;
}

export const HealthServiceClient = makeGenericClientConstructor(HealthServiceService, "HealthService") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): HealthServiceClient;
  service: typeof HealthServiceService;
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
