"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const HomePage: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        router.push("/auth");
    }, []);

    return null;
};

export default HomePage;