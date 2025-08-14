import { Redirect } from "expo-router";
import { useAuthCtx } from "../context/AuthProvider";
import Loading from "../components/Loading";

export default function Index() {
    const { user, loading } = useAuthCtx();
    if (loading) return <Loading />;
    return user ? <Redirect href="/home" /> : <Redirect href="/sign-in" />;
}