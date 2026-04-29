import { useState } from "react";
import {
  IconMapPin,
  IconPlus,
  IconPencil,
  IconTrash,
  IconCheck,
  IconX,
  IconHome,
  IconBuildingStore,
  IconLoader2,
} from "@tabler/icons-react";

interface Address {
  id: number;
  title: string;
  address: string;
  postalCode: string;
  receiver: string;
  phone: string;
  isDefault: boolean;
}

interface AddressFormValues {
  title: string;
  address: string;
  postalCode: string;
  receiver: string;
  phone: string;
}

const INITIAL_ADDRESSES: Address[] = [
  {
    id: 1,
    title: "منزل",
    address: "تهران، خیابان ولیعصر، پلاک ۱۲۳",
    postalCode: "1234567890",
    receiver: "علی احمدی",
    phone: "09123456789",
    isDefault: true,
  },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-blue-800 flex items-center gap-2">
      <span className="w-1 h-5 bg-blue-800 rounded-full inline-block flex-shrink-0" />
      {children}
    </h2>
  );
}

const inputClass = (hasError?: boolean) =>
  `w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 placeholder-gray-400 transition-all duration-200 ${
    hasError ? "border-rose-200 bg-rose-50/30" : "border-blue-100 bg-blue-50/30"
  }`;

function AddressForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: Partial<AddressFormValues>;
  onSave: (v: AddressFormValues) => void;
  onCancel: () => void;
  saving?: boolean;
}) {
  const [values, setValues] = useState<AddressFormValues>({
    title: initial?.title ?? "",
    address: initial?.address ?? "",
    postalCode: initial?.postalCode ?? "",
    receiver: initial?.receiver ?? "",
    phone: initial?.phone ?? "",
  });

  const set = (k: keyof AddressFormValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  return (
    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex flex-col gap-4">
      <SectionTitle>{initial?.title ? "ویرایش آدرس" : "آدرس جدید"}</SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-600">عنوان (مثلاً منزل)</label>
          <input value={values.title} onChange={set("title")} placeholder="منزل / محل کار" className={inputClass()} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-600">نام گیرنده</label>
          <input value={values.receiver} onChange={set("receiver")} placeholder="نام کامل گیرنده" className={inputClass()} />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-medium text-gray-600">آدرس کامل</label>
          <input value={values.address} onChange={set("address")} placeholder="استان، شهر، خیابان، پلاک" className={inputClass()} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-600">کد پستی</label>
          <input value={values.postalCode} onChange={set("postalCode")} placeholder="۱۲۳۴۵۶۷۸۹۰" className={inputClass()} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-600">شماره تماس گیرنده</label>
          <input value={values.phone} onChange={set("phone")} placeholder="۰۹۱۲۳۴۵۶۷۸۹" className={inputClass()} />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button onClick={onCancel}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-xl transition-all duration-200">
          <IconX size={15} /> انصراف
        </button>
        <button onClick={() => onSave(values)} disabled={saving}
          className="flex items-center gap-1.5 text-sm text-white bg-blue-800 hover:bg-blue-700 disabled:opacity-60 px-4 py-2 rounded-xl transition-all duration-200">
          {saving ? <IconLoader2 size={15} className="animate-spin" /> : <IconCheck size={15} />}
          ذخیره آدرس
        </button>
      </div>
    </div>
  );
}

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const handleAdd = async (values: AddressFormValues) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setAddresses((prev) => [
      ...prev,
      { ...values, id: Date.now(), isDefault: prev.length === 0 },
    ]);
    setShowForm(false);
    setSaving(false);
  };

  const handleEdit = async (values: AddressFormValues) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setAddresses((prev) =>
      prev.map((a) => (a.id === editingId ? { ...a, ...values } : a))
    );
    setEditingId(null);
    setSaving(false);
  };

  const handleDelete = (id: number) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id: number) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-blue-800">آدرس‌های من</h1>
          <p className="text-sm text-gray-400 mt-0.5">آدرس‌های تحویل سفارش خود را مدیریت کنید</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditingId(null); }}
            className="flex items-center gap-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-xl transition-all duration-200"
          >
            <IconPlus size={15} />
            آدرس جدید
          </button>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <AddressForm onSave={handleAdd} onCancel={() => setShowForm(false)} saving={saving} />
      )}

      {/* Empty */}
      {addresses.length === 0 && !showForm && (
        <div className="bg-white border border-blue-100 rounded-2xl flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <IconMapPin size={28} className="text-blue-300" />
          </div>
          <p className="text-sm text-gray-500">هنوز آدرسی ثبت نشده است</p>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-sm font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-xl transition-all duration-200">
            <IconPlus size={15} />افزودن آدرس
          </button>
        </div>
      )}

      {/* Address cards */}
      {addresses.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) =>
            editingId === addr.id ? (
              <div key={addr.id} className="sm:col-span-2">
                <AddressForm
                  initial={addr}
                  onSave={handleEdit}
                  onCancel={() => setEditingId(null)}
                  saving={saving}
                />
              </div>
            ) : (
              <div key={addr.id}
                className={`bg-white rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-200 hover:shadow-sm ${
                  addr.isDefault ? "border-blue-200" : "border-blue-100"
                }`}
              >
                {/* Title row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                      {addr.title.includes("کار") || addr.title.includes("محل")
                        ? <IconBuildingStore size={15} className="text-blue-800" />
                        : <IconHome size={15} className="text-blue-800" />
                      }
                    </div>
                    <span className="font-semibold text-sm text-gray-700">{addr.title}</span>
                  </div>
                  {addr.isDefault ? (
                    <span className="text-xs font-medium bg-blue-50 border border-blue-200 text-blue-800 px-2.5 py-1 rounded-full">
                      پیش‌فرض
                    </span>
                  ) : (
                    <button onClick={() => handleSetDefault(addr.id)}
                      className="text-xs text-gray-400 hover:text-blue-800 transition-colors">
                      تنظیم به عنوان پیش‌فرض
                    </button>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                  <p className="leading-5">{addr.address}</p>
                  <p>کد پستی: {addr.postalCode}</p>
                  <p>گیرنده: {addr.receiver} | {addr.phone}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1 border-t border-blue-50">
                  <button onClick={() => { setEditingId(addr.id); setShowForm(false); }}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-blue-800 hover:bg-blue-50 border border-blue-100 py-2 rounded-xl transition-all duration-200">
                    <IconPencil size={13} /> ویرایش
                  </button>
                  <button onClick={() => handleDelete(addr.id)}
                    className="flex items-center justify-center gap-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-100 px-3 py-2 rounded-xl transition-all duration-200">
                    <IconTrash size={13} />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}