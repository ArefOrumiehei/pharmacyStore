import { useCallback, useState } from "react";
import { IconHeart, IconHeartFilled, IconLoader2 } from "@tabler/icons-react";
import { useProductStore } from "@/store/useProductsStore";
import type { FavoriteBtnProps } from "@/pages/product/types/productPageTypes";

export default function FavoriteBtn({ productId, initialIsFavorite }: FavoriteBtnProps) {
  const { addToFavorites, removeFromFavorites } = useProductStore();

  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);

  const handleToggle = useCallback(async () => {
    if (loading) return;
    const prev = isFavorite;
    setIsFavorite(!prev);
    setLoading(true);
    try {
      if (prev) await removeFromFavorites(productId);
      else await addToFavorites(productId);
    } catch {
      setIsFavorite(prev);
    } finally {
      setLoading(false);
    }
  }, [isFavorite, loading, productId, addToFavorites, removeFromFavorites]);

  return (
    <button
      title="افزودن به علاقه مندی ها"
      onClick={handleToggle}
      disabled={loading}
      className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all active:scale-90 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {loading ? (
        <IconLoader2 size={16} className="text-blue-800 animate-spin" />
      ) : isFavorite ? (
        <IconHeartFilled size={16} className="text-rose-500" />
      ) : (
        <IconHeart size={16} className="text-gray-400" />
      )}
    </button>
  );
}