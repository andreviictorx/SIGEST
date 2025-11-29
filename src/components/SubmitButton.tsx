'use client';

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
    text: string;
    loadingText?: string;
    className?: string;
}

export function SubmitButton({
    text,
    loadingText = "Processando...",
    className
}: SubmitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            disabled={pending}
            className={className}
        >
            {pending ? loadingText : text}
        </Button>
    );
}