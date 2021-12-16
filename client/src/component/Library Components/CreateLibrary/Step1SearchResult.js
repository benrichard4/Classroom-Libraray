import React from "react";
import styled from "styled-components";

//component for the displayed search result of the google API
const Step1SearchResult = ({ result, index, setBookLinedUp }) => {
  const handleOnClick = () => {
    //create book info to push into setBookLinedUp
    let isbn13 = null;
    let isbn10 = null;
    result.volumeInfo.industryIdentifiers &&
      result.volumeInfo.industryIdentifiers.forEach((industryIdentifier) => {
        if (industryIdentifier.type === "ISBN_13") {
          isbn13 = industryIdentifier.identifier;
        } else if (industryIdentifier.type === "ISBN_10") {
          isbn10 = industryIdentifier.identifier;
        }
      });

    let bookInfo = {
      volumeNum: result.id,
      ...(result.volumeInfo.title && { title: result.volumeInfo.title }),
      ...(result.volumeInfo.authors && { authors: result.volumeInfo.authors }),
      ...(result.volumeInfo.description && {
        description: result.volumeInfo.description,
      }),
      ...(result.volumeInfo.imageLinks.thumbnail
        ? {
            thumbnail: result.volumeInfo.imageLinks.thumbnail,
          }
        : "No image found"),
      ...(result.volumeInfo.language && {
        language: result.volumeInfo.language,
      }),
      ...(result.volumeInfo.publishedDate && {
        publishedDate: result.volumeInfo.publishedDate,
      }),
      ...(result.volumeInfo.publisher && {
        publisher: result.volumeInfo.publisher,
      }),
      ...(isbn13 && { isbn13: isbn13 }),
      ...(isbn10 && { isbn10: isbn10 }),
    };
    setBookLinedUp(bookInfo);
  };

  return (
    <ResultButton onClick={handleOnClick}>
      {result.volumeInfo.imageLinks ? (
        <ImageResult
          key={index}
          src={result.volumeInfo.imageLinks.thumbnail}
          alt={`book result ${index}`}
        ></ImageResult>
      ) : (
        <p>Image not Found</p>
      )}
      <InfoDiv>
        <BookInfo>
          Title: {result.volumeInfo.title ? result.volumeInfo.title : "N/A"}
        </BookInfo>
        <BookInfo>
          {"Author(s):"}{" "}
          {result.volumeInfo.authors
            ? result.volumeInfo.authors.map((author) => {
                return author;
              })
            : "N/A"}
        </BookInfo>
        {result.volumeInfo.industryIdentifiers
          ? result.volumeInfo.industryIdentifiers.map((industryIdentifier) => {
              return (
                <BookInfo>
                  {industryIdentifier.type}
                  {": "}
                  {industryIdentifier.identifier}
                </BookInfo>
              );
            })
          : null}
        <BookInfo>
          Publisher:{" "}
          {result.volumeInfo.publisher ? result.volumeInfo.publisher : "N/A"}
        </BookInfo>
        <BookInfo>
          Published Date:{" "}
          {result.volumeInfo.publishedDate
            ? result.volumeInfo.publishedDate
            : "N/A"}
        </BookInfo>
      </InfoDiv>
    </ResultButton>
  );
};

export default Step1SearchResult;

const BookInfo = styled.p`
  font-size: calc(17px - 0.03vw);
`;

const ResultButton = styled.button`
  background-color: transparent;
  padding: 10px;
  margin: 10px;
  border: 1px solid silver;
  display: flex;
  text-align: left;
  cursor: pointer;

  &:last-child {
    border: none;
  }
  &:hover {
    background-color: whitesmoke;
  }
`;

const ImageResult = styled.img`
  width: 20%;
`;

const InfoDiv = styled.div`
  margin-left: 20px;
`;
