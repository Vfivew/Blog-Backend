import PostModel from '../models/Post.js';

export const addComment = async (req, res) => {
  const { postId } = req.params;
  const { user, text, fullName, avatarUrl } = req.body;

  try {
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    const newComment = {
        user,
        fullName,
        avatarUrl,
        text,
    };

    post.comments.push(newComment);

    await post.save();

    res.status(200).json({ message: 'Комментарий успешно добавлен', comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не удалось добавить комментарий' });
  }
};

export const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);

    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Комментарий не найден' });
    }

    post.comments.splice(commentIndex, 1);

    await post.save();

    res.status(200).json({ message: 'Комментарий успешно удален' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не удалось удалить комментарий' });
  }
};

export const likeComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    const comment = post.comments.find(comment => comment._id.toString() === commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Комментарий не найден' });
    }

    const { likesCount } = comment;

    if (likesCount.includes(userId)) {
      likesCount.splice(likesCount.indexOf(userId), 1);
    } else {
      likesCount.push(userId);
    }

    await post.save();

    res.status(200).json({ message: `Лайк успешно обновлен ${userId}`, likesCount: likesCount.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не удалось обновить лайк' });
  }
};
