import React, {useState} from 'react';
import '../styles/GameCard.css';
import {getPlayerMap} from '../utils.js';
import {useNavigate} from 'react-router-dom';
import {useDartContext} from '../context/DartContext';

const GameCard = ({game, players}) =>
{
    const {deleteGame} = useDartContext();
    const [playerMap, setPlayerMap] = useState(getPlayerMap(players));
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Extract important information from the game
    const {
        id,
        gameType,
        datePlayed,
        winner,
        highestScore,
        highestScorePlayer,
        winnerPhotoPath,
        numPlayers,
        description,
        wonByClearing,
        scores
    } = game;

    // Format date for better display
    const formattedDate = new Date(datePlayed).toLocaleDateString();

    // Handle edit button click
    const handleEditClick = () =>
    {
        navigate(`/edit-game/${id}`);
    };

    // Handle delete button click
    const handleDeleteClick = () =>
    {
        setShowDeleteConfirm(true);
    };

    // Handle delete confirmation
    const handleConfirmDelete = async () =>
    {
        setIsDeleting(true);
        try
        {
            const result = await deleteGame(id);
            if (result.success)
            {
                // Game deleted successfully
                setShowDeleteConfirm(false);
            }
            else
            {
                alert("Failed to delete the game. Please try again.");
            }
        }
        catch (error)
        {
            console.error("Error deleting game:", error);
            alert("An error occurred while deleting the game.");
        }
        finally
        {
            setIsDeleting(false);
        }
    };

    // Handle cancel delete
    const handleCancelDelete = () =>
    {
        setShowDeleteConfirm(false);
    };

    return (
        <div className="game-card">
            {showDeleteConfirm && (
                <div className="delete-confirmation-modal">
                    <div className="delete-confirmation-content">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this game?</p>
                        <p>This action cannot be undone.</p>
                        <div className="delete-confirmation-buttons">
                            <button
                                className="cancel-button"
                                onClick={handleCancelDelete}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                className="delete-confirm-button"
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="game-card-header">
                <div className={"game-type"}>{gameType}</div>
                <div className="header-main-content">
                    <h3>{winner?.name} {winner?.surname}</h3>
                    <span className="zodiac-badge">{winner?.zodiacSign}</span>
                </div>
                <div className="header-sub-content">
                    <p className="game-date">{formattedDate}</p>
                    <span className="players-count">{numPlayers} players</span>
                </div>
            </div>

            <div className="game-card-content">
                <img
                    src={winnerPhotoPath ? `${winnerPhotoPath}` : "https://www.it-labs.com/wp-content/uploads/2020/09/fb.jpg"}
                    alt="Winner"
                    className="winner-photo"
                />

                <div className="game-details">
                    <p><strong>Highest Score:</strong> {highestScore} by {highestScorePlayer?.name}</p>
                    <p><strong>Victory Type:</strong> {wonByClearing ? 'Clearing' : 'End of Rounds'}</p>
                    {description && <p className="game-description">{description}</p>}


                </div>

                <div className="player-scores">
                    <h4>Player Scores</h4>
                    <div className="scores-container">
                        {scores && Object.entries(scores).map(([playerId, score]) =>
                        {
                            const player = players.find(p => p.id === playerId);
                            return (
                                <div key={playerId} className="player-score-item">
                                    <span className="player-name">
                                        {player?.name || 'Unknown'} {player?.surname || 'Player'}:
                                    </span>
                                    <span className={`score ${winner?.id === playerId ? 'winner-score' : ''}`}>
                                        {score} points
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="game-actions">
                        <button className="edit-button" onClick={handleEditClick}>
                            Edit Game
                        </button>
                        <button className="delete-button" onClick={handleDeleteClick}>
                            Delete Game
                        </button>
                    </div>
            </div>
        </div>
    );
};

export default GameCard;
