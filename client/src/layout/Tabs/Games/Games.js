import React, { useState } from "react";
import GamesTable from "../../Tables/Games/Games";
import GamesOptionsTable from "../../Tables/GamesOptions/GamesOptions";
import GamesRelTable from "../../Tables/GamesRel/GamesRel";
import "./Games.css";

const TabsGames = () => {
  const [activeTab, setActiveTab] = useState("games");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="tabs">
        <button
          className={`tabs-button ${activeTab === "games" ? "active" : ""}`}
          onClick={() => handleTabChange("games")}
        >
          Jogos
        </button>
        <button
          className={`tabs-button ${activeTab === "gameOptions" ? "active" : ""}`}
          onClick={() => handleTabChange("gameOptions")}
        >
          Tipos de Jogos
        </button>
        <button
          className={`tabs-button ${activeTab === "gamesrel" ? "active" : ""}`}
          onClick={() => handleTabChange("gamesrel")}
        >
          Associar
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "games" && <GamesTable />}
        {activeTab === "gameOptions" && <GamesOptionsTable />}
        {activeTab === "gamesrel" && <GamesRelTable />}
      </div>
    </div>
  );
};


export default TabsGames;
