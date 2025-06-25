import { useNavigate } from "react-router-dom";


const Button = () => {
    const navigate=useNavigate()
    return (
      <button className="btn" onClick={()=>navigate("/table")}>Таблица</button>
    );
  };

export default Button