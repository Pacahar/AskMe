import React from 'react';
import { useParams } from 'react-router-dom';

function SurveyInfo() {
  const { id } = useParams();
  return <h1>Информация об ответах на опрос #{id}</h1>;
}

export default SurveyInfo;
