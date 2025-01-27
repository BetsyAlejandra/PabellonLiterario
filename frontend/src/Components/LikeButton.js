import React, { useState } from 'react';

const LikeButton = ({ episodeId, likes }) => {
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/audio-dramas/${episodeId}/like`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Error al dar like');

      setLikeCount((prev) => prev + 1);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <button onClick={handleLike} className="btn btn-outline-primary">
      Me gusta ({likeCount})
    </button>
  );
};

export default LikeButton;