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

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  // const [buttonDisabled, setButtonDisabled] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  if (localStorage.getItem("token")) {
    navigate("/profile");
  }

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    setEmailValid(value.trim() !== "");
  };

  const handleTokenChange = (e) => {
    const { value } = e.target;
    setToken(value);
    setTokenValid(value.trim() !== "");
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
    setPasswordValid(value.trim() !== "");
  };

  const handleResetPassword = async () => {
    try {
      await axios.post("http://localhost:3001/resetPassword", {
        email,
        token,
        newPassword: password,
      });

      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");

      // Optionally, you can redirect the user to a login page or any other page
    } catch (error) {
      console.error("Password reset failed:", error.response.data.error);
      toast({
        title: "Password Reset Failed",
        description: error.response.data.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={10}
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      height="auto"
    >
      <Heading as="h2" mb={6} textAlign="center" color="#003049">
        Reset Password
      </Heading>
      <FormControl mb={6}>
        <FormLabel color="#051923">Email address</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          isInvalid={!emailValid && email.trim() !== ""}
          color="#051923"
        />
      </FormControl>
      <FormControl mb={6}>
        <FormLabel color="#051923">Token</FormLabel>
        <Input
          type="text"
          placeholder="Enter the token"
          value={token}
          onChange={handleTokenChange}
          isInvalid={!tokenValid && token.trim() !== ""}
          color="#051923"
        />
      </FormControl>
      <FormControl mb={6}>
        <FormLabel color="#051923">New Password</FormLabel>
        <Input
          type="password"
          placeholder="Enter your new password"
          value={password}
          onChange={handlePasswordChange}
          isInvalid={!passwordValid && password.trim() !== ""}
          color="#051923"
        />
      </FormControl>
      <Button
        colorScheme="white"
        onClick={handleResetPassword}
        mt={6}
        w="100%"
        // isDisabled={buttonDisabled}
        className="bg-[#003049] hover:bg-[#022b3a]"
      >
        Reset Password
      </Button>
    </Box>
  );
};

export default ResetPassword;
