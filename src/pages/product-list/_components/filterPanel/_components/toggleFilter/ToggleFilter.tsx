export default function ToggleFilter({
    label,
    desc,
    checked,
    onChange,
    color = "blue",
    icon,
}: {
    label: string;
    desc?: string;
    checked: boolean;
    onChange: () => void;
    color?: "blue" | "green" | "rose";
    icon?: React.ReactNode;
}) {
    const trackColor = { blue: "bg-blue-800", green: "bg-green-600", rose: "bg-rose-500" }[color];

    return (
        <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                {icon}
                <div>
                    <p className="text-sm font-medium text-gray-700">{label}</p>
                    {desc && <p className="text-xs text-gray-400">{desc}</p>}
                </div>
            </div>
            <button
                type="button"
                onClick={onChange}
                className={`relative w-10 h-5 rounded-full transition-all duration-300 flex-shrink-0 ${
                    checked ? trackColor : "bg-gray-200"
                }`}
            >
                <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${
                        checked ? "right-0.5" : "left-0.5"
                    }`}
                />
            </button>
        </div>
    );
}