import React, { useState, useEffect } from "react";
import { Modal, ProgressBar, Button } from "react-bootstrap";
import "../styles/DonationPopup.css";

const DonationPopup = () => {
  const GOAL_AMOUNT = 100;
  const CURRENT_AMOUNT = 10;
  const STORAGE_KEY = "donation_popup_last_shown";
  const HOURS_TO_WAIT = 24;

  const [show, setShow] = useState(false);

  useEffect(() => {
    const lastShown = localStorage.getItem(STORAGE_KEY);
    const now = new Date().getTime();
    
    if (!lastShown || now - lastShown > HOURS_TO_WAIT * 60 * 60 * 1000) {
      setShow(true);
      localStorage.setItem(STORAGE_KEY, now);
    }
  }, []);

  const handleClose = () => setShow(false);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="donation-header">
        <Modal.Title>💖 ¡Ayúdanos a alcanzar nuestra meta!</Modal.Title>
      </Modal.Header>
      <Modal.Body className="donation-body">
        <p>Estamos recaudando fondos para apoyar el proyecto. ¡Cada donación cuenta! 🙌</p>
        <ProgressBar now={(CURRENT_AMOUNT / GOAL_AMOUNT) * 100} label={`${CURRENT_AMOUNT} USD`} className="donation-progress" />
        <div className="donation-buttons">
          <Button className="paypal-btn" variant="primary" href="https://paypal.me/betsyalejandramoreno?country.x=CO&locale.x=es_XC" target="_blank">
            PayPal
          </Button>
          <Button className="patreon-btn" variant="warning" href="https://ko-fi.com/betsyalejandra" target="_blank">
            Patreon
          </Button>
          <Button className="kofi-btn" variant="info" href="https://patreon.com/pabellonliterario?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink" target="_blank">
            Ko-fi
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DonationPopup;