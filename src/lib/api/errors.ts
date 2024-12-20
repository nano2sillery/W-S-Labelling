export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Erreur de connexion au serveur') {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = 'Authentification requise') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}