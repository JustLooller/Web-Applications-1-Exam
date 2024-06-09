import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function CreatePageButton() {
  return (
    <Container className="text-center my-4">
      <h3>Feeling inspired today? Create a new page</h3>
      <Button
        as={Link}
        to="/pages/create"
        variant="outline-success"
        className="my-4"
      >
        Create Page
      </Button>
    </Container>
  );
}
