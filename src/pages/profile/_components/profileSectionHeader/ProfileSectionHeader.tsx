import { IconLoader2 } from "@tabler/icons-react"
import { toPersianDigits } from "smart-persian-tools"

interface IProfileSectionHeaderProps {
  loading: boolean;
  dataLength: number;
  descText: string;
  title: string;
}

function ProfileSectionHeader({loading, dataLength, descText, title}: IProfileSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-base sm:text-xl font-bold text-blue-800">{title}</h1>
          {!loading && (
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              {toPersianDigits(dataLength)}
              {descText}
            </p>
          )}
        </div>
        {loading && (
          <IconLoader2 size={16} className="text-blue-400 animate-spin sm:w-[18px] sm:h-[18px] flex-shrink-0" />
        )}
      </div>
  )
}

export default ProfileSectionHeader