import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import styled from "styled-components";

function App() {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [repos, setRepos] = useState<any>([]);
  const [error, setError] = useState("");
  const [noData, setNoData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const handleSearch = async () => {
  new Promise((resolve) => setTimeout(resolve, 1000));
  setRepos([]);
  setSelectedUser(null);
  setLoadingSearch(true);
    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${username}&per_page=5`
      );
      const data = await response.json();
      setUsers(data.items || []);
    } catch (err) {
      // setError("Failed to fetch users");
    }
    finally {
      setLoadingSearch(false);
    }
  };

  const handleUserClick = async (user: any) => {
    setLoading(true);
    if (selectedUser === user.login) {
      setSelectedUser(null);
      setRepos([]);
      return;
    }
    setSelectedUser(user.login);
    try {
      const response = await fetch(
        `https://api.github.com/users/${user.login}/repos`
      );
      const data = await response.json();
      if(data.length === 0) return setNoData(true); 
      setRepos(data || []);
      setNoData(false);
    } catch (err) {
      setError("Failed to fetch repos");
    }
    finally {
      setLoading(false);
    }
  };


  return (
    <Container style={{ height: "100vh" }}>
      <Row className="justify-content-md-center align-items-center h-100">
        <Col md={5}>
          <Card
            className="shadow-sm rounded-0 w-100"
            style={{ borderColor: "#e5e5e5" }}
          >
            <Card.Body>
              <div className="d-flex flex-column gap-3">
                <div>
                  <Form.Control
                    className="rounded-0"
                    type="text"
                    placeholder="Enter username"
                    style={{ backgroundColor: "#e5e5e5" }}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                  />
                </div>
                <div className="d-flex flex-column gap-2">
                  <Button
                    className="w-100 rounded-0"
                    variant="primary"
                    onClick={handleSearch}
                    disabled={loadingSearch}
                  >
                    {loadingSearch ? "Loading..." : "Search"}
                  </Button>
                  {users.length > 0 && (
                    <div>
                      Showing users for{" "}
                      <span style={{ fontStyle: "italic" }}>"{username}"</span>
                    </div>
                  )}
                </div>
                <div className="d-flex flex-column gap-3">
                  {users?.map((user: any, idx: number) => (
                    <div className="d-flex flex-column gap-3" key={idx}>
                      <CardHoverAnimasi
                        className="w-100 cursor-pointer"
                      >
                        <Card.Body
                          className="p-2"
                          onClick={() => handleUserClick(user)}
                        >
                          <div className="d-flex justify-content-between w-100">
                            <div className="text-capitalize fw-bold">
                              {user.login}
                            </div>
                            <div className="cursor-pointer">{selectedUser === user.login ? "▲" : "▼"}</div>
                          </div>
                        </Card.Body>
                      </CardHoverAnimasi>



                      {selectedUser === user.login && (
                        <>
                        <div className="h-100 d-flex flex-column gap-2" style={{maxHeight: "200px", overflow: "auto", overflowX: "hidden"}}>
                          {loading && <div>Loading...</div>}
                          {!loading && noData && <div>No data</div>}
                          {!loading && !noData && (
                            <>
                            {repos.map((repo: any) => (
                            <Card className="mx-3">
                              <Card.Body>
                                <div className="d-flex justify-content-between w-100">
                                  <div className="fw-bold text-capitalize">{repo.name}</div>
                                  <div className="fw-bold">{repo.stargazers_count} ⭐</div>
                                </div>
                                <div>{repo.description}</div>
                              </Card.Body>
                            </Card>
                          ))}
                            </>
                          )}
                          
                        </div>
                          
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;


const CardHoverAnimasi= styled(Card)`
 background-color: #e5e5e536;
 transition: background-color 0.3s ease-in-out;
 &:hover {
   background-color:rgba(70, 191, 248, 0.21);
 }
`
