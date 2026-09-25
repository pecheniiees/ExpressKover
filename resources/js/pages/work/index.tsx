import { Head } from '@inertiajs/react';
import { CalendarDays, ClipboardList, MapPin, Truck, UserRound } from 'lucide-react';
import Heading from '@/components/heading';
import { index as workIndex } from '@/routes/work';

type WorkOrder = {
    id: number;
    client_name: string;
    client_phone: string;
    address: string;
    status: string;
    status_label: string;
    courier: string | null;
    queue_position: number | null;
    created_at: string | null;
};

type WorkColumn = {
    key: string;
    title: string;
    color: string;
    orders: WorkOrder[];
};

const columns: Omit<WorkColumn, 'orders'>[] = [
    { key: 'new', title: 'Новые', color: 'bg-slate-100 text-slate-700' },
    { key: 'assigned', title: 'Забор', color: 'bg-emerald-100 text-emerald-700' },
    { key: 'in_progress', title: 'В мойке', color: 'bg-indigo-100 text-indigo-700' },
    { key: 'ready', title: 'Готовы к доставке', color: 'bg-amber-100 text-amber-700' },
    { key: 'delivery', title: 'Доставка', color: 'bg-blue-100 text-blue-700' },
];

export default function WorkIndex({ orders }: { orders: WorkOrder[] }) {
    const workColumns = columns.map((column) => ({
        ...column,
        orders: orders.filter((order) => {
            if (column.key === 'assigned') {
                return ['pending', 'assigned', 'accepted'].includes(order.status);
            }

            return order.status === column.key;
        }),
    }));

    return (
        <>
            <Head title="В работе" />

            <main className="space-y-6 p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                    <Heading title="В работе" description="Контроль текущих заявок и движения заказов" />
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                        <ClipboardList className="size-5" />
                    </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-5">
                    {workColumns.map((column) => (
                        <section key={column.key} className="min-h-[420px] rounded-2xl border border-[#e1e9e4] bg-[#f7faf8] p-3">
                            <div className="mb-3 flex items-center justify-between gap-2 px-1">
                                <h2 className="text-sm font-bold text-slate-800">{column.title}</h2>
                                <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${column.color}`}>{column.orders.length}</span>
                            </div>

                            <div className="space-y-3">
                                {column.orders.map((order) => (
                                    <article key={order.id} className="rounded-xl border border-[#e1e9e4] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                                        <div className="mb-3 flex items-start justify-between gap-2">
                                            <div>
                                                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Заявка #{order.id}</div>
                                                <h3 className="mt-1 font-bold text-slate-800">{order.client_name}</h3>
                                            </div>
                                            {order.queue_position !== null && <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">#{order.queue_position + 1}</span>}
                                        </div>

                                        <div className="space-y-2 text-xs text-slate-600">
                                            <div className="flex items-start gap-2"><MapPin className="mt-0.5 size-3.5 shrink-0 text-emerald-600" /><span>{order.address}</span></div>
                                            <div className="flex items-center gap-2"><UserRound className="size-3.5 shrink-0 text-emerald-600" /><span>{order.courier ?? 'Курьер не назначен'}</span></div>
                                            <div className="flex items-center gap-2"><CalendarDays className="size-3.5 shrink-0 text-emerald-600" /><span>{order.created_at ?? 'Дата не указана'}</span></div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-t border-[#edf1ee] pt-3">
                                            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${column.color}`}>{order.status_label}</span>
                                            <Truck className="size-4 text-slate-400" />
                                        </div>
                                    </article>
                                ))}

                                {column.orders.length === 0 && <div className="rounded-xl border border-dashed border-[#d8e3dc] px-3 py-8 text-center text-xs text-slate-400">Нет заявок</div>}
                            </div>
                        </section>
                    ))}
                </div>
            </main>
        </>
    );
}

WorkIndex.layout = {
    breadcrumbs: [{ title: 'В работе', href: workIndex() }],
};
