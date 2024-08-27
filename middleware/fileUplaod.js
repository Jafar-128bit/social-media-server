const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            if (file.mimetype === 'image/gif') {
                cb(null, 'public/gif');
            } else {
                cb(null, 'public/image');
            }
        } else if (file.mimetype.startsWith('video/')) {
            cb(null, 'public/video');
        } else {
            cb(new Error('Invalid file type!'), false);
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type! Please upload an image, GIF, or video.'), false);
    }
};

const uploadFileMiddleware = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: function (req, file, cb) {
            if (file.mimetype === 'image/gif') {
                cb(null, 1024 * 1024 * 5); // 5MB for GIFs
            } else if (file.mimetype.startsWith('image/')) {
                cb(null, 1024 * 1024 * 2); // 2MB for image
            } else if (file.mimetype.startsWith('video/')) {
                cb(null, 1024 * 1024 * 10); // 10MB for videos
            }
        }
    }
});

module.exports = uploadFileMiddleware;
