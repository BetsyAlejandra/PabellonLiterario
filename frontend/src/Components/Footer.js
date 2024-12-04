import React, { useState } from 'react';
import { Container, Row, Col, Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/components.css';

const Footer = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState({
    preguntas: false,
    unete: false,
    contactanos: false,
    politica: false,
    terminos: false,
  });

  const handleModal = (type, state) => {
    setShowModal((prev) => ({ ...prev, [type]: state }));
  };

  return (
    <footer className="custom-footer">
      <Container>
        <Row className="text-center">
          <Col>
            <a
              className="footer-link"
              onClick={() => navigate('/')}
            >
              Home
            </a>
          </Col>
          <Col>
            <a
              className="footer-link"
              onClick={() => handleModal('preguntas', true)}
            >
              Preguntas
            </a>
          </Col>
          <Col>
            <a
              className="footer-link"
              onClick={() => handleModal('unete', true)}
            >
              Únete a nosotros
            </a>
          </Col>
          <Col>
            <a
              className="footer-link"
              onClick={() => handleModal('contactanos', true)}
            >
              Contáctanos
            </a>
          </Col>
          <Col>
            <a
              className="footer-link"
              onClick={() => handleModal('politica', true)}
            >
              Política de Privacidad
            </a>
          </Col>
          <Col>
            <a
              className="footer-link"
              onClick={() => handleModal('terminos', true)}
            >
              Términos de Servicios
            </a>
          </Col>
        </Row>
        <Row className="text-center mt-3">
          <Col>
            <p className="footer-rights">
              Pabellón Literario © 2024. Todos los derechos reservados
            </p>
          </Col>
        </Row>

        {/* Modal: Preguntas Frecuentes */}
        <Modal
          show={showModal.preguntas}
          onHide={() => handleModal('preguntas', false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Preguntas Frecuentes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul>
              <li><strong>¿Qué tipos de novelas puedo encontrar aquí?</strong> Ofrecemos traducciones de géneros como danmei, fantasía, romance, acción, entre otros. Aunque el enfoque principal es el danmei, trabajamos en la diversidad de contenido.</li>
              <li><strong>¿Solo se traducen novelas?</strong> No, también incluimos manhuas y audiolibros. Queremos abarcar distintas formas de contenido literario.</li>
              <li><strong>¿Puedo unirme como traductora, escritora o editora?</strong> ¡Por supuesto! Buscamos personas apasionadas. Únete a nuestro Discord para más información.</li>
              <li><strong>¿Hay algún costo por usar la plataforma?</strong> No, todo es gratuito, pero aceptamos donaciones para mantener el proyecto y cubrir costos de servidores.</li>
              <li><strong>¿Cómo puedo apoyar el proyecto?</strong> Puedes donar, promocionar la plataforma y, sobre todo, apoyar a los autores comprando sus obras originales.</li>
              <li><strong>¿Qué sucede si el contenido original tiene derechos de autor?</strong> Respetamos los derechos de los autores. Nuestro objetivo es educativo y de entretenimiento, sin fines de lucro.</li>
            </ul>
          </Modal.Body>
        </Modal>

        {/* Modal: Únete a Nosotros */}
        <Modal show={showModal.unete} onHide={() => handleModal('unete', false)}>
          <Modal.Header closeButton>
            <Modal.Title>¡Únete a Nosotros!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              ¿Te apasiona la literatura? ¿Quieres contribuir como traductor, escritor, editor o simplemente ser parte de una comunidad literaria única?
              Únete a nuestro Discord y forma parte de un equipo increíble. Aquí celebramos la creatividad, el trabajo en equipo y el amor por las historias.
            </p>
            <p>
              <strong>Ventajas de unirte:</strong>
              <ul>
                <li>Acceso a una comunidad de amantes de la literatura.</li>
                <li>Posibilidad de colaborar en proyectos únicos.</li>
                <li>Reconocimiento como miembro del equipo.</li>
              </ul>
            </p>
            <Button
              variant="primary"
              href="https://discord.gg/Np8prZDgwX"
              target="_blank"
              className="w-100 mt-3"
            >
              ¡Únete a Nuestro Discord Ahora!
            </Button>
          </Modal.Body>
        </Modal>

        {/* Modal: Contáctanos */}
        <Modal
          show={showModal.contactanos}
          onHide={() => handleModal('contactanos', false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Contáctanos</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Si tienes preguntas o sugerencias, no dudes en escribirnos. También puedes contactarnos directamente en nuestro Discord.
            </p>
            <Button
              variant="primary"
              href="https://discord.gg/Np8prZDgwX"
              target="_blank"
              className="w-100 mt-3"
            >
              Contactar en Discord
            </Button>
          </Modal.Body>
        </Modal>

        {/* Modal: Política de Privacidad */}
        <Modal
          show={showModal.politica}
          onHide={() => handleModal('politica', false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Política de Privacidad</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Última actualización:</strong>
            </p>
            <h5>Introducción</h5>
            <p>
              Bienvenido/a a Pabellón Literario. Tu privacidad es importante para nosotros. Esta Política de Privacidad explica cómo recopilamos, usamos, almacenamos y protegemos tu información al usar nuestra plataforma. Nuestro objetivo principal es ofrecer un espacio seguro y respetuoso para compartir traducciones de novelas, escritos originales y otros contenidos, sin fines de lucro.
            </p>
            <h5>Información que Recopilamos</h5>
            <p><strong>Información proporcionada por el usuario:</strong></p>
            <ul>
              <li>Información personal: como nombre de usuario, correo electrónico y contraseña para crear una cuenta.</li>
              <li>Contenido subido: textos, traducciones, comentarios y cualquier otra contribución hecha a la plataforma.</li>
              <li>Opcional: enlaces a plataformas de donaciones (por ejemplo, Ko-fi o Patreon).</li>
            </ul>
            <p><strong>Información sobre interacción en la plataforma:</strong></p>
            <ul>
              <li>Progreso en la lectura de novelas o capítulos.</li>
              <li>Comentarios dejados en textos o capítulos.</li>
            </ul>
            <h5>Uso de la Información</h5>
            <p>
              La información recopilada será utilizada exclusivamente para los siguientes fines:
              <ul>
                <li>Gestionar cuentas de usuario.</li>
                <li>Permitir a los usuarios subir y administrar sus contribuciones (traducciones o escritos originales).</li>
                <li>Facilitar la interacción en la plataforma, como dejar comentarios y guardar el progreso de lectura.</li>
                <li>Personalizar la experiencia del usuario en la plataforma.</li>
              </ul>
            </p>
            <h5>Uso de Cookies</h5>
            <p>
              Pabellón Literario no utiliza cookies para recopilar información técnica ni de navegación. Solo almacenamos datos esenciales asociados a tu sesión activa en la plataforma para garantizar el correcto funcionamiento de las funcionalidades principales.
            </p>
            <h5>Compartición de Información</h5>
            <p>
              No compartiremos tu información personal con terceros, excepto en las siguientes situaciones:
              <ul>
                <li>Obligaciones legales: Si es requerido por ley o por una orden judicial.</li>
                <li>Con tu consentimiento explícito: Para casos específicos que requieran tu aprobación.</li>
              </ul>
            </p>
            <h5>Protección de Datos</h5>
            <p>
              Tomamos medidas de seguridad razonables para proteger tu información, como encriptación de contraseñas y conexiones seguras (HTTPS). Aunque hacemos todo lo posible para garantizar la seguridad de tus datos, ningún sistema es completamente invulnerable.
            </p>
            <h5>Derechos del Usuario</h5>
            <p>
              Tienes derecho a:
              <ul>
                <li>Acceder a tu información personal.</li>
                <li>Rectificar datos inexactos o incompletos.</li>
                <li>Solicitar la eliminación de tu cuenta y de los contenidos asociados.</li>
                <li>Retirar tu consentimiento en cualquier momento para el uso de tu información.</li>
              </ul>
              Para ejercer estos derechos, puedes contactarnos en administrador@pabellonliterario.com.
            </p>
            <h5>Contenido Subido por los Usuarios</h5>
            <p>
              Al publicar en nuestra plataforma, otorgas un permiso no exclusivo para mostrar este contenido públicamente en Pabellón Literario. Nos reservamos el derecho de moderar o eliminar contenido que infrinja nuestras políticas.
            </p>
            <h5>Enlaces a Sitios Externos</h5>
            <p>
              Nuestra plataforma puede incluir enlaces a sitios externos, como plataformas de donación. No somos responsables de las políticas de privacidad o prácticas de dichos sitios. Te recomendamos revisar sus políticas antes de interactuar con ellos.
            </p>
            <h5>Cambios en la Política de Privacidad</h5>
            <p>
              Podemos actualizar esta Política de Privacidad para reflejar cambios en nuestras prácticas o requisitos legales. Notificaremos cualquier cambio importante a través de la plataforma o por correo electrónico.
            </p>
            <h5>Contacto</h5>
            <p>
              Si tienes preguntas o inquietudes sobre esta Política de Privacidad, puedes escribirnos a administrador@pabellonliterario.com.
            </p>
          </Modal.Body>
        </Modal>

        {/* Modal: Términos de Servicios */}
        <Modal
          show={showModal.terminos}
          onHide={() => handleModal('terminos', false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Términos de Servicio</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>1. Introducción</h5>
            <p>
              Bienvenido/a a Pabellón Literario. Al usar nuestra plataforma, aceptas cumplir estos Términos de Servicio. Si no estás de acuerdo con ellos, no deberías usar el sitio.
            </p>
            <p>
              Nuestra plataforma tiene como objetivo proporcionar un espacio para compartir traducciones de novelas, escritos originales y otros contenidos relacionados. Este servicio se ofrece sin fines de lucro, fomentando la comunidad y la colaboración.
            </p>

            <h5>2. Uso de la Plataforma</h5>
            <h6>2.1 Elegibilidad</h6>
            <ul>
              <li>Tener al menos 13 años de edad o contar con el consentimiento de un tutor legal si eres menor de edad.</li>
              <li>Crear una cuenta para participar en ciertas actividades, como subir contenido, dejar comentarios o guardar tu progreso.</li>
            </ul>
            <h6>2.2 Cuenta de Usuario</h6>
            <ul>
              <li>Eres responsable de mantener la seguridad de tu cuenta y contraseña.</li>
              <li>Toda actividad realizada desde tu cuenta será tu responsabilidad.</li>
              <li>Si detectas un uso no autorizado de tu cuenta, debes informarnos inmediatamente.</li>
            </ul>
            <h6>2.3 Comportamiento del Usuario</h6>
            <ul>
              <li>Debes actuar con respeto hacia otros usuarios.</li>
              <li>No está permitido:
                <ul>
                  <li>Subir contenido ofensivo, difamatorio, ilegal o que viole derechos de terceros.</li>
                  <li>Usar la plataforma para actividades fraudulentas o malintencionadas.</li>
                  <li>Publicar spam o enlaces no relacionados con la temática de la plataforma.</li>
                </ul>
              </li>
            </ul>

            <h5>3. Contenido Subido por los Usuarios</h5>
            <h6>3.1 Moderación de Contenido</h6>
            <p>
              Pabellón Literario se reserva el derecho de moderar, editar o eliminar contenido que:
              <ul>
                <li>Infrinja estos Términos de Servicio.</li>
                <li>Sea reportado por otros usuarios como inapropiado.</li>
              </ul>
            </p>
            <h6>3.2 Retirada de Contenido</h6>
            <p>
              Los usuarios pueden solicitar la eliminación de su contenido enviando un correo a administrador@pabellonliterario.com. Nos comprometemos a procesar estas solicitudes en un plazo razonable.
            </p>

            <h5>4. Uso Aceptable</h5>
            <p>No debes:</p>
            <ul>
              <li>Intentar hackear, interrumpir o dañar la plataforma.</li>
              <li>Usar herramientas automatizadas para acceder a la plataforma sin nuestra autorización.</li>
              <li>Subir contenido protegido por derechos de autor sin el debido permiso.</li>
            </ul>

            <h5>5. Limitaciones de Responsabilidad</h5>
            <p>
              Pabellón Literario no garantiza que el sitio esté disponible sin interrupciones ni errores.
              No somos responsables del contenido subido por los usuarios.
              La plataforma se ofrece "tal cual" y "según disponibilidad", sin garantías implícitas o explícitas.
            </p>

            <h5>6. Cambios en los Términos</h5>
            <p>
              Nos reservamos el derecho de modificar estos Términos de Servicio en cualquier momento. Cualquier cambio será notificado a través de la plataforma o por correo electrónico. Es tu responsabilidad revisar los Términos periódicamente.
            </p>

            <h5>7. Terminación</h5>
            <p>
              Podemos suspender o eliminar tu cuenta si:
              <ul>
                <li>Violaste estos Términos de Servicio.</li>
                <li>Se detectan actividades fraudulentas o malintencionadas asociadas a tu cuenta.</li>
              </ul>
              Puedes cerrar tu cuenta en cualquier momento enviando una solicitud a administrador@pabellonliterario.com.
            </p>

            <h5>8. Enlaces Externos</h5>
            <p>
              Nuestra plataforma puede contener enlaces a sitios de terceros, como plataformas de donación. No somos responsables de sus políticas o prácticas.
            </p>

            <h5>9. Contacto</h5>
            <p>
              Si tienes preguntas o inquietudes sobre estos Términos de Servicio, puedes contactarnos en administrador@pabellonliterario.com.
            </p>
          </Modal.Body>
        </Modal>
      </Container>
    </footer>
  );
};

export default Footer;