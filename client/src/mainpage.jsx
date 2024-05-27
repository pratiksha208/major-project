import React, { useState, useEffect } from "react";
import { API_URL } from "./utils/constants";
import {
  Box,
  Stack,
  Heading,
  Input,
  Button,
  Image,
  WrapItem,
  Wrap,
  Text,
  Center,
  ChakraProvider,
  Fade,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "./global";

const MainPage = () => {
  const [inputText, setInputText] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { isLoggedIn, user } = useGlobalState();

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await axios.get(`${API_URL}/gallery-images`);
        setGalleryImages(response.data);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      }
    };
    if (!isLoggedIn) {
      navigate("/");
    } else {
      fetchGalleryImages();
    }
  }, [isLoggedIn, navigate]);

  const handleGenerateImage = async () => {
    setIsLoading(true);
    const imageUrl = await generateImageFromText(inputText);
    setGeneratedImage(imageUrl);
    setIsLoading(false);
  };

  const generateImageFromText = async (text) => {
    const request = {
      username: user,
      prompt: text,
    };
    try {
      const response = await axios.post(`${API_URL}/process-image`, request, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      return `${API_URL}${response.data.url}`;
    } catch (error) {
      console.error(error);
      return "https://via.placeholder.com/400";
    }
  };

  return (
    <ChakraProvider>
      <Box
        bgGradient="linear(to-t, #E6E6FA, #D8BFD8)"
        minH="100vh"
        py="20"
        px="4"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Stack spacing="10" direction="row" align="center">
          {/* Left side */}
          <WrapItem>
            <Stack spacing="5" direction="column">
              <Box
                p="4"
                bg="white"
                borderRadius="md"
                transition="all 0.3s ease"
                _hover={{ boxShadow: "md" }}
              >
                <Heading as="h1" mb="4">
                  WordCanvas
                </Heading>
                <Text mb="4">
                  Create beautiful images from your text with WordCanvas. Enter
                  your text below and click "Generate Image."
                </Text>
                <Input
                  placeholder="Enter text..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  bg="white"
                  color="purple.800"
                  _placeholder={{ color: "purple.400" }}
                  mb="4"
                />
                <Button
                  colorScheme="purple"
                  onClick={handleGenerateImage}
                  px="8"
                  isLoading={isLoading}
                  loadingText="Generating..."
                  spinner={<Spinner color="purple.500" />}
                >
                  Generate Image
                </Button>
              </Box>
            </Stack>
          </WrapItem>

          {/* Right side */}
          <WrapItem>
            <Center>
              <Box
                w="100%"
                h="100%"
                display="flex"
                alignItems="center"
                transition="all 0.3s ease"
                _hover={{ transform: "scale(1.05)" }}
              >
                <Fade in={!!generatedImage}>
                  <Box w="100%" h="100%">
                    {generatedImage ? (
                      <Image
                        src={generatedImage}
                        alt="Generated Image"
                        maxW="500px"
                        maxH="500px"
                      />
                    ) : (
                      <Box p="4" bg="gray.200" h="100%">
                        <Text textAlign="center" fontSize="lg">
                          No image generated yet.
                        </Text>
                      </Box>
                    )}
                  </Box>
                </Fade>
              </Box>
            </Center>
          </WrapItem>
        </Stack>

        {/* Gallery section */}
        <Box id="gallery" textAlign="center" mt="10">
          <Heading as="h2" size="xl" color="purple.800" mb="4">
            Gallery
          </Heading>
          <Text color="purple.800" mb="4">
            Get inspired by exploring images created by other users.
          </Text>
          <Wrap spacing="4" justify="center">
            {!isLoading &&
              galleryImages.map((image, index) => (
                <WrapItem key={index}>
                  <Box w="200px" h="200px" bg="white" borderRadius="md">
                    <Image
                      src={`${API_URL}${image.url}`}
                      alt={`Image ${index + 1}`}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  </Box>
                </WrapItem>
              ))}
          </Wrap>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default MainPage;