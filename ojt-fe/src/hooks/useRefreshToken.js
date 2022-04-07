import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const refresh = async () => {
        const response = await axios.post('/api/auth/refresh-token',
            {
                "refreshToken": localStorage.refreshToken
            }
        );
        setAuth(prev => {
            // console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return {
                ...prev,
                roles: localStorage.roles,
                token: response.data.accessToken
            }
        });
        return response.data.accessToken;
    }
    return refresh;
}

export default useRefreshToken