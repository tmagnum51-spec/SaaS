// Soit dashboard soit login
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm/LoginForm";

export default async function Home(){
    const session = true

    if(session) redirect('/dashboard')

    return <LoginForm />
}