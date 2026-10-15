import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  private readonly authRoutes = [
    '/auth/login',
    '/auth/logout',
    '/users',
    '/chat/flash',
    '/chat/gemini',
    '/local',
  ];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const { method, url, ip, body } = request;
    const userAgent = request.get('user-agent') || 'Unknown';
    const correlationId = uuidv4();
    const userId = request.user?.userId || request.user?.email || 'Anonymous';
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;
    const timestamp = new Date().toISOString();
    const now = Date.now();

    const isAuthRoute = this.authRoutes.some((route) => url.includes(route));

    this.logIncomingRequest({
      correlationId,
      method,
      url,
      userId,
      userAgent,
      ip,
      className,
      handlerName,
      timestamp,
      isAuthRoute,
      body: this.sanitizeBody(body, isAuthRoute),
    });

    return next.handle().pipe(
      tap((responseBody) => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const contentLength = response.get('content-length') || 0;
        const responseTime = Date.now() - now;

        this.logResponse({
          correlationId,
          method,
          url,
          statusCode,
          contentLength,
          responseTime,
          userId,
          isAuthRoute,
          success: true,
          responseBody: this.sanitizeResponseBody(responseBody, isAuthRoute),
        });
      }),
      catchError((error) => {
        const responseTime = Date.now() - now;

        this.logResponse({
          correlationId,
          method,
          url,
          statusCode: error.status || 500,
          contentLength: 0,
          responseTime,
          userId,
          isAuthRoute,
          success: false,
          errorMessage: error.message,
        });

        return throwError(() => error);
      }),
    );
  }

  private logIncomingRequest(params: {
    correlationId: string;
    method: string;
    url: string;
    userId: string;
    userAgent: string;
    ip: string;
    className: string;
    handlerName: string;
    timestamp: string;
    isAuthRoute: boolean;
    body: any;
  }): void {
    const {
      correlationId,
      method,
      url,
      userId,
      userAgent,
      ip,
      className,
      handlerName,
      timestamp,
      isAuthRoute,
      body,
    } = params;

    if (isAuthRoute) {
      this.logger.log(
        `🔐 [${correlationId}] AUTH REQUEST | ` +
          `${method} ${url} | ` +
          `IP: ${ip} | ` +
          `User-Agent: ${userAgent} | ` +
          `Timestamp: ${timestamp} | ` +
          `Email: ${body?.correo_electronico || 'N/A'}`,
      );
    } else {
      this.logger.log(
        `📥 [${correlationId}] INCOMING | ` +
          `${method} ${url} | ` +
          `User: ${userId} | ` +
          `IP: ${ip} | ` +
          `Handler: ${className}.${handlerName} | ` +
          `User-Agent: ${userAgent}`,
      );
    }

    if (Object.keys(body || {}).length > 0) {
      this.logger.debug(
        `[${correlationId}] Request Body: ${JSON.stringify(body)}`,
      );
    }
  }

  private logResponse(params: {
    correlationId: string;
    method: string;
    url: string;
    statusCode: number;
    contentLength: number;
    responseTime: number;
    userId: string;
    isAuthRoute: boolean;
    success: boolean;
    responseBody?: any;
    errorMessage?: string;
  }): void {
    const {
      correlationId,
      method,
      url,
      statusCode,
      contentLength,
      responseTime,
      isAuthRoute,
      success,
      errorMessage,
    } = params;

    const statusEmoji = this.getStatusEmoji(statusCode);
    const performanceIndicator = this.getPerformanceIndicator(responseTime);

    if (isAuthRoute) {
      if (success) {
        this.logger.log(
          `${statusEmoji} [${correlationId}] AUTH RESPONSE | ` +
            `${method} ${url} | ` +
            `Status: ${statusCode} | ` +
            `Time: ${responseTime}ms ${performanceIndicator} | ` +
            `Result: ${statusCode === 200 || statusCode === 201 ? 'LOGIN SUCCESS ✅' : 'LOGIN PROCESSED'}`,
        );
      } else {
        this.logger.warn(
          `${statusEmoji} [${correlationId}] AUTH FAILED | ` +
            `${method} ${url} | ` +
            `Status: ${statusCode} | ` +
            `Time: ${responseTime}ms | ` +
            `Error: ${errorMessage}`,
        );
      }
    } else {
      if (success) {
        this.logger.log(
          `${statusEmoji} [${correlationId}] RESPONSE | ` +
            `${method} ${url} | ` +
            `Status: ${statusCode} | ` +
            `Size: ${contentLength} bytes | ` +
            `Time: ${responseTime}ms ${performanceIndicator}`,
        );
      } else {
        this.logger.error(
          `${statusEmoji} [${correlationId}] ERROR | ` +
            `${method} ${url} | ` +
            `Status: ${statusCode} | ` +
            `Time: ${responseTime}ms | ` +
            `Error: ${errorMessage}`,
        );
      }
    }
  }

  private sanitizeBody(body: any, isAuthRoute: boolean): any {
    if (!body) return {};

    const sanitized = { ...body };

    const sensitiveFields = [
      'password',
      'contraseña',
      'token',
      'accessToken',
      'refreshToken',
    ];

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***HIDDEN***';
      }
    });

    return sanitized;
  }

  private sanitizeResponseBody(body: any, isAuthRoute: boolean): any {
    if (!body || !isAuthRoute) return undefined;

    const sanitized = { ...body };

    if (sanitized.accessToken) {
      sanitized.accessToken = '***TOKEN_HIDDEN***';
    }
    if (sanitized.refreshToken) {
      sanitized.refreshToken = '***TOKEN_HIDDEN***';
    }

    return sanitized;
  }

  private getStatusEmoji(statusCode: number): string {
    if (statusCode >= 200 && statusCode < 300) return '✅';
    if (statusCode >= 300 && statusCode < 400) return '↪️';
    if (statusCode >= 400 && statusCode < 500) return '⚠️';
    if (statusCode >= 500) return '❌';
    return '📋';
  }

  private getPerformanceIndicator(responseTime: number): string {
    if (responseTime < 100) return '⚡ (Excelente)';
    if (responseTime < 500) return '🟢 (Bueno)';
    if (responseTime < 1000) return '🟡 (Aceptable)';
    if (responseTime < 3000) return '🟠 (Lento)';
    return '🔴 (Muy lento)';
  }
}
