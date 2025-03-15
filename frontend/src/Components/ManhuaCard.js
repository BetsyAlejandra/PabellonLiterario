import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/ManhuaCard.css";

const ManhuaCard = ({ manhua }) => {
  const navigate = useNavigate();

  return (
    <Card className="manhua-card">
      <div className="image-container">
        <Card.Img
          variant="top"
          src={manhua.coverImage?.trim() || "/default-cover.jpg"}
          alt={manhua.title}
          className="manhua-cover"
        />
      </div>
      <Card.Body>
        <Card.Title className="manhua-title">{manhua.title}</Card.Title>
        <Card.Text className="manhua-description">
          {manhua.description ? `${manhua.description.slice(0, 100)}...` : "Sin descripción disponible."}
        </Card.Text>
        <Button className="manhua-button" onClick={() => navigate(`/manhua/${manhua._id}`)}>
          Ver detalles
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ManhuaCard;