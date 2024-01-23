import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaSave, FaPlus } from "react-icons/fa";
import "./GamesOptions.css";

const GamesOptionsTable = () => {
  const [gameOptions, setGameOptions] = useState([]);
  const [newGameOption, setNewGameOption] = useState({
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
    const fetchGameOptions = async () => {
      try {
        const response = await axios.get("http://localhost:3001/game-options/list", {});
        setGameOptions(response.data);
        setLastId(
          response.data.length > 0
            ? response.data[response.data.length - 1].id
            : 0
        );
      } catch (error) {
        console.error("Erro ao obter dados da API:", error);
      }
    };
    fetchGameOptions();
  }, []);

  const handleEdit = (id) => {
    console.log(`Editar opção de jogo com ID ${id}`);
    setEditMode(id);
    setNewGameOption({
      ...gameOptions.find((option) => option.id === id),
      isEditing: true,
      isNew: false,
    });
  };

  const handleDelete = async (id) => {
    try {
      if (id !== null) {
        await axios.delete(`http://localhost:3001/game-options/option/${id}`);
      }
      setGameOptions((prevOptions) => prevOptions.filter((option) => option.id !== id));
      setLastId((prevLastId) => (id === prevLastId ? id - 1 : prevLastId));
      setEditMode(null);
      setFilter("");
      setNewGameOption({
        id: null,
        name: "",
        description: "",
        isEditing: false,
        isNew: false,
      });
    } catch (error) {
      console.error("Erro ao excluir a opção de jogo:", error);
    }
  };

  const handleAdd = () => {
    const newId = lastId + 1;
    const newGameOption = { id: newId, name: "", description: "", isNew: true };
    setGameOptions([...gameOptions, newGameOption]);
    setLastId(newId);
    setEditMode(newId);
    setFilter(""); 
    setNewGameOption({
      ...newGameOption,
      isEditing: true,
    });
  };

  const handleSave = async (index) => {
    try {
      if (newGameOption.isNew) {
        const response = await axios.post(
          "http://localhost:3001/game-options/add",
          newGameOption
        );
        setGameOptions([...gameOptions.slice(0, index), response.data, ...gameOptions.slice(index + 1)]);
      } else if (newGameOption.id !== null && newGameOption.isEditing) {
        const response = await axios.put(
          `http://localhost:3001/game-options/update/${newGameOption.id}`,
          newGameOption
        );
        setGameOptions([...gameOptions.slice(0, index), response.data, ...gameOptions.slice(index + 1)]);
      } else {
        console.warn("Não é possível salvar uma nova opção que não foi editada.");
      }

      setEditMode(null);
      setFilter(""); 
      setNewGameOption({
        id: null,
        name: "",
        description: "",
        isEditing: false,
        isNew: false,
      });
    } catch (error) {
      console.error("Erro ao salvar a opção de jogo:", error);
    }
  };

  const isEditing = (optionId) => editMode === optionId;

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
          {gameOptions
            .filter((option) =>
              option.name.toLowerCase().includes(filter.toLowerCase())
            )
            .map((option, index) => (
              <tr key={index}>
                <td>{option.id}</td>
                <td>
                  <input
                    type="text"
                    value={isEditing(option.id) ? newGameOption.name : option.name}
                    onChange={(e) => {
                      const updatedGameOption = {
                        ...newGameOption,
                        name: e.target.value,
                      };
                      setNewGameOption(updatedGameOption);
                    }}
                    readOnly={editMode !== option.id}
                    style={{
                      border:
                        editMode === option.id ? "1px solid #FFFE01" : "none",
                    }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={
                      isEditing(option.id)
                        ? newGameOption.description
                        : option.description
                    }
                    onChange={(e) => {
                      const updatedGameOption = {
                        ...newGameOption,
                        description: e.target.value,
                      };
                      setNewGameOption(updatedGameOption);
                    }}
                    readOnly={editMode !== option.id}
                    style={{
                      border:
                        editMode === option.id ? "1px solid #FFFE01" : "none",
                    }}
                  />
                </td>
                <td>
                  {option.id && (
                    <>
                      {isEditing(option.id) ? (
                        <button onClick={() => handleSave(index)}>
                          <FaSave />
                        </button>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(option.id)}>
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDelete(option.id)}>
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

export default GamesOptionsTable;
