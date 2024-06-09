import { Container, Row, Col } from "react-bootstrap";
import HeaderComponent from "../components/HeaderComponent";

export default function UnauthorizedPage() {
  return (
    <>
      <HeaderComponent />
      <Container className="d-flex align-items-center justify-content-center vh-100 ">
        <Row>
          <Col>
            <h1 className="text-center">
              You do not have permission to view this content.
            </h1>
            <p className="text-center">You need to login first.</p>
          </Col>
        </Row>
      </Container>
    </>
  );
}
