const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

export const getPaginatedSearchResults = (
  searchType,
  searchString,
  startIndex,
  maxResults
) => {
  let query = "";
  console.log("search type", searchType);
  console.log("search string", searchString);
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

  console.log("GOOGLE_URL", GOOGLE_URL);
  return fetch(GOOGLE_URL)
    .then((res) => res.json())
    .then((bookdata) => {
      console.log(bookdata);
      return bookdata.items;
    });
  //   catch (e) {
  //     console.log("getPaginatedResults failed:", e);
  //   }
};

export const getVolumeResult = async (volumeId) => {
  let GOOGLE_URL = `https://www.googleapis.com/books/v1/volumes/${volumeId}?key=${GOOGLE_API_KEY}`;
  try {
  } catch (e) {
    console.log("getPaginatedResults failed:", e);
  }
};
