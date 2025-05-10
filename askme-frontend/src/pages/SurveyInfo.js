import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import SurveyResponses from '../components/surveys-info/SurveyResponses';

function SurveyInfo() {
  const { id } = useParams();
  return <div>
    <Header />
    <SurveyResponses survey_id={id}/>
  </div>;
}

export default SurveyInfo;
