// src/services/publicationService.js
import apiClient from "../api/axios";

export const publicationService = {
  async addPublication(newPublication) {
    try {
      console.log("Adding publication:", newPublication);
      const response = await apiClient.post("/publikasi", newPublication);
      console.log("Add publication response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding publication:", error);
      throw new Error(
        "Gagal menambahkan data: " + (error.response?.data?.message ||
          error.message || "Terjadi kesalahan")
      );
    }
  },

  async getPublications() {
    try {
      console.log("Fetching publications from API...");
      const response = await apiClient.get("/publikasi");
      console.log("API Response Status:", response.status);
      console.log("API Response Data:", response.data);
      console.log("API Response Data Type:", typeof response.data);
      console.log("Is Array?", Array.isArray(response.data));
      
      // Log structure jika response.data adalah object
      if (typeof response.data === 'object' && !Array.isArray(response.data)) {
        console.log("Response data keys:", Object.keys(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching publications:", error);
      console.error("Error response:", error.response);
      throw new Error(
        "Gagal mengambil data: " + (error.response?.data?.message ||
          error.message || "Terjadi kesalahan")
      );
    }
  },

  async updatePublication(id, updatedPublication) {
    try {
      console.log("Updating publication:", id, updatedPublication);
      const response = await apiClient.put(`/publikasi/${id}`, updatedPublication);
      console.log("Update publication response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating publication:", error);
      throw new Error(
        "Gagal memperbarui data: " + (error.response?.data?.message ||
          error.message || "Terjadi kesalahan")
      );
    }
  },

  async deletePublication(id) {
    try {
      console.log("Deleting publication:", id);
      const response = await apiClient.delete(`/publikasi/${id}`);
      console.log("Delete publication response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting publication:", error);
      throw new Error(
        "Gagal menghapus data: " + (error.response?.data?.message ||
          error.message || "Terjadi kesalahan")
      );
    }
  },
};

export async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  if (!uploadPreset || !cloudName) {
    throw new Error(
      "Cloudinary config missing: cek VITE_CLOUDINARY_UPLOAD_PRESET dan VITE_CLOUDINARY_CLOUD_NAME di .env"
    );
  }
  
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  
  try {
    console.log("Uploading to Cloudinary...");
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) throw new Error("Upload gagal");
    
    const data = await response.json();
    console.log("Cloudinary upload success:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Gagal upload ke Cloudinary: " + error.message);
  }
}