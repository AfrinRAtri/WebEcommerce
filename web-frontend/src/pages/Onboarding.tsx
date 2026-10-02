import { useNavigate } from "react-router-dom";
import PreferenceFlow from "../components/onboarding/PreferenceFlow";

function Onboarding() {
  const navigate = useNavigate();

  return <PreferenceFlow onFinish={() => navigate("/")} />;
}

export default Onboarding;
