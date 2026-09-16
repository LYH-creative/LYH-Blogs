import { visit } from "unist-util-visit";

/**
 * rehype 插件：将 math 节点内的 HTML 实体反转义
 * 解决 Astro markdown pipeline 中 & 被转义为 &amp; 导致 KaTeX 报错的问题
 */
export function rehypeUnescapeMath() {
	return (tree) => {
		visit(tree, "element", (node) => {
			const className = node.properties?.className;
			if (!className) return;

			const classes = Array.isArray(className) ? className : [className];
			const isMath =
				classes.includes("language-math") ||
				classes.includes("math") ||
				classes.includes("math-inline") ||
				classes.includes("math-display");

			if (!isMath) return;

			visit(node, "text", (textNode) => {
				if (typeof textNode.value === "string") {
					textNode.value = textNode.value
						.replace(/&amp;/g, "&")
						.replace(/&lt;/g, "<")
						.replace(/&gt;/g, ">")
						.replace(/&quot;/g, '"')
						.replace(/&#39;/g, "'");
				}
			});
		});
	};
}
