import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Popup from 'reactjs-popup';

let socket;

export function LocalChess() {

  console.log(localStorage.getItem('FEN'))

  const [pos, setPos] = useState("start");
  const [turn, setTurn] = useState("w");
  const [ml, setMl] = useState("");
  const [mlObject, setMlObject] = useState([]);
  const [open, setOpen] = useState(false);
  const MovementList = ({ mov, index }) => (
    <div
      style={{
        color: "white",
        fontSize: "1.5em",
        paddingLeft: "10px",
        paddingBottom: "2px",
      }}
    >
      {index} - {mov}
    </div>
  );

  useEffect(() => {
    setMlObject([]);
    ml.split(" ").forEach((r, index) =>
      setMlObject((current) => [
        ...current,
        <MovementList mov={r} index={index + 1} />,
      ])
    );
  }, [ml]);

  const navigate = useNavigate();

  if (!socket || socket.readyState != WebSocket.OPEN) {
    socket = new WebSocket("ws://localhost:8080/local");
  }

  socket.addEventListener("open", (event) => {
    console.log("WebSocket connection opened");
  });

  socket.addEventListener("message", (event) => {
    let msg = JSON.parse(event.data);
    switch (msg.type) {
      case "FEN":
        localStorage.setItem("FEN", msg.message);
        setPos(msg.message.split(" ")[0]);
        setTurn(msg.message.split(" ")[1]);
        break;
      case "ML":
        setMl(msg.message);
        break;
      case "WINNER":
        localStorage.removeItem('FEN');
        toast.info(`Gano ${msg.message}, volviendo al menu`, {
          toastId: 1,
          position: "top-right",
          autoClose: 3500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => {
          navigate("/")
        }, 4000);
        setWinner(msg.message)
        break;
      default:
        break;
    }
  });

  function convertToPosition(coordinate) {
    let row = parseInt(coordinate.charAt(1)) - 1;
    let col = coordinate.toLowerCase().charCodeAt(0) - 97;
    return [row, col];
  }

  function handle(sourceSquare, targetSquare, piece) {
    if (piece.startsWith("b") && turn == "w") {
      return;
    }
    if (piece.startsWith("w") && turn == "b") {
      return;
    }
    const messageObj = {
      sourceRow: convertToPosition(sourceSquare)[0],
      sourceColumn: convertToPosition(sourceSquare)[1],
      targetRow: convertToPosition(targetSquare)[0],
      targetColumn: convertToPosition(targetSquare)[1],
    };

    const messageJson = JSON.stringify(messageObj);
    socket.send(messageJson);
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <div style={{ width: "25%", backgroundColor: "#26262b" }}></div>
        <div
          style={{
            width: "45%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: "2em",
              paddingBottom: "5px",
              height: "10%",
              display: "flex",
              alignItems: "center",
            }}
          >
            Jugador 2
          </div>
          <div style={{ width: "100%" }}>
            <Chessboard id="BasicBoard" position={pos} onPieceDrop={handle} />
          </div>
          <div
            style={{
              color: "white",
              fontSize: "2em",
              paddingTop: "5px",
              height: "10%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Jugador 1
          </div>
        </div>
        <div style={{ width: "25%", height: "100vh", margin: "0px 15px"}}>
          <div style={{height: "10%"}}></div>
          <div style={{color: "white", fontSize: "2em", backgroundColor: "#555", display: "flex", justifyContent: "center"}}>
            Ultimos Movimientos
          </div>
          <div style={{maxHeight: "75%", overflowY: "auto", backgroundColor: "gray" }}>{mlObject}</div>
        </div>
      </div>
      <button onClick={() => {
        setOpen(true)
      }}>asdad</button>
      <Popup open={open} onClose={() => setOpen(false)}>
        <div className="modal" style={{backgroundColor: "#1b1b1b", color: "white", fontSize: "2.5em", width: "40vw", margin: "auto"}}>
          <div style={{padding: "15px", display: "flex", justifyContent: "center"}}>Hay una partida en progreso. Deseas continuarla?</div>
          <div style={{padding: "10px", display: "flex", justifyContent: "space-around"}}>
            <button style={{padding: "5px 50px", fontSize: "0.8em"}}>Si</button>
            <button style={{padding: "5px 50px", fontSize: "0.8em"}}>No</button>
          </div>
        </div>
      </Popup>
    </>
  );
}
