import net from 'net';

import { MDPIPE_SERVER_PORT_LIST } from './constants/constant';
const ipaddr = 'localhost';
const portList = MDPIPE_SERVER_PORT_LIST;

if (!process.env.SV_NUM) {
    throw new Error('포트 번호를 입력하세요');
}

// const mdpSvc = new MediaPipeService();

const port = portList[Number(process.env.SV_NUM)];

const server = net.createServer((socket) => {
    // setting encoding
    socket.setEncoding('utf8');
    let added = '';
    let i = 1;
    socket.on('data', (buf: string) => {
        console.log(i);
        i++;
        console.log(buf);
        if (buf === 'end') {
            const json = JSON.parse(added);
            console.log(json);
        }
        added += buf;
        // socket.write(buf.toString());
    });

    socket.on('drain', (buf: string) => {
        console.log(buf);
        console.log('drain');
    });

    socket.write('connected');
});

// print error message
server.on('error', function (err) {
    console.log(err);
    console.log('err: ', err);
});

// listening
server.listen(port, ipaddr, function () {
    console.log(`listening on ${port}`);
});
