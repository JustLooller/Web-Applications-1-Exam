import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function WrongRoutePage() {
  const [showGif, setShowGif] = useState(false);
  const [playAudio, setPlayAudio] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowGif(true);
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  const handlePlayAudio = () => {
    setPlayAudio(!playAudio);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center">Wrong Route</Card.Title>
              <Card.Text className="text-center">
                The page you requested does not exist.
              </Card.Text>
              <Card.Text className="text-center text-muted">
                Maybe if you wait and never give up, you will not be let down...
              </Card.Text>
              <Card.Text className="text-center">
                Or you can just go <Link to="/">home</Link> and continue
                browsing normally.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center mt-4">
        {showGif && (
          <>
            <img
              src="https://media3.giphy.com/media/Ju7l5y9osyymQ/giphy.gif?cid=ecf05e47eg46amyvxlyd5qy9r3es2n8vk0a3nrm8mp93cpjg&ep=v1_gifs_related&rid=giphy.gif&ct=g"
              alt="404"
              className="img-fluid"
            />
            <Col md={12} className="text-center">
              <Button
                className="btn btn-primary mt-4"
                onClick={handlePlayAudio}
              >
                Definitely not the Rickroll audio
              </Button>
            </Col>
            {playAudio && (
              <audio autoPlay loop>
                <source
                  src="https://www.myinstants.com/media/sounds/rick-astley-never-gonna-give-you-up.mp3"
                  type="audio/mpeg"
                />
              </audio>
            )}
          </>
        )}
      </Row>
    </Container>
  );
}
