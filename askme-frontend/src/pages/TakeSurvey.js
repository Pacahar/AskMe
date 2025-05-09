import React from 'react';
import { useParams } from 'react-router-dom';

import Header from '../components/Header';
import SurveyComponent from '../components/questions/SurveyComponent';

function TakeSurvey() {
  const { id } = useParams();
  return <div>
    <Header/>
    <SurveyComponent />
  </div>;
  
  
}

export default TakeSurvey;
