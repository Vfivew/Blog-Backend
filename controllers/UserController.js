import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"
import dotenv from 'dotenv'
import UserModel from '../models/User.js'

export const register = async (req, res) => {

    dotenv.config();
    const API_KEY = process.env.API_KEY

    try { 
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt);
        const avatarUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const doc = new UserModel({
            email: req.body.email,
            fullName:req.body.fullName,
            avatarUrl: avatarUrl || null,
            passwordHash:hash,
        })

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id:user.id,
            },
            API_KEY,
            {
                expiresIn:'1d',
            }
        
        )

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message:'Не вдалось зареєструватись'
        })
    }
}
export const login = async (req, res) => {
    dotenv.config();
    const API_KEY = process.env.API_KEY
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({
                message: 'Невірний логін або пароль'
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Невірний логін або пароль'
            });
        }

        const token = jwt.sign( 
            {
                _id: user.id,
            },
            API_KEY,
            {
                expiresIn: '1d',
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message:'Не вдалось авторизуватись'
        })
    }
}
export const getMe = async (req, res) => {
    dotenv.config();
    const API_KEY = process.env.API_KEY
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "Користувача не знайдено"
            })
        }

        const { passwordHash, ...userData } = user._doc;

        res.json(userData)

    } catch (err) {
        res.status(500).json({
            message:'Немає доступу'
        })
    }
}