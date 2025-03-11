import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext"; // Importamos el contexto
import { Moon, Sun } from "lucide-react";
import "../styles/DarkModeToggle.css";

function DarkModeToggle() {
    const { darkMode, setDarkMode } = useContext(ThemeContext);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        let lastScroll = window.scrollY;
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            setIsVisible(currentScroll < lastScroll || currentScroll < 100);
            lastScroll = currentScroll;
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <button 
            className={`dark-mode-toggle ${isVisible ? "visible" : "hidden"}`} 
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Dark Mode"
        >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
    );
}

export default DarkModeToggle;