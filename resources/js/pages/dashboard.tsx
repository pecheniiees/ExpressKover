import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, BarChart3, CheckCircle2, ClipboardList, Clock3, MapPin, Users, WalletCards } from 'lucide-react';
import Heading from '@/components/heading';
import { index as clients } from '@/routes/clients';
import { index as finance } from '@/routes/finance';
import { index as serviceRequests } from '@/routes/service-requests';
import { index as work } from '@/routes/work';
import { dashboard } from '@/routes';

type DashboardStats = {
    total_orders: number;
    active_orders: number;
    completed_orders: number;
    revenue: number;
    couriers_online: number;
    couriers_total: number;
    status_counts: Array<{ status: string; label: string; value: number }>;
};

type RecentOrder = {
    id: number;
    client_name: string;
    address: string;
    status: string;
    status_label: string;
    courier: string | null;
    amount: number | null;
    created_at: string | null;
};

const statusColors: Record<string, string> = {
    new: 'bg-slate-100 text-slate-700',
    assigned: 'bg-emerald-100 text-emerald-700',
    accepted: 'bg-cyan-100 text-cyan-700',
    in_progress: 'bg-indigo-100 text-indigo-700',
    ready: 'bg-amber-100 text-amber-700',
    delivery: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function Dashboard({ stats, recent_orders }: { stats: DashboardStats; recent_orders: RecentOrder[] }) {
    const money = (value: number) => `${Math.round(value).toLocaleString('ru-RU')} ₸`;
    const maxStatus = Math.max(...stats.status_counts.map((item) => item.value), 1);

    return (
        <>
            <Head title="Панель управления" />
            <main className="space-y-6 p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <Heading title="Панель управления" description="Главные показатели Express Kover за сегодня" />
                    <Link href={serviceRequests()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d7c6a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0a6a5a]">
                        <ClipboardList className="size-4" /> Открыть заявки
                    </Link>
                </div>

                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard icon={<ClipboardList className="size-5" />} label="Всего заказов" value={String(stats.total_orders)} tone="emerald" href={serviceRequests()} />
                    <MetricCard icon={<Clock3 className="size-5" />} label="В работе" value={String(stats.active_orders)} tone="blue" href={work()} />
                    <MetricCard icon={<CheckCircle2 className="size-5" />} label="Завершено" value={String(stats.completed_orders)} tone="green" href={finance()} />
                    <MetricCard icon={<WalletCards className="size-5" />} label="Оборот" value={money(stats.revenue)} tone="amber" href={finance()} />
                </section>

                <section className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
                    <div className="rounded-2xl border border-[#e1e9e4] bg-white p-5 shadow-sm">
                        <div className="mb-5 flex items-start justify-between">
                            <div><h2 className="font-bold text-slate-800">Последние заявки</h2><p className="mt-1 text-xs text-slate-500">Живая лента последних изменений</p></div>
                            <Link href={serviceRequests()} className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">Все заявки</Link>
                        </div>
                        <div className="space-y-2">
                            {recent_orders.map((order) => (
                                <div key={order.id} className="flex items-center gap-3 rounded-xl border border-[#edf1ee] p-3 transition hover:bg-[#f9fbfa]">
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-700">#{order.id}</div>
                                    <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-slate-800">{order.client_name}</div><div className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500"><MapPin className="size-3" />{order.address}</div></div>
                                    <div className="hidden text-right sm:block"><div className="text-xs text-slate-400">{order.created_at}</div><div className="mt-1 text-sm font-semibold text-slate-700">{order.amount === null ? '—' : money(order.amount)}</div></div>
                                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusColors[order.status] ?? 'bg-slate-100 text-slate-700'}`}>{order.status_label}</span>
                                </div>
                            ))}
                            {recent_orders.length === 0 && <div className="rounded-xl border border-dashed border-[#d8e3dc] p-8 text-center text-sm text-slate-400">Заявок пока нет</div>}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#e1e9e4] bg-white p-5 shadow-sm">
                        <div className="mb-5 flex items-start justify-between"><div><h2 className="font-bold text-slate-800">Статусы</h2><p className="mt-1 text-xs text-slate-500">Распределение заявок</p></div><BarChart3 className="size-5 text-emerald-600" /></div>
                        <div className="space-y-4">
                            {stats.status_counts.map((item) => <div key={item.status}><div className="mb-1.5 flex justify-between text-sm"><span className="text-slate-600">{item.label}</span><strong className="text-slate-800">{item.value}</strong></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.max((item.value / maxStatus) * 100, 5)}%` }} /></div></div>)}
                        </div>
                    </div>
                </section>

                <section className="grid gap-3 sm:grid-cols-2">
                    <Link href={work()} className="flex items-center gap-4 rounded-2xl border border-[#e1e9e4] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex size-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><Users className="size-5" /></div><div className="flex-1"><div className="font-bold text-slate-800">Курьеры онлайн</div><div className="mt-1 text-sm text-slate-500">{stats.couriers_online} из {stats.couriers_total} с GPS за последние 15 минут</div></div><ArrowUpRight className="size-5 text-slate-400" /></Link>
                    <Link href={clients()} className="flex items-center gap-4 rounded-2xl border border-[#e1e9e4] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex size-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><Users className="size-5" /></div><div className="flex-1"><div className="font-bold text-slate-800">Клиенты</div><div className="mt-1 text-sm text-slate-500">Открыть клиентскую базу</div></div><ArrowUpRight className="size-5 text-slate-400" /></Link>
                </section>
            </main>
        </>
    );
}

function MetricCard({ icon, label, value, tone, href }: { icon: React.ReactNode; label: string; value: string; tone: 'emerald' | 'blue' | 'green' | 'amber'; href: ReturnType<typeof serviceRequests> }) {
    const tones = { emerald: 'bg-emerald-100 text-emerald-700', blue: 'bg-blue-100 text-blue-700', green: 'bg-green-100 text-green-700', amber: 'bg-amber-100 text-amber-700' };
    return <Link href={href} className="flex items-center gap-3 rounded-2xl border border-[#e1e9e4] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className={`flex size-11 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</div><div><div className="text-xs text-slate-500">{label}</div><div className="mt-1 text-2xl font-bold text-slate-800">{value}</div></div></Link>;
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Панель управления', href: dashboard() }],
};
