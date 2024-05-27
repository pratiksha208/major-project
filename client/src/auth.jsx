import React from "react";
import {
  Center,
  Image,
  Text,
  Button,
  Stack,
  Heading,
  Input,
  Wrap,
  WrapItem,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { InputGroup, InputRightElement } from "@chakra-ui/react";
import axios from "axios";
import { useGlobalState } from "./global";
import { useNavigate, useNavigation } from "react-router-dom";

const validDomains = [
  "gmail.com",
  "outlook.com",
  "icloud.com",
  "yahoo.com",
  "hotmail.com",
];

function PasswordInput({ isInvalid, error, register }) {
  const passwordField = {
    required: {
      value: (value) => value.trim() !== "",
      message: "This is required",
    },
    minLength: {
      value: (value) => value.length >= 8,
      message: "Minimun length must be 8",
    },
  };

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <FormControl isInvalid={isInvalid}>
      <FormLabel htmlFor="password" fontSize="md">
        Password
      </FormLabel>
      <Wrap>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Enter password"
            width="500px"
            id="password"
            {...register("password", passwordField)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </Wrap>
      <FormErrorMessage>{error && error.message}</FormErrorMessage>
    </FormControl>
  );
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <Wrap>
      <Stack spacing={10} direction="row" align="center">
        <WrapItem>
          <Center w="695px">
            <Image
              src="http://127.0.0.1:8000/api/images/admin-20240129-161447611990.png"
              alt="Pink Lady"
            />
          </Center>
        </WrapItem>
        {isLogin ? (
          <Login switchToSignUp={() => setIsLogin(!isLogin)} />
        ) : (
          <SignUp switchToLogin={() => setIsLogin(!isLogin)} />
        )}
      </Stack>
    </Wrap>
  );
}

function Login({ switchToSignUp }) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  const { isLoggedIn, setIsLoggedIn, isError, setIsError, user, setUser } =
    useGlobalState();

  async function onSubmit(values) {
    try {
      const request = {
        username: values.username,
        password: values.password,
      };
      console.log("REQUEST",request);

      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        request,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      console.log("RESPONSE", response);
      if (response.data.message === "Login successful") {
        setUser(request.username);
        setIsLoggedIn(true);
        navigate("/explorer");
      }
      console.log("USER", user);
        console.log(response.data.message);
    } catch (error) {
      console.error(error);
      // Handle login error, e.g., display an error message to the user
    }
  }

  return (
    <WrapItem>
      <Stack spacing={5} direction="column">
        <Heading as="h2" size="xl">
          Log in to WordCanvas
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.username}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              placeholder="Enter Username"
              {...register("username", {
                required: "This is required",
              })}
            />

            <FormErrorMessage>
              {errors.username && errors.username.message}
            </FormErrorMessage>
          </FormControl>
          <PasswordInput
            register={register}
            isInvalid={errors.password}
            error={errors.password}
          />
          <Button
            mt={4}
            colorScheme="purple"
            size="lg"
            isLoading={isSubmitting}
            type="submit"
          >
            Log In
          </Button>
        </form>

        <Text fontSize="sm">
          <span>Don't have an account? </span>
          <Text
            as="u"
            display="inline-block"
            width="ch"
            onClick={switchToSignUp}
          >
            Sign up!
          </Text>
        </Text>
      </Stack>
    </WrapItem>
  );
}

function SignUp({ switchToLogin }) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const validateEmail = (value) => {
    console.log(value);
    // Valid email domains
    const allowedDomains = [
      "gmail.com",
      "hotmail.com",
      "yahoo.com",
      "icloud.com",
      "outlook.com",
    ];

    // Extract domain from email
    const [, domain] = value.split("@");

    // Check if the domain is allowed
    if (!allowedDomains.includes(domain.toLowerCase())) {
      return "Invalid email domain";
    }

    return true;
  };

  const validateUsername = (value) => {
    if (value.length < 5) {
      return "Username must be at least 5 characters long";
    }

    return true;
  };

  const onSubmit = async (values) => {
    try {
      const request = {
        username: values.username,
        email: values.email,
        password: values.password,
      };
      console.log(values);

      const response = await axios.post(
        "http://127.0.0.1:8000/register",
        request,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <WrapItem>
      <Stack spacing={5} direction="column">
        <Heading as="h2" size="xl">
          Sign Up to WordCanvas
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.username}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              placeholder="Enter Username"
              {...register("username", {
                required: "Username is required",
                validate: validateUsername,
              })}
            />
            <FormErrorMessage>
              {errors.username && errors.username.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              placeholder="Enter Email"
              {...register("email", {
                required: "Email is required",
                validate: validateEmail,
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>


          <PasswordInput
            register={register}
            isInvalid={errors.password}
            error={errors.password}
          />

          <Button
            mt={4}
            colorScheme="purple"
            size="lg"
            isLoading={isSubmitting}
            type="submit"
          >
            Sign Up
          </Button>
        </form>
        <Text fontSize="sm">
          <span>Already have an account? </span>
          <Text
            as="u"
            display="inline-block"
            width="ch"
            onClick={switchToLogin}
          >
            Log In!
          </Text>
        </Text>
      </Stack>
    </WrapItem>
  );
}
