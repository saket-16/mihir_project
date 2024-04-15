import React, { useState, useEffect, useRef } from "react";
import { FaLinkedin, FaLocationDot, FaPhone } from "react-icons/fa6";
import { FaUniversity } from "react-icons/fa";
import { SiBookstack } from "react-icons/si";
import { MdBadge } from "react-icons/md";
import {
  Box,
  Heading,
  Text,
  Stack,
  Input,
  Button,
  useToast,
  Avatar,
  AvatarGroup,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
} from "@chakra-ui/react";
import NavBar from "./NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Outside the Profile component, before the Profile function definition

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [interns, setInterns] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get("http://localhost:3001/user-details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserDetails({ ...response.data });
        setUpdatedDetails({ ...response.data });
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchEvrData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/getEvr");
        console.log(response.data);
        const internsList = response.data.filter(
          (item) => item.userType === "intern"
        );
        const employeesList = response.data.filter(
          (item) => item.userType === "employee"
        );
        setInterns(internsList);
        setEmployees(employeesList);
      } catch (error) {
        console.error("Failed to fetch EVR data:", error);
      }
    };

    fetchEvrData();
  }, []);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/getPerformance/${localStorage.getItem(
            "userType"
          )}/${localStorage.getItem("email")}`
        );
        setPerformanceData(response.data);
      } catch (error) {
        console.error("Failed to fetch performance data:", error);
      }
    };

    fetchPerformanceData();
  }, []);

  const getBackgroundColor = (evaluatedScore, totalScore) => {
    const percentage = (evaluatedScore / totalScore) * 100;
    if (percentage < 55) {
      return "#fbc3bc"; // Red color
    } else if (percentage < 90) {
      return "#b7e4c7"; // Green color
    } else {
      return "#e0aaff"; // Purple color
    }
  };

  const handleUpdateDetails = async (name, value) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/personal-info/${localStorage.getItem("email")}`,
        { [name]: value }
      );

      setUpdatedDetails(response.data);

      toast({
        title: "Details Updated",
        description: "Your details have been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to update details:", error.response.data.error);
      toast({
        title: "Error",
        description: "Failed to update details. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }
  return (
    <>
      <NavBar />
      <Box p={5}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avatar Card */}
          <div className="md:col-span-1">
            <div className="bg-[#051923] rounded-t-md p-6 shadow-md">
              <div className="flex items-center">
                <Avatar
                  size="xl"
                  name={localStorage.getItem("name")}
                  src="#"
                  backgroundColor="blue.500"
                />
                <div className="ml-4">
                  <Heading as="h2" size="md" className="text-[#1f7a8c]">
                    {localStorage.getItem("name")}
                  </Heading>
                  <Text
                    fontWeight="bold"
                    fontSize="sm"
                    mt={1}
                    className="text-[#1f7a8c]"
                  >
                    {localStorage.getItem("userType")}
                  </Text>
                </div>
              </div>
            </div>
            <div className="bg-[#f4f3ee] rounded-b-md p-6 shadow-md bg-[#ebebeb]">
              <ProfileField
                value={updatedDetails.phoneNumber || ""}
                name="phoneNumber"
                onUpdate={handleUpdateDetails}
                icon={<FaPhone />}
              />
              <ProfileField
                value={updatedDetails.location || ""}
                name="location"
                onUpdate={handleUpdateDetails}
                icon={<FaLocationDot />}
              />
              <ProfileField
                value={updatedDetails.linkedInProfile || ""}
                name="linkedInProfile"
                onUpdate={handleUpdateDetails}
                icon={<FaLinkedin />}
              />
            </div>
          </div>
          {/* Profile Fields Card */}
          <div className="bg-[#f4f3ee] rounded-md p-6 shadow-md md:col-span-1 bg-[#ebebeb]">
            <Stack spacing={4}>
              <Heading as="h3" size="lg" mb={4} className="text-[#003049]">
                Educational Qualifications
              </Heading>
              <ProfileField
                value={updatedDetails.collegeName || ""}
                name="collegeName"
                onUpdate={handleUpdateDetails}
                icon={<FaUniversity />}
              />
              <ProfileField
                value={updatedDetails.program || ""}
                name="program"
                onUpdate={handleUpdateDetails}
                icon={<SiBookstack />}
              />
              <ProfileField
                value={updatedDetails.stream || ""}
                name="stream"
                onUpdate={handleUpdateDetails}
                icon={<MdBadge />}
              />
            </Stack>
          </div>
        </div>
        {/* Interns and Employees Cards */}
        {localStorage.getItem("userType") === "admin" && (
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Interns Card */}
            <div className="rounded-md p-6 shadow-md bg-[#f2e9e4]">
              <Heading as="h3" size="md" mb={4} className="text-[#b2967d]">
                Interns added
              </Heading>
              <AvatarGroup size="md" max={2}>
                {interns.map((item, index) => (
                  <Avatar
                    key={index}
                    name={item.fullName}
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      item.fullName
                    )}&background=random`}
                  />
                ))}
              </AvatarGroup>
            </div>
            {/* Employees Card */}
            <div className="rounded-md p-6 shadow-md bg-[#f2e9e4]">
              <Heading as="h3" size="md" mb={4} className="text-[#b2967d]">
                Employees added
              </Heading>
              <AvatarGroup size="md" max={2}>
                {employees.map((item, index) => (
                  <Avatar
                    key={index}
                    name={item.fullName}
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      item.fullName
                    )}&background=random`}
                  />
                ))}
              </AvatarGroup>
            </div>
          </div>
        )}
        {/* Performance Table */}
        {localStorage.getItem("userType") !== "admin" && (
          <Box mt={6}>
            <Heading
              as="h3"
              size="md"
              mb={4}
              className="ml-3 text-[#003049] mt-12 rounded-full bg-[#ede7e3] p-4 w-40"
            >
              Performance
            </Heading>
            <Box width="80%">
              {" "}
              {/* Adjust the width of the card */}
              <Box p={5} boxShadow="md" rounded="md" className="bg-[#eee4e1]">
                {" "}
                {/* Chakra UI Card */}
                <Table
                  variant="striped"
                  colorScheme="gray"
                  size="sm"
                  width="100%"
                  className="bg-[#eee4e1]"
                >
                  <Thead>
                    <Tr>
                      <Th className="text-xs">Topic</Th>
                      <Th className="text-xs">Evaluated Score</Th>
                      <Th className="text-xs">Total Score</Th>
                      <Th className="text-xs">Percentage</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {performanceData.map(({ score }) =>
                      Object.entries(score).map(
                        ([topicName, [evaluatedScore, totalScore]]) => (
                          <Tr key={topicName}>
                            <Td
                              className="text-xs rounded-l-lg"
                              style={{
                                backgroundColor: getBackgroundColor(
                                  evaluatedScore,
                                  totalScore
                                ),
                              }}
                            >
                              {topicName}
                            </Td>
                            <Td
                              className="text-xs"
                              style={{
                                backgroundColor: getBackgroundColor(
                                  evaluatedScore,
                                  totalScore
                                ),
                              }}
                            >
                              {evaluatedScore}
                            </Td>
                            <Td
                              className="text-xs"
                              style={{
                                backgroundColor: getBackgroundColor(
                                  evaluatedScore,
                                  totalScore
                                ),
                              }}
                            >
                              {totalScore}
                            </Td>
                            <Td
                              className="text-xs rounded-r-lg"
                              style={{
                                backgroundColor: getBackgroundColor(
                                  evaluatedScore,
                                  totalScore
                                ),
                              }}
                            >
                              {((evaluatedScore / totalScore) * 100).toFixed(2)}
                              %
                            </Td>
                          </Tr>
                        )
                      )
                    )}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

const ProfileField = ({ value, name, onUpdate, icon }) => {
  const [fieldValue, setFieldValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false); // State to track editing state
  const [isActive, setIsActive] = useState(false); // State to track if the field is active

  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isActive &&
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        event.target.tagName !== "BUTTON"
      ) {
        setIsActive(false);
        setFieldValue(value); // Reset field value to original value
      }
    };

    if (isActive) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputRef, value, isActive]);

  const handleInputChange = (e) => {
    setFieldValue(e.target.value);
  };

  const handleEdit = () => {
    setIsActive(true);
    setIsEditing(true);
  };

  const handleUpdate = () => {
    onUpdate(name, fieldValue);
    setIsEditing(false); // After saving, set editing state to false
    setIsActive(false); // After saving, remove active state
  };

  return (
    <div className="mb-4" ref={inputRef}>
      <div className="flex items-center">
        {icon}
        <Input
          value={fieldValue}
          onChange={handleInputChange}
          placeholder="Enter value"
          borderRadius="md"
          size="sm"
          width="calc(100% - 100px)"
          marginRight="10px"
          marginLeft="5px"
          marginTop="5px"
          marginBottom="5px"
          onFocus={handleEdit} // Show button when field is focused
        />
        {isEditing &&
          isActive && ( // Conditionally render button when editing and field is active
            <Button
              colorScheme=""
              size="sm"
              className="bg-[#051923] text-[#1f7a8c]"
              onClick={handleUpdate}
            >
              Save
            </Button>
          )}
      </div>
    </div>
  );
};

export default Profile;
