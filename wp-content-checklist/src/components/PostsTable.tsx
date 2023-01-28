import React from "react";
import { useStore } from "../store";
import styled from "@emotion/styled";
import deleteIcon from "../assets/icons/delete.svg";
import fixIcon from "../assets/icons/fix.svg";
import checkIcon from "../assets/icons/check.svg";
import { Icon } from "./common/Icon";
import IconButton from "./common/IconButton";

const Table = styled.table`
  text-align: left;
  color: black;
  width: 100%;
  height: 100vh;
  border-spacing: 0;
  padding: 0;
  margin: 0;

  thead {
    position: sticky;
    top: 0; /* Don't forget this, required for the stickiness */
    background: white;
  }

  tr {
    > td,
    > th {
      border-bottom: 1px solid #ddd;
      padding: 0.2em 0.5em;

      &:not(:last-child) {
        border-right: 1px solid #ddd;
      }
    }
  }

  tbody tr:nth-of-type(odd) * {
    background: #eaeaea;
  }

  .col--title {
    width: 20%;
  }

  .col--id {
    width: 6ch;
  }
`;

const PostsTable = ({}) => {
  const { posts, columns } = useStore();

  const columnVal = (post, column) => {
    switch (post.columns[column.slug]) {
      case -1:
        return "N/A";
      case 0:
        return "No";
      case 1:
        return "Yes";
      default:
        return "";
    }
  };

  const ControlRow = styled.tr`
    &,
    td {
      border-bottom: none;
    }
  `;

  const ControlCell = styled.td`
    text-align: right;

    button:not(:first-child) {
      margin-left: 0.4em;
    }
  `;
  return (
    <Table>
      <thead>
        <ControlRow>
          <td className="col--id"></td>
          <td className="col--title"></td>
          {columns.map((column, i) => {
            return (
              <ControlCell key={`column-header--control${i}`}>
                <IconButton src={checkIcon} alt="Check Column" />
                <IconButton src={fixIcon} alt="Fix Column" />
                <IconButton src={deleteIcon} alt="Delete Column" />
              </ControlCell>
            );
          })}
        </ControlRow>
        <tr>
          <th className="col--id">ID</th>
          <th className="col--title">Post</th>
          {columns.map((column, i) => {
            return <th key={`column-header${i}`}>{column.name}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => {
          return (
            <tr key={post.ID}>
              <th className="col--id">{post.ID}</th>
              <th className="col--title">{post.title}</th>
              {columns.map((column, i) => {
                return (
                  <td key={`post-column-${i}`}>{columnVal(post, column)}</td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default PostsTable;
