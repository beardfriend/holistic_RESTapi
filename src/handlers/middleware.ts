import { NextFunction, Request, Response } from 'express';

export function errorHandler(_err: Error, _req: Request, res: Response, _next: NextFunction) {
    res.status(500).send({ message: '일시적인 에러가 발생했습니다' });
}
