export interface MobileSearchBarProps {
  inputRef: React.RefObject<HTMLInputElement>;
  open: boolean;
  onClose: () => void;
}

export interface MobileCategoriesDrawerProps {
  open: boolean;
  onClose: () => void;
}

export interface MobileBottomBarProps {
  onCategoriesOpen: () => void;
  categoriesOpen: boolean;
  searchOpen: boolean;
  onSearchToggle: () => void;
}
