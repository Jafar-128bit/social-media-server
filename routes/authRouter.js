/* Clean Architecture Implementation */
module.exports = (controllerObject = {}, validator) => {
    const express = require('express');
    const router = express.Router();

    const {signInController, signUpController} = controllerObject;

    // SignIn Route
    router.post('/signIn', async (req, res) => {
        const isValid = validator(req.body, "signIn");

        if (isValid) {
            const {username, password} = req.body;
            try {
                const response = await signInController({username, password});
                return res.status(response.statusCode).json(response.data);
            } catch (error) {
                return res.status(500).json({message: "Internal Server Error", code: "ERROR"});
            }
        } else return res.status(400).json({message: "User Data is Missing!", code: "BAD"});
    });

    // SignUp Route
    router.post('/signUp', async (req, res) => {
        const isValid = validator(req.body, "signUp");

        if (isValid) {
            const {firstName, lastName, username, password, email, profileDescription} = req.body;
            try {
                const response = await signUpController({
                    firstName,
                    lastName,
                    username,
                    password,
                    email,
                    profileDescription
                });
                return res.status(response.statusCode).json(response.data);
            } catch (error) {
                return res.status(500).json({message: "Internal Server Error", code: "ERROR"});
            }
        } else return res.status(400).json({message: "User Data is Missing!", code: "BAD"});
    });

    return router;
};


