import { IMAGE_BASE } from "@/apis/apiInstance";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/store/useProductsStore";
import { IconPercentage, IconStarFilled } from "@tabler/icons-react";

type ProductCardProps = {
  productData: Product;
  onAddToCart?: (id: string) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({productData}) => {
  return (
    <div className="min-w-[200px] w-70 h-full rounded-lg bg-white pb-4 transition-all duration-300 ease-out overflow-hidden flex-shrink-0">
      <div className="p-0 w-full h-fit flex items-center justify-center relative">
        <img
          src={`${IMAGE_BASE}/pictures/${productData.picture}`}
          alt={productData.pictureAlt}
          className="w-[180px] bg-gray-400 h-full object-cover self-center"
        />
        <div className="flex flex-col items-end justify-center gap-1 w-20 absolute top-4 left-4">
          <Badge className="bg-sky-500 rounded-md">پرفروش</Badge>
          <Badge className="bg-green-600 rounded-md">خوش قیمت</Badge>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex flex-col items-start justify-between">
          <h3 className="text-md font-semibold overflow-hidden text-ellipsis line-clamp-1">{productData.name}</h3>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-neutral-600">{productData.categoryName}</span>
          <div className="flex items-start justify-center gap-[6px] flex-row-reverse">
            <IconStarFilled className="text-yellow-500" size={18} />
            <div className="flex items-center text-center gap-[4px]">
              <span className="text-neutral-400 text-sm">({productData.rateCount})</span>
              <span className="text-neutral-600 text-sm">
                {Number.isInteger(productData.avgRate)
                  ? productData.avgRate
                  : Number(productData.avgRate).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <div className={`flex items-center ${productData.hasDiscount ? "justify-between" : "justify-end"}`}>
          {productData.hasDiscount && 
            <div className="flex items-start justify-center bg-red-100 rounded-lg text-red-400 p-1">
              <IconPercentage size={22}/>
              <span className="font-semibold ">{productData.discountRate}</span>
            </div>
          }
          <div>
            {productData.hasDiscount ?
              <div className="flex flex-col items-end">
                <span className="text-neutral-500 text-sm line-through">{productData.price}</span>
                <div className="flex items-center gap-[4px]">
                  <span className="text-neutral-900 text-lg font-semibold">{productData.priceWithDiscount}</span>
                  <span className="font-sm text-neutral-600">تومان</span>
                </div>
              </div>
              :
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-[4px]">
                  <span className="text-neutral-900 text-lg font-semibold">{productData.price}</span>
                  <span className="font-sm text-neutral-600">تومان</span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
