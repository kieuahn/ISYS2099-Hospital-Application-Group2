import React, { useEffect, useState } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotMonth, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import { Modal } from '@daypilot/modal';
import "./Calendar.css";
import { renderToStaticMarkup } from "react-dom/server";
import { CgMoreO } from "react-icons/cg";

const Calendar = () => {

  const [view, setView] = useState("Week");
  const [startDate, setStartDate] = useState(DayPilot.Date.today());
  const [events, setEvents] = useState([]);

  const renderIconToString = () => {
    return renderToStaticMarkup(<CgMoreO />);
  };

  const onTimeRangeSelected = async (args) => {
    const dp = args.control;

    const data = {
      patient: 'John Doe', // Example patient name, could be dynamically fetched
      purpose: '',
      start: args.start.toString(),
      end: args.end.toString(),
      payment: '',
      notes: '',
    };

    const form = [
      { type: 'title', name: 'Appointment Details' },
      { type: 'static', id: 'patient', name: 'Patient', value: data.patient },
      { type: 'text', id: 'purpose', name: 'Purpose', placeholder: 'Enter purpose of appointment' },
      { type: 'date', id: 'start', name: 'Start', dateFormat: 'M/d/yyyy h:mm tt', value: data.start },
      { type: 'date', id: 'end', name: 'End', dateFormat: 'M/d/yyyy h:mm tt', value: data.end },
      { type: 'number', id: 'payment', name: 'Payment', placeholder: 'Enter payment amount' },
      { type: 'textarea', id: 'notes', name: 'Notes', placeholder: 'Additional notes' },
      {
        type: 'buttons',
        buttons: [
          { text: 'Accept', id: 'accept', cssClass: 'btn btn-primary' },
          { text: 'Decline', id: 'decline', cssClass: 'btn btn-secondary' },
        ]
      }
    ];

    const modal = await Modal.form(form, data);
    dp.clearSelection();

    if (!modal.result) { return; }

    if (modal.result.accept) {
      const e = {
        start: args.start,
        end: args.end,
        text: modal.result.purpose,
        id: DayPilot.guid()
      };
      setEvents([...events, e]);
    }
  };

  const onEventClick = async (args) => {
    const event = args?.e;  // Safely access args.e

    if (!event) {
      console.error("Event is undefined");
      return;
    }

    // if (!event || !event.data) {
    //   console.error("Event is undefined in onEventClick");
    //   return;
    // }

    const data = {
      patient: 'John Doe', // Example patient name, could be dynamically fetched
      purpose: event.data?.text || '',  // Safely access event.data.text
      start: event.data?.start.toString() || '',
      end: event.data?.end.toString() || '',
      payment: event.data?.payment || '',
      notes: event.data?.notes || '',
    };

    const form = [
      { type: 'title', name: 'Edit Appointment' },
      { type: 'static', id: 'patient', name: 'Patient', value: data.patient },
      { type: 'text', id: 'purpose', name: 'Purpose', value: data.purpose },
      { type: 'date', id: 'start', name: 'Start', dateFormat: 'M/d/yyyy h:mm tt', value: data.start },
      { type: 'date', id: 'end', name: 'End', dateFormat: 'M/d/yyyy h:mm tt', value: data.end },
      { type: 'number', id: 'payment', name: 'Payment', value: data.payment },
      { type: 'textarea', id: 'notes', name: 'Notes', value: data.notes },
      {
        type: 'buttons',
        buttons: [
          { text: 'Save Changes', id: 'save', cssClass: 'btn btn-primary' },
          { text: 'Delete', id: 'delete', cssClass: 'btn btn-danger' },
          { text: 'Cancel', id: 'cancel', cssClass: 'btn btn-secondary' },
        ]
      }
    ];

    const modal = await Modal.form(form, data);

    // Safely check for the delete action
    if (modal.result?.delete) {
      setEvents(events.filter(e => e.id !== event.id));  // Safely access event.id
      return;
    }

    // Safely check for the save action
    if (modal.result?.save) {
      event.data.text = modal.result.purpose;
      event.data.start = modal.result.start;
      event.data.end = modal.result.end;
      event.data.payment = modal.result.payment;
      event.data.notes = modal.result.notes;
      setEvents([...events]);  // Trigger re-render
    }
  };


  useEffect(() => {
    const data = [
      {
        id: 1,
        text: "Event 1",
        start: DayPilot.Date.today().addHours(9),
        end: DayPilot.Date.today().addHours(11),
      },
      {
        id: 2,
        text: "Event 2",
        start: DayPilot.Date.today().addHours(10),
        end: DayPilot.Date.today().addHours(12),
        backColor: "#93c47d",
        borderColor: "darker"
      },
      {
        id: 9,
        text: "Event 9",
        start: DayPilot.Date.today().addHours(13),
        end: DayPilot.Date.today().addHours(15),
        backColor: "#76a5af", // Teal background
        borderColor: "darker"
      },
      {
        id: 3,
        text: "Event 3",
        start: DayPilot.Date.today().addDays(1).addHours(9),
        end: DayPilot.Date.today().addDays(1).addHours(11),
        backColor: "#ffd966", // Yellow background
        borderColor: "darker"
      },
      {
        id: 4,
        text: "Event 4",
        start: DayPilot.Date.today().addDays(1).addHours(11).addMinutes(30),
        end: DayPilot.Date.today().addDays(1).addHours(13).addMinutes(30),
        backColor: "#f6b26b", // Orange background
        borderColor: "darker"
      },

      {
        id: 7,
        text: "Event 7",
        start: DayPilot.Date.today().addDays(1).addHours(14),
        end: DayPilot.Date.today().addDays(1).addHours(16),
        backColor: "#e691b8", // Pink background
        borderColor: "darker"
      },
      {
        id: 5,
        text: "Event 5",
        start: DayPilot.Date.today().addDays(4).addHours(9),
        end: DayPilot.Date.today().addDays(4).addHours(11),
        backColor: "#8e7cc3", // Purple background
        borderColor: "darker"
      },
      {
        id: 6,
        text: "Event 6",
        start: DayPilot.Date.today().addDays(4).addHours(13),
        end: DayPilot.Date.today().addDays(4).addHours(15),
        backColor: "#6fa8dc", // Light Blue background
        borderColor: "darker"
      },

      {
        id: 8,
        text: "Event 8",
        start: DayPilot.Date.today().addDays(5).addHours(13),
        end: DayPilot.Date.today().addDays(5).addHours(15),
        backColor: "#b6d7a8", // Light Green background
        borderColor: "darker"
      },

    ];

    setEvents(data);

  }, []);

  const onBeforeEventRender = (args) => {
    const iconHtml = renderIconToString();

    args.data.areas = [
      {
        right: 3,
        top: 3,
        width: 20,
        height: 20,
        html: `<div style="font-size: 20px; color: #333;">${iconHtml}</div>`,
        action: "ContextMenu",
        visibility: "Hover",
        menu: new DayPilot.Menu({
          items: [
            {
              text: "Edit",
              onClick: () => onEventClick({ e: args.e }), // Pass the event object correctly
            },
            {
              text: "Delete",
              onClick: () => setEvents(events.filter(e => e.id !== args.e.id)) // Safely access event.id
            }
          ]
        })
      }
    ];
  };



  return (
    <div className={"container"}>
      <div className={"navigator"}>
        <DayPilotNavigator
          selectMode={view}
          showMonths={3}
          skipMonths={3}
          onTimeRangeSelected={args => setStartDate(args.day)}
          events={events}
        />
      </div>
      <div className={"content"}>
        <div className={"toolbar"}>
          <div className={"toolbar-group"}>
            <button onClick={() => setView("Day")} className={view === "Day" ? "selected" : ""}>Day</button>
            <button onClick={() => setView("Week")} className={view === "Week" ? "selected" : ""}>Week</button>
            <button onClick={() => setView("Month")} className={view === "Month" ? "selected" : ""}>Month</button>
          </div>
          <button onClick={() => setStartDate(DayPilot.Date.today())} className={"standalone"}>Today</button>
        </div>

        <DayPilotCalendar
          viewType={"Day"}
          startDate={startDate}
          events={events}
          visible={view === "Day"}
          durationBarVisible={false}
          onTimeRangeSelected={onTimeRangeSelected}
          onEventClick={onEventClick}
          onBeforeEventRender={onBeforeEventRender}
        />
        <DayPilotCalendar
          viewType={"Week"}
          startDate={startDate}
          events={events}
          visible={view === "Week"}
          durationBarVisible={false}
          onTimeRangeSelected={onTimeRangeSelected}
          onEventClick={onEventClick}
          onBeforeEventRender={onBeforeEventRender}
        />
        <DayPilotMonth
          startDate={startDate}
          events={events}
          visible={view === "Month"}
          eventBarVisible={false}
          onTimeRangeSelected={onTimeRangeSelected}
          onEventClick={onEventClick}
          onBeforeEventRender={onBeforeEventRender}
        />
      </div>
    </div>
  );
}

export default Calendar;
