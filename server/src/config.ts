import dotenv from 'dotenv';
dotenv.config();
export const JWT_SECRET = process.env.JWT_SECRET;

function setup(){
    if (!JWT_SECRET){
        throw new Error('JWT_SECRET not set');
    }
    return {
        JWT_SECRET
    }
}

export default setup();