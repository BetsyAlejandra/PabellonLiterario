import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, Container } from 'react-bootstrap';

const SearchResults = () => {
    const location = useLocation();
    const results = location.state?.results || [];

    return (
        <Container className="my-5">
            <h2>Resultados de Búsqueda</h2>
            {results.length === 0 ? (
                <p>No se encontraron resultados.</p>
            ) : (
                results.map((novel) => (
                    <Link
                        to={`/story-detail/${novel._id}`} // Define el enlace dinámico
                        key={novel._id}
                        style={{ textDecoration: 'none', color: 'inherit' }} // Opcional: Quitar el subrayado y mantener el estilo del texto
                    >
                        <Card className="my-3 hover-shadow"> {/* Puedes añadir clases para estilos */}
                            <Card.Body>
                                <Card.Title>{novel.title}</Card.Title>
                                <Card.Text>{novel.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                ))
            )}
        </Container>
    );
};

export default SearchResults;