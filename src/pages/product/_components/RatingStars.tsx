import { IconStar } from "@tabler/icons-react";
import { useState } from "react";

interface RatingStarsProps {
    rate: number;
    setRate: (value: number) => void;
}

export default function RatingStars({ rate, setRate }: RatingStarsProps) {
    const [hovered, setHovered] = useState(0);
    const active = hovered || rate;

    return (
        <div className="flex flex-row-reverse justify-start gap-2 mb-4">
            {Array.from({ length: 5 }, (_, i) => {
                const value = 5 - i;
                return (
                    <IconStar
                        key={value}
                        size={24}
                        className={`cursor-pointer transition-colors duration-100 ${
                            value <= active
                                ? "text-amber-400 fill-amber-400"
                                : "text-gray-300 fill-gray-300"
                        }`}
                        onClick={() => setRate(value)}
                        onMouseEnter={() => setHovered(value)}
                        onMouseLeave={() => setHovered(0)}
                    />
                );
            })}
        </div>
    );
}
