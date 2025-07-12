// src/components/PublicationListPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePublications } from "../hooks/usePublications";

export default function PublicationListPage() {
  const { publications, deletePublication } = usePublications();
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [publicationToDelete, setPublicationToDelete] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());

  const handleEdit = (pub) => {
    navigate(`/publications/edit/${pub.id}`);
  };

  const handleDeleteClick = (pub) => {
    setPublicationToDelete(pub);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!publicationToDelete) return;
    
    setDeleteLoading(publicationToDelete.id);
    try {
      await deletePublication(publicationToDelete.id);      
      setShowConfirmModal(false);
      setPublicationToDelete(null);
    } catch (error) {
      console.error("Error deleting publication:", error);    
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowConfirmModal(false);
    setPublicationToDelete(null);
  };

  const toggleDescription = (pubId) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(pubId)) {
      newExpanded.delete(pubId);
    } else {
      newExpanded.add(pubId);
    }
    setExpandedDescriptions(newExpanded);
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return 'Tidak ada deskripsi';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Daftar Publikasi BPS JAWA TENGAH 
        </h1>
        <p className="text-gray-500 mt-1">Sumber data publikasi terkini</p>
      </header>

      <div className="relative overflow-x-auto shadow-xl rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-white uppercase bg-slate-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-center w-16">
                No
              </th>
              <th scope="col" className="px-6 py-3 min-w-[200px]">
                Judul
              </th>
              <th scope="col" className="px-6 py-3 w-32">
                Tanggal Rilis
              </th>
              <th scope="col" className="px-6 py-3 w-80">
                Deskripsi
              </th>
              <th scope="col" className="px-6 py-3 text-center w-32">
                Sampul
              </th>
              <th scope="col" className="px-6 py-3 text-center w-32">
                AKSI
              </th>
            </tr>
          </thead>

          <tbody>
            {publications.map((pub, idx) => (
              <tr
                key={pub.id}
                className="bg-white border-b hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 font-medium text-gray-900 text-center align-middle">
                  {idx + 1}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-800 text-center align-middle">
                  <div className="min-w-[180px]">
                    {pub.title}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 text-center align-middle">
                  <div className="whitespace-nowrap">
                    {pub.releaseDate}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 align-middle">
                  <div className="max-w-xs min-h-[60px] flex flex-col justify-center">
                    <div className="leading-relaxed">
                      {expandedDescriptions.has(pub.id) ? (
                        <span>{pub.description || 'Tidak ada deskripsi'}</span>
                      ) : (
                        <span>{truncateText(pub.description, 100)}</span>
                      )}
                    </div>
                    {pub.description && pub.description.length > 100 && (
                      <button
                        onClick={() => toggleDescription(pub.id)}
                        className="text-blue-600 hover:text-blue-800 text-xs mt-1 font-medium transition duration-200 self-start"
                      >
                        {expandedDescriptions.has(pub.id) ? 'Sembunyikan' : 'Selengkapnya'}
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <div className="flex justify-center items-center min-h-[96px]">
                    <img
                      src={pub.coverUrl}
                      alt={`Sampul ${pub.title}`}
                      className="h-24 w-auto object-cover rounded shadow-md flex-shrink-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/100x140/cccccc/ffffff?text=Error";
                      }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <div className="flex justify-center items-center space-x-2 min-h-[96px]">
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleEdit(pub)}
                        className="px-3 py-1 text-sm font-medium text-white bg-yellow-400 rounded hover:bg-yellow-500 transition duration-200"
                        disabled={deleteLoading === pub.id}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(pub)}
                        className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={deleteLoading === pub.id}
                      >
                        {deleteLoading === pub.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                            Loading...
                          </>
                        ) : (
                          'Hapus'
                        )}
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Konfirmasi Delete */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Konfirmasi Hapus Publikasi
            </h3>
            <p className="text-gray-600 mb-4">
              Apakah Anda yakin ingin menghapus publikasi "{publicationToDelete?.title}"? 
              file yang terhapus tidak dapat kembali.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition duration-200"
                disabled={deleteLoading === publicationToDelete?.id}
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={deleteLoading === publicationToDelete?.id}
              >
                {deleteLoading === publicationToDelete?.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Menghapus...
                  </>
                ) : (
                  'Hapus'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {publications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📰</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Belum ada publikasi
          </h3>
          <p className="text-gray-500">
            Publikasi yang ditambahkan akan tampil di sini.
          </p>
        </div>
      )}
    </div>
  );
}