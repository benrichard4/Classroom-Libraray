import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import GlobalStyles from "./component/GlobalStyles";
import Header from "./component/Header Components/Header";
import HomePage from "./component/HomePage";
import TeacherMainPage from "./component/TeacherMainPage";
import Classrooms from "./component/Classroom components/Classrooms";
import Libraries from "./component/Library Components/Libraries";
import BookCheckout from "./component/BookCheckout";
import BookReturn from "./component/BookReturn";
import CreateClassroom from "./component/Classroom components/CreateClassroom";
import CreateLibrary from "./component/Library Components/CreateLibrary/CreateLibrary";
import LibraryAddBook from "./component/Library Components/CreateLibrary/LibraryAddBook";
import LibrariesBrowse from "./component/Library Components/LibrariesBrowse";
import ClassroomAddClassList from "./component/Classroom components/ClassroomAddClassList";

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
          <Route exact path="/classroom/:_id/addclasslist">
            <ClassroomAddClassList />
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
