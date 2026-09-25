import { Head } from '@inertiajs/react';
import { MapPin, Phone, Users } from 'lucide-react';
import Heading from '@/components/heading';
import { index as clientsIndex } from '@/routes/clients';

type Client = {
    name: string;
    phone: string;
    address: string;
    orders_count: number;
};

export default function ClientsIndex({ clients }: { clients: Client[] }) {
    return (
        <>
            <Head title="Клиенты" />

            <div className="space-y-6 p-4">
                <div className="flex items-start justify-between gap-4">
                    <Heading
                        title="Клиенты"
                        description="Клиенты и история их заявок"
                    />
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                        <Users className="size-5" />
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#e1e9e4] bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[44rem] text-sm">
                            <thead className="bg-[#f4f8f5] text-left text-slate-500">
                                <tr>
                                    <th className="px-5 py-3 font-medium">Клиент</th>
                                    <th className="px-5 py-3 font-medium">Телефон</th>
                                    <th className="px-5 py-3 font-medium">Последний адрес</th>
                                    <th className="px-5 py-3 text-right font-medium">Заявки</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#edf1ee]">
                                {clients.map((client) => (
                                    <tr key={client.phone} className="transition hover:bg-[#f9fbfa]">
                                        <td className="px-5 py-4 font-semibold text-slate-800">{client.name}</td>
                                        <td className="px-5 py-4 text-slate-600">
                                            <span className="inline-flex items-center gap-2"><Phone className="size-4 text-emerald-600" />{client.phone}</span>
                                        </td>
                                        <td className="px-5 py-4 text-slate-600">
                                            <span className="inline-flex items-center gap-2"><MapPin className="size-4 text-emerald-600" />{client.address}</span>
                                        </td>
                                        <td className="px-5 py-4 text-right"><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">{client.orders_count}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {clients.length === 0 && (
                        <p className="p-10 text-center text-sm text-slate-500">Клиенты появятся после создания первой заявки.</p>
                    )}
                </div>
            </div>
        </>
    );
}

ClientsIndex.layout = {
    breadcrumbs: [{ title: 'Клиенты', href: clientsIndex() }],
};
