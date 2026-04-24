import apiInstance from "@/apis/apiInstance"
import type { AddComemnt } from "@/store/useCommentsStore";


export const addComment = async (props: AddComemnt) => {
  const res = await apiInstance.post("/api/Comment/add", props)
  return res.data;
}

export const editComment = async (id: number, message: string, rate: number) => {
  const res = await apiInstance.put("/api/Comment/edit", {id, message, rate})
  return res.data.data;
}

export const deleteComment = async (commentId: number) => {
  const res = await apiInstance.delete(`/api/Comment/delete/${commentId}`)
  return res.data.data;
}

export const likeComment = async (commentId: number) => {
  const res = await apiInstance.post(`/api/Comment/like/${commentId}`)
  return res.data.data;
}

export const dislikeComment = async (commentId: number) => {
  const res = await apiInstance.post(`/api/Comment/dislike/${commentId}`)
  return res.data.data;
}