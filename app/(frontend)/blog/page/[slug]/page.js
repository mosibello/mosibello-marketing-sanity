import TemplateArchiveVariant01 from "@/components/templates/archive/TemplateArchiveVariant01";
import { paginatedItemsPerPage } from "@/lib/constants";
import {
  getTotalNumberOfPaginatedPages,
  isLastPaginatedPage,
} from "@/lib/helpers";
import { getMetaData } from "@/lib/seo";
import { getPosts, getPostsCount } from "@/sanity/utils/queries";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { generateBlogHeroData, generateBlogMetaData } from "@/lib/constants";

const totalNumberOfPosts = await getPostsCount();
const totalNumberOfPaginatedPages = getTotalNumberOfPaginatedPages(
  totalNumberOfPosts,
  paginatedItemsPerPage
);

export default async function BlogArchivePaginated({ params }) {
  const { slug } = params;
  if (isNaN(parseFloat(slug))) {
    return notFound();
  }
  if (slug === `1`) {
    redirect(`/blog`);
  }
  const start = slug * paginatedItemsPerPage - paginatedItemsPerPage;
  const end = slug * paginatedItemsPerPage;
  const lastPaginatedPage = isLastPaginatedPage(
    totalNumberOfPaginatedPages,
    parseFloat(slug)
  );
  const data = await getPosts(start, end);
  if (!data || data.length === 0) {
    return notFound();
  }
  const heroData = generateBlogHeroData(slug);

  return (
    <TemplateArchiveVariant01
      heroData={heroData}
      bodyData={data}
      prevPageDestination={
        parseFloat(slug) === 2 ? `/blog` : `/blog/page/${parseFloat(slug) - 1}`
      }
      nextPageDestination={
        lastPaginatedPage ? null : `/blog/page/${parseFloat(slug) + 1}`
      }
    />
  );
}

export const generateMetadata = async ({ params }) => {
  const { slug } = params;
  if (isNaN(parseFloat(slug))) {
    return {};
  }
  const start = slug * paginatedItemsPerPage - paginatedItemsPerPage;
  const end = slug * paginatedItemsPerPage;
  const data = await getPosts(start, end);
  if (!data || data.length === 0) {
    return {};
  }
  const lastPaginatedPage = isLastPaginatedPage(
    totalNumberOfPaginatedPages,
    parseFloat(slug)
  );
  const staticMetaData = generateBlogMetaData(slug);
  return getMetaData(
    staticMetaData,
    `blog/page/${slug}`,
    `${slug == "2" ? `blog` : `blog/page/${parseFloat(slug) - 1}`}`,
    lastPaginatedPage ? null : `blog/page/${parseFloat(slug) + 1}`
  );
};