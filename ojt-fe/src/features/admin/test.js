import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
// import useRefreshToken from '../../hooks/useRefreshToken';

const Companies = () => {
    const [companies, setCompanies] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    // const refresh = useRefreshToken();
    useEffect(() => {

        let isMounted = true;
        const controller = new AbortController();
        const params = {
            search: "name == F*",
            pageNo: 0,
            pageSize: 20,
            sortBy: "id ASC"
        }
        const getCompanies = async () => {
            try {
                const response = await axiosPrivate.get('/companies', {
                    signal: controller.signal,
                    params
                });
                console.log("a: ", response.data.data);




                // isMounted && setCompanies(response.data);
                if (isMounted) {
                    setCompanies(response.data.data);

                }
            } catch (error) {
                console.error(error);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }
        getCompanies();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    return (
        <article>
            <h2>
                Companies List
            </h2>
            {
                companies?.length ? (
                    <ul>
                        {
                            companies.map((company, i) =>
                            (
                                <li key={i}>
                                    {company?.name}
                                </li>
                            )
                            )
                        }
                    </ul>
                ) : <p>No company to display</p>
            }
            {/* <button
                onClick={() => refresh()}
            >
                Refresh
            </button> */}
        </article>
    )
}
export default Companies;
