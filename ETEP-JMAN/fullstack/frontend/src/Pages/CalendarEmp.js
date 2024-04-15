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
      const response = await axios.get("http://localhost:3001/empSchedules");
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
        `http://localhost:3001/deletePlan/employee/${selectedEvent.iden}`
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
        "http://localhost:3001/getModules/employee"
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
        "http://localhost:3001/employee-training-plan",
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

    const timeSlots = ["9-10", "10-11", "11-12", "1-2", "2-3"];

    return timeSlots.map((slot, index) => {
      if (!scheduledTimes.includes(slot)) {
        return (
          <option key={index} value={slot}>
            {slot}
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
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Schedule</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Event Type</FormLabel>
              <Select
                name="eventType"
                value={eventType}
                onChange={handleEventTypeChange}
              >
                <option value="training">Training</option>
                <option value="test">Test</option>
              </Select>
            </FormControl>
            {eventType === "test" && (
              <>
                <FormControl mt={4}>
                  <FormLabel>Module Name</FormLabel>
                  <Select
                    name="moduleName"
                    value={scheduleDetails.moduleName}
                    onChange={handleModuleChange}
                  >
                    <option value="">Select Module Name</option>
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
                    <FormControl mt={4}>
                      <FormLabel>Training Name</FormLabel>
                      <Select
                        name="trainingName"
                        value={scheduleDetails.trainingName}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Training Name</option>
                        {topics.map((topic, index) => (
                          <option key={index} value={topic}>
                            {topic}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl mt={4}>
                      <FormLabel>Time</FormLabel>
                      <Select
                        name="time"
                        value={scheduleDetails.time}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Time</option>
                        {renderTimeOptions()}
                      </Select>
                    </FormControl>
                    <FormControl mt={4}>
                      <FormLabel>Trainer</FormLabel>
                      <Input
                        type="text"
                        name="trainer"
                        value={scheduleDetails.trainer}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormControl mt={4}>
                      <FormLabel>Link</FormLabel>
                      <Input
                        type="text"
                        name="link"
                        value={scheduleDetails.link}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  </>
                )}
              </>
            )}
            {eventType === "training" && (
              <>
                <FormControl mt={4}>
                  <FormLabel>Training Type</FormLabel>
                  <Select
                    name="trainingType"
                    value={scheduleDetails.trainingType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Training Type</option>
                    <option value="in-person">In-Person</option>
                    <option value="online">Online</option>
                  </Select>
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Module Name</FormLabel>
                  <Select
                    name="moduleName"
                    value={scheduleDetails.moduleName}
                    onChange={handleModuleChange}
                  >
                    <option value="">Select Module Name</option>
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
                    <FormControl mt={4}>
                      <FormLabel>Training Name</FormLabel>
                      <Select
                        name="trainingName"
                        value={scheduleDetails.trainingName}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Training Name</option>
                        {topics.map((topic, index) => (
                          <option key={index} value={topic}>
                            {topic}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl mt={4}>
                      <FormLabel>Time</FormLabel>
                      <Select
                        name="time"
                        value={scheduleDetails.time}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Time</option>
                        {renderTimeOptions()}
                      </Select>
                    </FormControl>
                    <FormControl mt={4}>
                      <FormLabel>Trainer</FormLabel>
                      <Input
                        type="text"
                        name="trainer"
                        value={scheduleDetails.trainer}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  </>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSave}
              isDisabled={disableSave}
            >
              Save
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
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
          <ModalContent>
            <ModalHeader
              className={`py-4 px-6 text-black ${
                selectedEvent.type === "training"
                  ? "bg-[#deaaff]"
                  : "bg-[#ffbf69]"
              }`}
            >
              {selectedEvent.type === "training"
                ? "Training session-"
                : "Assessment-"}{" "}
              {selectedEvent.name}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p className="mb-4">Scheduled for {selectedEvent.time}</p>
              {selectedEvent.trainer && (
                <p className="mb-4">Mentor: {selectedEvent.trainer}</p>
              )}
              {selectedEvent.link && (
                <p className="mb-4">
                  Hackerank Test Link: {selectedEvent.link}
                </p>
              )}
              {selectedEvent.type === "training" && (
                <p className="mb-4">Venue: {selectedEvent.premise}</p>
              )}
            </ModalBody>
            <ModalFooter>
              {localStorage.getItem("userType") === "admin" && (
                <Button colorScheme="blue" mr={3} onClick={handleDeleteEvent}>
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
