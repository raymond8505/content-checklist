import styled from "@emotion/styled";

export const ControlCell = styled.td`
  text-align: right;

  button:not(:first-of-type) {
    margin-left: 0.4em;
  }
`;

export const ControlRow = styled.tr`
  &,
  td {
    border-bottom: none !important;
  }
`;
