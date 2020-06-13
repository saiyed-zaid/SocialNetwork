const authCheck = require("../middleware/auth-check");
const express = require("express");
const User = require("../models/user");
const getDateArray = require("../helper/getDatesArray");
const router = express.Router();

/**
 * @route    GET /api/reports/yearly/:year
 * @description Fetch yearly followers
 * @access PRIVATE
 */
router.get("/api/reports/yearly/:year", authCheck, async (req, res, next) => {
  try {
    var yearlyFollower = [];
    const user = await User.findById(req.auth._id, {
      followers: 1,
      _id: 0,
    }).populate("followers.user");

    var yearlyFollower = [];

    for (let index = 1; index <= 12; index++) {
      yearlyFollower.push({
        month: index,
        followersCount: 0,
      });
    }

    user.followers.forEach((follower) => {
      if (new Date(follower.followedFrom).getFullYear() == req.params.year) {
        yearlyFollower.forEach((data, i) => {
          if (data.month === new Date(follower.followedFrom).getMonth() + 1) {
            yearlyFollower[i].followersCount += 1;
          }
        });
      }
    });

    return res.status(200).send(yearlyFollower);
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong...",
    });
  }
});

/**
 * @route    GET /api/reports/monthly/:year/:month
 * @description Fetch monthly followers
 * @access PRIVATE
 */
router.get(
  "/api/reports/monthly/:year/:month",
  authCheck,
  async (req, res, next) => {
    var monthlyFollower = [];
    try {
      const user = await User.findById(req.auth._id, {
        followers: 1,
        _id: 0,
      }).populate("followers.user");

      for (
        let index = 1;
        index <=
        new Date(
          Number(req.params.year),
          Number(req.params.month),
          0
        ).getDate();
        index++
      ) {
        monthlyFollower.push({
          day: index,
          followersCount: 0,
        });
      }

      user.followers.forEach((follower) => {
        if (
          new Date(follower.followedFrom).getFullYear() == req.params.year &&
          new Date(follower.followedFrom).getMonth() + 1 == req.params.month
        ) {
          monthlyFollower.forEach((data, i) => {
            if (data.day === new Date(follower.followedFrom).getDate()) {
              monthlyFollower[i].followersCount += 1;
            }
          });
        }
      });

      return res.status(200).send(monthlyFollower);
    } catch (error) {
      res.status(500).json({
        error: "Something went wrong...",
      });
    }
  }
);

/**
 * @route    GET /api/reports/daily
 * @description Fetch daily followers
 * @access PRIVATE
 */
router.get("/api/reports/daily", authCheck, async (req, res, next) => {
  try {
    var dailyFollowers = {
      day: new Date().toDateString(),
      followersCount: 0,
    };

    const user = await User.findById(req.auth._id, {
      followers: 1,
      _id: 0,
    }).populate("followers.user");

    user.followers.forEach((follower) => {
      if (
        new Date(follower.followedFrom).toDateString() ==
        new Date().toDateString()
      ) {
        dailyFollowers.followersCount += 1;
      }
    });

    res.status(200).send(dailyFollowers);
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong...",
    });
  }
});

/**
 * @route    GET /api/reports/:fromDate/:toDate
 * @description Fetch between dattes followers
 * @access PRIVATE
 */

router.get(
  "/api/reports/:fromDate/:toDate",
  authCheck,
  async (req, res, next) => {
    if (new Date(req.params.fromDate) > new Date(req.params.toDate)) {
      return res.json({
        error: "Please check Date.",
      });
    }

    var dateWiseFollowers = getDateArray(
      new Date(req.params.fromDate),
      new Date(req.params.toDate)
    );

    const user = await User.findById(req.auth._id, {
      followers: 1,
      _id: 0,
    }).populate("followers.user");

    user.followers.forEach((follower) => {
      dateWiseFollowers.forEach((data, index) => {
        if (new Date(follower.followedFrom).toDateString() === data.date) {
          dateWiseFollowers[index].numberOfFollower += 1;
        }
      });
    });

    return res.status(200).send(dateWiseFollowers);
  }
);

module.exports = router;
