import { useStore } from "../store";

export const apiHost =
  typeof ajaxurl === "undefined"
    ? "http://localhost/raymondsfood/wp-admin/admin-ajax.php"
    : ajaxurl;

export const apiFetch = (action, opts = {}) => {
  console.log({ opts });
  return fetch(`${apiHost}?action=${action}`, opts);
};
/**
 * updates posts and columns from the server
 * @param {Function} cb
 */
export const useServerUpdate = (cb = () => {}) => {
  const { setPosts, setColumns } = useStore();

  return () => {
    apiFetch("wpcc_init").then((resp) => {
      resp.json().then((json) => {
        setPosts(json.posts);
        setColumns(json.columns);
        cb();
      });
    });
  };
};

export const createColumn = async (name) => {
  const form = new FormData();
  form.append("name", name);

  const resp = await apiFetch("wpcc_create_column", {
    method: "POST",
    body: form,
  });

  return resp.ok
    ? resp.json()
    : new Promise((resolve, reject) => {
        resp.json().then((json) => reject(json));
      });
};
