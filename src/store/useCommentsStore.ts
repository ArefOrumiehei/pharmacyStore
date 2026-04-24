/* eslint-disable @typescript-eslint/no-explicit-any */
import { addComment, deleteComment, dislikeComment, editComment, likeComment } from "@/services/commentServices/commentServices";
import { toast } from "react-toastify";
import { create } from "zustand";

export interface Comment {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  message: string;
  ownerRecordId: number;
  type: number;
  rate: number;
}

export interface AddComemnt {
  message: string;
  ownerRecordId: number;
  type: number;
  rate: number;
}

interface CommentStore {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  
  addNewComment: (props: AddComemnt) => Promise<void>;
  editExistingComment: (id: number, message: string, rate: number) => Promise<void>;
  deleteExistingComment: (commentId: number) => Promise<void>;
  likeExistingComment: (commentId: number) => Promise<void>;
  dislikeExistingComment: (commentId: number) => Promise<void>;
  setError: (error: string) => void;
}

export const useCommentStore = create<CommentStore>((set) => ({
  comments: [],
  loading: false,
  error: null,

  addNewComment: async (props: AddComemnt) => {
    set({ loading: true, error: null });
    try {
      const res = await addComment(props);
      set((state) => ({
        comments: [...state.comments, res.data],
        loading: false,
      }));
      if (res.success) toast.success(res.message)
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  editExistingComment: async (id: number, message: string, rate: number) => {
    set({ loading: true, error: null });
    try {
      await editComment(id, message, rate);
      set((state) => ({
        comments: state.comments.map((comment) =>
          comment.id === id ? { ...comment, message, rate } : comment
        ),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  deleteExistingComment: async (commentId: number) => {
    set({ loading: true, error: null });
    try {
      await deleteComment(commentId);
      set((state) => ({
        comments: state.comments.filter((comment) => comment.id !== commentId),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || "خطا در حذف نظر", loading: false });
    }
  },

  likeExistingComment: async (commentId: number) => {
    set({ loading: true, error: null });
    try {
      const res = await likeComment(commentId);
      set((state) => ({
        comments: state.comments.map((comment) =>
          comment.id === commentId ? { ...comment, rate: comment.rate + 1 } : comment
        ),
        loading: false,
      }));
      if (res.success) {
        toast.success(res.message)
      }
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  dislikeExistingComment: async (commentId: number) => {
    set({ loading: true, error: null });
    try {
      await dislikeComment(commentId);
      set((state) => ({
        comments: state.comments.map((comment) =>
          comment.id === commentId ? { ...comment, rate: comment.rate - 1 } : comment
        ),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  setError: (error: string) => set({ error }),
}));
