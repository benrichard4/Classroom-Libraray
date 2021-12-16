import React from "react";
import styled from "styled-components";

const Footer = () => {
  return <FooterStyle></FooterStyle>;
};

const FooterStyle = styled.footer`
  background-color: lightblue;
  /* position: fixed; */
  width: 100%;
  bottom: 0;
  height: 60px;
  margin-top: auto;
`;

export default Footer;
