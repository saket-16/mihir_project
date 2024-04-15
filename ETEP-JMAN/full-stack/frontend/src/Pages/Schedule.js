import React, { useState, useEffect } from "react";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import IntCalendar from "./CalendarInt";
import EmpCalendar from "./CalendarEmp";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

const SchedulePage = () => {
  const [selectedTab, setSelectedTab] = useState("intern");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token is present in localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to profile page if token is present
    }
  }, []);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <>
      <NavBar />
      <Tabs
        isLazy
        onChange={handleTabChange}
        variant="soft-rounded"
        colorScheme="blue"
        defaultIndex={0}
        className="mt-4"
      >
        <TabList>
          {(localStorage.getItem("userType") === "admin" ||
            localStorage.getItem("userType") === "intern") && (
            <Tab
              onClick={() => handleTabChange("intern")}
              isSelected={selectedTab === "intern"}
            >
              Intern
            </Tab>
          )}
          {(localStorage.getItem("userType") === "admin" ||
            localStorage.getItem("userType") === "employee") && (
            <Tab
              onClick={() => handleTabChange("employee")}
              isSelected={selectedTab === "employee"}
            >
              Employee
            </Tab>
          )}
        </TabList>
        <TabPanels>
          <TabPanel>{selectedTab === "intern" && <IntCalendar />}</TabPanel>
          <TabPanel>{selectedTab === "employee" && <EmpCalendar />}</TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default SchedulePage;
