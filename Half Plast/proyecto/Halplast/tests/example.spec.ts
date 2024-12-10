import { test, expect } from '@playwright/test';

test.describe('Test basico', () => {

    test('Página principal carga correctamente', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Halplast - Soluciones de Embalaje/); 

        const description = page.locator('meta[name="description"]');
        await expect(description).toHaveAttribute('content', 'Líderes en la producción y distribución de film stretch y soluciones de embalaje de alta calidad.');
        
        const keywords = page.locator('meta[name="keywords"]');
        await expect(keywords).toHaveAttribute('content', 'Halplast, film stretch, embalaje, alta calidad, distribución de embalaje');
    });

    // test('Renderizado dinámico basado en datos funciona', async ({ page }) => {
    //     await page.goto('/cliente/principal/catalogo');
    //     const productList = page.locator('.product-card');
    //     await expect(productList).toHaveCount(5);
    //     await productList.first().click();
    //     const productDetail = page.locator('.product-detail');
    //     await expect(productDetail).toBeVisible();
    // });

});

test.describe('Página de Inicio de Sesión', () => {

    test('Carga correctamente y muestra los elementos necesarios', async ({ page }) => {
        await page.goto('/cliente/login/cliente');

        await expect(page).toHaveTitle(/Halplast - Soluciones de Embalaje/);

        const divPrincipal = page.locator('div#contenidoLoginCompleto');
        await divPrincipal.waitFor({ state: 'visible' });

        const header = page.locator('h2#BienvenidoLogin');
        await expect(header).toHaveText('¡¡Bienvenido nuevamente!!');
    
        const registerButton = page.locator('input[value="Registrarse"]');
        await expect(registerButton).toBeVisible();
    
        const changePasswordButton = page.locator('input[value="Cambiar Contraseña"]');
        await expect(changePasswordButton).toBeVisible();
    
        const emailInput = page.locator('input#correo-test');
        const passwordInput = page.locator('input#password2-1');
        const submitButton = page.locator('button#submitIniciarSesion');
    
        await expect(emailInput).toBeVisible();
        await expect(emailInput).toHaveAttribute('placeholder', 'Correo Completo');
        await expect(passwordInput).toBeVisible();
        await expect(passwordInput).toHaveAttribute('placeholder', 'Contraseña');
        await expect(submitButton).toHaveText('Iniciar Sesión');

        const recaptcha = page.locator('#recaptchaLogin');
        await expect(recaptcha).toBeVisible();
    
        const logo = page.locator('img#imagenLoginIniciarSesion');
        await expect(logo).toBeVisible();

        const backLink = page.locator('p#volverPaginaPrincipalLog');
        await expect(backLink).toBeVisible();

        const backLinkText = await backLink.textContent();
        expect(backLinkText).toBe('Volver a la página principal');
    });
  
    test('El formulario muestra un error si no se completa el reCAPTCHA', async ({ page }) => {
        await page.goto('/cliente/login/cliente', { waitUntil: 'load' });
        await page.waitForTimeout(4000);

        const divPrincipal = page.locator('div#contenidoLoginCompleto');
        await divPrincipal.waitFor({ state: 'visible' });

        const divLoginPrincipal = page.locator('div#longiDivCompleto');
        await divLoginPrincipal.waitFor({ state: 'visible' });

        await page.fill('input#correo-test', 'test@halplast.com');
        await page.fill('input#password2-1', 'Contraseña123');
        await page.click('button#submitIniciarSesion');
    
        const errorMessage = page.locator('#form2 p:has-text("Por favor, completa el reCAPTCHA.")');
        await errorMessage.waitFor({ state: 'visible' });
        await expect(errorMessage).toBeVisible();
    });

});
