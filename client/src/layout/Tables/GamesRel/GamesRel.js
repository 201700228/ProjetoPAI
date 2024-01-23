import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTimes } from "react-icons/fa";
import "./GamesRel.css";

const GamesRelTable = () => {
  const [games, setGames] = useState([]);
  const [allGameOptions, setAllGameOptions] = useState([]);
  const [filter, setFilter] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingGame, setEditingGame] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [currentOption, setCurrentOption] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/games/list",
          {}
        );
        setGames(response.data);
      } catch (error) {
        console.error("Erro ao obter dados da API:", error);
      }
    };

    const fetchGameOptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/game-options/list"
        );
        setAllGameOptions(response.data);
      } catch (error) {
        console.error("Erro ao obter dados da API:", error);
      }
    };

    fetchGameOptions();
    fetchGames();
  }, []);

  const handleEdit = (id) => {
    const gameToEdit = games.find((game) => game.id === id);
    setEditingGame(gameToEdit);
    setEditMode(id);
    setShowModal(true);
  };

  useEffect(() => {
    // Este useEffect será chamado sempre que currentOption mudar
    handleAddOption(currentOption);
  }, [currentOption]);

  const handleAddOption = (option) => {
    if (option && !selectedOptions.includes(option)) {
      setSelectedOptions((prevOptions) => [...prevOptions, option]);
      setCurrentOption("");
    }
  };

  const handleRemoveOption = (optionToRemove) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.filter((option) => option !== optionToRemove)
    );
  };

  return (
    <div>
      <div className="topDivGamesRel">
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
                  onChange={(e) => setCurrentOption(e.target.value)}
                >
                  <option value="">Selecione uma opção...</option>
                  {allGameOptions.map((option) => (
                    <option key={option.id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>

                {selectedOptions.map((option, index) => (
                  <div className="options-selected-div">
                    <span className="option-selected" key={index}>
                      {option}
                      <button
                        className="remove-option"
                        onClick={() => handleRemoveOption(option)}
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
      )}
    </div>
  );
};

export default GamesRelTable;
