import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Select,
  FormControl,
  FormLabel,
  Box,
  Flex,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Import animated loading icon
import axios from "axios";

const PredictionModal = ({ isOpen, onClose }) => {
  const [venue, setVenue] = useState("");
  const [userType, setUserType] = useState("");
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [level, setLevel] = useState("");
  const [isPredictButtonDisabled, setIsPredictButtonDisabled] = useState(true);
  const [predictionResult, setPredictionResult] = useState("");
  const [sessionCount, setSessionCount] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to track loading animation
  const [showResult, setShowResult] = useState(false);
  const [initialFieldsFilled, setInitialFieldsFilled] = useState(false);

  // Reset all fields
  const resetFields = () => {
    setVenue("");
    setUserType("");
    setSelectedModule("");
    setSelectedTopic("");
    setLevel("");
    setIsPredictButtonDisabled(true);
  };

  useEffect(() => {
    // Reset fields when modal is closed
    return () => resetFields();
  }, []);

  useEffect(() => {
    // Fetch modules based on user type when component mounts
    if (userType) {
      fetchModules();
    }
  }, [userType]);

  useEffect(() => {
    // Check if initial fields are filled
    if (venue && userType) {
      setInitialFieldsFilled(true);
    } else {
      setInitialFieldsFilled(false);
    }
  }, [venue, userType]);

  const fetchModules = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/getModules/${userType}`
      );
      setModules(response.data);
      // Set selectedModule to the first module and reset selectedTopic
      if (response.data.length > 0) {
        setSelectedModule(response.data[0].name);
        setSelectedTopic("");
      }
    } catch (error) {
      console.error("Error fetching modules:", error);
      // Handle error
    }
  };

  const handlePredict = async () => {
    setIsLoading(true); // Show loading animation
    try {
      // Send data to predict endpoint
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        Domain: selectedModule,
        Level: level,
        Mode: venue,
        Trainee_Type: userType,
      });
      const prediction = response.data.prediction;
      setPredictionResult(prediction.toFixed(1)); // Limit to one decimal place
      const sessionCount = Math.ceil(prediction);
      setSessionCount(sessionCount);
      setShowResult(true);
    } catch (error) {
      console.error("Error predicting:", error);
    } finally {
      setIsLoading(false); // Hide loading animation
      resetFields(); // Reset fields after prediction
    }
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleModuleChange = (e) => {
    setSelectedModule(e.target.value);
    setSelectedTopic("");
  };

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
    checkFieldsFilled();
  };

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
    checkFieldsFilled();
  };

  const checkFieldsFilled = () => {
    if (venue && userType && selectedModule && selectedTopic && level) {
      setIsPredictButtonDisabled(false);
    } else {
      setIsPredictButtonDisabled(true);
    }
  };

  const venueOptions = [
    { value: "online", label: "Online" },
    { value: "offline", label: "Offline" },
  ];

  const userTypeOptions = [
    { value: "intern", label: "Intern" },
    { value: "employee", label: "Employee" },
  ];

  const levelOptions = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  return (
    <Modal
      size="full"
      isOpen={isOpen}
      onClose={() => {
        onClose();
        resetFields();
      }}
    >
      <ModalOverlay />
      <ModalContent
        borderRadius="xl"
        boxShadow="2xl"
        bg="gray.900"
        color="white"
        overflow="hidden" // Hide any overflow content
      >
        <ModalHeader
          fontSize="4xl"
          fontWeight="bold"
          p={4}
          textAlign="center"
          borderBottomWidth="1px"
          borderColor="gray.800"
        >
          SmartSession
          <Text fontSize="lg" color="gray.400" mt="2">
            Predict Session Duration with SmartSession
          </Text>
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody p={4}>
          <Flex flexWrap="wrap">
            {/* Form Card */}
            <Box
              flex="1"
              p="4"
              borderRadius="xl"
              bg="gray.800"
              boxShadow="md"
              borderWidth="1px"
              borderColor="gray.700"
              marginRight="4"
              mb="4"
              overflowY="auto" // Add scroll when content overflows
              maxHeight="400px" // Set max height for left card
              css={`
                &::-webkit-scrollbar {
                  width: 10px;
                }

                &::-webkit-scrollbar-track {
                  background-color: #1a202c;
                }

                &::-webkit-scrollbar-thumb {
                  background-color: #4a5568;
                  border-radius: 5px;
                }

                &::-webkit-scrollbar-thumb:hover {
                  background-color: #2d3748;
                }
              `}
            >
              <Box p="4">
                <FormControl>
                  <FormLabel color="gray.400">Venue</FormLabel>
                  <Select
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="Select Venue"
                    color="white"
                    bg="gray.700"
                    borderColor="gray.600"
                    _focus={{ bg: "gray.800", borderColor: "gray.600" }}
                    _hover={{ bg: "gray.800", borderColor: "gray.600" }}
                  >
                    {venueOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        style={{ backgroundColor: "#374151", padding: "8px" }}
                      >
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel color="gray.400">User Type</FormLabel>
                  <Select
                    value={userType}
                    onChange={handleUserTypeChange}
                    placeholder="Select User Type"
                    color="white"
                    bg="gray.700"
                    borderColor="gray.600"
                    _focus={{ bg: "gray.800", borderColor: "gray.600" }}
                    _hover={{ bg: "gray.800", borderColor: "gray.600" }}
                  >
                    {userTypeOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        style={{ backgroundColor: "#4c5c68", padding: "8px" }}
                      >
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                {modules.length > 0 && initialFieldsFilled && (
                  <>
                    <FormControl mt={4}>
                      <FormLabel color="gray.400">Module</FormLabel>
                      <Select
                        value={selectedModule}
                        onChange={handleModuleChange}
                        placeholder="Select Module"
                        color="white"
                        bg="gray.700"
                        borderColor="gray.600"
                        _focus={{ bg: "gray.800", borderColor: "gray.600" }}
                        _hover={{ bg: "gray.800", borderColor: "gray.600" }}
                      >
                        {modules.map((module) => (
                          <option
                            key={module.name}
                            value={module.name}
                            style={{
                              backgroundColor: "#374151",
                              padding: "8px",
                            }}
                          >
                            {module.name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    {selectedModule && (
                      <>
                        <FormControl mt={4}>
                          <FormLabel color="gray.400">Topic</FormLabel>
                          <Select
                            value={selectedTopic}
                            onChange={handleTopicChange}
                            placeholder="Select Topic"
                            color="white"
                            bg="gray.700"
                            borderColor="gray.600"
                            _focus={{ bg: "gray.800", borderColor: "gray.600" }}
                            _hover={{ bg: "gray.800", borderColor: "gray.600" }}
                          >
                            {modules
                              .find((module) => module.name === selectedModule)
                              .topics.map((topic) => (
                                <option
                                  key={topic}
                                  value={topic}
                                  style={{
                                    backgroundColor: "#374151",
                                    padding: "8px",
                                  }}
                                >
                                  {topic}
                                </option>
                              ))}
                          </Select>
                        </FormControl>
                        <FormControl mt={4}>
                          <FormLabel color="gray.400">Level</FormLabel>
                          <Select
                            value={level}
                            onChange={handleLevelChange}
                            placeholder="Select Level"
                            color="white"
                            bg="gray.700"
                            borderColor="gray.600"
                            _focus={{ bg: "gray.800", borderColor: "gray.600" }}
                            _hover={{ bg: "gray.800", borderColor: "gray.600" }}
                          >
                            {levelOptions.map((option) => (
                              <option
                                key={option.value}
                                value={option.value}
                                style={{
                                  backgroundColor: "#374151",
                                  padding: "8px",
                                }}
                              >
                                {option.label}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                      </>
                    )}
                  </>
                )}
              </Box>
            </Box>
            {/* Result Card */}
            <Box
              flex="1"
              p="4"
              borderRadius="xl"
              bg="gray.800"
              boxShadow="md"
              borderWidth="1px"
              borderColor="gray.700"
              mb="4"
            >
              <Box
                borderRadius="lg"
                p="6"
                bg="gray.700"
                boxShadow="xl"
                textAlign="center"
                height="100%" // Set height to 100% to fill the container
                overflow="auto" // Add scroll when content overflows
              >
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  mb="4"
                  color="blue.400"
                  textAlign="center"
                >
                  Prediction Result
                </Text>
                {showResult ? (
                  <Box textAlign="center">
                    <Text fontSize="lg" color="white" mb="4">
                      Your Session is Predicted!
                    </Text>
                    <Box bg="blue.400" p="4" borderRadius="md" boxShadow="md">
                      <Text fontSize="4xl" color="white" fontWeight="bold">
                        {predictionResult} hours
                      </Text>
                      <Text fontSize="lg" color="white">
                        Estimated Duration
                      </Text>
                      <Text fontSize="lg" color="white">
                        (Approximately {sessionCount} one-hour sessions)
                      </Text>
                    </Box>
                  </Box>
                ) : (
                  <Text fontSize="lg" color="white">
                    Results will appear here
                  </Text>
                )}
                {isLoading && (
                  <Flex alignItems="center" mt="4">
                    <Spinner size="md" color="blue.400" mr="2" />
                    <Text fontSize="lg" fontWeight="bold" color="white">
                      Loading...
                    </Text>
                  </Flex>
                )}
              </Box>
            </Box>
          </Flex>
          <Text fontSize="lg" color="gray.400" mt="4" textAlign="center">
            SmartSession is a predictive model that helps estimate the duration
            of training sessions based on various factors such as venue, user
            type, module, topic, and level. Simply provide the necessary
            information, and SmartSession will generate an estimated duration
            for your session, allowing for better planning and scheduling.
          </Text>
        </ModalBody>
        <ModalFooter
          justifyContent="center"
          borderTopWidth="1px"
          borderColor="gray.800"
        >
          <Button
            colorScheme="blue"
            onClick={handlePredict}
            disabled={isPredictButtonDisabled}
            className="rounded-lg px-8" // Increased button width
            bg="blue.700" // Darker color shade
            _hover={{ bg: "blue.800" }} // Darker color shade on hover
            opacity={0.8} // Set opacity to 80%
          >
            Predict
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PredictionModal;
