import path from "path";
import fs from "fs/promises";
import parsedFrontMatter from "front-matter";
import invariant from "tiny-invariant";
import { marked } from "marked";

export type Post = {
	slug: string;
	title: string;
};

type NewPost = {
  title: string;
  slug: string;
  markdown: string;
}

export type PostMarkdownAttributes = {
  title: string
};

const postsPath = path.join(__dirname, "..", "posts");

function isValidPostAttributes(
  attributes: any
): attributes is PostMarkdownAttributes {
  return attributes?.title
}

export const getPosts = async () => {
  const dir = await fs.readdir(postsPath);

  return Promise.all(
    dir.map(async (filename) => {
      const file = await fs.readFile(
        path.join(postsPath, filename)
      );
      const {attributes} = parsedFrontMatter(
        file.toString()
      );
      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad meta data!`
      );
      return {
        slug: filename.replace(/\.md$/, ""),
        title: attributes.title
      }
    })
  )
};

export async function getPost(slug: string) {
  const filepath = path.join(postsPath, slug + ".md");
  const file = await fs.readFile(filepath);
  const { attributes, body } = parsedFrontMatter(file.toString());
  invariant(
    isValidPostAttributes(attributes), 
    `Post ${filepath} is missing attributes`
  );
  const html = marked(body);
  return {
    slug, 
    html,
    title: attributes.title
  }
}

export async function createPost(post: NewPost) {
  const md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`;
  await fs.writeFile(
    path.join(postsPath, post.slug + ".md"),
    md
  )
  return getPost(post.slug);
}
















