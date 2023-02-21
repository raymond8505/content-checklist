import { Post, useStore } from "../store";

export const apiHost =
  typeof ajaxurl === "undefined"
    ? "http://localhost/raymondsfood/wp-admin/admin-ajax.php"
    : ajaxurl;

export const apiFetch = (action, opts = {}) => {
  return fetch(`${apiHost}?action=wpcc_${action}`, opts);
};
/**
 * updates posts and columns from the server
 * @param {Function} cb
 */
export const useServerUpdate = (cb = () => {}) => {
  const { setPosts, setColumns } = useStore();

  return () => {
    apiFetch("init").then((resp) => {
      resp.json().then((json) => {
        setPosts(json.posts);
        setColumns(json.columns);
        cb();
      });
    });
  };
};

export const handleApiResponse = async (resp) => {
  return resp.ok
    ? resp.json()
    : new Promise((resolve, reject) => {
        resp.json().then((json) => reject(json));
      });
};

export const createColumn = async (name) => {
  const form = new FormData();
  form.append("name", name);

  const resp = await apiFetch("create_column", {
    method: "POST",
    body: form,
  });

  return handleApiResponse(resp);
};

export const deleteColumn = async (slug) => {
  const form = new FormData();
  form.append("slug", slug);

  const resp = await apiFetch("delete_column", {
    method: "POST",
    body: form,
  });
};

export const checkColumn = async (slug) => {
  const form = new FormData();
  form.append("slug", slug);

  const resp = await apiFetch("check_column", {
    method: "POST",
    body: form,
  });

  return handleApiResponse(resp);
};

export const fixColumn = async (slug) => {
  const form = new FormData();
  form.append("slug", slug);

  const resp = await apiFetch("fix_column", {
    method: "POST",
    body: form,
  });

  return handleApiResponse(resp);
};

export const updatePost = async (post: Post) => {
  const resp = await apiFetch("update_post", {
    method: "POST",
    body: JSON.stringify(post),
    headers: {
      "Content-Type": "text/json",
    },
  });

  return handleApiResponse(resp);
};
