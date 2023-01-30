import swaggerUi from 'swagger-ui-express';
import swaggereJsdoc from 'swagger-jsdoc';

/**
 * @openapi
 * components:
 *   responses:
 *
 *     NotFound:
 *       description: The specified resource was not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Common'
 *     Unauthorized:
 *       description: Unauthorized
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Common'
 *     OK:
 *        desctipion: 200 OK
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Common'
 *   schemas:
 *     # Schema for error response body
 *     Common:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         message:
 *           type: string
 *       required:
 *         - code
 *         - message
 *         - result
 *     File:
 *       type: string
 *       format: base64
 */
const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'Holistic API',
            description: '미디어 파이프에서 제공하는 API',
        },
        servers: [
            {
                url: 'http://13.125.189.172', // 요청 URL
            },
        ],
    },
    apis: [
        './src/handlers/**/*.ts',
        './src/modules/**/*.ts',
        './src/transport/**/*.ts',
        './__test__/examples/holistic.js',
    ], //Swagger 파일 연동
};
const specs = swaggereJsdoc(options);

export { swaggerUi, specs };
