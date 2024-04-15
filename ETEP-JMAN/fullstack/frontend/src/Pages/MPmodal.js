import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Select,
  Input,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import Papa from "papaparse";

const MPModal = ({ isOpen, onClose, actionType }) => {
  const [moduleType, setModuleType] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const toast = useToast();

  const handleModuleTypeChange = (event) => {
    setModuleType(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCsvFile(file);
  };

  const handleAction = async () => {
    if (!moduleType || !csvFile) {
      toast({
        title: "Error",
        description: "Please select module type and upload a CSV file.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const csvData = event.target.result;
      const parsedData = Papa.parse(csvData, { header: true }).data;

      try {
        const requestData = {
          moduleType,
          file: parsedData,
        };

        // Determine API endpoint based on actionType
        const apiEndpoint =
          actionType === "newModule"
            ? "http://localhost:3001/createModule"
            : "http://localhost:3001/performance";

        await axios.post(apiEndpoint, requestData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        toast({
          title: "Action Completed",
          description: `${
            actionType === "newModule" ? "New Module" : "Performance"
          } has been ${
            actionType === "newModule" ? "created" : "uploaded"
          } successfully.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        onClose();
      } catch (error) {
        console.error("Error performing action:", error);
        toast({
          title: "Error",
          description: `An error occurred while ${
            actionType === "newModule" ? "creating" : "uploading"
          } the ${actionType === "newModule" ? "new module" : "performance"}.`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    reader.readAsText(csvFile); // Read the uploaded CSV file as text
  };

  const handleCsvChange = (event) => {
    const file = event.target.files[0];
    setCsvFile(file);
  };

  const handleNext = async () => {
    // Handling the upload action
    handleAction();
  };

  // Reset modal state on close or cancel
  const handleCloseModal = () => {
    setModuleType("");
    setCsvFile(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="text-center text-lg text-[#022b3a] p-2">
          <span>
            {actionType === "newModule"
              ? "Create New Module"
              : "Upload Performance"}
          </span>
        </ModalHeader>
        <ModalCloseButton onClick={handleCloseModal} />
        <ModalBody className="flex flex-col items-center justify-center">
          <FormControl mb={4}>
            <FormLabel>User Type</FormLabel>
            <Select value={moduleType} onChange={handleModuleTypeChange}>
              <option value="">Select user type</option>
              <option value="intern">Intern</option>
              <option value="employee">Employee</option>
            </Select>
          </FormControl>
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer bg-white rounded-lg border-dashed border-2 border-gray-300 hover:border-gray-400 p-4 w-96 h-64 flex items-center justify-center mb-4"
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
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button
            variant="outline"
            mr={3}
            onClick={handleCloseModal}
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
            {actionType === "newModule" ? "Create" : "Upload"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MPModal;
