import { Link } from '@inertiajs/react';
import {
    Archive,
    BarChart3,
    ClipboardList,
    LayoutGrid,
    Settings,
    Truck,
    Users,
    Warehouse,
} from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as serviceRequests } from '@/routes/service-requests';
import { catalog as settingsCatalog } from '@/routes/settings';
import { index as clients } from '@/routes/clients';
import { index as users } from '@/routes/users';
import { index as work } from '@/routes/work';
import { index as finance } from '@/routes/finance';
import { index as orderHistory } from '@/routes/order-history';
import warehouse from '@/routes/warehouse';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props;
    const mainNavItems: NavItem[] = [
        {
            title: 'Главная',
            href: dashboard(),
            icon: LayoutGrid,
        },
        ...(auth.user?.role === 'admin' || auth.user?.role === 'operator'
            ? [
                  {
                      title: 'Заказы',
                      href: serviceRequests(),
                      icon: ClipboardList,
                  },
                  {
                      title: 'История заказов',
                      href: orderHistory(),
                      icon: Archive,
                  },
              ]
            : []),
        {
            title: 'В работе',
            href: work(),
            icon: Truck,
        },
        {
            title: 'Сотрудники',
            href: users(),
            icon: Users,
        },
        {
            title: 'Клиенты',
            href: clients(),
            icon: Users,
        },
        {
            title: 'Финансы',
            href: finance(),
            icon: BarChart3,
        },
        {
            title: 'Склад',
            href: warehouse.expenses.index(),
            icon: Warehouse,
        },
        {
            title: 'Настройки',
            href: settingsCatalog(),
            icon: Settings,
        },
    ];

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="!bg-[#0b3d3b] !text-white [&>div]:!bg-[#0b3d3b]"
        >
            <SidebarHeader className="border-b border-white/10 bg-[#0b3d3b] px-3 py-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="h-auto rounded-xl bg-transparent px-2 py-2 hover:bg-white/5"
                        >
                            <Link
                                href={dashboard()}
                                prefetch
                                className="flex w-full items-center justify-center"
                            >
                                <div className="min-w-0 text-center group-data-[collapsible=icon]:hidden">
                                    <div className="text-[17px] leading-none font-black tracking-[-0.06em] whitespace-nowrap">
                                        <span className="text-[#ffd43b]">
                                            EXPRESS
                                        </span>{' '}
                                        <span className="text-white">
                                            KOVER
                                        </span>
                                    </div>
                                    <div className="mt-1 text-[8px] leading-none font-medium tracking-[0.02em] whitespace-nowrap text-white/70">
                                        Чистые ковры — счастливый дом
                                    </div>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-[#0b3d3b] px-2 pt-2 pb-3">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-white/10 bg-[#0b3d3b] px-3 py-3" />
        </Sidebar>
    );
}
