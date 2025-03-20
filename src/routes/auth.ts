// routes/auth.ts
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import generateToken from '../utilities/generateToken';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
	const { name, email, password } = req.body;

	try {
		let user = await User.findOne({
			email,
		});

		if (user)
			return res.status(400).json({
				msg: 'User already exists',
			});

		user = new User({
			name,
			email,
			password,
		});

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		await user.save();

		const token = generateToken(user.id);

		res.json({
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ msg: 'Server error' });
	}
});

// Login
router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({
			email,
		});

		if (!user)
			return res.status(400).json({
				msg: 'User not found',
			});

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch)
			return res.status(400).json({
				msg: 'Incorrect username or password',
			});

		const token = generateToken(user.id);

		res.json({
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (err) {
		res.status(500).json({ msg: 'Server error' });
	}
});

export default router;
