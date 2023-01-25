import { test, expect } from '../../../../../tests/utils/_astro-fixtures'

test.describe('Radio', () => {
    test.use({ component: 'rux-radio' })

    test('has no visual regression @vrt', async ({ astroVRTPage }) => {
        await expect(astroVRTPage).toHaveScreenshot()
    })
})
