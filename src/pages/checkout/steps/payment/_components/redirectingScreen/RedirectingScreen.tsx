import { IconLoader2 } from "@tabler/icons-react";

interface RedirectingScreenProps {
  message: string | null;
}

export function RedirectingScreen({ message }: RedirectingScreenProps) {
  return (
    <div className="w-full h-56 sm:h-64 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center gap-4 px-4 text-center">
      <IconLoader2 size={28} className="text-blue-800 animate-spin" />
      <p className="text-sm font-medium text-blue-800">{message}</p>
    </div>
  );
}