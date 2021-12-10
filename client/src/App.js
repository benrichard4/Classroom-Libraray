import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import GlobalStyles from "./component/GlobalStyles";
import Header from "./component/Header";
import HomePage from "./component/HomePage";
import TeacherMainPage from "./component/TeacherMainPage";
import Classrooms from "./component/Classrooms";
import Libraries from "./component/Libraries";
import BookCheckout from "./component/BookCheckout";
import BookReturn from "./component/BookReturn";
import CreateClassroom from "./component/CreateClassroom";
import CreateLibrary from "./component/CreateLibrary/CreateLibrary";
import LibraryAddBook from "./component/CreateLibrary/LibraryAddBook";
import LibrariesBrowse from "./component/LibrariesBrowse";

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
          <Route exact path="/classroom/create">
            <CreateClassroom />
          </Route>
          <Route exact path="/library/create">
            <CreateLibrary />
          </Route>
          <Route exact path="/library/:_id/addbook">
            <LibraryAddBook />
          </Route>
          <Route exact path="/classrooms">
            <Classrooms />
          </Route>
          <Route exact path="/libraries">
            <Libraries />
          </Route>
          <Route exact path="/libraries/:_id">
            <LibrariesBrowse />
          </Route>
          <Route exact path="/checkout">
            <BookCheckout />
          </Route>
          <Route exact path="/return">
            <BookReturn />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
