import styled from "@emotion/styled";
import React from "react";

const Wrapper = styled.div``;
export const ColumnFilters = ({
  show = true,
  filters = {},
  onChange = () => {},
}) => {
  return show ? <Wrapper>test</Wrapper> : null;
};
