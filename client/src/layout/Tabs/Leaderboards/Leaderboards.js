import React, { useState } from "react";
import LeaderboardNTable from "../../Tables/Leaderboards/Results/Results";
import LeaderboardVTable from "../../Tables/Leaderboards/Victories/Victories";
import "./Leaderboards.css";

const TabsLeaderboards = () => {
  const [activeTab, setActiveTab] = useState("results");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="tabs">
        <button
          className={`tabs-button ${activeTab === "results" ? "active" : ""}`}
          onClick={() => handleTabChange("results")}
        >
          Pontuações
        </button>
        <button
          className={`tabs-button ${activeTab === "victories" ? "active" : ""}`}
          onClick={() => handleTabChange("victories")}
        >
          Vitórias
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "results" && <LeaderboardNTable />}
        {activeTab === "victories" && <LeaderboardVTable />}
      </div>
    </div>
  );
};

export default TabsLeaderboards;
