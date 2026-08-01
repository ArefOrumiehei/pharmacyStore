import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router";

// Components
import Breadcrumb from "../../components/common/breadcrumb/Breadcrumb";
import CompetitiveAdvantages from "./_components/competitiveAdvantages/CompetitiveAdvantages";
import ProductGallery from "./_components/productGallery/ProductGallery";
import ProductInfo from "./_components/productInfo/ProductInfo";
import PurchasePanel from "./_components/purchasePanel/PurchasePanel";
import ProductSpecifications from "./_components/productSpecifications/ProductSpecifications";
import ProductTabs from "./_components/productTabs/ProductTabs";
import { TabsSkeleton } from "./_components/skeletons/TabsSkeleton";
import { SpecificationsSkeleton } from "./_components/skeletons/SpecificationsSkeleton";

// Stores
import { useProductStore } from "@/store/useProductsStore";

// Types
import type { ProductComment, ProductImage } from "./types/productPageTypes";

export default function ProductPage() {
  const { fetchProductByName, product } = useProductStore();

  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [activeImage, setActiveImage] = useState(0);

  const { catgSlug, pSlug } = useParams<{ catgSlug: string; pSlug: string }>();
  const decodedCatgSlug = catgSlug ? decodeURIComponent(catgSlug) : "";
  const isLoaded = !!product;

  useEffect(() => {
    if (pSlug) fetchProductByName(`${catgSlug}/${pSlug}`);

    setActiveTab("description");
  }, [catgSlug, pSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (product) {
      setActiveImage(0);
    }
  }, [product]);

  const images = useMemo<ProductImage[]>(() => {
    if (!product) return [];
    return [
      { picture: product.picture, pictureAlt: product.pictureAlt },
      ...((product.pictures ?? []) as ProductImage[]).filter((p) => !p.isRemoved),
    ];
  }, [product]);

  const displayPrice = useMemo(() => (product?.hasDiscount ? product.priceWithDiscount : product?.price), [product]);

  return (
    <div className="flex flex-col gap-6 w-full py-6" dir="rtl">
      <Breadcrumb categories={decodedCatgSlug} />

      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_280px] gap-4">
        <ProductGallery isLoaded={isLoaded} product={product} images={images} activeImage={activeImage} onChangeImage={setActiveImage} />
        <ProductInfo isLoaded={isLoaded} product={product} />
        <PurchasePanel
          isLoaded={isLoaded}
          product={product}
          displayPrice={displayPrice}
        />
      </div>

      <CompetitiveAdvantages />

      {isLoaded ? (
        <ProductSpecifications specifications={product.specifications} />
      ) : (
        <SpecificationsSkeleton />
      )}

      {isLoaded ? (
        <ProductTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          description={product.description ?? ""}
          productId={product.id}
          comments={Array.isArray(product.comments) ? (product.comments as ProductComment[]) : []}
        />
      ) : (
        <TabsSkeleton />
      )}
    </div>
  );
}