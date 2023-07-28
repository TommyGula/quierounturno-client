import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorHandler from './ErrorHandler';

function MyFallbackComponent({ error, resetErrorBoundary }) {
  console.log("error!!!! ", error.message)
  return <ErrorHandler error={error} resetErrorBoundary={() => resetErrorBoundary()}/>
};

const MyErrorBoundary = ({children}) => {
    return (
        <ErrorBoundary
          FallbackComponent={MyFallbackComponent}
          onReset={() => {
            console.log("Reseting")
          }}
          resetKeys={['someKey']}
        >
          {children}
        </ErrorBoundary>
    )
};

export default MyErrorBoundary