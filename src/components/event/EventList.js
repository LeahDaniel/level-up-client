import React, { useEffect, useState } from "react"
import { getEvents } from "./EventManager.js"

export const EventList = (props) => {
    const [ events, setEvents ] = useState([])

    useEffect(() => {
        getEvents().then(data => setEvents(data))
    }, [])

    return (
        <article className="events">
            {
                events.map(event => {
                    return <section key={`event--${event.id}`} className="event">
                        <div className="event__date">{event.date} at {event.time}</div>
                        <div className="event__game">We're playing {event.game.title}</div>
                        <div className="event__description">{event.description}</div>
                        <div className="event__organizer">
                            Organized by {event.organizer.user.first_name} {event.organizer.user.last_name}
                        </div>
                    </section>
                })
            }
        </article>
    )
}