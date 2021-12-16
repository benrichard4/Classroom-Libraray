import React from "react";
import styled from "styled-components";
import bannerPic from "../assets/banner_homepage.jpg";

const HomePage = () => {
  return (
    <Container>
      <PicDiv>
        <Banner src={bannerPic} />
      </PicDiv>

      <WelcomeDiv>
        <Welcome>Welcome to BookNook!</Welcome>
        <Welcome> </Welcome>
        <Welcome>A place for students and teachers alike to</Welcome>
        <Welcome>come together, browse a library, keep</Welcome>
        <Welcome>track of books, and learn!</Welcome>
        <Welcome> </Welcome>
        <Welcome>Leader of library organization websites made by Ben</Welcome>
      </WelcomeDiv>
    </Container>
  );
};

const Container = styled.div`
  /* max-width: 1200px; */
  width: 100%;
  height: calc(100vh - 160px);
  /* border: 5px solid red; */
  margin: 0 auto;
  position: relative;
  background-color: rgb(173, 216, 230, 0.4);
`;

const PicDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const Banner = styled.img`
  width: 100%;
  height: 100%;
  transform: scaleX(-1);
  z-index: -1;
  /* opacity: 0.75; */
  border-top: 2px solid darkblue;
  border-bottom: 2px solid darkblue;
  object-fit: cover;
  /* filter: sepia(1%) hue-rotate(190deg) saturate(100%); */
`;

const WelcomeDiv = styled.div`
  position: absolute;
  top: 100px;
  left: 100px;
  z-index: 100;
`;

const Welcome = styled.h1`
  color: white;
  text-shadow: 2px 2px 10px black;
  min-height: 30px;
  font-size: calc(20px + 0.3vw);
`;
export default HomePage;
