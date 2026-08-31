// services/slideServices/slideServices.ts
import apiInstance from "@/apis/apiInstance";
import type { IApiResponse } from "@/types/api";

export interface ISlide {
    picture: string;
    pictureAlt: string;
    pictureTitle: string;
    heading: string;
    title: string;
    text: string;
    btnText: string;
    link: string;
}

export const getSlides = async (): Promise<ISlide[]> => {
    const res = await apiInstance.get<IApiResponse<ISlide[]>>("/api/Slide");
    return res.data.data;
};