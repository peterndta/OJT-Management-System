import useAuth from "./useAuth";

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = () => {
        setAuth({});
        localStorage.removeItem("roles");
        localStorage.removeItem("refreshToken");
        console.clear();
    }

    return logout;
}

export default useLogout