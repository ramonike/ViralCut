import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { cn } from "../../lib/utils"; // Assuming utils exists, otherwise I'll use a simple join

// Simple context to manage dropdown state
const DropdownMenuContext = createContext({
    open: false,
    setOpen: () => { },
});

export const DropdownMenu = ({ children }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <DropdownMenuContext.Provider value={{ open, setOpen }}>
            <div className="relative inline-block text-left" ref={dropdownRef}>
                {children}
            </div>
        </DropdownMenuContext.Provider>
    );
};

export const DropdownMenuTrigger = ({ children, asChild }) => {
    const { open, setOpen } = useContext(DropdownMenuContext);

    const handleClick = () => {
        setOpen(!open);
    };

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            onClick: handleClick,
            "data-state": open ? "open" : "closed"
        });
    }

    return (
        <button onClick={handleClick} data-state={open ? "open" : "closed"}>
            {children}
        </button>
    );
};

export const DropdownMenuContent = ({ children, className }) => {
    const { open } = useContext(DropdownMenuContext);

    if (!open) return null;

    return (
        <div className={cn(
            "absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md border border-slate-700 bg-slate-800 p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100",
            className
        )}>
            {children}
        </div>
    );
};

export const DropdownMenuItem = ({ children, onClick, className }) => {
    const { setOpen } = useContext(DropdownMenuContext);

    const handleClick = (e) => {
        if (onClick) onClick(e);
        setOpen(false);
    };

    return (
        <div
            onClick={handleClick}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-700 hover:text-slate-100 focus:bg-slate-700 focus:text-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className
            )}
        >
            {children}
        </div>
    );
};

export const DropdownMenuLabel = ({ children, className }) => {
    return (
        <div className={cn("px-2 py-1.5 text-sm font-semibold text-slate-300", className)}>
            {children}
        </div>
    );
};

export const DropdownMenuSeparator = ({ className }) => {
    return (
        <div className={cn("-mx-1 my-1 h-px bg-slate-700", className)} />
    );
};
