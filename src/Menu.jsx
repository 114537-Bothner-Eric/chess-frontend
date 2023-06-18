import React, { useState } from "react";
import { Chessboard } from "react-chessboard";
import boardLogo from "./assets/board.png";
import { Link, useNavigate } from "react-router-dom";

export function Menu({ socket }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  return (
    <>
      <div
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: "40px",
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
        }}
      >
        Bienvenido
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ marginTop: "20px" }}>
          <img
            src={boardLogo}
            alt=""
            style={{ height: "400px", width: "400px" }}
          />
        </div>
      </div>
      <div
        style={{
          height: "30vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: "40px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Elige un modo de juego!
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
              gap: "10px",
            }}
          >
            <p style={{ color: "white" }}>Nombre: </p>
            <input type="text" onChange={(e) => setUsername(e.target.value)}/>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              gap: "50px",
              marginTop: "10%",
            }}
          >
            <div>
              <button
                style={{
                  border: "none",
                  backgroundColor: "#b58863",
                  padding: "10px 50px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
                onClick={() => navigate("/local")}
              >
                Local
              </button>
            </div>
            <div>
              <button
                style={{
                  border: "none",
                  backgroundColor: "#b58863",
                  padding: "10px 50px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
                onClick={() => {
                  sessionStorage.setItem('name', username);
                  navigate("/chess")
                }}
              >
                Online
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
