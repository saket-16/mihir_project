import React, { useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const SendEmail = () => {
  const [email, setEmail] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  if (localStorage.getItem("token")) {
    navigate("/profile");
  }

  const handleSendResetLink = async () => {
    try {
      // Make API call to send reset link
      await axios.post("http://localhost:3001/forget-password", {
        email,
      });

      // Handle success response
      toast({
        title: "Email Sent",
        description: "Password reset details sent to your email.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/reset-password");
    } catch (error) {
      // Handle error response
      console.error("Failed to send email:", error);
      toast({
        title: "Error",
        description: "Failed to send password reset details.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={20} p={5} borderWidth="1px" borderRadius="lg">
      <Heading as="h2" mb={5} textAlign="center">
        Generate Link
      </Heading>
      <FormControl mb={3}>
        <FormLabel>
          Give the registered email where we can send password reset details
        </FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <Button
        colorScheme=""
        onClick={handleSendResetLink}
        mt={3}
        w="100%"
        className="bg-[#022b3a]"
      >
        Send
      </Button>
    </Box>
  );
};

export default SendEmail;
