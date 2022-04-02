import axios from 'axios';


const hashGeneratorService = (inputData, round) => {
    return axios.post('http://localhost:3333/hash-input', { inputData, round })

};

const checkMatchService = (inputData, hashedData) => {
    return axios.post('http://localhost:3333/compare-input', { inputData, hashedData })

};



export {
    hashGeneratorService,
    checkMatchService
};