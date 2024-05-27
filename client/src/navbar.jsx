import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
import {
  Flex,
  Box,
  Spacer,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Text,
} from "@chakra-ui/react";
import { FiUser } from "react-icons/fi";
import { Link as Anchor } from "@chakra-ui/react";
import { useGlobalState } from "./global";

const Navbar = () => {
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn } = useGlobalState(); 

  const handleLogout = () => {
    console.log("Logout successful");
    setUser(null);
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <Flex alignItems="center" padding={4} bg="purple.800" color="white">
      <Box>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Text
            as="span"
            fontFamily="Bodoni Roman, serif"
            fontSize="1.5rem"
            fontWeight="bold"
            color="#fff"
            textTransform="uppercase"
            letterSpacing="2px"
          >
            WordCanvas
          </Text>
        </Link>
      </Box>
      <Spacer />
      <Box>
        <Button
          as={Link}
          to="/explorer"
          colorScheme="whiteAlpha"
          variant="ghost"
          color="white"
        >
          Home
        </Button>
        <Button colorScheme="whiteAlpha" variant="ghost" color="white">
          <Anchor href="#gallery">Gallery</Anchor>
        </Button>

        {/*<Button
          as={Link}
          to="/contact"
          colorScheme="whiteAlpha"
          variant="ghost"
          color="white"
        >
          Contact
        </Button>*/}
        <Menu>
          <MenuButton
            as={Button}
            colorScheme="whiteAlpha"
            variant="ghost"
            color="white"
            _hover={{ bg: "#5E167C", color: "white" }} // Customize hover styles
          >
            <Icon as={FiUser} boxSize={5} />
          </MenuButton>
          <MenuList bg="#34044B" color="black" border="1px solid #5E167C">
            <MenuItem
              _hover={{ bg: "#5E167C", color: "white" }}
              onClick={handleLogout}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};

export default Navbar;
