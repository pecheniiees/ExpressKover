import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, Check, Clock3, MapPin, ShieldCheck, Truck } from 'lucide-react';
import { dashboard, login } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Express Kover" />
            <div className="min-h-screen overflow-hidden bg-[#f2f4ef] text-[#17332b]">
                <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
                    <Link href="/" className="flex items-center gap-3" aria-label="Express Kover">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-[#17332b] text-[#f3a64a] shadow-lg shadow-[#17332b]/15">
                            <Truck className="size-5" strokeWidth={2.25} />
                        </span>
                        <span className="text-lg font-semibold tracking-[-0.03em] sm:text-xl">
                            express<span className="text-[#e17b38]">kover</span>
                        </span>
                    </Link>

                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="inline-flex items-center gap-2 rounded-full bg-[#17332b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#285143]"
                        >
                            Панель управления
                            <ArrowUpRight className="size-4" />
                        </Link>
                    ) : (
                        <Link
                            href={login()}
                            className="inline-flex items-center gap-2 rounded-full border border-[#17332b]/20 bg-white/70 px-4 py-2.5 text-sm font-semibold text-[#17332b] transition hover:border-[#17332b] hover:bg-white"
                        >
                            Войти
                            <ArrowUpRight className="size-4" />
                        </Link>
                    )}
                </header>

                <main className="relative mx-auto max-w-7xl px-5 pb-8 sm:px-8 lg:px-10">
                    <div className="pointer-events-none absolute -top-24 right-[-10rem] size-[30rem] rounded-full bg-[#f3a64a]/20 blur-3xl" />
                    <section className="relative grid min-h-[calc(100vh-88px)] items-center gap-12 pb-12 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-0">
                        <div className="max-w-2xl">
                            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#17332b]/10 bg-white/65 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#e17b38]">
                                <span className="size-1.5 rounded-full bg-[#e17b38]" />
                                Чистота с заботой
                            </div>
                            <h1 className="max-w-xl text-5xl leading-[0.98] font-semibold tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                                Ковры, которым снова хочется доверять.
                            </h1>
                            <p className="mt-7 max-w-lg text-base leading-7 text-[#17332b]/65 sm:text-lg">
                                Забираем, бережно очищаем и возвращаем ваши ковры. Всё под контролем в одной системе.
                            </p>
                            <div className="mt-9 flex flex-wrap items-center gap-3">
                                <Link
                                    href={auth.user ? dashboard() : login()}
                                    className="inline-flex items-center gap-3 rounded-full bg-[#e17b38] px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#e17b38]/20 transition hover:-translate-y-0.5 hover:bg-[#c96629]"
                                >
                                    {auth.user ? 'Открыть кабинет' : 'Войти в кабинет'}
                                    <ArrowUpRight className="size-4" />
                                </Link>
                                <span className="px-2 text-sm text-[#17332b]/50">Работаем по Алматы</span>
                            </div>
                            <div className="mt-14 flex flex-wrap gap-x-8 gap-y-4 border-t border-[#17332b]/10 pt-6 text-sm text-[#17332b]/65">
                                <span className="flex items-center gap-2"><Check className="size-4 text-[#e17b38]" /> Бережная химчистка</span>
                                <span className="flex items-center gap-2"><Check className="size-4 text-[#e17b38]" /> Забор и доставка</span>
                            </div>
                        </div>

                        <div className="relative mx-auto w-full max-w-[540px] lg:justify-self-end">
                            <div className="absolute -inset-4 rounded-[2.5rem] border border-[#17332b]/10 sm:-inset-7" />
                            <div className="relative overflow-hidden rounded-[2rem] bg-[#17332b] p-5 text-white shadow-2xl shadow-[#17332b]/20 sm:p-7">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f3a64a]">Ваш заказ</p>
                                        <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">В надёжных руках</p>
                                    </div>
                                    <div className="rounded-full bg-white/10 p-3 text-[#f3a64a]"><ShieldCheck className="size-5" /></div>
                                </div>
                                <div className="relative mt-10 space-y-7 pl-9">
                                    <div className="absolute top-2 bottom-2 left-[9px] border-l border-dashed border-white/25" />
                                    <div className="relative flex items-start gap-4">
                                        <span className="absolute -left-9 flex size-5 items-center justify-center rounded-full bg-[#e17b38] ring-4 ring-[#17332b]"><Check className="size-3" /></span>
                                        <div><p className="font-medium">Заказ принят</p><p className="mt-1 text-sm text-white/50">Мы уже на связи</p></div>
                                    </div>
                                    <div className="relative flex items-start gap-4">
                                        <span className="absolute -left-9 flex size-5 items-center justify-center rounded-full bg-[#f3a64a] ring-4 ring-[#17332b]"><Truck className="size-3 text-[#17332b]" /></span>
                                        <div><p className="font-medium">Забираем ковёр</p><p className="mt-1 text-sm text-white/50">Курьер приедет вовремя</p></div>
                                    </div>
                                    <div className="relative flex items-start gap-4 opacity-45">
                                        <span className="absolute -left-9 flex size-5 items-center justify-center rounded-full border border-white/40 bg-[#17332b] ring-4 ring-[#17332b]"><MapPin className="size-3" /></span>
                                        <div><p className="font-medium">Возвращаем чистым</p><p className="mt-1 text-sm text-white/50">Скоро будет готов</p></div>
                                    </div>
                                </div>
                                <div className="mt-12 grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl bg-white/10 p-4"><Clock3 className="mb-4 size-5 text-[#f3a64a]" /><p className="text-xs text-white/50">Срок обработки</p><p className="mt-1 font-medium">от 2 дней</p></div>
                                    <div className="rounded-2xl bg-white/10 p-4"><MapPin className="mb-4 size-5 text-[#f3a64a]" /><p className="text-xs text-white/50">Зона доставки</p><p className="mt-1 font-medium">г. Алматы</p></div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
