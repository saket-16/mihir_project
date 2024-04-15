import React, { useContext, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  useToast,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { UserContext } from "../UserContext";
import MPModal from "./MPmodal";
import PredictionModal from "./PredictionModal";
import Papa from "papaparse";
import axios from "axios";

const NavBar = () => {
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);
  const [isCsvDrawerOpen, setIsCsvDrawerOpen] = useState(false);
  const [uploadApi, setUploadApi] = useState(
    "http://localhost:3001/createUser"
  );
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const toast = useToast();
  const [modalActionType, setModalActionType] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleTrackTrainingClick = () => {
    navigate("/trackTraining");
  };

  const handleAllSchedulesClick = () => {
    navigate("/schedule");
  };

  const handleScheduleClick = () => {
    navigate(
      `${
        userDetails.type === "intern"
          ? "/intern-schedule"
          : "/employee-schedule"
      }`
    );
  };

  const handleCreateUserClick = () => {
    setIsUserModalOpen(true);
  };

  const handleUploadPerformanceClick = () => {
    setIsModuleModalOpen(true);
    setModalActionType("upload");
  };

  const handleCreateModuleClick = () => {
    setIsModuleModalOpen(true);
    setModalActionType("newModule");
  };

  const handleCloseUserModal = () => {
    setCsvFile(null);
    setIsUserModalOpen(false);
  };

  const handleCloseCsvDrawer = () => {
    setIsCsvDrawerOpen(false);
  };

  const handleCloseModuleModal = () => {
    setIsModuleModalOpen(false);
  };

  const handleCsvChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleNext = async () => {
    if (!csvFile) {
      toast({
        title: "No CSV file selected",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const parsedData = await parseCsvFile(csvFile);
      await sendDataToApi(parsedData);
      toast({
        title: "Created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsUserModalOpen(false);
    } catch (error) {
      console.error("Failed to create:", error);
      toast({
        title: "Failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const parseCsvFile = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          resolve(result.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  };

  const sendDataToApi = async (data) => {
    try {
      console.log(data);
      const response = await axios.post(uploadApi, {
        file: data,
        fromEmail: localStorage.getItem("email"),
      });
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to create");
      }
    } catch (error) {
      throw error;
    }
  };

  // CSS for link hover and active styles
  const linkStyles = {
    "&:hover": {
      textDecoration: "none", // Remove underline on hover
      color: "#2caeba", // Brighten link color on hover
    },
    "&.active": {
      textDecoration: "underline", // Remove default underline for active link
      position: "relative",
      "&:after": {
        content: '""',
        position: "absolute",
        bottom: "-3px", // Adjust the gap between text and underline
        left: "0",
        width: "100%",
        height: "2px",
        backgroundColor: "#2caeba", // Same color as link text when active
      },
    },
  };

  return (
    <>
      <Flex
        bg="#051923"
        borderBottom="2px solid #d3d3d3"
        p={4}
        alignItems="center"
        justifyContent="space-between"
        className="h-18"
      >
        <Box display="flex" alignItems="center">
          <RouterLink to="/profile" style={{ textDecoration: "none" }}>
            <Flex alignItems="center" className="mr-8">
              <Avatar
                name={localStorage.getItem("name")}
                src="#"
                size="md"
                mr={2}
              />
              <Box fontSize="xl" fontWeight="bold" color="#1f7a8c">
                {localStorage.getItem("name")}
              </Box>
            </Flex>
          </RouterLink>
          {localStorage.getItem("userType") === "admin" ? (
            <>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon ml={0} />}
                  variant="link"
                  mr={6}
                  _hover={{ textDecoration: "none", color: "#2caeba" }} // Brighten link color on hover
                  css={linkStyles} // Apply link styles
                >
                  Add
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={handleCreateUserClick}
                    _hover={{ backgroundColor: "#89c2d9" }}
                  >
                    User
                  </MenuItem>
                  <MenuItem
                    onClick={handleUploadPerformanceClick}
                    _hover={{ backgroundColor: "#89c2d9" }}
                  >
                    Performance
                  </MenuItem>
                  <MenuItem
                    onClick={handleCreateModuleClick}
                    _hover={{ backgroundColor: "#89c2d9" }}
                  >
                    Module
                  </MenuItem>
                </MenuList>
              </Menu>

              <Button
                as={RouterLink}
                to="/schedule"
                variant="link"
                mr={6}
                isActive={window.location.pathname === "/schedule"}
                _hover={{ textDecoration: "none", color: "#2caeba" }} // Brighten link color on hover
                css={linkStyles} // Apply link styles
              >
                Schedules
              </Button>

              <Button
                variant="link"
                mr={6}
                onClick={() => setShowPredictionModal(true)}
                _hover={{ textDecoration: "none", color: "#2caeba" }}
                css={linkStyles}
              >
                SmartSession
              </Button>
            </>
          ) : (
            <>
              <Button
                as={RouterLink}
                to="/schedule"
                variant="link"
                mr={6}
                isActive={window.location.pathname === "/schedule"}
                _hover={{ textDecoration: "none", color: "#2caeba" }} // Brighten link color on hover
                css={linkStyles} // Apply link styles
              >
                My Schedule
              </Button>
              <Button
                variant="link"
                mr={6}
                onClick={handleTrackTrainingClick}
                isActive={window.location.pathname === "/trackTraining"}
                _hover={{ textDecoration: "none", color: "#2caeba" }} // Brighten link color on hover
                css={linkStyles} // Apply link styles
              >
                Track Training
              </Button>
            </>
          )}
        </Box>
        <Box>
          <Button
            variant="outline"
            fontSize="lg"
            fontWeight="normal"
            borderColor="#1f7a8c"
            color="#1f7a8c"
            _hover={{ borderColor: "#008000", color: "#008000" }}
            onMouseEnter={() => setIsLogoutHovered(true)}
            onMouseLeave={() => setIsLogoutHovered(false)}
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </Box>
      </Flex>

      <Modal isOpen={isUserModalOpen} onClose={handleCloseUserModal} size="3xl">
        <ModalOverlay />
        <ModalContent className="w-full h-4/6 flex justify-center items-center">
          <ModalHeader className="text-center text-lg text-[#022b3a]">
            Create User
          </ModalHeader>
          <ModalCloseButton onClick={handleCloseUserModal} />
          <ModalBody className="flex flex-col items-center justify-center">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-lg border-dashed border-2 border-gray-300 hover:border-gray-400 p-4 w-96 h-48 flex items-center justify-center"
            >
              {csvFile ? (
                <span className="text-gray-600 text-lg font-bold">
                  {csvFile.name}
                </span>
              ) : (
                <span className="text-gray-600 text-lg font-bold">
                  Upload CSV File
                </span>
              )}
              <Input
                id="file-upload"
                type="file"
                onChange={handleCsvChange}
                className="hidden"
              />
            </label>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={handleCloseUserModal}
              _hover={{ backgroundColor: "#89c2d9" }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleNext}
              backgroundColor="#022b3a"
              _hover={{ backgroundColor: "#051923" }}
            >
              Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <MPModal
        isOpen={isModuleModalOpen}
        onClose={handleCloseModuleModal}
        actionType={modalActionType}
      />
      <PredictionModal
        isOpen={showPredictionModal}
        onClose={() => setShowPredictionModal(false)}
      />
    </>
  );
};

export default NavBar;
