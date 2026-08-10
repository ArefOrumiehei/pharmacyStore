import SectionTitle from '@/components/common/sectionTitle/SectionTitle';
import { useReturnPolicyQuery } from '@/queries/useSiteSettingsQueries';
import { IconArrowBack } from '@tabler/icons-react';

function ReturnPolicy() {
  const { data, isLoading} = useReturnPolicyQuery();
  
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12" dir="rtl">
      {/* Header */}
      <div className="text-center mb-10 space-y-3">
        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto">
          <IconArrowBack size={28} className="text-blue-800" />
        </div>
        <h1 className="text-lg sm:text-xl md:text-3xl font-bold text-blue-800">قوانین بازگرداندن کالا</h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          لطفاً پیش از مرجوعی کالا، این قوانین را مطالعه نمایید.
        </p>
      </div>

      {/* Accordion */}
      <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="w-full">
            <div className="px-4 sm:px-6 py-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-4 w-full rounded-full bg-blue-100 animate-pulse mb-2" />
              ))}
            </div>
          </div>
        ) : (
          <div className="px-4 sm:px-6 py-4">
            <SectionTitle extraClass="mb-5">شرایط بازگرداندن کالا</SectionTitle>
            <p className="text-xs sm:text-sm text-gray-500 leading-7">
              {data?.text}
            </p>
          </div>
        )}
      </div>

      {/* Footer note */}
      {!isLoading && 
        <p className="text-xs text-gray-400 mt-6 text-center">
          آخرین بروزرسانی: ۱۴۰۵/۰۱/۰۱
        </p>
      }
    </div>
  )
}

export default ReturnPolicy