import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { allPatientsURL } from "../../constant/URL";

function DoctorScreen() {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getPatientData = (patientName) => {
    localStorage.setItem("patient", patientName);
    navigate("/patient", { replace: true });
  };

  const getAllPatients = async () => {
    setPatientsLoading(true);
    var userS = JSON.parse(localStorage.getItem("user"));
    try {
      const resp = await fetch(allPatientsURL, {
        headers: { Authorization: userS.token },
      });

      if (resp.status === 200) {
        const response = await resp.json();
        setPatients(response.message);
      } else if (resp.status === 204) {
        setErrorMessage("No Patients under you");
        setIsError(true);
      } else {
        setErrorMessage("Not Authorized");
        setIsError(true);
      }
    } catch (e) {
      console.log(e);
      setErrorMessage("Error fetching Data");
      setIsError(true);
    }
    setPatientsLoading(false);
  };

  const logoutFunc = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    (async () => {
      var user = JSON.parse(await localStorage.getItem("user"));
      if (user === null) {
        navigate("/", { replace: true });
      } else {
        setUser(user);
        setIsLoading(false);
      }
    })();
    getAllPatients();
  }, []);

  const deletePatient = (patient_name) => {};

  return (
    <Container className="p-3">
      {isLoading ? (
        <Spinner variant="primary" />
      ) : (
        <>
          <Row>
            <Col>
              <h2>Welcome Dr. {user.username}</h2>
            </Col>
            <Col>
              <Button variant="primary" onClick={logoutFunc}>
                Logout
              </Button>
            </Col>
          </Row>
          <Card className="shadow-lg p-3">
            <Card.Title>Your Patients</Card.Title>
            <Card.Body>
              <Row className="p-3">
                <Col>
                  {patientsLoading ? (
                    <Spinner variant="primary" />
                  ) : isError ? (
                    <p className="text-danger">{errorMessage}</p>
                  ) : (
                    <Table responsive bordered hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Mobile Number</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patients.map((patient, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{patient.user.username}</td>
                              <td>{patient.mobile_num}</td>
                              <td>
                                <Row>
                                  <Col>
                                    <Button
                                      onClick={() => {
                                        getPatientData(
                                          JSON.stringify(patient.user)
                                        );
                                      }}
                                      variant="primary"
                                    >
                                      Get Report
                                    </Button>
                                  </Col>
                                </Row>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
}

export default DoctorScreen;
