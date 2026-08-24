import { toast } from "react-toastify";

export const getStatus = (err: unknown): number | null => {
    if (err && typeof err === "object" && "response" in err) {
        return (err as { response?: { status?: number } }).response?.status ?? null;
    }
    return null;
};

export const extractMessage = (err: unknown, fallback: string): string => {
    if (err && typeof err === "object" && "response" in err) {
        const r = (err as { response?: { data?: { message?: string } } }).response;
        return r?.data?.message ?? fallback;
    }
    return fallback;
};

export const toastIfNot404 = (err: unknown, fallback: string) => {
    if (getStatus(err) !== 404) toast.error(extractMessage(err, fallback));
};