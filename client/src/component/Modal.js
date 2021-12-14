import React from "react";
import styled from "styled-components";
import { Dialog } from "@reach/dialog";
import VisuallyHidden from "@reach/visually-hidden";
import { Icon } from "react-icons-kit";
import { x as xIcon } from "react-icons-kit/feather/x";

import "@reach/dialog/styles.css";

const Modal = ({ isOpen, children, onClose, ...delegated }) => {
  return (
    <>
      <Wrapper isOpen={isOpen} {...delegated}>
        {onClose && (
          <CloseButton onClick={onClose}>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>
              <Icon icon={xIcon} size={24} />
            </span>
          </CloseButton>
        )}
        {children}
      </Wrapper>
    </>
  );
};

const CloseButton = styled.button`
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  font: inherit;

  position: absolute;
  top: 0;
  right: 0;
  width: 48px;
  height: 48px;
  transform: translateY(calc(-100% - 1px));
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled(Dialog)`
  &[data-reach-dialog-content] {
    position: relative;
    color: black;
  }
`;

export default Modal;
