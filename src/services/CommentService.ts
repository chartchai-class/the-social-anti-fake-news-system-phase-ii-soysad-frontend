import type { Comments,CommentsSave } from "@/types";
import apiClient from "./AxiosClient";

export function addNewComment(comment: CommentsSave,newsId: number){

      return apiClient.post<CommentsSave>(`/comments/${newsId}`, comment)

}