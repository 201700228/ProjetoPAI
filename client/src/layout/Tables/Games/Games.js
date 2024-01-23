import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaSave, FaPlus } from "react-icons/fa";
import "./Games.css";

const GamesTable = () => {
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState({
    id: null,
    name: "",
    description: "",
    isEditing: false,
    isNew: false,
  });
  const [lastId, setLastId] = useState(0);
  const [filter, setFilter] = useState("");
  const [editMode, setEditMode] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get("http://localhost:3001/games/list", {});
        setGames(response.data);
        setLastId(
          response.data.length > 0
            ? response.data[response.data.length - 1].id
            : 0
        );
      } catch (error) {
        console.error("Erro ao obter dados da API:", error);
      }
    };
    fetchGames();
  }, []);

  const handleEdit = (id) => {
    console.log(`Editar jogo com ID ${id}`);
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
        isEditing: false,
        isNew: false,
      });
    } catch (error) {
      console.error("Erro ao excluir o jogo:", error);
    }
  };

  const handleAdd = () => {
    const newId = lastId + 1;
    const newGame = { id: newId, name: "", description: "", isNew: true };
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
      if (newGame.isNew) {
        const response = await axios.post(
          "http://localhost:3001/games/add",
          newGame
        );
        setGames([...games.slice(0, index), response.data, ...games.slice(index + 1)]);
      } else if (newGame.id !== null && newGame.isEditing) {
        const response = await axios.put(
          `http://localhost:3001/games/update/${newGame.id}`,
          newGame
        );
        setGames([...games.slice(0, index), response.data, ...games.slice(index + 1)]);
      } else {

        console.warn("Não é possível salvar um novo jogo que não foi editado.");
      }

      setEditMode(null);
      setFilter(""); 
      setNewGame({
        id: null,
        name: "",
        description: "",
        isEditing: false,
        isNew: false,
      });
    } catch (error) {
      console.error("Erro ao salvar o jogo:", error);
    }
  };

  const isEditing = (gameId) => editMode === gameId;

  return (
    <div>
      <div className="topDiv">
        <button
          className="gamesListButton"
          onClick={handleAdd}
          disabled={editMode !== null}
        >
          <FaPlus /> Adicionar
        </button>

        <div className="searchContainer">
          <input
            type="text"
            placeholder="Filtrar por nome..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="searchInput"
          />
        </div>
      </div>

      <table className="gamesList">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {games
            .filter((game) =>
              game.name.toLowerCase().includes(filter.toLowerCase())
            )
            .map((game, index) => (
              <tr key={index}>
                <td>{game.id}</td>
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
                      border:
                        editMode === game.id ? "1px solid #FFFE01" : "none",
                    }}
                  />
                </td>
                <td>
                  {game.id && (
                    <>
                      {isEditing(game.id) ? (
                        <button onClick={() => handleSave(index)}>
                          <FaSave />
                        </button>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(game.id)}>
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDelete(game.id)}>
                            <FaTrash />
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
  );
};

export default GamesTable;
