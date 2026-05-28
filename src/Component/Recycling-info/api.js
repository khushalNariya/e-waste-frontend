import axios from "axios";

export const fetchRecycle = async () => {

  const res = await axios.get(
    `${process.env.REACT_APP_API_URL || "http://127.0.0.1:1000/"}api/recycle/`
  );

  return res.data;
};
