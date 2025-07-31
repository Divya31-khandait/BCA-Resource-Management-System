import axios from "axios";
export const fetchGQPs = async (token, year, semester) => {
  try {
    const res = await axios.get(`http://localhost:5000/gqp`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { year, semester }
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching GQPs:", err);
    return [];
  }
};