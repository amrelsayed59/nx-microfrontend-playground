import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

/**
 * Typed versions of the React-Redux hooks. Use these throughout the app
 * instead of the plain `useDispatch` / `useSelector` so state and dispatch
 * are fully typed with no `any`.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
