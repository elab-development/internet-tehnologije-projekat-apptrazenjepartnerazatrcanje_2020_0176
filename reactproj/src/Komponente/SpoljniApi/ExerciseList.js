import React, { useState } from 'react';
import axios from 'axios';
import './ExerciseList.css'; 

const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState('biceps');
  const [selectedType, setSelectedType] = useState('strength');
  const [selectedDifficulty, setSelectedDifficulty] = useState('beginner');
  const [error, setError] = useState(null);

  const muscleGroups = [
    'abdominals',
    'abductors',
    'adductors',
    'biceps',
    'calves',
    'chest',
    'forearms',
    'glutes',
    'hamstrings',
    'lats',
    'lower_back',
    'middle_back',
    'neck',
    'quadriceps',
    'traps',
    'triceps',
  ];

  const exerciseTypes = [
    'cardio',
    'olympic_weightlifting',
    'plyometrics',
    'powerlifting',
    'strength',
    'stretching',
    'strongman',
  ];

  const difficultyLevels = ['beginner', 'intermediate', 'expert'];

  const handleFetchExercises = async () => {
    try {
      const response = await axios.get('https://api.api-ninjas.com/v1/exercises', {
        headers: { 'X-Api-Key': 'jcWCqSr114CjwUWVpd58L3vDj1sKV6bcdHWVk8pS' },
        params: {
          muscle: selectedMuscle,
          type: selectedType,
          difficulty: selectedDifficulty,
        },
      });
      setExercises(response.data);
    } catch (err) {
      setError('Failed to load exercises.');
      console.error(err);
    }
  };

  const handleMuscleChange = (e) => {
    setSelectedMuscle(e.target.value);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
  };

  return (
    <div className="exercise-list">
      <h2>Select Exercise Parameters</h2>
      <div className="selectors">
        <div className="selector">
          <label>Muscle Group</label>
          <select value={selectedMuscle} onChange={handleMuscleChange} className="muscle-select">
            {muscleGroups.map((muscle, index) => (
              <option key={index} value={muscle}>
                {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="selector">
          <label>Exercise Type</label>
          <select value={selectedType} onChange={handleTypeChange} className="type-select">
            {exerciseTypes.map((type, index) => (
              <option key={index} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="selector">
          <label>Difficulty Level</label>
          <select value={selectedDifficulty} onChange={handleDifficultyChange} className="difficulty-select">
            {difficultyLevels.map((level, index) => (
              <option key={index} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={handleFetchExercises} className="fetch-button">Fetch Exercises</button>

      {error && <p className="error">{error}</p>}
      {!error && exercises.length === 0 && (
        <p className="no-results">No exercises found for the selected criteria.</p>
      )}
      {!error && exercises.length > 0 && (
        <ul>
          {exercises.map((exercise, index) => (
            <li key={index} className="exercise-card">
              <h3>{exercise.name}</h3>
              <p><strong>Type:</strong> {exercise.type}</p>
              <p><strong>Muscle Targeted:</strong> {exercise.muscle}</p>
              <p><strong>Equipment:</strong> {exercise.equipment}</p>
              <p><strong>Difficulty:</strong> {exercise.difficulty}</p>
              <p><strong>Instructions:</strong> {exercise.instructions}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExerciseList;
