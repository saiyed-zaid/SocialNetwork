const Post = require("../models/posts");
const fs = require("fs");
const { validationResult } = require("express-validator");
const _ = require("lodash");
const { Storage } = require("@google-cloud/storage");
const cron = require("node-cron");
const PostSchedule = require("../models/postSchedules");
const { uploadImageToFirebase } = require("../helper/uploadFile");

/**
 * @function middleware
 * @description Handling get request which fetch Single Post by postId
 */
exports.postById = async (req, res, next, id) => {
  try {
    let post = null;
    console.log("__PATH__", req.route.path);
    if (req.route.path !== "/api/post/schedule/:postId") {
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
        .select("comments title body likes photo created tags");
    }

    if (post) {
      //console.log("__postsByID__", post);
      req.post = post;
    }
  } catch (error) {
    console.log("Error while fatching post.", error);
  }
  next();
};

/**
 * @function middleware
 * @description Handling get request which fetch single post by postId
 */
exports.getPost = async (req, res, next) => {
  return res.json(req.post);
};

/**
 * @function middleware
 * @description Handling get request which fetch all posts
 */
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ status: true })
      .populate("postedBy", "_id name photo.photoURI")
      .populate("comments.postedBy", "_id name")
      .populate("tags", "_id name")
      .select("_id title body created comments likes photo status tags")
      .sort({ created: -1 });
    res.json({ posts });
  } catch (error) {
    console.log("Error while fetching posts", error);
    res.status(422).json({ msg: "Error while fetching posts" });
  }
};

/**
 * @function middleware
 * @description Handling get request which fetch all schedule posts by user
 */
exports.getScheduledPost = async (req, res, next) => {
  try {
    const posts = await PostSchedule.find({
      postedBy: req.profile._id,
      status: true,
    })
      .populate("postedBy", "_id name role photo")
      .populate("comments.postedBy", "_id name")
      .populate("likes.user", "_id name")
      .select("_id title body scheduleTime created  status photo tags")
      .sort("_created");
    if (posts.length == 0) {
      return res.json({
        msg: "There is no schedule posts by this user",
        posts: [],
      });
    }
    return res.json({
      posts,
    });
  } catch (error) {
    return res.json({
      msg: "Error while fetching Posts",
    });
  }
};

/**
 * @function middleware
 * @description Handling delete request which delete Schesuled post in database
 */
exports.deleteScheduledPost = async (req, res, next) => {
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
    const result = await PostSchedule.remove({ _id: req.post._id });
    return res.json({ msg: "Post deleted successfully." });
  } catch (error) {
    return res.json({ msg: "Error while deleting post." });
  }
};

/**
 * @function middleware
 * @description Handling get request which fetch all posts FOR ADMIN
 */
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
    res.status(422).json({ msg: "Error while fetching posts" });
  }
};

/**
 * @function middleware
 * @description Handling get request which fetch all posts by userId
 */
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
      return res.json({
        msg: "There is no posts by this user",
        posts: [],
      });
    }
    return res.json({
      posts,
    });
  } catch (error) {
    return res.json({
      msg: "Error while fetching Posts",
    });
  }
};

exports.hasAuthorization = (req, res, next) => {
  if (req.auth.role != "admin" && req.auth.role != "subscriber") {
    return res.json({
      msg: "Not authorized user for this action on the post.",
    });
  }
  if (req.auth.role == "admin") {
    return next();
  }

  if (req.auth._id != req.post.postedBy._id) {
    return res.json({
      msg: "Not authorized user for this action on the post.",
    });
  }
  next();
};

/**
 * @function middleware
 * @description Handling post request which create new post in database
 */
exports.createPost = async (req, res, next) => {
  console.table(req.body.tags);

  const tags = JSON.parse(req.body.tags);
  const errors = validationResult(req);

  const reqFiles = [];

  //const url = req.protocol + "://" + req.get("host");
  for (var i = 0; i < req.files.length; i++) {
    var fileUrl = uploadFile(req.files[i]);
    console.log("path", fileUrl);
    reqFiles.push(fileUrl);

    // reqFiles.push(
    //   `${url}/upload/users/${req.auth._id}/posts/${req.files[i].filename}`
    // );
  }
  if (!errors.isEmpty()) {
    const allErrors = errors.array();
    return res.status(422).json({
      errors: allErrors,
    });
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

    res.json({ result });
  } catch (err) {
    console.log("Error while Creating Post", err);
  }
};

/**
 * @function middleware
 * @description Handling post request which create new Schedule Post in database
 */
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
          console.log("error while find", error);
        }

        console.log("Congrats post public.");

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
      console.log("path", fileUrl);
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

      res.json({ result });
    } catch (err) {
      console.log("Error while Creating Post", err);
    }
  } else {
    next();
  }
  //return res.json(req.body);
};

/**
 * @function middleware
 * @description Handling delete request which delete post in database
 */
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
    return res.json({ msg: "Post deleted successfully." });
  } catch (error) {
    return res.json({ msg: "Error while deleting post." });
  }
};

/**
 * @function middleware
 * @description Handling patch request which update post in database
 */
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
    //const prevPostPhoto = post.photo;
    console.log("photos", req.body.photo);
    console.log("files path", reqFiles);
  }

  post = _.extend(post, req.body);
  post.updated = Date.now();

  try {
    const result = await post.save();
    res.json({ post });
  } catch (error) {
    res.json({
      msg: "Error while updating profile " + error,
    });
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
    //const prevPostPhoto = post.photo;
    console.log("photos", req.body.photo);
    console.log("files path", reqFiles);
  }

  post = _.extend(post, req.body);
  post.updated = Date.now();

  try {
    const result = await post.save();
    res.json({ post });
  } catch (error) {
    res.json({
      msg: "Error while updating profile " + error,
    });
  }
};

/**
 * @function middleware
 * @description Handling patch request which update post like in database
 */
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
    res.json(UpdatedLikePost);
  } catch (error) {
    res.status(400).json(error);
  }
};

/**
 * @function middleware
 * @description Handling patch request which update post unlike in database
 */
exports.unlikePost = async (req, res, next) => {
  try {
    const UpdatedLikePost = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: { user: req.body.userId } },
      },
      { new: true }
    );
    res.json(UpdatedLikePost);
  } catch (error) {
    res.status(400).json(error);
  }
};

/**
 * @function middleware
 * @description Handling patch request which update/Add post Comment in database
 */
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
    res.json(UpdatedCommentPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

/**
 * @function middleware
 * @description Handling patch request which update post Uncomment in database
 */
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
    res.json(UpdatedCommentPost);
  } catch (error) {
    res.status(400).json(error);
  }
};

/**
 * @function middleware
 * @description Handling patch request which update/Add post Comment Reply in database
 */
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

    res.json(updatedrecord);
  } catch (error) {
    console.log("error", error);
    res.status(400).json(error);
  }
};

exports.dailyNewPosts = async (req, res, next) => {
  let created = req.profile.created.toDateString();
  let startDate = new Date();

  try {
    const posts = await Post.find({
      created: { $gte: startDate.toDateString() },
    });

    return await res.json(posts);
  } catch (error) {
    res.status(400).json({ err: error });
  }
};

const uploadFile = (file) => {
  const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT_ID,
    keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS,
  });

  //social-network-48b35.appspot.com

  //const bucket = storage.bucket("posts");
  //const file = bucket.file('my-existing-file.png');

  const bucket = storage.bucket(`${process.env.GCLOUD_STORAGE_BUCKET_URL}`);
  let publicUrl;

  try {
    const blob = bucket.file(`posts/${file.originalname}`);
    console.log("bucket__name__", bucket.name);
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
