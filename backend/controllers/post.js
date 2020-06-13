const Post = require("../models/posts");
const fs = require("fs");
const { validationResult } = require("express-validator");
const _ = require("lodash");
const { Storage } = require("@google-cloud/storage");
const cron = require("node-cron");
const PostSchedule = require("../models/postSchedules");
const { uploadImageToFirebase } = require("../helper/uploadFile");

exports.postById = async (req, res, next, id) => {
  try {
    let post = null;
    if (
      req.route.path !== "/api/post/schedule/:postId" &&
      req.route.path !== "/api/post/schedule/edit/:postId"
    ) {
      post = await Post.findOne({ _id: id })
        .populate("postedBy", "_id name role")
        .populate("comments.postedBy", "_id name photo")
        .populate("comments.replies.postedBy", "_id name photo")
        .populate("following", "_id name ")
        .populate("tags", "name")
        .select("comments title body  likes   photo created tags");
    } else {
      post = await PostSchedule.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id name role")
        .populate("tags", "name")
        .select("scheduleTime  title body photo  tags");
    }

    if (post) {
      req.post = post;
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong...." });
  }
  next();
};

exports.getPost = async (req, res, next) => {
  return res.status(200).json(req.post);
};
/* exports.newLikesStatusChange = (req, res, next) => {
  User.updateOne(
    { _id: req.body.postId, "likes.user": req.body.followerId },

    {
      $set: {
        "likes.$.isNewLike": false,
      },
    }
  )
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      if (err) {
        console.error(err);
      }
    });
}; */

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ status: true })
      .populate("postedBy", "_id name photo")
      .populate("comments.postedBy", "_id name")
      .populate("tags", "_id name")
      .select("_id title body created comments likes photo status tags")
      .sort({ created: -1 });

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong...." });
  }
};

exports.getScheduledPost = async (req, res, next) => {
  try {
    const posts = await PostSchedule.find({
      postedBy: req.profile._id,
      status: true,
    })
      .populate("postedBy", "_id name role photo")
      .select("_id title body scheduleTime  status photo tags");
    // .sort("_created");
    if (posts.length == 0) {
      return res.json({
        msg: "There is no schedule posts by this user",
        posts: [],
      });
    }
    return res.status(200).json({
      posts,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong...." });
  }
};

exports.deleteScheduledPost = async (req, res, next) => {
  const post = req.post;

  if (!post) {
    return res.json({ msg: "Post not Found" });
  }
  if (
    req.auth._id != req.post.postedBy._id &&
    req.auth.role != "subscriber" &&
    req.auth.role != "admin"
  ) {
    return res(401).json({
      msg: "Not authorized user for deleting this post.",
    });
  }
  try {
    const result = await post.remove({ _id: req.post._id });
    return res.status(200).json({ msg: "Post deleted successfully." });
  } catch (error) {
    return res.status(500).json({ msg: "Something Went Wrong..." });
  }
};

exports.getPostsForAdmin = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("postedBy", "_id name")
      .populate("comments", "text created")
      .populate("comments.postedBy", "_id name")
      .select("_id title body created likes photo status")
      .sort({ created: -1 });
    res.json({ posts });
  } catch (error) {
    console.log("Error while fetching posts", error);
    res.status(500).json({ error: "Something Went Wrong..." });
  }
};

exports.getPostsByUser = async (req, res, next) => {
  try {
    const posts = await Post.find({
      $or: [
        {
          $and: [
            { postedBy: req.profile._id },
            { disabledBy: String(req.profile._id) },
            { status: false },
          ],
        },
        {
          $and: [
            { postedBy: req.profile._id },
            {
              disabledBy: "",
            },
          ],
        },
      ],
    })
      .populate("postedBy", "_id name role photo")
      .populate("comments.postedBy", "_id name")
      .populate("likes.user", "_id name")
      .populate("tags", "_id name")
      .select("_id title body created likes replies comments status photo tags")
      .sort("_created");
    if (posts.length == 0) {
      return res.status(200).json({
        msg: "There is no posts by this user",
        posts: [],
      });
    }
    return res.status(200).json({
      posts,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong...." });
  }
};

exports.hasAuthorization = (req, res, next) => {
  if (req.auth.role != "admin" && req.auth.role != "subscriber") {
    return res.status(401).json({
      msg: "Not authorized user for this action on the post.",
    });
  }
  if (req.auth.role == "admin") {
    return next();
  }

  if (req.auth._id != req.post.postedBy._id) {
    return res.status(401).json({
      msg: "Not authorized user for this action on the post.",
    });
  }
  next();
};

exports.createPost = async (req, res, next) => {
  var tags = [];
  const reqFiles = [];
  if (req.body.tags) {
    tags = JSON.parse(req.body.tags);
  }
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const allErrors = errors.array();
    return res.status(422).json({
      errors: allErrors,
    });
  }

  //const url = req.protocol + "://" + req.get("host");
  for (var i = 0; i < req.files.length; i++) {
    var fileUrl = uploadFile(req.files[i]);
    console.log("path", fileUrl);
    reqFiles.push(fileUrl);

    // reqFiles.push(
    //   `${url}/upload/users/${req.auth._id}/posts/${req.files[i].filename}`
    // );
  }

  const post = new Post({
    title: req.body.title,
    body: req.body.body,
    postedBy: req.auth._id,
    photo: reqFiles,
    tags: tags,
  });

  try {
    const result = await post.save();
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: "Something Went Wrong..." });
  }
};

