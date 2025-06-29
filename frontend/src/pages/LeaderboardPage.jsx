import React, {useState} from 'react';
import {useDartContext} from '../context/DartContext';
import '../styles/LeaderboardPage.css';

const LeaderboardPage = () =>
{
    const {players} = useDartContext();
    const [sortCriteria, setSortCriteria] = useState('points');

    // Sorting options
    const sortOptions = [
        {value: 'points', label: 'Total Points'},
        {value: 'wins', label: 'Wins'},
        {value: 'gamesWonByClearing', label: 'Wins by Clearing'},
        {value: 'gamesWonByEndOfRounds', label: 'Wins by End of Rounds'},
        {value: 'highestScore', label: 'Highest Score'}
    ];

    // Sort players based on selected criteria
    const sortedPlayers = [...players].sort((a, b) => b[sortCriteria] - a[sortCriteria]);

    // Separate top 3 and rest of players
    const topThree = sortedPlayers.slice(0, 3);
    const restOfPlayers = sortedPlayers.slice(3);

    // Group rest of players into rows of 4
    const rows = [];
    for (let i = 0; i < restOfPlayers.length; i += 4)
    {
        rows.push(restOfPlayers.slice(i, i + 4));
    }

    // Render a player card with all details
    const renderPlayerCard = (player, rank) =>
    {
        // Default image if no photo available
        const photoUrl = player.photoPath
            ? `${player.photoPath}`
            : `/uploads/player_photos/delfina.png`;

        return (
            <div className={`player-card ${rank <= 3 ? `rank-${rank}` : ''}`} key={player.id}>
                <div className="rank-badge">{rank}</div>
                <div className="player-photo-container">
                    <img src={photoUrl} alt={`${player.name} ${player.surname}`} className="player-photo"/>
                </div>
                <div className="player-details">
                    <h3>{player.name} {player.surname}</h3>
                    <p className="player-index">{player.index}</p>
                    <div className="player-zodiac">
                        <span className="zodiac-badge">{player.zodiacSign}</span>
                    </div>
                    <div className="player-stats">
                        <div className="stat-item">
                            <span className="stat-label">Points:</span>
                            <span className="stat-value">{player.points}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Wins:</span>
                            <span className="stat-value">{player.wins}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Highest:</span>
                            <span className="stat-value">{player.highestScore}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">By Clearing:</span>
                            <span className="stat-value">{player.gamesWonByClearing}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">End of Rounds:</span>
                            <span className="stat-value">{player.gamesWonByEndOfRounds}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="leaderboard-container">
            <h1>Darts League Leaderboard</h1>

            <div className="sort-controls">
                <label htmlFor="sort-criteria">Sort By:</label>
                <select
                    id="sort-criteria"
                    value={sortCriteria}
                    onChange={(e) => setSortCriteria(e.target.value)}
                >
                    {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {topThree.length > 0 && (
                <div className="top-three-podium">
                    {/* Place 2 */}
                    <div className="podium-position second-place">
                        {topThree.length > 1 && renderPlayerCard(topThree[1], 2)}
                    </div>

                    {/* Place 1 */}
                    <div className="podium-position first-place">
                        {renderPlayerCard(topThree[0], 1)}
                    </div>

                    {/* Place 3 */}
                    <div className="podium-position third-place">
                        {topThree.length > 2 && renderPlayerCard(topThree[2], 3)}
                    </div>
                </div>
            )}

            {rows.length > 0 && (
                <div className="remaining-players">
                    <h2>Other Players</h2>
                    {rows.map((row, rowIndex) => (
                        <div key={rowIndex} className="players-row">
                            {row.map((player, playerIndex) =>
                                renderPlayerCard(player, 4 + rowIndex * 4 + playerIndex)
                            )}
                        </div>
                    ))}
                </div>
            )}

            {players.length === 0 && (
                <div className="no-players-message">
                    <p>No players found. Add players to see the leaderboard.</p>
                </div>
            )}
        </div>
    );
};

export default LeaderboardPage;
