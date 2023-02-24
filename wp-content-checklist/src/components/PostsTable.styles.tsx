import styled from "@emotion/styled";

export const Table = styled.table`
  text-align: left;
  color: black;
  width: calc(100% - 1em);
  height: 100vh;
  border-spacing: 0;
  padding: 0;
  margin: 0;
  padding-top: 2em;

  thead {
    position: sticky;
    top: 2em;
    background: white;
    z-index: 3;
  }

  tr {
    > td,
    > th {
      //border-bottom: 1px solid #cbcbcb;
      padding: 0.5em 0.8em;

      &:not(:last-child) {
        border-right: 1px solid #cbcbcb;
      }
    }
  }

  tbody tr > * {
    transform: translateY(2em);
  }

  tbody tr {
    &:nth-of-type(odd) > * {
      background: #dedede;
    }
    &:nth-of-type(even) > * {
      background: #fff;
    }

    &:hover > * {
      background: #bbb;
    }

    &:hover {
      .column-cell--na {
        background: rgb(0 0 0 / 30%) !important;
      }
      .column-cell--no {
        background: rgb(153 0 0 / 30%) !important;
      }
      .column-cell--yes {
        background: rgb(0 153 0 / 30%) !important;
      }
    }
  }

  thead tr th,
  thead tr td {
    background: white;
  }

  .col--title {
    width: 20%;
    left: 6ch;
  }

  .col--id {
    width: 6ch;
    left: 0;
  }

  .col--title,
  .col--id {
    position: sticky;
    z-index: 2;
  }
`;

export const TitleCell = styled.div`
  display: flex;
  justify-content: space-between;
  a {
    color: #000;
  }
`;
