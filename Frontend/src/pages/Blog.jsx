import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../slices/blogSlice";
import BlogCards from "../components/pages/BlogCards";
import SEO from "../components/SEO";

const Blog = () => {
  // const [blogsData, setBlogsData] = useState([]);

  const dispatch = useDispatch();
  const {
    data: blogs,
    loading,
    error,
  } = useSelector((state) => {
    console.log(state);
    return state.blogs.blogs;
  });

  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    dispatch(fetchBlogs());
  }, [dispatch]);


  return (
    <div className="container py-5">
      <SEO
        title="Health Blog - Medical Articles & Health Tips"
        description="Read the latest health articles, medical tips, and wellness blogs from Agastya Hospitals, LB Nagar, Hyderabad. Expert insights on diseases, treatments, and healthy living."
        canonical="/blog"
      />
      {loading ? (
        <div className="text-center">
          <div
            className="spinner-grow text-primary"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-center">Loading...</p>
        </div>
      ) : (
        <BlogCards />
      )}
    </div>
  );
};

export default Blog;

