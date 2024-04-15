import React, { useState, useEffect, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { UserContext } from "../UserContext";

const IntCalendar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [eventType, setEventType] = useState("training");
  const [scheduleDetails, setScheduleDetails] = useState({
    date: "",
    time: "",
    trainingName: "",
    trainer: "",
    link: "",
    type: "training",
    moduleName: "",
    trainingType: "",
  });
  const [events, setEvents] = useState([]);
  const [modules, setModules] = useState([]);
  const [topics, setTopics] = useState([]);
  const [disableSave, setDisableSave] = useState(true);
  const toast = useToast();
  const { userDetails: contextUserDetails } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(
    () => JSON.parse(localStorage.getItem("userDetails")) || contextUserDetails
  );
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);

  useEffect(() => {
    setUserDetails(contextUserDetails);
    localStorage.setItem("userDetails", JSON.stringify(contextUserDetails));
  }, [contextUserDetails]);

  useEffect(() => {
    fetchEvents();
    fetchModules();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3001/intSchedules");
      console.log(response.data);
      setEvents(
        response.data.map((event) => ({
          title: ` ${event.time} ${event.trainingName}`,
          start: new Date(event.date),
          time: event.time,
          date: event.date,
          name: event.trainingName,
          trainer: event.trainerName,
          link: event.link,
          premise: event.trainingType,
          type: event.planType,
          iden: event._id,
          color: getColorForEvent(event),
        }))
      );
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      // console.log(selectedEvent.date);
      console.log(selectedEvent.iden);
      // Call the delete API with the selected event data
      await axios.get(
        `http://localhost:3001/deletePlan/intern/${selectedEvent.iden}`
      );

      // If deletion is successful, remove the event from the calendar
      // setEvents((prevEvents) =>
      //   prevEvents.filter((event) => event.id !== selectedEvent.id)
      // );
      fetchEvents();
      // Close the event details modal
      setIsEventDetailsModalOpen(false);

      toast({
        title: "Event deleted successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Failed to delete event. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchModules = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/getModules/intern"
      );
      setModules(response.data);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  const getColorForEvent = (event) => {
    const currentDate = new Date();
    const eventDate = new Date(event.date);

    currentDate.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    if (currentDate > eventDate) {
      return "gray";
    } else {
      return event.planType === "training" ? "#7209b7" : "#fb8500";
    }
  };

  const handleDateClick = (info) => {
    setScheduleDetails({
      ...scheduleDetails,
      date: info.dateStr,
    });
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetScheduleDetails();
  };

  const resetScheduleDetails = () => {
    setScheduleDetails({
      date: "",
      time: "",
      trainingName: "",
      trainer: "",
      link: "",
      type: "training",
      moduleName: "",
      trainingType: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleDetails({ ...scheduleDetails, [name]: value });
    checkAllFieldsFilled();
  };

  const handleEventTypeChange = (e) => {
    const type = e.target.value;
    setEventType(type);
    setScheduleDetails({ ...scheduleDetails, type });
    checkAllFieldsFilled();
  };

  const handleSave = async () => {
    try {
      await axios.post(
        "http://localhost:3001/internal-training-plan",
        scheduleDetails
      );
      fetchEvents();
      toast({
        title: "Schedule saved successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast({
        title: "Failed to save schedule. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsOpen(false);
    resetScheduleDetails();
    setDisableSave(true);
  };

  const handleEventClick = (info) => {
    console.log(info.event);
    console.log(info.event.extendedProps);
    setSelectedEvent(info.event.extendedProps);
    setIsEventDetailsModalOpen(true);
  };

  const handleModuleChange = (e) => {
    const moduleName = e.target.value;
    setScheduleDetails({ ...scheduleDetails, moduleName });
    const selectedModule = modules.find((module) => module.name === moduleName);
    setTopics(selectedModule ? selectedModule.topics : []);
  };

  const renderTimeOptions = () => {
    const scheduledTimes = events
      .filter(
        (event) =>
          event.start.toISOString().split("T")[0] === scheduleDetails.date
      )
      .map((event) => event.time);

    const timeSlots = [
      { value: "9-10", label: "9am to 10am (1 hour)" },
      { value: "10-11", label: "10am to 11am (1 hour)" },
      { value: "11-12", label: "11am to 12pm (1 hour)" },
      { value: "1-2", label: "1pm to 2pm (1 hour)" },
      { value: "2-3", label: "2pm to 3pm (1 hour)" },
    ];

    return timeSlots.map((slot, index) => {
      if (!scheduledTimes.includes(slot.value)) {
        return (
          <option key={index} value={slot.value}>
            {slot.label}
          </option>
        );
      } else {
        return null;
      }
    });
  };

  const renderCalendar = () => {
    if (localStorage.getItem("userType") === "admin") {
      return (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          events={events}
          displayEventTime={false}
          eventClick={handleEventClick}
          themeSystem="bootstrap"
          headerToolbar={{
            start: "prev,next today",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
          }}
          customButtons={{
            customTodayButton: {
              text: "Today",
              click: function () {
                this.calendar.today();
              },
              icon: "today",
            },
          }}
        />
      );
    } else {
      return (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          displayEventTime={false}
          editable={false}
          themeSystem="bootstrap"
          headerToolbar={{
            start: "prev,next today",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
          }}
          customButtons={{
            customTodayButton: {
              text: "Today",
              click: function () {
                this.calendar.today();
              },
              icon: "today",
            },
          }}
        />
      );
    }
  };

  const checkAllFieldsFilled = () => {
    const requiredFields = [
      "date",
      "time",
      "trainingName",
      "trainer",
      "moduleName",
    ];

    if (eventType === "training") {
      requiredFields.push("trainingType");
    } else if (eventType === "test") {
      requiredFields.push("link");
    }

    const allFieldsFilled = requiredFields.every(
      (field) => scheduleDetails[field]
    );
    setDisableSave(!allFieldsFilled);
  };

  return (
    <>
      {renderCalendar()}
      <Modal isOpen={isOpen} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent className="bg-white rounded-t-lg shadow-lg">
          <ModalHeader className="relative py-4 px-6 text-white text-lg font-bold rounded-t-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-600 rounded-t-lg" />
            <div className="relative z-10">Add Schedule</div>
          </ModalHeader>

          <ModalCloseButton className="text-gray-800" />
          <ModalBody className="p-6">
            <FormControl className="mb-4">
              <FormLabel className="text-gray-800">Event Type</FormLabel>
              <Select
                name="eventType"
                value={eventType}
                onChange={handleEventTypeChange}
                className="mt-1"
                placeholder="Select Event Type"
              >
                <option value="training">Training</option>
                <option value="test">Test</option>
              </Select>
            </FormControl>
            {eventType === "test" && (
              <>
                <FormControl className="mb-4">
                  <FormLabel className="text-gray-800">Module Name</FormLabel>
                  <Select
                    name="moduleName"
                    value={scheduleDetails.moduleName}
                    onChange={handleModuleChange}
                    className="mt-1"
                    placeholder="Select Module Name"
                  >
                    {modules
                      .filter(
                        (module) =>
                          new Date(module.stDate) <=
                            new Date(scheduleDetails.date) &&
                          new Date(module.enDate) >=
                            new Date(scheduleDetails.date)
                      )
                      .map((module) => (
                        <option key={module._id} value={module.name}>
                          {module.name}
                        </option>
                      ))}
                  </Select>
                </FormControl>
                {scheduleDetails.moduleName && (
                  <>
                    <FormControl className="mb-4">
                      <FormLabel className="text-gray-800">
                        Training Name
                      </FormLabel>
                      <Select
                        name="trainingName"
                        value={scheduleDetails.trainingName}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Select Training Name"
                      >
                        {topics.map((topic, index) => (
                          <option key={index} value={topic}>
                            {topic}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl className="mb-4">
                      <FormLabel className="text-gray-800">Time</FormLabel>
                      <Select
                        name="time"
                        value={scheduleDetails.time}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Select Time"
                      >
                        {renderTimeOptions()}
                      </Select>
                    </FormControl>
                    <FormControl className="mb-4">
                      <FormLabel className="text-gray-800">Trainer</FormLabel>
                      <Input
                        type="text"
                        name="trainer"
                        value={scheduleDetails.trainer}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Enter Trainer"
                      />
                    </FormControl>
                    <FormControl className="mb-4">
                      <FormLabel className="text-gray-800">Link</FormLabel>
                      <Input
                        type="text"
                        name="link"
                        value={scheduleDetails.link}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Enter Link"
                      />
                    </FormControl>
                  </>
                )}
              </>
            )}
            {eventType === "training" && (
              <>
                <FormControl className="mb-4">
                  <FormLabel className="text-gray-800">Training Type</FormLabel>
                  <Select
                    name="trainingType"
                    value={scheduleDetails.trainingType}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Select Training Type"
                  >
                    <option value="in-person">In-Person</option>
                    <option value="online">Online</option>
                  </Select>
                </FormControl>
                <FormControl className="mb-4">
                  <FormLabel className="text-gray-800">Module Name</FormLabel>
                  <Select
                    name="moduleName"
                    value={scheduleDetails.moduleName}
                    onChange={handleModuleChange}
                    className="mt-1"
                    placeholder="Select Module Name"
                  >
                    {modules
                      .filter(
                        (module) =>
                          new Date(module.stDate) <=
                            new Date(scheduleDetails.date) &&
                          new Date(module.enDate) >=
                            new Date(scheduleDetails.date)
                      )
                      .map((module) => (
                        <option key={module._id} value={module.name}>
                          {module.name}
                        </option>
                      ))}
                  </Select>
                </FormControl>
                {scheduleDetails.moduleName && (
                  <>
                    <FormControl className="mb-4">
                      <FormLabel className="text-gray-800">
                        Training Name
                      </FormLabel>
                      <Select
                        name="trainingName"
                        value={scheduleDetails.trainingName}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Select Training Name"
                      >
                        {topics.map((topic, index) => (
                          <option key={index} value={topic}>
                            {topic}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl className="mb-4">
                      <FormLabel className="text-gray-800">Time</FormLabel>
                      <Select
                        name="time"
                        value={scheduleDetails.time}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Time</option>
                        {renderTimeOptions()}
                      </Select>
                    </FormControl>
                    <FormControl className="mb-4">
                      <FormLabel className="text-gray-800">Trainer</FormLabel>
                      <Input
                        type="text"
                        name="trainer"
                        value={scheduleDetails.trainer}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Enter Trainer"
                      />
                    </FormControl>
                  </>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter className="bg-gray-100 py-4 px-6 rounded-b-lg">
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSave}
              isDisabled={disableSave}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Save
            </Button>
            <Button
              onClick={handleClose}
              className="px-6 py-2 rounded-lg bg-gray-300 text-gray-800 font-bold hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-200"
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {selectedEvent && (
        <Modal
          isOpen={isEventDetailsModalOpen}
          onClose={() => setIsEventDetailsModalOpen(false)}
          size="lg"
        >
          <ModalOverlay />
          <ModalContent className="bg-[#f8f9fa]" rounded="lg">
            <ModalHeader
              className={`py-4 px-6 text-white ${
                selectedEvent.type === "training"
                  ? "bg-[#3c096c]"
                  : "bg-[#ff9e00]"
              } rounded-t-lg`}
            >
              {selectedEvent.type === "training"
                ? "Training Session -"
                : "Assessment -"}{" "}
              {selectedEvent.name}
            </ModalHeader>
            <ModalCloseButton color="gray.400" />
            <ModalBody>
              <div className="mb-4">
                <strong>Scheduled for:</strong> {`${selectedEvent.time}`}
              </div>
              {selectedEvent.trainer && (
                <div className="mb-4">
                  <strong>Mentor:</strong> {selectedEvent.trainer}
                </div>
              )}
              {selectedEvent.link && (
                <div className="mb-4">
                  <strong>Hackerrank Test Link:</strong>{" "}
                  <a href={selectedEvent.link} className="text-blue-600">
                    {selectedEvent.link}
                  </a>
                </div>
              )}
              {selectedEvent.type === "training" && (
                <div className="mb-4">
                  <strong>Venue:</strong> {selectedEvent.premise}
                </div>
              )}
            </ModalBody>
            <ModalFooter className="bg-[#e9ecef]" rounded="lg">
              {localStorage.getItem("userType") === "admin" && (
                <Button colorScheme="red" mr={3} onClick={handleDeleteEvent}>
                  Delete
                </Button>
              )}
              <Button onClick={() => setIsEventDetailsModalOpen(false)}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default IntCalendar;
