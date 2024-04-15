import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Divider } from "@chakra-ui/react";

import {
  Box,
  Flex,
  Text,
  Stack,
  Badge,
  SimpleGrid,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Button,
} from "@chakra-ui/react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const TrackTraining = () => {
  const [modules, setModules] = useState([]);
  const [completedModulesCount, setCompletedModulesCount] = useState(0);
  const [otherUsers, setOtherUsers] = useState([]);
  const [inProgressModule, setInProgressModule] = useState(null);

  useEffect(() => {
    fetchModules();
    fetchOtherUsers();
  }, []);

  useEffect(() => {
    // Find the module that is currently in progress
    const inProgressModule = modules.find(
      (module) => module.status === "In Progress"
    );
    setInProgressModule(inProgressModule);
  }, [modules]);

  const fetchModules = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/getModules/${localStorage.getItem("userType")}`
      );
      const updatedModules = response.data.map((module) => ({
        ...module,
        status: getStatus(module),
      }));
      setModules(updatedModules);
      const completedCount = updatedModules.filter(
        (module) => module.status === "Completed"
      ).length;
      setCompletedModulesCount(completedCount);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  const getStatus = (module) => {
    const currentDate = new Date();
    const startDate = new Date(module.stDate);
    const endDate = new Date(module.enDate);

    if (currentDate > endDate) {
      return "Completed";
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return "In Progress";
    } else {
      return "Upcoming";
    }
  };

  const fetchOtherUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/getEvr");
      const filteredUsers = response.data.filter(
        (user) =>
          user.email !== localStorage.getItem("email") &&
          user.userType === localStorage.getItem("userType")
      );
      setOtherUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching other users:", error);
    }
  };

  const topicColors = [
    "#ff1654",
    "#ff8500",
    "#f4a259",
    "#e63946",
    "#a8dadc",
    "#457b9d",
    "#fb8500",
    "#a5be00",
    "#6a040f",
    "#b5179e",
    "#0a9396",
    "#ff5400",
    "#5a189a",
    "#800f2f",
    "#b23a48",
  ];

  const getRandomColor = () => {
    return topicColors[Math.floor(Math.random() * topicColors.length)];
  };

  return (
    <>
      <NavBar />
      <Box p={5}>
        <Flex justify="space-between" align="center" mb={5}>
          {inProgressModule && (
            <Stack align="center">
              <Badge
                colorScheme="yellow"
                rounded="full"
                fontSize="lg"
                px={4}
                py={2}
              >
                {inProgressModule.name}
              </Badge>
              <Text fontSize="sm" fontStyle="italic" color="gray.600" mt={1}>
                Started on{" "}
                {new Date(inProgressModule.stDate).toLocaleDateString()} & ends
                on {new Date(inProgressModule.enDate).toLocaleDateString()}
              </Text>
            </Stack>
          )}
          <CircularProgressbar
            value={(completedModulesCount / modules.length) * 100}
            text={`${completedModulesCount}/${modules.length}`}
            styles={{
              root: { width: "100px", height: "100px", marginLeft: "20px" },
            }}
          />
          <Menu>
            <MenuButton
              as={Button}
              variant="solid"
              colorScheme="purple"
              size="lg"
              fontWeight="bold"
              width="auto"
              borderRadius="full"
              boxShadow="md"
              _hover={{ bg: "purple.700" }}
              rightIcon={<ChevronDownIcon />}
            >
              You + {otherUsers.length} others
            </MenuButton>
            <MenuList
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              maxWidth="300px" // Adjust the maximum width of the dropdown
            >
              {otherUsers.map((user, index) => (
                <React.Fragment key={user.email}>
                  <MenuItem
                    py="2" // Add vertical padding to the MenuItem
                    px="3" // Add horizontal padding to the MenuItem
                  >
                    <Avatar name={user.fullName} size="sm" src={user.avatar} />
                    <Box ml={3}>
                      <Text fontWeight="bold">{user.fullName}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {user.email}
                      </Text>
                    </Box>
                  </MenuItem>
                  {index !== otherUsers.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </MenuList>
          </Menu>
        </Flex>
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={10}>
          {modules.map((module) => (
            <Box
              key={module._id}
              bg="white"
              p={5}
              boxShadow="md"
              rounded="md"
              overflow="hidden"
              mb={5}
              minH="280px"
              borderTopWidth="4px"
              borderTopColor={
                module.status === "Completed"
                  ? "green.500"
                  : module.status === "In Progress"
                  ? "yellow.500"
                  : "red.500"
              }
            >
              <Stack spacing={4}>
                <Flex justify="space-between">
                  <Heading
                    as="h2"
                    size="md"
                    textAlign="left"
                    color="#002855"
                    mb={2}
                  >
                    {module.name}
                  </Heading>
                  <Badge
                    colorScheme={
                      module.status === "Completed"
                        ? "green"
                        : module.status === "In Progress"
                        ? "yellow"
                        : "red"
                    }
                    rounded="full"
                    px={2}
                    py={1}
                  >
                    {module.status}
                  </Badge>
                </Flex>
                <Text fontSize="sm" color="gray.500" textAlign="left" mb={2}>
                  {module.desc}
                </Text>
                <Stack
                  direction="row"
                  spacing={2}
                  wrap="wrap"
                  mb={2}
                  className="mt-8"
                >
                  {module.topics.map((topic, index) => (
                    <Badge
                      key={index}
                      bg={getRandomColor()}
                      color="white"
                      rounded="full"
                      py={1}
                      px={2}
                      opacity={0.85}
                      mr={1}
                      mb={1}
                    >
                      {topic}
                    </Badge>
                  ))}
                </Stack>
                <Text
                  fontSize="sm"
                  color="gray.500"
                  textAlign="left"
                  fontStyle="italic"
                  className="mt-8"
                >
                  Starts on {new Date(module.stDate).toLocaleDateString()} &
                  ends on {new Date(module.enDate).toLocaleDateString()}
                </Text>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
};

export default TrackTraining;
