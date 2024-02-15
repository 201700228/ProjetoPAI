import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Victories.css";

const LeaderboardVTable = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/leaderboards/victories"
        );
        setLeaderboard(response.data);
      } catch (error) {
        toast.error("Error fetching data from the API", {
          className: "toast-error",
        });
      }
    };
    fetchLeaderboard();
  }, []);

  const filteredLeaderboard = leaderboard.filter((entry) => {
    const gameName = entry.Game.name.toLowerCase();
    const username = entry.User.username.toLowerCase();
    const filterLowercase = filter.toLowerCase();

    return (
      gameName.includes(filterLowercase) || username.includes(filterLowercase)
    );
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIndicator = (column) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? " ▲" : " ▼";
    }
    return "";
  };

  const sortedLeaderboard = [...filteredLeaderboard].sort((a, b) => {
    const columnA = a[sortColumn];
    const columnB = b[sortColumn];

    if (columnA < columnB) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (columnA > columnB) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  return (
    <div>
      <div className="topDiv">
        <div></div>
        <div className="searchContainer">
          <input
            type="text"
            placeholder="Filter by user or game ..."
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
              <th>Game</th>
              <th>User</th>
              <th onClick={() => handleSort("victories")}>
                Victories{getSortIndicator("victories")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedLeaderboard.map((entry, index) => (
              <tr key={index}>
                <td>{entry.Game.name}</td>
                <td>{entry.User.username}</td>
                <td>{entry.victories}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardVTable;
