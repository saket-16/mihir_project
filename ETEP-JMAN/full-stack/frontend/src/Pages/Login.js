import React, { useContext, useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Link,
  IconButton,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { setUserDetails } = useContext(UserContext);
  const [headingColor, setHeadingColor] = useState("#1f7a8c");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile");
    }
  }, []);

  useEffect(() => {
    setButtonDisabled(!(emailValid && passwordValid));
  }, [emailValid, passwordValid]);

  useEffect(() => {
    const colors = ["#0096c7", "#0077b6", "#023e8a", "#001d3d"];
    let index = 0;
    const intervalId = setInterval(() => {
      setHeadingColor(colors[index]);
      index = (index + 1) % colors.length;
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleEmailChange = async (e) => {
    const { value } = e.target;
    setEmail(value);

    try {
      // console.log(value);
      const response = await axios.post("http://localhost:3001/emailValidity", {
        email: value,
      });
      // console.log(response);
      setEmailValid(response.data.valid);
    } catch (error) {
      console.error("Email validation error:", error);
    }
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
    setPasswordValid(value.trim() !== "");
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });

      toast({
        title: "Login Successful",
        description: "You have been logged in successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      localStorage.setItem("token", response.data.token);

      const userDetailsResponse = await axios.get(
        "http://localhost:3001/user-details",
        {
          headers: {
            Authorization: `${response.data.token}`,
          },
        }
      );

      // Update UserContext with userDetails
      localStorage.setItem("userType", response.data.userType);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("email", response.data.email);

      setUserDetails(userDetailsResponse.data);
      navigate("/profile");
    } catch (error) {
      console.error("Login failed:", error.response.data.error);
      toast({
        title: "Login Failed",
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
      <Heading
        as="h2"
        mb={6}
        textAlign="center"
        color={headingColor}
        transition="color 0.5s ease"
      >
        Login
      </Heading>
      <FormControl mb={6}>
        <FormLabel color="#051923">Email address</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          isInvalid={!emailValid && email.trim() !== ""}
          pr="2rem"
          position="relative"
          color="#051923"
        />
        {!emailValid && email.trim() !== "" && (
          <FaExclamationCircle
            style={{
              color: "#ba181b",
              position: "absolute",
              right: "10px",
              top: "58%",
              transform: "translateY(25%)",
            }}
          />
        )}
        {emailValid && (
          <FaCheckCircle
            style={{
              color: "#007200",
              position: "absolute",
              right: "10px",
              top: "58%",
              transform: "translateY(25%)",
            }}
          />
        )}
      </FormControl>
      <FormControl mb={6}>
        <FormLabel color="#051923">Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            isReadOnly={!emailValid}
            isInvalid={!passwordValid && password.trim() !== ""}
            color="#051923"
          />
          {password && (
            <InputRightElement>
              <IconButton
                aria-label={showPassword ? "Hide Password" : "Show Password"}
                onClick={() => setShowPassword(!showPassword)}
                variant="ghost"
                colorScheme="white"
                icon={showPassword ? <FaEyeSlash /> : <FaEye />}
              />
            </InputRightElement>
          )}
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="white"
        onClick={handleLogin}
        mt={6}
        w="100%"
        isDisabled={buttonDisabled}
        bgColor="#022b3a"
      >
        Login
      </Button>
      <Link as={RouterLink} to="/sendEmail" color="blue.500" ml={2} mt={3}>
        Forgot Password?
      </Link>
    </Box>
  );
};

export default Login;
