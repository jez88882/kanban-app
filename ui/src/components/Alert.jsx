import { useAppContext } from "../context/appContext";

const Alert = () => {
  const { alertType, alertText } = useAppContext()
  const shadow = alertType.length > 0 ? 'shadow-lg' : ''

  return (
    <div className={`p-4 rounded-lg alert-${alertType} ${shadow} absolute right-0 top-28 h-15 w-6/12 text-white font-bold z-50`}>
      <span>{alertText}</span>
    </div>

  );
};

export default Alert;