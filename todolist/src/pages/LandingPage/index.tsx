"use client";

import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/stores/useUserStore";
import { UserService } from "@/services/Client/UserService";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, List, Calendar } from 'lucide-react'
import { motion } from "framer-motion";

export default function LandingPage() {
    const { token, setUserInformation } = useUserStore();
    const [isVisible, setIsVisible] = useState(false);

    console.log("Token accessed in LandingPage:", token);

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
        console.log("User data:", data);
        if (data && token) {
            setUserInformation(data);
        }
        setIsVisible(true);
    }, [data, setUserInformation, token]);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.6,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center items-center p-4">
            <motion.main 
                className="flex-1 flex justify-center items-center w-full max-w-6xl"
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                    <div className="container px-4 md:px-6">
                        <motion.div 
                            className="flex flex-col items-center space-y-8 text-center"
                            variants={containerVariants}
                        >
                            <motion.div className="space-y-4" variants={itemVariants}>
                                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                                    TODO LIST
                                </h1>
                                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                    Create and manage your tasks with ease. An intuitive way to boost your productivity and stay organized.
                                </p>
                            </motion.div>
                            <motion.div 
                                className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
                                variants={itemVariants}
                            >
                                <Link to="https://242201303055-iap-es.auth.eu-north-1.amazoncognito.com/login?client_id=3rcgpg4vr8es9g708rn01pusc&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone&redirect_uri=https%3A%2F%2Fes-ua.ddns.net%2Foauth2%2Fidpresponse">
                                    <Button className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold transition-colors duration-200 transform bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                                        Get Started
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                
                            </motion.div>
                            <motion.div 
                                className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
                                variants={containerVariants}
                            >
                                <motion.div className="flex flex-col items-center space-y-2" variants={itemVariants}>
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <CheckCircle className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold">Easy Task Management</h3>
                                    <p className="text-center text-gray-500 dark:text-gray-400">Quickly add, edit, and complete tasks with just a few clicks.</p>
                                </motion.div>
                                <motion.div className="flex flex-col items-center space-y-2" variants={itemVariants}>
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <List className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold">Organize your tasks</h3>
                                    <p className="text-center text-gray-500 dark:text-gray-400">Group your tasks for better organization.</p>
                                </motion.div>
                                <motion.div className="flex flex-col items-center space-y-2" variants={itemVariants}>
                                    <div className="p-3 bg-purple-100 rounded-full">
                                        <Calendar className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold">Set Due Dates</h3>
                                    <p className="text-center text-gray-500 dark:text-gray-400">Never miss a deadline with our built-in calendar and reminders.</p>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>
            </motion.main>
            <footer className="w-full max-w-6xl py-6 text-center text-gray-500 dark:text-gray-400">
                <p>&copy; 2024 TODO LIST by Cotorobai. All rights reserved.</p>
            </footer>
        </div>
    )
}