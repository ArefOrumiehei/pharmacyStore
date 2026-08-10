function NoteText({isGuest, isEmpty}: {isGuest: boolean; isEmpty: boolean}) {
  return (
    <>
        {isGuest && !isEmpty && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 text-center leading-relaxed">
            سبد خرید شما پس از ورود حفظ می‌شود
          </p>
        )}
        {/* {!isGuest && <p className="text-xs text-gray-400 text-center">پرداخت امن با درگاه‌های معتبر بانکی</p>} */}
    </>
  )
}

export default NoteText