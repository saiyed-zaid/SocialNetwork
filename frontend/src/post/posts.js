import React, { Component } from "react";
import { list, like } from "./apiPost";
import { Link } from "react-router-dom";
import DefaultPost from "../images/post.jpg";
import Box from "@material-ui/core/Box";
import clsx from "clsx";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Button,
  Icon
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import MoreVertIcon from "@material-ui/icons/MoreVert";

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      expanded: false
    };
  }

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };
  componentDidMount() {
    list().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data.posts });
      }
    });
  }

  /**
   * Function For Creating Controls For  Users Page
   *
   * @param {json} posts  Posts To Be renderd On page
   */
  renderPosts = posts => {
    return (
      <div className="row">
        {posts.map((post, i) => {
          const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
          const posterName = post.postedBy ? post.postedBy.name : "Unknown";
          const imgPath = post.photo ? post.photo.path : DefaultPost;
          return (
            <div style={{ margin: "15px" }}>
              <Box boxShadow={5} bgcolor="background.paper">
                <Card
                  key={post._id}
                  style={{ Width: "300px" }}
                  variant="outlined"
                >
                  <CardHeader
                    avatar={
                      <Avatar aria-label="recipe">
                        <img
                          className="img-thumbnail"
                          src={`${process.env.REACT_APP_API_URL}/${
                            post.photo ? post.photo.path : DefaultPost
                          }`}
                          onError={i => (i.target.src = `${DefaultPost}`)}
                          alt={post.name}
                        />
                      </Avatar>
                    }
                    //title={post.title}
                    title={posterName}
                    subheader={`${new Date(post.created).toDateString()}`}
                  />
                  <div style={{ width: "300px" }}>
                    <img
                      className="img-thumbnail"
                      src={`${process.env.REACT_APP_API_URL}/${
                        post.photo ? post.photo.path : DefaultPost
                      }`}
                      onError={i => (i.target.src = `${DefaultPost}`)}
                      alt={post.name}
                    />
                  </div>
                  <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                      <ShareIcon />
                    </IconButton>
                  </CardActions>
                  <CardContent>
                    <Typography variant=" " color="textPrimary" component="b">
                      {post.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {post.body.substring(0, 20)}
                    </Typography>
                  </CardContent>
                  <Button variant="outlined" fullWidth>
                    <Link style={{ color: "inherit" }} to={`/post/${post._id}`}>
                      Read More
                    </Link>
                  </Button>
                </Card>
              </Box>
            </div>
          );
        })}
      </div>
    );
  };
  render() {
    const { posts } = this.state;

    return (
      <div className="container-fluid">
        {!posts.length ? (
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          this.renderPosts(posts)
        )}
      </div>
    );
  }
}

export default Posts;
