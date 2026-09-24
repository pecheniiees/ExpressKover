import { Form, Head } from '@inertiajs/react';
import { Droplets, Pencil, Percent, Plus, Ruler, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import CatalogController from '@/actions/App/Http/Controllers/Settings/CatalogController';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { catalog as settingsCatalog } from '@/routes/settings';

type Tariff = {
    id: number;
    name: string;
    price_per_square_meter: string | number;
    description: string | null;
};

type Discount = {
    id: number;
    name: string;
    percentage: string | number;
    description: string | null;
};

type Aroma = {
    id: number;
    name: string;
    description: string | null;
};

type CatalogProps = {
    tariffs: Tariff[];
    discounts: Discount[];
    aromas: Aroma[];
};

function Field({
    label,
    name,
    defaultValue,
    type = 'text',
    placeholder,
}: {
    label: string;
    name: string;
    defaultValue?: string | number | null;
    type?: string;
    placeholder?: string;
}) {
    return (
        <label className="grid gap-1.5 text-xs font-medium text-slate-600">
            {label}
            <input
                name={name}
                type={type}
                defaultValue={defaultValue ?? ''}
                placeholder={placeholder}
                required={name !== 'description'}
                min={type === 'number' ? 0 : undefined}
                step={type === 'number' ? '0.01' : undefined}
                className="rounded-xl border border-[#dfe8e2] bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
        </label>
    );
}

function AddTariffForm() {
    return (
        <Form {...CatalogController.storeTariff.form()} resetOnSuccess className="mt-4 grid gap-2 border-t border-[#edf1ee] pt-4 md:grid-cols-[1fr_150px_1.4fr_auto]">
            {({ errors, processing }) => (
                <>
                    <Field label="Название" name="name" placeholder="Стандарт" />
                    <Field label="Цена за м²" name="price_per_square_meter" type="number" placeholder="800" />
                    <Field label="Описание" name="description" placeholder="Базовая чистка ковров" />
                    <button type="submit" disabled={processing} className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d7c6a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a6a5a] disabled:opacity-60"><Plus className="size-4" />Добавить</button>
                    <InputError message={errors.name ?? errors.price_per_square_meter ?? errors.description} />
                </>
            )}
        </Form>
    );
}

function EditTariffForm({ tariff, onCancel }: { tariff: Tariff; onCancel: () => void }) {
    return (
        <Form {...CatalogController.updateTariff.form(tariff.id)} onSuccess={onCancel} className="grid gap-2 border-t border-[#edf1ee] pt-3 sm:grid-cols-[1fr_130px_1.2fr_auto]">
            {({ errors, processing }) => (
                <>
                    <Field label="Название" name="name" defaultValue={tariff.name} />
                    <Field label="Цена за м²" name="price_per_square_meter" type="number" defaultValue={tariff.price_per_square_meter} />
                    <Field label="Описание" name="description" defaultValue={tariff.description} />
                    <div className="flex items-end gap-1">
                        <button type="submit" disabled={processing} className="flex size-10 items-center justify-center rounded-xl bg-[#0d7c6a] text-white disabled:opacity-60">{processing ? <Spinner /> : '✓'}</button>
                        <button type="button" onClick={onCancel} className="flex size-10 items-center justify-center rounded-xl border border-[#dfe8e2] text-slate-500"><X className="size-4" /></button>
                    </div>
                    <InputError message={errors.name ?? errors.price_per_square_meter ?? errors.description} />
                </>
            )}
        </Form>
    );
}

function AddDiscountForm() {
    return (
        <Form {...CatalogController.storeDiscount.form()} resetOnSuccess className="mt-4 grid gap-2 border-t border-[#edf1ee] pt-4 md:grid-cols-[1fr_150px_1.4fr_auto]">
            {({ errors, processing }) => (
                <>
                    <Field label="Название" name="name" placeholder="Постоянный клиент" />
                    <Field label="Процент" name="percentage" type="number" placeholder="5" />
                    <Field label="Описание" name="description" placeholder="Для повторных заказов" />
                    <button type="submit" disabled={processing} className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d7c6a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a6a5a] disabled:opacity-60"><Plus className="size-4" />Добавить</button>
                    <InputError message={errors.name ?? errors.percentage ?? errors.description} />
                </>
            )}
        </Form>
    );
}

