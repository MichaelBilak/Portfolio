"use client";

import { Component, ReactNode } from "react";

interface ContactErrorBoundaryProps {
  children: ReactNode;
}

interface ContactErrorBoundaryState {
  hasError: boolean;
}

export class ContactErrorBoundary extends Component<
  ContactErrorBoundaryProps,
  ContactErrorBoundaryState
> {
  public state: ContactErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ContactErrorBoundaryState {
    return { hasError: true };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-3xl border border-[var(--error)] bg-bgSecondary p-6 text-sm text-red-300">
          Si e verificato un problema nel modulo. Ricarica la pagina e riprova.
        </div>
      );
    }

    return this.props.children;
  }
}
