// src/context/PublicationContext.jsx

import React, { createContext, useState, useEffect } from "react";
import { publicationService } from "../services/publicationService";
import { useAuth } from "../hooks/useAuth";

const PublicationContext = createContext(null);

const PublicationProvider = ({ children }) => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await publicationService.getPublications();
      console.log("API Response:", response);
      
      // Perbaikan: Cek apakah response.data adalah array
      if (response && Array.isArray(response.data)) {
        setPublications(response.data);
      } else if (Array.isArray(response)) {
        setPublications(response);
      } else {
        console.log("Format API tidak sesuai:", response);
        setPublications([]);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching publications:", err);
      setError(err.message);
      setPublications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const addPublication = async (newPub) => {
    try {
      const added = await publicationService.addPublication(newPub);
      setPublications((prev) => [added, ...prev]);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // PERBAIKAN: editPublication sekarang memanggil API untuk update
  const editPublication = async (updatedPub) => {
    try {
      console.log("Updating publication via API:", updatedPub);
      // Panggil API untuk update data di server
      const updated = await publicationService.updatePublication(updatedPub.id, updatedPub);
      
      // Refresh data dari server untuk memastikan data terbaru
      await fetchData();
      
      setError(null);
      return updated;
    } catch (err) {
      console.error("Error updating publication:", err);
      setError(err.message);
      throw err;
    }
  };

  const deletePublication = async (id) => {
    try {
      // Panggil API untuk delete data di server
      await publicationService.deletePublication(id);
      
      // Refresh data dari server setelah delete
      await fetchData();
      
      setError(null);
    } catch (err) {
      console.error("Error deleting publication:", err);
      setError(err.message);
      throw err;
    }
  };

  // Fungsi untuk refresh data manual
  const refetchPublications = async () => {
    await fetchData();
  };

  return (
    <PublicationContext.Provider
      value={{
        publications,
        loading,
        error,
        addPublication,
        editPublication,
        deletePublication,
        refetchPublications,
      }}
    >
      {children}
    </PublicationContext.Provider>
  );
};

export { PublicationContext, PublicationProvider };