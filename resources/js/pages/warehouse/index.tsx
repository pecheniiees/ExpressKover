import { Form, Head, Link, router } from '@inertiajs/react';
import {
    CalendarDays,
    Droplets,
    Filter,
    Fuel,
    Home,
    MoreHorizontal,
    PackagePlus,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import warehouse from '@/routes/warehouse';

const { index, store, destroy } = warehouse.expenses;

type Expense = {
    id: number;
    category: string;
    category_label: string;
    amount: number;
    expense_date: string;
    description: string | null;
};

type Props = {
    expenses: Expense[];
    categories: Record<string, string>;
    stats: {
        total: number;
        count: number;
        categories: Array<{ category: string; label: string; value: number }>;
    };
    filters: {
        period: 'day' | 'week' | 'month';
        date: string;
        range_label: string;
    };
};

const categoryIcons = {
    fuel: Fuel,
    detergent: Droplets,
    household: Home,
    other: MoreHorizontal,
};

export default function WarehouseIndex({ expenses, stats, filters }: Props) {
    const [period, setPeriod] = useState(filters.period);
    const [date, setDate] = useState(filters.date);
    const money = (value: number) =>
        `${Math.round(value).toLocaleString('ru-RU')} ₸`;
    const applyFilters = () => {
        router.get(
            index({ query: { period, date } }).url,
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Склад" />
            <main className="space-y-6 p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                    <Heading
                        title="Склад"
                        description="Расходы на бензин, порошок и хозяйственные товары"
                    />
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                        <PackagePlus className="size-5" />
                    </div>
                </div>

                <section className="flex flex-col gap-3 rounded-2xl border border-[#e1e9e4] bg-white p-3 shadow-sm sm:flex-row sm:items-end">
                    <label className="grid gap-1.5 text-xs font-semibold text-slate-600">
                        Период
                        <select
                            value={period}
                            onChange={(event) =>
                                setPeriod(
                                    event.target
                                        .value as Props['filters']['period'],
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
                        Дата
                        <span className="relative">
                            <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-amber-600" />
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
                        Показать
                    </button>
                    <span className="text-xs text-slate-400 sm:ml-auto sm:pb-2">
                        {filters.range_label}
                    </span>
                </section>

                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    <MetricCard
                        label="Всего расходов"
                        value={money(stats.total)}
                        tone="amber"
                        icon={<PackagePlus className="size-5" />}
                    />
                    <MetricCard
                        label="Записей"
                        value={String(stats.count)}
                        tone="slate"
                        icon={<MoreHorizontal className="size-5" />}
                    />
                    {stats.categories.map((category) => {
                        const Icon =
                            categoryIcons[
                                category.category as keyof typeof categoryIcons
                            ] ?? MoreHorizontal;
                        return (
                            <MetricCard
                                key={category.category}
                                label={category.label}
                                value={money(category.value)}
                                tone="green"
                                icon={<Icon className="size-5" />}
                            />
                        );
                    })}
                </section>

                <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="overflow-hidden rounded-2xl border border-[#e1e9e4] bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-[#edf1ee] px-5 py-4">
                            <div>
                                <h2 className="font-bold text-slate-800">
                                    Расходы за период
                                </h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Все внесённые складские расходы
                                </p>
                            </div>
                            <span className="text-sm font-bold text-amber-700">
                                {money(stats.total)}
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[680px] text-sm">
                                <thead className="bg-[#f4f7f5] text-left text-slate-500">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">
                                            Дата
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Категория
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Комментарий
                                        </th>
                                        <th className="px-5 py-3 text-right font-medium">
                                            Сумма
                                        </th>
                                        <th className="px-5 py-3 text-right font-medium">
                                            Действия
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#edf1ee] text-slate-700">
                                    {expenses.map((expense) => (
                                        <tr
                                            key={expense.id}
                                            className="transition hover:bg-[#f9fbfa]"
                                        >
                                            <td className="px-5 py-4 text-slate-500">
                                                {expense.expense_date}
                                            </td>
                                            <td className="px-5 py-4 font-semibold text-slate-800">
                                                {expense.category_label}
                                            </td>
                                            <td className="px-5 py-4 text-slate-600">
                                                {expense.description ?? '—'}
                                            </td>
                                            <td className="px-5 py-4 text-right font-bold text-slate-800">
                                                {money(expense.amount)}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <Link
                                                    href={destroy(expense.id)}
                                                    method="delete"
                                                    as="button"
                                                    className="inline-flex size-8 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
                                                    aria-label={`Удалить расход ${expense.id}`}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {expenses.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-5 py-14 text-center text-sm text-slate-400"
                                            >
                                                Расходов за выбранный период нет
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <section className="rounded-2xl border border-[#e1e9e4] bg-white p-5 shadow-sm">
                        <h2 className="font-bold text-slate-800">
                            Добавить расход
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Запишите покупку сразу, чтобы не потерять её в
                            отчёте.
                        </p>
                        <Form
                            {...store.form()}
                            resetOnSuccess
                            className="mt-5 grid gap-3"
                        >
                            <input
                                type="hidden"
                                name="period"
                                value={period}
                                readOnly
                            />
                            <input
                                type="hidden"
                                name="date"
                                value={date}
                                readOnly
                            />
                            <label className="grid gap-1.5 text-xs font-semibold text-slate-600">
                                Категория
                                <select
                                    name="category"
                                    defaultValue="fuel"
                                    className="rounded-xl border border-[#dfe8e2] bg-white px-3 py-2.5 text-sm font-medium text-slate-700"
                                >
                                    <option value="fuel">Бензин</option>
                                    <option value="detergent">Порошок</option>
                                    <option value="household">Хозтовары</option>
                                    <option value="other">Прочее</option>
                                </select>
                            </label>
                            <label className="grid gap-1.5 text-xs font-semibold text-slate-600">
                                Сумма, ₸
                                <input
                                    name="amount"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    required
                                    className="rounded-xl border border-[#dfe8e2] bg-white px-3 py-2.5 text-sm text-slate-700"
                                    placeholder="25000"
                                />
                            </label>
                            <label className="grid gap-1.5 text-xs font-semibold text-slate-600">
                                Дата
                                <input
                                    name="expense_date"
                                    type="date"
                                    defaultValue={date}
                                    required
                                    className="rounded-xl border border-[#dfe8e2] bg-white px-3 py-2.5 text-sm text-slate-700"
                                />
                            </label>
                            <label className="grid gap-1.5 text-xs font-semibold text-slate-600">
                                Комментарий
                                <input
                                    name="description"
                                    className="rounded-xl border border-[#dfe8e2] bg-white px-3 py-2.5 text-sm text-slate-700"
                                    placeholder="Заправка автомобиля"
                                />
                            </label>
                            <button
                                type="submit"
                                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#e49a23] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#c78116]"
                            >
                                <PackagePlus className="size-4" />
                                Сохранить расход
                            </button>
                        </Form>
                    </section>
                </section>
            </main>
        </>
    );
}

function MetricCard({
    label,
    value,
    icon,
    tone,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
    tone: 'amber' | 'slate' | 'green';
}) {
    const tones = {
        amber: 'bg-amber-100 text-amber-700',
        slate: 'bg-slate-100 text-slate-600',
        green: 'bg-emerald-100 text-emerald-700',
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
                <div className="mt-1 text-xl font-bold text-slate-800">
                    {value}
                </div>
            </div>
        </div>
    );
}

WarehouseIndex.layout = {
    breadcrumbs: [{ title: 'Склад', href: index() }],
};
