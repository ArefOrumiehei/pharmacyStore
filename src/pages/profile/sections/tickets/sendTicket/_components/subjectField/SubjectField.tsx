import { IconTag, IconPencil, IconChevronDown } from "@tabler/icons-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { SectionHeader } from "../sectionHeader/SectionHeader";
import type { TicketFormValues, TicketTitleOption } from "@/pages/profile/constants/Constants";

interface SubjectFieldProps {
  loading: boolean;
  titles: TicketTitleOption[];
  register: UseFormRegister<TicketFormValues>;
  errors: FieldErrors<TicketFormValues>;
}

export function SubjectField({ loading, titles, register, errors }: SubjectFieldProps) {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <SectionHeader icon={IconTag} title="موضوع تیکت" />

      {loading ? (
        <div className="h-11 w-full bg-blue-50 animate-pulse rounded-xl" />
      ) : titles.length > 0 ? (
        <div className="relative">
          <IconTag size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            {...register("subject", { required: "لطفاً موضوع را انتخاب کنید" })}
            defaultValue=""
            className={`w-full appearance-none border rounded-xl pr-9 pl-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${
              errors.subject ? "border-rose-200 bg-rose-50/30 text-gray-700" : "border-blue-100 bg-blue-50/30 text-gray-700"
            }`}
          >
            <option value="" disabled>
              موضوع تیکت را انتخاب کنید
            </option>
            {titles.map(({ titleName, numberOfRow }) => (
              <option key={numberOfRow} value={titleName}>
                {titleName}
              </option>
            ))}
          </select>
          <IconChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      ) : (
        <div className="relative">
          <IconPencil size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            {...register("subject", { required: "لطفاً موضوع را بنویسید" })}
            placeholder="موضوع تیکت خود را بنویسید..."
            className={`w-full border rounded-xl px-3 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
              errors.subject ? "border-rose-200 bg-rose-50/30" : "border-blue-100 bg-blue-50/30"
            }`}
          />
        </div>
      )}

      {errors.subject && <p className="text-rose-500 text-xs">{errors.subject.message}</p>}
    </div>
  );
}