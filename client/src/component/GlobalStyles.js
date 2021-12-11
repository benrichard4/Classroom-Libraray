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

    /* Works on Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 7px;
}

*::-webkit-scrollbar-track {
  background: none ;
}

*::-webkit-scrollbar-thumb {
  background-color: grey;
  border-radius: 55px;
}
`;
