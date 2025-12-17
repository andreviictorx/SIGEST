function FilterButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={`px-6 py-2.5 rounded-full text-sm font-bold shadow-md whitespace-nowrap transition-transform active:scale-95 border cursor-pointer
            ${active 
                ? 'bg-blue-600 text-white shadow-blue-200 border-transparent ' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
        >
            {label}
        </button>
    )
}

export default FilterButton;