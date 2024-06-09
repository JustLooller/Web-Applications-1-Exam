import { useContext } from "react";
import HeaderComponent from "../components/HeaderComponent";
import PageCreationForm from "../components/PageCreationForm";
import { UserContext } from "../contexts/UserContext";
import { Container, Row, Col } from "react-bootstrap";

export default function CreationPage() {
  const { user } = useContext(UserContext);

  return (
    <>
      <HeaderComponent />
      {user !== null ? (
        <PageCreationForm />
      ) : (
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
      )}
    </>
  );
}
