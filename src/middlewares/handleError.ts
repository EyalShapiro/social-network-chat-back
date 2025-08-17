import { Request, Response, NextFunction } from "express";
export const handleError = (err: Error | any, _req: Request, res: Response, _next: NextFunction) => {
	console.error(err.stack);
	res.status(500).send("Something broke!");
};
