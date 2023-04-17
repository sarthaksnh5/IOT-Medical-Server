import "bootstrap/dist/css/bootstrap.min.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Navigation from "./navigations/navigation/Navigation";
import { Container } from "react-bootstrap";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  return (
    <Container fluid>
      <Navigation />
    </Container>
  );
}

export default App;
