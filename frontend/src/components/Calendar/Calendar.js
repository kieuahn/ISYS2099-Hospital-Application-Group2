import React, { useEffect, useState } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotMonth, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import { renderToStaticMarkup } from "react-dom/server";
import { CgMoreO } from "react-icons/cg";
import "./Calendar.css";

const Calendar = () => {
  const [view, setView] = useState("Week");
  const [startDate, setStartDate] = useState(DayPilot.Date.today());
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  const renderIconToString = () => {
    return renderToStaticMarkup(<CgMoreO />);
  };

  const onTimeRangeSelected = (args) => {
    const data = {
      patient: 'John Doe', // Example patient name, could be dynamically fetched
      purpose: '',
      start: args.start.toString(),
      end: args.end.toString(),
      payment: '',
      notes: '',
    };
    setModalData(data);
    setIsModalOpen(true);
  };

  const onEventClick = (args) => {
    const event = args?.e;
    if (!event) {
      console.error("Event is undefined");
      return;
    }

    const data = {
      patient: 'John Doe',
      purpose: event.data?.text || '',
      start: event.data?.start.toString() || '',
      end: event.data?.end.toString() || '',
      payment: event.data?.payment || '',
      notes: event.data?.notes || '',
    };

    setModalData(data);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const newEvent = {
      start: modalData.start,
      end: modalData.end,
      text: modalData.purpose,
      id: DayPilot.guid()
    };
    setEvents([...events, newEvent]);
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const data = [
      // Sample events
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
              onClick: () => onEventClick({ e: args.e }),
            },
            {
              text: "Delete",
              onClick: () => setEvents(events.filter(e => e.id !== args.e.id))
            }
          ]
        })
      }
    ];
  };

  return (
    <div className="container">
      <div className="navigator">
        <DayPilotNavigator
          selectMode={view}
          showMonths={3}
          skipMonths={3}
          onTimeRangeSelected={args => setStartDate(args.day)}
          events={events}
        />
      </div>
      <div className="content">
        <div className="toolbar">
          <div className="toolbar-group">
            <button onClick={() => setView("Day")} className={view === "Day" ? "selected" : ""}>Day</button>
            <button onClick={() => setView("Week")} className={view === "Week" ? "selected" : ""}>Week</button>
            <button onClick={() => setView("Month")} className={view === "Month" ? "selected" : ""}>Month</button>
          </div>
          <button onClick={() => setStartDate(DayPilot.Date.today())} className="standalone">Today</button>
        </div>

        <DayPilotCalendar
          viewType="Day"
          startDate={startDate}
          events={events}
          visible={view === "Day"}
          durationBarVisible={false}
          onTimeRangeSelected={onTimeRangeSelected}
          onEventClick={onEventClick}
          onBeforeEventRender={onBeforeEventRender}
        />
        <DayPilotCalendar
          viewType="Week"
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

        {/* Custom Modal */}
        {isModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Appointment Details
                      </h3>
                      <div className="mt-2">
                        <p>Patient: {modalData.patient}</p>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md p-2 mt-2"
                          placeholder="Enter purpose"
                          value={modalData.purpose}
                          onChange={(e) => setModalData({ ...modalData, purpose: e.target.value })}
                        />
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md p-2 mt-2"
                          placeholder="Payment"
                          value={modalData.payment}
                          onChange={(e) => setModalData({ ...modalData, payment: e.target.value })}
                        />
                        <textarea
                          className="w-full border border-gray-300 rounded-md p-2 mt-2"
                          placeholder="Additional notes"
                          value={modalData.notes}
                          onChange={(e) => setModalData({ ...modalData, notes: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button onClick={handleSave} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Save
                  </button>
                  <button onClick={handleClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;
