import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
    Box, Button, Collapse, Container, Flex, FormControl, Heading, HStack, Input, InputGroup,
    InputRightElement, Modal, ModalBody,
    ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, useClipboard, useColorMode, useDisclosure, useNumberInput,
    VStack
} from '@chakra-ui/react';
import { QRCodeCanvas } from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { checkMatchService, hashGeneratorService } from './HashService';


const HashForm = () => {

    const [rounds, setRounds] = useState();
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
    const { isOpen: isOpenQR, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        let currentRound = input['aria-valuenow']
        setRounds(currentRound);

        const doHash = async () => {
            let res = await hashGeneratorService(textInput, parseInt(currentRound));
            setResult(res.data.result)
        }
        doHash().catch(console.error())
    }, [textInput, input['aria-valuenow']])


    const handleCheckMatchInput = async () => {
        //if (textInputToCompare === '' || hashedInput === '') {setIsValid(!isValid);}
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

    const onDownloadQr = () => {
        const qrImageCanvas = document.getElementById('qrCodeD');

        const qrImageURL = qrImageCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        let downloadLink = document.createElement('a');
        downloadLink.href = qrImageURL;
        downloadLink.download = 'qrcode_xuandai-py@github.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

    }

    // quick validate
    return (
        <Container maxWidth='100%' h='100vh' padding='0px'>
            <Box bgColor='rgba(31,41,55,1)' p='5px'>
                <HStack>
                    <Heading size={{ base: 'md', md: 'xl' }} fontWeight='600' color='white'>Bcrypt-Generator - Hash Generator & Checker</Heading>
                    <Spacer />
                    <Button onClick={toggleColorMode} variant={'outline'} color='white' bgColor='rgba(31,41,55,1)' _hover={{ background: 'none' }} >
                        {colorMode === 'light' ? 'Dark' : 'Light'}
                    </Button>
                </HStack>
            </Box>
            <Flex m='10px' direction={{ base: 'column', md: 'column', lg: 'row', }}>
                <Box p='4' border='teal 2px solid' flex='1' m='5'>
                    <VStack gap='20px'>
                        <Heading>Encrypt</Heading>
                        <Heading size='sm'>Encrypt some text. The result shown will be a Bcrypt encrypted hash.</Heading>
                        <Collapse in={isOpenHashField} animateOpacity>
                            <Box
                                p='5px'
                                color='white'
                                mt='4'
                                mb='1'
                                bg='teal.500'
                                rounded='md'
                                shadow='md'
                                as='h3'
                                lineHeight='tight'
                                w={['sm', 'md', 'lg']}
                            >
                                {!result ? 'Hey there, type something in that field below' : result}
                            </Box>
                            <Button h='1.75rem' size='sm' onClick={onCopy}>
                                {hasCopied ? 'Copied' : 'Copy'}
                            </Button>
                            <Button ml={2} h='1.75rem' size='sm' onClick={onOpen}>
                                QR
                            </Button>
                            {/* /Open/preview QR code generated from hashed input */}
                            <Modal isOpen={isOpenQR} onClose={onClose}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>QR code from hashed input</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody align="center">
                                        {result ?
                                            <QRCodeCanvas
                                                id="qrCodeD"
                                                title="QR code from hashed input"
                                                value={result}
                                                level={"H"}
                                                includeMargin={true}
                                                size={250} />
                                            : "Failed to generate QR code"
                                        }
                                    </ModalBody>
                                    <ModalFooter >
                                        <Button colorScheme='blue' mr={3} onClick={onDownloadQr}>
                                            Download
                                        </Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>

                        </Collapse>

                        <FormControl isRequired>
                            <InputGroup>
                                <Input id='text-input' size={'lg'} placeholder='*Text input' value={textInput} onChange={event => setTextInput(event.target.value)} />
                                <InputRightElement width='4.5rem'>
                                    <Button h={'full'} mt={2} size='sm' onClick={onToggleHashField} textTransform={'uppercase'}>
                                        Hash
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        {input['aria-valuenow'] >= 15 &&
                            <Heading size='sm'>* It might be delay somehow since the round number increasing.</Heading>
                        }
                        <HStack maxW='320px'>
                            <Button {...inc}>+</Button>
                            <Input w={{ base: '100px', md: 'auto' }} {...input} textAlign='center' />
                            <Button {...dec}>-</Button>
                        </HStack>
                    </VStack>
                </Box>

                <Box p='4' border='teal 2px solid' flex='1' m='5'>
                    <VStack gap='20px'>
                        <Heading>Decrypt</Heading>
                        <Heading size='sm'>Decrypt hashed text - check matching.</Heading>
                        <Collapse in="isOpenHashField" animateOpacity>
                            <Box
                                p='5px'
                                color='white'
                                mt='4'
                                bg='teal.500'
                                rounded='md'
                                shadow='md'
                            >
                                <Text textTransform={'uppercase'}>
                                    {match ? 'Match' : 'No match'}
                                </Text>
                            </Box>
                        </Collapse>

                        <FormControl >
                            <InputGroup display='block' >
                                <Input id='text-input' mb='20px' placeholder='*Text input' value={textInputToCompare} onChange={event => setTextInputToCompare(event.target.value)} />
                                <Input id='hashed-input' placeholder='*Hashed input' value={hashedInput} onChange={event => setHashedInput(event.target.value)} />
                            </InputGroup>
                        </FormControl>
                        <Button rightIcon={<ArrowForwardIcon />} colorScheme='teal' variant='outline' textTransform={'uppercase'} onClick={handleCheckMatchInput}>
                            Check
                        </Button>
                    </VStack>
                </Box>
            </Flex>
        </Container>
    )

}

export default HashForm







































