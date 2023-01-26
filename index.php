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

 function render_page()
 {
    echo 'test';
 }

 function create_page()
 {
     add_menu_page('Content Checklist','Content Checklist','edit_posts','content-checklist','render_page','dashicons-saved');
 }
 add_action('admin_menu','create_page');