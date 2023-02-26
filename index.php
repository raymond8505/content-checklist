<?php
/**
 * Plugin Name: Content Checklist
 * Description: Create a checklist for managing content changes across your whole site. Each item can be be associated with custom hooks you develop to automatically check and fix the issue. 
 * Version: 0.1.0
 * Author: Raymond Selzer
 * Author URI: http://www.raymondselzer.net
 * License: GPL v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: content-checklist
*/
$is_localhost = isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === 'http://127.0.0.1:5173';

$action_root = $is_localhost ? 'wp_ajax_nopriv' : 'wp_ajax';

$current_page = admin_url( "admin.php?page=".$_GET["page"] );

function render_page()
{
    $app_url = plugin_dir_url('/content-checklist/wp-content-checklist/dist/index.html');

    $app_url .= '?ajaxurl=' . admin_url( 'admin-ajax.php' );

    echo '<iframe style="width: 100%; height: calc(100vh - 4em)" src="'. $app_url . '"></iframe>';

}

function init_client()
{
    global $is_localhost;
    //new dBug($_SERVER);
    $all_posts = new WP_Query([
        'post_type'=>'post',
        'orderby'=>'post_title',
        'order'=>'asc',
        'posts_per_page'=>-1
    ]);

    $columns = get_option('wpcc_columns');

    $posts_for_client = [];

    foreach($all_posts->posts as $post)
    {
        $post_columns = get_post_meta( $post->ID, 'wpcc_columns', true );
        
        $post_for_client = [
            'title'=>$post->post_title,
            'ID'=>$post->ID,
            'columns'=>$post_columns ? $post_columns : array(),
            'urls'=>[
                'view'=>get_permalink( $post ),
                'edit'=>$is_localhost ? 'http://localhost/raymondsfood/wp-admin/post.php?post=' . $post->ID . '&action=edit' 
                : get_edit_post_link( $post )
            ]
        ];

        $posts_for_client[] = $post_for_client;
    }

    die(json_encode([
        'posts'=>$posts_for_client,
        'columns'=>$columns
    ]));
}
function get_columns()
{
    return get_option('wpcc_columns');
}
function update_columns($columns)
{
    return update_option('wpcc_columns',$columns);
}
function init_playground()
{
    global $current_page;

    $columns = get_columns();

    //new dBug($columns);

    echo '<script src="' . plugin_dir_url('/content-checklist/playground/playground.js') . 'playground.js"></script>';

    echo '<h3>';
    foreach($columns as $i=>$column)
    {
        $slug = $column['slug'];
        $name = $column['name'];
        
        $check_func = slug_to_function($slug,'check');
        $fix_func = slug_to_function($slug,'fix');

        if(function_exists($check_func))
        {
            echo '<a href="' . $current_page . '&func=check&slug=' . $slug . '">Check ' . $name . '</a> | ';
        }

        if(function_exists($fix_func))
        {
            echo '<a href="' . $current_page . '&func=fix&slug=' . $slug . '">Fix ' . $name . '</a> | ';
        }
    }
    echo '</h3>';

    $func = isset($_REQUEST['func']) ? $_REQUEST['func'] : '';
    $slug = isset($_REQUEST['slug']) ? $_REQUEST['slug'] : '';
    $php_func = slug_to_function($slug,$func);

    if(isset($func) && isset($slug) && function_exists($php_func))
    {
        echo '<h2>' . $func . ' ' . $name . '</h2><hr />';
        echo '<div id="viewer">';
        
            echo call_user_func($php_func,$slug);

        echo '</div>';
    }

    echo '<hr /><h2>End Of Output</h2>';
}
function init()
{
    add_menu_page('Content Checklist','Content Checklist','edit_posts','content-checklist','render_page','dashicons-saved');
    
    add_submenu_page('content-checklist','Automation Playground','Playground','edit_posts','content-checklist__playground','init_playground');
    
    $columns = get_columns();

    if(!$columns)
    {
        add_option('wpcc_columns',[]);
    }
}

