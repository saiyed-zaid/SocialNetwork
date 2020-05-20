const User = require("../models/user");
const _ = require("lodash");
const fs = require("fs");
const md5 = require("md5");
const { Storage } = require("@google-cloud/storage");

exports.userById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id)
      .populate("following", "_id name photo isLoggedIn lastLoggedIn")
      .populate("followers.user", "_id name photo");
    // .populate("comments", "_id");

    if (!user) {
      return next(new Error("User not Found."));
    }
    req.profile = user;
    next();
  } catch (error) {
    return next(new Error("User not Found."));
  }
};

exports.hasAuthorization = (req, res, next) => {
  if (req.auth.role != "admin" && req.auth.role != "subscriber") {
    return res.json({ msg: "Not authorized user for this action." });
  }
  if (req.auth.role == "admin") {
    //return res.json({ msg: "is admin" });

    return next();
  }

  if (req.auth._id != req.profile._id) {
    return res.json({
      msg: "Not authorized user for this action id not matched.",
    });
  }
  next();
};

/**
 * @function middleware
 * @description Handling get request which fetch all Users
 */
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select(
      "_id name email created about role updated photo status following followers"
    );
    if (!users) {
      return res.json({
        msg: "No User Found",
      });
    }

    return res.json({ users, isAuthorized: req.auth.isAuthorized });
  } catch (error) {
    return res.status(404).json({
      msg: "No User Found",
    });
  }
};

/**
 * @function get
 * @description Handling get request which fetch single User
 */
exports.getUser = async (req, res, next) => {
  req.profile.password = undefined;

  return res.json(req.profile);
};

/**
 * @function middleware
 * @description Handling put request which Update single user
 */
exports.updateUser = async (req, res, next) => {

  //const url = req.protocol + "://" + req.get("host");
  var reqFilePath;

  let user = req.profile;

  if (!req.file) {
    //req.file = reqFilePath;

    reqFilePath = user.photo;
  } else {
    //reqFilePath = `${url}/upload/users/${req.auth._id}/profile/${req.file.filename}`;
    var reqFilePath = uploadFile(req.file);
    console.log("URL", reqFilePath);
//    reqFiles.push(reqFilePath);
    /* if (user.photo) {
      fs.unlink(user.photo, (err) => {
        console.log("Error while unlink user image", err);
      });
    } */
  }

  /* if (req.body.password) {
    req.body.password = md5(req.body.password);
  } else {
    req.body.password = user.password;
  } */

  user.photo = reqFilePath;
  user = _.extend(user, req.body);
  user.updated = Date.now();

  user.save(req.body, async (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    } else {
      user.password = undefined;
      await res.json(user);
    }
  });
};

/**
 * @function middleware
 * @description Handling delete request which delete single user
 */
exports.deleteUser = async (req, res, next) => {
  let user = req.profile;
  try {
    const result = await user.remove();
    res.json({ msg: "User Deleted succesfully", isDeleted: true });
  } catch (error) {
    res.json({
      msg: "Error while deleting profile",
      isDeleted: false,
    });
  }
};

/**
 * @function middleware
 * @description Handling put request which add following
 */
exports.addFollowing = async (req, res, next) => {
  try {
    //req.body.userId
    const result = await User.findByIdAndUpdate(req.body.userId, {
      $push: {
        following: req.body.followId,
      },
    });
    next();
  } catch (error) {
    return res.status(400).json({
      err: error,
    });
  }
};
/**
 * @function middleware
 * @description Handling put request which add followers
 */
exports.addFollower = async (req, res, next) => {
  try {
    //req.body.userId
    const result = await User.findByIdAndUpdate(
      req.body.followId,
      {
        $push: {
          followers: {
            user: req.body.userId,
            isNewUser: true,
          },
        },
      },
      {
        $new: true,
      }
    )
      .populate("following", "_id name")
      .populate("followers", "_id name");
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      err: error,
    });
  }
};

/**
 * @function middleware
 * @description Handling put request which remove following
 */
exports.removeFollowing = async (req, res, next) => {
  try {
    //req.body.userId
    const result = await User.findByIdAndUpdate(req.body.userId, {
      $pull: {
        following: req.body.unfollowId,
      },
    });
    next();
  } catch (error) {
    return res.status(400).json({
      err: error,
    });
  }
};
/**
 * @function middleware
 * @description Handling put request which remove followers
 */
exports.removeFollower = async (req, res, next) => {
  try {
    //req.body.userId
    const result = await User.findByIdAndUpdate(
      req.body.unfollowId,
      {
        $pull: {
          followers: { user: req.body.userId },
        },
      },
      {
        $new: true,
      }
    )
      .populate("following", "_id name")
      .populate("followers", "_id name");
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      err: error,
    });
  }
};

exports.findPeople = async (req, res, next) => {
  let following = req.profile.following;
  following.push(req.profile._id);
  try {
    const users = await User.find({ _id: { $nin: following } })
      .select("name photo role")
      .populate("following", "_id")
      .populate("followers", "_id");
    await res.json(users);
  } catch (error) {
    res.status(400).json({ err: error });
  }
};

exports.newFollowerStatusChagne = (req, res, next) => {
  User.findByIdAndUpdate(
    req.auth._id,
    {
      $set: {
        "followers.$[].isNewUser": false,
      },
    },
    { multi: true }
  )
    .then((result) => {})
    .catch((err) => {
      if (err) {
        console.error(err);
      }
    });
};
exports.newLikesStatusChange = (req, res, next) => {
  User.findByIdAndUpdate(
    req.auth._id,
    {
      $set: {
        "likes.$[].isNewLike": false,
      },
    },
    { multi: true }
  )
    .then((result) => {})
    .catch((err) => {
      if (err) {
        console.error(err);
      }
    });
};

exports.getOnlinePeople = async (req, res, next) => {
  let following = req.profile.following;
  // following.push(req.profile._id);
  try {
    const users = await User.find(
      {
        _id: req.profile._id,
      },
      { following }
    ).populate("following", "_id name isLoggedIn photo");

    await res.json(users);
  } catch (error) {
    res.status(400).json({ err: error });
  }
};

exports.dailyNewUsers = async (req, res, next) => {
  let created = req.profile.created.toDateString();
  let startDate = new Date();

  try {
    const users = await User.find({
      created: { $gte: startDate.toDateString() },
    });

    return await res.json(users);
  } catch (error) {
    res.status(400).json({ err: error });
  }
};

exports.userOnlineToday = async (req, res, next) => {
  let lastLoggedIn = req.profile.lastLoggedIn.toDateString();
  let startDate = new Date();

  try {
    const users = await User.find({
      lastLoggedIn: { $gte: startDate.toDateString() },
    });
    return await res.json(users);
  } catch (error) {
    res.status(400).json({ err: error });
  }
};

exports.userOnlineNow = async (req, res, next) => {
  try {
    const users = await User.find({
      isLoggedIn: { $eq: true },
      role: { $eq: "subscriber" },
    });
    return await res.json(users);
  } catch (error) {
    res.status(400).json({ err: error });
  }
};

//image upload
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
    const blob = bucket.file(`profile/${file.originalname}`);

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
