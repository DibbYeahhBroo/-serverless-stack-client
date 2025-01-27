import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import { Auth } from "aws-amplify";
import Button from "react-bootstrap/Button";
import "./Home.css";

export default function Home() {
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [notes, setNotes] = useState([]);
  const [greet, setGreet] = useState();
  const [searchQuery, setSearchQuery] = useState(""); // For search bar
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = "https://my-notes-api-bucket.s3.us-east-1.amazonaws.com";

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
      try {
        const notes = await loadNotes();
        const user = await Auth.currentAuthenticatedUser();
        const { attributes } = user;
        setGreet(attributes.email);
        setNotes(notes);
        setFilteredNotes(notes); // Initialize filtered notes
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }
    onLoad();
  }, [isAuthenticated]);

  async function loadNotes() {
    return API.get("notes", "/notes");
  }

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = notes.filter((note) =>
      note.content.toLowerCase().includes(query)
    );
    setFilteredNotes(filtered);
  };

  function renderNotesList(filteredNotes) {
    return (
      <div className="notes-container">
        <LinkContainer to="/notes/new">
          <div className="note-card create-note-card">
            <BsPencilSquare size={24} />
            <span>Create a new note</span>
          </div>
        </LinkContainer>
        {filteredNotes.map(({ noteId, content, createdAt, userId, attachment }) => {
          const safeContent = typeof content === "string" ? content : "No content available";
          const safeAttachment = typeof attachment === "string" ? attachment : null;

          const filePath = `private/${userId}/${safeAttachment}`;
          const encodedKey = encodeURIComponent(filePath);
          const imageUrl = `${BASE_URL}/${encodedKey}`;

          return (
            <LinkContainer key={noteId} to={`/notes/${noteId}`}>
              <div className="note-card">
                <img
                  src={imageUrl}
                  alt="Not Found"
                  className="note-image"
                />
                <div className="note-content">
                  <span className="note-title">
                    {safeContent.trim().split("\n")[0]}
                  </span>
                  <span className="note-date">
                    Created: {new Date(createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </LinkContainer>
          );
        })}
      </div>
    );
  }

  async function handleDeleteAll() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all your notes? This action cannot be undone."
    );
    if (!confirmed) return;
    try {
      await API.del("notes", "/notes");
      setNotes([]);
      setFilteredNotes([]);
      alert("All notes have been deleted.");
    } catch (e) {
      onError(e);
    }
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>ThinkSync</h1>
        <p className="text-muted" >Where your thoughts sync effortlessly</p>
        <div className="box">
          <LinkContainer to="/signup">
            <Button variant="success">Sign up</Button>
          </LinkContainer>
          <LinkContainer to="/login">
            <Button className="ml-4" variant="primary">
              Login
            </Button>
          </LinkContainer>
        </div>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        <h2 color="white" className="pb-3 mt-4 mb-3 border-bottom">
          Welcome, <span>{greet}</span>
        </h2>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar"
        />
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
        <ListGroup>{!isLoading && renderNotesList(filteredNotes)}</ListGroup>
        <ListGroup.Item
          action
          className="flex-grow-1 d-flex justify-content-center align-items-center"
          onClick={handleDeleteAll}
          
          style={{
            marginTop: "2rem",
            height: "55px",
            width: "100%",
            borderRadius: "8px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            fontWeight: "bold",
            border: "1px solid rgb(240, 17, 40)",
          }}
        >
          Delete All Notes
        </ListGroup.Item>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
