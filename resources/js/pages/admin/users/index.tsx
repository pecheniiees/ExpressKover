import { Form, Head } from '@inertiajs/react';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import PhoneInput from '@/components/phone-input';
import { index as usersIndex } from '@/routes/users';

type ManagedUser = {
    id: number;
    name: string;
    phone: string | null;
    role: 'admin' | 'operator' | 'courier' | 'washer';
};

const roles = {
    admin: 'Администратор',
    operator: 'Оператор',
    courier: 'Доставщик',
    washer: 'Мойщик',
} as const;

function RoleSelect({ defaultValue }: { defaultValue: ManagedUser['role'] }) {
    return (
        <select
            name="role"
            defaultValue={defaultValue}
            className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
        >
            {Object.entries(roles).map(([value, label]) => (
                <option key={value} value={value}>
                    {label}
                </option>
            ))}
        </select>
    );
}

function UserFields({ user }: { user?: ManagedUser }) {
    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor={`name-${user?.id ?? 'new'}`}>Имя</Label>
                <Input
                    id={`name-${user?.id ?? 'new'}`}
                    name="name"
                    defaultValue={user?.name}
                    required
                    autoFocus
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={`phone-${user?.id ?? 'new'}`}>Номер телефона</Label>
                <PhoneInput
                    id={`phone-${user?.id ?? 'new'}`}
                    defaultValue={user?.phone}
                    required
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={`role-${user?.id ?? 'new'}`}>Роль</Label>
                <RoleSelect defaultValue={user?.role ?? 'washer'} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={`password-${user?.id ?? 'new'}`}>
                    {user ? 'Новый пароль (необязательно)' : 'Пароль'}
                </Label>
                <Input
                    id={`password-${user?.id ?? 'new'}`}
                    name="password"
                    type="password"
                    required={!user}
                    autoComplete="new-password"
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor={`password-confirmation-${user?.id ?? 'new'}`}>
                    Подтвердите пароль
                </Label>
                <Input
                    id={`password-confirmation-${user?.id ?? 'new'}`}
                    name="password_confirmation"
                    type="password"
                    required={!user}
                    autoComplete="new-password"
                />
            </div>
        </div>
    );
}

function CreateUserDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <UserPlus /> Добавить пользователя
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Новый пользователь</DialogTitle>
                    <DialogDescription>
                        Укажите данные и роль нового пользователя.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    {...UserController.store.form()}
                    resetOnSuccess
                    onSuccess={() => setOpen(false)}
                    className="grid gap-6"
                >
                    {({ errors, processing }) => (
                        <>
                            <UserFields />
                            <InputError message={errors.name ?? errors.phone ?? errors.role ?? errors.password} />
                            <Button type="submit" disabled={processing}>
                                {processing && <Spinner />} Создать пользователя
                            </Button>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function EditUserDialog({ user }: { user: ManagedUser }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={`Изменить ${user.name}`}>
                    <Pencil className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Редактирование пользователя</DialogTitle>
                    <DialogDescription>{user.name}</DialogDescription>
                </DialogHeader>
                <Form
                    {...UserController.update.form(user.id)}
                    onSuccess={() => setOpen(false)}
                    className="grid gap-6"
                >
                    {({ errors, processing }) => (
                        <>
                            <UserFields user={user} />
                            <InputError message={errors.name ?? errors.phone ?? errors.role ?? errors.password} />
                            <Button type="submit" disabled={processing}>
                                {processing && <Spinner />} Сохранить изменения
                            </Button>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default function UsersIndex({ users }: { users: ManagedUser[] }) {
    return (
        <>
            <Head title="Пользователи" />

            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        title="Пользователи"
                        description="Создавайте, редактируйте и удаляйте пользователей"
                    />
                    <CreateUserDialog />
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[40rem] text-sm">
                            <thead className="bg-muted/50 text-left text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Имя</th>
                                    <th className="px-4 py-3 font-medium">Номер телефона</th>
                                    <th className="px-4 py-3 font-medium">Роль</th>
                                    <th className="px-4 py-3 text-right font-medium">Действия</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-4 py-3 font-medium">{user.name}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{user.phone}</td>
                                        <td className="px-4 py-3">{roles[user.role]}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-1">
                                                <EditUserDialog user={user} />
                                                <Form {...UserController.destroy.form(user.id)}>
                                                    {({ processing }) => (
                                                        <Button
                                                            type="submit"
                                                            variant="ghost"
                                                            size="icon"
                                                            disabled={processing}
                                                            aria-label={`Удалить ${user.name}`}
                                                        >
                                                            <Trash2 className="size-4 text-destructive" />
                                                        </Button>
                                                    )}
                                                </Form>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.length === 0 && (
                        <p className="p-6 text-center text-sm text-muted-foreground">
                            Пользователей пока нет.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Пользователи',
            href: usersIndex(),
        },
    ],
};
