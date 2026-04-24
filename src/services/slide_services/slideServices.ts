import apiInstance from "../../apis/apiInstance";

export const getSlides = async () => {
  const res = await apiInstance.get("/api/Slide");
  return res.data.data;
};
