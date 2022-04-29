import { useAppContext } from "../context/appContext";

const Alert = () => {
  const { alertType, alertText } = useAppContext()
  const shadow = alertType.length > 0 ? 'shadow-lg' : ''

  return (
    <div className={`alert alert-${alertType} ${shadow}`}>
      <span>{alertText}</span>
    </div>

  );
};

export default Alert;