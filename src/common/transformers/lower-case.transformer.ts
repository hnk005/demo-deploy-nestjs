import { MaybeType } from '@/constants/maybe.type.js';
import { TransformFnParams } from 'class-transformer';

export const lowerCaseTransformer = (
  params: TransformFnParams,
): MaybeType<string> => params.value?.toLowerCase().trim();
