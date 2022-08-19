import { Transform, TransformFnParams } from 'class-transformer';

export const ToFloat = () =>
  Transform((params: TransformFnParams) => parseFloat(params.value));
