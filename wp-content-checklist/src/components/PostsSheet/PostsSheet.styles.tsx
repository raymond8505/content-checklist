import styled from "@emotion/styled";

export const NameCellWrapper = styled.span`
  a:nth-of-type(2) {
    margin-left: 0.5em;
    padding-left: 0.5em;
    display: inline-block;
    border-left: 1px solid black;
  }
`;

export const Wrapper = styled.div`
  .column-cell--na {
    background: rgb(0 0 0 / 20%) !important;
  }
  .column-cell--yes {
    background: rgb(0 153 0 / 25%) !important;
  }
  .column-cell--no {
    background: rgb(153 0 0 / 18%) !important;
  }

  tr:first-of-type {
    position: sticky;
    top: 2em;
    background: white;
    z-index: 3;
  }

  th:nth-of-type(1),
  td:nth-of-type(2),
  th:nth-of-type(2) {
    position: sticky;
    z-index: 2;
    background: white;
  }
  th:nth-of-type(1) {
    left: 0;
    width: 72px;
  }
  td:nth-of-type(2),
  th:nth-of-type(2) {
    left: 72px;
  }
  .Spreadsheet__header {
    color: black;
    font-weight: bold;
  }
  .Spreadsheet__cell--readonly {
    color: black;
  }
`;
export const InnerSelect = styled.select`
  width: 100%;
`;
