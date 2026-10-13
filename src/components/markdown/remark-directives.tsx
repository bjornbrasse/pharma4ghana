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
