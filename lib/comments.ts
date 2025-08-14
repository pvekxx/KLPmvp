import { db } from "./firebase";
import {
    collection, addDoc, serverTimestamp, query, orderBy, onSnapshot,
    doc, updateDoc, deleteDoc, increment
} from "firebase/firestore";

const col = (postId: string) => collection(db, "posts", postId, "comments");

/////////////////////// 실시간 구독
export function subscribeComments(postId: string, cb: (list: any[]) => void) {
    const q = query(col(postId), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
        cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
}

///////////////////////// 댓글 생성 / posts.commentCount 증가
export async function addComment(postId: string, { uid, content }: { uid: string; content: string }) {
    await addDoc(col(postId), {
        uid,
        content,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    await updateDoc(doc(db, "posts", postId), {
        commentCount: increment(1)
    });
}

///////////////////////// 댓글 수정
export async function updateComment(postId: string, id: string, content: string) {
    await updateDoc(doc(db, "posts", postId, "comments", id), {
        content,
        updatedAt: serverTimestamp(),
    });
}

//////////////////////// 댓글 삭제 / posts.commentCount 감소
export async function deleteComment(postId: string, id: string) {
    await deleteDoc(doc(db, "posts", postId, "comments", id));
    await updateDoc(doc(db, "posts", postId), {
        commentCount: increment(-1)
    });
}