import { memo } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { IMAGE_BASE } from "@/apis/apiInstance";
import type { ProductGalleryProps } from "../../types/productPageTypes";


function ProductGallery({ isLoaded, product, images, activeImage, onChangeImage }: ProductGalleryProps) {
  const selectedImage = images[activeImage] ?? images[0];

  return (
    <div className="flex flex-col gap-2 sm:gap-3 w-full lg:w-80 xl:w-96">
      <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl border border-blue-100 bg-white overflow-hidden flex items-center justify-center">
        {isLoaded ? (
          <>
            <img
              key={activeImage}
              src={`${IMAGE_BASE}/${selectedImage?.picture ?? product?.picture}`}
              alt={selectedImage?.pictureAlt ?? product?.pictureAlt}
              title={product?.pictureTitle}
              className="w-4/5 h-4/5 object-contain transition-opacity duration-300"
              loading="eager"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => onChangeImage(Math.max(0, activeImage - 1))}
                  disabled={activeImage === 0}
                  className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white/80 hover:bg-white border border-blue-100 flex items-center justify-center shadow-sm disabled:opacity-30 transition-all"
                >
                  <IconChevronRight size={14} className="text-blue-800 sm:w-4 sm:h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onChangeImage(Math.min(images.length - 1, activeImage + 1))}
                  disabled={activeImage === images.length - 1}
                  className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white/80 hover:bg-white border border-blue-100 flex items-center justify-center shadow-sm disabled:opacity-30 transition-all"
                >
                  <IconChevronLeft size={14} className="text-blue-800 sm:w-4 sm:h-4" />
                </button>

                {/* Mobile-only dot indicator — thumbnails below are hidden on small screens */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 sm:hidden">
                  {images.map((_, index) => (
                    <span
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        activeImage === index ? "w-4 bg-blue-800" : "w-1.5 bg-blue-200"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-blue-50 animate-pulse" />
        )}
      </div>

      {isLoaded && images.length > 1 && (
        <div className="hidden sm:flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {images.map((img, index) => (
            <button
              type="button"
              key={`${img.picture}-${index}`}
              onClick={() => onChangeImage(index)}
              className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl border-2 overflow-hidden bg-white transition-all duration-150 ${
                activeImage === index ? "border-blue-800 shadow-sm" : "border-blue-100 hover:border-blue-300"
              }`}
            >
              <img src={`${IMAGE_BASE}/${img.picture}`} alt={img.pictureAlt} className="w-full h-full object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(ProductGallery);