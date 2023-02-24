import styled from "@emotion/styled";
import loading from "../../assets/icons/loading.svg";
import React from "react";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0 0 0 / 15%);
`;

const Img = styled.img`
  height: 50%;
  width: auto;
  animation: spin 1.5s infinite linear;
`;

export const Spinner = () => {
  return (
    <Wrapper>
      <Img src={loading} alt="Loading" />
    </Wrapper>
  );
};
