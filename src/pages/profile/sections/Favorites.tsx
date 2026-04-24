// src/pages/profile/favorites/Favorites.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";

export default function Favorites() {
  const favorites = [
    {
      id: 1,
      name: "قرص استامینوفن 500 میلی‌گرم",
      price: "45,000",
      image: "/placeholder.jpg",
      available: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* <h1 className="text-2xl font-bold">علاقه‌مندی‌ها</h1> */}

      {favorites.length === 0 ? (
        <Card className="p-12 text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">محصولی به علاقه‌مندی‌ها اضافه نشده</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {favorites.map((item) => (
            <Card key={item.id}>
              <CardContent className="px-4">
                <div className="aspect-square bg-accent rounded-lg mb-3" />
                <h3 className="font-medium mb-2 line-clamp-2">{item.name}</h3>
                <p className="text-lg font-bold text-primary mb-3">
                  {item.price} تومان
                </p>
                <div className="flex gap-2">
                  <Button className="flex-1" size="sm">
                    <ShoppingCart className="w-4 h-4 ml-2" />
                    افزودن
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4 fill-current" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
