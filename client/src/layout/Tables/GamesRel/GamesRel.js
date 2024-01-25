import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTimes } from "react-icons/fa";
import "./GamesRel.css";
import { toast } from "react-toastify";

const GamesRelTable = () => {
  const [games, setGames] = useState([]);
  const [allGameOptions, setAllGameOptions] = useState([]);
  const [filter, setFilter] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingGame, setEditingGame] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [currentOption, setCurrentOption] = useState("");
  const [gameOptionsRel, setGameOptionsRel] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/games/list",
          {}
        );
        setGames(response.data);
      } catch (error) {
        toast.error("Error fetching game data from the API", {
          className: "toast-error",
        });
      }
    };

    const fetchGameOptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/game-options/list"
        );
        setAllGameOptions(response.data);
      } catch (error) {
        toast.error("Error fetching game options data from the API", {
          className: "toast-error",
        });
      }
    };

    fetchGameOptions();
    fetchGames();
  }, []);

  const handleEdit = async (id) => {
    const gameToEdit = games.find((game) => game.id === id);
    setEditingGame(gameToEdit);
    setEditMode(id);
    setShowModal(true);

    try {
      const response = await axios.get(
        `http://localhost:3001/game-options-rel/game/${id}`
      );
      setGameOptionsRel(response.data);
    } catch (error) {
      toast.error("Error fetching game associated options data from the API", {
        className: "toast-error",
      });
    }
  };

  const handleSelectChange = (e) => {
    const selectedOption = e.target.value;
    setCurrentOption(selectedOption);

    if (editingGame.id) {
      const gameOptionId = allGameOptions.find(
        (gameOption) => gameOption.name === selectedOption
      )?.id;

      if (gameOptionId) {
        handleAddOption(editingGame.id, gameOptionId);
      }
    }
  };

  const handleAddOption = async (gameId, gameOptionId) => {
    try {
      await axios.post(`http://localhost:3001/game-options-rel`, {
        GameId: gameId,
        GameOptionId: gameOptionId,
      });

      toast.success("Game option association successfully added.", {
        className: "toast-success",
      });

      const response = await axios.get(
        `http://localhost:3001/game-options-rel/game/${gameId}`
      );
      setGameOptionsRel(response.data);

      setSelectedOptions((prevOptions) => [...prevOptions, currentOption]);
      setCurrentOption("");
    } catch (error) {
      toast.error("Error adding game associated options data from the API", {
        className: "toast-error",
      });
    }
  };

  const handleRemoveOption = async (optionId) => {
    try {
      await axios.delete(
        `http://localhost:3001/game-options-rel/game/${editingGame.id}/option/${optionId}`
      );

      
      toast.success("Game option association successfully removed.", {
        className: "toast-success",
      });

      const response = await axios.get(
        `http://localhost:3001/game-options-rel/game/${editingGame.id}`
      );
      setGameOptionsRel(response.data);

      setSelectedOptions((prevOptions) =>
        prevOptions.filter((option) => option.id !== optionId)
      );
    } catch (error) {
      toast.error("Error removing game associated options data from the API", {
        className: "toast-error",
      });
    }
  };

  return (
    <div>
      <div className="topDiv">
        <div></div>
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

      <div className="tableContainer">
      <table className="gamesList">
        <thead>
          <tr>
            <th>Nome</th>
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
                <td>{game.name}</td>
                <td>
                  {game.id && (
                    <>
                      <button onClick={() => handleEdit(game.id)}>
                        <FaEdit />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      </div>

      {showModal && (
        <div
          className="modal"
          style={{ display: showModal ? "block" : "none" }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h2>Editar</h2>
              <span className="close" onClick={() => setShowModal(false)}>
                &times;
              </span>
            </div>
            <div className="modal-body">
              <div>
                <select
                  id="gameOptions"
                  value={currentOption}
                  onChange={handleSelectChange}
                >
                  <option value="">Selecione uma opção...</option>
                  {allGameOptions.map((option) => (
                    <option key={option.id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>

                <div className="selected-options">
                  {gameOptionsRel.map((option, index) => (
                    <div className="options-selected-div" key={index}>
                      <span className="option-selected">
                        {option.GameOption.name}
                        <button
                          className="remove-option"
                          onClick={() =>
                            handleRemoveOption(option.GameOption.id)
                          }
                        >
                          <FaTimes />
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamesRelTable;
