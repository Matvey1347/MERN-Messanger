import { Alert } from "react-bootstrap";

const ErrorPreview = ({ error }: { error: string }) => {
  return (<>
    {error ?
      <Alert variant="danger">
        <p className="mb-0 text-center">{error}</p>
      </Alert>
      : ""}
  </>
  );
}

export default ErrorPreview;