function EditDiscountForm({ discount, onCancel }: { discount: Discount; onCancel: () => void }) {
    return (
        <Form {...CatalogController.updateDiscount.form(discount.id)} onSuccess={onCancel} className="grid gap-2 border-t border-[#edf1ee] pt-3 sm:grid-cols-[1fr_130px_1.2fr_auto]">
            {({ errors, processing }) => (
                <>
                    <Field label="Название" name="name" defaultValue={discount.name} />
                    <Field label="Процент" name="percentage" type="number" defaultValue={discount.percentage} />
                    <Field label="Описание" name="description" defaultValue={discount.description} />
                    <div className="flex items-end gap-1">
                        <button type="submit" disabled={processing} className="flex size-10 items-center justify-center rounded-xl bg-[#0d7c6a] text-white disabled:opacity-60">{processing ? <Spinner /> : '✓'}</button>
                        <button type="button" onClick={onCancel} className="flex size-10 items-center justify-center rounded-xl border border-[#dfe8e2] text-slate-500"><X className="size-4" /></button>
                    </div>
                    <InputError message={errors.name ?? errors.percentage ?? errors.description} />
                </>
            )}
        </Form>
    );
}

function AddAromaForm() {
    return (
        <Form {...CatalogController.storeAroma.form()} resetOnSuccess className="mt-4 grid gap-2 border-t border-[#edf1ee] pt-4 md:grid-cols-[1fr_1.4fr_auto]">
            {({ errors, processing }) => (
                <>
                    <Field label="Название" name="name" placeholder="Orchid Dream" />
                    <Field label="Описание" name="description" placeholder="Нежный цветочный аромат" />
                    <button type="submit" disabled={processing} className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d7c6a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a6a5a] disabled:opacity-60"><Plus className="size-4" />Добавить</button>
                    <InputError message={errors.name ?? errors.description} />
                </>
            )}
        </Form>
    );
}

function EditAromaForm({ aroma, onCancel }: { aroma: Aroma; onCancel: () => void }) {
    return (
        <Form {...CatalogController.updateAroma.form(aroma.id)} onSuccess={onCancel} className="grid gap-2 border-t border-[#edf1ee] pt-3 sm:grid-cols-[1fr_1.2fr_auto]">
            {({ errors, processing }) => (
                <>
                    <Field label="Название" name="name" defaultValue={aroma.name} />
                    <Field label="Описание" name="description" defaultValue={aroma.description} />
                    <div className="flex items-end gap-1">
                        <button type="submit" disabled={processing} className="flex size-10 items-center justify-center rounded-xl bg-[#0d7c6a] text-white disabled:opacity-60">{processing ? <Spinner /> : '✓'}</button>
                        <button type="button" onClick={onCancel} className="flex size-10 items-center justify-center rounded-xl border border-[#dfe8e2] text-slate-500"><X className="size-4" /></button>
                    </div>
                    <InputError message={errors.name ?? errors.description} />
                </>
            )}
        </Form>
    );
}

