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
        <div className="flex flex-row-reverse justify-start gap-1.5">
            {Array.from({ length: 5 }, (_, i) => {
                const value = 5 - i;
                return (
                    <IconStar
                        key={value}
                        size={26}
                        className={`cursor-pointer transition-all duration-100 ${
                            value <= active
                                ? "text-amber-400 fill-amber-400 scale-110"
                                : "text-gray-200 fill-gray-200 hover:text-amber-300 hover:fill-amber-300"
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
