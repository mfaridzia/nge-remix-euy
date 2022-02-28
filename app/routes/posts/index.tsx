import { useLoaderData, LoaderFunction, Link } from "remix";
import { Post, getPosts } from "~/post";

export const loader: LoaderFunction = async () => {
	return getPosts();
}

export default function Posts() {
  const posts = useLoaderData<Post[]>();

  return (
    <main>
      <h1>Posts</h1>
			<ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}