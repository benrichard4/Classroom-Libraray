import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html{
        margin: 0 auto;
        /* max-width: 850px; */
    }
    
    body{
        margin: 0;
        font-family: Arial, Helvetica, sans-serif, sans-serif;
        font-weight: 500;
    }
`;