function create_column()
{
    $name = $_POST['name'];

    if($name === '') 
    {
        http_response_code(400);
        die ('{"error":"name is empty"}');
    }

    $columns = get_columns();

    $column_exists = false;

    foreach($columns as $column)
    {
        if($column['name'] === $name)
        {
            $column_exists = true;
            break;
        }
    }

    if($column_exists)
    {
        http_response_code(400);
        die ('{"error":"column exists"}');
    }

    $column = [
        "name" => $name,
        "slug" => sanitize_title($name)
    ];

    $columns[] = $column;

    update_columns($columns);
    http_response_code(200);
    die(json_encode([
        "success" => "Success!",
        "column" => $column
    ]));
}
function get_column_by_slug($slug,$columns)
{
    $columns = $columns ? $columns : get_columns();

    foreach($columns as $col)
    {
        if($col['slug'] === $slug) return $col;
    }

    return null;
}
function delete_column()
{
    $columns = get_columns();
    $slug_to_delete = $_POST['slug'];

    $new_columns = [];
    

    foreach($columns as $col)
    {
        if($col['slug'] !== $slug_to_delete)
        {
            $new_columns[] = $col;
        }
    }

    update_columns($new_columns);

    die('{success:"Success!"}');
}

function check_posts($func,$slug)
{
    call_user_func($func,$slug);
}
function slug_to_function($slug,$func_type)
{
    return 'wpcc_' . $func_type . '_' . str_replace('-','_',$slug);
}
function check_column()
{
    $slug = $_POST['slug'];

    $func = slug_to_function($slug,'check');

    if(function_exists($func))
    {
        check_posts($func,$slug);
        die('{"success":"' . $slug . '"}');
    }
    else
    {
        http_response_code(400);
        die('{"error":"' . $func . '"}');
    }

    die();
}

function fix_column()
{
    $slug = $_POST['slug'];

    $func = slug_to_function($slug,'fix');

    if(function_exists($func))
    {
        //fix_posts($func);
    }
    else
    {
        http_response_code(400);
        die('{"error":"' . $func . '"}');
    }

    die();
}

/**
 * $slug column slug
 * $post_id
 * $val
 * [$overwrite_if] default null only overwrite the column value if its current value is in the array
 */
function wpcc_set_column($slug,$post_id,$val,$overwrite_if = null)
{
    $has_meta = metadata_exists('post',$post_id,'wpcc_columns');
    $columns = $has_meta ? get_post_meta( $post_id, 'wpcc_columns', true ) : [];

    if($overwrite_if === null || array_search($columns[$slug],$overwrite_if) !== FALSE)
    {
        $columns[$slug] = $val;
    }

    if($has_meta)
    {
        
        update_post_meta( $post_id,'wpcc_columns' , $columns );
    }
    else
    {
        add_post_meta( $post_id,'wpcc_columns' , $columns );
    }
}

function update_post()
{
    $post = json_decode(str_replace('\\"','"',$_REQUEST['post']));

    foreach($post->columns as $column=>$val)
    {
        wpcc_set_column($column,$post->ID,$val);
    }
    
    die('{"success":"success"}');
}

function fix_post_column()
{
    $func = slug_to_function($_POST['column'],'fix');
    $func =  $func . '_single';

    if(function_exists($func))
    {
        call_user_func($func,$_POST['post'],$_POST['column']);
    }
    die('{"error":"error"}');
}

add_action('admin_menu','init');
add_action($action_root . '_wpcc_init','init_client');
add_action($action_root . '_wpcc_create_column','create_column');
add_action($action_root . '_wpcc_delete_column','delete_column');
add_action($action_root . '_wpcc_check_column','check_column');
add_action($action_root . '_wpcc_fix_column','fix_column');
add_action($action_root . '_wpcc_update_post','update_post');
add_action($action_root . '_wpcc_fix_post_column','fix_post_column');