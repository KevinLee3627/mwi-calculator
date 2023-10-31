import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/old/store/store';

export const useAppDispatch: () => AppDispatch = useDispatch;
