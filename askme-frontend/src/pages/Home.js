import React, { useEffect, useState } from "react";
import { isAuthenticated, getToken, removeToken } from "../utils/auth.js";

import LoginForm from "../components/LoginForm.js";
import RegisterForm from "../components/RegisterForm.js";
import SurveysList from "../components/SurveysList.js";
import Header from "../components/Header.js"


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
