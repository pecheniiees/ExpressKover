import { Link } from '@inertiajs/react';
import {
    BarChart3,
    ClipboardList,
    LayoutGrid,
    Settings,
    Truck,
    Users,
} from 'lucide-react';
import { usePage } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';
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
import { index as users } from '@/routes/users';
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
              ]
            : []),
        {
            title: 'В работе',
            href: '#',
            icon: Truck,
        },
        {
            title: 'Клиенты',
            href: users(),
            icon: Users,
        },
        {
            title: 'Финансы',
            href: '#',
            icon: BarChart3,
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
                            <Link href={dashboard()} prefetch className="flex w-full items-center justify-center">
                                <div className="min-w-0 text-center group-data-[collapsible=icon]:hidden">
                                    <div className="whitespace-nowrap text-[17px] font-black leading-none tracking-[-0.06em]">
                                        <span className="text-[#ffd43b]">EXPRESS</span>{' '}
                                        <span className="text-white">KOVER</span>
                                    </div>
                                    <div className="mt-1 whitespace-nowrap text-[8px] font-medium leading-none tracking-[0.02em] text-white/70">
                                        Чистые ковры — счастливый дом
                                    </div>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-[#0b3d3b] px-2 pb-3 pt-2">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-white/10 bg-[#0b3d3b] px-3 py-3" />
        </Sidebar>
    );
}
