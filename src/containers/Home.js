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
  const [notes, setNotes] = useState([]);
  const [greet, setGreet] = useState();
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

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
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }
    onLoad();
  }, [isAuthenticated]);
  function loadNotes() {
    return API.get("notes", "/notes");
  }

  function renderNotesList(notes) {
    return (
      <>
        <LinkContainer to="/notes/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Create a new note</span>
          </ListGroup.Item>
        </LinkContainer>
        {notes.map(({ noteId, content, createdAt }) => (
          <LinkContainer key={noteId} to={`/notes/${noteId}`}>
            <ListGroup.Item action>
              <span className="font-weight-bold">
                {content.trim().split("\n")[0]}
              </span>
              <br />
              <span className="text-muted">
                Created: {new Date(createdAt).toLocaleString()}
              </span>
            </ListGroup.Item>
          </LinkContainer>
        ))}
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>ThinkSync</h1>
        <p className="text-muted">Where your thoughts sync effortlessly</p>
        <div className="box">
          <LinkContainer to="/signup">
            <Button variant="success">Sign up</Button>
          </LinkContainer>
          <LinkContainer to="/login">
          <Button className="ml-4" variant="primary">Login</Button>
          </LinkContainer>
          
        </div>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        <h2>
          Welcome, <span>{greet}</span>
        </h2>
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
        <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
