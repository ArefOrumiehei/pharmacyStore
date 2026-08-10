export default function SectionTitle({ children, extraClass }: { children: React.ReactNode, extraClass?: string }) {
  return (
    <h2 className={`text-sm sm:text-base font-bold text-blue-800 flex items-center gap-1.5 sm:gap-2 ${extraClass}`}>
      <span className="w-1 h-4 sm:h-5 bg-blue-800 rounded-full inline-block flex-shrink-0" />
      {children}
    </h2>
  );
}