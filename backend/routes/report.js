const authCheck = require("../middleware/auth-check");
const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.get("/api/reports/yearly/:year", authCheck, async (req, res, next) => {
  try {
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

    return res.send(yearlyFollower);
  } catch (error) {
    console.log(error);
  }
});

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
          name: index,
          amt: 0,
        });
      }

      user.followers.forEach((follower) => {
        if (
          new Date(follower.followedFrom).getFullYear() == req.params.year &&
          new Date(follower.followedFrom).getMonth() + 1 == req.params.month
        ) {
          monthlyFollower.forEach((data, i) => {
            if (data.day === new Date(follower.followedFrom).getDate()) {
              monthlyFollower[i].amt += 1;
            }
          });
        }
      });

      return res.send(monthlyFollower);
    } catch (error) {
      console.log(error);
    }
  }
);

router.get("/api/reports/daily", authCheck, async (req, res, next) => {
  try {
    var dailyFollowers = {
      name: new Date().toDateString(),
      amt: 0,
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

    res.send(dailyFollowers);
  } catch (error) {}
});

router.get(
  "/api/reports/:fromDate/:toDate",
  authCheck,
  async (req, res, next) => {
    var dateWiseFollowers = [];
    return res.send([
      {
        date: new Date.now().toDateString(),
        followersCount: 1,
      },
    ]);
  }
);

module.exports = router;
