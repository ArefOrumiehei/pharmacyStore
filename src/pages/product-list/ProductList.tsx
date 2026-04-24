function ProductList() {
  const products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `محصول ${i + 1}`,
    price: `${(i + 1) * 80} هزار تومان`,
  }));

  return (
    <div className="flex w-full min-h-screen px-16">
      {/* ===== ستون فیلتر ===== */}
      <div className="w-1/4 border-l p-5 overflow-y-scroll h-screen sticky top-0 no-scrollbar">
        <h2 className="text-xl font-bold mb-6 text-yellow-800">فیلترها</h2>

        {/* دسته‌بندی */}
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-1">دسته‌بندی</label>
          <select className="w-full p-2 border rounded-md">
            <option>همه</option>
            <option>دارویی</option>
            <option>آرایشی</option>
            <option>بهداشتی</option>
            <option>مکمل‌ها</option>
          </select>
        </div>

        {/* برند */}
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-1">برند</label>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" /> نیوا
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" /> سینره
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" /> بایودرما
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" /> اوسرین
            </label>
          </div>
        </div>

        {/* قیمت */}
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-1">محدوده قیمت</label>
          <input type="range" min="0" max="1000" className="w-full accent-yellow-500" />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>۰</span>
            <span>۱,۰۰۰</span>
          </div>
        </div>

        {/* وضعیت موجودی */}
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-1">وضعیت موجودی</label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" /> فقط موجودها
          </label>
        </div>

        {/* امتیاز */}
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-1">حداقل امتیاز</label>
          <select className="w-full p-2 border rounded-md">
            <option>همه</option>
            <option>۴ ستاره به بالا</option>
            <option>۳ ستاره به بالا</option>
            <option>۲ ستاره به بالا</option>
          </select>
        </div>

        {/* دکمه اعمال فیلتر */}
        <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded-md py-2 mt-3">
          اعمال فیلترها
        </button>
      </div>

      {/* ===== لیست محصولات ===== */}
      <div className="flex-1 p-6">
        <h2 className="text-lg font-bold mb-6">محصولات</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="border rounded-xl shadow p-4 hover:shadow-lg transition"
            >
              <div className="bg-gray-200 h-40 rounded-md mb-3"></div>
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-gray-600 text-sm">{p.price}</p>
              <button className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded-md py-2">
                افزودن به سبد
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
