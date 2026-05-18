import ErrorPage from "@/pages/error-page/ErrorPage";
import { Component, type ReactNode } from "react";

interface Props  { children: ReactNode }
interface State  { hasError: boolean; error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Optional: send to Sentry or your error tracker here
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          error={this.state.error ?? undefined}
          onReset={this.handleReset}
        />
      );
    }
    return this.props.children;
  }
}