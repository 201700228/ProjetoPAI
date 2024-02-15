import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaEdit,
  FaSave,
  FaPlus,
  FaCamera,
  FaTrashAlt,
  FaBan,
} from "react-icons/fa";
import "./Games.css";
import { toast } from "react-toastify";

const GamesTable = () => {
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState({
    id: null,
    name: "",
    description: "",
    picture: null,
    isEditing: false,
    isNew: false,
  });
  const [lastId, setLastId] = useState(0);
  const [filter, setFilter] = useState("");
  const [editMode, setEditMode] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/games/list",
          {}
        );
        setGames(response.data);
        setLastId(
          response.data.length > 0
            ? response.data[response.data.length - 1].id
            : 0
        );
      } catch (error) {
        toast.error("Error fetching data from the API", {
          className: "toast-error",
        });
      }
    };
    fetchGames();
  }, []);

  const handleEdit = (id) => {
    setEditMode(id);
    setNewGame({
      ...games.find((game) => game.id === id),
      isEditing: true,
      isNew: false,
    });
  };

  const handleDelete = async (id) => {
    try {
      if (id !== null) {
        await axios.delete(`http://localhost:3001/games/game/${id}`);
      }
      setGames((prevGames) => prevGames.filter((game) => game.id !== id));
      setLastId((prevLastId) => (id === prevLastId ? id - 1 : prevLastId));
      setEditMode(null);
      setFilter("");
      setNewGame({
        id: null,
        name: "",
        description: "",
        picture: null,
        isEditing: false,
        isNew: false,
      });
      toast.success("Game successfully removed.", {
        className: "toast-success",
      });
    } catch (error) {
      toast.error("Error deleting the game.", {
        className: "toast-error",
      });
    }
  };

  const handleAdd = () => {
    const newId = lastId + 1;
    const newGame = {
      id: newId,
      name: "",
      description: "",
      picture: null,
      isNew: true,
    };
    setGames([...games, newGame]);
    setLastId(newId);
    setEditMode(newId);
    setFilter("");
    setNewGame({
      ...newGame,
      isEditing: true,
    });
  };

  const handleSave = async (index) => {
    try {
      let savedGame;
      const formData = new FormData();
      formData.append("name", newGame.name);
      formData.append("description", newGame.description);
      formData.append("picture", newGame.picture);

      if (newGame.isNew) {
        const response = await axios.post(
          "http://localhost:3001/games/add",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Game successfully created.", {
          className: "toast-success",
        });

        savedGame = response.data;
      } else if (newGame.id !== null && newGame.isEditing) {
        const response = await axios.put(
          `http://localhost:3001/games/update/${newGame.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success("Game successfully updated.", {
          className: "toast-success",
        });

        savedGame = response.data;
      } else {
        toast.error("Cannot save a new game that hasn't been edited.", {
          className: "toast-error",
        });

        return;
      }

      savedGame.picture = newGame.picture;

      setGames((prevGames) => [
        ...prevGames.slice(0, index),
        savedGame,
        ...prevGames.slice(index + 1),
      ]);

      setEditMode(null);
      setFilter("");
      setNewGame({
        id: null,
        name: "",
        description: "",
        picture: savedGame.picture,
        isEditing: false,
        isNew: false,
      });
    } catch (error) {
      toast.error("Error saving the game.", {
        className: "toast-error",
      });
    }
  };

  const isEditing = (gameId) => editMode === gameId;

  const handleAddImage = () => {
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = "image/*";

    inputElement.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const updatedGame = {
          ...newGame,
          picture: file,
        };
        setNewGame(updatedGame);
      }
    });

    inputElement.click();
  };

  const handleDeleteImage = () => {
    setNewGame({ ...newGame, picture: null });
  };

  return (
    <div>
      <div className="topDiv">
        <button
          className="gamesListButton"
          onClick={handleAdd}
          disabled={editMode !== null}
        >
          <FaPlus /> <span>Game</span>
        </button>

        <div className="searchContainer">
          <input
            type="text"
            placeholder="Filter by name ..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="searchInput"
          />
        </div>
      </div>

      <div className="tableContainer">
        <table className="gamesList">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {games
              .filter((game) =>
                game.name.toLowerCase().includes(filter.toLowerCase())
              )
              .map((game, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={isEditing(game.id) ? newGame.name : game.name}
                      onChange={(e) => {
                        const updatedGame = {
                          ...newGame,
                          name: e.target.value,
                        };
                        setNewGame(updatedGame);
                      }}
                      readOnly={editMode !== game.id}
                      style={{
                        backgroundColor:
                          editMode === game.id ? "white" : "black",
                        color: editMode === game.id ? "black" : "#FFFE01",
                        border:
                          editMode === game.id ? "1px solid #FFFE01" : "none",
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={
                        isEditing(game.id)
                          ? newGame.description
                          : game.description
                      }
                      onChange={(e) => {
                        const updatedGame = {
                          ...newGame,
                          description: e.target.value,
                        };
                        setNewGame(updatedGame);
                      }}
                      readOnly={editMode !== game.id}
                      style={{
                        backgroundColor:
                          editMode === game.id ? "white" : "black",
                        color: editMode === game.id ? "black" : "#FFFE01",
                        border:
                          editMode === game.id ? "1px solid #FFFE01" : "none",
                      }}
                    />
                  </td>

                  <td>
                    {game.id && (
                      <>
                        {isEditing(game.id) ? (
                          <>
                            {newGame.picture === null && (
                              <button
                                title="Add Image"
                                className="buttonImage"
                                onClick={handleAddImage}
                              >
                                <FaCamera />
                              </button>
                            )}
                            {newGame.picture !== null && (
                              <button
                                title="Remove Image"
                                className="buttonImage"
                                onClick={handleDeleteImage}
                              >
                                <FaBan />
                              </button>
                            )}
                            <button title="Save" onClick={() => handleSave(index)}>
                              <FaSave />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              title="Edit"
                              onClick={() => handleEdit(game.id)}
                              style={{ marginTop: "5px" }}
                            >
                              <FaEdit />
                            </button>
                            <button
                              title="Remove"
                              onClick={() => handleDelete(game.id)}
                              style={{ marginTop: "5px" }}
                            >
                              <FaTrashAlt />
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GamesTable;
