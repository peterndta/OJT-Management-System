import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from '../../hooks/useRefreshToken';
import useAuth from '../../hooks/useAuth';

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setIsLoading(false);
            }
        }
        if (!auth?.accessToken) {
            verifyRefreshToken()
        } else {
            setIsLoading(false)
        }
        // !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    }, [])
    useEffect(() => {
        console.log(`isLoading: ${isLoading}`)
        console.log(`aT: ${JSON.stringify(auth?.token)}`)
    }, [isLoading])

    return (
        <>
            {
                isLoading ? <p>Loading...</p> : <Outlet />
            }
        </>
    )
}
export default PersistLogin
