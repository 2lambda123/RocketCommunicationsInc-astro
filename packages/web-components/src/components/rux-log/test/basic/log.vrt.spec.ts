import { test, expect } from '../../../../../tests/utils/_astro-fixtures'

test.describe('Log', () => {
    test('has no visual regression @vrt', async ({ astroVRTPage, page }) => {
        await astroVRTPage.goto('components/rux-log/test/basic')
        await expect(page).toHaveScreenshot()
    })
})