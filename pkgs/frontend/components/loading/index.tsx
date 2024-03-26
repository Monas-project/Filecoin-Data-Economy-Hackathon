import { OrbitProgress } from "react-loading-indicators";

/**
 * Spinner Component
 * @returns
 */
const Loading = () => {
  return (
    <div className="text-center m-5">
      <OrbitProgress
        color="#cc3189"
        size="large"
        text="wait...."
        textColor=""
      />
    </div>
  );
};

export default Loading;
