// src/components/DonationBanner.js

import React, { useState, useEffect } from 'react';
import './DonationBanner.css'; // Asegúrate de que la ruta sea correcta
import { FaPaypal, FaCoffee, FaDiscord } from 'react-icons/fa';

const DonationBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isClosed = localStorage.getItem('donationBannerClosed');
    if (!isClosed) {
      const timer = setTimeout(() => setShow(true), 1000); // Retraso de 1 segundo
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem('donationBannerClosed', 'true');
  };

  return (
    <>
      {show && (
        <div className="donation-banner position-fixed bottom-0 end-0 m-3">
          <div className="card" style={{ width: '18rem' }}>
            <div className="card-body">
              <button
                type="button"
                className="btn-close float-end"
                aria-label="Close"
                onClick={handleClose}
              ></button>
              <h5 className="card-title text-success">¡Apóyanos!</h5>
              <p className="card-text">
                Necesitamos tu ayuda para mantener el hosting y la base de datos de nuestra página.
              </p>
              <p className="card-text fw-bold">Meta: $100</p>
              <div className="d-flex justify-content-between mt-3">
                <a
                  href="https://paypal.me/betsyalejandramoreno?country.x=CO&locale.x=es_XC"
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaPaypal className="me-2" />
                  PayPal
                </a>
                <a
                  href="https://ko-fi.com/betsyalejandra"
                  className="btn btn-dark"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaCoffee className="me-2" />
                  Ko-Fi
                </a>
                <a
                  href="https://discord.gg/Np8prZDgwX"
                  className="btn btn-secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaDiscord className="me-2" />
                  Discord
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DonationBanner;