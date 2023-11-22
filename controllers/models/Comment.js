import mongoose from 'mongoose';

export const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fullName: String, 
    avatarUrl: String, 
    text: {
      type: String,
      required: true,
    },
    likesCount: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
);