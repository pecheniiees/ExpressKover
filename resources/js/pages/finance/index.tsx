import { Head, router } from '@inertiajs/react';
import {
    BarChart3,
    CalendarDays,
    CheckCircle2,
    CircleDollarSign,
    Clock3,
    FileText,
    Filter,
} from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { index as financeIndex } from '@/routes/finance';

type FinanceStats = {
    total: number;
    completed: number;
    active: number;
    cancelled: number;
    turnover: number;
    completed_revenue: number;
    active_revenue: number;
    average_check: number;
    period: 'day' | 'week' | 'month';
    selected_date: string;
    range_label: string;
    trend: Array<{ label: string; value: number }>;
    statuses: Array<{ label: string; value: number; color: string }>;
};

export default function FinanceIndex({ stats }: { stats: FinanceStats }) {
    const [period, setPeriod] = useState(stats.period);
    const [date, setDate] = useState(stats.selected_date);
    const maxTrendValue = Math.max(
        ...stats.trend.map((point) => point.value),
        1,
    );
    const money = (value: number) =>
        `${Math.round(value).toLocaleString('ru-RU')} ₸`;
    const applyFilters = () => {
        router.get(
            financeIndex({ query: { period, date } }).url,
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Финансы" />

            <main className="space-y-6 p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                    <Heading
                        title="Финансы"
                        description="Операционная статистика заказов и финансовые показатели"
                    />
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                        <BarChart3 className="size-5" />
                    </div>
                </div>

                <section className="flex flex-col gap-3 rounded-2xl border border-[#e1e9e4] bg-white p-3 shadow-sm sm:flex-row sm:items-end">
                    <label className="grid gap-1.5 text-xs font-semibold text-slate-600">
                        Период отчёта
                        <select
                            value={period}
                            onChange={(event) =>
                                setPeriod(
                                    event.target
                                        .value as FinanceStats['period'],
                                )
                            }
                            className="h-10 min-w-36 rounded-xl border border-[#dfe8e2] bg-[#f9fbfa] px-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                        >
                            <option value="day">День</option>
                            <option value="week">Неделя</option>
                            <option value="month">Месяц</option>
                        </select>
                    </label>
                    <label className="grid gap-1.5 text-xs font-semibold text-slate-600">
                        Дата отчёта
                        <span className="relative">
                            <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-emerald-600" />
                            <input
                                type="date"
                                value={date}
                                onChange={(event) =>
                                    setDate(event.target.value)
                                }
                                className="h-10 rounded-xl border border-[#dfe8e2] bg-[#f9fbfa] pr-3 pl-10 text-sm font-medium text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                            />
                        </span>
                    </label>
                    <button
                        type="button"
                        onClick={applyFilters}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0d7c6a] px-4 text-sm font-semibold text-white transition hover:bg-[#0a6a5a]"
                    >
                        <Filter className="size-4" />
                        Показать отчёт
                    </button>
                    <span className="text-xs text-slate-400 sm:ml-auto sm:pb-2">
                        {stats.range_label}
                    </span>
                </section>

                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                        icon={<CircleDollarSign className="size-5" />}
                        label="Оборот"
                        value={money(stats.turnover)}
                        tone="emerald"
                    />
                    <MetricCard
                        icon={<CheckCircle2 className="size-5" />}
                        label="Завершённая выручка"
                        value={money(stats.completed_revenue)}
                        tone="green"
                    />
                    <MetricCard
                        icon={<Clock3 className="size-5" />}
                        label="В работе"
                        value={money(stats.active_revenue)}
                        tone="blue"
                    />
                    <MetricCard
                        icon={<FileText className="size-5" />}
                        label="Средний чек"
                        value={money(stats.average_check)}
                        tone="red"
                    />
                </section>

                <section className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
                    <div className="rounded-2xl border border-[#e1e9e4] bg-white p-5 shadow-sm">
                        <div className="mb-6 flex items-start justify-between gap-3">
                            <div>
                                <h2 className="font-bold text-slate-800">
                                    Динамика заказов
                                </h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Оборот за выбранный период
                                </p>
                            </div>
                            <CircleDollarSign className="size-5 text-emerald-600" />
                        </div>

                        <div className="flex h-56 items-end gap-1 border-b border-[#edf1ee] px-2 sm:gap-3">
                            {stats.trend.map((point) => (
                                <div
                                    key={point.label}
                                    className="flex min-w-0 flex-1 flex-col items-center gap-2"
                                >
                                    <span className="truncate text-[10px] font-semibold text-slate-600 sm:text-xs">
                                        {money(point.value)}
                                    </span>
                                    <div
                                        className="w-full max-w-12 rounded-t-lg bg-emerald-500 transition hover:bg-emerald-600"
                                        style={{
                                            height: `${Math.max((point.value / maxTrendValue) * 170, 8)}px`,
                                        }}
                                    />
                                    <span className="text-[10px] text-slate-400 sm:text-[11px]">
                                        {point.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#e1e9e4] bg-white p-5 shadow-sm">
                        <h2 className="font-bold text-slate-800">
                            Статусы заказов
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Распределение текущего объёма
                        </p>
                        <div className="mt-6 space-y-4">
                            {stats.statuses.map((status) => (
                                <div key={status.label}>
                                    <div className="mb-1.5 flex items-center justify-between text-sm">
                                        <span className="text-slate-600">
                                            {status.label}
                                        </span>
                                        <strong className="text-slate-800">
                                            {status.value}
                                        </strong>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className={`h-full rounded-full ${status.color}`}
                                            style={{
                                                width: `${stats.total ? Math.max((status.value / stats.total) * 100, status.value ? 4 : 0) : 0}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
                    <CircleDollarSign className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                    <div>
                        <h2 className="font-bold">Финансовый учёт активен</h2>
                        <p className="mt-1 text-sm text-emerald-800">
                            Оборот рассчитывается по сохранённым суммам заявок.
                            Старые заявки без суммы не включаются в финансовые
                            показатели.
                        </p>
                    </div>
                </section>
            </main>
        </>
    );
}

function MetricCard({
    icon,
    label,
    value,
    tone,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    tone: 'emerald' | 'green' | 'blue' | 'red';
}) {
    const tones = {
        emerald: 'bg-emerald-100 text-emerald-700',
        green: 'bg-green-100 text-green-700',
        blue: 'bg-blue-100 text-blue-700',
        red: 'bg-red-100 text-red-700',
    };
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-[#e1e9e4] bg-white p-4 shadow-sm">
            <div
                className={`flex size-11 items-center justify-center rounded-xl ${tones[tone]}`}
            >
                {icon}
            </div>
            <div>
                <div className="text-xs text-slate-500">{label}</div>
                <div className="mt-1 text-2xl font-bold text-slate-800">
                    {value}
                </div>
            </div>
        </div>
    );
}

FinanceIndex.layout = {
    breadcrumbs: [{ title: 'Финансы', href: financeIndex() }],
};
