import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  CloseButton,
} from "@chakra-ui/react"
import {useDisclosure, useToast} from "@chakra-ui/react"
import { CopyrightContext } from "../App"
import { useState, useContext } from "react"
import { Web3Context } from "web3-hooks";
import { ethers } from "ethers";

const CreateNFT = ({ value, setValue }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const CPR = useContext(CopyrightContext)
  const [web3State] = useContext(Web3Context);
  const toast = useToast()
  const [loading, setLoading] = useState(false)

    const handleCreateNFT = async () => {
    const content = value.content.trim().split("").filter(el => !['!','?','.',';',':','/',','].includes(el)).join('').split('  ').join('').toLowerCase()
    const contentHashed = await ethers.utils.id(content)
    const nft = {
      contentHash: contentHashed,
      content: content,
      title: value.title,
      author: value.author,
      url: value.url,
      timeStamp: new Date().toDateString()
    }
    setLoading(true)
    try {
      const tx = await CPR.createCopyRight(nft, web3State.account)
      const network = web3State.networkName.toLowerCase()
      const link = `https://${network}.etherscan.io/tx/${tx.hash}`
     
       toast({
        title: 'Transaction sent successfully !',
         render: () => (
            <Box color="white" p={3} bg="green.500" rounded={20}>
              <CloseButton />
              <p style={{fontWeight: "bold", fontSize: "20px"}}>Transaction sent successfully !</p>
              <br />You can view your pending transaction at hash :
              <br /><a target="blank" style={{color: "orange"}} href={link}>{tx.hash}</a>
            </Box>),
        position: 'bottom',
        duration: 9000,
        isClosable: true,
      })
      await tx.wait()
    } catch (e) {
       toast({
        title: 'Error',
        description: e.error ? e.error.message : e.message,
        status: 'error',
        position: 'top-right',
        duration: 9000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={onOpen}
        isLoading={loading}
        loadingText="Submitting"
        colorScheme="teal"
        variant="solid"
        size="lg"
        mt="5" >Create it !</Button>

      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Some more informations</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input 
                value={value.title} 
                onChange={(e) => setValue({...value, title: e.target.value})} 
                placeholder="Very good NFT-text" 
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Author</FormLabel>
              <Input
                value={value.author} 
                onChange={(e) => setValue({...value, author: e.target.value})} 
                placeholder="Michelus"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Image url (optional)</FormLabel>
              <Input
                value={value.url} 
                onChange={(e) => setValue({...value, url: e.target.value})} 
                placeholder="https://www.google.com/your-image.jpg" 
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleCreateNFT} colorScheme="blue" mr={3}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateNFT