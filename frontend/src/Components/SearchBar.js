import React, { useState, useEffect } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa";
import '../styles/SearchBar.css'

const SearchBar = ({ setQuery }) => {
  const [search, setSearch] = useState("");

  // Manejo de debounce para mejorar rendimiento
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      setQuery(search);
    }, 300); // Espera 300ms antes de ejecutar la búsqueda

    return () => clearTimeout(delaySearch);
  }, [search, setQuery]);

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearch("");
    setQuery("");
  };

  return (
    <Form className="mb-3">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Buscar manhua..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="custom-search-input"
        />
        <Button variant="primary">
          <FaSearch />
        </Button>
        {search && (
          <Button variant="danger" onClick={clearSearch}>
            <FaTimes />
          </Button>
        )}
      </InputGroup>
    </Form>
  );
};

export default SearchBar;