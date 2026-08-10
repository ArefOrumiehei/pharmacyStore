export default function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-blue-100 rounded-xl sm:rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-3.5 sm:px-5 py-3 sm:py-4 border-b border-blue-50">
        <span className="w-1 h-4 sm:h-5 bg-blue-800 rounded-full flex-shrink-0" />
        <h2 className="text-xs sm:text-sm font-bold text-blue-800">{title}</h2>
      </div>
      <div className="p-3.5 sm:p-5">{children}</div>
    </div>
  );
}