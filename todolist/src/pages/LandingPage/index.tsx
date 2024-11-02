"use client";

import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/stores/useUserStore";
import { UserService } from "@/services/Client/UserService";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react"

export default function LandingPage() {
    const { token, setUserInformation } = useUserStore();

    console.log("Token acessado na LandingPage:", token);

    const fetchUser = async () => {
        const response = await UserService.getUser();
        return response.data;
    };
    const { data } = useQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
        enabled: !!token,
    });

    useEffect(() => {
        console.log("Data do usuário:", data);
        if (data && token) {
            setUserInformation(data);
        }
    }, [data, setUserInformation, token]);

    return (
        <div className="flex flex-col h-screen-5/6 justify-center items-center">
            <main className="flex-1 flex justify-center items-center">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                    TODO LIST
                                </h1>
                                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                    Create and manage your tasks with ease. An easy way to keep track of your daily tasks. Start being productive today!
                                </p>
                            </div>
                            <div className="space-x-4">
                                <Link to={import.meta.env.VITE_LOGIN_SIGN_UP}>

                                    <Button className="inline-flex items-center justify-center">
                                        Get Started
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                {/* <Button variant="outline">Learn More</Button> */}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

        </div>
    )
}