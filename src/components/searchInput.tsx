'use client';

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

type SearchInputProps = {
  placeholder: string;
  text?: string; 
}

export const SearchInput = ({ placeholder, text = "Buscar" }: SearchInputProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="w-full max-w-md">
      <div className="flex w-full items-center gap-2">

       
        <div className="relative flex-1">
          <Input
            className="bg-white pr-10 focus-visible:ring-[#10B981]" 
            placeholder={placeholder}
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get('q')?.toString()}
          />
       
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            <Search className="h-4 w-4" />
          </div>
        </div>

      
        <Button
          type="button"
          className="bg-[#10B981] hover:bg-[#059669] text-white border border-[#E2E8F0] shadow-sm font-medium cursor-pointer"
        >
          {text}
        </Button>
      </div>
    </div>
  );
}