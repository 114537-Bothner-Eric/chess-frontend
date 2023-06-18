import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

let socket;

export function Chess() {
  const [pos, setPos] = useState("start");
  const [turn, setTurn] = useState("w");
  const [color, setColor] = useState();
  const [opponent, setOpponent] = useState();
  const [ml, setMl] = useState("");
  const [mlObject, setMlObject] = useState([]);
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
    socket = new WebSocket("ws://localhost:8080/online");
  }

  socket.addEventListener("open", (event) => {
    console.log("WebSocket connection opened");
    socket.send(sessionStorage.getItem("name"));
  });

  socket.addEventListener("close", (event) => {
    if (!toast.isActive(3) || !toast.isActive(4)) {
      if (!toast.isActive(1)) {
        toast.info("Tu rival se desconecto, volviendo al menu!", {
          toastId: 1,
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
      setTimeout(() => {
        navigate("/");
      }, 4000);
    }
  });

  if (!toast.isActive(2)) {
    if (opponent == null) {
      toast.loading("Esperando rival...", {
        toastId: 2,
        position: "top-right",
        theme: "dark",
      });
    }
  }

  socket.addEventListener("message", (event) => {
    let msg = JSON.parse(event.data);
    switch (msg.type) {
      case "color":
        if (msg.message == "Black") {
          setColor("Black");
        } else {
          setColor("White");
        }
        break;
      case "FEN":
        setPos(msg.message.split(" ")[0]);
        setTurn(msg.message.split(" ")[1]);
        break;
      case "ML":
        console.log(msg.message)
        setMl(msg.message);
        break;
      case "opponent":
        setOpponent(msg.message);
        toast.update(2, {
          render: "Rival Encontrado",
          type: "success",
          isLoading: false,
        });
        setTimeout(() => {
          toast.dismiss(2);
        }, 1000);
        break;
      case "WINNER":
        if (!toast.isActive(3)) {
          toast.success(`Ganaste!, Volviendo al menu!`, {
            toastId: 3,
            position: "top-right",
            theme: "dark",
            autoClose: 3500,
          });
        }
        setTimeout(() => {
          navigate("/");
          socket = null;
        }, 4000);
        break;
      case "LOSER":
        if (!toast.isActive(4)) {
          toast.error(`Perdise!, Volviendo al menu!`, {
            toastId: 4,
            position: "top-right",
            theme: "dark",
            autoClose: 3500,
          });
        }
        setTimeout(() => {
          navigate("/");
          socket = null;
        }, 4000);
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
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
            {opponent}
          </div>
          <div style={{ width: "100%" }}>
            <Chessboard
              id="BasicBoard"
              position={pos}
              onPieceDrop={handle}
              boardOrientation={color == "Black" ? "black" : "white"}
            />
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
            {sessionStorage.getItem("name")} (Tú)
          </div>
        </div>
        <div style={{ width: "25%", height: "100vh", margin: "0px 15px" }}>
          <div style={{ height: "10%" }}></div>
          <div
            style={{
              color: "white",
              fontSize: "2em",
              backgroundColor: "#555",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Ultimos Movimientos
          </div>
          <div
            style={{
              maxHeight: "75%",
              overflowY: "auto",
              backgroundColor: "gray",
            }}
          >
            {mlObject}
          </div>
        </div>
      </div>
    </>
  );
}
