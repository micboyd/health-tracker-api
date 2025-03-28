import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
	user?: any;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
	const token = req.header('x-auth-token');

	if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
		req.user = decoded;
		next();
	} catch (err) {
		res.status(401).json({ msg: 'Token is not valid' });
	}
};

export default authMiddleware;
