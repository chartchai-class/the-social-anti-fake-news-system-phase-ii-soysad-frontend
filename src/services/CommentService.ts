import type { Comments,CommentsSave } from "@/types";
import axios from "axios";
import '@/services/AxiosInterceptorSetup'
import apiClient from "./AxiosClient";

export function addNewComment(comment: CommentsSave,newsId: number){

      return apiClient.post<CommentsSave>(`/comments/${newsId}`, comment)

}

export function removeComment(commentID:number){
      console.log(commentID)
      return apiClient.delete(`/comments/delete/${commentID}`)
}

