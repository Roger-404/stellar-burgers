import { test, expect } from '@playwright/test';


test.describe('add ingredients to constructor works correctly', function () {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
    });
  });

  test('Добавление ингридиента', async ({ page }) => {
    await page.goto('/');

    const bunCard = page.getByTestId('ingredient-card').filter({ hasText: 'Краторная булка N-200i' });
    await bunCard.getByRole('button').click();

    const upperBunText = page.getByTestId('burger-constructor').getByText('Краторная булка N-200i (верх)');
    const lowerBunText = page.getByTestId('burger-constructor').getByText('Краторная булка N-200i (низ)');
    await expect(upperBunText).toHaveText('Краторная булка N-200i (верх)');
    await expect(lowerBunText).toHaveText('Краторная булка N-200i (низ)');

    await expect(bunCard.locator('.counter')).toHaveText('2');
  });

  test('Работа модального окна ингридиента', async ({ page }) => {
    await page.goto('/');

    await page.getByText('Краторная булка N-200i').click();

    const modal = page.locator('#modals').getByText('Детали ингредиента');
    await expect(modal).toBeVisible();

    await expect(
      page.locator('#modals').getByText('Краторная булка N-200i', { exact: true })
    ).toBeVisible();

    await page.getByLabel('Закрыть').click();

    await expect(modal).toBeHidden();
  });

  test('Создание заказа', async ({ page, context }) => {
    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false,
    });

    await page.routeFromHAR('tests/hars/orders.har', {
      url: '**/api/orders',
      update: false,
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'super-secret-auth-token',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-token');
    });

    await page.goto('/');

    await page
      .getByTestId('ingredient-card')
      .filter({ hasText: 'Краторная булка N-200i' })
      .getByRole('button')
      .click();
    await page
      .getByTestId('ingredient-card')
      .filter({ hasText: 'Говяжий метеорит (отбивная)' })
      .getByRole('button')
      .click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.locator('#modals').getByText('идентификатор заказа');
    await expect(modal).toBeVisible();
    await expect(page.getByText('1017')).toBeVisible();

    await page.getByLabel('Закрыть').click();
    await expect(modal).toBeHidden();

    await expect(page.getByTestId('burger-constructor').getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByTestId('burger-constructor').getByText('Выберите начинку')).toBeVisible();
  });

  test('Закрытие по оверлею', async ({ page }) => {
    await page.goto('/');

    await page.getByText('Краторная булка N-200i').click();
    const modal = page.getByText('Детали ингредиента');
    await expect(modal).toBeVisible();

    await page.getByTestId('modal-overlay').click({
      position: { x: 1, y: 1 },
      force: true,
    });

    await expect(modal).toBeHidden();
  });
});