exports.createPostSchedule = async (req, res, next) => {
  if (req.body.isSchedule) {
    const reqScheduleTime = new Date(req.body.postScheduleTime);

    const scheduleTime = {
      minute: reqScheduleTime.getMinutes(),
      hour: reqScheduleTime.getHours(),
      day: reqScheduleTime.getDate(),
      month: reqScheduleTime.getMonth() + 1,
      dayOfMonth: reqScheduleTime.getDay(),
    };

    const task = cron.schedule(
      `${scheduleTime.minute} ${scheduleTime.hour} ${scheduleTime.day} ${scheduleTime.month} ${scheduleTime.dayOfMonth}`,
      async () => {
        try {
          const postToPublic = await PostSchedule.find({
            scheduleTime: reqScheduleTime,
          });
          if (postToPublic) {
            //console.log("___Post To Public___", postToPublic);//
            const postPubliced = await Post.insertMany(postToPublic);
            //console.log("POST PUBLICED", doc);
            if (postPubliced) {
              await PostSchedule.deleteMany({
                scheduleTime: reqScheduleTime,
              });
            }
          }
        } catch (error) {
          res.status(500).json({ error: "Something Went Wrong..." });
        }
        task.destroy();
      }
    );
    task.start();

    const tags = JSON.parse(req.body.tags);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const allErrors = errors.array();
      return res.status(422).json({
        errors: allErrors,
      });
    }
    const reqFiles = [];

    //const url = req.protocol + "://" + req.get("host");
    for (var i = 0; i < req.files.length; i++) {
      var fileUrl = uploadImageToFirebase(req.files[i]);
      reqFiles.push(fileUrl);
    }

    const post = new PostSchedule({
      title: req.body.title,
      body: req.body.body,
      postedBy: req.auth._id,
      photo: reqFiles,
      tags: tags,
      scheduleTime: reqScheduleTime,
    });

    try {
      const result = await post.save();

      res.status(200).json({ result });
    } catch (err) {
      console.log("Error while Creating Post", err);
      return res.status(500).json("Something Went Wrong...");
    }
  } else {
    next();
  }
  //return res.json(req.body);
};

exports.deletePost = async (req, res, next) => {
  const post = req.post;
  if (!post) {
    return res.json({ msg: "Post not Found" });
  }
  //console.table(req.auth.role);
  if (
    req.auth._id != req.post.postedBy._id &&
    req.auth.role != "subscriber" &&
    req.auth.role != "admin"
  ) {
    return res(401).json({
      msg: "Not authorized user for deleting this post.",
    });
  }
  try {
    const result = await Post.remove({ _id: req.post._id });
    return res.status(200).json({ msg: "Post deleted successfully." });
  } catch (error) {
    return res.status(500).json("Something Went Wrong...");
  }
};

exports.updatePost = async (req, res, next) => {
  let reqTags;
  let tags = [];
  const reqFiles = [];
  let post = req.post;
  //const url = req.protocol + "://" + req.get("host");

  if (req.body.tags) {
    reqTags = JSON.parse(req.body.tags);

    for (let index = 0; index < reqTags.length; index++) {
      tags.push(reqTags[index].id);
    }
    req.body.tags = tags;
  } else {
    req.body.tags = post.tags;
  }

  if (req.files) {
    //req.files = post.photo;
    if (req.files.length > 0) {
      for (var i = 0; i < req.files.length; i++) {
        var fileUrl = uploadImageToFirebase(req.files[i]);
        console.log("URL", fileUrl);
        reqFiles.push(fileUrl);
      }
      req.body.photo = reqFiles;
    } else {
      req.body.photo = post.photo;
    }
  }

  post = _.extend(post, req.body);
  post.updated = Date.now();

  try {
    const result = await post.save();
    res.status(200).json({ post });
  } catch (error) {
    return res.status(500).json("Something Went Wrong...");
  }
};

