import { Row, Col, Button } from "react-bootstrap";
import ConfirmationModal from "./ConfirmationModal";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";

export default function SinglePageButtons({ page }) {
  const navigate = useNavigate();
  return (
    <Row>
      <Col className="text-end">
        <Link to={`/pages/edit/${page.id}`}>
          <Button className="me-2" variant="outline-secondary">
            Edit
          </Button>
        </Link>
        <ConfirmationModal
          buttonName="Delete"
          buttonType="outline-danger"
          page={page}
          title="Are you sure you want to delete this page?"
          message="This action is irreversible, you will lose all data associated with this page"
          redirectTo="/backoffice"
        />
        <Button onClick={() => navigate(-1)} variant="outline-primary">
          Back
        </Button>
      </Col>
    </Row>
  );
}

SinglePageButtons.propTypes = {
  page: PropTypes.shape({
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
