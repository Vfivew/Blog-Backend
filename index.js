import express from "express";
import mongoose from "mongoose";
import multer from 'multer';
import cors from 'cors';

import fs from 'fs';

import { registerValidation, postCreateValidation, loginValidation } from './validations/auth.js';
import { handleValidationErrors, cheakAuth } from './utils/index.js';
import { UserController, PostController, CommentController } from './controllers/index.js';


const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 4000;

mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB OK');
    startServer();
}).catch((err) => {
    console.error('DB ERR', err);
});

function startServer() {
    const app = express();

    const storage = multer.diskStorage({
        destination: (_, __, cb) => {
            if (!fs.existsSync('uploads')) {
                fs.mkdirSync('uploads');
            }
            cb(null, "uploads");
        },
        filename: (_, file, cb) => {
            cb(null, file.originalname);
        }
    });

    const upload = multer({ storage });

    app.use(express.json());
    app.use(cors());

    app.use('/uploads', express.static('uploads'));
    app.post('/upload', cheakAuth, upload.single('image'), (req, res) => {
        res.json({
            url: `/uploads/${req.file.originalname}`,
        });
    });

    app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
    app.post('/auth/register', upload.single('avatar'), registerValidation, handleValidationErrors, UserController.register);
    app.get('/auth/me', cheakAuth, UserController.getMe);

    app.get('/tags', PostController.getLastTags);
    app.get('/posts/tags', PostController.getLastTags);
    app.get('/posts/tags/filter', PostController.tagsSort);

    app.get('/posts', PostController.getAll);
    app.get('/posts/filter/:filter', PostController.getAll);
    app.get('/posts/:id', PostController.getOne);
    app.post('/posts', cheakAuth, postCreateValidation, handleValidationErrors, PostController.create);
    app.delete('/posts/:id', cheakAuth, PostController.remove);
    app.patch('/posts/:id', cheakAuth, postCreateValidation, handleValidationErrors, PostController.update);

    app.post('/posts/:postId/comments', cheakAuth, CommentController.addComment);
    app.delete('/posts/:postId/comments/:commentId', cheakAuth, CommentController.deleteComment);
    app.post('/posts/:postId/comments/:commentId/like', cheakAuth, CommentController.likeComment);

    app.get('/posts/user/:userId', PostController.getUserPost);

    app.listen(PORT, (err) => {
        if (err) {
            return console.error(err);
        }
        console.log('Server is running. Listening on port', PORT);
    });
}
