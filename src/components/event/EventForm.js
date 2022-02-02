import React, { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom'
import { getGames } from "../game/GameManager.js"
import { createEvent } from "./EventManager.js"


export const EventForm = () => {
    const history = useHistory()
    const [games, setGames] = useState([])
    const [currentEvent, setCurrentEvent] = useState({
        description: "",
        gameId: 0,
        date: "",
        time: ""
    })

    useEffect(() => {
        getGames().then(setGames)
    }, [])

    const changeEventState = (domEvent) => {
        const newEntry = Object.assign({}, currentEvent)
        newEntry[domEvent.target.name] = domEvent.target.value
        setCurrentEvent(newEntry)
    }

    return (
        <form className="eventForm">
            <h2 className="eventForm__title">Register New Event</h2>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="description">Description: </label>
                    <textarea type="textarea" name="description" required autoFocus className="form-control"
                        value={currentEvent.description}
                        onChange={changeEventState}
                    ></textarea>
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="gameId">Game you'll play: </label>
                    <select type="number" name="gameId" className="form-control"
                        value={currentEvent.gameId}
                        onChange={changeEventState}
                    >
                        <option value="0">Choose a game</option>
                        {
                            games.map(game => {
                                return <option key={game.id} value={game.id}>{game.title}</option>
                            })
                        }
                    </select>
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="date">Event Date </label>
                    <input type="date" name="date" className="form-control"
                        value={currentEvent.date}
                        onChange={changeEventState}
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="time">Event Time </label>
                    <input type="time" name="time" className="form-control"
                        value={currentEvent.time}
                        onChange={changeEventState}
                    />
                </div>
            </fieldset>
            <button type="submit"
                onClick={evt => {
                    // Prevent form from being submitted
                    evt.preventDefault()

                    const event = {
                        description: currentEvent.description,
                        date: currentEvent.date,
                        time: currentEvent.time,
                        gameId: parseInt(currentEvent.gameId)
                    }

                    // Send POST request to your API
                    createEvent(event)
                        .then(() => history.push("/events"))
                }}
                className="btn btn-primary">Create</button>
        </form>
    )
}