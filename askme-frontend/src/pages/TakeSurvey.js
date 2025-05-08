import React from 'react';
import { useParams } from 'react-router-dom';

function TakeSurvey() {
  const { id } = useParams();
  return <h1>Прохождение опроса #{id}</h1>;
}

export default TakeSurvey;
