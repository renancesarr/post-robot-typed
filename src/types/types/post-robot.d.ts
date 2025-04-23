declare module '@krakenjs/post-robot' {
  /** Domínio ou padrões de domínio aceitos */
  export type DomainMatcher = string | RegExp | Array<string | RegExp>;

  /** Janelas ou canais suportados pelo post-robot */
  export type CrossDomainTarget = Window | HTMLIFrameElement | MessagePort;

  /** Opções para envio de mensagem */
  export interface SendOptions {
    /** Origem válida para o receptor */
    domain?: DomainMatcher;
    /** Tempo máximo em milissegundos antes de rejeitar a Promise */
    timeout?: number;
    /** Se true, não espera resposta (fire-and-forget) */
    fireAndForget?: boolean;
  }

  /** Evento recebido por handlers registrados */
  export interface ReceivedEvent<T = any> {
    /** Quem enviou (Window, IFrame ou MessagePort) */
    source: CrossDomainTarget;
    /** Domain (origin) da mensagem */
    origin: string;
    /** Nome do canal usado */
    name: string;
    /** Payload enviado */
    data: T;
  }

  /** Retorno de on/once para cancelar o listener */
  export interface Cancelable {
    cancel(): void;
  }

  /** Handler que processa um ReceivedEvent */
  export type Handler<T = any> =
    (event: ReceivedEvent<T>) => void | Promise<any>;

  /** API principal exposta pelo módulo */
  export interface PostRobot {
    /**
     * Dispara uma mensagem para outro contexto.
     * @returns Promise que resolve quando o receptor responde, ou rejeita em timeout.
     */
    send<T = any, R = any>(
      target: CrossDomainTarget,
      name: string,
      data?: T,
      options?: SendOptions
    ): Promise<ReceivedEvent<R>>;

    /**
     * Registra um listener permanente.
     * Retorna objeto com `cancel()` para remoção manual.
     */
    on<T = any>(
      name: string,
      handler: Handler<T>
    ): Cancelable;

    /**
     * Registra um listener com configurações extras:
     * - once: dispara só uma vez
     * - errorHandler: callback para erros internos
     * - domain/window customizados
     */
    on<T = any>(
      name: string,
      options: {
        handler: Handler<T>;
        domain?: DomainMatcher;
        window?: CrossDomainTarget;
        once?: boolean;
        errorHandler?: (err: any) => void;
        errorOnClose?: boolean;
      }
    ): Cancelable;

    /**
     * Registra um listener que é automaticamente cancelado após o primeiro disparo.
     * @returns Promise que resolve com o evento.
     */
    once<T = any>(
      name: string,
      handler: Handler<T>
    ): Promise<ReceivedEvent<T>>;
  }

  /** Default export */
  const postRobot: PostRobot;
  export default postRobot;
}
