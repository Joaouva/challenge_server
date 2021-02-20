const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user-model");
const passport = require("passport");


//Signup route
router.post("/signup", (req, res) => {
	const { username, password, email, name, address } = req.body;

	if (!username || !password || !email) {
		res.status(405).json({ error: "Something missing..." });
		return;
  }
  
	User.findOne({ username }, (err, foundUser) => {
		if (err) {
			res.status(500).json({ error: "Username check went bad." });
			return;
		}
		if (foundUser) {
			res.status(400).json({
				message: "Username taken. Choose another one.",
			});
			
			return;
		}

	
		const salt = bcrypt.genSaltSync(10);
		const hashPass = bcrypt.hashSync(password, salt);
		const aNewUser = new User({
			username: username,
			password: hashPass,
			email,
			name,
			address,
		});
		aNewUser.save((err) => {
			if (err) {
				res.status(400).json({
					message: "Ups! Something went wrong. User not created",
				});
				return;
			}

			res.status(200).json(aNewUser);
		});
	});
});


//login route
router.post("/login", (req, res) => {
	passport.authenticate("local", (err, theUser, failureDetails) => {
		if (err) {
			res.status(500).json({
				message: "Oh boy! Something went wrong. User not authenticated",
			});
			return;
		}
		if (!theUser) {
			res.status(401).json(failureDetails);
			return;
		}
		// save user in session
		req.login(theUser, (err) => {
			if (err) {
				res.status(500).json({ message: "Session save went bad." });
				return;
			}
			
			res.status(200).json(theUser);
		});
	})(req, res);
});

router.post("/logout", (req, res) => {
	req.logout();
	res.status(200).json({ message: "Log out successful!" });
});

router.get("/loggedin", (req, res) => {
	if (req.isAuthenticated()) {
		//Some user is authenticated
		res.json(req.user);
		console.log(req.user);
		return;
	}
	//No one is authenticated
	res.json({});
});

router.get("/:id", (req, res) => {
	const userId = req.params.id;

	User.findById(userId)
		.then((theUser) => {
			res.json(theUser);
		});
});

router.put("/:id", (req, res) => {
	const UserId = req.params.id;
	const UserWithNewDetails = req.body;
	User.findByIdAndUpdate(UserId, UserWithNewDetails).then(() => {
		res.json({ message: `User with ${req.params.id} is updated` });
	});
});

router.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: [
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
		],
	})
);
router.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		successRedirect: `${process.env.CLIENT_HOSTNAME}/projects`,
		failureRedirect: `${process.env.CLIENT_HOSTNAME}/login`,
	})
);

module.exports = router;
