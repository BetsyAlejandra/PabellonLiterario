import { createContext, useState, useContext, useEffect } from "react";

const ReadChapterContext = createContext();

export const ReadChapterProvider = ({ children }) => {
    const [readChapters, setReadChapters] = useState(() => {
        const storedChapters = localStorage.getItem("readChapters");
        return storedChapters ? JSON.parse(storedChapters) : [];
    });

    useEffect(() => {
        localStorage.setItem("readChapters", JSON.stringify(readChapters));
    }, [readChapters]);

    const markChapterAsRead = (chapterId) => {
        if (!readChapters.includes(chapterId)) {
            setReadChapters((prev) => [...prev, chapterId]);
        }
    };

    const isChapterRead = (chapterId) => {
        return readChapters.includes(chapterId);
    };

    return (
        <ReadChapterContext.Provider value={{ readChapters, markChapterAsRead, isChapterRead }}>
            {children}
        </ReadChapterContext.Provider>
    );
};

export const useReadChapter = () => {
    return useContext(ReadChapterContext);
};