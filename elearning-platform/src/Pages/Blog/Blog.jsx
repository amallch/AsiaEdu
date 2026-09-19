import Footer from "../../Layout/Footer/Footer";
import BlogArticles from "../../Components/BlogArticles/BlogArticles";

import Hero from "../../Components/Hero/Hero";


function Blog() {
    return (
        <>
            <Hero
                center
                badge="Our Blog"
                title="Latest"
                highlight="Articles"
                description="Explore expert tips, language learning guides, and cultural insights to support your learning journey."
            />
            <BlogArticles/>
            {/* Blog components will go here */}

            <Footer />
        </>
    );
}

export default Blog;