const { test, expect, chromium } = require('@playwright/test');
const ProjectUrl = 'https://qa1-ipc.deloitte.com/ipc/2026/v2/client-selection';
const username = 'ustaxpsgtoscasvc@deloitte.com';
const password = 'WDekq62SNN1%XuBo(yRt';
const clientName = 'QA Automation Master-2';




// test.skip('Launch URL and enter username', async () => {
//     const browser = await chromium.launch({ headless: false });
//     const context = await browser.newContext();
//     const page = await context.newPage();

//     //Pass URL
//     await page.goto('https://qa1-ipc.deloitte.com/ipc/2026/v2/client-selection', { waitUntil: 'domcontentloaded' });
//     // await page.goto(url, { waitUntil: 'domcontentloaded' });
//     await page.waitForLoadState('networkidle');

//     //Pass Credentials to login
//     const usernameInput = page.locator('input[type="email"], input[name="loginfmt"], input[data-report-event="Signin_Email_Phone_Skype"]').first();
//     const SubmitBtn = page.locator('input[type="submit"], input[data-report-event="Signin_Submit"]').first();
//     await expect(usernameInput).toBeVisible({ timeout: 15000 });
//     await usernameInput.fill('ustaxpsgtoscasvc@deloitte.com');
//     await expect(page).toHaveTitle(/.*Sign in */);
//     await SubmitBtn.click();
//     const PasswordInput = page.locator('input[type="password"], input[name="passwd"]').first();
//     await expect(PasswordInput).toBeVisible({ timeout: 15000 });
//     await PasswordInput.fill('WDekq62SNN1%XuBo(yRt');
//     const LoginBtn = page.locator('input[type="submit"], input[data-report-event="Signin_Submit"]').first();
//     await expect(LoginBtn).toBeVisible({ timeout: 15000 }); 
//     await LoginBtn.click();

//     //Close Cookie banner
//     const BannerClsBtn = page.locator('button[aria-label="Close"]').first();
//     await expect(BannerClsBtn).toBeVisible({ timeout: 15000 });
//     await BannerClsBtn.click(); 

//     //Client Selection
//     const CLientSelectionDropdown = page.locator('kendo-dropdownlist[role="combobox"], input[aria-haspopup="listbox"]').first();
//     await expect(CLientSelectionDropdown).toBeVisible({ timeout: 15000 });
//     await CLientSelectionDropdown.click();
//     const ClientOption = page.locator('div[role="option"], div[data-bind="text: QA Automation Global"]').first();
//     await expect(ClientOption).toBeVisible({ timeout: 15000 });
//     await ClientOption.click();

//     // await page.locator('xpath=/html/body/div/form[1]/div/div/div[2]/div[1]/div/div/div/div/div/div[3]/div/div/div/div[2]/div[1]/div/div/div[1]/img').click();//('input[type="submit"], input[class="tile-img"], input[role="presentation"], input[data-bind="imgSrc"]');
    
//     //wait for 20 seconds to allow the page to load completely
//     await page.waitForTimeout(20000);

//     // await expect(ImgBtn).toBeVisible({ timeout: 15000 });
//     // await ImgBtn.hover();
//     // aait page.screenshot({ path: 'test-results/username-filled.png', fullPage: true });

// });

test('Login and select QA Automation Global client', async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

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
    await page.locator(`.k-list-item:has-text("${clientName}")`).click();

    const continueBtn = page.locator('input[type="submit"], input[name="button"], button:has-text("Continue")').first();
    await expect(continueBtn).toBeVisible({ timeout: 15000 });
    await continueBtn.click();
    await expect(page).toHaveTitle(/.*dashboard*/);
    //Client Selection Ends



//    await page.waitForTimeout(20000);

});
