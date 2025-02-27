import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Library = () => {
    const [library, setLibrary] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                const res = await axios.get('/api/user/library', { withCredentials: true });
                setLibrary(res.data);
            } catch (error) {
                console.error('Error al obtener la biblioteca', error);
            }
        };
        fetchLibrary();
    }, []);

    return (
        <div className="min-h-screen bg-[#F1E4D1] text-gray-800 p-6 flex flex-col items-center">
            <h2 className="text-3xl font-semibold text-[#D6B4A1] mb-6">Tu Biblioteca</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
                {library.length > 0 ? (
                    library.map((story) => (
                        <div key={story._id} className="bg-[#D3D0E1] shadow-lg rounded-2xl overflow-hidden transform hover:scale-105 transition duration-300">
                            <img src={story.coverImage} alt={story.title} className="w-full h-52 object-cover" />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-[#D6B4A1]">{story.title}</h3>
                                <p className="text-sm text-gray-700 mt-2 line-clamp-2">{story.description}</p>
                                <button
                                    className="mt-3 w-full bg-[#C1D0B5] text-gray-900 font-semibold py-2 rounded-lg hover:bg-[#D7E2E9] transition"
                                    onClick={() => navigate(`/novels/${story._id}`)}
                                >
                                    Ver detalles
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-lg text-gray-700">No tienes novelas guardadas en tu biblioteca.</p>
                )}
            </div>
        </div>
    );
};

export default Library;