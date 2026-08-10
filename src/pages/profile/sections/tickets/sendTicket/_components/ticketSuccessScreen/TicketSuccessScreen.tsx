import { useNavigate } from "react-router";
import { IconCircleCheck, IconHeadset, IconHash } from "@tabler/icons-react";

interface TicketSuccessScreenProps {
  trackingCode: string;
  onNewTicket: () => void;
}

export function TicketSuccessScreen({ trackingCode, onNewTicket }: TicketSuccessScreenProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md mx-auto py-10 sm:py-16 px-4 flex flex-col items-center gap-6 text-center" dir="rtl">
      <div className="relative">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-green-50 border-2 border-green-100 flex items-center justify-center">
          <IconCircleCheck size={40} className="text-green-500 sm:w-12 sm:h-12" strokeWidth={1.5} />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-blue-800 flex items-center justify-center">
          <IconHeadset size={16} className="text-white" />
        </div>
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-800">تیکت ثبت شد!</h2>
        <p className="text-sm text-gray-400 mt-2 leading-relaxed">
          کارشناسان ما بررسی می‌کنند و در اسرع وقت پاسخ می‌دهند
        </p>
      </div>

      <div className="w-full bg-blue-50 border border-blue-100 rounded-2xl px-4 sm:px-6 py-5 flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-1.5 text-gray-400">
          <IconHash size={13} />
          <p className="text-xs font-medium">شماره پیگیری تیکت</p>
        </div>
        <p className="text-xl sm:text-2xl font-black text-blue-800 tracking-widest mt-0.5 break-all">
          {trackingCode}
        </p>
        <p className="text-xs text-blue-400 mt-1">این شماره را نزد خود نگه دارید</p>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <button
          onClick={() => navigate("/profile/tickets")}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-semibold text-sm transition-all active:scale-95"
        >
          <IconHeadset size={16} />
          مشاهده تیکت‌های من
        </button>
        <button
          onClick={onNewTicket}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold text-sm border border-blue-100 transition-all"
        >
          ارسال تیکت جدید
        </button>
      </div>
    </div>
  );
}