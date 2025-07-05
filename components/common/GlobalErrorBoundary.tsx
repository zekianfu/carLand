import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleRetry = () => {
    // This is a naive retry. For a real app, you might want to
    // reset some state or navigate to a safe screen.
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    // Potentially, you could try to re-mount children by changing a key,
    // or trigger a specific recovery action if passed via props.
  };

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oops! Something went wrong.</Text>
          <Text style={styles.subtitle}>We're sorry for the inconvenience. Please try again.</Text>

          <Button title="Try Again" onPress={this.handleRetry} color="#F59E0B" />

          {__DEV__ && this.state.error && ( // Show details only in development
            <ScrollView style={styles.errorDetailsContainer}>
              <Text style={styles.errorTextTitle}>Error Details (Dev Only):</Text>
              <Text style={styles.errorText}>{this.state.error.toString()}</Text>
              {this.state.errorInfo && (
                <Text style={styles.errorText}>{this.state.errorInfo.componentStack}</Text>
              )}
            </ScrollView>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1F2937', // Dark background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#D1D5DB', // Light gray text
    textAlign: 'center',
    marginBottom: 20,
  },
  errorDetailsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#374151', // Slightly lighter dark
    borderRadius: 8,
    maxHeight: 200, // Limit height for scrollability
  },
  errorTextTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FDBA74', // Amber-300 for dev details title
    marginBottom: 5,
  },
  errorText: {
    fontSize: 12,
    color: '#E5E7EB', // Gray-200 for dev details text
  },
});

export default GlobalErrorBoundary;
