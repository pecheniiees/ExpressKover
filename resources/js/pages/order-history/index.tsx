import { Form, Head, Link } from '@inertiajs/react';
import { Archive, CheckCircle2, Search, XCircle } from 'lucide-react';
import Heading from '@/components/heading';
import { index as orderHistory } from '@/routes/order-history';

type Order = {
    id: number;
    client_name: string;
    client_phone: string;
    address: string;
    status: string;
    courier: string | null;
    amount: number | null;
    updated_at: string | null;
};

type OrdersPaginator = {
    data: Order[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type Props = {
    orders: OrdersPaginator;
    summary: {
        total: number;
        completed: number;
        cancelled: number;
    };
    filters: {
        search: string;
    };
};

const statusLabels: Record<string, string> = {
    completed: 'Завершён',
    delivered: 'Доставлен',
    cancelled: 'Отменён',
};

const statusStyles: Record<string, string> = {
    completed: 'bg-emerald-100 text-emerald-700',
    delivered: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function OrderHistoryIndex({ orders, summary, filters }: Props) {
    const money = (value: number | null) =>
        value === null ? '—' : `${Math.round(value).toLocaleString('ru-RU')} ₸`;

    return (
        <>
            <Head title="История заказов" />
            <main className="space-y-6 p-5 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <Heading
                        title="История заказов"
                        description="Завершённые и отменённые заказы Express Kover"
                    />
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                        <Archive className="size-5" />
                    </div>
                </div>

                <section className="grid gap-3 sm:grid-cols-3">
                    <SummaryCard
                        label="Всего в истории"
                        value={summary.total}
                        icon={<Archive className="size-5" />}
                        tone="slate"
                    />
                    <SummaryCard
                        label="Завершено"
                        value={summary.completed}
                        icon={<CheckCircle2 className="size-5" />}
                        tone="green"
                    />
                    <SummaryCard
                        label="Отменено"
                        value={summary.cancelled}
                        icon={<XCircle className="size-5" />}
                        tone="red"
                    />
                </section>

                <section className="rounded-2xl border border-[#e1e9e4] bg-white p-3 shadow-sm">
                    <Form
                        {...orderHistory.form()}
                        className="flex flex-col gap-3 sm:flex-row"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                name="search"
                                defaultValue={filters.search}
                                placeholder="Поиск по клиенту, телефону или адресу"
                                className="h-11 w-full rounded-xl border border-[#e1e9e4] bg-[#f9fbfa] pr-4 pl-10 text-sm text-slate-700 transition outline-none placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0d7c6a] px-5 text-sm font-semibold text-white transition hover:bg-[#0a6a5a]"
                        >
                            <Search className="size-4" />
                            Найти
                        </button>
                        {filters.search && (
                            <Link
                                href={orderHistory()}
                                className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e1e9e4] px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                Сбросить
                            </Link>
                        )}
                    </Form>
                </section>

                <section className="overflow-hidden rounded-2xl border border-[#e1e9e4] bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-sm">
                            <thead className="bg-[#f4f7f5] text-left text-slate-500">
                                <tr>
                                    <th className="px-5 py-3 font-medium">
                                        Заказ
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Клиент
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Адрес
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Курьер
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Сумма
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Статус
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Дата
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#edf1ee] text-slate-700">
                                {orders.data.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="transition hover:bg-[#f9fbfa]"
                                    >
                                        <td className="px-5 py-4 font-semibold text-slate-800">
                                            #{order.id}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-slate-800">
                                                {order.client_name}
                                            </div>
                                            <div className="mt-1 text-xs text-slate-500">
                                                {order.client_phone}
                                            </div>
                                        </td>
                                        <td className="max-w-64 truncate px-5 py-4 text-slate-600">
                                            {order.address}
                                        </td>
                                        <td className="px-5 py-4 text-slate-600">
                                            {order.courier ?? 'Не назначен'}
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-slate-800">
                                            {money(order.amount)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[order.status] ?? 'bg-slate-100 text-slate-700'}`}
                                            >
                                                {statusLabels[order.status] ??
                                                    order.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-slate-500">
                                            {order.updated_at ?? '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {orders.data.length === 0 && (
                        <div className="px-5 py-16 text-center">
                            <Archive className="mx-auto size-8 text-slate-300" />
                            <p className="mt-3 text-sm font-semibold text-slate-600">
                                История пока пуста
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                                Завершённые заказы появятся здесь
                            </p>
                        </div>
                    )}

                    {orders.last_page > 1 && (
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf1ee] px-5 py-4">
                            <p className="text-xs text-slate-500">
                                Всего заказов: {orders.total}
                            </p>
                            <nav
                                className="flex items-center gap-1"
                                aria-label="Пагинация истории заказов"
                            >
                                {orders.links.map((link, index) =>
                                    link.url ? (
                                        <Link
                                            key={`${link.label}-${index}`}
                                            href={link.url}
                                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${link.active ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            key={`${link.label}-${index}`}
                                            className="px-3 py-1.5 text-xs text-slate-300"
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ),
                                )}
                            </nav>
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}

function SummaryCard({
    label,
    value,
    icon,
    tone,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    tone: 'slate' | 'green' | 'red';
}) {
    const tones = {
        slate: 'bg-slate-100 text-slate-600',
        green: 'bg-emerald-100 text-emerald-700',
        red: 'bg-red-100 text-red-600',
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

OrderHistoryIndex.layout = {
    breadcrumbs: [{ title: 'История заказов', href: orderHistory() }],
};
