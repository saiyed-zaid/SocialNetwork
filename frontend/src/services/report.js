import axios from "axios";

export default class Reportsservice {
  async getYearlyFollower(year, token) {
    const response = await axios(
      `${process.env.REACT_APP_API_URL}/api/reports/yearly/${year}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  }
  async getMonthlyFollower(year, month, token) {
    const response = await axios(
      `${process.env.REACT_APP_API_URL}/api/reports/monthly/${year}/${month}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  }
  async getDailyFollower(token) {
    const response = await axios(
      `${process.env.REACT_APP_API_URL}/api/reports/daily`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  }
}
