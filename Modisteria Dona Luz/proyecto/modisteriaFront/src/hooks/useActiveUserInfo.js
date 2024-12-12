import { useState, useEffect } from "react";
import axios from "axios";
import { URL_BACK } from "../assets/constants.d";
export default function useActiveUserInfo(id,token) {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    axios
      .get(
        `${URL_BACK}/usuarios/getUserById/${id}`,{headers:{"x-token":token}}
      )
      .then((res) => {
        setUserData(res.data);
      });
  }, []);

  return { userData,setUserData };
}