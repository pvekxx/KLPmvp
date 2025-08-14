import { db } from "./firebase";
import {
    collection, addDoc, serverTimestamp, query, orderBy, onSnapshot,
    doc, getDoc, updateDoc, deleteDoc
} from "firebase/firestore";

const postsCol = collection(db, "posts");

export function subscribePosts(callback: (items: any[]) => void) {
    const q = query(postsCol, orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
        callback(list);
    });
}

export async function createPost({
    title, content, uid, imageUrl, imagePath
}: { title: string; content: string; uid: string; imageUrl?: string | null; imagePath?: string | null; }) {
    const ref = await addDoc(postsCol, {
        title,
        content,
        uid,
        imageUrl: imageUrl ?? null,
        imagePath: imagePath ?? null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return ref.id;
}

export async function getPostById(id: string) {
    const ref = doc(db, "posts", id);
    const snap = await getDoc(ref);
    return snap.exists() ? { id: snap.id, ...(snap.data() as any) } : null;
}

/** 글 수정 */
export async function updatePost(
    id: string,
    data: Partial<{ title: string; content: string; imageUrl: string | null; imagePath: string | null }>
) {
    await updateDoc(doc(db, "posts", id), {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

/** 글 삭제 */
export async function deletePost(id: string) {
    await deleteDoc(doc(db, "posts", id));
}

/** 단일 문서 구독 */
export function subscribePost(id: string, cb: (post: any | null) => void) {
    const ref = doc(db, "posts", id);
    return onSnapshot(ref, (snap) => {
        cb(snap.exists() ? { id: snap.id, ...(snap.data() as any) } : null);
    });
}