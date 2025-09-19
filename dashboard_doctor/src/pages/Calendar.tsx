import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventInput, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import ViewSchedule from "../pages/Schedule/ViewSchedule"; // ✅ Step 1: Import this

interface CalendarEvent extends EventInput {
  extendedProps: {
    type: string;
    editable?: boolean;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventType, setEventType] = useState("Appointment");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDateForSchedule, setSelectedDateForSchedule] = useState<string | null>(null); // ✅ Step 2: State
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const eventColors: Record<string, string> = {
    Appointment: "bg-blue-500",
    Important: "bg-yellow-500",
    Leave: "bg-red-500",
  };

  useEffect(() => {
  setEvents([
    {
      id: "A001",
      title: "John Doe",
      start: "2025-07-26T10:00",
      extendedProps: { type: "Appointment", editable: true },
    },
    {
      id: "A002",
      title: "Jane Smith",
      start: "2025-07-26T11:30",
      extendedProps: { type: "Appointment", editable: true },
    },
  ]);
}, []);


  const handleDateClick = (arg: DateClickArg) => {
    const iso = new Date(arg.dateStr).toISOString().slice(0, 16);
    resetModalFields();
    setEventStartDate(iso);
    setSelectedDateForSchedule(arg.dateStr); // ✅ Step 3: Set date
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    const editable = event.extendedProps.editable;
    if (!editable) return;

    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    setEventStartDate(event.start?.toISOString().slice(0, 16) || "");
    setEventType(event.extendedProps.type);
    openModal();
  };

  const handleAddOrUpdateEvent = () => {
    const newEvent: CalendarEvent = {
      id: selectedEvent ? selectedEvent.id : Date.now().toString(),
      title: eventTitle,
      start: eventStartDate,
      extendedProps: { type: eventType, editable: eventType !== "Leave" },
      editable: eventType !== "Leave",
    };

    setEvents((prevEvents) =>
      selectedEvent
        ? prevEvents.map((event) => (event.id === selectedEvent.id ? newEvent : event))
        : [...prevEvents, newEvent]
    );

    closeModal();
    resetModalFields();
  };

  const resetModalFields = () => {
    setSelectedEvent(null);
    setEventTitle("");
    setEventStartDate("");
    setEventType("Appointment");
  };

  const renderEventContent = (eventInfo: any) => {
    const type = eventInfo.event.extendedProps.type;
    const colorClass = eventColors[type] || "bg-gray-400";
    return (
      <div className={`p-1 text-white rounded-sm ${colorClass}`}>
        <div>{eventInfo.event.title}</div>
        <div className="text-xs">{eventInfo.timeText}</div>
      </div>
    );
  };

  return (
    <>
      <PageMeta title="Doctor Calendar" description="Doctor Schedule Management" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          editable={true}
        />
      </div>

      {/* ✅ Step 4: Link ViewSchedule if any date is selected */}
      {selectedDateForSchedule && (
        <div className="mt-6">
          <ViewSchedule selectedDate={selectedDateForSchedule} />
        </div>
      )}

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
        <h3 className="text-lg font-semibold mb-2">
          {selectedEvent ? "Edit Event" : "Add New Event"}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Patient Name / Event Title</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Select Type</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              <option>Appointment</option>
              <option>Important</option>
              <option>Leave</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Date & Time</label>
            <input
              type="datetime-local"
              className="w-full border px-3 py-2 rounded"
              value={eventStartDate}
              onChange={(e) => setEventStartDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={closeModal} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleAddOrUpdateEvent}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {selectedEvent ? "Update" : "Add"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Calendar;
