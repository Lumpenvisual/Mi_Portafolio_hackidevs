import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '48px',
            textAlign: 'center',
            fontFamily: 'system-ui',
          }}
        >
          <p>Algo salió mal. Recarga la página para continuar.</p>
        </div>
      )
    }
    return this.props.children
  }
}
