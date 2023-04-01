import styled from "@emotion/styled";

export const NameCellWrapper = styled.span`
  padding-right: 1em;
  a:nth-of-type(2) {
    display: inline-block;
    border-left: 1px solid black;
  }
  > *:not(first-child) {
    margin-left: 0.5em;
    padding-left: 0.5em;
  }
`;

const idColWidth = 72;
const statusColWidth = 72;
export const Wrapper = styled.div<{ contentLeft: number }>`
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

    #wpwrap & {
      top: 32px;
    }
    background: white;
    z-index: 3;
  }

  th:nth-of-type(1), /* id column */
  td:nth-of-type(1), /* status column */
  th:nth-of-type(2),  
  td:nth-of-type(2), /* title column */
  th:nth-of-type(3) {
    position: sticky;
    z-index: 2;
    background: white;
  }

  /* id column */
  th:nth-of-type(1) {
    left: ${(props) => props.contentLeft}px;
    width: ${idColWidth}px;
  }

  /* status column */
  td:nth-of-type(1),
  th:nth-of-type(2) {
    left: ${(props) => props.contentLeft + idColWidth}px;
  }

  /* title column */
  td:nth-of-type(2),
  th:nth-of-type(3) {
    left: ${(props) => props.contentLeft + idColWidth + statusColWidth}px;
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
