import React, { useState, useRef, useEffect } from "react";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu as ShadcnDropdownMenu,
} from "./dropdown-menu";

interface DropdownProps {
  children: React.ReactNode;
}

interface DropdownTriggerProps {
  children: React.ReactNode;
}

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
}

export const Dropdown: React.FC<DropdownProps> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <ShadcnDropdownMenu open={open} onOpenChange={setOpen}>
      {children}
    </ShadcnDropdownMenu>
  );
};

export const DropdownTrigger: React.FC<DropdownTriggerProps> = ({
  children,
}) => {
  return <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>;
};

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  return (
    <DropdownMenuContent align="end" sideOffset={5}>
      {children}
    </DropdownMenuContent>
  );
};

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onSelect,
}) => {
  return <DropdownMenuItem onClick={onSelect}>{children}</DropdownMenuItem>;
};
