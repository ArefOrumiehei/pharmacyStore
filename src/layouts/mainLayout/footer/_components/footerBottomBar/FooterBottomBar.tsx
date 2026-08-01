export default function FooterBottomBar() {
  return (
    <div className="bg-blue-800 text-white text-center py-2.5 sm:py-3.5 text-xs sm:text-sm">
      ساخته شده با 💗 در{" "}
      {new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(new Date())}
    </div>
  );
}