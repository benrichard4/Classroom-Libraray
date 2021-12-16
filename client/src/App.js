import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import GlobalStyles from "./component/GlobalStyles";
import Header from "./component/Header Components/Header";
import HomePage from "./component/HomePage";
import TeacherMainPage from "./component/TeacherMainPage";
import CreateClassroom from "./component/Classroom components/CreateClassroom";
import CreateLibrary from "./component/Library Components/CreateLibrary/CreateLibrary";
import LibraryAddBook from "./component/Library Components/CreateLibrary/LibraryAddBook";
import LibrariesBrowse from "./component/Library Components/LibrariesBrowse";
import ClassroomAddClassList from "./component/Classroom components/ClassroomAddClassList";
import BookDetail from "./component/Library Components/BookDetail";
import StudentLoginPage from "./component/Students/StudentLoginPage";
import StudentMainPage from "./component/Students/StudentMainPage";
import AboutPage from "./component/AboutPage";
import Footer from "./Footer";

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
          <Route exact path="/about">
            <AboutPage />
          </Route>
          <Route exact path="/student/login">
            <StudentLoginPage />
          </Route>
          <Route exact path="/student/:_id">
            <StudentMainPage />
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
          <Route exact path="/library/:_id">
            <LibrariesBrowse />
          </Route>
          <Route exact path="/library/:_libId/book/:_bookId">
            <BookDetail />
          </Route>
        </Switch>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
