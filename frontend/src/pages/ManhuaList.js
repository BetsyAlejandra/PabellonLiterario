import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import ManhuaCard from "../Components/ManhuaCard";
import SearchBar from "../Components/SearchBar";
import CustomPagination from "../Components/Pagination";
import "../styles/ManhuaList.css";

const ManhuaList = () => {
  const [manhuas, setManhuas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchManhuas = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/manhuas?page=${page}&query=${query}`);
        
        setManhuas(response.data.manhuas);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error al obtener los manhuas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchManhuas();
  }, [query, page]);

  return (
    <Container className="manhua-container">
      <h2 className="section-title">Lista de Manhuas</h2>
      <SearchBar setQuery={setQuery} />

      {loading ? (
        <div className="spinner-container">
          <Spinner animation="border" className="spinner" />
        </div>
      ) : (
        <>
          <Row>
            {manhuas.map((manhua) => (
              <Col key={manhua._id} md={6} lg={4} className="mb-4">
                <ManhuaCard manhua={manhua} />
              </Col>
            ))}
          </Row>
          <CustomPagination page={page} totalPages={totalPages} setPage={setPage} />
        </>
      )}
    </Container>
  );
};

export default ManhuaList;