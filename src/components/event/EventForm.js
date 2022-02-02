import React, { useState, useEffect } from "react"
import { useParams, useHistory } from "react-router-dom"
import { getGames } from "../game/GameManager.js"
import { createEvent, getEvent, updateEvent } from "./EventManager.js"


export const EventForm = () => {
    const history = useHistory()
    const { eventId } = useParams()
    const editEventId = parseInt(eventId)
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

    useEffect(
        () => {
            if (editEventId) {
                getEvent(editEventId)
                    .then((editEvent) => {
                        setCurrentEvent({
                            description: editEvent.description,
                            gameId: editEvent.game.id,
                            date: editEvent.date,
                            time: editEvent.time
                        })
                    })
            }
        }, [editEventId]
    )

    const changeEventState = (domEvent) => {
        const newEntry = Object.assign({}, currentEvent)
        newEntry[domEvent.target.name] = domEvent.target.value
        setCurrentEvent(newEntry)
    }

    const submitEvent = (evt) => {
        evt.preventDefault()

        const event = {
            description: currentEvent.description,
            date: currentEvent.date,
            time: currentEvent.time,
            gameId: parseInt(currentEvent.gameId)
        }

        // Send POST request to your API
        if (editEventId) {
            updateEvent(event, editEventId)
                .then(() => history.push("/events"))
        } else {
            createEvent(event)
                .then(() => history.push("/events"))
        }
    }

    return (
        <form className="eventForm">
            {
                editEventId
                    ? <h2 className="eventForm__title">Edit Event</h2>
                    : <h2 className="eventForm__title">Register New Event</h2>
            }
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
            {
                editEventId
                    ? <button type="submit"
                        onClick={submitEvent}
                        className="btn btn-primary">Edit
                    </button>
                    : <button type="submit"
                        onClick={submitEvent}
                        className="btn btn-primary">Create
                    </button>
            }
        </form>
    )
}