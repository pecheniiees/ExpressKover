import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-3">
            <SidebarGroupLabel className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                Меню
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={{ children: item.title }}
                            className={[
                                'group relative flex h-11 w-full items-center gap-3 rounded-xl border border-transparent px-3 text-sm font-medium text-white/70 transition-all duration-200',
                                'hover:border-white/10 hover:bg-white/5 hover:text-white',
                                'data-[active=true]:border-emerald-400/30 data-[active=true]:bg-emerald-500/12 data-[active=true]:text-white',
                            ].join(' ')}
                        >
                            <Link href={item.href} prefetch className="flex w-full items-center gap-3">
                                {item.icon && <item.icon className="size-4 shrink-0" />}
                                <span>{item.title}</span>
                                {item.title === 'Заявки' && (
                                    <span className="ml-auto inline-flex min-w-6 items-center justify-center rounded-full bg-emerald-400/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-200">
                                        45
                                    </span>
                                )}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
