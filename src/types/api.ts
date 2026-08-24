// res.data interface
export interface IApiResponse<T = null> {
    success: boolean;
    message: string;
    data: T;
    errors: Record<string, string[]>;
}