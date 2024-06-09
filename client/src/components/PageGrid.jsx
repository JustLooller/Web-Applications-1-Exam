import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import ConfirmationModal from "./ConfirmationModal.jsx";
import PropTypes from "prop-types";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext.jsx";
import dayjs from "dayjs";
import API from "../api/API.js";

export default function PageGrid({ pages, type }) {
  const [filter, setFilter] = useState("all");
  const [authors, setAuthors] = useState([]);
  const [authorFilter, setAuthorFilter] = useState("all");
  const [chronologicalFilter, setChronologicalFilter] = useState("asc");
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (type) {
      API.getAllAuthors().then((authors) => {
        setAuthors(authors);
      });
    }
  }, [type]);

  const sortByPublicationDate = (a, b) => {
    const dateA = dayjs(a.publication_date);
    const dateB = dayjs(b.publication_date);
    if (chronologicalFilter === "asc") {
      if (dateA.isBefore(dateB)) {
        return -1;
      } else if (dateA.isAfter(dateB)) {
        return 1;
      } else {
        return 0;
      }
    } else if (chronologicalFilter === "desc") {
      if (dateA.isBefore(dateB)) {
        return 1;
      } else if (dateA.isAfter(dateB)) {
        return -1;
      } else {
        return 0;
      }
    }
  };

  const orderedPages = pages.sort(sortByPublicationDate);

  const filteredPages = orderedPages.filter((page) => {
    // Filtering logic based on filter and authorFilter values
    const publicationDate = dayjs(page.publication_date);

    if (filter === "all") {
      // Filter for all pages
      if (authorFilter !== "all" && page.author === authorFilter) {
        // Filter by author
        return true;
      } else if (authorFilter === "all") {
        return true;
      }
    } else if (filter === "published") {
      // Filter for published pages (publication date is earlier than today)
      if (
        publicationDate.isValid() &&
        publicationDate.isBefore(dayjs(), "day")
      ) {
        if (authorFilter !== "all" && page.author === authorFilter) {
          // Filter by author
          return true;
        } else if (authorFilter === "all") {
          return true;
        }
      }
    } else if (filter === "programmed") {
      // Filter for programmed pages (publication date is in the future)
      if (
        (publicationDate.isValid() && publicationDate.isSame(dayjs(), "day")) ||
        publicationDate.isAfter(dayjs(), "day")
      ) {
        if (authorFilter !== "all" && page.author === authorFilter) {
          // Filter by author
          return true;
        } else if (authorFilter === "all") {
          return true;
        }
      }
    } else if (filter === "draft") {
      // Filter for draft pages (no publication date)
      if (!publicationDate.isValid()) {
        if (authorFilter !== "all" && page.author === authorFilter) {
          // Filter by author
          return true;
        } else if (authorFilter === "all") {
          return true;
        }
      }
    }

    // Return false if the page doesn't match the filtering conditions
    return false;
  });

  return (
    <Container>
      <Row className="mb-4">
        <Col className="d-flex justify-content-center">
          <select
            value={chronologicalFilter}
            onChange={(e) => setChronologicalFilter(e.target.value)}
          >
            <option value="asc">Ascending Order</option>
            <option value="desc">Descending Order</option>
          </select>
        </Col>
        {type && (
          <>
            <Col className="d-flex justify-content-center">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Pages</option>
                <option value="published">Published Pages</option>
                <option value="programmed">Programmed Pages</option>
                <option value="draft">Draft Pages</option>
              </select>
            </Col>
            <Col className="d-flex justify-content-center">
              <select
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
              >
                <option value="all">All Authors</option>
                {authors.map((author, index) => (
                  <option key={index} value={author.name}>
                    {author.name}
                  </option>
                ))}
              </select>
            </Col>

            <Row className="mb-4"></Row>
          </>
        )}
      </Row>
      <Row>
        {filteredPages.map((page, index) => (
          <Col key={index} md={4}>
            <Card className="shadow mb-5 bg-white">
              <Card.Body>
                <Row className="mb-3">
                  <Col>
                    <h3 className="text-center">{page.title}</h3>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <p>Author: {page.author}</p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p style={{ fontWeight: "lighter" }}>
                      Creation Date: {page.creation_date}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p style={{ fontWeight: "lighter" }}>
                      Publication Date:{" "}
                      {page.publication_date !== null
                        ? page.publication_date
                        : "Draft Page"}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <Row>
                  <Col>
                    <Link to={`/pages/${page.id}`}>
                      <Button variant="outline-primary" className="me-2">
                        Details
                      </Button>
                    </Link>
                    {type &&
                      (user.role === "admin" ||
                        page.author === user.username) && (
                        <>
                          <Link to={`/pages/edit/${page.id}`}>
                            <Button
                              variant="outline-secondary"
                              className="me-2"
                            >
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
                        </>
                      )}
                  </Col>
                </Row>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

PageGrid.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      publication_date: PropTypes.string || null,
      creation_date: PropTypes.string.isRequired,
      blocks: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          page_id: PropTypes.number.isRequired,
          type: PropTypes.string.isRequired,
          content: PropTypes.string.isRequired,
          position: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  type: PropTypes.bool.isRequired,
};
