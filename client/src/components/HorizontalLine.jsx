import { Container } from "react-bootstrap";

export default function HorizontalLine() {
  return (
    <Container className="text-center my-4">
      <hr style={{ borderTop: "2px solid #000" }} />
    </Container>
  );
}
