<?php
/**
 * Plugin Name:       IF.Entity-Loop
 * Description:       Get carousel with latest posts, pages, custom post types, filtered by taxonomy
 * Requires at least: 5.7
 * Requires PHP:      7.0
 * Version:           1.0.0
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

class IF_Entity_Loop
{

	// Base variables
	private $blockName;
	private $taxonomy;
	private $postType;
	private $imageSize;
	private $limit;

	public function __construct() {
		$this->blockName = 'ifdigital/entity-loop';
		$this->taxonomy  = 'filter';
		$this->postType  = 'portfolio';
		$this->imageSize = 'thumbnail';
		$this->limit     = 1;

		add_action( 'init', array($this, 'block_init') );
		add_action( 'enqueue_block_assets', array($this, 'post_enqueue') );
	}

	public function post_enqueue() {
		if ( has_block( $this->blockName ) ) {
			wp_enqueue_script( 'swiper', plugins_url( 'lib/swiper.js', __FILE__ ), '', '', true );
			wp_enqueue_script( $this->blockName . 'initswiper', plugins_url( 'lib/init.js', __FILE__ ), '', '', true );
		}
	}

	public function block_init() {
		register_block_type_from_metadata( __DIR__, [
			'render_callback' => array($this, 'block_render_callback'),
		]);
	}


	public function block_render_callback($attributes) {

		$category_ids = [];


		if(!empty($attributes['categories'])) {
			$category_ids = array_map(function($category) {
				return $category['id'];
			}, $attributes['categories']);
		}

		$post_args = [
			'posts_per_page' => $attributes['numberOfPosts'],
			'post_type' => 'portfolio',
			'post_status' => 'publish'
		];

		// Füge die tax_query hinzu, wenn Kategorien ausgewählt sind
		if (count($category_ids) > 0) {
			$post_args['tax_query'] = [
				[
					'taxonomy' => $this->taxonomy,
					'field' => 'term_id',
					'terms' => $category_ids,
				],
			];
		}

		$recent_posts = get_posts($post_args);

		$output = '<section ' . get_block_wrapper_attributes() . '>';
		$output .= '<div class="container-grid">';

		$output .= '<div class="swiper swiper-carousel" data-swiper-carousel>';
		$output .= '<div class="swiper-wrapper">';
		foreach($recent_posts as $post) {

			$title = get_the_title($post);
			$title = $title ? $title : __('(no title)', 'latest-posts');
			$permalink = get_permalink($post);
			$excerpt = get_the_excerpt($post);
			$terms = get_the_terms($post, 'filter');


			$output .= '<article class="swiper-slide wp-block-query-item">';

			if($attributes['displayFeaturedImage'] && has_post_thumbnail($post)) {
				$output .= '<div class="image-wrapper">';
				$output .= '<a href="'.esc_url($permalink).'">';
				$output .= get_the_post_thumbnail($post, 'thumbnail');
				$output .= '</a>';
				$output .= '</div>';
			}

			$output .= '<div class="content-wrapper">';

			$output .= '<span class="post-term">';
			if(!empty($terms && $terms[0])) {
				$output .= $terms[0]->name;
			}
			else {
				$output .= '&nbsp;';
			}
			$output .= '</span>';

			$output .= '<h3><a href="'.esc_url($permalink).'">' . $title . '</a></h3>';
			$output .= '</div>';

			$output .= '</article>';
		}
		$output .= '</div>';
		$output .= '</div>';
		$output .= '<div class="container-content">';
		$output .= '
		<!-- If we need navigation buttons -->
		<div class="swiper-buttons">
			<div class="buttons-wrapper">
			  <button class="swiper-button prev-slide" data-swiper-prev></button>
			  <button class="swiper-button next-slide" data-swiper-next></button>
		  	</div>
	  	</div>
		';
		$output .= '<div class="container-content-inner">';
		$output .= '<h2 class="small-title">' . $attributes['title'] . '</h2>';
		$output .= '<p>' . $attributes['description'] . '</p>';
		$output .= '</div>';
		$output .= '</div>';
		$output .= '</div>';
		$output .= '</section>';

		return $output;
	}
}

new IF_Entity_Loop();
