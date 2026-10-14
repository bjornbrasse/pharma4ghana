import type { Root } from "mdast";
import "mdast-util-directive";
import { visit } from "unist-util-visit";

export function remarkDirectives() {
  return (tree: Root) => {
    visit(tree, "textDirective", (node) => {
      if (node.name !== "highlight") {
        return;
      }

      const data = node.data ?? (node.data = {});
      data.hName = "mark";
    });

    visit(tree, "leafDirective", (node) => {
      if (node.name === "image") {
        const imageId = node.children[0]?.type === "text" ? node.children[0].value : undefined;
        if (!imageId) return;

        const data = node.data ?? (node.data = {});
        data.hName = "div";
        data.hProperties = {
          ...data.hProperties,
          "data-component": "image",
          "data-image-id": imageId,
        };
        return;
      }

      if (node.name !== "blog" || typeof node.attributes?.slug !== "string") {
        return;
      }

      const data = node.data ?? (node.data = {});
      data.hName = "div";
      data.hProperties = {
        ...data.hProperties,
        "data-component": "blog",
        "data-blog-slug": node.attributes.slug,
      };
    });

    visit(tree, "containerDirective", (node) => {
      const data = node.data ?? (node.data = {});

      data.hName = "div";
      data.hProperties = {
        ...data.hProperties,
        "data-component": node.name,
      };
    });
  };
}
