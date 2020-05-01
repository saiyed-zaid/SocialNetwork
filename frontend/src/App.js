import React from "react";
import MainRouter from "./mainRouter";
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <MainRouter />
    </Router>
  );
};

export default App;

