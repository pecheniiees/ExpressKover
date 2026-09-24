import type { ComponentProps } from 'react';
import { Input } from '@/components/ui/input';

type Props = Omit<ComponentProps<typeof Input>, 'defaultValue' | 'name' | 'type'> & {
    defaultValue?: string | null;
};

export default function PhoneInput({ defaultValue, onInput, ...props }: Props) {
    const nationalNumber = defaultValue?.replace(/^\+7/, '') ?? '';

    return (
        <div className="flex">
            <span className="border-input bg-muted text-muted-foreground flex h-9 items-center rounded-l-md border border-r-0 px-3 text-sm">
                +7
            </span>
            <Input
                {...props}
                type="tel"
                name="phone"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                pattern="[0-9]{10}"
                defaultValue={nationalNumber}
                placeholder="700 000 00 00"
                className={`rounded-l-none ${props.className ?? ''}`}
                onInput={(event) => {
                    event.currentTarget.value = event.currentTarget.value.replace(/\D/g, '');
                    onInput?.(event);
                }}
            />
        </div>
    );
}
