import React, { useState, useEffect } from "react"
import { useParams, useHistory } from "react-router-dom"
import { createGame, getGame, getGameTypes, updateGame } from './GameManager.js'


export const GameForm = () => {
    const history = useHistory()
    const { gameId } = useParams()
    const editGameId = parseInt(gameId)
    const [gameTypes, setGameTypes] = useState([])
    const [currentGame, setCurrentGame] = useState({
        skillLevel: 1,
        numberOfPlayers: 0,
        title: "",
        maker: "",
        gameTypeId: 0
    })

    useEffect(() => {
        getGameTypes().then(setGameTypes)
    }, [])

    useEffect(
        () => {
            if (editGameId) {
                getGame(editGameId)
                    .then((editGame) => {
                        setCurrentGame({
                            skillLevel: editGame.skill_level,
                            numberOfPlayers: editGame.number_of_players,
                            title: editGame.title,
                            maker: editGame.maker,
                            gameTypeId: editGame.game_type.id
                        })
                    })
            }
        }, [editGameId]
    )

    const changeGameState = (domEvent) => {
        const newEntry = Object.assign({}, currentGame)
        newEntry[domEvent.target.name] = domEvent.target.value
        setCurrentGame(newEntry)
    }

    const submitGame = (evt) => {
        evt.preventDefault()

        const game = {
            maker: currentGame.maker,
            title: currentGame.title,
            numberOfPlayers: parseInt(currentGame.numberOfPlayers),
            skillLevel: parseInt(currentGame.skillLevel),
            gameTypeId: parseInt(currentGame.gameTypeId)
        }

        // Send POST request to your API
        if (editGameId) {
            updateGame(game, editGameId)
                .then(() => history.push("/games"))
        } else {
            createGame(game)
                .then(() => history.push("/games"))
        }
    }

    return (
        <form className="gameForm">
            {
                editGameId
                    ? <h2 className="gameForm__title">Edit Game</h2>
                    : <h2 className="gameForm__title">Register New Game</h2>
            }

            <fieldset>
                <div className="form-group">
                    <label htmlFor="title">Title: </label>
                    <input type="text" name="title" required autoFocus className="form-control"
                        value={currentGame.title}
                        onChange={changeGameState}
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="maker">Maker: </label>
                    <input type="text" name="maker" className="form-control"
                        value={currentGame.maker}
                        onChange={changeGameState}
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="numberOfPlayers">Number of Players: </label>
                    <input type="number" name="numberOfPlayers" className="form-control"
                        value={currentGame.numberOfPlayers}
                        onChange={changeGameState}
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="skillLevel">Skill Level (1-5): </label>
                    <input type="number" name="skillLevel" className="form-control"
                        value={currentGame.skillLevel}
                        onChange={changeGameState}
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="gameTypeId">Game Type: </label>
                    <select type="number" name="gameTypeId" className="form-control"
                        value={currentGame.gameTypeId}
                        onChange={changeGameState}
                    >
                        <option value="0">Choose a type</option>
                        {
                            gameTypes.map(gameType => {
                                return <option key={gameType.id} value={gameType.id}>{gameType.label}</option>
                            })
                        }
                    </select>
                </div>
            </fieldset>
            {
                editGameId
                    ? <button type="submit"
                        onClick={submitGame}
                        className="btn btn-primary">Edit
                    </button>
                    : <button type="submit"
                        onClick={submitGame}
                        className="btn btn-primary">Create
                    </button>
            }
        </form>
    )
}