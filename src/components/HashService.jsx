import axios from 'axios';

const hashGeneratorService = (inputData, round) => {
    return axios.post('https://hash-gen-service.onrender.com/hash-input', { inputData, round })
};

const checkMatchService = (inputData, hashedData) => {
    return axios.post('https://hash-gen-service.onrender.com/compare-input', { inputData, hashedData })
};

export {
    hashGeneratorService,
    checkMatchService
};