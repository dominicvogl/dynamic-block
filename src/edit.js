import { __ } from "@wordpress/i18n";
// import React, { useRef, useState } from "react";
import { useBlockProps, RichText } from "@wordpress/block-editor";
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

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const { title, description } = attributes;

	// CALLBACKS
	/**
	 * set the new title in the attributes
	 * @param newText
	 */
	const onChangeTitle = (newText) => {
		setAttributes({ title: newText });
	};

	/**
	 * set the new description in the attributes
	 * @param newText
	 */
	const onChangeDescription = (newText) => {
		setAttributes({ description: newText });
	};

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

	// console.log(posts);

	return (
		<section {...useBlockProps()}>
			<div className="container-grid">
				<Swiper
					spaceBetween={40}
					slidesPerView={3}
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
									<article>
										{displayFeaturedImage &&
											featuredImage && (
												<div
													className={"image-wrapper"}
												>
													<img
														src={
															featuredImage
																.media_details
																.sizes.medium
																.source_url
														}
														alt={
															featuredImage.alt_text
														}
													/>
												</div>
											)}
										<div className="content-wrapper">
											<span className={"post-term"}>
												&nbsp;
											</span>
											<h3>{post.title.rendered}</h3>
										</div>
									</article>
								</SwiperSlide>
							);
						})}
				</Swiper>
				<div className="container-content">
					<div className={"swiper-buttons"}></div>
					<div className={"container-content-inner"}>
						<RichText
							tagName="h2"
							className={"small-title"}
							value={title}
							onChange={onChangeTitle}
							placeholder={__(
								"Type in some headline",
								"if-entity-loop"
							)}
							allowedFormats={[]}
						/>
						<RichText
							tagName="p"
							value={description}
							onChange={onChangeDescription}
							placeholder={__(
								"Type in some Content",
								"if-entity-loop"
							)}
							allowedFormats={[]}
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Edit;
