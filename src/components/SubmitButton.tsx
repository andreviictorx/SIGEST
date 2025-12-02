'use client';

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
    text: string;
    loadingText?: string;
    className?: string;
    isLoading?: boolean;
}

export function SubmitButton({
    text,
    loadingText = "Processando...",
    className,
    isLoading = false 
}: SubmitButtonProps) {
    const { pending } = useFormStatus(); 

 
    const isSubmitting = pending || isLoading;

    return (
        <Button
            type="submit"
            disabled={isSubmitting}
            className={className}
        >
            {isSubmitting ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loadingText}
                </>
            ) : text}
        </Button>
    );
}