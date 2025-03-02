import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000,
		httpOnly: true,
		sameSite: "none",
		secure: process.env.NODE_ENV === "production",
	});
	res.setHeader("Access-Control-Allow-Credentials", "true"); // 🔥 Must for Vercel
};
