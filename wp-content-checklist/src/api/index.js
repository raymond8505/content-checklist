import { useStore } from "../store";

export const apiHost =
  typeof ajaxurl === "undefined"
    ? "http://localhost/raymondsfood/wp-admin/admin-ajax.php"
    : ajaxurl;

export const apiFetch = (action, opts = {}) => {
  console.log({ opts });
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