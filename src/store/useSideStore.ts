/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { getSlides } from "@/services/slide_services/slideServices";

export interface Slide {
  btnText: string 
  heading: string 
  link: string 
  picture: string
  pictureAlt: string
  pictureTitle: string
  text: string
  title: string
}

interface SlideStore {
  slides: Slide | null | any;
  loading: boolean;
  error: string | null;
  fetchSlides: () => Promise<void>;
  clearSlides: () => void;
}

export const useSlideStore = create<SlideStore>((set) => ({
  slides: null,
  loading: false,
  error: null,

  fetchSlides: async () => {
    set({ loading: true, error: null });
    try {
      const slides = await getSlides();
      set({ slides, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  clearSlides: () => set({ slides: null }),
}))