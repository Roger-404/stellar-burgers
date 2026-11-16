import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';

describe('Тестирование ingredientsSlice', () => {
  it('должен вернуть начальное состояние при неизвестном экшене', () => {
    const result = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(result).toEqual({
      ingredients: [],
      isLoading: false,
      error: null,
    });
  });
  it('должен обработать fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(undefined, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обработать fetchIngredients.fulfilled', () => {
    const mockIngredients = [{ _id: '1', name: 'Булка', type: 'bun', price: 100 }];
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients,
    };
    const state = ingredientsReducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('должен обработать fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка сети' },
    };
    const state = ingredientsReducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.error?.message).toBe('Ошибка сети');
  });
});