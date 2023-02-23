import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useStore, Post, Store, Column } from "../store";
import styled from "@emotion/styled";
import deleteIcon from "../assets/icons/delete.svg";
import fixIcon from "../assets/icons/fix.svg";
import checkIcon from "../assets/icons/check.svg";
import { Icon } from "./common/Icon";
import IconButton from "./common/IconButton";
import { DeleteColumnModal } from "./modals/DeleteColumnModal";
import { checkColumn, fixColumn, updatePost, useServerUpdate } from "../api";
import { CopyFunctionModal } from "./modals/CopyFunctionModal";

const Table = styled.table`
  text-align: left;
  color: black;
  width: calc(100% - 1em);
  height: 100vh;
  border-spacing: 0;
  padding: 0;
  margin: 0;

  thead {
    position: sticky;
    top: 2em;
    background: white;
    z-index: 3;
  }

  tr {
    > td,
    > th {
      border-bottom: 1px solid #cbcbcb;
      padding: 0.5em 0.8em;

      &:not(:last-child) {
        border-right: 1px solid #cbcbcb;
      }
    }
  }

  tbody tr {
    &:nth-of-type(odd) > * {
      background: #dedede;
    }
    &:nth-of-type(even) > * {
      background: #fff;
    }

    :hover td {
      background: #bbb;
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

const TitleCell = styled.div`
  display: flex;
  justify-content: space-between;
  a {
    color: #000;
  }
`;

const ColumnCell = styled.td`
  ${(props) => {
    // @ts-ignore
    switch (props.value) {
      case -1:
        return "background: rgb(0 0 0 / 20%) !important; color:;";
      case 0:
        return "background: rgb(153 0 0 / 20%) !important;";
      case 1:
        return "background: rgb(0 153 0 / 20%) !important;";
      default:
        return "background: white;";
    }
  }};
`;

const PostsTable = ({}) => {
  const { posts, columns, setPosts } = useStore() as any as Store; //todo do this the right way

  const updateFromServer = useServerUpdate();

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
      border-bottom: none !important;
    }
  `;

  const ControlCell = styled.td`
    text-align: right;

    button:not(:first-of-type) {
      margin-left: 0.4em;
    }
  `;

  const [shouldShowDeleteModal, setShouldShowDeleteModal] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState();

  const [shouldShowCodeModal, setShouldShowCodeModal] = useState(false);
  const [functiontoCopy, setFunctionToCopy] = useState(null);

  const [postNameLeft, setPostNameLeft] = useState("3.9375em");

  const firstIDCell = useRef<HTMLTableCellElement>(null);

  useLayoutEffect(() => {
    setTimeout(() => {
      if (firstIDCell?.current) {
        setPostNameLeft(`${firstIDCell.current.offsetWidth}px`);
      }
    }, 1000);
  }, [firstIDCell, columns, posts]);

  const showDeleteModal = (column) => {
    setColumnToDelete(column);
    setShouldShowDeleteModal(true);
  };

  const onDeleteColumnModalClick = () => {
    setShouldShowDeleteModal(false);
  };

  const onCopyFunctionClose = () => {
    setShouldShowCodeModal(false);
  };

  const showCodeModal = (functionName) => {
    setFunctionToCopy(functionName);
    setShouldShowCodeModal(true);
  };

  const getColumnVal = (column: Column, post: Post) =>
    post.columns[column.slug];

  const nextVal = (curVal: number): number => {
    if (curVal === 1) return -1;

    return ++curVal;
  };

  const nextColumnVal = (column: Column, post: Post) =>
    nextVal(getColumnVal(column, post));

  const handleCellClick = useCallback(
    (column: Column, post: Post) => {
      const newVal = nextColumnVal(column, post);
      const newPost = { ...post };
      newPost.columns[column.slug] = newVal;

      updatePost(newPost).catch((e) => {
        alert(e.error);
      });

      const newPosts = [...posts];
      const postIndex = newPosts.findIndex((post) => post.ID === newPost.ID);
      newPosts[postIndex] = newPost;

      setPosts(newPosts);
    },
    [setPosts, posts]
  );
  return (
    <>
      <Table>
        <thead>
          <ControlRow>
            <td className="col--id" ref={firstIDCell}></td>
            <td className="col--title" style={{ left: postNameLeft }}></td>
            {columns.map((column, i) => {
              return (
                <ControlCell key={`column-header--control${i}`}>
                  <IconButton
                    src={checkIcon}
                    alt="Check Column"
                    onClick={() => {
                      checkColumn(column.slug)
                        .then((resp) => {
                          updateFromServer();
                        })
                        .catch((e) => {
                          console.log(e);
                          showCodeModal(e.error);
                        });
                    }}
                  />
                  <IconButton
                    src={fixIcon}
                    alt="Fix Column"
                    onClick={() => {
                      fixColumn(column.slug)
                        .then((resp) => {
                          console.log(resp);
                        })
                        .catch((e) => {
                          console.log(e);
                          showCodeModal(e.error);
                        });
                    }}
                  />
                  <IconButton
                    src={deleteIcon}
                    alt="Delete Column"
                    onClick={() => {
                      showDeleteModal(column);
                    }}
                  />
                </ControlCell>
              );
            })}
          </ControlRow>
          <tr>
            <th className="col--id">ID</th>
            <th className="col--title" style={{ left: postNameLeft }}>
              Post
            </th>
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
                <td className="col--title" style={{ left: postNameLeft }}>
                  <TitleCell>
                    <a href={post.urls.edit}>{post.title}</a>
                    <a href={post.urls.view}>(view)</a>
                  </TitleCell>
                </td>
                {columns.map((column, i) => {
                  return (
                    <ColumnCell
                      key={`post-column-${i}`}
                      value={post.columns[column.slug]}
                      onClick={() => {
                        handleCellClick(column, post);
                      }}
                    >
                      {columnVal(post, column)}
                    </ColumnCell>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      {shouldShowDeleteModal && (
        <DeleteColumnModal
          column={columnToDelete}
          onClose={onDeleteColumnModalClick}
        />
      )}
      {shouldShowCodeModal && (
        <CopyFunctionModal
          functionName={functiontoCopy}
          onClose={onCopyFunctionClose}
        />
      )}
    </>
  );
};

export default PostsTable;
