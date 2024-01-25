import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaSave, FaPlus, FaTimes } from "react-icons/fa";
import "./GamesOptions.css";
import { toast } from "react-toastify";

const GamesOptionsTable = () => {
  const [gameOptions, setGameOptions] = useState([]);
  const [newGameOption, setNewGameOption] = useState({
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
    const fetchGameOptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/game-options/list",
          {}
        );
        setGameOptions(response.data);
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
    fetchGameOptions();
  }, []);

  const handleEdit = (id) => {
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
      setGameOptions((prevOptions) =>
        prevOptions.filter((option) => option.id !== id)
      );
      setLastId((prevLastId) => (id === prevLastId ? id - 1 : prevLastId));
      setEditMode(null);
      setFilter("");
      setNewGameOption({
        id: null,
        name: "",
        description: "",
        picture: null,
        isEditing: false,
        isNew: false,
      });
      toast.success("Game option successfully removed.", {
        className: "toast-success",
      });
    } catch (error) {
      toast.error("Error deleting the game option.", {
        className: "toast-error",
      });
    }
  };

  const handleAdd = () => {
    const newId = lastId + 1;
    const newGameOption = {
      id: newId,
      name: "",
      description: "",
      picture: null,
      isNew: true,
    };
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
      let savedGameOption;
      const formData = new FormData();
      formData.append("name", newGameOption.name);
      formData.append("description", newGameOption.description);
      formData.append("picture", newGameOption.picture);

      if (newGameOption.isNew) {
        const response = await axios.post(
          "http://localhost:3001/game-options/add",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success("Game option successfully created.", {
          className: "toast-success",
        });

        savedGameOption = response.data;
      } else if (newGameOption.id !== null && newGameOption.isEditing) {
        const response = await axios.put(
          `http://localhost:3001/game-options/update/${newGameOption.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success("Game option successfully updated.", {
          className: "toast-success",
        });
        savedGameOption = response.data;
      } else {
        toast.error("Cannot save a new game option that hasn't been edited.", {
          className: "toast-error",
        });
        return;
      }

      setGameOptions((prevGameOptions) => [
        ...prevGameOptions.slice(0, index),
        savedGameOption,
        ...prevGameOptions.slice(index + 1),
      ]);

      setEditMode(null);
      setFilter("");
      setNewGameOption({
        id: null,
        name: "",
        description: "",
        picture: savedGameOption.picture,
        isEditing: false,
        isNew: false,
      });
    } catch (error) {
      console.error("Error saving the game option:", error);
    }
  };

  const isEditing = (optionId) => editMode === optionId;

  const handleAddImage = () => {
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = "image/*";

    inputElement.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const updatedGame = {
          ...newGameOption,
          picture: file,
        };
        setNewGameOption(updatedGame);
      }
    });

    inputElement.click();
  };

  const handleDeleteImage = () => {
    setNewGameOption({ ...newGameOption, picture: null });
  };

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

      <div className="tableContainer">
      <table className="gamesList">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Imagem</th>
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
                <td>
                  <input
                    type="text"
                    value={
                      isEditing(option.id) ? newGameOption.name : option.name
                    }
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
                  {isEditing(option.id) ? (
                    <>
                      <div
                        className={`imagePreview ${
                          newGameOption.picture ? "added-image" : ""
                        }`}
                      >
                        {newGameOption.picture ? (
                          <>
                            <img src={option.picture} alt="Imagem" />
                            <button
                              style={{ marginLeft: "10px" }}
                              onClick={() =>
                                handleDeleteImage(newGameOption.id)
                              }
                            >
                              <FaTimes />
                            </button>
                          </>
                        ) : (
                          <button onClick={handleAddImage}>
                            <FaPlus />
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    option.picture && <img src={option.picture} alt="Imagem" />
                  )}
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
                          <button
                            onClick={() => handleEdit(option.id)}
                            style={{ marginTop: "5px" }}
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(option.id)}
                            style={{ marginTop: "5px" }}
                          >
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
    </div>
  );
};

export default GamesOptionsTable;
