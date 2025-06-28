import React, {useState, useEffect} from 'react';
import '../styles/AddGamePage.css';
import {useDartContext} from '../context/DartContext';
import {useNavigate, useParams} from 'react-router-dom';

const AddGamePage = ({isEditMode}) =>
{
    const {players, addGame, updateGame, getGameById} = useDartContext();
    const navigate = useNavigate();
    const {id: gameId} = useParams();

    const [gameType, setGameType] = useState('501');
    const [datePlayed, setDatePlayed] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [wonByClearing, setWonByClearing] = useState(false);
    const [highestScore, setHighestScore] = useState(0);
    const [winnerPhoto, setWinnerPhoto] = useState(null);
    const [playerCount, setPlayerCount] = useState(2);

    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [playerScores, setPlayerScores] = useState({});
    const [winner, setWinner] = useState('');
    const [highestScorePlayer, setHighestScorePlayer] = useState('');
    const [pageTitle, setPageTitle] = useState('Add New Dart Game');
    const [submitButtonText, setSubmitButtonText] = useState('Add Game');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [savePhotoPath, setSavePhotoPath] = useState("")

    // Load game data if in edit mode
    useEffect(() =>
    {
        if (isEditMode && gameId)
        {
            // Force a page refresh in edit mode to ensure proper data loading
            if (!window.location.search.includes('refreshed')) {
                window.location.href = window.location.href + '?refreshed=true';
                return;
            }

            setPageTitle('Edit Dart Game');
            setSubmitButtonText('Update Game');

            const gameToEdit = getGameById(gameId);
            console.log(gameToEdit)
            if (gameToEdit)
            {
                // Set form fields with game data
                setSavePhotoPath(gameToEdit.winnerPhotoPath ? gameToEdit.winnerPhotoPath : "")
                setGameType(gameToEdit.gameType || '501');
                setDatePlayed(gameToEdit.datePlayed ? gameToEdit.datePlayed.split('T')[0] : new Date().toISOString().split('T')[0]);
                setDescription(gameToEdit.description || '');
                setWonByClearing(gameToEdit.wonByClearing || false);
                setHighestScore(gameToEdit.highestScore || 0);

                // Set selected players and scores
                if (gameToEdit.players && gameToEdit.players.length > 0)
                {
                    const gamePlayers = gameToEdit.players.map(p => p.id);
                    // Set scores
                    if (gameToEdit.scores)
                    {
                        setPlayerScores(gameToEdit.scores);
                    }

                    setSelectedPlayers(gamePlayers);
                    setPlayerCount(gamePlayers.length);
                    console.log("scores", gameToEdit.scores)

                }

                // Set winner and highest score player
                if (gameToEdit.winner && gameToEdit.winner.id)
                {
                    setWinner(gameToEdit.winner.id);
                }

                if (gameToEdit.highestScorePlayer && gameToEdit.highestScorePlayer.id)
                {
                    setHighestScorePlayer(gameToEdit.highestScorePlayer.id);
                }
            }
        }
    }, [isEditMode, gameId, getGameById]);

    useEffect(() =>
    {
        setSelectedPlayers(prev =>
        {
            const newArray = [...prev];
            if (newArray.length > playerCount)
            {
                return newArray.slice(0, playerCount);
            }
            else if (newArray.length < playerCount)
            {
                return [...newArray, ...Array(playerCount - newArray.length).fill('')];
            }
            return newArray;
        });
    }, [playerCount]);

    // Update score object when selected players change
    useEffect(() =>
    {
        const newScores = {};
        selectedPlayers.forEach((playerId) =>
        {
            if (playerId)
            {
                newScores[playerId] = playerScores[playerId] || 0;
            }
        });
        setPlayerScores(newScores);
    }, [selectedPlayers]);

    const gameTypeOptions = [
        '180', '501', '301', 'Cricket', 'Around the Clock',
        'Shanghai', 'Killer', 'Baseball', 'Count Up', 'Halve It', 'Bob\'s 27'
    ];

    // Handle player selection
    const handlePlayerChange = (index, playerId) =>
    {
        setSelectedPlayers(prev =>
        {
            const updated = [...prev];
            updated[index] = playerId;
            return updated;
        });
    };

    // Handle score change
    const handleScoreChange = (playerId, score) =>
    {
        setPlayerScores(prev => ({
            ...prev,
            [playerId]: parseInt(score)
        }));
    };

    // Handle highest score change
    const handleHighestScoreChange = (value) =>
    {
        setHighestScore(parseInt(value) || 0);
    };

    // Handle file input change
    const handleFileChange = (e) =>
    {
        setWinnerPhoto(e.target.files[0]);
    };

    // Form submission handler
    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validate form data
        if (!winner)
        {
            setError('Please select a winner');
            setLoading(false);
            return;
        }

        if (!highestScorePlayer)
        {
            setError('Please select the player with the highest score');
            setLoading(false);
            return;
        }

        if (!highestScore || highestScore <= 0)
        {
            setError('Please enter a valid highest achieved score');
            setLoading(false);
            return;
        }

        // Filter out any empty player slots
        const validPlayers = selectedPlayers.filter(id => id);
        const validPlayerObjects = validPlayers.map(id => ({
            id: id
        }));

        // Create scores object with player IDs as keys
        const validScores = {};
        validPlayers.forEach(id =>
        {
            validScores[id] = playerScores[id] || 0;
        });

        // Prepare data for Spring Boot backend (JSON format for most data)
        const gameData = {
            gameType: gameType,
            numPlayers: validPlayers.length,
            players: validPlayerObjects,
            scores: validScores,
            winner: {
                id: winner
            },
            wonByClearing: wonByClearing,
            datePlayed: datePlayed,
            description: description,
            highestScore: highestScore,
            highestScorePlayer: {
                id: highestScorePlayer
            }
        };

        try
        {
            let result;

            if (winnerPhoto)
            {
                // If there's a photo, we need to use FormData
                const formData = new FormData();
                // Append gameData as a string
                formData.append('gameData', JSON.stringify(gameData));
                formData.append('winnerPhoto', winnerPhoto);

                // Use either addGame or updateGame based on mode
                if (isEditMode && gameId)
                {
                    result = await updateGame(gameId, formData);
                }
                else
                {
                    result = await addGame(formData);
                }
            }
            else
            {
                // No photo, use JSON directly
                if (isEditMode && gameId)
                {
                    if (savePhotoPath)
                    {
                        gameData.winnerPhotoPath = savePhotoPath
                    }
                    result = await updateGame(gameId, gameData);
                }
                else
                {
                    result = await addGame(gameData);
                }
            }

            if (result.success)
            {
                setSuccess(isEditMode ? 'Game updated successfully!' : 'Game added successfully!');
                // Reset form
                setGameType('501');
                setDatePlayed(new Date().toISOString().split('T')[0]);
                setDescription('');
                setWonByClearing(false);
                setHighestScore(0);
                setWinnerPhoto(null);
                setPlayerCount(2);
                setSelectedPlayers(Array(2).fill(''));
                setPlayerScores({});
                setWinner('');
                setHighestScorePlayer('');

                // Navigate back to home after a successful addition/update, after a short delay
                setTimeout(() =>
                {
                    navigate('/');
                }, 2000);
            }
            else
            {
                setError(isEditMode ? 'Failed to update game. Please check your input and try again.' : 'Failed to add game. Please check your input and try again.');
            }
        }
        catch (err)
        {
            console.error(isEditMode ? 'Error updating game:' : 'Error adding game:', err);
            setError(isEditMode ? 'Failed to update game. Please check your input and try again.' : 'Failed to add game. Please check your input and try again.');
        }
        finally
        {
            setLoading(false);
        }
    };

    return (
        <div className="add-game-container">
            <h1>{pageTitle}</h1>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit} className="add-game-form">
                {/* Game type and basic info */}
                <div className="form-group">
                    <label htmlFor="gameType">Game Type:</label>
                    <select
                        id="gameType"
                        value={gameType}
                        onChange={(e) => setGameType(e.target.value)}
                        required
                    >
                        {gameTypeOptions.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="datePlayed">Date Played:</label>
                    <input
                        type="date"
                        id="datePlayed"
                        value={datePlayed}
                        onChange={(e) => setDatePlayed(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="playerCount">Number of Players:</label>
                    <select
                        id="playerCount"
                        value={playerCount}
                        onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                        required
                    >
                        {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>

                {/* Players and ending scores section */}
                <div className="players-container form-group">
                    <h3>Players & Ending Scores</h3>
                    <p className="score-explanation">Enter the final score for each player at the end of the game (lower
                        is better, 0 is perfect)</p>
                    {selectedPlayers.map((selectedId, index) => (
                        <div key={index} className="player-score-row">
                            <div className="player-select">
                                <label htmlFor={`player-${index}`}>Player {index + 1}:</label>
                                <select
                                    id={`player-${index}`}
                                    value={selectedId}
                                    onChange={(e) => handlePlayerChange(index, e.target.value)}
                                    required
                                >
                                    <option value="">Select a player</option>
                                    {players.map((player) => (
                                        <option key={player.id} value={player.id}>
                                            {player.name} {player.surname} ({player.zodiacSign})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedId && (
                                <div className="score-input">
                                    <label htmlFor={`score-${index}`}>Ending Score:</label>
                                    <input
                                        type="number"
                                        id={`score-${index}`}
                                        value={playerScores[selectedId] || 0}
                                        onChange={(e) => handleScoreChange(selectedId, e.target.value)}
                                        min="0"
                                        required
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Highest throw score section */}
                <div className="highest-score-section">
                    <h3>Best Throwing Score</h3>
                    <p className="score-explanation">Enter the highest score achieved in a single throw during this
                        game</p>

                    <div className="form-group">
                        <label htmlFor="highestScore">Highest Achieved Score:</label>
                        <input
                            type="number"
                            id="highestScore"
                            value={highestScore}
                            onChange={(e) => handleHighestScoreChange(e.target.value)}
                            min="1"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="highestScorePlayer">Player with Highest Throw:</label>
                        <select
                            id="highestScorePlayer"
                            value={highestScorePlayer}
                            onChange={(e) => setHighestScorePlayer(e.target.value)}
                            required
                        >
                            <option value="">Select Player</option>
                            {selectedPlayers.map((playerId) =>
                            {
                                if (!playerId) return null;
                                const player = players.find(p => p.id.toString() === playerId.toString());
                                return player ? (
                                    <option key={player.id} value={player.id}>
                                        {player.name} {player.surname}
                                    </option>
                                ) : null;
                            })}
                        </select>
                    </div>
                </div>

                {/* Winner and game info */}
                <div className="form-group">
                    <label htmlFor="winner">Winner:</label>
                    <select
                        id="winner"
                        value={winner}
                        onChange={(e) => setWinner(e.target.value)}
                        required
                    >
                        <option value="">Select Winner</option>
                        {selectedPlayers.map((playerId) =>
                        {
                            if (!playerId) return null;
                            const player = players.find(p => p.id.toString() === playerId.toString());
                            return player ? (
                                <option key={player.id} value={player.id}>
                                    {player.name} {player.surname}
                                </option>
                            ) : null;
                        })}
                    </select>
                </div>

                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={wonByClearing}
                            onChange={(e) => setWonByClearing(e.target.checked)}
                        />
                        Won by Clearing
                    </label>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Game Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="winnerPhoto">{isEditMode ? 'Update Winner Photo:' : 'Winner Photo:'}</label>
                    <input
                        type="file"
                        id="winnerPhoto"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {isEditMode && (
                        <p className="photo-note">Leave empty to keep the current photo.</p>
                    )}
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="submit-button">
                        {loading ? (isEditMode ? 'Updating Game...' : 'Adding Game...') : submitButtonText}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="cancel-button"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddGamePage;
