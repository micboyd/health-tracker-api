// models/User.ts
import mongoose from 'mongoose';

interface IUser extends mongoose.Document {
	name: string;
	email: string;
	password: string;
}

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
});

export default mongoose.model<IUser>('User', UserSchema);
