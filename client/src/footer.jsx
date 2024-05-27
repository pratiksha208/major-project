import React from "react";
import { Box, Text, Link, Flex, IconButton } from "@chakra-ui/react";
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <Box as="footer" textAlign="center" py="4" bg="purple.800" color="white">
      <Text>&copy; 2024 WordCanvas. All rights reserved.</Text>
      <Text mt="2">
        Developed by{" "}
        <Link color="white" href="#">
          Pratiksha & Pranjali
        </Link>
      </Text>
      <Flex justify="center" mt="4">
        <IconButton
          as={Link}
          href="#"
          aria-label="Twitter"
          icon={<FaTwitter />}
          variant="ghost"
          color="white"
          fontSize="20px"
          mr="2"
        />
        <IconButton
          as={Link}
          href="#"
          aria-label="Instagram"
          icon={<FaInstagram />}
          variant="ghost"
          color="white"
          fontSize="20px"
          mr="2"
        />
        <IconButton
          as={Link}
          href="#"
          aria-label="Facebook"
          icon={<FaFacebook />}
          variant="ghost"
          color="white"
          fontSize="20px"
          mr="2"
        />
        <IconButton
          as={Link}
          href="#"
          aria-label="LinkedIn"
          icon={<FaLinkedin />}
          variant="ghost"
          color="white"
          fontSize="20px"
        />
      </Flex>
      <Text mt="4">Contact us: wordcanvasai@gmail.com</Text>
    </Box>
  );
};

export default Footer;