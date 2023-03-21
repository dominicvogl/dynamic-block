<?php
/**
 * Plugin Name:       Latest Posts Block
 * Description:       Latest Posts lOop.
 * Requires at least: 5.7
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Dominic Vogl
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       latest-posts
 *
 * @package           create-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
 */
function render_loop() {

}

function dominic_vogl_latest_posts_block_render_callback($attributes) {
	var_dump($attributes);

	$post_args = [
		'posts_per_page' => $attributes['numberOfPosts'],
		'post_type' => 'portfolio',
		'post_status' => 'publish'
	];

	$recent_posts = get_posts($post_args);
//	var_dump($recent_posts);

	$output = '<ul ' . get_block_wrapper_attributes() . '>';
	foreach($recent_posts as $post) {
		$title = get_the_title($post);
		$title = $title ? $title : __('(no title)', 'latest-posts');
		$permalink = get_permalink($post);
		$excerpt = get_the_excerpt($post);

		$output .= '<li>';

		if($attributes['displayFeaturedImage'] && has_post_thumbnail($post)) {
			$output .= '<div class="post-thumbnail">';
			$output .= get_the_post_thumbnail($post, 'thumbnail');
			$output .= '</div>';
		}

		$output .= '<h3><a href="'.esc_url($permalink).'">' . $title . '</a></h3>';
		$output .= '<time datetime="'.esc_attr(get_the_date('c', $post)).'">'.esc_html(get_the_date('', $post)).'</time>';
		if(!empty($excerpt)) {
			$output .= '<p>' . $excerpt . '</p>';
		}
		$output .= '</li>';
	}
	$output .= '</ul>';


	return $output;
}

function dominic_vogl_latest_posts_block_init() {
	register_block_type_from_metadata( __DIR__, [
		'render_callback' => 'dominic_vogl_latest_posts_block_render_callback',
	]);
}
add_action( 'init', 'dominic_vogl_latest_posts_block_init' );
