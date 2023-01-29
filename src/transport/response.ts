/**
 * @openapi
 * components:
 *   responses:
 *     Holistics:
 *       description: Holistic ML model result
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Holistics'
 *   schemas:
 *     Holistics:
 *       type: object
 *       properties:
 *         index:
 *           type: integer
 *         faceLandmarks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/HolisticDetail'
 *         leftHandLandmarks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/HolisticDetail'
 *         rightHandLandmarks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/HolisticDetail'
 *         poseLandmarks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/HolisticDetail'
 *       required:
 *         - index
 *         - faceLandmarks
 *         - leftHandLandmarks
 *         - rightHandLandmarks
 *         - poseLandmarks
 */
export default interface IHolistic {
    index: number;
    faceLandmarks: IVector[];
    leftHandLandmarks: IVector[];
    poseLandmarks: IVector[];
    rightHandLandmark: IVector[];
}

/**
 * @openapi
 * components:
 *   schemas:
 *     HolisticDetail:
 *       type: object
 *       properties:
 *         x:
 *           type: float
 *           description: x좌표
 *           example: 482.8695983886719
 *         y:
 *           type: float
 *           description: y좌표
 *           example: 957.4305419921875
 *         z:
 *           type: float
 *           description: z좌표 이미지로부터 얼마나 근접해있는지
 *           example: -99.78341674804688
 *       required:
 *         - x
 *         - y
 */
export interface IVector {
    x: number;
    y: number;
    z: number | undefined;
    visibility: number | undefined;
}
