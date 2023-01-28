protoc:protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_opt=esModuleInterop=true,outputServices=grpc-js,env=node, --ts_proto_out=. ./src/protos/holistic.proto

stress: artillery run stress_test.yaml -o result.json