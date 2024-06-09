import { useMemo, useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Dropdown,
} from "react-bootstrap";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable as Droppable } from "./StrictModeDroppable";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import PageComponent from "./PageComponent";
import HorizontalLine from "./HorizontalLine";
import dayjs from "dayjs";
import API from "../api/API";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function PageEditForm({ pageToEdit }) {
  const { user } = useContext(UserContext);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState([]);

  const [title, setTitle] = useState(pageToEdit.title);
  const [author, setAuthor] = useState(pageToEdit.author);
  const [publicationDate, setPublicationDate] = useState(
    pageToEdit.publication_date
  );
  const [blocks, setBlocks] = useState(pageToEdit.blocks);
  const [blockType, setBlockType] = useState("header");
  const [blockContent, setBlockContent] = useState("");
  const [blockPosition, setBlockPosition] = useState(
    pageToEdit.blocks?.length || 0
  );

  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [isEditingBlock, setIsEditingBlock] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);

  const page = useMemo(
    () => ({
      id: pageToEdit.id,
      title,
      author,
      creation_date: dayjs().format("YYYY-MM-DD"),
      publication_date: publicationDate ? publicationDate : null,
      blocks: [],
    }),
    [pageToEdit.id, title, author, publicationDate]
  );
  useEffect(() => {
    const url = "http://localhost:3001/images/";

    API.getAllAuthors()
      .then((res) => {
        setAuthors(res);
      })
      .catch((err) => setError(err));
    API.getImagesList()
      .then((res) => {
        res.map((image) => {
          image.url = url + image.name;
        });
        setImages(res);
      })
      .catch((err) => setError(err));
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedBlocks = Array.from(blocks);
    const [reorderedBlock] = updatedBlocks.splice(result.source.index, 1);
    updatedBlocks.splice(result.destination.index, 0, reorderedBlock);
    //update position
    reorderBlocks(updatedBlocks);
  };

  const handleAddBlock = () => {
    if (blockContent === "") {
      setError(["You need to insert a content in each block"]);
      return;
    }
    const newBlock = {
      type: blockType,
      content: blockContent,
      position: blockPosition,
    };
    setBlocks([...blocks, newBlock]);
    setBlockContent("");
    setBlockPosition(blockPosition + 1);
    if (blockType === "image") {
      setSelectedImage(null);
    }
  };
  const handleDeleteBlock = (index) => {
    const updatedBlocks = blocks.filter((block) => block.position !== index);
    reorderBlocks(updatedBlocks);
    setBlockPosition(blockPosition - 1);
  };
  const reorderBlocks = (blocks) => {
    const updatedBlocks = Array.from(blocks);
    updatedBlocks.forEach((block, index) => {
      block.position = index;
    });
    setBlocks(updatedBlocks);
  };

  const saveChanges = (event) => {
    event.preventDefault();
    const newPage = { ...page, blocks };
    console.log(newPage);
    API.editPage(newPage)
      .then(() => {
        setSuccess(true);
        setError([]);
        setIsEditingBlock(false);
      })
      .catch((err) => {
        setError(err.errors);
      });
  };

  const handleImageSelect = (target) => {
    const image = images.find((image) => image.name === target.alt);
    setSelectedImage(image);
    setBlockContent(image.name);
  };
  const handleEditBlock = (index) => {
    const block = blocks.find((block) => block.position === index);
    setEditingBlock(block);
    setBlockType(block.type);
    setBlockContent(block.content);
    setBlockPosition(block.position);
    if (block.type === "image")
      setSelectedImage(images.find((image) => image.name === block.content));
    setIsEditingBlock(true);
  };

  const handleSaveBlockChanges = () => {
    let updatedBlocks = Array.from(blocks);
    updatedBlocks.forEach((block, index) => {
      block.position = index;
    });
    updatedBlocks = updatedBlocks.map((block) => {
      if (block.position === editingBlock.position) {
        return {
          type: blockType,
          content: blockContent,
          position: blockPosition,
        };
      }
      return block;
    });
    reorderBlocks(updatedBlocks);
    setBlockContent("");
    setSelectedImage(null);
    setBlockPosition(updatedBlocks.length);
    setIsEditingBlock(false);
  };
  const handleCancelButtonClick = () => {
    setIsEditingBlock(false);
    setBlockType("header");
    setBlockContent("");
    setBlockPosition(blocks.length);
  };

  return (
    <>
      <Container>
        {error.length > 0 && (
          <Alert variant="danger" dismissible onClick={() => setError([])}>
            {error.map((err, index) => (
              <p key={index}>{err}</p>
            ))}
          </Alert>
        )}
        {success && (
          <Alert
            className="text-center"
            variant="success"
            dismissible
            onClick={() => setSuccess(false)}
          >
            Page edited successfully! <br />
            <Link to={`/pages/${pageToEdit.id}`}></Link>
          </Alert>
        )}
        <Form>
          <Row>
            <Col>
              <Form.Group controlId="formTitle">
                <Form.Label>Page Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formAuthor">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  as="select"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  disabled={user.role !== "admin"}
                >
                  {authors.map((author) => (
                    <option key={author.name} value={author.name}>
                      {author.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="formPublicationDate">
                <Form.Label>Publication Date</Form.Label>
                <Form.Control
                  type="date"
                  value={publicationDate}
                  onChange={(e) => setPublicationDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formBlockType">
                <Form.Label>Block Type</Form.Label>
                <Form.Control
                  as="select"
                  value={blockType}
                  onChange={(e) => setBlockType(e.target.value)}
                >
                  <option value="header">Header</option>
                  <option value="paragraph">Paragraph</option>
                  <option value="image">Image</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="formBlockContent">
            <Form.Label>Block Content</Form.Label>
            {blockType === "image" ? (
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-primary"
                  id="image-select-toggle"
                >
                  {selectedImage ? (
                    <img
                      src={selectedImage.url}
                      alt={selectedImage.name}
                      style={styles.selectedImage}
                    />
                  ) : (
                    "Select an Image"
                  )}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {images.map((image) => (
                    <Dropdown.Item
                      key={image.name}
                      onClick={(e) => handleImageSelect(e.target)}
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        style={styles.image}
                      />
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Form.Control
                as={blockType === "paragraph" ? "textarea" : "input"}
                rows={3}
                placeholder="Enter block content"
                value={blockContent}
                onChange={(e) => setBlockContent(e.target.value)}
              />
            )}
          </Form.Group>
          <Row className="mx-auto" style={{ width: "25%" }}>
            {isEditingBlock ? (
              <Button
                className="mt-4 me-2"
                variant="outline-primary"
                onClick={handleSaveBlockChanges}
              >
                Save Block Changes
              </Button>
            ) : (
              <Button
                className="mt-4 me-2"
                variant="outline-primary"
                onClick={handleAddBlock}
              >
                Add Block
              </Button>
            )}
            <Button
              className="mt-2 me-2"
              variant="outline-success"
              onClick={saveChanges}
            >
              Save Changes
            </Button>
          </Row>
          <Row className="mx-auto" style={{ width: "25%" }}></Row>
        </Form>
        <HorizontalLine />
        <h2 className="text-center mb-1">Page Preview</h2>
        <p className="text-center mb-4">Drag and drop the blocks to reorder them</p>
        <Container className="border border-secondary mt-4">
          <PageComponent singlePage={page} />
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="blocks">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {blocks.map((block, index) => (
                    <Draggable
                      key={index}
                      draggableId={`block-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Container className="my-3">
                            <Row>
                              {block.type === "header" && (
                                <Row>
                                  <Col className="d-flex align-items-center justify-content-start">
                                    <h2>{block.content}</h2>
                                  </Col>
                                  <Col className="d-flex align-items-center justify-content-end">
                                    {isEditingBlock ? (
                                      <Button
                                        className="me-2"
                                        variant="outline-secondary"
                                        onClick={handleCancelButtonClick}
                                      >
                                        Cancel
                                      </Button>
                                    ) : (
                                      <Button
                                        className="me-2"
                                        variant="outline-secondary"
                                        onClick={() => handleEditBlock(index)}
                                      >
                                        Edit
                                      </Button>
                                    )}
                                    <Button
                                      disabled={isEditingBlock}
                                      variant="outline-danger"
                                      onClick={() => {
                                        handleDeleteBlock(index);
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </Col>
                                </Row>
                              )}
                              {block.type === "paragraph" && (
                                <Row>
                                  <Col className="d-flex align-text-start justify-content-start">
                                    <p>{block.content}</p>
                                  </Col>
                                  <Col className="d-flex align-items-center justify-content-end">
                                    {isEditingBlock ? (
                                      <Button
                                        className="me-2"
                                        variant="outline-secondary"
                                        onClick={handleCancelButtonClick}
                                      >
                                        Cancel
                                      </Button>
                                    ) : (
                                      <Button
                                        className="me-2"
                                        variant="outline-secondary"
                                        onClick={() => handleEditBlock(index)}
                                      >
                                        Edit
                                      </Button>
                                    )}
                                    <Button
                                      disabled={isEditingBlock}
                                      variant="outline-danger"
                                      onClick={() => {
                                        handleDeleteBlock(index);
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </Col>
                                </Row>
                              )}
                              {block.type === "image" && (
                                <Row>
                                  <Col className="d-flex align-items-center justify-content-start">
                                    <img
                                      src={`http://localhost:3001/images/${block.content}`}
                                      alt={block.content}
                                      style={styles.image}
                                    />
                                  </Col>
                                  <Col className="d-flex align-items-center justify-content-end">
                                    {isEditingBlock ? (
                                      <Button
                                        className="me-2"
                                        variant="outline-secondary"
                                        onClick={handleCancelButtonClick}
                                      >
                                        Cancel
                                      </Button>
                                    ) : (
                                      <Button
                                        className="me-2"
                                        variant="outline-secondary"
                                        onClick={() => handleEditBlock(index)}
                                      >
                                        Edit
                                      </Button>
                                    )}
                                    <Button
                                      disabled={isEditingBlock}
                                      variant="outline-danger"
                                      onClick={() => {
                                        handleDeleteBlock(index);
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </Col>
                                </Row>
                              )}
                            </Row>
                          </Container>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Container>
      </Container>
    </>
  );
}

const styles = {
  image: {
    marginRight: "300px",
    maxWidth: "150px",
    maxHeight: "150px",
  },
  selectedImage: {
    marginRight: "10px",
    maxWidth: "150px",
    maxHeight: "150px",
    verticalAlign: "middle",
  },
};

PageEditForm.propTypes = {
  pageToEdit: PropTypes.shape({
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
    ).isRequired,
  }).isRequired,
};
