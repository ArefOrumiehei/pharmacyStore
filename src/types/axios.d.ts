import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    isFormDataRequest?: boolean;
  }
}
