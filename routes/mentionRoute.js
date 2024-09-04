module.exports = (controllerObject = {}, validator, middlewareObject = {}) => {
    const express = require('express');
    const router = express.Router();

    router.get('/getMentionList', middlewareObject.authMiddleware, async (req, res) => {
        const isValid = validator(req.body, "searchTerm");
        if (isValid) {
            try {
                const {searchTerm} = req.body;
                const result = await controllerObject.getAllMentionData(searchTerm);
                return res.status(result.statusCode).json(result.data);
            } catch (err) {
                return res.status(404).json(err);
            }
        } else return res.status(404).json({message: "Search Term is empty!", code: "BAD"});
    });

    return router;
}