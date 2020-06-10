import axios from "axios";

export default class Reportsservice {
  async getYearlyReport(year, token) {
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
  async getMonthlyReport(year, month, token) {
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
  async getDailyReport(token) {
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
