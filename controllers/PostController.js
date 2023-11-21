import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .flatMap((obj) => obj.tags) 
      .filter((tag) => tag.trim() !== "") 
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Не вдалось отримати теги',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const { filter } = req.params;
    let posts;

    if (filter === 'new' ) {
      posts = await PostModel.find()
        .sort({ createdAt: -1 })
        .populate('user', '-passwordHash')
        .select('-__v -user.passwordHash')
        .exec();
    } else if (filter === 'views') {
      posts = await PostModel.find()
        .sort({ viewsCount: -1 })
        .populate('user', '-passwordHash')
        .select('-__v -user.passwordHash')
        .exec();
    } else {
      posts = await PostModel.find()
        .populate('user', '-passwordHash')
        .select('-__v -user.passwordHash')
        .exec();
    }
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не вдалось отримати статті',
    });
  }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const updatedPost = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({
                message: "Статтю не знайдено"
            });
        }

        res.json(updatedPost);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не вдалось отримати статтю',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOneAndDelete({ _id: postId });

        if (!doc) {
            return res.status(404).json({
                message: "Стаття не знайдена"
            });
        }

        res.json({
            success: true,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не вдалось видалити статтю',
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        });
        const post = await doc.save();

        res.json(post);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не вдалось створити статью',
        });
    }
}

export const update = async (req, res) => { 
    try {
        const postId = req.params.id;
        
        await PostModel.updateOne({
            _id:postId,
        },
        {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        }
    );
    res.json({
        success:true
    })
    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не вдалось оновити статью',
        });
    }
}

export const tagsSort = async (req, res) => {
    try {
        const { filter, tag } = req.query;
        let postsWithTag = await PostModel.find({ tags: tag });

        if (filter === 'new') {
            postsWithTag = postsWithTag
                .sort((a, b) => b.createdAt - a.createdAt);
        } else if (filter === 'views') {
            postsWithTag = postsWithTag
                .sort((a, b) => b.viewsCount - a.viewsCount);
        }

        res.json(postsWithTag);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не вдалось отримати пости',
        });
    }
};
