"use client"
import { useSession } from "next-auth/react"

export default function About(){
    const {data, status}= useSession()
    console.log(data)
    return(
    <>
    <h1>About</h1>
    <p>Welcome, {data?.user.name}</p>
    <h1>User ID:{data?.user.id}</h1>
    <h1>User Email:{data?.user.email}</h1>
    </>
    )   
}