import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();
    const getInitials = useInitials();

    const roleLabels = {
        admin: 'Администратор',
        operator: 'Оператор',
        courier: 'Курьер',
        washer: 'Мойщик',
    } as const;

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-3 rounded-xl bg-[#f5faf8] px-3 py-3 text-left">
                    <Avatar className="size-10 shrink-0 ring-2 ring-white">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-slate-100 text-slate-700">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-slate-800">{user.name}</div>
                        <div className="mt-0.5 truncate text-xs text-slate-500">{user.phone ?? 'Телефон не указан'}</div>
                        <span className="mt-1 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            {roleLabels[user.role]}
                        </span>
                    </div>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="flex h-10 w-full cursor-pointer items-center rounded-xl px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2" />
                        Настройки
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="flex h-10 w-full cursor-pointer items-center rounded-xl px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-red-50 hover:text-red-700"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2" />
                    Выйти
                </Link>
            </DropdownMenuItem>
        </>
    );
}
