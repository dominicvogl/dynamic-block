import { __ } from "@wordpress/i18n";
// import React, { useRef, useState } from "react";
import {
	useBlockProps,
	RichText,
	InspectorControls,
} from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { PanelBody, ToggleControl, QueryControls } from "@wordpress/components";
// import { RawHTML } from "@wordpress/element";
// import { format, dateI18n, getSettings } from "@wordpress/date";
import "./editor.scss";

// swiper JS
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		title,
		description,
		numberOfPosts,
		displayFeaturedImage,
		includedIds,
		order,
		orderBy,
		categories,
	} = attributes;

	const catIDs =
		categories && categories.length > 0
			? categories.map((cat) => cat.id)
			: [];

	// CALLBACKS
	/**
	 * set the new title in the attributes
	 * @param newText
	 */
	const onChangeTitle = (newText) => {
		setAttributes({ title: newText });
	};

	const onDisplayFeaturedImageChange = (value) => {
		setAttributes({ displayFeaturedImage: value });
	};
	const onNumberOfItemsChange = (value) => {
		setAttributes({ numberOfPosts: value });
	};

	/**
	 * set the new description in the attributes
	 * @param newText
	 */
	const onChangeDescription = (newText) => {
		setAttributes({ description: newText });
	};

	const allCats = useSelect((select) => {
		return select("core").getEntityRecords("taxonomy", "filter", {
			per_page: -1,
		});
	}, []);

	const catSuggestions = {};
	if (allCats) {
		for (let i = 0; i < allCats.length; i++) {
			const cat = allCats[i];
			catSuggestions[cat.name] = cat;
		}
	}

	const onCategoryChange = (values) => {
		const hasNoSuggestions = values.some(
			(value) => typeof value === "string" && !catSuggestions[value]
		);
		if (hasNoSuggestions) return;

		const updatedCats = values.map((token) => {
			return typeof token === "string" ? catSuggestions[token] : token;
		});

		setAttributes({ categories: updatedCats });
	};

	const { posts } = useSelect(
		(select) => {
			const postType = "portfolio";
			const { getEntityRecords } = select("core");
			const latestPostsQuery = {
				per_page: numberOfPosts,
				_embed: displayFeaturedImage,
				order,
				orderby: orderBy,
				filter: catIDs,
			};
			return {
				posts: getEntityRecords("postType", postType, latestPostsQuery),
			};
		},
		[numberOfPosts, displayFeaturedImage, order, orderBy, categories]
	);

	console.log(posts);

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<ToggleControl
						label={__("Display Featured Image", "latest-posts")}
						checked={displayFeaturedImage}
						onChange={onDisplayFeaturedImageChange}
					/>
					<QueryControls
						numberOfItems={numberOfPosts}
						onNumberOfItemsChange={onNumberOfItemsChange}
						maxItems={10}
						minItems={1}
						orderBy={orderBy}
						onOrderByChange={(value) =>
							setAttributes({ orderBy: value })
						}
						order={order}
						onOrderChange={(value) =>
							setAttributes({ order: value })
						}
						categorySuggestions={catSuggestions}
						selectedCategories={categories}
						onCategoryChange={onCategoryChange}
					/>
				</PanelBody>
			</InspectorControls>
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
									post._embedded["wp:featuredmedia"].length >
										0 &&
									post._embedded["wp:featuredmedia"][0];

								return (
									<SwiperSlide key={post.id}>
										<article>
											{displayFeaturedImage &&
												featuredImage && (
													<div
														className={
															"image-wrapper"
														}
													>
														<img
															src={
																featuredImage
																	.media_details
																	.sizes
																	.medium
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
		</>
	);
};

export default Edit;
