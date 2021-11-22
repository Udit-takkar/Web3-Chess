import ReactDOM from 'react-dom';
import 'tailwindcss/tailwind.css';

const Portal = Component => props => {
  return ReactDOM.createPortal(
    <Component {...props} />,
    document.getElementById('modal'),
  );
};

export default Portal;
