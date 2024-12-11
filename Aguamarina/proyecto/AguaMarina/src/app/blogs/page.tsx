import SingleBlog from "@/components/Clients/Blog/SingleBlog";
import Breadcrumb from "@/components/Clients/Common/Breadcrumb";
import ClienteLayout from "@/components/Layouts/ClienteLayout";
import { getAllPosts } from "@/utils/markdown";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Blog Grids | Play SaaS Starter Kit and Boilerplate for Next.js",
  description: "Blog grids page description",
};

const Blog = () => {
  const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug"]);

  return (
    <ClienteLayout>
    <>
      <Breadcrumb pageName="Blog Grids" />

      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            {posts.map((blog, i) => (
              <div key={i} className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3">
                <SingleBlog blog={blog} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
    </ClienteLayout>
  );
};

export default Blog;
