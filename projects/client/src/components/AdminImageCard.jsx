import React, { useState } from 'react'
import { deleteImage, uploadImage } from '../features/productSlice';
import { FaPen, FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import DeleteConfirmationModal from './DeleteConfirmationModal';

function AdminImageCard({ images, productId }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState(null);

  const dispatch = useDispatch();

  const handleImageUpload = async (event, index) => {
    const file = event.target.files[0];

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      alert('Only JPEG/JPG/PNG files are supported');
      return;
    }

    if (file.size > 1000000) { // size limit 1MB
      alert('Maximum size is 1MB');
      return;
    }

    const imageId = images[index]?.product_image_id; // Get the image id, if it exists
    dispatch(uploadImage(file, productId, imageId)); // dispatch the thunk
  }

  const handleDeleteImage = (imageId) => {
    setToBeDeleted(imageId);
    setModalOpen(true);
  };

  const confirmDeleteImage = () => {
    dispatch(deleteImage(toBeDeleted, productId));
    setModalOpen(false);
    setToBeDeleted(null);
  };

  return (
    <div className='flex w-full p-4 gap-2 justify-between border rounded-md'>
      {images.map((image, index) => (
        image ? (
          <div key={index} className="card border shadow-md rounded w-1/3">
            <img src={`${process.env.REACT_APP_API_IMG_URL + image.image_url}`} alt={`Product ${index + 1}`} className="w-full object-cover rounded-t" />
            <div className="p-4">
              <parent className="font-semibold">Image {index + 1}</parent>
              <div className='flex flex-row gap-1 sm:gap-2 mt-2 justify-center'>
                <div className="w-1/2">
                  <div
                    onClick={() => { document.getElementById(`fileInput-${index}`).click(); }}
                    className="flex justify-center items-center gap-2 bg-green-500 hover:bg-green-700 text-white font-semibold py-2 w-full rounded cursor-pointer">
                    <FaPen size={15} />
                    <p className='hidden md:block'>Edit</p>
                  </div>
                  <input
                    id={`fileInput-${index}`}
                    type="file"
                    className="hidden"
                    onChange={(event) => handleImageUpload(event, index)}
                  />
                </div>
                <div className="flex justify-center items-center gap-2 w-1/2 bg-rose-500 hover:bg-rose-700 text-white font-semibold py-2 md:px-4 rounded cursor-pointer"
                  onClick={() => handleDeleteImage(image.product_image_id)}
                >
                  <FaTrash size={15} />
                  <p className='hidden md:block'>Delete</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card border shadow-md rounded w-1/3">
            <div className="p-4">
              <h3 className="font-semibold">Upload New Image</h3>
              <input
                type="file"
                className="mt-2 text-white font-bold rounded w-full"
                onChange={(event) => handleImageUpload(event, index)}
              />
            </div>
          </div>
        )
      ))}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDeleteImage}
      />
    </div>
  )
}

export default AdminImageCard