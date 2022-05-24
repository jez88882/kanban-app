import { useAppContext } from "../context/appContext";

const Alert = () => {
  const { alertType, alertText } = useAppContext()
  const shadow = alertType.length > 0 ? 'shadow-lg' : ''

  return (
    <div className={`p-4 rounded-lg alert-${alertType} ${shadow}`}>
      <span>{alertText}</span>
    </div>

  );
};

export default Alert;