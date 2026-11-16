import { TConstructorIngredient } from '@/utils/types';
import constructorReducer, {
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredient,
} from '../constructorSlice';

describe('Тестирование constructorReducer', () => {
  const mockIngredients: TConstructorIngredient[] = [
    {
      id: '1',
      _id: '6acd6b8163765e9acf0bd9ef',
      name: 'Говяжий метеорит (отбивная)',
      type: 'main',
      proteins: 800,
      fat: 800,
      carbohydrates: 300,
      calories: 2674,
      price: 3000,
      image: 'https://norma.ffapi.ru/images/meat-04.png',
      image_mobile: 'https://norma.ffapi.ru/images/meat-04-mobile.png',
      image_large: 'https://norma.ffapi.ru/images/meat-04-large.png',
    } as TConstructorIngredient,
    {
      id: '2',
      _id: '643d69a5c3f7b9001cfa093e',
      name: 'Филе Люминесцентного тетраодонтимформа',
      type: 'main',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/meat-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    } as TConstructorIngredient,
  ];

  let initialState: any;

  beforeEach(() => {
    initialState = {
      bun: null,
      ingredients: [...mockIngredients], 
    };
  });

  it('должен вернуть начальное состояние при неизвестном экшене', () => {
    const result = constructorReducer(undefined, { type: 'UNKNOWN' });

    expect(result).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('должен добавить булку', () => {
    const bun = { _id: '1', name: 'Булка', type: 'bun', price: 100 };
    const action = { type: addIngredient.type, payload: bun };
    const state = constructorReducer(undefined, action);

    expect(state.bun).toEqual(expect.objectContaining({ name: 'Булка' }));
    expect(state.ingredients).toEqual([]);
  });

  it('должен добавить начинку', () => {
    const ingredient = { _id: '1', name: 'Котлета', type: 'sauce', price: 100 };
    const action = { type: addIngredient.type, payload: ingredient };
    const state = constructorReducer(undefined, action);

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(expect.objectContaining({ name: 'Котлета' }));
  });

  it('должен удалить ингредиент по id', () => {
    
    const action = { type: removeIngredient.type, payload: '1' };
    const state = constructorReducer(initialState, action);

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
  });

  it('должен очистить конструктор', () => {
    const action = { type: clearConstructor.type };
    const state = constructorReducer(initialState, action);

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен переместить ингредиент вниз (from < to)', () => {
    const action = moveIngredient({ from: 0, to: 1 });
    const newState = constructorReducer(initialState, action);

    expect(newState.ingredients[0].id).toBe('2');
    expect(newState.ingredients[1].id).toBe('1');

    expect(newState.ingredients).toHaveLength(2);
  });

  it('должен переместить ингредиент вверх (from > to)', () => {

    const action = moveIngredient({ from: 1, to: 0 });
    const newState = constructorReducer(initialState, action);

    expect(newState.ingredients[0].id).toBe('2');
    expect(newState.ingredients[1].id).toBe('1');

    expect(newState.ingredients).toHaveLength(2);
  });
});
