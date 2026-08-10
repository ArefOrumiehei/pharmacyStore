/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useProductStore } from "@/store/useProductsStore";
import { useUserStore } from "@/store/useAccountStore";
import ConfirmModal from "@/components/common/confirmModal/ConfirmModal";
import FavoritesHeader from "./_components/favoritesHeader/FavoritesHeader";
import FavoritesEmptyState from "./_components/favoritesEmptyState/FavoritesEmptyState";
import FavoritesSkeleton from "./_components/favoritesSkeleton/FavoritesSkeleton";
import FavoriteCard from "./_components/favoriteCard/FavoriteCard";

export default function Favorites() {
    const { removeFromFavorites, loading } = useProductStore();
    const { fetchUserFavorites, userFavorites } = useUserStore();

    const [pendingRemoveItem, setPendingRemoveItem] = useState<any | null>(null);
    const [removing, setRemoving] = useState(false);

    useEffect(() => {
        fetchUserFavorites();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const favorites: any[] = Array.isArray(userFavorites) ? (userFavorites as any[]) : [];

    const handleConfirmRemove = async () => {
        if (!pendingRemoveItem) return;
        setRemoving(true);
        try {
            await removeFromFavorites(pendingRemoveItem.id);
        } finally {
            setRemoving(false);
            setPendingRemoveItem(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-3.5 sm:gap-5">
                <FavoritesHeader count={0} showCount={false} />
                <FavoritesSkeleton />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3.5 sm:gap-5">
            <FavoritesHeader count={favorites.length} showCount={favorites.length > 0} />

            {favorites.length === 0 ? (
                <FavoritesEmptyState />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
                {favorites.map((item) => (
                    <FavoriteCard key={item.id} item={item} onRemoveClick={setPendingRemoveItem} />
                ))}
                </div>
            )}

            <ConfirmModal
                open={!!pendingRemoveItem}
                title="حذف از علاقه‌مندی‌ها"
                description="آیا از حذف این محصول از علاقه‌مندی‌ها مطمئن هستید؟"
                confirmLabel="حذف"
                cancelLabel="انصراف"
                loading={removing}
                onConfirm={handleConfirmRemove}
                onCancel={() => setPendingRemoveItem(null)}
            />
        </div>
    );
}