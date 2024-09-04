module.exports = (controllerObject = {}, validator, middlewareObject = {}) => {
    const express = require('express');
    const router = express.Router();

    router.get('/getHashtagList', middlewareObject.authMiddleware, async (res, req) => {
        const isValid = validator(req.body);
        if (isValid) {
            const {searchTerm} = req.body;
            try {
                const result = await controllerObject.searchHashtag({profileId});
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(500).json(err);
            }
        } else return res.status(404).json({message: "Search input is undefined!", code: "BAD"});
    });

    return router;
}