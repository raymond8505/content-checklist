import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
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
import {
  checkColumn,
  fixColumn,
  fixPostColumn as fixPostColumnOnServer,
  updatePostOnServer,
  useServerUpdate,
} from "../api";
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

  const currentCell = useRef<{
    post: Post | null;
    column: Column | null;
  }>({
    post: null,
    column: null,
  });

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

  const updateCell = (
    post: Post | null | undefined,
    column: Column | undefined,
    newVal: number | undefined = undefined
  ): Post | null => {
    if (!post) return null;
    if (!column) return null;

    const newPost = { ...post };

    if (newVal !== undefined) {
      newPost.columns[column.slug] = newVal;
    } else {
      delete newPost.columns[column.slug];
    }

    return newPost;
  };

  const updatePostInStore = (newPost) => {
    const newPosts = [...posts];
    const postIndex = newPosts.findIndex((post) => post.ID === newPost.ID);
    newPosts[postIndex] = newPost;

    setPosts(newPosts);
  };

  const updatePost = (newPost, cb?: () => void) => {
    if (!newPost) return;

    updatePostOnServer(newPost)
      .catch((e) => {
        alert(e.error);
      })
      .then(() => {
        updatePostInStore(newPost);
        cb?.();
      });
  };
  const handleCellChange = useCallback(
    (
      column: Column,
      post: Post,
      newVal: number | undefined,
      cb: () => void
    ) => {
      const newPost = updateCell(post, column, newVal);

      updatePost(newPost, cb);
    },
    [setPosts, posts]
  );

  const handleCellHover = (post: Post, column: Column) => {
    currentCell.current = { post, column };
  };

  const getPostByID = (id) => posts.find((post) => post.ID === id);

  const getColumnBySlug = (slug) =>
    columns.find((column) => column.slug === slug);

  const fixPostColumn = (post: Post, column: Column) => {
    fixPostColumnOnServer(post, column).then((resp) => {
      if (!resp.success) return;

      const { data } = resp.success;

      if (data) {
        updatePostInStore(
          updateCell(
            getPostByID(data.post_id),
            getColumnBySlug(data.column),
            data.val
          )
        );
      } else {
        console.log("data doesnt exist", resp);
      }
    });
  };

  useEffect(() => {
    const onCellKeyPress = (e) => {
      const { post, column } = currentCell.current;

      console.log(e.key);

      if (!post || !column) return;

      switch (e.key) {
        case "y":
          updatePost(updateCell(post, column, 1));
          break;
        case "n":
          updatePost(updateCell(post, column, 0));
          break;
        case "Escape":
          updatePost(updateCell(post, column, -1));
          break;
        case "Backspace":
          updatePost(updateCell(post, column));
          break;
        case "f":
          fixPostColumn(post, column);
          break;
      }
    };

    window.addEventListener("keyup", onCellKeyPress);

    return () => {
      window.removeEventListener("keyup", onCellKeyPress);
    };
  }, [posts, setPosts]);

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
                    <a
                      href={post.urls.edit.replace("&amp;", "&")}
                      target="_blank"
                    >
                      {post.title}
                    </a>
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
                      onMouseOver={() => {
                        handleCellHover(post, column);
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
