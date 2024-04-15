import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/Project.jpg";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { GiChemicalBolt } from "react-icons/gi"; // Import the GiChemicalBolt icon

// Import the background image

const LandingPage = () => {
  const navigate = useNavigate();

  if (localStorage.getItem("token")) {
    navigate("/profile");
  }

  const colors = [
    "#89023e",
    // "#db00b6",
    "#3c096c",
    "#240046",
    "#10002b",
    "#000814",
    "#001d3d",
    "#013a63",
  ];
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setColorIndex((colorIndex + 1) % colors.length);
    }, 500); // Change color every 1 second
    return () => clearInterval(intervalId);
  }, [colorIndex, colors.length]);

  return (
    <Box
      position="relative"
      backgroundImage={`url(${backgroundImage})`}
      backgroundSize="80%"
      backgroundPosition="top"
      backgroundAttachment="fixed"
      height="100vh"
      textAlign="center"
      padding="40px"
    >
      <Flex
        position="absolute"
        top="0"
        left="2"
        alignItems="center" // Align items vertically
        color={colors[colorIndex]}
        fontSize="4xl"
        fontWeight="bold"
        zIndex="1"
        textShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
      >
        <Text>Catalyst</Text>
        <GiChemicalBolt style={{ marginLeft: "5px" }} />{" "}
        {/* Include the GiChemicalBolt icon */}
      </Flex>
      <Button
        as={Link}
        to="/login"
        colorScheme="blue"
        size="lg"
        position="absolute"
        top="4"
        right="4"
        bg={colors[colorIndex]}
        color="white"
        zIndex="1"
        transition="background-color 0.8s ease"
      >
        Login
      </Button>
    </Box>
  );
};

export default LandingPage;
