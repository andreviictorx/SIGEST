'use client';

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { realizarLogoutAction } from "@/actions/auth";

export function LogoutButton() {
    return (
        <Button
            variant="secondary" 
            size="sm"
            className="flex items-center gap-2 font-bold  text-red-700 shadow-sm cursor-pointer"
            onClick={() => realizarLogoutAction()}
        >
            <LogOut className="h-4 w-4" />
            Sair
        </Button>
    );
}