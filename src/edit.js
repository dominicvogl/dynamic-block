import { __ } from "@wordpress/i18n";
// import React, { useRef, useState } from "react";
import { useBlockProps } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { RawHTML } from "@wordpress/element";
import { format, dateI18n, getSettings } from "@wordpress/date";
import "./editor.scss";

// swiper JS
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

export default function Edit({ attributes }) {
	const { numberOfPosts, displayFeaturedImage } = attributes;
	const { posts } = useSelect(
		(select) => {
			const postType = "portfolio";
			const { getEntityRecords } = select("core");
			const latestPostsQuery = {
				per_page: numberOfPosts,
				_embed: displayFeaturedImage,
			};
			return {
				posts: getEntityRecords("postType", postType, latestPostsQuery),
			};
		},
		[numberOfPosts, displayFeaturedImage]
	);

	console.log(posts);

	return (
		<section {...useBlockProps()}>
			<Swiper
				modules={[Navigation]}
				navigation={true}
				spaceBetween={50}
				slidesPerView={3}
				onSlideChange={() => console.log("slide change")}
				onSwiper={(swiper) => console.log(swiper)}
			>
				{posts &&
					posts.map((post) => {
						const featuredImage =
							post._embedded &&
							post._embedded["wp:featuredmedia"] &&
							post._embedded["wp:featuredmedia"].length > 0 &&
							post._embedded["wp:featuredmedia"][0];

						return (
							<SwiperSlide key={post.id}>
								<div>
									{displayFeaturedImage && featuredImage && (
										<img
											src={
												featuredImage.media_details
													.sizes.medium.source_url
											}
											alt={featuredImage.alt_text}
										/>
									)}
									<h3>
										<a href={post.link}>
											{post.title.rendered ? (
												<RawHTML>
													{post.title.rendered}
												</RawHTML>
											) : (
												__("No title", "dynamic-block")
											)}
										</a>
									</h3>
									{post.date_gmt && (
										<time
											dateTime={format(
												"c",
												post.date_gmt
											)}
										>
											{dateI18n(
												getSettings().formats.date,
												post.date_gmt
											)}
										</time>
									)}
									{post.excerpt.rendered && (
										<RawHTML>
											{post.excerpt.rendered}
										</RawHTML>
									)}
								</div>
							</SwiperSlide>
						);
					})}
			</Swiper>
		</section>
	);
}
