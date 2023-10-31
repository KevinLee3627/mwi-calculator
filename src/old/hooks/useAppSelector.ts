import { type TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from 'src/old/store/store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
