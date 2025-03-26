import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from "react-icons/fa";
const CommentSection = ({ planId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false); // Stanje za prikazivanje svih komentara
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch existing comments for the plan
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/comments?run_plan_id=${planId}`);
        setComments(response.data.data); 
      } catch (err) {
        setError('Failed to load comments.');
      }
    };

    fetchComments();
  }, [planId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = sessionStorage.getItem('auth_token');
      const response = await axios.post(
        'http://127.0.0.1:8000/api/comments',
        { run_plan_id: planId, comment: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([...comments, response.data.data]); // Dodaj novi komentar u stanje
      setNewComment(''); // Očisti unos
    } catch (err) {
      setError('Failed to add comment.');
    }
  };

  const toggleComments = () => {
    setShowAllComments(!showAllComments);
  };

  const lastComment = comments[comments.length - 1]; // Poslednji komentar

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      {comments.length > 0 && !showAllComments && lastComment && (
        <div className="comment">
          <p><strong>{lastComment.user.name}:</strong> {lastComment.comment}</p>
        </div>
      )}

      {showAllComments && comments.map(comment => (
        <div key={comment.id} className="comment">
          <p><strong>{comment.user.name}:</strong> {comment.comment}</p>
        </div>
      ))}

      {comments.length > 1 && (
        <button onClick={toggleComments}>
          {showAllComments ? 'Show Less' : 'Show All Comments'}
        </button>
      )}

      <form onSubmit={handleAddComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          required
        />
        <button type="submit"><FaPlus></FaPlus></button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CommentSection;
