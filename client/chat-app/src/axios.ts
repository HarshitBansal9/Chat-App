import axios from "axios";


const dataFetch = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
        'jwt_token':''
    }
})
export default dataFetch;