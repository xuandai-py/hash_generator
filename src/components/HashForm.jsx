import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ArrowForwardIcon } from '@chakra-ui/icons'
import {
    FormControl,
    FormLabel,
    Input,
    Flex,

    Box,
    Spacer,
    Heading,
    Button,
    Container,
    HStack,
    useNumberInput,
    VStack,
    Select,
    useColorMode,
    Collapse,
    useDisclosure,
    InputGroup,
    InputRightElement,
    FormHelperText,
    FormErrorMessage,
    useClipboard
} from '@chakra-ui/react'
import { hashGeneratorService, checkMatchService } from './HashService';



const HashForm = () => {

    const [rounds, setRounds] = useState();
    const [isValid, setIsValid] = useState(true);

    const [textInput, setTextInput] = useState('');
    const [result, setResult] = useState('');

    const [textInputToCompare, setTextInputToCompare] = useState('');
    const [hashedInput, setHashedInput] = useState('');

    const [match, setMatch] = useState(false);
    const { hasCopied, onCopy } = useClipboard(result)

    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
        useNumberInput({
            step: 1,
            defaultValue: 10,
            min: 1,
            max: 100,

        })
    const alg = ['sha1', 'sha256', 'sha384', 'sha512']
    const inc = getIncrementButtonProps()
    const dec = getDecrementButtonProps()
    const input = getInputProps({ isReadOnly: true })
    const { colorMode, toggleColorMode } = useColorMode()
    const { isOpen: isOpenHashField, onToggle: onToggleHashField } = useDisclosure()
    const { isOpen: isOpenMatchField, onToggle: onToggleMatchField } = useDisclosure()



    useEffect(() => {
        let currentRound = input['aria-valuenow']
        setRounds(currentRound);

        const doHash = async () => {
            let res = await hashGeneratorService(textInput, parseInt(currentRound));
            console.log('event: ', res);
            setResult(res.data.result)
        }

        doHash().catch(console.error())
        console.log('textInput: ', textInput);
    }, [textInput, input['aria-valuenow']])


    const handleCheckMatchInput = async () => {
        //if (textInputToCompare === '' || hashedInput === '') {setIsValid(!isValid);}
        console.log("checkMatchInput: ", textInputToCompare, hashedInput);
        try {

            let result = await checkMatchService(textInputToCompare, hashedInput);
            console.log(result);
            setMatch(result.data.result);
            setTimeout(onToggleMatchField())
            // onToggleMatchField();
        } catch (error) {
            console.error("handleCheckMatchInput: ", error);
        }
    }


    return (

        <Container maxWidth='100%' h='100vh' padding='0px'>
            <Box bgColor='rgba(31,41,55,1)'>
                <HStack>
                    <Heading size='lg' fontWeight='600' color='white'>Bcrypt-Generator.com - Online Bcrypt Hash Generator & Checker</Heading>
                    <Spacer />
                    <Button onClick={toggleColorMode} bgColor='rgba(31,41,55,1)' outline='none'>
                        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
                    </Button>
                </HStack>
            </Box>
            <Flex m='10px'>
                <Box p='4' border='green 1px solid' w='49%'>
                    <VStack gap='20px'>
                        <Heading>Encrypt</Heading>
                        <Heading size='sm'>Encrypt some text. The result shown will be a Bcrypt encrypted hash.</Heading>
                        <Collapse in={isOpenHashField} animateOpacity>
                            <Box
                                p='5px'
                                color='white'
                                mt='4'
                                bg='teal.500'
                                rounded='md'
                                shadow='md'

                            >
                                {!result ? 'Hey there, type something in that field below' : result}

                            </Box>
                            <Button h='1.75rem' size='sm' onClick={onCopy()}>
                                {hasCopied ? 'Copied' : 'Copy'}
                            </Button>

                        </Collapse>
                        <Select variant='flushed' placeholder='Select algorithm' >
                            {alg.map((index, item) => {
                                return (
                                    <option key={index}>{item}</option>
                                )


                            })}
                        </Select>
                        {/* <Select placeholder='Select option'>
                            <option value='option1'>{alg[1]}</option>
                            <option value='option2'>Option 2</option>
                            <option value='option3'>Option 3</option>
                        </Select> */}
                        <FormControl isRequired>
                            <InputGroup>
                                <Input id='text-input' placeholder='*Text input' value={textInput} onChange={event => setTextInput(event.target.value)} />

                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={onToggleHashField}>
                                        Hash1
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        {input['aria-valuenow'] >= 15 &&
                            <Heading size='sm'>* The higher round number, the longer time would take.</Heading>
                        }
                        <HStack maxW='320px'>
                            <Button {...inc}>+</Button>
                            <Input w='auto' {...input} textAlign='center' />
                            <Button {...dec}>-</Button>
                        </HStack>
                    </VStack>
                </Box>
                <Spacer />
                <Box p='4' border='green 1px solid' w='49%'>
                    <VStack gap='20px'>
                        <Heading>Encrypt</Heading>
                        <Heading size='sm'>Encrypt some text. The result shown will be a Bcrypt encrypted hash.</Heading>
                        <Collapse in="isOpenHashField" animateOpacity>
                            <Box
                                p='5px'
                                color='white'
                                mt='4'
                                bg='teal.500'
                                rounded='md'
                                shadow='md'

                            >
                                {match ? 'Match' : 'No match'}
                            </Box>
                        </Collapse>

                        <FormControl >
                            <InputGroup display='block' >
                                <Input id='text-input' mb='20px' placeholder='*Text input' value={textInputToCompare} onChange={event => setTextInputToCompare(event.target.value)} />
                                <Input id='hashed-input' placeholder='*Hashed input' value={hashedInput} onChange={event => setHashedInput(event.target.value)} />

                                {/* {!isValid ? (
                                    <FormHelperText>
                                        Enter the email you'd like to receive the newsletter on.
                                    </FormHelperText>
                                ) : (
                                    <FormErrorMessage>Email is required.</FormErrorMessage>
                                )} */}
                            </InputGroup>
                        </FormControl>
                        <Button rightIcon={<ArrowForwardIcon />} colorScheme='teal' variant='outline' onClick={handleCheckMatchInput}>
                            Check
                        </Button>
                    </VStack>
                </Box>
            </Flex>
            <div className='hash-form'>

            </div>
        </Container>
    )

}

export default HashForm