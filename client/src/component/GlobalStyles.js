import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    
  }

  :root {

    --font-heading: 'Cambria', sans-serif;
    --font-body: 'Kosugi', Arial, Helvetica, sans-serif;
    --padding-page: 24px;
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

h1,
h2,
h3,
label, div
 {
  /* color: black; */
  font-family: var(--font-heading);
  font-size: 20px;
  /* text-align: center; */
}
`;
