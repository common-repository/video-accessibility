<?php
/**
 * Plugin Name: Video Accessibility
 * Description: Display video transcripts next to embeds, toggle between two videos, and display a site-wide statement all in a single block.
 * Version: 1.0.6
 * Author: Ford Foundation, WDG
 * Author URI: https://fordfoundation.org
 * Text Domain: video-accessibility
 * Requires at least: 6.2
 * Requires PHP: 8.0
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

/**
 * The path to plugin file itself
 *
 * @var string
 */
define( 'VIDEO_ACCESSIBILITY_FILE', __FILE__ );

/**
 * The path to the plugin directory
 *
 * @var string
 */
define( 'VIDEO_ACCESSIBILITY_DIR', __DIR__ );

/**
 * The URI to the plugin directory to use when registering assets
 *
 * @var string
 */
define( 'VIDEO_ACCESSIBILITY_URI', str_replace( ABSPATH, rtrim( home_url(), '/' ) . '/', VIDEO_ACCESSIBILITY_DIR ) );

require_once VIDEO_ACCESSIBILITY_DIR . '/includes/functions.php';

add_action( 'init', 'video_accessibility_init' );
add_action( 'rest_api_init', 'video_accessibility_rest_api_init' );
add_filter( 'render_block_core/embed', 'video_accessibility_render_core_embed', 10, 3 );
add_filter( 'render_block_core/video', 'video_accessibility_render_core_video', 10, 3 );
add_filter( 'plugin_action_links_video-accessibility/video-accessibility.php', 'filter_plugin_action_links' );

if ( is_admin() ) {
	require_once VIDEO_ACCESSIBILITY_DIR . '/includes/admin.php';

	add_action( 'admin_init', 'video_accessibility_admin_init' );
	add_action( 'admin_menu', 'video_accessibility_admin_menu' );
}
