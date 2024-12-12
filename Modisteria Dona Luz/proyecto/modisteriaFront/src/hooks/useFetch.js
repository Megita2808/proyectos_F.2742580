import { useState, useCallback } from "react";
import axios from "axios";

export default function useFetch() {
    const [loading, setLoading] = useState(false);

    const triggerFetch = useCallback(async (url, method = 'GET', requestData = null, headers = {}) => {
        setLoading(true);
        try {
            let response;
            const config = { headers };

            switch (method) {
                case 'GET':
                    response = await axios.get(url, config);
                    break;
                case 'POST':
                    response = await axios.post(url, requestData, config);
                    break;
                case 'PUT':
                    response = await axios.put(url, requestData, config);
                    break;
                case 'DELETE':
                    response = await axios.delete(url, config);
                    break;
                default:
                    throw new Error("Método no soportado");
            }

            return { data: response.data, status: response.status };
        } catch (err) {
            const status = err.response ? err.response.status : null;
            const data = err.response ? err.response.data : { message: err.message };
            return { data, status };
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, triggerFetch };
}
