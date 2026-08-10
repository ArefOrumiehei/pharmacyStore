import StatCard, { type StatItem } from "./_components/statCard/StatCard";

export default function StatsGrid({ stats }: { stats: StatItem[] }) {
    return (
        <div className="grid max-[280px]:grid-cols-1 max-[420px]:grid-cols-2 grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {stats.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
            ))}
        </div>
    );
}
