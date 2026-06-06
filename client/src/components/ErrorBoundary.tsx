import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error);
    }
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center h-screen gap-3 p-6 text-center">
          <h1 className="text-xl font-bold text-fg">Something went wrong</h1>
          <p className="text-sm text-fg-muted max-w-md">{this.state.error.message}</p>
          <div className="flex gap-3 mt-2">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-bg-light border border-border-muted text-fg rounded-md text-sm font-medium"
            >
              Try again
            </button>
            <button
              onClick={() => window.location.assign("/login")}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
            >
              Back to login
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
