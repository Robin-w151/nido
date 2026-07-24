import type { RemoteForm } from '@sveltejs/kit';

export type EnhanceFormParameter<TRemoteForm> =
  TRemoteForm extends RemoteForm<infer _TInput, infer _TOutput>
    ? Parameters<Parameters<TRemoteForm['enhance']>[0]>[0]
    : never;
