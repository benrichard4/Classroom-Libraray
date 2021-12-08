import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import GlobalStyles from "./component/GlobalStyles";
import Header from "./component/Header";
import HomePage from "./component/HomePage";
import TeacherMainPage from "./component/TeacherMainPage";

const App = () => {
  return (
    <Router>
      <GlobalStyles />
      <Header />
      <div>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/teacher">
            <TeacherMainPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
