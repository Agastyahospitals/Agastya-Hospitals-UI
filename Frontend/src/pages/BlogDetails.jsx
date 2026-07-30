import axios from "axios";
import { format } from "date-fns";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchBlogs } from "../slices/blogSlice";
import { setBreadcrumb, setTitle } from "../slices/breadcrumbSlice";

const BlogDetails = () => {
  const [blogData, setBlogData] = useState(null);
  const { urlSlug: urlSlug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: blogs } = useSelector((state) => {
    console.log(state);
    return state.blogs.blogs;
  });

  const matchedBlog = () => {
    let title;
    blogs?.map((blog) => {
      if (blog.url === urlSlug) {
        title = blog.title;
      }
    });
    return title;
  };

  const fetchBlogsData = async () => {
    try {
      const res = await axios.get(
        "https://agastya-hospitals-backend.onrender.com/api/blogs",
        { params: { url: urlSlug } }
      );
      setBlogData(res.data.data[0]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setBlogData(null);
    fetchBlogsData();
    dispatch(fetchBlogs());
  }, [urlSlug]);

  // Update breadcrumb and title once blog data is loaded
  useEffect(() => {
    if (blogData?.title) {
      dispatch(setBreadcrumb(["Home", "Blog"]));
      dispatch(setTitle(blogData.title));
    }
  }, [blogData, dispatch]);

  const sortedBlogs = [...(blogs || [])].sort(
    (a, b) => new Date(b.dateOfPost) - new Date(a.dateOfPost)
  );

  const gotoBlogDetails = (slug) => {
    dispatch(setBreadcrumb(["Home", "Blog"]));
    navigate(`/blog/${slug}`);
  };

  if (!blogData) {
    return (
      <div className="container py-5">
        <div className="row m-0">
          <div className="col-lg-8 col-md-8 col-sm-8 col-xs-12">
            <div className="text-center">
              <div className="spinner-grow text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blogData.title} | Agastya Hospitals</title>
        <meta name="description" content={blogData.metaDescription} />
        <meta name="keywords" content={blogData.metaKeywords} />
        <meta name="author" content={blogData.authorName} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://agastyahospitals.com/blog/${blogData.url}`} />

        {/* Open Graph */}
        <meta property="og:title" content={blogData.title} />
        <meta property="og:description" content={blogData.metaDescription} />
        <meta property="og:image" content={blogData.postBanner} />
        <meta property="og:url" content={`https://agastyahospitals.com/blog/${blogData.url}`} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Agastya Hospitals" />
        <meta property="article:published_time" content={blogData.dateOfPost} />
        <meta property="article:author" content={blogData.authorName} />
        <meta property="article:section" content={blogData.category} />
        {blogData.tags?.map((tag, index) => (
          <meta property="article:tag" content={tag} key={index} />
        ))}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blogData.title} />
        <meta name="twitter:description" content={blogData.metaDescription} />
        <meta name="twitter:image" content={blogData.postBanner} />

        {/* JSON-LD BlogPosting Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blogData.title,
            "description": blogData.metaDescription,
            "image": blogData.postBanner,
            "author": {
              "@type": "Person",
              "name": blogData.authorName || "Agastya Hospitals"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Agastya Hospitals",
              "url": "https://agastyahospitals.com"
            },
            "datePublished": blogData.dateOfPost,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://agastyahospitals.com/blog/${blogData.url}`
            },
            "keywords": blogData.metaKeywords
          })}
        </script>
      </Helmet>
    <div className="container py-5">
      <div className="row m-0">
        <div className="col-lg-8 col-md-8 col-sm-8 col-xs-12">
          <h2 className="f-30 f-w-700">{blogData.title}</h2>
          <div className="mt-4">
            <img
              className="rounded-5"
              src={blogData.postBanner}
              style={{ height: "200px", width: "100%" }}
            />
          </div>
          <p className="f-16 text-muted mt-4 " style={{ color: "#999999" }}>
            by {blogData.authorName || "Admin"} | {format(new Date(blogData.dateOfPost), "MMM dd, yyyy")}
          </p>
          <div className="mt-3 ql-snow">
            <p
              className="f-14 ql-editor"
              dangerouslySetInnerHTML={{ __html: blogData.blogContent }}
            />
          </div>
        </div>
        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
          <div className="rounded-5 bg-light p-4 mx-2">
            <h2 className="f-30 f-w-700 mb-3">Recent Posts</h2>
            <ul>
              {sortedBlogs.slice(0, 5).map((data) => (
                <li
                  key={data.blogID}
                  className="mb-4 inline-flex"
                //onClick={() => gotoBlogDetails(data.url)}
                >
                  <span>
                    <svg
                      width="10"
                      height="13"
                      viewBox="0 0 10 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.07997 9.10217L1.11029 16.0718C0.969643 16.2125 0.890625 16.4033 0.890625 16.6022C0.890625 16.8011 0.969643 16.9919 1.11029 17.1325C1.25095 17.2732 1.44171 17.3522 1.64062 17.3522C1.83954 17.3522 2.0303 17.2732 2.17096 17.1325L9.67095 9.6325C9.96385 9.33961 9.96385 8.86474 9.67095 8.57184L2.17096 1.07184C2.0303 0.93119 1.83954 0.852173 1.64062 0.852173C1.44171 0.852173 1.25095 0.93119 1.11029 1.07184C0.969643 1.2125 0.890625 1.40326 0.890625 1.60217C0.890625 1.80109 0.969643 1.99185 1.11029 2.1325L8.07997 9.10217Z"
                        fill="#1C1C1C"
                      />
                    </svg>
                  </span>
                  &nbsp;
                  <span className="f-14">
                    <Link to={`/blog/${data.url}`} onClick={() => dispatch(setBreadcrumb(["Home", "Blog"]))}>
                      {data.title}
                    </Link>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-5 bg-light p-4 mx-2 mt-5">
            <h2 className="f-30 f-w-700 mb-3">Tags</h2>
            <p>
              {blogData.tags.map((tag, index) => (
                <span key={index} className="f-14">
                  {tag}
                  {blogData.tags.length === index + 1 ? " " : ", "}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default BlogDetails;
