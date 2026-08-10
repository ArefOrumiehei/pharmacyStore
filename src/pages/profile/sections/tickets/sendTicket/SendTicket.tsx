import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { IconLoader2, IconMessageCircle } from "@tabler/icons-react";
import { useTicketStore } from "@/store/useTicketStore";
import { useSiteStore } from "@/store/useSiteStore";
import type { TicketFormValues } from "@/pages/profile/constants/Constants";

// Components
import { TicketSuccessScreen } from "./_components/ticketSuccessScreen/TicketSuccessScreen";
import { SendTicketHeader } from "./_components/sendTicketHeader/SendTicketHeader";
import { SubjectField } from "./_components/subjectField/SubjectField";
import { PrioritySelector } from "./_components/prioritySelector/PrioritySelector";
import { MessageFields } from "./_components/messageFields/MessageFields";

export default function SendTicket() {
  const navigate = useNavigate();
  const { submitLoading, submitTicket, ticketCode, clearTicketStates } = useTicketStore();
  const { fetchTitles, titles, titlesLoading } = useSiteStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TicketFormValues>({ defaultValues: { priority: "low" } });

  const selectedPriority = watch("priority");

  useEffect(() => {
    fetchTitles();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = useCallback(
    async (data: TicketFormValues) => {
      try {
        await submitTicket({
          subject: data.subject,
          message: data.message,
          email: data.email || undefined,
        });
      } catch (error) {
        console.warn(error);
      }
    },
    [submitTicket]
  );

  const handleNewTicket = () => {
    clearTicketStates();
    reset();
  };

  const onBack = () => navigate("/profile/tickets");

  if (ticketCode) {
    return <TicketSuccessScreen trackingCode={ticketCode} onNewTicket={handleNewTicket} />;
  }

  return (
    <div className="w-full mx-auto py-4 sm:py-6" dir="rtl">
      <SendTicketHeader onBack={onBack} />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <SubjectField loading={titlesLoading} titles={titles} register={register} errors={errors} />

        <PrioritySelector selected={selectedPriority} setValue={setValue} />

        <MessageFields register={register} errors={errors} />

        <button
          type="submit"
          disabled={submitLoading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-white font-semibold text-sm transition-all shadow-sm shadow-blue-100"
        >
          {submitLoading ? (
            <IconLoader2 size={18} className="animate-spin" />
          ) : (
            <>
              <IconMessageCircle size={17} />
              ارسال تیکت
            </>
          )}
        </button>
      </form>
    </div>
  );
}