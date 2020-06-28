import React from 'react';
import './ErrorBoundary.scss';

interface ErrorBoundaryProps {}
interface ErrorBoundaryState {
    hasError:boolean
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props:ErrorBoundaryProps) {
        super(props);

        this.state = {
            hasError: false
        }
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if(this.state.hasError) {
            return(
                <div className="error-boundary">
                    Error<br />
                    We will correct the situation in the near future.
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;