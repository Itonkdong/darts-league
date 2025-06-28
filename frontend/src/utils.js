import api from "./api.js";

export const simpleFetch = async (endpoint, responseSetter = null, errorSetter = null, loadingSetter = null) =>
{
    try
    {
        if (loadingSetter) loadingSetter(true);
        const response = await api.get(endpoint);
        if (responseSetter) responseSetter(response.data);
    } catch (err)
    {
        if (errorSetter) errorSetter('Failed to fetch games. Please try again later.');
        console.error('Error fetching games:', err);
    } finally
    {
        if (loadingSetter) loadingSetter(false);
    }
};

export const getPlayerMap = (playerList) =>
{
    const playerMap = {}
    for (const playerObj of playerList)
    {
        playerMap[playerObj.id] = playerObj
    }
    return playerMap
};