exports.updateSchedulePost = async (req, res, next) => {
  let reqTags;
  let tags = [];
  const reqFiles = [];

  let post = req.post;
  //const url = req.protocol + "://" + req.get("host");

  if (req.body.tags) {
    reqTags = JSON.parse(req.body.tags);

    for (let index = 0; index < reqTags.length; index++) {
      tags.push(reqTags[index].id);
    }
    req.body.tags = tags;
  } else {
    req.body.tags = post.tags;
  }

  if (req.files) {
    //req.files = post.photo;
    if (req.files.length > 0) {
      for (var i = 0; i < req.files.length; i++) {
        var fileUrl = uploadImageToFirebase(req.files[i]);
        reqFiles.push(fileUrl);
      }
      req.body.photo = reqFiles;
    } else {
      req.body.photo = post.photo;
    }
  }

  post = _.extend(post, req.body);
  post.updated = Date.now();

  try {
    const result = await post.save();
    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({
      error: "Something Went Wrong",
    });
  }
};

exports.likePost = async (req, res, next) => {
  try {
    const UpdatedLikePost = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: {
          likes: {
            user: req.body.userId,
            isNewLike: true,
          },
        },
      },
      { new: true }
    );
    res.status(200).json(UpdatedLikePost);
  } catch (error) {
    res.status(500).json({
      error: "Something Went Wrong",
    });
  }
};

exports.unlikePost = async (req, res, next) => {
  try {
    const UpdatedLikePost = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: { user: req.body.userId } },
        // $set: { hasNewLike: false },
      },
      { new: true }
    );
    res.status(200).json(UpdatedLikePost);
  } catch (error) {
    res.status(500).json({
      error: "Something Went Wrong",
    });
  }
};

exports.commentPost = async (req, res, next) => {
  try {
    let comment = req.body.comment;
    comment.postedBy = req.body.userId;

    const UpdatedCommentPost = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: comment },
      },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name");
    res.status(200).json(UpdatedCommentPost);
  } catch (error) {
    res.status(500).json({
      error: "Something Went Wrong",
    });
  }
};

exports.uncommentPost = async (req, res, next) => {
  try {
    let comment = req.body.comment;

    const UpdatedCommentPost = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { comments: { _id: comment._id } },
      },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name");
    res.status(200).json(UpdatedCommentPost);
  } catch (error) {
    res.status(500).json({
      error: "Something Went Wrong",
    });
  }
};

exports.commentPostReply = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      _id: req.body.postId,
    });

    const comments = post.comments;

    const commentIndex = comments.findIndex((comment, index) => {
      return comment._id == req.body.comment;
    });

    comments[commentIndex].replies.push({
      text: req.body.reply,
      postedBy: req.body.userId,
    });

    const updatedrecord = await post.updateOne({ comments });

    res.status(200).json(updatedrecord);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      error: "Something Went Wrong",
    });
  }
};

exports.dailyNewPosts = async (req, res, next) => {
  let created = req.profile.created.toDateString();
  let startDate = new Date();

  try {
    const posts = await Post.find({
      created: { $gte: startDate.toDateString() },
    });

    return await res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      error: "Something Went Wrong",
    });
  }
};

exports.newLikesStatusChange = (req, res, next) => {
  Post.updateOne(
    {
      _id: req.body.postId,

      "likes.user": req.body.likeId,
    },
    {
      $set: {
        "likes.$[].isNewLike": false,
      },
    }
  )
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      if (err) {
        res.status(500).json({
          error: "Something Went Wrong",
        });
      }
    });
};

exports.newCommentStatusChange = (req, res, next) => {

  Post.updateOne(
    {
      _id: req.body.postId,

      "comments.postedBy": req.body.commenterId,
    },
    {
      $set: {
        "comments.$[].isNewComment": false,
      },
    }
  )
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      if (err) {
        res.status(500).json({
          error: "Something Went Wrong",
        });
      }
    });
};

const uploadFile = (file) => {
  const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT_ID,
    keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS,
  });

  const bucket = storage.bucket(`${process.env.GCLOUD_STORAGE_BUCKET_URL}`);
  let publicUrl;

  try {
    const blob = bucket.file(`posts/${file.originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    // If there's an error
    blobStream.on("error", (err) => console.log("err while uploading+ " + err));

    // If all is good and done
    blobStream.on("finish", () => {
      // Assemble the file public URL
      /* publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURI(blob.name)}?alt=media`; */
      //console.log("public url", publicUrl);
      // Return the file name and its public URL
      // for you to store in your own database
    });
    publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(blob.name)}?alt=media`;

    blobStream.end(file.buffer);
    return publicUrl;
    // When there is no more data to be consumed from the stream the end event gets emitted
  } catch (error) {
    return error;
  }
};
