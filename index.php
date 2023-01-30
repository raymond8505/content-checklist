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
$is_localhost = $_SERVER['HTTP_HOST'] === 'localhost';

$action_root = $is_localhost ? 'wp_ajax_nopriv' : 'wp_ajax';

function render_page()
{
    echo 'test';
}

function init_client()
{
    global $is_localhost;
    
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
function init()
{
    add_menu_page('Content Checklist','Content Checklist','edit_posts','content-checklist','render_page','dashicons-saved');
    
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
{+
    call_user_func($func,$slug);
}

function check_column()
{
    $slug = $_POST['slug'];

    $func = 'wpcc_check_' . str_replace('-','_',$slug);

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

    $func = 'wpcc_fix_' . str_replace('-','_',$slug);

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

function wpcc_set_column($slug,$id,$val)
{
    $has_meta = metadata_exists('post',$id,'wpcc_columns');
    $columns = $has_meta ? get_post_meta( $id, 'wpcc_columns', true ) : [];

    $columns[$slug] = $val;

    if($has_meta)
    {
        update_post_meta( $id,'wpcc_columns' , $columns );
    }
    else
    {
        add_post_meta( $id,'wpcc_columns' , $columns );
    }
}
add_action('admin_menu','init');
add_action($action_root . '_wpcc_init','init_client');
add_action($action_root . '_wpcc_create_column','create_column');
add_action($action_root . '_wpcc_delete_column','delete_column');
add_action($action_root . '_wpcc_check_column','check_column');
add_action($action_root . '_wpcc_fix_column','fix_column');