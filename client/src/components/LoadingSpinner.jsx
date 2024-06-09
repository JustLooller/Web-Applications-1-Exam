import { Spinner } from "react-bootstrap";

export default function LoadingSpinner() {
  return (
    <div style={styles.container}>
      <Spinner animation="border" role="status" variant="primary" />
      <p style={styles.text}>Loading...</p>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  text: {
    marginTop: "1rem",
    fontSize: "1.2rem",
    color: "gray",
  },
};