export default function CatalogSettings({ tariffs, discounts, aromas }: CatalogProps) {
    const [editing, setEditing] = useState<string | null>(null);

    return (
        <>
            <Head title="Тарифы и скидки" />
            <div className="space-y-6">
                <div className="rounded-2xl border border-[#dfe8e2] bg-[#f4faf7] p-5">
                    <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0d7c6a] text-white"><Ruler className="size-5" /></div>
                        <div><h2 className="text-lg font-bold text-slate-800">Тарифы и скидки</h2><p className="mt-1 text-sm text-slate-500">Настройте цены, скидки и ароматы для новых заявок.</p></div>
                    </div>
                </div>

                <CatalogSection title="Тарифы" subtitle="Стоимость чистки ковров за 1 м²" count={`${tariffs.length} тарифа`} badge="emerald">
                    {tariffs.map((tariff) => editing === `tariff-${tariff.id}` ? <EditTariffForm key={tariff.id} tariff={tariff} onCancel={() => setEditing(null)} /> : <CatalogRow key={tariff.id} icon={<Ruler className="size-4" />} iconClass="bg-emerald-100 text-emerald-700" name={tariff.name} description={tariff.description} value={`${tariff.price_per_square_meter} ₸/м²`} onEdit={() => setEditing(`tariff-${tariff.id}`)} deleteForm={<Form {...CatalogController.destroyTariff.form(tariff.id)}><button type="submit" className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"><Trash2 className="size-4" /></button></Form>} />)}
                    <AddTariffForm />
                </CatalogSection>

                <CatalogSection title="Типы скидок" subtitle="Варианты для формы создания заявки" count={`${discounts.length} типа`} badge="amber">
                    {discounts.map((discount) => editing === `discount-${discount.id}` ? <EditDiscountForm key={discount.id} discount={discount} onCancel={() => setEditing(null)} /> : <CatalogRow key={discount.id} icon={<Percent className="size-4" />} iconClass="bg-amber-100 text-amber-700" name={discount.name} description={discount.description} value={`${discount.percentage}%`} onEdit={() => setEditing(`discount-${discount.id}`)} deleteForm={<Form {...CatalogController.destroyDiscount.form(discount.id)}><button type="submit" className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"><Trash2 className="size-4" /></button></Form>} />)}
                    <AddDiscountForm />
                </CatalogSection>

                <CatalogSection title="Ароматы" subtitle="Варианты ароматов для новых заявок" count={`${aromas.length} аромата`} badge="sky">
                    {aromas.map((aroma) => editing === `aroma-${aroma.id}` ? <EditAromaForm key={aroma.id} aroma={aroma} onCancel={() => setEditing(null)} /> : <CatalogRow key={aroma.id} icon={<Droplets className="size-4" />} iconClass="bg-sky-100 text-sky-700" name={aroma.name} description={aroma.description} onEdit={() => setEditing(`aroma-${aroma.id}`)} deleteForm={<Form {...CatalogController.destroyAroma.form(aroma.id)}><button type="submit" className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"><Trash2 className="size-4" /></button></Form>} />)}
                    <AddAromaForm />
                </CatalogSection>
            </div>
        </>
    );
}

function CatalogSection({ title, subtitle, count, badge, children }: { title: string; subtitle: string; count: string; badge: 'emerald' | 'amber' | 'sky'; children: React.ReactNode }) {
    const badgeClass = { emerald: 'bg-emerald-100 text-emerald-700', amber: 'bg-amber-100 text-amber-700', sky: 'bg-sky-100 text-sky-700' }[badge];
    return <section className="rounded-2xl border border-[#e1e9e4] bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between gap-3"><div><h3 className="font-bold text-slate-800">{title}</h3><p className="mt-1 text-xs text-slate-500">{subtitle}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass}`}>{count}</span></div><div className="space-y-2">{children}</div></section>;
}

function CatalogRow({ icon, iconClass, name, description, value, onEdit, deleteForm }: { icon: React.ReactNode; iconClass: string; name: string; description: string | null; value?: string; onEdit: () => void; deleteForm: React.ReactNode }) {
    return <div className="flex items-center gap-3 rounded-xl border border-[#edf1ee] bg-[#fbfcfb] p-3"><div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>{icon}</div><div className="min-w-0 flex-1"><div className="font-semibold text-slate-800">{name}</div><div className="truncate text-xs text-slate-500">{description || 'Без описания'}</div></div>{value && <div className="whitespace-nowrap text-sm font-bold text-slate-800">{value}</div>}<button type="button" onClick={onEdit} className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label={`Изменить ${name}`}><Pencil className="size-4" /></button>{deleteForm}</div>;
}

CatalogSettings.layout = {
    breadcrumbs: [{ title: 'Настройки тарифов и скидок', href: settingsCatalog() }],
};
