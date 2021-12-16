import React from "react";
import styled from "styled-components";

const AboutPage = () => {
  return (
    <Container>
      <Wrapper>
        <TitleStyle>About</TitleStyle>
        <AboutInfo>
          The BookNook is a place where teachers can store and organize their
          book collection, while giving student's access to view and request
          books for checkout.
        </AboutInfo>
        <AboutInfo>-</AboutInfo>
        <AboutInfo>Teachers:</AboutInfo>
        <AboutInfo>
          Teacher's have the control to create libraries. Using Google API, a
          teacher can select from almost any available book online, assign it
          categories and a quantity. Then, teachers can create a classroom,
          where that library is assigned, and then add a classlist. This
          classlist will autogenerate usernames and passwords for the teacher's
          students to have access to the student side of the platform. To
          checkout a book to a student, it's as easy as finding it in the
          library, opening the book detail page and selecting check out. It's
          even easier to do a return. Everything is summarized for the teacher
          in the dashboard section: Libraries, classrooms, and who has what book
          out in each class and when it's due back. No more lost books, and alot
          of saved time!
        </AboutInfo>
        <AboutInfo>-</AboutInfo>
        <AboutInfo>Students:</AboutInfo>
        <AboutInfo>
          With the username and password provided to them by their teacher, a
          student can access a personal account where all of their classroom
          information is stored. It lets them know if they have a book checked
          out and when it's due back. Student's also have access to the
          classroom library. They can browse and search similarly to the
          teacher, however on the book detail page, they do not have permissions
          to checkout or return books. In a soon-to-be released update, students
          will be able to their name to a waiting list attached to a book that
          has 0 quantity remaining.
        </AboutInfo>
        <AboutInfo>-</AboutInfo>
        <AboutInfo>Happy Reading!</AboutInfo>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  min-height: calc(100vh - 160px);
`;

const Wrapper = styled.div`
  max-width: 1200px;
  width: 80vw;
  /* border: 1px solid silver; */
  margin: 0 auto;
  padding: 10px;
`;

const TitleStyle = styled.h1`
  margin-left: 10px;
  margin-bottom: 10px;
  font-size: 35px;
  color: darkblue;
`;

const AboutInfo = styled.p`
  line-height: 30px;
  font-size: calc(14px + 0.3vw);
`;

export default AboutPage;
