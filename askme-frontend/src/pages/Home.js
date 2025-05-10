import { useState } from "react";
import { isAuthenticated } from "../utils/auth.js";

import LoginForm from "../components/forms/LoginForm.js";
import RegisterForm from "../components/forms/RegisterForm.js";
import SurveysList from "../components/surveys/SurveysList.js";
import Header from "../components/Header.js"

import '../components/forms/Form.css'; 

function Home() {
    const [isHaveAcc, setIsHaveAcc] = useState(true);
    const [isAuth, setIsAuth] = useState(isAuthenticated());

    return (
        <div>
            <Header isAuth={isAuth} onLogout={setIsAuth} />
            
            {isAuth ? (
                <SurveysList />
            ) : isHaveAcc ? (
                <LoginForm onChangeForm={setIsHaveAcc} onLogin={setIsAuth} />
            ) : (
                <RegisterForm onChangeForm={setIsHaveAcc} />
            )}
        </div>
    );
}

export default Home;
