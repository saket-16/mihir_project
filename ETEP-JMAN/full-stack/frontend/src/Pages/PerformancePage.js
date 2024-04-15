// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import {
//   Box,
//   Button,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
//   Tab,
//   TabList,
//   TabPanel,
//   TabPanels,
//   Tabs,
// } from "@chakra-ui/react";
// import NavBar from "./NavBar";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../UserContext";

// const PerformancePage = () => {
//   const { userDetails } = useContext(UserContext);
//   const [internData, setInternData] = useState([]);
//   const [employeeData, setEmployeeData] = useState([]);
//   const [selectedData, setSelectedData] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const navigate = useNavigate();

//   const fetchPerformanceData = async (api) => {
//     try {
//       console.log(api);
//       const response = await axios.get(api);
//       console.log(response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Failed to fetch performance data:", error);
//       return [];
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//     }
//     const fetchData = async () => {
//       if (localStorage.getItem("userType") === "intern") {
//         const data = await fetchPerformanceData(
//           "http://localhost:3000/getPerformance/intern"
//         );
//         setInternData(data);
//         setSelectedData(data[0]); // Select the first intern's data by default
//       } else if (localStorage.getItem("userType") === "employee") {
//         const data = await fetchPerformanceData(
//           "http://localhost:3000/getPerformance/employee"
//         );
//         setEmployeeData(data);
//         setSelectedData(data[0]); // Select the first employee's data by default
//       } else if (localStorage.getItem("userType") === "admin") {
//         console.log("hogya bhai");
//         // Fetch both intern and employee data
//         const internData = await fetchPerformanceData(
//           "http://localhost:3000/getPerformance/intern"
//         );
//         setInternData(internData);
//         const employeeData = await fetchPerformanceData(
//           "http://localhost:3000/getPerformance/employee"
//         );
//         setEmployeeData(employeeData);
//         setSelectedData(internData[0]); // Select the first intern's data by default
//       }
//     };

//     fetchData();
//   }, []);

//   const handleTabChange = (index) => {
//     if (index === 0) {
//       setSelectedData(internData);
//     } else {
//       setSelectedData(employeeData);
//     }
//   };

//   const handleCardHover = (data) => {
//     setSelectedData(data);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <>
//       <NavBar />
//       <Box mt={6}>
//         {" "}
//         {/* Add margin-top here */}
//         <Tabs
//           onChange={handleTabChange}
//           variant="soft-rounded"
//           colorScheme="blue"
//           defaultIndex={0}
//         >
//           <TabList>
//             {localStorage.getItem("userType") !== "employee" && (
//               <Tab>Intern</Tab>
//             )}
//             {localStorage.getItem("userType") !== "intern" && (
//               <Tab>Employee</Tab>
//             )}
//           </TabList>
//           <TabPanels>
//             {localStorage.getItem("userType") !== "employee" && (
//               <TabPanel>
//                 <Box
//                   display="grid"
//                   gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
//                   gap={4}
//                 >
//                   {internData.map((data) => (
//                     <Box
//                       key={data.fullName}
//                       p={4}
//                       border="1px solid gray"
//                       borderRadius="md"
//                       cursor="pointer"
//                       onClick={() => handleCardHover(data)}
//                     >
//                       {data.fullName}
//                     </Box>
//                   ))}
//                 </Box>
//               </TabPanel>
//             )}
//             {localStorage.getItem("userType") !== "intern" && (
//               <TabPanel>
//                 <Box
//                   display="grid"
//                   gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
//                   gap={4}
//                 >
//                   {employeeData.map((data) => (
//                     <Box
//                       key={data.fullName}
//                       p={4}
//                       border="1px solid gray"
//                       borderRadius="md"
//                       cursor="pointer"
//                       onClick={() => handleCardHover(data)}
//                     >
//                       {data.fullName}
//                     </Box>
//                   ))}
//                 </Box>
//               </TabPanel>
//             )}
//           </TabPanels>
//           <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
//             <ModalOverlay />
//             <ModalContent>
//               <ModalHeader>Performance Details</ModalHeader>
//               <ModalCloseButton />
//               <ModalBody>
//                 {selectedData && (
//                   <Box>
//                     <Box fontWeight="bold">Name: {selectedData.fullName}</Box>
//                     <Box mt={2} fontWeight="bold">
//                       Scores:
//                     </Box>
//                     <Box mt={1}>
//                       {selectedData.score &&
//                         Object.entries(selectedData.score).map(
//                           ([topic, scores]) => (
//                             <Box key={topic} mt={1}>
//                               {topic}: {scores.join(", ")}
//                             </Box>
//                           )
//                         )}
//                     </Box>
//                   </Box>
//                 )}
//               </ModalBody>
//               <ModalFooter>
//                 <Button colorScheme="blue" onClick={handleCloseModal}>
//                   Close
//                 </Button>
//               </ModalFooter>
//             </ModalContent>
//           </Modal>
//         </Tabs>
//       </Box>
//     </>
//   );
// };

// export default PerformancePage;
