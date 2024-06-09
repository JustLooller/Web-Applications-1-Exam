import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useLoaderData } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import HeaderComponent from "../components/HeaderComponent";
import PageComponent from "../components/PageComponent";
import SinglePageButtons from "../components/SinglePageButtons";
import PropTypes from "prop-types";

export default function SinglePage() {
  const { user } = useContext(UserContext);
  const page = useLoaderData();

  return (
    <>
      <HeaderComponent />
      <Container>
        <Row className="mb-4">
          <PageComponent singlePage={page} />
          {user !== null && user.role === "admin" ? (
            <SinglePageButtons page={page} />
          ) : (
            <Col className="text-end"></Col>
          )}
        </Row>
      </Container>
    </>
  );
}

SinglePage.propTypes = {
  singlePage: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    creation_date: PropTypes.string.isRequired,
    publication_date: PropTypes.string || null,
    blocks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        position: PropTypes.number.isRequired,
      })
    ).isRequired,
  }),
};
