// src/components/AddPublicationPage.jsx
import React, { useState } from "react";
import { usePublications } from "../hooks/usePublications";
import { useNavigate } from "react-router-dom";
import { uploadImageToCloudinary } from "../services/publicationService";

export default function AddPublicationPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addPublication } = usePublications();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validasi input form
      if (!title || !releaseDate) {
        setError("Judul dan Tanggal Rilis harus diisi!");
        setLoading(false);
        return;
      }

      let coverUrl = "";

      // Upload gambar jika ada
      if (coverFile) {
        console.log("Uploading cover image...");
        coverUrl = await uploadImageToCloudinary(coverFile);
        console.log("Cover uploaded:", coverUrl);
      } else {
        // Generate placeholder jika tidak ada gambar
        coverUrl = `https://placehold.co/200x280/7f8c8d/ffffff?text=${encodeURIComponent(
          title
        )}`;
      }

      // Membuat objek publikasi baru
      const newPublication = {
        title,
        releaseDate,
        description,
        coverUrl,
      };

      console.log("Adding new publication:", newPublication);

      // Menambah publikasi
      await addPublication(newPublication);
      
      alert("Publikasi berhasil ditambahkan!");
      navigate("/publications");

      // Reset form
      setTitle("");
      setReleaseDate("");
      setDescription("");
      setCoverFile(null);

    } catch (err) {
      console.error("Error adding publication:", err);
      setError("Gagal menambah publikasi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCoverFile(file);
    
    // Clear error jika ada
    if (error) setError("");
  };

  const handleCancel = () => {
    navigate("/publications");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Form Tambah Publikasi Baru
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Judul *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
            placeholder="Contoh: Indikator Ekonomi Provinsi Jawa Tengah 2025"
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Deskripsi
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
            placeholder="Contoh: Publikasi ini membahas Indikator Ekonomi Provinsi Jawa Tengah 2025 secara mendalam."
            rows={4}
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="releaseDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tanggal Rilis *
          </label>
          <input
            type="date"
            id="releaseDate"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="cover"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sampul (Gambar)
          </label>
          <input
            type="file"
            id="cover"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Pilih gambar untuk sampul publikasi (opsional)
          </p>
        </div>

        {/* Preview gambar yang dipilih */}
        {coverFile && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preview Sampul
            </label>
            <img
              src={URL.createObjectURL(coverFile)}
              alt="Preview Sampul"
              className="h-32 w-auto object-cover rounded shadow-md"
            />
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50"
            disabled={loading}
          >
            Batal
          </button>

          <button
            type="submit"
            className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50 flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Menambah...
              </>
            ) : (
              'Tambah'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}