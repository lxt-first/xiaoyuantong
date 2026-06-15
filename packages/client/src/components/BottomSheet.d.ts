import type { FC } from "react";
interface SheetOption {
    key: string;
    label: string;
    icon: string;
    color: string;
    bg: string;
}
interface BottomSheetProps {
    options: SheetOption[];
    onSelect: (key: string) => void;
    onClose: () => void;
}
export declare const BottomSheet: FC<BottomSheetProps>;
export declare function showToast(msg: string): void;
export declare const ToastContainer: FC;
export {};
