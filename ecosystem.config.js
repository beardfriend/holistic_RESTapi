module.exports = {
    apps: [
        {
            name: 'Holistic 1',
            script: './dist/mediapipeGrpc.js',
            autorestart: true,
            env: {
                HOLI_COUNT: '0',
            },
        },
        {
            name: 'Holistic 2',
            script: './dist/mediapipeGrpc.js',
            autorestart: true,
            env: {
                HOLI_COUNT: '1',
            },
        },
        {
            name: 'Holistic 3',
            script: './dist/mediapipeGrpc.js',
            autorestart: true,
            env: {
                HOLI_COUNT: '2',
            },
        },
        {
            name: 'Main APP',
            script: './dist/app.js',
            exec_mode: 'cluster',
            autorestart: true,
        },
    ],
};
