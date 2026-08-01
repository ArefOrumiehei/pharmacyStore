import type { ProductMetaProps } from "@/pages/product/types/productPageTypes";
import { MetaRow } from "../../../shared/metaRow/MetaRow";

export default function ProductMeta({ isLoaded, product }: ProductMetaProps) {
  if (!isLoaded) {
    return (
      <div className="flex flex-col gap-1.5 sm:gap-2">
        <div className="h-4 sm:h-5 w-36 sm:w-48 bg-blue-50 animate-pulse rounded" />
        <div className="h-4 sm:h-5 w-28 sm:w-36 bg-blue-50 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:gap-2.5">
      <MetaRow
        label="دسته بندی"
        value={product?.categoryName}
        href={`/plp/${product?.categoryFullSlug}`}
      />
      <MetaRow
        label="برند"
        value={product?.brand}
        href={product?.brand ? `/plp?brand=${product?.brand}` : undefined}
      />
    </div>
  );
}