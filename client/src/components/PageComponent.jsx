import { Container, Row, Col } from "react-bootstrap";
import HorizontalLine from "./HorizontalLine.jsx";
import PropTypes from "prop-types";

export default function PageComponent({ singlePage }) {

  return (
    <>
      <Container>
        <Row className="mb-4">
          <Col>
            <h1 className="text-center">{singlePage.title}</h1>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <p>
              <strong>Author:</strong>{" "}
              {singlePage.author ? singlePage.author : ""}
            </p>

            <p>
              <strong>Creation Date:</strong>{" "}
              {singlePage.creation_date ? singlePage.creation_date : ""}
            </p>

            <p>
              <strong>Publication Date:</strong>{" "}
              {singlePage.publication_date !== null
                ? singlePage.publication_date
                : "Draft Page"}
            </p>
          </Col>
        </Row>
        <HorizontalLine />
        <Row>
          <Col>
            {singlePage.blocks.map((block) => (
              <div key={block.id} className="mb-4">
                {block.type === "header" && <h2>{block.content}</h2>}
                {block.type === "paragraph" && <p>{block.content}</p>}
                {block.type === "image" && (
                  <img
                    src={`http://localhost:3001/images/${block.content}`}
                    alt="Block Image"
                    style={styles.image}
                  />
                )}
              </div>
            ))}
          </Col>
        </Row>
      </Container>
    </>
  );
}

const styles = {
  image: {
    marginRight: "300px",
    maxWidth: "300px",
    maxHeight: "300px",
  },
};

PageComponent.propTypes = {
  singlePage: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    creation_date: PropTypes.string.isRequired,
    publication_date: PropTypes.string || null,
    blocks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        type: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        position: PropTypes.number.isRequired,
      })
    ),
  }),
};
