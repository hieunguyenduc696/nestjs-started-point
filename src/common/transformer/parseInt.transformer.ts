import { Transform, TransformFnParams } from 'class-transformer';

export const ToInteger = () =>
  Transform((params: TransformFnParams) => parseInt(params.value));
