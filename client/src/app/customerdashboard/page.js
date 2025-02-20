"use client"
import { useSession } from "next-auth/react"

export default function Dashboard(){
    const {data, status}= useSession()
    console.log(data)
    return(
    <>
    <h1> Customer Dashboard</h1>
    </>
    )   
}