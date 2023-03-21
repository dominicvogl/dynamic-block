import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import "./editor.scss";

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
		<p {...useBlockProps()}>
			{__("Boilerplate – hello from the editor!", "boilerplate")}
		</p>
	);
}
