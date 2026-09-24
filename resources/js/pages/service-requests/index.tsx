import { Form, Head } from '@inertiajs/react';
import {
    Bell,
    CalendarDays,
    ChevronDown,
    ClipboardList,
    MapPin,
    MessageSquareText,
    Plus,
    RotateCcw,
    Search,
    X,
    XCircle,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ServiceRequestController from '@/actions/App/Http/Controllers/ServiceRequestController';
import { index as serviceRequestsIndex } from '@/routes/service-requests';

const summaryCards = [
    { label: 'Все заявки', value: 45, accent: 'bg-white text-slate-700', icon: 'bg-[#e7f7f2] text-[#0d7c6a]' },
    { label: 'Забор ковров', value: 15, accent: 'bg-white text-slate-700', icon: 'bg-[#e7f7f2] text-[#0d7c6a]' },
    { label: 'В мойке', value: 8, accent: 'bg-white text-slate-700', icon: 'bg-[#edf4ff] text-[#2d5cf6]' },
    { label: 'Готовы к доставке', value: 12, accent: 'bg-white text-slate-700', icon: 'bg-[#fff3d6] text-[#e7a100]' },
    { label: 'Доставка', value: 10, accent: 'bg-white text-slate-700', icon: 'bg-[#fef1f0] text-[#df5b5b]' },
    { label: 'Завершённые', value: 532, accent: 'bg-white text-slate-700', icon: 'bg-[#e8f5ea] text-[#1b7d4f]' },
    { label: 'Отмена', value: 7, accent: 'bg-white text-slate-700', icon: 'bg-[#f0f1f2] text-slate-600' },
];

const statusStyles: Record<string, string> = {
    Забор: 'bg-emerald-100 text-emerald-700',
    'В мойке': 'bg-indigo-100 text-indigo-700',
    'Готовы к доставке': 'bg-amber-100 text-amber-700',
    Доставка: 'bg-blue-100 text-blue-700',
    Завершённые: 'bg-green-100 text-green-700',
    Отмена: 'bg-red-100 text-red-700',
};

const minimumOrderArea = 7.5;

type CatalogTariff = {
    id: number;
    name: string;
    price_per_square_meter: string | number;
};

type CatalogDiscount = {
    id: number;
    name: string;
    percentage: string | number;
};

type CatalogAroma = {
    id: number;
    name: string;
};

type ServiceRequestsProps = {
    serviceRequests: ServiceRequestProp[];
    tariffs: CatalogTariff[];
    discounts: CatalogDiscount[];
    aromas: CatalogAroma[];
};

type ServiceRequestProp = {
    id: number;
    client_name: string;
    client_phone: string;
    address: string;
    comment: string | null;
    status: string;
    created_at: string | null;
};

type FilterOption = {
    label: string;
    value: string;
};

function FilterSelect({
    value,
    options,
    onChange,
    accent = false,
}: {
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
    accent?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const selectedOption = options.find((option) => option.value === value) ?? options[0];

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className={[
                    'inline-flex min-w-32 items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-100',
                    accent
                        ? 'border-emerald-100 bg-[#f3faf7] text-slate-700 hover:border-emerald-200 hover:bg-emerald-50'
                        : 'border-[#e7ece8] bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                    isOpen ? 'border-emerald-400 ring-2 ring-emerald-100' : '',
                ].join(' ')}
            >
                <span className="truncate">{selectedOption.label}</span>
                <ChevronDown className={['size-4 shrink-0 transition-transform', isOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'].join(' ')} />
            </button>

            {isOpen && (
                <div className="absolute top-[calc(100%+6px)] left-0 z-50 min-w-full overflow-hidden rounded-xl border border-[#dfe8e2] bg-white p-1.5 shadow-[0_12px_30px_rgba(15,23,42,0.16)]">
                    {options.map((option) => {
                        const isSelected = option.value === value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={[
                                    'flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition',
                                    isSelected
                                        ? 'bg-emerald-50 font-semibold text-emerald-700'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800',
                                ].join(' ')}
                            >
                                <span className="truncate">{option.label}</span>
                                {isSelected && <span className="ml-auto pl-3 text-emerald-600">✓</span>}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function DateFilter({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const inputValue = value === 'all' ? '' : value.split('.').reverse().join('-');
    const displayValue = value === 'all' ? 'Все даты' : value;

    return (
        <div
            className="relative inline-flex cursor-pointer items-center gap-2 rounded-xl border border-emerald-100 bg-[#f3faf7] px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100"
            onClick={() => inputRef.current?.showPicker()}
        >
            <CalendarDays className="size-4 shrink-0 text-emerald-600" />
            <span className="min-w-28">{displayValue}</span>
            <input
                ref={inputRef}
                type="date"
                value={inputValue}
                onChange={(event) => {
                    const selectedDate = event.target.value;
                    onChange(selectedDate ? selectedDate.split('-').reverse().join('.') : 'all');
                }}
                className="pointer-events-none absolute inset-0 opacity-0"
                aria-label="Выбрать дату"
            />
            {value !== 'all' && (
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onChange('all');
                    }}
                    className="relative z-10 flex size-5 items-center justify-center rounded-full text-slate-400 transition hover:bg-white hover:text-slate-700"
                    aria-label="Сбросить дату"
                >
                    <X className="size-3" />
                </button>
            )}
        </div>
    );
}

export default function ServiceRequestsIndex({ serviceRequests, tariffs, discounts, aromas }: ServiceRequestsProps) {
    const statusLabels: Record<string, string> = {
        new: 'Забор',
        in_progress: 'В мойке',
        ready: 'Готовы к доставке',
        delivery: 'Доставка',
        completed: 'Завершённые',
        cancelled: 'Отмена',
    };
    const rows = serviceRequests.map((request) => ({
        id: String(request.id),
        requestId: request.id,
        name: request.client_name,
        phone: request.client_phone,
        address: request.address,
        area: '—',
        rooms: '—',
        price: '—',
        status: statusLabels[request.status] ?? request.status,
        statusValue: request.status,
        courier: 'Не назначен',
        aroma: 'Без аромата',
        date: request.created_at ?? '—',
        comment: request.comment,
    }));
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [courierFilter, setCourierFilter] = useState('all');
    const [aromaFilter, setAromaFilter] = useState('all');
    const [discountType, setDiscountType] = useState('none');
    const [carpetCount, setCarpetCount] = useState(3);
    const [carpetArea, setCarpetArea] = useState('19');
    const [tariffRate, setTariffRate] = useState(String(tariffs[0]?.price_per_square_meter ?? '0'));
    const selectedRequest = rows.find((row) => row.id === selectedId) ?? null;
    const discountOptions = [
        { value: 'none', label: 'Без скидки', percent: 0 },
        ...discounts.map((discount) => ({
            value: String(discount.id),
            label: `${discount.name} — ${discount.percentage}%`,
            percent: Number(discount.percentage),
        })),
    ];
    const selectedDiscount = discountOptions.find((option) => option.value === discountType) ?? discountOptions[0];
    const requestedArea = Number(carpetArea.replace(',', '.')) || 0;
    const billableArea = Math.max(requestedArea, minimumOrderArea);
    const subtotal = billableArea * Number(tariffRate);
    const discountedTotal = Math.round(subtotal * (1 - selectedDiscount.percent / 100));

    useEffect(() => {
        const handleSearch = (event: Event) => {
            setSearchQuery((event as CustomEvent<string>).detail);
        };

        window.addEventListener('service-request-search', handleSearch);

        return () => window.removeEventListener('service-request-search', handleSearch);
    }, []);

    const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase();
    const filteredRows = rows.filter((row) =>
        (!normalizedSearchQuery || [row.id, row.name, row.phone, row.address].some((value) => value.toLocaleLowerCase().includes(normalizedSearchQuery))) &&
        (dateFilter === 'all' || row.date === dateFilter) &&
        (statusFilter === 'all' || row.status === statusFilter) &&
        (courierFilter === 'all' || row.courier === courierFilter) &&
        (aromaFilter === 'all' || row.aroma === aromaFilter),
    );

    const resetFilters = () => {
        setDateFilter('all');
        setStatusFilter('all');
        setCourierFilter('all');
        setAromaFilter('all');
    };

    return (
        <>
            <Head title="Заявки" />

            <main className="space-y-5 p-5 md:p-6">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex-1" />
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#0d7c6a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0a6a5a]"
                                >
                                    <Plus className="size-4" />
                                    Создать заявку
                                </button>
                            </div>

                            <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
                                {summaryCards.map((card, index) => (
                                    <div
                                        key={card.label}
                                        className={[
                                            'flex items-center gap-3 rounded-2xl border border-[#e6ece8] bg-white p-3 shadow-sm',
                                            index === 0 ? 'xl:col-span-1' : '',
                                        ].join(' ')}
                                    >
                                        <div className={['flex size-11 items-center justify-center rounded-xl', card.icon].join(' ')}>
                                            <ClipboardList className="size-5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-[11px] font-medium text-slate-500">{card.label}</div>
                                            <div className="mt-1 text-2xl font-bold tracking-[-0.06em] text-slate-800">{card.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </section>

                            <section className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#e7ece8] bg-white p-2 shadow-sm">
                                <DateFilter
                                    value={dateFilter}
                                    onChange={setDateFilter}
                                />
                                <FilterSelect
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    options={[
                                        { value: 'all', label: 'Все статусы' },
                                        ...Object.keys(statusStyles).map((status) => ({ value: status, label: status })),
                                    ]}
                                />
                                <FilterSelect
                                    value={courierFilter}
                                    onChange={setCourierFilter}
                                    options={[
                                        { value: 'all', label: 'Все курьеры' },
                                        ...[...new Set(rows.map((row) => row.courier))].map((courier) => ({ value: courier, label: courier })),
                                    ]}
                                />
                                <FilterSelect
                                    value={aromaFilter}
                                    onChange={setAromaFilter}
                                    accent
                                    options={[
                                        { value: 'all', label: 'Все ароматы' },
                                        ...aromas.map((aroma) => ({ value: aroma.name, label: aroma.name })),
                                    ]}
                                />
                                <button type="button" onClick={resetFilters} className="rounded-xl border border-[#e7ece8] bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">Сбросить</button>
                            </section>

                            <section className="relative overflow-hidden rounded-[22px] border border-[#e7ece8] bg-white shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="min-w-[960px] w-full text-sm">
                                        <thead className="bg-[#f4f7f5] text-left text-slate-500">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">Клиент</th>
                                                <th className="px-4 py-3 font-medium">Телефон</th>
                                                <th className="px-4 py-3 font-medium">Адрес</th>
                                                <th className="px-4 py-3 font-medium">Ковры</th>
                                                <th className="px-4 py-3 font-medium">Площадь</th>
                                                <th className="px-4 py-3 font-medium">Сумма</th>
                                                <th className="px-4 py-3 font-medium">Статус</th>
                                                <th className="px-4 py-3 font-medium">Курьер</th>
                                                <th className="px-4 py-3 font-medium">Дата</th>
                                                <th className="px-4 py-3 font-medium">Действия</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#edf1ee] text-slate-700">
                                            {filteredRows.map((row) => {
                                                const isSelected = row.id === selectedId;

                                                return (
                                                    <tr
                                                        key={row.id}
                                                        className={[
                                                            'cursor-pointer align-middle transition hover:bg-[#f9fbfa]',
                                                            isSelected ? 'bg-[#f4faf7]' : '',
                                                        ].join(' ')}
                                                        onClick={() => setSelectedId(row.id)}
                                                    >
                                                        <td className="px-4 py-3">
                                                            <div className="font-semibold text-slate-800">{row.name}</div>
                                                            <div className="text-[11px] text-slate-500">{row.id}</div>
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-600">{row.phone}</td>
                                                        <td className="px-4 py-3 text-slate-600">{row.address}</td>
                                                        <td className="px-4 py-3">{row.rooms}</td>
                                                        <td className="px-4 py-3">{row.area} м²</td>
                                                        <td className="px-4 py-3 font-semibold text-slate-800">{row.price}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={[
                                                                'inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold',
                                                                statusStyles[row.status] ?? 'bg-slate-100 text-slate-700',
                                                            ].join(' ')}>
                                                                {row.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">{row.courier}</td>
                                                        <td className="px-4 py-3 text-slate-500">{row.date}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <Form {...ServiceRequestController.update.form(row.requestId)} onClick={(event) => event.stopPropagation()}>
                                                                    <input type="hidden" name="client_name" value={row.name} readOnly />
                                                                    <input type="hidden" name="phone" value={row.phone} readOnly />
                                                                    <input type="hidden" name="address" value={row.address} readOnly />
                                                                    <input type="hidden" name="status" value="in_progress" readOnly />
                                                                    <button type="submit" title="Перестирка" aria-label={`Перестирка заявки ${row.id}`} className="flex size-8 items-center justify-center rounded-lg border border-emerald-100 bg-white text-emerald-600 transition hover:border-emerald-200 hover:bg-emerald-50">
                                                                        <RotateCcw className="size-4" />
                                                                    </button>
                                                                </Form>
                                                                <Form {...ServiceRequestController.update.form(row.requestId)} onClick={(event) => event.stopPropagation()}>
                                                                    <input type="hidden" name="client_name" value={row.name} readOnly />
                                                                    <input type="hidden" name="phone" value={row.phone} readOnly />
                                                                    <input type="hidden" name="address" value={row.address} readOnly />
                                                                    <input type="hidden" name="status" value="cancelled" readOnly />
                                                                    <button type="submit" title="Отмена заявки" aria-label={`Отмена заявки ${row.id}`} className="flex size-8 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:border-red-200 hover:bg-red-50">
                                                                        <XCircle className="size-4" />
                                                                    </button>
                                                                </Form>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {filteredRows.length === 0 && (
                                                <tr>
                                                    <td colSpan={10} className="px-4 py-12 text-center text-sm text-slate-500">
                                                        По выбранным фильтрам заявки не найдены
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {selectedRequest && (
                                    <div
                                        className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/10 p-4 backdrop-blur-[1px]"
                                        onClick={(event) => {
                                            if (event.target === event.currentTarget) {
                                                setSelectedId(null);
                                            }
                                        }}
                                    >
                                        <div
                                            className="max-h-[calc(100vh-2rem)] w-full max-w-[420px] overflow-y-auto rounded-[24px] border border-[#e7ece8] bg-white p-5 shadow-[0_25px_60px_rgba(15,23,42,0.18)]"
                                            onClick={(event) => event.stopPropagation()}
                                        >
                                            <div className="mb-4 flex items-center justify-between">
                                            <div>
                                                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Заявка</div>
                                                <div className="mt-1 text-[15px] font-bold text-slate-800">
                                                    {selectedRequest.id}
                                                </div>
                                            </div>
                                            <button
                                                className="rounded-lg border border-[#e7ece8] bg-[#f6faf7] p-2 text-slate-500"
                                                onClick={() => setSelectedId(null)}
                                            >
                                                <X className="size-4" />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="rounded-2xl bg-[#f4faf7] p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-11 items-center justify-center rounded-full bg-[#0d7c6a] text-lg font-bold text-white">
                                                        {selectedRequest.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-lg font-semibold text-slate-800">
                                                            {selectedRequest.name}
                                                        </div>
                                                        <div className="text-sm text-slate-500">
                                                            {selectedRequest.phone}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3 text-sm text-slate-600">
                                                <div className="flex items-center gap-3 rounded-xl border border-[#e7ece8] bg-[#fafcfb] p-3">
                                                    <MapPin className="size-4 text-[#0d7c6a]" />
                                                    <span>{selectedRequest.address}</span>
                                                </div>
                                                <div className="flex items-center gap-3 rounded-xl border border-[#e7ece8] bg-[#fafcfb] p-3">
                                                    <CalendarDays className="size-4 text-[#0d7c6a]" />
                                                    <span>Желаемая дата забора: {selectedRequest.date}</span>
                                                </div>
                                                <div className="flex items-center gap-3 rounded-xl border border-[#e7ece8] bg-[#fafcfb] p-3">
                                                    <MessageSquareText className="size-4 text-[#0d7c6a]" />
                                                    <span>Постельное бельё, ковры, {selectedRequest.rooms} комнаты</span>
                                                </div>
                                            </div>

                                            <div className="grid gap-3 rounded-2xl border border-[#e7ece8] bg-[#f9fbfa] p-4">
                                                <div className="flex items-center justify-between text-sm text-slate-600">
                                                    <span>Ковры</span>
                                                    <span className="font-semibold text-slate-800">{selectedRequest.rooms}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm text-slate-600">
                                                    <span>Площадь</span>
                                                    <span className="font-semibold text-slate-800">{selectedRequest.area} м²</span>
                                                </div>
                                                <div className="flex items-center justify-between border-t border-[#e7ece8] pt-3 text-sm text-slate-600">
                                                    <span>Сумма</span>
                                                    <span className="text-lg font-bold text-[#0d7c6a]">{selectedRequest.price}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <Form {...ServiceRequestController.update.form(selectedRequest.requestId)} onSuccess={() => setSelectedId(null)}>
                                                    <input type="hidden" name="client_name" value={selectedRequest.name} readOnly />
                                                    <input type="hidden" name="phone" value={selectedRequest.phone} readOnly />
                                                    <input type="hidden" name="address" value={selectedRequest.address} readOnly />
                                                    <input type="hidden" name="status" value="in_progress" readOnly />
                                                    <button type="submit" className="w-full rounded-xl border border-[#dfe8e2] bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50">
                                                        Перестирка
                                                    </button>
                                                </Form>
                                                <Form {...ServiceRequestController.update.form(selectedRequest.requestId)} onSuccess={() => setSelectedId(null)}>
                                                    <input type="hidden" name="client_name" value={selectedRequest.name} readOnly />
                                                    <input type="hidden" name="phone" value={selectedRequest.phone} readOnly />
                                                    <input type="hidden" name="address" value={selectedRequest.address} readOnly />
                                                    <input type="hidden" name="status" value="cancelled" readOnly />
                                                    <button type="submit" className="w-full rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100">
                                                        Отмена заявки
                                                    </button>
                                                </Form>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                )}

                                {isCreateModalOpen && (
                                    <div
                                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/10 p-4 backdrop-blur-[1px]"
                                        onClick={(event) => {
                                            if (event.target === event.currentTarget) {
                                                setIsCreateModalOpen(false);
                                            }
                                        }}
                                    >
                                        <div
                                            className="max-h-[calc(100vh-2rem)] w-full max-w-[1120px] overflow-y-auto rounded-[24px] border border-[#e7ece8] bg-white p-5 shadow-[0_25px_60px_rgba(15,23,42,0.2)] md:p-6"
                                            onClick={(event) => event.stopPropagation()}
                                        >
                                            <div className="mb-5 flex items-center justify-between">
                                                <h2 className="text-lg font-bold text-slate-800">Новый заказ</h2>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCreateModalOpen(false)}
                                                    className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
                                                >
                                                    <X className="size-4" />
                                                </button>
                                            </div>

                                            <Form
                                                {...ServiceRequestController.store.form()}
                                                onSuccess={() => setIsCreateModalOpen(false)}
                                                resetOnSuccess
                                                className="grid gap-4 lg:grid-cols-2"
                                            >
                                                <input type="hidden" name="status" value="new" readOnly />
                                                <div className="grid gap-4 lg:grid-cols-2">
                                                <fieldset className="space-y-3 rounded-lg bg-[#f8faf9] p-3">
                                                    <legend className="px-1 text-xs font-bold text-slate-700">Информация о клиенте</legend>
                                                    <label className="block text-xs font-medium text-slate-600">ФИО клиента <span className="text-red-500">*</span>
                                                        <input name="client_name" className="mt-1.5 w-full rounded-lg border border-[#dfe8e2] bg-white px-3 py-2 text-sm text-slate-700" defaultValue="Алия" required />
                                                    </label>
                                                    <label className="block text-xs font-medium text-slate-600">Телефон <span className="text-red-500">*</span>
                                                        <input name="phone" className="mt-1.5 w-full rounded-lg border border-[#dfe8e2] bg-white px-3 py-2 text-sm text-slate-700" defaultValue="+77771234567" required />
                                                    </label>
                                                    <label className="block text-xs font-medium text-slate-600">Адрес <span className="text-red-500">*</span>
                                                        <div className="relative mt-1.5">
                                                            <input name="address" className="w-full rounded-lg border border-[#dfe8e2] bg-white px-3 py-2 pr-9 text-sm text-slate-700" defaultValue="Бейбитшилик 49/1, 3 этаж, кв. 30" required />
                                                            <MapPin className="absolute right-2.5 top-2.5 size-4 text-slate-500" />
                                                        </div>
                                                        <span className="mt-1 block text-[11px] font-normal text-slate-400">Координаты определяются автоматически по адресу</span>
                                                    </label>
                                                    <label className="block text-xs font-medium text-slate-600">Доп. информация (этаж, подъезд, домофон)
                                                        <input className="mt-1.5 w-full rounded-lg border border-[#dfe8e2] bg-white px-3 py-2 text-sm text-slate-700" defaultValue="3 этаж, код 1234" />
                                                    </label>
                                                    <label className="block text-xs font-medium text-slate-600">Комментарий клиента
                                                        <input name="comment" className="mt-1.5 w-full rounded-lg border border-[#dfe8e2] bg-white px-3 py-2 text-sm text-slate-700" defaultValue="После 18:00" />
                                                    </label>
                                                    <label className="flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" className="size-4 rounded border-slate-300 accent-[#0d7c6a]" /> Самовывоз</label>
                                                </fieldset>

                                                <fieldset className="space-y-3 rounded-lg bg-[#f8faf9] p-3">
                                                    <legend className="px-1 text-xs font-bold text-slate-700">Данные о коврах</legend>
                                                    <label className="block text-xs font-medium text-slate-600">Количество ковров <span className="text-red-500">*</span>
                                                        <div className="mt-1.5 flex items-center rounded-lg border border-[#dfe8e2] bg-white">
                                                            <button
                                                                type="button"
                                                                onClick={() => setCarpetCount((count) => Math.max(1, count - 1))}
                                                                disabled={carpetCount === 1}
                                                                className="px-3 py-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                                            >
                                                                −
                                                            </button>
                                                            <span className="flex-1 text-center text-sm font-semibold text-slate-700">{carpetCount}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => setCarpetCount((count) => count + 1)}
                                                                className="px-3 py-2 text-slate-500 transition hover:bg-slate-50"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </label>
                                                    <label className="block text-xs font-medium text-slate-600">Примерная площадь (м²) <span className="text-red-500">*</span>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.1"
                                                            value={carpetArea}
                                                            onChange={(event) => setCarpetArea(event.target.value)}
                                                            className="mt-1.5 w-full rounded-lg border border-[#dfe8e2] bg-white px-3 py-2 text-sm text-slate-700"
                                                        />
                                                        <span className="mt-1 block text-[11px] font-normal text-slate-400">Минимальный заказ: {minimumOrderArea.toLocaleString('ru-RU')} м²</span>
                                                    </label>
                                                    <label className="block text-xs font-medium text-slate-600">Цена за м²
                                                        <select
                                                            value={tariffRate}
                                                            onChange={(event) => setTariffRate(event.target.value)}
                                                            className="mt-1.5 w-full rounded-lg border border-[#dfe8e2] bg-white px-3 py-2 text-sm text-slate-700"
                                                        >
                                                            {tariffs.length === 0 && <option value="0">Тарифы не настроены</option>}
                                                            {tariffs.map((tariff) => (
                                                                <option key={tariff.id} value={String(tariff.price_per_square_meter)}>
                                                                    {Number(tariff.price_per_square_meter).toLocaleString('ru-RU')} ₸ ({tariff.name})
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </label>
                                                    <label className="block text-xs font-medium text-slate-600">Скидка
                                                        <select value={discountType} onChange={(event) => setDiscountType(event.target.value)} className="mt-1.5 w-full rounded-lg border border-[#dfe8e2] bg-white px-3 py-2 text-sm text-slate-700">
                                                            {discountOptions.map((option) => (
                                                                <option key={option.value} value={option.value}>{option.label}</option>
                                                            ))}
                                                        </select>
                                                    </label>
                                                    <div className="flex items-center justify-between rounded-lg bg-[#e4f7ef] px-3 py-2.5 text-sm font-semibold text-slate-700"><span>Примерная сумма</span><strong className="text-base text-slate-900">{discountedTotal.toLocaleString('ru-RU')} ₸</strong></div>
                                                    <label className="block text-xs font-medium text-slate-600">Желаемая дата забора <span className="text-red-500">*</span>
                                                        <input type="date" className="mt-1.5 w-full rounded-lg border border-[#dfe8e2] bg-white px-3 py-2 text-sm text-slate-700" defaultValue="2026-09-19" />
                                                    </label>
                                                    <label className="block text-xs font-medium text-slate-600">Желаемое время
                                                        <select className="mt-1.5 w-full rounded-lg border border-[#dfe8e2] bg-white px-3 py-2 text-sm text-slate-700" defaultValue="09:00-12:00">
                                                            <option value="09:00-12:00">С 09:00 до 12:00</option>
                                                            <option value="12:00-15:00">С 12:00 до 15:00</option>
                                                            <option value="15:00-18:00">С 15:00 до 18:00</option>
                                                            <option value="18:00-21:00">С 18:00 до 21:00</option>
                                                        </select>
                                                    </label>
                                                    <label className="block text-xs font-medium text-slate-600">Аромат
                                                        <select className="mt-1.5 w-full rounded-lg border border-[#dfe8e2] bg-white px-3 py-2 text-sm text-slate-700" defaultValue={aromas[0]?.name ?? ''}>
                                                            {aromas.length === 0 && <option value="">Ароматы не настроены</option>}
                                                            {aromas.map((aroma) => <option key={aroma.id} value={aroma.name}>{aroma.name}</option>)}
                                                        </select>
                                                    </label>
                                                </fieldset>

                                            </div>

                                            <div className="mt-5 flex justify-end gap-3 border-t border-[#edf1ee] pt-4">
                                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="rounded-lg border border-[#dfe8e2] bg-white px-8 py-2.5 text-sm font-semibold text-slate-600">Отмена</button>
                                                <button type="submit" className="rounded-lg bg-[#0d7c6a] px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0a6a5a]">Создать заказ</button>
                                            </div>
                                            </Form>
                                        </div>
                                    </div>
                                )}
                            </section>
                        </main>
        </>
    );
}

ServiceRequestsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Заявки',
            href: serviceRequestsIndex(),
        },
    ],
};
