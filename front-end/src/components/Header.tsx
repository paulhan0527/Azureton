import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import screwbarLogo from "../public/logo.jpg";
import palette from "../styles/palette";

interface UserProps {
  id: string;
  password: string;
  info: {
    weight: number;
    height: number;
    gender: string;
    age: number;
  };
};

interface IProps {
  loggedIn: boolean;
  setLoggedIn: Function;
  setOpenAiKey: Function;
  user: UserProps|undefined;
};

const Header: React.FC<IProps> = (props: IProps) => {
  const navigate = useNavigate();

  const handleLogOutButton = () => {
    props.setLoggedIn(false);
    props.setOpenAiKey("");
    console.log(props.loggedIn);
    navigate("/");
  }

  const handleLogInButton = () => {
    navigate('/');
  }
  return (
    <Container>
      <div className="header-logo-wrapper">
        <img className="header-logo" src={screwbarLogo} alt="logo" />
      </div>
      <div className="header-auth-buttons">
        {
          props.loggedIn
            ? 
              <div className="logged-in">
                <div className="welcome-user"><span>{ props.user && props.user.id }</span>님 환영합니다</div>
                <button type="button" className="header-signin-button" onClick={handleLogOutButton}>로그아웃</button>
              </div>
            :
              <div className="logged-out">
                <button type="button" className="header-signup-button" onClick={() => navigate('/signup')}>회원가입</button>
                <button type="button" className="header-signin-button" onClick={handleLogInButton}>로그인</button>
              </div>
        }
      </div>
    </Container>
  )
};

export default Header;

const Container = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  height: 10vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 80px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 1px 12px;
  z-index: 10;
  
  .header-logo-wrapper {
    display: flex;
    align-items: center;
    .header-logo {
      width: 70px;
    }
  }

  .header-auth-buttons {
    .logged-in {
      display: flex;
      align-items: center;
      .welcome-user {
        margin-right: 8px;
        span {
          font-weight: bold;
        }
      }
    }
    .header-signup-button {
      height: 42px;
      margin-right: 8px;
      padding: 0 16px;
      border: 0;
      border-radius: 21px;
      background-color: ${palette.iron};
      cursor: pointer;
      outline: none;
      text-decoration: none;
      &:hover {
        box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
      }
    }
    .header-signin-button {
      height: 42px;
      padding: 0 16px;
      border: 0;
      border-radius: 21px;
      background-color: ${palette.iron};
      cursor: pointer;
      outline: none;
      &:hover {
        box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
      }
    }
  }
`;