import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Results.css";

const LeaderboardNTable = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("http://localhost:3001/leaderboards/");
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

    return gameName.includes(filterLowercase) || username.includes(filterLowercase);
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

  const formatDateTime = (dateTimeString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" };
    const formattedDate = new Date(dateTimeString).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  return (
    <div>
      <div className="topDiv">
        <div></div>
        <div className="searchContainer">
          <input
            type="text"
            placeholder="Filtrar por utilizador ou jogo..."
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
            <th>
              Jogo
            </th>
            <th >
              Jogador
            </th>
            <th onClick={() => handleSort("result")}>
              Resultado{getSortIndicator("result")}
            </th>
            <th onClick={() => handleSort("dateTime")}>
              Data{getSortIndicator("dateTime")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedLeaderboard.map((entry, index) => (
            <tr key={index}>
              <td>{entry.Game.name}</td>
              <td>{entry.User.username}</td>
              <td>{entry.result}</td>
              <td>{formatDateTime(entry.dateTime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default LeaderboardNTable;

