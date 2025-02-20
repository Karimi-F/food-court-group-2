"use client"
import { useSession } from "next-auth/react"

export default function Dashboard(){
    const {data, status}= useSession()
    return(
    <>
    <h1>Hi {data?.user?.name}, <br></br>welcome to your dashboard</h1>
    </>
    )   
}