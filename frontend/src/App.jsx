import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import GameCard from './components/GameCard'
import AddGamePage from './pages/AddGamePage'
import LeaderboardPage from './pages/LeaderboardPage'
import {DartContextProvider, useDartContext} from './context/DartContext'

// Main content component that uses the context
const MainContent = () =>
{
    const {games, players, loading, error} = useDartContext();

    return (
        <main className="main-content">
            <h1>Recent Dart Games</h1>

            {loading && <p className="loading-message">Loading games...</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="games-grid">
                {games.length > 0 ? (
                    games.map(game => (
                        <GameCard
                            key={game.id}
                            game={game}
                            players={players}
                        />
                    ))
                ) : !loading && (
                    <p className="no-games">No games found. Add a new game to get started!</p>
                )}
            </div>
        </main>
    );
};

function App()
{
    return (
        <DartContextProvider>
            <Router>
                <div className="app">
                    <Navbar/>
                    <Routes>
                        <Route path="/" element={<MainContent/>}/>
                        <Route path="/add-game" element={<AddGamePage/>}/>
                        <Route path="/edit-game/:id" element={<AddGamePage isEditMode={true}/>}/>
                        <Route path="/leaderboard" element={<LeaderboardPage/>}/>
                    </Routes>
                </div>
            </Router>
        </DartContextProvider>
    )
}

export default App
