import React, {createContext, useContext, useState, useEffect} from 'react';
import api from '../api';
import {simpleFetch} from '../utils';

const DartContext = createContext();

export const useDartContext = () =>
{
    const context = useContext(DartContext);
    if (!context)
    {
        throw new Error('useDartContext must be used within a DartContextProvider');
    }
    return context;
};

export const DartContextProvider = ({children}) =>
{
    const [games, setGames] = useState([]);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() =>
    {
        // Update endpoints to match Spring Boot backend (no trailing slash)
        simpleFetch("/games", setGames, setError, setLoading);
        simpleFetch("/players", setPlayers);
    }, []);

    const addGame = async (gameData) =>
    {
        try
        {
            let response;

            // Check if gameData is FormData (for requests with files)
            if (gameData instanceof FormData)
            {
                // No need to set Content-Type header, browser will set it correctly with boundary
                response = await api.post('/games/withPhoto', gameData);
            }
            else
            {
                // For JSON data without files
                response = await api.post('/games', gameData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            setGames(prevGames => [...prevGames, response.data]);

            return {success: true, data: response.data};
        }
        catch (err)
        {
            console.error('Error adding game:', err);
            return {success: false, error: err};
        }
    };

    const updateGame = async (id, gameData) =>
    {
        try
        {
            let response;

            // Check if gameData is FormData (for requests with files)
            if (gameData instanceof FormData)
            {
                response = await api.put(`/games/${id}/withPhoto`, gameData);
            }
            else
            {
                // For JSON data without files
                response = await api.put(`/games/${id}`, gameData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            // Update games state by replacing the updated game
            setGames(prevGames =>
                prevGames.map(game =>
                    game.id === id ? response.data : game
                )
            );

            return {success: true, data: response.data};
        }
        catch (err)
        {
            console.error('Error updating game:', err);
            return {success: false, error: err};
        }
    };

    const deleteGame = async (id) => {
        try {
            await api.delete(`/games/${id}`);

            // Remove the deleted game from the state
            setGames(prevGames => prevGames.filter(game => game.id !== id));

            return { success: true };
        } catch (err) {
            console.error('Error deleting game:', err);
            return { success: false, error: err };
        }
    };

    const getGameById = (id) =>
    {
        return games.find(game => game.id === id);
    };

    const contextValue = {
        games,
        players,
        loading,
        error,
        addGame,
        updateGame,
        deleteGame,
        getGameById
    };

    return (
        <DartContext.Provider value={contextValue}>
            {children}
        </DartContext.Provider>
    );
};

export default DartContext;
