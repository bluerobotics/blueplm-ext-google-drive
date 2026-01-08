/**
 * Extension API Type Definitions
 * 
 * These types define the API available to BluePLM extensions.
 * In production, these would come from @blueplm/extension-api package.
 * 
 * @module types/extension-api
 */

// ============================================
// Disposable Pattern
// ============================================

/**
 * Disposable pattern for cleanup
 */
export interface Disposable {
  dispose(): void
}

// ============================================
// Extension Context
// ============================================

/**
 * Extension context passed to activate()
 */
export interface ExtensionContext {
  extensionId: string
  extensionPath: string
  storagePath: string
  subscriptions: Disposable[]
  log: ExtensionLogger
}

/**
 * Extension logger interface
 */
export interface ExtensionLogger {
  debug(message: string, ...args: unknown[]): void
  info(message: string, ...args: unknown[]): void
  warn(message: string, ...args: unknown[]): void
  error(message: string, ...args: unknown[]): void
}

// ============================================
// UI Types
// ============================================

/**
 * Dialog options
 */
export interface DialogOptions {
  title: string
  message: string
  type: 'info' | 'confirm' | 'warning' | 'error'
  confirmText?: string
  cancelText?: string
}

/**
 * Dialog result
 */
export interface DialogResult {
  confirmed: boolean
}

/**
 * Progress options
 */
export interface ProgressOptions {
  title: string
  cancellable?: boolean
}

/**
 * Progress reporter
 */
export interface Progress {
  report(value: { message?: string; increment?: number }): void
}

/**
 * Cancellation token
 */
export interface CancellationToken {
  isCancellationRequested: boolean
}

// ============================================
// Workspace Types
// ============================================

/**
 * File change event
 */
export interface FileChangeEvent {
  type: 'created' | 'changed' | 'deleted'
  path: string
  vaultId: string
}

// ============================================
// API Response
// ============================================

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  ok: boolean
  data: T
  error?: string
}

// ============================================
// Extension Client API
// ============================================

/**
 * Client-side API available to extensions
 */
export interface ExtensionClientAPI {
  /**
   * UI operations
   */
  ui: {
    showToast(message: string, type: 'success' | 'error' | 'info'): void
    showDialog(options: DialogOptions): Promise<DialogResult>
    setStatus(status: 'online' | 'offline' | 'partial' | 'checking'): void
    showProgress<T>(
      options: ProgressOptions,
      task: (progress: Progress, token: CancellationToken) => Promise<T>
    ): Promise<T>
  }

  /**
   * Extension-scoped storage (local)
   */
  storage: {
    get<T>(key: string): Promise<T | undefined>
    set<T>(key: string, value: T): Promise<void>
    delete(key: string): Promise<void>
    keys(): Promise<string[]>
  }

  /**
   * Network operations
   */
  callOrgApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>>

  /**
   * Commands
   */
  commands: {
    registerCommand(id: string, handler: (...args: unknown[]) => unknown): Disposable
    executeCommand<T>(id: string, ...args: unknown[]): Promise<T>
  }

  /**
   * Workspace operations
   */
  workspace: {
    onFileChanged(callback: (events: FileChangeEvent[]) => void): Disposable
  }

  /**
   * Events
   */
  events: {
    on(event: string, callback: (...args: unknown[]) => void): Disposable
    emit(event: string, ...args: unknown[]): void
  }
}
