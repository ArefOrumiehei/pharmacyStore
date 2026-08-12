import { Link } from "react-router";
import { IconArrowLeft } from "@tabler/icons-react";
import CountdownTimer from "../countdownTimer/CountdownTimer";
import type { CarouselHeaderProps } from "../../interfaces/ProductsCarouselInterfaces";

export default function CarouselHeader({
  title, icon, headerClass, headerBgClass, dividerClass, viewMoreClass,
  viewMoreLink, showViewMore, dealEndTime, onDealExpire,
}: CarouselHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-2 px-3 sm:px-6 py-3 sm:py-4 border-b ${dividerClass} ${headerBgClass}`}>
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <span className="flex-shrink-0 [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5">{icon}</span>
        <h3 className={`text-sm sm:text-lg font-bold truncate ${headerClass}`}>{title}</h3>
        {dealEndTime && <CountdownTimer endTime={dealEndTime} onExpire={onDealExpire} />}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {viewMoreLink && showViewMore && (
          <Link
            to={viewMoreLink}
            className={`flex items-center gap-1 text-xs sm:text-sm font-medium transition-colors duration-200 whitespace-nowrap ${viewMoreClass}`}
          >
            مشاهده همه
            <IconArrowLeft size={14} className="sm:w-4 sm:h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}