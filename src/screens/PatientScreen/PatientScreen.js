import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { patientURL } from "../../constant/URL";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function PatientScreen() {
  const [fromDoc, setFromDoc] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState();

  const navigate = useNavigate();

  const [patientLoading, setPatientLoading] = useState(true);
  const [patientData, setPatientData] = useState();
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getPatientData = async () => {
    setPatientLoading(true);

    var userS = JSON.parse(localStorage.getItem("user"));
    var patients;

    if (userS.user_type === "doctor") {
      patients = JSON.parse(localStorage.getItem("patient"));
    } else {
      patients = userS;
    }

    try {
      var resp = await fetch(patientURL, {
        method: "POST",
        headers: {
          Authorization: userS.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: patients.username }),
      });

      if (resp.status === 200) {
        const response = await resp.json();
        setPatientData(response.message);
      } else if (resp.status === 204) {
        setErrorMessage("No Logs");
        setIsError(true);
      } else {
        setErrorMessage("Not Authorized");
        setIsError(true);
      }
    } catch (e) {
      console.log(e);
      setErrorMessage("Error message");
      setIsError(true);
    }

    setPatientLoading(false);
  };

  const logoutFunc = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const userS = JSON.parse(localStorage.getItem("user"));

    if (userS === null) {
      navigate("/", { replace: true });
    } else {
      if (userS.user_type === "doctor") {
        setFromDoc(true);
        setPatient(JSON.parse(localStorage.getItem("patient")));
      } else {
        setPatient(userS);
      }
    }
    setIsLoading(false);

    getPatientData();
  }, []);

  return (
    <Container className="p-3">
      {isLoading ? (
        <Spinner variant="primary" />
      ) : (
        <Row>
          <Col>
            <h3>
              {fromDoc ? "Report of: " : "Welcome"} {patient.username}
            </h3>
          </Col>
          <Col>
            <Button variant="primary" onClick={logoutFunc}>
              Logout
            </Button>
          </Col>
        </Row>
      )}
      {patientLoading ? (
        <Spinner variant="primary" />
      ) : isError ? (
        <p className="text-danger">{errorMessage}</p>
      ) : (
        <Row>
          <Col>
            <Card className="shadow-lg p-3">
              <Card.Title>Latest Reading</Card.Title>
              <Card.Body>
                <Row>
                  <Col>
                    Heart Rate: {patientData[patientData.length - 1].heart_rate}{" "}
                    bpm
                  </Col>
                  <Col>
                    Temperature:{" "}
                    {patientData[patientData.length - 1].temperature} &#8451;
                  </Col>
                  <Col>
                    SPO<sub>2</sub>: {patientData[patientData.length - 1].spo2}{" "}
                    %
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Row className="mt-3">
              <Col>
                <Card className="shadow-lg p-3">
                  <Card.Title>Heart Rate (in last 1 Hour)</Card.Title>
                  <Card.Body>
                    <Line
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: "top",
                          },
                          title: {
                            display: false,
                            text: "Heart Rate",
                          },
                        },
                      }}
                      data={{
                        labels: (() => {
                          var dates = [];
                          patientData.forEach((pat) => {
                            var test = new Date(pat.created_at);
                            dates.push(
                              `${test.getHours()}:${test.getMinutes()}`
                            );
                          });

                          return Array.from(new Set(dates));
                        })(),
                        datasets: [
                          {
                            label: "",
                            data: (() => {
                              var datas = [];

                              patientData.forEach((pat) => {
                                datas.push(parseInt(pat.heart_rate));
                              });
                              return datas;
                            })(),
                            borderColor: "rgb(255, 99, 132)",
                            backgroundColor: "rgba(255, 99, 132, 0.5)",
                          },
                        ],
                      }}
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="shadow-lg p-3">
                  <Card.Title>Temperature (in last 1 Hour)</Card.Title>
                  <Card.Body>
                    <Line
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: "top",
                          },
                          title: {
                            display: false,
                            text: "",
                          },
                        },
                      }}
                      data={{
                        labels: (() => {
                          var dates = [];
                          patientData.forEach((pat) => {
                            var test = new Date(pat.created_at);
                            dates.push(
                              `${test.getHours()}:${test.getMinutes()}`
                            );
                          });

                          return Array.from(new Set(dates));
                        })(),
                        datasets: [
                          {
                            label: "",
                            data: (() => {
                              var datas = [];

                              patientData.forEach((pat) => {
                                datas.push(parseInt(pat.temperature));
                              });
                              return datas;
                            })(),
                            borderColor: "rgb(255, 99, 132)",
                            backgroundColor: "rgba(255, 99, 132, 0.5)",
                          },
                        ],
                      }}
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="shadow-lg p-3">
                  <Card.Title>
                    SPO<sub>2</sub> (in last 1 Hour)
                  </Card.Title>
                  <Card.Body>
                    <Line
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: "top",
                          },
                          title: {
                            display: false,
                            text: "Heart Rate",
                          },
                        },
                      }}
                      data={{
                        labels: (() => {
                          var dates = [];
                          patientData.forEach((pat) => {
                            var test = new Date(pat.created_at);
                            dates.push(
                              `${test.getHours()}:${test.getMinutes()}`
                            );
                          });

                          return Array.from(new Set(dates));
                        })(),
                        datasets: [
                          {
                            label: "",
                            data: (() => {
                              var datas = [];

                              patientData.forEach((pat) => {
                                datas.push(parseInt(pat.spo2));
                              });
                              return datas;
                            })(),
                            borderColor: "rgb(255, 99, 132)",
                            backgroundColor: "rgba(255, 99, 132, 0.5)",
                          },
                        ],
                      }}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default PatientScreen;
