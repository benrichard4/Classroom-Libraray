const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

//function that returns the book data that was fetched form the google API
export const getPaginatedSearchResults = (
  searchType,
  searchString,
  startIndex,
  maxResults
) => {
  let query = "";
  switch (searchType) {
    case "GeneralSearch":
      query = searchString;
      break;
    case "IsbnSearch":
      query = `isbn:${searchString}`;
      break;
    case "TitleSearch":
      query = `intitle:${searchString}`;
      break;
  }

  let GOOGLE_URL = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${maxResults}&key=${GOOGLE_API_KEY}`;

  return fetch(GOOGLE_URL)
    .then((res) => res.json())
    .then((bookdata) => {
      return bookdata.items;
    });
};
