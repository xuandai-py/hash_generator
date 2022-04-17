import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
    Box, Button, Collapse, Container, Flex, FormControl, FormErrorMessage, Heading, HStack, Input, InputGroup,
    InputRightElement, Modal, ModalBody,
    ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spacer, useClipboard, useColorMode, useDisclosure, useNumberInput,
    VStack
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { checkMatchService, hashGeneratorService } from './HashService';
import { QRCodeCanvas } from 'qrcode.react';


const HashForm = () => {

    const [rounds, setRounds] = useState();
    //const [isValid, setIsValid] = useState(true);
    const [textInput, setTextInput] = useState('');
    const [result, setResult] = useState('');
    
    const [textInputToCompare, setTextInputToCompare] = useState('');
    const [hashedInput, setHashedInput] = useState('');
    const isError = textInputToCompare === '' || hashedInput === ''

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

    const onDownloadQr = () => {
        // const qrImageSVG = document.getElementById('qrCodeD');
        // let { width, height } = qrImageSVG.get;
        // let image = new Image();
        // image.onload = () => {
        //     let canvas = document.createElement('canvas');
        //     canvas.width = width;
        //     canvas.height = height;
        //     let context = canvas.getContext('2d');
        //     context.drawImage(image, 0, 0, width, height);
        //     const qrImageURL = qrImage.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        //     let downloadLink = document.createElement('a');
        //     downloadLink.href = qrImageURL;
        //     downloadLink.download = 'qrcode_xuandai-py@github.png';
        //     document.body.appendChild(downloadLink);
        //     downloadLink.click();
        //     document.body.removeChild(downloadLink);
        // }
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
                    <Heading size='lg' fontWeight='600' color='white'>Bcrypt-Generator.com - Online Bcrypt Hash Generator & Checker</Heading>
                    <Spacer />
                    <Button onClick={toggleColorMode} color='white' bgColor='rgba(31,41,55,1)' outline='none'>
                        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
                    </Button>
                </HStack>
            </Box>
            <Flex m='10px' direction={{ base: 'column', md: 'column', lg: 'row', }}>
                <Box p='4' border='green 1px solid' flex='1' m='5'>
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
                        {/* <Select variant='flushed' placeholder='Select algorithm' >
                            {alg.map((index, item) => {
                                return (
                                    <option key={index}>{item}</option>
                                )


                            })}
                        </Select> */}
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
                            <Heading size='sm'>* It might be delay somehow since the round number increasing.</Heading>
                        }
                        <HStack maxW='320px'>
                            <Button {...inc}>+</Button>
                            <Input w='auto' {...input} textAlign='center' />
                            <Button {...dec}>-</Button>
                        </HStack>
                    </VStack>
                </Box>

                <Box p='4' border='green 1px solid' flex='1' m='5'>
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

                                {/* {!isError ? (
                                    <FormHelperText>
                                        Enter the text and hashed you'd like to compare                                    </FormHelperText>
                                ) : (
                                    <FormErrorMessage>All fields is required.</FormErrorMessage>
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







































