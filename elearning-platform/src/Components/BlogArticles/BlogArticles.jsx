import { useState } from "react";

import "./BlogArticles.css";

import ArticlesCard from "../../Cards/ArticlesCard/ArticlesCard";
import articles from "../../Data/articles/articles";

const CATEGORIES = ["All", "Business", "Culture", "Learning Tips", "Study Abroad"];

function BlogArticles() {

    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");


    const filteredArticles = articles.filter((article) => {

        const matchesCategory = activeCategory === "All" || article.category === activeCategory;

        const matchesSearch = article.title
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase());

        return matchesCategory && matchesSearch;

    });

    return (
        <section className="BlogArticles">
            <div className="BlogArticles-container">

                <div className="BlogArticlesFilters">

                    <div className="BlogArticlesCategories">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                type="button"
                                className={activeCategory === category ? "active" : ""}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="BlogArticlesSearch">
                        <i className="fa-solid fa-magnifying-glass"></i>

                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search articles"
                        />
                    </div>

                </div>

                {filteredArticles.length > 0 ? (

                    <div className="BlogArticlesCards">
                        {filteredArticles.map((article) => (
                            <ArticlesCard
                                key={article.id}
                                article={article}
                            />
                        ))}
                    </div>

                ) : (

                    <div className="BlogArticlesEmpty">
                        <i className="fa-regular fa-face-frown"></i>
                        <p>No articles match your search.</p>
                    </div>

                )}

            </div>
        </section>
    );
}

export default BlogArticles;
