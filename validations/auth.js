import { body } from 'express-validator'

export const loginValidation = [
    body('email', "Невірний формат пошти").isEmail(),
    body("password", "Мінімум 8 символів").isLength({ min: 8 }),
]

export const registerValidation = [
    body('email', "Невірний формат пошти").isEmail(),
    body("password", "Мінімум 8 символів").isLength({ min: 8 }),
    body('fullName', "Вкажіть ім'я").isLength({ min: 2 }),
    body('avatarUrl', "Невірний формат посилання").optional().isURL(),
]

export const postCreateValidation = [
    body('title', "Введіть назву статті").isLength({ min: 3 }),
    body("text", "Введіть текст статті").isLength({ min: 10 }),
    body('tags', "Невірний формат тегів").optional().isString(),
    body('imageUrl', "Невірний формат посилання").optional().isString(),
]