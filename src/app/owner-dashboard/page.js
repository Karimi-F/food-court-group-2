"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/owner-login"); // Redirect to login page
        }
    }, [status, router]);

    if (status === "loading") return <p>Loading...</p>;

    return (
        <>
            <h1>Hi {session?.user?.name}, <br />Welcome to your dashboard</h1>
        </>
    );
}
