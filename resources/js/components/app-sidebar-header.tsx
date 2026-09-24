import { usePage } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { UserMenuContent } from '@/components/user-menu-content';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { useState } from 'react';
import { Bell, ChevronDown, MessageSquareText, Search } from 'lucide-react';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');

    const roleLabels = {
        admin: 'Администратор',
        operator: 'Оператор',
        courier: 'Курьер',
        washer: 'Мойщик',
    } as const;

    return (
        <header className="flex h-[86px] shrink-0 items-center justify-between gap-4 border-b border-[#e7ece8] bg-[rgba(255,255,255,0.7)] px-5 backdrop-blur-sm md:px-6">
            <div className="flex min-w-0 items-center gap-3">
                <SidebarTrigger className="-ml-1 rounded-lg border border-[#e5e7eb] bg-white text-slate-700 shadow-sm" />
                <div className="hidden md:block">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <label className="hidden items-center gap-2 rounded-xl border border-[#e6ece7] bg-white px-3 py-2 text-sm text-slate-500 shadow-sm md:flex">
                    <Search className="size-4 text-slate-400" />
                    <input
                        className="w-64 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                        placeholder="Поиск по номеру, имени, адресу..."
                        value={searchQuery}
                        onChange={(event) => {
                            const query = event.target.value;

                            setSearchQuery(query);
                            window.dispatchEvent(
                                new CustomEvent('service-request-search', {
                                    detail: query,
                                }),
                            );
                        }}
                    />
                </label>

                <button className="flex size-10 items-center justify-center rounded-full border border-[#e6ece7] bg-white text-slate-700 shadow-sm transition hover:bg-slate-50">
                    <MessageSquareText className="size-4" />
                </button>
                <button className="relative flex size-10 items-center justify-center rounded-full border border-[#e6ece7] bg-white text-slate-700 shadow-sm transition hover:bg-slate-50">
                    <Bell className="size-4" />
                    <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-semibold text-white">
                        3
                    </span>
                </button>
                {auth.user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                aria-label="Открыть меню пользователя"
                                className="group flex items-center gap-2.5 rounded-full border border-emerald-100 bg-white py-1.5 pr-2.5 pl-1.5 text-left shadow-[0_2px_8px_rgba(15,118,110,0.08)] transition hover:border-emerald-200 hover:bg-emerald-50/30 data-[state=open]:border-emerald-300 data-[state=open]:ring-2 data-[state=open]:ring-emerald-100"
                            >
                                <div className="flex size-9 items-center justify-center rounded-full bg-[#08a88b] text-sm font-semibold text-white shadow-sm">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden min-w-0 leading-tight sm:block">
                                    <div className="max-w-32 truncate text-sm font-semibold text-slate-800">{auth.user.name}</div>
                                    <div className="mt-0.5 text-[10px] text-slate-500">{roleLabels[auth.user.role]} · <span className="text-emerald-600">Онлайн</span></div>
                                </div>
                                <ChevronDown className="hidden size-4 text-slate-400 transition-transform group-data-[state=open]:rotate-180 sm:block" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[280px] rounded-2xl border-[#dfe8e2] p-1.5 shadow-[0_14px_35px_rgba(15,23,42,0.14)]" align="end" sideOffset={8}>
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    );
}
