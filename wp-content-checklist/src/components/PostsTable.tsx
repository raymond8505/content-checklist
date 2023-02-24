import React, {
  SyntheticEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
import { Table, TitleCell } from "./PostsTable.styles";
import { ColumnCell } from "./ColumnCell";
import { columnVal } from "../helpers";

const PostsTable = ({}) => {
  const { posts, columns, setPosts } = useStore() as any as Store; //todo do this the right way

  const updateFromServer = useServerUpdate();

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

  const handleCellChange = useCallback(
    (
      column: Column,
      post: Post,
      newVal: number | undefined,
      cb: () => void
    ) => {
      const newPost = { ...post };

      if (newVal !== undefined) {
        newPost.columns[column.slug] = newVal;
      } else {
        delete newPost.columns[column.slug];
      }

      updatePost(newPost)
        .catch((e) => {
          alert(e.error);
        })
        .then(() => {
          const newPosts = [...posts];
          const postIndex = newPosts.findIndex(
            (post) => post.ID === newPost.ID
          );
          newPosts[postIndex] = newPost;

          setPosts(newPosts);
          cb();
        });
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
                      post={post}
                      column={column}
                      onChange={handleCellChange}
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
