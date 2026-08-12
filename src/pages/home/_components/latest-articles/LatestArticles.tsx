import { useEffect } from "react";
import { useArticleStore } from "@/store/useArticlsStore";

// Components
import ArticleCard from "./_components/articleCard/ArticleCard";
import ArticleCardSkeleton from "./_components/articleCard/_components/articleCardSkeleton/ArticleCardSkeleton";
import ArticlesSectionHeader from "./_components/articlesSectionHeader/ArticlesSectionHeader";
import ArticlesEmptyState from "./_components/articlesEmptyState/ArticlesEmptyState";

export default function LatestArticles() {
  const { latestArticles, loading, fetchLatestArticles } = useArticleStore();

  useEffect(() => {
    fetchLatestArticles();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isEmpty = !loading.latest && (latestArticles.length ?? 0) === 0;

  return (
    <section className="flex flex-col gap-3 sm:gap-4" dir="rtl">
      <ArticlesSectionHeader
        title="جدیدترین مقالات"
        subtitle="آخرین محتوای منتشر شده در فارماپلاس"
        showViewAll={(!isEmpty && !loading.latest) && latestArticles.length > 4}
      />

      {loading.latest && (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading.latest && !isEmpty && (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {latestArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {isEmpty && <ArticlesEmptyState />}
    </section>
  );
}