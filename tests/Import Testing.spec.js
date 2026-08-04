const { test, expect } = require('@playwright/test');

const ProjectUrl = 'https://qa1-ipc.deloitte.com/ipc/2026/v2/client-selection';
const username = 'ustaxpsgtoscasvc@deloitte.com';
const password = 'WDekq62SNN1%XuBo(yRt';
const clientName = 'QA Automation Global';
const importName = 'Yearly';
const entity = '0218_Entity_Lower';

const singleEntityLevelImport = true;
const multiEntityLevelImport = false;
const entitySelectionType = 'Select an entity...';

test('Yearly Import Download and Upload', async ({ page }) => {

    await page.goto(ProjectUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    const usernameInput = page.locator('input[type="email"], input[name="loginfmt"], input[data-report-event="Signin_Email_Phone_Skype"]').first();
    const submitBtn = page.locator('input[type="submit"], input[data-report-event="Signin_Submit"]').first();

    await expect(usernameInput).toBeVisible({ timeout: 15000 });
    await usernameInput.fill(username);
    await submitBtn.click();

    const passwordInput = page.locator('input[type="password"], input[name="passwd"]').first();
    await expect(passwordInput).toBeVisible({ timeout: 15000 });
    await passwordInput.fill(password);
    await submitBtn.click();

    const bannerCloseBtn = page.locator('button[aria-label="Close"]').first();
    await expect(bannerCloseBtn).toBeVisible({ timeout: 15000 });
    await bannerCloseBtn.click();

    //Client Selection Starts
    await expect(page).toHaveTitle(/.*Client*/);
    const comboBox = page.locator('kendo-dropdownlist[role="combobox"], input[aria-haspopup="listbox"]').first();
    await expect(comboBox).toBeVisible({ timeout: 15000 });
    await comboBox.click();
    await page.waitForTimeout(5000);

    if (!await page.locator(`.k-list-item:has-text("${clientName}")`).count() > 0) {
        await page.locator(`.k-list-item:has-text("${clientName}")`).click();
    }
    else {
        await comboBox.click();
    }

    const continueBtn = page.locator('input[type="submit"], input[name="button"], button:has-text("Continue")').first();
    await expect(continueBtn).toBeVisible({ timeout: 15000 });
    await continueBtn.click();
    await expect(page).toHaveTitle(/.*Dashboard*/);
    //Client Selection Ends
    //Yearly Import Download and Upload Starts
    await page.getByRole('combobox').filter({ hasText: 'Select an import...' }).getByLabel('Select').click();

    await page.waitForTimeout(15000);
    await page.getByRole('searchbox', { name: 'Filter' }).fill(importName);
    await page.getByLabel('Options list').getByText(importName).click();
    await page.getByRole('combobox').filter({ hasText: entitySelectionType }).getByLabel('Select').click();
    await page.locator('xpath=/html/body/app-root/kendo-popup/div/div/div/div/div[1]/div[2]/kendo-textbox/input').click();
    await page.locator('xpath=/html/body/app-root/kendo-popup/div/div/div/div/div[1]/div[2]/kendo-textbox/input').fill(entity);
    await page.waitForTimeout(5000);
    expect(page.getByRole('option')).toContainText(entity);
    // await page.getByRole('option').toContainText(entity).click();
    await page.locator('xpath=/html/body/app-root/kendo-popup/div/div/div/div/div[2]/div[1]/fieldset/div/kendo-listbox/div/div/div/ul').click();
    // await page.getByText(entity).click();
    await page.getByRole('button', { name: 'Close' }).click();

    const DownloadBtn = page.locator('input[type="submit"], input[name="downloadBtn"], button:has-text("Download")').first();
    await expect(DownloadBtn).toBeVisible({ timeout: 15000 });
    await DownloadBtn.click();
    await expect(DownloadBtn).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveTitle(/.*Dashboard*/);



    // await expect(page).toHaveTitle(/.*Dashboard*/);
    // const comboBoxImports = page.locator('app-template-library kendo-dropdownlist[role="combobox"], app-template-library input[aria-haspopup="listbox"]').first();
    // await expect(comboBoxImports).toBeVisible({ timeout: 15000 });
    // await comboBoxImports.click();
    // await page.waitForTimeout(2000); 
    // await comboBoxImports.fill(importName);
    // //apply wait to ensure the dropdown options are loaded before selecting the desired option
    // await page.waitForTimeout(2000); // Wait for 2 seconds to ensure the dropdown options are loaded    
    // await page.locator(`.k-list-item:has-text("${importName}")`).click();
    await page.waitForTimeout(10000); // Wait for 2 seconds to ensure the selection is registered

    //Yearly Import Download and Upload Ends
});
