import { fetchSanity, groq } from "@/sanity/utils/fetch";
import { QUERY_omitDrafts } from "@/sanity/utils/constants";

export default async function sitemap() {
  const allPages = await fetchSanity(
    groq`{
        'pages': *[
            _type == 'page'  &&
            seo_no_index != true && ${QUERY_omitDrafts} 
        ]|order(slug.current){
            'url': $baseUrl + select(slug.current == 'index' => '', slug.current),
            'lastModified': _updatedAt,
        }
        ,
        'posts': *[_type == 'post' && seo_no_index != true && ${QUERY_omitDrafts}]|order(name){
            'url': $baseUrl + 'blog/' + slug.current,
            'lastModified': _updatedAt,
        },
        'post_categories': *[_type == 'post_category' && seo_no_index != true && ${QUERY_omitDrafts}]|order(name){
            'url': $baseUrl + 'blog/category/' + slug.current,
            'lastModified': _updatedAt,
        },
        'static_pages': {
            'url': $baseUrl + 'blog',
            'lastModified': *[_type == "post" && ${QUERY_omitDrafts} && seo_no_index != true] | order(publish_date desc)[0...1] {"publish_date": publish_date + "T00:00:00Z"}["publish_date"],
        }
    }`,
    { baseUrl: process.env.NEXT_PUBLIC_BASE_URL + "/" }
  );

  return Object.values(allPages).flat();
}
