import { useStore } from "../store";

export const apiHost =
  typeof ajaxurl === "undefined"
    ? "http://localhost/raymondsfood/wp-admin/admin-ajax.php"
    : ajaxurl;

/**
 * updates posts and columns from the server
 * @param {Function} cb
 */
export const useServerUpdate = (cb = () => {}) => {
  const { setPosts, setColumns } = useStore();

  return () => {
    fetch(`${apiHost}?action=wpcc_init`).then((resp) => {
      resp.json().then((json) => {
        setPosts(json.posts);
        setColumns(json.columns);
        cb();
      });
    });
  };
};
