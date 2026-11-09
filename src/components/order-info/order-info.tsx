import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';

import type { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '@/services/store';
import { selectIngredients } from '@/services/slices/ingredientsSlice';
import { useParams } from 'react-router-dom';
import { fetchOrderByNumber, selectSelectedOrder } from '@/services/slices/feedSlice';

export const OrderInfo = (): React.JSX.Element => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const { id } = useParams();
  const dispatch = useDispatch();

  const orderData = useSelector(selectSelectedOrder)
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  useEffect(() => {
    if (id) {
      void dispatch(fetchOrderByNumber(Number(id)));
    }
  }, [dispatch, id]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
