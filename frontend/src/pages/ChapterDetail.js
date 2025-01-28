import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DiscussionEmbed } from 'disqus-react';
import '../styles/ChapterDetail.css';

const ChapterDetail = () => {
    const { id, seasonNumber, episode } = useParams();
    const [chapter, setChapter] = useState(null);
    const [audioDrama, setAudioDrama] = useState(null);

    useEffect(() => {
        const fetchAudioDramaDetails = async () => {
            try {
                const response = await fetch(`/api/audio-dramas/${id}`);
                const data = await response.json();
                setAudioDrama(data);

                const season = data.seasons.find((season) => season.seasonNumber === parseInt(seasonNumber));
                const selectedChapter = season.chapters.find((chapter) => chapter.episode === parseInt(episode));
                setChapter(selectedChapter);
            } catch (error) {
                console.error('Error al cargar los detalles del capítulo:', error);
            }
        };

        fetchAudioDramaDetails();
    }, [id, seasonNumber, episode]);

    if (!chapter) {
        return <p>Cargando detalles del capítulo...</p>;
    }

    const getDailymotionEmbedUrl = (videoUrl) => {
        console.log("URL del video: ", videoUrl);
        const videoId = videoUrl.split("/")[4];
        return `https://www.dailymotion.com/embed/video/${videoId}`;
    };

    const disqusConfig = {
        shortname: 'pabellonliterario',
        config: {
            url: window.location.href,
            identifier: `${id}-${seasonNumber}-${episode}`,
            title: `${audioDrama.title} - Episodio ${episode}`,
            language: 'es',
        },
    };

    const getNextChapter = () => {
        const season = audioDrama.seasons.find((season) => season.seasonNumber === parseInt(seasonNumber));
        const nextEpisode = season.chapters.find((ch) => ch.episode === parseInt(episode) + 1);
        return nextEpisode;
    };

    const getPreviousChapter = () => {
        const season = audioDrama.seasons.find((season) => season.seasonNumber === parseInt(seasonNumber));
        const previousEpisode = season.chapters.find((ch) => ch.episode === parseInt(episode) - 1);
        return previousEpisode;
    };

    return (
        <div className="chapter-detail container">
            <h1 className="chapter-title">{chapter.title}</h1>

            <iframe
                width="100%"
                height="480"
                src={`https://www.dailymotion.com/embed/video/${chapter.videoLinks[0].url.split("/")[4]}`}
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
                title={chapter.title}
            />


            {/* Botón de retroceso */}
            <Link to={`/audiodrama/${id}`} className="back-button">
                <button className="btn-back">Volver al Audiodrama</button>
            </Link>

            <div className="chapter-navigation">
                {getPreviousChapter() && (
                    <Link to={`/audio-dramas/${id}/seasons/${seasonNumber}/episodes/${getPreviousChapter().episode}`} className="nav-link">
                        Capítulo Anterior
                    </Link>
                )}
                {getNextChapter() && (
                    <Link to={`/audio-dramas/${id}/seasons/${seasonNumber}/episodes/${getNextChapter().episode}`} className="nav-link">
                        Siguiente Capítulo
                    </Link>
                )}
            </div>

            <DiscussionEmbed {...disqusConfig} />
        </div>
    );
};

export default ChapterDetail;