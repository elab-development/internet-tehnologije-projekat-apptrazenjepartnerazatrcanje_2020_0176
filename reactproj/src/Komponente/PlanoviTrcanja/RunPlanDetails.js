import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RunPlanDetails = () => {
  const { id } = useParams(); // Uzmi ID iz URL-a
  const [runPlan, setRunPlan] = useState(null);
  const [comments, setComments] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('auth_token'); // Dohvati token iz session storage-a

    // Funkcija za dohvat podataka o planu
    const fetchRunPlan = async () => {
      try {
        const planResponse = await axios.get(`http://127.0.0.1:8000/api/run-plans/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRunPlan(planResponse.data.data);

        const commentsResponse = await axios.get(`http://127.0.0.1:8000/api/comments?run_plan_id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComments(commentsResponse.data.data);

        const participantsResponse = await axios.get(`http://127.0.0.1:8000/api/run-participants?run_plan_id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setParticipants(participantsResponse.data.data);

      } catch (err) {
        setError('Failed to load plan details.');
        console.error(err);
      }
    };

    fetchRunPlan();
  }, [id]);

  const handleDeleteParticipant = async (participantId) => {
    try {
      const token = sessionStorage.getItem('auth_token');
      await axios.delete(`http://127.0.0.1:8000/api/run-participants/${participantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Ažuriraj listu učesnika nakon brisanja
      setParticipants(participants.filter(participant => participant.id !== participantId));
    } catch (err) {
      setError('Failed to remove participant.');
      console.error(err);
    }
  };

  if (error) return <p>{error}</p>;
  if (!runPlan) return <p>Loading...</p>;

  return (
    <div className="run-plan-details">
      <h2>{runPlan.location}</h2>
      <p>Date and Time: {runPlan.time}</p>
      <p>Distance: {runPlan.distance} km</p>
      <p>Latitude: {runPlan.latitude}</p>
      <p>Longitude: {runPlan.longitude}</p>

      <h3>Participants ({participants.length})</h3>
      <ul>
        {participants.map(participant => (
          <li key={participant.id}>
            {participant.user.name}
            <button 
              onClick={() => handleDeleteParticipant(participant.id)} 
              className="delete-participant-button"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <h3>Comments ({comments.length})</h3>
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>
            <strong>{comment.user.name}:</strong> {comment.comment}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RunPlanDetails;
